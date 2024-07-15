<template>
	<scroll-view scroll-y="true" :style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'"
		@scrolltolower="in_scrolltolower">
		<view class="top-tabbar1">
			<Tabbara :tabbar_list="tab" type="3" @tabbarEmit="tabbarEmit"></Tabbara>
		</view>

		<!--列表-->
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			@scrolltolower="scrolltolowerFunc">
			<view class="">
				<view class="tabbar-wrapper">
					<view class="tabbar-item" :style="'background:'+(item.flag?'linear-gradient(to right, #f2b237, #ffda98)':'')+
							';color:'+(item.flag?'#fff':'')+
							';font-weight:'+(item.flag?'500':'')" v-for="(item,index) in categorya" :key="index"
						@tap="categoryaClick(index)">
						{{item.name}}
					</view>
				</view>
			</view>

			<view class="cell-list">
				<view class="card-item share-btn card-item-view" :style="'background:'+getSecondBackgroundColor()+';'"
					v-for="(item, index) in activityData" @click="gotoClick(item)" :key="index">
					<view class="left-product-item">
						<view class="product-item-left">
							<image :src="item.imgUrl" style=" width:240rpx;height: 180rpx;border-radius: 15rpx;">
							</image>
						</view>
						<view class="product-item-right">
							<view class="title"  :style="'color:'+getMainTextColor()+';'">{{ item.title }}</view>
							<view class="subtitle">

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
							<view class="subtitle">{{$nw("报名人数")}}: {{item.activity_count_count?item.activity_count_count:0}}
							</view>
							<view class="price-other">
								<view class="price-other-item"  :style="'color:'+getMainTextColor()+';'">
									<view v-if="item.is_free==0" class="blue"  :style="'color:'+getMainTextColor()+';'">
										<text>¥</text>
										<text class="">{{ item.price }}</text>
									</view>

									<view class="blue"  :style="'color:'+getMainTextColor()+';'" v-else>
										<text class="">{{$nw("免费")}}</text>
									</view>
								</view>

								<view class="reportBtn" >{{item.status_text}}</view>
							</view>
						</view>
					</view>
				</view>

				<view class="">
					<view class="bottom-refresh">
						<view class="d-c-c p30" v-if="loading">
							<text class="gray3">{{$nw("加载中")}}</text>
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
				<image class="ww100" :src="codeImg" mode="widthFix"></image>
			</view>
		</Popup>

	</scroll-view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue'
	import utils from '@/common/utils.js';
	import Tabbara from '@/components/tabbar/tabbara.vue';
	export default {
		components: {
			Popup,
			Tabbara
		},
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*状态选中*/
				state_active: -1,
				/*当前页面*/
				page: 1,
				/*列表*/
				activityData: [],
				no_more: false,
				loading: false,
				transfer_setting: true,
				isCodeImg: false,
				codeImg: '',
				categorya: [],
				categorya_id: "",
				tab: [{
					id: 1,
					name: this.$nw("全部"),
					flag: true,
				}, {
					id: 2,
					name:  this.$nw("进行中"),
					flag: false,
				}, {
					id: 3,
					name:  this.$nw("已结束"),
					flag: false,
				}, ]
			};
		},
		mounted() {
			/*初始化*/
			this.init();
			/*获取数据*/
			this.getData();
			//单独获取分类
			this.getCategorya();
		},
		methods: {
			categoryaClick(index) {
				var self = this;
				self.categorya.forEach(function(res) {
					res.flag = false;
				})
				self.activityData = [];
				self.categorya[index].flag = true;
				self.categorya_id = self.categorya[index].categorya_id
				self.getData();
			},
			formatContent(e) {
				return utils.format_content(e);
			},
			/*初始化*/
			init() {
				let self = this;
					self.setGlobalColor()
				uni.getSystemInfo({
					success(res) {
						self.phoneHeight = res.windowHeight;
						// 计算组件的高度
						let view = uni.createSelectorQuery().select('.top-tabbar1');
						view.boundingClientRect(data => {
							let h = self.phoneHeight - data.height;
							self.scrollviewHigh = h;
						}).exec();
					}
				});
			},
			getCategorya() {
				let self = this;
				let page = self.page;
				self._get('plus.activity.activity/getCategorya', {}, function(res) {

					self.categorya = res.data.categorya
				});
			},
			/*获取数据*/
			getData() {

				let self = this;
				uni.showLoading({
					title: this.$nw("加载中")
				});
				let page = self.page;
				self._get('plus.activity.activity/getList', {
					state_active: self.state_active,
					page: page || 1,
					categorya_id: self.categorya_id,
				}, function(res) {
					uni.hideLoading();
					self.activityData = self.activityData.concat(res.data.lists.data);
					self.activityData = self.getUnique(self.activityData, "activity_id");
					self.last_page = res.data.lists.last_page;
					if (res.data.lists.last_page <= 1) {
						self.no_more = true;
					}
				});
			},

			// /*状态切换*/
			// stateFunc(e) {
			// 	let self = this;
			// 	if(self.state_active!=e){
			// 		self.activityData = [];
			// 		self.state_active = e;
			// 		self.page =1;
			// 		self.getData();
			// 	}


			// },
			tabbarEmit(index) {
				var self = this;
				self.tab.forEach(function(re) {
					re.flag = false;
				})
				self.state_active = index
				self.tab[index].flag = true;
				self.activityData = [];

				self.page = 1;
				self.getData();
			},
			/*可滚动视图区域到底触发*/
			in_scrolltolower() {

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
			gotoClick(e) {
				console.log(e)
				let path = '/plus2/pages/activity/detail?activity_id=' + e.activity_id
				uni.navigateTo({
					url: path
				})
			}
		}
	};
</script>

<style lang="scss">
	.product-item-list .product-item-head .state-text {
		margin-top: auto;
		vertical-align: middle;
	}

	.product-item-list .item {
		margin-top: 30rpx;
		padding: 30rpx;
		background: #FFFFFF;
	}

	.product-item-list .product-list,
	.product-item-list .one-product {
		padding: 20rpx 0;
		height: 160rpx;
	}

	.cell-list {
		width: 95%;
		margin: auto;
		border-radius: 15rpx;
	}

	.card-item {
		padding: 16rpx 16rpx;
	}

	.diy-product {
		padding: 20rpx 20rpx;
		/* background-color: gray; */
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

	/* 	.diy-product .product-list .product-cover >image{
		width: 100%;
		height: 100%;
	} */

	/* 	.diy-product .product-list.column__1 .product-cover {
		width: 240rpx;
		height: 240rpx;
		border-radius: 20rpx;
		overflow: hidden;
	} */

	.diy-product .product-list.column__1 .product-info {
		margin: 20rpx 20rpx 20rpx 30rpx;
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
		font-size: 24rpx;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.diy-product .product-list.column__1 .product-title {
		max-height: 80rpx;
		line-height: 40rpx;
	}

	.diy-product .product-list.column__1 .selling-point {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: 30rpx;
		max-height: 60rpx;
	}

	.diy-product .product-list.column__1 .already-sale {
		margin-top: 10rpx;
	}

	.reportBtn {
		position: relative;
		left: 160rpx;
		width: 150rpx;
		text-align: center;
		padding: 10rpx 10rpx;
		border-radius: 50rpx;
		background: linear-gradient(to right, #f2b237, #ffda98);
		color: #ffffff;
	}

	.reportBtn.inactive {
		background-color: #adadad;
	}

	.left-product-item {
		display: flex;
		align-items: center;
	}

	.left-product-item>image,
	.left-product-item>img {
		/* width: 240rpx;
		height: 180rpx; */
		width: 100%;
		height: 100%;

	}

	.product-item-left {
		display: flex;
		width: 240rpx;
		height: 180rpx;
	}

	.product-item-right {
		display: flex;
		margin-left: 20rpx;
		flex-direction: column;
	}

	.product-item-right .subtitle {
		font-size: 28rpx;
		color: rgb(146, 146, 146);
	}

	.product-item-right>view:nth-child(2) {
		width: 420rpx;
		display: inline-block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.price-other {
		display: flex;
		align-items: center;
	}

	.price-other .price-other-item {
		width: 100rpx;
	}

	.tabbar-wrapper {
		width: 98%;
		overflow-x: auto;
		white-space: nowrap;

		padding: 24rpx 0;

		& .tabbar-item {

			text-align: center;
			display: inline-block;
			padding: 10rpx 0;
			position: relative;
			margin-left: 2%;
			background: #e5e5e5;
			padding-left: 15rpx;
			padding-right: 15rpx;
			border-radius: 15rpx;

			&image {
				&::after {
					content: '';
					width: 90rpx;
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					margin: auto;
					border-bottom: 4rpx solid #1F1A17;
				}
			}
		}
	}
</style>