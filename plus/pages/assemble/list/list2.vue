<template>
	<view class="assemble-container">
		<view class="top-box">
			<!-- 搜索框 -->
			<view class="index-search t-c flex-1">
				<span class="icon iconfont icon-sousuo"></span>
				<input type="text" v-model="keyWord" class="flex-1 ml10 f30 gray3" value="" placeholder-class="f24 gray6"
				 :placeholder="$nw('输入你要搜索的商品')" confirm-type="search" @confirm="search()"/>
				 <button class="btn ml10" @click="search()" type="default">{{$nw("搜索")}}</button>
			</view>
		</view>

		<!--内容-->
		<view class="assemble-list" >
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50" @scrolltolower="scrolltolowerFunc">
				<!--列表-->
				<view class="list d-s-c f-w">
					<view class="item d-s-s d-stretch" v-for="(item, index) in listData" :key="index">
						<view class="product-cover pr">
							<image :src="item.product.file_path" mode="aspectFit"></image>
						</view>
						<view class="product-info d-b-c d-c">
							<view class="product-title text-ellipsis">{{ item.product.product_name }}</view>
							<view class="people-num f30 price" v-if="item.buy_auth.can_buy>0||item.buy_auth.no_price==0">
								<text class="f22">{{$nw("¥")}}</text>
								<text class="f40 fb">{{ item.assemble_price }}</text>
								<text class="ml10 text-d-line gray9 f24">{{$nw("¥")}}{{ item.product_price }}</text>
							</view>
							<view class="d-b-c ww100">
								<view class="f24">
									<text class="red" v-if="item.active.assemble_type==0">{{ item.assemble_num }}{{$nw("人团")}}</text>
									<text class="red" v-else>{{$nw("库存团")}}</text>
									<text class="ml10 gray6">{{$nw("已拼")}}{{ item.product_sales }}{{$nw("件")}}</text>
								</view>
								<view class="right-btn"><button type="primary" @click="gotoDetail(item)">{{$nw("去拼团")}}</button></view>
							</view>
						</view>
					</view>
				</view>
				<view class="d-c-c p30" v-if="listData.length==0 && !loading">
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
			/*顶部刷新*/
			topRefresh: false,
			/*没有更多*/
			no_more: false,
			/*可滚动视图区域高度*/
			scrollviewHigh: 0,
			/*活动类别*/
			categorys: [],
			/*当前活动Is*/
			assemble_activity_id: 0,
			/*商品列表*/
			listData: [],
			page: 1,
			last_page: 0,
			list_rows:10,
			/*是否正在加载*/
			loading: true,
			// 拼团类型
			assemble_type:0,
			keyWord:'',
		};
	},
	computed: {
		/*加载中状态*/
		loadingType(){
		    if(this.loading){
		        return 1;
		    }else{
		        if(this.listData.length!=0&&this.no_more){
		            return 2;
		        }else{
		            return 0;
		        }
		    }
		}
	},
	onLoad(e) {},
	mounted() {
    this.setGlobalColor()
		this.init();
		/*获取产品列表*/
		this.getProdct();
	},
	onReachBottom() {},
	methods: {
		/*初始化*/
		init() {
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					_this.phoneHeight = res.windowHeight;
					// 计算组件的高度
					let view = uni.createSelectorQuery().select('.top-box');
					view.boundingClientRect(data => {
						let h = _this.phoneHeight - data.height;
						_this.scrollviewHigh = h;
					}).exec();
				}
			});
		},

		/*获取商品*/
		getProdct() {
			let self = this;
			let page = self.page;
			let search = self.keyWord;
			let list_rows = self.list_rows
			self.loading = true;
			self._get(
				'plus.assemble.product/lists',
				{
					page: page || 1,
					search:search,
					list_rows: list_rows,
				},
				function(res) {
					self.loading = false;
					if(res.data.list.data.length>0){
						self.listData = self.listData.concat(res.data.list.data);
						self.listData = self.getUnique(self.listData,"assemble_product_id");
						console.log(self.listData)
						self.last_page = res.data.list.last_page;
					}
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}

				}
			);
		},

		/*跳转产品列表*/
		gotoDetail(e) {
			let url='plus/pages/assemble/detail/detail?assemble_product_id=' + e.assemble_product_id
			this.gotoPage(url);
		},

		/*跳转搜索页面*/
		search() {
			uni.hideKeyboard()
			this.page = 1;
			this.listData = [];
			this.getProdct();
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
			self.getProdct();
		},
		/*倒计时返回值*/
		returnValFunc(e){
			console.log(e);
		},
	}
};
</script>

<style lang="scss">
.assemble-container .inner-tab {
	background: $dominant-color;
}

.assemble-container .inner-tab .tab-list {
	height: 100rpx;
	display: flex;
	justify-content: flex-start;
	align-items: center;
	border-bottom: 1px solid #dddddd;
}

.assemble-container .inner-tab .item {
	height: 100rpx;
	line-height: 100rpx;
	white-space: nowrap;
	padding: 0 30rpx;
	font-size: 30rpx;
	color: #ffffff;
}

.assemble-container .inner-tab .item.active,
.assemble-container .inner-tab .item .arrow.active .iconfont {
	background: $dominant-color;
	font-weight: bold;
	font-size: 40rpx;
}

.assemble-container .inner-tab .box {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: row;
}

.assemble-container .inner-tab .arrows {
	margin-left: 10rpx;
	line-height: 0;
}

.assemble-container .inner-tab .iconfont {
	line-height: 24rpx;
	font-size: 24rpx;
}

.assemble-container .inner-tab .arrow,
.assemble-container .inner-tab .svg-icon {
	width: 20rpx;
	height: 20rpx;
}

.assemble-list .banner-image {
	width: 100%;
	box-sizing: border-box;
	padding: 20rpx;
}
.assemble-list .banner-image image {
	width: 710rpx;
	height: 294rpx;
	border-radius: 30rpx;
}

.assemble-list .ad-datetime {
}

.assemble-list .ad-datetime .box {
	padding: 4rpx;
	border-radius: 4rpx;
	background: #000000;
	color: #ffffff;
}

.assemble-list .list {
	padding: 30rpx;
}

.assemble-list .list .item {
	width: 100%;
	padding: 20rpx;
	margin-bottom: 20rpx;
	box-sizing: border-box;
	border-radius: 16rpx;
	background: #ffffff;
}

.assemble-list .product-cover {
	padding: 4rpx;
}
.assemble-list .product-cover image {
	width: 240rpx;
	height: 240rpx;
}

.assemble-list .product-info {
	flex: 1;
	padding-left: 20rpx;
	overflow: hidden;
}

.assemble-list .product-cover .people-num {
	position: absolute;
	right: 0;
	bottom: 0;
	left: 0;
	height: 50rpx;
	padding: 0 20rpx;
	line-height: 50rpx;
	font-size: 24rpx;
	box-sizing: border-box;
	background: rgba(0, 0, 0, 0.6);
}

.assemble-list .ad-datetime .box {
	padding: 4rpx;
	border-radius: 4rpx;
	background: #000000;
	color: #ffffff;
}

.assemble-list .product-title {
	width: 100%;
	height: 40rpx;
	line-height: 40rpx;
	font-size: 32rpx;
}

.assemble-list .people-num {
	width: 100%;
}

.assemble-list .already-sale {
	padding: 4rpx 0;
	color: #999;
	font-size: 24rpx;
}

.assemble-list .price {
	width: 100%;
	color: $dominant-color;
	font-size: 24rpx;
}

.assemble-list .price .num {
	padding: 0 4rpx;
}

.assemble-list .slider-box .slider {
	margin-top: 10rpx;
	height: 10rpx;
	background: #cccccc;
	border-radius: 5rpx;
}

.assemble-list .slider-box .slider-inner {
	height: 10rpx;
	background: #e2231a;
	border-radius: 5rpx;
}

.assemble-list .right-btn button {
	height: 70rpx;
	line-height: 70rpx;
	border-radius: 35rpx;
	background: #e2231a;
	color: #ffffff;
}
</style>
