<template>
	<view>
		<view class="prodcut-list-wrap">
			<Tabbara :tabbar_list="tabbar" type="3" @tabbarEmit="tabbarEmit"></Tabbara>
				
			
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			 @scrolltolower="scrolltolowerFunc">
				<view :class="topRefresh?'top-refresh open':'top-refresh'">
					<view class="circle" v-for="(circle,n) in 3" :key="n"></view>
				</view>
				<view class="list">
					<view class="item" v-for="(item, index) in listData" :key="index" 
					@click="gotoDetail(item.product_id,index,item)">
						<view class="product-cover">
							<image :src="item.product.product_image" mode="aspectFill"></image>
						</view>
						<view class="product-info">
							<view class="product-title">
								{{item.product.product_name}}
							</view>
							<!-- <view class="already-sale">
								<text>已售{{item.product.product_sales}}件</text>
							</view> -->
							<view class="d-b-c mt20" >
								<view class="price" >
									<text v-if="item.type =='collect_product'">
										{{$nw("¥")}}<text class="num">{{item.product.product_price}}</text>
										
									</text>
									
								</view>
								<view class="icon-box d-c-c gray6" @click.stop="onCollect(index)" >
									<span class="icon iconfont icon-lajitong mr10"></span>
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
	import Tabbara from '@/components/tabbar/tabbara.vue';
    import uniLoadMore from "@/components/uni-load-more.vue";
	export default {
        components: {
            uniLoadMore,
			Tabbara
        },
		data() {
			return {
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
				tabbar:[{
					id:1,
					name:"文章",
					flag:true,
					val:"collect_article"
				},{
					id:2,
					name:"视频",
					flag:false,
					val:"collect_video"
				},{
					id:3,
					name:"产品",
					flag:false,
					val:"collect_product"
				}],
				select_code:"collect_article"
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
			
		},
		onPullDownRefresh() {
			/*下拉到顶，页面值还原初始化*/
			this.page++;
			this.getData();
		},
		onShow() {
			/*获取产品列表*/
			this.getData();
		},
		methods: {
			tabbarEmit(index){
				this.page = 1;
				this.listData = [];
				this.tabbar.forEach(function(re) {
					re.flag = false;
				})
				this.tabbar[index].flag = true;
				this.select_code = this.tabbar[index].val;
				this.getData();
			},
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.scrollviewHigh = res.windowHeight;
					}
				});
			},

			/*获取数据*/
			getData() {
				let self = this;
				let page = self.page;
				let list_rows = self.list_rows;
				let search = self.search;
				self.loading = true;
				self._get('product.collect/lists', {
					page: page || 1,
					search: search,
					list_rows: list_rows,
					type:self.select_code,
				}, function(res) {
					self.loading = false;
					self.listData = self.listData.concat(res.data.list.data);
					self.listData = self.getUnique(self.listData,"collect_id");
					self.last_page = res.data.list.last_page;
					if(res.data.list.data.length <= 0){
						self.page--;
					}
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}
				});
			},

			/*删除*/
			onCollect(i,msg='') {
				let self = this;
				let d = self.listData[i];
				if(!msg){
					msg= self.$nw("您确定要删除该收藏吗?")
				}
				wx.showModal({
					title: self.$nw("提示"),
					content: msg,
					success: function(o) {
						o.confirm && self._get('product.collect/add', {
							id:d.collect_id,
							product_id: d.product_id,
							type:d.type,
						}, function(result) {
							if (result.code == 1) {
								uni.showToast({
									title: self.$nw("删除成功"),
									duration: 2000
								});
								self.listData.splice(i,1);
							}
						});
					}
				});
			},

			/*跳转产品列表*/
			gotoDetail(e,i,item) {
				let self = this;
				console.log(item.type);
				if(item.type == "collect_region" 
				 || item.type == "collect_article"
				 || item.type == "collect_video"){
					this.gotoPage(item.url);
				}else if(item.type == "collect_product"){
					let d = self.listData[i].product;
					if(d.product_status.value==20){
						self.onCollect(i,self.$nw("商品已下架,点击确定移除用户的收藏列表"));
					}else{
						let url='main/pages/product/detail/detail?product_id=' + e
						this.gotoPage(url);
					}
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
			}
		}
	};
</script>

<style lang="scss">
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
		border-bottom: 16rpx solid #f6f6f6;
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
		display: -webkit-box;
		line-height: 40rpx;
		// height: 80rpx;
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
	.icon-collect {
		width: 25px;
		height: 25px;
	}
</style>
