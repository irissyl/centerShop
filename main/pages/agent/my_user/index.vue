<template>
	<scroll-view scroll-y="true" class="my-user-index scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50" @scrolltolower="scrolltolowerFunc">

		<view class="my-user-search flex-c">
			<view class="search-content flex-c">
				<view class="icon flex-c">
					<i class="iconfont sousuo"></i>
				</view>
				<view class="inp-box">
					<input class="inp" v-model="keyword" confirm-type="search" placeholder="用户手机号或昵称搜索"
						placeholder-style="font-size:24rpx;color:#999;" @confirm='searchHandle' />
				</view>
			</view>
		</view>

		<view class="my-user-content">
			<view class="count-box flex-c">
				共绑定
				<text class="num">{{total}}</text>
				位用户
			</view>
			<view v-if="user_list.length" class="user-list">
				<view class="user-item" v-for="(item,index) in user_list" :key="index" @click="toDetail(item.to_uid)">
					<view class="user-top flex-c">
						<view class="avatar">
							<image v-if="item.user.avatarUrl" class="common-img" :src="item.user.avatarUrl"
								mode="aspectFill"></image>
						</view>
						<view class="name">
							{{item.user.nickName || '--'}}
						</view>
						<view class="money">
							推广总分佣 {{item.commission || '0.00'}}元
						</view>
					</view>
					<view class="user-content">
						<view class="user-group">
							<view class="item flex-c">
								<view class="label">
									用户注册时间
								</view>
								<view class="value">
									{{item.user.create_time || '--'}}
								</view>
							</view>
							<view class="item flex-c">
								<view class="label">
									累计消费金额
								</view>
								<view class="value">
									{{item.pay_money || '0.00'}}元
								</view>
							</view>
							<view class="item flex-c">
								<view class="label">
									累计消费订单
								</view>
								<view class="value">
									{{item.pay_num || 0}}笔
								</view>
							</view>
						</view>
						<i class="iconfont icon-jiantou"></i>
					</view>
				</view>
			</view>
			<view v-show="loading && user_list.length" class="load-box flex-c">
				<i class="iconfont jiazaizhong"></i>
				{{$nw('加载中')}}
			</view>

			<view v-if="no_more && !loading && user_list.length" class="nomore-box">
				<text class="nomore-content">
					{{$nw("到底了")}}
				</text>
			</view>
			<view v-if="(!user_list || !user_list.length) && !loading" class="empty-box">
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
				scrollviewHigh: 0,
				user_list: [],
				no_more: false,
				keyword: '',
				page: 1,
				total: 0
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
				title: _this.$nw('用户列表'),
			})
			_this.getBindUser()
		},
		methods: {
			searchHandle(e) {
				console.log('触发搜索', e);
				// if (!e.detail.value) {
				// 	this.tip('请输入用户手机号或昵称搜索', 2000)
				// 	return
				// }
				this.getBindUser(1)
			},
			getBindUser(loading) {
				if (loading) {
					uni.showLoading({
						title: this.$nw("加载中")
					});
				}
				this.loading = true;
				this.no_more = false
				this._get('plus.sharebind.Bind/getBindUser', {
					page: this.page,
					limit: 10,
					key: this.keyword
				}, (res) => {
					if (this.page <= 1) {
						this.user_list = []
					}
					this.total = res.data.total || 0
					this.user_list = this.user_list.concat(res.data.data);
					console.log('user_list---->', this.user_list);
					if (res.data.last_page <= this.page || !res.data.last_page) {
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
				this.getData()
			},
			// 商品详情
			toDetail(to_uid) {
				uni.navigateTo({
					url: '/main/pages/agent/my_user/details?user_id=' + to_uid
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.my-user-index {
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

		.my-user-search {
			width: 100%;
			height: 88rpx;
			position: fixed;
			background: #F4F7FB;
			padding: 0rpx 24rpx;
			z-index: 22;
			overflow: hidden;

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

			.search-content {
				flex: 1;
				height: 64rpx;
				background: #fff;
				border-radius: 999px;
				padding: 0 16rpx;
				position: relative;
				z-index: 1;

				.icon {
					width: 32rpx;
					height: 32rpx;
					justify-content: center;

					.iconfont {
						font-size: 32rpx;
						color: #999;
						font-weight: 500;
					}
				}

				.inp-box {
					margin-left: 8rpx;
					flex: 1;

					.inp {
						font-size: 24rpx;
					}
				}
			}
		}

		.my-user-content {
			box-sizing: border-box;
			position: relative;
			z-index: 1;
			padding: 0 24rpx;
			padding-top: 100rpx;
			padding-bottom: calc(40rpx + env(safe-area-inset-bottom) / 2);

			.count-box {
				font-size: 24rpx;
				line-height: 36rpx;

				.num {
					font-size: 24rpx;
					color: #F43434;
					line-height: 36rpx;
				}
			}

			.user-list {
				margin-top: 16rpx;

				.user-item {
					background: #fff;
					border-radius: 16rpx;
					padding: 20rpx 24rpx;
					margin-bottom: 16rpx;

					.user-top {
						.avatar {
							width: 64rpx;
							height: 64rpx;
							border-radius: 50%;
							overflow: hidden;
							background: #f1f1f1;
						}

						.name {
							margin-left: 8rpx;
						}

						.money {
							margin-left: auto;
							color: #F43434;
						}
					}

					.user-content {
						position: relative;

						.user-group {
							position: relative;

							.item {
								margin-top: 16rpx;

								.label {
									color: #666;
									line-height: 40rpx;
								}

								.value {
									font-weight: 500;
									margin-left: 16rpx;
									line-height: 40rpx;
								}
							}
						}

						.iconfont {
							position: absolute;
							color: #999;
							right: 0rpx;
							top: 50%;
							transform: translateY(-50%);
						}
					}
				}
			}
		}
	}
</style>