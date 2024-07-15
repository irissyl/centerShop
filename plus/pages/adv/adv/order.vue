<template>
	<view>
		<view class="prodcut-list-wrap">
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			 @scrolltolower="scrolltolowerFunc">
				<view :class="topRefresh?'top-refresh open':'top-refresh'">
					<view class="circle" v-for="(circle,n) in 3" :key="n"></view>
				</view>

				<view class="list" >
					<view  v-for="(item, index) in listData" :key="index" >
						<view class="item" >
							<view class="product-info">
								<view class="product-title ">
								{{$nw("广告位名")}}：{{item.adv.name}}
								</view>
								<view class="product-title ">
									{{$nw("购买时长")}}：{{item.days}} {{$nw("天")}}
								</view>
								<view class="product-title ">
									{{$nw("支付时间")}}：{{item.pay_time}}
								</view>
								<view class="product-title">
									{{$nw("广告状态")}}：<text>{{item.status_text}}</text>
								</view>
								<view class="product-title " v-if="item.status==4">
									{{$nw("到期时间")}}：{{item.end_time_text}}
								</view>
								<view class="order-bts">
									<button  class="btn-normal" @click="gotoDetail(item.order_id)" >{{$nw("管理广告")}}</button>
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
				/*商品列表*/
				listData: [],
				/*当前页面*/
				page: 1,
				list_rows: 10,
				/*最后一页码数*/
				last_page: 0,
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
						console.log(res)
						_this.phoneHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
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
			/*获取数据*/
			getData() {
				let self = this;
				let page = self.page;
				let list_rows = self.list_rows;
				self.loading = true;
				self._get('plus.adv.order/lists', {
					page: self.page,
					list_rows: self.list_rows,
				}, function(res) {
					self.loading = false;
					self.listData = self.listData.concat(res.data.list.data);
					self.listData = self.getUnique(self.listData,"order_id");
					console.log(self.listData)
					self.last_page = res.data.list.last_page;
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}else{
						self.no_more = false;
					}
				},function(res){
					uni.redirectTo({
						url:'/user/pages/index/index'
					});
				});
			},
			/*跳转产品列表*/
			gotoDetail(order_id) {
				let url='plus/pages/adv/order/order?order_id=' + order_id
				this.gotoPage(url);
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

	.prodcut-list-wrap .list {
		background: #efefef;
	}

	.prodcut-list-wrap .list .item {
		padding: 20rpx;
		display: flex;
		background-color: #ffffff;
		margin-bottom: 10rpx;
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
		line-height: 60rpx;
		height: 60rpx;
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
	.order-bts{
		margin-top: 10rpx;
	}
	.prodcut-list-wrap .list .order-bts button {
		margin: 0 auto;
		padding: 0 20rpx;
		height: 60rpx;
		width: 200rpx;
		line-height: 60rpx;
		// border-radius: 30rpx;
		font-size: 24rpx;
		border: 1px solid #CCCCCC;
		white-space: nowrap;
		// background: #FFFFFF;
	}

</style>
