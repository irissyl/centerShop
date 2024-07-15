<template>
	<u-popup class="promotion-popup" :zoom="true" mode="center" :popup="false" v-model="show" :mask-close-able="true"
		:negative-top="480" @close="popupClose">
		<view class="promotion-wrap">
			<view class="promotion-bg">
				<image class="common-img"
					src="https://shanghui.client.xcx008.com/file/uploads/20240607/ccb9b2ad03808b279b9fb1c9fde0868a.png"
					mode="aspectFill"></image>
			</view>
			<view class="promotion-content">
				<view class="card">
					<view class="card-content">
						<view class="title">
							<image class="common-img"
								src="https://shanghui.client.xcx008.com/file/uploads/20240607/7d382883a2cd866e234741186bac39ce.png"
								mode="aspectFill"></image>
						</view>
						<view class="text-list">
							<view class="item">
								{{$nw('现在您推广的用户购买任意一款产品 即')}}
							</view>
							<view class="item">
								{{$nw('可获取佣金奖励 永久绑定 多买多赚')}}
							</view>
							<view v-if="self_buy_commission_proportion > 0" class="item top">
								{{$nw('自己购买任意产品也会有')}}
							</view>
							<view v-if="self_buy_commission_proportion > 0" class="item">
								{{$nw('返佣奖励')}}
							</view>
							<view class="item top">
								{{$nw('我的')}}-{{$nw('推广中心查看')}}
							</view>
						</view>
					</view>

				</view>
				<view class="btn" @click="popupClose">
					{{$nw('知道了')}}
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
				num: 0,
				self_buy_commission_proportion: 0
			}
		},
		mounted() {
			if (uni.getStorageSync('is_displayed_promotion')) return
			this.getRetailRule()
		},
		methods: {
			popupClose() {
				this.show = false
				uni.setStorageSync('is_displayed_promotion', 1)
			},
			// 是否显示分销提醒弹窗
			getRetailRule() {
				this._get('plus.home.index/getRetailRule', {}, (res) => {
					if (res.code == 1 && res.data.is_open == 1 && res.data.first_money) {
						this.num = res.data.first_money || 0
						this.self_buy_commission_proportion = res.data.self_buy_commission_proportion || 0
						this.show = true
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.promotion-wrap {
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
			// height: 512rpx;
			padding: 24rpx 0;
			background: #fff;
			border-radius: 24rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			position: relative;
			z-index: 2;
			margin-top: -66rpx;
			overflow: hidden;

			.card {
				width: 468rpx;
				// height: 368rpx;
				background: linear-gradient(148deg, #FE413D 0%, #FF2E60 100%);
				border-radius: 20rpx;
				position: relative;
				overflow: hidden;
				padding: 24rpx 24rpx 30rpx;

				&::before {
					content: '';
					width: 100%;
					height: 100%;
					background: url('https://shanghui.client.xcx008.com/file/uploads/20240607/761f24d75e49482f5aba88e98e2a2224.png') no-repeat;
					background-size: contain;
					background-position: bottom right;
					position: absolute;
					top: 0;
					left: 0;
					z-index: 0;
				}

				.card-content {
					position: relative;

					.title {
						width: 288rpx;
						height: 96rpx;
					}

					.text-list {
						margin-top: 22rpx;

						.item {
							font-size: 24rpx;
							color: #fff;
							line-height: 1;
							margin-top: 14rpx;

							&.top {
								margin-top: 30rpx;
							}
						}
					}
				}
			}

			.btn {
				width: 468rpx;
				height: 80rpx;
				background: linear-gradient(148deg, #FE413D 0%, #FF2E79 100%);
				border-radius: 20rpx;
				margin-top: 20rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				color: #fff;
				font-weight: 500;
				position: relative;
			}
		}

		.close-btn {
			width: 54rpx;
			height: 54rpx;
			background: rgba(51, 51, 51, 0.2);
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