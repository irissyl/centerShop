<template>
	<view class="user-index-wrap" :style="'height:calc('+wrapHigh+'px - env(safe-area-inset-bottom) / 2)'">
		<scroll-view scroll-y="true" class="user-index scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
			lower-threshold="50" @scrolltolower="scrolltolowerFunc" refresher-enabled :refresher-triggered="triggered"
			@refresherpulling="onPulling" @refresherrefresh="onRefresh" @refresherrestore="onRestore"
			@refresherabort="onAbort">
			<view class="user-index-content">
				<!-- <view>
				<u-notice-bar type="none" color="#333" bg-color="#fff" font-size="24rpx"
					:text="'欢迎使用万云商汇系统 如有问题点击在线客服或拨打客服热线4009972'"></u-notice-bar>
			</view> -->
				<view class="user-header" v-if="is_user_id" @click="gotoPage('/user/pages/set/set')">
					<view class="user-info">
						<img v-if="detail.avatarUrl" :src="detail.avatarUrl" />
						<img v-else src="https://shanghui.client.xcx008.com/file/images/avatar.png" />
						<view class="">
							<view class="user-info-name">
								{{ detail.nickName || '--' }}
							</view>
							<view class="user-info-1">
								<view class="user-info-id">
									ID:{{detail.user_id || '--'}}
								</view>
								<view class="user-info-leve">
									{{detail.grade.name || ''}}
								</view>
							</view>
						</view>
					</view>
					<view v-if="detail.supply" class="shop-btn flex-c" @click.stop="toShop">
						<view class="icon">
							<image class="common-img"
								src="https://shanghui.client.xcx008.com/file/uploads/20240701/9abce08f6a9d3e7a9d026762ab6f523f.png"
								mode="aspectFill"></image>
						</view>
						商家中心
					</view>
					<u-icon v-else name="arrow-right" size="20" color="#979797"></u-icon>
				</view>
				<view class="user-header" v-else @click="toPage">
					<view class="user-info">
						<img src="https://img2.baidu.com/it/u=2539872750,2513176690&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=500"
							alt="" />
						<view class="">
							<view class="user-info-name" style="font-weight: 400;">
								{{$nw('登录')}}/{{$nw('注册')}}
							</view>

						</view>
					</view>
					<u-icon name="arrow-right" size="20" color="#979797"></u-icon>
				</view>
				<view class="jf">
					<view v-if="is_user_id" class="jf-1">
						<text class="js1">{{$nw('积分')}}</text>
						<text class="js2">{{detail.points}}</text>
						<text class="js3">{{$nw('余额')}}</text>
						<text class="js4" style="margin: 0;">{{detail.balance}}</text>
					</view>

					<view v-else class="jf-1">
						<text class="js1">{{$nw('积分')}}</text>
						<text class="js2" style="font-size: 28rpx;color: #999;">{{$nw('暂无数据')}}</text>
						<text class="js3">{{$nw('余额')}}</text>
						<text class="js4" style="font-size: 28rpx;color: #999;">{{$nw('暂无数据')}}</text>
					</view>

					<view class="jf-3 flex-c" @click.stop="gotoPage('/plus/pages/signin/signin')">
						<view class="jf-icon">
							<image class="common-img" src="@/static/img/libao.png" mode="aspectFill"></image>
						</view>
						<view class="jf-label">{{$nw('签到有礼')}}</view>
					</view>
				</view>
				<view class="promotion-card flex-c">
					<view class="promotion-item flex-c" @click="gotoPage('/main/pages/agent/index/index')">
						<view class="promotion-icon">
							<image class="common-img"
								src="https://shanghui.client.xcx008.com/file/uploads/20240612/d54583956063b81f5ba128e4ac8b686c.png"
								mode="aspectFill"></image>
						</view>
						<view class="promotion-group">
							<view class="label">
								{{$nw('分享推广')}}
							</view>
							<view class="tips">
								{{$nw('分享好友获取收益')}}
							</view>
						</view>
					</view>
					<view class="promotion-item flex-c" @click="gotoPage('/plus/pages/points/list/list')">
						<view class="promotion-icon">
							<image class="common-img"
								src="https://shanghui.client.xcx008.com/file/uploads/20240611/68f656a95b727358620ed885569f21a2.png"
								mode="aspectFill"></image>
						</view>
						<view class="promotion-group">
							<view class="label">
								{{$nw('积分兑换')}}
							</view>
							<view class="tips">
								{{$nw('获取积分兑换好礼')}}
							</view>
						</view>
					</view>
				</view>
				<view class="my-order">
					<view class="my-order-top">
						<view class="my-order-l">
							{{$nw('我的订单')}}
						</view>
						<view class="my-order-r" @click="gotoPage('/main/pages/order/myorder/myorder?dataType=all')">
							<text>{{$nw('全部')}}</text>
							<u-icon name="arrow-right" size="12" color="#999"
								style="margin-left: 6upx;margin-top: 3upx;"></u-icon>
						</view>
					</view>
					<view class="zhon">
						<view class="zhon1" @click="gotoPage('/main/pages/order/myorder/myorder?dataType=payment')">
							<image src="@/static/img/u1.png" mode=""></image>
							<text>{{$nw('待付款')}}</text>
						</view>
						<view class="zhon1" @click="gotoPage('/main/pages/order/myorder/myorder?dataType=received')">
							<image src="@/static/img/u2.png" mode=""></image>
							<text>{{$nw('待收货')}}</text>
						</view>
						<view class="zhon1">
							<image src="@/static/img/u3.png" mode=""></image>
							<text>{{$nw('待评价')}}</text>
						</view>
						<view class="zhon1" @click="gotoPage('/main/pages/order/myorder/myorder?dataType=shouhou')">
							<image src="@/static/img/u4.png"></image>
							<text>{{$nw('售后')}}</text>
						</view>
					</view>
				</view>

				<view class="fb">
					<view class="fb-l flex-c" @click="gotoPage('/plus2/pages/project/addProject')">
						<view class="icon">
							<image class="common-img" src="@/static/img/u5.png" mode=""></image>
						</view>
						<view class="label">
							{{$nw('发布项目')}}
						</view>
					</view>
					<view class="fb-r flex-c" @click="gotoPage('/plus2/pages/project/myproject')">
						<view class="icon">
							<image class="common-img" src="@/static/img/u6.png" mode=""></image>
						</view>
						<view class="label">
							{{$nw('我的项目')}}
						</view>
					</view>
				</view>
				<view class="gn">
					<view class="gn1 dbb" @click="gotoPage('/main/pages/JoiningTheMembership/JoiningTheMembership')">
						<view class="dc">
							<image class="dc_icon" src="@/static/img/u13.png" mode=""></image>
							<text>{{$nw('企业入驻')}}</text>
						</view>
						<u-icon name="arrow-right" size="18" color="#666"></u-icon>
					</view>
					<!-- <view class="gn1 dbb" @click="gotoPage('/main/pages/MerchantSettlement/MerchantSettlement')">
						<view class="dc">
							<image class="dc_icon" src="@/static/img/u14.png" mode=""></image>
							<text>{{$nw('商会入驻')}}</text>
						</view>
						<u-icon name="arrow-right" size="18" color="#666"></u-icon>
					</view> -->
					<view class="gn1 dbb" @click="gotoPage('/user/pages/address/address')">
						<view class="dc">
							<image class="dc_icon" src="@/static/img/u7.png" mode=""></image>
							<text>{{$nw('收货地址')}}</text>
						</view>
						<u-icon name="arrow-right" size="18" color="#666"></u-icon>
					</view>
					<!-- <view class="gn1 dbb" @click="gotoPage('/plus/pages/points/list/list')">
				<view class="dc">
					<image class="dc_icon" src="@/static/img/u9.png" mode=""></image>
					<text>{{$nw('积分兑换')}}</text>
				</view>
				<u-icon name="arrow-right" size="18" color="#666"></u-icon>
			</view> -->
					<!-- <view class="gn1 dbb" @click="gotoPage('/main/pages/networkResources/networkResources')">
						<view class="dc">
							<image class="dc_icon" src="@/static/img/u15.png" mode=""></image>
							<text>{{$nw('人脉资源')}}</text>
						</view>
						<u-icon name="arrow-right" size="18" color="#666"></u-icon>
					</view> -->
					<!-- <view class="gn1 dbb" @click="gotoPage('/main/pages/talentIntroduction/talentIntroduction')">
						<view class="dc">
							<image class="dc_icon" src="@/static/img/u16.png" mode=""></image>
							<text>{{$nw('人才引进')}}</text>
						</view>
						<u-icon name="arrow-right" size="18" color="#666"></u-icon>
					</view> -->
					<!-- <view class="gn1 dbb" @click="gotoPage('/plus2/pages/video/index/index')">
				<view class="dc">
					<image class="dc_icon" src="@/static/img/u17.png" mode=""></image>
					<text>{{$nw('宣传视频')}}</text>
				</view>
				<u-icon name="arrow-right" size="18" color="#666"></u-icon>
			</view> -->
					<!-- <view class="gn1 dbb" @click="gotoPage('/main/pages/agent/index/index')">
					<view class="dc">
						<image class="dc_icon" src="@/static/img/u8.png" mode=""></image>
						<text>{{$nw('分享推广')}}</text>
					</view>
					<u-icon name="arrow-right" size="18" color="#666"></u-icon>
				</view> -->
					<!-- <view class="gn1 dbb" @click="gotoPage('公司官网')">
				<view class="dc">
					<image class="dc_icon" src="@/static/img/u12.png" mode=""></image>
					<text>{{$nw('公司官网')}}</text>
				</view>
				<u-icon name="arrow-right" size="18" color="#666"></u-icon>
			</view> -->
					<!-- <view class="gn1 dbb" @click="gotoPage('')">
				<view class="dc">
					<image class="dc_icon" src="@/static/img/u10.png" mode=""></image>
					<text>{{$nw('法中人才交流')}}</text>
				</view>
				<u-icon name="arrow-right" size="18" color="#666"></u-icon>
			</view> -->
					<view class="gn1 dbb" @click="gotoPage('/user/pages/set/set')">
						<view class="dc">
							<image class="dc_icon" src="@/static/img/u11.png" mode=""></image>
							<text>{{$nw('设置')}}</text>
						</view>
						<u-icon name="arrow-right" size="18" color="#666"></u-icon>
					</view>
				</view>
				<!-- <recommendProduct :itemData="recommendData"></recommendProduct> -->
				<!-- 为你推荐 -->
				<RecommendProduct ref="RecommendProductRef" isUser='1' />
			</view>
		</scroll-view>
		<u-toast ref="uToast" />
		<Tabbar></Tabbar>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more.vue'
	// import recommendProduct from '@/components/recommendProduct/recommendProduct.vue'
	import RecommendProduct from '@/components/RecommendProduct.vue'
	import Tabbar from '@/components/tabbar/tabbar.vue'
	import utils from '../../../common/utils'
	import Autho from '@/components/autho/autho.vue';
	import config from '@/config.js'
	import Ad from '@/components/ad/ad.vue';
	import service from '@/components/diy/service/service';
	export default {
		components: {
			Ad,
			uniLoadMore,
			// recommendProduct,
			RecommendProduct,
			Tabbar,
			Autho,
			service,
		},
		data() {
			return {
				scrollviewHigh: 0,
				wrapHigh: 0,
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				is_user_id: uni.getStorageSync("user_id"),
				/*是否推荐*/
				is_recommend: false,
				/*推荐数据*/
				recommendData: {},
				/*签到数据*/
				sign: {},
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				Clsit: 0,
				/*菜单*/
				menus: [],
				detail: {
					balance: 0,
					points: 0,
					grade: {
						name: '',
					},
				},
				orderCount: {},
				coupon: 0,
				setting: {},
				diymenus: 0,
				// 编码
				code: {
					code_status: 0,
					code_code_desc: '',
					user_code: '',
				},
				items: [],
				balance_text: this.getAppinfo().balance_text,
				loginShow: false,

				loginRules: {
					avatarUrl: [{
						type: 'string',
						required: true,
						message: this.$nw("请上传头像"),
						trigger: ['blur', 'change']
					}],
					nickName: [{
						type: 'string',
						required: true,
						message: this.$nw("请填写昵称"),
						trigger: ['blur', 'change']
					}],
					mobile: [{
						type: 'string',
						required: true,
						message: this.$nw("请授权电话号码"),
						trigger: ['blur', 'change']
					}],
				},
				mobile: this.$nw("获取手机号码"),
				triggered: false
			}
		},
		computed: {
			active() {
				return Object.assign(this.setBackgroundColor(), this.setColor())
			},
			bgcColor() {
				return this.setBackgroundColor()
			},

			textColor() {
				return flag => {
					flag = !!flag
					return this.setColor(flag)
				}
			},
			textColor2() {
				return Object.assign(this.setColor(), {
					border: '1px solid ' + this.getTextColor(),
				})
			},
		},
		onLoad() {
			this.getLanguage(this)
			let _this = this
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
					_this.wrapHigh = res.windowHeight - 57
				}
			});
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			if (this.$refs.loginForm) {
				this.$refs.loginForm.setRules(this.loginRules)
			}
		},
		onShow() {
			this.is_user_id = uni.getStorageSync("user_id")
			this._get('plus.coc.Coc/getCocByUserId', {
				user_id: this.is_user_id
			}, (e) => {
				console.log(e, 1111);
				this.Clsit = e.data.list.length
			})
			// 设置全局颜色
			this.setGlobalColor({
				bgc: '#EBF5FF'
			})
			uni.showLoading({
				title: this.$nw('加载中'),
			})
			this.init()
			/*获取个人中心数据*/
			this.getData()
			uni.setNavigationBarTitle({
				title: this.$nw('个人中心'),
			})
		},
		onShareAppMessage() {},
		onShareTimeline() {},
		// mounted() {
		// 	this._get('plus.coc.Coc/getCocByUserId', {
		// 		user_id: this.is_user_id
		// 	}, (e) => {
		// 		console.log(e, 1111);
		// 		this.Clsit = e.data.list.length
		// 	})
		// },
		// onPullDownRefresh() {
		// 	console.log('执行下拉刷新');
		// 	setTimeout(() => {
		// 		uni.stopPullDownRefresh()
		// 	}, 2000)
		// },
		methods: {
			fileImg: utils.fileImg,
			onPulling() {
				console.log('onPulling--->');
			},
			onRefresh() {
				console.log('onRefresh--->');
				this.triggered = true
				this.getData()
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
			TIAOZHUAN() {
				uni.navigateTo({
					url: "/main/pages/login/loginCode"
				})
			},
			change_loginShow(e) {
				console.log("??")
				// #ifdef MP-WEIXIN
				this.loginShow = e
				// #endif
			},
			refresh() {
				this.getData()
			},
			/*初始化*/
			init() {
				let _this = this
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight
					},
				})
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
				this.$refs.RecommendProductRef.scrolltolowerFunc()
			},
			/*获取数据*/
			getData() {
				let self = this
				self._post('user.index/detail', {}, (res) => {
					console.log(res, 11112233);
					if (res.data.getPhone) {
						uni.navigateTo({
							url: '/pages/login/bindmobile',
						})
						return
					}
					self.detail = res.data.userInfo
					uni.setStorageSync('userInfo', res.data.userInfo)
					var isA = utils.isNick_Avatar(self, self.detail); //1  正常  -1 没昵称  -2 没头像
					if (isA != 1) {
						// #ifdef MP-WEIXIN
						self.change_loginShow(true)
						// #endif
						// #ifdef H5
						if (isA == -1) {
							uni.navigateTo({ //跳转修改昵称
								url: "/user/pages/user/info?data=&type=1"
							})

						} else if (isA == -2) {
							uni.navigateTo({ //跳转修复头像
								url: "/user/pages/user/edit"
							})

						} else if (isA == -3) {
							uni.navigateTo({ //跳转设置手机号
								url: "pages/login/bindmobile"
							})


						}
						// #endif
					}
					self.is_recommend = res.data.is_recommend
					self.recommendData = res.data.recommendData
					console.log(res.data, 999999999);
					self.sign = res.data.sign
					self.coupon = res.data.coupon
					self.orderCount = res.data.orderCount
					self.menus = res.data.menus
					self.setting = res.data.setting
					self.diymenus = res.data.diymenus
					self.loadding = false
					self.code = res.data.code_info
					self.balance_text = self.getAppinfo().balance_text
					self.items = res.data.items.items
					self.pagesetting = res.data.items.page
					uni.hideLoading()
				}, null, () => {
					setTimeout(() => {
						this.triggered = false
					}, 1000)
				})
			},

			editUserInfo() {
				var self = this;
				var isA = utils.isNick_Avatar(self, self.detail); //1  正常  -1 没昵称  -2 没头像
				// #ifdef MP-WEIXIN
				if (isA == 1) {
					uni.navigateTo({
						url: '/user/pages/user/edit',
					})
				} else {
					// #ifdef MP-WEIXIN
					self.change_loginShow(true)
					// #endif
				}
				// #endif

				// #ifdef H5
				uni.navigateTo({
					url: "/user/pages/user/edit"
				})
				// #endif

				// #ifdef APP
				uni.navigateTo({
					url: "/user/pages/user/edit"
				})
				// #endif

			},
			toShop() {
				uni.navigateTo({
					url: "/plus/pages/shop/index"
				})
			},
			/*跳转页面*/
			gotoPage(path) {
				if (path == '公司官网') {
					// this.gotoPage('https://www.wsyhkj.com')
					return
				}
				if (path == '/plus2/pages/project/addProject' && !this.Clsit) {
					this.$refs.uToast.show({
						title: '请先公司入会',
						type: 'warning',
					})
					// uni.showToast({
					// 	title: '请先公司入会',
					// 	duration: 2000,
					// 	icon: "none"
					// })
					return
				}
				let self = this
				self._get('user.index/detail', {}, function(res) {
					let userInfo = res.data.userInfo
					var isA = utils.isNick_Avatar(self, userInfo); //1  正常  -1 没昵称  -2 没头像
					if (isA == 1) {
						uni.navigateTo({
							url: path,
						})
					} else {
						// #ifdef MP-WEIXIN
						self.change_loginShow(true)
						// #endif
						// #ifdef H5
						if (isA == -1) {
							uni.navigateTo({ //跳转修改昵称
								url: "/user/pages/user/info?data=&type=1"
							})
						} else if (isA == -2) {
							uni.navigateTo({ //跳转修复头像
								url: "/user/pages/user/edit"
							})
						} else if (isA == -3) {
							uni.navigateTo({ //跳转设置手机号
								url: "pages/login/bindmobile"
							})

						}
						// #endif
						// #ifdef APP
						if (isA == -1) {
							uni.navigateTo({ //跳转修改昵称
								url: "/user/pages/user/info?data=&type=1"
							})
						} else if (isA == -2) {
							uni.navigateTo({ //跳转修复头像
								url: "/user/pages/user/edit"
							})
						} else if (isA == -3) {
							uni.navigateTo({ //跳转设置手机号
								url: "pages/login/bindmobile"
							})

						}
						// #endif
					}
				})
			},
			/* 
				跳转登陆界面 
			 */
			autho_login() {
				let self = this;
				// #ifdef MP-WEIXIN 
				//判断是否开启授权登录

				uni.navigateTo({
					url: "/main/pages/login/auth_login"
				})
				// #endif

				// #ifndef MP-WEIXIN
				self.login("/user/pages/index/index", [])
				// #endif

				// #ifdef APP-PLUS
				self.login("/user/pages/index/index", [])
				// #endif



			},

		},
	}
</script>

<style lang="scss">
	.user-index-wrap {
		overflow: hidden;
	}

	.user-index {
		background: #F4F7FB;
		position: relative;

		&::before {
			content: '';
			width: 100%;
			height: 320rpx;
			background: linear-gradient(180deg, #EBF5FF 0%, rgba(225, 238, 250, 0) 100%);
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}

		.user-index-content {
			position: relative;
			padding: 0 24rpx;
			padding-bottom: calc(68px + env(safe-area-inset-bottom) / 2);
		}

		.promotion-card {
			height: 132rpx;
			border-radius: 16rpx;
			margin-top: 24rpx;
			padding: 22rpx 0;
			background: url('https://shanghui.client.xcx008.com/file/uploads/20240611/c16c4094e4b4e7887f51866b08f78313.png') no-repeat;
			background-position: center;
			background-size: cover;
			background-color: #fff;
			position: relative;

			.promotion-item {
				width: 50%;
				padding: 0 32rpx;
				position: relative;

				.promotion-icon {
					width: 88rpx;
					height: 88rpx;
				}

				.promotion-group {
					margin-left: 16rpx;

					.label {
						color: #333;
					}

					.tips {
						font-size: 20rpx;
						color: #999;
					}
				}
			}

			&::before {
				content: '';
				width: 2rpx;
				height: 64rpx;
				background: #ECECEC;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				z-index: 0;
			}
		}
	}

	.gn {
		// width: 702rpx;
		// height: 384rpx;
		background: #FFFFFF;
		margin-top: 16rpx;
		border-radius: 16rpx;
		padding: 24rpx;

		.gn1 {
			margin-bottom: 24rpx;

			&:last-of-type {
				margin-bottom: 0;
			}

			img {
				width: 48rpx;
				height: 48rpx;
				margin-right: 24rpx;
			}

			.dc_icon {
				width: 48rpx;
				height: 48rpx;
				margin-right: 24rpx;
			}

			text {
				color: #333333;
				font-size: 28rpx;
			}
		}
	}

	.fb {
		display: flex;
		justify-content: space-between;
		margin-top: 16rpx;

		.fb-l,
		.fb-r {
			width: 346rpx;
			height: 112rpx;
			background: #FFFFFF;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			display: flex;
			align-items: center;
			padding: 24rpx;

			.icon {
				width: 64rpx;
				height: 64rpx;
				margin-right: 16rpx;
			}

			.label {
				color: #333333;
				font-size: 28rpx;
				font-weight: 400;
			}
		}

	}

	.zhon {
		.zhon1 {
			width: 25%;
			text-align: center;
		}

		display: flex;
		align-content: center;
		justify-content: space-between;
		margin-top: 28rpx;

		img,
		image {
			width: 64rpx;
			height: 64rpx;
			margin: 0 auto;
		}

		text {
			font-size: 24rpx;
			color: #333333;
			display: block;
		}
	}

	.my-order-top {
		.my-order-r {
			color: #999999;
			font-size: 20rpx;
			display: flex;
			align-content: center;
		}

		.my-order-l {
			font-size: 32rpx;
			color: #333333;
			font-weight: 800;
		}

		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.my-order {
		padding: 24rpx 32rpx;
		height: 248rpx;
		background: #FFFFFF;
		border-radius: 16rpx;
		margin-top: 16rpx;
	}

	.jf {
		display: flex;
		align-items: center;
		justify-content: space-between;

		.jf-3 {
			height: 44rpx;
			background: linear-gradient(90deg, #1B94E0 0%, #1B94E0 100%);
			color: #FFFFFF;
			padding: 0 16rpx;
			border-radius: 999px;
			justify-content: center;

			.jf-icon {
				width: 24rpx;
				height: 24rpx;
			}

			.jf-label {
				font-size: 20rpx;
				color: #fff;
				line-height: 1;
				margin-left: 6rpx;
			}

			// img,
			// image {
			// 	width: 34rpx;
			// 	height: 34rpx;
			// 	margin-right: 10rpx;
			// }

			// text {
			// 	font-size: 24rpx;
			// }
		}

		.jf-1 {

			.js1,
			.js3 {
				font-size: 28rpx;
				color: #666666;
				margin-right: 24rpx;
				line-height: 1;
			}

			.js2,
			.js4 {
				font-size: 48rpx;
				color: #333;
				margin-right: 70rpx;
				line-height: 1;
			}
		}
	}

	.user-header {
		display: flex;
		justify-content: space-between;
		align-items: center;

		.user-info {
			display: flex;
			margin: 32rpx 0 40rpx;
			align-items: center;

			img {
				width: 112rpx;
				height: 112rpx;
				border-radius: 16rpx 16rpx 16rpx 16rpx;
				margin-right: 16rpx;
				// background: #cdcdcd;
			}

			.user-info-name {
				font-weight: 600;
				font-size: 32rpx;
				color: #434343;
				margin-bottom: 8rpx;
			}

			.user-info-1 {
				.user-info-id {
					margin-right: 16rpx;
					font-size: 20rpx;
					color: #979797;
				}

				.user-info-leve {
					font-size: 20rpx;
					color: #FFFFFF;
					background: linear-gradient(90deg, #FFD15B 0%, #E3AB1A 100%);
					padding: 0 10rpx;
					border-radius: 18rpx;
				}

				display: flex;
			}
		}

		.shop-btn {
			margin-left: auto;
			width: 192rpx;
			height: 64rpx;
			background: linear-gradient(270deg, #DCF1FF 0%, #B7E3FF 100%);
			border-radius: 999px;
			justify-content: center;
			color: #00588F;

			.icon {
				width: 48rpx;
				height: 48rpx;
				margin-right: 4rpx;
			}
		}
	}

	/deep/ .u-notice-bar {
		padding: 0 !important;
	}
</style>