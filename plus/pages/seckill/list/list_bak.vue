<template>
	<view class="seckill-product-wrap">
		<view class="top-box">
			<!-- 搜索框 -->
			<!-- <view class="index-search-box">
				<view class="index-search d-s-c">
					<span class="icon iconfont icon-sousuo" @click="gotoSearch"></span>
					<input class="uni-input flex-1 ml10" v-model="search" 
					:placeholder="$nw('输入关键字')" />
				</view>
			</view> -->
			<!--活动类别-->
			<view class="top-tabbar"  v-if="activeList&&activeList.length>0">
				<!-- <scroll-view scroll-X="true" show-scrollbar="false" class="scroll-X">
					<view class="tab-list d-s-c">
						<view
							class="tab-item"
							:class="{ active: type_active == index }"
							v-for="(item, index) in activeList"
							:key="index"
							@click="tabTypeFunc(index)"
						>
							{{ item.title }}
						</view>
					</view>
				</scroll-view> -->
				<scroll-view class="scroll-box" scroll-x show-scrollbar>
					<view class="scroll_item" :class="type_active==index?'active':''" v-for="(item,index) in activeList" :key="index" @click="tabTypeFunc(index)">
						{{item.title}}
					</view>
				</scroll-view>
			</view>
		</view>
		<view class="seckill-list-wrap" v-if="listData.list && listData.list.length > 0">
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50">
				<!--活动广告-->
				<view class="ad-activity"><image :src="listData.detail.file_path" mode="aspectFill"></image></view>
				<!--活动时间-->
				<view class="ad-datetime ww100 p-30-0 d-c-c">
					<Countdown :config="countdownConfig" @returnVal="returnValFunc"></Countdown>
				</view>
				<view class="every-day-time d-c-c">
					<text>{{$nw("每日活动时间")}}：{{currActive.day_start_time}}{{$nw("至")}}{{currActive.day_end_time}}</text>
				</view>
				<!--列表-->
				<view class="list p-0-30 mt30">
					<view class="item d-stretch" v-for="(item, index) in listData.list" :key="index">
						<view class="product-cover"><image :src="item.product.file_path" mode="aspectFit"></image></view>
						<view class="d-b-c d-c flex-1 ml20">
							<view class="product-title ww100">{{ item.product.product_name }}</view>
							<view class="price ww100 red">
								<text class="f24">{{$nw("¥")}}</text>
								<text class="num f40 fb">{{ item.seckill_price }}</text>
								<text class="ml20 text-d-line gray9 f28">{{$nw("¥")}}{{ item.product_price }}</text>
							</view>
							<view class="slider-box ww100 d-b-c">
								<view class="left flex-1">
									<text class="already-sale">{{$nw("已售")}}{{ item.product_sales }}{{$nw("件")}}</text>
									<view class="slider">
										<view class="slider-inner" :style="'width:' + (item.product_sales / (item.product_sales + item.stock)) * 100 + '%;'"></view>
									</view>
								</view>
								<view class="right-btn ml30"><button type="primary" @click="gotoDetail(item.seckill_product_id)">{{$nw("马上抢")}}</button></view>
							</view>
						</view>
					</view>
				</view>
				<!-- 没有记录 -->
				<view class="d-c-c p30" v-if="listData.length == 0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
				</view>
			</scroll-view>
		</view>
		<!-- 没有记录 -->
		<view class="d-c-c p30" v-if="listData.list&&listData.list.length == 0 && !loading">
			<text class="iconfont icon-wushuju"></text>
			<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
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
			/*手机高度*/
			phoneHeight: 0,
			/*可滚动视图区域高度*/
			scrollviewHigh: 0,
			/*活动列表*/
			activeList: [],
			/*当前活动角标*/
			type_active:0,
			/*类别选中*/
			currActive: {},
			/*产品列表*/
			listData: {
				detail:{},
				list:[]
			},
			/*活动详情*/
			detailData: {},
			/*是否正在加载*/
			loading: true,
			/*倒计时配置*/
			countdownConfig: {
				/*开始时间*/
				startstamp: 0,
				/*结束时间*/
				endstamp: 0
			}
		};
	},
	computed: {},
	mounted() {
		this.setGlobalColor()
		this.getActive();
		this.init();
	},
	onPullDownRefresh() {},
	methods: {
		/*初始化*/
		init() {
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					_this.phoneHeight = res.windowHeight;
					// 计算组件的高度
					let view = uni.createSelectorQuery().select('.top-box');
					view.boundingClientRect(data => {
						if(data && data.height) {
							let h = _this.phoneHeight - data.height;
							_this.scrollviewHigh = h;
						}else {
							_this.scrollviewHigh = _this.phoneHeight;
						}
					}).exec();
				}
			});
		},

		/*类别切换*/
		tabTypeFunc(e) {
			this.type_active = e;
			this.currActive=this.activeList[e];
			this.getData();
		},

		/*获取活动类别*/
		getActive() {
			let self = this;
			let param = {};
			self.loading = true;
			self._get(
				'plus.seckill.product/active',
				{
					param
				},
				function(res) {
					self.activeList = res.data.list;
					self.loading =false;
					if (self.activeList && self.activeList.length > 0) {
						self.currActive = self.activeList[0];
						self.getData();
					}
				}
			);
		},

		/*获取数据*/
		getData() {
			let self = this;
			self.loading = true;
			self._get(
				'plus.seckill.product/product',
				{
					seckill_activity_id: self.currActive.seckill_activity_id
				},
				function(res) {
					self.listData = res.data;
					self.countdownConfig.endstamp = res.data.detail.end_time;
					self.countdownConfig.startstamp = res.data.detail.start_time;
					uni.hideLoading();
					self.loading = false;
				}
			);
		},

		/*跳转产品详情*/
		gotoDetail(e) {
			uni.navigateTo({
				url: '/plus/pages/seckill/detail/detail?seckill_product_id=' + e
			});
		},

		/*跳转搜索页面*/
		gotoSearch() {
			this.getData();
		},

		/*倒计时返回值*/
		returnValFunc(e) {

		},

    /*分享当前页面*/
    onShareAppMessage() {
      return {}
    },

	}
};
</script>

<style lang="scss">
	.scroll-box{
		width: 100%;
		display: flex;
		flex-direction: row;
		white-space: nowrap; /*横向滚动必须添加css 1.规定段落中得文本不进行换行*/
		.scroll_item{
			padding: 0 30rpx;
			font-size: 30rpx;
			height: 86rpx;
			line-height: 86rpx;
			color: #ffffff;
			border-bottom: 4rpx solid $dominant-color;
			display: inline-block; /*横向滚动 2.滚动区域内的每一个元素设置为行内块模块*/
		}
	}
	.scroll_item.active {
		border-bottom: 4rpx solid #ffffff;
		font-weight: 700;
		margin-bottom: 0;
		color: #ffffff;
		font-size: 34rpx;
	}
.seckill-product-wrap .index-search-box {
	border-bottom: none;
	background: $dominant-color;
}
.seckill-product-wrap .index-search {
	border: 1px solid #ffffff;
}
.seckill-product-wrap .top-tabbar {
	border-bottom-color: $dominant-color;
	background: $dominant-color;
}
.seckill-product-wrap .tab-item {
	flex: 0;
	padding: 0 30rpx;
	font-size: 30rpx;
	height: 86rpx;
	line-height: 86rpx;
	white-space: nowrap;
	color: #ffffff;
	border-bottom: 4rpx solid $dominant-color;
}
.seckill-product-wrap .tab-item.active {
	border-bottom: 4rpx solid #ffffff;
	font-weight: 700;
	margin-bottom: 0;
	color: #ffffff;
	font-size: 34rpx;
}

.seckill-product-wrap .every-day-time text{
	padding: 8rpx 16rpx;
	background: #FFFFFF;
	font-size: 30rpx;
	border-radius: 8rpx;
	border: 1rpx solid #E3E3E3;
	color: #888888;
}

.seckill-product-wrap .ad-activity {
	position: relative;
	overflow: hidden;
	height: 300rpx;
	padding: 20rpx;
}
.seckill-product-wrap .ad-activity::before,
.seckill-product-wrap .ad-activity::after {
	display: block;
	content: '';
	position: absolute;
	height: 600rpx;
	width: 1200rpx;
	top: -400rpx;
	left: 50%;
	margin-left: -600rpx;
	border-radius: 0 0 600rpx 600rpx;
	background: $dominant-color;
	z-index: 1;
}
.seckill-product-wrap .ad-activity::after {
	width: 1400rpx;
	margin-left: -700rpx;
	z-index: 0;
	background: rgba(266, 35, 26, 0.2);
}

.seckill-product-wrap .ad-activity image {
	position: absolute;
	top: 20rpx;
	left: 20rpx;
	width: 710rpx;
	height: 300rpx;
	border-radius: 16rpx;
	z-index: 10;
}

.seckill-list-wrap .list .item {
	padding: 20rpx;
	display: flex;
	border-radius: 16rpx;
	margin-bottom: 20rpx;
	background: #ffffff;
	box-shadow: 0 4rpx 12rpx 0 rgba(0, 0, 0, 0.1);
}

.seckill-list-wrap .product-cover,
.seckill-list-wrap .product-cover image {
	width: 220rpx;
	height: 220rpx;
}

.seckill-list-wrap .ad-datetime .box {
	width: 40rpx;
	height: 40rpx;
	padding: 4rpx;
	line-height: 40rpx;
	text-align: center;
	border-radius: 8rpx;
	background: #000000;
	color: #ffffff;
}

.seckill-list-wrap .product-title {
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	font-size: 28rpx;
}

.seckill-list-wrap .already-sale {
	padding: 4rpx 0;
	color: #999;
	font-size: 24rpx;
}

.seckill-list-wrap .slider-box .slider {
	margin-top: 10rpx;
	height: 10rpx;
	background: #eeeeee;
	border-radius: 5rpx;
}

.seckill-list-wrap .slider-box .slider-inner {
	height: 10rpx;
	background: #e2231a;
	border-radius: 5rpx;
}

.seckill-list-wrap .right-btn button {
	background: #e2231a;
	color: #ffffff;
}
</style>
