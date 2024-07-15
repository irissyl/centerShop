<template>
	<view :class="Visible?'product-popup open':'product-popup close'" @touchmove.stop.prevent="" @click="closePopup">
		<view class="popup-bg"></view>
		<view class="main" v-on:click.stop>
			<view class="header">
				<image :src="form.show_sku.sku_image" mode="aspectFit" class="avt"></image>
				<view class="price">
					{{$nw("¥")}}
					<text class="num">{{form.show_sku.product_price}}</text>
					<text class="old-price"
						v-if="form.show_sku.line_price!=null && form.show_sku.line_price > 0">{{$nw("¥")}}{{form.show_sku.line_price}}</text>
				</view>
				<view class="stock" v-if="form.isshow">
					{{$nw("库存")}}：{{form.show_sku.stock_num}}
				</view>
				<view class="close-btn" @click="closePopup">
					<text class="icon iconfont icon-guanbi"></text>
				</view>
			</view>

			<view class="body">
				<scroll-view scroll-y="true" class="body-scroll">
					<!--选择数量-->
					<view class="level-box count_choose">
						<text class="key">{{$nw("数量")}}</text>
						<view class="d-s-c">
							<view class="icon-box minus d-c-c" @click="sub()" :class="{'num-wrap':!issub}">
								<text class="icon iconfont icon-jian"></text>
							</view>
							<view class="text-wrap">
								<input type="number" v-model="form.show_sku.sum" value="" />
							</view>
							<view class="icon-box plus d-c-c" :class="{'num-wrap':!isadd}" @click="add()">
								<text class="icon iconfont icon-jia"></text>
							</view>
						</view>
					</view>

					<!--规格-->
					<view v-if="form.specData !=null">
						<view class="specs mt20" v-for="(item_attr,attr_index) in form.specData.spec_attr"
							:key="attr_index">
							<view class="specs-hd p-20-0">
								<text class="f24 gray9">{{item_attr.group_name}}</text>
								<text class="ml10 red" v-if="form.productSpecArr[attr_index]==null">
									{{$nw("请选择")}}{{item_attr.group_name}}
								</text>
							</view>
							<view class="specs-list">
								<button type="primary" :class="item.checked ? 'btn-red' : 'btn-gray-border'"
									v-for="(item,item_index) in item_attr.spec_items" :key="item_index"
									@click="selectAttr(attr_index, item_index)">{{item.spec_value}}
								</button>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<view class="btns" style="position: relative;">
				<button type="primary" class="confirm-btn">{{$nw("确认")}}</button>

				<button class="confirm-btn"
					style="width: 100%;height: 100%; position: absolute;top:0rpx;left: 0rpx;opacity: 0;"
					open-type="getUserInfo" @click="confirmFunc" lang="zh_CN"></button>



			</view>
		</view>

		<Autho :loginShow="loginShow" @change_loginShow="change_loginShow"></Autho>
	</view>
</template>

<script>
	import Autho from '@/components/autho/autho.vue';
	export default {
		components: {
			Autho
		},
		data() {
			return {
				/*是否可见*/
				Visible: false,
				/*表单对象*/
				form: {
					detail: {

					},
					show_sku: {
						sku_image: ''
					},
					isshow: 1
				},
				/*当前商品总库存*/
				stock: 0,
				loginShow: false,


			}

		},
		props: ['isPopup', 'productModel'],
		onLoad() {

		},
		mounted() {

		},
		computed: {

			/*判断增加数量*/
			isadd: function() {
				return this.form.show_sku.sum >= this.stock || this.form.show_sku.sum >= this.form.detail.limit_num;
			},

			/*判断减少数量*/
			issub: function() {
				return this.form.show_sku.sum <= 1;
			}
		},
		watch: {
			'isPopup': function(n, o) {
				if (n != o) {
					this.Visible = n;
					this.form = this.productModel;
					this.initShowSku();
				}
			}
		},
		methods: {
			change_loginShow(e) {
				console.log("走了吗", e)
				this.loginShow = e
			},
			/*初始化*/
			initShowSku() {
				let img_cover = '';
				if (this.form.detail.image.length > 0) {
					img_cover = this.form.detail.image ? this.form.detail.image[0].file_path : ''
				} else {
					if (this.form.detail.default_image.length > 0) {
						if (this.form.detail.default_image[0].file_path) {
							img_cover = this.form.detail.default_image[0].file_path
						}
					}
				}

				this.form.show_sku.sku_image = img_cover;
				this.form.show_sku.product_price = this.form.detail.product_price;
				this.form.show_sku.product_sku_id = 0;
				this.form.show_sku.line_price = this.form.detail.line_price;
				this.form.show_sku.stock_num = this.form.detail.product_stock;
				this.form.show_sku.sum = 1;
				this.stock = this.form.detail.product_stock;
			},

			/*选择属性*/
			selectAttr(attr_index, item_index) {
				let self = this;
				let items = self.form.specData.spec_attr[attr_index].spec_items;
				let curItem = items[item_index];
				if (curItem.checked) {
					curItem.checked = false;
					self.form.productSpecArr[attr_index] = null;
				} else {
					for (let i = 0; i < items.length; i++) {
						items[i].checked = false;
					}
					curItem.checked = true;
					self.form.productSpecArr[attr_index] = curItem.item_id;
				}

				for (let i = 0; i < self.form.productSpecArr.length; i++) {
					if (self.form.productSpecArr[i] == null) {
						self.initShowSku();
						return;
					}
				}

				// 更新商品规格信息
				self.updateSpecProduct();
			},


			/*更新商品规格信息*/
			updateSpecProduct() {
				let self = this;
				let specSkuId = self.form.productSpecArr.join('_');
				// 查找skuItem
				let spec_list = self.form.specData.spec_list,
					skuItem = spec_list.find((val) => {
						return val.spec_sku_id == specSkuId;
					});
				// 记录product_sku_id
				// 更新商品价格、划线价、库存
				if (typeof skuItem === 'object') {
					self.stock = skuItem.spec_form.stock_num;
					if (self.form.show_sku.sum > self.stock) {
						self.form.show_sku.sum = self.stock > 0 ? self.stock : 1;
					}
					self.form.show_sku.product_sku_id = specSkuId;
					self.form.show_sku.product_price = skuItem.spec_form.product_price;
					self.form.show_sku.line_price = skuItem.spec_form.line_price;
					self.form.show_sku.stock_num = skuItem.spec_form.stock_num;
					if (skuItem.spec_form.image_id > 0) {
						self.form.show_sku.sku_image = skuItem.spec_form.image_path;
					} else {
						self.form.show_sku.sku_image = self.form.detail.image.length > 0 ? self.form.detail.image[0]
							.file_path : '';
					}
				}
			},

			/*关闭弹窗*/
			closePopup() {
				this.$emit('close', {})
			},

			/*确认提交*/
			confirmFunc() {
				let self = this;
				if (this.form.specData != null) {
					for (let i = 0; i < this.form.productSpecArr.length; i++) {
						if (this.form.productSpecArr[i] == null) {
							uni.showToast({
								title: this.$nw("请选择规格"),
								icon: 'none',
								duration: 2000
							});
							return;
						}
					}
				}

				if (this.form.detail.buy_limit > 0) {
					if (this.form.show_sku.sum > this.form.detail.buy_limit) {
						uni.showToast({
							title: this.$nw("数量超过了限购数量"),
							icon: 'none',
							duration: 2000
						});
						return false;
					}
				}

				// 判断每月限购数量合规
				if (this.form.detail.buy_auth.monthLimit > 0 && this.form.detail.buy_auth.maxMonthProductNum > 0) {
					if (this.form.show_sku.sum > this.form.detail.buy_auth.maxMonthProductNum) {
						uni.showToast({
							title: this.$nw("数量超过了限购数量"),
							icon: 'none',
							duration: 2000
						})
						return false
					}
				}

				// #ifdef MP-WEIXIN 
				if (self.form.type == 'card') {
					if (uni.getStorageSync("user_id")) {
						self.addCart();
					} else {
						// 根据不同的情况跳转到不同的页面
						self.login("pass_login", [0])
						return;
					}

				} else {
					self.createdOrder();
				}
				// #endif
				// #ifdef H5
				if (this.form.type == 'card') {
					if (uni.getStorageSync("user_id")) {
						this.addCart();
					} else {
						// 根据不同的情况跳转到不同的页面
						self.login("pass_login", [0])
						return;
					}
				} else {
					this.createdOrder();
				}
				// #endif
				// #ifdef APP-PLUS
				this.createdOrder();
				// #endif




			},

			/*加入购物车*/
			addCart() {
				let self = this;
				let product_id = self.form.detail.product_id;
				let total_num = self.form.show_sku.sum;
				let product_sku_id = self.form.show_sku.product_sku_id;
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
				if (self.form.detail.spec_type == 20 && product_sku_id == 0) {
					uni.showToast({
						title: this.$nw("请选择属性"),
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
					uni.showToast({
						title: res.msg,
						duration: 2000
					});
					self.closePopup();
				});
			},

			/*创建订单*/
			createdOrder() {
				let product_id = this.form.detail.product_id;
				let product_num = this.form.show_sku.sum;
				let product_sku_id = this.form.show_sku.product_sku_id;
				uni.navigateTo({
					url: '/main/pages/order/confirm-order/confirm-order?product_id=' + product_id +
						'&product_num=' + product_num +
						'&product_sku_id=' + product_sku_id + '&order_type=buy'
				});



			},

			/*商品增加*/
			add() {
				if (this.stock <= 0) {
					return;
				}
				if (this.form.show_sku.sum >= this.stock) {
					uni.showToast({
						title: this.$nw("数量超过了库存"),
						icon: 'none',
						duration: 2000
					});
					return false;
				}

				if (this.form.detail.buy_limit > 0) {
					if (this.form.show_sku.sum >= this.form.detail.buy_limit) {
						uni.showToast({
							title: this.$nw("数量超过了限购数量"),
							icon: 'none',
							duration: 2000
						});
						return false;
					}
				}

				if (this.form.show_sku.sum >= this.form.detail.limit_num) {
					uni.showToast({
						title: this.$nw("数量超过了限购数量"),
						icon: 'none',
						duration: 2000
					});
					return false;
				}

				// 判断每月限购数量合规
				if (this.form.detail.buy_auth.monthLimit > 0 && this.form.detail.buy_auth.maxMonthProductNum > 0) {
					if (this.form.show_sku.sum >= this.form.detail.buy_auth.maxMonthProductNum) {
						uni.showToast({
							title: this.$nw("数量超过了月限购数量"),
							icon: 'none',
							duration: 2000
						})
						return false
					}
				}

				this.form.show_sku.sum++;
			},

			/*商品减少*/
			sub() {
				if (this.stock <= 0) {
					return;
				}
				if (this.form.show_sku.sum < 2) {
					uni.showToast({
						title: this.$nw("商品数量至少为1"),
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				this.form.show_sku.sum--;
			}

		}
	}
</script>

<style lang="scss" scoped>
	.product-popup {}

	.product-popup .popup-bg {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, .6);
		z-index: 99;
	}

	.container {
		min-height: 40vw;
		max-height: 120vw;
		overflow: scroll;
		margin-bottom: 50rpx;
	}


	.product-popup .main {
		// position: fixed;
		// width: 100%;
		// bottom: 0;
		// min-height: 200rpx;
		// max-height: 900rpx;
		// background-color: #fff;
		// transform: translate3d(0, 980rpx, 0);
		// transition: transform .2s cubic-bezier(0, 0, .25, 1);
		// bottom: env(safe-area-inset-bottom);
		// z-index: 99;
		position: fixed;
		width: 100%;
		bottom: 0;
		min-height: 200rpx;
		max-height: 91vh;
		// height: 900rpx;
		background-color: #fff;
		transform: translate3d(0, 100vh, 0);
		transition: transform .2s cubic-bezier(0, 0, .25, 1);
		// bottom: env(safe-area-inset-bottom);
		bottom: calc(env(safe-area-inset-bottom) / 10);
		z-index: 99;

	}

	.product-popup.open .main {
		transform: translate3d(0, 0, 0);
	}

	.product-popup.close .popup-bg {
		display: none;
	}

	.product-popup .header {
		height: 120rpx;
		padding: 10rpx 0 10rpx 250rpx;
		position: relative;
		border-bottom: 1px solid #EEEEEE;
	}

	.product-popup .header .avt {
		position: absolute;
		top: -80rpx;
		left: 30rpx;
		width: 200rpx;
		height: 200rpx;
		border: 2px solid #FFFFFF;
		background: #FFFFFF;
	}

	.product-popup .header .stock {
		font-size: 24rpx;
		color: #999999;
	}

	.product-popup .close-btn {
		position: absolute;
		width: 40rpx;
		height: 40rpx;
		top: 10rpx;
		right: 10rpx;
	}

	.product-popup .price {
		color: $dominant-color;
		font-size: 30rpx;
	}

	.product-popup .price .num {
		padding: 0 4rpx;
		font-size: 50rpx;
	}

	.product-popup .old-price {
		margin-left: 10rpx;
		font-size: 30rpx;
		color: #999999;
		text-decoration: line-through;
	}

	.product-popup .body {
		padding: 20rpx 30rpx;
		// max-height: 600rpx;
		height: 600rpx;
		// border: #007AFF 1px solid;
		overflow-y: auto;

		.body-scroll {
			height: 100%;
		}
	}

	.product-popup .level-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.product-popup .level-box .key {
		font-size: 24rpx;
		color: #999999;
	}

	.product-popup .level-box .icon-box {
		width: 60rpx;
		height: 60rpx;
		border: 1px solid #DDDDDD;
		background: #f7f7f7;
	}

	.product-popup .num-wrap .iconfont {
		color: #666;
	}

	.product-popup .num-wrap.no-stock .iconfont {
		color: #CCCCCC;
	}

	.product-popup .level-box .text-wrap {
		margin: 0 4rpx;
		height: 60rpx;
		border: 1px solid #DDDDDD;
		background: #f7f7f7;
	}

	.product-popup .level-box .text-wrap input {
		padding: 0 10rpx;
		height: 60rpx;
		line-height: 60rpx;
		width: 80rpx;
		text-align: center;
	}

	.specs .specs-list {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	}

	.specs .specs-list button {
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		font-size: 24rpx;
	}

	.specs .specs-list button:after,
	.product-popup .btns button,
	.product-popup .btns button:after {
		height: 88rpx;
		line-height: 88rpx;
		border: 0;
		border-radius: 0;
	}

	.product-popup .btns .confirm-btn {
		background: $dominant-color;
	}
</style>