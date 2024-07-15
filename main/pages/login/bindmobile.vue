<template>
	<view class="login-container">
		<!-- #ifdef MP-WEIXIN -->
		<view class="wechatapp">
			<view class="header">
				<open-data class="" type="userAvatarUrl"></open-data>
			</view>
		</view>
		<view class="auth-title">{{$nw("申请获取以下权限")}}</view>
		<view class="auth-subtitle">{{$nw("为了为您提供更优质的服务，我们需要获得你的手机号")}}
		</view>
		<view class="login-btn">

			<button :style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
				open-type="getPhoneNumber" class="btn-normal"
				@getphonenumber="getPhoneNumber">{{$nw("授权获取")}}</button>

		</view>
		<view class="no-login-btn">
			<button class="btn-normal" @click="onNotLogin">{{$nw("暂不授权")}}</button>
		</view>
		<!-- #endif -->
		<!-- 非小程序 -->
		<!-- #ifndef  MP-WEIXIN -->
		<view class="p30">
			<view class="group-bd">
				<view class="form-level d-s-c">
					<view class="d-s-c field-name">
						<text class="orange">*</text>
						<text class="gray3">{{$nw("手机号")}}：</text>
					</view>
					<view class="val flex-1"><input type="text" v-model="formData.mobile"
							:placeholder="$nw('请填写手机号')" :disabled="is_send" /></view>
				</view>
				<view class="form-level d-s-c">
					<view class="d-s-c field-name">
						<text class="orange">*</text>
						<text class="gray3">{{$nw("验证码")}}：</text>
					</view>
					<view class="val flex-1 d-b-c">
						<input class="flex-1" type="number" v-model="formData.code"
							:placeholder="$nw('请填写验证码')" />
						<button class="get-code-btn" type="default" @click="sendCode"
							:disabled="is_send">{{ send_btn_txt }}</button>
					</view>
				</view>
			</view>
		</view>
		<view class="btns p30"><button :style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
				type="default" @click="formSubmit">{{$nw("绑定手机号")}}</button>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: '',
				listData: [],
				/*表单数据对象*/
				formData: {
					/*手机号*/
					mobile: '',
					/*验证码*/
					code: '',
				},
				user_id: '',
				/*是否已发验证码*/
				is_send: false,
				/*发送按钮文本*/
				send_btn_txt: this.$nw("获取验证码"),
				/*当前秒数*/
				second: 60,
				ip: '',
				code: ""
			}
		},
		computed: {
			getbutton() {
				return this.setButton().button
			},
		},
		onLoad() {
			var self = this;
			wx.login({
				success(res) {
					self.code = res.code;
				}
			})
			this.setGlobalColor()
		},
		methods: {
			onNotLogin: function() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			// #ifdef MP-WEIXIN
			getPhoneNumber(e) {
				var self = this;
				console.log(e.detail);
				if (e.detail.errMsg !== 'getPhoneNumber:ok') {
					return false;
				}
				uni.showLoading({
					title: self.$nw("正在处理"),
					mask: true
				});

				// 发送用户信息
				self._post('user.user/bindMobile', {
					code: self.code,
					encrypted_data: encodeURIComponent(e.detail.encryptedData),
					iv: encodeURIComponent(e.detail.iv),
				}, result => {
					// 执行回调函数
					uni.navigateBack();
				}, false, () => {
					uni.hideLoading();
				});

			},
			// #endif
			/*提交*/
			formSubmit() {
				let self = this;
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.formData.mobile)) {
					uni.showToast({
						title: self.$nw("手机有误,请重填！"),
						duration: 2000,
						icon: 'none'
					});
					return;
				}

				if (self.formData.code == '') {
					uni.showToast({
						title: self.$nw("验证码不能为空！"),
						duration: 2000,
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: self.$nw("正在提交")
				});
				self._post(
					'user.userweb/bindMobile',
					self.formData,
					result => {
						self.showSuccess(result.msg, () => {
							uni.navigateBack();
						});
						// 执行回调函数

					},
					false,
					() => {
						uni.hideLoading();
					}
				);
			},

			/*发送短信*/
			sendCode() {
				let self = this;

				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(self.formData.mobile)) {
					uni.showToast({
						title: self.$nw("手机有误,请重填！"),
						duration: 2000,
						icon: 'none'
					});
					return;
				}

				self._post(
					'user.userweb/sendCode', {
						mobile: self.formData.mobile
					},
					result => {
						if (result.code == 1) {
							uni.showToast({
								title: self.$nw("发送成功")
							});
							self.is_send = true;
							self.changeMsg();
						}
					}
				);
			},

			/*改变发送验证码按钮文本*/
			changeMsg() {
				if (this.second > 0) {
					this.send_btn_txt = this.second + this.$nw("秒");
					this.second--;
					setTimeout(this.changeMsg, 1000);
				} else {
					this.send_btn_txt = this.$nw("获取验证码");
					this.second = 60;
					this.is_send = false;
				}
			},
		},
	}
</script>

<style lang="scss" scoped>
	.login-container {
		background: #ffffff;
	}

	.login-container input {
		height: 88rpx;
		line-height: 88rpx;
	}

	.wechatapp {
		padding: 80rpx 0 48rpx;
		border-bottom: 1rpx solid #e3e3e3;
		margin-bottom: 72rpx;
		text-align: center;
	}

	.wechatapp .header {
		width: 190rpx;
		height: 190rpx;
		border: 2px solid #fff;
		margin: 0rpx auto 0;
		border-radius: 50%;
		overflow: hidden;
		box-shadow: 1px 0px 5px rgba(50, 50, 50, 0.3);
	}

	.auth-title {
		padding: 0 30rpx;
		color: #585858;
		font-size: 34rpx;
		margin-bottom: 40rpx;
	}

	.auth-subtitle {
		padding: 0 30rpx;
		color: #888;
		margin-bottom: 88rpx;
		font-size: 28rpx;
	}

	.login-btn {
		padding: 0 20rpx;
	}

	.login-btn button {
		height: 88rpx;
		line-height: 88rpx;
		background: #04be01;
		color: #fff;
		font-size: 30rpx;
		border-radius: 999rpx;
		text-align: center;
	}

	.no-login-btn {
		margin-top: 20rpx;
		padding: 0 20rpx;
	}

	.no-login-btn button {
		height: 88rpx;
		line-height: 88rpx;
		background: #dfdfdf;
		color: #fff;
		font-size: 30rpx;
		border-radius: 999rpx;
		text-align: center;
	}

	.get-code-btn {
		width: 200rpx;
		height: 80rpx;
		line-height: 76rpx;
		padding: 0rpx 30rpx;
		border-radius: 40rpx;
		white-space: nowrap;
		border: 1rpx solid $dominant-color;
		color: $dominant-color;
		font-size: 30rpx;
	}

	.get-code-btn[disabled='true'] {
		border: 1rpx solid #cccccc;
	}

	.btns button {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 34rpx;
		border-radius: 45rpx;
		background: $dominant-color;
		color: #ffffff;
	}
</style>
