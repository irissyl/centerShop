<template>
	<view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				url:""
			};
		},
		onLoad(options) {
			this.setGlobalColor()
			uni.setStorageSync('token', options.token);
			uni.setStorageSync('user_id', options.user_id);
			let timestamp = new Date().getTime();
			let url = '';
			let currentPage = 	uni.getStorageSync('currentPage')
			// 获取登录前页面
			if(currentPage){
				url = '/' + uni.getStorageSync('currentPage');
			}else{
				url = '/pages/index/index';
			}
			
			let pageOptions = uni.getStorageSync('currentPageOptions');
			if(Object.keys(pageOptions).length > 0){
				url += '?';
				for(let i in pageOptions){
					url += i + '=' + pageOptions[i] + '&';
				}
				url = url.substring(0, url.length - 1);
			}
			console.log(url)
			// 执行回调函数
			uni.reLaunch({
				url: url
			});
		},
	}
</script>

<style>

</style>
