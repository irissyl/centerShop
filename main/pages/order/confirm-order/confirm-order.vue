<template>
	<view class="wrap" v-if="!loading">
		<!--tab-->
		<view class="top-tabbar">
			<block v-if="hasType(10)">
				<view :class="tab_type == 0 ? 'tab-item active' : 'tab-item'" :style="[active(tab_type, 0)]"
					@click="tabFunc(0)">{{$nw("快递配送")}}</view>
			</block>
			<block v-if="hasType(20)">
				<view :class="tab_type == 1 ? 'tab-item active' : 'tab-item'" :style="[active(tab_type, 1)]"
					@click="tabFunc(1)">{{$nw("上门自提")}}</view>
			</block>
			<block v-if="hasType(30)">
				<view :class="tab_type == 2? 'tab-item active' : 'tab-item'" :style="[active(tab_type, 2)]"
					@click="tabFunc(2)">{{$nw("无需物流")}}</view>
			</block>
			<block v-if="hasType(40)">
				<view :class="tab_type == 3 ? 'tab-item active' : 'tab-item'" :style="[active(tab_type, 3)]"
					@click="tabFunc(3)">{{$nw("虚拟云仓")}}</view>
			</block>

		</view>

		<MyInfo v-if="tab_type == 0" :Address="Address" :exist_address="exist_address"></MyInfo>

		<StoreInfo v-if="tab_type == 1" ref="getShopinfoData" :extract_store="extract_store"
			:last_extract="last_extract"></StoreInfo>
		<Logistics v-if="tab_type == 2" :tab_type="tab_type"></Logistics>
		<Storage v-if="tab_type == 3" :tab_type="tab_type"></Storage>

		<!--购买的产品-->
		<view class="vender">
			<view class="confirm-tips red" v-html="settings && settings.confirm_tips ? settings.confirm_tips : ''">
				<!-- {{settings && settings.confirm_tips ? settings.confirm_tips : ''}} -->
			</view>
			<view class="group-hd" v-if="supply.name">
				<view class="left"><text class="min-name">{{supply.name}}</text></view>
			</view>

			<view class="group-hd">
				<view class="left"><text class="min-name">{{$nw("商品")}}</text></view>
			</view>
			<view class="list">
				<view class="item" v-for="(item, index) in ProductData" :key="index">
					<view class="cover">
						<image :src="item.product_image" mode="aspectFit" style="width: 100px;"></image>
					</view>
					<view v-if="item.nobuy==true">
						<view class="info text-disabled">
							<view class="title" style="white-space: normal;">{{ item.product_name }}</view>
							<view class="describe_new">{{ item.product_sku.product_attr }}</view>
							<view class="level-box count_choose">
								<view class="price" :class="{'text-l-t':item.is_user_grade==true}">
									{{$nw("¥")}}
									<text class="num">{{ item.product_price }}</text>
								</view>
								<view class="num-wrap">
									<view class="f22">×{{ item.total_num }}</view>
								</view>
							</view>
							<view class="nobuy" v-if="item.nobuy==true">
								{{item.nobuytext}}
							</view>
							<view class="mt10 tr f28" v-if="item.is_user_grade==true">
								<text class="red">{{$nw("会员折扣价")}}：</text>
								<text class="red">{{item.grade_product_price}}</text>
							</view>
						</view>
					</view>
					<view v-else>
						<view class="info">

							<view class="title" style="white-space: normal;">{{ item.product_name }}</view>
							<view class="describe_new">{{ item.product_sku.product_attr }}</view>
							<view class="level-box count_choose">
								<view class="price" :class="{'text-l-t':item.is_user_grade==true}">
									{{$nw("¥")}}
									<text class="num">{{ item.product_price }}</text>
								</view>
								<view class="num-wrap">
									<view class="f22">×{{ item.total_num }}</view>
								</view>
							</view>
							<view class="describe f30" v-if="item.nobuy==true">
								{{item.nobuytext}}
							</view>
							<view class="mt10 tr f28" v-if="item.is_user_grade==true">
								<text class="red">{{$nw("会员折扣价")}}：</text>
								<text class="red">{{item.grade_product_price}}</text>
							</view>
						</view>
					</view>

				</view>
			</view>
			<!--总数-->
			<view class="total-box">
				<view>
					{{$nw("供")}}{{ OrderData.order_total_num }}{{$nw("件")}}{{$nw("商品")}}，
				</view>
				<view class="">
					{{$nw("合计")}}：
					<text class="price f30">{{$nw("¥")}}{{ OrderData.order_total_price }}</text>
				</view>
			</view>
		</view>

		<!--其它费用-->
		<view class="buy-checkout">
			<view @click="chooseLogistics" v-if="is_open_logistics">
				<view class="item" v-if="currentLogistics && currentLogistics.name">
					<text class="key">{{$nw("未匹配合适的物流中心")}}: {{currentLogistics.name}} </text>
					<text class="orange f28 tc">
						<span>{{$nw("切换")}}</span>
						<span class="icon iconfont icon-jiantou"></span>
					</text>
				</view>
				<view class="item" v-else>
					<text class="key gray9">{{$nw("未匹配合适的物流中心")}}:
						{{$nw("未匹配")}}</text>
					<text class="gray9 f28 tc">
						<span>{{$nw("切换")}}</span>
						<span class="icon iconfont icon-jiantou"></span>
					</text>
				</view>
			</view>
			<view class="item">
				<text class="key">{{$nw("订单总金额")}}：</text>
				<text class="price">{{$nw("¥")}}{{ OrderData.order_total_price }}</text>
			</view>
			<view class="item" v-if="OrderData.is_coupon">
				<text class="key">{{$nw("优惠券")}}：</text>
				<block v-if="coupon_num > 0">
					<text class="vlaue orange" v-if="OrderData.coupon_id > 0"
						@click="onTogglePopupCoupon(coupon_list)">-{{$nw("¥")}}{{ OrderData.coupon_money }}</text>
					<text v-else class="vlaue orange"
						@click="onTogglePopupCoupon(coupon_list)">{{$nw("有")}}{{ coupon_num }}{{$nw("张")}}{{$nw("优惠券")}}{{$nw("可用")}}</text>
				</block>
				<text v-else class="vlaue orange">{{$nw("无优惠券可用")}}</text>
			</view>
			<view class="item" v-if="OrderData.express_price>0">
				<text class="key">{{$nw("配送费用")}}：</text>
				<text class="price">{{$nw("¥")}}{{ OrderData.express_price }}</text>
			</view>
			<view class="item" v-if="OrderData.is_use_points && OrderData.force_points == false && 
			OrderData.points_money > 0">
				<text class="key">{{$nw("可用积分抵扣")}}：</text>
				<view class="">
					<text class="price">-{{$nw("¥")}}{{ OrderData.points_money }}</text>
					<switch style="transform: scale(0.7); margin-right: -10rpx;" @change="onShowPoints" />
				</view>
			</view>

			<!-- 福利金抵扣 -->
			<view class="item" v-if="OrderData.welfare>0 && OrderData.welfare_status">
				{{$nw("福利金")}}({{$nw("商家余额")}}：{{OrderData.welfare-OrderData.all_need_welfare_discount}})：</text>
				<view class="">
					<text class="price"
						v-if="OrderData.all_need_welfare_discount > 0">-{{$nw("¥")}}{{ OrderData.all_need_welfare_discount }}</text>
					<switch style="transform: scale(0.7); margin-right: -10rpx;" @change="onShowWelfare" />
				</view>
			</view>

			<view class="item" v-if="OrderData.random_price && OrderData.random_price > 0 && OrderData.is_random ==1">
				<text class="key">{{$nw("随机优惠金额")}}：</text>
				<view class="">
					<text class="price">-{{$nw("¥")}}{{ OrderData.random_price }}</text>

				</view>
			</view>

			<view class="item" v-if="OrderData.reduce">
				<text class="key">{{$nw("满减")}}({{ OrderData.reduce.active_name }})：</text>
				<view>
					<text class="theme-price f24">-￥{{ OrderData.reduce.reduced_price }}</text>
				</view>
			</view>
		</view>

		<!--支付方式-->
		<payOptions :payTypeList="payTypeList" :need_sel="0" :checkedPayType="pay_num" @click="checkedPayType">
		</payOptions>

		<!--买家留言-->
		<view class="buyer-message uni-textarea"><textarea class="textarea" v-model="remark"
				placeholder-style="color:#cccccc;" :placeholder="$nw('选项')+':'+$nw('买家留言')" /></view>

		<!--底部支付-->
		<view class="foot-pay-btns">
			<view class="price" v-if="!OrderData.force_points">
				{{$nw("¥")}}
				<text class="num">{{ OrderData.order_pay_price }}</text>
			</view>
			<view class="price" v-if="OrderData.force_points">
				<text class="gray9">{{$nw("所需积分")}}</text>
				<text class="num red fb">{{ OrderData.points_num }}</text>
				<template v-if="OrderData.order_pay_price > 0">
					<text>+</text>
					{{$nw("¥")}}
					<text class="num fb">{{ OrderData.order_pay_price }}</text>
				</template>
			</view>
			<button type="primary" @click="submitOrder">{{$nw("提交订单")}}</button>
		</view>
		<view style="height: 100px"></view>
		<!--优惠券-->
		<Coupon :isCoupon="isCoupon" :couponList="couponList" @close="closeCouponFunc"></Coupon>

		<!--	物流中心	-->
		<Logistics :isLogistics="isLogistics" :logisticsList="logisticsList" @close="closeLogisticsFunc"></Logistics>
		<Autho :loginShow="loginShow" @change_loginShow="change_loginShow"></Autho>

	</view>
</template>

<script>
	import MyInfo from './part/my-info';
	import StoreInfo from './part/store-info';
	import Storage from './part/storage';
	import Coupon from './part/coupon';
	import {
		pay
	} from '@/common/pay.js';
	import payOptions from "@/components/order/payOptions";
	import Logistics from './part/logistics';
	import Autho from '@/components/autho/autho.vue';
	import utils from '../../../../common/utils'
	import config from '@/config.js'
	export default {
		components: {
			MyInfo,
			StoreInfo,
			Coupon,
			Storage,
			payOptions,
			Logistics,
			Autho
		},
		data() {
			return {
				/*是否加载完成*/
				loading: true,
				options: {},
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				tab_type: 0,
				/*商品id*/
				product_id: '',
				/*商品数量*/
				product_num: '',
				/*商品数据*/
				ProductData: [],
				/* 商家数据 */
				supply: {},
				/*订单数据数据*/
				OrderData: [],
				// 是否存在收货地址
				exist_address: false,
				/*默认地址*/
				Address: {
					region: []
				},
				/* 地址ID */
				address_id: "", //如果传参了  用该地址
				extract_store: [],
				last_extract: {},
				product_sku_id: 0,
				/*配送方式*/
				delivery: "",
				/*自提店id*/
				store_id: 0,
				logistics_id: '',
				/*优惠券id*/
				coupon_id: 0,
				/*是否使用积分*/
				is_use_points: 0,
				/* 是否使用福利金抵扣 */
				is_use_welfare: 0,
				linkman: '',
				phone: '',
				remark: '',

				/*是否显示优惠券*/
				isCoupon: false,
				/*优惠券列表*/
				coupon_list: {},
				couponList: [],
				deliverySetting: [],
				/*优惠券数量*/
				coupon_num: 0,
				/*消息模板*/
				temlIds: [],
				settings: {},

				// 支持的支付方式列表
				payTypeList: [],
				//物流中心弹窗
				isLogistics: false,
				logisticsList: [],
				// 当前选中的物流中心对象
				currentLogistics: {},
				is_open_logistics: false,
				loginShow: false,
				code: "",
				/*支付方式*/
				pay_type: "",
				pay_num: 10,
				is_supply: false
			};
		},
		onLoad(options) {
			let self = this;

			if (options && options.address_id) {
				self.address_id = options.address_id
			}
			self.options = options;
			uni.$on('selectStoreId', function(store_id) {
				self.store_id = store_id;
			})
		},
		onShow() {
			let self = this;
			if (uni.getStorageSync("user_id")) {

			} else {
				// 根据不同的情况跳转到不同的页面
				self.login("pass_login", [0])
				return;
			}
			var address_id = uni.getStorageSync('address_id');
			if (address_id) {
				self.address_id = address_id;
			}
			this.setGlobalColor()
			this.getData();

			uni.setNavigationBarTitle({
				title: self.$nw("确认订单")
			});

			let query_order_id = uni.getStorageSync('query_order_id') || null
			if (query_order_id) {
				this.getOrderIsPay(query_order_id)
			}
		},
		computed: {
			active() {
				return (tab_type, value) => {
					if (tab_type === value) {
						return Object.assign(this.setColor(true), {
							'border-bottom': '2px solid ' + this.getMainColor()
						})
					}
				}
			},
		},
		methods: {
			// 查询订单是否支付
			getOrderIsPay(order_id) {
				this._post(
					'user.order/getOrderIsPay', {
						order_id
					}, (res) => {
						console.log('查询订单是否支付-->', res);
						if (res.data) {
							uni.reLaunch({
								url: '/main/pages/order/pay-success/pay-success?order_id=' + order_id
							});
						} else {
							uni.redirectTo({
								url: '/main/pages/order/order-detail/order-detail?order_id=' + order_id
							});
						}
						uni.removeStorageSync('query_order_id')
					}
				);
			},
			change_loginShow(e) {
				this.loginShow = e
			},
			/**/
			hasType(e) {
				if (this.deliverySetting.indexOf(e) != -1) {
					return true;
				} else {
					return false;
				}
			},
			/*支付方式选择*/
			payTypeFunc(e) {
				this.pay_type = e;
			},
			/*是否使用积分选择*/
			onShowPoints: function(e) {
				let self = this;
				if (e.target.value == true) {
					self.is_use_points = 1;
				} else {
					self.is_use_points = 0;
				}
				self.getData();
			},
			/* 是否使用福利金抵扣 */
			onShowWelfare: function(e) {
				let self = this;
				if (e.target.value == true) {
					self.is_use_welfare = 1;
				} else {
					self.is_use_welfare = 0;
				}
				self.getData();
			},
			/*选择物流中心*/
			chooseLogistics() {
				if (this.logisticsList.length <= 0) {
					uni.showToast({
						title: this.$nw("未匹配合适的物流中心"),
						duration: 2000
					})
					return
				}
				this.isLogistics = true
			},
			/*关闭物流中心 e:当前选中的物流中心对象*/
			closeLogisticsFunc(e) {
				this.logistics_id = e.logistics_id
				this.currentLogistics = e
				this.isLogistics = false
				this.getData()
			},
			/*选择优惠卷*/
			onTogglePopupCoupon(e) {
				let self = this;
				self.isCoupon = true;
				self.couponList = e;
			},
			/*关闭优惠券*/
			closeCouponFunc(e) {
				let self = this;
				self.coupon_id = e;
				this.isCoupon = false;
				self.getData();
			},
			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});

				let callback = function(res) {
					console.log('这啥玩意儿啊', res);
					self.loading = false;
					if (JSON.stringify(res.data).length < 5) {
						if (uni.getStorageSync("user_id")) {

						} else {
							// 根据不同的情况跳转到不同的页面
							self.login("pass_login", [0])
							return;
						}
					}
					//查看返回的store
					console.log("res.data", res.data)

					if (res.data.orderInfo.extract_store) {
						self.store_id = res.data.orderInfo.extract_store.store_id
					}
					//获取支付方式
					self.getPaymentList(self, function(res) {
						self.payTypeList = res
						//当未选择支付方式 默认赋值第一个
						self.payment_id = res[0].payment_id
						self.pay_type = res[0].pay_type
						self.pay_num = res[0].value
					})

					self.OrderData = res.data.orderInfo;

					// self.payTypeList = res.data.orderInfo.payTypeList
					// self.pay_type = res.data.orderInfo.pay_type
					self.logistics_id = res.data.orderInfo.logistics_id
					self.currentLogistics = res.data.orderInfo.currentLogistics
					self.temlIds = res.data.template_arr;
					self.exist_address = self.OrderData.exist_address;
					self.Address = self.OrderData.address;
					if (self.address_id == "" && self.Address) {

						self.address_id = self.Address.address_id
					} else {
						//根据传参地址重新获取地址
					}

					self.extract_store = self.OrderData.extract_store;
					self.last_extract = self.OrderData.last_extract;
					self.ProductData = self.OrderData.product_list;

					self.is_supply = self.ProductData[0].supply ? true : false

					console.log('是否店铺商品', self.is_supply);

					self.supply = self.OrderData.supply ? self.OrderData.supply : {};
					self.coupon_list = self.OrderData.coupon_list;
					self.coupon_num = Object.keys(self.coupon_list).length;

					self.deliverySetting = res.data.deliveryType

					if (res.delivery == "undefined" || res.delivery == undefined || res.delivery == "") {

						if (typeof res.data.deliveryType != "string") { //设置第一个配送方式为选中
							function arr(a, b) {
								return a - b
							}
							res.data.deliveryType.sort(arr);
							self.tab_type = res.data.deliveryType[0] == 10 ? 0 :
								(res.data.deliveryType[0] == 20 ? 1 :
									((res.data.deliveryType[0] == 30 ? 2 :
										((res.data.deliveryType[0] == 40 ? 3 : 0)))))
						} else {
							self.tab_type = res.data.deliveryType == 10 ? 0 :
								(res.data.deliveryType == 20 ? 1 :
									((res.data.deliveryType == 30 ? 2 :
										((res.data.deliveryType == 40 ? 3 : 0)))))
						}
						if (self.tab_type == 0) {
							self.delivery = 10;
						} else if (self.tab_type == 1) {
							self.delivery = 20;
						} else if (self.tab_type == 2) {
							self.delivery = 30;
						} else if (self.tab_type == 3) {
							self.delivery = 40;
						}
					}

					self.logisticsList = res.data.logisticsList

					self.is_open_logistics = res.data.is_open_logistics

					self.settings = res.data.settings;



				};

				if (self.tab_type == 0) {
					self.delivery = 10;
				} else if (self.tab_type == 1) {
					self.delivery = 20;
				} else if (self.tab_type == 2) {
					self.delivery = 30;
				} else if (self.tab_type == 3) {
					self.delivery = 40;
				}

				// 请求的参数
				let params = {
					delivery: self.delivery,
					store_id: self.store_id,
					coupon_id: self.coupon_id,
					logistics_id: self.logistics_id,
					is_use_points: self.is_use_points,
					is_use_welfare: self.is_use_welfare,
					pay_source: self.getPlatform(),
					address_id: self.address_id
				};

				//直接购买
				if (self.options.order_type === 'buy') {
					self._get(
						'order.order/buy',
						Object.assign({}, params, {
							product_id: self.options.product_id,
							product_num: self.options.product_num,
							product_sku_id: self.options.product_sku_id,
							sku_id: self.options.sku_id || 0
						}),
						function(res) {

							callback(res);

						},
						function(res) {
							uni.redirectTo({
								url: '/pages/index/index'
							})
						}
					);
				}
				// 购物车结算
				else if (self.options.order_type === 'cart') {
					self._get(
						'order.order/cart',
						Object.assign({}, params, {
							cart_ids: self.options.cart_ids || 0,
							code: "cart"
						}),
						function(res) {
							callback(res);
						}
					);
				}
				//常购清单结算
				else if (self.options.order_type === 'abuylist') {
					self._get(
						'order.order/cart',
						Object.assign({}, params, {
							abuylist_ids: self.options.abuylist_ids || 0,
							code: "abuylist"
						}),
						function(res) {
							callback(res);
						}
					);
				}
				// 积分兑换结算
				else if (self.options.order_type == 'points') {
					self._get(
						'plus.points.order/buy',
						Object.assign({}, params, {
							point_product_id: self.options.point_product_id,
							product_sku_id: self.options.product_sku_id,
							point_product_sku_id: self.options.point_product_sku_id,
							product_num: self.options.product_num
						}),
						function(res) {
							callback(res);
						},
						function(res) {
							uni.redirectTo({
								url: '/user/pages/index/index'
							})
						}
					);
				}
				// 限时秒杀
				else if (self.options.order_type === 'seckill') {
					params.num = self.options.num;
					self._get(
						'plus.seckill.order/buy',
						Object.assign({}, params, {
							seckill_product_id: self.options.seckill_product_id,
							product_sku_id: self.options.product_sku_id,
							seckill_product_sku_id: self.options.seckill_product_sku_id,
							product_num: self.options.product_num
						}),
						function(res) {
							callback(res);
						},
						function(res) {
							uni.redirectTo({
								url: '/user/pages/index/index'
							})
						}
					);
				}
				//砍价
				else if (self.options.order_type === 'bargain') {
					self._get(
						'plus.bargain.order/buy',
						Object.assign({}, params, {
							bargain_product_id: self.options.bargain_product_id,
							product_sku_id: self.options.product_sku_id,
							bargain_product_sku_id: self.options.bargain_product_sku_id,
							bargain_task_id: self.options.bargain_task_id
						}),
						function(res) {
							callback(res);
						},
						function(res) {
							uni.redirectTo({
								url: '/user/pages/index/index'
							})
						}
					);
				}
				//拼团
				else if (self.options.order_type === 'assemble') {
					self._get(
						'plus.assemble.order/buy',
						Object.assign({}, params, {
							assemble_product_id: self.options.assemble_product_id,
							product_sku_id: self.options.product_sku_id,
							assemble_product_sku_id: self.options.assemble_product_sku_id,
							product_num: self.options.product_num,
							assemble_bill_id: self.options.assemble_bill_id,
						}),
						function(res) {
							callback(res);
						},
						function(res) {
							uni.redirectTo({
								url: '/user/pages/index/index'
							})
						}
					);
				}
			},

			/*选择配送方式*/
			tabFunc(e) {
				this.tab_type = e;
				if (e == 0) {
					this.delivery = 10;
				} else if (e == 1) {
					this.delivery = 20;
				} else if (e == 2) {
					this.delivery = 30;
				} else if (e == 3) {
					this.delivery = 40;
				}
				this.getData();
			},
			/*提交订单*/
			submitOrder() {
				let self = this
				self._get('user.index/detail', {}, function(res) {
					var isA = utils.isNick_Avatar(self, res.data.userInfo);
					if (isA != 1) {
						// #ifdef MP-WEIXIN
						self.change_loginShow(true)
						return true;
						// #endif

						// #ifdef H5
						if (isA == -1) {
							uni.navigateTo({ //跳转修改昵称
								url: "/user/pages/user/info?data=&type=1"
							})
							return true;
						} else if (isA == -2) {
							uni.navigateTo({ //跳转设置头像
								url: "/user/pages/user/edit"
							})
							return true;
						} else if (isA == -3) {
							uni.navigateTo({ //跳转设置手机号
								url: "pages/login/bindmobile"
							})
							return true;
						}
						// #endif
					}
				})

				let _linkman = null
				let _phone = null
				if (self.$refs != null) {
					if (self.$refs.getShopinfoData != null) {
						_phone = self.$refs.getShopinfoData.phone
						_linkman = self.$refs.getShopinfoData.linkman
					}
				}

				// 物流中心判断
				if (self.is_open_logistics) {
					if (self.logistics_id === '' || self.logisticsList.length === 0) {
						uni.showToast({
							title: self.$nw("未匹配合适的物流中心"),
							duration: 2000
						})
						return
					}
				}

				uni.showLoading({
					title: self.$nw("请稍后"),
					mask: true
				})
				// console.log('商品信息', self.ProductData);

				// return

				self.payData(self, {
					_phone: _phone,
					_linkman: _linkman
				}, function(temp_params, url) {
					// console.log('payData url====================>', url)
					// console.log('temp_params====================>', temp_params)
					if (self.payment_id) {
						//创建订单
						self._post(url, temp_params, function(result) {
							let orderId = result.data.order_id
							if (self.is_supply) {
								// 获取跳转通莞半屏小程序参数
								self._post('order.order/getTongguanParams', {
									order_id: orderId
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
											uni.setStorageSync('query_order_id', orderId)
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
								//创建支付记录
								self._post("order.order/generate_pay_log", {
									order_id: orderId,
									table: "order", // order  订单   user  充值
									payment_id: self.payment_id,
									pay_type: self.pay_type, //支付标签
								}, function(res) {
									uni.navigateTo({
										url: "/main/pages/pay/pay?pay_log_id=" + res.data
											.pay_log_id +
											"&payment_id=" + self.payment_id +
											"&pay_type=" + self.pay_type +
											"&order_id=" + result.data.order_id +
											"&pay_num=" + self.pay_num +
											"&order_price=" + res.data.order_price
									})
								})
							}
						})
					} else {
						uni.showToast({
							title: self.$nw("请选择支付方式"),
							icon: "none"
						})
						return;
					}
				});

			},
			// 选择支付方式触发
			checkedPayType(e) {
				console.log("e", e)
				this.pay_num = parseInt(e.value)
				this.pay_type = e.pay_type
				this.payment_id = e.payment_id
			},

		}
	};
</script>

<style lang="scss" scoped>
	.wrap {
		width: 100%;
		height: 100%;
		//padding-bottom: 90rpx;
		box-sizing: border-box;
		overflow-y: scroll;
	}

	.confirm-tips {
		padding: 0 15px;
		border-bottom: 1px solid #EEEEEE;

		overflow: auto;
	}


	.text-disabled {
		color: #c6c6c6;
	}

	.nobuy {
		color: #ff0000;
	}

	.logistics-popup {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
	}
</style>