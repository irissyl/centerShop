<template>
	<view>
		<view class="staff-mine-sec">
			<view class="rel user-sec br-10" style="height:auto;padding-bottom:0rpx;">
				<image class="abs circle" mode="aspectFill" :src="cardIndexData.info.avatar_image||defaultUserImg"></image>
				<view class="flex">
					<view class="flex100-5 ellipsis">
						<view class="name">{{cardIndexData.info.name?cardIndexData.info.name:'姓名'}}</view>
						<view class="job">{{cardIndexData.info.occupation?cardIndexData.info.occupation:'职称'}}</view>
					</view>
					<view  class="flex100-5 ellipsis tr" @click="toEdit">
						<i class="iconfont2 icon-right2 fr"></i>
						<view class="edit tc fr">
							<i class="iconfont2 icon-xiazai43">编辑</i>
						</view>
					</view>
				</view>
				<view @click="toEwm" class="mine-ewm">
					我的推广码
					<view class="fr">
						<i class="iconfont2 icon-erweima"></i>
					</view>
				</view>
				<view @click="toLengThen" class="xufei" v-if="cardIndexData.info.active_time">
					<text>名片到期时间:</text>
					<text>{{cardIndexData.info.active_time['1']}}</text>
					<view class="edit tc fr" style="margin-top:16rpx; padding:5rpx 20rpx; border-radius:40rpx;border: 1px solid #d7d7d7;font-size:20rpx;">
						<text>续费</text>
					</view>
				</view>
			</view>
		</view>
		<view  class="staff-mine-list" >
			<button openType="share" class="child" style="height:104rpx;">
				<view class="text-7 tl">
					<em class="circle tc" style="background:#65aeec;">
						<i class="iconfont2 icon-zhuanfa"></i>
					</em>
					<text>发名片</text>
				</view>
				<view class="text-3 tr rel">
					<em class="dotbig" style="top:10rpx;right:35rpx;" v-if="notRead">{{notRead}}</em>
					<i class="iconfont2 icon-right2 rel"></i>
				</view>
			</button>
			
			<button @click="toChat" class="child" style="height:104rpx;">
				<view class="text-7 tl">
					<em class="circle tc" style="background:#65aeec;">
						<i class="iconfont2 icon-xiaoxi"></i>
					</em>
					<text>私信我的</text>
				</view>
				<view class="text-3 tr rel">
					<em class="dotbig" style="top:10rpx;right:35rpx;" v-if="notRead">{{notRead}}</em>
					<i class="iconfont2 icon-right2 rel"></i>
				</view>
			</button>
			
			
			
			<button class="child" @click="toSquare" style="height:104rpx;">
				<view class="text-7 tl">
					<em class="circle tc" style="background:#21bf34;">
						<i class="iconfont2 icon-shichangdongtai"></i>
					</em>
					<text>人脈圈</text>
				</view>
				<view class="text-3 tr rel">
					<i class="iconfont2 icon-right2 rel"></i>
				</view>
			</button>
			
			<!-- BOSS管理 -->
			<button class="child" @click="toBoss" v-if="cardIndexData.info.type=='boss'" style="height:104rpx;">
				<view class="text-7 tl">
					<em class="circle tc" style="background:#21bf34;">
						<i class="iconfont2 icon-chanpinfangxiang"></i>
					</em>
					<text>BOSS端</text>
				</view>
				<view class="text-3 tr rel">
					<i class="iconfont2 icon-right2 rel"></i>
				</view>
			</button>
			
			<button class="child" @click="toUser" style="height:104rpx;">
				<view class="text-7 tl">
					<em class="circle tc" style="background:#6c83f4;">
						<i class="iconfont2 icon-chanpinfangxiang"></i>
					</em>
					<text>用户中心</text>
				</view>
				<view class="text-3 tr rel">
					<i class="iconfont2 icon-right2 rel"></i>
				</view>
			</button>
			
		</view>
		<Radarbar></Radarbar>
	</view>
</template>

<script>
	import Radarbar from '@/components/radarbar/radarbar.vue';
	export default {
		components: {
			Radarbar
		},
		data() {
			return {
				staffInfo: {},
				StaffCard: {},
				globalData: {},
				cardIndexData: {
					"info": {
					}, 
				},

				notRead: "",
				noticeNum: "",
				qrImg: "",
				tmp_showPrice: "",
				uniacid: "",
				plugin: "",
				isIphoneX: "",
				defaultUserImg: "",
			}
		},
		onLoad() {
			
		},
		mounted() {
			/*获取名片详情*/
			this.getBaseData();
		},
		methods: {
			getBaseData(){
				let self = this;
				uni.showLoading({
					title: '加载中'
				});
				self._get(
					'plus.card.card/mine',
					{
					},
					function(res) {
						if(res.data.noCard==1){
							uni.showModal({
								title:"提示",
								content:res.msg,
								showCancel:false,
								success: function (res) {
									let path = '';
									if (res.confirm) {
										path = '/user/pages/index/index';
									}
									uni.redirectTo({
										url:path
									});
									return ;
								}
							
							})
						}
						self.cardIndexData.info = res.data.info;
						
						if(res.data.info.type=='boss'){
							uni.setStorageSync('fromstatus',res.data.info.type);
						}
						if(res.data.info.outofdate==1){
							uni.showModal({
								title:"名片续费",
								content:"名片已到期，是否立即续费",
								success: function (res) {
									let path = '';
									if (res.confirm) {
										path = '/card/pages/card/staff/mine/apply';
									} else if (res.cancel) {
										path = '/user/pages/index/index';
									}
									uni.redirectTo({
										url:path
									});
									return ;
								}
							
							})
						}else if(res.data.info.outofdate==2){
							uni.showModal({
								title:"名片续费",
								content:"名片即将到期，是否立即续费",
								success: function (res) {
									if (res.confirm) {
										let path = '/card/pages/card/staff/mine/apply';
										uni.redirectTo({
											url:path
										});
									}
								}
	
							})
						}
						self.loadding = false;
						uni.hideLoading();
					}
				);
			},
			/* 跳转编辑 */
			toEdit(){
				let self = this;
				let card_id = self.cardIndexData.info.card_id;
				uni.navigateTo({
					url:"/card/pages/card/edit?card_id="+card_id
				})
			},
			/* 跳转二维码 */
			toEwm(){
				let self = this;
				let card_id = self.cardIndexData.info.card_id;
				uni.navigateTo({
					url:"/card/pages/card/share/index?card_id="+card_id
				})
			},
			/*分享*/
			onShareAppMessage() {
				let self = this;
				let card_id = self.cardIndexData.info.card_id;
				// 构建页面参数
				let params = self.getShareUrlParams({
					card_id: card_id
				});
				return {
					title: "我的名片",
					path: '/card/pages/card/index?' + params
				};
			},
			/* 私信列表 */
			toChat(){
				let path = '/card/pages/card/staff/message/message';
				this.gotoPage(path);
			},
			/* 人脉圈 */
			toSquare(){
				let path  = '/card/pages/card/square/square';
				this.gotoPage(path);
			},
			toBoss(){
				let path = '/card/pages/card/boss/index/index';
				this.gotoPage(path);
			},
			toLengThen(){
				let path = '/card/pages/card/staff/mine/apply';
				this.gotoPage(path);
			},
			toUser(){
				let path = '/user/pages/index/index';
				uni.redirectTo({
					url:path
				})
			}
		}

	};
</script>
<style>
	@import "/card/statics/card.css";
	.xufei{
		width: 94%;
		height: 80rpx;
		line-height: 80rpx;
		margin: 0rpx auto;
		border-top: 1rpx dashed #e7e7e7;
		font-size: 24rpx;
		color: #656565;
	}
</style>
