<template>
	<view class="">
		<view class="recommend-product-title">
			<text class="title">
				{{$nw('为你推荐')}}
			</text>
		</view>
		<view class="diy-product">
			<view class="product-box" v-for="(product, index) in listData" :key="index" style="position: relative;"
				@click="gotoDetail(product.product_id)">
				<view class="product-cover"><img :src="product.product_image"></img></view>
				<view class="product-title1">
					<view class="product-item-box6">
						<div class="u-line-2">{{ product.product_name }} </div>
					</view>
				</view>
				<view class="product-item-box5">
					<view class="f331" style="font-size: 32rpx; color: red;"><text
							style="font-size: 28rpx;margin-right: 6rpx;">{{$nw("¥")}}</text>
						{{ product.product_price  }}
					</view>

					<view class="user-info" style="color: #999999;font-size: 20rpx;">
						<text style="margin-right: 8rpx;">{{$nw('已售')}}</text>
						<text>{{product.product_sales || 0}}</text>
					</view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				listData: [],
			};
		},
		props: ['itemData'],
		created() {
			this.getData();
		},
		methods: {
			getData() {
				let self = this;
				let page = self.page;
				// self.loading = true;
				self._get(
					'product.product/recommendProduct', {
						page: page || 1,
						category_id: 5,
						search: '',
						sortType: 'all',
						sortPrice: 0,
						list_rows: 10,
						token: '',
						app_id: 10001,
						param: self.recommendData,
					},
					function(res) {
						self.loading = false;
						self.listData = self.listData.concat(res.data.list.data);
						self.listData = self.getUnique(self.listData, "product_id");
						// console.log(self.listData);
						self.last_page = res.data.list.last_page;
						if (res.data.list.last_page <= 1) {
							self.no_more = true;
						}
					}
				);
			},
			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {
				console.log(1111);
				let self = this;
				self.bottomRefresh = true;
				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					self.no_more = true;
					return;
				}
				self.getData();
			},
			scroll(e) {},
			/*跳转产品详情*/
			gotoDetail(e) {
				let url = '/main/pages/product/detail/detail?product_type=product&product_id=' + e;
				uni.navigateTo({
					url
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.recommend-product-title {
		padding: 0 24rpx;
		margin: 32rpx 0;
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

	.diy-product {
		column-count: 2; //想要排成的列数
		column-gap: 14rpx;

		.product-item-box5 {
			width: 100%;
			padding: 0 16rpx;
			position: absolute;
			bottom: 0;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}

		.product-item-box6 {
			color: #333333;
			font-size: 28rpx;
			font-weight: 800;
			letter-spacing: 2rpx;
			padding: 10rpx 16rpx;
		}

		.product-box {
			overflow: hidden;
			width: 344rpx;
			padding-bottom: 50rpx;
			background: #fff;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			margin-bottom: 16rpx;

			.product-cover {
				img {
					width: 100%;
				}
			}
		}
	}
</style>