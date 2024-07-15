<template>
	<view class="article-list-wrap">


		<template>
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
				lower-threshold="50" @scrolltolower="scrolltolowerFunc">
				<view class="article-list">
					<view class="item" v-for="(item, index) in listData" :key="index"
						@click="gotoDetail(item.article_id)">
						<view class="info">
							<view class="title">{{ item.article_title }}</view>
							<view class="summary">{{ item.dec }}</view>
							<view class="datatime d-s-c">
								<text>{{ item.create_time }}</text>
								<text class="icon iconfont icon-chakan ml30"></text>
								<text class="ml10">{{ item.actual_views }}</text>
							</view>
						</view>
						<view class="pic" v-if="item.image != null">
							<image :src="item.image.file_path" mode="aspectFill"></image>
						</view>
					</view>
				</view>

				<!-- 没有记录 -->
				<view class="d-c-c p30" v-if="listData.length == 0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
				</view>
				<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
			</scroll-view>


		</template>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more.vue';

	export default {
		components: {
			uniLoadMore

		},
		data() {
			return {
				/*是否加载完成*/
				loading: true,
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*数据列表*/
				listData: [],
				/*是否有更多*/
				no_more: null,
				/*一页多少条*/
				list_rows: 10,
				/*当前第几页*/
				page: 1,
				/*分类数据*/
				categorys: [],
				/*当前选中的类别*/
				type_active: 0,
				currentParent: 0,
				showFirst: 1,
				show_menu: false,
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
		mounted() {
			this.init();
			
			this.setGlobalColor()
		},
		onShow() {
			/*获取新闻列表*/
			this.listData = [];
			this.getData();
		},
		methods: {
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
						// 计算组件的高度
						let h = _this.phoneHeight;
						_this.scrollviewHigh = h;
					}
				});

			},



			/*获取数据*/
			getData() {
				let self = this;
				let page = self.page;
				let list_rows = self.list_rows;
				self.loading = true;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				self._get(
					'plus.article.article/collect', {
						page: page || 1,
						list_rows: list_rows,

					},
					function(res) {
						self.listData = self.listData.concat(res.data.list.data);
						self.listData = self.getUnique(self.listData, "article_id");
						self.last_page = res.data.list.last_page;
						if (res.data.list.last_page <= 1) {
							self.no_more = true;
						}
						self.loading = false;
						uni.hideLoading();
					}
				);
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

			/*跳转文章详情*/
			gotoDetail(e) {
				// #ifdef H5
				let url = '/plus/pages/article/detail/detail?article_id=' + e + '&from_user_id=0'
				uni.navigateTo({
					url
				})
				// location.href = '/pages/article/detail/detail?article_id=' + e + '&from_user_id=0'
				// #endif

				//#ifdef MP
				uni.redirectTo({
					url: '/plus/pages/article/detail/detail?article_id=' + e + '&from_user_id=0'
				});
				// #endif
			}
		}
	};
</script>

<style>
	.article-list-wrap .type-list .tab-item {
		padding: 0 30rpx;
		font-size: 34rpx;
		height: 86rpx;
		line-height: 86rpx;
		white-space: nowrap;
		border-bottom: 4rpx solid #FFFFFF;
	}

	.article-list-wrap .type-list .tab-item.active {
		border-bottom: 4rpx solid #E2231A;
		margin-bottom: 0;
	}

	.article-list {
		background: #ffffff;
	}

	.article-list .item {
		padding: 30rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-bottom: 1px solid #e3e3e3;
	}

	.article-list .item .info {
		flex: 1;
		overflow: hidden;
	}

	.article-list .item .title {
		font-size: 36rpx;
	}

	.article-list .item .summary {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #999999;
	}

	.article-list .item .title,
	.article-list .item .summary {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.article-list .item .pic {
		padding-left: 30rpx;
	}

	.article-list .item .pic,
	.article-list .item .pic image {
		width: 160rpx;
		height: 160rpx;
	}

	.article-list .item .datatime {
		margin-top: 20rpx;
		font-size: 24rpx;
		color: #999999;
	}
</style>