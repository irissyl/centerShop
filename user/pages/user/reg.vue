<template>
	<view class="login-container">
	<!-- 	<view class="inaver _30f2b4d"
			:style="'background:'+style_obj.titleBackgroundColor+';color:'+style_obj.titleTextColor">
			<view class="left _30f2b4d" @click="goBack">
				<uni-icons type="arrowleft"
					:style="'background:'+style_obj.titleBackgroundColor+';color:'+style_obj.titleTextColor" size="24">
				</uni-icons>
			</view>
			<view class="center _30f2b4d"
				style="text-align: center;margin-top: 20rpx;font-size: 34rpx;margin-right: 100rpx;">
				<text>{{$nw("注册")}}</text>
			</view>
		</view>
		<view class="protect-inaver _30f2b4d">

		</view> -->
		<view class="p30">
			<view class="group-bd">
				<view class="form-level d-s-c">
					<view class="d-s-c field-name">
						<text class="orange">*</text>
						<text class="gray3">{{$nw("邀请码")}}：</text>
					</view>
					<view class="val flex-1"><input type="text" v-model="formData.referee_id"
							:placeholder="$nw('请填写邀请码')" /></view>
				</view>
				<view class="form-level d-s-c">
					<view class="d-s-c field-name">
						<text class="orange">*</text>
						<text class="gray3">{{$nw("手机号")}}：</text>
					</view>
					<view class="val flex-1"><input type="text" v-model="formData.mobile"
							:placeholder="$nw('请填写手机号')" /></view>
				</view>
				<view class="form-level d-s-c">
					<view class="d-s-c field-name">
						<text class="orange">*</text>
						<text
							class="gray3">{{$nw("密")}}&nbsp;&nbsp;&nbsp;{{$nw("码")}}：</text>
					</view>
					<view class="val flex-1"><input type="text" password="true" v-model="formData.pwd"
							:placeholder="$nw('请填写密码')" /></view>
				</view>
			</view>
		</view>
		<view class="btns p30"><button :style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"  type="default"
				@click="formSubmit">{{$nw("注册")}}</button></view>
	<!-- 	<view style="background-color: #FFFFFF;width: 100%;height: 50px;">
			<p style="float: left;padding: 10px;" @click="gotoPwd">{{$nw("密码登陆")}}</p>
			<p style="float: right;padding: 10px;" @click="gotoCode" v-if="is_show">
				{{$nw("验证码登录")}}</p>
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
					/*密码*/
					pwd: '',
				},
				user_id: '',
				is_show: false,
				style_obj: {
					titleBackgroundColor: '#EE1414',
					titleTextColor: '#ffffff'
				},
				/*开启强制绑定上级*/
				is_open_bindReferee: false,
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
			this.referee_id = e.referee_id ? e.referee_id : uni.getStorageSync('referee_id');
			let appinfo = uni.getStorageSync('appinfo');
			if (appinfo.is_open_sms) {
				this.is_show = true;
			}
			if(e.mobile){
				this.formData.mobile = e.mobile;
			}
			this.formData.referee_id = this.referee_id;
			this.getData()
			
		},
		onShow() {
			let globalStyle = uni.getStorageSync('globalStyle')
			if (globalStyle) {
				this.style_obj = globalStyle.content ? globalStyle.content : this.style_obj;
				if (this.style_obj.frontColor === 'white') {
					this.style_obj.frontColor = '#ffffff'
				} else if (this.style_obj.frontColor === 'black') {
					this.style_obj.frontColor = '#000000'
				}
			}
		},
		methods: {
			// 获取登陆前的一些参数
			getData() {
				let self = this
				uni.showLoading({
					// title: ''
				});
				self._post(
					'user.userweb/loginParams', {},
					result => {
						self.is_open_bindReferee = result.data.settings.is_open_bindReferee || false
					},
					false,
					() => {
						uni.hideLoading();
					}
				);
			},
			goBack() {
				uni.navigateTo({
					url: '/pages/index/index'
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
				if (self.is_open_bindReferee && !self.formData.referee_id) {
					uni.showToast({
						title: self.$nw("请填写邀请码"),
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				let params = self.formData;
				params.type = 'reg'
				params.source = "h5"
				uni.showLoading({
					title: self.$nw("正在提交")
				});
				let url = 'user.userweb/reg'
				// if (self.is_open_bindReferee) {
				// 	url = 'user.userweb/loginByPwdReferee'
				// }
				self._post(
					url,
					params,
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
			},
			// 验证码登录页面
			gotoCode() {
				uni.navigateTo({
					url: '/main/pages/login/weblogin'
				});
			},
			gotoPwd() {
				uni.navigateTo({
					url: '/main/pages/login/login'
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
