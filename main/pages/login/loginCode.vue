<template>
	<view class="login-container">
		<view class="log">
			<img class="logimg" src="../../../static/img/log.png" mode=""></img>
			<text class="wz">万商联营</text>
		</view>
		<view class="loginMethod ">
			<view class="input code-login-form">
				<u-form :model="form" ref="uForm">
					<u-form-item class="phone-item" prop="mobile">
						<u-input class="phone-inp" placeholder="请输入手机号码" v-model="form.mobile" trim border="true"
							clearable />
						<view class="code" style="background-color: #F3F5F7;" @click="codeChange">
							<text class="code1">{{text}}</text>
							<!-- <text class="code1" v-show="!flg">{{time}}</text> -->
						</view>
						<!-- <u-toast ref="uToast"></u-toast> -->
						<!-- <u-verification-code :seconds="seconds" @end="end" @start="start" ref="uCode"
							@change="codeChange"></u-verification-code> -->

					</u-form-item>
					<u-form-item prop="code">
						<u-input placeholder="请输入验证码" v-model="form.code" trim border="true" clearable />
					</u-form-item>
				</u-form>
			</view>
			<view class="dcc sjh">
				登录
			</view>
			<view class="" style="font-size: 24rpx;color: #333333;text-align: center;margin-top: 20rpx;"
				@click="TIAOZHUAN">
				账号密码登录
			</view>
		</view>
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
				text: '获取验证码',
				flg: true,
				time: 60,
				// refCode: null,
				seconds: 10,
				form: {
					mobile: '',
					code: ''
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
					code: [{
						min: 4,
						message: '验证码不能少于4个字',
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
		methods: {
			TIAOZHUAN() {
				console.log(155555);
				uni.navigateTo({
					url: "/main/pages/login/loginMM"
				})
			},
			codeChange(text) {
				if (this.text == '重新获取验证码' || this.text == '获取验证码') {
					this.HQcode()
				}
			},
			HQcode() {
				this.text = 60
				let tmie = setInterval(e => {
					this.text--
					if (this.text <= 0) {
						this.text = '重新获取验证码'
						clearInterval(tmie)
					}
				}, 1000)
			}
		},
		computed: {},
		onLoad(e) {
			this.setGlobalColor()


		},
		onShow() {




		},


	};
</script>

<style lang="scss" scoped>
	.code-login-form {
		/deep/.u-form-item__message {
			padding: 0 !important;
			position: absolute;
			bottom: -10rpx;
		}
	}

	.phone-item {
		/deep/ input {
			width: 400rpx;
			flex: none !important;
		}

		.code {
			position: absolute;
			top: 50%;
			right: 0;
			transform: translateY(-50%);
			background: none !important;
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
		.sjh {
			color: #1B94E0;
			font-size: 28rpx;
			width: 686rpx;
			height: 80rpx;
			border-radius: 12rpx 12rpx 12rpx 12rpx;
			border: 2rpx solid #1B94E0;
			margin: 0 auto;
			margin-top: 40rpx;
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