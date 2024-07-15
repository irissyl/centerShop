<template>
	<view :class="Visible?'product-popup open':'product-popup close'" @touchmove.stop.prevent="" @click="closePopup">
		<view class="popup-bg"></view>
		<view class="main" v-on:click.stop>
			<view class="body p30">
				<view class="group-bd">
					<view class="form-level d-s-c" v-if="activity.reject_val && activity.reject_val != null">
						<view class="d-s-c field-name">
							<text class="gray3">{{$nw("上一次不通过原因")}}：</text>
						</view>
						<view class="val flex-1" >
							{{activity.reject_val}}
						</view>
					</view>
					<view class="form-level d-s-c" style="margin-top: 40rpx;">
						<view class="field-name">
							<text class="orange">*</text>
							<text class="gray3">{{$nw("取消原因")}}：</text>
						</view>
						<view class="val" style="width:500rpx;">
							<textarea type="text" v-model="remark.name" :placeholder="$nw('请填写取消原因')"></textarea>
						</view>
					</view>
					
					<view class="">
						{{$nw('实际退款金额')}}：{{$nw(price.refund_price)}}，{{$nw('扣除手续费')}}：{{$nw(price.kouchu_price)}}
						<text v-if="price.kouchu_price != '待定'">元</text>
						
					</view>
				</view>

			</view>

			<view style="height: 50rpx;width: 100%;">

			</view>

			<view class="btns">
				<button type="primary" class="confirm-btn" @click="confirmFunc()">{{$nw("确认取消")}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		pay
	} from '@/common/pay.js';
	import payOptions from "@/components/order/payOptions";
	export default {
		components: {
			payOptions
		},
		data() {
			return {
				/*支付方式*/
				pay_type: 20,
				/*是否可见*/
				Visible: false,
				/*表单对象*/
				remark: {
					name: '',
					mobile: '',
					remark: '',
					num: 1,
					time_bucket_id: ""
				},
				/*支付方式*/
				pay_type: "",
				pay_num: 10,
				payment_id: "",
				payTypeList: [],
				time_bucket: [],
				price:{}
			}

		},
		props: ['isPopup', 'activity', 'listData'],
		watch: {
			'isPopup': function(n, o) {
	
				if (n != o) {
					this.Visible = n;
				}
			}
		},
		mounted() {
			var self = this;
			//获取支付方式
			self.getPaymentList(self, function(res) {
				console.log(res)
				self.payTypeList = res
				//当未选择支付方式 默认赋值第一个
				self.payment_id = res[0].payment_id
				self.pay_type = res[0].value
				// self.pay_num = res[0].value
			})

			//获取场次
			self._post('plus.activity.activity/getActivityTimebucket', {
				activity_id: self.activity.activity_id
			}, function(res) {
				console.log("res.data",res.data);
				self.time_bucket = res.data.val
				self.price = res.data.price
			})
		},

		methods: {
			time_bucket_click(index) {
				console.log(1111, index, this.time_bucket)
				this.time_bucket.forEach(function(res) {
					res.flag = false;
				})
				this.time_bucket[index].flag = true;
			},
			// 选择支付方式触发
			checkedPayType(e) {
				console.log("e", e)
				// this.pay_num = parseInt(e.value)
				this.pay_type = parseInt(e.value)
				this.payment_id = e.payment_id
			},
			/*关闭弹窗*/
			closePopup() {
				this.$emit('close', {})
			},

			/*确认提交*/
			confirmFunc() {
				var self = this
				if (!self.remark.name) {
					uni.showToast({
						title: self.$nw("必填项不可为空"),
						icon: "none"
					})
					return false;
				}
				uni.showModal({
					title:  self.$nw("系统提示"),
					content: self.$nw("是否取消报名？"),
					success(res2) {
						if (res2.confirm) {
							self._get('plus.activity.activity/canel', {
								activity_record_id: self.activity.activity_record_id,
								canel_val: self.remark.name
							}, function(res) {
								uni.showToast({
									title: res.msg
								})
								self.remark.name = ""
								uni.$emit("canel", [])
							});
						}
					}
				});
			},


			/*创建订单*/
			createdOrder() {
				let self = this;
				let param = {};
				self.time_bucket.forEach(function(res) {
					if (res.flag) {
						self.remark.time = res.start_time + "~" + res.end_time
						self.remark.time_bucket_id = res.id
					}
				})


				param.remark = JSON.stringify(self.remark);
				param.activity_id = self.activity.activity_id;
				if (!self.remark.name || !self.remark.mobile || !self.remark.num) {
					uni.showModal({
						title: self.$nw("提示"),
						content: self.$nw("必填项不可为空"),
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return false;
				}
				if (self.remark.num <= 0) {
					uni.showModal({
						title: self.$nw("系统提示"),
						content: self.$nw("至少填写一人"),
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return false;
				}



				if (self.remark.time_bucket_id.length <= 0) {
					uni.showModal({
						title: self.$nw("系统提示"),
						content: self.$nw("请选择场次"),
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log('用户点击确定');
							} else if (res.cancel) {
								console.log('用户点击取消');
							}
						}
					});
					return false;
				}

				// 微信支付
				let pay_source = 'wx';
				// #ifdef  H5
				pay_source = 'mp';
				// #endif
				param.pay_source = pay_source;
				param.pay_type = self.pay_type;
				//免费用余额
				if (self.activity.is_free) {
					param.pay_type = 10;
				}
				//报名
				self._post('plus.activity.activity/signUp', param, function(res) {
					pay(res, self, self.paySuccess, self.payError);
				})

			},
			paySuccess: function(result) {
				this.showSuccess(self.$nw("提交成功"), () => {
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


		}
	}
</script>

<style lang="scss">
	.product-popup {}

	.product-popup .popup-bg {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, .6);
		z-index: 99;
	}

	.product-popup .main {
		position: fixed;
		width: 100%;
		bottom: 0;
		min-height: 200rpx;
		max-height: 1200rpx;
		background-color: #fff;
		transform: translate3d(0, 1280rpx, 0);
		transition: transform .2s cubic-bezier(0, 0, .25, 1);
		bottom: env(safe-area-inset-bottom);
		z-index: 99;
	}

	.product-popup.open .main {
		transform: translate3d(0, 0, 0);
	}

	.product-popup.close .popup-bg {
		display: none;
	}

	.product-popup .header {
		height: 120rpx;
		padding: 10rpx 0 10rpx 250rpx;
		position: relative;
		border-bottom: 1px solid #EEEEEE;
	}

	.product-popup .header .avt {
		position: absolute;
		top: -80rpx;
		left: 30rpx;
		width: 200rpx;
		height: 200rpx;
		border: 2px solid #FFFFFF;
		background: #FFFFFF;
	}

	.product-popup .header .stock {
		font-size: 24rpx;
		color: #999999;
	}

	.product-popup .close-btn {
		position: absolute;
		width: 40rpx;
		height: 40rpx;
		top: 10rpx;
		right: 10rpx;
	}

	.product-popup .price {
		color: $dominant-color;
		font-size: 30rpx;
	}

	.product-popup .price .num {
		padding: 0 4rpx;
		font-size: 50rpx;
	}

	.product-popup .old-price {
		margin-left: 10rpx;
		font-size: 30rpx;
		color: #999999;
		text-decoration: line-through;
	}

	.product-popup .body {
		padding: 20rpx 30rpx;
		max-height: 900rpx;
		overflow-y: auto;
	}

	.product-popup .level-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.product-popup .level-box .key {
		font-size: 24rpx;
		color: #999999;
	}

	.product-popup .level-box .icon-box {
		width: 60rpx;
		height: 60rpx;
		border: 1px solid #DDDDDD;
		background: #f7f7f7;
	}

	.product-popup .num-wrap .iconfont {
		color: #666;
	}

	.product-popup .num-wrap.no-stock .iconfont {
		color: #CCCCCC;
	}

	.product-popup .level-box .text-wrap {
		margin: 0 4rpx;
		height: 60rpx;
		border: 1px solid #DDDDDD;
		background: #f7f7f7;
	}

	.product-popup .level-box .text-wrap input {
		padding: 0 10rpx;
		height: 60rpx;
		line-height: 60rpx;
		width: 80rpx;
		text-align: center;
	}

	.specs .specs-list {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	}

	.specs .specs-list button {
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		font-size: 24rpx;
	}

	.specs .specs-list button:after,
	.product-popup .btns button,
	.product-popup .btns button:after {
		height: 88rpx;
		line-height: 88rpx;
		border: 0;
		border-radius: 0;
	}

	.product-popup .btns .confirm-btn {
		background: $dominant-color;
	}

	// .field-name{
	// 	width: 20%;
	// }
	.body input,
	.body textarea {
		font-size: 20rpx;
	}

	.body input {
		width: 500rpx;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #f3f4f6;
		margin: 10rpx 0;
	}

	.form-level textarea {
		width: 80%;
		font-size: 28rpx;
		height: 68rpx;
		line-height: 34rpx;
		padding: 14rpx 2%;
		resize: none;
		outline: none;
		display: block;
		margin-bottom: 20rpx;
		background: #f4f4f4;
		// border: 1rpx solid #e5e5e5;
	}

	.form-level input {
		width: 80%;
		font-size: 28rpx;
		height: 34rpx;
		line-height: 34rpx;
		padding: 14rpx 2%;
		resize: none;
		outline: none;
		display: block;
		margin-bottom: 20rpx;
		background: #f4f4f4;
	}
</style>