<template>
  <view>
    <view class="uni-center mt20">{{$nw("工具合集")}}</view>
    <!--<view class="p30">-->
    <!--  <view v-for="(item, index) in tools" :key="index" class="mt30" @click="$u.route(item.url)">-->
    <!--    <view class="border-b">{{ item.name }}</view>-->
    <!--  </view>-->
    <!--</view>-->

    <u-grid :border="true" col="4">
      <u-grid-item v-for="(listItem,listIndex) in tools" :key="listIndex" @click="$u.route(listItem.url)">
        <u-icon :customStyle="{paddingTop:20+'rpx'}" :name="listItem.name" :size="40"></u-icon>
        <text class="grid-text">{{listItem.title}}</text>
      </u-grid-item>
    </u-grid>


  </view>
</template>

<script>

import utils from "@/common/utils"
export default {
  data() {
    return {
      tools: [
        {name: 'eye-fill', title: this.$nw("缓存管理"), url: "main/pages/utils/clear/clear",},
        {name: 'trash-fill', title: this.$nw("一键清缓存"), url: "main/pages/utils/clear/clearAtOnce",},
      ],
    };
  },
  methods: {
    copy(val) {
      let self = this
      utils.copy({
        content: val,
        success: function () {
			self.$u.toast(self.$nw("复制成功"), 1000)
         },
         fail: function () {
            self.$u.toast(self.$nw("失败了"), 1500)
         }
      })
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
