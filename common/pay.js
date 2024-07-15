
/*
 * 支付
 */
export const pay = (result, self, success, fail) => {
	clearInterval(uni.getStorageSync("xt_checkPay"))
	if (result.code === -10) {
		uni.hideLoading()
		self.showError(result.msg);
		return false;
	}
	console.log("result", result)
	//余额
	if (result.data.pay_type == 10 || result.data.pay_type == 30) {
		paySuccess(result, self, success);
		uni.hideLoading()
	}
	//支付宝
	if (result.data.pay_type == "alipay_app") {
		uni.requestPayment({
			provider: 'alipay',
			orderInfo: result.data.payment,
			success: res => {
				paySuccess(result, self, success);
				uni.hideLoading()
			},
			fail: res => {
				uni.hideLoading()
				console.log(res)
				self.showError(self.$nw('订单未支付成功'), () => {
					uni.removeStorage({
						key: "payData"
					})
					payError(result, fail);
				});
			}
		})
	}


	//微信公众号支付
	if (result.data.pay_type == "wxmp" || result.data.pay_type == 70) {
		WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(result.data.payment),
			function(res) {
				if (res.err_msg == "get_brand_wcpay_request:ok") {
					paySuccess(result, self, success);
				} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
					self.showSuccess('支付取消', () => {
						payError(result, fail);
					});
				} else {

					self.showError(self.$nw('订单未支付成功'), () => {
						uni.removeStorage({
							key: "payData"
						})
						payError(result, fail);
					});
				}
				uni.hideLoading()
			}
		);
	}
	/* 微信小程序支付 */
	if (result.data.pay_type == "wxmn" || result.data.pay_type == 20) {

		uni.requestPayment({
			provider: 'wxpay',
			timeStamp: result.data.payment.timeStamp,
			nonceStr: result.data.payment.nonceStr,
			package: 'prepay_id=' + result.data.payment.prepay_id,
			signType: 'MD5',
			paySign: result.data.payment.paySign,
			success: res => {
				//如果是活动报名  在这里调用发货管理
				if (result.data.type && result.data.type == "activity") {
					setTimeout(function() {
						self._post('plus.activity.activity/sync_fahuo', {
							activity_record_id: result.data.order_id
						}, function(res) {});
					}, 6000)
				
				} else { //普通顶订单调用发货管理
					console.log("result.data.order_id", result.data.order_id)
					setTimeout(function() {
						self._post('order.order/sync_fahuo', {
							order_id: result.data.order_id
						}, function(res) {});
					}, 6000)
				}
				paySuccess(result, self, success);
				uni.hideLoading()
			},
			fail: res => {
				uni.hideLoading()
				self.showError(self.$nw('订单未支付成功'), () => {
					uni.removeStorage({
						key: "payData"
					})
					payError(result, fail);
				});
			},
		});
	}

	// 汇付支付
	if (result.data.pay_type == "huifu_alipay_app") {
		plus.runtime.openURL(result.data.payment.expend.pay_info);
	}
	
	if (result.data.pay_type == "huifu_alipay_h5") {
		window.location.href = result.data.payment.mweb_url
	}

	if (result.data.pay_type == "huifu_alipay_wap") {
		//跳转支付页面显示支付宝二维码
		
			console.log("huifu_alipay_wap",result.data)
			if(result.data.pay_status== 20){
				paySuccess(result, self, success);
			}else{
				self.showError(self.$nw('订单未支付成功'), () => {
					uni.removeStorage({
						key: "payData"
					})
					payError(result, fail);
				});
			}
			

			
	}
	if (result.data.pay_type == "huifu_wxmp") {
		uni.showLoading({
			title: "支付中..."
		})
		WeixinJSBridge.invoke('getBrandWCPayRequest', JSON.parse(result.data.payment.expend.pay_info),
			function(res) {
				uni.showLoading({
					title: "支付中..."
				})
				if (res.err_msg == "get_brand_wcpay_request:ok") {
					paySuccess(result, self, success);
				} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
					uni.hideLoading()
					self.showSuccess('支付取消', () => {
						
						payError(result, fail);
					});
				} else {
					uni.hideLoading()
					self.showError(self.$nw('订单未支付成功'), () => {
						uni.removeStorage({
							key: "payData"
						})
						payError(result, fail);
					});
				}
				
			}
		);
	}

	if (result.data.pay_type == "huifu_wxmn" 
	|| result.data.pay_type == 60) {

		var obj = JSON.parse(result.data.payment.expend.pay_info);

		uni.requestPayment({
			provider: 'wxpay',
			timeStamp: obj.timeStamp,
			nonceStr: obj.nonceStr,
			package: obj.package,
			signType: 'MD5',
			paySign: obj.paySign,
			success: res => {
				paySuccess(result, self, success);
				uni.hideLoading()
			},
			fail: res => {
				uni.hideLoading()
				self.showError(self.$nw('订单未支付成功'), () => {
					uni.removeStorage({
						key: "payData"
					})
					payError(result, fail);
				});
			},
		});
	}

}

/*跳到支付成功页*/
function paySuccess(result, self, success) {
	if(success){
		success(result);
		return;
	}
	gotoSuccess(result);
}
/*跳到支付成功页*/
function gotoSuccess(result) {
	uni.reLaunch({
		url: '/main/pages/order/pay-success/pay-success?order_id=' + result.data.order_id
	});
}

/*支付失败跳订单详情*/
function payError(result, fail) {
	if(fail){
		fail(result);
		return;
	}
	uni.redirectTo({
		url: '/main/pages/order/order-detail/order-detail?order_id=' + result.data.order_id
	});
}
