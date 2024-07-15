<template>
	<view class="gift-package" v-if="!loadding">
		<image class="gift-bg" src="http://imgh5.y01.cn/20210526181733a71840655.jpg" mode="widthFix"></image>
		<view class="gift-package-main">
			<div class="giftpackagr-info">
				<view class="d-c-c f50 fb red">
					{{detail.name}} 
				</view>
				<view class="d-c-c detatime">
					<text class="fb">
						{{$nw("活动时间")}}：
					</text>
					<view class="d-s-c d-c">
						<text>{{detail.start_time.text}}</text>
						<text>{{detail.end_time.text}}</text>
					</view>
				</view>
			</div>

			<view class="cuopon-group" if="detail.is_coupon">
				<view class="title f30">
					{{$nw("超值优惠券")}}
				</view>
				<view class="body">
					<view class="item" v-for="(item,index) in detail.coupon_list" :key="index">
						<view class="price">
							<text>{{$nw("¥")}}</text>
							<text>{{item.reduce_price}}</text>
						</view>
						<view class="des">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
			<view class="integral d-c-c" v-if="detail.is_point">
				<image src="http://imgh5.y01.cn/202106062321413d5321929.png" mode="widthFix"></image>
				<view class="info">
					<view class="title f30">
						{{$nw("积分礼包")}}
					</view>
					<view class="num">
						{{detail.point}}{{$nw("积分")}}
					</view>
				</view>
			</view>
			<view class="btns">
				<button type="primary" @click="onPay()">{{detail.money}}{{$nw("元购买")}}</button>
			</view>
		</view>

		<!--支付选择-->
		<Popup :show="isPayPopup" :msg="$nw('支付方式')" @hidePopup="hidePopupFunc">
			<!--支付方式-->
			<payOptions :need_sel="1"  :payTypeList="payTypeList" style="width: 100%;"
			:checkedPayType="pay_type" @click="checkedPayType"></payOptions>
			<view class="bts">

			</view>
		</Popup>
	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue';
	import {pay} from '@/common/pay.js'
	import payOptions from "@/components/order/payOptions";
	export default {
		components: {
			Popup,
			payOptions
		},
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				id: 0,
				/*礼包详情*/
				detail: {

				},
				/*是否显示支付类别弹窗*/
				isPayPopup: false,
				payTypeList:[],
				pay_type:10,
			}
		},
		onLoad(e) {
			/*商品id*/
			this.id = e.id;
		},
		mounted() {
      this.setGlobalColor()
			uni.showLoading({
				title: this.$nw("加载中")
			});
			/*获取数据*/
			this.getData();
		},
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				self._get('plus.giftpackage.giftpackage/getGiftPackage', {
					id: self.id
				}, function(res) {
					self.detail = res.data.data;
					self.payTypeList = res.data.data.payTypeList
					self.pay_type = res.data.data.pay_type
					self.loadding = false;
				});
			},
			/*购买*/
			checkedPayType(objs){
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")+"..."
				});
				let pay_source = 'wx';
				// #ifdef  H5
				pay_source = 'mp';
				// #endif
				self._post('plus.giftpackage.giftpackage/buy', {
					id: self.id,
					pay_source: pay_source,
					pay_type: objs.value,
				}, function(res) {
					pay(res, self, self.paySuccess, self.payError);
				});
			},
			paySuccess:function(result){
				this.showSuccess(this.$nw("礼包购买成功，请在个人中心查看"), () => {
					uni.switchTab({
						url:'/user/pages/index/index'
					});
				});
			},
			payError:function(result){
				this.showError(this.$nw('订单未支付成功'), () => {
					console.log('payError');
				});
			},
			/*显示支付方式*/
			hidePopupFunc() {
				this.isPayPopup = false;
			},

			/*支付方式选择*/
			onPay() {
				this.isPayPopup = true;
			},
		}
	}
</script>

<style>
	.gift-package {
		position: relative;
		min-height: 100vh;
		background: #fd6f00;
	}

	.gift-package .gift-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		width: 100%;
		z-index: 1;
	}

	.gift-package .gift-package-main {
		position: absolute;
		top: 240rpx;
		left: 45rpx;
		right: 45rpx;
		z-index: 2;
	}

	.gift-package-main .giftpackagr-info{
		margin: 0 auto;
		width: 500rpx;
		padding-top: 20rpx;
		background: rgba(255,255,255,.8);
		border-radius: 30rpx;
	}
	.gift-package-main .giftpackagr-info .detatime{ padding:10px 30px;}

	/* .gift-package-main .datetime {
		margin: 0 auto;
		width: 600rpx;
		height: 60rpx;
		line-height: 60rpx;
		text-align: center;
	} */

	.cuopon-group {
		margin-top: 200rpx;
		color: #fcf9c8;
		text-align: center;
		font-size: 30rpx;
	}

	.cuopon-group .body {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
	}

	.cuopon-group .body .item {
		padding: 20rpx;
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		background: #ffba26;
	}

	.cuopon-group .body .item .price {
		height: 60rpx;
		line-height: 60rpx;
		border-bottom: 1px solid #fff7e6;
		font-size: 36rpx;
	}

	.cuopon-group .body .item .des {
		padding: 10rpx 0;
		font-size: 24rpx;
	}

	.gift-package-main .integral {
		margin-top: 20rpx;
	}

	.gift-package-main .integral .info {
		margin-left: 30rpx;
		width: 300rpx;
		color: #fcf9c8;
	}

	.gift-package-main .integral image {
		width: 200rpx;
		height: 200rpx;
	}

	.gift-package-main .integral .num {
		font-size: 50rpx;
	}

	.gift-package-main .btns {
		margin-top: 30rpx;
	}

	.gift-package-main .btns button {
		height: 100rpx;
		line-height: 100rpx;
		text-shadow: 0 0 8rpx 0 rgba(0, 0, 0, .3);
		border-radius: 50rpx;
		color: #920202;
		font-size: 36rpx;
		box-shadow: 0 0 8rpx 0 rgba(0, 0, 0, .1);
		background: linear-gradient(0deg, #ffde63, #edb12f);
	}
</style>
