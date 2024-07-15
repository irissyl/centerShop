<template>
	<view class="article-list-wrap">
		<view class="top-tabbar">
			<scroll-view scroll-x="true" scroll-with-animation="true">
				<view class="type-list d-s-c">
					<view :class="type_active == 0 ? 'tab-item  active' : 'tab-item '"  @click="tabTypeFunc(0)">
						{{$nw("全部")}}
					</view>
					<view :class="type_active == 0 ? 'tab-item  active' : 'tab-item '"  @click="tabTypeFunc(1)">
						{{$nw("已赠送")}}
					</view>
					<view :class="type_active == 0 ? 'tab-item  active' : 'tab-item '"  @click="tabTypeFunc(2)">
						{{$nw("已接收")}}
					</view>
					<!-- <view :class="type_active == item.category_id ? 'tab-item  active' : 'tab-item '" v-for="(item, index) in categorys" :key="index" @click="tabTypeFunc(item.category_id)">
						{{ item.name }}
					</view> -->
				</view>
			</scroll-view>
		</view>

		<template>
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50" @scrolltolower="scrolltolowerFunc">
				<view class="article-list">
					<view class="item" v-for="(item, index) in listData" :key="index" >
						<view class="pic" ><image src="http://wx-cdn.jiujiuyunhui.com/20191225190430008d44467.png" mode="aspectFill"></image></view>
						<view class="info">
								<view class="status">
									<button type="warn" >{{ item.status }}</button>
								</view>
								<view class="title">{{ item.product_name }}</view>
							<view class="summary">{{$nw("编号")}}：{{ item.number }}</view>
							<view class="user">{{$nw("赠送人")}}：{{ item.user }}</view>
								<view class="user1">{{ item.time }}</view>
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
			type_active: 0
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
    this.setGlobalColor()
		this.init();
		/*获取分类*/
		// this.getCategory();
		/*获取新闻列表*/
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
					let view = uni.createSelectorQuery().select('.top-tabbar');
					view.boundingClientRect(data => {
						let h = _this.phoneHeight - data.height;
						_this.scrollviewHigh = h;
					}).exec();
				}
			});
		},

		/*获取文章分类*/
		// getCategory() {
		// 	let self = this;
		// 	self._get('plus.transfer.transfer/category', {}, function(res) {
		// 		// console.log(res.data.category);
		// 		self.categorys = res.data.category;
		// 	});
		// },

		/*tab切换*/
		tabTypeFunc(e) {
			if(e!=this.type_active){
				this.type_active=e;
				// console.log(this.type_active);
				this.page=1;
				this.listData=[];
				this.getData();
			}
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
				'plus.transfer.transfer/index',
				{
					page: page || 1,
					list_rows: list_rows,
					category_id:self.type_active
				},
				function(res) {
					console.log(res.data.list.data);
					self.listData = self.listData.concat(res.data.list.data);
					self.listData = self.getUnique(self.listData,"transfer_id");
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
			uni.navigateTo({
				url: '/plus/pages/article/detail/detail?article_id=' + e
			});
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
	/* border-bottom: 4rpx solid #E2231A; */
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
	margin-left: 5px;
	font-size: 36rpx;
	padding-top: 20px;
}

.article-list .item .status {
	width: 30%;
	height: 20px;
	/* padding-top: 10px; */
	float: right;
	text-align: right;
	font-size: 25rpx;
}
.article-list .item .summary {
	float: left;
	margin-top: 20rpx;
	margin-left: 5px;
	font-size: 28rpx;
	color: #999999;
}
.article-list .item .user {
	/* float: right; */
	/* margin-top: 10rpx; */
	/* padding-top: 20px; */
	text-align: right;
	font-size: 28rpx;
	color: #999999;
}
.article-list .item .user1 {
	float: right;
	text-align: left;

	padding-top: 10px;

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
	padding-left: 15rpx;
}

.article-list .item .pic,
.article-list .item .pic image {
	width: 160rpx;
	height: 160rpx;
}

.article-list .item .datatime {
	float: right;
	text-align: right;
	margin-top: 20rpx;
	/* margin-left: 100px; */
	font-size: 25rpx;
	color: #999999;
}
</style>
