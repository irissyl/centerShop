<template>
	<view class="write-code-wrap" :style="'height:' + scrollviewHigh + 'px;'">
		<view class="write-code-title">
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

		<view class="mail-info">
			<view class="title">
				邮寄信息
				<view class="tips">
					(请按下述地址将商品寄回)
				</view>
			</view>
			<view class="mail-card">
				<view class="mail-group">
					<view class="mail-item flex-c">
						<view class="label">
							收货人：
						</view>
						<view class="value">
							张三
						</view>
						<view class="copy">
							复制
						</view>
					</view>
					<view class="mail-item flex-c">
						<view class="label">
							联系电话：
						</view>
						<view class="value">
							13712547895
						</view>
					</view>
					<view class="mail-item flex-c">
						<view class="label">
							收货地址：
						</view>
						<view class="value">
							广东省东莞市东莞市环球经贸中心1805
						</view>
					</view>
				</view>
				<view class="mail-tips">
					备注：如有售后卡，请在售后卡或小纸条上填写下您的下单账号、订单编号、联系电话，方便我们处理
				</view>
			</view>
		</view>

		<view class="mail-form">
			<view class="form-item flex-c">
				<view class="label">
					物流公司
				</view>
				<view class="inp">
					<picker class="form-picker" @change="expressChange" :value="express_index" :range="expressList"
						range-key="label">
						<view class="picker-value">
							{{expressList[express_index] && expressList[express_index].label || '请选择物流公司'}}
						</view>
					</picker>
				</view>
				<u-icon class="u-icon" name="arrow-right" size="28" color="#999"></u-icon>
			</view>
			<view class="form-item flex-c">
				<view class="label">
					物流单号
				</view>
				<view class="inp">
					<input class="uni-input" placeholder="请填写物流单号" />
				</view>
			</view>
		</view>

		<view class="submit-btn">
			确认提交
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
				expressList: [],
				express_index: null
			}
		},
		onShow() {
			// uni.setNavigationBarTitle({
			// 	title: this.$nw("物流详情")
			// });
		},
		onLoad(e) {
			let _this = this
			_this.setGlobalColor()
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			_this.getAllExpressCode()
		},
		methods: {
			// 选择物流公司
			expressChange(e) {
				console.log(e);
				this.express_index = e.detail.value
			},
			getAllExpressCode() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this._post('plus.coc.Coc/getAllExpressCode', {}, (res) => {
					if (res.code == 1) {
						let data = res.data && res.data.list || []
						this.expressList = data.map(e => {
							return {
								value: e.express_code,
								label: e.express_name
							}
						})
						console.log('expressList--->', this.expressList);
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
		}
	}
</script>

<style lang="scss" scoped>
	.write-code-wrap {
		// min-height: 100vh;
		background: #fff;
		padding: 24rpx 24rpx;
		// padding-bottom: calc(160rpx + env(safe-area-inset-bottom) / 2);
		position: relative;

		.write-code-title {
			font-weight: 500;
			font-size: 28rpx;
			color: #333;
		}

		.goods-info {
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


		.mail-info {
			margin-top: 32rpx;

			.title {
				display: flex;
				align-items: flex-end;
				font-weight: 500;

				.tips {
					font-size: 24rpx;
					color: #999;
					font-weight: 400;
					margin-left: 12rpx;
				}
			}

			.mail-card {
				margin-top: 16rpx;
				padding: 4rpx 24rpx 24rpx;
				background: #F5F7FA;
				border-radius: 8rpx;

				.mail-group {
					.mail-item {
						margin: 16rpx 0;

						.copy {
							margin-left: auto;
							width: 64rpx;
							height: 40rpx;
							background: #1B94E0;
							border-radius: 4rpx;
							font-size: 20rpx;
							color: #fff;
							display: flex;
							align-items: center;
							justify-content: center;
						}
					}
				}

				.mail-tips {
					margin-top: 32rpx;
					font-size: 20rpx;
					color: #999;
					line-height: 30rpx;
				}
			}
		}

		.mail-form {
			margin-top: 32rpx;

			.form-item {
				margin-bottom: 16rpx;

				.label {
					color: #333;
				}

				.inp {
					flex: 1;
					margin-left: auto;

					.picker-value {
						text-align: right;
					}

					.uni-input {
						text-align: right;
					}
				}

				.u-icon {
					margin-left: 20rpx;
				}
			}
		}

		.submit-btn {
			width: 702rpx;
			height: 80rpx;
			background: #1B94E0;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 32rpx;
			color: #fff;
			font-weight: 500;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: calc(100rpx + env(safe-area-inset-bottom) / 2);
		}
	}
</style>