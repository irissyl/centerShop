<template>
	<view class="search-wrap">

		<!-- 搜索框 -->
		<view class="index-search-box d-b-c" id="searchBox">
			<view class="index-search t-c flex-1">
				<span class="icon iconfont icon-sousuo"></span>
				<input type="text" v-model="form.keyWord" class="flex-1 ml10 f30 gray3" value="" placeholder-class="f24 gray6"
				 :placeholder="$nw('输入你要的项目名称')" confirm-type="search" @confirm="search()"/>
			</view>
		</view>
		
		<view class="cell-list">
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + phoneHeight + 'px;'" @scrolltolower="scrolltolowerFunc">
				<view  class="card-item share-btn card-item-view" v-for="(item, index) in projectData" @click="gotoProject(item)" :key="index">
					<view class="diy-product">
						<view class="product-list column__1">
							<view class="product-item-box">
								<!-- 商品图片 -->
								<!-- <view class="product-cover"><image :src="item.imgUrl" mode="aspectFill"></image></view> -->
								<view class="product-info">
									<!-- 项目名称 -->
									<view  class="product-title">
										<text>{{ item.title }}</text>
									</view>
									<!-- 行业名称 -->
									<view  class="selling-point gray9">
										<text>{{$nw('行业分类')}}：</text>
										<text>{{item.category_id?item.category.name:''}}</text>
									</view>
									
									<view  class="selling-point gray9">
										<text>{{$nw('项目预算')}}：</text>
										<text v-if="item.budget>10000">{{item.budget/10000}}万</text>
										<text v-else>{{item.budget}}元</text>
									</view>
									
									<view  class="selling-point gray9">
										<text class="projectIntroduce">{{$nw('项目介绍')}}：{{item.introduce}}</text>
									</view>
									
								</view>
								
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type:'',
				assemble_activity_id:0,
				form: {
					keyWord:'' 
				},
				phoneHeight:"",
				projectData:[],
				last_page:0,
				page:1,
				loading:!1
			}
		},
		onLoad(e) {
			
		},
        mounted() {
			/*获取缓存数据*/
           // this.getData();
        },
		methods: {
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
					}
				});
			},
			/* 获取名片 */
			getData(){
				let self = this;
				self._get('plus.project.project/getList',{
					keyWord:self.form.keyWord,
					page:self.page||1
					
				},function(res){
					if(res.code==1){
						self.projectData =self.projectData.concat(res.data.lists.data);
						self.last_page = res.data.lists.last_page;	
					}
				})
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
						
					}else{
						uni.showToast({
							title: self.$nw("请输入搜索的关键字"),
							icon: 'none',
							duration: 2000
						});
						return false;
					}
					
				}
				this.projectData = [];
				this.page = 1;
				this.getData();
			},
			gotoProject(e){
				let path = '/pages/project/detail?project_id='+e.project_id
				uni.redirectTo({
					url:path
				})
			}
		
		}
	}
</script>

<style>
	/* view{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		
	} */
	.cell-list {
	    background: #fff;
	    padding: 0 32rpx;
	}	
	.card-item {
	    padding: 16rpx 0;
	    background: #fff;
		border-bottom: 1rpx solid #ececec;
	}
	
	.diy-product .product-list.column__1 .product-item {
		/* margin-bottom: 20rpx; */
		/* margin-top: 1rpx; */
		width: 100%;
		background: #ffffff;
	}
	.diy-product .product-list.column__1 .product-item-box {
			display: flex;
			justify-content: flex-start;
			align-items: stretch;
			/* padding-left: 20rpx; */
			/* background-color: #09BB07; */
	}
	
	.diy-product .product-list .product-cover image{
		width: 100%;
		height: 100%;
	}
	
	.diy-product .product-list.column__1 .product-cover {
		width: 240rpx;
		height: 240rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}
	
	.diy-product .product-list.column__1 .product-info {
		margin:20rpx 20rpx 20rpx 30rpx;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.diy-product .product-list .product-info .already-sale text {
		padding: 4rpx 8rpx;
		border-radius: 8rpx;
		background: #f2f2f7;
		color: #999;
	}
	.diy-product .product-list .product-title {
		display: -webkit-box;
		font-size: 34rpx;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}
	
	.diy-product .product-list.column__1 .product-title {
		max-height: 80rpx;
		line-height: 40rpx;
		padding: 8rpx
	}
	
	.diy-product .product-list.column__1 .selling-point{
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: 30rpx;
		max-height: 60rpx;
		padding: 10rpx;
	}
	
	.diy-product .product-list.column__1  .already-sale{
		margin-top: 8rpx;
	}
	.f-title-lg{
		color:#505050;
	}
.search-wrap .index-search-box .search-box {
		padding: 0 20rpx;
		height: 64rpx;
		line-height: 64rpx;
		background: #f7f7f7;
		border-radius: 50rpx;
		overflow: hidden;
		font-size: 28rpx;
		color: #999;
		box-sizing: border-box;
	}
	.search-wrap .index-search-box button{ 
		height: 78rpx; 
		line-height: 78rpx;
		 border:solid 1rpx #CCCCCC; 
		 color:#333333; 
		 background: #FFFFFF;
		 }

	.before-search {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-flow: wrap;
	}

	.before-search .item {
		padding: 16rpx;
		margin-right: 16rpx;
		margin-bottom: 16rpx;
		border-radius: 8rpx;
		color: #686868;
		background: #f0f2f5;
		font-size: 24rpx;
	}
		
</style>
