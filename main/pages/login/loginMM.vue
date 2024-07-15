<template>
	<view class="login-container">
		<view class="log">
			<img class="logimg" src="../../../static/img/log.png" mode=""></img>
			<text class="wz">万商联营</text>
		</view>
		<view class="loginMethod ">
			<view class="input code-login-form">
				<u-form :model="form" ref="uForm">
					<u-form-item prop="mobile">
						<u-input placeholder="请输入手机号码" v-model="form.mobile" trim border="true" clearable />
					</u-form-item>
					<u-form-item prop="password">
						<u-input placeholder="请输入密码" v-model="form.password" password-icon trim border="true"
							clearable />
					</u-form-item>
				</u-form>
			</view>
			<view class="dcc xieyi-group">
				<u-checkbox-group>
					<u-checkbox v-model="checked" shape="circle" size="25"></u-checkbox>
				</u-checkbox-group>
				<view class="" style="font-size: 20rpx;" @click="f1">
					登录/注册代表你同意<text @click.stop="toPage('/plus2/pages/xieyi/xieyi?code=user')">《万商联营用户服务协议》</text>及<text
						@click.stop="toPage('/plus2/pages/xieyi/xieyi?code=privacy')">《万商联营隐私政策》</text>
				</view>
			</view>
			<view class="dcc sjh" @click="loginHandle">
				登录
			</view>
			<!-- <view class="" style="font-size: 24rpx;color: #333333;text-align: center;margin-top: 20rpx;"
				@click="TIAOZHUAN">
				验证码登录
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				checked: false,
				form: {
					mobile: '',
					password: ''
				},
				rules: {
					// 字段名称
					mobile: [{
							required: true,
							message: '请输入手机号',
							trigger: ['change', 'blur'],
						},
						{
							// 自定义验证函数，见上说明
							validator: (rule, value, callback) => {
								// 上面有说，返回true表示校验通过，返回false表示不通过
								// this.$u.test.mobile()就是返回true或者false的
								return this.$u.test.mobile(value);
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['change', 'blur'],
						}
					],
					password: [{
						min: 6,
						message: '密码不能少于6位',
						trigger: 'change'
					}]
				}
			};
		},
		onReady() {
			this.$nextTick(() => {
				if (this.$refs.uForm) {
					this.$refs.uForm.setRules(this.rules);
				}
			})
		},
		onLoad(e) {
			this.setGlobalColor()
		},
		onShow() {},

		methods: {
			loginHandle() {
				if (!this.checked) {
					this.tip("请勾选服务协议和隐私政策", 2000);
					return
				}
				if (!this.form.mobile) {
					this.tip("请输入手机号码", 2000);
					return;
				}
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(this.form.mobile)) {
					this.tip("手机号码格式不正确", 2000);
					return;
				}
				if (!this.form.password) {
					this.tip("请输入密码", 2000);
					return;
				}
				if (this.form.password.length < 6) {
					this.tip("密码不能少于6位", 2000);
					return;
				}
				uni.showLoading({
					title: "正在登录",
					mask: true
				});
				this._post('plus.coc.Coc/loginPwd', {
					mobile: '' + this.form.mobile,
					password: '' + this.form.password
				}, (res) => {
					// 记录token user_id
					this.getLanguage(this);
					uni.setStorageSync('token', res.data.token);
					uni.setStorageSync('user_id', res.data.val);
					uni.setStorageSync('is_displayed_promotion',null)
					// this.is_back(1)
					uni.hideLoading()
					uni.navigateBack({
						delta: 2
					})
				})
			},
			TIAOZHUAN() {
				uni.navigateBack()
			},
			toPage(url) {
				console.log('url', url)
				uni.navigateTo({
					url: url
				})
			},
			f1() {
				this.checked = !this.checked
			},

		}
	};
</script>

<style lang="scss" scoped>
	.xieyi-group {
		margin-top: 40rpx;
		justify-content: start !important;

		/deep/.u-checkbox__label {
			margin-right: 0rpx !important;
		}
	}

	.code-login-form {
		/deep/.u-form-item__message {
			padding: 0 !important;
			position: absolute;
			bottom: -10rpx;
		}

		/deep/.u-border-bottom {
			&::after {
				border: none !important;
			}
		}
	}

	.sjh {
		font-size: 28rpx;
		color: #FFFFFF !important;
		width: 686rpx;
		height: 80rpx;
		background: #1B94E0;
		border-radius: 12rpx 12rpx 12rpx 12rpx;
		margin: 16rpx auto 24rpx;
		// margin-top: 30rpx;
	}

	.code {
		line-height: 70rpx;
		border-top-right-radius: 8px;
		border-bottom-right-radius: 8px;
		padding-right: 10rpx;
		width: 200rpx;
		text-align: center;

		.code1 {
			width: 200rpx;
			text-align: center;
			color: #999999;
			font-size: 28rpx;
		}
	}

	/deep/ .u-input--square {
		// border-radius: none !important;
	}

	.login-container {
		padding: 260rpx 32rpx;
	}

	page {
		background-color: #FFFFFF;
	}

	/deep/ .u-input--square {
		background-color: #F3F5F7 !important;
	}

	.loginMethod {

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