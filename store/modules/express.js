/*全局状态*/
const express = {
	state: {
		state_list: [{
			code: '0',
			label: '已下单'
		}, {
			code: '9999',
			label: '已下单'
		}, {
			code: '1',
			label: '已揽收'
		}, {
			code: '2',
			label: '在途中'
		}, {
			code: '3',
			label: '已签收'
		}, {
			code: '4',
			label: '问题件'
		}, {
			code: '5',
			label: '转寄'
		}, {
			code: '6',
			label: '清关'
		}, ],
		state_ex: [{
			code: '0',
			label: '暂无轨迹信息'
		}, {
			code: '1',
			label: '已揽收'
		}, {
			code: '2',
			label: '在途中'
		}, {
			code: '10',
			label: '待揽件'
		}, {
			code: '201',
			label: '到达派件城市'
		}, {
			code: '204',
			label: '到达转运中心'
		}, {
			code: '205',
			label: '到达派件网点'
		}, {
			code: '206',
			label: '寄件网点发件'
		}, {
			code: '202',
			label: '派件中'
		}, {
			code: '211',
			label: '已放入快递柜或驿站'
		}, {
			code: '3',
			label: '已签收'
		}, {
			code: '301',
			label: '正常签收'
		}, {
			code: '302',
			label: '派件异常后最终签收'
		}, {
			code: '304',
			label: '代收签收'
		}, {
			code: '311',
			label: '快递柜或驿站签收'
		}, {
			code: '4',
			label: '问题件'
		}, {
			code: '401',
			label: '发货无信息'
		}, {
			code: '402',
			label: '超时未签收'
		}, {
			code: '403',
			label: '超时未更新'
		}, {
			code: '404',
			label: '拒收(退件)'
		}, {
			code: '405',
			label: '派件异常'
		}, {
			code: '406',
			label: '退货签收'
		}, {
			code: '407',
			label: '退货未签收'
		}, {
			code: '412',
			label: '快递柜或驿站超时未取'
		}, {
			code: '413',
			label: '单号已拦截'
		}, {
			code: '414',
			label: '破损'
		}, {
			code: '415',
			label: '客户取消发货'
		}, {
			code: '416',
			label: '无法联系'
		}, {
			code: '417',
			label: '配送延迟'
		}, {
			code: '418',
			label: '快件取出'
		}, {
			code: '419',
			label: '重新派送'
		}, {
			code: '420',
			label: '收货地址不详细'
		}, {
			code: '421',
			label: '收件人电话错误'
		}, {
			code: '422',
			label: '错分件'
		}, {
			code: '423',
			label: '超区件'
		}, {
			code: '5',
			label: '转寄'
		}, {
			code: '6',
			label: '清关'
		}, {
			code: '601',
			label: '待清关'
		}, {
			code: '602',
			label: '清关中'
		}, {
			code: '603',
			label: '已清关'
		}, {
			code: '604',
			label: '清关异常'
		}]
	},

	getters: {

	},

	mutations: {},

	actions: {

	}
}
export default express;