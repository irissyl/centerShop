<template>
	<view class="diy-product"  :style="{ background: itemData.style.background }">
		<view :class="['display__' + itemData.style.display]">
			<template v-if="itemData.style.display == 'list'">
				<view class="product-list" :class="['column__' + itemData.style.column]">
					<view class="product-item" v-for="(product, index) in itemData.data" :key="index" @click="gotoDetail(product.product_id)">
						<!-- 单列商品 -->
						<template v-if="itemData.style.column == 1">
							<view class="product-item-box">
								<!-- 商品图片 -->
								<view class="product-cover">
									<image style="border-radius: 30rpx; padding-top: 15rpx;padding-bottom: 15rpx;" 
									:src="product.image" ></image></view>
								<view class="product-info">
									<!-- 商品名称 -->
									<view v-if="itemData.style.show.productName" class="product-title">
										<text class="f32">{{ product.product_name }}</text>
									</view>
									<!-- 商品卖点 -->
									<view v-if="itemData.style.show.sellingPoint" class="selling-point gray9">
										<text>{{ product.selling_point }}</text>
									</view>
									<!-- 商品销量 -->
									<view v-if="itemData.style.show.productSales" class="already-sale">
										<text>{{$nw("已售")}}{{ product.product_sales }}{{$nw("件")}}</text>
									</view>
									<!-- 商品价格 -->
									<view class="price d-s-c mt10" >
										<view v-if="itemData.style.show.productPrice&&(product.buy_auth.can_buy>0||product.buy_auth.no_price==0)" class="red" >
											<text>{{$nw("¥")}}</text>
											<text class="">{{ product.product_price }}</text>
										</view>
										<view class="ml10 gray9 text-d-line f28" v-if="itemData.style.show.linePrice && product.line_price > 0&&(product.buy_auth.can_buy>0||product.buy_auth.no_price==0)">
											<text>{{$nw("¥")}}</text>
											<text>{{ product.line_price }}</text>
										</view>
									</view>
									<view class="price d-s-c mt10 directCommissionstyle" v-if="(itemData.style.show.directCommission == 1||product.show_commission)&&product.direct_commission>0">
										<view  style="margin: 0 auto;">
											<text>{{$nw("赚")}}&nbsp;{{$nw("¥")}}&nbsp;</text>&nbsp;
											<text class="" style="padding-left: 5rpx;">{{ product.direct_commission }}</text>
										</view>
									</view>
								</view>
							</view>
						</template>


				<!-- 大图 start  by keven-->
						<template v-else-if="itemData.style.column == 4">
							<view class="product-item-box1">
								<view class="product-cover"><image :src="product.image" mode="aspectFill"></image></view>
								<view v-if="itemData.style.show.productName" class="product-title1">
									<view class="product-item-box6">
										<div class="f32">{{ product.product_name }} </div>
										<!-- <div>{{product.product_name}}</div> -->
									</view>

								</view>
							<hr >
								<view class="product-item-box4">
									<view class="product-item-box40">
									<!-- 	抢货时间 -->
									</view>
									<view class="product-item-box41">
										<div class="f33" style="font-size: 30rpx;"> {{$nw("库存")}}：{{ product.product_stock }}  </div>				<div class="f44" style="font-size: 30rpx;">  {{$nw("已售")}}:  {{ product.sales_actual }}</div>
									</view>

								</view>

								<view class="product-item-box5">
									<text class="f331" style="font-size: 30rpx; color: red;">{{$nw("¥")}}{{  product.product_price  }}  </text>
									<text class="f33" style="font-size: 25rpx;padding-left: 10rpx; text-decoration:line-through" v-if="product.line_price && product.line_price > 0">{{$nw("¥")}}:{{ product.line_price  }}</text>
									<view class="user-info"  >
										<view> {{$nw("已买")}} ：</view>
										<view class="photo1" v-for = "(sk, index) in product.avatarUrl" :key="index">
											<image :src="sk.avatarUrl" mode=""></image>
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
									<view v-if="itemData.style.show.productPrice == 1&&(product.buy_auth.can_buy>0||product.buy_auth.no_price==0)" class="red">
										<text class="f22">{{$nw("¥")}}</text>
										<text class="f32">{{ product.product_price }}</text>
									</view>

									<view class="ml20 gray9 text-d-line" v-if="itemData.style.show.linePrice == 1 && product.line_price > 0"><text class="f22" >{{$nw("¥")}}</text>{{ product.line_price }}</view>

								</view>
							</view>
							<view class="price d-s-c directCommissionstyle" v-if="(itemData.style.show.directCommission == 1||itemData.show_commission)&&product.direct_commission>0" >
								<view style="margin: 0 auto;">
									<text >{{$nw("赚")}} {{$nw("¥")}}</text>
									<text class="" style="padding-left: 5rpx;">{{ product.direct_commission }}</text>
								</view>
							</view>
						</template>


					</view>
				</view>
			</template>
			<template v-else>
				<scroll-view :scroll-top="scrollTop" scroll-x="true">
					<view class="product-list" :class="['column__' + itemData.style.column]">
						<view v-for="(product, index) in itemData.data" :key="index" @click="gotoDetail(product.product_id)">
							<view class="product-item">
								<view class="product-cover"><image :src="product.image" mode="aspectFill"></image></view>
								<view class="product-info">
									<view v-if="itemData.style.show.productName == 1" class="product-title">{{ product.product_name }}</view>
									<view class="price d-s-c f12">
										<view v-if="itemData.style.show.productPrice == 1" class="orange">
											<text>{{$nw("¥")}}</text>
											<text class="">{{ product.product_price }}</text>
										</view>
										<view class="ml10 gray9 text-d-line" v-if="itemData.style.show.linePrice == 1 && product.line_price > 0">{{$nw("¥")}}{{ product.line_price }}</view>
									</view>
								</view>
								<view class="price d-s-c directCommissionstyle" v-if="(itemData.style.show.directCommission == 1||itemData.show_commission) &&product.direct_commission>0">
									<view style="margin: 0 auto;" >
										<text>{{$nw("赚")}} {{$nw("¥")}}</text>
										<text class="">{{ product.direct_commission }}</text>
									</view>
								</view>
								<view style="height: 50rpx;" v-else>

								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</template>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {
			scrollTop:0
		};
	},
	props: ['itemData'],
	created() {

	},
	methods: {
		scroll(e) {},

		/*跳转产品详情*/
		gotoDetail(e) {
			let url='/main/pages/product/detail/detail?product_type=product&product_id=' + e;
      uni.navigateTo({url})
		}
	}
};
</script>

<style>
.diy-product {
	padding:20rpx 20rpx;
	background-color: gray;
}
.diy-product .product-list.column__1 .product-item {
	margin-bottom: 20rpx;
	margin-top: 1rpx;
	width: 100%;
	background: #ffffff;
	padding-bottom: 20rpx;
}
.diy-product .product-list.column__1 .product-item-box {
		display: flex;
		justify-content: flex-start;
		align-items: stretch;
		padding-left: 20rpx;
		/* background-color: #09BB07; */
}

.diy-product .product-list .product-cover image{
	width: 100%;
	height: 100%;
}
/* 大图样式 start*/
.product-item-box1 {

	margin-left: calc((750rpx - 94vw)/2);
	margin-bottom: 10rpx;
	width: 94vw;
	border-radius: 20rpx;
	border: 1rpx solid #e1e1e1;
}
.product-item-box1 .product-cover {
	padding-left: 20rpx;
	margin-top: 5rpx;
	background-color: #FFFFFF;
	width: 95%;
	
}


.product-title1{
	margin-top: 20rpx;
	margin-left: 15rpx;
	font-size :20px;
	padding-bottom: 20rpx;

}
/* 大图商品名 */
.product-item-box6{
	padding-left: 20rpx;
	font-size :30rpx;
}


.product-item-box41{
	text-align: right;
	padding-right: 40rpx;
}
.product-item-box4{
	display: flex;
	justify-content: space-between;

}
.photo1,
.photo1 image {
	float: left;
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
}
.f44{
	text-align: right;
	/* padding-bottom: 20rpx; */
}

.user-header .photo {
	border: 4rpx solid #ffffff;
}
.product-item-box5{
	padding-left: 20rpx;
	text-align: left;
	padding-bottom: 50rpx;
}
.product-item-box7{
	float: right;

}
.user-info {
	float: right;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	padding-right: 20rpx;
	margin-bottom: 20rpx;
	/* padding-bottom: 20rpx; */

}

/* 大图样式end */
.diy-product .product-list.column__1 .product-cover {
	width: 240rpx;
	padding-top: 5rpx;
	padding-bottom: 12rpx;

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
	font-size: 32rpx;
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
	font-size: 30rpx;
}
.diy-product .product-list.column__2 .product-info {
	padding: 0 24rpx;
}
.diy-product .product-list .price {
	font-size: 34rpx;
}
.diy-product .product-list.column__2 .price {
	margin-top: 10rpx;
	font-size: 30rpx;
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
.directCommissionstyle{
	height: 50rpx;
	background-color: #E2231A;
	color: #ffffff;
}
</style>
