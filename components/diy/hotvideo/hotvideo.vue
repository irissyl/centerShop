<template>
	<view class="diy-banner-box">
		<!-- 热门视频 -->
	
		<Label :item="item1" :name="itemData.params.name" v-if="itemData.data.length > 0"></Label>
		
		<Videoi :videoData="itemData.data"></Videoi>


	</view>
</template>

<script>
	// import lModal from '@/components/l-modal.vue'
	import utils from '@/common/utils.js';
	import Label from '@/components/label/label.vue';
	import Videoi  from '@/components/index/video.vue';
	export default {
		components:{
			Videoi,
			Label
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
				bannerHeight: '360',
				item1: {
					code: "re_video",
					title:  this.$nw("热门视频"),
					color: this.getMainTextColor(),
					right: true
				},
			}
		},

		mounted() {
			var self = this;
			setTimeout(function() {
				self.item1.color = self.getMainTextColor()
			}, 500)
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
				if (num != 3) {
					if (e.linkUrl.length > 0) {
						this.gotoPage(e.linkUrl);
					}
				} else {
					this.itemData.data.forEach(function(re) {
						re.flag = false;
					})
					this.itemData.data[index].flag = true;
				}



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

	.tabbar-wrapper {
		width: 100%;
		overflow-x: auto;
		white-space: nowrap;
		background: #fff;
		// padding: 24rpx 0;

		& .tabbar-item {

			text-align: center;
			display: inline-block;
			padding: 10rpx 0;
			position: relative;
			margin-left: 2%;

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