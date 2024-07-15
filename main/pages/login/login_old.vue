<template>
	<view class="login-container">

		<view class="wechatapp">
			<view class="header">
				<!-- <open-data class="" type="userAvatarUrl"></open-data> -->
				<image :src="app.logo.file_path" mode=""></image>

			</view>
			<view class="auth-title" style="text-align: center;margin-top: 40rpx;">{{app.name}}</view>
		</view>

		<view class="login-btn">
			<!-- #ifdef MP-WEIXIN -->

			<button :style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#fff'}"
				open-type="getUserInfo" class="btn-normal" @click="wxGetUserInfo"
				lang="zh_CN">{{$nw("授权登录")}}</button>
			<!-- #endif -->
		</view>
		<view class="no-login-btn">
			<button class="btn-normal" @click="onNotLogin">{{$nw("暂不登录")}}</button>
		</view>
		<!-- 遮罩层 -->
		<view v-if="kmd_mask"
			style="width: 100%;height: 100%;background:gray;position:fixed;top:0;left:0;z-index:50;opacity:0.6;">

		</view>
		<!-- 新增授权弹窗 -->
		<view v-if="kmd_phone"
			style="z-index: 99; border-radius: 10%; width: 80%;height: 9rem;background-color: #FFFFFF;position: fixed;left: 0;right: 0;margin: 0 auto;top: 7rem;">
			<view style="height: 6rem;line-height: 6rem;text-align: center;font-size: 16px;">
				{{$nw("微信授权")}}
			</view>
			<view>
				<button :style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
					style=" width: 90%;margin-left: 5%;border-radius: 999rpx;" class="btn-normal"
					open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
					withCredentials="true">{{$nw("一键授权")}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: '',
				listData: [],
				kmd_mask: false,
				kmd_phone: false,
				userData: [],
				app: {},
				code:""
			}
		},
		onShow() {
			var self = this;
			wx.login({
				success(res) {
					self.code = res.code;
				}
			})
		},
		computed: {
			getbutton() {
				return this.setButton().button
			}
		},
		onLoad() {
			var self = this;
			this.setGlobalColor()

			//获取商城信息
			self._post('user.user/getApp', {

			}, result => {
				console.log("--", result.data);
				self.app = result.data
			}, false, () => {
				uni.hideLoading();
			});
		},
		methods: {
			onNotLogin: function() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			wxGetUserInfo: function(e) {
				let self = this;
				// if (e.detail.errMsg !== 'getUserInfo:ok') {
				// 	return false;
				// }
				// uni.showLoading({
				// 	title: self.$nw("正在登录"),
				// 	mask: true
				// });
				try {
					wx.getUserProfile({
						desc: self.$nw("获取用户信息"),
						success: function(effect) {
							// 执行微信登录

									// console.log(effect)
									// 发送用户信息
									self._post('user.user/login', {
										code: self.code,
										// user_info: e.detail.rawData,
										user_info: effect.rawData,
										encrypted_data: encodeURIComponent(effect
											.encryptedData),
										iv: encodeURIComponent(effect.iv),
										signature: effect.signature,
										referee_id: uni.getStorageSync(
											'referee_id'),
										source: 'wx'
									}, result => {
										// 记录token user_id
										uni.setStorageSync('token', result.data
											.token);
										uni.setStorageSync('user_id', result.data
											.user_id);
										// 执行回调函数
										if (result.data.is_phone) {
											self.kmd_mask = true
											self.kmd_phone = true
										} else {
											uni.navigateBack();
										}

										// uni.navigateBack();
									}, false, () => {
										uni.hideLoading();
									});
						
						}
					});
				} catch (e) {
				
							wx.getSetting({
								success(setting) {
									if (setting.authSetting['scope.userInfo']) {
										wx.getUserInfo({
											success: function(ress) {
												// 发送用户信息
												self._post('user.user/login', {
													code: self.code,
													user_info: ress
														.rawData,
													encrypted_data: encodeURIComponent(
														ress
														.encryptedData
													),
													iv: encodeURIComponent(
														ress
														.iv),
													signature: ress
														.signature,
													referee_id: uni
														.getStorageSync(
															'referee_id'),
													source: 'wx'
												}, result => {
													// 记录token user_id
													uni.setStorageSync(
														'token',
														result.data
														.token);
													uni.setStorageSync(
														'user_id',
														result.data
														.user_id);
													// 执行回调函数
													if (result.data
														.is_phone) {
														self.kmd_mask =
															true
														self.kmd_phone =
															true
													} else {
														uni.navigateBack();
													}

												}, false, () => {
													uni.hideLoading();
												});
											}
										});
									}
								}
							});
					

				}

			},

			getPhoneNumber(e) {
				var self = this;
				if (e.detail.errMsg !== 'getPhoneNumber:ok') {
					self.kmd_mask = false
					self.kmd_phone = false
					uni.navigateBack();
					return false;
				}
				uni.showLoading({
					title: self.$nw("正在处理"),
					mask: true
				});
				// 发送用户信息
				self._post('user.user/phone', {
					encrypted_data: encodeURIComponent(e.detail.encryptedData),
					iv: encodeURIComponent(e.detail.iv),
					user_id: uni.getStorageSync('user_id'),
				}, result => {
					// 执行回调函数
					self.kmd_mask = false
					self.kmd_phone = false

					uni.navigateBack();
				}, false, () => {
					uni.hideLoading();
				});
			},
		},
	}
</script>

<style>
	.login-container {
		padding: 30rpx;
	}

	.wechatapp {
		padding: 80rpx 0 48rpx;
		/* 	border-bottom: 1rpx solid #e3e3e3; */
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

	.wechatapp .header image {
		width: 100%;
		height: 100%;
		border-radius: 50%;


	}

	.auth-title {
		color: #585858;
		font-size: 34rpx;
		margin-bottom: 40rpx;
	}

	.auth-subtitle {
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
</style>
