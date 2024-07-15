<template>
	<view style="padding: 24rpx;">
		<view class="shanghui">
			<view class="ProductList">
				<view class="ProductList-box" v-for="(item,index) in list" :key="index" @click="gotoList(item.product_id)">
					<img :src="item.product_main_img" alt="" />
					<view class="">
						<view class="u-line-1" style="font-size: 28rpx;width: 500rpx;" >
							{{item.product_name}}
						</view>
						<view class="" style="font-size: 20rpx;color: #666;">
							产品介绍：{{item.product_note}}
						</view>
					</view>
					<u-icon class="icon" name="arrow-right" color="#666666" size="30"></u-icon>
				</view>
				<!-- <view class="dcc" style="margin-top: 24rpx;">
					<text style="font-size: 24rpx;color: #666;margin-right: 10rpx;">查看全部</text>
					<u-icon class="icon" name="arrow-right" color="#666666" size="22"
						style="margin-top: 4rpx;"></u-icon>
				</view> -->
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[]
			};
		},
		methods:{
			gotoList(e){
				let url='main/pages/product/detail/detail?product_id=' + e
				this.gotoPage(url);
			}
		},
		onLoad(e) {
			this._get('plus.coc.Coc/getAllProduct', {coc_id:e.coc_id}, (res) => {
				console.log(res);
				this.list = res.data.list
			})
		},
		onShow() {
			this.setGlobalColor({
				bgc: '#ffffff'
			})
			
		},
	}
</script>

<style lang="scss">
	page{
		background-color: #fff;
	}
	.shanghui {
		.contact-t {
			font-size: 28rpx;
			line-height: 2;
			margin-right: 24rpx;
		}

		.logoq {
			img {
				width: 100%;
				height: 316rpx;
			}
		}

		.ProductList {
			.ProductList-box {
				margin-top: 16rpx;
				position: relative;

				.icon {
					position: absolute;
					top: 54rpx;
					right: 10rpx;
				}

				display: flex;

				img {
					width: 128rpx;
					height: 128rpx;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					margin-right: 16rpx;
				}
			}
		}

		.shanghui-t1 {
			display: flex;

			.shanghui-t1-box {
				width: 170rpx;
				text-align: center;
				margin-right: 48rpx;

				img {
					width: 96rpx;
					height: 96rpx;
					border-radius: 16rpx;
				}

				view {
					font-size: 24rpx;
				}
			}
		}

		margin-top: 28rpx;

		.shanghui-t {
			display: flex;
			align-items: center;
		}

		.shanghui-l {
			width: 8rpx;
			height: 32rpx;
			background: #1B94E0;
			border-radius: 26rpx 26rpx 26rpx 26rpx;
			margin-right: 16rpx;
		}

		.shanghui-r {
			font-size: 32rpx;
			font-weight: 800;
		}
	}
</style>