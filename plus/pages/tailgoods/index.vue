<template>
	<scroll-view scroll-y="true" class="taulgoods-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50" @scrolltolower="scrolltolowerFunc">
		<view class="top-bg" />
		<view class="taulgoods-top"></view>
		<view class="taulgoods-content">
			<view class="product-group">
				<view class="product-item flex" v-for="(item,index) in product_list" :key="index"
					@click="toDetail(item)">
					<view class="product-img common-img-bg">
						<image class="common-img" :src="item.product_image || item.product_main_img"
							mode="aspectFill" />
					</view>
					<view class="product-info">
						<view class="product-title text-ellipsis2">
							{{item.product_name || '--'}}
						</view>
						<view class="product-tags flex-wrap">
							<view class="tag">
								{{$nw("包邮")}}
							</view>
							<view class="tag">
								{{$nw("七天无理由退货")}}
							</view>
						</view>
						<view class="product-price flex">
							<view class="price">
								￥
								<text class="money">{{item.product_price}}</text>
							</view>
							<view v-if="item.line_price || item.product_sku.line_price" class="line-price">
								￥{{item.line_price || item.product_sku.line_price}}
							</view>
							<view class="buy-btn">
								{{$nw("去抢购")}}
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-show="loading && product_list && product_list.length" class="load-box flex-c">
				<i class="iconfont jiazaizhong"></i>
				{{$nw('加载中')}}
			</view>

			<view v-if="no_more && !loading && product_list && product_list.length" class="nomore-box">
				<text class="nomore-content">
					{{$nw("到底了")}}
				</text>
			</view>

			<view v-if="(!product_list || !product_list.length) && !loading" class="empty-box">
				<view class="empty-icon">
					<image class="common-img"
						src="https://shanghuitest.client.xcx008.com/file/uploads/20240605/b798199e3c83e9b818f20576e825a1b9.png">
					</image>
				</view>
				<view class="empty-text">
					{{$nw("暂无数据")}}
				</view>
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
				page: 1,
				product_list: [],
				no_more: false
			}
		},
		onShow() {

		},
		onLoad() {
			let _this = this
			_this.setGlobalColor()
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			uni.setNavigationBarTitle({
				title: _this.$nw('尾货专区'),
			})
			_this.getData(1)
		},
		onShareAppMessage() {},
		onShareTimeline() {},
		methods: {
			getData(loading) {
				if (loading) {
					uni.showLoading({
						title: this.$nw("加载中")
					});
				}
				this.loading = true;
				this._get('product.product/lists', {
					page: this.page,
					list_rows: 20,
					is_tail_good: 1,
				}, (res) => {
					if (this.page <= 1) {
						this.product_list = []
					}
					this.product_list = this.product_list.concat(res.data.list.data);
					this.product_list = this.getUnique(this.product_list, "product_id");
					console.log('productList--->', this.product_list);
					this.last_page = res.data.list.last_page;
					if (res.data.list.last_page <= this.page) {
						this.no_more = true;
					}
					uni.hideLoading();
					setTimeout(() => {
						this.loading = false
					}, loading ? 0 : 500)
				}, (err) => {
					console.log('请求结束-->')
					uni.hideLoading();
					this.loading = false
				})
			},

			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('下拉加载更多');
				if (this.no_more) return
				this.page++
				this.getData()
			},

			// 商品详情
			toDetail(item) {
				uni.navigateTo({
					url: '/main/pages/product/detail/detail?product_type=product&product_id=' + item.product_id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.taulgoods-wrap {
		position: relative;
		background-color: #F4F7FB;

		.top-bg {
			width: 100%;
			height: 100%;
			position: fixed;
			z-index: 0;
			background: url('https://shanghuitest.client.xcx008.com/file/uploads/20240617/5fc014b7365bc981acdd2cfbc3e521a3.png') no-repeat;
			background-position: 0 0;
			background-size: 100% auto
		}

		.taulgoods-top {
			width: 100%;
			height: 164rpx;
			position: fixed;
			left: 0;
			z-index: 88;
			padding: 24rpx 0 0;
			background: url('https://shanghuitest.client.xcx008.com/file/uploads/20240617/5fc014b7365bc981acdd2cfbc3e521a3.png') no-repeat;
			background-position: 0 0;
			background-size: 100% auto;
			background-color: #F4F7FB;
		}

		.taulgoods-content {
			box-sizing: border-box;
			position: relative;
			z-index: 1;
			padding-top: 164rpx;
			padding-bottom: calc(40rpx + env(safe-area-inset-bottom) / 2);

			.product-group {
				padding: 0rpx 24rpx 0;

				.product-item {
					padding: 16rpx;
					background: #fff;
					border-radius: 16rpx;
					margin-bottom: 16rpx;
					position: relative;

					.product-img {
						width: 208rpx;
						height: 208rpx;
						border-radius: 8rpx;
						overflow: hidden;
					}

					.product-info {
						width: calc(100% - 224rpx);
						margin-left: auto;
						position: relative;
						padding-bottom: 8rpx;

						.product-title {
							font-weight: 500;
							line-height: 40rpx;
						}

						.product-tags {
							margin-left: -8rpx;
							margin-top: 8rpx;

							.tag {
								line-height: 1;
								font-size: 20rpx;
								color: #FC512C;
								background: #FFEEEB;
								height: 36rpx;
								padding: 0 8rpx;
								display: flex;
								align-items: center;
								margin-left: 8rpx;
							}
						}

						.product-price {
							margin-top: 28rpx;
							align-items: flex-end;
							position: absolute;
							width: 100%;
							left: 0;
							bottom: 0;

							.price {
								color: #F31111;
								font-weight: 600;
								font-size: 26rpx;
								line-height: 1;

								.money {
									color: #F31111;
									font-size: 32rpx;
									font-weight: 600;
									line-height: 1;
								}
							}

							.line-price {
								font-size: 20rpx;
								color: #999;
								margin-left: 8rpx;
								text-decoration: line-through;
								line-height: 1;
								position: relative;
								top: -2rpx;
							}

							.buy-btn {
								margin-left: auto;
								width: 132rpx;
								height: 58rpx;
								background: linear-gradient(270deg, #1B94E0 0%, #40B4FD 100%);
								color: #fff;
								font-weight: 500;
								display: flex;
								align-items: center;
								justify-content: center;
								border-radius: 8rpx;
							}
						}
					}
				}
			}
		}

		.empty-box {
			margin-top: 180rpx;
		}
	}
</style>