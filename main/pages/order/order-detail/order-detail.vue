<template>
	<view :style="'background:'+getMainColor()+';'" class="order-datail pb100" v-if="!loadding">
		<!--详情状态-->
		<view class="order-state d-s-c" :style="'background:'+getMainColor()+';'">
			<view class="icon-box" style="width: 50rpx;">
				<span v-if="detail.state_text == $nw('已付款，待发货')" class="icon iconfont icon-icon"
					style="color:#1b94e0"></span>
				<span v-if="detail.state_text == $nw('待付款')" class="icon iconfont icon-icon"
					style="color:#ff0000"></span>
				<span v-if="detail.state_text == $nw('已发货，待收货')" class="icon iconfont icon-daishouhuo"
					style="color:#1b94e0"></span>
				<span v-if="detail.state_text == $nw('已完成')" class="icon iconfont icon-xuanze"
					style="color:#07c160"></span>
				<span v-if="detail.state_text == $nw('已取消')" class="icon iconfont icon-gantanhao"
					style="color: #ccc;"></span>
			</view>
			<view class="state-cont flex-1">
				<view class="state-txt d-b-c">
					<text class="desc f34">{{ $nw(detail.state_text) }}</text>
				</view>
				<view class="status-price pt10" v-if="detail.pay_status.value == 10">
					{{$nw("应付金额")}}：{{$nw("¥")}} {{ detail.pay_price }}
				</view>
			</view>
			<view class="dot-bg"></view>
		</view>

		<!--物流地址-->
		<view class="order-express p30 d-s-s" v-if="detail.delivery_type.value == 10">
			<view class="icon-box" style="width: 50rpx;"><span class="icon iconfont icon-dizhi1"></span></view>
			<view class="cont-text flex-1 o-h ml20 f30">
				<view class="express-text">{{ detail.address.name }} {{ detail.address.phone }}</view>
				<view class="gray9 pt10">{{ detail.address.region.province }} {{ detail.address.region.city }}
					{{ detail.address.region.region }} {{ detail.address.detail }}
				</view>
			</view>
		</view>
		<!-- 上门自提：自提门店 -->
		<view class="order-express p30 d-s-s" v-if="detail.delivery_type.value == 20">
			<view class="flow-delivery__title m-top20">
				{{$nw("自提门店")}}
			</view>
			<view class="cont-text flex-1 o-h ml20 f30">
				<view class="express-text">
					{{ extractStore.store_name }} {{ extractStore.phone }}
					<view class="f24 gray9 pt10">
						{{ extractStore.region.province }} {{ extractStore.region.city }}
						{{ extractStore.region.region }}
					</view>
					<view @click="gotoMap" class="f24 gray9 pt10">
						{{ extractStore.address }}
						<span class="icon iconfont icon-dizhi1">{{$nw("导航")}}</span>
					</view>
				</view>
			</view>
		</view>

		<!-- 物流信息 -->
		<view class="group bg-white" v-if="detail.delivery_type.value == 10 && detail.delivery_status.value == 20">
			<view class="d-b-c" @click="gotoExpress()">
				<view class="f28">
					<view class="p-20-0">
						<text class="gray9">{{$nw("物流公司")}}：</text>
						<text>{{ detail.express && detail.express.express_name || expressInfo.express_name || '--' }}</text>
					</view>
					<view class="p-20-0">
						<text class="gray9">{{$nw("物流单号")}}：</text>
						<text>{{ detail.express_no }}</text>
					</view>
				</view>
				<view><text class="icon iconfont icon-jiantou"></text></view>
			</view>
			<view class="d-b-c" @click="makeCallPhone"
				v-if="detail.logistics_id&&detail.logistics_info!=[]&&detail.logistics_info.customer">
				<view class="f28">
					<view class="p-20-0">
						<text class="gray9">{{$nw("客服电话")}}：</text>
						<text>
							{{ detail.logistics_info.customer }}
						</text>
					</view>
				</view>
				<view><text class="icon iconfont">
						<image style="height: 30rpx;width: 30rpx;"
							src="http://imgh5.y01.cn/202106062322027b5282316.png"></image>
					</text></view>
			</view>
		</view>

		<!--购物列表-->
		<view class="shops group bg-white">
			<view class="group-hd border-b-e">
				<view class="left"><text class="min-name">{{$nw("商品")}}</text></view>
			</view>
			<view class="list">
				<view class="one-product p-20-0" v-for="(item, index) in detail.product" :key="index">
					<view class="d-s-c">
						<view class="cover">
							<image :src="item.image.file_path" mode="aspectFit"></image>
						</view>
						<view class="flex-1">
							<view class="p-0-30 text-ellipsis-2 gray3 f30">
								{{ item.product_name }}
							</view>
							<view class="pt10 p-0-30 gray6 f24">
								{{item.product_attr}}
							</view>

							<view class="pt10 p-0-30 d-b-c">
								<template v-if="item.is_user_grade!=1">
									<view class="price f22">
										{{$nw("¥")}}
										<text class="f40">{{ item.product_price }}</text>
									</view>
								</template>
								<template v-else>
									<view class="text-l-t f22">
										{{$nw("¥")}}
										<text class="f40">{{ item.product_price }}</text>
									</view>
								</template>
								<view class="f24 gray9">x{{ item.total_num }}</view>
							</view>
							<view class="mt10 tr f28" v-if="item.is_user_grade==1">
								<text class="red">{{$nw("会员折扣价")}}：</text>
								<text class="red">{{item.grade_product_price}}</text>
							</view>
							<view style="display: table;color: #007aff;" class="pt10 p-0-30 link_class"
								v-if="detail.pay_status.value==20 && item.link_show == 1">{{item.link}}
								<button type="button" @click="doCopy(item.link)">{{$nw("复制链接")}}</button>
							</view>
						</view>
					</view>
					<view class="pt10 d-e-c">
						<!-- 申请售后 -->
						<view class="m-top20 dis-flex flex-x-end">
							<text v-if="item.refund">{{$nw("已申请售后")}}</text>
							<view v-else-if="detail.isAllowRefund" @click="onApplyRefund(item.order_product_id)"><button
									class='confirm-btn' type="default">{{$nw("申请售后")}}</button>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!--订单信息-->
		<view class="group bg-white f28">
			<view class="p-20-0">
				<text class="gray9">{{$nw("订单编号")}}：</text>
				<text>{{ detail.order_no }}</text>
			</view>
			<view class="p-20-0">
				<text class="gray9">{{$nw("下单时间")}}：</text>
				<text>{{ detail.create_time }}</text>
			</view>
			<view class="p-20-0">
				<text class="gray9">{{$nw("支付方式")}}：</text>
				<text>{{ $nw(detail.pay_type.text) }}</text>
			</view>
			<view class="p-20-0">
				<text class="gray9">{{$nw("配送方式")}}：</text>
				<text>{{ $nw(detail.delivery_type.text) }}</text>
			</view>
			<view class="p-20-0">
				<text class="gray9">{{$nw("发货仓库")}}：</text>
				<text>{{ detail.logistics ? detail.logistics.name : $nw("平台") }}</text>
			</view>
			<view class="p-20-0" v-if="detail.reserve_date||detail.reserve_time">
				<text class="gray9">{{$nw("预约时间")}}：</text>
				<text>{{ detail.reserve_date?detail.reserve_date:''}}
					{{ detail.reserve_time?detail.reserve_time:''}}</text>
				<text class="icon iconfont icon-dizhi1"></text>
			</view>
			<view class="p-20-0" v-if="detail.buyer_remark">
				<text class="gray9">{{$nw("留言备注")}}：</text>
				<text>{{ detail.buyer_remark}}</text>
			</view>
		</view>

		<view class="group bg-white f28">
			<view class="p-20-0 d-b-c" v-if="detail.order_source==20">
				<text class="gray9">{{$nw("扣除积分数")}}：</text>
				<text>-{{ detail.points_num }}</text>
			</view>
			<view class="p-20-0 d-b-c">
				<text class="gray9">{{$nw("商品金额")}}</text>
				<text>{{$nw("¥")}} {{ detail.order_price }}</text>
			</view>
			<view class="p-20-0 d-b-c" v-if="detail.express_price>0">
				<text class="gray9">{{$nw("运费")}}</text>
				<text>+ {{$nw("¥")}} {{ detail.express_price }}</text>
			</view>
			<view class="p-20-0 d-e-c fb f34">
				{{$nw("应付金额")}}：
				<text class="red">{{$nw("¥")}} {{ detail.pay_price }}</text>
			</view>
		</view>

		<view class="" style="height: 30rpx;width: 100%;">

		</view>

		<!-- 操作栏 -->

		<view style="padding-top: 20rpx;" v-if="detail.order_status.value != 20&&detail.order_status.value != 30"
			class="foot-btns1">
			<button type="default" style='float: left;' @click="backIndex">{{$nw("返回首页")}}</button>

			<view style="display: flex;float: right;">
				<!-- 如果是抽奖订单 显示抽奖按钮 -->
				<block v-if="detail.lottery_times >= 0 &&getAppinfo().lottery_status">
					<button type="default" @click="draw(detail.order_id)">{{$nw("转盘抽奖")}}</button>
				</block>

				<!-- 取消订单 -->
				<button type="default" style="margin-right: 10rpx;" v-if="detail.pay_status.value == 10"
					@click="cancelOrder(detail.order_id)">{{$nw("取消订单")}}</button>

				<block v-if="detail.order_status.value != 21">
					<block v-if="detail.pay_status.value == 20 && detail.delivery_status.value == 10">
						<button @click="cancelOrder(detail.order_id)" type="default">{{$nw("申请取消")}}</button>
					</block>
				</block>
				<text v-else class="count f28 gray9">{{$nw("取消申请中")}}</text>
				<block v-if="detail.pay_status.value == 10">
					<!-- 订单付款 -->
					<button @click="onPayOrder(detail.order_id)" type="primary" v-if="detail.pay_status.value == 10"
						class="ml10 btn-red" style="border: none;"
						:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}">{{$nw("去支付")}}</button>
				</block>

				<!-- 确认收货 -->
				<block v-if="detail.delivery_status.value == 20 && detail.receipt_status.value == 10">
					<button class='confirm-btn' type="default"
						@click="orderReceipt(detail.order_id)">{{$nw("确认收货")}}</button>
				</block>




			</view>
		</view>


		<!--支付选择-->
		<Popup :show="isPayPopup" :msg="paytype" @hidePopup="hidePopupFunc">
			<!--支付方式-->
			<payOptions :need_sel="1" :payTypeList="payTypeList" style="width: 100%;" :checkedPayType="pay_num"
				@click="checkedPayType"></payOptions>
			<view class="bts"></view>
		</Popup>

		<!--拼团-->
		<Popup :show="is_fightgroup" @hidePopup="is_fightgroup = false">
			<!--拼团人-->
			<view class="fight-users mt20 bg-white">
				<!--成员列表-->
				<view class="user-list d-c-c">
					<view class="user-box pr" v-for="(item, index) in 3" :key="index">
						<text class="leader" v-if="index == 0">{{$nw("团长")}}</text>
						<image src="http://imgh5.y01.cn/202106062321585af9c0280.png" mode="aspectFit"></image>
					</view>
					<view class="user-box user-who d-c-c">?</view>
				</view>
				<view class="d-c-c mt30 gray3">
					{{$nw("还差")}}
					<text class="fb">1</text>
					{{$nw("人成团")}}
				</view>
				<view class="mt20 d-c-c gray9">
					{{$nw("剩余")}}
					<text>08:00:00</text>
					{{$nw("结束")}}
				</view>

				<!--去邀请好友-->
				<view class="d-c-c mt30"><button type="default" class="btn-red"
						:style="[btnStyle]">{{$nw("去邀请好友")}}</button></view>
			</view>
		</Popup>
	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue';
	import {
		pay
	} from '@/common/pay.js'
	import payOptions from "@/components/order/payOptions";
	import config from '@/config.js'
	export default {
		components: {
			payOptions,
			Popup,
		},
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*是否显示支付类别弹窗*/
				isPayPopup: false,
				/*订单id*/
				order_id: 0,
				pay_url: '',
				/*订单详情*/
				detail: {
					order_status: [],
					address: {
						region: []
					},
					product: '',
					pay_type: [],
					delivery_type: [],
					pay_status: []
				},
				extractStore: {},
				payment_id: 0,
				/*是否显示拼团*/
				is_fightgroup: false,
				// 支持的支付方式列表
				payTypeList: [],
				pay_type: "",
				paytype: this.$nw("支付方式"),
				pay_num: 10,
				expressList: [],
				expressInfo: {}
			};
		},
		onLoad(e) {
			this.setGlobalColor()
			this.order_id = e.order_id;
			if (e.pay_url) {
				this.pay_url = e.pay_url;
			}
		},
		onShow() {
			/*获取订单详情*/
			this.getData();
		},
		mounted() {
			uni.showLoading({
				title: this.$nw("加载中")
			});

		},
		computed: {
			btnStyle() {
				return Object.assign(this.setBackgroundColor(), this.setColor())
			},
			getbutton() {
				return this.setButton().button
			},
		},
		methods: {
			draw(e) {
				uni.navigateTo({
					url: "/plus2/pages/lottery/lottery?order_id=" + e
				})
			},
			backIndex() {
				uni.reLaunch({
					url: "/pages/index/index"
				})
			},
			/*获取数据*/
			getData() {
				let self = this;
				let order_id = self.order_id;
				self._get(
					'user.order/detail', {
						order_id: order_id
					},
					function(res) {
						console.log(res.data)
						self.detail = res.data.order;
						self.pay_log_id = res.data.order.pay_log_id
						self.extractStore = res.data.order.extractStore;
						self.loadding = false;
						uni.hideLoading();
						if (res.data.order.pay_status.value == 10 && self.pay_url) {
							window.location.href = self.pay_url;
						}
						if (self.detail.delivery_type.value == 10 && self.detail.delivery_status.value == 20) {
							self.detail.express = self.detail.express || {}
							self.getExpressList()
						}
					}
				);
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

			// 获取快递公司列表
			getExpressList() {
				this._post(
					'plus.coc.Coc/getAllExpressCode', {}, (res) => {
						this.expressList = res.data && res.data.list || []
						for (let i = 0; i < this.expressList.length; i++) {
							if (this.detail.express_id == this.expressList[i].express_code_id) {
								this.expressInfo = this.expressList[i]
								break;
							}
						}
						console.log('订单快递信息---》', this.expressInfo);
					}
				);
			},
			/*显示支付方式*/
			hidePopupFunc() {
				this.isPayPopup = false;
			},
			checkedPayType(objs) {
				console.log(objs)
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

						self._post(url, temp_params, function(resulta) {
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
					if (self.detail.product[0].supply_id) {
						// 获取跳转通莞半屏小程序参数
						self._post('order.order/getTongguanParams', {
							order_id: self.detail.order_id
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
					obj.order_price = self.detail.order_price;
					obj.app_url = config.app_url
					console.log("obj", obj)
					console.log("self.listData", self.listData)
					uni.navigateTo({
						url: "/main/pages/pay/pay?pay_log_id=" + obj.pay_log_id +
							"&payment_id=" + obj.payment_id +
							"&pay_type=" + obj.pay_type +
							"&order_id=" + self.order_id +
							"&pay_num=" + obj.pay_num +
							"&order_price=" + self.detail.order_price

					})

				} else if (objs.pay_type == "huifu_alipay_wap") { //公众号支付
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
			// changePayType(e){
			//   this.payment_id = e;
			//   this.payTypeFunc(e);
			// },

			/*取消订单*/
			cancelOrder(e) {
				let self = this;
				let order_id = e;
				wx.showModal({
					title: self.$nw("提示"),
					content: self.$nw("您确定要取消当前订单吗?"),
					success: function(o) {
						if (o.confirm) {
							uni.showLoading({
								title: self.$nw("正在处理")
							});
							self._get(
								'user.order/cancel', {
									order_id: order_id
								},
								function(res) {
									uni.hideLoading();
									uni.showToast({
										title: self.$nw("操作成功"),
										duration: 2000,
										icon: 'success'
									});
									self.getData();
								}
							);
						}
					}
				});
			},

			/*确认收货*/
			orderReceipt(order_id) {
				let self = this;
				wx.showModal({
					title: self.$nw("提示"),
					content: self.$nw("您确定要收货吗?"),
					success: function(o) {
						if (o.confirm) {
							uni.showLoading({
								title: self.$nw("正在处理")
							});
							self._post(
								'user.order/receipt', {
									order_id: order_id
								},
								function(res) {
									uni.hideLoading();
									uni.showToast({
										title: res.msg,
										duration: 2000,
										icon: 'success'
									});
									self.getData();
								}
							);
						}
					}
				});
			},
			/*查看物流*/
			gotoExpress() {
				uni.navigateTo({
					url: '/main/pages/order/express/express?order_id=' + this.detail.order_id
				});
			},
			/*申请售后*/
			onApplyRefund(e) {
				uni.navigateTo({
					url: '/main/pages/order/refund/apply/apply?order_product_id=' + e
				});
			},

			/*支付方式选择*/
			onPayOrder(orderId) {
				let self = this;
				self.isPayPopup = true;
				self.order_id = orderId;
				this.payment_id = 0;
			},

			// 复制链接
			doCopy(msg) {
				uni.setClipboardData({
					data: msg,
					success: function() {
						uni.showToast({
							title: this.$nw("复制成功"),
							duration: 2000,
							icon: 'success'
						});
					}
				});

			},
			gotoMap() {
				let self = this;
				let extractStore = self.extractStore;
				uni.openLocation({
					latitude: parseFloat(extractStore.latitude),
					longitude: parseFloat(extractStore.longitude),
					success: function() {
						console.log('success');
					}
				});
			},
			makeCallPhone() {
				let self = this;
				//#ifdef H5
				uni.showModal({
					title: self.$nw("客服电话"),
					content: self.detail.logistics_info.customer,
					success: function(res) {
						if (res.confirm) {
							console.log('用户点击确定');
						} else if (res.cancel) {
							console.log('用户点击取消');
						}
					}
				})
				//#endif

				//#ifdef MP
				uni.makePhoneCall({
					phoneNumber: self.detail.logistics_info.customer
				})
				//#endif
			}
		}
	};
</script>

<style scoped>
	.order-express {
		background: #ffffff;
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

	.order-express .icon-box .iconfont {
		font-size: 50rpx;
	}

	.order-datail {
		padding-bottom: 90rpx;
	}

	.order-datail .fight-users {
		margin: 0 auto;
	}

	.order-datail .fight-users .user-box {
		width: 80rpx;
		height: 80rpx;
		margin: 10rpx;
		border-radius: 50%;
		border: 1px dashed #cccccc;
	}

	.order-datail .fight-users {
		padding: 30rpx;
	}

	.order-datail .fight-users .user-box image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.order-datail .fight-users .user-box .leader {
		position: absolute;
		top: -20rpx;
		left: 50%;
		margin-left: -30rpx;
		width: 60rpx;
		height: 30rpx;
		line-height: 30rpx;
		text-align: center;
		color: #ffffff;
		border-radius: 30rpx;
		border: 1px solid #ffffff;
		background: red;
	}

	.order-datail .fight-users .user-box.user-who {
		font-size: 50rpx;
		color: #999999;
	}

	.confirm-btn {
		background-color: red;
		color: white;
	}
</style>