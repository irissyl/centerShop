<template>
	<view style="height: 100vh;" :style="'background:'+getMainColor()+';'">
		<view class="top-tabbar" :style="'background:'+getMainColor()+';'">
			<view :class="state_active==0?'tab-item active':'tab-item'" style="border-bottom:none;"
				:style="[active(state_active, 0)]" @click="stateFunc(0)">
				{{$nw("全部订单")}}
			</view>
			<view :class="state_active==1?'tab-item active':'tab-item'" :style="[active(state_active, 1)]"
				@click="stateFunc(1)">
				{{$nw("待付款")}}
			</view>
			<view :class="state_active==2?'tab-item active':'tab-item'" :style="[active(state_active, 2)]"
				@click="stateFunc(2)">
				{{$nw("待发货")}}
			</view>
			<view :class="state_active==3?'tab-item active':'tab-item'" :style="[active(state_active, 3)]"
				@click="stateFunc(3)">
				{{$nw("待收货")}}
			</view>
			<view :class="state_active==4?'tab-item active':'tab-item'" :style="[active(state_active, 4)]"
				@click="stateFunc(4)">
				{{$nw("售后")}}
			</view>
		</view>

		<!--列表-->
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			@scrolltolower="scrolltolowerFunc">
			<view :class="topRefresh?'top-refresh open':'top-refresh'">
				<view class="circle" v-for="(circle,n) in 3" :key="n"></view>
			</view>
			<view class="order-list">
				<view class="item" v-for="(item, index) in listData" :key="index">
					<view class="order-head d-b-c">
						<view>
							<text class="state-text">
								{{ $nw(item.order_source_text) }}
							</text>
							<text class="shop-name flex-1 fb">{{$nw("订单号")}}：{{ item.order_no }}</text>
						</view>
						<view class="state">
							<text class="red">{{ $nw(item.state_text) }}</text>
						</view>
					</view>
					<!--多个商品显示-->

					<view class="product-list pr" v-if="item.product.length>1" @click="gotoPage(item.order_id)">

						<scroll-view scroll-x="true">
							<view class="list d-s-c pr100">
								<view class="cover mr10" v-for="(img, num) in item.product" :key="num">
									<image :src="img.image.file_path" mode="aspectFit"></image>
								</view>
							</view>
						</scroll-view>
						<view class="total-count">
							<view class="left-shadow"></view>
							<view class="price f22">
								{{$nw("¥")}}
								<text class="f40">{{ item.order_price }}</text>
							</view>
							<view class="count">
								{{$nw("共")}} {{ item.product.length }} {{$nw("件")}}
							</view>
						</view>
					</view>
					<!--一个商品显示-->
					<view class="one-product d-s-c" v-else @click="gotoPage(item.order_id,item.pay_log_id)">
						<view class="cover" v-for="(img, num) in item.product" :key="num">
							<image :src="img.image.file_path" mode="aspectFit"></image>
						</view>
						<view class="pro-info flex-1">
							{{ item.product[0].product_name }}
						</view>
						<view class="total-count">
							<view class="left-shadow"></view>
							<view class="price f22">
								{{$nw("¥")}}
								<text class="f40">{{ item.order_price }}</text>
							</view>
							<view class="count">
								{{$nw("共")}}{{ item.product[0].total_num }}{{$nw("件")}}
							</view>
						</view>
					</view>
					<view class="order-bts">
						<block v-if="item.order_status.value != 20">
							<!-- 未支付取消订单 -->
							<button @click="cancelOrder(item.order_id)" type="default"
								v-if="item.pay_status.value==10">{{$nw("取消")}}</button>
							<!-- 已支付取消订单 -->
							<block v-if="item.order_status.value!=21">
								<block v-if="item.pay_status.value==20 && item.delivery_status.value==10">
									<button @click="cancelOrder(item.order_id)" type="default">{{$nw("申请取消")}}</button>
								</block>
								<!-- 订单核销码 -->
								<block
									v-if="item.pay_status.value==20 && item.delivery_type.value == 20 && item.delivery_status.value == 10">
									<button @click="onQRCode(item.order_id)">{{$nw("核销码")}}</button>
								</block>
							</block>
							<text v-else class="count">{{$nw("取消申请中")}}</text>
							<!-- 订单付款 -->
							<block v-if="item.pay_status.value==10">
								<button class="btn-red" style="border: none;"
									:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
									@click="onPayOrder(item)">{{$nw("付款")}}</button>
							</block>
							<!-- 确认收货 -->
							<block v-if="item.delivery_status.value==20 && item.receipt_status.value == 10">
								<button @click="orderReceipt(item.order_id)">{{$nw("确认收货")}}</button>
							</block>
							<!-- 订单评价 -->
							<button type="default" v-if="item.order_status.value==30 && item.is_comment==0"
								@click="gotoEvaluate(item.order_id)">{{$nw("评价")}}</button>
						</block>
						<!-- 如果是抽奖订单 显示抽奖按钮 -->
						<button type="default" v-if="item.lottery_times >= 0 && getAppinfo().lottery_status"
							@click="draw(item.order_id)">转盘抽奖</button>
						<template v-if="item.assemble_status==10&&item.order_source==30">
							<button class="btn-red" :style="[active]"
								@click="gotoAssembleShare(item.product[0].bill_source_id)">{{$nw("邀请好友拼单")}}</button>
						</template>


					</view>
				</view>
				<view class="d-c-c p30" v-if="listData.length==0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont" :style="'color:'+getTextColorWhite()+';'">{{$nw("亲，暂无相关记录哦")}}</text>
				</view>
				<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
			</view>
		</scroll-view>

		<!--支付选择-->
		<Popup :show="isPayPopup" :msg="paytype" @hidePopup="hidePopupFunc">
			<!--支付方式-->
			<payOptions :need_sel="1" :payTypeList="payTypeList" style="width: 100%;" :checkedPayType="pay_num"
				@click="checkedPayType"></payOptions>
		</Popup>

		<!--核销二维码-->
		<Popup :show="isCodeImg" type="middle" @hidePopup='hideCodePopupFunc'>
			<view class="ww100 p20 box-s-b">
				<image class="ww100" :src="codeImg" mode="widthFix"></image>
			</view>
		</Popup>
		<service :itemData="t_service"></service>
	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue'
	import uniLoadMore from "@/components/uni-load-more.vue"
	import {
		pay
	} from '@/common/pay.js'
	import payOptions from "@/components/order/payOptions";
	import config from '@/config.js'
	import service from '@/components/diy/service/service';
	export default {
		components: {
			Popup,
			uniLoadMore,
			payOptions,
			service
		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*状态选中*/
				state_active: 0,
				/*顶部刷新*/
				topRefresh: false,
				/*数据*/
				listData: [],
				/*数据类别*/
				dataType: 'all',
				/*是否显示支付类别弹窗*/
				isPayPopup: false,
				/*支付方式*/
				pay_type: 10,
				/*订单id*/
				order_id: 0,
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
				order_price: 0,
				product_name: "",
				/*有没有等多*/
				no_more: false,
				/*是否正在加载*/
				loading: true,
				/*是否显示核销二维码*/
				isCodeImg: false,
				code: "",
				codeImg: '',
				paytype: this.$nw("支付方式"),
				pay_num: 10,
				// 支持的支付方式列表
				payTypeList: [],
				order_type: {},
				is_supply: false
			}
		},
		computed: {

			/*加载中状态*/
			loadingType() {
				if (this.loading) {
					return 1;
				} else {
					if (this.listData.length != 0 && this.no_more) {
						return 2;
					} else {
						return 0;
					}
				}
			},

			active() {
				let that = this
				return (state_active, value) => {
					if (state_active === value) {
						return Object.assign({
							color: that.getMainTextColor()
						}, {
							'border-bottom': '2px solid ' + that.getMainTextColor()
						})
					}
				}
			},
			getbutton() {
				return this.setButton().button
			},
		},

		onLoad(e) {

			if (typeof e.dataType != 'undefined') {
				this.dataType = e.dataType;
			}

			if (this.dataType == 'payment') {
				this.state_active = 1;
			} else if (this.dataType == 'received') {
				this.state_active = 3;
			} else if (this.dataType == 'all') {
				this.state_active = 0;
			} else if (this.dataType == 'shouhou') {
				this.state_active = 4;
			}


		},
		onShow() {
			// 设置全局颜色
			this.setGlobalColor()
			this.listData = [];
			/*获取订单列表*/
			this.getData();
			uni.setNavigationBarTitle({
				title: this.$nw("我的订单")
			});
		},
		mounted() {
			this.init();
		},
		methods: {
			draw(e) {
				uni.navigateTo({
					url: "/plus2/pages/lottery/lottery?order_id=" + e
				})
			},
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.phoneHeight = res.windowHeight;
						// 计算组件的高度
						let view = uni.createSelectorQuery().select('.top-tabbar');
						view.boundingClientRect(data => {
							let h = self.phoneHeight - data.height;
							self.scrollviewHigh = h;
						}).exec();
					}
				});
			},

			/*状态切换*/
			stateFunc(e) {
				console.log(11111, e);
				let self = this;
				if (self.state_active != e) {
					self.page = 1;
					self.loading = true;
					self.state_active = e;
					switch (e) {
						case 0:
							self.listData = [];
							self.dataType = 'all';
							break;
						case 1:
							self.listData = [];
							self.dataType = 'payment';
							break;
						case 2:
							self.listData = [];
							self.dataType = 'delivery';
							break;
						case 3:
							self.listData = [];
							self.dataType = 'received';
							break;
						case 4:
							self.listData = [];
							self.dataType = 'comment';
							break;
					};
					self.getData();
				}
			},

			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {
				let self = this;
				if (self.no_more) {
					return;
				}
				self.page++;
				if (self.page <= self.last_page) {
					self.getData();
				} else {
					self.no_more = true;
				}
			},

			/*获取数据*/
			getData() {
				let self = this;
				self.loading = true;
				let dataType = self.dataType;
				self._get('user.order/lists', {
					dataType: dataType,
					page: self.page,
					list_rows: self.list_rows,
				}, function(res) {
					self.loading = false;
					console.log(res)
					self.listData = self.listData.concat(res.data.list.data);
					self.listData = self.getUnique(self.listData, "order_id");
					self.last_page = res.data.list.last_page;
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					} else {
						self.no_more = false;
					}
				});

				//获取支付方式
				self.getPaymentList(self, function(res) {
					self.payTypeList = res
					console.log(self.payTypeList)
					//当未选择支付方式 默认赋值第一个
					self.payment_id = res[0].payment_id
					self.pay_type = res[0].pay_type
					self.pay_num = res[0].value
				})
			},

			/*跳转页面*/
			gotoPage(e, pay_log_id) {
				uni.navigateTo({
					url: '/main/pages/order/order-detail/order-detail?order_id=' + e
				});
			},

			/*隐藏支付方式*/
			hidePopupFunc() {
				this.isPayPopup = false;
			},
			checkedPayType(objs) {
				console.log('checkedPayType-->', objs)
				let self = this;
				self.pay_num = objs.value
				self.isPayPopup = false;
				uni.showLoading({
					title: self.$nw("加载中"),
				});

				self.options = {
					"order_type": "pay"
				}
				if (objs.pay_type == "balance") {
					self.payData(self, {
						payType: objs.value
					}, function(temp_params, url) {
						temp_params.open_id = ""
						temp_params.openid = ""
						temp_params.payment_id = objs.payment_id
						console.log("temp_params", temp_params)

						self._post(url, temp_params, function(resulta) {
							console.log(resulta, "测试");
							pay(resulta, self);
						})
					})
				} else if (objs.pay_type == "wxmn" || objs.pay_type == "huifu_wxmn") {
					// #ifndef MP-WEIXIN
					uni.showModal({
						title: self.$nw("系统提示："),
						content: self.$nw("请在微信小程序中使用该支付"),
						showCancel: false,

					})
					uni.hideLoading()
					return;
					// #endif
					//创建订单
					console.log('是这里支付吗');
					if (self.is_supply) {
						// 获取跳转通莞半屏小程序参数
						self._post('order.order/getTongguanParams', {
							order_id: self.order_id
						}, (params_res) => {
							console.log('getTongguanParams返回数据-->', params_res);
							let extraData = params_res.data
							console.log('extraData-->', extraData);
							// 打开半屏小程序收银台
							uni.openEmbeddedMiniProgram({
								appId: 'wxceb6449590cd71e7',
								path: 'pages/miniProgramPay/index',
								extraData,
								success(open_res) {
									// 打开成功
									console.log('打开半屏小程序收银台成功', open_res);
								},
								fail(open_err) {
									console.log('打开半屏小程序收银台失败', open_err);
								},
								complete() {
									uni.hideLoading()
								}
							})
						})
					} else {
						uni.login({
							success(res) {
								self._post("auth.WxMn/getMinOpenId", {
									js_code: res.code
								}, function(result) {
									console.log("result", result)
									if (result.data.openid) {
										let openid = result.data.openid;
										self.payData(self, {
											payType: objs.value
										}, function(temp_params, url) {
											temp_params.open_id = openid
											temp_params.openid = openid
											temp_params.payment_id = objs.payment_id
											console.log("temp_params", temp_params)
											self._post(url, temp_params, function(resulta) {
												console.log(resulta, "测试");
												pay(resulta, self);
											})
										})
									}
								})
							}
						})
					}

				} else if (objs.pay_type == "wxmp" || objs.pay_type == "huifu_wxmp") { //公众号支付
					// if (self.code) { //说明code存在
					var obj = {};
					obj.pay_log_id = self.pay_log_id;
					obj.payment_id = objs.payment_id;
					obj.pay_type = objs.pay_type;
					obj.pay_num = self.pay_num;
					obj.order_price = self.order_price;
					obj.app_url = config.app_url
					console.log("obj", obj)
					console.log("self.listData", self.listData)
					uni.navigateTo({
						url: "/main/pages/pay/pay?pay_log_id=" + obj.pay_log_id +
							"&payment_id=" + obj.payment_id +
							"&pay_type=" + obj.pay_type +
							"&order_id=" + self.order_id +
							"&pay_num=" + obj.pay_num +
							"&order_price=" + self.order_price

					})

				} else if (objs.pay_type == "huifu_alipay_wap") {
					var obj = {};
					obj.pay_log_id = self.pay_log_id;
					obj.payment_id = objs.payment_id;
					obj.pay_type = objs.pay_type;
					obj.pay_num = self.pay_num;
					obj.order_price = self.order_price;
					obj.app_url = config.app_url
					uni.setStorage({
						"key": "payData",
						"data": obj
					})
					uni.navigateTo({
						url: "/main/pages/pay/pay?pay_log_id=" + obj.pay_log_id +
							"&payment_id=" + obj.payment_id +
							"&pay_type=" + obj.pay_type +
							"&order_id=" + self.order_id +
							"&pay_num=" + obj.pay_num +
							"&order_price=" + obj.order_price

					})
				}
			},
			/*支付方式选择*/
			onPayOrder(item) {
				console.log('onPayOrder',item);
				let self = this;
				self.order_price = item.orderPrice || item.order_price;
				self.order_id = item.orderId || item.order_id;
				self.product_name = item.productName || item.product[0].product_name;
				self.pay_log_id = item.pay_log_id
				self.is_supply = item.product[0].supply_id ? true : false
				self.isPayPopup = true;
			},

			/*确认收货*/
			orderReceipt(order_id) {
				let self = this;
				wx.showModal({
					title: self.$nw("提示"),
					content: self.$nw("确认收货"),
					success: function(o) {
						if (o.confirm) {
							uni.showLoading({
								title: self.$nw("正在处理"),
							});
							self._post('user.order/receipt', {
								order_id: order_id,
							}, function(res) {
								uni.hideLoading();
								uni.showToast({
									title: res.msg,
									duration: 2000,
									icon: 'success'
								});
								self.listData = [];
								self.getData();
							});
						} else {
							uni.showToast({
								title: self.$nw("取消收货"),
								duration: 1000,
								icon: 'none'
							});
						}
					}
				});

			},

			/*取消订单*/
			cancelOrder(e) {
				let self = this;
				let order_id = e;
				wx.showModal({
					title: self.$nw("提示"),
					content: self.$nw("您确定要取消吗?"),
					success: function(o) {
						console.log(o);
						uni.showLoading({
							title: self.$nw("正在处理")
						});
						if (o.cancel) {
							uni.hideLoading();
						}
						o.confirm && self._get('user.order/cancel', {
							order_id: order_id,
						}, function(res) {
							uni.hideLoading();
							uni.showToast({
								title: self.$nw("操作成功"),
								duration: 2000,
								icon: 'success'
							});
							self.listData = [];
							self.getData();
						});
					}
				});

			},

			/*去评论*/
			gotoEvaluate(e) {
				uni.navigateTo({
					url: '/main/pages/order/evaluate/evaluate?order_id=' + e,
				});
			},

			/*核销码*/
			onQRCode(e) {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中"),
				});
				let order_id = e;
				let source = 'wx';
				//#ifdef H5
				source = 'mp';
				//#endif
				self._get('user.order/qrcode', {
					order_id: order_id,
					source: source
				}, function(res) {
					uni.hideLoading();
					self.isCodeImg = true;
					self.codeImg = res.data.qrcode;
				});
			},
			/*关闭核销二维码*/
			hideCodePopupFunc() {
				this.isCodeImg = false;
			},

			/*分享拼团*/
			gotoAssembleShare(e) {
				uni.navigateTo({
					url: '/plus/pages/assemble/fight-group-detail/fight-group-detail?assemble_bill_id=' + e
				});
			},
		}
	}
</script>

<style lang="scss">
	.order-list .order-head .state-text {
		padding: 4rpx 8rpx;
		margin-right: 10rpx;
		border-radius: 4rpx;
		background: #E2231A;
		color: #FFFFFF;
		font-size: 24rpx;
	}

	.order-list .item {
		margin-top: 30rpx;
		padding: 30rpx;
		background: #FFFFFF;
	}

	.order-list .product-list,
	.order-list .one-product {
		padding: 20rpx 0;
		// height: 160rpx;
	}

	.one-product .pro-info {
		padding: 0 24rpx;
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 28rpx;
		color: #666666;
	}

	.order-list .cover,
	.order-list .cover image {
		width: 160rpx;
		height: 160rpx;
	}

	.order-list .total-count {
		padding-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
	}

	.total-count .count {
		padding-top: 10rpx;
		color: #666;
		font-size: 28rpx;
	}

	.product-list .total-count {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, .9);
	}

	.product-list .total-count .left-shadow {
		position: absolute;
		top: 0;
		bottom: 0;
		left: -24rpx;
		width: 24rpx;
		overflow: hidden;
	}

	.product-list .total-count .left-shadow::after {
		position: absolute;
		top: 0;
		bottom: 0;
		width: 24rpx;
		right: -12rpx;
		display: block;
		content: '';
		background-image: radial-gradient(rgba(0, 0, 0, .2) 10%, rgba(0, 0, 0, .1) 40%, rgba(0, 0, 0, 0) 80%);
	}

	.order-list .order-bts {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.order-list .order-bts button {
		margin: 0;
		padding: 0 30rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin-left: 20rpx;
		border-radius: 30rpx;
		font-size: 24rpx;
		border: 1px solid #CCCCCC;
		white-space: nowrap;
		background: #FFFFFF;
	}

	.order-list .order-bts button::after {
		display: none;
	}

	.order-list .order-bts button.btn-border-red {
		border: 1px solid $dominant-color;
		font-size: 24rpx;
		color: $dominant-color;
	}

	.order-list .order-bts button.btn-red {
		background: $dominant-color;
		border: 1px solid $dominant-color;
		font-size: 24rpx;
		color: #FFFFFF;
	}

	.buy-checkout {
		width: 100%;
	}

	.buy-checkout .item {
		min-height: 50rpx;
		line-height: 50rpx;
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
	}

	.buy-checkout .iconfont.icon-weixin {
		color: #04BE01;
		font-size: 50rpx;
	}

	.buy-checkout .iconfont.icon-yue {
		color: #f0de7c;
		font-size: 50rpx;
	}

	.buy-checkout .item.active .iconfont.icon-xuanze {
		color: #04BE01;
	}
</style>