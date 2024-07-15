<template>
	<scroll-view scroll-y="true" 
	:style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'"
		@scrolltolower="in_scrolltolower">
	<view  :style="'background:'+getMainColor()+';'">

		<view class="yuyue0" 
		:style="'background:'+getSecondBackgroundColor()+';'"
		v-for="(item,index) in list" :key="index" 
		@click="yuyue_click(item.staff_id)">
			<view class="yuyue">
				
				<view  class="yuyue_2" >
					<view class="yuyue_2_1">
					  <text v-if="item.supply">商家：{{item.supply.name}}</text>	
					</view>
				</view>
	
				<view class="yuyue_2">
					<view class="yuyue_2_1">
					  <text v-if="item.numb">编号：{{item.numb}}</text>	
					 </view>
				</view>
				
				<view class="yuyue_2">
					<view class="yuyue_2_1">
					  <text v-if="item.name" >姓名：{{item.name}}</text>	
					</view>
				</view>
				
				<view  class="yuyue_2">
					<view class="yuyue_2_1" >
					  <text v-if="item.welfare">福利金：
						<text  :style="'color:'+getMainTextColor()+';'">  {{item.welfare}}</text>
					  </text>	
					</view>
				</view>

			</view>

		</view>
		
		<template v-if="list.length <=0">
			<view class="none-data-box">
				<text>未获取到数据</text>
			
			</view>
		</template>

	</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				index: 0,
				list: [],
				scrollviewHigh:0,
			}
		},
		mounted() {
			this.setGlobalColor()
			this.init();
		},
		onShow() {
			this.getData()
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
			
			getData() {
				var self = this;
				self._post(
					'plus.welfare.Index/welfare', {
						
					},
					function(
						res
					) {

						self.list = res.data.list.data

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





		color: #fff;

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
				font-size: 30rpx;
				margin: auto;
				
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