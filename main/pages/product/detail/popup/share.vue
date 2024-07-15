<template>
	<view class="bottom-panel" :class="Visible ? 'bottom-panel open' : 'bottom-panel close'" @click="closePopup">
		<view class="popup-bg">
			<view class="wechat-box" v-if="wechat_share">
				<image src="http://imgh5.y01.cn/20210606225153c21e74943.png" mode="widthFix"></image>
			</view>
		</view>

		<view class="content" v-on:click.stop>

			<view class="module-box module-share">
				<!-- <view class="hd d-c-c" style="font-weight: 500;">
					{{$nw("分享")}}
				</view> -->

				<view v-if="show_commission && direct_commission > 0" class="share-tips-card flex-c">
					<view class="card-icon">
						<image class="common-img"
							src="https://shanghui.client.xcx008.com/file/uploads/20240612/4be02a6fd91f52144107c9c24552cc1f.png"
							mode="aspectFill"></image>
					</view>
					<view class="card-content">
						<view class="title flex">
							<view class="label">
								{{$nw("分享赚钱")}}
							</view>
							<view class="more-btn flex-c" @click="toAgent('/main/pages/agent/index/index')">
								{{$nw("查看详细规则")}}
								<i class="iconfont icon-jiantou"></i>
							</view>
						</view>
						<view class="tips">
							{{$nw("推荐商品给好友 好友购买成功 即得佣金")}}￥{{toFixed(direct_commission)}}
						</view>
					</view>

				</view>
				<view class="box-s-b">
					<view class="d-c-c">
						<!-- #ifndef APP -->
						<view class="item d-c-c d-c">
							<button class="item-btn" open-type="share" @tap="shareHandle">
								<view class="icon-box d-c-c share-friend">
									<i class="iconfont icon-fenxiang"></i>
								</view>
								<text class="share-label">{{$nw("分享好友")}}</text>
							</button>
						</view>
						<!-- #endif -->

						<view class="item d-c-c d-c">
							<button class="item-btn" @click="genePoster">
								<view class="icon-box d-c-c">
									<i class="iconfont icon-share"></i>
								</view>
								<text class="share-label">{{$nw("生成海报")}}</text>
							</button>
						</view>
					</view>
				</view>
				<view class="btns flex-c" @click="closePopup(1)">
					{{$nw("取消")}}
				</view>
			</view>

		</view>
	</view>

</template>

<script>
	import {
		setTimeout
	} from 'timers';
	export default {
		data() {
			return {
				/*是否可见*/
				Visible: false,
				poster_img: '',
				/*公众号分享是否显示*/
				wechat_share: false,
			}
		},
		props: ['isbottmpanel', 'product_id', 'show_commission', 'direct_commission'],
		watch: {
			'isbottmpanel': function(n, o) {
				if (n != o) {
					this.wechat_share = false;
					this.Visible = n;
				}
			}
		},
		methods: {
			// 分享邀请次数
			getShareUser() {
				this._get('user.user/getShareUser', {});
			},
			toAgent(url) {
				uni.setStorageSync('is_agent_play', 1)
				setTimeout(() => {
					uni.navigateTo({
						url
					})
				}, 16)
			},
			/*关闭弹窗*/
			closePopup(type) {
				this.$emit('close', {
					type: type,
					poster_img: this.poster_img
				})
			},
			//发送给朋友
			shareHandle() {
				console.log('发送给朋友');
				//#ifdef H5
				this.wechat_share = true;
				this.getShareUser()
				//#endif
			},
			//生成海报
			genePoster() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中"),
				});
				let source = 'wx';
				//#ifdef H5
				source = 'mp';
				//#endif
				self._get('product.product/poster', {
					product_id: self.product_id,
					source: source
				}, (result) => {
					self.poster_img = result.data.qrcode;
					self.closePopup(2);
					self.getShareUser()
				}, null, () => {
					uni.hideLoading();
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.bottom-panel .popup-bg {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.6);
		z-index: 98;
	}

	.bottom-panel .popup-bg .wechat-box {
		padding-top: var(--window-top);
	}

	.bottom-panel .popup-bg .wechat-box image {
		width: 100%;
	}

	.bottom-panel .content {
		position: fixed;
		width: 100%;
		bottom: 0;
		min-height: 200rpx;
		max-height: 900rpx;
		background-color: #fff;
		transform: translate3d(0, 980rpx, 0);
		transition: transform .2s cubic-bezier(0, 0, .25, 1);
		z-index: 99;
		border-radius: 16rpx 16rpx 0rpx 0rpx;
	}

	.bottom-panel.open .content {
		transform: translate3d(0, 0, 0);
	}

	.bottom-panel.close .popup-bg {
		display: none;
	}

	.module-share .hd {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 36rpx;
	}

	.module-share .item button,
	.module-share .item button::after {
		background: none;
		border: none;
	}

	.module-share {
		padding-top: 24rpx;

		.share-tips-card {
			height: 120rpx;
			background: linear-gradient(90deg, #FF5653 0%, #FF406E 100%);
			border-radius: 12rpx;
			margin: 0 24rpx;
			padding: 16rpx;

			.card-icon {
				width: 88rpx;
				height: 88rpx;
			}

			.card-content {
				flex: 1;
				margin-left: 8rpx;

				.title {
					align-items: flex-start;

					.label {
						font-size: 32rpx;
						font-weight: 500;
						color: #fff;
						line-height: 1;
					}

					.more-btn {
						margin-left: auto;
						font-size: 20rpx;
						color: #fff;
						line-height: 1;

						.iconfont {
							font-size: 20rpx;
							color: #fff;
							margin-left: 4rpx;
							line-height: 1;
						}
					}
				}

				.tips {
					font-size: 24rpx;
					color: #fff;
					line-height: 1;
					margin-top: 16rpx;
				}
			}
		}

		.box-s-b {
			padding: 32rpx 0rpx 28rpx;
		}

		.item {
			margin: 0 100rpx;

			.item-btn {
				width: 100rpx;
				padding: 0;
				display: flex;
				flex-direction: column;
				align-items: center;
				justify-content: center;

				.icon-box {
					width: 88rpx;
					height: 88rpx;
					border-radius: 50%;
					background: #1B94E0;

					.iconfont {
						font-size: 44rpx;
						color: #FFFFFF;
					}

					&.share-friend {
						background: #00B83F;

						.iconfont {
							font-size: 48rpx;
							color: #FFFFFF;
						}
					}
				}

				.share-label {
					font-size: 24rpx;
					line-height: 1;
					margin-top: 20rpx;
				}

			}
		}
	}


	.module-share .btns {
		background: #fff;
		padding: 30rpx 0;
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom) / 2);
		justify-content: center;
		color: #333;
		border-top: 8rpx solid #F5F7FA;
		line-height: 1;
		margin-top: 0;
	}

	.module-share .btns button {
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 0;
		border-top: 1px solid #EEEEEE;
	}

	.module-share .btns button::after {
		border-radius: 0;
	}
</style>