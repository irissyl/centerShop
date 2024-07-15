<!--
 * @Author: fqj
 * @Date: 2022-06-24 18:38:54
 * @LastEditors: zgc
 * @LastEditTime: 2022-07-25 09:48:46
 * @FilePath: \psj_uniapp\main\pages\order\pay-h5\pay-h5.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
	<view class="pay-wrap" v-if="!loading">
		<view class="top-container">
			<view class="pay-title">
				{{ payment_name }}
			</view>
			<view class="price p-20-0">
				{{$nw("支付金额")}}：<text class="red f40 fb">￥{{ order.pay_price }}</text>
			</view>
		</view>
		<view class="p30">
			<view class="product-name mt30"> {{$nw("订单号")}}：{{ order.order_no }} </view>
			<view class="mt30">
				<view class="pay" @click="gotoPay"><button class="pay">{{$nw("确认支付")}}</button></view>
			</view>
		</view>
	</view>
</template>


<script>
	export default {
		data() {
			return {
				urls: "",
				order_id: 0,
				payment_id: 0,
				payment_name: "",
				order: {},
				/*加载中*/
				loading: true,
				pay_type: null,	//支付方式
			};
		},
		onLoad(e) {
			this.setGlobalColor();
			this.order_id = e.order_id;
			this.payment_id = e.payment_id;
			this.payment_name = e.payment_name;
			uni.showLoading({
				title: this.$nw("加载中"),
			});
			/*获取数据*/
			this.getData();
		},
		methods: {
			/*获取数据*/
			getData() {
				this._post(
					"user.userweb/payH5", {
						order_id: this.order_id,
						payment_id: this.payment_id,
					},
					(res) => {
						console.log(res);
						this.order = res.data.order;
						this.pay_type = res.data.pay_type
						if (res.data.pay_type == 20) {
							this.urls = res.data.mweb_url + "&redirect_url=" + res.data.return_Url;
						} else if (res.data.pay_type == 60) {
							this.urls = res.data.return_Url;
						}
						uni.hideLoading();
						this.loading = false;
					}
				);
			},
			gotoPay() {
				console.log(this.pay_type);
				if (this.pay_type == 20) {
					window.open(this.urls)
				} else {
					uni.navigateTo({
						url: `./aliPay?url=${this.urls}&order_id=${this.order_id}`
					})
				}


			}
		},
	};
</script>

<style>
	.product-pay-list {
		text-align: left;
	}

	.product-pay-list .pic {
		width: 120rpx;
		height: 120rpx;
	}

	.product-name {
		font-size: 30rpx;
	}

	.top-container {
		padding: 100rpx 0;
		text-align: center;
		background: #eeeeee;
		color: #333333;
	}

	.top-container .pay-title {
		font-size: 40rpx;
		font-weight: bold;
	}

	.pay-wrap .pay {
		display: block;
		height: 88rpx;
		line-height: 88rpx;
		font-size: 30rpx;
		color: #ffffff;
		text-align: center;
		border-radius: 8rpx;
		color: #ffffff;
		background: #04be01;
	}
</style>
