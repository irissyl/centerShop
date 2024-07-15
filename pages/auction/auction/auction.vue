<template>
	<view class="article-list-wrap">
		<view class="top-tabbar">
			<scroll-view scroll-x="true" scroll-with-animation="true">
				<view class="type-list d-s-c">
					<view :class="type_active == 0 ? 'tab-item  active' : 'tab-item '"  @click="tabTypeFunc(0)">
						{{$nw("拍卖中")}}
					</view>
					<view :class="type_active == 1 ? 'tab-item  active' : 'tab-item '" @click="tabTypeFunc(1)">
						{{$nw("求购中")}}
					</view>
					<view :class="type_active == '' ? 'tab-item ' : 'tab-item '" >
						
					</view>
					<view class="type_active " v-if="type_active==0">  <!-- @click="drumAuction(0)"> -->
						{{$nw("我要拍卖")}}
					</view>
					<view class="type_active " v-if="type_active==1"> <!-- @click="drumAuction(1)"> -->
						{{$nw("我要求购")}}
					</view>
				</view>
			</scroll-view>
		</view>
		
		
		<view v-if="type_active==0" class="top-tabbar" style="height: 100px;margin-top: 3px;background-color: #ccc;">
			<scroll-view scroll-x="true" scroll-with-animation="true" >
				<view style="display: flex;">
				<view class="index-search-box" style="width:45%;float: left;padding: 0 !important;margin-left: 3%;" id="searchBox">
					<view class="index-search t-c" @click="">
						<span class="">{{$nw("全部")}}</span>
						<text class="ml10"></text>
					</view>
				</view>
				<view class="index-searc-box" style="width:45%;float: left;margin-left: 3%;" id="searchBox">
					<view class="index-search t-c" >
						<span class="icon iconfont icon-sousuo">{{$nw("搜索")}}</span>
						<!-- <input type="text"  v-model="form.keyWord" class="flex-1 ml10 f30 gray3" value="" confirm-type="search" @confirm="gotoSearch()" /> -->
						<text class="ml10"></text>
					</view>
				</view>
				</view>
				<view style="display: flex;margin-top: 3px;">
					<view class="index-searc-box" style="width:30%;float: left;margin-left: 2%;" id="searchBox">
						<view class="index-search t-c" @click="">
							<span class="">{{$nw("默认")}}</span>
							<text class="ml10"></text>
						</view>
					</view>
					<view class="index-searc-box" style="width:30%;float: left;margin-left: 2%;" id="searchBox">
						<view class="index-search t-c" @click="">
							<span class="">{{$nw("价格")}}</span>
							<text class="ml10"></text>
						</view>
					</view>
					<view class="index-searc-box" style="width:30%;float: left;margin-left: 2%;" id="searchBox">
						<view class="index-search t-c" @click="">
							<span class="">{{$nw("年份")}}</span>
							<text class="ml10"></text>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
		<view v-if="type_active==1" class="top-tabbar" style="height: 50px;margin-top: 3px;background-color: #ccc;">
			<scroll-view scroll-x="true" scroll-with-animation="true" >
				<view style="display: flex;">
				
				<view class="index-searc-box" style="width:94%;float: left;margin-left: 3%;" id="searchBox">
					<view class="index-search t-c">
						<span class="icon iconfont icon-sousuo" @click="search()">{{$nw("搜索")}}</span>
						<!-- <input type="text"  v-model="form.keyWord" class="flex-1 ml10 f30 gray3" value="" confirm-type="search" @confirm="gotoSearch()" /> -->
					</view> 
				</view>
				</view>	
			</scroll-view>
		</view>

		<template>
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50" @scrolltolower="scrolltolowerFunc">
				<view class="article-list">
					<view class="item" v-for="(item, index) in listData" :key="index" @click="gotoDetail(item.auction_id)">
						<view class="paimai_img" style="width: 40%;">
							<view class="pic" ><image src="http://imgh5.y01.cn/202106062321413d5321929.png" mode="aspectFill"></image></view>
							<!-- <text class="icon iconfont icon-chakan ml30"></text> -->
						</view>
						<view class="info" style="width: 60%;" v-if="item.auction_type == 2">
							<view class="auction_name waa">
								<view class="paimai">{{$nw("名称")}}</view>
								<view class="paimaidata">{{ item.auction_name }}</view>
							</view>
							<view class="auction_year waa">
								<view class="paimai">{{$nw("年份")}}</view>
								<view class="paimaidata">{{ item.auction_year }}</view>
							</view>
							<view class="auction_price waa">
								<view class="paimai">{{$nw("拍卖价")}}</view>
								<view class="paimaidata">{{ item.auction_price }}</view>
							</view>
						</view>
						<view class="info" style="width: 60%;" v-else>
							<view class="auction_name waa">
								<view class="paimai">{{$nw("名称")}}</view>
								<view class="paimaidata">{{ item.auction_name }}</view>
							</view>
							<view class="auction_number waa">
								<view class="paimai">{{$nw("编码")}}</view>
								<view class="paimaidata">{{ item.auction_number }}</view>
							</view>
							<view class="auction_price waa">
								<view class="paimai">{{$nw("拍卖价")}}</view>
								<view class="paimaidata">{{ item.auction_price }}</view>
							</view>
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
		<Tabbar></Tabbar>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more.vue';
import Tabbar from '@/components/tabbar/tabbar.vue';
export default {
	components: {
		uniLoadMore,
		Tabbar
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
			form: {
				 
			},
			arr:[],
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
		getCategory() {
			let self = this;
			self._get('plus.article.article/category', {}, function(res) {
				self.categorys = res.data.category;
			});
		},

		/*tab切换*/
		tabTypeFunc(e) {
			if(e!=this.type_active){
				this.type_active=e;
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
				'plus.auction.auction/index',
				{
					page: page || 1,
					list_rows: list_rows,
					//category_id:self.type_active
				},
				function(res) {
					self.listData = self.listData.concat(res.data.list.data);
					self.listData = self.getUnique(self.listData,"auction_id");
					self.last_page = res.data.list.last_page;
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}
					self.loading = false;
					uni.hideLoading();
				}
			);
			
		},
		/*跳转拍卖详情*/
		gotoDetail(e) {
			uni.navigateTo({
				url: '/pages/auction/detail/detail?auction_id=' + e
			});
		},
		/*跳转搜索页面*/
		gotoSearch(str) {
			let self = this;
			let page = self.page;
			let list_rows = self.list_rows;
			let search=null;
			if(str!=null){
				search=str;
			}else{
				search= this.form.keyWord;
				console.log(search);
				let arrs=this.arr;
				if(typeof search != "undefined" && search!=null && search!=''){
					arrs.push(search);
				}else{
					uni.showToast({
						title: self.$nw("请输入搜索的关键字"),
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				
			}
			self._get(
				'plus.auction.auction/index',
				{
					page: page || 1,
					list_rows: list_rows,
					search:search,
				},
				function(res) {
					self.listData = self.listData.concat(res.data.list.data);
					self.listData = self.getUnique(self.listData,"auction_id");
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

		
		/*搜索*/
		search(str) {
			let self = this;
			let search=null;
			if(str!=null){
				search=str;
			}else{
				search= this.form.keyWord;
				let arrs=this.arr;
				if(typeof search != "undefined" && search!=null && search!=''){
					arrs.push(search);
				}else{
					uni.showToast({
						title: self.$nw("请输入搜索的关键字"),
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				
			}
			uni.navigateTo({
				url: '/pages/auction/auction/auction?search=' + search,
			});
			
		},
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
.tab-item{
	padding: 0 !important;
}
.type_active{
	width: 25%;
	height: 37px;
	line-height: 37px;
	text-align: center;
	margin-right: 10px;
	font-size: 15px;
	color: rgba(0,0,0,.6);
	background-color: #ffc800;
	border-radius: 9px;
}
.paimai{
	width: 21%;
	text-align: right;
}
.paimaidata{
	padding-left: 25px;
	text-align: left;
}
.waa{
	display: flex;
}

</style>
