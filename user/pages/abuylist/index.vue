<template>
	<view class="card" v-if="!loadding">
		<!--产品列表-->
		<template v-if="tableData.length > 0">
	
			<view class="section">
				<view class="item"  v-for="(item, index) in tableData" :key="index">
					<label class="d-c-c" @click="checkItem(item, index)">
						<checkbox value="cb" class="checkbox" :checked="item.checked" />
					</label>
					<image :src="item.product_image" class="cover" mode="aspectFit"></image>
					<view class="info"
						>
						<view class="title" @click="gotoPage('/main/pages/product/detail/detail?product_id='+ item.product_id)">{{ item.product_name }}</view>
						<!-- <view class="" v-if="item.selling_point">
							{{ item.selling_point }}
						</view> -->
						<view class="describe" 
						@click="gotoPage('/main/pages/product/detail/detail?product_id='+ item.product_id)">
							{{item.product_sku.product_attr}}
						</view>
						<view class="describe"
						@click="gotoPage('/main/pages/product/detail/detail?product_id='+ item.product_id)">
							已购买次数：{{item.buy_nums}}
						</view>
						<view class="level-box count_choose">
							
							<view class="price" @click="gotoPage('/main/pages/product/detail/detail?product_id='+ item.product_id)">
								{{$nw("¥")}}
								<text class="num">{{ item.product_price }}</text>
							</view>
							<view class="num-wrap">
								
								<view >
									x{{item.total_num}}</view>
								
							</view>
						</view>
						<text class="is-user-grade tl"
							v-if="item.is_user_grade === true">{{$nw("会员折扣价")}}</text>
					</view>
				</view>
				
			</view>
		</template>
		<template v-else>
			<view class="none-data-box">
				<image src="http://imgh5.y01.cn/20210606225550dd5f35541.png" mode="widthFix"></image>
				<text>{{$nw("空空如也")}}</text>
				<button type="default" class="btn-red mt30 ww100" :style="[active]"
					@click="gotoShop">{{$nw("去购物")}}</button>
			</view>
		</template>

		<!--底部按钮-->
		<view :class="isIphoneX?'bottom-btns f28 isIphoneX':'bottom-btns f28'" v-if="tableData.length > 0">
			<label class="d-c-c mr20" @click="onCheckedAll()">
				<checkbox class="checkbox" :checked="checkedAll" value="cb" />
				{{$nw("全选")}}
			</label>
			<view class="d-e-c" v-if="!isEdit">
				<view class="total d-s-c flex-1 mr20">
					<text>{{$nw("合计")}}：</text>
					<view class="price f22">
						{{$nw("¥")}}
						<text class="num f40">{{ totalPrice }}</text>
					</view>
				</view>
				<button type="primary" class="buy-btn" @click="Submit()">{{$nw("去结算")}}</button>
			</view>
			<view class="" v-else><button type="primary" @click="onDelete()"
					class="delete-btn mr20">{{$nw("删除")}}</button></view>
		</view>

		<Tabbar></Tabbar>
	</view>
</template>

<script>
	import recommendProduct from '@/components/recommendProduct/recommendProduct.vue';
	import Tabbar from '@/components/tabbar/tabbar.vue';
	export default {
		components: {
			recommendProduct,
			Tabbar
		},
		data() {
			return {
				supply_id:-1,
				/*是否加载完成*/
				loadding: true,
				isEdit: false,
				/*购物车商品*/
				tableData: [],
				arrIds: [],
				// 是否全选
				checkedAll: false,
				totalPrice: 0,
				isIphoneX: 0,
		
			};
		},
		onLoad() {},
		onShow() {
			// 设置全局颜色
			this.setGlobalColor()
			var self = this;

			/*获取产品详情*/
			if (uni.getStorageSync('isIphoneX')) {
				this.isIphoneX = uni.getStorageSync('isIphoneX');
			}
			this.getData();

		},
		computed: {
			active() {
				return Object.assign(this.setBackgroundColor(), this.setColor())
			},
		},
		methods: {
			checkSupply(supply,index){
				let self = this;
		
				self.updateTotalPrice();
				// 更新选中记录
				self.onUpdateChecked();
			},
			/*获取数据*/
			getData() {
				uni.showLoading({
					title: this.$nw("加载中")
				});
				let self = this;
				self._get('user.abuylist/index', {}, function(res) {
					uni.hideLoading();
					console.log(res.data);
					if(res.data){
						self.tableData = res.data;
						self.loadding = false;
						self._initGoodsChecked();
					}else{
						self.loadding = false;
					}
				
				});
			},
			/**
			 * 初始化商品选中状态
			 */
			_initGoodsChecked() {
				let self = this;
				let checkedData = self.getCheckedData();
				// 将商品设置选中
				self.tableData.forEach(item => {
					item.checked = self.inArray(`${item.product_id}_${item.product_sku_id}`, checkedData);
				});
				self.isEdit = false;
				self.checkedAll = checkedData.length == self.tableData.length;
				// 更新购物车已选商品总价格
				self.updateTotalPrice();
			},

			/**
			 * 获取选中的商品
			 */
			getCheckedData() {
				let checkedData = uni.getStorageSync('checkedData_abuylist');
				return checkedData ? checkedData : [];
			},

			/*单选*/
			checkItem(e, index) {
				e.checked = !e.checked;
				this.$set(this.tableData, index, e);
				// 更新选中记录
				this.onUpdateChecked();
				// 更新购物车已选商品总价格
				this.updateTotalPrice();
				// 更新全选状态
				this.checkedAll = this.getCheckedData().length == this.tableData.length;
			},

			/**
			 * 更新商品选中记录
			 */
			onUpdateChecked() {
				let self = this,
					checkedData = [];
				self.tableData.forEach(item => {
					if (item.checked == true) {
						checkedData.push(`${item.product_id}_${item.product_sku_id}`);
					}
				});
			
				uni.setStorageSync('checkedData_abuylist', checkedData);
			},
			/*全选*/
			onCheckedAll() {
				let self = this;
				
				if(self.supplys.length>1){
					uni.showToast({
						title:'每次只能选择一个商家的产品',
						icon:'none',
						duration:3000
					})
					
					return 
				}
				self.checkedAll = !self.checkedAll;
				
				self.tableData.forEach(item => {
					item.checked = self.checkedAll;
				});
				self.updateTotalPrice();
				// 更新选中记录
				self.onUpdateChecked();
			},
			updateTotalPrice: function() {
				let total_price = 0;
				let items = this.tableData;
				for (let i = 0; i < items.length; i++) {
					if (items[i]['checked'] == true) {
						total_price += items[i]['total_num'] * items[i]['product_price'];
					}
				}
				/*保留2位小数*/
				this.totalPrice = total_price.toFixed(2);
			},
			/*去结算*/
			Submit() {
				let arrIds = [];
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
				var can_submit = true;
				this.tableData.forEach(item => {
					if (item.checked == true) {
				
						arrIds.push(`${item.product_id}_${item.product_sku_id}`);
					}
					
				});
				if (!can_submit) {
					uni.showToast({
						title: '一次只能选择一家产品',
						icon: 'none'
					});
					return false;
				}
				if (arrIds.length == 0) {
					uni.showToast({
						title: this.$nw("请选择商品"),
						icon: 'none'
					});
					return false;
				}
				uni.navigateTo({
					url: '/main/pages/order/confirm-order/confirm-order?order_type=abuylist&abuylist_ids=' + arrIds
				});

			},

			/**
			 * 获取已选中的商品
			 */
			getCheckedIds() {
				let self = this;
				let arrIds = [];
				self.tableData.forEach(item => {
					if (item.checked === true) {
						arrIds.push(`${item.product_id}_${item.product_sku_id}`);
					}
				});
				return arrIds;
			},

			/**
			 * 商品删除事件
			 */
			onDeleteEvent(cartIds) {
				let self = this;
				cartIds.forEach(cartIndex => {
					self.tableData.forEach((item, productIndex) => {
						if (cartIndex == `${item.product_id}_${item.product_sku_id}`) {
							self.tableData.splice(productIndex, 1);
						}
					});
				});
				// 更新选中记录
				self.onUpdateChecked();
				return true;
			},
			/**
			 * 是否在数组内
			 */
			inArray(search, array) {
				for (var i in array) {
					if (array[i] == search) {
						return true;
					}
				}
				return false;
			},

			/*去购物*/
			gotoShop() {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.card {
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
		box-shadow: 0 -2rpx 8rpx rgba(0, 0, 0, .1);
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
</style>
