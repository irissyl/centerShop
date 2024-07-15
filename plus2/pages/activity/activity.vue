<template>
	<scroll-view scroll-y="true" :style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'"
		@scrolltolower="in_scrolltolower">
		<view class="search-box" style="padding-top: 20rpx;" 
		>
		    <view class="search-item" :style="'background:'+getSecondBackgroundColor()+';'">
		        <span class="icon iconfont icon-sousuo"></span>
		        <input v-model="keyword" class="ml-md flex-1" 
				:placeholder="$nw('请输入商会活动名称搜索')"
				confirmType="search" 
				 placeholderClass="placeholder" type="text" @confirm="search"></input>
		    </view>
		</view>
		<view class="diy-banner-box" v-if="bannerData != ''"
		>
			<swiper class="swiper" 
			:indicator-dots="indicatorDots" 
			:indicator-active-color="indicatorActiveColor"
			:autoplay="autoplay" 
			:interval="interval" 
			:duration="duration">
				<swiper-item v-for="(item,index) in bannerData" :key="index" @click="gotoPages(item)">
					<image :src="item" mode="scaleToFill"></image>
				</swiper-item>
			</swiper>
		</view>
	
		<!-- 标签 -->
		<Label :item="item" :name="''" ></Label>
		
		<!-- <view class="b-1px-b"></view> -->
		<view class="cell-list" :style="'background:'+getMainColor()+';'">
			
			<view  class="card-item" 
			v-for="(item, index) in activityData" 
			@click="gotoClick(item)" :key="index"
			style="border-radius: 15rpx;"
			:style="'background:'+getSecondBackgroundColor()+';'">
				<!-- 商品图片 -->
				<view class="left-product-item" >
					<view class="product-item-left">
						<image :src="item.imgUrl"  style="border-radius: 15rpx;"></image>
					</view>
					<view class="product-item-right">
						<view  class="title" :style="'color:'+getMainTextColor()+';'">{{item.title}}</view>
						<view  class="subtitle" >
							<!-- #ifdef H5 -->
							<text style="white-space: pre-wrap;" v-html="formatWord(item.subtitle)"></text>
							<!-- #endif -->
							<!-- #ifdef MP-WEIXIN -->
							<view v-html="formatContent(item.subtitle)"></view>
							<!-- #endif -->
							<!-- #ifdef APP -->
							<view v-html="formatContent(item.subtitle)"></view>
							<!-- #endif -->	
							
						</view>
						
						<view class="price-other">
							<view  class="price-other-item" style="flex: 8;">
								<view v-if="item.is_free==0"   :style="'color:'+getMainTextColor()+';'">
										<text>¥</text>
										<text class="">{{ item.price }}</text>
								</view>
									
								<view class="red" v-else>
									<text :style="'color:'+getMainTextColor()+';'">{{$nw('免费')}}</text>
								</view>
							</view>
							
							<view class="reportBtn" style="flex: 2;background: linear-gradient(to right, #f2b237, #ffda98);"
							>{{$nw(item.status_text)}}</view>
						</view>
						
						<view  class="subtitle">{{$nw('报名人数')}}: {{item.activity_count_count?item.activity_count_count:0}}</view>
						
					</view>
				</view>
			</view>
			
			
	
			<template v-if="activityData.length<=0" >
				<view class="none-data-box" style="padding-bottom: 50rpx;">
					<image src="http://imgh5.y01.cn/20210606225550dd5f35541.png" mode="widthFix"></image>
					<text>{{$nw("未找到相关活动")}}</text>
	
				</view>
			</template>
			
			
		</view>
	

		<view style="height: 100rpx;" :style="'background:'+getMainColor()+';'"></view>		
		<Tabbar></Tabbar>
		<service :itemData="t_service"></service>
	
	</scroll-view>
</template>

<script>
	import Tabbar from '@/components/tabbar/tabbar.vue';
import utils from '@/common/utils.js';
import Label from '@/components/label/label.vue';
	import service from '@/components/diy/service/service';
		
	export default {
		components: {
			Tabbar,
			Label,
			service,
			
		},
		data() {
			
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				item: {
					code: "activity_list",
					title: this.$nw("活动列表"),
					color: "#000",
					right: true
				},
				keyword:'',
				bannerData:[],
		
				activityData:[],
				height: 350,
				indicatorDots: !0,
				autoplay: !0,
				interval:5e3,
				duration:500,
				indicatorColor:"rgba(248,248,248,0.6)",
				indicatorActiveColor:"#ffffff",
				circular:!0,
				previousMargin: 0,
				nextMargin:0,
				space: 0,
				borderRadius:0,
				current: 0,
				left: "",
				newList: [],
				newRowNum: 2,
				colNum:5,
				rowNum:2,
				indicatorActiveColor: "#ffffff",
				url: "/card/pages/filter/filter",
				phoneHeight:"",
				projectData:[],
				last_page:0,
				page:1,
				loading:!1,
				categorya_id:"",
				scrollviewHigh:0

			}
		},
		onShow() {
			this.getBase();
		},
		onLoad(e) {
			this.categorya_id = e.categorya_id;
		},
		mounted() {
			this.init();
		
			var self = this;
			setTimeout(function(){
				self.item.color = self.getMainTextColor()
			},500)	
		},
		onShareAppMessage(){
		},
		onShareTimeline(){
			let self = this;
			return {
				title: this.$nw("商会活动"),
			};
		},
		methods: {
			formatContent(e){
				return utils.format_content(e);
			},
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.screenHeight;
					}
				});
				uni.getSystemInfo({
					success(res) {
						_this.scrollviewHigh = res.windowHeight;
							
					}
				});
					this.setGlobalColor()
			},
			
			getBase(){
				let self = this;
				self._get('plus.activity.activity/getBase',{
					keyword:self.keyword,
					categorya_id:self.categorya_id
				},function(res){
					if(res.code ==1){
						self.activityData = res.data.activityData;
						//self.bannerData = res.data.bannerData?res.data.bannerData:'';
						//self.projectData = res.data.projectData;
					}
				});
			},
			gotoDetail(item){
				let path = item.path
				uni.navigateTo({
					url:path
				})
			},
			gotoClick(item){
				let path = '/plus2/pages/activity/detail?activity_id='+item.activity_id
				uni.navigateTo({
					url:path
				})
			},
	
			/*搜索*/
			search(e) {
				this.keyword = e.detail.value
				this.getBase();
			},
			/* 分享朋友圈 */
			
			
		}
	}
</script>

<style lang="scss">
	view{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		
	}
	.diy-banner-box,.diy-banner-box .swiper {
		width: 750rpx;
		height: 360rpx;
	}
	
	.diy-banner-box image{
		margin: 20rpx;
		width: 710rpx;
		height: 340rpx;
		border-radius: 16rpx;
	}
	.diy-product .product-list.column__1 .product-item {
		width: 100%;
		background: #ffffff;
	}
	.diy-product .product-list.column__1 .product-item-box {
		display: flex;
		justify-content: flex-start;
		align-items: stretch;	
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
		/* margin:20rpx 20rpx 20rpx 30rpx; */
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
		font-size: 32rpx;
		font-weight:bold;
	}
	.reportBtn{
		width: 170rpx;
		text-align: center;
		padding: 10rpx 10rpx;
		border-radius: 50rpx;
		background-color: #5b67fb;
		color: #ffffff;
		margin-right: 15rpx;
	
	}
	.projectIntroduce_text{
		padding: 10rpx 0;
		display: inline-block;
		overflow: hidden;
	}
	.projectIntroduce{
		width: 420rpx;
		display: inline-block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.diy-navbar {
		margin: 20rpx;
		background: #FFFFFF;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		border-radius: 16rpx;
	}
	
	.diy-navbar .item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 20rpx;
		width: 120rpx;
		height: 180rpx;
	}
	
	.diy-navbar .item image {
		width: 80rpx;
		height: 80rpx;
	}
	
	.diy-navbar .item text {
		display: block;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
		overflow: hidden;
		line-height: 80rpx;
		font-size: 28rpx;
		text-align: center;
	}
	
	.b-1px, .b-1px-t, .b-1px-b, .b-1px-tb, .b-1px-l, .b-1px-r {
	    position: relative;
		height: 1rpx;
	}

	.space-lg{
		height: 16rpx;
	}
	.search-box {
	    padding: 10rpx;
	    display: flex;
	    align-items: center;
	    // background: #efeff5;
	}
	
	.search-item {
	    flex: 1;
	    height: 64rpx;
	    background: #fff;
	    border-radius: 32rpx;
	    padding: 0 16rpx 0 35rpx;
	    display: flex;
	    align-items: center;
	    line-height: 1;
	    font-size: 28rpx;
	    color: #888;
	}
	
	.placeholder {
	    font-size: 28rpx;
	}
	
	.search-item-btn {
	    color: #19a918;
	    margin-left: 32rpx;
	    font-size: 30rpx;
	}
	
	.search-btn {
	    padding: 0 20rpx 0 40rpx;
	}
	
	.icon-sm {
	    width: 30rpx;
	    height: 30rpx;
	}
	
	.flex-1 {
	    flex: 1;
	}
	
	.icon-md {
	    width: 40rpx;
	    height: 40rpx;
	}
	
	.ml-md {
	    margin-left: 16rpx;
	}
	
	.dots {
	    position: relative;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 100%;
	    bottom: 16rpx;
	}
	
	.dot {
	    height: 12rpx;
	    width: 12rpx;
	    background: #d48989;
	    border-radius: 6rpx;
	    margin: 0 6rpx;
	}
	.column-box {
	    background: #fff;
	    font-size: 26rpx;
	    color: #666;
	    overflow: hidden;
	    padding: 20rpx 0;
	}
	
	.scroll-x {
	    white-space: nowrap;
	}
	
	.scroll-x-item {
	    position: relative;
	    display: inline-block;
	    vertical-align: text-top;
	}
	
	.scroll-x-box {
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	    margin-top: 20rpx;
	}
	
	.scroll-x-img {
	    width: 96rpx;
	    height: 96rpx;
	    border-radius: 50%;
	    background: #eaeaea;
	}
	
	.scroll-x-text {
	    margin-top: 10rpx;
	    text-align: center;
	}
	
	.swiper-category {
	    width: 100%;
	    background: white;
	    font-size: 26rpx;
	    color: #666;
	    padding: 20rpx 0;
	}
	
	.swiper-category-item {
	    box-sizing: border-box;
	    display: flex;
	    align-items: flex-start;
	    flex-wrap: wrap;
	}
	
	.swiper-category-item__child {
	    display: flex;
	    flex-direction: column;
	    align-items: center;
	    justify-content: center;
	}
	
	.swiper-category__img {
	    width: 96rpx;
	    height: 96rpx;
	    margin-bottom: 10rpx;
	}
	
	.dots {
	    background: white;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    width: 100%;
	    padding-bottom: 20rpx;
	}
	
	.dot {
	    height: 12rpx;
	    width: 12rpx;
	    background: #ddd;
	    border-radius: 6rpx;
	    margin: 0 4rpx;
	}
	
	.ellipsis {
	    display: block;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	}
	
	.ui-tab {
	    display: inline-block;
	    position: relative;
	    font-size: 32rpx;
	    text-align: center;
	    box-sizing: border-box;
	    color: #888;
	    line-height: 92rpx;
	}
	
	.ui-tab.ui-tab-x.active {
	    color: #19a918;
	}
	
	.ui-tab.border-none {
	    border: 0!important;
	}
	
	.tab2-box {
	    height: 100rpx;
	    display: flex;
	    align-items: center;
	    background: #fff;
	    padding: 0 32rpx;
	}
	.ui-sticky{
		margin-top: 10rpx;

	}
	.cell-list {

	}	
	.card-item {
	    width: 95%;
		margin: auto;
		padding-bottom: 20rpx;
		margin-top: 20rpx;
	}
	.flex-center {
	    display: flex;
	    align-items: center;
	    justify-content: center;
	}
	.avatar {
	    width: 300rpx;
	    height: 150rpx;
	    border-radius: 6rpx;
	}
	.flex-1 {
	    flex: 1;
	}
	
	.flex-y-baseline {
	    display: flex;
	    align-items: baseline;
	}
	.flex-y-center {
	    display: flex;
	    align-items: center;
	}
	.ml-md {
	    margin-left: 16rpx;
	}
	.ellipsis {
	    display: block;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	}
	.c-caption {
	    color: #888888;
	}
	
	.f-caption {
	    font-size: 24rpx;
	}
	.ml-lg {
	    margin-left: 32rpx;
	}
	.ellipsis {
	    display: block;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	}
	.loadmore {
	    width: 65%;
	    margin: 1.5em auto;
	    line-height: 1.6em;
	    font-size: 14px;
	    text-align: center;
	}
	
	.loadmore_tips {
	    display: inline-block;
	    vertical-align: middle;
	}
	
	.loadmore_line {
	    border-top: 1px solid #e5e5e5;
	    margin-top: 2.4em;
	}
	
	.loadmore_tips_in-line {
	    position: relative;
	    top: -0.9em;
	    padding: 0 0.55em;
	    background-color: #fff;
	    color: #999;
	}
	.red{
		color: #5b67fb;
	}
	.left-product-item{
		align-items: center;
	}
	.left-product-item>image,.left-product-item>img{
	/* 	width: 240rpx;
		height: 180rpx; */
		width: 100%;
		height: 100%;

	}
	.product-item-left{
		display: flex;
		width: 100%;
		height: 280rpx;
		image{
			width: 100%;
			height: 100%;
		}
	}
	.product-item-right{
		display: flex;
		margin-left: 20rpx;
		flex-direction: column;
	}
	.product-item-right .title{
		font-size: 32rpx;
	}
	.product-item-right .subtitle{
		font-size: 28rpx;
		color: rgb(146, 146, 146);
	}
	 .product-item-right>view:nth-child(2){
		width: 420rpx;
		display: inline-block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.price-other{
		display: flex;
		align-items: center;
	}
	.price-other .price-other-item{
		
	}
	
</style>
