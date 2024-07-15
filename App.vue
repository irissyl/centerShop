<script>
	import utils from './common/utils.js';
	import config from './config.js';
	import {
		mapActions
	} from 'vuex'
	export default {
		onLaunch: function(e) {
			console.log('App Launch');
			//#ifdef MP-WEIXIN
			//检查更新
			this.updateManager();
			wx.login();
			//#endif
			//应用启动参数
			this.onStartupScene(e.query);

			this.getSystemInfo();
			// // 绑定上级
			// this.bindReferee();
			// 获取底部菜单
			this.getTabbar();
			// 获取后台接口风格
			this.getColor();
			//获取应用信息
			this.getAppinfo();
			//防止字体被篡改
			utils.prohibitFont();

		},
		onShow: function() {
			// 绑定上级
			// this.bindReferee();
		},
		onHide: function() {
			//console.log('App Hide')
		},
		onPullDownRefresh: function() {
			this.getTabbar();
		},
		methods: {
			...mapActions(['setTitleBackgroundColor', 'setTitleTextColor', 'setMainTitleTextColor',
				'setSecondBackgroundColor','setMainGreyTextColor',
				'setMainWhiteTextColor',
				'setTabbarSelectColor',
				'setTabbarColor',
				 'setIsDefault', 'setIsReverseColor',
				'setReverseColor', 'setTabbBar', 'setButtonOne', 'setButtonTwo', 'setButtonThree', 'setButtonOneColor',
				'setButtonTwoColor', 'setButtonThreeColor'
			]),
			updateManager: function() {
				const updateManager = uni.getUpdateManager();
				updateManager.onCheckForUpdate(function(res) {
					// 请求完新版本信息的回调
					if (res.hasUpdate) {
						updateManager.onUpdateReady(function(res2) {
							uni.showModal({
								title: '更新提示',
								content: '新版本已经准备好，即将重启应用',
								showCancel: false,
								success(res2) {
									if (res2.confirm) {
										// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
										updateManager.applyUpdate();
									}
								}
							});
						});
					}
				});

				updateManager.onUpdateFailed(function(res) {
					// 新的版本下载失败
					uni.showModal({
						title: '更新提示',
						content: '检查到有新版本，但下载失败，请检查网络设置',
						showCancel: false
					});
				});
			},
			/**
			 * 小程序启动场景
			 */
			onStartupScene(query) {
				// 获取场景值
				let scene = utils.getSceneData(query);
				// 记录推荐人id
				let refereeId = query.referee_id;
				if (refereeId > 0) {
					//if (!uni.getStorageSync('referee_id')) {
					uni.setStorageSync('referee_id', refereeId);
					//}
				}

				//记录当前名片id
				let cardId = query.card_id;
				uni.setStorageSync('card_id', cardId);

				// 记录分销人id
				let uid = scene.uid;
				if (uid > 0) {
					uni.setStorageSync('referee_id', uid);
				}
			},

			/* 获取底部菜单 */
			getTabbar: function() {
				return
				let websiteUrl = config.app_url;
				let app_id = config.app_id;
				let data = {};
				data.token = uni.getStorageSync('token') || '';
				data.app_id = app_id;
				data.port_id = config.port_id
				uni.request({
					url: websiteUrl + '/index.php/api/index/tabbar',
					data: data,
					dataType: 'json',
					method: 'GET',
					success: (res) => {
						if (res.data.code == 1 && res.data.data.tabbar[0] != undefined) {
							uni.setStorageSync('tabbar', res.data.data.tabbar[0])
							// this.$store.commit("setTabbBar",res.data.data.tabbar[0])
							this.setTabbBar(res.data.data.tabbar[0])
							uni.setStorageSync('t_service',res.data.data.t_service)
						}
					},
					fail: (res) => {
						console.log(res);
					},
					complete: (res) => {
						uni.hideLoading();

					},
				})

			},
			/* 获取系统信息 */
			getSystemInfo() {
				uni.getSystemInfo({
					success: function(e) {
						if (e) {
							let platform = e.platform,
								model = e.model;
							uni.setStorageSync('platform', platform); -
							1 != model.search("iPhone X") && (uni.setStorageSync('isIphoneX', !0));
						}
					}
				});
			},
			/* 绑定上级 */
			// bindReferee(){
			// 	//推荐人
			// 	let referee_id =  uni.getStorageSync('referee_id');
			// 	//当前用户
			// 	let user_id = uni.getStorageSync('user_id');
			// 	let token = uni.getStorageSync('token');
			// 	//console.log(referee_id,user_id,token)
			// 	if(!referee_id||!user_id||!token){
			// 		return false;
			// 	}
			// 	let websiteUrl = config.app_url;
			// 	let app_id = config.app_id;
			// 	let data = {};

			// 	data.referee_id = referee_id;
			// 	data.user_id = user_id;
			// 	data.token = token || '';
			// 	data.app_id = app_id;

			// 	uni.request({
			// 		url: websiteUrl + '/index.php/api/index/bindreferee',
			// 		data: data,
			// 		dataType: 'json',
			// 		method: 'GET',
			// 		success: (res) => {
			// 			if(res.data.code==1){
			// 				console.log(res);
			// 			}
			// 		},
			// 		fail: (res) => {
			// 			console.log(res);
			// 		},
			// 		complete: (res) => {
			// 			uni.hideLoading();

			// 		},
			// 	})

			// },
			gotoErrorPage(text = null) {
				uni.redirectTo({
					url: '/main/pages/error/error?text=' + text
				})
			},
			getAppinfo() {
				let websiteUrl = config.app_url;
				let app_id = config.app_id;
				let data = {};
				data.app_id = app_id;
				let platform = 'wx';
				// #ifdef  H5
				var ua = navigator.userAgent.toLowerCase();
				if (ua.match(/MicroMessenger/i) == "micromessenger") {
					platform = 'mp';
				} else {
					platform = 'h5';
				}
				// #endif
				data.platform = platform;
				uni.request({
					url: websiteUrl + '/index.php/api/index/getAppInfo',
					dataType: 'json',
					data: data,
					method: 'GET',
					success: (res) => {
						if (res.data.code == 1) {
							var close_site = res.data.data.appinfo.close_site;
							var text = res.data.data.appinfo.close_msg;
							uni.setStorageSync('appinfo', res.data.data.appinfo);
							if (close_site) {
								this.gotoErrorPage(text);
							}
						}
					},
					fail: (res) => {
						console.log(res);
					},
					complete: (res) => {
						uni.hideLoading();

					},
				})




			},

			/**
			 * 获取后台配置风格
			 */
			async getColor() {
				let websiteUrl = config.app_url;
				let app_id = config.app_id;
				let data = {};
				data.app_id = app_id;
				await uni.request({
					url: websiteUrl + '/index.php/api/page.globalStyle/getGlobalStyle',
					dataType: 'json',
					data: data,
					method: 'GET',
					success: (res) => {
						if (res.data.code === 1) {
							if (res.data.data.globalStyle) {
								let titleBackgroundColor = res.data.data.globalStyle.content
									.titleBackgroundColor
								let titleTextColor = res.data.data.globalStyle.content.titleTextColor
								let mainTitleTextColor = res.data.data.globalStyle.content
									.mainTitleTextColor
								let secondBackgroundColor = res.data.data.globalStyle.content
									.secondBackgroundColor
								let mainGreyTextColor = 	res.data.data.globalStyle.content
									.mainGreyTextColor
									let mainWhiteTextColor = 	res.data.data.globalStyle.content
										.mainWhiteTextColor
								let tabbarSelectColor = 	res.data.data.globalStyle.content
									.tabbarSelectColor	
									let tabbarColor = 	res.data.data.globalStyle.content
										.tabbarColor	
								let buttonOne = res.data.data.globalStyle.content.buttonOne
								let buttonTwo = res.data.data.globalStyle.content.buttonTwo
								let buttonThree = res.data.data.globalStyle.content.buttonThree
								let buttonOneColor = res.data.data.globalStyle.content.buttonOneColor
								let buttonTwoColor = res.data.data.globalStyle.content.buttonTwoColor
								let buttonThreeColor = res.data.data.globalStyle.content.buttonThreeColor
								// setIsReverseColor
								let isReverseColor = res.data.data.globalStyle.content.isReverseColor
								//设置主颜色

								// // #ifdef H5
								// document.documentElement.style.setProperty('--titleBackgroundColor',
								// 	titleBackgroundColor);
								// document.documentElement.style.setProperty('--mainTitleTextColor',
								// 	mainTitleTextColor);
								// document.documentElement.style.setProperty('--secondBackgroundColor',
								// 	secondBackgroundColor);
								// // #endif


								this.setTitleBackgroundColor(titleBackgroundColor)
								this.setButtonOne(buttonOne)
								this.setButtonTwo(buttonTwo)
								this.setButtonThree(buttonThree)
								this.setButtonOneColor(buttonOneColor)
								this.setButtonTwoColor(buttonTwoColor)
								this.setButtonThreeColor(buttonThreeColor)
								this.setTitleTextColor(titleTextColor)
								this.setMainTitleTextColor(mainTitleTextColor)
								this.setSecondBackgroundColor(secondBackgroundColor)
								this.setMainGreyTextColor(mainGreyTextColor)
								this.setMainWhiteTextColor(mainWhiteTextColor)
								this.setTabbarSelectColor(tabbarSelectColor);
								this.setTabbarColor(tabbarColor);
								this.setIsDefault(true)
								this.setIsReverseColor(isReverseColor)
								if (isReverseColor) {
									let reverseColor = res.data.data.globalStyle.content.reverseColor || ''
									this.setReverseColor(reverseColor)
								}
								// utils.setTitleStyle(titleTextColor, titleBackgroundColor)

								uni.setStorageSync('globalStyle', res.data.data.globalStyle);

							}
						}
					},
					fail: (res) => {
						console.log(res);
					},
					complete: (res) => {
						console.log(res)
					},
				})
			},

		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
	/*每个页面公共css */
	@import './common/common.scss';
	@import './common/style.css';
	@import './common/uni.css';
	/* #ifndef APP-PLUS-NVUE */
		@import './common/iconfont.css';
		@import './common/iconfont1.css';
	/* #endif */
	
	@import '@/common/myicon/iconfont.css';

	/* #ifdef H5 */
	// body {
	// 	background: var(--titleBackgroundColor);
	// }

	/* #endif */
	// <link href='http://fonts.font.im/css?family=Slabo+27px' rel='stylesheet' type='text/css'>
	// @font-face {
	//   font-family: 'Open Sans'; /* 字体名称 */
	//   src: url('http://fonts.font.im/css?family=Slabo+27px');
	// }
	
</style>