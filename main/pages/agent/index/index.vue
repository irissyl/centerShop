<template>
	<scroll-view scroll-y="true" class="agent-index-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="200" @scrolltolower="scrolltolowerFunc">
		<view class="agent-bg">
			<image class="common-img"
				src="https://shanghui.client.xcx008.com/file/uploads/20240611/1c56c2715aa940ff1079078c03d5de42.png"
				mode="aspectFill"></image>
		</view>
		<view class="agent-index-content">
			<view class="money-card">
				<view class="card-content flex-c">
					<view class="money-list flex-c">
						<view class="money-item">
							<view class="value">
								{{moneyData.money || '0.00'}}{{$nw("元")}}
							</view>
							<view class="label">
								{{$nw("可提现金额")}}
							</view>
						</view>
						<view class="money-item">
							<view class="value">
								{{moneyData.unsettlement_num || '0.00'}}{{$nw("元")}}
							</view>
							<view class="label">
								{{$nw("待结算金额")}}
							</view>
						</view>
						<view class="money-item">
							<view class="value">
								{{moneyData.total_money || '0.00'}}{{$nw("元")}}
							</view>
							<view class="label">
								{{$nw("已提现金额")}}
							</view>
						</view>
					</view>
					<view class="money-btn" @click="toCommission">
						<view class="icon">
							<image class="common-img"
								src="https://shanghui.client.xcx008.com/file/uploads/20240611/f8ab107dfa455c63caa5251762e5ce80.png"
								mode="aspectFill"></image>
						</view>
						<view class="label">
							{{$nw("提现")}}
						</view>
					</view>
				</view>
				<view class="card-tips flex-c">
					<view class="icon">
						<image class="common-img"
							src="https://shanghui.client.xcx008.com/file/uploads/20240612/662056df6ee8e7433aa604793d40a23d.png"
							mode="aspectFill"></image>
					</view>
					<view class="text">
						{{$nw("待结算商品佣金在用户订单完成后将可提现")}}
					</view>
				</view>
			</view>

			<view class="my-user" @click="toMyUser()">
				<view class="title flex-c">
					我的用户
					<i class="iconfont icon-jiantou"></i>
				</view>
				<view class="user-content flex-c">
					<view class="group flex">
						<view class="value">
							{{moneyData.bind_user_num || 0}}人
						</view>
						<view class="label">
							绑定用户
						</view>
					</view>
					<view class="group flex">
						<view class="value">
							{{moneyData.share_invite_num || 0}}次
						</view>
						<view class="label">
							累计邀请
						</view>
					</view>
				</view>
			</view>

			<view class="step-card">
				<view class="step-title">
					{{$nw("操作步骤")}}
				</view>
				<view class="step-content flex">
					<view class="step-item" v-for="(item,index) in stepList" :key="index">
						<view class="step-icon" :class="{'symbol' : !item.type}">
							<image class="img" :src="item.icon" mode="aspectFill"></image>
						</view>
						<view v-if="item.type" class="step-label">
							{{item.label}}
						</view>
					</view>
				</view>
			</view>

			<view class="agent-group">
				<view class="agent-tabbar flex-c">
					<view class="tabbar-item flex-c" v-for="(item,index) in tabList" :key="index"
						:class="{'active' : cur_tab == index,'base':index == 0,'data':index == 1}"
						@click="tabChange(index)">
						{{item.label}}
					</view>
				</view>
				<view class="agent-group-content">
					<!-- 分销商品 -->
					<view v-if="cur_tab == 0 && productList && productList.length" class="product-list flex-wrap">
						<view class="product-item" v-for="(item,index) in productList" :key="index"
							@click="gotoDetail(item.product_id)">
							<view class="product-img common-img-bg">
								<image class="common-img" :src="item.product_image || item.product_main_img"
									mode="aspectFill" lazy-load />
								<view v-if="item.show_commission && item.direct_commission > 0"
									class="product-tips flex-c">
									<view class="label">
										{{$nw('分享可赚佣金')}}
									</view>
									<view class="price">
										￥<text class="money">{{toFixed(item.direct_commission)}}</text>
									</view>
								</view>
							</view>

							<view class="product-info">
								<view class="product-title text-ellipsis2">
									{{item.product_name || '--'}}
								</view>
								<view class="product-bottom flex-c">
									<view class="price">
										￥<text class="money">{{item.product_price || '--'}}</text>
									</view>
									<view class="sell">
										{{$nw('已售')}}
										<text class="num">{{item.product_sales || 0}}</text>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view v-if="cur_tab == 0 && !product_loading && (!productList || !productList.length)"
						class="empty-box">
						<view class="empty-icon">
							<image class="common-img"
								src="https://shanghuitest.client.xcx008.com/file/uploads/20240605/b798199e3c83e9b818f20576e825a1b9.png">
							</image>
						</view>
						<view class="empty-text">
							{{$nw("暂无商品")}}
						</view>
					</view>

					<!-- 佣金玩法 -->
					<view v-if="cur_tab == 1" class="playing-method">
						<view class="playing-title flex-c">
							<view class="icon">
								<image class="common-img"
									src="https://shanghui.client.xcx008.com/file/uploads/20240612/14cc68f5e02367a00432df8f16f89a8b.png"
									mode="aspectFill"></image>
							</view>
							<view class="title">
								{{$nw("佣金玩法")}}
							</view>
							<view class="icon2">
								<image class="common-img"
									src="https://shanghui.client.xcx008.com/file/uploads/20240612/803efc08424a01b62725bcc33eefe86d.png"
									mode="aspectFill"></image>
							</view>
						</view>
						<view class="playing-list">
							<view class="playing-item" v-for="(item,index) in playList" :key="index">
								<view class="label">
									{{item.label}}
								</view>
								<view class="value">
									{{item.value}}
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>

			<view v-show="cur_tab == 0 && product_loading && productList.length" class="load-box flex-c has-padding">
				<i class="iconfont jiazaizhong"></i>
				{{$nw("加载中")}}
			</view>

			<view v-if="cur_tab == 0 && no_more && !product_loading && productList.length"
				class="nomore-box has-padding">
				<text class="nomore-content">
					{{$nw("到底了")}}
				</text>
			</view>

		</view>
	</scroll-view>
</template>

<script>
	import {
		setTimeout
	} from 'timers';
	export default {

		data() {
			return {
				loading: true,
				product_loading: true,
				scrollviewHigh: 0,
				page: 1,
				no_more: false,
				moneyData: {},
				stepList: [{
					label: this.$nw("1.发送邀请"),
					icon: 'https://shanghui.client.xcx008.com/file/uploads/20240612/ebd6a3330566e76a231a116b0830f652.png',
					type: 1
				}, {
					icon: 'https://shanghui.client.xcx008.com/file/uploads/20240612/6824ed9acb136226fa62b5b16fcea14b.png',
					type: 0
				}, {
					label: this.$nw("2.好友下单"),
					icon: 'https://shanghui.client.xcx008.com/file/uploads/20240612/2f33b4945289aeaadcff84b75d72cf90.png',
					type: 1
				}, {
					icon: 'https://shanghui.client.xcx008.com/file/uploads/20240612/6824ed9acb136226fa62b5b16fcea14b.png',
					type: 0
				}, {
					label: this.$nw("3.奖励到账"),
					icon: 'https://shanghui.client.xcx008.com/file/uploads/20240612/088e5c578e54c2ba19b44bf6cf85d220.png',
					type: 1
				}],
				tabList: [{
					label: this.$nw("分销商品")
				}, {
					label: this.$nw("佣金玩法")
				}],
				cur_tab: 0,
				playList: [{
					label: '1. 什么是佣金奖励',
					value: '您通过推广链接邀请的小程序商城用户(新老用户接可)，邀请人在小程序商城起产生的所有成功消费订单，您都可以获得佣金返现。'
				}, {
					label: '2. 怎么获得奖励',
					value: '通过商品分享链接推广出去的，且好友成功下单链接商品后，推广人则获得消费佣金。'
				}, {
					label: '3. 怎么邀请好友',
					value: '分享商品给好友，好友进入成功下单获得分销奖励。'
				}, {
					label: '4. 商品推广可以获得什么收益',
					value: '带分销标志的商品都可以推广，分享好友成功下单，佣金即刻到账、即刻提现、多推多得。'
				}, {
					label: '5. 佣金怎么提现',
					value: '进入推广中心查看，小程序会累计您的所有佣金，满足提现条件就可以以直接提现，默认提现到微信钱包里；每笔提现会具体金额以到账为准。'
				}, ],
				productList: []
			}
		},
		onShow() {
			this.getMoneyData()
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
				title: _this.$nw('推广中心'),
			})
			if (uni.getStorageSync('is_agent_play')) {
				this.cur_tab = 1;
				uni.removeStorageSync('is_agent_play')
			}
			_this.getRecommendProduct()
		},
		methods: {
			tabChange(index) {
				if (this.cur_tab == index) return
				this.cur_tab = index
			},
			getMoneyData() {
				this.loading = true;
				uni.showLoading({
					title: this.$nw('加载中')
				});
				this._get('plus.sharebind.Bind/Index', {}, (res) => {
					if (res.code == 1) {
						this.moneyData = res.data || {}
					}
					uni.hideLoading();
					this.loading = false
				}, (err) => {
					console.log('请求结束-->')
					uni.hideLoading();
					this.loading = false
				})
			},
			// 下拉加载更多
			scrolltolowerFunc() {
				console.log('下拉加载更多');
				if (this.no_more) return
				this.page++
				this.getRecommendProduct()
			},
			getRecommendProduct() {
				this.product_loading = true
				this._get(
					'product.product/recommendProduct', {
						page: this.page || 1,
						category_id: 5,
						sortType: 'all',
						sortPrice: 0,
						list_rows: 20,
						app_id: 10001,
						param: {}
					}, (res) => {
						if (this.page <= 1) {
							this.productList = []
						}
						this.productList = this.productList.concat(res.data.list.data);
						this.productList = this.getUnique(this.productList, "product_id");
						console.log('productList--->', this.productList);
						this.last_page = res.data.list.last_page;
						if (res.data.list.last_page <= this.page) {
							this.no_more = true;
						}
						setTimeout(() => {
							this.product_loading = false
						}, 500)
					}, (err) => {
						this.product_loading = false
					}
				);
			},
			toMyUser() {
				uni.navigateTo({
					url: '/main/pages/agent/my_user/index'
				})
			},
			toCommission() {
				uni.navigateTo({
					url: '/main/pages/agent/commission/index'
				})
			},
			gotoDetail(e) {
				let url = '/main/pages/product/detail/detail?product_type=product&product_id=' + e;
				uni.navigateTo({
					url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.agent-index-wrap {
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

		.agent-bg {
			width: 662rpx;
			height: 248rpx;
			margin: 0 auto;
			position: relative;
			z-index: 0;
		}

		.agent-index-content {
			padding: 12rpx 24rpx 0;
			box-sizing: border-box;
			position: relative;
			z-index: 1;
			top: -98rpx;
			padding-bottom: calc(20rpx + env(safe-area-inset-bottom) / 2);

			.money-card {
				background: #fff;
				border-radius: 16rpx;
				overflow: hidden;

				.card-content {
					height: 128rpx;
					background: linear-gradient(90deg, #FF5653 0%, #FF406E 100%);
					border-radius: 16rpx;

					.money-list {
						flex: 1;
						padding-left: 24rpx;
						padding-right: 44rpx;
						justify-content: space-between;

						.money-item {

							// margin-right: 44rpx;
							.value,
							.label {
								color: #fff;
								line-height: 1;
							}

							.value {
								font-size: 32rpx;
								font-weight: 500;
							}

							.label {
								font-size: 20rpx;
								margin-top: 16rpx;
							}

							&:last-of-type {
								// margin-right: 0;
							}
						}
					}

					.money-btn {
						width: 136rpx;
						margin-left: auto;
						position: relative;

						.icon {
							width: 48rpx;
							height: 48rpx;
							margin: 0 auto;
						}

						.label {
							font-size: 20rpx;
							color: #fff;
							text-align: center;
							margin-top: 4rpx;
						}

						&::before {
							content: '';
							width: 2rpx;
							height: 64rpx;
							background: rgba(255, 255, 255, 0.3);
							position: absolute;
							left: 0;
							top: 50%;
							transform: translateY(-50%);
						}
					}
				}

				.card-tips {
					height: 48rpx;
					padding: 0 16rpx;

					.icon {
						width: 24rpx;
						height: 24rpx;
					}

					.text {
						font-size: 20rpx;
						color: #333;
						margin-left: 6rpx;
						line-height: 1;
					}
				}
			}

			.my-user {
				background: #fff;
				border-radius: 16rpx;
				padding: 24rpx;
				margin-top: 16rpx;

				.title {
					font-weight: 500;
					line-height: 40rpx;

					.iconfont {
						margin-left: auto;
						font-size: 24rpx;
						color: #333;
						line-height: 40rpx;
					}
				}

				.user-content {
					background: #FFF5F7;
					border-radius: 8rpx;
					padding: 16rpx;
					margin-top: 16rpx;
					position: relative;

					&::before {
						content: '';
						width: 2rpx;
						height: 100rpx;
						background: rgba(255, 69, 102, 0.2);
						border-radius: 999px;
						position: absolute;
						z-index: 0;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
					}

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
			}

			.step-card {
				height: 276rpx;
				background: #fff;
				border-radius: 16rpx;
				margin-top: 16rpx;
				padding: 20rpx 24rpx 32rpx;

				.step-title {
					font-weight: 500;
					color: #FE374F;
				}

				.step-content {
					padding: 0 42rpx;
					margin-top: 32rpx;
					justify-content: space-between;

					.step-item {
						.step-icon {
							width: 96rpx;
							height: 96rpx;
							background: #FFE4E9;
							border-radius: 50%;
							display: flex;
							align-items: center;
							justify-content: center;
							margin: 0 auto;

							.img {
								width: 64rpx;
								height: 64rpx;
							}

							&.symbol {
								width: 40rpx;
								height: 96rpx;
								background: none;

								.img {
									width: 40rpx;
									height: 32rpx;
								}
							}
						}

						.step-label {
							font-size: 24rpx;
							color: #FE374F;
							font-weight: 500;
							text-align: center;
							margin-top: 12rpx;
						}

					}
				}
			}

			.agent-group {
				min-height: 570rpx;
				background: #fff;
				border-radius: 16rpx;
				margin-top: 16rpx;
				overflow: hidden;

				.agent-tabbar {
					height: 76rpx;
					background: #FFF3F3;
					position: relative;

					.tabbar-item {
						height: 76rpx;
						font-size: 28rpx;
						position: relative;
						width: 50%;
						line-height: 1;
						color: #333333;
						z-index: 1;
						justify-content: center;

						&.base {
							left: 0;
						}

						&.data {
							right: 0;
							left: initial;
						}

						&::before {
							content: '';
							width: 112rpx;
							height: 4rpx;
							background: #F43434;
							position: absolute;
							left: 50%;
							transform: translateX(-50%);
							bottom: 8rpx;
							border-radius: 999px;
							opacity: 0;
							// transition: all .2s;
						}

						&.active {
							background: #fff;
							color: #F43434;
							font-weight: 500;
							z-index: 2;

							&::before {
								opacity: 1;
							}

							&::after {
								content: '';
								width: 0;
								height: 0;
								position: absolute;
								bottom: 0;
								border-bottom: 64rpx solid #fff;
							}

							&.base {
								border-radius: 0 18rpx 0 0;

								&::after {
									border-right: 20rpx solid transparent;
									right: -20rpx;
								}
							}

							&.data {
								border-radius: 18rpx 0 0 0;

								&::after {
									border-left: 20rpx solid transparent;
									left: -20rpx;
								}
							}
						}
					}

					.tabbar-tags {
						flex-wrap: wrap;
						background-color: #fff;
						padding: 20rpx 30rpx;
						padding-bottom: 4rpx;

						.tabbar-tags-item {
							width: 18%;
							height: 52rpx;
							display: flex;
							align-items: center;
							justify-content: center;
							color: rgba(145, 150, 154, 1);
							font-size: 24rpx;
							border-radius: 32rpx;
							background-color: rgba(244, 244, 244, 1);
							margin-bottom: 16rpx;
							margin-right: 2.5%;
							border: 1rpx solid rgba(244, 244, 244, 1);
							box-sizing: border-box;
							transition: all .2s;

							&.active {
								background-color: rgba(230, 237, 255, 1);
								border-color: rgba(72, 126, 251, 1);
								color: rgba(72, 126, 251, 1);
							}

							&:nth-of-type(5n) {
								margin-right: 0;
							}
						}
					}
				}

				.agent-group-content {
					margin-top: 16rpx;
					padding: 0 24rpx;

					.product-list {
						.product-item {
							width: calc(50% - 10rpx);
							// margin-right: 16rpx;
							margin-bottom: 30rpx;
							background: #fff;
							border-radius: 16rpx;
							overflow: hidden;

							.product-img {
								width: 100%;
								height: 320rpx;
								position: relative;

								.common-img {
									position: relative;
									z-index: 1;
								}

								.product-tips {
									width: 100%;
									height: 48rpx;
									position: absolute;
									left: 0;
									bottom: 0;
									z-index: 2;
									background: linear-gradient(90deg, #FF5653 0%, #FF406E 100%);
									padding: 0 8rpx;
									border-radius: 8rpx 8rpx 0rpx 0rpx;

									.label {
										font-size: 20rpx;
										color: #fff;
									}

									.price {
										font-size: 20rpx;
										color: #fff;
										margin-left: auto;

										.money {
											font-size: 28rpx;
											font-weight: 500;
											color: #fff;
										}
									}
								}
							}

							.product-info {
								height: 132rpx;
								position: relative;
								padding: 12rpx 0 0;

								.product-title {
									font-weight: 500;
									line-height: 38rpx;
									color: #333;
								}

								.product-bottom {
									width: 100%;
									position: absolute;
									left: 0;
									bottom: 0;

									.price {
										font-weight: 600;
										color: #F43434;
										line-height: 1;

										.money {
											color: #F43434;
											font-size: 32rpx;
											line-height: 1;
										}
									}

									.sell {
										font-size: 20rpx;
										color: #999;
										line-height: 1;
										margin-left: auto;

										.num {
											color: #999;
											margin-left: 4rpx;
											line-height: 1;
											/* #ifdef H5 */
											position: relative;
											top: 2rpx;
											/* #endif */
										}
									}
								}
							}

							&:nth-of-type(2n) {
								margin-right: 0;
							}
						}
					}

					.empty-box {
						min-height: 360rpx;

						.empty-icon {
							width: 140rpx;
							height: 88rpx;
						}

						.empty-text {
							margin-top: 16rpx;
							color: #bbb;
						}
					}

					.playing-method {

						.playing-title {
							.icon {
								width: 36rpx;
								height: 36rpx;
							}

							.title {
								font-size: 32rpx;
								color: #333333;
								font-weight: 500;
								margin-left: 8rpx;
							}

							.icon2 {
								width: 110rpx;
								height: 22rpx;
								margin-left: auto;
							}
						}

						.playing-list {
							margin-top: 6rpx;

							.playing-item {
								margin-bottom: 24rpx;

								.label {
									color: #333;
									font-weight: 500;
								}

								.value {
									background: #FFF3F3;
									border-radius: 8rpx 8rpx 8rpx 8rpx;
									padding: 12rpx 16rpx;
									font-size: 24rpx;
									color: #333;
									line-height: 38rpx;
									letter-spacing: 2rpx;
									margin-top: 10rpx;
								}
							}
						}
					}
				}
			}
		}
	}
</style>