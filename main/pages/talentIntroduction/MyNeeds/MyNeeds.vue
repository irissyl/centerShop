<template>
	<view style="padding:  24rpx;">
		
		<view class="content" >
			<view class="content-box" v-for="(item,index) in gsList" @click="qiehuan(4,item)">
				<view class="box-top">
					<img :src="item.corp_image_url" alt="" />
					<view class="">
						<view class="box-top-t">
							{{item.corp_name}}
						</view>
						<view class="box-top-b">
							<view class="t active">
								{{item.to_coc_org_name}}
							</view>
							<view class="t">
								{{item.work_type}}
							</view>
							<view class="t">
								广东东莞
							</view>
						</view>
					</view>
					<u-icon class="right" name="arrow-right" color="#999999" size="28"></u-icon>
				</view>
				<view class="title">
					<view class="" style="font-size: 24rpx;">
						{{item.corp_note}}
					</view>
					<view class="" style="display: flex;">
						<view class="" style="margin-right: 80rpx;">
							<text class="title-1">人才需求</text>
							<text class="title-2">{{item.work_name}}</text>
						</view>
						<view class="">
							<text class="title-1">行业要求</text>
							<text class="title-2">{{item.work_type_request}}</text>
						</view>
					</view>
				</view>
				<view class="title1">
					<text class="title-t">联系人员</text>
					<text class="title-b">{{item.link_name}}</text>
				</view>
				<view class="title1">
					<text class="title-t">联系电话</text>
					<text class="title-b">{{item.link_phone}}</text>
				</view>
				
			</view>
		</view>
		
		<view class="signUp" @click="qiehuan(5)">
			<img src="../../../../static/img/r4.png" alt="" />
			<text>提交需求</text>
		</view>
		<u-select v-model="show" :list="list1" @confirm="confirm"></u-select>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				name: '人才展示',
				list1: [{
						value: '1',
						label: '人才展示'
					},
					{
						value: '2',
						label: '人才需求'
					}
				],
				list: [{
					name: '全部'
				}, {
					name: '申请中'
				}, {
					name: '已通过'
				}],
				gsList:[],
				current: 0
			};
		},
		methods: {
			change(e) {
				this.current = e
			},
			confirm(e){
				this.name = e[0].label
			},
			qiehuan(e,j) {
				console.log(e,123333);
				if (e === 1) {
					this.show = true
				} else if (e === 2) {
					uni.navigateTo({
						url: '/main/pages/RegisteredTalents/RegisteredTalents'
					});
					
				} else if (e === 3) {
					uni.navigateTo({
						url: '/main/pages/RegisteredTalents/RegisteredTalents'
					});
				} else if (e === 4) {
					uni.navigateTo({
						url: '/main/pages/talentIntroduction/TalentDemand/TalentDemand?coc_need_id='+j.coc_need_id
					});
				} else if (e === 5) {
					uni.navigateTo({
						url: '/main/pages/talentIntroduction/TalentDemand/TalentDemand'
					});
				}


			}
		},
		onShow() {
			this.setGlobalColor()
			this._get('plus.coc.Coc/getCocNeedByUserId', {user_id:uni.getStorageSync("user_id")}, (res) => {
				this.gsList = res.data.list
				console.log(res, 1122,this.gsList);
			})
		},
	}
</script>

<style lang="scss">
	.signUp {
		position: fixed;
		right: 24rpx;
		bottom: 128rpx;
		width: 96rpx;
		height: 104rpx;
		background: #1B94E0;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		text-align: center;

		img {
			width: 64rpx;
			height: 64rpx;
			margin-top: 6rpx;
		}

		text {
			font-size: 20rpx;
			color: #FFFFFF;
			display: block;
			margin-top: -16rpx;
			line-height: 1;
		}
	}

	.content {
		.content-box {
			position: relative;
			width: 702rpx;
			// height: 308rpx;
			background: #FFFFFF;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			margin-top: 16rpx;

			.lianxi {
				width: 144rpx;
				height: 56rpx;
				background: linear-gradient(270deg, #1B94E0 0%, #40B4FD 100%);
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				text-align: center;
				line-height: 54rpx;
				color: #FFFFFF;
				position: absolute;
				bottom: 24rpx;
				right: 24rpx;
			}

			.title-t {
				font-size: 28rpx;
				color: #666;
				margin-right: 16rpx;
			}

			.title {
				.title-1 {
					color: #666666;
					font-size: 28rpx;
					margin-right: 16rpx;
				}

				.title-2 {
					font-size: 28rpx;
				}

				font-size: 24rpx;
				margin: 10rpx 0 14rpx;
				border-bottom: 2rpx solid #F5F7FA;
			}

			.box-top {

				position: relative;

				.right {
					position: absolute;
					top: 40rpx;
					right: 10rpx;
				}

				.box-top-t {
					font-size: 32rpx;
				}

				.box-top-b {
					display: flex;

					.t {
						font-size: 20rpx;
						padding: 4rpx 10rpx;
						margin-right: 16rpx;
						background: #F5F7FA;
					}

					.active {
						background: #E0FFE9;
						border-radius: 4rpx;
						color: #068129;
					}
				}

				display: flex;

				img {
					margin-right: 16rpx;
					width: 96rpx;
					height: 96rpx;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
				}
			}

			padding: 24rpx;
		}


	}

	/deep/ .u-tabs {
		// flex: 1;
		width: auto;
	}

	.top {
		position: fixed;
		z-index: 1000;
		top: 0;
		display: flex;
		background-color: #F4F7FB;

		.top-r {
			width: 550rpx;

		}

		.top-l {
			padding: 0 20rpx;
			height: 52rpx;
			line-height: 50rpx;
			text-align: center;
			background: #FFFFFF;
			border-radius: 84rpx 84rpx 84rpx 84rpx;
			position: relative;

			.text {
				font-size: 24rpx;
				margin-right: 6rpx;
				color: #1B94E0;
				width: 140rpx;
				line-height: 50rpx;
			}

			.icon {
				position: absolute;
				right: 10rpx;
				top: 16rpx;
			}
		}
	}
</style>