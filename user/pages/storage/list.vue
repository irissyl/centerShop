<template style="background-color: rgba(227, 227, 227, 100);">
	<view class="uni-padding-wrap">
		<view class="img">
			<image :src="varData.image" mode="scaleToFill">
		</view>
	<view class="uni-flex uni-column">
		<view class="uni-flex uni-row" style="height: 238rpx; margin-bottom: 14rpx;background-color:#FFFFFF;" v-for="(item, index) in tableData" :key="index" @click="gotoPage(item.storage_id)">
			<view class="uni-flex" style="-webkit-justify-content: center;justify-content: center;-webkit-align-items: center;align-items: center;">
				<image :src="item.image.file_path"></image>
			</view>
			<view class="uni-flex uni-column" style="-webkit-flex: 1;flex: 1;-webkit-justify-content: space-between;justify-content: center;">
				<view class="uni-flex uni-row">
					<view class="text">{{$nw("名称")}}</view>
					<view class="text">{{item.product_name}}</view>
				</view>
				<view class="uni-flex uni-row">
					<view class="text">{{$nw("数量")}}</view>
					<view class="text" >{{item.number}}</view>
				</view>
				<view class="uni-flex uni-row">
					<view class="text">{{$nw("规格")}}</view>
					<view class="text">{{item.product_attr}}</view>
				</view>
			</view>
		</view>

		<!-- 没有记录 -->
		<view class="d-c-c p30" v-if="tableData.length==0 && !loading">
			<text class="iconfont icon-wushuju"></text>
			<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
		</view>
		<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
	</view>
	<Tabbar></Tabbar>
	</view>
</template>

<script>
    import uniLoadMore from "@/components/uni-load-more.vue";
	import Tabbar from '@/components/tabbar/tabbar.vue';
	export default {
        components: {
            uniLoadMore,
			Tabbar
        },
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				img: 123,
				/*顶部刷新*/
				topRefresh: false,
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*数据列表*/
				tableData: [],
				varData:[],
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 20,
				no_more: false,
				loading: true,
				points: 0,
			};
		},
        computed:{

			/*加载中状态*/
            loadingType(){
                if(this.loading){
                    return 1;
                }else{
                    if(this.tableData.length!=0&&this.no_more){
                        return 2;
                    }else{
                        return 0;
                    }
                }
            }
        },
		mounted() {
      this.setGlobalColor()
			
		},
		onReachBottom() {
			let self = this;
			if (self.page < self.last_page) {
				self.page++;
				self.getData();
			}
			self.no_more = true;

		},
		onShow() {
			/*获取数据*/
			this.getData();
		},
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				let page = self.page;
				let list_rows = self.list_rows;
				self._get('plus.storage.storage/index', {
					page: page || 1,
					list_rows: list_rows,
				}, function(data) {
					self.loading = false;
					self.img = data.data.image;
					self.points = data.data.points;
					self.is_open = data.data.is_open;
					self.varData = data.data.vars;
					if(self.varData.title) {
						uni.setNavigationBarTitle({
							title: self.varData.title
						});
					}
					self.tableData = self.tableData.concat(data.data.list.data);
					self.tableData = self.getUnique(self.tableData,"storage_id");
					self.last_page = data.data.list.last_page;
					if (data.data.list.last_page <= 1) {
						self.no_more = true;
						return false;
					}

				});
			},

			/*跳转酒类详情*/
			gotoPage(e){
				uni.navigateTo({
				    url: '/user/pages/storage/detail?storage_id='+e
				});
			}

		}
	};
</script>

<style>
	.uni-padding-wrap{
		padding:0 20rpx;
		width: 710rpx;
		margin-top: 10rpx;
	}
	.img{
		width: 100%;
		height: 300rpx;
		border-radius: 5px;
	}
	.img image{
		width: 100%;
		height: 300rpx;
		border-radius: 5px;
	}
	.uni-column{
		margin-top: 28rpx;
	}
	.uni-flex image{
		margin-left: 20rpx;
		width: 200rpx;
		height: 200rpx;
		border-radius: 5px;
	}
	.text {
		text-align: left;
		padding-left: 40rpx;
		padding-top: 10rpx;
		font-size: 15px;
	}
</style>
