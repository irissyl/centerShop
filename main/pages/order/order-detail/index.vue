<template>
	<view class="order-details-wrap" :style="'height:' + scrollviewHigh + 'px;'">
		<view v-if="orderData && !loading" class="order-details-content">
			<view class="order-details-top">
				<view class="order-status flex-c">
					<view class="icon">
						<image src="../../../../static/order/icon1.png" />
					</view>
					待发货
				</view>
				<view class="order-tips">
					6天19小时后自动确认收货
				</view>
			</view>
			<view class="express-group">
				<view class="express-item flex-c">
					<view class="express-info">
						<view class="express-status flex-c">
							<view class="icon">
								<image src="../../../../static/order/icon2.png" />
							</view>
							<view class="text">
								物流状态
							</view>
							<view class="text text2">
								待发货
							</view>
						</view>
						<view class="express-tips">
							商品已下单，商家备货中
						</view>
					</view>
					<i class="iconfont icon-jiantou"></i>
				</view>
				<view class="express-item address flex-c">
					<view class="express-info">
						<view class="express-status address flex-c">
							<view class="text">
								张三
							</view>
							<view class="text text2">
								123****1458
							</view>
						</view>
						<view class="express-tips address flex-c">
							<view class="icon">
								<image src="../../../../static/order/icon3.png" />
							</view>
							广东省东莞市东城区鸿福路201号
						</view>
					</view>
				</view>
			</view>

			<view class="goods-group">
				<view class="shop-info flex-c">
					<view class="logo flex-c-c">
						<image
							src="https://shanghui.client.xcx008.com/file/uploads/20240418/0af8c947ce338c7431cd591900cc8d1b.jpg"
							mode="aspectFill"></image>
					</view>
					<view class="name">
						生活植物园
					</view>
					<i class="iconfont icon-jiantou"></i>
				</view>
				<view class="goods-info flex">
					<view class="goods-img flex-c-c">
						<image
							src="https://shanghui.client.xcx008.com/file/uploads/20240418/0af8c947ce338c7431cd591900cc8d1b.jpg"
							mode="aspectFill"></image>
					</view>
					<view class="info">
						<view class="name">
							六月雪盆栽办公室桌面好养植物客厅室内摆件多种形状
						</view>
						<view class="tags flex">
							<view class="tag" v-for="index in 3" :key="index">
								迎客松造型
							</view>
						</view>
					</view>
				</view>
				<view class="goods-info-list">
					<view class="item flex-c">
						<view class="label">
							商品数量
						</view>
						<view class="value">
							×1
						</view>
					</view>
					<view class="item flex-c">
						<view class="label">
							商品总价
						</view>
						<view class="value">
							￥289
						</view>
					</view>
					<view class="item flex-c">
						<view class="label">
							运费
						</view>
						<view class="value">
							包邮
						</view>
					</view>
					<view class="item flex-c">
						<view class="label">
							实付款
						</view>
						<view class="value">
							￥289
						</view>
					</view>
				</view>
				<view class="express-insurance flex-c">
					<view class="label">
						运费险
					</view>
					<view class="value">
						退换货自动理赔
					</view>
					<view class="status">
						保障中
					</view>
					<i class="iconfont icon-jiantou"></i>
				</view>
			</view>

			<view class="order-group">
				<view class="title">
					订单信息
				</view>
				<view class="list">
					<view class="item flex-c">
						<view class="label">
							订单编号
						</view>
						<view class="value">
							1234456789788458517
						</view>
						<view class="icon flex-c-c">
							<image src="../../../../static/copy_icon.png"></image>
						</view>
					</view>
					<view class="item flex-c">
						<view class="label">
							交易快照
						</view>
						<view class="value">
							发生争议时可作为判断依据
						</view>
						<i class="iconfont icon-jiantou"></i>
					</view>
					<view class="item flex-c">
						<view class="label">
							支付方式
						</view>
						<view class="value">
							余额
						</view>
					</view>
					<view class="item flex-c">
						<view class="label">
							下单时间
						</view>
						<view class="value">
							2024-04-02 11:00:10
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="footer-btns flex-c">
			<view class="btn">
				申请售后
			</view>
			<view class="btn plain">
				再买一单
			</view>
			<view class="btn primary">
				确认收货
			</view>
		</view>
		<view class="empty-box" v-if="!orderData && !loading">
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
				loading: true,
				scrollviewHigh: 0,
				order_id: null,
				expressList: [],
				expressInfo: {},
				orderData: null,
			}
		},
		onLoad(e) {
			this.setGlobalColor()
			if (!e.order_id) {
				this.tip("数据获取异常，请稍后重试", 2000);
				return
			}
			this.order_id = e.order_id
			console.log('order_id-->', this.order_id);
			this.getOrderDetails();
			let _this = this
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
		},
		methods: {
			getOrderDetails() {
				uni.showLoading({
					title: this.$nw('加载中')
				})
				this._post(
					'user.order/detail', {
						order_id: this.order_id
					}, (res) => {
						console.log(res.data)
						this.orderData = res.data.order || null;
						console.log('订单详情-->', this.orderData);
						if (this.orderData.delivery_type.value == 10 && this.orderData.delivery_status.value == 20) {
							this.orderData.express = this.orderData.express || {}
							this.getExpressList()
						}
						uni.hideLoading();
						this.loading = false
					}, (err) => {
						console.log('不走吗');
						uni.hideLoading();
						this.loading = false
					}
				);
			},
			// 获取快递公司列表
			getExpressList() {
				this._post(
					'plus.coc.Coc/getAllExpressCode', {}, (res) => {
						this.expressList = res.data && res.data.list || []
						for (let i = 0; i < this.expressList.length; i++) {
							if (this.orderData.express_id == this.expressList[i].express_code_id) {
								this.expressInfo = this.expressList[i]
								break;
							}
						}
						console.log('订单快递信息---》', this.expressInfo);
					}
				);
			},
		}
	}
</script>

<style lang="scss" scoped>
	.order-details-wrap {
		background: #fff;
		padding-bottom: calc(160rpx + env(safe-area-inset-bottom) / 2);
		position: relative;
		overflow-y: auto;

		.order-details-top {
			width: 100%;
			height: 176rpx;
			background: url('https://shanghui.client.xcx008.com/file/uploads/20240521/a86ea101334c6f9d648f766ee5885d38.png') no-repeat;
			background-color: #2ea5ef;
			background-position: center;
			background-size: 100%;
			display: flex;
			flex-direction: column;
			justify-content: center;
			padding: 0 32rpx;

			.order-status {
				font-size: 32rpx;
				font-weight: 600;
				color: #fff;
				line-height: 1;

				.icon {
					width: 32rpx;
					height: 32rpx;
					margin-right: 16rpx;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.order-tips {
				font-size: 24rpx;
				color: #fff;
				line-height: 1;
				margin-top: 24rpx;
			}
		}

		.express-group {
			padding: 8rpx 24rpx 0;
			border-bottom: 16rpx solid #F5F7FA;

			.express-item {
				padding: 32rpx 0;
				border-bottom: 1rpx solid #e8e8e8;

				.icon {
					width: 32rpx;
					height: 32rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-right: 24rpx;
				}

				.express-info {

					.express-status {
						.text {
							font-weight: 600;

							&.text2 {
								margin-left: 40rpx;
							}
						}

						&.address {
							padding-left: 56rpx;
						}
					}

					.express-tips {
						padding-left: 56rpx;
						font-size: 24rpx;
						margin-top: 8rpx;
						color: #666;

						&.address {
							padding-left: 0;
						}
					}
				}

				.iconfont {
					margin-left: auto;
					color: #999;
					font-size: 28rpx;
				}

				&.address {
					border: none;
				}
			}
		}

		.goods-group {
			padding: 0 24rpx;
			border-bottom: 16rpx solid #F5F7FA;

			.shop-info {
				padding: 32rpx 0 24rpx;

				.logo {
					width: 48rpx;
					height: 48rpx;
					border-radius: 4rpx;
					background: #eee;
					overflow: hidden;
					margin-right: 16rpx;
				}

				.name {
					font-weight: bold;
					line-height: 1;
				}

				.iconfont {
					font-size: 20rpx;
					color: #999;
					margin-left: 10rpx;
				}
			}

			.goods-info {
				.goods-img {
					width: 176rpx;
					height: 176rpx;
					border-radius: 8rpx;
					background: #eee;
					overflow: hidden;
				}

				.info {
					margin-left: 16rpx;
					flex: 1;

					.name {
						font-weight: 500;
						line-height: 40rpx;
					}

					.tags {
						flex-wrap: wrap;
						margin-left: -12rpx;
						margin-top: 10rpx;

						.tag {
							height: 40rpx;
							font-size: 24rpx;
							color: #999;
							background: #F5F7FA;
							border-radius: 4rpx;
							padding: 0 16rpx;
							display: flex;
							align-items: center;
							margin-left: 12rpx;
							margin-bottom: 12rpx;
						}
					}
				}
			}

			.goods-info-list {
				margin-top: 16rpx;

				.item {
					padding: 8rpx 0;

					.label {
						color: #666;
					}

					.value {
						margin-left: auto;
					}
				}
			}

			.express-insurance {
				border-top: 1rpx solid #e8e8e8;
				padding: 16rpx 0;
				margin-top: 12rpx;

				.label {
					font-size: 24rpx;
					color: #666;
				}

				.value {
					font-size: 24rpx;
					color: #999;
					margin-left: 36rpx;
				}

				.status {
					margin-left: auto;
					font-size: 24rpx;
				}

				.iconfont {
					font-size: 20rpx;
					color: #999;
					margin-left: 8rpx;
				}
			}
		}

		.order-group {
			padding: 28rpx 24rpx;

			.title {
				font-weight: 600;
			}

			.list {
				margin-top: 16rpx;

				.item {
					padding: 6rpx 0;

					.label {
						font-size: 24rpx;
						color: #666;
					}

					.value {
						font-size: 24rpx;
						color: #333;
						margin-left: auto;
					}
					
					.icon{
						width: 32rpx;
						height: 32rpx;
						margin-left: 8rpx;
					}
					
					.iconfont{
						font-size: 24rpx;
						color: #999;
						margin-left: 10rpx;
						margin-right: 6rpx;
					}
				}
			}
		}

		.footer-btns {
			background: #fff;
			width: 100vw;
			padding: 24rpx;
			padding-bottom: calc(24rpx + env(safe-area-inset-bottom) / 2);
			box-shadow: 0rpx -4rpx 8rpx 0rpx rgba(0, 0, 0, 0.06);
			position: fixed;
			bottom: 0;
			left: 0;
			justify-content: flex-end;

			.btn {
				width: 200rpx;
				height: 76rpx;
				border-radius: 8rpx;
				border: 1rpx solid #bbb;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #666;
				margin-right: 16rpx;

				&:last-of-type {
					margin-right: 0;
				}

				&.plain {
					border-color: #1B94E0;
					color: #1B94E0;
				}

				&.primary {
					border-color: #1B94E0;
					background: #1B94E0;
					color: #fff;
				}
			}
		}
	}
</style>