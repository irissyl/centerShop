<template>
	<scroll-view v-if="!loading" scroll-y="true" class="new-index-wrap scroll-Y"
		:style="'height:' + scrollviewHigh + 'px;'" lower-threshold="200" @scrolltolower="scrolltolowerFunc">
		<view class="new-index-content">
			<view class="search-bar flex-c">
				<view class="search-box flex-c" @click="gotoSearch">
					<view class="search-icon">
						<i class="iconfont icon-sousuo"></i>
					</view>
					<view class="search-inp">
						{{$nw('搜索')}}
					</view>
				</view>

				<view class="sign-btn" @click="signHandle">
					<image class="common-img"
						src="https://shanghui.client.xcx008.com/file/uploads/20240603/f955232e8421fdb17f865df0f7bfa8b4.png" />
				</view>
			</view>

			<view v-if="banner_list && banner_list.length" class="swiper-wrap">
				<swiper class="swiper" :indicator-dots="false" autoplay :interval="3000" :duration="300"
					circular="true">
					<swiper-item v-for="(item,index) in banner_list" :key="index" @click="bannerTo(item)">
						<image class="common-img" :src="item.img" mode="aspectFill" />
					</swiper-item>
				</swiper>
			</view>

			<view class="category-bar flex-wrap">
				<view class="category-item" v-for="(item,index) in category_list" :key='index'
					@click="toCategory(item.category_id)">
					<view class="category-icon">
						<image v-if="item.images && item.images.file_path" class="common-img"
							:src="item.images.file_path" mode="aspectFill" />
					</view>
					<view class="category-label">
						{{item.name}}
					</view>
				</view>
				<view class="category-item" @click="toCategory(0)">
					<view class="category-icon" style="padding: 20rpx;">
						<image class="common-img"
							src="https://shanghui.client.xcx008.com/file/uploads/20240603/b6ec9b53c59dcfc50532f807623785dd.png"
							mode="aspectFill" />
					</view>
					<view class="category-label">
						{{$nw('全部')}}
					</view>
				</view>
			</view>

			<view class="sale-card flex-c">
				<!-- 秒杀 -->
				<view v-if="sale_list && sale_list.length" class="activity-bar" @click='toVenue'>
					<view class="activity-top flex-c">
						<view class="icon">
							<image class="common-img"
								src="https://shanghuitest.client.xcx008.com/file/uploads/20240617/1a4481e8b298821212700250fa7a0cd3.png"
								mode="aspectFill" />
						</view>
						<view class="tips">
							{{$nw('手慢无')}}
						</view>
					</view>
					<view class="activity-list hide-scrollbar flex"
						:class="{'alone' : !tail_list || !tail_list.length}">
						<view class="item" v-for="(item,index) in sale_list" :key="index">
							<view class="item-img common-img-bg small">
								<image class="common-img" :src="item.product.file_path" mode="aspectFill" />
							</view>
							<view class="item-price">
								￥<text class="money">{{item.product_price}}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 尾货 -->
				<view v-if="tail_list && tail_list.length" class="activity-bar tail" @click='toTailgoods'>
					<view class="activity-top flex-c">
						<view class="icon">
							<image class="common-img"
								src="https://shanghuitest.client.xcx008.com/file/uploads/20240617/e239be9e6aaafe7ed320d360fe09100e.png"
								mode="aspectFill" />
						</view>
						<view class="tips">
							{{$nw('是真便宜')}}
						</view>
					</view>
					<view class="activity-list hide-scrollbar flex"
						:class="{'alone' : !sale_list || !sale_list.length}">
						<view class="item" v-for="(item,index) in tail_list" :key="index">
							<view class="item-img common-img-bg small">
								<image v-if="item.product_image || item.product_main_img" class="common-img"
									:src="item.product_image || item.product_main_img" mode="aspectFill" />
							</view>
							<view class="item-price">
								￥<text class="money">{{item.product_price}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 推广弹窗 -->
			<PromotionPop />
			<!-- 为你推荐 -->
			<RecommendProduct ref="RecommendProductRef" />
			<!-- 菜单栏 -->
			<Tabbar />
		</view>
	</scroll-view>
</template>

<script>
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import RecommendProduct from '@/components/RecommendProduct.vue'
	import PromotionPop from '@/components/index/PromotionPop.vue'

	export default {
		components: {
			Tabbar,
			RecommendProduct,
			PromotionPop
		},
		data() {
			return {
				loading: true,
				scrollviewHigh: 0,
				imgList: ['https://shanghui.client.xcx008.com/file/uploads/20240522/2d67de2db80021b9c9e5e6b23226861f.jpg',
					'https://shanghui.client.xcx008.com/file/uploads/20240522/2c3054453ac8f21b03b1b22d8533eba4.jpg',
					'https://shanghui.client.xcx008.com/file/uploads/20240522/b29bffbc7d250540e19ce42fc67bdded.jpg'
				],
				banner_list: [],
				category_list: [],
				sale_list: [],
				tail_list: [],
				RecommendProductRef: null
			}
		},
		onShow() {

		},
		onLoad() {
			let _this = this
			_this.setGlobalColor({
				bgc: '#EBF5FF'
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			uni.setNavigationBarTitle({
				title: _this.$nw('万商联营'),
			})
			// 获取banner和产品分类
			_this.getData()
			// 获取秒杀商品列表
			_this.getFlashSale()
			// 获取尾货商品列表
			_this.getTailGood()
		},
		onShareAppMessage() {},
		onShareTimeline() {},
		methods: {
			bannerTo(item) {
				console.log('item-->', item);
				let type = item.type;
				switch (type) {
					case 1:
						// 外链
						console.log('外链');
						uni.navigateTo({
							url: '/pages/webpage/webpage?url=' + item.url_link
						})
						break;
					case 2:
						// 商品详情
						console.log('商品详情');
						uni.navigateTo({
							url: '/main/pages/product/detail/detail?product_id=' + item.platform_content_id
						})
						break;
					case 3:
						// 秒杀会场
						console.log('秒杀会场');
						this.toVenue()
						break;
					case 4:
						// 图文资讯
						console.log('图文资讯');
						uni.navigateTo({
							url: '/pages/richTextPage/index?id=' + item.id
						})
						break;
					default:
						return false
				}
			},
			toVenue() {
				uni.navigateTo({
					url: '/plus/pages/seckill/list/list'
				})
			},
			toTailgoods() {
				uni.navigateTo({
					url: '/plus/pages/tailgoods/index'
				})
			},
			toCategory(category_id) {
				if (category_id == 0) {
					uni.navigateTo({
						url: '/main/pages/product/category'
					})
				} else {
					console.log('category_id', category_id);
					uni.navigateTo({
						url: '/main/pages/product/category?category_id=' + category_id
					})
				}
			},
			// 获取banner和商品分类
			getData() {
				this.loading = true;
				uni.showLoading({
					title: "加载中"
				});
				this._get('plus.home.index/HomeBanner', {}, (res) => {
					if (res.code == 1) {
						this.banner_list = res.data.banner_list || []
						this.category_list = res.data.category_list || []
					}
					uni.hideLoading();
					this.loading = false
				}, (err) => {
					console.log('请求结束-->')
					uni.hideLoading();
					this.loading = false
				})
			},
			// 获取秒杀列表
			getFlashSale() {
				this._get('plus.home.index/HomeFlashSale', {}, (res) => {
					if (res.code == 1) {
						this.sale_list = res.data || []
					}
				}, (err) => {

				})
			},
			// 获取尾货列表
			getTailGood() {
				this._get('plus.home.TailGood/getTailGood', {}, (res) => {
					if (res.code == 1) {
						this.tail_list = res.data || []
					}
				}, (err) => {

				})
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
				this.$refs.RecommendProductRef.scrolltolowerFunc()
			},
			gotoSearch() {
				uni.navigateTo({
					url: '/main/pages/product/search/search'
				})
			},
			signHandle() {
				uni.navigateTo({
					url: '/plus/pages/signin/signin'
				})
			},
			// 秒杀商品详情
			seckillDetails(item) {
				uni.navigateTo({
					url: '/plus/pages/seckill/detail/detail?seckill_product_id=' + item.seckill_product_id
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.new-index-wrap {
		background: #F4F7FB;
		position: relative;

		&::before {
			content: '';
			width: 100%;
			height: 320rpx;
			background: linear-gradient(180deg, #EBF5FF 0%, rgba(225, 238, 250, 0) 100%);
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}

		.new-index-content {
			padding: 12rpx 24rpx 0;
			box-sizing: border-box;
		}

		.search-bar {
			.search-box {
				flex: 1;
				height: 64rpx;
				background: #fff;
				border-radius: 999px;
				padding: 0 20rpx;

				.search-icon {
					width: 28rpx;
					/* #ifdef H5 */
					padding-top: 2rpx;
					/* #endif */

					.iconfont {
						font-size: 28rpx;
						color: #999;
					}
				}

				.search-inp {
					margin-left: 10rpx;
					flex: 1;
					color: #999;

				}
			}

			.sign-btn {
				width: 64rpx;
				height: 64rpx;
				margin-left: 12rpx;
				position: relative;
				right: -4rpx;
			}
		}

		.swiper-wrap {
			height: 280rpx;
			margin-top: 24rpx;
			border-radius: 16rpx;
			background: #fff;
			overflow: hidden;

			.swiper {
				height: 100%;
			}
		}

		.category-bar {
			margin-top: 16rpx;
			padding: 40rpx 20rpx;
			padding-bottom: 8rpx;
			background: #fff;
			border-radius: 16rpx;

			.category-item {
				width: calc((100% - (10rpx * 4)) / 5);
				margin-right: 10rpx;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-bottom: 32rpx;

				&:nth-of-type(5n) {
					margin-right: 0;
				}

				.category-icon {
					width: 100rpx;
					height: 100rpx;
					background: #F4F7FC;
					border-radius: 8rpx;
					overflow: hidden;
					padding: 12rpx;
				}

				.category-label {
					font-size: 22rpx;
					line-height: 1;
					margin-top: 16rpx;
					color: #444;
				}
			}
		}

		.sale-card {}

		.activity-bar {
			flex: 1;
			height: 224rpx;
			margin-top: 16rpx;
			padding: 18rpx;
			background: url('https://shanghuitest.client.xcx008.com/file/uploads/20240617/371336da1013f81933dc885a50106d03.png') no-repeat;
			background-position: center;
			background-size: cover;
			background-color: #fff;
			border-radius: 16rpx;
			overflow: hidden;

			&:first-of-type {
				margin-right: 20rpx;
			}

			&:last-of-type {
				margin-right: 0 !important;
			}

			&.tail {
				background-image: url('https://shanghuitest.client.xcx008.com/file/uploads/20240617/5c09672a42f31c9293ede34c5f4e21ea.png');

				.activity-top {
					top: -2rpx;

					.icon {
						width: 114rpx;
						height: 28rpx;
					}

					.tips {
						background: #1B94E0;
					}
				}
			}

			.activity-top {
				height: 32rpx;
				position: relative;

				.icon {
					width: 66rpx;
					height: 32rpx;
					margin-right: 8rpx;
				}

				.tips {
					height: 24rpx;
					font-size: 16rpx;
					color: #fff;
					background: #F31111;
					border-radius: 4rpx;
					padding: 0 8rpx;
					display: flex;
					align-items: center;
				}

				.link-btn {
					margin-left: auto;
					font-size: 20rpx;
					line-height: 1;

					.iconfont {
						font-size: 20rpx;
						margin-left: 4rpx;
					}
				}
			}

			.activity-list {
				margin: 12rpx 24rpx 0;
				margin-top: 8rpx;
				overflow: hidden;
				overflow-x: auto;
				white-space: nowrap;

				&.alone {
					margin: 12rpx 36rpx 0;

					.item {
						margin-right: calc((100% - (112rpx * 4)) / 3);
					}
				}

				.item {
					flex: 0 0 auto;
					width: 112rpx;
					margin-right: calc((100% - (112rpx * 2)));

					&:last-of-type {
						margin-right: 0;
					}

					.item-img {
						width: 112rpx;
						height: 112rpx;
						// padding: 16rpx;
						// background: rgba(255, 255, 255, .6);
						border-radius: 16rpx;
						overflow: hidden;
					}

					.item-price {
						color: #F31111;
						font-weight: 500;
						font-size: 20rpx;
						margin-top: 4rpx;
						text-align: center;

						.money {
							font-weight: 500;
							color: #F31111;
							font-size: 28rpx;
						}
					}
				}


			}
		}
	}
</style>