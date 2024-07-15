<template>
	<scroll-view scroll-y="true" class="procurement-detail scroll-Y"
		:style="'height:'+scrollviewHigh+'px;'+'background:'+getMainColor()+';'" v-if="!loading">
		<!--视频-->
		<view class="procurement-pic product-video">
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration" circular="true">
				<swiper-item class="common-img-bg" v-if="detail.video">
					<video style="width: 100%;height: 100%;" :src="detail.video" controls
						:poster="detail.poster || ''"></video>
				</swiper-item>
				<swiper-item v-if="detail.image && detail.image.length" class="common-img-bg"
					v-for="(item, index) in detail.image" :key="index">
					<image class="common-img" :src="item.file_path" mode="aspectFill" @click="previewImg(index)">
					</image>
				</swiper-item>
				<swiper-item v-if="!detail.image.length && detail.default_image && detail.default_image.length"
					class="common-img-bg" v-for="(item, index) in detail.default_image" :key="index">
					<image class="common-img" :src="item.file_path" mode="aspectFill" @click="previewImg(index)">
					</image>
				</swiper-item>
			</swiper>
		</view>
		<!--基本信息-->
		<view class="base-info bg-white">
			<view class="price-row flex-c">
				<view class="price flex">
					<view class="price-label">
						集采价
					</view>
					￥{{ detail.centralized_purchasing_price || '--' }}
				</view>
				<view class="sell-num sell">
					集采起拍数量{{detail.centralized_purchasing_num || '0'}}
				</view>
			</view>

			<view class="product-title">
				{{detail.product_name || '--'}}
			</view>

			<view v-if="detail.selling_point" class="product-note">
				{{detail.selling_point}}
			</view>

			<!-- <view class="service-bar flex-c">
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
			</view> -->

			<view class="product-other-info">
				<view class="other-info-item flex-c" @click="findGoodsAttr()">
					<view class="label">
						{{$nw("产品")}}
					</view>
					<view class="value">
						{{$nw("品牌")}}
					</view>
					<view class="value">
						{{$nw("参数")}}
					</view>
					<i class="iconfont icon-jiantou"></i>
				</view>
				<view class="other-info-item flex-c">
					<view class="label">
						{{$nw("服务")}}
					</view>
					<view class="value">
						{{$nw("7天无理由退货")}}
					</view>
				</view>
			</view>
		</view>
		<!-- 评价 -->
		<view class="product-evaluate bg-white">
			<view class="evaluat-title flex-c">
				{{$nw("评价")}}({{detail.comment_data_count || 0}})
				<view class="more-btn flex-c" @click="lookEvaluate(detail.product_id)">
					{{$nw("查看全部")}}
					<i class="iconfont icon-jiantou"></i>
				</view>
			</view>
			<!-- <view class="evaluat-tags">
					<view class="tag">
						物流快
					</view>
					<view class="tag">
						质量好
					</view>
				</view> -->
			<view class="evaluat-list">
				<view class="evaluat-item" v-for="(item, index) in detail.commentData" :key="index">
					<view class="evaluat-user flex-c">
						<view class="user-photo">
							<image :src="item.user.avatarUrl" mode="aspectFill" />
						</view>
						<view class="user-info">
							<view class="user-name">
								{{item.user.nickName}}
							</view>
						</view>
						<view class="evaluat-date">
							{{item.create_time}}
						</view>
					</view>
					<view class="evaluat-content">
						<view class="content-text text-ellipsis2">
							{{item.content}}
						</view>
						<!-- <view class="content-imgs">
								<view class="img" v-for="index in 3" :key="index">
									<image
										src="https://shanghui.client.xcx008.com/file/uploads/20240426/35404455d98164dc135a7f7cfe2dfa74.jpeg"
										mode="aspectFill"></image>
								</view>
							</view> -->
					</view>
				</view>
			</view>
		</view>
		<!-- 店铺信息 -->
		<view class="shop-group bg-white" v-if="detail.supply_id && supply_open && supply_show">
			<view class="shop-content">
				<view class="shop-info flex" @click="gotoSupply(detail.supply_id)">
					<view class="shop-logo">
						<image :src="supply.image_url" mode="aspectFill"></image>
					</view>
					<view class="shop-name">
						{{supply.name || '--'}}
					</view>
					<view class="more-btn flex-c" @click="gotoSupply(detail.supply_id)">
						{{$nw("进入店铺")}}
						<i class="iconfont icon-jiantou"></i>
					</view>
				</view>
				<view v-if="supply.introduce" class="shop-dec">
					{{$nw("简介：")}}{{supply.introduce}}
				</view>

				<!-- <view class="shop-goods flex">
					<view class="goods-item" v-for="index in 4">
						<view class="goods-img">
							<image
								src="https://shanghui.client.xcx008.com/file/uploads/20240426/35404455d98164dc135a7f7cfe2dfa74.jpeg"
								mode="aspectFill"></image>
						</view>
						<view class="goods-title text-ellipsis2">
							日式木植自种盆栽diy桌面办公桌摆件
						</view>
						<view class="goods-price">
							￥28
						</view>
					</view>
				</view> -->
			</view>
		</view>
		</view>

		<!-- 商品详情 -->
		<view v-if="detail.content" class="product-introduce bg-white">
			<view class="introduce-title">
				{{$nw("商品详情")}}
			</view>
			<u-parse class="introduce-content" :html="detail.content"></u-parse>
		</view>

		<!-- 参数弹窗 -->
		<u-popup class="diy-select-popup" v-model="showPopup" mode="bottom">
			<view class="popup-content">
				<view class="popup-title">
					{{$nw("产品参数")}}
					<view class="close-btn" @click="showPopup = false">
						<i class="iconfont icon-guanbi"></i>
					</view>
				</view>
				<view class="parameter-list">
					<view class="parameter-item flex-c" v-for="(item,index) in attrList" :key="index">
						<view class="label">
							{{item.attr_value_name}}
						</view>
						<view class="value">
							{{item.attr_value}}
						</view>
					</view>
				</view>
				<view class="select-btn" @click="showPopup = false">
					{{$nw("确定")}}
				</view>
			</view>
		</u-popup>

		<!-- 底部栏 -->
		<view class="product-tabbar flex-c">
			<view class="service-btn" @click="">
				<!-- #ifdef MP-WEIXIN -->
				<button class="btn" open-type="contact" session-from="wxapp">{{$nw("立即咨询")}}</button>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="btn" @click="openMaservice">{{$nw("立即咨询")}}</view>
				<!-- #endif -->
			</view>
		</view>

		<!--客服-->
		<Mpservice v-if="isMpservice" :isMpservice="isMpservice" @close="closeMpservice"></Mpservice>

	</scroll-view>
</template>

<script>
	import Mpservice from '@/components/mpservice/Mpservice.vue';
	import utils from '@/common/utils.js';
	export default {
		components: {
			/*客服*/
			Mpservice
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
				product_id: null,
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
				/*是否打开客服*/
				isMpservice: false,
				currentTime: 0,
				overTime: 0,
				is_over: false,
				showPopup: false,
				attrList: []
			};
		},
		onLoad(e) {
			let _this = this
			/*分类id*/
			this.product_id = e.product_id;
			uni.setNavigationBarTitle({
				title: _this.$nw('商品详情'),
			})
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
						_this.phoneWidth = res.windowWidth;
						_this.phoneHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
					}
				});
			},
			// 查看产品参数
			findGoodsAttr() {
				if (this.attrList && this.attrList.length) {
					this.showPopup = true;
					return
				}
				// uni.showLoading({
				// 	title: '加载中'
				// });
				this._get(
					'product.product/findGoodsAttr', {
						product_id: this.product_id,
					},
					(res) => {
						if (res.data && res.data.info && res.data.info.length) {
							this.attrList = res.data.info
							this.showPopup = true
						} else {
							this.attrList = null
							setTimeout(() => {
								this.tip(this.$nw("暂无产品参数"), 2000)
							}, 16)
						}
					},
					(err) => {
						// uni.hideLoading();
					}
				);
			},

			/*获取数据*/
			getData() {
				this.loading = true
				uni.showLoading({
					title: this.$nw("加载中")
				});
				this._get(
					'product.product/detail', {
						product_id: this.product_id,
						url: ''
					},
					(res) => {
						/*详情内容格式化*/
						res.data.detail.content = utils.format_content(res.data.detail.content);
						this.detail = res.data.detail || {};
						this.loading = false;
						uni.hideLoading();
					},
					(err) => {
						this.loading = false;
						uni.hideLoading();
					}
				);
			},

			/*打开客服*/
			openMaservice() {
				this.isMpservice = true;
			},

			/*关闭客服*/
			closeMpservice() {
				this.isMpservice = false;
			},
			/*进入店铺跳转*/
			gotoSupply(e) {
				let url = 'plus/pages/supply/detail/detail?supply_id=' + e
				this.gotoPage(url);
			},
			/*查看更多评价*/
			lookEvaluate(product_id) {
				uni.navigateTo({
					url: '/main/pages/product/detail/look-evaluate/look-evaluate?product_id=' + product_id
				});
			},
			// 预览图片多张
			previewImg(index) {
				let _this = this;
				let imgsArray = [];
				let imgUrlList = this.detail.image;
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

	.procurement-detail {
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
			padding: 24rpx 24rpx 0;
			border-bottom: 16rpx solid #f5f7fa;

			.price-row {
				.price {
					font-size: 32rpx;
					color: #F31111;
					font-weight: 600;
					align-items: flex-end;
					line-height: 1;

					.price-label {
						line-height: 1;
					}
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
				margin-top: 12rpx;
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

			.service-btn {
				// width: 520rpx;
				flex: 1;
				height: 86rpx;
				background: #1B94E0;
				border-radius: 12rpx;
				background: linear-gradient(270deg, #1B94E0 0%, #40B4FD 100%);

				.btn {
					width: 100%;
					height: 100%;
					font-size: 32rpx;
					color: #fff;
					font-weight: 500;
					display: flex;
					align-items: center;
					justify-content: center;
					background: none;
				}

				&.disabled {
					background: #ccc;
				}
			}
		}
	}



	.procurement-detail .procurement-pic,
	.procurement-detail .procurement-pic .swiper,
	.procurement-detail .procurement-pic image {
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