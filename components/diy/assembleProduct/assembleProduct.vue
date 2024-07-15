<template>
	<view class="diy-assembleproduct" :style="{ background: itemData.style.background }">
		<view class="diy-head d-b-c">
			<view class="left d-s-c">
				<view class="name">
					{{$nw("每日必拼")}}
				</view>
			</view>
			<view class="right" @click="gotoList">
				<text>{{$nw("好友都在拼")}}</text>
				<text class="iconfont icon-jiantou white"></text>
			</view>
		</view>
		<view class="diy-body">
			<view class="product-list" :class="['column__' + itemData.style.column]">
				<view class="product-item" v-for="(item, index) in itemData.data.product_list" :key="index" @click="gotoDetail(item)">
					<!-- 单列商品 -->
					<template v-if="itemData.style.column == 1">
						<view class="product-item-box">
							<!-- 商品图片 -->
							<view class="product-cover"><image :src="item.product.file_path" mode="aspectFit"></image></view>
							<view class="product-info">
								<!-- 商品名称 -->
								<view v-if="itemData.style.show.productName === 'true'" class="product-title">{{ item.product.product_name }}</view>
								<view class="f28">
									<text class="gray6">{{ item.assemble_num }}{{$nw("人团")}}</text>
									<text class="red p20">{{$nw("已拼")}}{{ item.product_sales }}{{$nw("件")}}</text>
								</view>
								<!-- 商品价格 -->
								<view class="price d-b-c" v-if="item.buy_auth.can_buy>0||item.buy_auth.no_price==0">
									<view v-if="itemData.style.show.assemblePrice == 'true'" class="red">
										<text class="f22">{{$nw("¥")}}</text>
										<text class="f34 fb">{{ item.assemble_price }}</text>
										<text class="ml10 gray9 text-d-line" v-if="itemData.style.show.linePrice == 'true'">{{$nw("¥")}}{{ item.product_price }}</text>
									</view>
									<view><button class="btn-red" type="default" :style="[active]">{{$nw("去拼团")}}</button></view>
								</view>
								<view class="price d-s-c mt10 directCommissionstyle" v-if="item.direct_commission>0">
									<view  style="margin: 0 auto;">
										<text>{{$nw("赚")}}&nbsp;{{$nw("¥")}}&nbsp;</text>&nbsp;
										<text class="" style="padding-left: 5rpx;">{{ item.direct_commission }}</text>
									</view>
								</view>
							</view>
						</view>
					</template>

					<!-- 两列三列 -->
					<template v-else>
						<view class="product-cover"><image :src="item.product.file_path" mode="aspectFit"></image></view>
						<view class="product-info p-0-10">
							<view class="product-title" v-if="itemData.style.show.productName === 'true'">{{ item.product.product_name }}</view>
							<view class="pt20 gray9 f24">
								<text class="assemble-num">{{ item.assemble_num }}{{$nw("人团")}}</text>
								<text class="ml10">{{$nw("已拼")}}{{ item.product_sales }}{{$nw("件")}}</text>
							</view>
							<view class="pt10 pb20" v-if="itemData.style.show.assemblePrice == 'true'&&(item.buy_auth.can_buy>0||item.buy_auth.no_price==0)">
								<text class="red">{{$nw("¥")}}</text>
								<text class="red f28 fb" :class="{ f34: itemData.style.column == 2 }">{{ item.assemble_price }}</text>
								<text class="ml10 gray9 text-d-line" v-if="itemData.style.show.linePrice == 'true'">{{$nw("¥")}}{{ item.product_price }}</text>
							</view>
						</view>
						<view class="price d-s-c mt10 directCommissionstyle" v-if="item.direct_commission>0">
							<view  style="margin: 0 auto;">
								<text>{{$nw("赚")}}&nbsp;{{$nw("¥")}}&nbsp;</text>&nbsp;
								<text class="" style="padding-left: 5rpx;">{{ item.direct_commission }}</text>
							</view>
						</view>
					</template>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	components: {},
	data() {
		return {};
	},
	props: ['itemData'],
	created() {},
  computed: {
    active() {
      return Object.assign(this.setBackgroundColor(), this.setColor())
    },
  },
	methods: {
		scroll(e) {},

		/*跳转列表*/
		gotoList() {
			let url='/plus/pages/assemble/list/list';
			this.gotoPage(url);
		},

		/*跳转产品详情*/
		gotoDetail(e) {
			let url= '/plus/pages/assemble/detail/detail?assemble_product_id=' + e.assemble_product_id;
			this.gotoPage(url);
		}
	}
};
</script>

<style lang="scss">
.diy-assembleproduct {
	margin: 20rpx;
	border-radius: 20rpx;
	padding:0 20rpx 20rpx;
	background: #FFFFFF;
	box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
}
.diy-assembleproduct .diy-head {
	height: 100rpx;
}
.diy-assembleproduct .diy-head .name {
	font-size: 34rpx;
	font-weight: bold;
}
.diy-assembleproduct .diy-head .datetime {
	margin-left: 40rpx;
}
.diy-assembleproduct .diy-head .datetime > span {
	display: inline-block;
}
.diy-assembleproduct .diy-head .datetime .text {
	padding: 0 8rpx;
}
.diy-assembleproduct .diy-head .datetime .box {
	padding: 4rpx;
	background: #000000;
	color: #ffffff;
}
.diy-assembleproduct .diy-head .icon-jiantou {
	margin-left: 10rpx;
	padding: 4rpx;
	border-radius: 50%;
	background: #000000;
	color: #ffffff;
	font-size: 20rpx;
}
.diy-assembleproduct .product-list .product-item {
	border-radius: 16rpx;
	overflow: hidden;
}
.diy-assembleproduct .product-list.column__1 .product-item {
	width: 100%;
	padding: 20rpx 0;
	border-top: 1px solid #EEEEEE;
	background: #ffffff;
}
.diy-assembleproduct .product-list.column__1 .product-item-box {
	display: flex;
	justify-content: flex-start;
	align-items: stretch;
}
.diy-assembleproduct .product-list image {
	width: 100%;
	height: 100%;
}
.diy-assembleproduct .product-list.column__1 .product-cover {
	width: 240rpx;
	height: 240rpx;
}

.diy-assembleproduct .product-list.column__1 .product-info {
	padding:0 20rpx;
	flex: 1;
	display: flex;
	overflow: hidden;
	flex-direction: column;
	justify-content: space-between;
	box-sizing: border-box;
}
.diy-assembleproduct .product-list .product-title {
	margin-top: 10rpx;
	width: 100%;
	height: 100rpx;
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	font-size: 30rpx;
}
.diy-assembleproduct .product-list.column__3 .product-title {
	height: 70rpx;
	line-height: 35rpx;
	font-size: 26rpx;
}
.diy-assembleproduct .product-list.column__2,
.diy-assembleproduct .product-list.column__3 {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
}
.diy-assembleproduct .product-list .assemble-num {
	padding: 0 4rpx;
	border-radius: 4rpx;
	color: $dominant-color;
	border: 1rpx solid $dominant-color;
}
.diy-assembleproduct .column__2 .product-item {
	width: 350rpx;
	margin-right: 10rpx;
	margin-bottom: 10rpx;
	background: #ffffff;
}
.diy-assembleproduct .column__2 .product-item:nth-child(2n + 0) {
	margin-right: 0;
}
.diy-assembleproduct .column__2 .product-cover {
	width: 345rpx;
	height: 345rpx;
}
.diy-assembleproduct .column__3 .product-item {
	width: 230rpx;
	margin-bottom: 10rpx;
	margin-right: 10rpx;
	background: #ffffff;
}
.diy-assembleproduct .column__3 .product-item:nth-child(3n + 0) {
	margin-right: 0;
}
.diy-assembleproduct .column__3 .product-cover {
	width: 230rpx;
	height: 230rpx;
}
.directCommissionstyle{
	height: 50rpx;
	margin-top: 8rpx;
	background-color: #E2231A;
	color: #ffffff;
}
</style>
