<template>
	<scroll-view :style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'" 
	style=" height:100%;overflow:hidden;"
	>
		
		<view class="login-container" >
		
			<view class="wechatapp">
				<view class="header">
					<!-- <open-data class="" type="userAvatarUrl"></open-data> -->
					<image :src="app.logo.file_path" mode=""></image>
				</view>
				<view class="auth-title"
				  :style="'color:'+getMainTextColor()+';'"
				 style="text-align: center;margin-top: 40rpx;">{{app.name}}</view>
			</view>
		
			<!-- #ifdef MP-WEIXIN -->
			
			<button
				:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
				open-type="getPhoneNumber" class="btn-normal"
				@getphonenumber="autho_login" 
				style="height: 90rpx;line-height: 90rpx;font-size: 34rpx;border-radius: 45rpx;">{{$nw("授权登录")}}</button>
			
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<button
				:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#fff'}"
				open-type="getUserInfo" class="autho_login" @click="autho_login_mp"
				lang="zh_CN" style="height: 90rpx;line-height: 90rpx;font-size: 34rpx;border-radius: 45rpx;">{{$nw("授权登录")}}</button>
			<!-- #endif -->
			<view style="width: 100%;height: 50px;">
				<!-- 	<p v-if="is_open_registration==false" style="float: right;padding: 10px;" @click="gotoReg">
					{{$nw("注册")}}
				</p> -->
				<p style="float: right;padding: 10px;" :style="'color:'+getTextColorWhite()+';'" @click="backMain">
					{{$nw("返回首页")}}
				</p>
			
			</view>
			<!-- 其它登陆方式 -->
			<Login type="autho"></Login>
		</view>
	</scroll-view>
	
</template>

<script>
	import Login from '@/components/login/login.vue';
	import {
		pay
	} from '@/common/pay.js';
	export default {
		components: {
			Login
		},
		data() {
			return {
				background: '',
				listData: [],
				kmd_mask: false,
				kmd_phone: false,
				userData: [],
				app: {},
				code: "",
				is_open_registration: false,
				open_id: "",
				mobile: "",
				scrollviewHigh:0
			}
		},
		onShow() {
			var self = this;
			// #ifdef MP-WEIXIN
			wx.login({
				success(res) {
					self.code = res.code;
				}
			})
			self.getMinOpenId(self, function(open_id) {
				self.open_id = open_id;
				uni.setStorageSync("open_id", open_id)
			})
			// #endif
			uni.getSystemInfo({
				success(res) {
					self.scrollviewHigh = res.windowHeight;
				}
			});
			
		},
		computed: {
			getbutton() {
				return this.setButton().button
			}
		},
		onLoad(e) {
			var self = this;
			this.setGlobalColor()

			self.open_id =uni.getStorageSync("open_id")
			this.getAppInfo()
			// #ifdef H5
			if (self.isWeixn()) {
				self.code = self.getUrlCode().code
			}
			// #endif
			//获取商城信息
			self._post('user.user/getApp', {

			}, result => {
				self.app = result.data
			}, false, () => {
				uni.hideLoading();
			});
		},
		methods: {
			backMain() {
				uni.reLaunch({
					url: "/pages/index/homePage"
				})
			},
			autho_login_mp() { //公众号授权登陆
			
				let self = this;
				if (self.isWeixn()) {
					console.log(self.code)
					if (self.code) {
						self._post(
							'auth.WxMn/getOpenId', {
								wx_code: self.code
							},
							result => {
								let open_id = result.data.openid;
								if (open_id) {
									self._get(
										'user.userweb/autho_login', {
											"open_id": open_id,
											"referee_id": uni.getStorageSync("referee_id")
										},
										result => {
											console.log(result.data)
											if (result.data.code == "pass") { //跳转密码登录
												uni.showToast({
													title: self.$nw("未绑定账号，请先绑定账号"),
													icon: "none"
												})
												setTimeout(function() {
													console.log(result.data.page)
													uni.navigateTo({
														url: result.data.page
													})
													return;
												}, 1500)


											} else if (result.data.code == "index") { //直接登录跳转首页
												
												//记录token user_id
												uni.setStorageSync('token', result.data.token);
												uni.setStorageSync('user_id', result.data.val);
												self.is_back()
	
												return;
											}
										})
								} else {
									uni.showToast({
										title: self.$nw("登陆失败"),
										duration: 2000,
										icon: 'none'
									});
									return;
								}
							})
					} else {
						uni.showToast({
							title: self.$nw("登陆失败,请重新尝试登陆"),
							duration: 2000,
							icon: 'none'
						});
						return;
					}


				}
			},
			autho_login(e) { //小程序授权登陆
				var self = this;
				if (e.detail.errMsg !== 'getPhoneNumber:ok') {
					return false;
				}
				uni.showLoading({
					title: self.$nw("正在处理"),
					mask: true
				});
				wx.login({
					success: function(res) {
						if (res.code) {
							//获取手机号
							self._post('user.userweb/getPhone', {
								code: res.code,
								encrypted_data: encodeURIComponent(e.detail.encryptedData),
								iv: encodeURIComponent(e.detail.iv),
							}, result => {
							// 执行回调函数
							console.log(result)
							self.mobile = result.data;

							if (self.open_id) {
								self._get(
									'user.userweb/autho_login_wx', {
										"open_id": self.open_id,
										"referee_id": uni.getStorageSync("referee_id"),
										"mobile": self.mobile
									},
									result => {
										uni.setStorageSync('token', result.data.token);
										uni.setStorageSync('user_id', result.data.val);
										self.is_back()
										return;
									})
							} else {
								uni.showToast({
									title:self.$nw("登录失败，请重新登录"),
									duration: 2000,
									icon: 'none'
								});
								return;
							}
							}, false, (e) => {
								uni.hideLoading();
								console.log(e)
							});
						}
					},
				})
			},
			gotoReg() {
				uni.navigateTo({
					url: "/user/pages/user/reg"
				})
			},
			getAppInfo() {
				let self = this;
				let platform = self.getPlatform();
				self._get('index/getAppInfo', {
					'platform': platform
				}, function(res) {
					if (res.code == 1) {
						self.is_open_registration = res.data.appinfo.is_open_registration
					}

				});

			},
		},
	}
</script>

<style>
	

	.autho_login {
		height: 88rpx;
		line-height: 88rpx;
		background: #04be01;
		color: #fff;
		font-size: 30rpx;
		border-radius: 999rpx;
		text-align: center;
	}

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
</style>
