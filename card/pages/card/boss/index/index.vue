<template>
	<view>
		
		<view class="setTab-box-view">
			<view class="swiper-tab">
				<button @click="changeTabBar(item)" v-for="(item, index) in tabBarList" :key="index" :class="'swiper-tab-list ' + (currentTabBar == item.type ? 'active' : '')"  hoverClass="none">
					{{item.name?item.name:item}}
				</button>
			</view>
		</view>
		<view  class="setTab-box-view"  v-if="currentTabBar=='toOverview'">
			<view class="swiper-tab-curr">
				<button @click="selectItemTime(index)" v-for="(item, index) in tabList" :key="index" :class="'swiper-tab-curr-list ' + (currentIndex==index?'active':'')" :data-index="index" :data-status="item.status" :data-type="item.type" formType="submit" hoverClass="none">
					{{item.name?item.name:item}}
				</button>
			</view>
		</view>
		<block v-if="currentTabBar=='toOverview'">
			<view class="boss-index-sec-1">
				<view class="child">
					<view class="title">新增客户数</view>
					<view class="number ellipsis active">{{nine.new_client}}
						</view>
				</view>
				<view class="child">
					<view class="title">浏览客户数</view>
					<view class="number ellipsis active">{{nine.view_client}}
						</view>
				</view>
				<view class="child">
					<view class="title">跟进客户数</view>
					<view class="number ellipsis">{{nine.mark_client}}</view>
				</view>
				<view class="child">
					<view class="title">被转发次数</view>
					<view class="number ellipsis">{{nine.share_count}}</view>
				</view>
				<view class="child">
					<view class="title">被保存次数</view>
					<view class="number ellipsis">{{nine.save_count}}</view>
				</view>
				<view class="child">
					<view class="title">被点赞次数</view>
					<view class="number ellipsis">{{nine.thumbs_count}}</view>
				</view>
			</view>
			
			<view class="boss-echart-sec">
				<view class="title tc">成交率漏斗</view>
				<view class="echart-sec rel">
					<view class="container">
						<canvas canvas-id="canvasFunnel" id="canvasFunnel" class="charts" :width="cWidth*pixelRatio" :height="cHeight*pixelRatio" :style="{'width':cWidth+'px','height':cHeight+'px'}" @touchstart="touchFunnel"></canvas>
					</view>
				</view>
			</view>
		</block>
		
			<scroll-view  scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			@scrolltolower="scrolltolowerFunc">
			<block v-if="currentTabBar=='toRank'">
				<view class="boss-index-sec-2" style="margin-top:10rpx;">
					<view class="spread-count-list-sec" style="border-top:1rpx solid #f2f2f2;">
						<view v-for="(item, index) in dataList" :key="index" @click="toJumpCustom(item)" class="child rel">
							<i class="abs">{{index*1+1}}</i>
							<image class="abs circle" mode="aspectFill" :src="item.avatar_image?item.avatar_image:defaultUserImg"></image>
							<view class="content">
								<view class="flex">
									<view class="flex100-7 ellipsis" style="flex:0 0 50%;">{{item.name?item.name:item.name}}</view>
									<!-- <view :class="'flex100-3 tr ellipsis ' + (currentRank==1?'rank2class':'')" style="flex:0 0 50%;">
									   
									</view> -->
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="page">
					<view class="loadmore" v-if="loading">
						<view class="loading"></view>
						<view class="loadmore_tips">正在加载</view>
					</view>
					<view v-else>
						<view class="loadmore loadmore_line" v-if="page>=last_page&&dataList.length>0">
							<view class="loadmore_tips loadmore_tips_in-line">没有更多数据了</view>
						</view>
						<view class="loadmore loadmore_line" v-if="dataList.length<=0">
							<view class="loadmore_tips loadmore_tips_in-line">没有找到数据</view>
						</view>
					</view>
				</view>
			</block>
			<block v-if="currentTabBar=='toManager'" >
				<view class="cell-list b-1px-tb" v-if="canInviter==true">
				    <view @click="gotoInvite" class="cell">
				        <image class="icon-lg" src="/static/add.png"></image>
				        <view >邀请用户</view>
				    </view>
				</view>
				<view class="boss-index-sec-2" style="margin-top:10rpx;">
					<view class="spread-count-list-sec" style="border-top:1rpx solid #f2f2f2;">
						<view v-for="(item, index) in managerList" :key="index" @click="toManagerCustom(item)" class="child rel">
							<image class="abs circle" mode="aspectFill" :src="item.avatar_image?item.avatar_image:defaultUserImg"></image>
							<view class="content">
								<view class="flex">
									<view class="flex100-7 ellipsis" style="flex:0 0 50%;">{{item.name?item.name:item.name}}</view>
									<!-- <view :class="'flex100-3 tr ellipsis ' + (currentRank==1?'rank2class':'')" style="flex:0 0 50%;">
									   
									</view> -->
								</view>
							</view>
						</view>
					</view>
				</view>
				
				<view class="page">
					<view class="loadmore" v-if="loading">
						<view class="loading"></view>
						<view class="loadmore_tips">正在加载</view>
					</view>
					<view v-else>
						<view class="loadmore loadmore_line" v-if="page>=last_page&&dataList.length>0">
							<view class="loadmore_tips loadmore_tips_in-line">没有更多数据了</view>
						</view>
						<view class="loadmore loadmore_line" v-if="dataList.length<=0">
							<view class="loadmore_tips loadmore_tips_in-line">没有找到数据</view>
						</view>
					</view>
				</view>
			</block>
		</scroll-view>
		</block>
		
		<manager :isbottmpanel="isbottmpanel" :card_id="current_card_id" @close="closeBottmpanel"></manager>
	</view>
</template>

<script>
	import manager from './popup/manager.vue';
	import uCharts from 'card/u-charts/u-charts.min.js';
	var _self;
	var canvaFunnel=null;
	export default {
		components: {
			manager
		},
		data() {
			return {
				tabBarList: [ {
					status: "toTabBar",
					type: "toOverview",
					name: "总览"
				}, {
					status: "toTabBar",
					type: "toRank",
					name: "团队"
				},{
					status: "toTabBar",
					type: "toManager",
					name: "管理"
				}],
				currentTabBar:'toOverview',
				currentIndex:0,
				tabList: [ {
					status: "toSetTab",
					time:0,
					name: "汇总"
				}, {
					status: "toSetTab",
					time:-1,
					name: "昨天"
				}, {
					status: "toSetTab",
					time:-7,
					name: "近7天"
				}, {
					status: "toSetTab",
					time:-30,
					name: "近30天"
				} ],
				nine: {
					new_client: 0,
					view_client: 0,
					mark_client: 0,
					share_count: 0,
					save_count: 0,
					thumbs_count: 0
				},
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				textarea:'',
				currentIndex: 0,
				currentRank: 0,
				is_more: 1,
				dataList:[],
				managerList:[],
				page:1,
				last_page:0,
				time:0,
				defaultUserImg:'',
				scrollviewHigh:'',
				loading:!1,
				/*是否弹窗*/
				isbottmpanel: false,
				current_card_id:0,
				canInviter:false,
				supply_id:0,
			}
			
		},
		onLoad() {
			_self = this;
			this.init();
			this.cWidth=uni.upx2px(750);
			this.cHeight=uni.upx2px(500);
			this.getOverView();
		},
		methods: {
			init(){
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
					}
				});
			},
			/* 总览数据 */
			getOverView(){
				let self = this;
				self._get('plus.card.boss/index',{
					time:self.time,
				},function(res){
					if(res.code==3){
						uni.showToast({
							title:res.msg
						});
						
						self.gotoPage('/pages/user/index/index');
						return false
					}
					let Funnel={series:[]};
					//这里我后台返回的是数组，所以用等于，如果您后台返回的是单条数据，需要push进去
					Funnel.series = res.data.pie.series;
					_self.textarea = JSON.stringify(res.data.pie);
					
					_self.showFunnel("canvasFunnel",Funnel);
					self.nine = res.data.nine;
				})
			},
			/* 获取团队数据 */
			getTeamData(){
				let self = this;
				self._get('plus.card.boss/team',{
					page:self.page
				},function(res){
					self.dataList = self.dataList.concat(res.data.teamList.data)
					self.last_page = res.data.teamList.last_page;
				})
			},
			/* 管理名片 */
			getManagerData(){
				let self = this;
				self._get('plus.card.boss/manager',{
					page:self.page
				},function(res){
					self.canInviter = res.data.canInviter;
					self.supply_id = res.data.supply_id;
					self.managerList = self.managerList.concat(res.data.managerList.data)
					self.last_page = res.data.managerList.last_page;
				})
			},
			/* 切换 */
			changeTabBar(e){
				this.currentTabBar = e.type;
				if(e.type=='toRank'){
					this.dataList = [];
					this.page = 1;
					this.getTeamData();
				}
				if(e.type=='toManager'){
					this.dataList = [];
					this.page = 1;
					this.getManagerData();
				}
			},
			/* 选择时间 */
			selectItemTime(index){
				this.currentIndex = index;
				this.time =  this.tabList[this.currentIndex].time
				this.getOverView();
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
			/* 跳转团队 */
			toJumpCustom(item){
				let to_user_id = item.user_id;
				let path  =  '/card/pages/card/boss/client/client?to_user_id='+to_user_id;
				this.gotoPage(path)
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				let self = this;
				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					return;
				}
				self.getTeamData();
			},
			toManagerCustom(item){
				let self = this;
				self.isbottmpanel = true;
				self.current_card_id = item.card_id
			},
			/*关闭弹窗*/
			closeBottmpanel() {
				let self = this;
				self.isbottmpanel = false;
				self.page=1
				self.managerList = [];
				self.getManagerData();
			},
			/* 邀请用户 */
			gotoInvite(){
				let supply_id = self.supply_id;
				let path = '/card/pages/card/boss/inviter/inviter?supply_id='+supply_id;
				console.log(path);
				this.gotoPage(path);
			}
		}
	}
</script>

<style>
	button {
	    background: none;
	}
	.circle {
	    border-radius: 50%;
	}
	.abs {
	    position: absolute;
	}
	.boss-index-sec-1 {
	    width: 94%;
	    height: auto;
	    background: white;
	    margin-top: 12rpx;
	    display: inline-block;
	    padding: 0rpx 3% 30rpx 3%;
	}
	
	.boss-index-sec-1 .child {
	    width: 31%;
	    height: 210rpx;
	    display: block;
	    text-align: center;
	    float: left;
	    border: 1px solid #efeff4;
	    margin-top: 17rpx;
	}
	
	.boss-index-sec-1 .child:nth-child(3n-1) {
	    margin: 17rpx 2.5% 0rpx 2.5%;
	}
	
	.boss-index-sec-1 .child .title {
	    font-size: 24rpx;
	    line-height: 30rpx;
	    color: #969696;
	    padding-top: 60rpx;
	}
	
	.boss-index-sec-1 .child .number {
	    font-size: 40rpx;
	    line-height: 80rpx;
	}
	
	.boss-index-sec-1 .child .number .contrast {
	    font-size: 24rpx;
	    line-height: 26rpx;
	}
	
	.boss-index-sec-1 .child .number .contrast.not {
	    color: #282828;
	}
	
	.boss-index-sec-1 .child .active {
	    color: #e93636;
	}
	
	.boss-echart-sec {
	    width: 100%;
	    height: auto;
	    display: block;
	    background: white;
	    margin-top: 20rpx;
	    padding: 30rpx 0rpx;
	}
	
	.boss-echart-sec .title {
	    color: #2d2d2d;
	    font-size: 30rpx;
	    height: 60rpx;
	    line-height: 60rpx;
	}
	.setTab-box-view {
	    width: 90%;
	    padding: 0rpx 5%;
	    height: auto;
	    background: white;
	    z-index: 99999;
	    display: block;
	    border-bottom: 1rpx solid #eee;
	}
	.swiper-tab {
	    width: 100%;
	    height: auto;
	    text-align: center;
	    display: flex;
	    justify-content: space-between;
	    flex-wrap: wrap;
	    background: #fff;
	}
	
	.swiper-tab-curr {
	    width: 98%;
	    padding: 15rpx 1%;
	    display: inline-block;
	}
	
	.swiper-tab-list {
	    font-size: 32rpx;
	    color: #646464;
	    padding: 0 20rpx;
		width: 33.3%;
	    height: 100rpx;
	    line-height: 100rpx;
	    position: relative;
	}
	
	.swiper-tab-curr-list {
	    font-size: 26rpx;
	    color: #646464;
	    height: 50rpx;
	    line-height: 48rpx;
	    display: block;
	    align-items: center;
	    justify-content: center;
	    border: 1rpx solid #cecece;
	}
	
	.setTab-box-view .swiper-tab-list.active {
	    color: #e93636;
	}
	
	.setTab-box-view .swiper-tab-list.active::before {
	    content: '';
	    position: absolute;
	    bottom: 0rpx;
	    left: 50%;
	    margin-left: -30rpx;
	    width: 60rpx;
	    height: 5rpx;
	    background: #e93636;
	}
	
	.setTab-box-view .swiper-tab-curr-list.active {
	    color: #e93636;
	    border: 1rpx solid #e93636;
	}
	page {
	    background: #f4f4f8;
	}
	
	.common-footer .tab-view {
	    width: 33%;
	}
	
	.setTab-box-view {
	    width: 100%;
	    padding: 0rpx;
	}
	
	.swiper-tab-list {
	    color: #333;
	}
	
	.swiper-tab-curr {
	    margin: 0rpx auto;
	    text-align: center;
	}
	
	.swiper-tab-curr .swiper-tab-curr-list {
	    padding: 0rpx 26rpx;
	    width: auto;
	    display: inline-block;
	    margin-left: 65rpx;
	}
	
	.swiper-tab-curr .swiper-tab-curr-list:nth-child(1) {
	    margin-left: 0rpx;
	}
	.boss-index-sec-2 .spread-count-list-sec .child .rank-img {
	    width: 76rpx;
	    height: 76rpx;
	    display: block;
	    border: 2rpx solid #c9936c;
	}
	
	.boss-index-sec-2 .spread-count-list-sec .child .rank-content .flex .flex100-7 view {
	    height: 40rpx;
	    line-height: 40rpx;
	}
	
	.boss-index-sec-2 .spread-count-list-sec .child .rank-content .flex .flex100-7 .rank {
	    font-size: 24rpx;
	    color: #989898;
	}
	
	.boss-index-sec-2 .spread-count-list-sec .child .content .flex {
	    height: 80rpx;
	    line-height: 80rpx;
	}
	
	.boss-index-sec-2 .spread-count-list-sec .child .content .flex .flex100-7 {
	    font-size: 30rpx;
	    color: #303030;
	}
	
	.boss-index-sec-2 .spread-count-list-sec .child .content .flex .tr {
	    font-size: 36rpx;
	    color: #e93636;
	}
	
	.boss-index-sec-2 .spread-count-list-sec .child .content .flex .tr.rank2class {
	    font-size: 30rpx;
	    color: #3d3d3d;
	}
	.spread-count-list-sec {
	    width: 100%;
	    height: auto;
	    display: block;
	    background: white;
	}
	
	.spread-count-list-sec .child {
	    width: 97%;
	    height: 80rpx;
	    margin-left: 3%;
	    padding: 20rpx 0rpx;
	}
	.spread-count-list-sec .child image {
	    width: 80rpx;
	    height: 80rpx;
	    display: block;
	    left: 80rpx;
	}
	
	.spread-count-list-sec .child .content {
	    margin: 0rpx 4% 0rpx 180rpx;
	    height: 80rpx;
	    padding-bottom: 20rpx;
	    border-bottom: 1rpx solid #f2f2f2;
	}
	
	.spread-count-list-sec .child:nth-last-child(1) .content {
	    border: transparent;
	}
	
	.spread-count-list-sec .child .content .flex {
	    width: auto;
	    padding: 0rpx;
	    height: auto;
	    line-height: 40rpx;
	    margin-top: 5rpx;
	}
	
	.spread-count-list-sec .child .content .flex .flex100-5 {
	    font-size: 28rpx;
	    color: #323232;
	}
	
	.spread-count-list-sec .child .content .flex .tr {
	    font-size: 22rpx;
	    color: #c5c5c5;
	}
	
	.spread-count-list-sec .child .content .more {
	    font-size: 22rpx;
	    color: #999999;
	}
	.loadmore {
	    width: 65%;
	    margin: 1.5em auto;
	    line-height: 1.6em;
	    font-size: 14px;
	    text-align: center;
	}
	
	.loadmore_tips {
	    display: inline-block;
	    vertical-align: middle;
	}
	
	.loadmore_line {
	    border-top: 1px solid #e5e5e5;
	    margin-top: 2.4em;
	}
	
	.loadmore_tips_in-line {
	    position: relative;
	    top: -0.9em;
	    padding: 0 0.55em;
	    background-color: #fff;
	    color: #999;
	}
	.b-1px, .b-1px-t, .b-1px-b, .b-1px-tb, .b-1px-l, .b-1px-r {
	    position: relative;
	}
	.cell-list {
	    background: #fff;
	    padding: 0 32rpx;
	}
	
	.cell {
	    display: flex;
	    align-items: center;
	    min-height: 90rpx;
	    background: #fff;
	}
	.icon-lg {
	    width: 50rpx;
	    height: 50rpx;
	    display: block;
	}
	
</style>
