<template>
	<scroll-view scroll-y="true" class="commission-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="200" @scrolltolower="scrolltolowerFunc">
		<view class="commission-content">
			<view class="commission-tips flex-c">
				<view class="tips-content">
					{{$nw("当前待结算佣金")}}：<text class="money">{{moneyData.total_money || '0.00'}}元</text>
				</view>
			</view>

			<view v-if="cashList.length" class="records-list">
				<view class="records-item" v-for="(item,index) in cashList" :key="index">
					<view class="top flex-c">
						<view class="label">
							{{item.status && item.status.text || '--'}}
						</view>
						<view class="money">
							-{{item.money || '0.00'}}{{$nw("元")}}
						</view>
					</view>
					<view class="bot flex-c">
						<view class="date">
							{{item.dateline || '--'}}
						</view>
						<view class="surplus">
							{{$nw("剩余")}}{{item.surplus_cash_num || '0.00'}}{{$nw("元")}}
						</view>
					</view>
				</view>
			</view>

			<view v-if="!loading && !cashList.length" class="empty-box">
				<view class="empty-icon">
					<image class="common-img"
						src="https://shanghuitest.client.xcx008.com/file/uploads/20240605/b798199e3c83e9b818f20576e825a1b9.png">
					</image>
				</view>
				<view class="empty-text">
					{{$nw("暂无数据")}}
				</view>
			</view>

			<view v-show="loading && cashList.length" class="load-box flex-c has-padding">
				<i class="iconfont jiazaizhong"></i>
				{{$nw("加载中")}}
			</view>

			<view v-if="no_more && !loading && cashList.length" class="nomore-box has-padding">
				<text class="nomore-content">
					{{$nw("到底了")}}
				</text>
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {

		data() {
			return {
				loading: true,
				scrollviewHigh: 0,
				moneyData: {},
				cashList: [],
				page: 1,
				no_more: false
			}
		},
		onShow() {

		},
		onLoad() {
			let _this = this
			_this.setGlobalColor({
				bgc: '#FFEAED'
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			uni.setNavigationBarTitle({
				title: _this.$nw('提现记录'),
			})
			this.getMoney()
			this.getCashList(1)
		},
		methods: {
			// 提现金额数据
			getMoney() {
				this._get('plus.sharebind.Bind/Index', {}, (res) => {
					if (res.code == 1) {
						this.moneyData = res.data || {}
					}
				}, (err) => {
					console.log('请求结束-->')
				})
			},
			// 提现记录列表
			getCashList(loading) {
				this.loading = true;
				if (loading) {
					uni.showLoading({
						title: this.$nw('加载中')
					});
				}
				let params = {
					page: this.page,
					limit: 20
				}
				this._get('plus.sharebind.Bind/getCashList', params, (res) => {
					if (res.code == 1) {
						if (this.page <= 1) {
							this.cashList = []
						}
						this.cashList = this.cashList.concat(res.data.data.data);
						console.log('cashList>', this.cashList);
						if (res.data.data.last_page <= this.page) {
							this.no_more = true;
						}
					}
					uni.hideLoading();
					setTimeout(() => {
						this.loading = false
					}, loading ? 0 : 500)
				}, (err) => {
					console.log('请求结束-->')
					uni.hideLoading();
					this.loading = false
				})
			},


			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
				if (this.no_more) return
				this.page++
				this.getCashList()
			},
		},
	}
</script>

<style lang="scss" scoped>
	.commission-wrap {
		background: #F4F7FB;
		position: relative;

		&::before {
			content: '';
			width: 100%;
			height: 460rpx;
			background: linear-gradient(180deg, #FFEAED 0%, rgba(255, 234, 237, 0) 100%);
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}



		.commission-content {
			padding: 12rpx 24rpx 0;
			box-sizing: border-box;
			position: relative;
			padding-bottom: calc(40rpx + env(safe-area-inset-bottom) / 2);

			.commission-tips {
				height: 60rpx;
				padding: 0 24rpx;
				background: #fff;
				border-radius: 16rpx;

				.tips-content {
					font-size: 24rpx;

					.money {
						color: #F43434;
					}
				}

				.tips {
					font-size: 20rpx;
					color: #999;
					margin-left: auto;
				}
			}

			.records-list {
				background: #fff;
				border-radius: 16rpx;
				margin-top: 16rpx;
				padding: 16rpx 24rpx;

				.records-item {
					margin-bottom: 24rpx;

					.top {
						.money {
							margin-left: auto;
							color: #F43434;
						}
					}

					.bot {
						margin-top: 6rpx;

						.date,
						.surplus {
							font-size: 20rpx;
						}

						.date {
							margin-right: auto;
							color: #999;
						}
					}

					&:last-of-type {
						margin-bottom: 0;
					}
				}
			}
		}
	}
</style>