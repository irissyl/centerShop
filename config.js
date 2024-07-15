import utils from "./common/utils"

let port_id = 169
// #ifdef H5
port_id = 169
// #endif
//#ifdef MP-WEIXIN
port_id = 169
// #endif
let config = {
	url: {
		prod: 'https://shanghuitest.client.xcx008.com/', //测试环境
		// prod: 'https://shanghui.client.xcx008.com/', //正式环境
		test: 'https://shanghui.client.xcx008.com/',
		dev: 'https://shanghui.client.xcx008.com/',
	},
	appId: {
		prod: 10016,
		test: 10016,
		dev: 10016,
	},
	msgPrefix: {
		prod: '[h5]',
		test: '[h5-test]',
		dev: '[h5-dev]',
	},
	receiver: {
		prod: ['', '', ''],
		test: '',
		dev: '',
	},
	WxCpErrorReport: {
		prod: true,
		test: false,
		dev: false,
	},
	XDebug: {
		prod: false,
		test: false,
		dev: true,
	},
	/**
	 * 环境定义
	 */
	ENV: {
		PROD: 'prod',
		TEST: 'test',
		DEV: 'dev',
	},
	/**
	 * 根据环境获取不同的配置
	 * @param env
	 * @param w7
	 */
	getConfig(env, w7) {
		let h5_addr = '/h5'
		let app_id = this.appId[env]
		let WxCpErrorReport = this.WxCpErrorReport[env]
		let receiver = this.receiver[env]
		let msgPrefix = this.msgPrefix[env]
		let app_url = this.url[env]
		let XDebug = this.XDebug[env]
		// #ifdef H5
		console.log("process.env.NODE_ENV------------------------------------------", process.env.NODE_ENV)
		if (process.env.NODE_ENV === 'production') {
			let url = utils.getHost()
			if (w7) {
				url = url + "/addons/miku_vkshop/web/"
				h5_addr = "/addons/miku_vkshop/web/" + h5_addr
			}
			const id = utils.getQueryVariable('app_id')
			if (url) {
				app_url = url
			}
			if (id) {
				app_id = id
			}

			const pid = utils.getQueryVariable('port_id')
			console.log("port_id:", pid)
			if (pid) {
				port_id = pid
			}
		}
		//#endif

		// #ifdef  MP-WEIXIN
		const extConfig = uni.getExtConfigSync ? uni.getExtConfigSync() : {}
		if (extConfig && extConfig.app_url && extConfig.app_id) {
			app_url = extConfig.app_url
			app_id = extConfig.app_id
			port_id = extConfig.port_id
		}
		if (utils.isArray(receiver)) {
			receiver = receiver.join('|')
		}
		//#endif
		return {
			/*服务器地址*/
			app_url,
			/*app_id*/
			app_id,
			//h5发布路径
			h5_addr,
			// 调试参数
			XDebug,
			// 是否开启企业微信错误通知
			WxCpErrorReport,
			// 环境
			port_id,
			// 通知人员
			receiver,
			// 消息体前缀
			msgPrefix,
		}
	},
}
// 是否开启微擎环境
let w7 = false
// 环境切换
// prod     test    dev
let env = config.ENV.PROD
if (process.env.NODE_ENV === 'development') {
	env = config.ENV.PROD
}
export default config.getConfig(env, w7)