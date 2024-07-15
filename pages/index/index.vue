<template>
	<view>

	</view>
</template>

<script>
import utils from "@/common/utils";

export default {
  data() {
    return {}
  },
  onLoad(options) {
    if (options && options.referee_id) {
      uni.setStorageSync('referee_id', options.referee_id)
    }
    // #ifdef H5
    let href = window.location.href;
    let params = {};
    if (!uni.getStorageSync('token')) {
      //没有token
      if (href.indexOf('token') !== -1) {
        // 链接存在code登录
        let str = href.split('?')[1];
        if (str) {
          let b = str.split('&');
          for (let i in b) {
            let c = b[i].split('=');
            if (c.length === 2) {
              params[c[0]] = c[1];
            }
          }
        }
        if (params.token) {
          uni.setStorageSync('token', params.token)
        }
        if (params.user_id) {
          uni.setStorageSync('user_id', params.user_id)
        }
        // 跳转到上次记录的位置
        utils.gotoHistoryUrl()
        return false
      }
    }
    // #endif

    this.setGlobalColor()
    this.goHomePage()
  },
  onShareAppMessage() {},
  onShareTimeline() {},
  methods: {
    goHomePage() {
      uni.showLoading({
        title: "加载中"
      });
      let tabbar = uni.getStorageSync('tabbar')
      if (tabbar && tabbar.data[0] && tabbar.data[0].linkUrl && tabbar.data[0].linkUrl !== 'pages/index/index') {
        uni.navigateTo({
          url: '/' + tabbar.data[0].linkUrl
        })
        return false
      }
      uni.hideLoading();
      uni.redirectTo({url: '/pages/index/homePage'})
      return false
    },
  }
}
</script>

<style></style>
