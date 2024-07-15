<template>
	<view class="diy-seckillProduct" :style="{ background: itemData.style.background }">
		<view class="sharpproduct-head d-b-c" :style="{ color: itemData.style.color }">
			<view class="left d-s-c">
				<view class="name">
					{{$nw("限时秒杀")}}
				</view>
				<view class="datetime d-s-c ml10"><Countdown :config="countdownConfig"></Countdown></view>
			</view>
			<view class="right d-e-c" @click="gotoList">
				<text class="gray3">{{$nw("更多")}}</text>
				<text class="iconfont icon-jiantou"></text>
			</view>
		</view>
		<view class="sharpproduct-body" :class="['column__' + itemData.style.column]">
			<view class="product-list">
				<view class="product-item" v-for="(item, index) in itemData.data.product_list" :key="index" @click="gotoDetail(item.seckill_product_id)">
					<!-- 单列商品 -->
					<template v-if="itemData.style.column == 1">
						<view class="product-item-box">
							<!-- 商品图片 -->
							<view class="product-cover"><image :src="item.product.file_path" mode="aspectFit"></image></view>
							<view class="product-info">
								<!-- 商品名称 -->
								<view v-if="itemData.style.show.productName == 'true'" class="product-title">
									<text>{{ item.product.product_name }}</text>
								</view>
								<!-- 商品价格 -->
								<view class="price d-b-c" style="border: 1rpx solid red;">
									<view v-if="itemData.style.show.seckillPrice == 'true'" class="red">
										<text>{{$nw("¥")}}</text>
										<text class="f34 fb">{{ item.seckill_price }}</text>
										<text class="ml10 gray9 text-d-line" v-if="itemData.style.show.linePrice == 'true'">{{$nw("¥")}}{{ item.product_price }}</text>
									</view>
									<view v-if="itemData.style.show.seckillPrice == 'true'" class="red">
										<text>{{$nw("¥")}}</text>
										<text class="f34 fb">{{ item.seckill_price }}</text>
										<text class="ml10 gray9 text-d-line" v-if="itemData.style.show.linePrice == 'true'">{{$nw("¥")}}{{ item.product_price }}</text>
									</view>
								</view>

								<view class="d-e-c"><button class="btn-red" type="default" :style="[active]">{{$nw("立即抢购")}}</button></view>
								<view class="price d-s-c directCommissionstyle" v-if="item.direct_commission>0">
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
							<view v-if="itemData.style.show.productName == 'true'" class="product-title">{{ item.product.product_name }}</view>
							<view class="price p-20-0">
								<view v-if="itemData.style.show.seckillPrice == 'true'" class="red">
									<text class="f22">{{$nw("¥")}}</text>
									<text class="f30 fb" :class="{ f34: itemData.style.column == 2 }">{{ item.seckill_price }}</text>
								</view>
								<view class="">
									<text class="gray9 text-d-line" v-if="itemData.style.show.linePrice == 'true'">{{$nw("¥")}}{{ item.product_price }}</text>
									
								</view>
							</view>

						</view>
						<view class="price d-s-c directCommissionstyle" v-if="item.direct_commission>0">
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
			let url = '/plus/pages/seckill/list/list';
			this.gotoPage(url);
		},

		/*跳转产品详情*/
		gotoDetail(e) {
			let url = '/plus/pages/seckill/detail/detail?seckill_product_id=' + e;
			this.gotoPage(url);
		}
	}
};
</script>

<style>
.diy-seckillProduct {
	margin: 20rpx;
	border-radius: 20rpx;
	padding:0 20rpx 20rpx;
	background: #ffffff;
	box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
}
.sharpproduct-head {
	height: 100rpx;
}
.sharpproduct-head .name {
	font-size: 34rpx;
	font-weight: bold;
}
.sharpproduct-head .datetime .text {
	padding: 0 8rpx;
}
.sharpproduct-head .datetime .box {
	display: block;
	width: 30rpx;
	height: 30rpx;
	padding: 4rpx;
	text-align: center;
	line-height: 30rpx;
	border-radius: 8rpx;
	background: #000000;
	color: #ffffff;
}

.sharpproduct-head .icon-jiantou {
	margin-left: 10rpx;
	padding: 4rpx;
	border-radius: 50%;
	color: #ffffff;
	font-size: 20rpx;
	background: #000000;
}
.diy-seckillProduct .product-list .product-item {
	overflow: hidden;
}
.diy-seckillProduct .product-list .product-cover image {
	width: 100%;
	height: 100%;
}
.diy-seckillProduct .column__1 .product-list {
	flex-direction: column;
}
.diy-seckillProduct .column__1 .product-list .product-item {
	padding: 20rpx 0;
	margin-bottom: 20rpx;
	border-top: 1px solid #eeeeee;
	background: #ffffff;
}
.diy-seckillProduct .column__1 .product-list .product-item:last-child {
	margin-bottom: 0;
}
.diy-seckillProduct .column__1 .product-list .product-item-box {
	display: flex;
	justify-content: flex-start;
	align-items: stretch;
}

.diy-seckillProduct .column__1 .product-list .product-cover {
	width: 240rpx;
	height: 240rpx;
}

.diy-seckillProduct .column__1 .product-list .product-info {
	margin-left: 20rpx;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
}
.diy-seckillProduct .product-list .product-title {
	margin-top: 10rpx;
	height: 80rpx;
	line-height: 40rpx;
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	font-size: 30rpx;
}
.diy-seckillProduct .column__3 .product-list .product-title{
	font-size: 28rpx;
}
.diy-seckillProduct .column__2 .product-list,
.diy-seckillProduct .column__3 .product-list {
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
}
.diy-seckillProduct .column__2 .product-item {
	width: 350rpx;
	margin-right: 10rpx;
	margin-bottom: 10rpx;
	border-radius: 16rpx;
	background: #ffffff;
}
.diy-seckillProduct .column__2 .product-item:nth-child(2n + 0) {
	margin-right: 0;
}
.diy-seckillProduct .column__2 .product-cover {
	width: 345rpx;
	height: 345rpx;
}
.diy-seckillProduct .column__3 .product-item {
	width: 216rpx;
	margin-bottom: 10rpx;
	margin-right: 10rpx;
	border-radius: 12rpx;
	overflow: hidden;
	background: #ffffff;
}
.diy-seckillProduct .column__3 .product-item:nth-child(3n + 0) {
	margin-right: 0;
}
.diy-seckillProduct .column__3 .product-cover {
	width: 216rpx;
	height: 216rpx;
}
.directCommissionstyle{
	height: 50rpx;
	margin-top: 8rpx;
	background-color: #ff0000;
	color: #ffffff;
}
</style>
