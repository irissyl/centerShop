<template>
	<view class="article-list-wrap">
		 <view class="top-tabbar1">
			<Tabbara :tabbar_list="categorys" type="2" @tabbarEmit="tabbarEmit"></Tabbara>
		</view>
		

		<template>
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50" @scrolltolower="scrolltolowerFunc">
				<view class="article-list">
					<view class="item" v-for="(item, index) in listData" :key="index" @click="gotoDetail(item.article_id)">
						<view class="info">
							<view class="title">{{ item.article_title }}</view>
							<view class="summary">{{ item.dec }}</view>
							<view class="datatime d-s-c">
								<text>{{ item.create_time }}</text>
								<text class="icon iconfont icon-chakan ml30"></text>
								<text class="ml10">{{ item.actual_views }}</text>
							</view>
						</view>
						<view class="pic" v-if="item.image != null"><image :src="item.image.file_path" mode="aspectFill"></image></view>
					</view>
				</view>

				<!-- 没有记录 -->
				<view class="d-c-c p30" v-if="listData.length == 0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
				</view>
				<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
			</scroll-view>
			
			<Tabbar v-if="show_menu"></Tabbar>
		</template>
		<service :itemData="t_service"></service>
	
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more.vue';
import Tabbar from '@/components/tabbar/tabbar.vue';
import Tabbara from '@/components/tabbar/tabbara.vue';
	import service from '@/components/diy/service/service';
	
export default {
	components: {
		uniLoadMore,
		Tabbar,
		Tabbara,
		service
		
	},
	data() {
		return {
			t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
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
			currentParent:0,
			showFirst:1,
			show_menu:false,
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
		/*获取分类*/
		this.getCategory();
		/*获取新闻列表*/
		this.getData();
    this.setGlobalColor()
	},
	onShow() {
		uni.setNavigationBarTitle({
			title:this.$nws("资讯")
		})
	},
	methods: {
		/**
		 * 设置分享内容
		 */
		onShareAppMessage() {
			let self = this;
			return {
				title: "商会动态",
				path: '/plus/pages/article/list/list'
			};
		},
		/*初始化*/
		init() {
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					_this.phoneHeight = res.windowHeight;
					// 计算组件的高度
					let view = uni.createSelectorQuery().select('.top-tabbar1');
					view.boundingClientRect(data => {
						let h = _this.phoneHeight - data.height;
						_this.scrollviewHigh = h;
					}).exec();
				}
			});
			
			let self = this;
			self.isTabbar(self, "plus/pages/article/list/list", function(res) {
				self.show_menu = res;
			})
		},

		/*获取文章分类*/
		getCategory() {
			let self = this;
			self._get('plus.article.article/category', {}, function(res) {
				self.categorys = res.data.category;
			});
		},


		tabbarEmit(index){
			this.page=1;
			this.listData=[];
			for(var i=0;i<this.categorys.length;i++){
				this.categorys[i].flag = false;
			}
			
			this.categorys[index].flag = true;
			this.type_active = this.categorys[index].category_id
			if(this.categorys[index].child){
				uni.setNavigationBarTitle({
					title:this.categorys[index].name
				})
				this.categorys = this.categorys[index].child;
			}
			this.getData();
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
				'plus.article.article/index',
				{
					page: page || 1,
					list_rows: list_rows,
					category_id:self.type_active
				},
				function(res) {
					self.listData = self.listData.concat(res.data.list.data);
					self.listData = self.getUnique(self.listData,"article_id");
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
			// #ifdef APP
				let url='/plus/pages/article/detail/detail?article_id=' + e + '&from_user_id=0'
				uni.navigateTo({url})
			// #endif
			
			// #ifdef H5
				let url='/plus/pages/article/detail/detail?article_id=' + e + '&from_user_id=0'
				uni.navigateTo({url})
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
.article-list-wrap .type-list .tab-item.active{
	border-bottom: 4rpx solid #E2231A;
	margin-bottom: 0;
}

.article-list {
	background: #ffffff;
}

.article-list .item {
	padding: 10rpx;
	padding-left: 20rpx;
	border-right: 20rpx;
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
