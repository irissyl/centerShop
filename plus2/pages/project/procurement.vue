<template>
	<scroll-view scroll-y="true" class="procurement-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50" @scrolltolower="scrolltolowerFunc">
		<view class="top-bg" />
		<view class="procurement-top"></view>
		<view class="procurement-content">
			<view class="category-bar hide-scrollbar">
				<view class="item" v-for="index in 12" :key="index" :class="{'active' : cur_cate == index}"
					@click="cateChange(index)">
					万商精选
				</view>
			</view>
			<view class="product-group">
				<view class="product-item flex" v-for="(item,index) in product_list" :key="index"
					@click="toDetail(item)">
					<view class="product-img common-img-bg">
						<image class="common-img" :src="item.product.file_path" mode="aspectFill" />
					</view>
					<view class="product-info">
						<view class="product-title text-ellipsis2">
							{{item.product.product_name || '--'}}
						</view>
						<!-- <view class="product-tags flex-wrap">
							<view class="tag">
								{{$nw("包邮")}}
							</view>
							<view class="tag">
								{{$nw("七天无理由退货")}}
							</view>
						</view> -->
						<view class="product-price flex">
							<view class="price-group">
								<view class="label">
									{{$nw("集采起始价")}}：
								</view>
								<view class="price">
									￥
									<text class="money">{{item.seckill_price}}</text>
								</view>
							</view>
							<view class="buy-btn">
								{{$nw("咨询")}}
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-if="!loading && product_list.length" class="nomore-box">
				<text class="nomore-content">
					{{$nw("到底了")}}
				</text>
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
				cur_date: 0,
				cur_cate: 0,
				activity_list: [],
				product_list: []
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
			countdDownOver(index) {
				console.log('countdDownOver-->', index);
				this.activity_list[index].active_status = 99
				if (index == this.cur_date) {
					for (let i = 0; i < this.product_list.length; i++) {
						this.product_list[i].active_status = 3
					}
				}
			},
			dateChange(index, item) {
				if (this.cur_date == index) return
				this.cur_date = index
				this.getData(item)

			},
			cateChange(index) {
				if (this.cur_cate == index) return
				this.cur_cate = index
			},
			getData(item) {
				this.loading = true;
				uni.showLoading({
					title: this.$nw("加载中")
				});
				let params = item ? {
					seckill_activity_id: item.active_info.seckill_activity_id,
					dateline: item.dateline
				} : {}
				this.product_list = []
				this._get('plus.seckill.product/activeIndex', params, (res) => {
					if (res.code == 1) {
						this.activity_list = res.data.activity_list || []
						this.product_list = res.data.data || []
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
			},

			// 秒杀商品详情
			toDetail(item) {
				uni.navigateTo({
					url: '/main/pages/product/detail/detail?product_type=product&product_id=' + item.product_id
				})
			},
			progressFormat(stock, sales) {
				let num = parseInt((sales / stock) * 100)
				return num + '%'
			},
			dateSplic(item) {
				if (!item.dateline || !item.active_info.day_end_time) {
					return null
				} else {
					// return '2024-06-07 13:56:00'
					return item.dateline + ' ' + item.active_info.day_end_time
				}
			}
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
						color: #F31111;
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