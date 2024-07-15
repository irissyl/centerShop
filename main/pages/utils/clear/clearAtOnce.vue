<template>
  <view>
    <view class="uni-center mt20">{{$nw("已删缓存列表")}}</view>
    <view class="p30">
      <view v-for="(item, index) in lsList" :key="index" class="mt30">
        <view class="gray" @click="copy(item.key)">key: {{ item.key }}</view>
        <u--text :text="item.val" :lines="3" @click="copy(item.val)"></u--text>
      </view>
    </view>
  </view>
</template>

<script>
import utils from "@/common/utils"
export default {
  data() {
    return {
      lsList: []
    };
  },
  onShow() {
    this.deleteLS()
  },
  methods: {
    deleteLS() {
      let self = this
      let len = localStorage.length;  // 获取长度
      console.log("缓存大约有: " + len + "个")
      let arr = []; // 定义数据集
      for(let i = 0; i < len; i++) {
        // 获取key 索引从0开始
        let getKey = localStorage.key(i)
        if (getKey) {
          arr[i] = {
            'key': getKey,
            'val': localStorage.getItem(getKey),
          }
          uni.removeStorageSync(getKey)
        }
      }
      self.lsList = arr
    },
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
    },
  }
};
</script>
