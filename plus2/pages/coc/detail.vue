<template>
	<scroll-view scroll-y="true" :style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'"
		@scrolltolower="in_scrolltolower">

		<view class="yuyue0">
			<view class="yuyue" :style="'background:'+getSecondBackgroundColor()+';'">
				<view class="yuyue_1">
					<image :src="detail.image_url" mode=""></image>
				</view>
				<view style="flex: 0.3;">

				</view>
				<view class="yuyue_2">
					<view class="yuyue_2_1"  :style="'color:'+getMainTextColor()+';'">
						{{detail.name}}
					</view>

					<view class="yuyue_2_3" v-if="detail.short_name">
						<text style="color: #bcbab5;font-size: 24rpx;">
							{{$nw("简称")}}：{{detail.short_name}}</text>
					</view>

				</view>

			</view>

		</view>

		<view class="xet" :style="'background:'+getSecondBackgroundColor()+';'">
			<view class="xet1">
				<view class="xet1_0"  :style="'color:'+getMainTextColor()+';'">
					
					<image v-if="detail.path" 
					style="margin: auto;width: 100rpx;height: 100rpx;" :src="detail.path"></image>
					<view v-else style="padding-top: 30rpx">{{detail.grade.name}}</view>
				</view>
				<view class="xet1_1">
					{{$nw("会员级别")}}
				</view>
			</view>
			<view class="xet1">
				<view class="xet1_0">
					<image class="image1" src="/static/coc_time.png" mode=""></image>
					<view class="im_text" style="transform: scale(0.8);">
						{{detail.time_year}}
					</view>
				</view>
				<view class="xet1_1">
					{{$nw("入会年龄")}}

				</view>
			</view>
			<view class="xet1" v-if="detail.card" @click="card(detail.card.card_id)">
				<view class="xet1_0">
					<image class="image2" :src="detail.card.avatar_image" mode=""></image>
				</view>
				<view class="xet1_1">
					{{$nw("联系人")}}
				</view>
			</view>

		</view>


		<view class="det"  
		:style="'background:'+getSecondBackgroundColor()+';'" 
		v-for="(item,index) in arr" :key="index"
		v-if="item.val.length > 0"
		>
			<view class="det1"  :style="'color:'+getTextColorWhite()+';'">
				{{$nws(item.text)}}
			</view>
			<view class="det2" :style="'color:'+getTextColorGrey()+';'">
				{{item.val}}
			</view>
		</view>
		
		<view style="height: 200rpx;width: 100%;">
			
		</view>

	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				index: 0,
				tab: [],
				detail: {},
				arr: [],
				coc_id:0,
				scrollviewHigh:0
			}
		},
		onShow() {
			this.init();
			this.getData()
			//获取分类
			this.setGlobalColor()
			var self = this;
			self._post(
				'plus.coc.Coc/getGrade', {

				},
				function(
					res
				) {
					self.tab = res.data.grade
				});
		},
		onLoad(obj) {
			this.coc_id = obj.id;
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
			card(e){
				uni.navigateTo({
					url:"/card/pages/card/index?card_id="+e
				})
			},
			getData() {
				var self = this;
				self._post(
					'plus.coc.Coc/detail', {
						coc_id:self.coc_id
					},
					function(
						res
					) {

						self.detail = res.data.detail
						self.arr = res.data.arr
						uni.setNavigationBarTitle({
							title:self.detail.name
						})
					});
			},
			tab_click(index) {
				var self = this;
				console.log(index)

				self.tab.forEach(function(res) {
					res.flag = false;
				})
				self.tab[index].flag = true
				self.getData();
			},
			getGrade() {
				var self = this;
				var item = {}
				self.tab.forEach(function(res) {
					if (res.flag) {
						item = res;
					}
				})
				console.log("item", item)
				return JSON.stringify(item).length > 8 ? item : {
					grade_id: 0
				};
			},
			yuyue_click(id) {
				uni.navigateTo({
					url: "/plus2/pages/coc/detail?id=" + id
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: rgb(246, 246, 246);
	}

	.xet {
		width: 96%;
		padding-bottom: 40rpx;
		background: #fff;
		border-radius: 10rpx;

		margin: auto;
		margin-top: 10rpx;
		display: flex;

		.xet1 {
			flex: 1;

			.xet1_0 {
				margin-top:40rpx;
				text-align: center;
				height: 100rpx;
				line-height: 100rpx;
				position: relative;

				.im_text {
					width: 100%;
					height: 50rpx;
					top: 25rpx;
					position: absolute;
					left: 0rpx;
					color: rgb(255, 159, 0);
					font-size: 24rpx;
				}

				.image1 {
					width: 100rpx;
					height: 100rpx;
					margin: auto;


				}

				.image2 {
					width: 100rpx;
					height: 100rpx;
					margin: auto;
					border-radius: 50%;
				}
			}

			.xet1_1 {
				width: 150rpx;
				height: 60rpx;
				border-radius: 50rpx;
				text-align: center;
				line-height: 60rpx;
				background: rgb(255, 159, 0);
				color: #fff;
				font-size: 24rpx;
				margin: auto;
				margin-top: 20rpx;
			}
		}
	}

	.det {
		width: 96%;
		height: 190rpx;
		background: #fff;
		border-radius: 10rpx;

		margin: auto;
		margin-top: 20rpx;

		.det1 {
			width: 90%;
			margin: auto;
			padding-top: 40rpx;
			font-size: 32rpx;
			font-weight: 600;
		}

		.det2 {
			width: 90%;
			margin: auto;
			font-size: 26rpx;

		}
	}

	.yuyue0 {
		width: 100%;
		margin: auto;
		margin-top: 20rpx;
		padding-bottom: 30rpx;
	}

	.yuyue {


		width: 90%;
		margin: auto;

		margin-top: 20rpx;
		display: flex;




		.yuyue_1 {

			flex: 2;

			image {
				width: 150rpx;
				height: 150rpx;
				margin-left: 20rpx;
				margin-top: 20rpx;
				border-radius: 2rpx;

			}
		}

		.yuyue_2 {
			flex: 7;

			.yuyue_2_1 {
				width: 95%;
				font-size: 34rpx;
				margin: auto;
				margin-top: 40rpx;
				line-height: 40rpx;
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