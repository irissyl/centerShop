<template>
	<scroll-view scroll-y="true" :style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'"
		@scrolltolower="in_scrolltolower">
		<view :style="'background:'+getMainColor()+';'">

			<view class="yuyue0" v-for="(item,index) in list" :key="index" @click="yuyue_click(item.album_id)">
				<view class="yuyue">
					<view style="flex: 0.7;">
						
					</view>
					<view class="yuyue_2">
						<view class="yuyue_2_1" :style="'border-left: 7rpx solid '+getMainTextColor()+';'">
							{{item.name}}
						</view>
					</view>

					<view style="margin-top: 20rpx;">
						<image
							style="border-radius: 15rpx;  width: 215rpx;height:220rpx;float: left;margin-left: 15rpx;"
							v-for="(itemA,indexA) in item.image" v-if="indexA < 3" :src="itemA.file_path" :key="indexA">
						</image>

						<view style="clear: both;"></view>

					</view>

					<view class="" style="margin-top: 20rpx;">

						<view class="" style="font-size: 30rpx;color: #717171; float: left;line-height: 60rpx;margin-left: 20rpx; ">
							<text class="iconfont icon-chakan" style="color: #717171;margin-right: 5rpx;"></text>
							{{item.create_time}}
						</view>
						<view class="" style="float: right;margin-right: 20rpx;">
							<view class="" style="font-size: 30rpx;line-height: 60rpx; float: left;color: #363636;">
								{{$nw('共')}} {{item.image.length}} {{$nw('张')}}
							</view>
							<view style="color: #fff; background: linear-gradient(to right, #f2b237, #ffda98);margin-left: 10rpx; border-radius: 15rpx; line-height: 60rpx; float: left;width: 140rpx;height: 60rpx;font-size: 30rpx;text-align: center;">
								{{$nw('查看全部')}} </view>
							<view style="clear: both;">

							</view>
						</view>
						<view class="" style="clear: both;">

						</view>
					</view>

				</view>

			</view>

			<template v-if="list.length <=0">
				<view class="none-data-box">
					<text>{{$nw("未获取到数据")}}</text>

				</view>
			</template>

		</view>
		<service :itemData="t_service"></service>
		
	</scroll-view>
</template>

<script>
	import service from '@/components/diy/service/service';
	
	export default {
		components:{
			service,
			
		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				index: 0,
				list: [],
				scrollviewHigh: 0,
			}
		},
		mounted() {
			this.setGlobalColor()
			this.init();
		},
		onShow() {
			this.getData()
			uni.setNavigationBarTitle({
				title:this.$nws("相册")
			})
		},
		onShareTimeline() {
			return {
				title: "相册列表",
				path: '/plus2/pages/album/list'
			};
		},
		methods: {
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.scrollviewHigh = res.windowHeight;

					}
				});
			},

			/**
			 * 设置分享内容
			 */
			onShareAppMessage() {
				let self = this;
				return {
					title: self.$nw("相册列表"),
					path: '/plus2/pages/album/list'
				};
			},
			getData() {
				var self = this;
				self._post(
					'plus.album.Index/index', {

					},
					function(
						res
					) {

						self.list = res.data.list

					});
			},

			yuyue_click(id) {
				uni.navigateTo({
					url: "/plus2/pages/album/album?album_id=" + id
				})
			}
		}
	}
</script>

<style lang="scss">
	.yuyue_3 {
		.yuyue_3_2 {

			text-align: center;
			color: #177E15;
			line-height: 40rpx;
			font-size: 24rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;
			float: left;
			height: 40rpx;
			border-radius: 450rpx;
			background: rgb(255, 159, 0);
			color: #fff;
			margin-left: 170rpx;
			margin-top: 10rpx;

		}


	}

	.yuyue0 {
		width: 95%;
		margin: auto;
		background: #fff;
		border-radius: 16rpx;
		box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.1);
		padding-top: 20rpx;
		margin-bottom: 30rpx;
		padding-bottom: 30rpx;
	}

	.yuyue {




		margin-top: 30rpx;





		.yuyue_1 {

			flex: 2;
			
			image {
				width: 120rpx;
				height: 120rpx;
				margin-left: 20rpx;
				margin-top: 20rpx;
				border-radius: 16rpx;
			}
		}

		.yuyue_2 {
			flex: 7;

			.yuyue_2_1 {
				width: 95%;
				font-size: 34rpx;
				margin: auto;
				// padding-top: 20rpx;
				border-radius: 2rpx;
				padding-left: 10rpx;
				
			}

			.yuyue_2_3 {
				width: 95%;
				font-size: 30rpx;
				margin: auto;

			}

			.yuyue_2_4 {
				width: 90%;
				font-size: 30rpx;
				margin: auto;
				margin-top: 5rpx;
				color: #c3c1bb;
			}

		}
	}

	.tab {
		width: 100%;

		background: #fff;

		padding-bottom: 10rpx;

		.tab_1 {
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;

		}

		.tab_11 {
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin-right: 20rpx;
			font-size: 30rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: #666666;
		}

		.tab_12 {
			image {
				width: 48rpx;
				height: 48rpx;
				margin-top: 16rpx;
			}
		}

		.tab_2 {
			width: 15%;
			height: 4rpx;
			background: #f4a543;
			opacity: 1;
			margin-left: 42%;
			margin-top: -15rpx;
		}

	}

	.tabbar-wrapper {
		width: 100%;
		overflow-x: auto;
		white-space: nowrap;
		background-color: #ffffff;

		& .tabbar-item {
			width: 25%;
			text-align: center;
			display: inline-block;
			position: relative;

			&__active {
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