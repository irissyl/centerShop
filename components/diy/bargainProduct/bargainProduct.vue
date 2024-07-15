<template>
	<view class="diy-bargainProduct" :style="{ background: itemData.style.background }">
		<view class="bargainProduct-head d-b-c">
			<view class="left d-s-c">
				<view class="name">
					{{$nw("活动砍价")}}
				</view>
				<view class="datetime d-s-c ml10"><Countdown :config="countdownConfig"></Countdown></view>
			</view>
			<view class="right" @click="gotoList">
				<text>{{$nw("更多")}}</text>
				<text class="iconfont icon-jiantou"></text>
			</view>
		</view>
		<view class="bargainProduct-body">
			<view class="product-list" :class="['column__' + itemData.style.column]">
				<view class="product-item" v-for="(item, index) in itemData.data.product_list" :key="index" @click="gotoDetail(item.bargain_product_id)">
					<!-- 单列商品 -->
					<template v-if="itemData.style.column == 1">
						<view class="product-item-box">
							<!-- 商品图片 -->
							<view class="product-cover"><image :src="item.product.file_path" mode="aspectFit"></image></view>
							<view class="product-info">
								<!-- 商品名称 -->
								<view v-if="itemData.style.show.productName == 1" class="product-title">{{ item.product.product_name }}</view>
								<!-- 商品价格 -->
								<view class="d-s-c">
									<view v-if="itemData.style.show.floorPrice == 1" class="red">
										<text class="tip-text">{{$nw("砍价享")}}</text>
										<text class="ml10">{{$nw("¥")}}</text>
										<text class="f34 fb">{{ item.bargain_price }}</text>
									</view>
									<view class="ml10 gray9 text-d-line" v-if="itemData.style.show.originalPrice == '1'">
										<text>{{$nw("¥")}}</text>
										<text>{{ item.product_price }}</text>
									</view>

								</view>

								<view class="d-e-c">
									<button class="btn-red" type="default" :style="[active]">{{$nw("去砍价")}}</button>
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
						<view class="product-cover"><image :src="item.image" mode="aspectFit"></image></view>
						<view class="product-info p-0-10">
							<view v-if="itemData.style.show.productName == '1'" class="product-title">{{ item.product_name }}</view>
							<view class="price d-b-c p-20-0 f12">
								<view v-if="itemData.style.show.seckillPrice == '1'" class="orange">
									<text>{{$nw("¥")}}</text>
									<text class="">{{ item.seckillPrice }}</text>
								</view>
								<view class="ml10 gray9 text-d-line" v-if="itemData.style.show.originalPrice == '1'">
									<text>{{$nw("¥")}}{{ item.product_price }}</text>
								</view>
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
import Countdown from '@/components/countdown/countdown.vue';
export default {
	components: {
		Countdown
	},
	data() {
		return {
			/*倒计时配置*/
			countdownConfig: {
				/*开始时间*/
				startstamp: 0,
				/*结束时间*/
				endstamp: 0,
				/*标题*/
				title: this.$nw("距结束")
			}
		};
	},
	props: ['itemData'],
	created() {
		this.countdownConfig.endstamp = this.itemData.data.end_time;
		this.countdownConfig.startstamp = this.itemData.data.start_time;
	},
  computed: {
    active() {
      return Object.assign(this.setBackgroundColor(), this.setColor())
    },
  },
	methods: {
		scroll(e) {},

		/*跳转列表*/
		gotoList() {
			let url = '/plus/pages/bargain/list/list';
			this.gotoPage(url);
		},

		/*跳转详情*/
		gotoDetail(e) {
			let url = '/plus/pages/bargain/detail/detail?bargain_product_id=' + e;
			this.gotoPage(url);
		}
	}
};
</script>

<style>
.diy-bargainProduct {
	margin: 20rpx;
	border-radius: 20rpx;
	padding:0 20rpx 20rpx;
	background: #FFFFFF;
	box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
}
.bargainProduct-head {
	height: 100rpx;
}
.bargainProduct-head .name {
	font-size: 34rpx;
	font-weight: bold;
}

.bargainProduct-head .datetime > span {
	display: inline-block;
}
.bargainProduct-head .datetime .text {
	padding: 0 8rpx;
}
.bargainProduct-head .datetime .box {
	padding: 4rpx;
	background: #000000;
	color: #ffffff;
}

.diy-bargainProduct .product-list.column__1 .product-item {
	width: 100%;
	padding: 20rpx 0;
	border-top: 1px solid #EEEEEE;
	background: #ffffff;
}
.diy-bargainProduct .product-list.column__1 .product-item-box {
	display: flex;
	justify-content: flex-start;
	align-items: stretch;
}
.diy-bargainProduct .product-list image {
	width: 100%;
	height: 100%;
}
.diy-bargainProduct .product-list.column__1 .product-cover {
	width: 240rpx;
	height: 240rpx;
}

.diy-bargainProduct .product-list.column__1 .product-info {
	padding:0 20rpx;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.diy-bargainProduct .product-list.column__1 .tip-text {
	padding: 4rpx;
	border-radius: 8rpx;
	border: 1rpx solid #e2231a;
}
.diy-bargainProduct .product-list .product-title {
	margin-top: 10rpx;
	height: 80rpx;
	line-height: 40rpx;
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	font-size: 30rpx;
}
.diy-bargainProduct .product-list.column__2,
.diy-bargainProduct .product-list.column__3 {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
}
.diy-bargainProduct .column__2 .product-item {
	width: 350rpx;
	margin-right: 10rpx;
	margin-bottom: 20rpx;
	background: #ffffff;
}
.diy-bargainProduct .display__list .column__2 .product-item:nth-child(2n + 0) {
	margin-right: 0;
}
.diy-bargainProduct .column__2 .product-cover {
	width: 345rpx;
	height: 345rpx;
}
.diy-bargainProduct .column__3 .product-item {
	width: 230rpx;
	margin-bottom: 10rpx;
	margin-right: 10rpx;
	background: #ffffff;
}
.diy-bargainProduct .display__list .column__3 .product-item:nth-child(3n + 0) {
	margin-right: 0;
}
.diy-bargainProduct .column__3 .product-cover {
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
