<template>
	<view>
		<view class="top-tabbar">
			<view :class="state_active == 0 ? 'tab-item active' : 'tab-item'" @click="stateFunc(0)">{{$nw("进行中")}}</view>
			<view :class="state_active == 1 ? 'tab-item active' : 'tab-item'" @click="stateFunc(1)">{{$nw("已结束")}}</view>
			<view :class="state_active == 2 ? 'tab-item active' : 'tab-item'" @click="stateFunc(2)">{{$nw("已取消")}}</view>
		</view>

		<!--列表-->
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
		  @scrolltolower="scrolltolowerFunc">
			<view class="cell-list">
				<view  class="card-item share-btn card-item-view" v-for="(item, index) in activityData" 
				 :key="index">
					<!-- 商品图片 -->
					<view class="left-product-item">
						<image :src="item.imgUrl" @click="gotoClick(item)" style="border-radius: 15rpx;"></image>
						<view class="product-item-right" >
							<view  class="title" @click="gotoClick(item)">{{ item.title }}</view>
							<view  class="subtitle" @click="gotoClick(item)">
								
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
								<view  class="price-other-item" @click="gotoClick(item)">
									<view v-if="item.is_free==0"  class="red" >
											<text>¥</text>
											<text class="">{{ item.price }}</text>
									</view>
										
									<view class="red" v-else>
										<text class="">{{$nw("免费")}}</text>
									</view>
								</view>
								
								</view>
							
							
						</view>
						
						
					</view>
					
					
					<view class="inactive" 
					v-if="item.pay_status==20 && item.status_text=='已结束'">{{item.status_text}}</view>
								
					<view class="reportBtn1"  style="float: right;"
						v-else-if="item.pay_status==20 && item.status_text!='已结束'&&
						item.is_refund == 0" 
						@click="clerkQrcode(item.activity_record_id)">{{$nw("核销码")}}</view>
						
										
					
					<view class="reportBtn1" @click="canel(item)"
					style="float: right;background: #b8b8b8;margin-right: 20rpx;"
					v-if="item.is_refund == 0 && item.order_status == 10">
						{{$nw("取消报名")}}
					</view>
					<view class="reportBtn1"
					style="float: right;background: #b8b8b8;margin-right: 20rpx;"
					v-if="item.is_refund == 1 && item.order_status == 10">
						{{$nw("审核中")}}
					</view>
					<view class="reportBtn1"
					style="float: right;background: #b8b8b8;margin-right: 20rpx;"
					v-if="item.is_refund == 2 && item.order_status == 10">
						{{$nw("取消报名成功")}}
					</view>
					<view class="reportBtn1"
					style="float: right;background: #b8b8b8;margin-right: 20rpx;"
					v-if="item.is_refund == 3 && item.order_status == 10" @click="nopass(item)">
						{{$nw("审核未通过")}}
					</view>
					<view style="clear: both;">
						
					</view>
						
				</view>
				
				<view class="">
					<view class="bottom-refresh">
						<view class="d-c-c p30" v-if="loading">
							<text class="gray3">{{$nw("加载中...")}}</text>
						</view>
						<view class="d-c-c p30" v-if="no_more">
							<text class="gray3">{{$nw("~~加载完成~~")}}</text>
						</view>
					</view>
				</view>
				
	
			</view>
		</scroll-view>
		
		<!--核销二维码-->
		<Popup :show="isCodeImg" type="middle" @hidePopup='hideCodePopupFunc'>
			<view class="ww100 p20 box-s-b">
				<image class="ww100" :src="codeImg" mode="widthFix"  v-if="codeImg"></image>
				<view class="ww100" v-else>
					{{$nw("核销编号")}}：{{current_record_id}}
				</view>
			</view>
		</Popup>
		
	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue'
	import utils from '@/common/utils.js';
	export default {
		components:{
			Popup
		},
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*状态选中*/
				state_active: 0,
				/*当前页面*/
				page: 1,
				/*列表*/
				activityData: [],
				no_more: false,
				loading: false,
				transfer_setting:true,
				isCodeImg:false,
				codeImg:'',
				current_record_id:''
			};
		},
		mounted() {
			/*初始化*/
			this.init();
		
		},
		onShow() {
			/*获取数据*/
			this.activityData = [];
			this.getData();
		},
		methods: {
			nopass(item) { //审核已经未通过
				var self = this;
				if(item.status_text!='已结束'){
					uni.showModal({
						title: self.$nw("系统提示："),
						content:self.$nw("不通过原因")+'：【' + item.reject_val + '】，'+self.$nw("是否重新报名"),
						success(res2) {
							if (res2.confirm) {
									uni.redirectTo({
										url:"/plus2/pages/activity/detail?activity_id="+item.activity_id
									})
							}
						}
					})
					
					return;	
			
				}else{
					uni.showToast({
						title:self.$nw("不通过原因")+'：【' + item.reject_val + "】",
						icon:"none"
					})
				}
			
			},
			canel(item){
				var self = this;
				let path = '/plus2/pages/activity/detail?activity_id='+item.activity_id
				uni.navigateTo({
					url:path
				})
		
				
			},
			formatContent(e){
				return utils.format_content(e);
			},
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.phoneHeight = res.windowHeight;
						// 计算组件的高度
						let view = uni.createSelectorQuery().select('.top-tabbar');
						view.boundingClientRect(data => {
							let h = self.phoneHeight - data.height;
							self.scrollviewHigh = h;
						}).exec();
					}
				});
			},

			/*获取数据*/
			getData() {
				
				let self = this;
				uni.showLoading({
					title:self.$nw("加载中")
				});
				let page = self.page;
				self._get('plus.activity.activity/userLists', {
					state_active: self.state_active,
					page: page || 1,
				}, function(res) {
					uni.hideLoading();
					self.activityData = self.activityData.concat(res.data.lists.data);
					self.activityData = self.getUnique(self.activityData,"activity_record_id");
					self.last_page = res.data.lists.last_page;
					if (res.data.lists.last_page <= 1) {
						self.no_more = true;
					}
				});
			},

			/*状态切换*/
			stateFunc(e) {
				let self = this;
				if(self.state_active!=e){
					self.activityData = [];
					self.state_active = e;
					self.page =1;
					self.getData();
				}
				
				
			},
			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {
				
				let self = this;
				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					self.no_more = true;
					return;
				}
				self.getData();
			},
			/*跳转商品 */
			gotoProduct(row){
				let self = this;
				let product_id = row.product.product_id;
				
				let url='pages/product/detail/detail?product_id=' + product_id
				this.gotoPage(url);
			},
			gotoClick(item){
				let path = '/plus2/pages/activity/detail?activity_id='+item.activity_id
				uni.navigateTo({
					url:path
				})
			},
			/* 跳转供应商 */
			gotoSupply(row){
				let self = this;
				let supply_id = row.supply.supply_id;
				let url='pages/supply/detail/detail?supply_id=' + supply_id
				this.gotoPage(url);
			},
			clerkQrcode(e){
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中"),
				});
				let activity_record_id = e;
				self.current_record_id =e;
				let source = 'wx';
				//#ifdef H5
				source = 'mp';
				//#endif
				self._get('plus.activity.activity/qrcode', {
					activity_record_id: activity_record_id,
					source: source
				}, function(res) {
					uni.hideLoading();
					self.isCodeImg = true;
					self.codeImg = res.data.qrcode;
				});
			},
			/*关闭核销二维码*/
			hideCodePopupFunc() {
				this.isCodeImg = false;
			},
		}
	};
</script>

<style>
	view{
		box-sizing: border-box;
		margin: 0;
		padding: 0;
		
	}
	.reportBtn{
		position: relative;
		left:180rpx;
		width: 150rpx;
		text-align: center;
		padding: 10rpx 10rpx;
		border-radius: 50rpx;
		background-color: #5b67fb;
		color: #ffffff;
	}
	.reportBtn1{
	
		width: 200rpx;
		text-align: center;
		padding: 10rpx 10rpx;
		border-radius: 50rpx;
		background-color: #5b67fb;
		color: #ffffff;
		font-size: 26rpx;
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
		padding: 10rpx 10rpx 0;
	}
	.cell-list {
	    background: #fff;

		padding: 0 30rpx;
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
		display: flex;
		align-items: center;
	}
	.left-product-item>image,.left-product-item>img{
		width: 240rpx;
		height: 180rpx;
		margin-right: 40rpx;
	}
	.product-item-right{
		display: flex;
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
		width: 100rpx;
	}
</style>
