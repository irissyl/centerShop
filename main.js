import Vue from 'vue'
import App from './App'
import store from './store'
import utils from './common/utils.js'
import config from './config.js'
import onfire from './common/onfire.js'
import {
	gotopage
} from '@/common/gotopage.js'
import StorageExpired from "@/common/storage"

import lang_js from 'lang/lang.js';
lang_js.init(Vue)

let lang = uni.getStorageSync("lang");
if (lang == "") {
	lang = "zh-cn";
	uni.setStorageSync("lang", lang)
}

Vue.prototype.lang = lang

import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

Vue.prototype.$ls = new StorageExpired()

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.config = config

const app = new Vue({
	store,
	...App
})
app.$mount()

Vue.prototype.websiteUrl = config.app_url;
Vue.prototype.app_id = config.app_id;
//h5发布路径
Vue.prototype.h5_addr = config.h5_addr;
/*页面跳转*/
Vue.prototype.gotoPage = gotopage;

Vue.prototype.$fire = new onfire()
Vue.prototype.theme = function() {
	return 'theme' + this.$store.state.theme || ''
}
Vue.prototype.points_name = function(e) {
	if (!e) {
		return store.state.points_name != undefined ? store.state.points_name : "";
	} else {
		let re = new RegExp("积分", "g");
		var name = e.replace(re, store.state.points_name);
		return name != undefined ? name : "";
	}

}
// 运行环境
Vue.prototype.port_id = config.port_id;

Vue.prototype.formatWord = function(val) {
	return val.replace(/\n/g, '<br>')
}
// 全局错误捕获
Vue.config.errorHandler = (err, vm, info) => {
	console.log('进入全局异常捕获')
	console.error(err)
	console.error(vm)
	console.error(info)
	let msg = []
	msg.push(config.msgPrefix + '全局异常捕获')
	msg.push(`错误信息:${err.toString()}<br/>`)
	if (vm && vm.route) {
		msg.push(`页面:${vm.route}`)
	}
	if (info) {
		msg.push(`类型:${info}`)
	}
	if (config.WxCpErrorReport && process.env.NODE_ENV === 'production') {
		utils.sendWxCpMsg(config.receiver, msg)
	}
}

//是否是ios
Vue.prototype.ios = function() {
	const u = navigator.userAgent.toLowerCase();
	if (u.indexOf("like mac os x") < 0 || u.match(/MicroMessenger/i) != 'micromessenger') {
		return false;
	}
	return true;
};
/* 
去除二维数组重复数据 
 */
Vue.prototype.getUnique = function(data, key) {
	var arr = [];
	for (var i = 0; i < data.length; i++) {
		//判断当前数组下标为i的元素是否已经保存到临时数组
		//如果已保存，则跳过，否则将此元素保存到临时数组中
		var ind = 0;
		if (arr.length > 0) {
			for (var j = 0; j < arr.length; j++) {
				if (arr[j][key] == data[i][key]) {
					ind++;
				}
			}
		}
		if (ind <= 0) {
			arr.push(data[i]);
		}
	}
	return arr;
}
/* 
 type 1 获取下标 
      2 获取值
 */
Vue.prototype.getArrayIndex = function(obj, type, xb = 0) {
	const public_arr = ["province", "city", "county", "town"]
	if (type == 1) {
		for (var i = 0; i < public_arr.length; i++) {
			if (public_arr[i] === obj) {
				return i;
			}
		}
		return -1;
	} else if (type == 2) {
		return public_arr[xb];
	}

}
/* 
	禁止页面滚动
 */
Vue.prototype.touchmove = function(type) {
	var box = function(e) {
		passive: false;
	};
	document.body.style.overflow = type;
	document.addEventListener("touchmove", box, false);

}
/* 
/* 
获取数组下标 
 */
Vue.prototype.getArraysIndex = function(public_arr, obj) {

	for (var i = 0; i < public_arr.length; i++) {
		if (public_arr[i].category_id === obj) {
			return i;
		}
	}
	return -1;


}

//get请求
Vue.prototype._get = function(path, data, success, fail, complete, is_hide_loading = true) {
	data = data || {};
	data.token = uni.getStorageSync('token') || '';
	data.app_id = this.getAppId();
	data.port_id = this.port_id
	if (config.XDebug) data.XDEBUG_SESSION_START = 'PHPSTORM'
	uni.request({
		url: this.websiteUrl + '/index.php/api/' + path,
		data: data,
		dataType: 'json',
		method: 'GET',
		success: (res) => {
			if (res.statusCode == 601) {
				console.log('登录态失效, 重新登录');
				this.login_l(this);
				return false
			}
			if (res.statusCode !== 200 || typeof res.data !== 'object') {
				console.log('get请求返回--->', res);
				if (res.statusCode !== 200 || typeof res.data !== 'object') {
					console.log('get请求返回错误啦啦啦啦啦');
					this.tip(res.data.msg || res.data.message || '请求错误，请稍后重试')
					return false;
				}
				return false;
			}
			if (Number(res.data.code) === -10) {
				if (res.data.msg == "该用户尚无绑定上级") {
					uni.showModal({
						title: self.$nw("系统提示："),
						content: self.$nw("检测到您还未绑定上级，是否前往绑定上级"),
						success(re) {
							if (re.confirm) {
								uni.navigateTo({
									url: "/main/pages/login/bindUserId"
								})
								return;
							}
						}
					})
				}
			}
			if (Number(res.data.code) === -2) {
				// 禁止使用本商城
				uni.redirectTo({
					url: '/main/pages/error/error?text=' + res.data.msg
				})
				return false
			} else if (res.data.code === -1 || res.data.code == 601) {
				console.log('登录态失效, 重新登录');
				// this.doLogin();
				this.login_l(this);
			} else if (res.data.code === 0) {
				var arr = res.data.msg.split("___")
				if (arr.length > 1) {
					this.showError1(arr[0], function() {
						fail && fail(res)
						uni.redirectTo({
							url: '/main/pages/order/order-detail/order-detail?order_id=' +
								arr[1],
						});
					})
				} else {
					this.showError(res.data.msg, function() {
						fail && fail(res)
					})
				}

				return false
			} else {
				if (res.data.code != 1 && res.data.code != 200) {
					fail && fail(res)
					return
				}
				success && success(res.data);
			}
		},
		fail: (res) => {
			fail && fail(res);
		},
		complete: (res) => {
			if (is_hide_loading) {
				uni.hideLoading();
			}
			complete && complete(res);
		},
	});
};

//post请求
Vue.prototype._post = function(path, data, success, fail, complete, is_hide_loading = true) {
	data = data || {};
	data.token = data.token || uni.getStorageSync('token') || '';
	data.app_id = '' + this.getAppId();
	data.port_id = '' + this.port_id
	// data.lang = uni.getStorageInfoSync("lang")
	if (config.XDebug) data.XDEBUG_SESSION_START = 'PHPSTORM'
	uni.request({
		url: this.websiteUrl + '/index.php/api/' + path,
		data: data,
		dataType: 'json',
		method: 'POST',
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		},
		success: (res) => {
			console.log('post请求返回--->', res);
			if (res.statusCode == 601) {
				console.log('登录态失效, 重新登录');
				this.login_l(this);
				return false
			}
			if (res.statusCode !== 200 || typeof res.data !== 'object') {
				console.log('post请求返回错误啦啦啦啦啦');
				this.tip(res.data.msg || res.data.message || '请求错误，请稍后重试')
				return false;
			}
			if (Number(res.data.code) === -10) {
				if (res.data.msg == "该用户尚无绑定上级") {
					uni.showModal({
						title: self.$nw("系统提示："),
						content: "检测到您还未绑定上级，是否前往绑定上级",
						success(re) {
							if (re.confirm) {
								uni.navigateTo({
									url: "/main/pages/login/bindUserId"
								})
								return;
							}
						}
					})
				}
			}
			if (Number(res.data.code) === -2) {
				// 禁止使用本商城
				uni.redirectTo({
					url: '/main/pages/error/error?text=' + res.data.msg
				})
			} else if (Number(res.data.code) === -1 || res.data.code == 601) {
				console.log('登录态失效, 重新登录');
				// this.doLogin();
				this.login_l(this);
			} else if (res.data.code === 0) {
				var arr = res.data.msg.split("___")
				if (arr.length > 1) {
					this.showError1(arr[0], function() {
						fail && fail(res)
						uni.redirectTo({
							url: '/main/pages/order/order-detail/order-detail?order_id=' +
								arr[1],
						});
					})


				} else {
					if (path != "auth.WxMn/getOpenId") {
						this.showError(res.data.msg, function() {
							fail && fail(res)
						})
					} else {
						fail && fail(res)
					}

				}

				return false
			} else {
				console.log('post res', res);
				if (res.data.code != 1 && res.data.code != 200) {
					fail && fail(res)
					return
				}
				console.log("统一获取")
				success && success(res.data);
			}
		},
		fail: (res) => {
			console.log('请求错误res-->', res);
			fail && fail(res);
		},
		complete: (res) => {
			if (is_hide_loading) {
				uni.hideLoading();
			}
			complete && complete(res);
		},
	});
};

// post请求,json头
Vue.prototype._postJson = function(path, data, success, fail, complete) {
	data = data || {}
	data.token = uni.getStorageSync('token') || ''
	data.app_id = this.getAppId()
	data.lang = uni.getStorageInfoSync('lang')
	data.port_id = this.port_id
	if (config.XDebug) data.XDEBUG_SESSION_START = 'PHPSTORM'
	uni.request({
		url: this.websiteUrl + '/index.php/api/' + path,
		data: data,
		dataType: 'json',
		method: 'POST',
		success: (res) => {
			if (res.statusCode !== 200 || typeof res.data !== 'object') {
				return false
			}
			if (Number(res.data.code) === -2) {
				// 禁止使用本商城
				uni.redirectTo({
					url: '/main/pages/error/error?text=' + res.data.msg,
				})
			} else if (res.data.code === -1 || res.data.code == 601) {
				console.log('登录态失效, 重新登录')
				// this.doLogin()
				this.login_l(this);
			} else if (res.data.code === 0) {
				var arr = res.data.msg.split("___")
				if (arr.length > 1) {
					this.showError1(arr[0], function() {
						fail && fail(res)
						uni.redirectTo({
							url: '/main/pages/order/order-detail/order-detail?order_id=' +
								arr[1],
						});
					})


				} else {
					this.showError(res.data.msg, function() {
						fail && fail(res)
					})
				}

				return false
			} else {
				console.log('统一获取')
				success && success(res.data)
			}
		},
		fail: (res) => {
			fail && fail(res)
		},
		complete: (res) => {
			uni.hideLoading()
			complete && complete(res)
		},
	})
}

Vue.prototype.doLogin = function() {
	let pages = getCurrentPages();
	if (pages.length) {
		let currentPage = pages[pages.length - 1];
		if ("main/pages/login/login" != currentPage.route) {
			uni.setStorageSync("currentPage", currentPage.route);
			uni.setStorageSync("currentPageOptions", currentPage.options);
		}
	}
	//公众号 授权登录
	// #ifdef  H5
	let appinfo = uni.getStorageSync('appinfo');
	if (this.isWeixn() && appinfo && appinfo.is_open_wx_mp_login) {
		//后台配置完整
		console.log(appinfo);
		let mpapp_id = '';
		let mpapp_secret = '';
		if (appinfo.setting) {
			mpapp_id = appinfo.setting.mpapp_id ? appinfo.setting.mpapp_id : '';
			mpapp_secret = appinfo.setting.mpapp_id ? appinfo.setting.mpapp_secret : '';
		}
		if (mpapp_id && mpapp_secret) {
			window.location.href = this.websiteUrl + '/index.php/api/user.usermp/login?app_id=' + this.getAppId() +
				'&referee_id=' + uni.getStorageSync('referee_id');
			return true;
		}
	}
	//有短信跳短信
	if (appinfo.is_open_sms) {
		uni.navigateTo({
			url: "/main/pages/login/weblogin"
		});
	} else {
		uni.navigateTo({
			url: "/main/pages/login/login"
		});
	}
	// #endif
	// 非公众号,跳转授权页面,下面跳小程序授权
	// // #ifndef  H5
	// uni.navigateTo({
	// 	url: "/main/pages/login/login"
	// });
	// // #endif
};


/**
 * 显示失败提示框
 */
Vue.prototype.showError = function(msg, callback) {
	uni.showModal({
		title: '友情提示',
		content: msg,
		showCancel: false,
		success: function(res) {
			callback && callback();
		}
	});
};

Vue.prototype.showError1 = function(msg, callback) {
	uni.showModal({
		title: '友情提示',
		content: msg,
		showCancel: false,
		success: function(res) {
			if (res.confirm) {
				callback && callback();
			}

		}
	});
};


/**
 * 显示失败提示框
 */
Vue.prototype.showSuccess = function(msg, callback) {
	uni.showModal({
		title: '友情提示',
		content: msg,
		showCancel: false,
		success: function(res) {
			callback && callback();
		}
	});
};

/**
 * 获取应用ID
 */
Vue.prototype.getAppId = function() {
	return this.app_id || 10001;
};

Vue.prototype.compareVersion = function(v1, v2) {
	v1 = v1.split('.')
	v2 = v2.split('.')
	const len = Math.max(v1.length, v2.length)

	while (v1.length < len) {
		v1.push('0')
	}
	while (v2.length < len) {
		v2.push('0')
	}

	for (let i = 0; i < len; i++) {
		const num1 = parseInt(v1[i])
		const num2 = parseInt(v2[i])

		if (num1 > num2) {
			return 1
		} else if (num1 < num2) {
			return -1
		}
	}

	return 0
};

/**
 * 生成转发的url参数
 */
Vue.prototype.getShareUrlParams = function(params) {
	let self = this;
	return utils.urlEncode(Object.assign({
		referee_id: self.getUserId()
	}, params));
};

/**
 * 当前用户id
 */
Vue.prototype.getUserId = function() {
	return uni.getStorageSync('user_id');
};

//#ifdef H5
var jweixin = require('jweixin-module');

Vue.prototype.configWx = function(signPackage, shareParams, params) {
	if (!signPackage || signPackage === '') {
		return;
	}
	let self = this;
	jweixin.config(JSON.parse(signPackage));

	let url_params = self.getShareUrlParams(params);

	jweixin.ready(function(res) {
		jweixin.updateAppMessageShareData({
			title: shareParams.title,
			desc: shareParams.desc,
			link: self.websiteUrl + self.h5_addr + '/#' + shareParams.link + '?' + url_params,
			imgUrl: shareParams.imgUrl,
			success: function() {

			}
		});
		jweixin.updateTimelineShareData({
			title: shareParams.title,
			desc: shareParams.desc,
			link: self.websiteUrl + self.h5_addr + '/#' + shareParams.link + '?' + url_params,
			imgUrl: shareParams.imgUrl,
			success: function() {

			}
		});
	});
};
//#endif

/**
 * 获取当前平台
 */
Vue.prototype.getPlatform = function() {
	let platform = 'wx'
	// #ifdef  H5
	if (this.isWeixn()) {
		platform = 'mp'
	} else {
		platform = 'h5'
	}
	// #endif
	// #ifdef APP-PLUS
	platform = 'app'
	// #endif
	// #ifdef MP-WEIXIN
	// 小程序
	platform = 'wx'
	// #endif
	return platform
};

/**
 * 订阅通知,目前仅小程序
 */
Vue.prototype.subMessage = function(temlIds, callback) {
	let self = this;
	// #ifdef  MP-WEIXIN
	//小程序订阅消息
	const version = wx.getSystemInfoSync().SDKVersion;
	if (temlIds && temlIds.length != 0 && self.compareVersion(version, '2.8.2') >= 0) {
		wx.requestSubscribeMessage({
			tmplIds: temlIds,
			success(res) {},
			fail(res) {},
			complete(res) {
				callback();
			},
		});
	} else {
		callback();
	}
	// #endif
	// #ifndef MP-WEIXIN
	callback();
	// #endif
};
/* 
	跳转聊天界面 
 */
Vue.prototype.jump_chat = function(chat_to_uid, card_id = "", temlIds = []) {
	var self = this;
	let user_id = uni.getStorageSync('user_id');
	if (!user_id && user_id != 'undefined') {
		self.doLogin();
	} else {
		let callback = function() {
			let path = '/card/pages/card/chat/chat?chat_to_uid=' + chat_to_uid + '&card_id=' + card_id;
			self.gotoPage(path);
		};
		self.subMessage(temlIds, callback);
	}
};

//手机号星号
Vue.prototype.maskPhoneNumber = function(phoneNumber) {
	console.log(phoneNumber, 21333);
	return phoneNumber.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/* 
	判断菜单是否设置到主页 
 */
Vue.prototype.isTabbar = function(self, url, callback) {
	let curPage = getCurrentPages();
	let route = curPage[curPage.length - 1].route; //获取当前页面的路由
	self._get('index/tabbar', {}, function(res) {
		if (res.code == 1) {
			if (res.data.tabbar) {
				for (var i = 0; i < res.data.tabbar[0].data.length; i++) {
					var str = res.data.tabbar[0].data[i].linkUrl || '';
					if (str.trim() == url.trim()) {
						callback(true);
						break;
					}
				}
			} else {
				callback(false);
			}

		} else {
			callback(false);
		}

	})

};



Vue.prototype.isWeixn = function() {
	var ua = navigator.userAgent.toLowerCase();
	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		return true;
	} else {
		return false;
	}
};

/**
 * 根据后台设置,标题文本颜色
 */
Vue.prototype.setGlobalColor = function(e) {
	console.log('setGlobalColor-->', e);
	console.log('setGlobalColor isDefault--->', isDefault);
	if (e) {
		utils.setTitleStyle(e.textc || '#000000', e.bgc || '#F4F7FB')
		// console.log(1);
		return
	} else {
		utils.setTitleStyle('#000000', '#F4F7FB')
		return
	}
	let isDefault = store.getters.isDefault
	if (isDefault) {
		let titleBackgroundColor = store.getters.titleBackgroundColor || '#EE1414'
		let titleTextColor = store.getters.titleTextColor || '#ffffff'
		utils.setTitleStyle(titleTextColor, titleBackgroundColor)
	}
}

/**
 * 设置元素前景色,返回style字符串
 * mainColor = true 设置前景色 主色调
 */
Vue.prototype.setColor = function(isMainColor = false) {
	let isDefault = store.getters.isDefault
	let res = {};
	if (isDefault) {
		// 主色调
		const mainColor = utils.getMainColor()
		// 文字颜色, 根据后台设置,如果开启反色,获取主色调的反色,未开启就是获取标题字体颜色
		const textColor = utils.getTextColor()
		if (textColor) {
			res.color = textColor
		}
		if (isMainColor) {
			if (mainColor) {
				res.color = mainColor
			}
		}
	}
	return res;
}
/* 
 获取三个预设按钮
 */
Vue.prototype.setButton = function() {
	let isDefault = store.getters.isDefault
	let res = {};
	if (isDefault) {
		const mainColor = utils.getButton()
		if (mainColor) {
			res.button = mainColor
		}
	}
	return res;
}

/**
 * 设置元素前景色,返回style字符串
 */
Vue.prototype.setBackgroundColor = function(border = true) {
	let isDefault = store.getters.isDefault
	let res = {};
	if (isDefault) {
		const mainColor = utils.getMainColor()
		if (mainColor) {
			res.backgroundColor = mainColor
			if (border) {
				res.border = `1px solid ${mainColor}`
			}
		}
	}
	return res;
}

/**
 * 获取元素背景色,返回颜色代码
 */
Vue.prototype.getMainColor = function() {
	return utils.getMainColor() || ''
}

/**
 * 获取元素前景色,返回颜色代码
 */
Vue.prototype.getTextColor = function() {
	return utils.getTextColor() || ''
}

/* 
 获取主字体颜色
 */
Vue.prototype.getMainTextColor = function() {
	return utils.getMainTextColor() || ''
}
/* 
 获取第二背景色secondBackgroundColor
 */
Vue.prototype.getSecondBackgroundColor = function() {
	return utils.getSecondBackgroundColor() || ''
}
/* 
	获取字体颜色-白色 
 */
Vue.prototype.getTextColorWhite = function() {
	return utils.getTextColorWhite() || '#fff'
}
/* 
	获取字体颜色-灰色
 */
Vue.prototype.getTextColorGrey = function() {
	return utils.getTextColorGrey() || "#75777b"
}
/* 
	获取选中tabbar颜色
 */
Vue.prototype.getTabbarSelectColor = function() {
	console.log("11", utils.getTabbarSelectColor())
	return utils.getTabbarSelectColor() || "#363739"
}
/* 
	获取未选中tabbar颜色
 */
Vue.prototype.getTabbarColor = function() {
	return utils.getTabbarColor() || "#93959a"
}
/**
 * 获取链接中的open_id
 */
Vue.prototype.getUrlCode = function() {
	var url = location.search
	this.winUrl = url
	var theRequest = new Object()
	if (url.indexOf("?") != -1) {
		var str = url.substr(1)
		var strs = str.split("&")
		for (var i = 0; i < strs.length; i++) {
			theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1])
		}
	}
	return theRequest
}
/* 
	确认订单 授权——公众号获取open_id 
 */
Vue.prototype.getCode = function(obj, self, success, fail) {
	let app_id = uni.getStorageSync("appinfo").app_id

	var local = obj.app_url + "/h5/?app_id=" + app_id + "#/main/pages/pay/pay?obj=" + JSON
		.stringify(obj) + "&pay_log_id=" + obj.pay_log_id +
		"&payment_id=" + obj.payment_id +
		"&pay_type=" + obj.pay_type +
		"&pay_num=" + obj.pay_num +
		"&order_price=" + obj.order_price // 获取页面url
	var appid = 'wx170d1577ab6c3fe0'
	window.location.href =
		`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(local)}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
}

/* 
 快速获取appinfo信息
 */
Vue.prototype.getAppinfo = function() {
	var val = uni.getStorageSync("appinfo");
	var arr = {
		balance_text: val.balance_text ? val.balance_text : '余额',
		balance_word_text: val.balance_word_text ? val.balance_word_text : '商城',
		open_wx_recharge: val.open_wx_recharge ? val.open_wx_recharge : 0,
		lottery_status: val.lottery_status ? val.lottery_status : false
	}
	return arr;
}
/* 
公众号获取open_id 
 */
Vue.prototype.getAuthCode = function(obj, self, success, fail) {
	let app_id = uni.getStorageSync("appinfo").app_id
	var local = obj.app_url + "/h5/?app_id=" + app_id + "#/main/pages/login/auth_login" // 获取页面url
	var appid = 'wx170d1577ab6c3fe0'
	window.location.href =
		`https://open.weixin.qq.com/connect/oauth2/authorize?appid=${appid}&redirect_uri=${encodeURIComponent(local)}&response_type=code&scope=snsapi_base&state=123#wechat_redirect`;
}
/* 
	登陆跳转函数   决定跳转那个界面
	jump  决定登陆成功后 返回的页面
	type  决定显示哪些登陆方式
 */
Vue.prototype.login = function(jump = "", type = []) {
	uni.setStorageSync("login_j", JSON.stringify({
		jump: jump,
		type: type
	}))

	// #ifdef H5
	if (this.isWeixn()) { //微信环境——公众号
		if (jump == "pass_login") {
			uni.navigateTo({ //跳转密码登陆
				url: '/main/pages/login/loginMM'
			});
			return true;
		}

		let appinfo = uni.getStorageSync('appinfo');
		let is_open_authlogin = appinfo.is_open_authlogin;
		if (is_open_authlogin) {
			let mpapp_id = '';
			let mpapp_secret = '';
			if (appinfo.setting) {
				mpapp_id = appinfo.setting.mpapp_id ? appinfo.setting.mpapp_id : '';
				mpapp_secret = appinfo.setting.mpapp_id ? appinfo.setting.mpapp_secret : '';
			}
			if (mpapp_id && mpapp_secret) {
				let obj = {
					"app_url": config.app_url
				}
				this.getAuthCode(obj, this)
				return true;
			}
		}

		//如果不跳转授权登录
		uni.navigateTo({ //跳转密码登陆
			url: '/main/pages/login/loginMM'
		});
		return true;
	} else { //H5
		uni.navigateTo({ //跳转密码登陆
			url: '/main/pages/login/loginMM'
		});
	}
	// #endif
	// #ifdef MP-WEIXIN
	uni.navigateTo({ //跳转授权登陆
		url: '/main/pages/login/login'
	});
	// #endif

	// #ifdef APP-PLUS
	uni.navigateTo({ //跳转密码登陆
		url: '/main/pages/login/loginMM'
	});
	// #endif


}

/* 
 小程序获取微信open_id
 */

Vue.prototype.getMinOpenId = function(self, callback) {
	wx.login({
		success: function(res) {
			if (res.code) {
				self._post(
					'auth.WxMn/getMinOpenId', {
						"js_code": res.code
					},
					result => {
						console.log('小程序获取微信open_id', result.data.openid);
						callback(result.data.openid);
					})
			}
		},
	})
}

/* 
再次封装登陆 
 */
Vue.prototype.login_l = function(self) {
	// #ifdef MP-WEIXIN
	self.getMinOpenId(self, function(open_id) {
		uni.setStorageSync("open_id", open_id)
		// 根据不同的情况跳转到不同的页面
		self.login("pass_login", [0])
	})
	return;
	// #endif
	// #ifndef MP-WEIXIN
	// 根据不同的情况跳转到不同的页面
	self.login("pass_login", [0])
	// #endif

}
/* 
	获取支付列表
 */
Vue.prototype.getPaymentList = function(self, callback) {
	self._post("payment.payment/list", {}, function(res) {
		var arr = [];

		for (var i = 0; i < res.data.length; i++) {
			let el = res.data[i];
			// #ifdef MP-WEIXIN
			if (el.pay_type == "wx_mn" || el.pay_type == "wxmn" || el.pay_type == "huifu_wxmn" || el
				.pay_type == "huifu_alipay_wap") {
				arr.push(el);
			}
			// #endif
			// #ifdef H5
			if (self.isWeixn()) {
				if (el.pay_type == "wxmp" || el.pay_type == "huifu_wxmp") {
					arr.push(el);
				}
			}
			if (el.pay_type == "huifu_alipay_wap") {
				arr.push(el);
			}

			// #endif
			//余额什么情况都能获取
			if (el.pay_type == "balance") {
				arr.push(el);
			}
		}
		callback(arr);
	}, function() {}, function() {}, false)
}


/* 
	支付参数以及路由等参数 
 */
Vue.prototype.payData = function(self, obj, callback) {
	var params = {}
	if (self.options.order_type != "pay") {
		params = {
			delivery: self.delivery,
			store_id: self.store_id,
			logistics_id: self.logistics_id,
			coupon_id: self.coupon_id,
			is_use_points: self.is_use_points,
			is_use_welfare: self.is_use_welfare,
			phone: obj._phone,
			linkman: obj._linkman,
			remark: self.remark,
			pay_type: self.pay_num,
			payment_id: self.payment_id,
			pay_source: self.getPlatform(),
			address_id: self.address_id
		}
	} else {
		params = {}
	}

	// 创建订单-直接下单
	let url = ''
	if (self.options.order_type === 'buy') {
		url = 'order.order/buy'
		params = Object.assign(params, {
			product_id: self.options.product_id,
			product_num: self.options.product_num,
			product_sku_id: self.options.product_sku_id,
			sku_id: self.options.sku_id,
		})
	}

	// 创建订单-购物车结算
	if (self.options.order_type === 'cart') {
		url = 'order.order/cart'
		params = Object.assign(params, {
			cart_ids: self.options.cart_ids || 0,
			code: "cart"
		})
	}

	//创建订单-常购清单结算
	if (self.options.order_type === 'abuylist') {
		url = 'order.order/cart'
		params = Object.assign(params, {
			abuylist_ids: self.options.abuylist_ids || 0,
			code: "abuylist"
		})
	}

	// 创建订单-积分兑换
	if (self.options.order_type === 'points') {
		url = 'plus.points.order/buy'
		params = Object.assign(params, {
			point_product_id: self.options.point_product_id,
			product_sku_id: self.options.product_sku_id,
			point_product_sku_id: self.options.point_product_sku_id,
			product_num: self.options.product_num,
		})
	}
	// 创建订单-限时秒杀
	if (self.options.order_type === 'seckill') {
		url = 'plus.seckill.order/buy'
		params.num = self.options.num
		params = Object.assign(params, {
			seckill_product_id: self.options.seckill_product_id,
			product_sku_id: self.options.product_sku_id,
			seckill_product_sku_id: self.options.seckill_product_sku_id,
			product_num: self.options.product_num,
		})
	}
	// 创建订单-砍价
	if (self.options.order_type === 'bargain') {
		url = 'plus.bargain.order/buy'
		params = Object.assign(params, {
			bargain_product_id: self.options.bargain_product_id,
			product_sku_id: self.options.product_sku_id,
			bargain_product_sku_id: self.options.bargain_product_sku_id,
			bargain_task_id: self.options.bargain_task_id,
		})
	}

	// 创建订单-限时拼团
	if (self.options.order_type === 'assemble') {
		url = 'plus.assemble.order/buy'
		params = Object.assign(params, {
			assemble_product_id: self.options.assemble_product_id,
			product_sku_id: self.options.product_sku_id,
			assemble_product_sku_id: self.options.assemble_product_sku_id,
			assemble_bill_id: self.options.assemble_bill_id,
			product_num: self.options.product_num,

		})
	}
	/* 
		直接支付 
	 */
	if (self.options.order_type === 'pay') {
		url = 'user.order/pay'
		params = {
			payType: obj.payType,
			order_id: self.order_id,
			pay_source: self.getPlatform(),
			open_id: obj.open_id
		}
	}

	callback(params, url)
}


/*
登录通过open_id  不查询手机号
 */
Vue.prototype.loginByOpenId = function(self, fail_ind, callback) {
	self.getMinOpenId(self, function(open_id) {
		uni.setStorageSync("open_id", open_id)
		console.log(open_id);
		self._post(
			'user.userweb/loginByMinOpenId', {
				open_id: open_id
			},
			function(result) {
				console.log("result", result);
				if (result.data.status == 1) {
					uni.setStorageSync('token', result.data.token);
					uni.setStorageSync('user_id', result.data.val);
					callback(1)
				} else {
					callback(-1)
					fail_ind++;
					uni.hideLoading()
					if (fail_ind > 3) {
						uni.showModal({
							title: self.$nw("系统提示："),
							content: "系统繁忙，请稍后再试",
							showCancel: false
						})
						fail_ind = 0;
					} else {
						uni.showModal({
							title: self.$nw("系统提示："),
							content: "砍价失败，请稍后再试",
							showCancel: false
						})
					}

				}
			},
			function() {},
			function() {}, false
		);
	}, function() {
		callback(-1)
		fail_ind++;
		if (fail_ind > 3) {
			uni.showModal({
				title: self.$nw("系统提示："),
				content: "系统繁忙，请稍后再试",
				showCancel: false
			})
			fail_ind = 0;
		} else {
			uni.showModal({
				title: self.$nw("系统提示："),
				content: "砍价失败，请稍后再试",
				showCancel: false
			})
		}

	})
}


/*
检测是否开启绑定上级
 */
Vue.prototype.is_open_bind_referee_id = function(self, callback) {
	self._get(
		'user.user/is_open_bind_referee_id', {

		},
		function(result) {

			callback(result)
		},
		function() {},
		function() {}, false
	);

}
/*
 检测是否是分销商
 */
Vue.prototype.is_agent_user = function(self, data, callback) {
	self._get(
		'user.User/is_agent_user', data,
		function(result) {

			callback(result.data)
		},
		function() {},
		function() {}, false
	);

}

/*
检测是否可以申请门店
 */
Vue.prototype.is_apply_store_num = function(self, callback) {
	self._get(
		'user.user/is_apply_store_num', {

		},
		function(result) {

			callback(result.data)
		},
		function() {},
		function() {}, false
	);

}

/*
 检测是否有正在申请的门店
 */
Vue.prototype.is_apply_store = function(self, callback) {
	self._get(
		'user.user/is_apply_store', {

		},
		function(result) {

			callback(result.data)
		},
		function() {},
		function() {}, false
	);

}
Vue.prototype.apply_store = function(self, callback) {
	self._get(
		'user.user/apply_store', {

		},
		function(result) {

			callback(result.data)
		},
		function() {},
		function() {}, false
	);

}


/*
判断是否需要绑定手机号
 */
Vue.prototype.is_need_bind_mobile = function(self, callback) {

	self._get(
		'user.user/is_need_bind_mobile', {},
		function(result) {
			callback(result.data)
		},
		function() {},
		function() {}, false
	);



}

/*
 检测上一级是否找得到
 */
Vue.prototype.is_back = function() {
	let pages = getCurrentPages();
	uni.removeStorageSync("login_j")
	let prevPage = pages[pages.length - 2]; //上一页页面实例
	console.log("prevPage", prevPage)
	if (prevPage == undefined) {
		uni.reLaunch({
			url: "/user/pages/index/index"
		})
	} else {
		if (prevPage.route == "pages/inviter/inviter") {
			uni.reLaunch({
				url: "/user/pages/index/index"
			})
		} else if ("main/pages/login/auth_login" == prevPage.route) {
			uni.reLaunch({
				url: "/user/pages/index/index"
			})
		} else {
			if (uni.getStorageSync("login_j")) {
				var jump = JSON.parse(uni.getStorageSync("login_j")).jump

				if (jump) {
					uni.removeStorageSync("login_j")
					uni.reLaunch({
						url: jump
					})
				} else {
					uni.navigateBack();
				}
			} else {
				uni.navigateBack();
			}


		}

	}




}

/*
 检测是否满足最低报销数量
 */
Vue.prototype.is_min_expenses_num = function(self, data, callback) {
	self._get(
		'user.user/is_min_expenses_num', {
			act_expenses_num: data.act_expenses_num
		},
		function(result) {
			callback(result.data)
		},
		function() {},
		function() {}, false
	);
}

/*
	记录用户操作
 */

Vue.prototype.thumbsup_handle = function(self, id, code, type, callback) {

	self._get(
		'plus.article.article/thumbsup_handle', {
			data_id: id,
			code: code,
			type: type
		},
		function(res) {
			if (code == "like") {
				uni.showToast({
					title: self.$nw("点赞成功"),
					icon: "none"
				})
				callback(res)
			} else if (code == "collect") {
				uni.showToast({
					title: self.$nw("收藏成功"),
					icon: "none"
				})
				callback(res)
			}

		})
}


//根据IP获取用户经纬度
Vue.prototype.getAddressByIp = function(self, callback) {

	self._get(
		'user.user/getAddressByIpNoError', {},
		function(result) {
			callback(result)
		},
		function() {},
		function() {}, false
	);
}



/*
	获取个人中心菜单 是否显示
 */
Vue.prototype.getCenterOrderStatus = function(self, callback) {

	self._get(
		'user.index/getCenterOrderStatus', {},
		function(result) {
			callback(result.data)
		},
		function() {},
		function() {}, false
	);



}
/*
	获取我的订单列表 是否显示
 */
Vue.prototype.getListOrderStatus = function(self, callback) {

	self._get(
		'user.index/getListOrderStatus', {},
		function(result) {
			callback(result.data)
		},
		function() {},
		function() {}, false
	);



}

/*
判断字符串是否在数组内
 */
Vue.prototype.isExistArr = function(arr, key) {
	var val = "";
	for (var i = 0; i < arr.length; i++) {
		if (arr[i] == key) {
			val = true;
			break;
		} else {
			val = false;
		}
	}
	return val;
}

/*
 * 检测有没有进行中或者已完成但是核销的砍价活动
 * 如果有 不能创建活动
 * 砍价任务状态  0砍价中 1砍价成功 2砍价失败
 * */
Vue.prototype.is_exist_bargain = function(self, callback) {
	self._get(
		'user.user/is_exist_bargain', {
			"user_id": uni.getStorageSync("user_id")
		},
		function(result) {
			callback(result)
		},
		function() {},
		function() {}, false
	);
}


Vue.prototype.tip = function(msg, duration) {
	uni.showToast({
		title: msg,
		duration: duration || 2000,
		icon: "none"
	})

}

Vue.prototype.toFixed = (num) => {
	if (isNaN(num)) return '--'
	return num.toFixed(2)
}
/* 
 获取语言
 */
Vue.prototype.getLanguage = function(self, callback) {
	var data = {}
	data.token = uni.getStorageSync('token') || ''
	data.app_id = self.getAppId()
	data.language = uni.getStorageSync("lang") == "" ? "zh-cn" : uni.getStorageSync("lang")
	data.port_id = self.port_id
	data.lang = uni.getStorageSync("lang")
	uni.request({
		url: self.websiteUrl + '/index.php/api/' + 'lang.Lang/getLanguagePackA',
		data: data,
		dataType: 'json',
		method: 'POST',
		header: {
			'content-type': 'application/x-www-form-urlencoded',
		},
		success: (res) => {
			var json_val = res.data.data;
			uni.setStorageSync("lang", json_val.lang)
			uni.setStorageSync("translation_language", json_val.custom_lang)
			uni.setStorageSync("system_language", json_val.system_lang)
		}
	})

}

/*
	判断是否是tabbar页面
 */
Vue.prototype.isTabbar = function(self, route, callback) {
	// #ifdef H5
	let curPage = getCurrentPages();
	route = curPage[curPage.length - 1].route; //获取当前页面的路由
	// #endif

	self._get('index/tabbar', {}, function(res) {
		if (res.code == 1) {
			if (res.data.tabbar) {
				for (var i = 0; i < res.data.tabbar[0].data.length; i++) {
					if (res.data.tabbar[0].data[i].linkUrl == route) {
						callback(true);
						break;
					}
				}
			} else {
				callback(false);
			}

		} else {
			callback(false);
		}

	})

}