<template>
  <view>
    <view class="uni-center mt20">{{$nw("缓存管理")}}</view>
    <view class="p30">
      <view v-for="(item, index) in lsList" :key="index" class="mt30">
        <u--text type="primary" :text="del" @click="deleteCache(item.key)"></u--text>
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
      lsList: [],
	  del:this.$nw("删除")
    };
  },
  onLoad() {
    this.asyncLS()
  },
  mounted() {

  },
  methods: {
    asyncLS() {
      this.lsList = this.getAllLS()
    },
    getAllLS() {
      let len = localStorage.length;  // 获取长度
      console.log(len) // 输出5
      let arr = []; // 定义数据集
      for(let i = 0; i < len; i++) {
        // 获取key 索引从0开始
        let getKey = localStorage.key(i);
        if (getKey) {
          // 获取key对应的值
          let getVal = localStorage.getItem(getKey);
          // 放进数组
          arr[i] = {
            'key': getKey,
            'val': getVal,
          }
        }
      }
      return arr
    },
    deleteCache(key) {
      uni.removeStorageSync(key)
      this.asyncLS()
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
    }
  }
};
</script>

<style lang="scss" scoped>

</style>
