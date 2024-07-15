<template>
	<scroll-view scroll-y="true" class="product-detail scroll-Y"
		:style="'height:'+scrollviewHigh+'px;'+'background:'+getMainColor()+';'" v-if="!loading">
		<!--视频-->
		<view class="product-pic product-video">
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration" circular="true">
				<swiper-item class="common-img-bg" v-if="detail.product.video">
					<video style="width: 100%;height: 100%;" :src="detail.product.video" controls
						:poster="detail.product.poster || ''"></video>
				</swiper-item>
				<swiper-item v-if="detail.product.image && detail.product.image.length" class="common-img-bg"
					v-for="(item, index) in detail.product.image" :key="index">
					<image class="common-img" :src="item.file_path" mode="aspectFill" @click="previewImg(index)">
					</image>
				</swiper-item>
				<swiper-item
					v-if="!detail.product.image.length && detail.product.default_image && detail.product.default_image.length"
					class="common-img-bg" v-for="(item, index) in detail.product.default_image" :key="index">
					<image class="common-img" :src="item.file_path" mode="aspectFill" @click="previewImg(index)">
					</image>
				</swiper-item>
			</swiper>
		</view>
		<!--基本信息-->
		<view class="base-info bg-white">
			<view class="price-row flex-c">
				<view class="price">
					￥{{ detail.seckill_price || '--' }}
				</view>
				<view v-if="detail.line_price && detail.line_price > 0" class="line-price">
					￥{{ detail.line_price }}
				</view>
				<view v-if="detail.subsidy_price && detail.subsidy_price > 0" class="pre-tips flex-c">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon6.png"></image>
					</view>
					<view class="tips">
						{{$nw("已补贴")}}{{detail.subsidy_price || '--'}}元
					</view>
				</view>
				<!-- <view class="sell-num">
					库存{{detail.product_stock || '0'}}件
				</view> -->
				<view class="sell-num sell">
					已售{{detail.product_sales || '0'}}
				</view>
			</view>
			<view class="product-title">
				{{detail.product.product_name || '--'}}
			</view>
			<view v-if="detail.product.selling_point" class="product-note">
				{{detail.product.selling_point}}
			</view>
			<!-- <view v-if="relation_label.length" class="product-tags">
				<view class="tag" v-for="(item,index) in relation_label" :key="index">
					{{item.name}}
				</view>
			</view> -->
			<view class="progress-bar flex-c">
				<view class="icon">
					<image class="common-img" src="@/static/product/icon7.png"></image>
				</view>
				<view v-if="currentTime > overTime || is_over" class="date flex-c">
					秒杀已结束
				</view>
				<view v-else class="date flex-c">
					{{$nw("距结束：")}}
					<Countdown page_type="detail" :startTime="endTimeFormat(activeData.active_time[1])"
						:currentTime="currentTime" :overTime='overTime' @countdDownOver="countdDownOver" />
				</view>
				<view class="progress">
					<view class="content" :style="'width: '+progressFormat()"></view>
				</view>
				<!-- <progress class="progress" :percent="progressFormat()" stroke-width="8" activeColor='#fff'
					backgroundColor="rgba(255,255,255,.6)" :active='true' :duration="1" /> -->
				<view v-if="currentTime < overTime && !is_over" class="tips">
					{{$nw("正在秒杀中")}}
				</view>
			</view>

			<!-- <view v-if="detail.product.show_commission && detail.product.direct_commission > 0"
				class="share-tips flex-c">
				<view class="label">
					推荐
				</view>
				<view class="content">
					分享可赚佣金￥
					<text class="money">
						{{detail.product.direct_commission}}
					</text>
				</view>
				<view class="share-btn flex-c">
					立即分享
					<i class="iconfont icon-jiantou"></i>
				</view>
			</view> -->

			<view class="service-bar flex-c">
				<view class="service-item flex-c">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon5.png"></image>
					</view>
					<view class="label">
						质量保障
					</view>
				</view>
				<view class="service-item flex-c">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon5.png"></image>
					</view>
					<view class="label">
						包邮
					</view>
				</view>
				<view class="service-item flex-c">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon5.png"></image>
					</view>
					<view class="label">
						48小时发货
					</view>
				</view>
				<view class="service-item flex-c">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon5.png"></image>
					</view>
					<view class="label">
						7天无理由退货
					</view>
				</view>
			</view>


		</view>



		<!-- 商品详情 -->
		<view v-if="detail.product.content" class="product-introduce bg-white">
			<view class="introduce-title">
				{{$nw("商品详情")}}
			</view>
			<u-parse class="introduce-content" :html="detail.product.content"></u-parse>
		</view>

		<!-- 底部栏 -->
		<view class="product-tabbar flex-c">
			<view class="tabbar-handle flex-c">
				<!-- <view class="handle-item">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon1.png"></image>
					</view>
					<view class="handle-label">
						店铺
					</view>
				</view> -->
				<!-- <view class="handle-item">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon2.png"></image>
					</view>
					<view class="handle-label">
						{{$nw("收藏")}}
					</view>
				</view> -->
				<!-- #ifdef MP-WEIXIN -->
				<view class="handle-item">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon3.png"></image>
					</view>
					<view class="handle-label">
						{{$nw("客服")}}
					</view>
					<button class="service-btn" open-type="contact" session-from="wxapp"></button>
				</view>
				<!-- #endif -->

				<!-- #ifdef H5 -->
				<view class="handle-item" @click="openMaservice">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon3.png"></image>
					</view>
					<view class="handle-label">
						{{$nw("客服")}}
					</view>
				</view>
				<!-- #endif -->
			</view>
			<view v-if="currentTime > overTime || is_over" class="buy-btn disabled" @click="overTips">
				{{$nw("已结束")}}
			</view>
			<view v-else class="buy-btn" @click="openPopup('order')">
				{{$nw("立即抢购")}}
			</view>
		</view>

		<!-- 立即购买弹窗 -->
		<!-- <u-popup class="diy-select-popup" v-model="buyPopup" mode="bottom" :mask-close-able="false">
			<view class="popup-content">
				<view class="popup-title">
					确认订单
					<view class="close-btn" @click="buyPopup = false">
						<i class="iconfont icon-guanbi"></i>
					</view>
				</view>
	
				<view class="buy-popup-content">
					<view class="address-box flex-c">
						<view class="icon">
							<image class="common-img" src="@/static/product/icon4.png" />
						</view>
						<view class="info">
							<view class="name flex-c">
								张三
								<view class="phone">
									12345678901
								</view>
							</view>
							<view class="address">
								广东省东莞市东城区鸿福路201号
							</view>
						</view>
						<i class="iconfont icon-jiantou"></i>
					</view>
					<view class="goods-info flex-c">
						<view class="goods-img">
							<image class="common-img"
								src="https://shanghui.client.xcx008.com/file/uploads/20240522/2039eb4fd3f42d53b589017e6f303b72.jpg"
								mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="price flex">
								￥289
								<view class="line-price">
									￥299
								</view>
							</view>
							<view class="tips flex-c">
								<view class="label">
									已选择
								</view>
								<view class="value">
									六月雪盆栽 迎客松形状
								</view>
							</view>
							<view class="count-box flex-c">
								<view class="item icon">
									<i class="icon iconfont icon-jian"></i>
								</view>
								<view class="item num">
									1
								</view>
								<view class="item icon">
									<i class="icon iconfont icon-jia"></i>
								</view>
							</view>
						</view>
					</view>
					<view class="category">
						<view class="category-title">
							商品种类
						</view>
						<view class="category-list flex">
							<view class="category-item" v-for="index in 2" :key="index">
								迎客松造型
							</view>
						</view>
					</view>
				</view>
	
				<view class="select-btn">
					立即支付
				</view>
			</view>
		</u-popup> -->


		<!--购物确定-->
		<!-- <spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec> -->
		<QuickOrder :isPopup_q="isPopup" :productModel_q="productModel" @close="closePopup" type="seckill"></QuickOrder>
		<!--客服-->
		<Mpservice v-if="isMpservice" :isMpservice="isMpservice" @close="closeMpservice"></Mpservice>

	</scroll-view>
</template>

<script>
	// import Spec from './popup/Spec.vue';
	// import Countdown from '@/components/countdown/countdown.vue';
	import Mpservice from '@/components/mpservice/Mpservice.vue';
	import utils from '@/common/utils.js';
	import QuickOrder from '@/components/quickOrder/quickOrder.vue';
	import Countdown from '../components/Countdown.vue'
	export default {
		components: {
			/*选择规格*/
			// Spec,
			/*倒计时组件*/
			Countdown,
			/*客服*/
			Mpservice,
			QuickOrder,
		},
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*是否加载完成*/
				loading: true,
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
				isMpservice: false,
				activeData: {},
				currentTime: 0,
				overTime: 0,
				is_over: false
			};
		},
		onLoad(e) {
			let _this = this
			/*分类id*/
			this.seckill_product_id = e.seckill_product_id;
			uni.setNavigationBarTitle({
				title: _this.$nw('秒杀详情'),
			})
		},
		mounted() {
			this.setGlobalColor()
			this.init();
			
			/*获取产品详情*/
			this.getData();
		},
		/*分享当前页面*/
		onShareAppMessage() {},
		onShareTimeline() {},
		methods: {
			countdDownOver() {
				// this.getData()
				this.is_over = true
			},
			overTips() {
				this.tip(this.$nw("秒杀已结束"), 2000)
			},
			progressFormat() {
				let sales = this.detail.product_sales || 0
				let stock = this.detail.stock || 0
				let num = parseInt((sales / stock) * 100)
				return num + '%'
			},
			endTimeFormat(time) {
				const today = new Date();
				const year = today.getFullYear();
				const month = String(today.getMonth() + 1).padStart(2, '0');
				const day = String(today.getDate()).padStart(2, '0');
				const todayDate = `${year}-${month}-${day}`;
				const todayTime = todayDate + ' ' + time
				// return '2024-06-07 14:04:00'
				return todayTime
			},
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneWidth = res.windowWidth;
						_this.phoneHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
						// 计算组件的高度
						// let view = uni.createSelectorQuery().select('.btns-wrap');
						// view.boundingClientRect(data => {
						// 	let h = _this.phoneHeight - data.height;
						// 	_this.scrollviewHigh = h;
						// }).exec();
					}
				});
			},

			/*获取数据*/
			getData() {
				let self = this;
				self.loading = true
				uni.showLoading({
					title: self.$nw("加载中")
				});
				self._get(
					'plus.seckill.product/detail', {
						seckill_product_id: self.seckill_product_id
					},
					(res) => {
						/*倒计时*/
						// self.countdownConfig.endstamp = res.data.active.end_time;
						// self.countdownConfig.startstamp = res.data.active.start_time;

						/*详情内容格式化*/
						res.data.detail.product.content = utils.format_content(res.data.detail.product.content);

						/*初始化商品多规格*/
						if (res.data.detail.product.spec_type == 20) {
							self.initSpecData(res.data.detail.seckillSku, res.data.specData);
						}
						self.detail = res.data.detail;
						self.activeData = res.data.active || {}

						// 获取当前时间时间戳
						const today = new Date();
						self.currentTime = +today
						// 获取当天活动结束时间时间戳
						const endTime = self.endTimeFormat(self.activeData.active_time[1])
						self.overTime = new Date(endTime).getTime()

						self.loading = false;
						uni.hideLoading();
					},
					(err) => {
						self.loading = false;
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
				console.log('productModel-->', this.productModel);
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
			
			// 预览图片多张
			previewImg(index) {
				let _this = this;
				let imgsArray = [];
				let imgUrlList = this.detail.product.image;
				for (let i = 0; i < imgUrlList.length; i++) {
					if (imgUrlList[i].file_path != "") {
						imgsArray.push(imgUrlList[i].file_path);
					}
				}
				uni.previewImage({
					current: index,
					urls: imgsArray,
					indicator: 'number',
					loop: true
				});
			
			},

		}
	};
</script>

<style lang="scss" scoped>
	.buy-popup-content {
		margin-top: 12rpx;

		.address-box {
			padding: 0 24rpx 24rpx;
			border-bottom: 16rpx solid #F5F7FA;

			.icon {
				width: 48rpx;
				height: 48rpx;
			}

			.info {
				margin-left: 16rpx;

				.name {
					font-size: 24rpx;
					font-weight: 500;

					.phone {
						font-size: 24rpx;
						font-weight: 500;
						margin-left: 32rpx;
					}
				}

				.address {
					font-size: 24rpx;
					color: #666;
				}
			}

			.iconfont {
				margin-left: auto;
				font-size: 28rpx;
				color: #999;
				margin-right: 10rpx;
			}
		}

		.goods-info {
			padding: 24rpx 24rpx 32rpx;

			.goods-img {
				width: 144rpx;
				height: 144rpx;
				border-radius: 8rpx;
				background: #eee;
				overflow: hidden;
			}

			.info {
				height: 144rpx;
				margin-left: 24rpx;
				display: flex;
				flex-direction: column;
				padding: 10rpx 0 0;

				.price {
					font-weight: 600;
					line-height: 1;

					.line-price {
						font-size: 20rpx;
						color: #999;
						margin-left: 16rpx;
						margin-top: auto;
						line-height: 1;
						text-decoration: line-through;
						font-weight: 400;
					}
				}

				.tips {
					margin-top: 8rpx;

					.label {
						font-size: 24rpx;
						color: #666;
					}

					.value {
						font-size: 24rpx;
						margin-left: 16rpx;
					}
				}

				.count-box {
					margin-top: auto;

					.item {
						width: 32rpx;
						height: 32rpx;
						background: #F5F7FA;
						border-radius: 4rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						.iconfont {
							font-size: 20rpx;
							transform: scale(.8);
							color: #666;
						}

						&.active {
							background: #E1F3FF;

							.iconfont {
								color: #1B94E0;
							}
						}

						&.num {
							min-width: 24rpx;
							font-size: 20rpx;
							font-weight: 500;
							background: none;
							margin: 0 8rpx;
						}
					}
				}
			}
		}

		.category {
			padding: 0 24rpx 80rpx;

			.category-title {
				font-weight: 500;
				line-height: 1;
			}

			.category-list {
				flex-wrap: wrap;
				margin-left: -16rpx;
				margin-top: 20rpx;

				.category-item {
					line-height: 1;
					font-size: 24rpx;
					color: #333333;
					height: 52rpx;
					padding: 0 16rpx;
					border-radius: 8rpx;
					border: 2rpx solid #F5F7FA;
					background: #F5F7FA;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left: 16rpx;
					margin-bottom: 16rpx;

				}
			}
		}
	}

	.product-detail {
		background: #fff !important;
		overflow: hidden;

		// padding-bottom: calc(120rpx + env(safe-area-inset-bottom) / 2);
		.scroll-Y {
			background: #fff !important;

		}

		/deep/.uni-swiper-dots {
			padding: 8rpx 12rpx;
			border-radius: 999px;
			background: rgba(0, 0, 0, 0.4);

			.uni-swiper-dot {
				width: 8rpx;
				height: 8rpx;
				background: rgba(255, 255, 255, 0.6);
				transition: all .2s;
				margin: 0 5rpx !important;

				&.uni-swiper-dot-active {
					width: 24rpx;
					border-radius: 999px;
					background: #fff;
				}
			}
		}

		/deep/.wx-swiper-dots {
			padding: 8rpx 12rpx;
			border-radius: 999px;
			background: rgba(0, 0, 0, 0.4);

			.wx-swiper-dot {
				width: 8rpx;
				height: 8rpx;
				background: rgba(255, 255, 255, 0.6);
				transition: all .2s;
				margin: 0 5rpx !important;

				&.wx-swiper-dot-active {
					width: 24rpx;
					border-radius: 999px;
					background: #fff;
				}
			}
		}

		.base-info {
			padding: 24rpx 24rpx;
			border-bottom: 16rpx solid #f5f7fa;

			.price-row {
				.price {
					font-size: 32rpx;
					color: #F31111;
					font-weight: 600;
				}

				.line-price {
					font-size: 24rpx;
					color: #999;
					text-decoration: line-through;
					margin-left: 16rpx;
				}

				.pre-tips {
					height: 36rpx;
					display: felx;
					align-items: center;
					border-radius: 8rpx;
					padding: 0 8rpx;
					margin-left: 16rpx;
					background: linear-gradient(270deg, #F31111 0%, #FF6666 100%);

					.icon {
						width: 16rpx;
						height: 16rpx;
					}

					.tips {
						font-size: 20rpx;
						color: #fff;
						margin-left: 8rpx;
					}
				}

				.sell-num {
					margin-left: auto;
					font-size: 24rpx;
					color: #999;

					&.sell {
						// margin-left: 24rpx;
					}
				}
			}

			.product-title {
				font-size: 32rpx;
				font-weight: 500;
				color: #333;
				line-height: 42rpx;
				margin-top: 8rpx;
				text-align: justify;
			}

			.product-note {
				font-size: 24rpx;
				color: #666;
				line-height: 30rpx;
				margin-top: 16rpx;
			}

			.progress-bar {
				height: 56rpx;
				padding: 0 16rpx;
				background: linear-gradient(90deg, #FF4D48 0%, #FF8D5E 100%);
				border-radius: 16rpx 16rpx 0rpx 0rpx;
				margin-top: 24rpx;

				.icon {
					width: 36rpx;
					height: 38rpx;
				}

				.date {
					margin-left: 8rpx;
					font-size: 24rpx;
					color: #fff;
				}

				.progress {
					width: 188rpx;
					height: 16rpx;
					background: rgba(255, 255, 255, 0.6);
					border-radius: 999px;
					margin-left: auto;
					display: flex;

					.content {
						background: #fff;
						border-radius: 999px;
					}

					/deep/.uni-progress-bar {
						border-radius: 999px;
						overflow: hidden;

						.uni-progress-inner-bar {
							border-radius: 999px;
						}
					}
				}

				.tips {
					margin-left: 16rpx;
					font-size: 24rpx;
					color: #fff;
				}
			}

			.share-tips {
				height: 56rpx;
				background: #FFEBEB;
				margin-top: 24rpx;
				padding: 0 12rpx;

				.label {
					width: 56rpx;
					height: 36rpx;
					line-height: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					background: linear-gradient(90deg, #FE413D 0%, #FF2E60 100%);
					font-size: 20rpx;
					color: #fff;
					border-radius: 4rpx;
				}

				.content {
					margin-left: 8rpx;
					font-size: 24rpx;
					color: #F43434;

					.money {
						font-size: 32rpx;
						color: #F43434;
						font-weight: 500;
					}
				}

				.share-btn {
					margin-left: auto;
					font-size: 20rpx;
					color: #F43434;

					.iconfont {
						font-size: 20rpx;
						color: #F43434;
						margin-left: 4rpx;
					}
				}
			}

			.service-bar {
				padding: 24rpx 0 0;

				.service-item {
					margin-left: 18rpx;

					.icon {
						width: 24rpx;
						height: 24rpx;
					}

					.label {
						margin-left: 8rpx;
						font-size: 24rpx;
					}

					&:first-of-type {
						margin-left: 0;
					}
				}
			}

			.product-tags {
				display: flex;
				padding: 28rpx 0;
				border-bottom: 2rpx solid #EDEDED;

				.tag {
					height: 36rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 20rpx;
					color: #FC512C;
					line-height: 1;
					padding: 0 8rpx;
					background: #FFEEEB;
					border-radius: 4rpx;
					margin-right: 16rpx;

					&:last-of-type {
						margin-right: 0;
					}
				}
			}

			.product-other-info {
				padding: 12rpx 0;

				.other-info-item {
					padding: 12rpx 0;

					.label {
						font-weight: 500;
						padding-right: 12rpx;
					}

					.value {
						margin-left: 16rpx;
					}

					.iconfont {
						margin-left: auto;
						font-size: 24rpx;
						color: #999;
					}

				}
			}
		}

		.more-btn {
			height: 36rpx;
			font-size: 20rpx;
			color: #999;
			margin-left: auto;

			.iconfont {
				font-size: 20rpx;
				color: #999;
				margin-left: 8rpx;
			}
		}

		.product-evaluate {
			padding: 16rpx 24rpx;
			border-top: 16rpx solid #f5f7fa;
			border-bottom: 16rpx solid #f5f7fa;

			.evaluat-title {
				font-weight: 500;
			}

			.evaluat-tags {
				margin-top: 8rpx;
				display: flex;

				.tag {
					height: 36rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 20rpx;
					color: #1B94E0;
					line-height: 1;
					padding: 0 8rpx;
					background: #E4F2FF;
					border-radius: 4rpx;
					margin-right: 16rpx;

					&:last-of-type {
						margin-right: 0;
					}
				}

			}

			.evaluat-list {
				margin-top: 4rpx;

				.evaluat-item {
					padding: 20rpx 0;
					border-bottom: 2rpx solid #EDEDED;

					.evaluat-user {
						.user-photo {
							width: 64rpx;
							height: 64rpx;
							border-radius: 8rpx;
							background: #eee;
							overflow: hidden;
						}

						.user-info {
							height: 64rpx;
							padding: 6rpx 0;
							margin-left: 16rpx;
							display: flex;
							flex-direction: column;
							justify-content: center;

							.user-name {
								font-size: 24rpx;
								line-height: 1;
							}
						}

						.evaluat-date {
							font-size: 20rpx;
							color: #999;
							margin-left: auto;
						}
					}

					.evaluat-content {
						margin-top: 16rpx;

						.content-text {
							line-height: 42rpx;
						}

						.content-imgs {
							display: flex;
							flex-wrap: wrap;

							.img {
								width: 164rpx;
								height: 164rpx;
								border-radius: 8rpx;
								background: #eee;
								overflow: hidden;
								margin-right: 16rpx;
								margin-top: 16rpx;

								&:nth-of-type(4n) {
									margin-right: 0;
								}
							}
						}
					}
				}
			}
		}

		.shop-group {
			padding: 24rpx 24rpx 0;

			.shop-content {
				padding-bottom: 24rpx;
				border-bottom: 2rpx solid #EDEDED;
			}

			.shop-info {
				.shop-logo {
					width: 80rpx;
					height: 80rpx;
					border-radius: 8rpx;
					background: #eee;
					overflow: hidden;
				}

				.shop-name {
					margin-left: 16rpx;
					flex: 1;
				}
			}

			.shop-dec {
				padding: 24rpx 0 0;
				font-size: 24rpx;
				color: #999;
				line-height: 36rpx;
			}

			.shop-goods {
				margin-top: 24rpx;
				flex-wrap: wrap;

				.goods-item {
					width: 164rpx;
					margin-right: 16rpx;

					&:nth-of-type(4n) {
						margin-right: 0;
					}

					.goods-img {
						width: 164rpx;
						height: 164rpx;
						border-radius: 8rpx;
						background: #eee;
						overflow: hidden;
					}
				}

				.goods-title {
					font-size: 24rpx;
					line-height: 32rpx;
					margin-top: 8rpx;
				}

				.goods-price {
					font-size: 20rpx;
					color: #F31111;
					margin-top: 8rpx;
				}
			}
		}

		.product-introduce {
			padding: 24rpx 24rpx 0;
			padding-bottom: calc(158rpx + env(safe-area-inset-bottom) / 2);

			.introduce-title {
				font-size: 32rpx;
				font-weight: 500;
				text-align: center;
			}

			.introduce-content {
				margin-top: 16rpx;

				/deep/p,
				img {
					width: 100%;
				}
			}
		}

		.product-tabbar {
			width: 100vw;
			// height: 100rpx;
			background: #fff;
			box-shadow: 0rpx -4rpx 8rpx 0rpx rgba(0, 0, 0, 0.06);
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 99;
			padding: 20rpx 24rpx 0;
			padding-bottom: calc(20rpx + env(safe-area-inset-bottom) / 2);

			.tabbar-handle {
				.handle-item {
					width: 76rpx;
					margin-left: 40rpx;
					position: relative;

					.icon {
						width: 48rpx;
						height: 48rpx;
						margin: 0 auto;
					}

					.handle-label {
						font-size: 28rpx;
						color: #666;
						text-align: center;
						line-height: 1;
						margin-top: 8rpx;
						text-align: center;
					}

					.service-btn {
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 33;
						opacity: 0;
						padding: 0;
						margin: 0;
					}

					&:first-of-type {
						margin-left: 0;
					}
				}
			}

			.buy-btn {
				// width: 520rpx;
				flex: 1;
				height: 86rpx;
				background: #1B94E0;
				font-size: 32rpx;
				color: #fff;
				font-weight: 500;
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 20rpx;
				background: linear-gradient(90deg, #FF4D48 0%, #FF8D5E 100%);

				&.disabled {
					background: #ccc;
				}
			}
		}
	}



	.product-detail .product-pic,
	.product-detail .product-pic .swiper,
	.product-detail .product-pic image {
		width: 100vw;
		height: 560rpx;
	}




	.share-box1 {
		position: fixed;
		padding-right: 10rpx;
		width: 100rpx;
		height: 90rpx;
		right: 0;
		bottom: 266rpx;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		border-radius: 16rpx 0 0 16rpx;
		background: rgba(0, 0, 0, 0.8);

		.iconfont {
			margin-bottom: 10rpx;
			font-size: 50rpx;
			color: #ffffff;
		}
	}

	.share-box2 {
		position: fixed;
		padding-right: 10rpx;
		width: 100rpx;
		height: 90rpx;
		right: 0;
		bottom: 366rpx;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		border-radius: 16rpx 0 0 16rpx;
		background: rgba(0, 0, 0, 0.8);

		.iconfont {
			margin-bottom: 10rpx;
			font-size: 50rpx;
			color: #ffffff;
		}
	}

	.share-box {
		position: fixed;
		padding-right: 10rpx;
		width: 100rpx;
		height: 90rpx;
		right: 0;
		bottom: 170rpx;
		// display: flex;
		// justify-content: center;
		// align-items: center;
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
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		box-shadow: 0 8rpx 16rpx 0 rgba(226, 35, 26, 0.6);
	}

	.label-title {
		border-top: 1rpx solid #ddd;
		padding: 20rpx;
		background-color: #fff;
	}

	.label-title .label-name {
		line-height: 48rpx;
		margin: 8rpx;
		padding: 8rpx;
		border-radius: 10rpx;
		background-color: #f6f6f6;
		display: inline-block;
	}

	.recommend-product {
		margin-top: 10rpx;
	}

	.recommend-product .title {
		heigth: 100rpx;
		font-size: 30rpx;
		background-color: #fff;
		text-align: left;
		-webkit-justify-content: left
	}

	.recommend-product .title .name {
		margin: 0 20rpx;
		font-size: 30rpx;
		line-height: 70rpx;
	}

	.recommend-product-list {
		padding: 10rpx 10rpx 0 10rpx;
		display: -webkit-box;
		-webkit-box-orient: horizontal;
		overflow: scroll;
	}

	.recommend-product-list .item {
		width: 33%;
		border-radius: 20rpx;
		margin-right: 10rpx;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		overflow: hidden;
		background: #ffffff;
		box-shadow: 0 0 8rpx rgba(0, 0, 0, .1);
		margin-bottom: 10rpx;
	}

	.recommend-product-list .product-cover {
		width: 100%;
		height: 240rpx;
	}

	.recommend-product-list image {
		width: 100%;
		height: 100%;
	}

	.recommend-product-list .product-info {
		padding: 0 8rpx;
	}

	.recommend-product-list .product-title {
		// height: 80rpx;
		// margin-top: 10rpx;
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		font-size: 28rpx;
	}

	.recommend-product-list .price {
		color: red;
	}

	.recommend-product-list .price .num {
		font-size: 30rpx;
		font-weight: bold;
	}

	.supply-item {
		padding: 10px 10px 0 10px;
		background: #fff;
		margin-top: 10rpx;
	}

	// .supply-item .cmt-user{
	// 	background-color: #fff;
	// }
	.supply-item .left {

		padding-bottom: 20rpx;
	}

	.supply-item .supply {
		width: 140rpx;
		height: 140rpx;
		border-radius: 20rpx;
		float: left;
	}

	.supply-item .supply1 {
		float: left;
		overflow: hidden;
		height: 150rpx;
		width: 75%;
	}

	.supply-item .name {
		width: 100%;
		height: 150rpx;
		overflow: hidden;
		-webkit-line-clamp: 1;
		padding: 0 16rpx 16rpx 16rpx;
		font-size: 36rpx;

		overflow: hidden;
		text-overflow: ellipsis; //显示省略号
		display: -webkit-box;
		word-break: break-all; //换行
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1; //控制行数

	}

	.supply-item .supply-desc {
		width: 100%;
		height: 70rpx;
		line-height: 40rpx;


		padding: 16rpx;
		font-size: 28rpx;
		color: #757575;

		overflow: hidden;
		text-overflow: ellipsis; //显示省略号
		display: -webkit-box;
		word-break: break-all; //换行
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; //控制行数
	}

	.product-no {
		margin-top: 10rpx;
		padding-left: 20rpx;
		line-height: 70rpx;
		font-size: 30rpx;
		background-color: #ffffff;
	}

	.product-video {
		position: relative;
	}

	.product-video .bg,
	.cover .bg {
		position: absolute;
		left: 0;
		top: 0;
	}

	.product-video .play,
	.cover .play {
		position: absolute;
		left: 50%;
		top: 50%;
		margin-top: -70rpx;
		margin-left: -70rpx;
	}

	.change-mc {
		width: auto;
		height: auto;
		position: absolute;
		bottom: 80rpx;
		left: 50%;
		margin-left: -105rpx;
	}

	.change-mc view {
		display: inline-block;
		color: #ff5555;
		width: 100rpx;
		height: 44rpx;
		border-radius: 20rpx;
		text-align: center;
		line-height: 44rpx;
		float: left;
		background: rgba(255, 255, 255, 0.6);
		margin: 0 10rpx;
		font-size: 22rpx;
	}

	.change-mc view.active {
		color: #ffffff;
		background: #ff5555;
	}

	.video .block {
		display: block;
	}

	.video .none {
		display: none;
	}

	video {
		width: 750rpx;
		height: 750rpx;
	}

	.icon-collect {
		width: 60rpx;
		height: 55rpx;
	}

	.plus_img {
		width: 750rpx;
		height: 750rpx;
	}
</style>