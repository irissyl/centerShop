<script type="text/javascript" charset="UTF-8" src="https://wx.gtimg.com/pay_h5/goldplan/js/jgoldplan-1.0.0.js"></script>
<template >
	<view class="pay-success" v-if="!loadding">
		<view class="success-icon d-c-c d-c" v-if="detail.pay_status.value==20">
      <text class="iconfont icon-queren d-c-c" style="width: 100rpx;height: 100rpx;"></text>
			<text class="name">{{$nw("支付成功")}}</text>
		</view>
		<view class="success-icon d-c-c d-c" v-else>
			<image src="http://bmrj.gushn.cn/file/uploads/20210822/43bd33b5bf081c7d4c11e7bfac779ee1.png" style="width: 200rpx;height: 200rpx;"></image>
			<text class="name">{{$nw("支付失败")}}</text>
		</view>
		<view>
			<view class="success-btns d-b-c">
				<button type="default" class="flex-1 mr10" @click="goHome()">{{$nw("返回首页")}}</button>
				<button type="primary" class="flex-1 ml10" @click="goMyorder()">{{$nw("我的订单")}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				order_id: 0,
				/*订单详情*/
				detail: {
					pay_price: 0
				}
			}
		},
		onLoad(e) {
			uni.showToast({
				title: e.order_id
			})
			this.order_id = e.order_id;
		},

		mounted() {
			uni.showLoading({
				title: this.$nw("加载中")
			});
			/*获取订单详情*/
			this.getData();
		},
		methods: {
			/*获取订单详情*/
			getData() {
				let _this = this;
				let order_id = _this.order_id;
				uni.request({
					url: 'http://bmrj.gushn.cn/index.php/job/notify/unionOrder',
					data: {
						order_id: order_id
					},
					dataType: 'json',
					method: 'GET',
					success: (res) => {
						_this.detail = res.data;
					},
					fail: (res) => {
						console.log(res)
					},
					complete: (res) => {
						_this.loadding = false
						console.log(res)
					},
				})
			},
			/*返回首页*/
			goHome(){
				// uni.reLaunch({
				// 	url: '/pages/index/index'
				// });
				window.location.href= 'http://bmrj.gushn.cn/h5';
			},
			/*返回我的订单*/
			goMyorder(){
				window.location.href= 'http://bmrj.gushn.cn/h5/pages/order/order-detail/order-detail?order_id='+this.order_id;
			}
		}
	}
// 	window.onload = function () {
//         var mchData = {action: 'onIframeReady', displayStyle: 'SHOW_CUSTOM_PAGE'}
//         var postData = JSON.stringify(mchData)
//         parent.postMessage(postData, 'https://payapp.weixin.qq.com')
//     }
</script>

<style scoped>
	.pay-success .success-icon {
		display: flex;
		padding: 60rpx;
	}

	.pay-success .success-icon .iconfont {
		padding: 30rpx;
		background: #04BE01;
		border-radius: 50%;
		font-size: 80rpx;
		color: #FFFFFF;
	}

	.pay-success .success-icon .name {
		margin-top: 20rpx;
		font-size: 30rpx;
	}

	.pay-success .success-price {
		font-size: 36rpx;
	}

	.pay-success .success-price .num {
		font-size: 60rpx;
		font-weight: bold;
	}

	.pay-success .order-info {
		background: #FFFFFF;
	}

	.pay-success .success-btns {
		margin-top: 50rpx;
		padding: 30rpx;
	}

	.pay-success .success-btns button {
		font-size: 30rpx;
	}

	.pay-success .success-btns button[type="default"] {
		border: 1px solid #04BE01;
		color: #04BE01;
	}
</style>
