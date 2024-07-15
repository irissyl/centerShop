<template>
	<view class="login-container">
	

		<view class="p30">
			<view class="group-bd">
				<view class="wechatapp" v-if="user_info">
					<view class="header">
						<image :src="user_info.avatarUrl"></image>
					</view>
					<view style="font-size: 30rpx;">{{user_info.nickName}}</view>
				</view>

				<view class="form-level d-s-c">
					<view class="d-s-c field-name">
						<text class="orange">*</text>
						<text class="gray3">{{$nw("手机号")}}：</text>
					</view>
					<view class="val flex-1" style="border-bottom: 1rpx solid #f5f5f5;"><input type="text"
							v-model="formData.mobile" :placeholder="$nw('请填写手机号')" @input="mobile_in" />
					</view>
				</view>
				<view class="form-level d-s-c">

				</view>
			</view>
		</view>
		<view style="color: #CCCCCC;padding-left: 40rpx;">{{code_text}}</view>
		<view class="btns p30"><button
				:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
				type="default" @click="formSubmit">下一步</button></view>

	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	export default {
		data() {
			return {
				/*表单数据对象*/
				formData: {
					/*手机号*/
					mobile: '',
				},
				user_id: '',
				change_secret: '',

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
				is_open_registration: false,
				user_info: null
			};
		},
		computed: {
			getbutton() {
				return this.setButton().button
			},
		},
		onLoad(e) {
			this.setGlobalColor()
			this.user_id = e.user_id
			this.change_secret = e.change_secret
			this.getAppInfo()
			let scene = utils.getSceneData(e);
			
			this.referee_id = e.referee_id ? e.referee_id : scene.uid;
			uni.setStorage({
				key:"referee_id",
				data:this.referee_id 
			})
		
			
		},
		onShow() {
				this.login("/user/pages/index/index", [])
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
			var self =this;
			self._get(
				'user.userweb/scanuserid',
				{
				user_id:uni.getStorageSync('user_id')	
				},
				result => {
					if(result.data == null){
						uni.removeStorageSync("user_id")
					}
				})

		},
		methods: {
			mobile_in(e) {
				var self = this;
				var mobile = e.detail.value;
				self.formData.mobile = mobile;
				if (mobile.length >= 11) {
					self._get(
						'user.userweb/scanlogin',
						self.formData,
						result => {
							self.user_info = result.data.val
							console.log(result.data.val)
						})
				}

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

				//判断是否已经登陆
				this.user_id = uni.getStorageSync('user_id')
				console.log("this.user_id", this.user_id)
				if (this.user_id) {

					uni.navigateTo({
						url: "/main/pages/login/login?mobile=" + self.formData.mobile
					})
					return;
				}

				uni.showLoading({
					title: self.$nw("正在提交")
				});
				self._post(
					'user.userweb/scanlogin',
					self.formData,
					result => {
						console.log(result)
						if (result.data.val == "reg") { //跳转注册
							uni.navigateTo({
								url: "/user/pages/user/reg?mobile=" + self.formData.mobile
							})
						} else if (result.data.val == "login") {
							uni.navigateTo({
								url: "/main/pages/login/login?mobile=" + self.formData.mobile
							})
						}

					},
					false,
					() => {
						uni.hideLoading();
					}
				);
			},




			getAppInfo() {
				let self = this;
				let platform = self.getPlatform();
				self._get('index/getAppInfo', {
					'platform': platform
				}, function(res) {
					if (res.code == 1) {
						self.code_text = res.data.appinfo.code_msg
						self.is_open_registration = res.data.appinfo.is_open_registration
					}

				});

			},
			// 密码登录页面
			gotoPwd() {
				uni.navigateTo({
					url: '/main/pages/login/login'
				});
			},
			goBack() {
				uni.navigateTo({
					url: '/pages/index/index'
				});
			},
			gotoReg() {
				uni.navigateTo({
					url: '/user/pages/user/reg'
				});
			}
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
		font-size: 30rpx;
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

	.wechatapp .search-referee {
		width: 10%;
		border-left: 1rpx #e3e3e3 solid;
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
</style>
