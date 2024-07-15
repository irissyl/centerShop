<template>
	<view class="user-index" v-if="!loadding">
		<!-- <uni-load-more :loadingType="1"> -->
		<!--个人信息-->
		<view class="user-header">
			<view class="user-header-inner">
				<view class="user-info">
					<view class="photo"><image :src="detail.avatarUrl" mode="aspectFill"></image></view>
					<view class="info">
						<view class="name">{{ detail.nickName }}</view>
						<view class="tel d-s-c">
							<text class="f24">ID:{{ detail.user_id }}</text>
							<text class="ml20 grade" v-if="grade.kmd_grade_id > 0">{{ grade.name }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!--我的资产-->
		<view class="my-assets d-b-c" style="display: none;">
			<view class="list d-a-c flex-1 mr30">
				<view class="item d-c-c d-c">
					<view class="fb f30">{{ totalSale }}</view>
					<text class="pt10 f24 gray3">{{$nw("销售额")}}</text>
				</view>
				<view class="item d-c-c d-c" >
					<view class="fb f30">{{ orderCount }}</view>
					<text class="pt10 f24 gray3">{{$nw("订单数")}}</text>
				</view>
				<view class="item d-c-c d-c" >
					<view class="fb f30">{{ productCount }}</view>
					<text class="pt10 f24 gray3">{{$nw("商品数")}}</text>
				</view>

			</view>

		</view>

		<!--菜单-->
		<view class="menu-wrap" v-if="diymenus == 1&&!menus">
			<diy :diyItems="menus"></diy>
		</view>

		<view v-else-if="diymenus == 1" scroll-y="true" class="scroll-Y"  >
			<diy :diyItems="items"></diy>
		</view>
		<view class="menu-wrap" v-else>

			<view class="group-bd">
				<view :class="'item ' + item.icon + '-box'" v-for="(item, index) in menus" :key="index" @click="gotoPage(item.path)">
					<view class="icon-round d-c-c"><text :class="'icon iconfont ' + item.icon"></text></view>
					<text class="name">{{ item.name }}</text>
				</view>
			</view>
		</view>
		<Tabbar></Tabbar>
		<!-- </uni-load-more> -->
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more.vue';
import recommendProduct from '@/components/recommendProduct/recommendProduct.vue';
import Tabbar from '@/components/tabbar/tabbar.vue';
export default {
	components: {
		uniLoadMore,
		recommendProduct,
		Tabbar
	},
	data() {
		return {
			/*是否推荐*/
			is_recommend: false,
			/*推荐数据*/
			recommendData: {},
			/*签到数据*/
			sign: {},
			/*是否加载完成*/
			loadding: true,
			indicatorDots: true,
			autoplay: true,
			interval: 2000,
			duration: 500,
			/*菜单*/
			menus: [],
			detail: {
				balance: 0,
				points: 0,
				grade: {
					name: ''
				},
			},
			grade: {
				kmd_grade_id: 0,
				name: '',
			},
			totalSale: 0,
			productCount: 0,
			orderCount:0,
			diymenus:0,
			items:[],
			balance_text:this.getAppinfo().balance_text,
		};
	},
	onShow() {
    this.setGlobalColor()
		uni.showLoading({
			title: this.$nw("加载中")
		});
		this.init();
		/*获取个人中心数据*/
		this.getData();
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

		/*获取数据*/
		getData() {
			let self = this;
			self._get('plus.supply.index/detail', {}, function(res) {
				self.detail = res.data.supply.user;
				self.grade = res.data.supply.kmd_grade;
				self.totalSale = res.data.totalSale;
				self.productCount = res.data.productCount;
				self.orderCount = res.data.orderCount;
				// self.is_recommend = res.data.is_recommend;
				// self.recommendData = res.data.recommendData;
				// self.sign = res.data.sign;
				// self.coupon = res.data.coupon;
				// self.orderCount = res.data.orderCount;
				// self.menus = res.data.menus;
				// self.setting=res.data.setting;
				self.diymenus = res.data.diymenus;
				self.loadding = false;
				// self.code = res.data.code_info;
				// self.balance_text =res.data.balance_text;
				self.items  =res.data.items.items;
				// self.pagesetting  =res.data.items.page;
				uni.hideLoading();
			},function(res){
				uni.redirectTo({
					url:'/plus/pages/supply/apply'
				});
			});
		},
		/*跳转页面*/
		gotoPage(path) {
			uni.navigateTo({
				url: path
			});
		}
	}
};
</script>

<style>
.user-header {
	position: relative;
	background: #e2231a;
}
.user-header .user-header-inner{position: relative;
padding: 30rpx 30rpx 30rpx;
display: flex;
	justify-content: space-between;
	align-items: center;
overflow: hidden;}
.user-header .user-header-inner::after,
.user-header .user-header-inner::before {
	display: block;
	content: '';
	position: absolute;
	border-radius: 50%;
	z-index: 0;
}
.user-header .user-header-inner::after {
	width: 400rpx;
	height: 400rpx;
	right: -100rpx;
	bottom: -200rpx;
	background-image: radial-gradient(90deg, rgba(255, 255, 255, 0.2) 10%, rgba(255, 255, 255, 0));
}

.user-header .user-header-inner::before {
	width: 200rpx;
	height: 200rpx;
	left: -60rpx;
	top: -20rpx;
	background-image: radial-gradient(-90deg, rgba(255, 255, 255, 0.2) 10%, rgba(255, 255, 255, 0));
}

.user-header .user-info {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.user-header .photo,
.user-header .photo image {
	width: 120rpx;
	height: 120rpx;
	border-radius: 50%;
}

.user-header .photo {
	border: 4rpx solid #ffffff;
}

.user-header .info {
	padding-left: 20rpx;
	box-sizing: border-box;
	overflow: hidden;
	color: #ffffff;
}

.user-header .info .name {
	font-weight: bold;
	font-size: 30rpx;
}

.user-header .info .tel {
	font-size: 26rpx;
}

.user-header .info .grade {
	display: block;
	padding: 0 16rpx;
	height: 40rpx;
	line-height: 36rpx;
	border-radius: 20rpx;
	background: rgba(0, 0, 0, 0.2);
	color: #ffc670;
}

.user-header .sign-box {
	position: absolute;
	right: 20rpx;
	padding: 0 10rpx;
	height: 50rpx;
	border: 1px solid #ffe300;
	border-radius: 25rpx;
	font-size: 24rpx;
	color: #ffe300;
	z-index: 10;
}
.user-header .sign-box .iconfont {
	color: #ffe300;
}


.my-assets .icon-box {
	width: 60rpx;
	height: 60rpx;
}

.my-assets .icon-box .iconfont {
	font-size: 50rpx;
	color: #333333;
}


.my-assets {
	margin-top:10rpx;
	padding: 30rpx;
	background: #ffffff;
}

.my-wallet {
	position: relative;
	width: 200rpx;
	border-left: 1px solid #dddddd;
}

.my-wallet::after {
	position: absolute;
	display: block;
	content: '';
	left: 0;
	border: 8rpx solid transparent;
	border-left-color: #dddddd;
}

.menu-wrap {
	margin-top: 30rpx;
	background: #ffffff;
}
.menu-wrap .group-bd {
	display: flex;
	justify-content: flex-start;
	align-items: flex-start;
}
.menu-wrap .item {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	width: 190rpx;
	height: 150rpx;
	font-size: 24rpx;
}
.menu-wrap .item.icon-dizhi1-box .icon-round {
	background-image: linear-gradient(135deg, #67b4e2 10%, #356dce 70%, #5c8fe8 90%);
}
.menu-wrap .item.icon-youhuiquan1-box .icon-round {
	background-image: linear-gradient(135deg, #e87ea4 10%, #ff268a 70%, #fe0d76 90%);
}
.menu-wrap .item.icon-youhuiquan--box .icon-round {
	background-image: linear-gradient(135deg, #ff5a30 10%, #ff2b3c 70%, #ff1740 90%);
}
.menu-wrap .item.icon-fenxiao1-box .icon-round {
	background-image: linear-gradient(135deg, #7ceeba 10%, #1ed2b7 70%, #17c0ad 90%);
}
.menu-wrap .item.icon-kanjia-box .icon-round {
	background-image: linear-gradient(135deg, #f2a904 10%, #f27d04 70%, #eaa031 90%);
}
.menu-wrap .icon-round {
	width: 60rpx;
	height: 60rpx;
	background: red;
	border-radius: 50%;
	color: #ffffff;
}
.menu-wrap .item .iconfont {
	font-size: 40rpx;
	color: #ffffff;
}
.menu-wrap .item .name {
	margin-top: 10rpx;
}
.friend {
	margin-top: 30rpx;
	background: #ffffff;
}

.friend .text{
	margin-top: 22rpx;
	margin-left: 30rpx;
	font-size: 32rpx;
}

.friend .img{
	margin-top: 12rpx;
	margin-left: 30rpx;
	width: 690rpx;
	height: 220rpx;
	background: #000000;
}


</style>
