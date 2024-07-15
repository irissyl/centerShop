<template>
	<scroll-view scroll-y="true" class="commission-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="200" @scrolltolower="scrolltolowerFunc">
		<view class="commission-content">
			<view class="money-card flex-c">
				<view class="money-list flex-c">
					<view class="money-item">
						<view class="money">
							{{moneyData.total_money || '0.00'}}{{$nw("元")}}
						</view>
						<view class="label">
							{{$nw("累计提现金额")}}
						</view>
					</view>
					<view class="money-item">
						<view class="money">
							{{moneyData.money || '0.00'}}{{$nw("元")}}
						</view>
						<view class="label">
							{{$nw("可提现金额")}}
						</view>
					</view>
				</view>
				<view class="handle-box">
					<view class="record-btn flex-c" @click="toRecord">
						提现记录
						<i class="iconfont icon-jiantou"></i>
					</view>
					<view class="money-btn" @click="toTiXian">
						{{$nw("提现")}}
					</view>
				</view>
			</view>

			<view class="tab-bar flex-c">
				<view class="item" v-for="(item,index) in typeList" :key="index"
					:class="{'active' : type_index == index}" @click="typeChange(index)">
					{{item.label}}
				</view>
			</view>

			<view class="commission-tabbar flex-c">
				<view class="tabbar-item" v-for="(item,index) in tabList" :key="index"
					:class="{'active' : cur_tab == index}" @click="tabChange(index)">
					{{item.label}}
				</view>
			</view>
			<view v-if="cur_tab == 0" class="commission-tips flex-c">
				<view v-if="cur_tab == 0" class="tips-content">
					{{$nw("当前待结算佣金")}}：<text class="money">{{commission_money || '0.00'}}元</text>
				</view>
				<view class="tips">
					({{$nw("奖励结算后才能提现")}})
				</view>
			</view>
			<view v-if="cur_tab == 1" class="commission-tips flex-c">
				<view class="tips-content">
					{{$nw("累计已结算佣金")}}：<text class="money">{{commission_money || '0.00'}}元</text>
				</view>
				<view class="tips">
					({{$nw("已结算金额可直接提现")}})
				</view>
			</view>

			<view v-if="type_index == 0 && shareProductList.length" class="order-list">
				<view class="order-item" v-for="(item,index) in shareProductList" :key="index">
					<view class="order-user flex-c">
						<view class="avatar">
							<image v-if="item.user_info.avatarUrl" class="common-img" :src="item.user_info.avatarUrl"
								mode="aspectFill"></image>
						</view>
						<view class="user-info">
							<view class="name">
								{{item.user_info.nickName || '--'}}
							</view>
							<view class="date">
								{{item.dateline || '--'}}
							</view>
						</view>
						<view class="status">
							{{item.status == 1 ? $nw("邀请未下单") : item.status == 2 ? $nw("已下单") : item.status == 3
							? $nw("已完成") : ''}}
						</view>
					</view>
					<view class="goods-label">
						{{$nw("推荐商品")}}
					</view>
					<view class="goods-info flex-c">
						<view class="goods-img common-img-bg">
							<image v-if="item.product_info.product_image" class="common-img"
								:src="item.product_info.product_image" mode="aspectFill"></image>
						</view>
						<view class="goods-text">
							<view class="title text-ellipsis2">
								{{item.product_info.product_name || '--'}}
							</view>
							<view class="price flex-c">
								{{$nw("预赚")}}：
								<text class="money">
									￥{{item.commission || '--'}}
								</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-else-if="type_index == 1 && selfBuyList.length" class="my-order-list">
				<view class="order-item" v-for="(item,index) in selfBuyList" :key="index">
					<view class="top flex-c">
						自购订单
						<view class="status">
							{{item.status == 1 ? '未下单' : item.status == 2 ? '订单待完成' : item.status == 3 ? '已完成' : ''}}
						</view>
					</view>
					<view class="goods-info flex">
						<view class="goods-img common-img-bg small">
							<image v-if="item.product_info.product_image" class="common-img"
								:src="item.product_info.product_image" mode="aspectFill"></image>
						</view>
						<view class="goods-text">
							<view class="name text-ellipsis2">
								{{item.product_info.product_name || '--'}}
							</view>
							<view class="money">
								预赚：<text class="num">￥{{item.commission || '0.00'}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view
				v-if="(!loading && ((type_index == 0 && !shareProductList.length) || (type_index == 1 && !selfBuyList.length)))"
				class="empty-box">
				<view class="empty-icon">
					<image class="common-img"
						src="https://shanghuitest.client.xcx008.com/file/uploads/20240605/b798199e3c83e9b818f20576e825a1b9.png">
					</image>
				</view>
				<view class="empty-text">
					{{$nw("暂无数据")}}
				</view>
			</view>

			<view
				v-show="loading && ((type_index == 0 && shareProductList.length) || (type_index == 1 && selfBuyList.length))"
				class="load-box flex-c has-padding">
				<i class="iconfont jiazaizhong"></i>
				{{$nw("加载中")}}
			</view>

			<view
				v-if="no_more && !loading && ((type_index == 0 && shareProductList.length) || (type_index == 1 && selfBuyList.length))"
				class="nomore-box has-padding">
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
				cur_tab: 0,
				moneyData: {},
				typeList: [{
					label: this.$nw("推荐奖励"),
					type: 1
				}, {
					label: this.$nw("自购返现"),
					type: 2
				}, ],
				tabList: [{
					label: this.$nw("待结算"),
					type: 1
				}, {
					label: this.$nw("已结算"),
					type: 2
				}],
				type_index: 0,
				commission_money: 0,
				shareProductList: [],
				selfBuyList: [],
				page: 1,
				no_more: false,
				is_first: true
			}
		},
		onShow() {
			this.getMoney()
			if (!this.is_first && this.cur_tab == 2) {
				this.page = 1
				this.no_more = false
				this.getSelfBuyList()
			}
			this.is_first = false
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
				title: _this.$nw('佣金明细'),
			})
			this.getShareList(1)
		},
		methods: {
			typeChange(index) {
				if (this.type_index == index) return
				this.type_index = index
				this.page = 1
				this.no_more = false
				this.cur_tab = 0
				if (index == 0) {
					this.getShareList(1)
				} else {
					this.getSelfBuyList(1)
				}
			},
			tabChange(index) {
				if (this.cur_tab == index) return
				this.cur_tab = index
				this.page = 1
				this.no_more = false
				this.shareProductList = []
				this.selfBuyList = []
				if (this.type_index == 0) {
					this.getShareList(1)
				} else {
					this.getSelfBuyList(1)
				}
			},
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
			// 分享商品列表
			getShareList(loading) {
				this.no_more = false;
				this.loading = true;
				if (loading) {
					uni.showLoading({
						title: this.$nw('加载中')
					});
				}

				let params = {
					type: this.tabList[this.cur_tab].type,
					page: this.page,
					limit: 10
				}
				this._get('plus.sharebind.Bind/getShareList', params, (res) => {
					this.commission_money = res.data.total || 0
					if (this.page <= 1) {
						this.shareProductList = []
					}
					this.shareProductList = this.shareProductList.concat(res.data.data.data);
					console.log('shareProductList--->', this.shareProductList);
					if (res.data.data.last_page <= this.page) {
						this.no_more = true;
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
			// 提现记录列表
			getSelfBuyList(loading) {
				this.no_more = false;
				this.loading = true;
				if (loading) {
					uni.showLoading({
						title: this.$nw('加载中')
					});
				}
				let params = {
					page: this.page,
					limit: 10,
					type: this.tabList[this.cur_tab].type,
				}
				this._get('plus.sharebind.Bind/getSelfBuyList', params, (res) => {
					this.commission_money = res.data.total || 0
					if (this.page <= 1) {
						this.selfBuyList = []
					}
					this.selfBuyList = this.selfBuyList.concat(res.data.data.data);
					console.log('selfBuyList>', this.selfBuyList);
					if (res.data.data.last_page <= this.page) {
						this.no_more = true;
					}
					console.log('no_more', this.no_more);
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
				if (this.type_index == 0) {
					this.getShareList()
				} else {
					this.getSelfBuyList()
				}
			},
			toTiXian() {
				if (+this.moneyData.money <= 0) {
					this.tip('当前可提现金额不足', 2000)
					return
				}
				uni.navigateTo({
					url: '/main/pages/agent/cash/apply/apply'
				})
			},
			toRecord() {
				uni.navigateTo({
					url: '/main/pages/agent/commission/record'
				})
			}
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

			.money-card {
				background: #fff;
				padding: 28rpx 32rpx;
				border-radius: 16rpx;

				.money-list {
					.money-item {

						.money {
							font-size: 32rpx;
							font-weight: 500;
							color: #333;
						}

						.label {
							font-size: 20rpx;
							color: #333;
						}

						&:first-of-type {
							margin-right: 44rpx;
						}
					}
				}

				.handle-box {
					margin-left: auto;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					.record-btn {
						font-size: 20rpx;
						color: #999;
						line-height: 28rpx;

						.iconfont {
							font-size: 20rpx;
							line-height: 28rpx;
							margin-left: 4rpx;
						}
					}

					.money-btn {
						width: 104rpx;
						height: 40rpx;
						display: flex;
						align-items: center;
						justify-content: center;
						border: 2rpx solid #F43434;
						border-radius: 999px;
						font-size: 24rpx;
						color: #F43434;
						line-height: 1;
						margin-top: 20rpx;
					}
				}
			}

			.tab-bar {
				justify-content: center;
				padding: 32rpx 0 0;

				.item {
					line-height: 40rpx;
					position: relative;
					padding-bottom: 12rpx;

					&::after {
						content: '';
						width: 100%;
						height: 4rpx;
						background: #F43434;
						border-radius: 999px;
						position: absolute;
						bottom: 0;
						left: 50%;
						transform: translateX(-50%);
						opacity: 0;
					}

					&.active {
						font-weight: 500;
						color: #F43434;

						&::after {
							opacity: 1;
						}
					}

					&:last-of-type {
						margin-left: 150rpx;
					}
				}
			}

			.commission-tabbar {
				padding: 32rpx 0 16rpx;

				.tabbar-item {
					height: 44rpx;
					margin-right: 16rpx;
					font-size: 20rpx;
					color: #333;
					background: #fff;
					line-height: 1;
					padding: 0 24rpx;
					border-radius: 8rpx;
					display: flex;
					align-items: center;

					&.active {
						color: #fff;
						background: #F43434;
					}
				}
			}

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

			.order-list {
				.order-item {
					background: #fff;
					border-radius: 16rpx;
					margin-top: 16rpx;
					padding: 20rpx 24rpx 24rpx;

					.order-user {
						position: relative;

						.avatar {
							width: 64rpx;
							height: 64rpx;
							border-radius: 50%;
							overflow: hidden;
							background: #d4d4d4;
						}

						.user-info {
							margin-left: 8rpx;

							.name {
								line-height: 1;
							}

							.date {
								font-size: 20rpx;
								color: #999;
								line-height: 1;
								margin-top: 10rpx;
							}
						}

						.status {
							position: absolute;
							top: 0;
							right: 0;
							color: #F43434;
							font-weight: 500;
							line-height: 36rpx;
						}
					}

					.goods-label {
						font-size: 24rpx;
						line-height: 1;
						margin-top: 18rpx;
					}

					.goods-info {
						margin-top: 16rpx;
						align-items: flex-start;

						.goods-img {
							width: 136rpx;
							height: 136rpx;
							border-radius: 8rpx;
							overflow: hidden;
						}

						.goods-text {
							flex: 1;
							height: 136rpx;
							margin-left: 16rpx;
							position: relative;

							.title {
								font-weight: 500;
								color: #333;
								line-height: 38rpx;
							}

							.price {
								color: #F43434;
								line-height: 1;
								margin-top: 28rpx;
								position: absolute;
								left: 0;
								bottom: 8rpx;

								.money {
									font-weight: 500;
									line-height: 1;
									color: #F43434;
								}
							}
						}
					}
				}
			}

			.my-order-list {
				.order-item {
					background: #fff;
					border-radius: 16rpx;
					padding: 24rpx;
					margin-top: 16rpx;

					.top {
						line-height: 40rpx;

						.status {
							font-weight: 500;
							color: #F43434;
							line-height: 40rpx;
							margin-left: auto;
						}
					}

					.goods-info {
						margin-top: 16rpx;

						.goods-img {
							width: 136rpx;
							height: 136rpx;
						}

						.goods-text {
							flex: 1;
							margin-left: 16rpx;
							position: relative;

							.name {
								font-size: 500;
								line-height: 40rpx;
							}

							.money {
								margin-top: 16rpx;
								line-height: 40rpx;
								color: #F43434;
								position: absolute;
								left: 0;
								bottom: 0;

								.num {
									font-weight: 500;
									line-height: 40rpx;
									color: #F43434;
								}
							}
						}
					}
				}
			}

			// .records-list {
			// 	background: #fff;
			// 	border-radius: 16rpx;
			// 	margin-top: 16rpx;
			// 	padding: 16rpx 24rpx;

			// 	.records-item {
			// 		margin-bottom: 24rpx;

			// 		.top {
			// 			.money {
			// 				margin-left: auto;
			// 				color: #F43434;
			// 			}
			// 		}

			// 		.bot {
			// 			margin-top: 6rpx;

			// 			.date,
			// 			.surplus {
			// 				font-size: 20rpx;
			// 			}

			// 			.date {
			// 				margin-right: auto;
			// 				color: #999;
			// 			}
			// 		}

			// 		&:last-of-type {
			// 			margin-bottom: 0;
			// 		}
			// 	}
			// }
		}
	}
</style>