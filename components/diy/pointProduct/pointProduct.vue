<template>
	<view class="diy-product" :style="{ background: itemData.style.background }">
		<view :class="['display__' + itemData.style.display]" style="padding-top: 20rpx;">
			<template v-if="itemData.params.source == 'auto'">
				 <scroll-view  scroll-y="true"  @scrolltolower="scroll">
					<view class="product-list" :class="['column__' + itemData.style.column,'column2__' + itemData.style.column]">
						<view class="product-item" v-for="(item, index) in listData" :key="index" @click="gotoDetail(item.point_product_id)">
							<!-- 单列商品 -->
							<template v-if="itemData.style.column == 1">
								<view class="product-item-box">
									<!-- 商品图片 -->
									<view class="product-cover"><image :src="item.product_image" mode="aspectFill"></image></view>
									<view class="product-info">
										<!-- 商品名称 -->
										<view v-if="itemData.style.show.productName" class="product-title">
											<text>{{ item.product.product_name }}</text>
										</view>
										<!-- 商品价格 -->
										<view class="price d-s-c mt10">
											<view v-if="itemData.style.show.productPrice" class="red">
												<text>¥</text>
												<text class="">{{ item.sku[0].point_money }}+{{item.sku[0].point_num}}积分</text>
											</view>
										</view>
									</view>
								</view>
							</template>

							<!-- 两列三列 -->
							<template v-else>
								<view class="product-cover"><image :src="item.product_image" mode="aspectFill"></image></view>
								<view class="product-info">
									<view v-if="itemData.style.show.productName == 1" class="product-title">{{ item.product.product_name }}</view>
									<view class="price d-s-c">
										<view v-if="itemData.style.show.productPrice == 1" class="red">
											<view v-if="itemData.style.show.productPrice" class="red">
												<text>¥</text>
												<text class="">{{ item.sku[0].point_money }}+{{item.sku[0].point_num}}积分</text>
											</view>
										</view>
									</view>
								</view>
							</template>
						</view>
					</view>
				</scroll-view>
			</template>
			<template v-else>
				<view class="product-list" :class="['column__' + itemData.style.column]">
					<view class="product-item" v-for="(product, index) in itemData.data " :key="index" @click="gotoDetail(product.point_product_id)">
						<!-- 单列商品 -->
						<template v-if="itemData.style.column == 1">
							<view class="product-item-box">
								<!-- 商品图片 -->
								<view class="product-cover"><image :src="product.image" mode="aspectFill"></image></view>
								<view class="product-info">
									<!-- 商品名称 -->
									<view v-if="itemData.style.show.productName" class="product-title">
										<text>{{ product.product_name }}</text>
									</view>
									<!-- 商品价格 -->
									<view class="price d-s-c mt10">
										<view v-if="itemData.style.show.productPrice" class="red">
											<text>¥</text>
											<text class="">{{ product.point_money }}+{{product.point_num}}积分</text>
										</view>
									</view>
								</view>
							</view>
						</template>
				
						<!-- 两列三列 -->
						<template v-else>
							<view class="product-cover"><image :src="product.image" mode="aspectFill"></image></view>
							<view class="product-info">
								<view v-if="itemData.style.show.productName == 1" class="product-title">{{ product.product_name }}</view>
								<view class="price d-s-c">
									<view v-if="itemData.style.show.productPrice == 1" class="red">
										<view v-if="itemData.style.show.productPrice" class="red">
											<text>¥</text>
											<text class="">{{ product.point_money }}+{{product.point_num}}积分</text>
										</view>
									</view>
								</view>
							</view>
						</template>
					</view>
				</view>
			</template>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			listData: [],
			last_page: 0,
			/*当前页面*/
			page: 1,
			/*每页条数*/
			list_rows: 10,
			no_more: false
		};
	},
	props: ['itemData'],
	created() {
		console.log(this.itemData.data.data)
		this.listData = this.itemData.data.data
		this.last_page = this.itemData.data.last_page
		// this.getData()
	},
	methods: {
		scroll(e) {
			let self = this;
			console.log(e)
			if (self.page < self.last_page) {
				self.page++;
				self.getData();
			}
		},
		/*获取数据*/
		getData() {
			let self = this;
			self.loading = true;
			self._get(
				'plus.points.product/index',
				{
					page: self.page || 1,
					list_rows: self.list_rows
				},
				function(res) {
					self.loading = false;
					console.log(self.listData)
					self.listData = self.listData.concat(res.data.list.data);
					// self.listData = self.getUnique(self.listData,"point_product_id");
					console.log(self.listData)
					self.last_page = res.data.list.last_page;
					console.log('数据结束')
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}
				}
			);
		},
		/*跳转产品详情*/
		gotoDetail(e) {
			let url='/plus/pages/points/detail/detail?point_product_id=' + e;
			this.gotoPage(url);
		}
	}
};
</script>

<style>
.diy-product {
	padding:0 20rpx;
}
.diy-product .product-list.column2__1 {
	max-height: 1440rpx;
}
.diy-product .product-list.column2__2 {
	max-height: 1600rpx;
}
.diy-product .product-list.column2__3 {
	max-height: 1200rpx;
}
.diy-product .product-list.column__1 .product-item {
	margin-bottom: 20rpx;
	background: #ffffff;
	width: 100%
}
.diy-product .product-list.column__1 .product-item-box {
	display: flex;
	justify-content: flex-start;
	align-items: stretch;
}
.diy-product .product-list .product-cover image{
	width: 100%;
	height: 100%;
}

.diy-product .product-list.column__1 .product-cover {
	width: 240rpx;
	height: 240rpx;
	border-radius: 20rpx;
	overflow: hidden;
}

.diy-product .product-list.column__1 .product-info {
	margin:20rpx 20rpx 20rpx 30rpx;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.diy-product .product-list .product-info .already-sale text {
	padding: 4rpx 8rpx;
	border-radius: 8rpx;
	background: #f2f2f7;
	color: #999;
}
.diy-product .product-list .product-title {
	display: -webkit-box;
	font-size: 28rpx;
	overflow: hidden;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.diy-product .product-list.column__1 .product-title {
	max-height: 80rpx;
	line-height: 40rpx;
}

.diy-product .product-list.column__1 .selling-point{
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	line-height: 30rpx;
	max-height: 60rpx;
}

.diy-product .product-list.column__1  .already-sale{
	margin-top: 10rpx;
}

.diy-product .product-list.column__2 .product-title {
	height: 80rpx;
	line-height: 40rpx;
	margin-top: 20rpx;
}
.diy-product .product-list.column__3 .product-title {
	margin-top: 20rpx;
	margin-left: 10rpx;
	margin-right: 10rpx;
	height: 72rpx;
	line-height: 36rpx;
	font-size: 28rpx;
}
.diy-product .product-list.column__2 .product-info {
	padding: 0 24rpx;
}
.diy-product .product-list .price {
	font-size: 28rpx;
}
.diy-product .product-list.column__2 .price {
	margin-top: 10rpx;
	font-size: 28rpx;
}
.diy-product .product-list.column__3 .price {
	margin-top: 10rpx;
	padding: 0 10rpx;
	font-size: 28rpx;
}
.diy-product .product-list.column__3 .price .text-d-line {
	font-size: 22rpx;
}

.diy-product .product-list.column__2,
.diy-product .product-list.column__3 {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
}
.diy-product .column__2 .product-item {
	width: 350rpx;
	border-radius: 20rpx;
	margin-right: 10rpx;
	margin-bottom: 10rpx;
	padding-bottom: 20rpx;
	overflow: hidden;
	background: #ffffff;
	box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
}
.diy-product .display__list .column__2 .product-item:nth-child(2n + 0) {
	margin-right: 0;
}
.diy-product .column__2 .product-cover {
	width: 350rpx;
	height: 350rpx;
}
.diy-product .column__3 .product-item {
	width: 230rpx;
	margin-bottom: 10rpx;
	margin-right: 10rpx;
	padding-bottom: 10rpx;
	border-radius: 8rpx;
	overflow: hidden;
	background: #ffffff;
	box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
}
.diy-product .display__list .column__3 .product-item:nth-child(3n + 0) {
	margin-right: 0;
}
.diy-product .column__3 .product-cover {
	width: 230rpx;
	height: 230rpx;
}

.diy-product .display__slide .product-list {
	flex-wrap: nowrap;
}
.diy-product .display__slide .column__2 .product-item {
	width: 300rpx;
}
.diy-product .display__slide .column__3 .product-item {
	width: 200rpx;
}
</style>