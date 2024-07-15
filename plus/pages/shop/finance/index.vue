<template>
	<scroll-view scroll-y="true" class="finance-index-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50">
		<view class="finance-index-content">
			<view class="finance-card">
				<view class="label">
					可提现(元)
				</view>
				<view class="money">
					200.00
				</view>
				<view class="btn">
					提现
				</view>
			</view>
			<view class="withdrawal-records">
				<view class="records-bar flex-c">
					<view class="label">
						本月共提现6笔
					</view>
					<view class="screen-btn flex-c">
						<picker mode="date" :value="screen_date" :end="endDate()" @change="bindDateChange">
							<view class="date-text">{{screen_date || '筛选'}}</view>
						</picker>
						<i class="iconfont shaixuan"></i>
					</view>
					<view v-if="screen_date" class="reset-btn" @click="bindDateChange(0)">
						重置
					</view>
				</view>
				<view class="records-list">
					<view class="records-item" v-for="index in 10" :key="index">
						<view class="records-date">
							06-25
						</view>
						<view class="records-group" v-for="i in 2" :key="i" @click="toDetails">
							<view class="content flex-c">
								提现单据号:2024062584987
								<view class="money">
									-100
								</view>
							</view>
							<view class="status flex-c">
								<view class="label">
									处理进度
								</view>
								<view class="value">
									处理中
								</view>
							</view>
						</view>
					</view>
				</view>

				<view v-show="loading && record_list && record_list.length" class="load-box flex-c has-padding">
					<i class="iconfont jiazaizhong"></i>
					{{$nw('加载中')}}
				</view>

				<view v-if="no_more && !loading && record_list && record_list.length" class="nomore-box has-padding">
					<text class="nomore-content">
						{{$nw("到底了")}}
					</text>
				</view>
				<view v-if="(!record_list || !record_list.length) && !loading" class="empty-box">
					<view class="empty-icon">
						<image class="common-img"
							src="https://shanghuitest.client.xcx008.com/file/uploads/20240605/b798199e3c83e9b818f20576e825a1b9.png">
						</image>

					</view>
					<view class="empty-text">
						{{$nw("暂无数据")}}
					</view>
				</view>
			</view>


		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				loadding: false,
				no_more: false,
				scrollviewHigh: 0, //滚动区域高度
				params: {},
				screen_date: '',
				record_list: []
			}
		},
		onLoad() {
			let _this = this
			// 设置全局颜色
			_this.setGlobalColor({
				bgc: '#1B94E0',
				textc: '#ffffff'
			})
			uni.setNavigationBarTitle({
				title: _this.$nw('货款管理'),
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
		},

		onShow() {},

		methods: {
			bindDateChange(e) {
				console.log('bindDateChange-->', e);
				if (!e) {
					this.screen_date = ''
					return
				}
				this.screen_date = e.detail.value
			},
			endDate() {
				let today = new Date();
				let year = today.getFullYear();
				let month = today.getMonth() + 1;
				let day = today.getDate();
				month = month < 10 ? '0' + month : month
				day = day < 10 ? '0' + day : day
				let todayDate = year + "-" + month + "-" + day;
				console.log('todayDate--->', todayDate);
				return todayDate
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
			},
			toDetails() {
				uni.navigateTo({
					url: '/plus/pages/shop/finance/details'
				})
			},
		},
	}
</script>

<style lang="scss" scoped>
	.finance-index-wrap {
		background: #F4F7FB;
		position: relative;

		&::before {
			content: '';
			width: 100vw;
			height: 280rpx;
			background: linear-gradient(180deg, #1B94E0 0%, #40B4FD 100%);
			position: fixed;
			z-index: 0;
		}

		.finance-index-content {
			min-height: 100%;
			position: relative;
			position: relative;
			z-index: 1;

			.finance-card {
				height: 280rpx;
				background: linear-gradient(180deg, #1B94E0 0%, #40B4FD 100%);
				display: flex;
				flex-direction: column;
				align-items: center;
				padding-top: 16rpx;

				.label,
				.money {
					color: #fff;
				}

				.money {
					font-size: 48rpx;
					font-weight: 500;
					line-height: 68rpx;
					margin-top: 16rpx;
				}

				.btn {
					width: 112rpx;
					height: 52rpx;
					background: #fff;
					border-radius: 999px;
					margin-top: 28rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					color: #1B94E0;
					font-weight: 24rpx;
				}
			}

			.withdrawal-records {
				background: #F4F7FB;
				border-radius: 16rpx 16rpx 0rpx 0rpx;
				margin-top: -16rpx;
				padding: 24rpx;

				.records-bar {
					.label {
						line-height: 40rpx;
					}

					.screen-btn {
						margin-left: auto;

						.date-text {
							font-size: 20rpx;
							color: #999;
							line-height: 1;
						}

						.iconfont {
							font-size: 24rpx;
							color: #999;
							margin-left: 8rpx;
							line-height: 1;
						}
					}

					.reset-btn {
						margin-left: 16rpx;
						font-size: 20rpx;
						color: #1B94E0;
						line-height: 1;
					}
				}

				.records-list {
					margin-top: 24rpx;

					.records-item {
						background: #fff;
						padding: 16rpx 24rpx;
						border-radius: 8rpx;
						margin-bottom: 16rpx;

						.records-date {
							font-weight: 500;
							line-height: 40rpx;
						}

						.records-group {
							padding: 16rpx 0;
							border-bottom: 2rpx solid #F5F7FA;

							&:last-of-type {
								border: none;
							}

							.content {
								line-height: 40rpx;

								.money {
									line-height: 40rpx;
									font-weight: 500;
									margin-left: auto;
								}
							}

							.status {
								margin-top: 8rpx;

								.label,
								.value {
									line-height: 40rpx;
								}

								.label {
									color: #999;
								}

								.value {
									margin-left: auto;
									color: #1B94E0;

									&.success {
										color: #2CC313;
									}

									&.error {
										color: #F43434;
									}
								}
							}
						}

						&:last-of-type {
							margin-bottom: 0;
						}
					}
				}
			}
		}
	}
</style>