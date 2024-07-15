<template>
	<view>
		<scroll-view style="position: fixed;top: 0;left: 0;">

			<view class="" :id="`qb`">
				<view :style="[bgcColor]"
					style="text-align: center;font-size: 600; width: 100%;height: 80rpx;line-height: 80rpx;color: #ffffff !important;">
					<text style=" font-size: 34rpx;font-weight: 600;">在线点单</text>
				</view>
				<view class="qby0">
					<view class='qby' :style="[bgcColor]" style="color: #ffffff !important;">
						<view class="" style="flex: 0.5;">

						</view>
						<view class="qby_1">
							<image class="qby_image" :src="appinfo.store?appinfo.store.logo.file_path:''" mode="">
							</image>
						</view>
						<view class="" style="flex: 0.5;">

						</view>
						<view class="qby_2">
							<view class="qby_2_1">
								<text v-if="appinfo.store.name">{{appinfo.store.name}}</text>
								<text v-else>商家未设置名称</text>
							</view>
							<view class="qby_2_2"  v-if="appinfo.store.phone" @click="makePhone(appinfo.store.phone)">
								<button type="primary"
									class="pr icon iconfont icon-dianhua" size="default"
									hover-class="none" 
									 style=" padding: 0rpx; width: 360rpx;height: 60rpx;line-height: 60rpx;
									border-radius: 20%;border: 1rpx solid red;text-align: left;display: flex;" :style="[bgcColor]">
									 <view style="text-align: left;margin-left: 8rpx;margin-right: 8rpx;"></view>{{appinfo.store.phone}}
								</button>
							</view>
						</view>

					</view>

					<view class="user-header">
						<view class="my-order">
							<view class="group-hd border-b-e">
								<view class="left"><text class="min-name">{{$nw("我的订单")}}</text></view>
							</view>
							<view class="d-b-c">
								<view class="item" @click="gotoPage('/main/pages/order/myorder/myorder?dataType=all')">
									<view class="icon-box"><span class="icon iconfont icon-quanbudingdan"
											:style="[textColor(true)]"></span></view>
									<text>{{$nw("全部订单")}}</text>
								</view>
								<view class="item"
									@click="gotoPage('/main/pages/order/myorder/myorder?dataType=payment')">
									<view class="icon-box pr">
										<span class="icon iconfont icon-icon" :style="[textColor(true)]"></span>
										<text class="dot d-c-c"
											v-if="orderCount.payment != null && orderCount.payment > 0">{{ orderCount.payment }}</text>
									</view>
									
									<text>{{$nw("待付款")}}</text>
								</view>
								<view class="item"
									@click="gotoPage('/main/pages/order/myorder/myorder?dataType=received')">
									<view class="icon-box pr">
										<span class="icon iconfont icon-daishouhuo" :style="[textColor(true)]"></span>
										<text class="dot d-c-c"
										v-if="orderCount.received != null && orderCount.received > 0">{{ orderCount.received }}</text>
									</view>
									<text>{{$nw("待收货")}}</text>
								</view>
								<view class="item" @click="gotoPage('/main/pages/order/refund/index/index')">
									<view class="icon-box pr">
										<span class="icon iconfont icon-tuikuan" :style="[textColor(true)]"></span>
										<text class="dot d-c-c"
										v-if="orderCount.refund != null && orderCount.refund > 0">{{ orderCount.refund }}</text>
									</view>
									<text>{{$nw("待评价")}}</text>
								</view>
							</view>
						</view>
					</view>

				</view>
			</view>


			<view class="main" style="top: -80rpx;">
				<view class="content">
					<scroll-view class="menus" :style="'height:'+sheight+'rpx'" :scroll-into-view="menuScrollIntoView"
						:scroll-top="categoryScrollTop" scroll-with-animation scroll-y>
						<view class="wrapper">
							<view class="menu" :id="`menu-${item.category_id}`"
								:class="{'current': item.category_id === currentCateId}"
								v-for="(item, index) in listData" :key="index" @tap="handleMenuTap(item.category_id)">
								<image style="height: 70rpx;width: 70rpx;margin-bottom: 10rpx;"
									:src="item.images.file_path">
								</image>
								<text>{{ item.name }}</text>

							</view>
							<view class="" style="height: 200rpx;width: 100%;">

							</view>
						</view>

					</scroll-view>

					<!-- listdata list begin -->
					<scroll-view class="goods" :style="'height:'+sheight+'rpx'" scroll-with-animation scroll-y
						:scroll-top="cateScrollTop" @scroll="handleGoodsScroll">
						<view class="wrapper">
							<view class="list">

								<!-- search -->
								<!-- 	<view class="index-search-box d-b-c" id="searchBox"
									style="position: absolute;right: 2.5%;background: #fff;border: none;">
									<view class="index-search t-c flex-1">
										<span class="icon iconfont icon-sousuo"></span>
										<input type="text" v-model="form.keyWord" class="flex-1 ml10 f30 gray3" value=""
								 		placeholder-class="f24 gray6"
											:placeholder="$nw('输入你要查询的商品')" confirm-type="search"
									 	@click="search" />
									</view>
								</view> -->
								<!-- category begin -->
								<view class="category" v-for="(item, index) in listData" :key="index"
									:id="`cate-${item.category_id}`">
									<view class="title">
										<text>{{ item.name }}</text>
										<!-- <image :src="item.icon" class="icon"></image> -->
									</view>
									<view class="items" :id="`itemss-${item.category_id}`" v-if="item.product.length"
										:style="item.product.length">
										<!-- 商品 begin -->
										<view class="good" v-for="(good, key) in item.product" :key="key"
											v-if="good.detail">

											<image :src="good.detail && good.detail.image && good.detail.image[0] && good.detail.image[0].file_path ? 
										good.detail.image[0].file_path:''" class="image"
												@click="gotoPage('/main/pages/product/detail/detail?product_id='+ good.detail.product_id)">
											</image>
											<view class="right">
												<text class="name"
													@click="gotoPage('/main/pages/product/detail/detail?product_id='+ good.detail.product_id)">{{ good.detail.product_name }}</text>
												<view class="tips"
													@click="gotoPage('/main/pages/product/detail/detail?product_id='+ good.detail.product_id)">
													{{good.detail.selling_point}}
												</view>
												<!-- v-if="store.is_work" -->
												<view class="price_and_action">
													<text class="price">￥{{ good.detail.product_price ||0}}</text>

													<view v-if="good.detail.product_stock >0">
														<view class="btn-group" v-if="good.detail.spec_type == 20">
															<!-- <view type="primary" class="btn property_btn" size="mini"
																@tap="openPopup(item, good)" style="padding: 0rpx; width: 120rpx;height: 60rpx;
															 text-align: center;line-height: 60rpx;border-radius: 10rpx;color: #ffffff !important;"
																:style="[bgcColor]">
																选规格

															</view> -->

															<button type="primary"
																class="pr icon iconfont icon-gouwuche" size="mini"
																hover-class="none" @tap="openPopup(item, good)" style="padding: 0rpx; width: 60rpx;height: 60rpx;
																text-align: center;line-height: 60rpx;border-radius: 20%;" :style="[bgcColor]">

															</button>

															<view @tap="openPopup(item, good)" class="property_btn_num"
																v-if="getGoodsNumber(good.detail.product_id) > 0">
																{{getGoodsNumber(good.detail.product_id)}}
															</view>
														</view>
														<view class="btn-group" v-else>


															<button type="primary"
																class="pr icon iconfont icon-gouwuche" size="mini"
																hover-class="none" @tap="handleAddToCart(item, good, 1)"
																style="padding: 0rpx; width: 60rpx;height: 60rpx;
																text-align: center;line-height: 60rpx;border-radius: 20%;" :style="[bgcColor]">

															</button>
															<view @tap="handleAddToCart(item, good, 1)"
																class="property_btn_num1"
																v-if="getGoodsNumber(good.detail.product_id) > 0">
																{{getGoodsNumber(good.detail.product_id)}}
															</view>

														</view>

													</view>


													<view v-else class="btnsxin" style="padding: 0rpx; width: 160rpx;height: 60rpx;
															 text-align: center;line-height: 60rpx;border-radius: 10rpx;color: #ffffff !important;">
														已售罄
													</view>
												</view>
											</view>
										</view>

										<view class="" v-if="index==listData.length -1"
											style="height: 100rpx;width: 100%;">

										</view>

										<!-- 商品 end -->
									</view>
									<view class="items" v-else :style="item.product.length"
										style="font-size: 26rpx;color: #888;text-align: center">敬请期待~
										
										<view class="" v-if="index==listData.length -1"
											style="height: 100rpx;width: 100%;">
										
										</view>
										</view>
								</view>
								<!-- category end -->
							</view>
						</view>

					</scroll-view>
					<!-- listdata list end -->
				</view>


				

				<!-- 购物车栏 begin -->
				<view class="cart-fixed">
					<!-- &&store.is_work -->
					<view class="cart-box" v-if="cart.length != 0">

						<view class="mark" @tap="openCartPopup">
							<button type="default" plain class="pr icon iconfont icon-gouwuche" size="default"
								hover-class="none" style="color: #fff; padding: 0rpx; width: 60rpx;height: 60rpx;
								text-align: center;line-height: 60rpx;border-radius: 20%;margin-right: 20rpx;" :style="[bgcColor]">

							</button>
							<view class="tag" style="background: #f00808;">{{ getCartGoodsNumber }}</view>
						</view>
						<view class="price">￥{{ getCartGoodsPrice }}</view>

						<button type="primary" class="pay-btn" @tap="toPay" :style="[bgcColor]">
							去结算

						</button>

					</view>
					<!-- <view class="cart-box" v-if="!store.is_work" style="">
					<view>该门店暂不营业~</view>
				</view> -->
				</view>
				<!-- 购物车栏 end -->
				<!-- 购物车详情popup -->
				<u-popup style="z-index: 20;" :show="cartPopupVisible" @close="loginClose" class="cart-popup">
					<view class="card" style="z-index: 20; width: 100%;
				height: 800rpx; background: #fff;position: absolute;left: 0rpx;" :style="{bottom:popup_bottom-10+'px'}">

						<view class="top" style="background: #fff;border-bottom: 3px solid #EEEEEE;">

							<view class="address-bar d-e-c">
								<view class="f30" @click="isEdit = !isEdit">
									<button :style="[textColor2]" style="background: #fff !important;"
										v-if="isEdit">{{$nw("完成")}}</button>
									<button :style="[textColor2]" style="background: #fff !important;"
										v-else>{{$nw("编辑")}}</button>
								</view>
							</view>
						</view>
						<scroll-view class="cart-list" scroll-y style="height: 70%;">

							<view class="section">
								<view class="item" v-for="(item, index) in cart" :key="index">
									<label class="d-c-c" @click="checkItem(item, index)">
										<checkbox value="cb" class="checkbox" :checked="item.checked" />
									</label>
									<image
										@click="gotoPage('/main/pages/product/detail/detail?product_id='+ item.product_id)"
										:src="item.product_image" class="cover" mode="aspectFit"></image>
									<view class="info">
										<view
											@click="gotoPage('/main/pages/product/detail/detail?product_id='+ item.product_id)"
											class="title">{{ item.product_name }}</view>

										<view 
											@click="gotoPage('/main/pages/product/detail/detail?product_id='+ item.product_id)"
											class="describe">
											<!-- {{item.spec_sku_id!=0 && cartPopupVisible?getSpec(item,item.product_sku_id):''}} -->
											{{item.product_sku.product_attr}}
										</view>
										<view class="level-box count_choose">
											<view class="price"
												@click="gotoPage('/main/pages/product/detail/detail?product_id='+ item.product_id)">
												{{$nw("¥")}}
												<text class="num">{{ item.product_price }}</text>
											</view>
											<view class="num-wrap">
												<view class="icon-box minus d-c-c" @click="reduceCart(item)">
													<span class="icon iconfont icon-jian"
														:class="item.total_num <= 1 ? 'gray' : 'gray3'"></span>
												</view>
												<view class="text-wrap"><input type="number"
														:maxlength="item.product_sku.stock_num"
														v-model="item.total_num" />
												</view>
												<view class="icon-box plus d-c-c" @click="addFunc(item)">
													<span class="icon iconfont icon-jia"
														:class="item.total_num >= item.product_sku.stock_num ? 'gray' : 'gray3'"></span>
												</view>
											</view>
										</view>
										<text class="is-user-grade tl"
											v-if="item.is_user_grade === true">{{$nw("会员折扣价")}}</text>
									</view>

								</view>
							</view>


						</scroll-view>


						<view style="  height: 80rpx;position: absolute;bottom: 0rpx;"
							:class="isIphoneX?'bottom-btns f28 isIphoneX':'bottom-btns f28'" v-if="cart.length > 0">
							<label class="d-c-c mr20" @click="onCheckedAll()">
								<checkbox class="checkbox" :checked="checkedAll" value="cb" />
								{{$nw("全选")}}
							</label>

							<view class="d-e-c" v-if="!isEdit">

								<view class="total d-s-c flex-1 mr20">
									<text>{{$nw("合计")}}：</text>
									<view class="price f22">
										{{$nw("¥")}}
										<text class="num f40">{{ getCartGoodsPrice}}</text>
									</view>
								</view>
								<button type="primary" class="buy-btn" :style="[bgcColor]"
									style="height: 80rpx;line-height: 80rpx;"
									@click="toPay()">{{$nw("去结算")}}</button>
							</view>
							<view class="" v-else>
								<button type="primary" :style="[bgcColor]" @click="onDelete()"
									style="height: 80rpx;line-height: 80rpx;"
									class="buy-btn">{{$nw("删除")}}</button>
							</view>
						</view>
					</view>


				</u-popup>



			</view>
		</scroll-view>
		
		<QuickOrder :isPopup_q="isPopup" @addCart="addCarts" :productModel_q="productModel" @close="closePopup"
			type="detail">
		</QuickOrder>

		<!-- 购物车详情popup -->
		<Tabbar :id="`tabbar`" style="z-index: 5000;"></Tabbar>


	</view>
</template>

<script>
	import QuickOrder from '@/components/quickOrder/quickOrder.vue';
	import Tabbar from '@/components/tabbar/tabbar.vue';
	var menus_click = false;
	export default {
		components: {
			QuickOrder,
			Tabbar,
		},
		data() {
			return {

				show_menu: false,
				store: {}, //门店
				loading: true,
				isEdit: false,
				currentCateId: '', //默认分类
				cateScrollTop: 0,
				menuScrollIntoView: '',
				cart: [], //购物车
				goodDetailModalVisible: false, //是否饮品详情模态框
				good: {}, //当前饮品
				category: {}, //当前饮品所在分类
				cartPopupVisible: false,
				sizeCalcState: false,
				/*表单对象*/
				form: {
					detail: {

					},
					show_sku: {
						sku_image: ''
					}
				},
				/*当前商品总库存*/
				stock: 0,
				/*选择提示*/
				selectSpec: '',
				/*是否打开过多规格选择框*/
				isOpenSpec: false,
				isdetails: false,
				type: '',
				// specData:null,  // 当前商品的规格
				show_sku: {
					// sku_image: ''
					sku_image: []
				},
				number: 1,
				lng: '', //当前门店的经度
				lat: '', //当前门店的纬度
				longing: false, //判断用户是否授权
				store_id: '', //当前门店id
				locantion: '', //当前的配送地址
				adv: [],


				/*数据*/
				listData: [],
				sheight: "",
				categoryScrollTop: 10, //分类所在高度
				scrollTop: 0, //顶部变化的高度
				isPopup: false,
				/*子级页面传参*/
				productModel: {},
				menus_click: false,
				specData: [],
				// 是否全选
				checkedAll: false,
				totalPrice: 0,
				isIphoneX: 0,
				popup_bottom: 0, //pop距离底部的距离
				appinfo: uni.getStorageSync("appinfo"),
				orderCount:{}

			}
		},
		props: ["timestamp_chage"],
		watch: {
			'timestamp_chage': {
				handler(n, o) {
					var self = this;
					if (n != o) {
						init(self);
					}
				},
				deep: true,
				immediate: true
			}
		},


		computed: {
			getbutton() {
				var self = this;
				setTimeout(function() {
					var obj = [{
							buttonOne: self.setButton().button[0].buttonOne + " !important",
							buttonOneColor: self.setButton().button[0].buttonOneColor + " !important"
						},
						{
							buttonTwo: self.setButton().button[1].buttonTwo + " !important",
							buttonTwoColor: self.setButton().button[1].buttonTwoColor + " !important"
						},
						{
							buttonThree: self.setButton().button[2].buttonThree + " !important",
							buttonThreeColor: self.setButton().button[2].buttonThreeColor + " !important"
						}
					];
					return obj
				}, 500)

			},
			getCartGoodsNumber() { //计算购物车总1数
				return this.cart.reduce((acc, cur) => acc + cur.total_num, 0)
			},

			getCartGoodsPrice() { //计算购物车总价
				var temp_sumPrice = 0;
				const sumPrice = this.cart.reduce(function(acc, cur) {
					if (cur.checked) {
						temp_sumPrice = acc + cur.total_num * cur.product_price
					}
					return temp_sumPrice;
				}, 0)
				return sumPrice.toFixed(2);
			},
			disabledPay() { //是否达到起送价
				return this.orderType == 'takeout' && (this.getCartGoodsPrice < this.store.min_price) ? true : false
			},
			spread() { //差多少元起送
				if (this.orderType != 'takeout') return
				return parseFloat((this.store.min_price - this.getCartGoodsPrice).toFixed(2))
			},
			active() {
				return Object.assign(this.setBackgroundColor(), this.setColor())
			},
			bgcColor() {
				var obj = {
					backgroundColor: this.setBackgroundColor().backgroundColor + " !important",
					border: this.setBackgroundColor().border + " !important"
				}
				return obj
			},

			textColor() {
				return flag => {
					flag = !!flag
					return this.setColor(flag)
				}
			},
			textColor2() {
				var obj = {
					color: this.setBackgroundColor().backgroundColor + " !important",
					border: '1px solid ' + this.setBackgroundColor().backgroundColor + " !important",
				}
				return obj
			},

		},
		
		methods: {
			makePhone(phone) {
				uni.makePhoneCall({
					phoneNumber: "" + phone
				})
			},
			addCarts() {
				this.getCart()
			},
			getGoodsNumber(product_id) { //计算每个商品存在于购物车的数量
				var temp_num = 0;
				const num = this.cart.reduce(function(acc, cur) {
					if (cur.product_id == product_id) {
						temp_num = acc + cur.total_num
					}
					return temp_num;
				}, 0)
				return num;
			},
			checkItem(e, index) {
				e.checked = !e.checked;
				this.$set(this.cart, index, e);
				// 更新选中记录
				this.onUpdateChecked();
				// 更新购物车已选商品总价格
				this.updateTotalPrice();
				// 更新全选状态
				this.checkedAll = this.getCheckedData().length == this.cart.length;
			},
			getSpec(item, spec_sku_id) {
				var sepc = "";
				console.log("item", item)
				if (item.spec_rel) {
					item.spec_rel.forEach(function(res) {
						if (res.spec_value_id == spec_sku_id) {
							sepc = res.spec_value
						}
					})
					return sepc;
				}

			},

			onDelete() {
				let self = this;
				let cartIds = self.getCheckedIds();
				if (!cartIds.length) {
					self.showError(self.$nw("您还没有选择商品"));
					return false;
				}
				uni.showModal({
					title: self.$nw("提示"),
					content: self.$nw("您确定要移除选择的商品吗"),
					success(e) {
						e.confirm &&
							self._post(
								'order.cart/delete', {
									product_sku_id: cartIds
								},
								function(res) {
									// 删除选中的商品
									self.cartPopupVisible = false
									self.onDeleteEvent(cartIds);
									self.getCart();
								}
							);
					}
				});
			},
			/**
			 * 获取选中的商品
			 */
			getCheckedData() {
				let checkedData = uni.getStorageSync('checkedData');
				return checkedData ? checkedData : [];
			},
			/*全选*/
			onCheckedAll() {
				let self = this;
				self.checkedAll = !self.checkedAll;
				self.cart.forEach(item => {
					item.checked = self.checkedAll;
				});
				// 更新选中记录
				this.onUpdateChecked();
				// 更新购物车已选商品总价格
				this.updateTotalPrice();

			},
			onDeleteEvent(cartIds) {
				let self = this;
				cartIds.forEach(cartIndex => {
					self.cart.forEach((item, productIndex) => {
						if (cartIndex == `${item.product_id}_${item.product_sku_id}`) {
							self.cart.splice(productIndex, 1);
						}
					});
				});
				// 更新选中记录
				self.onUpdateChecked();
				return true;
			},
			/**
			 * 更新商品选中记录
			 */
			onUpdateChecked() {
				let self = this,
					checkedData = [];
				self.cart.forEach(item => {
					if (item.checked == true) {
						checkedData.push(`${item.product_id}_${item.product_sku_id}`);
					}
				});
				uni.setStorageSync('checkedData', checkedData);

			},
			/*全选*/
			onCheckedAll() {
				let self = this;
				self.checkedAll = !self.checkedAll;
				for (var i = 0; i < self.cart.length; i++) {
					let item = self.cart[i];
					item.checked = self.checkedAll;
					self.$set(self.cart, i, item);
				}
				// 更新选中记录
				self.onUpdateChecked();
			},
			updateTotalPrice: function() {
				var self = this;
				var temp_sumPrice = 0;
				const sumPrice = self.cart.reduce(function(acc, cur) {
					if (cur.checked) {

						temp_sumPrice = acc + cur.total_num * cur.product_price
					}
					return temp_sumPrice;
				}, 0)
				self.totalPrice = sumPrice.toFixed(2);
			},
			loginClose() {
				this.cartPopupVisible = false
			},
			/*关闭弹窗*/
			closePopup() {
				let self = this;
				self.isPopup = false;
			},
			/*多规格商品*/
			initSpecData(self, data) {
				for (let i in data.spec_attr) {
					for (let j in data.spec_attr[i].spec_items) {
						data.spec_attr[i].spec_items[j].checked = false;
					}
				}
				self.specData = data;
			},
			/*打开选择规格界面*/
			openPopup(e, product) {
				let self = this;
				if(!uni.getStorageSync("user_id")){
					self.login("pass_login", [0])
					return;
				}
				
				console.log(product.detail.spec_type)
				if (product.specData && product.detail.spec_type == 20) {
					self.initSpecData(self, product.specData);
				} else {
					self.specData = null;
				}
				let obj = {
					specData: self.specData,
					detail: product.detail,
					productSpecArr: self.specData != null ? new Array(self.specData.spec_attr.length) : [],
					show_sku: {
						sku_image: '',
						seckill_price: 0,
						product_sku_id: 0,
						line_price: 0,
						seckill_stock: 0,
						seckill_product_sku_id: 0,
						sum: 1
					},
					type: "card",
					isshow: false
				};
				console.log("obj", obj)
				self.productModel = obj;
				self.isPopup = true;

			},
			getCategory() {
				let _this = this;
				uni.showLoading({
					title: _this.$nw("加载中")
				});
				if (uni.getStorageSync("user_id")) {
					_this._get('product.category/getCategoryProduct', {}, function(res) {
						_this.listData = res.data.list;
						_this.background = res.data.background;
						_this.orderCount = res.data.orderCount
						uni.hideLoading();
					});
				} else {
					_this._get('product.category/getCategoryProductNotLogin', {}, function(res) {
						_this.listData = res.data.list;
						_this.background = res.data.background;
						_this.orderCount = {
							payment:0,
							received:0,
							refund:0
						}
						uni.hideLoading();
					});

				}

			},
			getCart() {

				let self = this;
				self._get('order.cart/lists', {}, function(res) {
					uni.hideLoading();

					if (res.data) {
						self.cart = res.data;
						self.cart.forEach(function(item) {
							item.checked = true;
						})
						self.loadding = false;

					} else {
						self.loadding = false;
					}

				});
			},
			initShowSku(self, good) {
				var show_sku = {
					product_price: good.detail.product_price,
					product_sku_id: 0,
					line_price: good.detail.line_price,
					stock_num: good.detail.product_stock,
					sum: 1,
				}
				self.stock = good.detail.product_stock;
				good.show_sku = show_sku;
				return good;
			},

			// 切换门店
			selShop(type) {
				if (type == 0) {
					uni.navigateTo({
						url: '/pages/selectshop/selectshop'
					})
				} else {
					uni.navigateTo({
						url: '/pages/user/address/address?is_choose=true'
					})
				}
			},
			handleMenuTap(id) { //点击菜单项事件
				var self = this;
				setTimeout(function() {
					menus_click = false;
				}, 500)
				menus_click = true;
				if (!this.sizeCalcState) {
					this.calcSize()
				}

				this.currentCateId = id
				this.$nextTick(() => this.cateScrollTop = this.listData.find(item => item.category_id == id).top)

			},
			handleGoodsScroll({
				detail
			}) { //商品列表滚动事件
				var self = this;
				if (menus_click) {
					return false;
				}

				if (!this.sizeCalcState) {
					this.calcSize()
				}
				const {
					scrollTop
				} = detail
				self.scrollTop = scrollTop;
				let tabs = this.listData.filter(item => item.top <= scrollTop).reverse()
				if (tabs.length > 0) {
					if (self.currentCateId != tabs[0].category_id) {
						var index = self.getArraysIndex(self.listData, tabs[0].category_id);
						let view = uni.createSelectorQuery().in(self).select(`#menu-${tabs[0].category_id}`)
						view.fields({
							size: true
						}, data => {
							self.categoryScrollTop = index * data.height
						}).exec()


					}
					self.currentCateId = tabs[0].category_id
				}
			},
			calcSize() {
				let h = 10
				this.listData.forEach(item => {
					let view = uni.createSelectorQuery().in(this).select(`#cate-${item.category_id}`)
					view.fields({
						size: true
					}, data => {
						item.top = h
						h += data.height
						item.bottom = h
					}).exec()
				})
				this.sizeCalcState = true
			},

			handleAddToCart(cate, good, num) { //添加到购物车
				if (uni.getStorageSync("user_id")) {
					this.addCart(good)
					return;
				}
				this.login("pass_login", [0])
			},
			/*加入购物车*/
			addCart(good) {
				var self = this
				good = self.initShowSku(self, good);


				if (good.specData != null) {
					for (let i = 0; i < good.productSpecArr.length; i++) {
						if (good.productSpecArr[i] == null) {
							uni.showToast({
								title: self.$nw("请选择规格"),
								icon: 'none',
								duration: 2000
							});
							return;
						}
					}
				}
				if (good.detail.buy_limit > 0) {
					if (good.show_sku.sum > self.good.detail.buy_limit) {
						uni.showToast({
							title: self.$nw("数量超过了限购数量"),
							icon: 'none',
							duration: 2000
						});
						return false;
					}
				}

				// 判断每月限购数量合规
				if (good.detail.buy_auth.monthLimit > 0 && good.detail.buy_auth.maxMonthProductNum > 0) {
					if (good.show_sku.sum > good.detail.buy_auth.maxMonthProductNum) {
						uni.showToast({
							title: self.$nw("数量超过了限购数量"),
							icon: 'none',
							duration: 2000
						})
						return false
					}
				}

				let product_id = good.detail.product_id;
				let total_num = good.show_sku.sum;
				let product_sku_id = good.show_sku.product_sku_id;
				var shopp_cart_is_open = uni.getStorageSync("appinfo").shopp_cart_is_open
				if (shopp_cart_is_open) {
					if (shopp_cart_is_open == -1) {
						uni.showToast({
							title: self.$nw("购物车已关闭.购物车已关闭"),
							icon: "none"
						})
						return;
					}
				}
				if (good.detail.spec_type == 20 && product_sku_id == 0) {
					uni.showToast({
						title: self.$nw("请选择属性"),
						icon: 'none',
						duration: 2000
					});
					return false;
				}

				self._post('order.cart/add', {
					product_id: product_id,
					total_num: total_num,
					product_sku_id: product_sku_id,
				}, function(res) {
					self.getCart();
					uni.showToast({
						title: res.msg,
						duration: 2000
					});
					// self.closePopup();
				});

			},
			/*添加*/
			addFunc(item) {
				let self = this;
				let product_id = item.product_id;
				let product_sku_id = item.product_sku_id;
				var shopp_cart_is_open = uni.getStorageSync("appinfo").shopp_cart_is_open
				if (shopp_cart_is_open) {
					if (shopp_cart_is_open == -1) {
						uni.showToast({
							title: this.$nw("购物车已关闭.购物车已关闭"),
							icon: "none"
						})
						return;
					}
				}
				uni.showLoading({
					title: this.$nw("加载中"),
				});
				self._post(
					'order.cart/add', {
						product_id: product_id,
						product_sku_id: product_sku_id,
						total_num: 1
					},
					function(res) {
						self.loadding = false;
						self.getCart();
					},
					function() {
						self.loadding = false;
					}
				);
			},
			reduceCart(item) {
				let self = this;
				let product_id = item.product_id;
				let product_sku_id = item.product_sku_id;

				uni.showLoading({
					title: this.$nw("加载中"),
				});
				self._post(
					'order.cart/sub', {
						product_id: product_id,
						product_sku_id: product_sku_id,
					},
					function(res) {
						self.loadding = false;
						self.getCart();
					},
					function() {
						self.loadding = false;
					}
				);

			},

			handlePropertyAdd() {
				if (this.good.detail.number >= this.show_sku.stock_num) {
					uni.showToast({
						title: '数量超过了库存',
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				this.good.detail.number += 1
			},
			handlePropertyReduce() {
				if (this.good.detail.number === 1) return
				this.good.detail.number -= 1
			},

			openCartPopup() { //打开/关闭购物车列表popup
				this.cartPopupVisible = !this.cartPopupVisible
			},
			/**
			 * 获取已选中的商品
			 */
			getCheckedIds() {
				let self = this;
				let arrIds = [];
				let store_id = uni.getStorageSync('store_id')
				self.cart.forEach(item => {
					arrIds.push(`${item.product_id}_${item.product_sku_id}`);
				});
				return arrIds;
			},

			toPay() {
				let arrIds = this.getCheckedIds();
				var shopp_cart_is_open = uni.getStorageSync("appinfo").shopp_cart_is_open
				if (shopp_cart_is_open) {
					if (shopp_cart_is_open == -1) {
						uni.showToast({
							title: this.$nw("购物车已关闭.购物车已关闭"),
							icon: "none"
						})
						return;
					}
				}

				if (arrIds.length == 0) {
					uni.showToast({
						title: this.$nw("请选择商品"),
						icon: 'none'
					});
					return false;
				}
				uni.navigateTo({
					url: '/main/pages/order/confirm-order/confirm-order?order_type=cart&cart_ids=' + arrIds
				});
			},
			search() {
				uni.navigateTo({
					url: "/main/pages/product/search/search"
				})
			},
			
		}
	};


	function init(self) {
		uni.showLoading({
			title: this.$nw("加载中"),
			icon: "none"
		})
		self.getCategory();
		self.getCart();

		uni.getSystemInfo({
			success(res) {
				setTimeout(function() {
					let view = uni.createSelectorQuery().in(self).select(`#qb`)
					view.fields({
						size: true
					}, data => {
						// #ifdef MP-WEIXIN
						self.sheight = ((res.windowHeight - (data.height)) * 2) + 80
						// #endif
						// #ifndef MP-WEIXIN
						self.sheight = ((res.windowHeight - (data.height)) * 2) + 30
						// #endif


					}).exec()

					let view_tabbar = uni.createSelectorQuery().in(self).select(`#tabbar`)
					view_tabbar.fields({
						size: true
					}, data => {
						self.popup_bottom = data.height
					}).exec()

				}, 500)
			}
		})



		if (uni.getStorageSync('isIphoneX')) {
			self.isIphoneX = uni.getStorageSync('isIphoneX');
		}

		self.isEdit = false;
	}
</script>

<style lang="scss" scoped>
	@import '@/components/quickOrder/menu.scss';

	.qby0 {
		width: 100%;

		margin: auto;

		.qby {

			width: 100%;

			margin: auto;
			display: flex;
			padding-top: 10rpx;
			padding-bottom: 150rpx;

			.qby_1 {
				flex: 1;

				.qby_image {
					width: 130rpx;
					height: 130rpx;
					border-radius: 50%;
					text-align: center;
					margin-top: 22rpx;
				}

			}

			.qby_2 {
				flex: 9;
				height: 170rpx;

				.qby_2_1 {
					font-size: 36rpx;
					margin-top: 30rpx;
					font-weight: 600;
				}

				.qby_2_2 {
					font-size: 30rpx;

				}
			}


		}
	}



	button {
		background-color: #1C428D !important
	}

	.newbox {
		width: 100%;
		height: 100%;
	}

	.newbox image {
		width: 100%;
		height: 100%;
	}

	.store-name>image {
		width: 30rpx;
		height: 30rpx;
		margin-left: 10rpx;
		margin-top: 5rpx;
	}

	.store-location>image {
		width: 30rpx;
		height: 30rpx;
	}

	.font-weight-bold>text {
		font-size: 30rpx;
		color: #333;
	}

	.font-weight-bold>image {
		width: 30rpx;
		height: 30rpx;
		margin-left: 5rpx;
		margin-top: 3rpx;
	}

	// 已售馨
	.btnsxin {
		padding: 0 20rpx;
		box-sizing: border-box;
		font-size: 24rpx;
		height: 44rpx;
		line-height: 44rpx;
		border-radius: 24rpx;
		background-color: #dcdcdc !important;
		color: white;
	}

	// .cart-box {
	// 		bottom: clac(98rpx + constant(safe-area-inset-bottom));
	// 		bottom: clac(98rpx + safe-area-inset-bottom);
	// }

	.cart-fixed {
		position: fixed;
		bottom: 140rpx;
		left: 30rpx;
		right: 30rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);

	}

	.good .card {
		padding-bottom: 100rpx;
	}

	.card .checkbox {
		transform: scale(0.7)
	}

	.address-bar {
		padding: 20rpx;
	}

	.address-bar button {
		border: 1rpx solid $dominant-color;
		background: #FFFFFF;
		color: $dominant-color;
	}

	.section {
		background: #FFFFFF;
	}

	.section .item {
		padding: 20rpx;
		display: flex;
		border-bottom: 1px solid #EEEEEE;
	}

	.section .cover {
		width: 200rpx;
		height: 200rpx;
	}

	.section .info {
		flex: 1;
		padding-left: 20rpx;
		box-sizing: border-box;
		overflow: hidden;
	}

	.section .title {
		font-size: 34rpx;
	}

	.section .title,
	.vender .list .describe {
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.section .describe {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #999999;
	}

	.section .price {
		color: $dominant-color;
		font-size: 24rpx;
	}

	.section .price .num {
		padding: 0 4rpx;
		font-size: 40rpx;
	}

	.section .level-box {
		margin-top: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.section .level-box .key {
		font-size: 24rpx;
		color: #999999;
	}

	.section .level-box .num-wrap {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.section .level-box .icon-box {
		width: 60rpx;
		height: 60rpx;
		border: 1px solid #DDDDDD;
		background: #f7f7f7;
	}

	.section .level-box .icon-box .gray {
		color: #CCCCCC;
	}

	.section .level-box .icon-box .gray3 {
		color: #333333;
	}

	.section .level-box .text-wrap {
		margin: 0 4rpx;
		height: 60rpx;
		border: 1px solid #DDDDDD;
		background: #f7f7f7;
	}

	.section .level-box .text-wrap input {
		padding: 0 10rpx;
		height: 60rpx;
		line-height: 60rpx;
		width: 80rpx;
		font-size: 24rpx;
		text-align: center;
	}

	.bottom-btns {
		position: fixed;
		padding: 0 0 0 20rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 90rpx;
		right: 0;
		bottom: 110rpx;
		left: 0;
		// box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, .1);
		border-top: 1rpx solid #EEEEEE;
		background: #FFFFFF;
		z-index: 99;
	}

	.isIphoneX {
		bottom: 140rpx;
	}

	.bottom-btns .delete-btn {
		margin: 0;
		padding: 0 30rpx;
		height: 70rpx;
		line-height: 70rpx;
		border-radius: 35rpx;
		background: $dominant-color;
		font-size: 30rpx;
	}

	.bottom-btns .buy-btn {
		margin: 0;
		padding: 0 60rpx;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 0;
		background: $dominant-color;
		font-size: 30rpx;
	}

	.bottom-btns .price {
		color: $dominant-color;
	}

	.is-user-grade {
		padding: 0 10rpx;
		border-radius: 30rpx;
		background: $dominant-color;
		color: #ffffff;
		font-size: 15rpx;
	}

	/* 订单 */

	.user-header {
		position: relative;
		// background: #e2231a;
		top: -120rpx;
		width: 90%;
		margin: auto;


	}

	.user-header .user-header-inner {
		// position: relative;
		padding: 30rpx 30rpx 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
	}

	.user-header .user-header-inner::after,
	.user-header .user-header-inner::before {
		display: block;
		content: '';
		// position: absolute;
		border-radius: 50%;
		z-index: 0;
	}






	.user-header .info {
		padding-left: 20rpx;
		box-sizing: border-box;
		overflow: hidden;
		color: #ffffff;
	}

	.user-header .info .name {
		font-weight: bold;
		font-size: 30rpx;
	}

	.user-header .info .tel {
		font-size: 26rpx;
	}

	.user-header .info .grade {
		display: block;
		padding: 0 16rpx;
		height: 40rpx;
		line-height: 36rpx;
		border-radius: 20rpx;
		background: rgba(0, 0, 0, 0.2);
		color: #ffc670;
	}

	.user-header .sign-box {
		position: absolute;
		right: 20rpx;
		padding: 0 10rpx;
		height: 50rpx;
		border: 1px solid #ffe300;
		border-radius: 25rpx;
		font-size: 24rpx;
		color: #ffe300;
		z-index: 10;
	}

	.user-header .sign-box .iconfont {
		color: #ffe300;
	}

	.user-header .my-order {
		// position: absolute;
		padding: 0 30rpx;
		right: 30rpx;
		// bottom: -150rpx;
		left: 30rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		box-shadow: 0 0 6rpx 0 rgba(0, 0, 0, 0.1);
		background: #ffffff;
		z-index: 10;
	}

	.my-order .item {
		display: flex;
		padding: 20rpx 0;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
	}

	.my-order .icon-box,
	.my-assets .icon-box {
		width: 60rpx;
		height: 60rpx;
	}

	.my-order .icon-box .iconfont,
	.my-assets .icon-box .iconfont {
		font-size: 50rpx;
		color: #333333;
	}

	.my-order .icon-box .dot {
		position: absolute;
		top: 0;
		left: 30rpx;
		height: 30rpx;
		min-width: 30rpx;
		padding: 4rpx;
		border-radius: 20rpx;
		font-size: 20rpx;
		background: #f00808;
		color: #ffffff;
	}

	.property_btn_num {
		background: #f00808;
		color: $text-color-white;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: $font-size-sm;
		position: absolute;
		right: -12rpx;
		top: -20rpx;
		border-radius: 100%;
		padding: 4rpx;
		width: 40rpx;
		height: 40rpx;
		opacity: .9;
	}

	.property_btn_num1 {
		background: #f00808;
		color: $text-color-white;
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: $font-size-sm;
		position: absolute;
		right: -12rpx;
		top: -20rpx;
		border-radius: 100%;
		padding: 4rpx;
		width: 40rpx;
		height: 40rpx;
		opacity: .9;
	}
</style>
