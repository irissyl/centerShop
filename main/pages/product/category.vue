<template>
	<view class="category-wrap" :style="'height:'+phoneHeight+'px;overflow: hidden;'">
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
						<view :class="index==select_index?'item active':'item'" v-for="(item,index) in listData"
							:key="index" @click="selectCategory(index)">
							<text>{{item.name}}</text>
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
												class="num">{{ item.product_sku && item.product_sku.product_price || item.product_price || '--' }}</text>


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
					<view class="tabbar-wrapper hide-scrollbar">
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
												class="num">{{ item.product_sku && item.product_sku.product_price || item.product_price || '--' }}</text>


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

			<view class="cotegory-type cotegory-type-4" v-if="show_type==60">
				<view class="category-tab">
					<scroll-view ref="tabScrollRef" class="scroll-Y" scroll-y="true"
						:style="'height:'+scrollviewHigh+'px;'" scroll-into-view='scrollIntoTab'>
						<view class="category-tab-list">
							<view class="item" :class="{'active' : index == select_index}"
								:id="params_id == item.category_id && index == select_index ? 'scrollIntoTab' : ''"
								v-for="(item,index) in listData" :key="index" @click="selectCategory(index)">
								<text>{{item.name}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="category-content" style="background: #f6f6f6;">
					<view class="tabbar-wrapper hide-scrollbar">
						<view class="tabbar-item" v-for="(item,index) in childlist" :key="index"
							:class="{'tabbar-item__active': item.category_id === currentTabbar}"
							@tap="tapTabBarItem(item)">
							{{item.name}}
						</view>
					</view>

					<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+(scrollviewHigh-70)+'px;'"
						@scrolltolower="scrolltolowerBottom">
						<view class="prodcut-list-wrapx">
							<view class="list">
								<view class="item" v-for="(item, index) in product" :key="index"
									@click="gotoDetail(item.product_id)">
									<view class="product-cover common-img-bg small" style="">
										<image class="common-img" :src="item.product_image || item.product_main_img"
											mode="aspectFill">
										</image>

										<view v-if="item.show_commission && item.direct_commission > 0"
											class="product-tips flex-c">
											<view class="label">
												{{$nw('分享可赚佣金')}}
											</view>
											<view class="price">
												￥<text class="money">{{toFixed(item.direct_commission)}}</text>
											</view>
										</view>
									</view>
									<view class="product-info" style="">
										<view class="product-title">
											{{ item.product_name }}
										</view>
										<!-- <view class="already-sale">
											<text>{{$nw("已售")}} {{ item.product_sales }} {{$nw("件")}}</text>
										</view> -->
										<view class="price flex-c"
											v-if="item.buy_auth.can_buy > 0 || item.buy_auth.no_price == 0">
											{{$nw("¥")}}
											<text class="num">
												{{ item.product_sku && item.product_sku.product_price || item.product_price || '--' }}
											</text>
											<text class="sell">{{$nw("已售")}}{{ item.product_sales || 0 }}</text>
										</view>
										<!-- <view class=" d-s-c mt10 red"
											v-if="item.show_commission && item.direct_commission > 0">
											<view class="ml10">
												<text>{{item.direct_commission_text}}</text>
												<text class=""
													style="padding-left: 5rpx;">{{$nw("¥")}}{{ item.direct_commission }}</text>
											</view>
										</view> -->
									</view>

								</view>
								<view style="clear: both;"></view>
							</view>
						</view>

						<view v-if="(!product || !product.length) && !loading" class="empty-box">
							<view class="empty-icon">
								<image class="common-img"
									src="https://shanghuitest.client.xcx008.com/file/uploads/20240605/b798199e3c83e9b818f20576e825a1b9.png">
								</image>
							</view>
							<view class="empty-text">
								暂无商品
							</view>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>

		<service :itemData="t_service"></service>
	</view>
</template>

<script>
	import service from '@/components/diy/service/service';
	export default {
		components: {
			service
		},
		data() {
			return {
				loading: false,
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
				childlist: [],
				/*当前选中的分类*/
				select_index: 0,
				currentTabbar: 0,
				page: 1,
				product: [],
				params_id: null,
				no_more: false,
				is_first: true,
				tabScrollRef: null
			};
		},
		onShow() {
			var self = this;
			//--语言一个一个替换  只针对动态数据
			uni.setNavigationBarTitle({
				title: self.$nw("万商购物")
			});

		},
		onLoad(option) {
			console.log('onLoad--->');
			if (option.category_id) {
				this.params_id = option.category_id
			}
			this.getData();
		},
		mounted() {
			console.log('mounted--->');
			this.init();
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
				uni.showLoading({
					title: this.$nw("加载中")
				});
				this._get('product.category/index', {}, (res) => {
					this.listData = res.data.list;
					this.show_type = res.data.template.category_style;
					console.log("this.listData ", this.listData)
					if (this.show_type == 50) {
						this.currentTabbar = this.listData[0].category_id
						this.getSecondProduct();
					}
					if (this.params_id) {
						for (let i = 0; i < this.listData.length; i++) {
							if (this.listData[i].category_id == this.params_id) {
								this.selectCategory(i)
							}
						}

					} else if (this.listData[0].child) {
						this.childlist = this.listData[0].child;
						//获取二级分类下的产品
						if (this.show_type == 40 || this.show_type == 60) {
							this.currentTabbar = this.childlist[0].category_id
							this.getSecondProduct();
						}
					}
					this.background = res.data.background;
					uni.hideLoading();
				});
			},
			scrolltolowerBottom() {
				console.log("碰低触发")
				this.page += 1;
				this.getSecondProduct()
			},
			getSecondProduct() {
				let list_rows = 12;
				let category_id = this.currentTabbar;
				this.loading = true;
				this._get('product.product/lists', {
					page: this.page || 1,
					category_id: category_id,
					list_rows: list_rows,
				}, (res) => {
					this.loading = false;
					this.product = this.product.concat(res.data.list.data);
					this.product = this.getUnique(this.product, "product_id");
					this.last_page = res.data.list.last_page;
					if (res.data.list.last_page <= 1) {
						this.no_more = true;
					}
				}), (err) => {
					this.loading = false;
				}
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
			tapTabBarItem(item) {
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
					path: '/main/pages/product/category?' + self.getShareUrlParams()
				};
			},
		}
	};
</script>

<style lang="scss">
	@import '@/common/mixin.scss';

	.index-search-box {
		background-color: #F4F7FB;

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
		background-color: #ffffff;
		padding: 24rpx 10rpx;


		& .tabbar-item {
			// width: 25%;
			text-align: center;
			display: inline-block;
			padding: 10rpx 0;
			margin: 0 20rpx;
			position: relative;

			&__active {
				font-weight: 500;

				&::after {
					content: '';
					width: 30rpx;
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					margin: auto;
					border-bottom: 4rpx solid $dominant-color;
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
		border: 1px solid #e3e3e3;
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

	.category-tab-list {
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom) / 2);
	}

	.cotegory-type-3 .category-tab {
		width: 200rpx;
		background: #FFFFFF;
		border-right: 1px solid #e8e8e8;
	}

	.cotegory-type-3 .category-tab .item {
		padding: 36rpx 0;
		font-size: 30rpx;
		text-align: center;
	}

	.cotegory-type-3 .category-tab .item.active {
		position: relative;
		background: #ffffff;
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
		width: calc(100% - 200rpx);
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
		background: #FFFFFF;
		border-right: 1px solid #e8e8e8;
	}

	.cotegory-type-4 .category-tab .item {
		padding: 36rpx 0;
		font-size: 30rpx;
		text-align: center;
	}

	.cotegory-type-4 .category-tab .item.active {
		position: relative;
		background: #ffffff;
		font-weight: bold;
		color: $dominant-color;
	}

	.cotegory-type-4 .category-tab .item.active::after {
		position: absolute;
		content: '';
		top: 40rpx;
		bottom: 40rpx;
		left: 0;
		width: 10rpx;
		background: $dominant-color;
	}

	.cotegory-type-4 .category-content {
		flex: 1;
		width: calc(100% - 200rpx);
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
		padding-top: 15rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom) / 2);
	}

	.prodcut-list-wrapx .list .item {
		width: 48%;
		background: #FFFFFF;
		padding-bottom: 0rpx;
		margin-left: 2%;
		float: left;
		border-bottom: 16rpx solid #f6f6f6;
		border-radius: 10rpx;
		border-radius: 8rpx;
		overflow: hidden;
	}


	.prodcut-list-wrapx .product-cover {
		width: 100%;
		height: 230rpx;
		position: relative;

		.product-tips {
			width: 100%;
			height: 40rpx;
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 2;
			background: linear-gradient(90deg, #FF5653 0%, #FF406E 100%);
			padding: 0 8rpx;
			border-radius: 8rpx 8rpx 0rpx 0rpx;

			.label {
				font-size: 20rpx;
				color: #fff;
				line-height: 1;
			}

			.price {
				font-size: 20rpx;
				color: #fff;
				margin-left: auto;
				line-height: 1;

				.money {
					font-size: 24rpx;
					font-weight: 500;
					color: #fff;
					line-height: 1;
				}
			}
		}
	}


	.prodcut-list-wrapx .product-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		margin: 12rpx;

	}

	.prodcut-list-wrapx .product-title {
		display: -webkit-box;
		line-height: 34rpx;
		height: 66rpx;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 24rpx;
		font-weight: 500;
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

	.prodcut-list-wrapx .product-info .price {
		font-size: 20rpx;
		font-weight: 500;
		line-height: 1;
		align-items: flex-end;
		color: #F43434;
		margin-top: 20rpx;

		.num {
			font-size: 26rpx;
			font-weight: 500;
			line-height: 1;
			color: #F43434;
		}

		.sell {
			margin-left: auto;
			font-size: 20rpx;
			color: #999;
			line-height: 1;
		}
	}

	.category-wrap {
		.empty-box {
			.empty-icon {
				width: 140rpx;
				height: 88rpx;
			}

			.empty-text {
				margin-top: 16rpx;
				color: #bbb;
			}
		}
	}
</style>