<template>
	<view class="bargain-detail">
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" v-if="!loadding">
			<!--图片-->
			<view class="product-pic">
				<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
					:duration="duration">
					<swiper-item v-for="(item, index) in detail.product.image" :key="index">
						<image :src="item.file_path" mode="aspectFit"></image>
					</swiper-item>
				</swiper>
			</view>

			<!--砍价进行中-->
			<view class="limited-spike d-b-c">
				<text class="left-name">{{$nw("砍价时间")}}</text>
				<view class="right">
					<countdown :config="countdownConfig" @returnVal="returnValFunc"></countdown>
				</view>
			</view>

			<!--基本信息-->
			<view class="bg-white">
				<view class="price-wrap">
					<view class="left">
						<template>
							<view class="new-price">
								{{$nw("¥")}}
								<text class="num">{{ detail.bargain_price }}</text>
							</view>
							<text class="old-price" v-if="detail.line_price && detail.line_price > 0">{{$nw("¥")}}{{ detail.line_price }}</text>
						</template>
					</view>

					<template>
						<text
							class="already-sale">{{$nw("已出售")}}{{ detail.product_sales }}{{$nw("件")}}</text>
					</template>
				</view>
				<view class="product-name">{{ detail.product.product_name }}</view>
			</view>

			<!--邀请好友-->
			<view class="d-b-c p30 bg-white mt20" @click="openRule">
				<text class="f28 gray3">{{$nw("邀请朋友帮忙砍价，超低价购买心仪之物")}}</text>
				<text>{{$nw("玩法详情")}}</text>
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
		<view class="btns-wrap d-s-c d-stretch">
			<template v-if="!loadding">
				<view class="customer-service d-c-c">
					<!-- #ifdef MP-WEIXIN -->
					<view class="icon-box"><button class="icon iconfont icon-kefu2" open-type="contact"
							session-from="wxapp"></button></view>
					<!-- #endif -->
					<!-- #ifdef H5 -->
					<view class="icon-box" @click="openMaservice"><button class="icon iconfont icon-kefu2"></button>
					</view>
					<!-- #endif -->
				</view>

				<template v-if='task!=null'>
					<view class="make-group flex-1 d-c-c d-c" @click="gotoBargainHaggle(task.bragain_task_id)">
						<text>{{$nw("还剩")}}{{$nw("¥")}}{{ task.actual_price }}</text>
						<button type="primary" class="buy">{{$nw("正在砍价中")}}</button>
					</view>
				</template>
				<template v-else>
					<view class="buy-alone flex-1 d-c-c d-c" @click="gotoProducntDetail">
						<text>{{$nw("¥")}}{{ detail.product.product_price }}</text>
						<button type="primary">{{$nw("单独购买")}}</button>
					</view>
					<view class="make-group flex-1 d-c-c d-c" @click="openPopup('order')">
						<text>{{$nw("¥")}}{{ detail.bargain_price }}</text>
						<button type="primary" class="buy"
							@click="openPopup('order')">{{$nw("砍价购")}}</button>
					</view>
				</template>

			</template>
		</view>

		<!--购物确定-->
		<!-- <spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec> -->
		<QuickOrder :isPopup_q="isPopup" :productModel_q="productModel" @close="closePopup" type="bargain"></QuickOrder>

		<!--规则-->
		<Rule :isRule="isRule" :setting="setting" @close="closeRule"></Rule>

		<!--客服-->
		<Mpservice v-if="isMpservice" :isMpservice="isMpservice" @close="closeMpservice"></Mpservice>
	</view>
</template>

<script>
	import countdown from '@/components/countdown/countdown.vue';
	import Mpservice from '@/components/mpservice/Mpservice.vue';
	// import Spec from './popup/Spec.vue';
	import Rule from './popup/Rule.vue';
	import utils from '@/common/utils.js';
	import QuickOrder from '@/components/quickOrder/quickOrder.vue';
	export default {
		components: {
			// Spec,
			Rule,
			countdown,
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
				/*是否知道切换*/
				autoplay: true,
				/*自动切换时间间隔*/
				interval: 2000,
				/*滑动动画时长*/
				duration: 500,
				/*倒计时配置*/
				countdownConfig: {
					/*开始时间*/
					startstamp: 0,
					/*结束时间*/
					endstamp: 0
				},
				/*详情*/
				detail: {
					product_sku: {},
					show_sku: {
						product_price: '',
						product_sku_id: 0,
						line_price: '',
						stock_num: 0,
						sku_image: ''
					},
					show_point_sku: {}
				},
				/*活动设置*/
				setting: {},
				/*是否确定购买弹窗*/
				isPopup: false,
				/*商品属性*/
				specData: null,
				/*子级页面传参*/
				productModel: {},
				/*规格数组*/
				productSpecArr: [],
				/*是否显示规则*/
				isRule: false,
				/*商品规格*/
				productSku: [],
				/*是否打开客服*/
				isMpservice: false,
				/* 砍价任务 */
				task: [],
			};
		},
		onLoad(e) {
			uni.showLoading({
				title: this.$nw("加载中")
			});
			this.type_active = 0;

			/*分类id*/
			this.bargain_product_id = e.bargain_product_id;

		
		},
		mounted() {
			this.setGlobalColor()
			this.init();

		},
		onShow() {
			
			
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
						let view = uni.createSelectorQuery().in(_this).select('.btns-wrap');
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
				let bargain_product_id = self.bargain_product_id;
				self._get(
					'plus.bargain.product/detail', {
						bargain_product_id: bargain_product_id,
						url: ''
					},
					function(res) {
						self.countdownConfig.startstamp = res.data.active.start_time;
						self.countdownConfig.endstamp = res.data.active.end_time;
						/*详情内容格式化*/
						res.data.detail.product.content = utils.format_content(res.data.detail.product.content);
						self.task = res.data.task;
						/*初始化商品多规格*/
						if (res.data.detail.product.spec_type == 20) {
							self.initSpecData(res.data.detail.bargainSku, res.data.specData);
						}

						self.setting = res.data.setting;
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
			openPopup(e) {
				let obj = {
					specData: this.specData,
					detail: this.detail,
					productSpecArr: this.specData != null ? new Array(this.specData.spec_attr.length) : [],
					show_sku: {
						sku_image: '',
						bargain_price: 0,
						product_sku_id: 0,
						line_price: 0,
						bargain_stock: 0,
						bargain_product_sku_id: 0,
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
				this.isPopup1 = false;
			},

			/*打开客服*/
			openMaservice() {
				this.isMpservice = true;
			},

			/*关闭客服*/
			closeMpservice() {
				this.isMpservice = false;
			},

			/*跳转商品详情页面*/
			gotoProducntDetail() {
				uni.navigateTo({
					url: '/main/pages/product/detail/detail?product_id=' + this.detail.product_id
				});
			},
			/* 跳转砍价列表 */
			gotoBargainHaggle() {
				uni.navigateTo({
					url: '/plus/pages/bargain/haggle/haggle?bargain_task_id=' + this.task.bargain_task_id,
				})
			},

			/*规则*/
			openRule() {
				this.isRule = true;
			},

			/*关闭规则*/
			closeRule() {
				this.isRule = false;
			},

			/*倒计时返回*/
			returnValFunc() {},

			/*分享当前页面*/
			onShareAppMessage() {
				return {}
			},

		}
	};
</script>

<style lang="scss">
	.bargain-detail {
		padding-bottom: 90rpx;
	}

	.bargain-detail .product-pic,
	.bargain-detail .product-pic .swiper,
	.bargain-detail .product-pic image {
		width: 750rpx;
		height: 750rpx;
	}

	.bargain-detail .price-wrap {
		padding: 20rpx 20rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.bargain-detail .price-wrap .left {
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
	}

	.bargain-detail .price-wrap .new-price {
		color: $dominant-color;
		font-size: 30rpx;
	}

	.bargain-detail .price-wrap .new-price .num {
		padding: 0 4rpx;
		font-size: 50rpx;
	}

	.bargain-detail .price-wrap .old-price {
		margin-left: 10rpx;
		font-size: 30rpx;
		color: #999999;
		text-decoration: line-through;
	}

	.bargain-detail .already-sale {
		font-size: 24rpx;
		color: #999999;
	}

	.bargain-detail .product-name {
		padding: 20rpx;
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
	}

	.bargain-detail .product-describe {
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
		height: 100rpx;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		background: #ffffff;
		line-height: 40rpx;
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

	.btns-wrap .customer-service button {
		height: 80rpx;
		line-height: 80rpx;
	}

	.btns-wrap button,
	.btns-wrap button:after {
		padding: 0;
		margin: 0;
		height: 30rpx;
		line-height: 30rpx;
		margin: 0;
		padding: 0;
		flex: 1;
		border-radius: 0;
		border: 0;
	}

	.btns-wrap .buy-alone,
	.btns-wrap .buy-alone button {
		background: #ffafab;
	}

	.btns-wrap .buy-alone text,
	.btns-wrap .make-group text {
		padding-top: 10rpx;
		color: #ffffff;
		line-height: 40rpx;
		font-size: 30rpx;
	}

	.btns-wrap .make-group,
	.btns-wrap .make-group button {
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

	.bargain-detail .limited-spike {
		padding: 0 20rpx;
		height: 120rpx;
		color: #ffffff;
		border-radius: 30rpx 30rpx 0 0;
		background: #e2231a;
		// background: linear-gradient(to bottom, #ff6c65, #e2231a);
	}

	.bargain-detail .limited-spike .left-name {
		font-size: 36rpx;
		font-weight: bold;
		color: #ffffff;
	}

	.bargain-detail .limited-spike .right .box {
		width: 40rpx;
		height: 40rpx;
		padding: 4rpx;
		border-radius: 8rpx;
		line-height: 40rpx;
		text-align: center;
		background: #000000;
		color: #ffffff;
	}

	.bargain-detail .limited-spike .right>text {
		margin-left: 10rpx;
	}
</style>
