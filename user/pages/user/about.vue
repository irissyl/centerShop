<template>
	<view class="address-form">
    <view class="diy-navbar" v-if="about.about_banner.file_path">
      <image style="width: 100%; height: 200px; background-color: #eeeeee;" mode="aspectFill" :src="about.about_banner.file_path"></image>
    </view>
    <view class="bg-white p-0-30 f30">
      <view class="d-b-c p-30-0 border-b" v-if="about.user.user_id">
        <text class="key-name">{{$nw("用户ID")}}</text>
        <text class="mr20 long-text">{{ about.user.user_id }}</text>
      </view>
      <view class="d-b-c p-30-0 border-b" v-else>
        <text class="key-name">{{$nw("用户")}}</text>
        <text class="mr20 long-text">{{ $nw("未登录") }}</text>
      </view>
      <view class="d-b-c p-30-0 border-b" v-if="about.user.nickName">
        <text class="key-name">{{$nw("昵称")}}</text>
        <text class="mr20 long-text">{{ about.user.nickName }}</text>
      </view>
      <view class="d-b-c p-30-0" v-if="about.user.avatarUrl">
        <text class="key-name">{{$nw("头像")}}</text>
        <view class="d-e-c">
          <image style="width: 60rpx; height: 60rpx; background-color: #eeeeee;" mode="aspectFit" :src="about.user.avatarUrl"></image>
        </view>
      </view>
    </view>
	
	<view class="bg-white p-0-30 f30 mt20" v-if="about.app && about.app.length > 0">
	  <view :class="item.type === 'title' ? 'p-30-0 uni-center border-b' : 'd-b-c p-30-0 border-b'" v-for="(item, di) in about.app" :key="di">
	    <text class="key-name" v-if="item.type === 'title'">{{ item.value }}</text>
	    <block v-if="item.type === 'text'">
	      <text class="key-name">{{ item.name }}</text>
	      <text class="mr20 long-text">{{ item.value }}</text>
	    </block>
	  </view>
	</view>

    <view class="bg-white p-0-30 f30 mt20" v-if="about.device && about.device.length > 0">
      <view :class="item.type === 'title' ? 'p-30-0 uni-center border-b' : 'd-b-c p-30-0 border-b'" v-for="(item, di) in about.device" :key="di">
        <text class="key-name" v-if="item.type === 'title'">{{ item.value }}</text>
        <block v-if="item.type === 'text'">
          <text class="key-name">{{ item.name }}</text>
          <text class="mr20 long-text">{{ item.value }}</text>
        </block>
      </view>
    </view>

    <view class="bg-white p-0-30 f30 mt20" v-if="about.api_version && about.api_version.length > 0">
      <view :class="item.type === 'title' ? 'p-30-0 uni-center border-b' : 'd-b-c p-30-0 border-b'" v-for="(item, avi) in about.api_version" :key="avi">
        <text class="key-name" v-if="item.type === 'title'">{{ item.value }}</text>
        <block v-if="item.type === 'text'">
          <text class="key-name">{{ item.name }}</text>
          <text class="mr20 long-text">{{ item.value }}</text>
        </block>
      </view>
    </view>

    <view class="bg-white p-0-30 f30 mt20" v-if="about.view_version && about.view_version.length > 0">
      <view :class="item.type === 'title' ? 'p-30-0 uni-center border-b' : 'd-b-c p-30-0 border-b'" v-for="(item, vvi) in about.view_version" :key="vvi">
        <text class="key-name" v-if="item.type === 'title'">{{ item.value }}</text>
        <block v-if="item.type === 'text'">
          <text class="key-name">{{ item.name }}</text>
          <text class="mr20 long-text">{{ item.value }}</text>
        </block>
      </view>
    </view>

    <view class="btns p30"><button :style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}" type="default" @click="goBack">{{$nw("返回")}}</button></view>
	</view>
</template>

<script>
import version from 'version.json';
export default {
  data() {
    return {
      about: {
        about_banner: {
          file_id: '',
          file_path: '',
        },
        user: {
          user_id: '',
          nickName: '',
          avatarUrl: '',
        },
        device: [],
        api_version: [],
        view_version: [],
      },
      systemInfoSync: {},
      deviceInfo: {},
      windowInfo: {},
      appBaseInfo: {},
      user_id: '',
    }
  },
  computed: {
	  getbutton() {
		return this.setButton().button
	  },
  },
  onLoad() {
    this.user_id = uni.getStorageSync('user_id')
    this.systemInfoSync = uni.getSystemInfoSync()
    this.deviceInfo = uni.getDeviceInfo()
    this.windowInfo = uni.getWindowInfo()
    this.appBaseInfo = uni.getAppBaseInfo()
    this.getData()
  },
  methods: {
    getData() {
      let self = this
      uni.showLoading({
        title: self.$nw('加载中'),
      })
      self._postJson('user.index/about', {
        user_id: self.user_id,
        systemInfoSync: self.systemInfoSync,
        deviceInfo: self.deviceInfo,
        windowInfo: self.windowInfo,
        appBaseInfo: self.appBaseInfo,
        platform: self.getPlatform(),
        view_version: version,
		port_id:self.port_id
      }, function (res) {
        console.log(res)
        self.about = self.$u.deepMerge(self.about, res.data)
        uni.hideLoading()
      })
    },
    goBack() {
      uni.navigateBack()
    },
  },
}
</script>

<style lang="scss" scoped>
.address-form .key-name {
  width: 200 rpx;
}

.address-form .btn-red {
  height: 88 rpx;
  line-height: 88 rpx;
  border-radius: 44 rpx;
  box-shadow: 0 8 rpx 16 rpx 0 rgba(226, 35, 26, .6);
}

.d-e-c image {
  width: 100 rpx;
  height: 100 rpx;
  border-radius: 55 rpx;
}

.mr20 {
  color: #C5C5C5;
}

.p30 {
  margin-top: 100 rpx;
}

.btns button {
  height: 90 rpx;
  line-height: 90 rpx;
  font-size: 34 rpx;
  border-radius: 45 rpx;
  background: $dominant-color;
  color: #ffffff;
}

.diy-navbar {
  margin: 20rpx;
  border-radius: 20rpx;
  background: #FFFFFF;
  box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
}

.diy-navbar .item {
  position: relative;
}
.long-text {
  max-width: 215px;
  word-break: break-all;
}
</style>
