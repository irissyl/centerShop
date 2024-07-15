import config from '../config.js'
/*导航菜单白名单*/
const tabBarLinks = [
	// '/pages/index/index',
	// '/main/pages/product/category',
	// '/pages/cart/cart',
	// '/user/pages/index/index'
];

/*分享页面白名单*/
const shareLinks = [
	'/plus/pages/assemble/fight-group-detail/fight-group-detail',
	'/plus/pages/bargain/haggle/haggle'
]

/*
 * 跳转页面
 */
export const gotopage = (url) => {
	if (!url || url.length == 0) {
		return false;
	}
	if(url.indexOf('http')>-1 || url.indexOf('www.')>-1){
		// #ifdef  H5
		window.location.href = url;
		return;
		// #endif
		// #ifdef MP-WEIXIN
		uni.navigateTo({
			url:"/pages/webpage/webpage?url="+url
		})
		// #endif
		// #ifdef APP
		uni.navigateTo({
			url:"/pages/webpage/webpage?url="+url
		})
		// #endif
	}

	if(url.substr(0,1)!=='/'){
		url='/' + url;
	}
	let p = url;
	if(url.indexOf('?') != -1){
		p = url.substr(0, url.indexOf('?'));
	}

	// tabBar页面, 如果是自定义的tabBar,将无法使用switchTab进行跳转
	// 使用switchTab,需要在pages.json中进行定义tabBar
	if (tabBarLinks.indexOf(p) > -1) {
		uni.switchTab({
			url: url
		});
	} else {
		//判断是否分享页面
		if (shareLinks.indexOf(p) > -1) {
			//公众号
			// #ifdef  H5
			window.location.href = config.app_url + config.h5_addr + url;
			return;
			// #endif
		}

		// 普通页面
		uni.navigateTo({
			url:  url
		});

	}
}
