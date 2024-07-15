<template>
	<scroll-view scroll-y="true" class="venue-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50" @scrolltolower="scrolltolowerFunc">
		<view class="top-bg" />
		<view class="venue-top">
			<view class="date-bar hide-scrollbar flex">
				<view class="item" v-for="(item,index) in activity_list" :key="index"
					:class="{'active' : cur_date == index}" @click="dateChange(index,item)">
					<view class="date">
						{{item.date}}
					</view>
					<view v-if='item.active_status == 2' class="label countdown">
						<Countdown page_type="list" :startTime="dateSplic(item)" :key="index"
							@countdDownOver="countdDownOver" :list_index="index" :is_active="cur_date == index" />
					</view>
					<view v-else-if="item.active_status == 99" class="label">
						已结束
					</view>
					<view v-else class="label">
						{{item.active_info.status_text}}
					</view>
				</view>
			</view>
			<!-- <view class="category-bar hide-scrollbar">
				<view class="item" v-for="index in 12" :key="index" :class="{'active' : cur_cate == index}"
					@click="cateChange(index)">
					万商精选
				</view>
			</view> -->
		</view>
		<view class="venue-content">
			<view class="product-group">
				<view class="product-item flex" v-for="(item,index) in product_list" :key="index"
					@click="toDetail(item)">
					<view class="product-img common-img-bg">
						<image class="common-img" :src="item.product.file_path" mode="aspectFill" />
					</view>
					<view class="product-info">
						<view class="product-title text-ellipsis">
							{{item.product.product_name || '--'}}
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
								<text class="money">{{item.seckill_price}}</text>
							</view>
							<view class="line-price">
								￥{{item.product_price}}
							</view>
						</view>
						<view v-if="item.active_status == 1" class="sell-progress soon flex-c">
							{{$nw("即将开抢")}}
						</view>
						<view v-else-if="item.active_status == 2" class="sell-progress flex-c">
							<view class="progress-content flex-c">
								<view class="progress">
									<view class="leng" :style="'width:'+progressFormat(item.stock,item.product_sales)">
									</view>
								</view>
								<view class="tips">
									{{$nw("已抢")}}{{progressFormat(item.stock,item.product_sales)}}
								</view>
							</view>
							<view class="buy-btn">
								<image class="common-img"
									src="https://shanghui.client.xcx008.com/file/uploads/20240603/0c4110f92908ec5ddd2daa9860b624bd.png"
									mode="aspectFill" />
							</view>
						</view>
						<view v-else-if="item.active_status == 3" class="sell-progress finish flex-c">
							<view class="progress-content flex-c">
								<view class="progress">
									<view class="leng" :style="'width:100%;'">
									</view>
								</view>
								<view class="tips">
									{{$nw("已抢100%")}}
								</view>
							</view>
							<view class="buy-btn">
								<image class="common-img"
									src="https://shanghuitest.client.xcx008.com/file/uploads/20240605/ff90372be0425b412fd0b5cef67c789e.png"
									mode="aspectFill" />
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-if="!loading" class="nomore-box">
				<text class="nomore-content">
					{{$nw("到底了")}}
				</text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	import Countdown from '../components/Countdown.vue'
	export default {
		components: {
			Countdown
		},
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
				title: _this.$nw('秒杀会场'),
			})
			_this.getData()
		},
		onShareAppMessage() {},
		onShareTimeline() {},
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
				console.log('item', item);
				const active_status = item.active_status
				if (active_status != 2) {
					uni.navigateTo({
						url: '/main/pages/product/detail/detail?product_type=product&product_id=' + item.product_id
					})
				} else {
					uni.navigateTo({
						url: '/plus/pages/seckill/detail/detail?seckill_product_id=' + item.seckill_product_id
					})
				}
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
	.venue-wrap {
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
			background: url('https://shanghui.client.xcx008.com/file/uploads/20240528/57d6300a19060c32261fdd22d58c95f2.png') no-repeat;
			background-position: 0 0;
			background-size: 100% auto
		}

		.venue-top {
			width: 100%;
			height: 120rpx;
			position: fixed;
			left: 0;
			z-index: 88;
			padding: 24rpx 0 0;
			background: url('https://shanghui.client.xcx008.com/file/uploads/20240528/57d6300a19060c32261fdd22d58c95f2.png') no-repeat;
			background-position: 0 0;
			background-size: 100% auto;
			background-color: #F4F7FB;

			.date-bar {
				padding: 0 24rpx;
				overflow: hidden;
				overflow-x: auto;
				white-space: nowrap;

				.item {
					width: 164rpx;
					height: 88rpx;
					margin-right: calc((100% - (164rpx * 4)) / 3);
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					transition: all .2s;
					border-radius: 16rpx;

					.date,
					.label {
						width: 164rpx;
						text-align: center;
						color: rgba(255, 255, 255, 1);
						transition: color .2s;
						line-height: 1;
						font-size: 24rpx;
					}

					.label {
						font-weight: 500;
						margin-top: 16rpx;
					}

					&.active {
						background: #fff;

						.date,
						.label {
							color: #F31111;
						}
					}

					&:last-of-type {
						margin-right: 0;
					}
				}
			}

			.category-bar {
				width: 100%;
				margin-top: 24rpx;
				overflow: hidden;
				overflow-x: auto;
				white-space: nowrap;
				display: flex;

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
		}

		.venue-content {
			padding: 24rpx 0 0;
			box-sizing: border-box;
			position: relative;
			z-index: 1;
			padding-top: 120rpx;
			padding-bottom: calc(40rpx + env(safe-area-inset-bottom) / 2);

			.product-group {
				padding: 12rpx 24rpx 0;

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

						.product-title {
							font-weight: 500;
							line-height: 40rpx;
						}

						.product-tags {
							margin-left: -8rpx;
							margin-top: 12rpx;

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
						}

						.sell-progress {
							width: 100%;
							height: 48rpx;
							background: #FFF5F5;
							border-radius: 8rpx;
							margin-top: 36rpx;
							padding-left: 16rpx;
							position: absolute;
							left: 0;
							bottom: 0;

							.progress-content {
								.progress {
									width: 164rpx;
									height: 16rpx;
									background: #fff;
									border-radius: 999px;

									.leng {
										height: 100%;
										background: linear-gradient(90deg, #FB9970 0%, #FF0000 100%);
										border-radius: 999px;
									}
								}

								.tips {
									font-size: 20rpx;
									color: #F31111;
									margin-left: 16rpx;
								}
							}

							.buy-btn {
								width: 154rpx;
								height: 64rpx;
								position: absolute;
								bottom: 0;
								right: 0;
							}

							&.soon {
								background: linear-gradient(270deg, #F31111 0%, #FF6666 100%);
								color: #fff;
								font-size: 20rpx;
								justify-content: center;
								padding-left: 0;
							}

							&.finish {
								background: #FFF5F5;

								.leng {
									background: #CBCBCB !important;
								}

								.tips {
									color: #999 !important;
								}
							}
						}
					}
				}
			}
		}
	}
</style>