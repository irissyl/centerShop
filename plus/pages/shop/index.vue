<template>
	<scroll-view scroll-y="true" class="shop-index scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50" @scrolltolower="scrolltolowerFunc" refresher-enabled :refresher-triggered="triggered"
		@refresherpulling="onPulling" @refresherrefresh="onRefresh" @refresherrestore="onRestore"
		@refresherabort="onAbort">
		<view v-if="guide_show" class="guide-mask" @touchmove.stop>
			<view class="auth-card">
				<view class="auth-title">
					认证信息
				</view>
				<view class="auth-info flex-c">
					<i class="iconfont dianpuguanli1"></i>
					<view class="company">
						{{supplyInfo.name || '--'}}
					</view>
					<view class="status flex-c">
						去认证
						<i class="iconfont icon-jiantou"></i>
					</view>
				</view>
			</view>
			<view class="guide-line"></view>
			<!-- <i class="iconfont sanjiaoxing"></i> -->
			<view class="tips flex-c">
				请先完成商户认证
			</view>
			<view class="close-btn flex-c" @click="closeGuide()">
				我知道了
			</view>
		</view>
		<view class="shop-index-content">
			<view class="auth-card">
				<view class="auth-title">
					认证信息
				</view>
				<view class="auth-info flex-c">
					<i class="iconfont dianpuguanli1"></i>
					<view class="company">
						{{supplyInfo.name || '--'}}
					</view>
					<view class="status flex-c" @click="toAuth">
						{{isAuth ? '已认证' : '去认证'}}
						<i class="iconfont icon-jiantou"></i>
					</view>
				</view>
			</view>
			<view class="settle-card">
				<view class="settle-title">
					结算中心
				</view>
				<view class="money-group flex-c">
					<view class="money-item">
						<view class="value flex-c">
							<view class="money">
								{{settleData.total_money || '****'}}
							</view>
							元
						</view>
						<view class="label">
							已打款货款
						</view>
					</view>
					<view class="money-item">
						<view class="value flex-c">
							<view class="money">
								{{settleData.unrecorded_money || '****'}}
							</view>
							元
						</view>
						<view class="label">
							未入账货款
						</view>
					</view>
				</view>
				<view class="settle-list">
					<view class="list-item flex-c" @click="tabChange('comment')">
						<i class="iconfont renminbi"></i>
						<view class="label">
							打款中货款
						</view>
						<view class="money flex-c">
							{{settleData.money || '****'}}元
							<i class="iconfont icon-jiantou"></i>
						</view>
					</view>
					<view class="list-item flex-c" @click="toBank">
						<i class="iconfont tubiaosvg-"></i>
						<view class="label">
							我的银行卡
						</view>
						<view class="money flex-c">
							{{bank_status == 1 ? '已绑定' : '未绑定有效银行卡'}}
							<i class="iconfont icon-jiantou"></i>
						</view>
					</view>
				</view>
			</view>

			<view class="tab-bar flex-c">
				<view class="item" v-for="(item,index) in tab_list" :key="index" @click="tabChange(item.value,index)">
					<view class="label" :class="{'active' : dataType == item.value}">
						{{item.label}}
					</view>
					<view v-if="item.value == 'delivery' && wait_delivery_num > 0" class="count flex-c"
						:class="{'big' : wait_delivery_num > 99}">
						{{wait_delivery_num > 99 ? '99+' : wait_delivery_num}}
					</view>
				</view>
			</view>

			<view v-if="order_list && order_list.length" class="shop-order-list">
				<view class="order-item" v-for="(item,index) in order_list" :key="index">
					<view class="order-num flex-c">
						<view class="label">
							订单号
						</view>
						<view class="num">
							{{item.order_no || '--'}}
						</view>
						<view v-if="item.settlement_status" class="status flex-c"
							@click="toFinanceDetails(item.settlement_status,item.order_id)">
							{{item.settlement_status == 1 ? '未入账' : item.settlement_status == 2 ? '打款中' : item.settlement_status == 3 ? '已打款' : item.settlement_status == 4 ? '打款失败' : ''}}
							<i v-if="item.settlement_status > 1" class="iconfont icon-jiantou"></i>
						</view>
					</view>
					<view class="goods-info flex-c" v-for="(goods,i) in item.product" :key="i">
						<view class="goods-img common-img-bg small">
							<image v-if="goods.image && goods.image.file_path" class="common-img"
								:src="goods.image.file_path" mode="aspectFill"></image>
						</view>
						<view class="goods-text">
							<view class="goods-title text-ellipsis2">
								{{goods.product_name || '--'}}
							</view>
							<view class="goods-other flex-c">
								<!-- <view class="tags flex">
									<view class="tag">
										暗夜黑 1TB
									</view>
								</view> -->
								<view class="count">
									×{{goods.total_num || '--'}}
								</view>
							</view>
						</view>
					</view>
					<view class="order-date flex-c">
						<view class="label">
							订单时间
						</view>
						<view class="date">
							{{item.create_time || '--'}}
						</view>
					</view>
					<view class="order-price flex-c">
						<view class="price flex">
							<view class="label">
								总价
							</view>
							<view class="money">
								￥{{item.total_price || '--'}}
							</view>
						</view>
						<view class="btns flex-c">
							<view v-if="tab_index == 0" class="btn plain flex-c" @click="toSend(item.order_id)">
								去发货
							</view>
							<view v-if="tab_index == 1" class="btn flex-c" @click="gotoExpress(item)">
								查看物流
							</view>
						</view>
					</view>
					<view class="express-info">
						<view class="express-item flex">
							<view class="label">
								收货人：
							</view>
							<view class="value">
								{{item.address.name || '--'}}
							</view>
						</view>
						<view class="express-item flex">
							<view class="label">
								联系电话：
							</view>
							<view class="value">
								{{item.address.phone || '--'}}
							</view>
						</view>
						<view class="express-item flex">
							<view class="label">
								收货地址：
							</view>
							<view class="value">
								{{addressFormat(item.address)}}
							</view>
						</view>
						<view class="copy-btn flex-c" @click="copyHandle(item.address)">
							复制
						</view>
					</view>
				</view>
			</view>

			<view v-show="loading && order_list && order_list.length" class="load-box flex-c has-padding">
				<i class="iconfont jiazaizhong"></i>
				{{$nw('加载中')}}
			</view>

			<view v-if="no_more && !loading && order_list && order_list.length" class="nomore-box has-padding">
				<text class="nomore-content">
					{{$nw("到底了")}}
				</text>
			</view>
			<view v-if="(!order_list || !order_list.length) && !loading" class="empty-box">
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
				loading: false,
				scrollviewHigh: 0, //滚动区域高度
				triggered: false, //下拉刷新状态
				tab_list: [{
					label: '待发货',
					value: 'delivery'
				}, {
					label: '待收货',
					value: 'received'
				}, {
					label: '已完成',
					value: 'comment'
				}, ],
				tab_index: 0,
				order_list: [],
				page: 1,
				no_more: false,
				guide_show: false,
				id_card_status: null,
				bank_status: null,
				userInfo: {},
				supplyInfo: {},
				dataType: 'delivery',
				settleData: {},
				is_first: true,
				wait_delivery_num: 0
			}
		},
		computed: {
			isAuth() {
				return this.id_card_status == 3 && this.bank_status == 1
			},

		},
		// onShareAppMessage() {},
		// onShareTimeline() {},
		onLoad() {
			let _this = this
			// 设置全局颜色
			_this.setGlobalColor({
				bgc: '#EBF5FF'
			})
			uni.setNavigationBarTitle({
				title: _this.$nw('商户中心'),
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
		},

		onShow() {
			this.userInfo = uni.getStorageSync('userInfo') || {}
			this.supplyInfo = this.userInfo.supply || {}
			console.log('supplyInfo-->', this.supplyInfo);
			this.page = 1
			this.getMerchantAuth(1)
			this.getMerchantList()
			this.getSettlement()
		},

		methods: {
			// 查看货款到账详情
			toFinanceDetails(settlement_status, order_id) {
				if (settlement_status < 2) return
				uni.navigateTo({
					url: '/plus/pages/shop/finance/details?order_id=' + order_id
				});
			},
			// 去发货
			toSend(order_id) {
				uni.navigateTo({
					url: '/plus/pages/shop/express/send?order_id=' + order_id
				});
			},
			/*查看物流*/
			gotoExpress(item) {
				console.log('item', item);
				uni.navigateTo({
					url: '/main/pages/order/express/express?order_id=' + item.order_id
				});
			},
			addressFormat(address) {
				const province = address.region.province || ''
				const city = address.region.city || ''
				const region = address.region.region || ''
				const detail = address.detail || ''
				const value = province + city + region + detail
				return value || '--'
			},
			copyHandle(address) {
				const name_v = '收货人：' + (address.name || '--') + '\n'
				const mobile_v = '联系电话：' + (address.phone || '--') + '\n'
				const address_v = '收货地址：' + this.addressFormat(address)
				const value = name_v + mobile_v + address_v
				uni.setClipboardData({
					data: value,
					success: () => {
						this.tip("复制成功", 2000);
					},
					fail: () => {
						this.tip("复制失败，请重试", 2000);
					}
				});
			},
			closeGuide() {
				console.log('closeGuide');
				this.guide_show = false
			},
			toBank() {
				let url = this.bank_status == 1 ? '/plus/pages/shop/authentication/bankcard' :
					'/plus/pages/shop/authentication/edit_bankcard'
				uni.navigateTo({
					url: '/plus/pages/shop/authentication/bankcard'
				})
			},
			toAuth() {
				console.log('222111');
				uni.navigateTo({
					url: '/plus/pages/shop/authentication/index'
				})
			},
			// 获取结算中心数据
			getSettlement(show_loading) {
				if (show_loading) {
					uni.showLoading({
						title: this.$nw("加载中"),
						mask: true
					});
				}
				this._get('user.user/getSettlement', {}, (res) => {
					this.settleData = res.data || {}
				}, null, () => {
					uni.hideLoading()
				})
			},
			// 获取商户认证状态
			getMerchantAuth(show_loading) {
				if (show_loading) {
					uni.showLoading({
						title: this.$nw("加载中"),
						mask: true
					});
				}
				this._get('user.user/getMerchantAuth', {}, (res) => {
					this.id_card_status = res.data.id_card_status
					this.bank_status = res.data.bank_status
					if ((this.id_card_status != 3 || this.bank_status != 1) && this.is_first) {
						this.guide_show = true
						this.is_first = false
					}
				}, null, () => {
					uni.hideLoading()
					setTimeout(() => {
						this.triggered = false
					}, 1000)
				})
			},
			// 获取商户订单列表
			getMerchantList(show_loading) {
				if (this.loading) return
				if (show_loading) {
					uni.showLoading({
						title: this.$nw("加载中"),
						mask: true
					});
				}
				this.loading = true
				this.no_more = false
				this._get(
					'user.order/getMerchantList', {
						page: this.page,
						dataType: this.dataType,
						list_rows: 10,
					}, (res) => {
						if (this.page <= 1) {
							this.order_list = []
						}
						this.wait_delivery_num = res.data.list.wait_delivery_num || 0
						this.order_list = this.order_list.concat(res.data.list.data);
						console.log('order_list--->', this.order_list);
						this.last_page = res.data.list.last_page;
						if (res.data.list.last_page <= this.page) {
							this.no_more = true;
						}
						setTimeout(() => {
							this.loading = false
						}, 500)
					}, (err) => {
						this.loading = false
					}
				);
			},
			tabChange(value, index) {
				if (this.dataType == value) return
				this.tab_index = index
				this.dataType = value
				this.page = 1
				this.getMerchantList(1)
			},
			onPulling() {
				// console.log('onPulling--->');
			},
			onRefresh() {
				console.log('onRefresh--->');
				this.triggered = true
				this.page = 1
				// this.dataType = 'delivery'
				this.getMerchantAuth()
				this.getSettlement()
				this.getMerchantList()
			},
			onRestore() {
				console.log('onRestore--->');
			},
			onAbort() {
				console.log('onAbort--->');
			},
			toPage() {
				uni.navigateTo({
					url: "/main/pages/login/login"
				})
			},

			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
				if (this.no_more) return
				this.page++
				this.getMerchantList()
			},
		},
	}
</script>

<style lang="scss" scoped>
	.shop-index {
		background: #F4F7FB;
		position: relative;

		&::before {
			content: '';
			width: 100%;
			height: 460rpx;
			background: linear-gradient(180deg, #EBF5FF 0%, rgba(235, 245, 255, 0) 100%);
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}

		.guide-mask {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.35);
			position: fixed;
			z-index: 22;
			overflow: hidden;
			padding: 16rpx 24rpx;

			.guide-line {
				margin: 0 auto;
				width: 0;
				height: 98rpx;
				border-right: 4rpx dashed #fff;
			}

			.iconfont {
				display: block;
				text-align: center;
				color: #fff;
			}

			.tips {
				width: 326rpx;
				height: 88rpx;
				margin: 0 auto;
				justify-content: center;
				background: #fff;
				border-radius: 8rpx;
				position: relative;
				margin-top: 24rpx;

				&::before {
					content: '';
					width: 0;
					height: 0;
					border-style: solid;
					border-width: 32rpx 20rpx 32rpx 20rpx;
					border-color: transparent transparent #fff transparent;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					top: -48rpx;
					z-index: 22;
				}
			}

			.close-btn {
				width: 144rpx;
				height: 58rpx;
				margin: 0 auto;
				margin-top: 24rpx;
				justify-content: center;
				background: rgba(255, 255, 255, 0.14);
				border-radius: 8rpx;
				color: #fff;
				font-size: 24rpx;
			}
		}

		.auth-card {
			background: #fff;
			border-radius: 16rpx;
			padding: 24rpx 24rpx;

			.auth-title {
				font-size: 32rpx;
				font-weight: 500;
				line-height: 1;
			}

			.auth-info {
				margin-top: 30rpx;

				.iconfont {
					font-size: 28rpx;
					color: #333;
					line-height: 1;
				}

				.company {
					line-height: 1;
					margin-left: 12rpx;
				}

				.status {
					margin-left: auto;
					line-height: 1;
					font-weight: 500;
					color: #999;

					.iconfont {
						font-size: 22rpx;
						color: #999;
						margin-left: 8rpx;
						font-weight: 500;
					}

					&.active {
						color: #1B94E0;
					}
				}
			}
		}

		.shop-index-content {
			position: relative;
			padding: 16rpx 24rpx;
			padding-bottom: calc(24rpx + env(safe-area-inset-bottom) / 2);
			position: relative;



			.settle-card {
				background: linear-gradient(90deg, #1B94E0 0%, #40B4FD 100%);
				padding: 16rpx 24rpx 20rpx;
				margin-top: 16rpx;
				border-radius: 16rpx;

				.settle-title {
					font-size: 32rpx;
					color: #fff;
					font-weight: 500;
				}

				.money-group {
					margin-top: 16rpx;
					background: rgba(0, 0, 0, .05);
					border-radius: 8rpx;
					padding: 16rpx 0;
					justify-content: space-between;

					.money-item {
						flex: 1;
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						position: relative;

						.value {
							font-size: 40rpx;
							font-weight: 500;
							color: #fff;

							.money {
								font-size: 40rpx;
								font-weight: 500;
								color: #fff;
								line-height: 1;
							}
						}

						.label {
							color: rgba(255, 255, 255, 0.8);
							font-size: 24rpx;
						}

						&:first-of-type {
							&::after {
								content: "";
								width: 2rpx;
								height: 100%;
								background: rgba(255, 255, 255, 0.3);
								position: absolute;
								top: 0;
								right: 0;
								border-radius: 999px;
							}
						}
					}
				}

				.settle-list {
					margin-top: 24rpx;

					.list-item {

						.iconfont,
						.label,
						.money {
							font-size: 28rpx;
							color: #fff;
							line-height: 40rpx;
						}

						.label {
							margin-left: 12rpx;
						}

						.money {
							margin-left: auto;
							font-weight: 500;

							.iconfont {
								font-size: 22rpx;
								margin-left: 8rpx;
							}
						}

						&:last-of-type {
							margin-top: 16rpx;
						}
					}
				}
			}

			.tab-bar {
				margin-top: 32rpx;

				.item {
					margin-right: 32rpx;
					position: relative;

					.label {
						line-height: 40rpx;
						font-size: 24rpx;

						&.active {
							font-size: 28rpx;
							color: #1B94E0;
							font-weight: 500;
						}
					}

					.count {
						width: 25rpx;
						height: 25rpx;
						// padding: 0 8rpx;
						background: #F43434;
						border-radius: 12rpx;
						color: #fff;
						font-size: 16rpx;
						line-height: 1;
						justify-content: center;
						position: absolute;
						z-index: 1;
						top: -8rpx;
						right: -16rpx;

						&.big {
							right: -28rpx;
							width: 40rpx;
						}
					}

					&:last-of-type {
						margin-right: 0;
					}


				}
			}

			.shop-order-list {
				.order-item {
					background: #fff;
					border-radius: 16rpx;
					padding: 24rpx;
					margin-top: 16rpx;

					.order-num {

						.label,
						.num {
							font-size: 20rpx;
							line-height: 28rpx;
						}

						.label {
							color: #999;
							margin-right: 8rpx;
						}

						.status {
							line-height: 40rpx;
							color: #1B94E0;
							font-weight: 500;
							margin-left: auto;

							.iconfont {
								font-size: 20rpx;
								color: #1B94E0;
								margin-left: 6rpx;
								line-height: 1;
							}
						}
					}

					.goods-info {
						margin-top: 22rpx;

						.goods-img {
							width: 124rpx;
							height: 124rpx;
							border-radius: 8rpx;
						}

						.goods-text {
							flex: 1;
							height: 124rpx;
							display: flex;
							flex-direction: column;
							justify-content: space-between;
							margin-left: 16rpx;

							.goods-title {
								line-height: 40rpx;
								font-weight: 500;
							}

							.goods-other {
								.tags {
									.tag {
										color: #999;
										font-size: 24rpx;
										line-height: 36rpx;
									}
								}

								.count {
									color: #999;
									font-size: 24rpx;
									line-height: 36rpx;
									// margin-left: auto;
								}
							}
						}
					}

					.order-date {
						padding: 16rpx 0;
						border-bottom: 2rpx solid #F5F7FA;

						.label,
						.date {
							font-size: 20rpx;
							line-height: 32rpx;
						}

						.label {
							color: #999;
						}

						.date {
							margin-left: auto;
						}
					}

					.order-price {
						margin-top: 24rpx;

						.price {
							align-items: flex-end;

							.label {
								font-size: 20rpx;
								line-height: 1;
								position: relative;
								top: -4rpx;
							}

							.money {
								color: #F43434;
								line-height: 1;
							}
						}

						.btns {
							margin-left: auto;

							.btn {
								height: 56rpx;
								padding: 0 24rpx;
								background: linear-gradient(270deg, #1B94E0 0%, #40B4FD 100%);
								justify-content: center;
								color: #fff;
								border-radius: 8rpx;
								line-height: 1;
								margin-left: 16rpx;

								&.plain {
									background: #fff;
									color: #1B94E0;
									border: 2rpx solid #1B94E0;
								}

								&:first-of-type {
									margin-left: 0;
								}
							}
						}


					}

					.express-info {
						margin-top: 24rpx;
						background: #F5F7FA;
						border-radius: 8rpx;
						padding: 16rpx;
						position: relative;

						.express-item {
							margin-top: 16rpx;

							.label,
							.value {
								font-size: 20rpx;
								line-height: 28rpx;
							}

							.label {
								width: 106rpx;
								color: #666;
							}

							&:first-of-type {
								margin-top: 0;
							}
						}

						.copy-btn {
							width: 64rpx;
							height: 40rpx;
							border-radius: 4rpx;
							border: 2rpx solid #1B94E0;
							justify-content: center;
							font-size: 20rpx;
							color: #1B94E0;
							position: absolute;
							top: 16rpx;
							right: 16rpx;
						}
					}
				}
			}
		}
	}
</style>