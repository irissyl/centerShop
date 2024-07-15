<template>
	<view>
		<view class="sticky-top">
			<view class="search-box">
			    <view class="search-item" >
			        <span class="icon iconfont icon-sousuo"></span>
			        <input @confirm="searchConfirm" v-model="keywords" class="ml-md flex-1" confirmType="search"  placeholderClass="placeholder" type="text"></input>
			    </view>
			</view>
			<view class="filter-box">
				<view @click="handerPopupAreaChange" class="filter-box-item b-1px-r">
					<view class="filter-box-item-title ellipsis">
						{{selectCity}}
					</view>
					<text class="icon iconfont icon-jiantou" :style="'transform: rotate(' + (selectType=='area'?'270':'90') + 'deg)'"></text>
				</view>
				
				<picker class="filter-box-item b-1px-r" @change="handerPopupindustryChange" :value="index" range-key="name" :range="industryArray">
					<view  class="filter-box-item b-1px-r">
						<view class="filter-box-item-title">{{currentIndustry}}</view>
						<text class="icon iconfont icon-jiantou" :style="'transform: rotate(' + (selectType=='industry'?'270':'90') + 'deg)'"></text>
					</view>
				</picker>
					
				
			</view>
			<view class="b-1px-b"></view>
			<view class="cell-list">
				<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + phoneHeight + 'px;'" @scrolltolower="scrolltolowerFunc">
					<view  class="card-item share-btn card-item-view" v-for="(item, index) in cardDataList" @click="gotoClick(item)" :key="index">
						<view class="flex-center">
							<image class="avatar" :src="item.avatar_image||'/static/user.png'"></image>
							<view class="ml-lg  flex-1 ellipsis">
								<view class="flex-y-baseline ">
									<view class="flex-y-center">
										<view class="f-title-lg c-title ellipsis">{{item.name}}</view>
										<image class="ml-md icon-md" src=""></image>
									</view>
									<view class="c-caption f-caption ml-md ellipsis">{{item.occupation}}</view>
								</view>
								<view class="flex-y-center">
									<view class="c-caption f-paragraph flex-1 ellipsis">{{item.supply?item.supply.name:"公司"}}</view>
									<!-- <view class="f-caption c-caption" wx:if="{{orderType==2}}">{{distance>1?distance+'km':distance<=0?'100m以内':distance*1000+'m'}}</view> -->
								</view>
							</view>
						</view>
					</view>
					
					<view class="page">
						<view class="loadmore" v-if="loading">
							<view class="loading"></view>
							<view class="loadmore_tips">正在加载</view>
						</view>
						<block v-else>
							<view class="loadmore loadmore_line" v-if="page>=last_page&&cardDataList.length>0">
								<view class="loadmore_tips loadmore_tips_in-line">没有更多数据了</view>
							</view>
							<view class="loadmore loadmore_line" v-if="cardDataList.length<=0">
								<view class="loadmore_tips loadmore_tips_in-line">没有找到数据</view>
							</view>
						</block>
					</view>
				</scroll-view>
			</view>
		</view>
		
		<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				index:0,
				industry_id:'',
				keywords:'',
				selectType:'',
				cityPickerValueDefault: [0, 0, 0],
				selectCity: '全部区域',
				province_id: 0,
				city_id: 0,
				region_id: 0,
				industryArray:[],
				currentIndustry:"行业",
				phoneHeight:"",
				cardDataList:[],
				last_page:0,
				page:1,
				loading:!1
			}
		},
		onLoad(e) {
			this.card_category_id = e.card_category_id;
			this.getIndustryArr(this.card_category_id);
			this.getCardList();
		},
		mounted() {
			
			this.init();
		},
		methods: {
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
					}
				});
			},
			/* 获取名片 */
			getCardList(){
				let self = this;
				self._get('plus.card.square/getCardList',{
					card_category_id:self.card_category_id,
					keywords:self.keywords,
					province_id:self.province_id,
					city_id:self.city_id,
					region_id:self.region_id,
					sub_category_id:self.industry_id,
					order:self.order,
					page:self.page
					
				},function(res){
					if(res.code==1){
						self.cardDataList =self.cardDataList.concat(res.data.cardList.data);
						self.last_page = res.data.cardList.last_page;	
					}
				})
			},
			/* 选择地址 */
			handerPopupAreaChange(){
				this.selectType = 'area'
				this.$refs.mpvueCityPicker.show();

			},
			/*选择之后绑定*/
			onConfirm(e) {
				this.selectCity = e.label.split(',')[2];
				this.province_id = e.cityCode[0];
				this.city_id = e.cityCode[1];
				this.region_id = e.cityCode[2];
				this.getCardList();
			},
			/* 选择行业 */
			handerPopupindustryChange(e){
				this.selectType = 'industry';
				if(this.industryArray[e.detail.value]){
					this.industry_id = this.industryArray[e.detail.value].card_category_id;
					this.currentIndustry = this.industryArray[e.detail.value].name;
				}
				this.page = 1;
				this.cardDataList = [];
				this.getCardList();
			},
			/* 子行业分类 */
			getIndustryArr(){
				let self = this;
				self._get('plus.card.square/getSubCategory',{
					card_category_id:self.card_category_id,

				},function(res){
					if(res.code==1){
						 self.industryArray = res.data.categoryList;

					}
				})
			},
			searchConfirm(){
				this.page = 1;
				this.cardDataList = [];
				this.getCardList();
			},
			gotoClick(item){
				let path = "/card/pages/card/index?card_id="+item.card_id;
				this.gotoPage(path);
			},
			scrolltolowerFunc() {
				let self = this;
				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					return;
				}
				self.getCardList();
			},

		}
	}
</script>

<style>
	view{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		
	}
	
	.b-1px, .b-1px-t, .b-1px-b, .b-1px-tb, .b-1px-l, .b-1px-r {
	    position: relative;
		height: 1rpx;
	}
	.sticky-top {
	    position: fixed;
	    left: 0;
	    right: 0;
	    z-index: 900;
	}
	.search-box {
	    padding: 16rpx;
	    display: flex;
	    align-items: center;
	    background: #efeff5;
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
	.card-item {
	    padding: 16rpx 0;
	    background: #fff;
	}
	
	.card-bottom {
	    display: flex;
	    align-items: center;
	    margin: 8rpx 0 0 128rpx;
	}
	
	.group-item {
	    height: 160rpx;
	    padding-top: 32rpx;
	    background: #fff;
	}
	
	.group-bottom {
	    margin: 8rpx 0 0 128rpx;
	}
	
	.ml-60 {
	    margin-left: 60rpx;
	}
	
	.avatar-box {
	    position: relative;
	}
	.filter-box {
	    display: flex;
	    background: white;
	}
	
	.filter-box-item {
	    height: 80rpx;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    flex: 1;
	}
	
	.filter-box-item-title {
	    max-width: 180rpx;
	}
	
	.sticky-top {
	    position: fixed;
	    left: 0;
	    right: 0;
	    z-index: 900;
	}
	
	.icon-xs {
	    transition: all 300ms;
	}
	
	.rotate {
	    transform: rotate(180deg);
	    transition: all 300ms;
	}
	
	.cascader-block-item {
	    height: 80rpx;
	    padding-left: 16rpx;
	    padding-right: 16rpx;
	    line-height: 80rpx;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    border-bottom: 1px solid #F5F5F5;
	}
	
	.search-box {
	    background: #efeff5;
	}
	.cell-list {
	    background: #fff;
	    padding: 0 32rpx;
	}	
	.card-item {
	    padding: 16rpx 0;
	    background: #fff;
		border-bottom: 1rpx solid #ececec;
	}
	.flex-center {
	    display: flex;
	    align-items: center;
	    justify-content: center;
	}
	.avatar {
	    width: 96rpx;
	    height: 96rpx;
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
</style>
