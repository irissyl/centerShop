<template>
	<view v-if="data.length > 0">
		<!-- 广告 -->
		<view class=""   v-for="(item,index) in data" :key="index" >

			<swiper class="bann1" v-if="item.type == 1 && item.status == 1" 
			:style="'height:'+item.setting[sindex].height+'rpx'"
			@change="swiperChange"
			:autoplay="true"
			:indicator-dots="true"
			indicator-active-color="#fff"
			>
			
				<swiper-item style="box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);position: relative;"
				 
				 @tap="gotoPages(itemA)" v-for="(itemA,indexA) in item.setting" :key="indexA">
					 <image class="bann1_image" :src="itemA.image_url" mode=""
					
					 />
					 
					 <view class="ad" v-if="item.is_label == 1">{{$nw("广告")}}</view>
				</swiper-item>
				
			</swiper>
			<view class="bann1" v-if="item.type == 2" 
			style="box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);position: relative;"
				@tap="gotoPages(item.setting[0])"
				>

				<image class="bann1_image" 
				:src="item.setting[0].image_url" mode=""
				  :style="'height:'+item.setting[0].height+'rpx'"
				  
				  />
				 <view class="ad" v-if="item.is_label == 1">{{$nw("广告")}}</view>
			</view>

			<view class="" style="clear: both;">

			</view>
		</view>
	

	</view>
</template>

<script>
	// import lModal from '@/components/l-modal.vue'
	export default {
		props: {
			location_id: {
				type: String,
				default: ""
			},
			//轮播图速度
			interval: {
				type: Number,
				default: 15000
			}
		},
		data() {
			return {

				indicatorDots: true,
				autoplay: true,
				duration: 500,
				indicatorActiveColor: '#ffffff',
				customBarH: '',
				intervalDefault: 10000, //轮播图速度
				share_title: "",
				bannerHeight: '360',

				data: [],
				sindex:0,
			}
		},
		components: {
			// lModal
		},
		mounted() {
			var self = this;
			self._get('index/adList', {
				location_id: self.location_id
			}, function(res) {
				console.log("ad", res.data)
				self.data = res.data

			})
		},
		methods: {
			swiperChange(e){
				this.sindex = e.detail.current
				this.$forceUpdate()
			},
			/*跳转页面*/
			gotoPages(e) {
				if(e.page_url && e.page_url.length > 0){
					this.gotoPage(e.page_url);
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
	.ad{
		padding-left: 20rpx;
		padding-right: 20rpx;
		height: 40rpx;
		border: 1rpx solid #fff;
		text-align: center;
		line-height:40rpx;
		color: #fff;
		font-size: 24rpx;
		position: absolute;
		right: 0rpx;
		bottom: 0rpx;
		background: rgba(255, 255, 255, 0.4);
	}
	.bann1 {
		width: 100%;
	

		margin-bottom: 5rpx;
		position: relative;

		.bann1_image {
			width: 100%;
			height: 100%;
		}
	}

	.tabbar-wrapper {
		width: 100%;
		overflow-x: auto;
		white-space: nowrap;

		padding: 24rpx 0;

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
	}

	.diy-banner-box swiper image {
		margin: 0rpx 0rpx 0rpx 0;
		width: 750rpx;
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