<template>
  <view>
    <view class="top-tabbar">
      <view :class="Number(state_active) === 0 ? 'tab-item active' : 'tab-item'" :style="[active(state_active, 0)]" @click="stateFunc(0)">{{$nw("未使用")}}</view>
      <view :class="Number(state_active) === 1 ? 'tab-item active' : 'tab-item'" :style="[active(state_active, 1)]" @click="stateFunc(1)">{{$nw("已使用")}}</view>
      <view :class="Number(state_active) === 2 ? 'tab-item active' : 'tab-item'" :style="[active(state_active, 2)]" @click="stateFunc(2)">{{$nw("已过期")}}</view>
    </view>

    <!--列表-->
    <scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollViewHigh + 'px;'" lower-threshold="50" @scrolltoupper="scrolltoupperFunc" @scrolltolower="scrolltolowerFunc">
      <view class="p30 bg-white">
        <view class="item-wrap mb20" v-for="(item, index) in dataList" :key="index">
          <view :class="item.is_expire==0&&item.is_use==0 ? 'coupon-item coupon-item-'+item.color.text : 'coupon-item coupon-item-gray'" @click="lookRule(item)">
            <!--装饰用的小圆-->
            <view class="circles">
              <text v-for="(circle, num) in 8" :key="num"></text>
            </view>
            <view class="info">
              <view>{{ item.coupon_type.text }}</view>
            </view>
            <view class="operation d-b-c">
              <view class="flex-1 coupon-content">
                <view>
                  <template v-if="Number(item.coupon_type.value) === 10 ">
                    <view class="price">
                      <text>{{$nw("¥")}}</text>
                      <text class="f40 fb">{{ item.reduce_price }}</text>
                    </view>
                  </template>
                  <template v-if="Number(item.coupon_type.value) === 20 ">
                    <text class="f40 fb">{{ item.discount }}</text>
                    <text>{{$nw("折")}}</text>
                  </template>
                </view>
                <view class="f30">{{ item.name }}</view>
                <view class="f24">
                  <template v-if="Number(item.expire_type) === 10">
                {{$nw("有效期")}}：{{$nw("剩余")}}{{ item.expire_day }}{{$nw("天")}}
                  </template>
                  <template v-if="Number(item.expire_type) === 20">
                    {{$nw("有效期")}}：{{ item.start_time.text }}{{$nw("至")}}{{ item.end_time.text }}
                  </template>
                </view>
              </view>

              <view class="right-box d-c-c">
                <view type="default" v-if="item.state.value>0" class="f30">
                  {{$nw("未使用")}}
                </view>
                <view v-else class="f30">
                  <text>{{ item.state.text }}</text>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="">
          <view class="bottom-refresh">
            <view class="d-c-c p30" v-if="loading">
              <text class="gray3">{{$nw("加载中")}}...</text>
            </view>
            <view class="d-c-c p30" v-if="no_more ">
              <text class="gray3">~~{{$nw("加载完成")}}~~</text>
            </view>
          </view>
        </view>
        <view class="d-c-c p30" v-if="dataList && dataList.length < 1 && !loading">
          <text class="iconfont icon-wushuju"></text>
          <text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
        </view>

        <!-- 底部转让  -->
      <!--  <view v-if="transfer_setting" style="width: 90%;height: 2.5rem;background-color: #FFFFFF;position: fixed;bottom: 0;z-index: 100;">
          <button @click="log()" style="background-color: #FFFFFF ; font-size: 15px; float: left; width: 40%;height: 1.5rem;line-height: 1.5rem;margin-top: .5rem;">{{$nw("转让记录")}}</button>

          <button @click="transfer()" style="background-color: #FF0036 ; font-size: 15px;color: #FFFFFF; float: right; width: 40%;height: 1.5rem;line-height: 1.5rem;margin-top: .5rem;">{{$nw("我要转让")}}</button>
        </view> -->
        <!-- <view style="width: 100%;height: 2.5rem;background-color: #FFFFFF;position: fixed;bottom: 0;z-index: 99;margin-left: -1rem;"></view> -->

      </view>
    </scroll-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      /*手机高度*/
      phoneHeight: 0,
      /*可滚动视图区域高度*/
      scrollViewHigh: 0,
      /*状态选中*/
      state_active: 0,
      /*列表*/
      dataList: {},
      no_more: false,
      loading: false,
      data_type: 'not_use',
      transfer_setting: true,
    };
  },
  mounted() {
    this.setGlobalColor()
    /*初始化*/
    this.init();
   
  },
  onShow() {
  	/*获取数据*/
  	this.getData();
  },
  computed: {
    active() {
      const that = this
      return (state_active, value) => {
        if (state_active === value) {
          return Object.assign(this.setColor(true), {'border-bottom': '2px solid ' + this.getMainColor()})
        }
      }
    },
  },
  methods: {
    /*初始化*/
    init() {
      let self = this;
      uni.getSystemInfo({
        success(res) {
          self.phoneHeight = res.windowHeight;
          // 计算组件的高度
          let view = uni.createSelectorQuery().select('.top-tabbar');
          view.boundingClientRect(data => {
            let h = self.phoneHeight - data.height;
            self.scrollViewHigh = h;
          }).exec();
        }
      });
    },
    /*获取数据*/
    getData() {
      let self = this;
      uni.showLoading({
        title: self.$nw("加载中")
      });
      let data_type = self.data_type;
      self._get('user.coupon/lists', {
        data_type: data_type,
      }, function (res) {
        uni.hideLoading();
        self.dataList = res.data.list;
      });
    },
    /*状态切换*/
    stateFunc(e) {
      let self = this;
      if (self.state_active != e) {
        if (e == 0) {
          self.data_type = 'not_use';
        }
        if (e == 1) {
          self.data_type = 'is_use';
        }
        if (e == 2) {
          self.data_type = 'is_expire';
        }
        self.state_active = e;
        self.getData();
      }
    },
    /*可滚动视图区域到顶触发*/
    scrolltoupperFunc() {
      console.log('滚动视图区域到顶');
    },
    /*可滚动视图区域到底触发*/
    scrolltolowerFunc() {
      console.log('滚动视图区域到底');
    },
    /*查看规则*/
    lookRule(item) {
      item.rule = true;
    },
    /*关闭规则*/
    closeRule(item) {
      item.rule = false;
    },
    /* 转让优惠券  */
    transfer() {
      let self = this
      if (self.dataList.length < 1) {
        uni.showModal({
          title: self.$nw("提示"),
          content: self.$nw("您还没有优惠券"),
          showCancel: false,
        });
        return false;
      }
      uni.navigateTo({
        url: '/user/pages/my-coupon-transfer/my-coupon-transfer'
      });
    },
    /* 转让记录 */
    log() {
      uni.navigateTo({
        url: '/user/pages/my-coupon-log/my-coupon-log'
      })
    }

  }
}
</script>

<style></style>
