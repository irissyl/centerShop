<template>
	<view v-if='productList.length' class="recommend-product-wrap">
		<view v-if="isUser" class="recommend-product-title">
			<text class="title">
				{{$nw('为你推荐')}}
			</text>
		</view>
		<view v-else class="left-title">
			{{$nw('为你推荐')}}
		</view>
		<view class="product-list flex-wrap">
			<view class="product-item" v-for="(item,index) in productList" :key="index"
				@click="gotoDetail(item.product_id)">
				<view class="product-img common-img-bg">
					<image class="common-img" :src="item.product_image || item.product_main_img" mode="aspectFill"
						lazy-load />
					<view v-if="item.show_commission && item.direct_commission > 0" class="product-tips flex-c">
						<view class="label">
							{{$nw('分享可赚佣金')}}
						</view>
						<view class="price">
							￥<text class="money">{{toFixed(item.direct_commission)}}</text>
						</view>
					</view>
				</view>

				<view class="product-info">
					<view class="product-title text-ellipsis2">
						{{item.product_name || '--'}}
					</view>
					<view class="product-bottom flex-c">
						<view class="price">
							￥<text class="money">{{item.product_price || '--'}}</text>
						</view>
						<view class="sell">
							{{$nw('已售')}}
							<text class="num">{{item.product_sales || 0}}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view v-show="loading" class="load-box flex-c">
			<i class="iconfont jiazaizhong"></i>
			加载中
		</view>

		<view v-if="no_more && !loading" class="nomore-box">
			<text class="nomore-content">
				{{$nw("到底了")}}
			</text>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'RecommendProduct',
		data() {
			return {
				loading: false,
				page: 1,
				productList: [],
				no_more: false,
				last_page: 0
			}
		},
		props: ['isUser'],
		created() {
			this.getData();
		},
		methods: {
			// 下拉加载更多
			scrolltolowerFunc() {
				console.log('下拉加载更多');
				if (this.no_more) return
				this.page++
				this.getData()
			},
			getData() {
				if (this.loading) return
				this.loading = true
				this._get(
					'product.product/recommendProduct', {
						page: this.page || 1,
						category_id: 5,
						sortType: 'all',
						sortPrice: 0,
						list_rows: 20,
						app_id: 10001,
						param: {}
					}, (res) => {
						if (this.page <= 1) {
							this.productList = []
						}
						this.productList = this.productList.concat(res.data.list.data);
						this.productList = this.getUnique(this.productList, "product_id");
						console.log('productList--->', this.productList);
						this.last_page = res.data.list.last_page;
						if (res.data.list.last_page <= this.page) {
							this.no_more = true;
						}
						setTimeout(() => {
							this.loading = false
						}, 500)
						// this.loading = false
					}, (err) => {
						this.loading = false
					}
				);
			},
			gotoDetail(e) {
				let url = '/main/pages/product/detail/detail?product_type=product&product_id=' + e;
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.recommend-product-wrap {
		.recommend-product-title {
			padding: 0 24rpx;
			margin: 32rpx 0 20rpx;
			text-align: center;

			.title {
				position: relative;
				color: #333333;
				font-size: 32rpx;
				font-weight: 800;
				line-height: 1;

				&::before,
				&::after {
					content: '';
					width: 100rpx;
					height: 1rpx;
					background: #e1e1e1;
					position: absolute;
					top: 50%;
					transform: translateY(-50%);
				}

				&::before {
					left: -100%;
				}

				&::after {
					right: -100%;
				}
			}
		}

		.left-title {
			font-size: 32rpx;
			font-weight: 500;
			line-height: 38rpx;
			padding: 24rpx 0 16rpx;
		}

		.product-list {
			.product-item {
				width: calc(50% - 10rpx);
				// margin-right: 16rpx;
				margin-bottom: 16rpx;
				background: #fff;
				border-radius: 16rpx;
				overflow: hidden;

				.product-img {
					width: 100%;
					height: 344rpx;
					position: relative;

					.common-img {
						position: relative;
						z-index: 1;
					}

					.product-tips {
						width: 100%;
						height: 48rpx;
						position: absolute;
						left: 0;
						bottom: 0;
						z-index: 2;
						background: linear-gradient(90deg, #FF5653 0%, #FF406E 100%);
						padding: 0 8rpx;
						border-radius: 8rpx 8rpx 0rpx 0rpx;

						.label {
							font-size: 20rpx;
							color: #fff;
						}

						.price {
							font-size: 20rpx;
							color: #fff;
							margin-left: auto;

							.money {
								font-size: 28rpx;
								font-weight: 500;
								color: #fff;
							}
						}
					}
				}

				.product-info {
					height: 168rpx;
					position: relative;
					padding: 16rpx;

					.product-title {
						font-weight: 500;
						line-height: 40rpx;
					}

					.product-bottom {
						width: calc(100% - 32rpx);
						position: absolute;
						left: 16rpx;
						bottom: 16rpx;

						.price {
							font-weight: 600;
							color: #F43434;
							line-height: 1;

							.money {
								color: #F43434;
								font-size: 32rpx;
								line-height: 1;
							}
						}

						.sell {
							font-size: 20rpx;
							color: #999;
							line-height: 1;
							margin-left: auto;

							.num {
								color: #999;
								margin-left: 4rpx;
								line-height: 1;
								/* #ifdef H5 */
								position: relative;
								top: 2rpx;
								/* #endif */
							}
						}
					}
				}

				&:nth-of-type(2n) {
					margin-right: 0;
				}
			}
		}
	}
</style>