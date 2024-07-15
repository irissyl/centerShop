<template>
	<view class="category-wrap">
		<!-- 搜索框 -->
		<view class="index-search-box" id="searchBox">
			<view class="index-search t-c" @click="gotoSearch">
				<span class="icon iconfont icon-sousuo" style="margin-right: 10rpx;"></span>
				<text class="ml10">{{ searchName }}</text>
			</view>
		</view>

		<!--类别列表-->
		<view class="category-content">

			<!--一级分类 大图-->
			<view class="cotegory-type cotegory-type-1" v-if="show_type==10">
				<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+scrollviewHigh+'px;'">
					<view class="list">
						<view class="item" v-for="(item,index) in listData" :key="index"
							@click="gotoList(item.category_id)">
							<view class="pic">
								<image :src="hasImages(item)" mode="widthFix"></image>
							</view>
							<view class="p-20-0 fb tc f34">
								{{item.name}}
							</view>
						</view>
					</view>
				</scroll-view>
			</view>

			<!--一级分类 小图-->
			<view class="cotegory-type cotegory-type-2" v-if="show_type==20">
				<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+scrollviewHigh+'px;'">
					<view class="list">
						<view class="item" v-for="(item,index) in listData" :key="index"
							@click="gotoList(item.category_id)">
							<image :src="hasImages(item)" mode="aspectFit"></image>
							<text>{{item.name}}</text>
						</view>
					</view>
				</scroll-view>
			</view>


			<!--二级分类-->
			<view class="cotegory-type cotegory-type-3" v-if="show_type==30">
				<view class="category-tab">
					<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+scrollviewHigh+'px;'">
						<view v-for="(item,index) in listData" :key="index" @click="selectCategory(index)">
							<view :class="index==select_index?'item active':'item'">
								<text>{{item.name}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="category-content">
					<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+scrollviewHigh+'px;'">
						<view class="list">
							<view class="item" v-for="(item,index) in childlist" :key="index"
								@click="gotoList(item.category_id)">
								<image :src="hasImages(item)" mode="aspectFit"></image>
								<text class="type-name">{{item.name}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
			<!-- 一级分类（商品） -->
			<view class="cotegory-type cotegory-type-4" v-if="show_type==50">
				<view class="category-tab">
					<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+scrollviewHigh+'px;'">
						<view :class="index==select_index?'item active':'item'" v-for="(item,index) in listData"
							:key="index" @click="selectCategory(index)">
							<text>{{item.name}}</text>
						</view>
					</scroll-view>
				</view>
				<view class="category-content" style="background: #f6f6f6;">


					<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+(scrollviewHigh-70)+'px;'"
						@scrolltolower="scrolltolowerBottom">
						<view class="prodcut-list-wrap">
							<view class="list" style="">
								<view class="item" v-for="(item, index) in product" :key="index"
									@click="gotoDetail(item.product_id)">
									<view class="product-cover" style="">
										<image :src="item.product_image" mode="aspectFill"></image>
									</view>
									<view class="product-info" style="">
										<view class="product-title">
											{{ item.product_name }}
										</view>
										<view class="already-sale">
											<text>{{$nw("已售")}} {{ item.product_sales }} {{$nw("件")}}</text>
										</view>
										<view class="price" v-if="item.buy_auth.can_buy>0||item.buy_auth.no_price==0">
											{{$nw("¥")}}
											<text
												class="num">{{ item.product_sku ? item.product_sku.product_price : '' }}</text>


										</view>
										<view class=" d-s-c mt10 red"
											v-if="item.show_commission&&item.direct_commission>0">
											<view class="ml10">
												<text>{{item.direct_commission_text}}</text>
												<text class=""
													style="padding-left: 5rpx;">{{$nw("¥")}}{{ item.direct_commission }}</text>
											</view>
										</view>
									</view>

								</view>
							</view>
						</view>
					</scroll-view>



				</view>
			</view>
			<!-- 二级分类（tabbar） -->
			<view class="cotegory-type cotegory-type-4" v-if="show_type==40">
				<view class="category-tab">
					<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+scrollviewHigh+'px;'">
						<view :class="index==select_index?'item active':'item'" v-for="(item,index) in listData"
							:key="index" @click="selectCategory(index)">
							<text>{{item.name}}</text>
						</view>
					</scroll-view>
				</view>
				<view class="category-content" style="background: #f6f6f6;">
					<view class="tabbar-wrapper">
						<view class="tabbar-item" v-for="(item,index) in childlist" :key="index"
							:class="{'tabbar-item__active': item.category_id === currentTabbar}"
							@tap="tapTabBarItem(item)">
							{{item.name}}
						</view>
					</view>

					<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+(scrollviewHigh-70)+'px;'"
						@scrolltolower="scrolltolowerBottom">
						<view class="prodcut-list-wrap">
							<view class="list" style="">
								<view class="item" v-for="(item, index) in product" :key="index"
									@click="gotoDetail(item.product_id)">
									<view class="product-cover" style="">
										<image :src="item.product_image" mode="aspectFill"></image>
									</view>
									<view class="product-info" style="">
										<view class="product-title">
											{{ item.product_name }}
										</view>
										<view class="already-sale">
											<text>{{$nw("已售")}} {{ item.product_sales }} {{$nw("件")}}</text>
										</view>
										<view class="price" v-if="item.buy_auth.can_buy>0||item.buy_auth.no_price==0">
											{{$nw("¥")}}
											<text
												class="num">{{ item.product_sku ? item.product_sku.product_price : '' }}</text>


										</view>
										<view class=" d-s-c mt10 red"
											v-if="item.show_commission&&item.direct_commission>0">
											<view class="ml10">
												<text>{{item.direct_commission_text}}</text>
												<text class=""
													style="padding-left: 5rpx;">{{$nw("¥")}}{{ item.direct_commission }}</text>
											</view>
										</view>
									</view>

								</view>
							</view>
						</view>
					</scroll-view>



				</view>
			</view>

			<view class="tabbar-wrapper dbb">
				<view class="tabbar-item" v-for="(item,index) in childlist1" :key="index"
					:class="{'tabbar-item__active': itemIndex === index}" @tap="tapTabBarItem(item,index)">
					{{item.name}}
				</view>

			</view>
			<view class="cotegory-type cotegory-type-4" v-if="show_type==60">
				<view class="category-tab">
					<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+scrollviewHigh+'px;'">
						<view :class="index==select_index?'item active':'item'" v-for="(item,index) in listData"
							:key="index" @click="selectCategory(index)">
							<text style="display: inline-block;padding: 4rpx 16rpx;" :class="index==select_index?'active1':''">{{item.name}}</text>
						</view>
					</scroll-view>
				</view>
				<view class="category-content" style="background: #f6f6f6;">


					<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+(scrollviewHigh-70)+'px;'"
						@scrolltolower="scrolltolowerBottom">
						<view class="prodcut-list-wrapx">
							<view class="list" style="">
								<view class="item" v-for="(item, index) in product" :key="index"
									@click="gotoDetail(item.product_id)">
									<view class="product-cover" style="">
										<image :src="item.product_image" mode="aspectFill"></image>
									</view>
									<view class="product-info" style="">
										<view class="product-title">
											{{ item.product_name }}
										</view>
										<view class="already-sale">
											<text>{{$nw("已售")}} {{ item.product_sales }} {{$nw("件")}}</text>
										</view>
										<view class="price" v-if="item.buy_auth.can_buy>0||item.buy_auth.no_price==0">
											{{$nw("¥")}}
											<text
												class="num">{{ item.product_sku ? item.product_sku.product_price : '' }}</text>


										</view>
										<view class=" d-s-c mt10 red"
											v-if="item.show_commission&&item.direct_commission>0">
											<view class="ml10">
												<text>{{item.direct_commission_text}}</text>
												<text class=""
													style="padding-left: 5rpx;">{{$nw("¥")}}{{ item.direct_commission }}</text>
											</view>
										</view>
									</view>

								</view>
								<view class="" style="clear: both;">

								</view>
							</view>
						</view>
					</scroll-view>



				</view>
			</view>
		</view>

		<Tabbar v-if="show_menu"></Tabbar>
		<service :itemData="t_service"></service>


	</view>
</template>

<script>
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import service from '@/components/diy/service/service';
	export default {
		components: {
			Tabbar,
			service
		},
		data() {
			return {
				itemIndex:0,
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				searchName: this.$nw("搜索"),
				/*展示方式*/
				show_type: 3,
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*数据*/
				listData: [],
				/*子类数据*/
				childlist1: [
					{
						name:'快销品'
					},
					{
						name:'工业品'
					}
				],
				/*当前选中的分类*/
				select_index: 0,
				currentTabbar: 0,
				page: 1,
				product: [],
				show_menu: true
			};
		},
		onShow() {
			var self = this;
			//--语言一个一个替换  只针对动态数据
			uni.setNavigationBarTitle({
				title: self.$nw("商城")
			});

			self.isTabbar(self, "pages/product/category", function(res) {
				self.show_menu = res;
			})

		},
		mounted() {
			this.init();
			this.getData();

			// 设置全局颜色
			this.setGlobalColor()


		},
		methods: {
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
						// 计算组件的高度
						let view = uni.createSelectorQuery().select('#searchBox');
						view.boundingClientRect(data => {
							let h = _this.phoneHeight - data.height;
							_this.scrollviewHigh = h;
						}).exec();
					}
				});
			},

			/*判断是否有图片*/
			hasImages(e) {
				if (e.images != null && e.images.file_path != null) {
					return e.images.file_path;
				} else {
					return '';
				}
			},

			/*获取数据*/
			getData() {
				let _this = this;
				uni.showLoading({
					title: _this.$nw("加载中")
				});
				_this._get('product.category/index', {}, function(res) {
					_this.listData = res.data.list;
					_this.show_type = res.data.template.category_style;
					console.log("_this.listData ", _this.listData)
					if (_this.show_type == 50) {
						_this.currentTabbar = _this.listData[0].category_id
						_this.getSecondProduct();
					}
					if (_this.listData[0].child) {
						_this.childlist = _this.listData[0].child;
						//获取二级分类下的产品
						if (_this.show_type == 40 || _this.show_type == 60) {
							_this.currentTabbar = _this.childlist[0].category_id
							_this.getSecondProduct();
						}

					}
					_this.background = res.data.background;
					uni.hideLoading();
				});
			},
			scrolltolowerBottom() {
				console.log("碰低触发")
				this.page += 1;
				this.getSecondProduct()
			},
			getSecondProduct() {
				let self = this;

				let list_rows = 5;
				let category_id = self.currentTabbar;

				self.loading = true;
				self._get('product.product/lists', {
					page: self.page || 1,
					category_id: category_id,

					list_rows: list_rows,
				}, function(res) {
					self.loading = false;
					self.product = self.product.concat(res.data.list.data);
					self.product = self.getUnique(self.product, "product_id");
					self.last_page = res.data.list.last_page;
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}
				});
			},
			/*选择分类*/
			selectCategory(e) {
				this.page = 1;
				this.product = [];
				console.log(111);
				this.select_index = e;

				if (this.show_type == 50) {
					this.currentTabbar = this.listData[e].category_id
					this.getSecondProduct()
				}
				if (this.listData[e].child) {
					this.childlist = this.listData[e].child;

					if (this.show_type == 40 || this.show_type == 60) {
						this.currentTabbar = this.childlist[0].category_id
						this.getSecondProduct()
					}

				}
			},
			tapTabBarItem(item,index) {
				this.itemIndex = index
				this.currentTabbar = item.category_id;
				this.page = 1;
				this.product = [];
				this.getSecondProduct()
			},
			gotoDetail(product_id) {
				let url = 'main/pages/product/detail/detail?product_id=' + product_id
				this.gotoPage(url);
			},
			/*跳转产品列表*/
			gotoList(e) {
				let category_id = e;
				let sortType = 'all';
				let search = '';
				let sortPrice = 0;
				uni.navigateTo({
					url: '/main/pages/product/list/list?category_id=' + category_id + '&sortType=' + sortType +
						'&search=' + search +
						'&sortPrice=' + sortPrice,
				});
			},

			wxGetUserInfo: function(res) {
				var self = this;
				if (!res.detail.iv) {
					uni.showToast({
						title: self.$nw("您取消了授权,登录失败"),
						icon: "none"
					});
					return false;
				}
			},

			/*跳转搜索页面*/
			gotoSearch() {
				uni.navigateTo({
					url: '/main/pages/product/search/search'
				});
			},
			/**
			 * 设置分享内容
			 */
			onShareAppMessage() {
				let self = this;
				return {
					title: self.templet.share_title,
					path: '/pages/product/category?' + self.getShareUrlParams()
				};
			},
		}
	};
</script>

<style lang="scss">
	@import '@/common/mixin.scss';

	.index-search-box {
		background-color: #F4F7FB;
		border: none;

		.index-search {
			border: none;
			border-radius: 90rpx;
			color: #000;
		}
	}

	.tabbar-wrapper {
		width: 100%;
		overflow-x: auto;
		white-space: nowrap;
		background-color: #F4F7FB;
		padding: 20rpx 120rpx;

		& .tabbar-item {
			width: 25%;
			text-align: center;
			display: inline-block;
			padding: 10rpx 0;
			position: relative;

			&__active {
				&::after {
					content: '';
					width: 80rpx;
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					margin: auto;
					border-bottom: 4rpx solid #1B94E0;
				}
			}
		}
	}


	.cotegory-type {
		line-height: 40rpx;
		background-color: #F4F7FB;
	}

	.cotegory-type image {
		width: 100%;
	}

	.cotegory-type-1 .list {
		padding: 20rpx;
	}

	.cotegory-type-1 .list .item {
		margin-top: 30rpx;
	}

	.cotegory-type-1 .list .item .pic {
		// border: 1px solid #e3e3e3;
		width: 710rpx;
		height: auto;
		overflow: hidden;
		border-radius: 8px;
	}

	.cotegory-type-1 .list .item image {
		width: 100%;
		height: 100%;
	}

	.cotegory-type-2 .list,
	.cotegory-type-3 .list {
		padding: 0 20rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}

	.cotegory-type-2 .list .item,
	.cotegory-type-3 .list .item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.cotegory-type-2 .list .item {
		padding: 0 16rpx;
		width: 200rpx;
		height: 300rpx;
		font-size: 28rpx;
	}

	.cotegory-type-2 .list .item image {
		width: 180rpx;
		height: 180rpx;
		margin-bottom: 20rpx;
	}

	.cotegory-type-3 {
		display: flex;
	}

	.cotegory-type-3 .category-tab {
		width: 200rpx;
		background: #F4F7FB;
		// border-right: 1px solid #e3e3e3;
	}

	.cotegory-type-3 .category-tab .item {
		padding: 40rpx 0;
		font-size: 30rpx;
		text-align: center;
	}

	.cotegory-type-3 .category-tab .item.active {
		position: relative;
		background: #F4F7FB;
		font-weight: bold;
		color: $dominant-color;
	}

	.cotegory-type-3 .category-tab .item.active::after {
		position: absolute;
		content: '';
		top: 40rpx;
		bottom: 40rpx;
		left: 0;
		width: 10rpx;
		background: $dominant-color;
	}

	.cotegory-type-3 .category-content {
		flex: 1;
	}

	.cotegory-type-3 .list .item {
		width: 140rpx;
		height: 200rpx;
		margin-top: 40rpx;
		margin-right: 40rpx;
		font-size: 24rpx;
	}

	.cotegory-type-3 .list .item:nth-child(3n) {
		margin-right: 0;
	}

	.cotegory-type-3 .list .item image {
		width: 140rpx;
		height: 140rpx;
	}

	.cotegory-type-3 .list .item .type-name {
		display: block;
		margin-top: 20rpx;
		height: 80rpx;
		line-height: 60rpx;
		text-overflow: ellipsis;
		width: 100%;
		color: #818181;
		font-size: 30rpx;
		white-space: nowrap;
		overflow: hidden;
		text-align: center;
	}

	.cotegory-type-4 {
		display: flex;
	}

	.cotegory-type-4 .category-tab {
		width: 200rpx;
		background: #F4F7FB;
		// border-right: 1px solid #e3e3e3;
	}

	.cotegory-type-4 .category-tab .item {
		padding: 40rpx 0;
		font-size: 30rpx;
		text-align: center;
	}

	.cotegory-type-4 .category-tab .item.active {
		position: relative;
		background: #F4F7FB;
		// font-weight: bold;
		color: #FFFFFF;
	}

	.cotegory-type-4 .category-tab .item.active {
		// background-color: #1B94E0;
		// width: 128rpx;
		// height: 52rpx;

	}

	.active1 {
		background-color: #1B94E0;
		display: inline-block;
		padding: 4rpx 16rpx;
		border-radius: 30rpx;
		color: #FFFFFF;
	}

	.cotegory-type-4 .category-content {
		flex: 1;
	}


	.prodcut-list-wrap .list {
		width: 95%;
		background: #FFFFFF;
		margin: auto;
		border-radius: 10rpx;
		margin-top: 10rpx;
	}

	.prodcut-list-wrap .list .item {

		padding: 10rpx;
		padding-bottom: 0rpx;
		display: flex;
		border-bottom: 16rpx solid #f6f6f6;
	}

	.prodcut-list-wrap .product-cover,
	.prodcut-list-wrap .product-cover image {
		width: 180rpx;
		height: 180rpx;

	}

	.prodcut-list-wrap .product-info {
		flex: 1;
		margin-left: 20rpx;
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



	.prodcut-list-wrapx .list {
		width: 97%;
		margin-top: 15rpx;

	}

	.prodcut-list-wrapx .list .item {
		width: 48%;
		background: #FFFFFF;
		padding-bottom: 0rpx;
		margin-left: 2%;
		float: left;
		border-bottom: 16rpx solid #f6f6f6;
		border-radius: 16rpx;
	}

	.prodcut-list-wrapx .product-cover,
	.prodcut-list-wrapx .product-cover image {
		width: 100%;
		height: 230rpx;
	}

	.prodcut-list-wrapx .product-info {
		flex: 1;
		margin-left: 10rpx;
		margin-right: 10rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;

	}

	.prodcut-list-wrapx .product-title {
		display: -webkit-box;
		line-height: 40rpx;
		height: 80rpx;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 28rpx;
	}

	.prodcut-list-wrapx .already-sale {
		margin-top: 20rpx;
		color: #999;
		font-size: 22rpx;
		border-radius: 5rpx;
	}

	.prodcut-list-wrapx .already-sale>text {
		padding: 6rpx 10rpx;
		background-color: #f2f2f7;
	}

	.prodcut-list-wrapx .price {
		color: $dominant-color;
		font-size: 24rpx;
	}

	.prodcut-list-wrapx .price .num {
		margin-left: 6rpx;
		padding: 0 4rpx;
		font-size: 28rpx;
	}
</style>