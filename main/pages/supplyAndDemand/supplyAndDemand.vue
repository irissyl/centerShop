<template>
	<view style="padding: 24rpx;">

		<!-- <u-button @click="show = true">打开</u-button> -->
		<view class="screen dbb">
			<view class="screen-box dcc" @click="objShow.show1 = true">
				<text>类型</text>
				<u-icon name="arrow-down-fill" color="#333333" size="10"></u-icon>
			</view>
			<view class="screen-box dcc" @click="objShow.show2 = true">
				<text>行业</text>
				<u-icon name="arrow-down-fill" color="#333333" size="10"></u-icon>
			</view>
			<view class="screen-box dcc" @click="objShow.show3 = true">
				<text>地区</text>
				<u-icon name="arrow-down-fill" color="#333333" size="10"></u-icon>
			</view>
			<view class="screen-box dcc" @click="objShow.show4 = true">
				<text>合作金额</text>
				<u-icon name="arrow-down-fill" color="#333333" size="10"></u-icon>
			</view>
		</view>
		<view class="content">
			<view class="content-box" v-for="(item,index) in 5" :key="index">
				<view class="content-top dbb">
					<view class="info">
						<img src="https://copyright.bdstatic.com/vcg/creative/cc9c744cf9f7c864889c563cbdeddce6.jpg@h_1280"
							mode=""></img>
						<view class="">
							<view style="font-size: 28rpx;line-height: 1.2;">万先生</view>
							<view class="info1">
								<view class="" style="font-size: 20rpx;margin-right: 14rpx;color: #A7A7A7;">
									副经理
								</view>
								<view class="" style="font-size: 20rpx;color: #A7A7A7;">
									东莞市安途信息科技有限公司
								</view>
							</view>
						</view>
					</view>
					<view class="" style="font-size: 20rpx;color: #A7A7A7;">
						2024-03-24
					</view>
				</view>
				<view class="business">
					<view class="business-l">
						提供
					</view>
					<view class="business-r">
						一站式线上电商托管服务
					</view>
				</view>
				<view class="label">
					<view class="label-box">
						东莞市
					</view>
					<view class="label-box">
						互联网
					</view>
				</view>
				<view class="picture">
					<view class="picture-box">
						<img src="https://copyright.bdstatic.com/vcg/creative/cc9c744cf9f7c864889c563cbdeddce6.jpg@h_1280"
							mode=""></img>
					</view>
					<view class="picture-box">
						<img src="https://copyright.bdstatic.com/vcg/creative/cc9c744cf9f7c864889c563cbdeddce6.jpg@h_1280"
							mode=""></img>
					</view>
					<view class="picture-box">
						<img src="https://copyright.bdstatic.com/vcg/creative/cc9c744cf9f7c864889c563cbdeddce6.jpg@h_1280"
							mode=""></img>
					</view>
					<view class="picture-box">
						<img src="https://copyright.bdstatic.com/vcg/creative/cc9c744cf9f7c864889c563cbdeddce6.jpg@h_1280"
							mode=""></img>
					</view>
					<view class="picture-box">
						<img src="https://copyright.bdstatic.com/vcg/creative/cc9c744cf9f7c864889c563cbdeddce6.jpg@h_1280"
							mode=""></img>
					</view>
					<view class="picture-box">
						<img src="https://copyright.bdstatic.com/vcg/creative/cc9c744cf9f7c864889c563cbdeddce6.jpg@h_1280"
							mode=""></img>
					</view>
				</view>
				<view class="bottom dbb">
					<view class="" style="display: flex;">
						<view class="bottom-box">
							<view class="bottom-box-t">
								项目金额
							</view>
							<view class="bottom-box-tt">
								10-50万
							</view>
						</view>
						<view class="bottom-box">
							<view class="bottom-box-t">
								合作意向
							</view>
							<view class="bottom-box-tt">
								10人
							</view>
						</view>
					</view>
					<view class="bottom-box1">
						合作咨询
					</view>
				</view>
			</view>
		</view>
		<!-- <u-popup :show="show" closeable closeOnClickOverlay @close="close" round="10">
			<u-tabs :list="list" :is-scroll="false" :current="current" @change="change"></u-tabs>
			<view class="popupContent">
				<u-select v-model="show1" mode="mutil-column" :list="list1" @confirm="confirm"></u-select>
			</view>
		</u-popup> -->
		<u-picker v-model="objShow.show1" :default-selector="[0]" :range="selector" mode="selector" @close="close" @cancel="close"
			@confirm="confirm" title="类型"></u-picker>
		<u-picker v-model="objShow.show2" :default-selector='[0, 1]' :range="multiSelector" mode="multiSelector" @close="close" @cancel="close" @confirm="confirm"
			title="行业"></u-picker>
		<u-picker v-model="objShow.show3" mode="region" @close="close" @cancel="close" @confirm="confirm"
			title="地区"></u-picker>
		<u-picker v-model="objShow.show4" :default-selector="[0]" :range="selector" mode="selector" @close="close" @cancel="close" @confirm="confirm"
			title="合作金额"></u-picker>
		<!-- <u-select v-model="show" mode="mutil-column-auto" :list="list" @confirm="confirm"></u-select> -->
		<Tabbar></Tabbar>
		
	</view>
</template>

<script>
	import Tabbar from '@/components/tabbar/tabbar.vue';
	export default {
		components: {
			Tabbar
		},
		data() {
			return {
				objShow: {
					show1: false,
					show2: false,
					show3: false,
					show4: false,
				},
				selector: [1, 2, 3],
				multiSelector: [
					[1, 2, 3],
					[4, 5, 6]
				],
				selectorObj: [{
						cateName: '1',
						id: 1
					},
					{
						cateName: '2',
						id: 2
					}
				],
				list: [{
					name: '类型'
				}, {
					name: '行业'
				}, {
					name: '地区'
				}, {
					name: '合作金额'
				}],
				current: 0
			};
		},
		methods: {
			confirm() {
				this.show = false
			},
			change() {

			},
			close() {
				this.show = false
			}
		},
		onLoad() {
			this.setGlobalColor()
		},
		onShow() {
			var self = this;
			uni.setNavigationBarTitle({
				title: self.$nw("供需")
			});
		},
	}
</script>

<style lang="scss">
	.popupContent {
		height: 70vh;
		overflow: auto;
	}

	.screen {
		.screen-box {
			width: 152rpx;
			height: 52rpx;
			line-height: 50rpx;
			background: #FFFFFF;
			border-radius: 84rpx 84rpx 84rpx 84rpx;
			text-align: center;
			color: #333333;
			font-size: 24rpx;

			text {
				margin-right: 10rpx;
			}
		}
	}

	.content {
		margin-top: 24rpx;

		.bottom {
			display: flex;
			align-items: center;
			margin-top: 14rpx;

			.bottom-box1 {
				width: 156rpx;
				height: 64rpx;
				background: linear-gradient(270deg, #1B94E0 0%, #40B4FD 100%);
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				font-size: 28rpx;
				color: #fff;
				text-align: center;
				line-height: 62rpx;
			}

			.bottom-box {
				margin-right: 60rpx;

			}

			.bottom-box-t {
				color: #333333;
				font-size: 20rpx;
				line-height: 1.5;
			}

			.bottom-box-tt {
				line-height: 1.5;
				color: #EB1C1C;
				font-size: 32rpx;
			}
		}

		.content-box {
			margin-bottom: 16rpx;

			.picture {
				overflow-x: auto;
				margin-top: 24rpx;
				white-space: nowrap;

				.picture-box {
					display: inline-block;
					overflow: hidden;
					margin-right: 24rpx;
					width: 128rpx;
					height: 128rpx;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					margin-right: 24rpx;
				}
			}

			.label {
				display: flex;
				align-items: center;

				.label-box {
					width: 76rpx;
					height: 36rpx;
					line-height: 34rpx;
					text-align: center;
					margin-right: 16rpx;
					font-size: 20rpx;
					color: #666666;
					background: #EEEEEE;
					border-radius: 4rpx 4rpx 4rpx 4rpx;
				}
			}

			.business {
				display: flex;
				align-items: center;
				margin-top: 4rpx;

				.business-l {
					width: 56rpx;
					height: 36rpx;
					lighting-color: 34rpx;
					text-align: center;
					margin-right: 10rpx;
					background: #1B94E0;
					border-radius: 4rpx 4rpx 4rpx 4rpx;
					font-size: 20rpx;
					color: #FFFFFF;
				}

				.business-r {
					font-size: 32rpx;
					color: #333333;
					font-weight: 800;
				}
			}

			width: 700rpx;
			height: 464rpx;
			background: #FFFFFF;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			padding: 24rpx;

			.content-top {

				.info {
					display: flex;
				}

				.info1 {
					display: flex;
				}

				img {
					width: 64rpx;
					height: 64rpx;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					margin-right: 16rpx;
				}
			}
		}
	}
</style>