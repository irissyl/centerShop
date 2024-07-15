<template>
	<view class="recommend-product">
		<view class="title d-c-c" v-if="listData.length > 0">
			<text class="line left-line"></text>
			<text class="name" :style="'color:'+getMainTextColor()+';'">{{$nw("为你推荐")}}</text>
			<text class="line right-line"></text>
		</view>
		<view class="recommend-product-list">
			<view class="item" v-for="(item, index) in listData" :key="index" @click="gotoList(item.product_id)">
				<view class="product-cover"><image :src="item.product_image" mode="aspectFill"></image></view>
				<view class="product-info">
					<view class="product-title">{{ item.product_name }}</view>
					<view class="d-b-c mt20">
						<view class="already-sale f22 gray9">{{$nw("已售")}}{{ item.product_sales }}{{$nw("件")}}</view>
						<view class="price" v-if="(item.buy_auth.can_buy>0||item.buy_auth.no_price==0)">
							{{$nw("¥")}}
							<text class="num">{{ item.product_sku.product_price }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 没有记录 -->
			<!-- <view class="d-c-c p30" v-if="listData.length == 0 && !loading">
				<text class="iconfont icon-wushuju"></text>
				<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
			</view>
			<uni-load-more v-else :loadingType="loadingType"></uni-load-more> -->
		</view>
	</view>
</template>

<script>
import uniLoadMore from "@/components/uni-load-more.vue";
export default {
	components: {
	    uniLoadMore
	},
	data() {
		return {
			/*数据*/
			listData: [],
			/*底部加载*/
			loading: true,
			/*没有更多*/
			no_more: false,
			/*当前页面*/
			page: 1,
		};
	},
	created() {
		this.getData();
	},
	computed: {
		/*加载中状态*/
		loadingType() {
			if (this.loading) {
				return 1;
			} else {
				if (this.listData.length != 0 && this.no_more) {
					return 2;
				} else {
					return 0;
				}
			}
		}
	},
	props: [],
	watch: {
		page: function(n, o) {
			if (n != o) {
				this.scrolltolowerFunc();
			}
		}
	},
	onPullDownRefresh() {

	},
	methods: {
		/*获取数据*/
		getData() {

			let self = this;
			let page = self.page;
			// self.loading = true;
			self._get(
				'product.product/recommendProduct',
				{
					page: page || 1,
					category_id: 5,
					search: '',
					sortType: 'all',
					sortPrice: 0,
					list_rows: 10,
					token: '',
					app_id: 10001,
					param:self.recommendData,
				},
				function(res) {
					self.loading = false;
					self.listData = self.listData.concat(res.data.list.data);
					self.listData = self.getUnique(self.listData,"product_id");
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


		/*推荐商品跳转*/
        gotoList(e){
			let url='main/pages/product/detail/detail?product_id=' + e
			this.gotoPage(url);
		}
	}
};
</script>

<style lang="scss">
.recommend-product{ margin-top: 40rpx;}
.recommend-product .title{ heigth:100rpx; font-size:30rpx;}
.recommend-product .title .name{ margin:0 20rpx; font-size:30rpx;}
.recommend-product .title .line{position: relative; display: block; width: 100rpx; border-top:1px solid red;}
.recommend-product .title .line::after{ position: absolute; content:''; display: block; width: 16rpx; height:16rpx; border-radius:50%; background: red;}
.recommend-product .title .left-line::after{ right:0; top:-9rpx;}
.recommend-product .title .right-line::after{ left:0; top:-9rpx;}
.recommend-product-list {
	padding: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	flex-wrap: wrap;
}
.recommend-product-list .item {
	width: 350rpx;
	border-radius: 20rpx;
	margin-right: 10rpx;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	overflow: hidden;
	background: #ffffff;
	box-shadow: 0 0 8rpx rgba(0,0,0,.1);
	margin-bottom: 10rpx;
}
.recommend-product-list .item:nth-child(2n+0){
	margin-right: 0;
}
.recommend-product-list .product-cover {
	width: 350rpx;
	height: 350rpx;
}
.recommend-product-list image{ width: 100%; height:100%;}
.recommend-product-list .product-info{ padding: 0 24rpx;}
.recommend-product-list .product-title {
	height: 100rpx;
	margin-top: 20rpx;
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	font-size: 30rpx;
}
.recommend-product-list .price {
	color: $dominant-color;
}
.recommend-product-list .price .num {
	font-size: 30rpx;
	font-weight: bold;
}
</style>
