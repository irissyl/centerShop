<template>
	<view>
		<view class="top-box">
			<!-- 搜索框 -->
			<view class="index-search-box nav-item">
				<view class="index-search t-c" >
					<span class="icon iconfont icon-sousuo"></span>
					<input type="text" v-model="search" class="flex-1 ml10 f30 gray3" value="" placeholder-class="f24 gray6"
					 :placeholder="$nw('输入你要的商品')" confirm-type="search" @confirm="goSearch()"/>
				</view>
			</view>
			<view class="supply-bar border-b-e">
					<view class="left">
						<image class="supply_logo" :src="supply.image_url" mode="aspectFill"></image>
						<view class="">
							<view class="name">{{ supply.name }}</view>
							<view class="desc">{{$nw("简介")}}:{{ supply.introduce }}</view>
						</view>
						<view class="right">
							<button  @click="choose(1,supply_id,$nw('店铺首页'))" >{{$nw("选择店铺")}}</button>
						</view>
					</view>

			</view>

		</view>
		<view class="prodcut-list-wrap">
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			 @scrolltolower="scrolltolowerFunc">
				<view :class="topRefresh?'top-refresh open':'top-refresh'">
					<view class="circle" v-for="(circle,n) in 3" :key="n"></view>
				</view>
				<view class="list">
					<view  v-for="(item, index) in listData" :key="index" >
						<view class="item">
							<view class="product-cover">
								<image :src="item.product_image" mode="aspectFill"></image>
							</view>
							<view class="product-info">
								<view class="product-title">
									{{item.product_name}}
								</view>
								<view class="already-sale">
									<text>{{$nw("已售")}}{{item.product_sales}}{{$nw("件")}}</text>
								</view>
								<view class="group-hd border-b-e" >
									<view class="left">
										<text class="price" >{{$nw("¥")}}<text class="num">{{item.product_sku.product_price}}</text></text>
									</view>
									<view class="right">
										<button @click="choose(0,item.product_id,item.product_name)">{{$nw("选择该商品")}}</button>
									</view>
								</view>
							</view>
						</view>

					</view>
				</view>
				<!-- 没有记录 -->
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
				assemble_activity_id:0,
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
				supply_id:0,
				supply:{}
			};
		},
        computed:{

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
		onLoad(e) {
		},
		mounted() {
      this.setGlobalColor()
			this.init();
			/*获取产品列表*/
			this.getData();
		},
		onPullDownRefresh() {
			/*下拉到顶，页面值还原初始化*/
			this.restoreData();
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
						let view = uni.createSelectorQuery().select('.top-box');
						view.boundingClientRect(data => {
							let h = _this.phoneHeight - data.height;
							_this.scrollviewHigh = h;
						}).exec();
					}
				});
			},
			/*还原初始化*/
			restoreData() {
				this.listData = [];
				this.category_id = 0;
				this.search = '';
				this.sortType = '';
				this.sortPrice = 0;
			},
			goSearch(){
				let self = this;
				self.listData = [];
				self.page = 1;
				self.no_more = false;
				self.loading = true;
				self.getData();
			},
			/*类别切换*/
			tabTypeFunc(e) {
				let self = this;
				self.listData = [];
				self.page = 1;
				self.no_more = false;
				self.loading = true;
				self.getData();
			},

			/*获取数据*/
			getData() {
				let self = this;
				let page = self.page;
				let list_rows = self.list_rows;
				let search = self.search;
				self.loading = true;
				self._get('plus.supply.product/lists', {
					page: page || 1,
					search: search,
					list_rows: list_rows,
				}, function(res) {
					self.loading = false;
					self.listData = self.listData.concat(res.data.list.data);
					self.listData = self.getUnique(self.listData,"product_id");
					self.last_page = res.data.list.last_page;
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}
					self.supply_id = res.data.supply.supply_id
					self.supply = res.data.supply
				},function(res){
					uni.redirectTo({
						url:'/user/pages/index/index'
					});
				});
			},

			choose(type,id,name) {
				var url = 'main/pages/product/detail/detail?product_id='+id;
				if(type==1){
					var url = 'plus/pages/supply/detail/detail?supply_id='+id;
				}
				uni.setStorageSync('choose_link',url)
				uni.setStorageSync('choose_name',name)
				uni.navigateBack({
				})
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

		}
	};
</script>

<style lang="scss">
	.supply-bar{
		padding: 10rpx;
		background: #fff;
		top: 0;
		width: 100%;
		min-width: 100%;
		box-shadow: 0px 4rpx 10rpx 0 rgba(0, 0, 0, 0.1);
		z-index: 99;
		overflow: hidden;
	}
	.supply-bar .left{
		display: flex;
	}
	.supply-bar .supply_logo{
		width: 80rpx;
		height: 80rpx;
		border-radius: 20rpx;
	}
	.supply-bar .name{
		width:400rpx;
		height: 26rpx;
		overflow: hidden;
		-webkit-line-clamp: 1;
		padding: 0 10rpx 10rpx 10rpx;
		font-size: 26rpx;
	}
	.supply-bar .desc{
		width:400rpx;
		line-height: 26rpx;
		overflow: hidden;
		-webkit-line-clamp: 2;
		padding: 10rpx;
		font-size: 24rpx;
		color: #757575;
	}
	.nav-item{
		display: flex;
	}
	.nav-item .index-search{
		width: 100%;
	}
	.nav-item button{
		margin-left: 10rpx;
	}
	.inner-tab {
		position: relative;
		height: 80rpx;
		display: flex;
		justify-content: space-around;
		align-items: center;
		border-bottom: 1px solid #dddddd;
		background: #ffffff;
		box-shadow: 0 8rpx 12rpx 0 rgba(0,0,0,.1);
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
		background: #FFFFFF;
	}

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
		margin-left: 30rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.prodcut-list-wrap .product-title {
		width: 400rpx;
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
	.prodcut-list-wrap .already-sale>text{
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
	.prodcut-list-wrap .list .order-bts {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		border-bottom: 16rpx solid #f6f6f6;
	}

	.prodcut-list-wrap .list .order-bts button {
		margin: 0;
		padding: 0 20rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin-left: 20rpx;
		margin-bottom: 20rpx;
		// border-radius: 30rpx;
		font-size: 24rpx;
		border: 1px solid #CCCCCC;
		white-space: nowrap;
		// background: #FFFFFF;
	}

	.prodcut-list-wrap .list .order-bts button::after {
		display: none;
	}

	.prodcut-list-wrap .list .order-bts button.btn-border-red {
		border: 1px solid $dominant-color;
		font-size: 24rpx;
		color: $dominant-color;
	}

	.prodcut-list-wrap .list .order-bts button.btn-red {
		background: $dominant-color;
		border: 1px solid $dominant-color;
		font-size: 24rpx;
		color: #FFFFFF;
	}
</style>
