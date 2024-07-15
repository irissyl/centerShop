<template>
	<view>
		<view class="prodcut-list-wrap" >
			<view class="search-box" :style="'background:'+getMainColor()+';'">
				<view class="search-item" :style="'background:'+getSecondBackgroundColor()+';'">
					<!-- <span class="icon iconfont2 icon-sousuo" style="line-height: 170rpx;"></span> -->
					<input @confirm="search" v-model="keyWord" class="ml-md flex-1" 
					confirmType="search"
						placeholderClass="placeholder" 
						:placeholder="$nw('请输入商家名称')" type="text"></input>
				</view>
			</view>
			
			<scroll-view scroll-y="true" class="scroll-Y" 
			:style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'" 
		
			
			lower-threshold="50"
			 @scrolltolower="scrolltolowerFunc">
				<view class="shop_list_body">
					<view class="shop_list_body_item" 
					:style="'background:'+getSecondBackgroundColor()+';'"
					v-for="(item,index) in shopData" :key="index"
				>
						<view class="shop_list_body_item_shop" @click="goto_shop(item.supply_id)">
							<view class="shop_list_body_item_shop_logo">
								<image :src="item.image_url"></image>
							</view>
							<view class="shop_list_body_item_shop_info">
								<view class="h1 title">{{item.name}}</view>
								<!-- <view class="excellence_brand" v-if="item.is_excellence">优选品牌</view> -->
								<view class="h3 brand"></view>
							</view>
						</view>
						<!--  && shopData[index].product.data.length > 0 -->
						<view v-if="shopData[index].product.total>0 " 
						:class="shopData[index].product.data.length<3?'shop_list_body_item_product2':'shop_list_body_item_product'" >
							<view class="shop_list_body_item_product_item" v-for="(itemA,index2) in shopData[index].product.data" :key="index2"
							 @click="goto_product(itemA.product_id)">
								<view>
									<image  mode="widthFix":src="itemA.product_image"></image>
								</view>
								<view class="product_name" :style="'color:'+getTextColorWhite()+';'">
									{{itemA.product_name}}
								</view>
								<view class="shop_list_body_item_product_item_price">
									
									<view class="h4"  :style="'color:'+getMainTextColor()+';'">¥
										<text class="h3">
											{{itemA.pro4duct_price>1000?itemA.product_price*1:itemA.product_price}}
										</text>
									</view>
								</view>
								<view class="buy" 
							
								@click="buyGood(itemA.product_id)" 
								v-if="index<3">
									<view 	:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
								>{{$nw("立即购买")}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<!-- 没有记录 -->
			<view class="d-c-c p30" v-if="shopData.length==0 && !loading">
				<text class="iconfont icon-wushuju"></text>
				<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
			</view>
			<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more.vue";
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*状态选中*/
				state_active: -1,
				no_more: false,
				loading: true,
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows:15,
				/*顶部刷新*/
				topRefresh: false,
				/*类别选中*/
				type_active: 'all',
				/*价格选中*/
				price_top: false,
				/*店铺列表*/
				shopData: [],
				/*当前页面*/
				searchtxt: '',
				keyWord: '',
				stateTab:false,
				is_excellence:1,
				category_id:0,
				keywords:""
			};
		},
		computed: {
			/*加载中状态*/
			loadingType() {
				if (this.loading) {
					return 1;
				} else {
					if (this.shopData.length != 0 && this.no_more) {
						return 2;
					} else {
						return 0;
					}
				}
			},
			getbutton() {
				return this.setButton().button
			}
		},
	
		onLoad(e) {
			this.category_id = e.category_id;
			this.getData();
			// 设置全局颜色
			this.setGlobalColor()
		},
		mounted() {
			this.init();
		},
		onPullDownRefresh() {
			/*下拉到顶，页面值还原初始化*/
			this.restoreData();
			this.getData();
		},
		methods: {
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.phoneHeight = res.windowHeight;
						self.scrollviewHigh = res.windowHeight;
						// 计算组件的高度
						// let view = uni.createSelectorQuery().select('.top-box');
						// view.boundingClientRect(data => {
						// 	let h = self.phoneHeight - data.height;
						// 	self.scrollviewHigh = h;
						// }).exec();
					}
				});
				
			},
			/*还原初始化*/
			restoreData() {
				this.shopData = [];
				this.category_id = 0;
			},
			/*类别切换*/
			tabTypeFunc(e) {
				let self = this;
				self.shopData = [];
				self.page = 1;
				self.no_more = false;
				self.loading = true;
				self.getData();
			},

			/*获取数据*/
			getData() {
				let self = this;
				let page = self.page;
				let list_rows = self.list_rows;
				self.loading = true;
				console.log(self.category_id);
				self._post('plus.supply.supply/supplyList', {
					page: page || 1,
					list_rows: list_rows,
					name: self.keyWord,
					category_id:self.category_id
				}, (res) => {
					self.loading = false;
					self.last_page = res.data.list.last_page;
					self.shopData = self.shopData.concat(res.data.list.data);
					self.shopData = self.getUnique(self.shopData, "supply_id");
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					} else {
						self.no_more = false;
					}
				})
			},

			/*搜索*/
			search() {
				let self= this;
				self.restoreData();
				self.getData();
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
			
			//跳转店铺首页
			goto_shop(supply_id) {
				console.log("111")
				uni.navigateTo({
					url: '/plus/pages/supply/detail/detail?supply_id=' + supply_id
				})
			},
			//跳转商品页面
			goto_product(product_id) {
				uni.navigateTo({
					url: '/main/pages/product/detail/detail?product_id=' + product_id
				})
			},
		}
	};
</script>

<style lang="scss">
	page {
		background: #ffffff;
	}

	.prodcut-list-wrap{
		// margin: 20rpx;
		// padding-bottom: 98rpx;
	}
	.prodcut-list-wrap .list {
		background: #FFFFFF;
	}

	.prodcut-list-wrap .list .item {
		padding: 20rpx;
		display: flex;
	}

	.prodcut-list-wrap .product-cover,
	.prodcut-list-wrap .product-cover image {
		width: 220rpx;
		height: 220rpx;
	}

	.prodcut-list-wrap .product-info {
		flex: 1;
		margin-left: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.prodcut-list-wrap .product-title {
		display: -webkit-box;
		line-height: 40rpx;
		height: 80rpx;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 32rpx;
	}

	.prodcut-list-wrap .already-sale {
		margin-top: 20rpx;
		color: #999;
		font-size: 24rpx;
	}

	.prodcut-list-wrap .already-sale>text {
		padding: 6rpx 10rpx;
		background-color: #f2f2f7;
	}

	.prodcut-list-wrap .price {
		color: $dominant-color;
		font-size: 24rpx;
	}

	.prodcut-list-wrap .price .num {
		margin-left: 6rpx;
		padding: 0 4rpx;
		font-size: 40rpx;
	}

	// *********************
	// *********************
	.h1 {
		font-size: 32rpx;
	}

	.h2 {
		font-size: 28rpx;
	}

	.h3 {
		font-size: 24rpx;
	}

	.h4 {
		font-size: 20rpx;
	}

	.h5 {
		font-size: 16rpx;
	}

	.h6 {
		font-size: 12rpx;
	}

	.huaxianjia {
		text-decoration: line-through;
		color: #585858;
		margin-left: 4rpx;
	}

	.shop_list_body{
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.shop_list_body_item {
		display: flex;
		width: 100%;
		margin-bottom: 30rpx;
		flex-direction: column;
	
		border-radius: 20rpx;
		box-sizing: border-box;

	}

	.shop_list_body_item_shop {
		height: 150rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		border-top-right-radius: 15rpx;
		border-top-left-radius: 15rpx;
	
	}

	.shop_list_body_item_shop_logo {
		width: 100rpx;
		height: 100rpx;
	}

	.shop_list_body_item_shop_logo image {
		width: 100%;
		height: 100%;

		border-radius: 15rpx;
	}

	.shop_list_body_item_shop_info {
		width: 100%;
		padding: 10rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		align-items: flex-start;
		flex: 1;
	}
	.shop_list_body_item_shop_info .title{
		color: #FFFFFF;
	}
	.shop_list_body_item_shop_others {
		padding: 8rpx;
		box-sizing: border-box;
		display: flex;
		justify-content: space-between;
		flex-direction: column;
		text-align: right;
		padding-top: 0;
	}

	.shop_list_body_item_product {
		width: 100%;
		display: flex;
		justify-content: space-around;
		align-items: center;

		padding: 10rpx;
		box-sizing: border-box;
		border-bottom-left-radius: 15rpx;
		border-bottom-right-radius: 15rpx;
		padding-bottom: 20rpx;
	}

	.shop_list_body_item_product2 {
		width: 100%;
		// height: 400rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;

		padding: 10rpx;
		box-sizing: border-box;
		border-bottom-left-radius: 15rpx;
		border-bottom-right-radius: 15rpx;
	}
	.product_name{
		width: 100%;
		font-size: 24rpx;
		margin: 0 10rpx;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		white-space:nowrap;
		overflow: hidden;
	}

	.shop_list_body_item_product2 .shop_list_body_item_product_item {
		margin: 0rpx 10rpx;
	}

	.shop_list_body_item_product_item {
		width: 30%;
		
		border-radius: 10rpx;
		overflow: hidden;
	}

	.shop_list_body_item_product_item image {
		width: 100%;
		// height: 200rpx;
		background-color: rgba(0, 0, 0, 0.1);
	}

	.shop_list_body_item_product_item view {
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		text-overflow: ellipsis;
		-webkit-box-orient: vertical;
		word-wrap: break-word;
		word-break: break-all;
		overflow: hidden;
	}

	.shop_list_body_item_product_item_price {
		padding: 10rpx;
		display: flex;
		align-items: baseline
	}
	.excellence_brand{
		width: 160rpx;
		height: 40rpx;
		font-size: 24rpx;
		display: flex;
		border-top-right-radius:2em;
		border-bottom-left-radius:2em;
		color: #7c6241;
		justify-content: center;
		background-color: #f1d6ab;
		align-items: center;
	}

	.brand {
		position: relative;
		color: #ffffff;
	}

	.sales {
		color: #585858;
	}
	.buy {
		display: flex;
		justify-content: center;
		width: 100%;
		text-align: center;
		// margin-top: 8rpx;
	}
	.buy>view{
		width: 200rpx;
		margin-bottom: 10rpx;
		background-color: #5b67fb;
		border-radius: 40rpx;
		color: #fff;
	}
	
	.search-box {
		padding: 20rpx;
		display: flex;
		align-items: center;
	}
	
	.search-item {
		flex: 1;
		height: 64rpx;
		border-radius: 32rpx;
		padding: 0 16rpx 0 35rpx;
		display: flex;
		align-items: center;
		line-height: 1;
		font-size: 28rpx;
		color: #888;
	}
	
	.placeholder {
		font-size: 28rpx;
	}
	
	.search-item-btn {
		color: #19a918;
		margin-left: 32rpx;
		font-size: 30rpx;
	}
	
	.search-btn {
		padding: 0 20rpx 0 40rpx;
	}

</style>
