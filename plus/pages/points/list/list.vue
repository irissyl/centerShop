<template>
	<scroll-view scroll-y="true" :style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'"
		@scrolltolower="in_scrolltolower">
		<Ad location_id="points_shop_top" :interval="1500"></Ad>

		<view class="prodcut-list-wrap" :style="'background:'+getMainColor()+';'" v-if="!is_diy_model">
			<view class="list">
				<view class="item" v-for="(item, index) in listData" :key="index"
					@click="gotoList(item.point_product_id)">
					<view class="product-cover">
						<image :src="item.product_image" mode="aspectFit"></image>
					</view>
					<view class="product-info">
						<view class="product-title">{{ item.product.product_name }}</view>
						<view class="price">
							{{$nw("¥")}}
							<text class="num">{{ item.sku[0].point_money }}</text>
							<text class="f30">+</text>
							<text class="num">{{ item.sku[0].point_num }}</text>
							{{$nw("积分")}}
						</view>
						<view class="already-sale d-b-c">
							<text>{{$nw("还剩")}}{{ item.stock }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 没有记录 -->
			<view class="d-c-c p30" v-if="listData.length <= 0">
				<text class="iconfont icon-wushuju"></text>
				<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
			</view>
			<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
		</view>
		<view v-else>
			<diy :diyItems="items"></diy>
			<Tabbar></Tabbar>
		</view>
		
		<service :itemData="t_service"></service>
		
	</scroll-view>

</template>

<script>
	import uniLoadMore from '@/components/uni-load-more.vue';
	import Tabbar from '@/components/tabbar/tabbar.vue'
	import diy from '@/components/diy/diy.vue';
	import Ad from '@/components/ad/ad.vue';
	import service from '@/components/diy/service/service';
	
	export default {
		components: {
			Tabbar,
			uniLoadMore,
			diy,
			Ad,
			service,
			
		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				is_diy_model: true,
				/*是否加载完成*/
				loading: true,
				/*数据列表*/
				listData: [],
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
				no_more: false,
				items: [],
				page_info: '',
				scrollviewHigh:0
			};
		},
		onLoad() {
			this.getData();
		},
		onShow() {
			/*初始化*/
			this.init();
			// 设置全局颜色
			this.setGlobalColor()
			uni.setNavigationBarTitle({
				title: this.$nw("积分商城")
			});
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

		methods: {
			in_scrolltolower() {
				let self = this;
				if (self.is_diy_model) {
					return
				}
				if (self.page < self.last_page) {
					self.page++;
					self.getData();
				}
				self.no_more = true;
			},
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.scrollviewHigh = res.windowHeight;

					}
				});
			},
			/*设置页面*/
			setPage(page) {

				uni.setNavigationBarTitle({
					title: page.params.title
				});

			},
			/*获取数据*/
			getData() {
				let self = this;
				self.loading = true;
				self._get(
					'plus.points.product/index', {
						page: self.page || 1,
						list_rows: self.list_rows
					},
					function(res) {
						self.loading = false;
						self.is_diy_model = res.data.is_diy_model;
						if (!res.data.is_diy_model) {
							self.listData = self.listData.concat(res.data.list.data);
							self.listData = self.getUnique(self.listData, "point_product_id");
							self.last_page = res.data.list.last_page;
							if (res.data.list.last_page <= 1) {
								self.no_more = true;
							}
						} else {
							self.items = res.data.items.items;
							self.page_info = res.data.items.page;
							self.setPage(self.page_info);
							console.log(self.items)
						}

					}
				);
			},

			/*跳转产品列表*/
			gotoList(e) {
				uni.navigateTo({
					url: '/plus/pages/points/detail/detail?point_product_id=' + e
				});
			},

			/*分享当前页面*/
			onShareAppMessage() {
				return {}
			},

		}
	};
</script>

<style lang="scss">
	.prodcut-list-wrap .list {}

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
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.prodcut-list-wrap .product-title {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 28rpx;
	}

	.prodcut-list-wrap .price {
		padding: 8rpx 0;
		color: $dominant-color;
		font-size: 24rpx;
	}

	.prodcut-list-wrap .price .num {
		padding: 0 4rpx;
		font-size: 40rpx;
	}

	.prodcut-list-wrap .already-sale {
		color: #999;
		font-size: 24rpx;
	}

	.prodcut-list-wrap .already-sale .btn-red {
		line-height: 2;
		font-size: 28rpx;
	}
</style>