<template>
	<view class="diy-banner-box">
		<!-- <view class="box-t">
			<view class="box-t1" @click="show = true">
				<text>类型</text>
				<u-icon name="arrow-down-fill" size="20"></u-icon>
			</view>
			<view class="box-t1" @click="show = true">
				<text>行业</text>
				<u-icon name="arrow-down-fill" size="20"></u-icon>
			</view>
			<view class="box-t1" @click="show = true">
				<text>地区</text>
				<u-icon name="arrow-down-fill" size="20"></u-icon>
			</view>
		</view> -->
		<view class="box" v-for="(item,index) in gsList" :key="index" @click="gotoList(item)">
			<view class="box-top">
				<view style="display: flex;align-items: center;">
					<view class="img">
						<img :src="item.image_url" alt="" />
					</view>
					<view class="top-t">
						<view class="">
							{{item.name}}
						</view>
						<view class="top-b">
							<!-- <text>天使轮</text> -->
							<!-- <text style="margin:0 10upx;">20-99人</text> -->
							<text>{{item.create_time.split(' ')[0]}}</text>
						</view>
					</view>
				</view>
				<view class="">
					<u-icon name="arrow-right" size="20"></u-icon>
				</view>
			</view>
			<view class="tps">
				<!-- <view class="tps1">
					在业
				</view> -->
				<view class="tps2">
					{{item.coc_work_type}}
				</view>
				<!-- <view class="tps3">
					中型
				</view> -->
			</view>
			<view class="tietle u-line-2">
				{{item.business}}
			</view>
			<view class="gundon">
				<video v-if="item.coc_video" class="vid" :src="item.coc_video"></video>
				<view class="g-img" v-for="(i,j) in item.uploadFile" :key="j">
					<img :src="websiteUrl+'file/uploads/'+i.save_name" alt="" />
				</view>
			</view>
		</view>
		<view class="" style="margin-top: 400rpx;">
			<u-empty text="数据为空" mode="data" v-if="gsList.length === 0"></u-empty>
		</view>
		<u-select v-model="show" :list="list"></u-select>
	</view>
</template>

<script>
	export default {
		props: {

		},
		data() {
			return {
				show: false,
				list: [{
						value: '1',
						label: '江'
					},
					{
						value: '2',
						label: '湖'
					}
				],
				gsList: [],
				cocOrgId: 0,
				websiteUrl: this.websiteUrl
			}
		},
		onLoad(e) {
			console.log(e, 12);
			this.cocOrgId = e.cocOrgId
		},
		onShow() {
			this.setGlobalColor()
			this._get('plus.coc.Coc/getCocListByOrgId', {
				coc_org_id: this.cocOrgId,
				linkStatus: 99
			}, (res) => {
				this.gsList = res.data.list
			})
		},
		methods: {
			gotoList(e) {
				console.log(e, 12);
				uni.navigateTo({
					url: '/main/pages/enterprisesAll/CompanyDetails/CompanyDetails?coc_id=' + e.coc_id
				})
			}
		},
		mounted() {}
	}
</script>

<style lang="scss" scoped>
	.diy-banner-box {
		.box-t1 {
			width: 152rpx;
			height: 52rpx;
			line-height: 50rpx;
			text-align: center;
			background: #FFFFFF;
			border-radius: 84rpx 84rpx 84rpx 84rpx;

			text {
				font-size: 24rpx;
				font-weight: 400;
				margin-right: 16rpx;
			}

			margin-right: 32rpx;
		}

		.box-t {
			width: 100%;
			display: flex;
			padding: 0 24upx;
			color: #333333;
			font-weight: 800;

			.box-t-t {
				font-size: 24upx;
				color: #666666;
				display: flex;
				justify-content: space-between;
				align-items: center;
				width: 130upx;
				margin-right: 50upx;
			}
		}

		.box {
			.box-top {
				display: flex;
				justify-content: space-between;
				align-items: center;

				.img {
					width: 64rpx;
					height: 64rpx;
					margin-right: 16rpx;

					img {
						width: 64rpx;
						height: 64rpx;
						border-radius: 8rpx;
					}
				}

				.top-t {
					color: #333333;
					font-size: 28rpx;
					font-weight: 800;
				}

				.top-b {
					text {
						color: #666;
					}

					font-size: 20rpx;
				}
			}

			.tps {
				display: flex;
				margin-top: 10upx;

				view {
					margin-right: 24upx;
					font-size: 20rpx;
					padding: 0 16rpx;
					background: #EEEEEE;
					line-height: 1.5;
					color: #666666;
					border-radius: 4rpx 4rpx 4rpx 4rpx;
				}

				.tps1 {
					background: #C4FFC2;
					color: #467C00;
				}
			}

			.tietle {
				color: #333333;
				font-size: 28rpx;
				margin: 10upx 0;
				font-weight: 800;
			}

			.gundon {
				overflow-x: auto;
				white-space: nowrap;

				.vid {
					width: 128rpx;
					height: 128rpx;
					// background-color: red;
					border-radius: 8rpx;
				}

				.g-img {
					display: inline-block;
					width: 128rpx;
					height: 128rpx;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
					overflow: hidden;
					margin-left: 24rpx;

					img {
						width: 128rpx;
						height: 128rpx;
					}
				}
			}

			width: 702rpx;
			// height: 356rpx;
			background: #FFFFFF;
			border-radius: 8rpx;
			margin: 24upx auto;
			padding: 24upx;
		}
	}
</style>