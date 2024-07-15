<template>
	<scroll-view scroll-y="true" class="withdrawal-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50">
		<view v-if="!status" class="withdrawal-content">
			<view class="edit-form">
				<view class="form-item flex-c">
					<view class="label">
						提现银行
					</view>
					<picker class="bank-picker" @change="bankChange" :value="bank_index" :range="bank_list"
						range-key="label">
						<view class="picker-value text-ellipsis"
							:class="{'active' : bank_list[bank_index] && bank_list[bank_index].label}">
							{{bank_list[bank_index] && bank_list[bank_index].label || '请选择'}}
						</view>
					</picker>
					<i class="iconfont icon-jiantou"></i>
				</view>
				<view class="form-item flex-c">
					<view class="label">
						提现金额
					</view>
				</view>
				<view class="form-item flex-c money">
					<view class="form-value flex-c">
						￥
						<input class="form-inp" type="text" :value="params.money" placeholder="请输入提现金额"
							placeholder-style="font-size:28rpx;color:#999;font-weight:400;" />
					</view>
				</view>
				<view class="form-item form-tips flex-c">
					可提现金额：￥1000
					<view class="all-btn">
						全部提现
					</view>
				</view>
			</view>

			<view class="withdrawal-btn flex-c">
				次日到账 确定提现
			</view>
		</view>

		<view v-else class="withdrawal-content">
			<view class="success-box">
				<view class="icon">
					<i class="iconfont wancheng-copy"></i>
				</view>
				<view class="title">
					提现申请成功，等待银行处理
				</view>
				<view class="tips">
					预计次日内到达
				</view>
				<view class="info-group">
					<view class="item flex-c">
						<view class="label">
							提现银行
						</view>
						<view class="value">
							农业银行(9965)
						</view>
					</view>
					<view class="item flex-c">
						<view class="label">
							提现金额
						</view>
						<view class="value">
							￥1000
						</view>
					</view>
				</view>
			</view>

			<view class="authentication-btn flex-c">
				完成
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				loadding: true,
				scrollviewHigh: 0, //滚动区域高度
				bank_index: null,
				bank_list: [{
					label: '中国农业银行',
					id: 1
				}, {
					label: '中国工商银行',
					id: 2
				}, {
					label: '中国建设银行',
					id: 3
				}, {
					label: '中国交通银行',
					id: 4
				}, ],
				params: {
					money: ''
				},
				status: 1
			}
		},
		onLoad() {
			let _this = this
			// 设置全局颜色
			_this.setGlobalColor({
				bgc: '#fff'
			})
			uni.setNavigationBarTitle({
				title: _this.$nw('货款提现'),
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
		},

		methods: {
			bankChange(e) {
				this.bank_index = e.detail.value
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
			},
		},
	}
</script>

<style lang="scss" scoped>
	.withdrawal-wrap {
		background: #F4F7FB;
		position: relative;

		.withdrawal-content {
			min-height: 100%;
			position: relative;

			.edit-form {
				background: #fff;

				.form-item {
					padding: 24rpx;

					.label {
						width: 152rpx;
					}

					.bank-picker {
						flex: 1;

						.picker-value {
							max-width: 500rpx;
							color: #999;
							text-align: right;
							margin-left: auto;

							&.active {
								color: #333;
								font-weight: 500;
							}

						}
					}

					.iconfont {
						margin-left: 12rpx;
						font-size: 28rpx;
						color: #999;
					}

					.form-value {
						font-size: 40rpx;
						font-weight: 400;

						.form-inp {
							margin-left: 16rpx;
							font-size: 40rpx;
							font-weight: 500;
						}
					}

					&.money,
					&.form-tips {
						padding-top: 0;
					}

					&.form-tips {
						justify-content: space-between;
						font-size: 20rpx;
						color: #999;
						line-height: 28rpx;

						.all-btn {
							font-size: 20rpx;
							color: #1B94E0;
							line-height: 28rpx;
						}
					}
				}
			}

			.withdrawal-btn {
				width: 702rpx;
				height: 80rpx;
				margin: 0 auto;
				margin-top: 24rpx;
				justify-content: center;
				background-color: #1B94E0;
				color: #fff;
				border-radius: 8rpx;
			}


			.success-box {
				padding: 48rpx 24rpx 24rpx;
				background: #fff;

				.icon {
					width: 80rpx;
					height: 80rpx;
					margin: 0 auto;

					.iconfont {
						font-size: 80rpx;
						color: #1B94E0;
						line-height: 1;
					}
				}

				.title {
					margin-top: 28rpx;
					text-align: center;
					line-height: 40rpx;
				}

				.tips {
					color: rgba(0, 0, 0, 0.6);
					font-size: 24rpx;
					line-height: 34rpx;
					margin-top: 8rpx;
					text-align: center;
				}

				.info-group {
					margin-top: 64rpx;

					.item {
						margin-bottom: 32rpx;

						&:last-of-type {
							margin-bottom: 0;
						}

						.label {
							color: #666;
							line-height: 40rpx;
						}

						.value {
							line-height: 40rpx;
							margin-left: auto;
						}
					}
				}
			}

			.authentication-btn {
				width: 702rpx;
				height: 80rpx;
				background: #1B94E0;
				justify-content: center;
				border-radius: 8rpx;
				font-weight: 500;
				color: #fff;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: calc(50rpx + env(safe-area-inset-bottom) / 2);
			}
		}
	}
</style>