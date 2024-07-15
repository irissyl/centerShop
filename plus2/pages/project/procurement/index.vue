<template>
	<scroll-view scroll-y="true" class="procurement-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50" @scrolltolower="scrolltolowerFunc">
		<view class="top-bg" />
		<view class="procurement-top"></view>
		<view class="procurement-content">
			<!-- <view class="category-bar hide-scrollbar">
				<view class="item" v-for="index in 12" :key="index" :class="{'active' : cur_cate == index}"
					@click="cateChange(index)">
					万商精选
				</view>
			</view> -->
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
						<view class="product-price flex">
							<view class="price-group">
								<view class="label">
									{{$nw("集采起始价")}}：
								</view>
								<view class="price">
									￥
									<text class="money">{{item.centralized_purchasing_price}}</text>
								</view>
							</view>
							<view class="buy-btn">
								{{$nw("咨询")}}
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
				cur_cate: 0,
				product_list: [],
				no_more: false,
				page: 1
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
				title: _this.$nw('集采中心'),
			})
			_this.getData()
		},
		methods: {
			cateChange(index) {
				if (this.cur_cate == index) return
				this.cur_cate = index
			},
			getData(loading) {
				if (loading) {
					uni.showLoading({
						title: this.$nw("加载中")
					});
				}
				this.loading = true;
				this.no_more = false
				this._get('plus.home.TailGood/index', {
					page: this.page,
					limit: 10
				}, (res) => {
					if (this.page <= 1) {
						this.product_list = []
					}
					this.product_list = this.product_list.concat(res.data.data);
					console.log('product_list---->', this.product_list);
					if (res.data.last_page <= this.page || !res.data.last_page) {
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
					url: '/plus2/pages/project/procurement/details?product_id=' + item.product_id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.procurement-wrap {
		position: relative;
		// background: url('https://shanghui.client.xcx008.com/file/uploads/20240528/57d6300a19060c32261fdd22d58c95f2.png') no-repeat;
		// background-position: 0 0;
		// background-size: 100% auto;
		background-color: #F4F7FB;

		.top-bg {
			width: 100%;
			height: 100%;
			position: fixed;
			z-index: 0;
			background: url('https://shanghuitest.client.xcx008.com/file/uploads/20240617/95bdb51544697088b55bd92469542557.png') no-repeat;
			background-position: 0 0;
			background-size: 100% auto
		}

		.procurement-top {
			width: 100%;
			height: 164rpx;
			position: fixed;
			left: 0;
			z-index: 88;
			padding: 24rpx 0 0;
			background: url('https://shanghuitest.client.xcx008.com/file/uploads/20240617/95bdb51544697088b55bd92469542557.png') no-repeat;
			background-position: 0 0;
			background-size: 100% auto;
			background-color: #F4F7FB;
		}

		.procurement-content {
			box-sizing: border-box;
			position: relative;
			z-index: 1;
			padding-top: 164rpx;
			padding-bottom: calc(40rpx + env(safe-area-inset-bottom) / 2);

			&::before {
				content: "";
				width: 100%;
				height: 100%;
				background: #F4F7FB;
				border-radius: 16rpx 16rpx 0rpx 0rpx;
				position: fixed;
				z-index: 0;
			}

			.category-bar {
				width: 100%;
				margin-top: 24rpx;
				overflow: hidden;
				overflow-x: auto;
				white-space: nowrap;
				display: flex;
				position: relative;
				z-index: 1;

				.item {
					margin-right: 20rpx;
					height: 48rpx;
					display: flex;
					align-items: center;
					padding: 0 16rpx;
					background: #fff;
					border-radius: 8rpx;
					font-size: 20rpx;
					color: #999;

					&.active {
						color: #1B94E0;
						font-weight: 500;
						transition: color .2s;
					}

					&:first-of-type {
						margin-left: 24rpx;
					}

					&:last-of-type {
						margin-right: 24rpx;
					}
				}
			}

			.product-group {
				padding: 24rpx 24rpx 0;
				position: relative;
				z-index: 1;

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

							.price-group {
								.label {
									font-size: 24rpx;
									line-height: 1;
								}

								.price {
									margin-top: 12rpx;
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
	}
</style>