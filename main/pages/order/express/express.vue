<template>
	<scroll-view scroll-y="true" class="express-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50" @scrolltolower="scrolltolowerFunc">
		<view class="express-content">
			<view class="goods-info flex-c">
				<view class="info flex-c">
					<view class="goods-img">
						<image v-if="productData.image.file_path" class="common-img" :src="productData.image.file_path"
							mode="aspectFill"></image>
					</view>
					<view class="goods-name">
						{{productData.product_name || '--'}}
					</view>
				</view>
				<view class="status">
					{{stateFormat(expressData.State) || ''}}
				</view>
			</view>
			<view class="express-info flex-c">
				<view class="info flex-c">
					<view v-if="expressLogo" class="express-logo">
						<image class="common-img"
							src="https://shanghui.client.xcx008.com/file/uploads/20240418/0af8c947ce338c7431cd591900cc8d1b.jpg"
							mode="aspectFit"></image>
					</view>
					<view class="express-num">
						{{orderData.express_company || $nw('物流单号')}}：{{orderData.express_no || '--'}}
					</view>
				</view>
				<view v-if="orderData.express_no" class="copy" @click="copyHandle(orderData.express_no)">
					{{$nw('复制')}}
				</view>
			</view>
			<view v-if="tracesList && tracesList.length" class="express-list">
				<view class="express-item" v-for="(item,index) in tracesList" :key="index">
					<view class="top flex-c">
						<view class="icon">
						</view>
						<view class="status">
							{{item.Action && actionFormat(item.Action) || '--'}}
						</view>
						<view class="date">
							{{item.AcceptTime || '--'}}
						</view>
					</view>
					<view class="details">
						{{item.AcceptStation || '--'}}
					</view>
				</view>
				<view class="express-item">
					<view class="top flex-c">
						<view class="icon">
						</view>
						<view class="status">
							{{$nw('已下单')}}
						</view>
						<view class="date">
							{{orderData.create_time || '--'}}
						</view>
					</view>
					<view class="details">
						{{$nw('商品已下单，等待商家发货')}}
					</view>
				</view>
			</view>
			<view class="empty-box" v-if="!tracesList.length">
				<view v-if="!loading" class="empty-icon">
					<image class="common-img" src="../../../../static/empty-icon.png"></image>
				</view>
				<view v-if="!loading" class="empty-text">
					{{$nw('未查询到物流信息')}}
				</view>
			</view>
			<view v-show="!loading" style="padding: 0 24rpx;">
				<!-- 为你推荐 -->
				<RecommendProduct ref="RecommendProductRef" isUser='1' />
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import store from "@/store";
	import RecommendProduct from '@/components/RecommendProduct.vue'
	export default {
		components: {
			RecommendProduct
		},
		data() {
			return {
				loading: false,
				scrollviewHigh: 0,
				productData: {},
				orderData: {},
				state_ex: [],
				state_list: [],
				tracesList: [],
				expressLogo: '',
				RecommendProductRef: null,
				order_id: null,
				expressData: {}
			}
		},
		onLoad(e) {
			let _this = this
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			uni.setNavigationBarTitle({
				title: _this.$nw("物流详情")
			});
			this.setGlobalColor()
			this.state_ex = store.getters.state_ex
			this.state_list = store.getters.state_list
			this.order_id = e.order_id
			this.getOrderDetails()
			this.getExpressTrajectory()
		},
		methods: {
			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
				this.$refs.RecommendProductRef.scrolltolowerFunc()
			},
			/*获取订单详情*/
			getOrderDetails() {
				this._get(
					'user.order/detail', {
						order_id: this.order_id
					},
					(res) => {
						console.log(res.data)
						this.orderData = res.data.order || {};
						this.productData = this.orderData.product[0]
						console.log('orderData-->', this.orderData);
						console.log('productData--->', this.productData);
					}
				);
			},
			getExpressTrajectory() {
				this.loading = true
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this._post('plus.coc.Coc/getExpressTrajectory', {
					order_id: this.order_id
				}, (res) => {
					this.expressData = res.data || {}
					this.tracesList = res.data.Traces.reverse() || []
					console.log('tracesList--->', this.tracesList);
					uni.hideLoading();
					this.loading = false
				}, (err) => {
					console.log('请求错误-->')
					uni.hideLoading();
					this.loading = false
				}, () => {
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
			actionFormat(code) {
				for (let i = 0; i < this.state_ex.length; i++) {
					if (this.state_ex[i].code == code) {
						return this.state_ex[i].label
					}
				}
			},
			stateFormat(code) {
				for (let i = 0; i < this.state_list.length; i++) {
					if (this.state_list[i].code == code) {
						return this.state_list[i].label
					}
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.express-wrap {
		background: #fff;

		.express-content {
			padding-bottom: calc(40rpx + env(safe-area-inset-bottom) / 2);

			.goods-info {
				padding: 32rpx 24rpx;
				border-bottom: 8rpx solid #F5F7FA;

				.info {
					width: 80%;

					.goods-img {
						width: 80rpx;
						height: 80rpx;
						border-radius: 8rpx;
						overflow: hidden;
						background: #f1f1f1;
					}

					.goods-name {
						flex: 1;
						margin-left: 16rpx;
						line-height: 36rpx;
						font-size: 24rpx;
						color: #333;
					}
				}

				.status {
					margin-left: auto;
					font-size: 32rpx;
					color: #333;
					font-weight: 500;
				}
			}

			.express-info {
				padding: 28rpx 24rpx;

				.info {
					margin-right: auto;

					.express-logo {
						width: 48rpx;
						height: 48rpx;
						border-radius: 50%;
						overflow: hidden;
						background: #ccc;
						margin-right: 16rpx;
					}

					.express-num {
						font-size: 24rpx;
						color: #333;
					}
				}

				.copy {
					font-size: 20rpx;
					color: #999;
					padding: 12rpx;
				}
			}

			.express-list {
				padding: 8rpx 24rpx;

				.express-item {
					position: relative;
					padding-bottom: 44rpx;

					.top {
						position: relative;
						z-index: 1;
						padding-left: 12rpx;

						.icon {
							width: 24rpx;
							height: 24rpx;
							background: #1B94E0;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							font-size: 24rpx;
							color: #fff;
						}

						.status {
							margin-left: 16rpx;
							font-size: 28rpx;
							font-weight: 500;
							color: #666;
						}

						.date {
							font-size: 24rpx;
							color: #999;
							margin-left: 16rpx;
						}
					}

					.details {
						position: relative;
						z-index: 1;
						margin-left: 64rpx;
						margin-top: 12rpx;
						padding: 16rpx;
						background: #F5F7FA;
						font-size: 24rpx;
						color: #666;
						line-height: 36rpx;
						border-radius: 8rpx;
					}

					&::after {
						content: '';
						width: 2rpx;
						height: 100%;
						background: #1B94E0;
						position: absolute;
						top: 20rpx;
						left: 22rpx;
						z-index: 0;
					}

					&:last-of-type {
						&::after {
							display: none;
						}
					}
				}
			}
		}
	}
</style>