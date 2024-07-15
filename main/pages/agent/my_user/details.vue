<template>
	<scroll-view scroll-y="true" class="my-user-details scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50" @scrolltolower="scrolltolowerFunc">

		<view class="user-details-content">
			<view class="tab-bar flex-c">
				<view class="item" v-for="(item,index) in tabList" :key="index" :class="{'active' : tab_id == item.id}"
					@click="tabChange(item.id)">
					{{item.label}}
				</view>
			</view>
			<view class="user-content flex-c">
				<view class="group flex">
					<view class="value">
						{{commission_money}}元
					</view>
					<view class="label">
						推荐奖励
					</view>
				</view>
				<view class="group flex">
					<view class="value">
						{{total}}笔
					</view>
					<view class="label">
						订单
					</view>
				</view>
			</view>
			<view class="order-title">
				购买订单
			</view>
			<view class="order-list">
				<view class="order-item" v-for="(item,index) in shareProductList" :key="index">
					<view class="top flex-c">
						购买商品
						<view class="status">
							{{item.status == 1 ? $nw("未下单") : item.status == 2 ? $nw("已下单") : item.status == 3
							? $nw("已完成") : ''}}
						</view>
					</view>
					<view class="goods-info flex">
						<view class="goods-img common-img-bg small">
							<image v-if="item.product_info.product_image" class="common-img"
								:src="item.product_info.product_image"
								mode="aspectFill"></image>
						</view>
						<view class="goods-text">
							<view class="name text-ellipsis2">
								{{item.product_info.product_name || '--'}}
							</view>
							<view class="money">
								预赚：<text class="num">￥{{item.commission || '--'}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-show="loading && shareProductList.length" class="load-box flex-c">
				<i class="iconfont jiazaizhong"></i>
				{{$nw('加载中')}}
			</view>

			<view v-if="no_more && !loading && shareProductList.length" class="nomore-box">
				<text class="nomore-content">
					{{$nw("到底了")}}
				</text>
			</view>
			<view v-if="(!shareProductList || !shareProductList.length) && !loading" class="empty-box">
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
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				loading: true,
				scrollviewHigh: 0,
				no_more: false,
				page: 1,
				tab_id: 1,
				tabList: [{
					label: '待结算',
					id: 1
				}, {
					label: '已结算',
					id: 2
				}],
				user_id: null,
				shareProductList: [],
				total: 0,
				commission_money: 0
			}
		},
		onShow() {

		},
		onLoad(option) {
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
				title: _this.$nw('用户详情'),
			})
			_this.user_id = option.user_id
			_this.getShareList(1)
		},
		methods: {
			tabChange(id) {
				if (this.tab_id == id) return
				this.tab_id = id
				this.page = 1
				this.getShareList(1)
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
					type: this.tab_id,
					page: this.page,
					limit: 10,
					bind_user_id: this.user_id
				}
				this._get('plus.sharebind.Bind/getShareList', params, (res) => {
					this.commission_money = res.data.total || 0
					this.total = res.data.data.total || 0
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
			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('下拉加载更多');
				if (this.no_more) return
				this.page++
				this.getShareList()
			},
			// 商品详情
			toDetail(item) {
				uni.navigateTo({
					url: '/main/pages/agent/my_user/details?user_id=' + 111
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.my-user-details {
		position: relative;
		background-color: #F4F7FB;

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

		.user-details-content {
			box-sizing: border-box;
			position: relative;
			z-index: 1;
			padding: 0 24rpx;
			padding-bottom: calc(40rpx + env(safe-area-inset-bottom) / 2);

			.tab-bar {
				justify-content: center;
				padding: 24rpx 0 24rpx;

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
						margin-left: 178rpx;
					}
				}
			}

			.user-content {
				background: #fff;
				border-radius: 8rpx;
				padding: 16rpx;
				position: relative;

				.group {
					flex: 1;
					flex-direction: column;
					justify-content: center;
					align-items: center;
					margin: 0;
					position: relative;

					.value {
						font-size: 40rpx;
						font-weight: 500;
						line-height: 56rpx;
					}

					.label {
						font-size: 24rpx;
						color: #666;
						line-height: 36rpx;
						margin-top: 8rpx;
					}
				}
			}

			.order-title {
				font-weight: 500;
				line-height: 40rpx;
				margin-top: 24rpx;
			}

			.order-list {
				margin-top: 8rpx;

				.order-item {
					background: #fff;
					border-radius: 16rpx;
					padding: 24rpx;
					margin-bottom: 16rpx;

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
		}
	}
</style>