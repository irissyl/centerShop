<template>
	<scroll-view scroll-y="true" class="bankcard-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50">
		<view class="bankcard-content">
			<view class="card-list">
				<view class="card-item" v-for="(item,index) in card_list" :key="index"
					:class="{'alone':card_list.length == 1}" @click="toEdit(item.id)">
					<view class="item-content" :style="'background: '+(item.bank.icolor || '#1B94E0')+';'">
						<view class="card-info flex-c">
							<view class="bank-logo">
								<image class="common-img" :src="item.bank.logo" mode="aspectFill"></image>
							</view>
							<view class="card-text">
								<view class="name">
									<view class="name-caontent flex-c">
										{{item.bank.name}}
										<view v-if="item.is_default == 1" class="item-def">
											(默认卡)
										</view>
									</view>

									<view v-if="index < card_list.length-1" class="num flex-c">
										<view class="symbol" v-for="i in 3" :key="i">
											....
										</view>
										{{item.card_number.slice(-4)}}
									</view>
								</view>
							</view>
							<view class="card-status flex-c" :class="{'err':item.status != 1}"
								@click.stop="errtips(item)">
								{{item.status == 1 ? '已绑定' : '绑定失败'}}
								<i v-if="item.status != 1" class="iconfont wenhaoxiao"></i>
							</view>
						</view>
						<view v-if="index == card_list.length-1" class="card-num flex-c">
							<view class="symbol" v-for="i in 3" :key="i">
								....
							</view>
							{{item.card_number.slice(-4)}}
						</view>
					</view>
				</view>
			</view>

			<view v-if="!card_list.length" class="empty-card flex-c">
				<i class="iconfont yinhangqia"></i>
			</view>

			<view v-if="card_list.length < 5" class="add-btn flex-c" @click="toEdit()">
				<i class="iconfont jia"></i>
				添加银行卡
			</view>
		</view>
		<ErrorPop ref="ErrorPopRef" @toEdit="toEdit" />
	</scroll-view>
</template>

<script>
	import ErrorPop from '../components/ErrorPop.vue'
	export default {
		components: {
			ErrorPop
		},
		data() {
			return {
				loading: false,
				scrollviewHigh: 0, //滚动区域高度
				card_list: [],
				ErrorPopRef: null
			}
		},
		onLoad() {
			let _this = this
			// 设置全局颜色
			_this.setGlobalColor({
				bgc: '#fff'
			})
			uni.setNavigationBarTitle({
				title: _this.$nw('银行卡'),
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
		},

		onShow() {
			this.getUserBankList()
		},

		methods: {
			toEdit(id) {
				let url = '/plus/pages/shop/authentication/edit_bankcard'
				if (id) {
					url = '/plus/pages/shop/authentication/edit_bankcard?is_edit=1&id=' + id
				}
				uni.navigateTo({
					url
				})
				this.$refs.ErrorPopRef.popupClose()
			},
			// 获取用户绑定银行卡列表
			getUserBankList() {
				this.loading = true
				uni.showLoading({
					title: this.$nw("加载中"),
					mask: true
				});
				this._get('user.userBankCard/getList', {}, (res) => {
					this.card_list = res.data || []
					this.loading = false;
					uni.hideLoading()
				}, (err) => {
					this.loading = false;
					uni.hideLoading()
				})
			},
			errtips(item) {
				if (item.status == 1) return
				this.$refs.ErrorPopRef.popupShow(item)
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
			},
		},
	}
</script>

<style lang="scss" scoped>
	.bankcard-wrap {
		background: #fff;
		position: relative;

		.bankcard-content {
			min-height: 100%;
			position: relative;
			padding: 32rpx 0;
			position: relative;

			.card-list {
				.card-item {
					padding: 24rpx 24rpx;
					box-shadow: 0rpx -8rpx 8rpx 0rpx rgba(0, 0, 0, 0.1);
					background: #fff;
					margin-top: -176rpx;
					position: relative;

					.item-content {
						height: 296rpx;
						border-radius: 16rpx;
						padding: 32rpx;
						position: relative;
						overflow: hidden;

						.card-info {

							.bank-logo {
								width: 80rpx;
								height: 80rpx;
								background: #fff;
								border-radius: 50%;
								display: flex;
								align-items: center;
								justify-content: center;
							}

							.card-text {
								margin-left: 16rpx;
								flex: 1;

								.name,
								.type,
								.num {
									color: #fff;
								}

								.name {

									.name-caontent {
										font-size: 32rpx;
										font-weight: 500;
										line-height: 1;
										color: #fff;

										.item-def {
											color: #fff;
											font-size: 20rpx;
											// line-height: 1;
											margin-left: 12rpx;
										}

									}

									.num {
										color: #fff;
										line-height: 1;
										font-size: 32rpx;
										font-weight: 500;
										// margin-left: auto;
										margin-top: 12rpx;

										.symbol {
											color: #fff;
											line-height: 1;
											font-size: 32rpx;
											font-weight: 500;
											margin-right: 16rpx;
											position: relative;
											top: -10rpx;
										}
									}
								}
							}

							.card-status {
								margin-left: auto;
								height: 36rpx;
								padding: 0 12rpx;
								border-radius: 999px;
								background: #fff;
								font-size: 20rpx;
								color: #008566;

								&.err {
									color: #B81C22;
								}

								.iconfont {
									font-size: 22rpx;
									line-height: 1;
									color: #B81C22;
									margin-left: 6rpx;
								}
							}
						}

						.card-num {
							// text-align: center;
							margin-top: 42rpx;
							font-size: 64rpx;
							font-weight: 500;
							color: #fff;
							line-height: 92rpx;
							padding-left: 96rpx;

							.symbol {
								font-size: 64rpx;
								color: #fff;
								margin-right: 32rpx;
								line-height: 1;
								position: relative;
								top: -20rpx;
							}
						}

					}

					&:first-of-type {
						margin-top: 0;
						box-shadow: none;
						padding-top: 0;
					}

					&:last-of-type {
						padding-top: 64rpx;
					}

					&.alone {
						padding-top: 0 !important;
					}
				}
			}

			.empty-card {
				justify-content: center;
				height: 300rpx;
				margin: 100rpx 0;

				.iconfont {
					font-size: 300rpx;
					color: #dad9dc;
					line-height: 1;
				}
			}

			.add-btn {
				width: 216rpx;
				margin: 0 auto;
				margin-top: 52rpx;
				padding-bottom: 18rpx;
				justify-content: center;
				border-bottom: 2rpx solid #1B94E0;
				line-height: 1;
				color: #1B94E0;

				.iconfont {
					font-size: 28rpx;
					line-height: 1;
					margin-right: 14rpx;
					color: #1B94E0;
					font-weight: 600;
				}
			}
		}
	}
</style>