<template>
	<view class="after-details-wrap" :style="'height:' + scrollviewHigh + 'px;'">
		<view v-if="orderData" class="after-details-content">
			<view class="after-details-top">
				<view class="after-status">
					商家正在处理中
				</view>
				<view class="after-tips">
					我们将尽快为您处理退款
				</view>
			</view>
			<view class="after-details-title">
				退款信息
			</view>
			<view class="goods-info flex-c">
				<view class="goods-img">
					<image
						src="https://shanghui.client.xcx008.com/file/uploads/20240418/0af8c947ce338c7431cd591900cc8d1b.jpg"
						mode="aspectFill"></image>
				</view>
				<view class="goods-text">
					<view class="title">
						六月雪盆栽办公室桌面好养植物客厅室内摆件多种形状
					</view>
					<view class="tags flex-c">
						<view class="tag">
							迎客松造型
						</view>
						<view class="num">
							×1
						</view>
					</view>
				</view>
			</view>
			<view class="order-info-list">
				<view class="order-info-item flex-c">
					<view class="label">
						订单状态
					</view>
					<view class="value">
						待发货
					</view>
				</view>
				<view class="order-info-item flex-c">
					<view class="label">
						实付金额
					</view>
					<view class="value money">
						￥15
					</view>
				</view>
				<view class="order-info-item flex-c">
					<view class="label">
						退款金额
					</view>
					<view class="value money">
						￥15
					</view>
				</view>
				<view class="order-info-item flex-c">
					<view class="label">
						退款原因
					</view>
					<view class="value">
						不喜欢/不想要
					</view>
				</view>
				<view class="order-info-item flex-c">
					<view class="label">
						退款数量
					</view>
					<view class="value">
						1
					</view>
				</view>
				<view class="order-info-item flex-c">
					<view class="label">
						退款编号
					</view>
					<view class="value flex-c">
						1234456789788458517
						<view class="copy-btn">
							<i class="iconfont icon-fuzhi"></i>
						</view>
					</view>
				</view>
				<view class="order-info-item flex-c">
					<view class="label">
						申请时间
					</view>
					<view class="value">
						2024-05-20 11:00:10
					</view>
				</view>
			</view>
			<view class="express-info flex-c">
				<view class="label">
					退货物流
				</view>
				<view class="name">
					中通快递
				</view>
				<view class="code">
					ZT2326566464646
				</view>
				<view class="arrow">
					<u-icon name="arrow-right" size="28" color="#999"></u-icon>
				</view>
			</view>
		</view>

		<view class="handle-btns flex-c">
			<view class="btn service">
				客服
			</view>
			<view class="btn" @click="writeCode">
				填写物流单
			</view>
			<view class="btn">
				撤销申请
			</view>
		</view>
		<view class="empty-box" v-if="!orderData">
			<view class="empty-icon">
				<image class="common-img" src="../../../../static/empty-icon.png"></image>
			</view>
			<view class="empty-text">
				未查询订单信息
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				scrollviewHigh: 0,
				loading: false,
				orderData: {},
			}
		},
		onShow() {
			// uni.setNavigationBarTitle({
			// 	title: this.$nw("物流详情")
			// });
		},
		onLoad(e) {
			let _this = this
			if (!e.id) {
				_this.tip("数据获取异常，请稍后重试", 2000);
				return
			}
			_this.setGlobalColor()
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			// _this.getData()
		},
		methods: {
			getData() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this._post('plus.coc.Coc/getExpressFind', {
					shipperCode: this.productData.shipperCode, //快递公司编码
					logisticCode: this.productData.logisticCode, //快递单号
					// shipperCode: 'JTSD', //快递公司编码
					// logisticCode: 'JT5273312904239', //快递单号
					// token: 'orgN769bNgNhCoafFkrcufRi_QMg',
				}, (res) => {
					if (res.code == 1) {
						this.expressData = res.data || {}
						console.log('expressData--->', this.expressData);
						this.tracesList = this.expressData.Traces && this.expressData.Traces.reverse() || []
						console.log('tracesList--->', this.tracesList);
					}
					uni.hideLoading();
					this.loading = false
				}, (err) => {
					console.log('请求结束-->')
					uni.hideLoading();
					this.loading = false
				})
			},
			copyHandle(val) {
				uni.setClipboardData({
					data: val,
					success: () => {
						this.tip("复制成功", 2000);
					},
					fail: () => {
						this.tip("复制失败，请重试", 2000);
					}
				});
			},
			writeCode() {
				uni.navigateTo({
					url: "/main/pages/order/afterorder/writeCode"
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.after-details-wrap {
		// min-height: 100vh;
		background: #fff;
		padding-bottom: calc(160rpx + env(safe-area-inset-bottom) / 2);
		position: relative;

		.after-details-top {
			width: 100%;
			height: 176rpx;
			background: url('https://shanghui.client.xcx008.com/file/uploads/20240521/a86ea101334c6f9d648f766ee5885d38.png') no-repeat;
			background-color: #2ea5ef;
			background-position: center;
			background-size: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0 24rpx;

			.after-status {
				font-size: 32rpx;
				font-weight: 600;
				color: #fff;
			}

			.after-tips {
				font-size: 24rpx;
				color: #fff;
			}
		}

		.after-details-title {
			padding: 0 24rpx;
			margin-top: 24rpx;
			font-weight: 500;
			font-size: 28rpx;
			color: #333;
		}

		.goods-info {
			padding: 0 24rpx;
			margin-top: 16rpx;
			align-items: flex-start;

			.goods-img {
				width: 176rpx;
				height: 176rpx;
				border-radius: 8rpx;
				overflow: hidden;
				background: #eee;
			}

			.goods-text {
				flex: 1;
				margin-left: 16rpx;

				.title {
					font-weight: 500;
					color: #333;
					line-height: 40rpx;
				}

				.tags {
					margin-top: 8rpx;

					.tag,
					.num {
						font-size: 24rpx;
						color: #999;
					}

					.num {
						margin-left: auto;
					}
				}
			}
		}

		.order-info-list {
			padding: 24rpx 24rpx 0;

			.order-info-item {
				padding: 8rpx 0;
				justify-content: space-between;

				.label {
					color: #666;
				}

				.value {
					color: #333;

					.copy-btn {
						margin-left: 12rpx;
					}
				}
			}
		}

		.express-info {
			margin: 32rpx 24rpx 0;
			height: 88rpx;
			background: #F5F7FA;
			border-radius: 8rpx;
			padding: 0 24rpx;
			padding-right: 12rpx;

			.label {
				font-weight: 600;
			}

			.name {
				margin-left: 32rpx;
			}

			.code {
				margin-left: 16rpx;
			}

			.arrow {
				width: 48rpx;
				height: 48rpx;
				margin-left: auto;
				display: flex;
				align-items: center;
				justify-content: center;
			}
		}

		.handle-btns {
			position: absolute;
			right: 24rpx;
			bottom: calc(100rpx + env(safe-area-inset-bottom) / 2);

			.btn {
				width: 208rpx;
				height: 80rpx;
				border-radius: 8rpx;
				border: 2rpx solid #1B94E0;
				color: #1B94E0;
				margin-left: 16rpx;
				display: flex;
				align-items: center;
				justify-content: center;

				&:first-of-type {
					margin-left: 0;
				}

				&.service {
					border-color: #aaa;
					color: #666666;
				}
			}
		}
	}
</style>