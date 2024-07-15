<!--以下代码为支付方式未选择的时候用于用户重新发起支付-->
<template>
	<view>
		<scroll-view style="background: #fff;">

			<view>
				<view class="price" style="margin-bottom: 50rpx;">
					<text style="font-size: 38rpx;">￥</text>{{order_price}}
				</view>
				<!--支付方式-->
				<payOptions v-if="pay_type != 'huifu_alipay_wap'" :payTypeList="payTypeList" :need_sel="0"
					:checkedPayType="pay_num" @click="payTypeList_click">
				</payOptions>
				<view class="" style="width: 80%; margin: auto;text-align: center;"
					v-if="alipay_code && pay_type == 'huifu_alipay_wap'">
					<view class="ww100 p20 box-s-b">
						<image class="ww100" @click="img_click(alipay_code)" :src="alipay_code" mode="widthFix"></image>
					</view>
					<view class="">
						请保存支付宝二维码扫码完成支付
					</view>

				</view>

				<view class="pay-success" style="margin-top: 100rpx;">
					<view class="success-btns d-b-c">
						<button type="default" class="flex-1 mr10"
							@click="goHome()">{{$nw("返回首页")}}</button>
						<button type="primary" class="flex-1 ml10" @click="sure_pay()">我已支付</button>

						<view style="color: both;"></view>
					</view>
					<view style="color: both;"></view>
				</view>

			</view>
		</scroll-view>
	</view>
</template>
<!--以上代码为支付方式未选择的时候用于用户重新发起支付-->
<script>
	import payOptions from "@/components/order/payOptions";
	import {
		pay
	} from '@/common/pay.js';
	import config from '@/config.js'
	export default {
		components: {
			payOptions,
		},
		data() {
			return {
				pay_log_id: "", //支付记录ID
				payment_id: "", //支付ID
				pay_type: "", //支付类型
				pay_num: "", //支付code
				code: "",
				payTypeList: [],
				order_id: "",
				order_price: "",
				alipay_code: ""
			};
		},
		onShow() {

		},
		onLoad(obj) {
			var self = this;

			// #ifdef H5
			if (self.isWeixn()) {
				if (self.getUrlCode()) {
					self.code = self.getUrlCode().code
				}
			}

			// #endif


			//获取支付方式
			self.getPaymentList(self, function(res) {
				self.payTypeList = res
			})
			self.pay_log_id = obj.pay_log_id;
			self.payment_id = obj.payment_id
			self.pay_type = obj.pay_type;
			self.pay_num = parseInt(obj.pay_num);
			self.order_price = obj.order_price
			console.log("obj", obj)

			onPay(self, self.pay_log_id, self.pay_type, self.payment_id, self.pay_num);

		},
		onHide() {
			clearInterval(uni.getStorageSync("xt_checkPay"))
		},
		methods: {
			img_click(url) {
				uni.previewImage({
					urls: ["" + url]
				})
			},
			// 选择支付方式触发
			payTypeList_click(e) {
				console.log(e)
				this.pay_num = e.value
				this.payment_id = e.payment_id
				this.pay_type = e.pay_type
			},
			goHome() {
				/*返回首页*/
				uni.reLaunch({
					url: '/pages/index/index'
				});
			},
			sure_pay() {
				var self = this;
				if (self.pay_type == "huifu_alipay_wap") {
					self._post("user.order/surePay", {
						pay_log_id: self.pay_log_id
					}, function(result) {
						if (result) {
							clearInterval(uni.getStorageSync("xt_checkPay"))
							pay(result, self)
						}
					})
				} else {
					if (self.payment_id) {
						onPay(self, self.pay_log_id, self.pay_type, self.payment_id, self.pay_num);
					} else {
						uni.showModal({
							title: self.$nw("系统提示："),
							content: "支付参数错误，请重新选择支付方式",
							showCancel: false,
							success(res) {

							}
						})
						return;
					}
				}

			}
		}
	}
	/* 
		调用支付
		pay_type  
				balance	余额支付
				wxmp	微信公众号支付
				wxmn	微信小程序支付
		pay_log_id	 支付记录ID
		payment_id  支付ID
		pay_num  支付类型  
	 */
	function onPay(self, pay_log_id, pay_type, payment_id, pay_num) {
		clearInterval(uni.getStorageSync("xt_checkPay"))
		uni.showLoading({
			title: "支付中..."
		})
		// if(pay_num == 60){
		// 	pay_num = 20
		// }
		let params = {
			payType: pay_num,
			pay_type: pay_type,
			pay_source: self.getPlatform(),
			payment_id: payment_id,
			pay_log_id: pay_log_id, //增加参数
		};
		if (pay_log_id && payment_id) {

			console.log(self.pay_type)
			if (['wxmp', 'huifu_wxmp'].indexOf(self.pay_type) > -1) {

				if (self.code) { //说明code存在
					self._post("auth.WxMn/getOpenId", {
						wx_code: self.code
					}, function(result) {
						console.log("result", result)
						if (result.data.openid) {
							let openid = result.data.openid;
							self.openid = openid
							params.openid = openid
							self._post("order.order/payment", params, function(result) {
								pay(result, self)
							}, function() {}, function() {}, false)
							//self.subMessage(obj.temlIds, callback)
						} else { //获取open_id失败
							var obj = {};
							obj.pay_log_id = self.pay_log_id;
							obj.payment_id = self.payment_id;
							obj.pay_type = self.pay_type;
							obj.pay_num = self.pay_num;
							obj.order_price = self.order_price;
							obj.app_url = config.app_url
							self.getCode(obj);
						}

					}, function(result) {
						console.log("code失效了")
						var obj = {};
						obj.pay_log_id = self.pay_log_id;
						obj.payment_id = self.payment_id;
						obj.pay_type = self.pay_type;
						obj.pay_num = self.pay_num;
						obj.order_price = self.order_price;
						obj.app_url = config.app_url
						self.getCode(obj);
					}, function() {

					}, false)

				} else { //code不存在  就重新获取code 并跳回本页面
					let obj = {};
					obj.pay_log_id = self.pay_log_id;
					obj.payment_id = self.payment_id;
					obj.pay_type = self.pay_type;
					obj.pay_num = self.pay_num;
					obj.order_price = self.order_price;
					obj.app_url = config.app_url
					self.getCode(obj);
				}
			} else if (['wxmn', 'huifu_wxmn'].indexOf(self.pay_type) > -1) { //获取小程序open_id 
				// #ifndef MP-WEIXIN
				uni.showModal({
					title: self.$nw("系统提示："),
					content: "请在微信小程序中使用该支付",
					showCancel: false,

				})
				uni.hideLoading()
				return;
				// #endif
				uni.login({
					success(res) {
						self.code = res.code
						self._post("auth.WxMn/getMinOpenId", {
							js_code: self.code
						}, function(result) {
							console.log("result", result)
							if (result.data.openid) {
								let openid = result.data.openid;
								self.openid = openid
								params.openid = openid
								self._post("order.order/payment", params, function(result) {
									pay(result, self)
								}, function() {}, function() {}, false)
								//self.subMessage(obj.temlIds, callback)
							}
						}, function() {}, function() {}, false)
					}
				})

			} else if (self.pay_type == "balance") { //余额支付

				params.order_id = self.order_id;
				self._post(
					'user.order/pay', params,
					function(res) {
						uni.hideLoading();
						pay(res, self);
					},
					function() {},
					function() {}, false
				);
			} else {
				//统一支付调用接口

				console.log(self.openid, params, "测试")
				if (params.pay_type == "huifu_alipay_wap") {
					//生成支付宝二维码
					self._post("order.order/payment", params, function(result) {
						console.log("result", result.data)

						// #ifdef H5

						if (self.isWeixn()) {
							var xt = "";
							xt = setInterval(function() {
								uni.setStorageSync("xt_checkPay", xt)
								self._post("user.order/checkPay", params, function(result) {
									if (result) {
										clearInterval(uni.getStorageSync("xt_checkPay"))
										pay(result, self)
									}
								})
							}, 1500)

							self._get('user.order/alipayQrcode', {
								order_id: result.data.order_id,
								source: "mp",
								"url": result.data.payment.expend.pay_info
							}, function(res) {
								uni.hideLoading();
								self.alipay_code = res.data.qrcode;
							});
						} else {
							window.location.href = result.data.payment.expend.pay_info
						}


						// #endif
						// #ifdef MP-WEIXIN
						//开启定时器时刻监听支付状态
						var xt = "";
						xt = setInterval(function() {
							uni.setStorageSync("xt_checkPay", xt)
							self._post("user.order/checkPay", params, function(result) {
								if (result) {
									clearInterval(uni.getStorageSync("xt_checkPay"))
									pay(result, self)
								}
							})
						}, 1300)

						self._get('user.order/alipayQrcode', {
							order_id: result.data.order_id,
							source: "mp",
							"url": result.data.payment.expend.pay_info
						}, function(res) {
							uni.hideLoading();
							self.alipay_code = res.data.qrcode;
						});
						// #endif

					})

				} else {
					self._post("order.order/payment", params, function(result) {
						pay(result, self)
					})
				}

			}
		} else {
			//未获取到支付参数
			uni.showModal({
				title:self.$nw("系统提示："),
				content: "支付参数错误，请重新选择支付方式",
				showCancel: false,
				success(res) {

				}
			})

		}


	}
</script>

<style lang="scss" scoped>
	page {
		background: #fff;
	}

	.price {
		text-align: center;
		width: 100%;
		height: 100rpx;
		font-size: 60rpx;
		color: #2f2f2f;
		font-weight: 600;
		margin-top: 80rpx;
	}

	.pay-success .success-icon {

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
		width: 90%;
		margin: auto;
	}

	.pay-success .success-btns button {
		font-size: 30rpx;
	}

	.pay-success .success-btns button[type="default"] {
		border: 1px solid #04BE01;
		color: #04BE01;
	}
</style>