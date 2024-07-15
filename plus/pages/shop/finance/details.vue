<template>
	<scroll-view scroll-y="true" class="finance-details scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50">
		<view class="finance-details-content">
			<view class="bank-name flex-c">
				<view class="logo flex-c">
					<image class="common-img" :src="bank_info.logo" mode="aspectFill"></image>
				</view>
				<view class="name">
					{{bank_info.bank_name || '--'}}
				</view>
			</view>
			<view class="money">
				￥{{orderData.actual_service_price || '--'}}
			</view>
			<view class="progress-box">
				<!-- <view class="progress-item flex">
					<view class="label">
						创建时间
					</view>
					<view class="value">
						{{orderData.start_time || '--'}}
					</view>
				</view> -->
				<view class="progress-item flex">
					<view class="label">
						提现单据号
					</view>
					<view class="value">
						{{orderData.tg_order_id || '--'}}
					</view>
				</view>
				<view class="progress-item flex">
					<view class="label">
						处理进度
					</view>
					<view class="progress-group">
						<view class="item flex colour">
							<view class="point"></view>
							<view class="status">
								货款打款
							</view>
							<view class="date">
								{{orderData.start_time || '--'}}
							</view>
						</view>
						<view class="item flex"
							:class="{'active' : settlement_status == 2 , 'colour' : settlement_status > 2}">
							<view class="point"></view>
							<view class="status">
								审核中
							</view>
							<!-- <view class="date">
								06-25 10:54
							</view> -->
						</view>
						<view class="item flex"
							:class="{'active' : settlement_status > 2,'err' : settlement_status == 4 }">
							<view v-if="settlement_status != 4" class="tips">
								(预计次日到账)
							</view>
							<view class="point">
								<i v-if="settlement_status == 3" class="iconfont duigou"></i>
								<i v-if="settlement_status == 4" class="iconfont guanbi"></i>
							</view>
							<view class="status">
								{{settlement_status == 4 ? '审核失败' : '审核完成'}}
							</view>
							<view class="date">
								{{orderData.finish_time || ''}}
							</view>
						</view>
					</view>
				</view>
				<view class="progress-item flex">
					<view class="label">
						提现银行
					</view>
					<view class="value">
						{{bank_info.bank_name || ''}}{{bank_info.card_number ? '('+bank_info.card_number+')' : ''}}
						{{bank_info.card_name || ''}}
					</view>
				</view>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				loadding: true,
				scrollviewHigh: 0, //滚动区域高度
				order_id: null,
				orderData: {},
				bank_info: {},
				settlement_status: 0
			}
		},
		onLoad(option) {
			let _this = this
			// 设置全局颜色
			_this.setGlobalColor({
				bgc: '#fff'
			})
			uni.setNavigationBarTitle({
				title: _this.$nw('提现详情'),
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			_this.order_id = option.order_id || null
			_this.getMerchantDetail()
		},

		methods: {
			// 订单详情
			getMerchantDetail() {
				uni.showLoading({
					title: this.$nw("加载中"),
					mask: true
				});
				this._get('user.order/getMerchantDetail', {
					order_id: this.order_id
				}, (res) => {
					this.orderData = res.data || {}
					this.bank_info = res.data.bank_info || {}
					this.settlement_status = res.data.settlement_status || 0
					uni.hideLoading()
				})
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
			},
		},
	}
</script>

<style lang="scss" scoped>
	.finance-details {
		background: #fff;
		position: relative;

		.finance-details-content {
			min-height: 100%;
			position: relative;
			padding: 50rpx 24rpx 0;
			position: relative;

			.bank-name {
				justify-content: center;

				.logo {
					width: 70rpx;
					height: 70rpx;
					background: #fff;
					border-radius: 50%;
					margin-right: 4rpx;
				}

				.name {
					font-size: 32rpx;
					font-weight: 500;
				}
			}

			.money {
				text-align: center;
				font-size: 64rpx;
				font-weight: 500;
				line-height: 90rpx;
				margin-top: 50rpx;
			}

			.progress-box {
				margin-top: 48rpx;

				.progress-item {
					margin-bottom: 24rpx;

					.label {
						color: #666;
					}

					.value {
						margin-left: auto;
					}

					.progress-group {
						margin-left: auto;

						.item {
							margin-bottom: 24rpx;
							position: relative;

							.tips {
								position: absolute;
								font-size: 20rpx;
								color: #999;
								left: -200rpx;
								top: 50%;
								transform: translateY(-50%);
							}

							.status {
								margin-right: 70rpx;
							}

							.date {
								margin-left: auto;
							}

							.point {
								width: 12rpx;
								height: 12rpx;
								background: #999;
								border-radius: 50%;
								position: absolute;
								top: 50%;
								transform: translateY(-50%);
								left: -52rpx;
								display: flex;
								align-items: center;
								justify-content: center;
								z-index: 2;

								.iconfont {
									font-size: 20rpx;
									color: #fff;
									font-weight: 600;
									transform: scale(.8);
								}
							}

							&.err {
								.point {
									background: #F43434 !important;

									.iconfont {
										transform: scale(.6);
									}
								}

								.status,
								.date {
									color: #F43434;
								}

							}

							&::before {
								content: '';
								width: 2rpx;
								height: 60rpx;
								background: #999;
								border-radius: 999px;
								position: absolute;
								left: -48rpx;
								top: 30rpx;
								z-index: 1;
							}

							&.colour {
								.point {
									background: #1B94E0;
								}

								&::before {
									background: #1B94E0;
								}
							}

							&.active {
								.point {
									background: #1B94E0;
									width: 20rpx;
									height: 20rpx;
									left: -56rpx;
								}
							}

							&:last-of-type {
								margin-bottom: 0;

								&::before {
									display: none;
								}
							}
						}
					}
				}
			}
		}
	}
</style>