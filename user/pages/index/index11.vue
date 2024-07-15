<template>
	<view class="user-index" :style="'background:'+getMainColor()+';'">
		<!-- <uni-load-more :loadingType="1"> -->
		<!--个人信息-->
		<<!-- view class="" style="padding: 0 24rpx;">
			<u-notice-bar type="none" color="#333" bg-color="#fff" font-size="24rpx" :text="'欢迎使用万云商汇系统 如有问题点击在线客服或拨打客服热线4009972'"></u-notice-bar>
		</view> -->
		<view class="user-header" :style="[bgcColor]">
			<view class="user-header-inner" @click="editUserInfo" v-if="detail && detail.user_id">
				<view class="user-info">
					<view class="photo">
						<image :src="detail.avatarUrl" mode="aspectFill"></image>
					</view>
					<view class="info" :style="'color:'+getMainTextColor()+';'">
						<view class="name" style="font-size: 34rpx;">{{ detail.nickName }}</view>
						<view class="company_post" style="font-size: 30rpx;width: 350rpx;"
							v-if="detail.post && detail.company_name">
							{{detail.post}} | {{detail.company_name}}
						</view>
						<view class="tel d-s-c" :style="{color:getTextColorGrey()}">
							<text class="f24">ID:{{ detail.user_id }}</text>
							<text :style="{color:getTextColorGrey()}"
								style="background: linear-gradient(to right,#F2B332,#FFD996);" class="ml20 grade"
								v-if="detail.grade_id > 0">{{ detail.grade.name }}</text>
						</view>
						<!-- <view class="tel d-s-c" v-if="detail.expire_date_day_text && !detail.grade.is_default">
							<text class="f24">{{$nw("到期时间")}}: {{$nw("至")}}
								{{ detail.expire_date_day_text }}</text>
						</view> -->
						<view v-if="code.code_status == 1">{{code.code_desc}}:{{code.user_code}}</view>
					</view>
				</view>
				<view v-if="sign.is_open == 1" class="sign-box d-c-c"
					style="color: #222222; border:0rpx solid #fff; background: linear-gradient(to right,#F2B332,#FFD996);"
					@click.stop="gotoPage('/plus/pages/signin/signin')">
					<text class="icon iconfont icon-libao" style="color: #222222;"></text>
					<text class="ml10">{{$nw("签到有礼")}}</text>
				</view>
			</view>
			<view class="user-header-inner" v-else>
				<view class="user-info">
					<view class="photo">
						<image :src="fileImg('/images/user/touxiang.png')" mode="aspectFill"></image>
					</view>
					<view class="info" style="position: relative;" :style="'color:'+getMainTextColor()+';'">
						<!-- #ifdef MP-WEIXIN -->
						<view class="" @click="autho_login">{{$nw("未登录")}} • {{$nw("请登录")}}
						</view>
						<button style="position: absolute;top:0rpx;left: 0rpx;opacity: 0;" open-type="getUserInfo"
							class="autho_login" @click="autho_login" lang="zh_CN"></button>
						<!-- #endif -->
						<!-- #ifdef H5 -->
						<view class="" @click="autho_login">{{$nw("未登录")}} • {{$nw("请登录")}}
						</view>
						<!-- #endif -->
						<!-- #ifdef APP-PLUS -->
						<view class="" @click="autho_login">{{$nw("未登录")}} • {{$nw("请登录")}}
						</view>
						<!-- #endif -->

					</view>
				</view>
			</view>

			<!--我的订单-->
			<view class="my-order"
				:style="'color:'+getMainTextColor()+';'+'background:'+getSecondBackgroundColor()+';'">
				<view class="group-hd" style="line-height: 60rpx;">
					<view class="left"><text class="min-name">{{$nw("我的订单")}}</text></view>
				</view>
				<view class="d-b-c">
					<view class="item" @click="gotoPage('/main/pages/order/myorder/myorder?dataType=all')">
						<view class="icon-box"><span class="icon iconfont icon-quanbudingdan"
								:style="'color:'+getMainTextColor()+';'"></span></view>
						<text>{{$nw("全部订单")}}</text>
					</view>
					<view class="item" @click="gotoPage('/main/pages/order/myorder/myorder?dataType=payment')">
						<view class="icon-box pr">
							<span class="icon iconfont icon-icon" :style="'color:'+getMainTextColor()+';'"></span>
							<text class="dot d-c-c"
								v-if="orderCount.payment != null && orderCount.payment > 0">{{ orderCount.payment }}</text>
						</view>
						<text>{{$nw("待付款")}}</text>
					</view>
					<view class="item" @click="gotoPage('/main/pages/order/myorder/myorder?dataType=received')">
						<view class="icon-box pr">
							<span class="icon iconfont icon-daishouhuo" :style="'color:'+getMainTextColor()+';'"></span>
							<text class="dot d-c-c"
								v-if="orderCount.received != null && orderCount.received > 0">{{ orderCount.received }}</text>
						</view>
						<text>{{$nw("待收货")}}</text>
					</view>

					<view class="item" @click="gotoPage('/pages/order/refund/index/index')">
						<view class="icon-box pr">
							<span class="icon iconfont icon-tuikuan" :style="'color:'+getMainTextColor()+';'"></span>
							<text class="dot d-c-c"
								v-if="orderCount.refund != null && orderCount.refund > 0">{{ orderCount.refund }}</text>
						</view>
						<text>{{$nw("售后")}}</text>
					</view>

				</view>
			</view>
		</view>

		<!--我的资产-->
		<view class="my-assets d-b-c" :style="'background:'+getSecondBackgroundColor()+';'"
			style="width: 82%; margin-left: 5.5%; border-radius: 15rpx;margin-bottom: 20rpx;box-shadow: 0 0 6rpx 0 rgba(0, 0, 0, 0.1);">
			<view class="list d-a-c flex-1 mr30">
				<view :style="'color:'+getMainTextColor()+';'" class="item d-c-c d-c"
					@click="gotoPage('/user/pages/my-wallet/my-wallet')">
					<view class="fb f30">{{ detail.balance || 0 }}</view>
					<text class="pt10 f24">{{$nws(balance_text)}}</text>
				</view>

				<view :style="'color:'+getMainTextColor()+';'" class="item d-c-c d-c"
					@click="gotoPage('/user/pages/points/points')">
					<view class="fb f30">{{ detail.points || 0 }}</view>
					<text class="pt10 f24">{{$nws(setting.points_name)}}</text>
				</view>
				<view v-if="detail.welfare_status" :style="'color:'+getMainTextColor()+';'" class="item d-c-c d-c"
					@click="gotoPage('/plus2/pages/welfare/log')">
					<view class="fb f30">{{ detail.welfare || 0 }}</view>
					<text class="pt10 f24">{{$nws(detail.welfare_text)}}</text>
				</view>
			</view>

		</view>

		<!--菜单-->
		<view class="menu-wrap" v-if="diymenus == 1&&!menus && !loadding">
			<diy :diyItems="menus"></diy>
		</view>

		<view v-else-if="diymenus == 1 && !loadding" scroll-y="true" class="scroll-Y">
			<diy :diyItems="items" :style="'background:'+getMainColor()+';'"></diy>
		</view>
		<view class="menu-wrap" v-else>
			<!-- <view class="group-hd p-0-20 border-b-e">
					<view class="left">
						<text class="min-name">基础入口</text>
					</view>
				</view> -->
			<view class="group-bd">
				<view :class="'item ' + item.icon + '-box'" v-for="(item, index) in menus" :key="index"
					@click="gotoPage(item.path)">
					<view class="icon-round d-c-c"><text :class="'icon iconfont ' + item.icon"></text></view>
					<text class="name">{{ item.name }}</text>
				</view>
			</view>
		</view>

		<!--邀请有礼-->
		<!-- <view class="invite-box p20" @click="gotoPage('/user/pages/invite/invite')">
				<image src="http://imgh5.y01.cn/20210606232139f37ed9784.jpg" mode="widthFix"></image>
			</view> -->

		<!--推荐-->
		<view class="mt30" v-if="!loadding">
			<recommendProduct v-if="is_recommend" :recommendData="recommendData"></recommendProduct>
		</view>

		<Ad location_id="center_bottom" :interval="1500"></Ad>

		<!-- <view class="friend">
			<text class="text">我的圈子</text>
			<image class="img" src="" mode=""></image>
		</view> -->
		<Tabbar></Tabbar>

		<Autho :loginShow="loginShow" @refresh="refresh" @change_loginShow="change_loginShow"></Autho>

		<service :itemData="t_service"></service>
	</view>
</template>

<script>
	import uniLoadMore from '@/components/uni-load-more.vue'
	import recommendProduct from '@/components/recommendProduct/recommendProduct.vue'
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
			recommendProduct,
			Tabbar,
			Autho,
			service
		},
		data() {
			return {
				list1: [
					'寒雨连江夜入吴',
					'平明送客楚山孤',
					'洛阳亲友如相问',
					'一片冰心在玉壶'
				],
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

			}
		},
		onLoad() {
			this.getLanguage(this)
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			if (this.$refs.loginForm) {
				this.$refs.loginForm.setRules(this.loginRules)
			}
		},
		onShow() {
			// 设置全局颜色
			this.setGlobalColor()

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
		methods: {
			fileImg: utils.fileImg,
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
			/*获取数据*/
			getData() {
				let self = this
				self._post('user.index/detail', {}, function(res) {
					if (res.data.getPhone) {
						uni.navigateTo({
							url: '/pages/login/bindmobile',
						})
						return
					}
					self.detail = res.data.userInfo
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
					console.log(self.recommendData,123456);
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
			/*跳转页面*/
			gotoPage(path) {
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
	/deep/ .u-notice-bar{
		padding: 0;
		// background-color: #ffffff;
		// color: #333333 !important;
		// font-size: 20rpx !important;
	}
	.user-header {
		position: relative;
		background: #e2231a;
	}

	.user-header .user-header-inner {
		position: relative;
		padding: 15rpx 30rpx 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
	}

	.user-header .user-header-inner::after,
	.user-header .user-header-inner::before {
		display: block;
		content: '';
		position: absolute;
		border-radius: 50%;
		z-index: 0;
	}

	.user-header .user-header-inner::after {
		width: 400rpx;
		height: 400rpx;
		right: -100rpx;
		bottom: -200rpx;
		background-image: radial-gradient(90deg, rgba(255, 255, 255, 0.2) 10%, rgba(255, 255, 255, 0));
	}

	.user-header .user-header-inner::before {
		width: 200rpx;
		height: 200rpx;
		left: -60rpx;
		top: -20rpx;
		background-image: radial-gradient(-90deg, rgba(255, 255, 255, 0.2) 10%, rgba(255, 255, 255, 0));
	}

	.user-header .user-info {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.avatar-wrapper .user-avatar,
	.avatar-wrapper .user-avatar image {
		width: 80rpx;
		height: 80rpx;

	}

	.avatar-wrapper {
		background-color: #ffffff;
	}

	.user-header .photo,
	.user-header .photo image {
		width: 160rpx;
		height: 160rpx;
		border-radius: 8rpx;
	}



	.user-header .info {
		padding-left: 20rpx;
		box-sizing: border-box;
		overflow: hidden;
		color: #ffffff;
	}

	.user-header .info .name {
		font-weight: bold;
		font-size: 30rpx;
	}

	.user-header .info .tel {
		font-size: 26rpx;
	}

	.user-header .info .grade {
		display: block;
		padding: 0 16rpx;
		height: 40rpx;
		line-height: 36rpx;
		border-radius: 20rpx;
		background: rgba(0, 0, 0, 0.2);
		color: #ffc670;
	}

	.user-header .sign-box {
		position: absolute;
		right: 20rpx;
		padding: 0 10rpx;
		height: 50rpx;
		bottom: 100rpx;
		border-radius: 25rpx;
		font-size: 24rpx;
		color: #ffe300;
		z-index: 10;
	}

	.user-header .sign-box .iconfont {
		color: #ffe300;
	}

	.user-header .my-order {
		position: absolute;
		padding: 0 30rpx;

		right: 30rpx;
		bottom: -165rpx;
		left: 30rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		box-shadow: 0 0 6rpx 0 rgba(0, 0, 0, 0.1);
		background: #ffffff;
		z-index: 10;
	}

	.my-order .item {
		display: flex;
		padding: 20rpx 0;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
	}

	.my-order .icon-box,
	.my-assets .icon-box {
		width: 60rpx;
		height: 60rpx;
	}

	.my-order .icon-box .iconfont,
	.my-assets .icon-box .iconfont {
		font-size: 50rpx;
		color: #333333;
	}

	.my-order .icon-box .dot {
		position: absolute;
		top: 0;
		left: 30rpx;
		height: 30rpx;
		min-width: 30rpx;
		padding: 4rpx;
		border-radius: 20rpx;
		font-size: 20rpx;
		background: #f00808;
		color: #ffffff;
	}

	.my-assets {
		margin-top: 180rpx;
		padding: 30rpx;
		padding-top: 15rpx;
		padding-bottom: 15rpx;
		background: #ffffff;
	}

	.my-wallet {
		position: relative;
		width: 200rpx;
		border-left: 1px solid #dddddd;
	}

	.my-wallet::after {
		position: absolute;
		display: block;
		content: '';
		left: 0;
		border: 8rpx solid transparent;
		border-left-color: #dddddd;
	}

	.menu-wrap {
		margin-top: 30rpx;
		background: #ffffff;
	}

	.menu-wrap .group-bd {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.menu-wrap .item {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 190rpx;
		height: 150rpx;
		font-size: 24rpx;
	}

	.menu-wrap .item.icon-dizhi1-box .icon-round {
		background-image: linear-gradient(135deg, #67b4e2 10%, #356dce 70%, #5c8fe8 90%);
	}

	.menu-wrap .item.icon-youhuiquan1-box .icon-round {
		background-image: linear-gradient(135deg, #e87ea4 10%, #ff268a 70%, #fe0d76 90%);
	}

	.menu-wrap .item.icon-youhuiquan--box .icon-round {
		background-image: linear-gradient(135deg, #ff5a30 10%, #ff2b3c 70%, #ff1740 90%);
	}

	.menu-wrap .item.icon-fenxiao1-box .icon-round {
		background-image: linear-gradient(135deg, #7ceeba 10%, #1ed2b7 70%, #17c0ad 90%);
	}

	.menu-wrap .item.icon-kanjia-box .icon-round {
		background-image: linear-gradient(135deg, #f2a904 10%, #f27d04 70%, #eaa031 90%);
	}

	.menu-wrap .icon-round {
		width: 60rpx;
		height: 60rpx;
		background: red;
		border-radius: 50%;
		color: #ffffff;
	}

	.menu-wrap .item .iconfont {
		font-size: 40rpx;
		color: #ffffff;
	}

	.menu-wrap .item .name {
		margin-top: 10rpx;
	}

	.friend {
		margin-top: 30rpx;
		background: #ffffff;
	}

	.friend .text {
		margin-top: 22rpx;
		margin-left: 30rpx;
		font-size: 32rpx;
	}

	.friend .img {
		margin-top: 12rpx;
		margin-left: 30rpx;
		width: 690rpx;
		height: 220rpx;
		background: #000000;
	}


	.company_post {
		display: block;
		line-height: 60rpx;

		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;

	}
</style>