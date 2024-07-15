<template>
	<view class="diy-banner-box">
		<!-- 一排 多列 -->
		<view class="" v-if="itemData.params.type == 1">
			<view class="tabbar-wrapper" style="padding-right: 20rpx;">
				<view class="tabbar-item" v-for="(item,index) in itemData.data" :key="index" @tap="gotoPages(item)">
					<image style="border-radius: 15rpx;box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);" :style="'height:'+itemData.style.height+'px;'+
							'width:'+itemData.style.width+'px;'" :src="item.image" mode=""></image>
				</view>
			</view>
		</view>
		<!-- 多拍两列 -->
		<view class="" v-if="itemData.params.type == 2">
			<view class="bann1" style="box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);" @tap="gotoPages(item)"
				v-for="(item,index) in itemData.data" :key="index">
				<image class="bann1_image" :src="item.image" mode="" />

			</view>
			<view class="" style="clear: both;">

			</view>
		</view>

		<!-- 文字单排-->
		<view class="" :style="'background:'+getMainColor()+';'+'color:'+getMainTextColor()+';'" 
		
		v-if="itemData.params.type == 3">
			<Tabbara :tabbar_list="itemData.data" type="2" @tabbarEmit="tabbarEmit"></Tabbara>
			
			

			<view v-if="itemData.params.type == 3" 
			:style="'background:'+getMainColor()+';'+'color:'+getMainTextColor()+';'"
			style="width: 100%;padding-bottom: 40rpx;">
				<view style="width: 95%;margin: auto;" :style="'color:'+getTextColorWhite()+';'">
					<!-- #ifdef H5 -->
					<text style="white-space: pre-wrap;" v-html="formatWord(getRichtext())"></text>
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<view v-html="formatContent(getRichtext())"></view>
					<!-- #endif -->
					<!-- #ifdef APP -->
					<view v-html="formatContent(getRichtext())"></view>
					<!-- #endif -->
				</view>
			</view>


		</view>



	</view>
</template>

<script>
	// import lModal from '@/components/l-modal.vue'
	import utils from '@/common/utils.js';
	import Tabbara from '@/components/tabbar/tabbara.vue';
	export default {
		components:{
			Tabbara
		},
		props: {
			swiperHeight: {
				type: Number,
				default: 747
			},

			itemData: {
				type: Object,
				default: {}
			}, //轮播图速度
			interval: {
				type: Number,
				default: 15000
			}
		},
		data() {
			return {
				videoStat: false,
				videoContext: '',
				indicatorDots: true,
				autoplay: true,
				duration: 500,
				indicatorActiveColor: '#ffffff',
				customBarH: '',
				intervalDefault: 10000, //轮播图速度
				share_title: "",
				bannerHeight: '360'
			}
		},
		mounted() {
				this.setGlobalColor()
			this.intervalDefault = this.itemData.params.interval;
			this.indicatorActiveColor = this.itemData.style.btnColor;
			let self = this;
			self.itemData.data.forEach((item, index) => {
				if (item.type != 'video') {
					console.log(index)
					uni.getImageInfo({
						src: item.imgUrl,
						success: function(image) {
							self.bannerHeight = image.height * (750 / image.width)
						}
					});
				}
			})
		},
		methods: {
			getRichtext() {
				var text = "";
				this.itemData.data.forEach(function(re) {
					if (re.flag) {
						text = re.richtext
					}
				})
				return text;
			},
			formatContent(e) {
				return utils.format_content(e);
			},
			playVideo() {
				this.autoplay = false;
			},
			pauseVideo() {
				this.autoplay = true;
			},
			videoFull(video_id) {
				let video = uni.createVideoContext(video_id, this)
				video.requestFullScreen({
					direction: 0
				})
			},
			videoSta(video_id) {
				let video = uni.createVideoContext(video_id, this)
				if (this.videoStat == false) {
					video.play()
					this.videoStat = true
				} else {
					video.pause()
					this.videoStat = false
				}
			},
			changeItem(e) {
				let self = this;
				this.itemData.data.forEach((item, index) => {
					if (item.type == 'video') {
						let video = uni.createVideoContext('myVideo_' + index, this)
						video.pause()
						self.autoplay = true;
					}
				})
			},
			/*跳转页面*/
			gotoPages(e, num, index) {
				if (e.linkUrl.length > 0) {
					this.gotoPage(e.linkUrl);
				}



			},
			tabbarEmit(index){
				this.itemData.data.forEach(function(re) {
					re.flag = false;
				})
				this.itemData.data[index].flag = true;
				console.log(this.itemData.data[index].flag);
				this.$forceUpdate()
			},

		},
		onReady() {
			uni.getSystemInfo({
				success: (e) => {
					this.statusBarH = e.statusBarHeight
					// #ifdef MP-WEIXIN
					let custom = wx.getMenuButtonBoundingClientRect()
					this.customBarH = custom.bottom + custom.top - e.statusBarHeight - 18 + 'px'

					// #endif

				}
			})


		},
	}
</script>

<style lang="scss" scoped>
	.bann1 {
		width: 47%;
		float: left;
		height: 200rpx;

		margin-left: 2%;
		position: relative;
		margin-bottom: 20rpx;

		.bann1_image {
			width: 100%;
			height: 100%;
			border-radius: 15rpx;
		}
	}


	.diy-banner-box,
	.diy-banner-box .swiper {
		width: 750rpx;
		// min-height: 800rpx;
		//max-height: 800rpx;
	}

	.diy-banner-box swiper image {
		margin: 0rpx 0rpx 10rpx 0;
		width: 750rpx;
		/* height: 342rpx; */
		/* border-radius: 16rpx; */
	}

	.share_image {
		width: 540rpx;
		height: 320rpx;
	}

	.swiper-video {
		width: 750rpx;
		height: 360rpx;
	}

	swiper-item {
		position: relative;
	}

	.wrap {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		z-index: 100;
	}

	.full {
		width: 50rpx;
		height: 50rpx;
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		z-index: 1000;
	}
</style>