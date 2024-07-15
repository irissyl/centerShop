<template>
	<view class="article-list-wrap">
		<view class="top-tabbar">
		<!-- 搜索框 -->
		
		</view>

		<template>
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50" @scrolltolower="scrolltolowerFunc">
				<view class="article-list">
					<view class="item" v-for="(item, index) in listData" :key="index"  @click="gotoDetail(item.user_id)">
						<view class="pic" ><image :src= " item.avatarUrl "   mode="aspectFill"></image></view>
						<view class="info">
								
								<view class="title"> {{$nw("代理名称")}}：{{  item.nickName   }}</view>							
							<view class="summary">{{$nw("手机号码")}}：{{  item.mobile   }}</view>						
												
							
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
			// categorys: [],
			/*当前选中的类别*/
			type_active: 0,
			search:'',
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
		// this.getCategory();
		/*获取新闻列表*/
		this.getData();
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
					let view = uni.createSelectorQuery().select('.top-tabbar');
					view.boundingClientRect(data => {
						let h = _this.phoneHeight - data.height;
						_this.scrollviewHigh = h;
					}).exec();
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
				'plus.choose.agent/index',
				{
					page: page || 1,
					list_rows: list_rows,
					category_id:self.type_active
				},
				function(res) {
					console.log(res.data);
					self.listData = self.listData.concat(res.data.list.data);
					self.listData = self.getUnique(self.listData,"user_id");
					self.last_page = res.data.list.last_page;
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}
					self.loading = false;
					uni.hideLoading();
				}
			);
		},
		
		
		/*跳转搜索页面*/
		gotoSearch() {
			uni.navigateTo({
				url: '/pages/choose/search/search'
			});
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
		/*选择完代理商跳转到首页*/
		gotoDetail(e) {			
			// console.log(e);			
		let user_id = e;
		let self = this;
		uni.setStorage({
		key:'agent_id',
		data:user_id
		});
		
		uni.showModal({
			    title: self.$nw("提示"),
			    content: self.$nw("你是否选择该用户作为你的代理商"),
			    success: function (res) {
			        if (res.confirm) {
			           self._get(
			           	'plus.choose.agent/choose',
			           	{
			           		user_id: user_id
			           	},	
			           function(res){
			           	uni.switchTab({
			           		url: '/pages/index/index'
			           	});
			           }
			           );
			        } else if (res.cancel) {
			            console.log('用户点击取消');
			        }
			    }
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
	font-size: 20rpx;
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
	font-size: 20rpx;
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
