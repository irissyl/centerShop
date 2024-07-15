<template>
	<view class="login-container">
		<view class="log">
			<!-- <img class="logimg" src="../../../static/img/log.png" mode=""></img> -->
			<image class="logimg" src="../../../static/img/log.png" mode=""></image>
			<text class="wz">万商联营</text>
		</view>
		<view class="loginMethod ">
			<view class="dcc checkbox-group">
				<!-- <checkbox :checked="checked" class="checked" ></checkbox> -->
				<u-checkbox-group>
					<u-checkbox v-model="checked" shape="circle" size="25"></u-checkbox>
				</u-checkbox-group>
				<view class="" style="font-size: 20rpx;" @click="f1">
					登录/注册代表你同意<text @click.stop="toPage('/plus2/pages/xieyi/xieyi?code=user')">《万商联营用户服务协议》</text>及<text
						@click.stop="toPage('/plus2/pages/xieyi/xieyi?code=privacy')">《万商联营隐私政策》</text>
				</view>
			</view>
			<button class="dcc sqdl" open-type="getPhoneNumber" @getphonenumber="autho_login">
				手机号快捷登录
			</button>
			<view class="dcc sjh" @click="TIAOZHUAN">
				输入手机号码登录
			</view>
		</view>
		<!-- 其它登陆方式 -->
		<!-- <Login type="pass" v-if="curr_page == 1" ></Login> -->
	</view>
</template>

<script>
	import config from '@/config.js'
	import Login from '@/components/login/login.vue';
	import {
		log
	} from 'util';
	export default {
		components: {
			Login
		},
		data() {
			return {
				checked: false,
				curr_page: 1, //如果当前页面是1  就显示下面选项  不是则不显示
				/*表单数据对象*/
				formData: {
					/*手机号*/
					mobile: '',
					/*密码*/
					pwd: '',
					open_id: "",
				},
				user_id: '',
				is_show: false,
				style_obj: {
					titleBackgroundColor: '#EE1414',
					titleTextColor: '#ffffff'
				},
				is_open_registration: false,
			};
		},
		computed: {
			getbutton() {
				return this.setButton().button
			},
		},
		onLoad(e) {
			this.setGlobalColor()
			let appinfo = uni.getStorageSync('appinfo');
			if (appinfo.is_open_sms) {
				this.is_show = true;
			}
			if (e.user_id) {
				this.user_id = e.user_id
			}
			if (e.mobile) {
				this.formData.mobile = e.mobile
			}
			if (e.open_id) {
				this.formData.open_id = e.open_id
			}
			console.log(e.curr_page);
			if (e.curr_page) {
				this.curr_page = e.curr_page;
			}
			// #ifdef H5
			this.formData.referee_id = e.referee_id ? e.referee_id : uni.getStorageSync("referee_id");
			// #endif

			uni.setNavigationBarTitle({
				title: this.$nw("登录")
			})

		},
		onShow() {
			this.getLanguage(this, function() {})
			let globalStyle = uni.getStorageSync('globalStyle')
			// this.setGlobalColor()
			if (globalStyle) {
				this.style_obj = globalStyle.content ? globalStyle.content : this.style_obj;
				if (this.style_obj.frontColor === 'white') {
					this.style_obj.frontColor = '#ffffff'
				} else if (this.style_obj.frontColor === 'black') {
					this.style_obj.frontColor = '#000000'
				}
			}
			// this.style_obj = this.getGlobalColor() ? this.getGlobalColor() : this.style_obj;
			// console.log(this.style_obj)
			var self = this;
			self.getMinOpenId(self, function(open_id) {
				self.open_id = open_id;
				uni.setStorageSync("open_id", open_id)
			})
			self.getAppInfo()
			if (this.user_id) {
				let userId = this.user_id
				// console.log(userId)
				this._get(
					'user.userweb/autoLogin', {
						'user_id': userId
					},
					result => {
						// 记录token user_id
						uni.setStorageSync('token', result.data.token);
						uni.setStorageSync('user_id', result.data.user_id);
						// 执行回调函数
						// 
						uni.navigateBack();

					},
					false,
					() => {
						uni.hideLoading();
					}
				);
			}



		},

		methods: {
			toPage(url) {
				console.log('url', url)
				uni.navigateTo({
					url: url
				})
			},
			TIAOZHUAN() {
				console.log(155555);
				uni.navigateTo({
					// url: "/main/pages/login/loginCode"
					url: "/main/pages/login/loginMM"
				})
			},

			autho_login(e) { //小程序授权登陆
				console.log(155555);
				if (!this.checked) {
					uni.showToast({
						title: '请勾选服务协议和隐私政策',
						duration: 2000,
						icon: 'none'
					});
					return
				}
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
								console.log(result, self.open_id, 9990, self.formData)
								self.mobile = result.data;

								if (self.open_id) {
									let params = {
										"open_id": self.open_id,
										"referee_id": uni.getStorageSync("referee_id"),
										"mobile": self.mobile,
										"share_user_id": uni.getStorageSync("referee_id")
									}
									console.log('微信登录参数', params);
									self._get(
										'user.userweb/autho_login_wx', params,
										result => {
											uni.setStorageSync('token', result.data.token);
											uni.setStorageSync('user_id', result.data.val);
											uni.setStorageSync('is_displayed_promotion', null)
											setTimeout(e => {
												self.is_back()
											}, 500)
											return;
										})
								} else {
									uni.showToast({
										title: self.$nw("登录失败，请重新登录"),
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
			f1() {
				this.checked = !this.checked
			},
			backMain() {
				uni.reLaunch({
					url: "/pages/index/homePage"
				})
			},
			goBack() {
				uni.navigateTo({
					url: '/pages/index/index'
				});
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

				if (self.formData.pwd == '') {
					uni.showToast({
						title: self.$nw("密码不能为空！"),
						duration: 2000,
						icon: 'none'
					});
					return;
				}

				uni.showLoading({
					title: self.$nw("正在提交")
				});
				let source = 'wx';
				//#ifdef H5
				source = 'h5';
				//#endif
				self.formData.source = source;
				self._post(
					'user.userweb/loginByPwd_n',
					self.formData,
					result => {
						// 记录token user_id
						self.getLanguage(self);
						uni.setStorageSync('token', result.data.token);
						uni.setStorageSync('user_id', result.data.user_id);
						self.is_back()
					},
					false,
					() => {
						uni.hideLoading();
					}
				);
			},
		}
	};
</script>

<style lang="scss" scoped>
	.checkbox-group {
		justify-content: start !important;

		/deep/.u-checkbox__label {
			margin-right: 0rpx !important;
		}
	}

	.login-container {
		padding: 260rpx 32rpx;
	}

	page {
		background-color: #FFFFFF;
	}

	/deep/ .u-checkbox__label {
		width: 10rpx;
		margin: 0;
	}

	.loginMethod {
		.sjh {
			color: #1B94E0;
			font-size: 28rpx;
			width: 686rpx;
			height: 80rpx;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			border: 2rpx solid #1B94E0;
			margin: 0 auto;
		}

		.sqdl {
			font-size: 28rpx;
			color: #FFFFFF;
			width: 686rpx;
			height: 80rpx;
			background: #1B94E0;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			margin: 16rpx auto 24rpx;
		}

		text {
			color: #1B94E0;
		}

		.checked {
			width: 20rpx;
			height: 20rpx;
			position: relative;
			margin-right: 10rpx;
			border-radius: 20rpx;

			/deep/ .uni-checkbox-input {
				border-radius: 20rpx;
				width: 20rpx;
				height: 20rpx;
				position: relative;
			}

			/deep/ .uni-checkbox-wrapper {
				top: 0;
				position: absolute;
			}

			/deep/ .uni-checkbox-input.uni-checkbox-input-checked:before {
				font-size: 28rpx;
			}
		}
	}

	.log {
		.logimg {
			display: block;
			margin: 0 auto 16rpx;
			width: 128rpx;
			height: 128rpx;
		}

		.wz {
			display: block;
			text-align: center;
			color: #333333;
			font-size: 32rpx;
			font-weight: 800;
			margin: 0 auto 144rpx;
		}
	}
</style>