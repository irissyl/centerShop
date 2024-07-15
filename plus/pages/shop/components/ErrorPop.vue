<template>
	<u-popup class="promotion-popup" :zoom="true" mode="center" :popup="false" v-model="show" :mask-close-able="true"
		:negative-top="480" @close="popupClose">
		<view class="bank-err-wrap">
			<view class="promotion-content">
				<view class="card">
					<view class="icon">
						<i class="iconfont tanhao"></i>
					</view>
					<view class="title">
						绑定失败
					</view>
					<view class="tips">
						失败原因：{{bank_data.error_msg || '未知原因'}}
					</view>
				</view>
				<view class="btn" @click="toEdit()">
					{{$nw('重新绑定')}}
				</view>
				<view class="plain-btn" @click="popupClose">
					我知道了
				</view>
			</view>
			<view class="close-btn" @click="popupClose">
				<i class="iconfont icon-guanbi"></i>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name: 'PromotionPop',
		data() {
			return {
				show: false,
				bank_data: ''
			}
		},
		mounted() {},
		methods: {
			popupClose() {
				this.show = false
			},
			// 是否显示分销提醒弹窗
			popupShow(item) {
				this.bank_data = item
				this.show = true
			},
			toEdit() {
				this.$emit('toEdit', this.bank_data.id)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.bank-err-wrap {
		position: relative;
		overflow: hidden;

		.promotion-bg {
			width: 416rpx;
			height: 312rpx;
			position: relative;
			z-index: 1;
			margin: 0 auto;
		}

		.promotion-content {
			width: 520rpx;
			background: #fff;
			border-radius: 24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
			z-index: 2;
			overflow: hidden;

			.card {
				width: 468rpx;
				position: relative;
				overflow: hidden;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;
				padding: 28rpx 0;

				.icon {
					width: 106rpx;
					height: 106rpx;
					display: flex;
					align-items: center;
					justify-content: center;

					.iconfont {
						font-size: 106rpx;
						color: #FF7575;
					}
				}

				.title {
					font-size: 32rpx;
					font-weight: 500;
					line-height: 44rpx;
					padding: 16rpx 0;
				}

				.tips {
					font-size: 24rpx;
					color: #666666;
					line-height: 32rpx;
				}
			}

			.btn {
				width: 468rpx;
				height: 80rpx;
				background: #1B94E0;
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-weight: 500;
				position: relative;
			}

			.plain-btn {
				line-height: 1;
				padding: 32rpx 0;
				color: #1B94E0;
			}
		}

		.close-btn {
			width: 54rpx;
			height: 54rpx;
			background: rgba(51, 51, 51, 0.5);
			border-radius: 50%;
			position: relative;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 auto;
			margin-top: 30rpx;

			.iconfont {
				color: #fff;
				font-size: 16rpx;
			}
		}
	}
</style>