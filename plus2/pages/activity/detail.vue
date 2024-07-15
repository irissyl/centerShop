<template>
	<view class="activity-detail" v-if="loadding">
		<swiper style="width: 100%;height: 500rpx;background: #ffffff;" :indicator-dots="true" :autoplay="true"
			:interval="3000" :duration="1000">
			<swiper-item style="width: 100%;height: 500rpx;">
				<image style="width: 100%;height: 500rpx;" :src="activity.imgUrl" mode=""></image>
			</swiper-item>

		</swiper>


		<view class="" style="background: #ffffff;padding-bottom: 20rpx;">
			<view v-if="activity.is_free == 0" class=""
				style="background: #ffffff;width: 95%;margin: auto;font-size: 28rpx;color: #ff7e3e;">
				￥<text style="font-size: 48rpx;">{{ activity.price }}</text>
			</view>

			<view class="title fb" style="width: 95%;margin: auto;background: #ffffff;">{{ activity.title }}</view>
			<view style="width: 95%;margin: auto;background: #ffffff;">
				<!-- #ifdef H5 -->
				<text style="white-space: pre-wrap;" v-html="formatWord(activity.subtitle)"></text>
				<!-- #endif -->

				<!-- #ifdef MP-WEIXIN -->
				<view v-html="formatContent(activity.subtitle)"></view>
				<!-- #endif -->
				
				<!-- #ifdef APP -->
				<view v-html="formatContent(activity.subtitle)"></view>
				<!-- #endif -->
			</view>
		</view>
		<view v-if="hasReport && (activity.is_refund == 0)" class="info f24" style="background: #fff;border-top: 1rpx solid #d3d3d3;">
			
			<view class="" style="width: 95%;margin: auto;">
				<view style="width: 75%;float: left; line-height: 70rpx;"
				 v-if="activity.time">
					{{$nw("场次")}}：{{activity.time?activity.time:""}}
				</view>
				
				<view style="float: right; line-height: 70rpx;width:25%;margin: auto;text-align: right;">
					<text @click="jump(activity)" >{{$nw("参与人员")}}</text>
					 <text  @click="jump(activity)" style="font-size: 36rpx;">></text>
				
					
				</view>	
				<view style="clear: both;"></view>
			</view>
			
			
		</view>
		
		<view style="background: #ffffff;width: 100%;border-bottom: 1rpx solid #d3d3d3;margin-top: 20rpx;">
			<view style="display: flex;width: 100%;margin: auto;">

				<view style="width: 33%;text-align: center;  line-height: 80rpx;height: 80rpx;"
					v-for="(item,index) in itemArr" :key="index" @click="itemClick(index)"
					:style="'font-weight:'+(item.flag?'600':'')+';font-size:'+(item.flag?'32':'30')+'rpx;'">
					{{item.text}}

					<view v-if="item.flag"
						style="margin-top: -5rpx; margin: auto; width: 100rpx;height: 5rpx;background: #000;">

					</view>
				</view>




			</view>
		</view>
	
		<view class="" style="background: #ffffff;">
			<view class="activity-content" style="width: 95%;margin: auto;">
				<view class="" v-if="itemArr[0].flag">
					<!-- #ifdef H5 -->
					<text style="white-space: pre-wrap;" v-html="formatWord(activity.content)"></text>
					<!-- #endif -->

					<!-- #ifdef MP-WEIXIN -->
					<view v-html="formatContent(activity.content)"></view>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<view v-html="formatContent(activity.content)"></view>
					<!-- #endif -->
				</view>

				<view class="" v-if="itemArr[1].flag">
					<!-- #ifdef H5 -->
					<text style="white-space: pre-wrap;" v-html="formatWord(activity.route)"></text>
					<!-- #endif -->

					<!-- #ifdef MP-WEIXIN -->
					<view v-html="formatContent(activity.route)"></view>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<view v-html="formatContent(activity.route)"></view>
					<!-- #endif -->
				</view>

				<view class="" v-if="itemArr[2].flag">
					<!-- #ifdef H5 -->
					<text style="white-space: pre-wrap;" v-html="formatWord(activity.notice)"></text>
					<!-- #endif -->

					<!-- #ifdef MP-WEIXIN -->
					<view v-html="formatContent(activity.notice)"></view>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<view v-html="formatContent(activity.notice)"></view>
					<!-- #endif -->
				</view>


				<view style="height: 200rpx;width: 100%;">

				</view>
			</view>
		</view>

		<view style="height: 50rpx;">

		</view>

		<view class="btns-wrap">
			<view class="icon-box d-c-c" @click="goHome"><button class="icon iconfont icon-Homehomepagemenu"
					:style="[textColor(true)]"></button>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="icon-box d-c-c"><button class="icon iconfont icon-kefu2" :style="[textColor(true)]"
					open-type="contact" session-from="wxapp"></button></view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="icon-box d-c-c" @click="openMaservice"><button class="icon iconfont icon-kefu2"
					:style="[textColor(true)]"></button>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="icon-box d-c-c" @click="showShare"><button class="icon iconfont icon-share"
					:style="[textColor(true)]"></button>
			</view>
			<!-- #endif -->


			<template>
				<!-- shopp_cart_is_open  0 不干预商家设置  1  强制所有站点关闭  2 强制所以站点开启 -->
				<!-- 开启购物车+立即购买 -->
				<template>
					<button type="primary" class="buy3"
					@click="canel(activity)"
					v-if="activity.order_status == 10 && activity.is_refund == 0 && activity.status_text!='已结束'">{{$nw("取消报名")}}</button>
					<button type="primary" class="buy3" v-if="activity.order_status == 10 && activity.is_refund == 1">{{$nw("审核中")}}</button>
					<button type="primary" class="buy3" @click="nopass(activity)"
						v-if="activity.order_status == 10 && activity.is_refund == 3">{{$nw("审核未通过")}}</button>
					

					<button v-if="activity.status_text=='已结束'" type="primary" class="buy2">{{$nw("已结束")}}</button>
					<button v-else-if="!hasReport && !activity.is_data" type="primary" class="buy"
						@click="signUp()">{{$nw("我要报名")}}</button>
					<button v-else-if="!hasReport && activity.is_data" type="primary" class="buy"
						@click="openPopup(activity)">{{$nw("我要报名")}}</button>
					<button v-else-if="hasReport && (activity.is_refund == 0)" type="primary"
						class="buy2">{{$nw("已报名")}}</button>


				</template>


			</template>


		</view>
		<!--客服-->
		<Mpservice v-if="isMpservice" :copy_success="copy_success" :isMpservice="isMpservice" @close="closeMpservice">
		</Mpservice>


		<Option :isPopup="isPopup" :activity="activity" @close="closePopup"></Option>
		
		<Canel :isPopup="isPopupCanel" :activity="activity" @close="closePopup"></Canel>
		
		<!--底部弹窗-->
		<share :isbottmpanel="isbottmpanel" :article_id="article_id" @close="closeBottmpanel"></share>
	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	import Option from './popup/option.vue';
	import Canel from './popup/canel.vue';
	import share from './popup/share.vue'
	import {
		pay
	} from '@/common/pay.js'
	import Mpservice from '@/components/mpservice/Mpservice.vue';
// import icon from '../../../uni_modules/uview-ui/libs/config/props/icon';
	export default {
		components: {
			Option,
			Mpservice,
			Canel,
			share
		},
		data() {
			return {
				article_id:0,
				isbottmpanel: false,
				url: null,
				/*是否加载完成*/
				loadding: false,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*活动id*/
				activity_id: 0,
				/*活动详情*/
				activity: {
					image: {}
				},
				hasReport: false,
				isPopup: false,
				optionLaunch: {},
				scene: 0,
				isMpservice: false,
				itemArr: [{
					id: 1,
					text: this.$nws("活动详情"),
					flag: true
				}, {
					id: 2,
					text: this.$nws("活动行程"),
					flag: false
				}, {
					id: 3,
					text: this.$nws("活动须知"),
					flag: false
				}],
				isPopupCanel:false,
			};
		},
		computed: {
			textColor() {
				return flag => {
					flag = !!flag
					return this.setColor(flag)
				}
			},
			bgcColor() {
				return this.setBackgroundColor()
			},
		},
		onLoad(e) {
			/*分类id*/
			this.activity_id = e.activity_id;
			var self = this;
			uni.$on("canel",function(){
				console.log("取消成功")
				self.getData();
				self.isPopupCanel = false;
			})
		},
		onShow() {
			// #ifdef MP-WEIXIN
			this.optionLaunch = wx.getLaunchOptionsSync();
			this.scene = this.optionLaunch.scene;
			console.log(this.optionLaunch);
			// #endif
			/*获取产品详情*/
			this.getData();
			this.isPopup = false;
			this.setGlobalColor()
			uni.setNavigationBarTitle({
				title:this.$nws("活动详情")
			})
		},
		onShareTimeline() {
			let self = this;
			return {
				title: self.activity.title,
			};
		},
		methods: {
			canel(item){
				var self = this;
				this.isPopupCanel = true;
				
					
				
			},
			nopass(item) { //审核已经未通过
				var self = this;
				if(item.status_text!='已结束'){
					uni.showModal({
						title: self.$nw("系统提示"),
						content:self.$nw("不通过原因")+'：【' + item.reject_val + '】，'+self.$nw("是否重新报名"),
						success(res2) {
							if (res2.confirm) {
									uni.redirectTo({
										url:"/plus2/pages/activity/detail?activity_id="+item.activity_id
									})
							}
						}
					})
					return;
					
				}else{
					uni.showToast({
						title:self.$nw("不通过原因")+'：【' + item.reject_val + "】",
						icon:"none"
					})
				}
				

			},
			itemClick(index) {
				this.itemArr.forEach(function(res) {
					res.flag = false;
				})
				this.itemArr[index].flag = true
			},
			formatContent(e) {
				return utils.format_content(e);
			},
			//关闭分享
			closeBottmpanel(data) {
				this.isbottmpanel = false;
				if (data.type == 2) {
					this.poster_img = data.poster_img;
					this.isCreatedImg = true;
				}
			},
			//分享按钮
			showShare() {
				var self = this;
				if (uni.getStorageSync("user_id")) {
					self.isbottmpanel = true;
				} else {
					uni.showModal({
						title:self.$nw("系统提示："),
						content: self.$nw("您还未登录，是否先前往登录"),
						success(re) {
							if (re.confirm) {
								// 根据不同的情况跳转到不同的页面
								self.login("pass_login", [0])
								return;
							}
						}
					})

				}

			},
			/*关闭客服*/
			closeMpservice() {
				this.isMpservice = false;
			},
			/*打开客服*/
			openMaservice() {
				this.isMpservice = true;
			},
			goHome() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			/*获取活动详情*/
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				this.loading = true;
				let activity_id = self.activity_id;
				this._get(
					'plus.activity.activity/detail', {
						activity_id: activity_id,
						scene: self.scene
					},
					function(res) {
						/*详情内容格式化*/
						res.data.detail.content = utils.format_content(res.data.detail.content);
						self.activity = res.data.detail;
						self.loadding = true;
						self.hasReport = res.data.hasReport;
						console.log(self.hasReport, !self.hasReport);
						uni.hideLoading();

					}

				);
			},
			openPopup(e) {
				let self = this;
				// this.isPopup = true;
				uni.navigateTo({
					url:"/plus2/pages/activity/choose?activity_id="+e.activity_id
				})
			},
			/*关闭弹窗*/
			closePopup() {
				let self = this;
				self.isPopup = false;
					self.isPopupCanel = false;
			},
			/* 报名 */
			signUp() {
				//无需提交资料
				let self = this;
				self.creatOrder();
			},
			creatOrder() {
				let self = this;
				let params = {
					activity_id: self.activity.activity_id,
					money: self.activity.price
				};
				// 微信支付
				let pay_source = 'wx';
				// #ifdef  H5
				pay_source = 'mp';
				// #endif
				params.pay_source = pay_source;
				if (self.activity.is_free == 0) {
					params.pay_type = 20;
				} else {
					params.pay_type = 10;
				}

				self._post('plus.activity.activity/signUp', params, function(res) {
					pay(res, self, self.paySuccess, self.payError);
				});
			},
			paySuccess: function(result) {
				this.showSuccess(this.$nw("提交成功"), () => {
					uni.navigateTo({
						url: '/plus2/pages/activity/paySuccess'
					});
				});
			},
			payError: function(result) {
				this.showError(this.$nw('订单未支付成功'), () => {
					console.log('payError');
				});
			},
			jump(e){
				uni.navigateTo({
					url:"/plus2/pages/activity/people?activity_id="+e.activity_id+"&activity_record_id="+e.activity_record_id
				})
			}

		}
	};
</script>

<style lang="scss">
	.page {
		background: #adadad;
	}

	.share-box {
		position: fixed;
		padding-right: 10rpx;
		width: 80rpx;
		height: 80rpx;
		right: 0;
		bottom: 180rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 16rpx 0 0 16rpx;
		background: rgba(0, 0, 0, 0.8);
	}

	.share-box button {
		padding: 0;
		background: 0;
		line-height: 60rpx;
	}

	.share-box .iconfont {
		margin-bottom: 10rpx;
		font-size: 50rpx;
		color: #ffffff;
	}

	.activity-detail {
		/* padding: 30rpx; */

	}

	.activity-detail .title {
		font-size: 44rpx;
	}

	.info {

		height: 80rpx;
		line-height: 80rpx;
		color: #999999;
	}

	.activity-detail .activity-content {
		width: 100%;
		box-sizing: border-box;
		line-height: 60rpx;
		font-size: 34 rpx;
		overflow: hidden;
	}

	.activity-detail .activity-content image,
	.activity-detail .activity-content img {
		display: block;
		max-width: 100%;
	}

	.btns-wrap {
		position: fixed;
		height: 90rpx;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		background: #ffffff;
	}

	.btns-wrap button,
	.btns-wrap button:after {
		height: 91rpx;
		line-height: 90rpx;
		margin: 0;
		padding: 0;
		flex: 1;
		border-radius: 0;
		border: 0;
	}



	.btns-wrap button.buy {
		background: #5b66fb;
	}

	.btns-wrap button.buy2 {
		background: linear-gradient(to right, #f2b237, #ffda98);
	}

	.btns-wrap button.buy3 {
		background: #cdcfd0;

		view {
			width: 100%;
			line-height: 90rpx;
			text-align: center;
		}
	}


	input::-webkit-input-placeholder {
		font-size: 10rpx
	}



	.btns-wrap {
		position: fixed;
		height: 90rpx;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		background: #ffffff;
	}

	.btns-wrap .icon-box {
		width: 90rpx;
		height: 90rpx;
		border-right: 1px solid #dddddd;
	}

	.btns-wrap .icon-box .iconfont {
		font-size: 40rpx;
		color: #888888;
	}

	.btns-wrap .icon-box .iconfont .num {
		position: absolute;
		top: 10rpx;
		left: 50%;
		height: 30rpx;
		min-width: 30rpx;
		overflow: hidden;
		line-height: 32rpx;
		border-radius: 15rpx;
		font-size: 20rpx;
		color: #ffffff;
		background: red;
	}

	.btns-wrap button,
	.btns-wrap button:after {
		height: 91rpx;
		line-height: 90rpx;
		margin: 0;
		padding: 0;
		flex: 1;
		border-radius: 0;
		border: 0;
	}

	.btns-wrap button.add-cart {
		background: $orange-color;
	}

	.btns-wrap button.buy {
		background: $dominant-color;
	}
</style>