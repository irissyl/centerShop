<template>
	<scroll-view scroll-y="true" class="afterorder-wrap scroll-Y"
		:style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'" lower-threshold="50"
		@scrolltolower="scrolltolowerFunc">
		<view class="afterorder-tabs flex-c" :style="'background:'+getMainColor()+';'">
			<view class="tabs-item" v-for="(item,index) in tabList" :key="index" :class="{'active' : cur_tab == index}"
				@click="tabChange(index)">
				{{item.label}}
			</view>
		</view>
		<view class="afterorder-content">
			<view class="afterorder-list">
				<view class="afterorder-item" v-for="index in 10" :key="index" @click="detailsHandle">
					<view class="afterorder-top flex-c">
						申请时间：2024-05-20
						<view class="afterorder-status">
							退货退款
						</view>
					</view>
					<view class="afterorder-info flex-c">
						<view class="afterorder-img">
							<image
								src="https://shanghui.client.xcx008.com/file/uploads/20240418/0af8c947ce338c7431cd591900cc8d1b.jpg"
								mode="aspectFill"></image>
						</view>
						<view class="afterorder-right">
							<view class="right-top">
								<view class="afterorder-title">
									<view class="title text-ellipsis2">
										得力起钉器办公订书机拔钉器迷你小型取钉器学生多功能起订书钉器
									</view>
									<view class="tag">
										迎客松造型
									</view>
								</view>
								<view class="afterorder-price">
									<view class="price">
										￥25.00
									</view>
									<view class="num">
										×1
									</view>
								</view>
							</view>
							<view class="afterorder-money flex-c">
								退款金额
								<view class="money">
									￥25.00
								</view>
							</view>
						</view>
					</view>

					<view class="afterorder-btns flex-c">
						<view class="btn flex-c">
							填写物流单
						</view>
						<view class="btn flex-c">
							取消申请
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="empty-box" v-if="!orderList.length">
			<view class="empty-icon">
				<image class="common-img" src="../../../../static/empty-icon.png"></image>
			</view>
			<view class="empty-text">
				未查询到订单
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				loading: true,
				scrollviewHigh: 0,
				tabList: [{
					label: '待审核',
					id: 1
				}, {
					label: '售后中',
					id: 2
				}, {
					label: '已完成',
					id: 3
				}],
				cur_tab: 0,
				orderList: [1]
			}
		},
		onShow() {
			// uni.setNavigationBarTitle({
			// 	title: this.$nw("物流详情")
			// });
		},
		onLoad() {
			let _this = this
			_this.setGlobalColor()
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
		},
		methods: {
			tabChange(index) {
				if (this.cur_tab == index) return
				this.cur_tab = index
			},
			getData() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this._post('plus.coc.Coc/getExpressFind', {

				}, (res) => {
					if (res.code == 1) {

					}
					uni.hideLoading();
					this.loading = false
				}, (err) => {
					console.log('请求结束-->')
					uni.hideLoading();
					this.loading = false
				})
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
				let self = this;
				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					return;
				}
				self.getData()
			},
			detailsHandle(id) {
				uni.navigateTo({
					url: "/main/pages/order/afterorder/details?id=1"
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.afterorder-wrap {

		// background: #fff;
		.afterorder-tabs {
			width: 100%;
			height: 80rpx;
			position: fixed;
			left: 0;
			z-index: 22;
			padding: 0 24rpx;

			.tabs-item {
				height: 100%;
				display: flex;
				align-items: center;
				font-size: 28rpx;
				color: #999;
				position: relative;
				margin-right: 84rpx;

				&::after {
					content: '';
					width: 100%;
					height: 4rpx;
					background: #1B94E0;
					border-radius: 999px;
					position: absolute;
					bottom: 8rpx;
					left: 50%;
					transform: translateX(-50%);
					opacity: 0;
				}

				&.active {
					color: #333333;
					font-weight: 500;

					&::after {
						opacity: 1;
					}
				}

				&:last-of-type {
					margin-right: 0;
				}
			}
		}

		.afterorder-content {
			padding: 100rpx 24rpx;
			padding-bottom: calc(100rpx + env(safe-area-inset-bottom) / 2);

			.afterorder-list {
				.afterorder-item {
					padding: 24rpx;
					background: #fff;
					border-radius: 16rpx;
					margin-top: 16rpx;

					&:first-of-type {
						margin-top: 0;
					}

					.afterorder-top {
						color: #333;
						font-size: 24rpx;

						.afterorder-status {
							margin-left: auto;
							font-size: 28rpx;
							color: #1B94E0;
							font-weight: 500;
						}
					}

					.afterorder-info {
						margin-top: 20rpx;

						.afterorder-img {
							width: 176rpx;
							height: 176rpx;
							border-radius: 8rpx;
							overflow: hidden;
							background: #eee;
						}

						.afterorder-right {
							flex: 1;
							margin-left: 20rpx;

							.right-top {
								display: flex;

								.afterorder-title {
									width: 60%;

									.title {
										font-size: 28rpx;
										color: #333;
										font-weight: 500;
										line-height: 40rpx;
									}

									.tag {
										font-size: 24rpx;
										color: #999;
										margin-top: 8rpx;
									}

								}

								.afterorder-price {
									margin-left: auto;

									.price {
										font-size: 28rpx;
										color: #333;
										line-height: 40rpx;
									}

									.num {
										font-size: 28rpx;
										color: #999;
										text-align: right;
										line-height: 40rpx;
									}
								}
							}

							.afterorder-money {
								justify-content: end;
								font-size: 28rpx;
								color: #333;

								.money {
									color: #F31111;
									font-weight: 500;
									margin-left: 8rpx;
								}
							}
						}
					}

					.afterorder-btns {
						justify-content: end;
						margin-top: 24rpx;

						.btn {
							justify-content: center;
							height: 56rpx;
							border-radius: 999px;
							border: 2rpx solid #EEEEEE;
							font-size: 28rpx;
							color: #333;
							padding: 0 34rpx;
							margin-left: 16rpx;
						}
					}
				}
			}
		}

		/deep/.tabbarheight {
			background: #fff !important;
		}
	}
</style>