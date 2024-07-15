<template>
	<view>
		<view class="custom-search-sec">
		    <view @click="searchclick" class="tc">
		        <i class="iconfont2 icon-sousuo mr-10" style="display: inline-block;"></i>
				<view style="display: inline-block;">搜索客户/标签</view>
			</view>
		</view>
		<view class="echarts">
		    <canvas canvas-id="canvasFunnel" id="canvasFunnel" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchFunnel"></canvas>
		</view>
		<view class="message-sec custom-sec" style="margin-bottom:20rpx;border-top:1rpx solid #ededed;">
		    <view class="child rel" @click="toJumpUrl('tag')" >
		        <image class="abs br-10" mode="aspectFill" src="https://retail.xiaochengxucms.com/images/12/2018/11/EN75eed5DLwxGLlqDjqOx515Wx77eG.png"></image>
		        <view class="content">
		            <view class="flex" style="line-height:70rpx;">
		                <view class="flex100-5 ellipsis">标签栏目</view>
		                <view class="flex100-5 ellipsis tr" style="font-size:24rpx;">共{{tagsCount}}个标签</view>
		            </view>
		        </view>
		    </view>
		    <view class="child rel" @click="toJumpUrl('star')">
		        <image class="abs br-10" mode="aspectFill" src="https://retail.xiaochengxucms.com/images/12/2018/11/a2fPOjVpczPC8v8Xn8228e8y288x22.png"></image>
		        <view class="content">
		            <view class="flex" style="line-height:70rpx;">
		                <view class="flex100-5 ellipsis">星标客户</view>
		                <view class="flex100-5 ellipsis tr" style="font-size:24rpx;">共{{starCount}}位客户</view>
		            </view>
		        </view>
		    </view>
		</view>
		
		<view class="setTab-box-view" >
			<view class="swiper-tab">
				<button v-for="(item, index) in tabList" :key="index" :class="'swiper-tab-list ' + (currentTabBar == item.type ? 'active' : '')" @click="changeCustom(item)" hoverClass="none">
				{{item.name?item.name:item}}
			
				</button>
			</view>
		</view>

		<scroll-view  scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
		@scrolltolower="scrolltolowerFunc">
		<view class="message-sec custom-sec custom-sec2">
		    <view v-for="(item, index) in dataList" :key="index" class="child rel" @click="toJumpCustomer(item)">
		        <image class="abs br-10" mode="aspectFill" :src="item.person_avatar||defaultUserImg"></image>
		        <view class="content">
		            <view class="flex">
		                <view class="flex100-5 ellipsis" style="flex: 0 0 50%;">
		                    <text class="iconfont2 icon-shouji" v-if="item.tel"></text>
							<text>{{item.nick_name}}</text>
							<text class="iconfont2 icon-xingji" v-if="item.star==1"></text>
		                </view>
		                <view class="flex100-5 tr" style="flex: 0 0 50%;">{{item.create_time}}</view>
		            </view>
		            <view class="text ellipsis flex">
		                <view class="flex100-5">{{item.count}}次互动</view>
		                <view class="flex100-5 tr" style="color:#ff9000;" v-if="item.status==1">新增加</view>
						<view class="flex100-5 tr" style="color:#ff9000;" v-if="item.status==2">跟进中</view>
		                <view class="flex100-5 tr" style="color:#fc1111;" v-if="item.status==3">已成交</view>
		            </view>
		        </view>
	
		    </view>
		</view>

		<view class="page">
			<view class="loadmore" v-if="loadding">
				<view class="loading"></view>
				<view class="loadmore_tips">正在加载</view>
			</view>
			<block v-else>
				<view class="loadmore loadmore_line" v-if="pages>=total_page&&dataList.length>0">
					<view class="loadmore_tips loadmore_tips_in-line">没有更多数据了</view>
				</view>
				<view class="loadmore loadmore_line" v-if="dataList.length<=0">
					<view class="loadmore_tips loadmore_tips_in-line">没有找到数据</view>
				</view>
			</block>
		</view>
		</scroll-view>	
	
		<view class="vague" v-if="Record"></view>
		<view class="addsRecord" v-if="Record">
		    <view class="Record_top">
		        <view class="Record_top_left">
		            <i class="iconfont2 icon-sousuo1" style="padding:0 10rpx;"></i>
		            <input @blur="Record_blurFun"  placeholder="搜索名称" v-model="keywords"></input>
		        </view>
		        <text @click="searchover" style="padding:0 20rpx;">取消</text>
		    </view>
			<view class="message-sec custom-sec" v-if="Record_list">
				<view v-for="(item, index) in Record_list" :key="index" class="child rel" @click="toJumpCustomer(item)">
					<image class="abs br-10" mode="aspectFill" :src="item.person_avatar||defaultUserImg"></image>
					<view class="content">
						<view class="flex">
							<view class="flex100-5">
								<i class="iconfont2 icon-shouji" style="color:#c0c0c0;font-size:28rpx;" v-if="item.tel"></i>{{item.name?item.name:'新客户'}}</view>
						</view>
						<view class="text ellipsis flex">
							<view class="flex100-5">{{item.count}}次互动</view>
							<view class="flex100-5 tr" style="color:#ff9000;" v-if="item.status==1">新增加</view>
							<view class="flex100-5 tr" style="color:#ff9000;" v-if="item.status==2">跟进中</view>
							<view class="flex100-5 tr" style="color:#fc1111;" v-if="item.status==3">已成交</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<Radarbar></Radarbar>
	</view>
</template>

<script>
	import Radarbar from '@/components/radarbar/radarbar.vue';
	import uCharts from 'card/u-charts/u-charts.min.js';
	var _self;
	var canvaFunnel=null;
	export default {
		components:{
			Radarbar
		},
		data() {
			return {
				Unchanged: [],
				avatarUrl: "",
				old: [],
				tabList: [{
				  status: 1,
				  type: "customer",
				  name: "新增客户"
				}, {
				  status: 2,
				  type: "follow",
				  name: "跟进中"
				}, {
				  status: 3,
				  type: "deal",
				  name: "已成交"
				}],
				currentIndex: 0,
				currentTabBar: "customer",
				lists: [],
				pages: 1,
				total_page: "",
				typeindex: 1,
				Record: !1,
				Record_label: "0",
				Record_blur: "0",
				Record_input_value: "",
				Record_list: [],
				more: !0,
				loading: !1,
				show: !1,
				dataList: [],
				isIphoneX: "",
				defaultUserImg: "",
				touch_time: "",
				onPullDownRefresh: "",
				turnoverRateTotal: "",
				moreSearch: "",
				isEmptySearch: "",
				showSearch: "",
				touch_type_time: "",
				touch_start: "",
				touch_end: "",
				longTypeInd: "",
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				textarea:'',
				status:1,
				keywords:"",
				tagsCount:0,
				starCount:0,
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				fromstatus:''
			}
		},
		onLoad() {
			_self = this;
			this.init();
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.getServerData();
		},
		methods: {
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
					}
				});
			},
			/* 获取信息 */
			getServerData(){
				
				var self = this;
				self.loadding = true;
				uni.showLoading({
					title:"加载中",
				});
				let pages = self.pages;
				self._get('plus.card.client/getClientList',
					{
						page: pages || 1,
						status:self.status,
						keywords:self.keywords
					},function(res) {
						
						let Funnel={series:[]};
						Funnel.series = res.data.Pie.series;
						_self.textarea = JSON.stringify(res.data.Pie);
						_self.showFunnel("canvasFunnel",Funnel);
						_self.dataList = self.dataList.concat(res.data.list.data);
						_self.total_page = res.data.list.last_page;
						_self.tagsCount = res.data.tagsCount;
						_self.starCount = res.data.starCount;
						self.loadding = false;
						uni.hideLoading();
					});
			},
			showFunnel(canvasId,chartData){
				canvaFunnel=new uCharts({
					$this:_self,
					canvasId: canvasId,
					type: 'funnel',
					fontSize:11,
					padding:[15,15,0,15],
					legend:{
						show:true,
						padding:5,
						lineHeight:11,
						margin:0,
					},
					background:'#FFFFFF',
					pixelRatio:_self.pixelRatio,
					series: chartData.series,
					animation: true,
					width: _self.cWidth*_self.pixelRatio,
					height: _self.cHeight*_self.pixelRatio,
					dataLabel: true,
					extra: {
						funnel: {
							border:true,
							borderWidth:2,
							borderColor:'#FFFFFF'
						}
					},
				});
			},
			touchFunnel(e){
				canvaFunnel.showToolTip(e, {
					format: function (item) {
						return item.name + ':' + item.data 
					}
				});
				canvaFunnel.touchLegend(e,{animation:true});
			},
			changeCustom(e){
				this.status = e.status;
				this.currentTabBar = e.type;
				this.page = 1;
				this.dataList = [];
				this.getServerData();
			},
			searchclick(){
				this.Record = true;
				this.Record_label = true;
			},
			searchover(){
				this.Record = false;
			},
			Record_blurFun(){
				this.getRecordData();
			},
			/* 搜索 */
			getRecordData(){
				var self = this;
				self.loadding = true;
				let pages = self.pages;
				self._get('plus.card.client/getRecordtList',
					{
						page: pages || 1,
						keywords:self.keywords
					},function(res) {
						_self.Record_list = res.data.list.data;
						_self.total_page = res.data.list.total
						self.loadding = false;
						console.log(_self.Record_list);
						uni.hideLoading();
					});
			},
			/* 跳转链接 */
			toJumpUrl(type)
			{	
				let path = ''
				if(type=='tag'){
					path = '/card/pages/card/staff/mytags/mytags';
				}else if(type=='star'){
					path = '/card/pages/card/staff/mytags/star';
				}
				this.gotoPage(path);
			},
			/* 跳转链接 */
			toJumpCustomer(e)
			{	
				let fromstatus = uni.getStorageSync('fromstatus');
				let path = '';
				path = '/card/pages/card/staff/custom/detail?client_id='+e.radar_client_id+"&fromstatus="+fromstatus;
				
				this.gotoPage(path);
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				let self = this;
				self.page++;
				self.loading = true;
				if (self.page > self.total_page) {
					self.loading = false;
					return;
				}
				self.getServerData();
			},
		}
	}
</script>

<style>
	@import "/card/statics/card.css";
	page {
	    background: #f4f4f8;
	}
	
	view,button {
	    display: block;
	    overflow: initial;
	}
	.vague {
	    position: fixed;
	    background: #6b6b6b;
	    width: 100%;
	    height: 100%;
	    top: 0;
	    left: 0;
	    bottom: 0;
	    right: 0;
	    z-index: 99;
	    opacity: 0.6;
	}
	
	.addsRecord {
	    width: 750rpx;
	    height: 100%;
	    z-index: 999;
	    position: fixed;
	    background: #fff;
	    top: 0;
	    left: 0;
	    bottom: 0;
	    right: 0;
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    font-size: 26rpx;
	}
	.Record_top {
	    width: 750rpx;
	    height: 100rpx;
	    background: #f4f4f8;
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	}
	
	.Record_top_left {
	    margin-left: 20rpx;
	    display: flex;
	    flex: 1;
	    align-items: center;
	    background: #fff;
	    height: 60rpx;
	    line-height: 60rpx;
	}
	
	.Record_top_left i {
	    font-size: 38rpx;
	    margin-left: 10rpx;
	}
	
	.Record_top_left input {
	    width: 80%;
	    height: 60rpx;
	    line-height: 60rpx;
	    display: block;
	}
	.message-sec.custom-sec2 .child {
	    height: auto;
	    padding-bottom: 0rpx;
	}
	
	.message-sec.custom-sec2 .child .content {
	    height: auto;
	    padding-bottom: 25rpx;
	}
	
	.message-sec.custom-sec2 .child .content .flex {
	    margin-top: 0rpx;
	}
	
	.message-sec.custom-sec2 .child .content .source {
	    font-size: 26rpx;
	    color: #969696;
	    height: 30rpx;
	    line-height: 30rpx;
	}
</style>
