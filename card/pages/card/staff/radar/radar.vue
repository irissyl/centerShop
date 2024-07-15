<template>
	<view>
		<view class="setTab-box-view">
			<view class="swiper-tab">
			    <button @click="changeTab(item,index1)" v-for="(item, index1) in tabList" :key="index1" :class="'swiper-tab-list ' + (currentIndex==index1?'active':'')">
					{{item.name?item.name:item}}
			   </button>
			</view>
		</view>
		<block v-if="currentTab=='time'">
			<scroll-view  scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			@scrolltolower="scrolltolowerFunc">
		    <view class="radar-new-sec" v-if="viewList.list.length>0">
		        <view v-for="(item1, index1) in viewList.list" :key="index1" class="child">
		            <view class="time" v-if="index1==0||item1.date!=viewList.list[index1-1].date">{{item1.date}}</view>
		            <view class="dynamic">
		                <view class="dynamic-child br-10 rel">
		                    <image @tap="toJump" class="userimg abs circle" :data-id="item1.user_id" data-status="toCustomInfo" mode="aspectFill" :src="item1.user?item1.user.avatarUrl:defaultUserImg"></image>
		                    <view class="flex">
		                        <view @tap="toJump" class="flex100-8 ellipsis" :data-id="item1.user_id" data-status="toCustomInfo">
		                            <em v-if="item1.mark==2">已成交</em>
		                            <i class="iconfont icon-shouji" v-if="item1.phone"></i>
		                            <text class="name ellipsis">{{item1.name?item1.name:'新客户'}}</text>
		                            <text>{{item1.create_time2}}</text>
		                        </view>
		                        <view @tap="toJump" class="flex100-2 tr" :data-index="index1" data-status="toChat">
		                            <image class="circle fr" mode="aspectFill" :src="chatImg"></image>
		                        </view>
		                    </view>
		                    <view @tap="toJump" class="text mt-12" :data-id="item1.user_id" data-status="toCustomInfo">
		                        <block v-if="item1.sign=='copy'">
		                            <block v-if="item1.type==1">
		                                <text>
		                                    <block v-if="item1.count==1">首</block>
		                                    <block v-if="item1.count>1">第{{item1.count}}</block>次</text>保存了你的<text>电话</text>，请随时保持电话畅通
		                                    </block>
		                            <block v-if="item1.type==2">
		                                <text>
		                                    <block v-if="item1.count==1">首</block>
		                                    <block v-if="item1.count>1">第{{item1.count}}</block>次拨打</text>你的<text>手机号</text>
		                            </block>
		                            <block v-if="item1.type==3">
		                                <text>
		                                    <block v-if="item1.count==1">首</block>
		                                    <block v-if="item1.count>1">第{{item1.count}}</block>次拨打</text>你的<text>座机号</text>
		                            </block>
		                            <block v-if="item1.type==4">
		                                <text>
		                                    <block v-if="item1.count==1">首</block>
		                                    <block v-if="item1.count>1">第{{item1.count}}</block>次</text>复制了你的<text>微信</text>，请随时查看微信通讯录
		                                    </block>
		                            <block v-if="item1.type==5">
		                                <text>
		                                    <block v-if="item1.count==1">首</block>
		                                    <block v-if="item1.count>1">第{{item1.count}}</block>次</text>复制了你的<text>邮箱</text>，可能随时邮寄文件给你，请注意查收
		                                    </block>
		                            <block v-if="item1.type==6">
		                                <text>
		                                    <block v-if="item1.count==1">首</block>
		                                    <block v-if="item1.count>1">第{{item1.count}}</block>次复制</text>你公司的<text>名称</text>
		                            </block>
		                            <block v-if="item1.type==7">
		                                <text>
		                                    <block v-if="item1.count==1">首</block>
		                                    <block v-if="item1.count>1">第{{item1.count}}</block>次查看</text>你公司的<text>导航定位</text>
		                            </block>
		                           
		                            <block v-if="item1.type==10">
		                                <text>
		                                    <block v-if="item1.count==1">首</block>
		                                    <block v-if="item1.count>1">第{{item1.count}}</block>次保存</text>你的<text>名片海报</text>，请及时留意雷达动态
		                            </block>
		                            
		                        </block>
		                        <block v-if="item1.sign=='view'">
		                            <block v-if="item1.type==1">
		                                <text>
		                                    <block v-if="item1.count==1">首</block>
		                                    <block v-if="item1.count>1">第{{item1.count}}</block>次查看</text>你的<text>商城</text>
		                            </block>

		                            <block v-if="item1.type==6">
		                                <text>
		                                    <block v-if="item1.count==1">首</block>
		                                    <block v-if="item1.count>1">第{{item1.count}}</block>次查看公司官网</text>{{item1.countText}}
		                            </block>
		                            
		                        </block>
		                        <block v-if="item1.sign=='praise'">
		                           
		                            <block v-if="item1.type==1">
		                                <text>
		                                    <block v-if="item1.count==1">首</block>
		                                    <block v-if="item1.count>1">第{{item1.count}}</block>次查看</text>你的<text>名片</text>{{item1.countText}} 
		                            </block>
		                            <block v-if="item1.type==3">
		                                        TA给你点赞了，看来TA觉得你<text>非常靠谱</text>
		                            </block>
		                            
		                        </block>
		                        
		                        
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
		        <block v-else>
		            <view class="loadmore loadmore_line" v-if="page>=last_page&&viewList.list.length>0">
		                <view class="loadmore_tips loadmore_tips_in-line">没有更多数据了</view>
		            </view>
		            <view class="loadmore loadmore_line" v-if="viewList.list.length<=0">
		                <view class="loadmore_tips loadmore_tips_in-line">没有找到数据</view>
		            </view>
		        </block>
		    </view>
			</scroll-view>
		</block>
		</block>
		<view class="behavior-sec" v-if="currentTab=='behavior'">
		    <view class="behavior-info">
		        <view class="title">
		            <picker :range="setCount" :range-key="'name'" :value="index" @change="behaviorChange">
		                 {{setCount[index].name}}内被查看的行为统计
		                <text class="iconfont2 icon-xiangxia fr"></text>
		            </picker>
		        </view>
		        <view class="content clearfix">
		            <view class="child rel">
		                <i class="iconfont2 icon-shangpin abs"></i>
		                <view class="num">{{behaviorInfo.view_goods_count?behaviorInfo.view_goods_count:0}}</view>
		                <view class="text">查看商品</view>
		            </view>
		            <view class="child rel">
		                <i class="iconfont2 icon-diannao abs"></i>
		                <view class="num">{{behaviorInfo.view_web_count?behaviorInfo.view_web_count:0}}</view>
		                <view class="text">查看官网</view>
		            </view>
		            <view class="child rel">
		                <i class="iconfont2 icon-weixin2 abs"></i>
		                <view class="num">{{behaviorInfo.copy_wechat_count?behaviorInfo.copy_wechat_count:0}}</view>
		                <view class="text">复制微信</view>
		            </view>
		            <view class="child rel">
		                <i class="iconfont2 icon-mingpian abs"></i>
		                <view class="num">{{behaviorInfo.share_card_count?behaviorInfo.share_card_count:0}}</view>
		                <view class="text">转发名片</view>
		            </view>
		        </view>
		    </view>
		    <view class="behavior-list">
		        <view class="child flex">
		            <view class="flex100-15" style="flex: 0 0 10%;">
		                <image class="circle" src="https://retail.xiaochengxucms.com/images/12/2018/11/bmCV63HhBVBVR0b03Dbe8M6MIe8IB6.png"></image>
		            </view>
		            <view class="flex100-75">查看名片</view>
		            <view class="flex100-15 tr">{{behaviorList.view_card_count?behaviorList.view_card_count:0}}</view>
		        </view>
		        
		        <view class="child flex">
		            <view class="flex100-15" style="flex: 0 0 10%;">
		                <image class="circle" src="https://retail.xiaochengxucms.com/images/12/2018/11/dzn1Vv9XVbnM49tbmMMXhBX4N4zz4x.png"></image>
		            </view>
		            <view class="flex100-75">授权手机号</view>
		            <view class="flex100-15 tr">{{behaviorList.phone_count?behaviorList.phone_count:0}}</view>
		        </view>

		        <view class="child flex">
		            <view class="flex100-15" style="flex: 0 0 10%;">
		                <image class="circle" src="https://retail.xiaochengxucms.com/images/12/2018/11/pKZ1Pm89BEYNyM5PXQX497KZmbJjjx.png"></image>
		            </view>
		            <view class="flex100-75">保存电话</view>
		            <view class="flex100-15 tr">{{behaviorList.save_phone_count?behaviorList.save_phone_count:0}}</view>
		        </view>
		        <view class="child flex">
		            <view class="flex100-15" style="flex: 0 0 10%;">
		                <image class="circle" src="https://retail.xiaochengxucms.com/images/12/2018/11/w901p13Mnx7RDOvDp31w7N5k0993m5.png"></image>
		            </view>
		            <view class="flex100-75">觉得靠谱</view>
		            <view class="flex100-15 tr">{{behaviorList.thumbs_count?behaviorList.thumbs_count:0}}</view>
		        </view>
		        <view class="child flex">
		            <view class="flex100-15" style="flex: 0 0 10%;">
		                <image class="circle" src="https://retail.xiaochengxucms.com/images/12/2018/11/XvvKzv3vq0qcV8Q8k1nZO1110TZpcz.png"></image>
		            </view>
		            <view class="flex100-75">拨打电话</view>
		            <view class="flex100-15 tr">{{behaviorList.call_phone_count?behaviorList.call_phone_count:0}}</view>
		        </view>
		        
		        <view class="child flex">
		            <view class="flex100-15" style="flex: 0 0 10%;">
		                <image class="circle" src="https://retail.xiaochengxucms.com/images/12/2018/11/dzn1Vv9XVbnM49tbmMMXhBX4N4zz4x.png"></image>
		            </view>
		            <view class="flex100-75">复制邮箱</view>
		            <view class="flex100-15 tr">{{behaviorList.copy_email_count?behaviorList.copy_email_count:0}}</view>
		        </view>
		    </view>
			<view style="height: 100rpx;"></view>
			
		</view>
		<Radarbar></Radarbar>
	</view>
</template>

<script>
	import Radarbar from '@/components/radarbar/radarbar.vue';
	export default {
		components:{
			Radarbar
		},
		data() {
			return {
				index:0,
				currentIndex:0,
				currentTab:'time',
				tabList: [{
				  status: "time",
				  name: "时间"
				}, {
				  status: "behavior",
				  name: "行为"
				}],
				setCount: [
				{
				  type:1,
				  name: "近7天"
				}, 
				{
				  type:2,
				  name: "近30天"
				}],
				behaviorInfo:{
					view_goods_count:0,
					view_web_count:0,
					copy_wechat_count:0,
					share_card_count:0,
				},
				behaviorList:{
					view_card_count:0,
					save_phone_count:0,
					copy_email_count:0,
					call_phone_count:0,
					thumbs_count:0,
				},
				type:1,
				viewList:{
					list:[]
				},
				page:1,
				last_page:0,
				loading:0,
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				defaultUserImg:"",
				chatImg:"@/card/statics/icon/message.png"
			}
		},
		onLoad() {
			this.init();
			this.getRadarData();
			this.getTimeData();
		},
		onPullDownRefresh() {
			/*下拉到顶，页面值还原初始化*/
			this.restoreData();
			this.getTimeData();
			
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
			/*还原初始化*/
			restoreData() {
				this.viewList.list = [];
			},
					
			
			getRadarData(){
				let self = this;
				let card_id = self.card_id;
				if(!card_id){
					card_id = uni.getStorageSync('card_id');
				}
				uni.showLoading({
					title: '加载中'
				});
				self._get(
					'plus.card.card/radar',
					{
						type:self.type
					},
					function(res) {
						if(res.data.radarData){
							console.log(res.data.radarData)
							self.behaviorInfo = res.data.radarData.behaviorInfo;
							self.behaviorList = res.data.radarData.behaviorList
						}
						self.loadding = false;
						uni.hideLoading();
					}
				);
			},
			/* 获取时间数据 */
			getTimeData(){
				let self = this;
				let card_id = self.card_id;
				let page = self.page;
				if(!card_id){
					card_id = uni.getStorageSync('card_id');
				}
				uni.showLoading({
					title: '加载中'
				});
				self._get(
					'plus.card.card/timeline',
					{
						page: page || 1,
					},
					function(res) {
						console.log(res);
						self.viewList.list = self.viewList.list.concat(res.data.timeData.data);
						self.last_page = res.data.timeData.last_page;
		
						self.loadding = false;
						uni.hideLoading();
					}
				);
			},
			
			scrolltolowerFunc() {
				
				let self = this;
				self.bottomRefresh = true;
				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					self.no_more = true;
					return;
				}
				self.getTimeData();
			},
			/* 统计 */
			behaviorChange(e){
				this.type = this.setCount[e.detail.value].type;
				this.index =  e.detail.value;
				console.log(e);
				this.getRadarData();
			},
			/* 切换 */
			changeTab(e,k){
				this.currentIndex =k;
				this.currentTab = e.status;
				console.log(e);
			}
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
	.swiper-tab-list{
		width: 200rpx;
	}
</style>
