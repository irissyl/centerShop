<template>
	<view class="">
		<view class="title flex-c">
			为你推荐
			<view class="more-btn flex-c" @click="gotoGoods">
				查看更多
				<u-icon class="more-btn-icon" name="arrow-right"></u-icon>
			</view>
		</view>
		<view class="diy-product">
			<view class="product-box" v-for="(product, index) in itemData.data" :key="index" style="position: relative;"
				@click="gotoDetail(product.product_id)">
				<view class="product-cover"><u-image width="100%" height="276rpx" :src="product.image"
						mode="aspectFill"></u-image></view>
				<view v-if="itemData.style.show.productName" class="product-title1">
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
						<text style="margin-right: 8rpx;">已售</text> <text>{{product.product_sales || 0}}</text>
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
				scrollTop: 0
			};
		},
		props: ['itemData'],
		created() {
			// console.log(this.itemData,12321321);
		},
		methods: {
			scroll(e) {},

			/*跳转产品详情*/
			gotoDetail(e) {
				let url = '/main/pages/product/detail/detail?product_type=product&product_id=' + e;
				uni.navigateTo({
					url
				})
			},
			gotoGoods() {
				uni.reLaunch({
					url: '/main/pages/product/category'
				});
			}
		}
	};
</script>

<style lang="scss">
	.title {
		color: #333333;
		font-size: 32rpx;
		font-weight: 800;
		padding: 0 24rpx;
		line-height: 1;
		margin-top: 20rpx;

		.more-btn {
			margin-left: auto;
			font-size: 24rpx;

			.more-btn-icon {
				margin-left: 10rpx;
			}
		}
	}

	.diy-product {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding: 24rpx;

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
			height: 440rpx;
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