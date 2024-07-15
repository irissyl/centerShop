<template>
	<view class="product-detail">
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

			<!--限时拼团-->
			<view class="limited-spike d-b-c">
				<text class="left-name">{{$nw("限时拼团")}}</text>
				<view class="right">
					<Countdown :config="countdownConfig" @returnVal="returnValFunc"></Countdown>
				</view>
			</view>
			<view class="progress-box price-wrap">
				<view class="already-sale" style="width: 60px">{{$nw("团购进度")}}:</view><progress
					:percent="percent" style="width: 85%;" show-info activeColor="red" stroke-width="3" />
			</view>
			<!--基本信息-->
			<view class="bg-white">
				<view class="price-wrap">
					<view class="left" v-if="detail.buy_auth.can_buy>0||detail.buy_auth.no_price==0">
						<template>
							<view class="new-price">
								<text class="num">{{ detail.assemble_price }}</text>
							</view>
							<text class="old-price" v-if="detail.line_price && detail.line_price > 0">{{ detail.line_price }}</text>
						</template>
					</view>
					<template>
						<text
							class="already-sale">{{$nw("还剩余")}}{{ detail.stock }}{{$nw("件")}}</text>
					</template>
					<template>
						<text
							class="already-sale">{{$nw("已出售")}}{{ detail.product_sales }}{{$nw("件")}}</text>
					</template>

				</view>

				<view class="product-name">{{ detail.product.product_name }}</view>
				<view class="product-describe">{{ detail.product.selling_point }}</view>
			</view>

			<!--拼团用户-->
			<Bill v-if="assemble_type==0&&detail.buy_auth.can_buy>0" :bill="bill" @openMore="openMoreFunc"
				@gobill="gobillFunc"></Bill>

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
				<view class="buy-alone flex-1 d-c-c d-c" @click="gotoProducntDetail" v-if="detail.buy_auth.can_buy>0">
					<text>{{$nw("¥")}}{{ detail.product.product_price }}</text>
					<button type="primary">{{$nw("单独购买")}}</button>
				</view>
				<view class="make-group flex-1 d-c-c d-c" @click="openPopup('order')"
					v-if="detail.buy_auth.can_buy>0&&nowseconds>countdownConfig.startstamp">
					<text>{{$nw("¥")}}{{ detail.assemble_price }}</text>
					<button type="primary">{{$nw("立即拼团")}}</button>
				</view>
				<view class="make-group flex-1 d-c-c d-c" v-if="nowseconds<countdownConfig.startstamp">
					<text>{{$nw("¥")}}{{ detail.assemble_price }}</text>
					<button type="primary">{{$nw("等待开始")}}</button>
				</view>
				<view class="make-group flex-1 d-c-c d-c" @click="gotoProducntDetail" v-if="detail.buy_auth.can_buy<1">
					<!-- <text>{{$nw("¥")}}**</text> -->
					<text @click="gotoPages(detail.buy_auth)">{{detail.buy_auth.tips}}</text>
				</view>
			</template>
		</view>

		<!--购物确定-->
		<!-- <spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec> -->
		<QuickOrder :isPopup_q="isPopup" :productModel_q="productModel" @close="closePopup" type="assemble">
		</QuickOrder>

		<!--客服-->
		<Mpservice v-if="isMpservice" :isMpservice="isMpservice" @close="closeMpservice"></Mpservice>

		<!--更多用户-->
		<MoreBill v-if="ismore" :bill="bill" :ismore="true" @closeMore="openMoreFunc" @gobill="gobillFunc"></MoreBill>

	</view>
</template>

<script>
	import Countdown from '@/components/countdown/countdown.vue';
	import Mpservice from '@/components/mpservice/Mpservice.vue';
	import MoreBill from './popup/MoreBill.vue';
	// import Spec from './popup/Spec.vue';
	import Bill from './part/Bill.vue';
	import utils from '@/common/utils.js';
	import QuickOrder from '@/components/quickOrder/quickOrder.vue';
	export default {
		components: {
			// Spec,
			Countdown,
			Mpservice,
			Bill,
			MoreBill,
			QuickOrder
		},
		data() {
			return {
				percent: 0,
				from_type: 10,
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
				/*商品id*/
				product_id: null,
				/*产品图片展示*/
				imagList: [],
				/*详情*/
				detail: {
					product_sku: {},
					show_sku: {
						assemble_price: '',
						product_sku_id: 0,
						line_price: '',
						stock_num: 0,
						sku_image: '',
						assemble_product_sku_id: 0
					},
					show_point_sku: {}
				},
				/* 拼团活动 */
				active: {},
				/*已购买用户*/
				bill: [],
				/*是否确定购买弹窗*/
				isPopup: false,
				/*商品属性*/
				specData: null,
				/*子级页面传参*/
				productModel: {},
				/*拼团商品ID*/
				assemble_product_id: 0,
				/*倒计时配置*/
				countdownConfig: {
					/*开始时间*/
					startstamp: 0,
					/*结束时间*/
					endstamp: 0
				},
				/*是否打开客服*/
				isMpservice: false,
				/*是否打开更多*/
				ismore: false,
				/*拼团ID*/
				assemble_bill_id: null,
				/*当前用户id*/
				user_id: null,
				/*商品规格*/
				productSku: [],
				// 拼团类型
				assemble_type: 0,
				nowseconds: 0
			};
		},
		onLoad(e) {
			this.setGlobalColor()
			uni.showLoading({
				title: this.$nw("加载中")
			});

			this.user_id = this.getUserId();

			/*拼团商品ID*/
			this.assemble_product_id = e.assemble_product_id;
			/*拼团组ID*/
			this.assemble_bill_id = e.assemble_bill_id;
			//#ifdef H5
			this.url = window.location.href;
			//#endif
		},
		mounted() {
			this.init();
			/*获取产品详情*/
			this.getData();
		},
		onHide() {

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
				self.loadding = true;
				self._get(
					'plus.assemble.product/detail', {
						assemble_product_id: self.assemble_product_id,
						url: self.url
					},
					function(res) {

						self.countdownConfig.startstamp = res.data.active.start_time;
						self.countdownConfig.endstamp = res.data.active.end_time;
						self.nowseconds = Date.now() / 1000;
						console.log(self.nowseconds)
						/*详情内容格式化*/
						res.data.detail.product.content = utils.format_content(res.data.detail.product.content);
						var stock = res.data.detail.stock + res.data.detail.product_sales;
						self.percent = ((res.data.detail.product_sales / stock) * 100).toFixed(2);
						/*初始化商品多规格*/
						if (res.data.detail.product.spec_type == 20) {
							self.initSpecData(res.data.detail.assembleSku, res.data.specData);
						}
						self.detail = res.data.detail;
						self.bill = res.data.bill;
						self.active = res.data.active
						self.assemble_type = res.data.active.assemble_type;
						if (self.assemble_type == 1 && self.bill.length > 0) {
							self.assemble_bill_id = self.bill[0].assemble_bill_id
						}
						// 配置微信分享参数
						//#ifdef H5
						if (self.url != '') {
							let params = {
								assemble_product_id: self.assemble_product_id
							};
							self.configWx(res.data.share.signPackage, res.data.share.shareParams, params);
						}
						//#endif
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
			gotoPages(e) {
				this.gotoPage(e.linkUrl);
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
				var self = this;

				var setting = {};
				if (self.active) {
					setting = self.active.setting;
				}
				if (JSON.stringify(setting) == "{}") {
					uni.showToast({
						title: "拼团设置错误",
						icon: "none"
					})
					return;
				}
				//查看是否需要购买产品才能开启拼团
				if (e == 'order' && this.assemble_bill_id == null) {
					this.assemble_bill_id = 0;
				}
				console.log("setting",setting);
				if(e == "join"){
					console.log("e",e);
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
							assemble_bill_id: this.assemble_bill_id,
							sum: 1
						},
						productSku: this.productSku,
						type: e
					}
					this.productModel = obj;
					this.isPopup = true;
				}else{
					if (parseInt(setting.creator_free) == 1) { //说明开启免费拼团
						let self = this;
						uni.showModal({
							title:"系统提示",
							content:"是否开启拼团",
							success(es) {
								if(es.confirm){
									self._get(
										'plus.assemble.bill/createbill', {
											assemble_product_id: self.assemble_product_id,
											assemble_activity_id:  self.active.assemble_activity_id,
										},
										function(res) {
											console.log(res.data);
											if(res.code == 1){
												uni.navigateTo({
													url: '/plus/pages/assemble/fight-group-detail/fight-group-detail?assemble_bill_id=' +res.data
												});
												return;
											}else{
												uni.showToast({
													title: res.msg,
													icon: "none"
												})
												return;
											}
										})
								}
							}
						})
					
					
					} else {
					
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
								assemble_bill_id: this.assemble_bill_id,
								sum: 1
							},
							productSku: this.productSku,
							type: e
						}
						this.productModel = obj;
						this.isPopup = true;
					}
					
				}
			
	
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

			/*打开关闭更多*/
			openMoreFunc(e) {
				this.ismore = e;
			},

			/*去拼团*/
			gobillFunc(e) {
				this.ismore = false;
				if (e.creator_id === this.user_id) { //如果时自己发起的 则可以进行直接查看
					uni.navigateTo({
						url: '/plus/pages/assemble/fight-group-detail/fight-group-detail?assemble_bill_id=' + e
							.assemble_bill_id
					});
					return;
				} else {
					for (let i = 0; i < e.billUser.length; i++) {
						let user = e.billUser[i];
						if (this.user_id === user.user_id) {
							uni.navigateTo({
								url: '/plus/pages/assemble/fight-group-detail/fight-group-detail?assemble_bill_id=' +
									e.assemble_bill_id
							});
							return;
						}
					}
					this.assemble_bill_id = e.assemble_bill_id;
					this.openPopup("join");
				}

			},

			/*倒计时返回值*/
			returnValFunc(e) {

			},

			/*分享当前页面*/
			onShareAppMessage() {
				return {}
			},

		},
		destroyed() {}
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

	.product-detail .limited-spike .right>text {
		margin-left: 10rpx;
	}
</style>
