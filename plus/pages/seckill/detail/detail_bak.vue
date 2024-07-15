<template>
	<view class="product-detail">
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" v-if="!loadding">
			<!--图片-->
			<view class="product-pic">
				<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
					<swiper-item v-for="(item, index) in detail.product.image" :key="index"><image :src="item.file_path" mode="aspectFit"></image></swiper-item>
				</swiper>
			</view>

			<!--限时秒杀-->
			<view class="limited-spike d-b-c">
				<text class="left-name">{{$nw("限时秒杀")}}</text>
				<view class="right d-s-c"><Countdown :config="countdownConfig" @returnVal="returnValFunc"></Countdown></view>
			</view>

			<!--基本信息-->
			<view class="bg-white">
				<view class="price-wrap">
					<view class="left">
						<template>
							<view class="new-price">
								<text class="num">{{ detail.seckill_price }}</text>
							</view>
							<text class="old-price" v-if="detail.line_price && detail.line_price> 0">{{ detail.line_price }}</text>
						</template>
					</view>
					<template>
						<text class="already-sale">{{$nw("还剩余")}}{{ detail.stock }}{{$nw("件")}}</text>
					</template>
					<template>
						<text class="already-sale">{{$nw("已出售")}}{{ detail.product_sales }}{{$nw("件")}}</text>
					</template>
				</view>
				<view class="product-name">{{ detail.product.product_name }}</view>
				<view class="product-describe">{{ detail.product.selling_point }}</view>
			</view>

			<!--详情内容-->
			<view class="product-content">
				<view class="group-hd border-b-e">
					<view class="left"><text class="min-name">{{$nw("商品介绍")}}</text></view>
				</view>
				<view class="content-box" v-html="detail.product.content"></view>
			</view>
		</scroll-view>

		<!--底部按钮-->
		<view class="btns-wrap">
			<view class="customer-service d-c-c">
				<!-- #ifdef MP-WEIXIN -->
				<view class="icon-box"><button class="icon iconfont icon-kefu2" open-type="contact" session-from="wxapp"></button></view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="icon-box" @click="openMaservice"><button class="icon iconfont icon-kefu2"></button></view>
				<!-- #endif -->
			</view>
			<button type="primary" class="buy" @click="openPopup('order')">{{$nw("立即抢购")}}</button>
		</view>

		<!--购物确定-->
		<!-- <spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec> -->
		<QuickOrder :isPopup_q="isPopup" :productModel_q="productModel" @close="closePopup" type="seckill" ></QuickOrder>
		<!--客服-->
		<Mpservice v-if="isMpservice" :isMpservice="isMpservice" @close="closeMpservice"></Mpservice>
	</view>
</template>

<script>
// import Spec from './popup/Spec.vue';
import Countdown from '@/components/countdown/countdown.vue';
import Mpservice from '@/components/mpservice/Mpservice.vue';
import utils from '@/common/utils.js';
import QuickOrder from '@/components/quickOrder/quickOrder.vue';
export default {
	components: {
		/*选择规格*/
		// Spec,
		/*倒计时组件*/
		Countdown,
		/*客服*/
		Mpservice,
		QuickOrder
	},
	data() {
		return {
			/*手机高度*/
			phoneHeight: 0,
			/*可滚动视图区域高度*/
			scrollviewHigh: 0,
			/*是否加载完成*/
			loadding: true,
			/*是否显示面板指示点*/
			indicatorDots: true,
			/*是否自动切换*/
			autoplay: true,
			/*自动切换时间间隔*/
			interval: 2000,
			/*滑动动画时长*/
			duration: 500,
			/*秒杀商品id*/
			seckill_product_id: null,
			/*详情*/
			detail: {
				/*商品规格*/
				product_sku: {},
				/*当前规格对象*/
				show_sku: {
					/*秒杀价格*/
					seckill_price: '',
					/*商品规格ID*/
					product_sku_id: 0,
					/*划线价格*/
					line_price: '',
					/*库存数量*/
					stock_num: 0,
					/*商品规格图片*/
					sku_image: '',
					/*秒杀商品规格ID*/
					seckill_product_sku_id: 0
				},
				/*暂不知晓*/
				show_point_sku: {}
			},
			/*是否确定购买弹窗*/
			isPopup: false,
			/*倒计时配置*/
			countdownConfig: {
				/*开始时间*/
				startstamp: 0,
				/*结束时间*/
				endstamp: 0
			},
			/*商品属性*/
			specData: null,
			/*子级页面传参*/
			productModel: {},
			/*商品规格*/
			productSku: [],
			/*是否打开客服*/
			isMpservice: false
		};
	},
	onLoad(e) {
		/*分类id*/
		this.seckill_product_id = e.seckill_product_id;
	},
	mounted() {
    this.setGlobalColor()
		this.init();
		
		/*获取产品详情*/
		this.getData();
	},
	methods: {
		
		/*初始化*/
		init() {
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					_this.phoneHeight = res.windowHeight;
					// 计算组件的高度
					let view = uni.createSelectorQuery().select('.btns-wrap');
					view.boundingClientRect(data => {
						let h = _this.phoneHeight - data.height;
						_this.scrollviewHigh = h;
					}).exec();
				}
			});
		},
		
		/*获取数据*/
		getData() {
			let self = this;
			uni.showLoading({
				title: self.$nw("加载中")
			});
			self._get(
				'plus.seckill.product/detail',
				{
					seckill_product_id: self.seckill_product_id
				},
				function(res) {
					/*倒计时*/
					self.countdownConfig.endstamp = res.data.active.end_time;
					self.countdownConfig.startstamp = res.data.active.start_time;

					/*详情内容格式化*/
					res.data.detail.product.content = utils.format_content(res.data.detail.product.content);

					/*初始化商品多规格*/
					if (res.data.detail.product.spec_type == 20) {
						self.initSpecData(res.data.detail.seckillSku, res.data.specData);
					}
					self.detail = res.data.detail;
					self.loadding = false;
					uni.hideLoading();
				}
			);
		},

		/*多规格商品*/
		initSpecData(list, data) {
			for (let i = 0; i < list.length; i++) {
				let item = list[i];
				if (item.productSku) {
					let arr = item.productSku.spec_sku_id.split('_').map(Number);
					this.productSku.push(arr);
				}
			}
			for (let i in data.spec_attr) {
				for (let j = 0; j < data.spec_attr[i].spec_items.length; j++) {
					let item = data.spec_attr[i].spec_items[j];
					if (this.hasSpec(item.item_id, i)) {
						item.checked = false;
						item.disabled = false;
					} else {
						data.spec_attr[i].spec_items.splice(j, 1);
						j--;
					}
				}
			}
			this.specData = data;
		},

		/*判断有没有规格*/
		hasSpec(id, _index) {
			let flag = false;
			for (let i = 0; i < this.productSku.length; i++) {
				let arr = this.productSku[i];
				if (arr[_index] == id) {
					flag = true;
					break;
				}
			}
			return flag;
		},

		/*打开窗口*/
		openPopup(e) {
			let obj = {
				specData: this.specData,
				detail: this.detail,
				productSpecArr: this.specData != null ? new Array(this.specData.spec_attr.length) : [],
				show_sku: {
					sku_image: '',
					seckill_price: 0,
					product_sku_id: 0,
					line_price: 0,
					seckill_stock: 0,
					seckill_product_sku_id: 0,
					sum: 1
				},
				productSku: this.productSku,
				type: e
			};
			this.productModel = obj;
			this.isPopup = true;
		},

		/*关闭弹窗*/
		closePopup() {
			this.isPopup = false;
		},

		/*打开客服*/
		openMaservice() {
			this.isMpservice = true;
		},

		/*关闭客服*/
		closeMpservice() {
			this.isMpservice = false;
		},

		/*倒计时返回状态*/
		returnValFunc(e) {},

    /*分享当前页面*/
    onShareAppMessage() {
      return {}
    },

	}
};
</script>

<style lang="scss" scoped>
.product-detail {
	padding-bottom: 90rpx;
}

.product-detail .product-pic,
.product-detail .product-pic .swiper,
.product-detail .product-pic image {
	width: 750rpx;
	height: 750rpx;
}

.product-detail .price-wrap {
	padding: 20rpx 20rpx 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.product-detail .price-wrap .left {
	display: flex;
	justify-content: flex-start;
	align-items: flex-end;
}

.product-detail .price-wrap .new-price {
	color: $dominant-color;
	font-size: 40rpx;
	font-weight: bold;
}

.product-detail .price-wrap .new-price .num {
	padding: 0 4rpx;
	font-size: 50rpx;
}

.product-detail .price-wrap .old-price {
	margin-left: 10rpx;
	font-size: 30rpx;
	color: #999999;
	text-decoration: line-through;
}

.product-detail .already-sale {
	font-size: 24rpx;
	color: #999999;
}

.product-detail .product-name {
	padding: 20rpx 20rpx 0;
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.product-detail .product-describe {
	padding: 20rpx;
	font-size: 24rpx;
	color: #999999;
}

.product-comment,
.product-content {
	margin-top: 20rpx;
	background: #ffffff;
}

.product-content .content-box p image {
	width: 100%;
}

.product-content .content-box {
	font-size: 36rpx;
}

.btns-wrap {
	position: fixed;
	height: 90rpx;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	background: #ffffff;
}

.btns-wrap .icon-box {
	width: 90rpx;
	height: 90rpx;
	border-right: 1px solid #dddddd;
}

.btns-wrap .icon-box .iconfont {
	font-size: 40rpx;
	color: #888888;
}

.btns-wrap .icon-box .iconfont .num {
	position: absolute;
	padding: 0 5rpx;
	top: 10rpx;
	left: 50%;
	height: 30rpx;
	line-height: 30rpx;
	border-radius: 15rpx;
	font-size: 20rpx;
	color: #ffffff;
	background: red;
}

.btns-wrap button,
.btns-wrap button:after {
	height: 91rpx;
	line-height: 90rpx;
	margin: 0;
	padding: 0;
	flex: 1;
	border-radius: 0;
	border: 0;
}

.btns-wrap button.add-cart {
	background: $orange-color;
}

.btns-wrap button.buy {
	background: $dominant-color;
}

.share-box {
	position: fixed;
	padding-right: 10rpx;
	width: 80rpx;
	height: 80rpx;
	right: 0;
	bottom: 180rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 16rpx 0 0 16rpx;
	background: rgba(0, 0, 0, 0.8);
}

.share-box button {
	padding: 0;
	background: 0;
	line-height: 60rpx;
}

.share-box .iconfont {
	margin-bottom: 10rpx;
	font-size: 50rpx;
	color: #ffffff;
}

.create-img {
	width: 100%;
	padding: 20rpx;
	box-sizing: border-box;
}

.create-img image {
	width: 100%;
}

.create-img button {
	width: 100%;
}

.product-detail .limited-spike {
	padding: 0 20rpx;
	height: 120rpx;
	color: #ffffff;
	border-radius: 30rpx 30rpx 0 0;
	background: #e2231a;
	// background: linear-gradient(to bottom, #ff6c65, #e2231a);
}

.product-detail .limited-spike .left-name {
	font-size: 36rpx;
	font-weight: bold;
	color: #ffffff;
}

.product-detail .limited-spike .right .box {
	display: block;
	width: 40rpx;
	height: 40rpx;
	padding: 4rpx;
	border-radius: 8rpx;
	line-height: 40rpx;
	text-align: center;
	background: #000000;
	color: #ffffff;
}

.product-detail .limited-spike .right > text {
	margin-left: 10rpx;
}
</style>
