<template>
	<view :style="'background:'+getMainColor()+';'">
		<view class="search-box" :style="'background:'+getMainColor()+';'">
			<view class="search-item" :style="'background:'+getSecondBackgroundColor()+';'">
				<!-- <span class="icon iconfont2 icon-sousuo" style="line-height: 170rpx;"></span> -->
				<input @confirm="searchConfirm" v-model="keywords" class="ml-md flex-1" confirmType="search"
					placeholderClass="placeholder" :placeholder="$nw('请输入名片')" type="text"></input>
			</view>
		</view>

		<view class="b-1px-b"></view>
		<view class="diy-banner-box" v-if="bannerData.length>0">
			<swiper class="swiper" :indicator-dots="indicatorDots" :indicator-active-color="indicatorActiveColor"
				:autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(item,index) in bannerData" :key="index" @click="gotoPages(item)">
					<image :src="item" mode="scaleToFill"></image>
				</swiper-item>
			</swiper>
		</view>





		<scroll-view class="ui-tabs ui-tabs-x" v-if="setting.is_open_architecture" @click="gotoArchitecture">
			<view class="architecture_text">{{$nw("商会组织架构")}}</view>
			<view class="architecture">
				<image :src="setting.architecture" mode="widthFix"></image>
			</view>
		</scroll-view>

		<!-- 新名片-start -->
		<Card :item="cardDetail" isJ="1"></Card>

		<!-- 新名片-end -->
		<view class="dots" v-if="newList.length>1">
			<view v-for="(item, index) in newList.length" :key="index" class="dot"
				:style="'background:' + (index==current?indicatorActiveColor:indicatorColor) + ';width:' + (index==current?'32rpx':'12rpx')">
			</view>
		</view>


		<!-- <view class="ui-sticky">
			<view class="tab2-box">
				<view class="flex-1 f-title-lg">{{showtype==0?'热门名片':'附近名片'}}</view>
				<image class="icon-md mr-sm" src="/static/toggle.png"></image>
				<view @tap="tab2Change" class="c-caption">切换为{{showtype==1?'热门名片':'附近名片'}}</view>
			</view>
		</view> -->
		<Label :item="item" :name="''"></Label>


		<view class="b-1px-b"></view>
		<view class="cell-list">
			<view class="card-item share-btn card-item-view" v-for="(item, index) in cardDataList" :key="index">
			
				<Card :item="item"></Card>
			
			
			</view>
			
			<view class="page">
				<view class="loadmore" v-if="loading">
					<view class="loading"></view>
					<view class="loadmore_tips">{{$nw('正在加载')}}</view>
				</view>
			</view>

		</view>
		<Tabbar></Tabbar>
		<service :itemData="t_service"></service>
		
	
	</view>
</template>

<script>
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import Card from "@/components/card/card.vue";
	import Label from '@/components/label/label.vue';
	import service from '@/components/diy/service/service';
	export default {
		components: {
			Tabbar,
			Card,
			Label,
			service
		},
		data() {
			return {
					t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				item: {
					code: "recom_card",
					title: "名片",
					color: this.getMainTextColor(),
					right: false
				},
				keywords: '',
				list: [],
				height: 350,
				indicatorDots: !0,
				autoplay: !0,
				interval: 5e3,
				duration: 500,
				indicatorColor: "rgba(248,248,248,0.6)",
				indicatorActiveColor: "#ffffff",
				circular: !0,
				previousMargin: 0,
				nextMargin: 0,
				space: 0,
				borderRadius: 0,
				current: 0,
				left: "",
				newList: [],
				newRowNum: 2,
				colNum: 5,
				rowNum: 2,
				indicatorActiveColor: "#ffffff",
				url: "/pages/card/filter/filter",
				phoneHeight: "",
				cardDataList: [],
				last_page: 0,
				page: 1,
				loading: !1,
				showtype: 0,
				latitude: 0,
				longitude: 0,
				bannerData: [],
				setting: {},
				cardDetail: {
					region: {
						address: ""
					}
				}
			}
		},
    onShow() {
			this.restoreData();
			this.getBase();
			this.getCardData();
			this.setGlobalColor()
		},
		mounted() {
			this.init();
		},
		onReachBottom() {
			let self = this;
			console.log("出发了")
			self.page++;
			self.loading = true;
			if (self.page > self.last_page) {
				self.loading = false;
				return;
			}
			self.getCardData();
		},
		methods: {
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.screenHeight
					}
				});
				setTimeout(function() {
					_this.item.color = _this.getMainTextColor()
				}, 500)

			},
			/*还原初始化*/
			restoreData() {
				this.page = 1;
				this.cardDataList = [];
			},
			getBase() {
				let self = this;
				self._get('plus.card.square/getSquare', {}, function(res) {
					if (res.code == 1) {
						let categoryList = [],
							categoryData = res.data.category;
						let categoryLength = res.data.category.length;
						let l = 0;
						let len = 10;
						while (l < categoryLength) {
							categoryList.push(categoryData.slice(l, l + len));
							l = l + 10;
						}
						self.newList = categoryList;
						self.setting = res.data.setting;
						self.bannerData = res.data.setting.image;

					}
				});
			},
			categoryChange(e) {
				var t = e.detail.current;
				this.current = t;
			},
			getCardData() {
				let self = this;
				let params
				self._get('plus.card.square/getCardlist', {
					showtype: self.showtype,
					keywords: self.keywords,
					latitude: self.latitude,
					longitude: self.longitude,
					page: self.page || 1,
				}, function(res) {
					if (res.code == 1) {
						self.cardDataList = self.cardDataList.concat(res.data.cardList.data);
						self.cardDataList = self.getUnique(self.cardDataList, "card_id");
						self.cardDetail = res.data.cardDetail
						self.last_page = res.data.cardList.last_page;
					}
				});
			},

			// gotoClick(item) {
			// 	let path = "/card/pages/card/index?card_id=" + item.card_id;
			// 	this.gotoPage(path);
			// },
			goCategoryUrl(item) {
				console.log(item);
				let path = "/card/pages/card/square/filter?card_category_id=" + item.card_category_id;
				this.gotoPage(path);
			},
			searchConfirm() {
				this.cardDataList = [];
				this.page = 1;
				this.getCardData();
			},
			/* 切换名片列表 */
			tab2Change() {
				let self = this;
				self.page = 1;
				self.cardDataList = [];
				if (self.showtype == 0) {
					self.showtype = 1;
					uni.getSetting({
						success(res) {
							if (!res.authSetting['scope.userLocation']) {
								uni.showModal({
									title: "提示",
									content: "请先授权位置权限",
									showCancel: false,
									success: function(res) {
										if (res.confirm) {
											uni.openSetting({
												success(res) {
													console.log(res);
												}
											})
										}
									}
								})
							}

						}
					})
					uni.getLocation({
						success(res) {
							self.longitude = res.longitude;
							self.latitude = res.latitude;
							self.getCardData();
						}
					})

				} else {
					self.showtype = 0;
					self.getCardData();
				}


			},
			gotoArchitecture() {
				let path = '/card/pages/card/square/architecture';
				uni.navigateTo({
					url: path
				})
			},
			/*分享*/
			onShareAppMessage() {
				let self = this;
				// 构建页面参数
				return {
					title: "人脉广场",
					path: '/card/pages/card/square/square'
				};
			},

		}
	}
</script>

<style lang="scss">
	@import "/card/statics/5.css";


	view {
		box-sizing: border-box;
		margin: 0;
		padding: 0;
	}

	::-webkit-scrollbar {
		display: none;
		width: 0 !important;
		height: 0 !important;
		-webkit-appearance: none;
		background: transparent;
	}

	.f-title-lg {
		color: #000000;
		font-weight: bold;
	}

	.b-1px,
	.b-1px-t,
	.b-1px-b,
	.b-1px-tb,
	.b-1px-l,
	.b-1px-r {
		position: relative;
		height: 1rpx;
	}


	.ui-tabs {
		position: relative;
		width: 710rpx;
		background: white;
		text-align: center;
		margin: 20rpx;
	}

	.ui-tabs.ui-tabs-x {
		/* width: 90%; */
		/* padding: 16rpx */
		/* white-space: nowrap; */
	}

	.space-lg {
		height: 32rpx;
	}

	.search-box {
		padding: 20rpx;
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
		width: 32rpx;
		height: 32rpx;
	}

	.ml-md {
		margin-left: 16rpx;
	}

	.swiper-box {
		position: relative;
		padding: 32rpx;
	}

	.swiper-ad {
		background: #fff;
	}

	.swiper-ad-item {
		box-sizing: border-box;
		width: 100%;
		height: 100%;
	}

	.swiper-ad__img {
		width: 100%;
		height: 100%;
	}

	.img-box {
		width: 100%;
		height: 100%;
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
		margin: 20rpx;
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
		color: #6599fe;
	}

	.ui-tab.border-none {
		border: 0 !important;
	}

	.tab2-box {
		height: 100rpx;
		display: flex;
		align-items: center;
		background: #fff;
		padding: 0 32rpx;
	}

	.ui-sticky {
		padding: 10rpx 20rpx 0;
	}

	.cell-list {
		// background: #fff;
		// margin: 0 20rpx;
	}

	.card-item {

		// background: #fff;
		// border-bottom: 1rpx solid #ececec;
	}

	.flex-center {
		display: flex;
		align-items: flex-start;
		justify-content: space-between;
	}

	.avatar {
		width: 200rpx;
		height: 200rpx;
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
	}

	.ml-md {
		margin-left: 10rpx;
	}

	.ellipsis {
		display: block;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
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

	.textstyle {
		padding-left: 10rpx;
		color: #999999;
	}

	.architecture_text {
		width: 100%;
		font-weight: bold;
		line-height: 3.5;
		color: #000000;

	}

	.architecture image {
		position: relative;
		width: 710rpx;
	}

	.diy-banner-box,
	.diy-banner-box .swiper {
		width: 750rpx;
		height: 360rpx;
	}

	.diy-banner-box image {
		margin: 20rpx;
		width: 710rpx;
		height: 340rpx;
		border-radius: 16rpx;
	}

	.icon-image {
		display: inline-block;
		width: 32rpx;
		height: 32rpx;
		padding: 4rpx;
	}

	.introduce {
		width: 400rpx;
		height: 200rpx;
		display: flex;
		flex-direction: column;
		/* align-items: center; */
		justify-content: space-between;
		/* align-items: center; */
	}

	.c-title {
		font-size: 30rpx;
	}

	.zhiwu {
		font-size: 28rpx;
		color: #999999;
	}

	.tubiao {
		width: 100rpx
	}
</style>