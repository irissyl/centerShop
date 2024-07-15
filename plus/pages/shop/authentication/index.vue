<template>
	<scroll-view scroll-y="true" class="authentication-index scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50">
		<view class="authentication-index-content">
			<view class="step-group flex-c" :class="{'active' : id_card_status == 3 || bank_status == 1}">
				<view class="step-item" :class="{'active' : id_card_status == 3}">
					<view class="step-icon flex-c">
						<image class="icon-img"
							src="https://shanghui.client.xcx008.com/file/uploads/20240625/acea3dbcb44848030f18ebe95ecb90b2.png"
							mode="aspectFill"></image>
					</view>
					<view class="label">
						身份认证
					</view>
				</view>
				<view class="step-item" :class="{'active' : bank_status == 1}">
					<view class="step-icon flex-c">
						<image class="icon-img"
							src="https://shanghui.client.xcx008.com/file/uploads/20240625/da57d3d5e088e61c0f5781a911dd39a4.png"
							mode="aspectFill"></image>
					</view>
					<view class="label">
						银行卡绑定
					</view>
				</view>
			</view>

			<view class="authentication-status">
				<view class="status-label">
					{{statusFormat()}}
				</view>
				<view class="status-img">
					<image class="common-img"
						src="https://shanghui.client.xcx008.com/file/uploads/20240625/92a06cb2e1ee6509ea19bbedfa35fd62.png"
						mode="aspectFill"></image>
				</view>
			</view>

			<view v-if="id_card_status != 3" class="authentication-btn flex-c"
				@click="toPage('/plus/pages/shop/authentication/idcard')">
				<!-- 前往身份认证 -->
				去认证
			</view>
			<view v-else-if="bank_status != 1" class="authentication-btn flex-c"
				@click="toPage('/plus/pages/shop/authentication/edit_bankcard')">
				<!-- 前往绑定银行卡 -->
				去绑卡
			</view>
			<view v-else class="authentication-btn flex-c" @click="backHandle()">
				<!-- 前往绑定银行卡 -->
				完成
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				loadding: false,
				scrollviewHigh: 0, //滚动区域高度
				step: 2,
				id_card_status: null, //绑定身份证状态 1、未认证 2、认证失败 3、认证通过
				bank_status: null, //绑银行卡状态，1已绑，2未绑
			}
		},
		onLoad() {
			let _this = this
			// 设置全局颜色
			_this.setGlobalColor({
				bgc: '#fff'
			})
			uni.setNavigationBarTitle({
				title: _this.$nw('商户认证'),
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
		},

		onShow() {
			this.getMerchantAuth()
		},

		methods: {
			// 获取商户认证状态
			getMerchantAuth() {
				this.loading = true
				uni.showLoading({
					title: this.$nw("加载中"),
					mask: true
				});
				this._get('user.user/getMerchantAuth', {}, (res) => {
					this.id_card_status = res.data.id_card_status
					this.bank_status = res.data.bank_status
					this.loading = false;
					uni.hideLoading()
				}, (err) => {
					this.loading = false;
					uni.hideLoading()
				})
			},
			statusFormat() {
				if (this.id_card_status != 3) {
					return '请先完成商户身份认证'
				}

				if (this.bank_status != 1) {
					return '请继续完成银行卡绑定'
				}

				return '商户认证已完成'
			},
			toPage(url) {
				uni.navigateTo({
					url
				})
			},
			backHandle() {
				uni.navigateBack()
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
			},
		},
	}
</script>

<style lang="scss" scoped>
	.authentication-index {
		background: #fff;
		position: relative;

		.authentication-index-content {
			min-height: 100%;
			position: relative;
			padding: 32rpx 24rpx;
			position: relative;

			.step-group {
				justify-content: center;
				position: relative;

				.step-item {
					width: 140rpx;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.step-icon {
						width: 64rpx;
						height: 64rpx;
						border-radius: 50%;
						justify-content: center;
						background: #D9D9D9;

						.icon-img {
							width: 48rpx;
							height: 48rpx;

						}
					}

					.label {
						color: #999;
						line-height: 44rpx;
						margin-top: 8rpx;
					}

					&.active {
						.step-icon {
							background: #1B94E0;
						}

						.label {
							color: #1B94E0;
						}
					}

					&:last-of-type {
						margin-left: 130rpx;
					}
				}

				&::before {
					content: '';
					width: 160rpx;
					height: 2rpx;
					background: #D9D9D9;
					border-radius: 10rpx;
					position: absolute;
					top: 32rpx;
					left: 50%;
					transform: translateX(-50%);
				}

				&.active::before {
					background: #1B94E0;
				}
			}

			.authentication-status {
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				margin-top: 48rpx;

				.status-label {
					font-size: 32rpx;
					line-height: 44rpx;
				}

				.status-img {
					width: 528rpx;
					height: 528rpx;
				}
			}

			.authentication-btn {
				width: 702rpx;
				height: 80rpx;
				background: #1B94E0;
				justify-content: center;
				border-radius: 8rpx;
				font-weight: 500;
				color: #fff;
				position: absolute;
				bottom: calc(50rpx + env(safe-area-inset-bottom) / 2);
			}
		}
	}
</style>