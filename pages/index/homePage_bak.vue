<template>
	<view>
		<Ad location_id="main_top" :interval="1500"></Ad>
		<!--diy-->
		<view class="commerce" @click="qiehuan">
			<text>{{merchantObj.name}}</text>
			<u-icon name="arrow-down-fill" size="20"></u-icon>
		</view>
		<scroll-view scroll-y="true" class="scroll-Y"
			:style="'min-height:' + phoneHeight + 'px;'+'background:'+getMainColor()+';'" v-if="!loadding">
			<diy :diyItems="items" :diyPage="pages" :showSupport="showSupport" :support="support" :link="link"
				:cocOrgId="merchantObj.coc_org_id" :style="'background:'+getMainColor()+';'" :is_homepage='1'></diy>
			<!-- <Ad location_id="main_bottom" :interval="1500"></Ad> -->
			<view class="" style="font-size: 32rpx;text-align: center;font-weight: 800;margin-bottom: 20rpx;">
				合作伙伴
			</view>
			<view class="logoq">
				<img src="https://shanghuitest.client.xcx008.com/file/uploads/20240420/bedb1661a960bcfa50efc44389f035f5.png"
					alt="" />
			</view>
		</scroll-view>

		<!-- <view @click="qiehuan" style="border-bottom-left-radius: 30rpx;border-top-left-radius: 30rpx; color:#fff;
		font-size: 26rpx; background: #2CAAE3;text-align: center;  width: 150rpx; position: absolute;top: 130rpx;right: 0rpx;">
			{{$nw("切换语言")}}
		</view> -->

		<!--点击收藏-->
		<view class="collection-box" v-if="is_collection">
			<view class="inner">
				<text>
					{{$nw("点击")}}“</text>
				<text class="point">.</text>
				<text class="point point-big">.</text>
				<text class="point">.</text>
				<text>”{{$nw("添加到我的小程序")}}，\n{{$nw("微信首页下拉即可快速访问店铺")}}
				</text>
			</view>
			<button type="primary" class="close-btn" @click="is_collection=false">x</button>
		</view>

		<!--关注公众号-->
		<!-- #ifdef MP-WEIXIN -->
		<view class="follow-gzh" v-if="is_follow=='1'">
			<text class="icon iconfont icon-guanbi" @click="is_follow=0"></text>
			<official-account></official-account>
		</view>
		<!-- #endif -->
		<!--首页推送-->
		<Homepush v-if="is_homepush" :homepush_data="homepush_data"></Homepush>
		<Tabbar></Tabbar>
		<!--客服-->
		<Mpservice v-if="isMpservice" :isMpservice="isMpservice" @close="closeMpservice"></Mpservice>
		<TestTips></TestTips>
		<!-- <OrderMsg></OrderMsg> -->
	</view>
</template>

<script>
	import diy from '@/components/diy/diy.vue';
	import Homepush from './home-push/home-push.vue';
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import Mpservice from '@/components/mpservice/Mpservice.vue';
	import TestTips from '@/components/test-tips.vue';
	import Ad from '@/components/ad/ad.vue';

	// import OrderMsg from '@/components/order-msg.vue';

	export default {
		components: {
			Ad,
			// OrderMsg,
			diy,
			Homepush,
			Tabbar,
			Mpservice,
			TestTips,


		},
		data() {
			return {
				merchantObj: {
					name: '东莞河南商会',
					coc_org_id: 1
				},
				/*是否打开客服*/
				isMpservice: false,
				/*是否正在加载*/
				loadding: true,
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				background: '',
				listData: [],
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				items: [],
				pages: [],
				/*收藏引导*/
				is_collection: false,
				/*关注*/
				is_follow: '0',
				/*是否首页推送*/
				is_homepush: false,
				/*首页推送数据*/
				homepush_data: {},
				/*是否显示技术支持*/
				showSupport: false,
				/*显示内容*/
				support: this.$nw("客满多技术提供支持"),
				/*技术支持下方链接*/
				link: '',


				projectData: [],
				activityData: [],
				videoData: []
			};
		},
		onLoad() {
			// this.getData();
			this.getAppInfo();
			this._post('user.index/detail', {}, function(res) {
				uni.setStorageSync('userInfo', res.data.userInfo)
			})

		},
		onShow() {
			this.getLanguage(this, function() {})

			clearInterval(uni.getStorageSync("chatInter"))
			clearInterval(uni.getStorageSync("xt_checkPay"))
			this.getData();

		},
		mounted() {
			this.init();
			// 设置全局颜色
			this.setGlobalColor()
		},
		computed: {
			textColor() {
				return flag => {
					return this.setColor(flag)
				}
			},
		},
		methods: {
			qiehuan() {
				uni.navigateTo({
					url: '/main/pages/CommerceChoice/CommerceChoice'
				});
			},
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
					}
				});

			},

			/*获取首页分类*/
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});

				let params = {};

				let platform = self.getPlatform();
				params.platform = platform;
				//添加判断有没有agent_id这字段，没有的话就跳转去选择代理商页面

				self._get('index/index', params, function(res) {
					// console.log(111);

					//添加判断有没有agent_id这字段，没有的话就跳转去选择代理商页面
					// let uid = uni.getStorageSync('agent_id');
					// if(!uid){
					// 	uni.navigateTo({
					// 		url: '/pages/choose/list'
					// 	});
					// }

					self.listData = res.data.list;
					self.projectData = res.data.project
					self.activityData = res.data.activity;
					self.videoData = res.data.video;
					self.background = res.data.background;
					self.items = res.data.items;


					self.pages = res.data.page;
					self.setPage(res.data.page);
					//弹出收藏
					// #ifdef  MP-WEIXIN
					let isFirst = uni.getStorageSync('isFirst');
					if (isFirst == '' && res.data.setting.collection.status == '1') {
						self.is_collection = true;
						uni.setStorageSync('isFirst', 1);
					}
					self.is_follow = res.data.setting.officia.status;
					// #endif
					// 首页推送
					let homepush_name = uni.getStorageSync('homepush_name');
					if (res.data.setting.homepush.is_open && homepush_name != res.data.setting.homepush.name) {
						self.homepush_data = res.data.setting.homepush;
						self.is_homepush = true;
						self.is_homepush = true;
					}
					uni.hideLoading();
					self.loadding = false;
				});
			},
			/*打开客服*/
			openMaservice() {
				this.isMpservice = true;
			},
			/*关闭客服*/
			closeMpservice() {
				this.isMpservice = false;
			},
			/*设置页面*/
			setPage(page) {
				var self = this;
				// uni.setNavigationBarTitle({
				// 	title: this.$nws(self.pages.params.title)
				// })
				uni.setNavigationBarTitle({
					title: '万商联营'
				})
				// console.log(889989, page)
				if (page.style.chooseTitleStyle === 'customize') {
					let colors = '#000000';
					if (page.style.titleTextColor == 'white') {
						//字母要小写
						colors = '#ffffff'
					}
					uni.setNavigationBarColor({
						frontColor: colors,
						backgroundColor: page.style.titleBackgroundColor
					})
				}

			},

			/*分享当前页面*/
			onShareAppMessage() {
				let self = this;
				return {
					title: self.page.params.share_title,
					path: '/pages/index/homePage?' + self.getShareUrlParams()
				};
			},
			/**
			 * 获取当前应用信息
			 */
			getAppInfo() {
				let self = this;
				let platform = self.getPlatform();
				self._get('index/getAppInfo', {
					'platform': platform
				}, function(res) {

					if (res.code == 1) {
						var info = res.data.appinfo;
						uni.setStorageSync('appinfo', info);
						if (info.close_site) {
							uni.redirectTo({
								url: "/main/pages/error/error?text=" + info.close_msg
							})
						}
						if (info.is_show_support == 1 || info.is_show_support == 2) {
							self.showSupport = true;
						}

						if (info.support_msg) {
							self.support = info.support_msg;
						}
						self.link = info.links;
					}

				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.logoq {
		padding: 0 24rpx;

		img {
			width: 100%;
			height: 316rpx;
		}
	}

	.commerce {

		display: flex;
		background-color: #F4F7FB;
		padding: 10rpx 26rpx;

		text {
			margin-right: 14rpx;
		}
	}

	.banner {
		height: 240upx;
		width: 710upx;
	}

	.banner image {
		width: 710rpx;
		height: 240rpx;
	}

	.new-people .group-bd {
		display: flex;
		justify-content: space-between;
	}

	.new-people .list {
		padding-right: 30rpx;
	}

	.new-people .list .item {
		width: 180rpx;
		text-align: center;
	}

	.new-people .list .price {
		font-size: 24rpx;
	}

	.new-people .list .price .num {
		font-size: 34rpx;
		font-weight: bold;
	}

	.new-people .list button {
		font-size: 24rpx;
		background: #6170ff;
	}

	.new-people .list image {
		width: 180rpx;
		height: 180rpx;
		border: 1px dashed #cccccc;
	}

	.new-people .other {
		width: 230rpx;
	}

	.new-people .other image {
		width: 100%;
	}

	.group-seckill .left .iconfont {
		margin-right: 8rpx;
		color: rgb(226, 35, 26);
		font-size: 40rpx;
	}

	.group-seckill .list .item {
		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
		width: 150rpx;
		height: 230rpx;
		border: 1px dashed #cccccc;
	}

	.group-seckill .list text {
		line-height: 60rpx;
		color: #e2231a;
	}

	.group-seckill .list image {
		width: 150rpx;
		height: 150rpx;
	}

	.group-hd .datetime .time {
		padding: 4rpx;
		background: #e2231a;
		color: #ffffff;
		border-radius: 4rpx;
	}

	.group-hd .datetime .point {
		padding: 0 10rpx;
		color: #e2231a;
	}

	.every-day-hard .list .item {
		width: 200rpx;
	}

	.every-day-hard .list image {
		width: 200rpx;
		height: 200rpx;
	}

	.every-day-hard .list .pic {
		position: relative;
		width: 200rpx;
		height: 200rpx;
		border: 1px dashed #cccccc;
	}

	.every-day-hard .list .tips {
		position: absolute;
		left: -1px;
		bottom: -1px;
		padding: 0 10rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		border-radius: 0 4rpx 0 0;
		color: #ffffff;
		background: #ff8a00;
		font-size: 22rpx;
	}

	.every-day-hard .list .tips .iconfont {
		margin-right: 6rpx;
		font-size: 24rpx;
		color: #ffffff;
	}

	.every-day-hard .list .tips .svg-icon {
		width: 20rpx;
		height: 20rpx;
		margin-right: 6rpx;
		color: #ffffff;
	}

	.every-day-hard .list .bottom-box {
		display: flex;
		height: 80rpx;
		justify-content: space-between;
		align-items: center;
	}

	.every-day-hard .list .bottom-box .people {
		font-size: 24rpx;
		color: #fb8138;
	}

	.every-day-hard .list .bottom-box .unit {
		font-size: 22rpx;
		color: #e2231a;
	}

	.every-day-hard .list .bottom-box .price {
		font-size: 30rpx;
		color: #e2231a;
	}

	.collection-box {
		position: fixed;
		width: 380rpx;
		padding: 20rpx;
		top: 20rpx;
		right: 20rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		border-radius: 16rpx;
		background: #ffffff;
		border: 1px solid #eeeeee;
		box-shadow: 0 0 6rpx 0 rgba(0, 0, 0, .08);
	}

	.collection-box::after {
		position: absolute;
		content: '';
		display: block;
		right: 140rpx;
		top: -15rpx;
		transform: rotate(45deg);
		width: 30rpx;
		height: 30rpx;
		transform: rotate;
		background: #FFFFFF;
		border-left: 1px solid #eeeeee;
		border-top: 1px solid #eeeeee;
	}

	.collection-box .point {
		width: 20rpx;
		height: 20rpx;
		font-size: 60rpx;
		line-height: 0;
		color: #666666;
	}

	.collection-box .point-big {
		font-size: 80rpx;
	}

	.collection-box .close-btn {
		position: absolute;
		padding: 0;
		right: 10rpx;
		top: 10rpx;
		width: 40rpx;
		height: 40rpx;
		line-height: 30rpx;
		background: #FFFFFF;
		color: #999999;
		border-radius: 50%;
	}

	.follow-gzh {
		position: fixed;
		left: 0;
		right: 0;
		bottom: calc(var(--window-bottom));
		border-radius: 16rpx;
		box-shadow: 0 0 20rpx 0 rgba(0, 0, 0, .1);
		background: #FFFFFF;
		z-index: 10;
	}

	.follow-gzh .iconfont {
		display: block;
		position: absolute;
		right: 10rpx;
		top: 10rpx;
		z-index: 99;
	}

	.icon-box {
		position: fixed;
		bottom: 150rpx;
		right: 0;
		width: 90rpx;
		height: 90rpx;
		border-right: 1px solid #dddddd;
	}

	.icon-box .iconfont {
		font-size: 40rpx;
		color: #888888;
	}
</style>