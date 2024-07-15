<template>
	<view>
		<view :style="'background:'+getMainColor()+';'" :class="isIphoneX?'tabbarheightPhone':'tabbarheight'"></view>
		<view :style="'background:'+getMainColor()+';'" :class="isIphoneX?'tabbar isIphoneX':'tabbar'">
			<view class="item" v-for="(item, index) in dataList" :key="index"
				:class="{'homepage' : item.text == '首页','active' : curIndex === index}"
				:style="'width:'+item_width+';'+'background:'+getMainColor()+';'" @click="gotoDetail(item,index)"
				v-if="item.is_show">
				<image class="tabbar-icon" :src="curIndex === index ? item.selectImgUrl : item.imgUrl" mode="widthFix">
				</image>
				<text v-if="item.text != '首页' || curIndex != index" :class="curIndex === index?'gray3 active':'gray3'"
					:style="[text(curIndex, index,item.onColor,item.color)]">
					<text>{{$nws(item.text)}}</text>
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	import utils from "@/common/utils";
	import store from "../../store";
	export default {
		data() {
			return {
				loading: true,
				curIndex: 0,
				isIphoneX: 0,
				tabbarData: {},
				item_width: '25%',
				dataList: [{
						imgUrl: '/static/img/t1.png',
						// imgUrl: '/static/img/home_icon.png',
						selectImgUrl: '/static/img/home_icon.png',
						text: '首页',
						color: '#999999',
						onColor: '#1B94E0',
						icon_type: 20,
						linkUrl: 'pages/index/homePage',
						is_show: true
					},
					{
						imgUrl: '/static/img/t3.png',
						selectImgUrl: '/static/img/t33.png',
						text: '供需',
						color: '#999999',
						onColor: '#1B94E0',
						icon_type: 20,
						linkUrl: 'plus2/pages/project/index',
						// linkUrl:'main/pages/supplyAndDemand/supplyAndDemand',
						is_show: true
					},
					{
						imgUrl: '/static/img/t4.png',
						selectImgUrl: '/static/img/t44.png',
						text: '资讯',
						color: '#999999',
						onColor: '#1B94E0',
						icon_type: 20,
						linkUrl: 'card/pages/card/staff/message/message',
						is_show: true
					},
					{
						imgUrl: '/static/img/t5.png',
						selectImgUrl: '/static/img/t55.png',
						text: '我的',
						color: '#999999',
						onColor: '#1B94E0',
						icon_type: 20,
						linkUrl: 'user/pages/index/index',
						is_show: true
					}
				]
			}
		},
		created() {
			let self = this;
			var pages = getCurrentPages();
			var currentpage = pages[pages.length - 1];
			let count = 0;
			// self.tabbarData = store.getters.tabBarX;
			self.tabbarData.data = this.dataList;
			self.tabbarData.data.forEach(function(item, index) {
				let linkUrl = item.linkUrl;
				if (item.linkUrl.indexOf('?') !== false) {
					let linkUrl_arr = item.linkUrl.split('?');
					linkUrl = linkUrl_arr[0];
				}
				console.log('currentpage.route============>', currentpage.route);
				// console.log(currentpage.route,1231321, linkUrl,store.getters.tabBarX);
				if (currentpage.route == linkUrl) {
					count = 1;
					self.curIndex = index;
					uni.setStorageSync('curIndex', index);
				}
			});
			// console.log(store.getters.tabBarX,112333111,count);
			if (count == 0) {
				console.log('test====================================================>');
				// uni.setStorageSync('curIndex', 0);
			}
			this.curIndex = uni.getStorageSync('curIndex');
			// this.item_width = 100 / Math.abs(this.tabbarData.style.rowsNum) + '%';

			if (uni.getStorageSync('isIphoneX')) {
				this.isIphoneX = uni.getStorageSync('isIphoneX');
				console.log(this.isIphoneX);
			}
			
			self.getInformationAuth()

		},
		computed: {
			icon() {
				return (curIndex, index) => {
					let color = ''
					if (curIndex === index) {
						color = utils.getMainColor() || '#c70d0d'
					}
					return {
						color
					}
				}
			},
			text() {
				return (curIndex, index, onColor = "", scolor = "") => {
					let color = ''
					if (curIndex === index) {
						if (onColor) {
							color = onColor
						} else {
							color = this.$store.getters.titleBackgroundColor || '#C82829'
						}

					} else {
						color = scolor
					}
					// console.log("color", color)
					return {
						color
					}
				}
			},

			updateTabBar() {
				if (store.getters.tabBarX != undefined && store.getters.tabBarX != "undefined") {
					uni.setStorageSync("tabbar", store.getters.tabBarX)
				}
				if (uni.getStorageSync("tabbar")) {
					return uni.getStorageSync("tabbar")
				} else {
					return store.getters.tabBarX
				}
			}
		},
		methods: {
			getInformationAuth() {
				this._get('plus.home.index/getInformationAuth', {}, (res) => {
					this.dataList[2].is_show = res.data || false
					console.log('this.dataList',this.dataList);
				}, null, () => {
					this.loading = false
				})
			},
			gotoDetail(e, key) {
				this.curIndex = key;
				let timestamp = new Date().getTime();
				console.log(this.curIndex, key, 3333);
				uni.setStorageSync('curIndex', this.curIndex);
				setTimeout(e => {
					console.log(uni.getStorageSync('curIndex'), 909090);
				}, 3000)
				let card_id = uni.getStorageSync('card_id');
				if (e.appid != undefined && e.appid != '') {
					console.log('走1111');
					uni.navigateToMiniProgram({
						// #ifdef MP
						appId: e.appid,
						path: e.linkUrl != undefined ? e.linkUrl : '',
						// #endif
					})
				} else {
					console.log('走2222');
					let url = e.linkUrl;

					if (card_id && e.linkUrl == 'card/pages/card/index') {
						let params = this.getShareUrlParams({
							card_id: card_id
						});

						url = url + "?" + params;

					}
					if (e.linkUrl.indexOf('?') !== -1) {
						url = url + "&t=" + timestamp;
					} else {
						url = url + "?t=" + timestamp;
					}

					uni.reLaunch({
						url: '/' + url
					});
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../card/statics/5.css';

	.tabbarheightPhone {
		// height: 130rpx;
		height: calc(130rpx + env(safe-area-inset-bottom) / 2);
	}

	.tabbarheight {
		// height: 130rpx;
		height: calc(130rpx + env(safe-area-inset-bottom) / 2);
	}

	.tabbar {
		box-sizing: border-box;
		// border-top: 1rpx solid #DDDDDD;
		position: fixed;
		background: #FFFFFF !important;
		display: flex;
		justify-content: space-evenly;
		//flex-wrap: wrap;
		left: 0;
		width: 100%;
		z-index: 998;
		bottom: 0;
		padding-bottom: calc(0rpx + env(safe-area-inset-bottom) / 2);
		box-shadow: 0rpx -4rpx 8rpx 0rpx rgba(0, 0, 0, 0.06);
	}

	.tabbar .item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
		height: 100rpx;
		position: relative;
		background: #FFFFFF !important;

		&.homepage {
			&.active {
				.tabbar-icon {
					width: 76rpx;
					height: 76rpx;
					position: relative;
					z-index: 1;
				}
			}
		}
	}

	/* 原来菜单图标是图片 */
	.tabbar .item .tabbar-icon {
		position: relative;
		display: inline-block;
		//margin-top: 5px;
		width: 50rpx;
		height: 50rpx;
	}

	/* 改为了现在的图标,方便控制颜色 */
	.tabbar .item .icon.iconfont {
		position: relative;
		display: inline-block;
		margin-top: -10px;
		width: 50rpx;
		height: 66rpx;
		font-size: 50rpx;
	}

	.tabbar .item text {
		position: relative;
		text-align: center;
		line-height: 1.8;
		font-size: 24rpx;

	}

	.active {
		color: #C82829;
	}

	.isIphoneX {
		padding-bottom: 30rpx;
	}

	.top_10 {
		color: #007AFF;
		transform: translateY(-10px);
	}
</style>