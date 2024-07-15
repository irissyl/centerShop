<template>
	<view class="login-container">
		<!-- <view class="inaver _30f2b4d"
			:style="'background:'+style_obj.titleBackgroundColor+';color:'+style_obj.titleTextColor">
			<view class="left _30f2b4d" @click="goBack">

				<uni-icons type="arrowleft" :style="'background:'+style_obj.titleBackgroundColor+';color:'+style_obj.titleTextColor" size="24"></uni-icons>
			</view>
			<view class="center _30f2b4d"
				style="text-align: center;margin-top: 20rpx;font-size: 34rpx;margin-right: 100rpx;">

				<text>{{$nw("登录")}}</text>
			</view>

		</view>
		<view class="protect-inaver _30f2b4d">

		</view> -->
		<view class="p30">
			<view class="group-bd">
				<div class="gray3" style="font-size: 26rpx;">{{$nw("若无账号，首次登录将默认注册")}}</div>
				<view class="form-level d-s-c">
					<view class="d-s-c field-name">
						<text class="orange">*</text>
						<text class="gray3">{{$nw("手机号")}}：</text>
					</view>
					<view class="val flex-1"><input type="text" v-model="formData.mobile" 
					:placeholder="$nw('请填写手机号')"
							:disabled="is_send" /></view>
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
		<view style="color: #CCCCCC;padding-left: 40rpx;">{{code_text}}</view>
		<view class="btns p30"><button 
		:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}" 
		type="default" @click="formSubmit">{{$nw("登录")}}</button></view>
<!-- 		<view style="background-color: #FFFFFF;width: 100%;height: 50px;">
			<p v-if="is_open_registration==false" style="float: left;padding: 10px;" @click="gotoReg">{{$nw("注册账号")}}</p>
			<p style="float: right;padding: 10px;" @click="gotoPwd">{{$nw("密码登录")}}</p>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/*表单数据对象*/
				formData: {
					/*手机号*/
					mobile: '',
					/*验证码*/
					code: '',
				},
				user_id: '',
				change_secret:'',
				/*是否已发验证码*/
				is_send: false,
				/*发送按钮文本*/
				send_btn_txt: this.$nw("获取验证码"),
				/*当前秒数*/
				second: 60,
				ip: '',
				code_text: '',
				style_obj: {
					titleBackgroundColor: '#EE1414',
					titleTextColor: '#ffffff'
				},
				back:0,
				// is_open_registration:false
			};
		},
		computed:{
			getbutton() {
				return this.setButton().button
			},
		},
		onLoad(e) {
			this.setGlobalColor()
			this.user_id = e.user_id
			this.change_secret = e.change_secret
			this.getAppInfo()
			this.back = e.back
			uni.setNavigationBarTitle({
				title:this.$nw("登录")
			})
		},
		onShow() {
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

			if (this.user_id) {
				let userId = this.user_id
				let change_secret = this.change_secret
				// console.log(change_secret)
				this._get(
					'user.userweb/autoLogin', {
						'user_id': userId,
						'change_secret': change_secret
					},
					result => {
						// 记录token user_id
						uni.setStorageSync('token', result.data.token);
						uni.setStorageSync('user_id', result.data.user_id);
						// 执行回调函数
						// uni.navigateBack();
						uni.navigateTo({
							url: '/user/pages/index/index'
						});
					},
					false,
					() => {
						uni.hideLoading();
					}
				);
			}

		},

		methods: {
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
					title:self.$nw("正在提交")
				});
				self.formData.referee_id = uni.getStorageSync("referee_id");
				self._post(
					'user.userweb/login',
					self.formData,
					result => {
						self.getLanguage(self);
						// 记录token user_id
						uni.setStorageSync('token', result.data.token);
						uni.setStorageSync('user_id', result.data.user_id);
						// 执行回调函数
						uni.navigateBack();
						
						let routes = getCurrentPages(); // 获取当前打开过的页面路由数组
						let curRoute = routes[routes.length-2].route // 获取当前页面路由，也就是最后一个打开的页面路由
						console.log(curRoute)
						uni.navigateBack({
							delta: 1
						});
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

			getAppInfo() {
				let self = this;
				let platform = self.getPlatform();
				self._get('index/getAppInfo', {
					'platform': platform
				}, function(res) {
					if (res.code == 1) {
						self.code_text = res.data.appinfo.code_msg
						// self.is_open_registration = res.data.appinfo.is_open_registration
					}

				});

			},
			// 密码登录页面
			// gotoPwd() {
			// 	uni.navigateTo({
			// 		url: '/main/pages/login/login'
			// 	});
			// },
			// goBack() {
			// 	uni.navigateTo({
			// 		url: '/pages/index/index'
			// 	});
			// },
			// gotoReg(){
			// 	uni.navigateTo({
			// 		url: '/user/pages/user/reg'
			// 	});
			// }
		}
	};
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

	.inaver._30f2b4d {
		box-sizing: border-box;
		// padding-top: 44rpx;
		width: 100vw;
		height: 100rpx;
		display: flex;
		position: fixed;
		z-index: 5000;
		top: 0;
		left: 0;
	}

	.inaver .left._30f2b4d {
		width: 100rpx;
		// height: 100rpx;
		margin: 8rpx;
	}

	.inaver .left image.icon._30f2b4d {
		// width: 60rpx;
		// height: 60rpx;
		// padding: 10rpx;
		// margin: 10rpx;
	}

	.inaver .center._30f2b4d {
		height: 50rpx;
		// line-height: 50rpx;
		flex: 1;
		margin: 8rpx;
	}

	.inaver .right._30f2b4d {
		width: 240rpx;
		height: 100rpx;
		margin: 8rpx;
	}

	.protect-inaver._30f2b4d {
		box-sizing: border-box;
		width: 100vw;
		height: 120rpx;

	}
</style>
