<template>
	<view>
		<view :style="'background:'+getMainColor()+';'" :class="isIphoneX?'tabbarheightPhone':'tabbarheight'"></view>
		<view :style="'background:'+getMainColor()+';'" :class="isIphoneX?'tabbar isIphoneX':'tabbar'">
			<view 
			class="item" v-for="(item, index) in updateTabBar.data" :key="index" 
			:style="'width:'+item_width+';'+'background:'+getMainColor()+';'"
				@click="gotoDetail(item,index)">
				<image v-if="Number(item.icon_type) === 20" :src="curIndex === index ? item.selectImgUrl : item.imgUrl"
					mode="widthFix"></image>
				<span v-else :class="item.icon" :style="[icon(curIndex, index)]"></span>
				<text :class="curIndex === index?'gray3 active':'gray3'" 
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
				curIndex: 0,
				isIphoneX: 0,
				tabbarData: {},
				item_width: '25%',
			}
		},
		created() {
			let self = this;
			var pages = getCurrentPages();
			var currentpage = pages[pages.length - 1];
			let count = 0;
			
			
			self.tabbarData = store.getters.tabBarX;
			self.tabbarData.data.forEach(function(item, index) {
				let linkUrl = item.linkUrl;
				if (item.linkUrl.indexOf('?') !== false) {
					let linkUrl_arr = item.linkUrl.split('?');
					linkUrl = linkUrl_arr[0];
				}
				if (currentpage.route == linkUrl) {
					count = 1;
					self.curIndex = index;
					uni.setStorageSync('curIndex', index);
				}
			
			
			});

			if (count == 0) {
				uni.setStorageSync('curIndex', 0);
			}
			this.curIndex = uni.getStorageSync('curIndex');
			this.item_width = 100 / Math.abs(this.tabbarData.style.rowsNum) + '%';

			if (uni.getStorageSync('isIphoneX')) {
				this.isIphoneX = uni.getStorageSync('isIphoneX');
				console.log(this.isIphoneX);
			}

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
				return (curIndex, index,onColor="",scolor="") => {
					let color = ''
					if (curIndex === index) {
						if(onColor){
							color = onColor
						}else{
							color = this.$store.getters.titleBackgroundColor || '#C82829'
						}
						
					}else{
						color = scolor
					}
					console.log("color",color)
					return {
						color
					}
				}
			},

			updateTabBar() {
				if(store.getters.tabBarX != undefined && store.getters.tabBarX != "undefined"){
					uni.setStorageSync("tabbar",store.getters.tabBarX)
				}
				
				if(uni.getStorageSync("tabbar")){
					return uni.getStorageSync("tabbar")
				}else{
					return store.getters.tabBarX	
				}
				
				
			
			}
		},
		methods: {
			gotoDetail(e, key) {
				this.curIndex = key;
				let timestamp = new Date().getTime();
				uni.setStorageSync('curIndex', this.curIndex);
				let card_id = uni.getStorageSync('card_id');
				if (e.appid != undefined && e.appid != '') {
					uni.navigateToMiniProgram({
						// #ifdef MP
						appId: e.appid,
						path: e.linkUrl != undefined ? e.linkUrl : '',
						// #endif
					})
				} else {

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
		height: 130rpx;
	}

	.tabbarheight {
		height: 130rpx;
	}

	.tabbar {
		box-sizing: border-box;
		// border-top: 1rpx solid #DDDDDD;
		position: fixed;
		background: #FFFFFF;
		display: flex;
		justify-content: space-evenly;
		//flex-wrap: wrap;
		left: 0;
		width: 100%;
		z-index: 998;
		bottom: 0;
	}

	.tabbar .item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
		height: 100rpx;
	}

	/* 原来菜单图标是图片 */
	.tabbar .item image {
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
