<template>
	<view class="login-container">

		<view class="p30">
			<view class="group-bd">
				<div class="gray3" style="font-size: 26rpx;">{{$nw("若无账号，首次登录将默认注册")}}</div>
				<view class="form-level d-s-c" >
					<view class="d-s-c field-name">
						<text class="orange"></text>
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
						<text class="gray3">{{$nw("密")}}&nbsp;&nbsp;&nbsp;{{$nw("码")}}：</text>
					</view>
					<view class="val flex-1"><input type="text" password="true" v-model="formData.pwd"
							:placeholder="$nw('请填写密码')" /></view>
				</view>
			</view>
		</view>
		<view class="btns p30"><button
				:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
				type="default" @click="formSubmit">
				{{$nw("登陆")}}
			</button></view>
		<view v-if="curr_page == 1" style="background-color: #FFFFFF;width: 100%;height: 50px;">
			<!-- <p v-if="is_open_registration==false" style="float: right;padding: 10px;" @click="gotoReg">
				{{$nw("注册")}}</p> -->
				<p  style="float: right;padding: 10px;" @click="backMain">
					{{$nw("返回首页")}}
				</p>
		</view>
		<!-- 其它登陆方式 -->
		<Login type="pass" v-if="curr_page == 1" ></Login>
	</view>
</template>

<script>
	import config from '@/config.js'
	import Login from '@/components/login/login.vue';
	export default {
		components: {
			Login
		},
		data() {
			return {
				curr_page:1,//如果当前页面是1  就显示下面选项  不是则不显示
				/*表单数据对象*/
				formData: {
					/*手机号*/
					mobile: '',
					/*密码*/
					pwd: '',
					open_id:"",
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
			if(e.user_id){
				this.user_id = e.user_id
			}
			if (e.mobile) {
				this.formData.mobile = e.mobile
			}
			if(e.open_id){
				this.formData.open_id = e.open_id
			}
			console.log(e.curr_page);
			if(e.curr_page){
				this.curr_page = e.curr_page;
			}
			// #ifdef H5
				this.formData.referee_id = e.referee_id?e.referee_id: uni.getStorageSync("referee_id");
			// #endif
			
			uni.setNavigationBarTitle({
				title:this.$nw("登录")
			})
			
		},
		onShow() {
			this.getLanguage(this,function(){})
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
			backMain(){
				uni.reLaunch({
					url:"/pages/index/homePage"
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
