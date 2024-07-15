<template>
	<view>
		<!-- #ifdef MP -->
		<view class="supply-bar">
			<view>
				<view class="left">
					<image class="supply_logo" :src="supply.image_url" mode="aspectFill"></image>
					<view class="supply-title">
						<view class="name">{{ supply.name }}</view>
						<view class="desc" :class="{'empty' : !supply.introduce}">
							{{ supply.introduce || '暂无简介' }}
						</view>
					</view>
					<view class="btn-supply" @click="showSupplyQrcode">
						<i class="icon iconfont icon-erweima"></i>
						<view class="text-desc">{{$nw("二维码")}}</view>
					</view>
					<button class="btn-supply" hover-class="none" open-type="share">
						<i class="icon iconfont icon-share"></i>
						<view class="text-desc">{{$nw("分享")}}</view>
					</button>
				</view>
			</view>
		</view>
		<!-- #endif -->

		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			@scrolltolower="scrolltolowerFunc">
			<!-- banner -->
			<!-- <view class="diy-banner-box">
        <swiper class="swiper" :indicator-dots="indicatorDots" :indicator-active-color="indicatorActiveColor" :autoplay="autoplay" :interval="interval" :duration="duration">
          <swiper-item v-for="(item,index) in bannerData" :key="index">
            <image :src="item.image_url" @click="gotoList(item.product_id)"></image>
          </swiper-item>
        </swiper>
      </view> -->
			<!-- 店家 -->
			<!-- #ifdef H5 -->
			<view class="supply-item">
				<view class="cmt-user">
					<view class="left">
						<image class="supply" :src="supply.image_url" mode="aspectFill"></image>
						<view class="supply-title">
							<view class="name">{{ supply.name }}</view>
							<view class="supply-desc" :class="{'empty' : !supply.introduce}">
								{{ supply.introduce || '暂无简介' }}
							</view>
						</view>

					</view>
				</view>
			</view>
			<!-- #endif -->

			<!-- 视频 -->
			<view class="video-style" v-if="supply.video">
				<video :src="supply.video" :poster="supply.poster" objectFit="contain"></video>
			</view>
			<!-- #ifdef MP -->
			<view class="zhanwei"></view>
			<!-- #endif -->
			<!-- 搜索框 -->
			<view class="search-box">
				<form @submit="formSubmit" @reset="formReset">
					<view class="search-content">
						<view class="search-input">
							<input name="keword" class="search-text" :placeholder="$nw('店内搜索产品')"></input>
						</view>
						<view class="search" form-type="submit">

							<button form-type="submit">
								<text class="icon iconfont icon-sousuo"></text>
							</button>
						</view>

					</view>
				</form>
			</view>

			<!-- 广告位 -->
			<!-- <view class="ad_style" v-if="adinfo.supply_top">
				<image :src="adinfo.supply_top" mode="widthFix"></image>
			</view> -->
			<view class="prodcut-list-wrap">
				<view :class="topRefresh?'top-refresh open':'top-refresh'">
					<view class="circle" v-for="(circle,n) in 3" :key="n"></view>
				</view>

				<view class="list" v-if="product_column=='two_column'">
					<view class="product-list" style="">
						<view class="column__2">
							<view class="product-item" v-for="(item, index) in listData" :key="index"
								@click="gotoList(item.product_id)">
								<view class="product-cover">
									<image :src="item.product_image" mode="aspectFill"
										style="width: 100%;height: 350rpx;">
									</image>
								</view>
								<view class="product-info" style="margin-top: 10rpx;padding:0rpx;">
									<view class="product-title">{{ item.product_name }}</view>
									<view class="price d-s-c">
										<view class="red">
											<text class="f22">{{$nw("¥")}}</text>
											<text class="f32">{{ item.product_price }}</text>
										</view>

										<view class="ml20 gray9 text-d-line" v-if="item.line_price > 0">
											<text class="f22">{{$nw("¥")}}</text>
											{{ item.line_price }}
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="list1" v-else-if="product_column=='one_column'">
					<view class="product-item-box1" v-for="(item, index) in listData" :key="index">
						<view class="product-cover"
							:style="'display: flex;align-items: center; background: url('+item.poster+');background-size: 100% 100%;'"
							v-if="item.video&&item.poster!=''">
							<video :src="item.video" style="width: 100%;height: 56.25%;"></video>
						</view>
						<view class="product-cover-video" v-else-if="item.video&&!item.poster">
							<video :src="item.video" style="width: 100%;height: 100%;"></video>
						</view>
						<view class="product-cover" v-else>
							<image @click="gotoList(item.product_id)" :src="item.product_image" mode="aspectFill">
							</image>
						</view>
						<view class="product-title1" @click="gotoList(item.product_id)">
							<view class="product-item-box6">
								<div>{{ item.product_name }}</div>
							</view>
							<view class="subtitle">
								<text v-if="item.subtitle">{{ item.subtitle }}</text>
							</view>
							<view class="product-item-box5">
								<text class="f331"
									style="font-size: 30rpx; color: red;">{{$nw("¥")}}{{ item.product_price }}</text>
								<text class="f33" v-if="item.product_sku.line_price && item.product_sku.line_price > 0"
									style="font-size: 25rpx;padding-left: 30rpx; text-decoration:line-through">{{$nw("¥")}}{{ item.product_sku.line_price }}</text>
								<text class="f44" style="font-size: 25rpx;padding-left: 40rpx;">
									{{$nw("已售")}}{{ item.product_sales }}{{$nw("件")}}
								</text>
							</view>
						</view>

					</view>
				</view>
				<view class="list1" v-else-if="product_column=='video_scale'">
					<view class="product-item-box1" v-for="(item, index) in listData" :key="index">
						<view class="product-cover"
							:style="'display: flex;align-items: center; background: url('+item.poster+');background-size: 100% 100%;'"
							v-if="item.video&&item.poster">
							<video :src="item.video" style="width: 100%;height: 56.25%;"></video>
						</view>
						<view class="product-cover-video" v-else-if="item.video&&!item.poster">
							<video :src="item.video" style="width: 100%;height: 100%;"></video>
						</view>
						<view class="product-cover-video" v-else>
							<image @click="gotoList(item.product_id)" :src="item.product_image" mode="aspectFill">
							</image>
						</view>
						<view class="product-title1" @click="gotoList(item.product_id)">
							<view class="product-item-box6">
								<div>{{ item.product_name }}</div>
							</view>
							<view class="subtitle">
								<text v-if="item.subtitle">{{ item.subtitle }}</text>
							</view>
							<view class="product-item-box5">
								<text class="f331"
									style="font-size: 30rpx; color: red;">{{$nw("¥")}}{{ item.product_price }}</text>
								<text class="f33" v-if="item.product_sku.line_price && item.product_sku.line_price>0"
									style="font-size: 25rpx;padding-left: 30rpx; text-decoration:line-through">{{$nw("¥")}}{{ item.product_sku.line_price }}</text>
								<text class="f44" style="font-size: 25rpx;padding-left: 40rpx;">
									{{$nw("已售")}}{{ item.product_sales }}{{$nw("件")}}
								</text>
							</view>
						</view>

					</view>
				</view>

				<!-- 获取分类下得商品 -->
				<view class="list1" v-else-if="product_column=='category'">
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
											@click="gotoList(item.product_id)">
											<view class="product-cover" style="">
												<image :src="item.product_image" mode="aspectFill"></image>
											</view>
											<view class="product-info" style="">
												<view class="product-title">
													{{ item.product_name }}
												</view>
												<view class="already-sale">
													<text>{{$nw("已售")}}{{ item.product_sales }}{{$nw("件")}}</text>
												</view>
												<view class="price"
													v-if="item.buy_auth.can_buy>0||item.buy_auth.no_price==0">
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

					<!-- <view class="category-content">


						<view class="cotegory-type cotegory-type-4">
							<view class="category-tab">
								<scroll-view scroll-y="true" class="scroll-Y" 
								:style="'height:'+(scrollviewHigh-180)+'px;'"
								>
									<view :class="item.category_id==currentTabbar?'item active':'item'"
										v-for="(item,index) in category" :key="index"
										@click="selectCategory(item.category_id)">
										<text>{{item.name}}</text>
									</view>
								</scroll-view>
							</view>
							<view class="category-content" style="background: #f6f6f6;">


								<scroll-view scroll-y="true" class="scroll-Y"
									:style="'height:'+(scrollviewHigh-180)+'px;'" 
								
									@scrolltolower="scrolltolowerBottom">
									<view class="prodcut-list-wrap">
										<view class="list">
											<view class="item" v-for="(item, index) in product" :key="index"
												@click="gotoList(item.product_id)">
												<view class="product-cover" style="">
													<image :src="item.product_image" mode="aspectFill"></image>
												</view>
												<view class="product-info" style="">
													<view class="product-title">
														{{ item.product_name }}
													</view>
													<view class="already-sale">
														<text>{{$nw("已售")}}{{ item.product_sales }}{{$nw("件")}}</text>
													</view>
													<view class="price"
														v-if="item.buy_auth.can_buy>0||item.buy_auth.no_price==0">
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
					</view> -->
				</view>

				<!-- 广告位 -->
				<!-- <view class="ad_style" v-if="adinfo.supply_bottom">
					<image :src="adinfo.supply_bottom" mode="widthFix"></image>
				</view> -->
				<!-- 没有记录 -->
				<view class="d-c-c p30" v-if="listData.length==0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
				</view>
				<uni-load-more v-else :loadingType="loadingType"></uni-load-more>

			</view>

		</scroll-view>

		<Tabbar v-if="show_menu"></Tabbar>
	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	import uniLoadMore from "@/components/uni-load-more.vue";
	import Tabbar from "@/components/tabbar/tabbar.vue";

	export default {
		components: {
			uniLoadMore,
			Tabbar
		},
		data() {
			return {
				show_menu: false,
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*顶部刷新*/
				topRefresh: false,
				/*底部加载*/
				loading: true,
				/*没有更多*/
				no_more: false,
				/*类别选中*/
				type_active: 0,
				/*价格选中*/
				price_top: false,
				/*商品列表*/
				listData: [],
				/*当前页面*/
				page: 1,
				category_id: 0,
				search: '',
				sortType: '',
				sortPrice: 0,
				list_rows: 10,
				last_page: 0,
				supply: {
					image_url: '',
					name: '',
					introduce: ''
				},
				supply_id: 0,
				bannerData: [],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				indicatorActiveColor: '#ffffff',
				product_column: 'one_column',
				adinfo: {},
				category: [],
				currentTabbar: 0,
				product: [],
				childlist: [],
				select_index: 0,
				show_type: 50,
			};
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
			}
		},
		onShow() {
			let self = this;
			self.isTabbar(self, "plus/pages/supply/detail/detail", function(res) {
				self.show_menu = res;
			})
			uni.setNavigationBarTitle({
				title: self.$nw("店铺主页")
			})
		},
		onLoad(e) {
			// 商家id
			let scene = utils.getSceneData(e);
			this.supply_id = e.supply_id ? e.supply_id : (scene.supply_id ? scene.supply_id : 0);
			let current_supply_id = uni.getStorageSync('currentSupplyId');
			if (!this.supply_id && current_supply_id) {
				this.supply_id = current_supply_id;
			}
		},
		mounted() {
			this.setGlobalColor()
			this.init();
			/*获取产品列表*/
			console.log("11111111")
			this.getSupply();
			if (this.supply_id) {
				this.getData();
				this.getBanner();
				this.getAdImg();
			}
		},
		onPullDownRefresh() {
			/*下拉到顶，页面值还原初始化*/
			this.restoreData();
			this.getData();

		},
		onShareAppMessage() {
			// 构建分享参数
			let title = this.supply.name;
			return {
				title: title,
				path: "/plus/pages/supply/detail/detail?supply_id=" + this.supply.supply_id
			};
		},
		onShareTimeline(){
			// 构建分享参数
			let title = this.supply.name;
			return {
				title: title,
				path: "/plus/pages/supply/detail/detail?supply_id=" + this.supply.supply_id
			};
		},
		methods: {
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.phoneHeight = res.windowHeight;
						self.scrollviewHigh = res.windowHeight;
					}
				});
			},
			/*还原初始化*/
			restoreData() {
				this.listData = [];
				this.search = '';
			},

			/*选择分类*/
			selectCategory(e) {
				this.page = 1;
				this.product = [];
				this.select_index = e;
				console.log()

				this.currentTabbar = this.listData[e].category_id
				this.getSecondProduct()

				if (this.listData[e].child) {
					this.childlist = this.listData[e].child;

					if (this.show_type == 40) {
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
			scrolltolowerBottom() {
				console.log("碰低触发")
				this.page += 1;
				this.getSecondProduct()
			},
			/*获取数据*/
			getData() {
				let self = this;
				if (self.product_column == "category") {
					uni.showLoading({
						title: self.$nw("加载中")
					});
					self._get('product.category/index', {
						supply_id: self.supply_id
					}, function(res) {
						self.listData = res.data.list;
						self.show_type = res.data.template.category_style;
						console.log(" res.data.", res.data)
						self.currentTabbar = self.listData[0].category_id
						self.getSecondProduct();

						if (self.listData[0].child) {
							self.childlist = self.listData[0].child;
							//获取二级分类下的产品
							if (self.show_type == 40) {
								self.currentTabbar = self.childlist[0].category_id
								self.getSecondProduct();
							}

						}

						uni.hideLoading();
					});
				} else {
					let page = self.page;
					let list_rows = self.list_rows;
					let supply_id = self.supply_id;
					let search = self.search;
					self.loading = true;
					self._get('product.product/lists', {
						page: page || 1,
						supply_id: supply_id,
						search: search,
						// category_id: category_id,
					}, function(res) {
						self.loading = false;
						self.listData = self.listData.concat(res.data.list.data);
						self.listData = self.getUnique(self.listData, "product_id");
						self.last_page = res.data.list.last_page;
						if (res.data.list.last_page <= 1) {
							self.no_more = true;
						}
					});
				}

			},
			getSecondProduct() {
				let self = this;

				let category_id = self.currentTabbar;

				self.loading = true;

				let list_rows = self.list_rows;
				let search = self.search;
				self._get('product.product/lists', {
					page: self.page || 1,
					category_id: category_id,
					supply_id: self.supply_id,
					list_rows: list_rows,
					search: search
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
			/*获取供应商数据*/
			getSupply() {
				let self = this;
				let supply_id = self.supply_id;
				self._get('plus.supply.supply/detail', {
					supply_id: supply_id,
				}, function(res) {
					self.supply = res.data.supply;
					if (self.supply) {
						self.product_column = res.data.supply.product_show;
					}
					console.log("触发了吗", self.supply_id)
					if (!self.supply_id) {
						console.log("触发了吗")
						self.supply_id = res.data.supply.supply_id;

					}
					self.getBanner();
					self.getData();
					// self.getAdImg();


				});
			},
			// 获取banner数据
			getBanner() {
				let self = this;
				let supply_id = self.supply_id;
				self._get('plus.banner.banner/index', {
					supply_id: supply_id
				}, function(res) {
					self.bannerData = res.data.list.data;

				});
			},
			/*跳转产品*/
			gotoList(e) {
				if (e) {
					let url = 'main/pages/product/detail/detail?product_id=' + e
					this.gotoPage(url);
				}

			},
			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {

				let self = this;
				self.bottomRefresh = true;
				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					self.no_more = true;
					return;
				}
				self.getData();
			},
			// 信息提交
			formSubmit: function(e) {
				let self = this;
				self.listData = [];
				self.page = 1;
				self.no_more = false;
				self.loading = true;
				self.search = e.detail.value.keword;
				self.product = [];
				self.getData();
			},

			// 显示店铺二维码
			showSupplyQrcode() {

				let url = 'plus/pages/supply/qrcode/qrcode?supply_id=' + this.supply_id
				this.gotoPage(url);
			},
			/*
			 * 获取广告图片
			 */
			getAdImg() {
				// let self = this;
				// let supply_id = self.supply_id;
				// self._get('plus.supply.supply/getAdImg', {
				// 	supply_id: supply_id
				// }, function(res) {
				// 	self.adinfo = res.data.adinfo;
				// });
			}
		}
	};
</script>

<style lang="scss" scoped>
	.tabbar-wrapper {
		width: 100%;
		overflow-x: auto;
		white-space: nowrap;
		background-color: #ffffff;
		padding: 24rpx 0;

		& .tabbar-item {
			width: 25%;
			text-align: center;
			display: inline-block;
			padding: 10rpx 0;
			position: relative;

			&__active {
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

	.search-box {
		font-size: 28rpx;
		padding: 20rpx;
		background-color: #fff;
	}

	.search-box .search-content {
		position: relative;
		background-color: #f6f6f6;
		border-radius: 40rpx;
		display: block;
	}

	.search-input {
		display: block;
		height: 40px;
		width: 580rpx;
		padding: 0 10px 0 20px;
		background: #f4f4f4;
		color: #333;
		border-radius: 40rpx;
	}

	.search-text {
		display: flex;
		position: relative;
		width: 100%;
		height: 100%;
		line-height: 80rpx;
		// transform: translateY(-50%);
	}

	.search {
		position: absolute;
		top: 50%;
		right: 10rpx;
		transform: translateY(-50%);
		// font-size: 20px;
		z-index: 10;
		color: #89899a;
		width: 80rpx;
		line-height: 80rpx;
	}

	.search button {
		background: none;
	}

	.inner-tab {
		position: relative;
		height: 80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-bottom: 1px solid #dddddd;
		background: #ffffff;
		box-shadow: 0 8rpx 12rpx 0 rgba(0, 0, 0, .1);
		z-index: 9;
	}

	.inner-tab .item {
		flex: 1;
		font-size: 30rpx;
	}

	.inner-tab .item.active,
	.inner-tab .item .arrow.active .iconfont {
		color: $dominant-color;
	}

	.inner-tab .item .box {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: row;
	}

	.inner-tab .item .arrows {
		margin-left: 10rpx;
		line-height: 0;
	}

	.inner-tab .item .iconfont {
		line-height: 24rpx;
		font-size: 24rpx;
	}

	.inner-tab .item .arrow,
	.inner-tab .item .svg-icon {
		width: 20rpx;
		height: 20rpx;
	}

	.prodcut-list-wrap .list {
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		flex-wrap: wrap;
	}

	.prodcut-list-wrap .list .item {
		width: 94%;
		border-radius: 20rpx;


		padding-bottom: 20rpx;
		overflow: hidden;
		background: #ffffff;
		box-shadow: 0 0 8rpx rgba(0, 0, 0, .1);
		margin-bottom: 10rpx;
	}

	.prodcut-list-wrap .list .item:nth-child(2n+0) {
		margin-right: 0;
	}

	.prodcut-list-wrap .product-video-cover,
	.prodcut-list-wrap .product-cover,
	.prodcut-list-wrap .product-cover image {
		width: 350rpx;
		height: 350rpx;
	}

	.prodcut-list-wrap .product-info {
		padding: 0 24rpx;
	}

	.prodcut-list-wrap .product-title {
		height: 80rpx;
		margin-top: 20rpx;
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 28rpx;
		line-height: 40rpx;
	}

	// .prodcut-list-wrap .already-sale {
	// 	font-size: 30rpx;
	// 	font-weight: bold;
	// }
	// .prodcut-list-wrap .already-sale>text{
	// 	padding: 6rpx 10rpx;
	// 	background-color: #f2f2f7;
	// }

	.prodcut-list-wrap .price {
		color: $dominant-color;
		font-size: 24rpx;
	}

	.prodcut-list-wrap .price .num {
		font-size: 30rpx;
		font-weight: bold;
	}

	.supply-item {
		padding: 10px 10px 0 10px;
		background: #fff;
		margin-top: 10rpx;

		.supply-title {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: center;
			margin-left: 16rpx;
		}
	}

	// .supply-item .cmt-user{
	// 	background-color: #fff;
	// }
	.supply-item .left {
		display: flex;
	}

	.supply-item .supply {
		width: 140rpx;
		height: 140rpx;
		border-radius: 8rpx;
		// background: #f1f1f1;
		overflow: hidden;
	}

	.supply-item .name {
		// width: 480rpx;
		line-height: 48rpx;
		overflow: hidden;
		-webkit-line-clamp: 1;
		// padding: 0 16rpx 16rpx 16rpx;
		font-size: 36rpx;
	}

	.supply-item .supply-desc {
		// width: 480rpx;
		// line-height: 28rpx;
		overflow: hidden;
		-webkit-line-clamp: 2;
		// padding: 16rpx;
		font-size: 28rpx;
		color: #757575;
		margin-top: 10rpx;

		&.empty {
			color: #999;
		}
	}

	.diy-banner-box,
	.diy-banner-box .swiper {
		width: 750rpx;
		height: 310rpx;
	}

	.diy-banner-box image {
		margin: 20rpx 20rpx 0;
		width: 710rpx;
		height: 290rpx;
		border-radius: 16rpx;
	}

	.supply-bar {
		padding: 10rpx;
		background: #fff;
		top: 0;
		border: none;
		width: 100%;
		min-width: 100%;
		box-shadow: 0px 4rpx 10rpx 0 rgba(0, 0, 0, 0.1);
		z-index: 99;
		overflow: hidden;

		.supply-title {
			display: flex;
			flex: 1;
			flex-direction: column;
			justify-content: center;
			margin-left: 16rpx;
		}
	}

	.supply-bar .left {
		display: flex;
	}

	.supply-bar .supply_logo {
		width: 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
	}

	.supply-bar .name {
		// width: 440rpx;
		line-height: 48rpx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		// padding: 0 10rpx 10rpx 10rpx;
		font-size: 26rpx;
		// height: 30rpx;
		margin-top: 10rpx;
	}

	.supply-bar .desc {
		width: 440rpx;
		// line-height: 26rpx;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		// padding: 10rpx;
		font-size: 24rpx;
		color: #757575;
		// height: 40rpx;
		margin-top: 10rpx;

		&.empty {
			color: #999;
		}
	}

	.supply-bar .btn-supply {
		width: 80rpx;
		height: 80rpx;
		padding-left: 0rpx;
		padding-right: 0rpx;
		background-color: #fff;
		text-align: center;
		margin-top: 20rpx;
	}

	.supply-bar .btn-supply .icon-image-style {
		width: 40rpx;
		height: 40rpx;
		margin: auto;
	}

	.supply-bar .btn-supply i {
		line-height: 1;
		font-size: 50rpx;
		color: #242424;
	}

	.supply-bar .btn-supply .text-desc {
		height: 20rpx;
		font-size: 20rpx;
		text-align: center;
	}

	.video-style {
		width: 750rpx;
		height: 430rpx;
		margin: 10rpx 0;
	}

	.video-style video {
		width: 100%;
	}

	.zhanwei {
		height: 30rpx;
	}

	.product-item-box1 {
		// margin-left: calc((750rpx - 94vw)/2);
		margin-bottom: 10rpx;
		width: 100%;
		border-radius: 20rpx;
		border: 1rpx solid #e1e1e1;
		background-color: #FFFFFF;
	}

	.product-item-box1 .product-cover {
		background-color: #FFFFFF;
		width: 750rpx;
		height: 750rpx;
	}

	.product-item-box1 .product-cover-video {
		background-color: #FFFFFF;
		width: 750rpx;
		height: 422rpx;
	}

	.product-item-box1 .product-cover-video image {
		width: 100%;
		height: 100%;
	}

	.product-item-box1 .product-cover image {
		width: 100%;
		height: 100%;
	}

	.product-item-box1 .product-cover video {
		width: 100%;
		height: 100%;
	}

	.product-title1 {
		margin-top: 20rpx;
		margin-left: 15rpx;
		font-size: 20px;
		padding-bottom: 20rpx;

	}

	.product-item-box6 {
		padding-left: 20rpx;
		padding-right: 20rpx;
		font-size: 40rpx;
	}

	.subtitle {
		color: #999999;
		padding: 0 20rpx;
		font-size: 30rpx;
	}

	.f44 {
		text-align: right;
		/* padding-bottom: 20rpx; */
	}

	.f33,
	.f44 {
		color: #999999;
	}

	.product-item-box5 {
		padding-left: 20rpx;
		text-align: left;
		padding-bottom: 20rpx;
	}

	.ad_style {
		width: 750rpx;
	}

	.ad_style image {
		width: 100%;
	}

	.cotegory-type {
		line-height: 40rpx;
		background: #ffffff;
	}

	.cotegory-type-4 {
		display: flex;
	}

	.cotegory-type-4 .category-tab {
		width: 200rpx;
		background: #FFFFFF;
		border-right: 1px solid #e3e3e3;
	}

	.cotegory-type-4 .category-tab .item {
		padding: 40rpx 0;
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

	.product-list .column__2 .product-title {
		height: 80rpx;
		line-height: 40rpx;
		margin-top: 20rpx;
	}

	.product-list .column__2 .product-info {
		padding: 0 14rpx;
	}

	.product-list .column__2 .price {
		margin-top: 10rpx;
		font-size: 30rpx;
	}

	.product-list {
		width: 100%;

		.column__2 {
			width: 100%;
			display: flex;
			flex-wrap: wrap;
			justify-content: flex-start;
		}
	}

	.product-list .column__2 .product-item {
		width: calc(50% - 12rpx);
		border-radius: 20rpx;
		margin-right: 20rpx;
		margin-bottom: 20rpx;
		overflow: hidden;
		background: #ffffff;
		box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);

		&:nth-of-type(2n) {
			margin-right: 0;
		}
	}

	.column__2 .product-cover {
		width: 100%;
		height: 330rpx;
	}

	.column__2 .product-item {
		width: 45.5%;
	}
</style>