<template>
	<view class="invite-wrap" v-if="!loadding">
		<view class="banner">
			<image src="http://imgh5.y01.cn/20210606232139f37ed9784.jpg" mode="widthFix"></image>
		</view>
		<view class="activity-date d-c-c">
			{{$nw("活动时间")}}：{{detail.start_time.text}} - {{detail.end_time.text}}
		</view>
		<view class="invite-content">
			<view class="tab d-c-c">
				<view class="item flex-1 d-c-c d-c" :class="tab_active==0?'active':''" @click="tab_active=0">
					<text class="headtext fb">{{$nw("领取大礼包")}}</text>
					<text>{{$nw("火热进行中")}}</text>
				</view>
				<view class="item flex-1 d-c-c d-c" :class="tab_active==1?'active':''" @click="tab_active=1">
					<text class="headtext fb">{{$nw("我的奖励")}}</text>
					<text>{{$nw("多邀多得")}}</text>
				</view>
			</view>
			<view class="invite-inner">
				<!--type 1-->
				<view class="invite-type" v-if="tab_active==0">
					<view class="title">
						{{$nw("邀请好友注册并且好友消费就可以领取礼包")}}
					</view>
					<view class="content">
						<scroll-view scroll-x="true">
							<view class="list d-s-c">
								<view class="item d-c-c d-c" :class="index<2?'select-item':''" v-for="(item,index) in detail.Reward" :key="index">
									<image src="http://imgh5.y01.cn/202106062321413d5321929.png" mode="widthFix" @click="getPrize(item.invitation_reward_id)"></image>
									<text>{{item.invitation_num}}{{$nw("人")}}</text>
								</view>
							</view>
						</scroll-view>
					</view>
					<view class="state-explan p20 d-c-c f30">
						{{$nw("还差")}}<text class="p-0-10 red">{{detail.dif}}</text>{{$nw("人就可以领取礼包啦")}}
					</view>
					<view class="btns-box">
						<button type="primary">{{$nw("邀请好友得礼包")}}</button>
					</view>
				</view>

				<!--type 2-->
				<view class="invite-type2" v-if="tab_active==1">
					<view class="list" v-for="(item,index) in detail.prize" :key="index">
						<view class="item p-20-0 d-b-c">
							<view class="d-s-s d-c">
								<text class="num">{{item.reward.coupon_name}}</text>
								<text class="gray9 f22">{{item.create_time}}</text>
							</view>
							<text>{{$nw("优惠券")}}</text>
						</view>
						<view class="item p-20-0 d-b-c">
							<view class="d-s-s d-c">
								<text class="num">+{{item.reward.point}}</text>
								<text class="gray9 f22">{{item.create_time}}</text>
							</view>
							<text>{{$nw("积分")}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
		import uniLoadMore from "@/components/uni-load-more.vue";
	export default {
		data() {
			return {
				/*是否加载完成*/
				loadding:true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				tab_active: 0,
				/*活动详情*/
				detail: {
					start_time: {
						text: 0
					},
					end_time: {
						text: 0
					},
					dif: 0,
				},
			}
		},
		onLoad(e) {
      this.setGlobalColor()
			uni.showLoading({
			    title: this.$nw("加载中")
			});
			

		},
		mounted() {

		},
		onShow() {
			/*获取数据*/
			this.getData();
		},
		methods: {

			/*获取数据*/
			getData() {
				let self = this;
				self._get('plus.invitationgift.invitation/getDatas', {}, function(res) {
					self.detail = res.data.data;
					console.log(self.detail);
					self.loadding=false;
					uni.hideLoading();

				});
			},

			/*领奖*/
			getPrize(e) {
				let self = this;
				// uni.showLoading({
				// 	title: '领取中'
				// });
				self._post('user.invitation/getPrize', {
					invitation_reward_id: e,
					invitation_gift_id: self.detail.invitation_gift_id,
				}, function(res) {
					console.log(res);
					uni.hideLoading();
					uni.showToast({
						title: self.$nw("领取成功"),
						duration: 2000,
						icon: 'success'
					});
					self.getData();

				});

			}
		}
	}
</script>

<style>
	.invite-wrap {
		height: 100vh;
		background: #f62c6d;
	}

	.invite-wrap .activity-date {
		width: 500rpx;
		height: 40rpx;
		margin: 0 auto;
		border-radius: 20rpx;
		background: #ff5b90;
		color: #FFFFFF;
	}

	.invite-content {
		margin: 50rpx;
		border-radius: 20rpx;
		background: #FFFFFF;
	}

	.invite-content .tab {
		border-bottom: 1px solid #CCCCCC;
	}

	.invite-content .tab .item {
		padding: 20rpx 0;
		font-size: 20rpx;
	}

	.invite-content .tab .item.active {
		border-bottom: 3px solid #ff5b90;
		margin-bottom: -3px;
		color: #ff5b90;
	}

	.invite-content .tab .item .headtext {
		font-size: 32rpx;
	}

	.invite-content .invite-inner {
		margin-top: 30rpx;
		padding: 20rpx;
	}

	.invite-content .invite-type .title {
		text-align: center;
		color: #f62c6d;
		font-size: 28rpx;
	}

	.invite-content .invite-type .content {
		margin-top: 30rpx;
	}

	.invite-content .invite-type .content image {
		width: 120rpx;
	}

	.invite-content .invite-type .content .select-item image {
		filter: grayscale(100%);
		filter: gray;
	}

	.invite-content .invite-type .item {
		width: 240rpx;
	}

	.invite-content .invite-type2 .item {
		border-bottom: 1px dashed #CCCCCC;
	}

	.invite-content .invite-type2 .item .num {
		color: #f62c6d;
	}

	.invite-content .btns-box {
		margin-top: 40rpx;
	}

	.invite-content .btns-box button {
		background: #ff5b90;
		color: #FFFFFF;
	}
</style>
