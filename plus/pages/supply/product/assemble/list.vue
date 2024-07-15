<template>
  <view>
    <view class="top-box">
      <!-- 搜索框 -->
      <view class="index-search-box nav-item">
        <button class="btn-red" :style="[active]" @click="addAssemble()">{{$nw("添加拼团活动")}}</button>
      </view>
    </view>
    <view class="prodcut-list-wrap">
      <scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50" @scrolltolower="scrolltolowerFunc">
        <view :class="topRefresh?'top-refresh open':'top-refresh'">
          <view class="circle" v-for="(circle,n) in 3" :key="n"></view>
        </view>

        <view class="list">
          <view v-for="(item, index) in listData" :key="index">
            <view class="item">
              <view class="product-cover">
                <image :src="item.file.file_path" mode="aspectFill"></image>
              </view>
              <view class="product-info">
                <view class="product-title">
                  {{$nw("活动名称")}}：{{ item.title }}
                </view>
                <view class="already-sale">
                  <text>{{$nw("开始时间")}}{{ item.start_time_text }}</text>
                </view>
                <view class="already-sale">
                  <text>{{$nw("结束时间")}}{{ item.end_time_text }}</text>
                </view>
              </view>
            </view>
            <view class="order-bts">
              <button class="btn-blue" @click="gotoList(item.assemble_activity_id)">{{$nw("商品管理")}}</button>
              <button @click="editActivity(item.assemble_activity_id)">{{$nw("修改")}}</button>
              <button @click="deleteActivity(index,item.assemble_activity_id)">{{$nw("删除")}}</button>


            </view>
          </view>
        </view>
        <!-- 没有记录 -->
        <view class="d-c-c p30" v-if="listData.length==0 && !loading">
          <text class="iconfont icon-wushuju"></text>
          <text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
        </view>
        <uni-load-more v-else :loadingType="loadingType"></uni-load-more>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import uniLoadMore from "@/components/uni-load-more.vue";

export default {
  components: {
    uniLoadMore
  },
  data() {
    return {
      /*手机高度*/
      phoneHeight: 0,
      /*可滚动视图区域高度*/
      scrollviewHigh: 0,
      /*顶部刷新*/
      topRefresh: false,
      /*底部加载*/
      loading: true,
      /*没有更多*/
      no_more: false,
      /*类别选中*/
      type_active: 0,
      /*价格选中*/
      price_top: false,
      /*商品列表*/
      listData: [],
      /*当前页面*/
      page: 1,
      category_id: 0,
      search: '',
      sortType: '',
      sortPrice: 0,
      list_rows: 10,
      last_page: 0,
    };
  },
  computed: {

    /*加载中状态*/
    loadingType() {
      if (this.loading) {
        return 1;
      } else {
        if (this.listData.length != 0 && this.no_more) {
          return 2;
        } else {
          return 0;
        }
      }
    },

    active() {
      return Object.assign(this.setBackgroundColor(), this.setColor())
    },

  },
  onLoad(e) {
    // /*分类id*/
    this.category_id = e.category_id;
    if (e.search) {
      this.search = e.search;
    }
    if (e.sortType) {
      this.sortType = e.sortType;
    }
    if (e.sortPrice) {
      this.sortPrice = e.sortPrice;
    }
    this.supply_id = e.supply_id ? e.supply_id : 0;
  },
  mounted() {
    this.setGlobalColor()
    this.init();
    /*获取产品列表*/
    this.getData();
  },
  onPullDownRefresh() {
    /*下拉到顶，页面值还原初始化*/
    this.restoreData();
    this.getData();
  },
  methods: {
    /*初始化*/
    init() {
      let _this = this;
      uni.getSystemInfo({
        success(res) {
          _this.phoneHeight = res.windowHeight;
          // 计算组件的高度
          let view = uni.createSelectorQuery().select('.top-box');
          view.boundingClientRect(data => {
            let h = _this.phoneHeight - data.height;
            _this.scrollviewHigh = h;
          }).exec();
        }
      });
    },
    /*还原初始化*/
    restoreData() {
      this.listData = [];
      this.category_id = 0;
      this.search = '';
      this.sortType = '';
      this.sortPrice = 0;
    },
    addAssemble() {
      uni.navigateTo({
        url: '/plus/pages/supply/product/assemble/add'
      });
    },
    editActivity(assemble_activity_id) {
      uni.navigateTo({
        url: '/plus/pages/supply/product/assemble/edit?assemble_activity_id=' + assemble_activity_id
      });
    },

    /*类别切换*/
    tabTypeFunc(e) {
      let self = this;
      self.listData = [];
      self.page = 1;
      self.no_more = false;
      self.loading = true;
      if (e == 2) {
        self.price_top = !this.price_top;
        if (self.price_top == true) {
          self.sortPrice = 0;
        } else {
          self.sortPrice = 1;
        }
        self.sortType = 'price';
      } else if (e == 1) {
        self.price_top = !this.price_top;
        self.sortType = 'sales';
      }
      self.type_active = e;
      self.getData();
    },

    /*获取数据*/
    getData() {
      let self = this;
      let page = self.page;
      let list_rows = self.list_rows;
      let category_id = self.category_id;
      let supply_id = self.supply_id;
      let search = self.search;
      let sortType = self.sortType;
      let sortPrice = self.sortPrice;
      self.loading = true;
      self._get('plus.supply.assemble/active', {}, function (res) {
        self.loading = false;
        console.log(res)
        self.listData = self.listData.concat(res.data.list);
		self.listData = self.getUnique(self.listData,"assemble_activity_id");
        self.no_more = true;
      }, function (res) {
        uni.redirectTo({
          url: '/user/pages/index/index'
        });
      });
    },


    /*跳转产品列表*/
    gotoList(e) {
      let url = 'plus/pages/supply/product/assemble/product?assemble_activity_id=' + e
      this.gotoPage(url);
    },
    /*可滚动视图区域到底触发*/
    scrolltolowerFunc() {

      let self = this;
      self.bottomRefresh = true;
      self.page++;
      self.loading = true;
      if (self.page > self.last_page) {
        self.loading = false;
        self.no_more = true;
        return;
      }
      self.getData();
    },
    deleteActivity(index, assemble_activity_id) {
      let self = this;

      uni.showModal({
        title: self.$nw("提示"),
        content: self.$nw("确认删除？"),
        success: function (res) {

          if (res.confirm) {
            uni.showLoading({
              title: self.$nw("处理中")
            });
            self._post('plus.supply.assemble/delete', {
              assemble_activity_id: assemble_activity_id,
            }, function (res) {
              console.log(res)
              self.listData.splice(index, 1)
              uni.hideLoading();
            });
          } else if (res.cancel) {
            console.log('用户点击取消');
          }
        }
      })

    },

  }
};
</script>

<style lang="scss">
.nav-item {
  display: flex;
}

.nav-item .index-search {
  width: 80%;
}

.nav-item button {
  margin-left: 10rpx;
}

.inner-tab {
  position: relative;
  height: 80rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;
  border-bottom: 1px solid #dddddd;
  background: #ffffff;
  box-shadow: 0 8rpx 12rpx 0 rgba(0, 0, 0, .1);
  z-index: 9;
}

.inner-tab .item {
  flex: 1;
  font-size: 30rpx;
}

.inner-tab .item.active,
.inner-tab .item .arrow.active .iconfont {
  color: $dominant-color;
}

.inner-tab .item .box {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.inner-tab .item .arrows {
  margin-left: 10rpx;
  line-height: 0;
}

.inner-tab .item .iconfont {
  line-height: 24rpx;
  font-size: 24rpx;
}

.inner-tab .item .arrow,
.inner-tab .item .svg-icon {
  width: 20rpx;
  height: 20rpx;
}

.prodcut-list-wrap .list {
  background: #FFFFFF;
}

.prodcut-list-wrap .list .item {
  padding: 20rpx;
  display: flex;
}

.prodcut-list-wrap .product-cover,
.prodcut-list-wrap .product-cover image {
  width: 220rpx;
  height: 220rpx;
}

.prodcut-list-wrap .product-info {
  flex: 1;
  margin-left: 30rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.prodcut-list-wrap .product-title {
  display: -webkit-box;
  line-height: 40rpx;
  height: 80rpx;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  font-size: 32rpx;
}

.prodcut-list-wrap .already-sale {
  margin-top: 20rpx;
  color: #999;
  font-size: 24rpx;
}

.prodcut-list-wrap .already-sale > text {
  padding: 6rpx 10rpx;
  background-color: #f2f2f7;
}

.prodcut-list-wrap .price {
  color: $dominant-color;
  font-size: 24rpx;
}

.prodcut-list-wrap .price .num {
  margin-left: 6rpx;
  padding: 0 4rpx;
  font-size: 40rpx;
}

.prodcut-list-wrap .list .order-bts {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 16rpx solid #f6f6f6;
}

.prodcut-list-wrap .list .order-bts button {
  margin: 0;
  padding: 0 20rpx;
  height: 60rpx;
  line-height: 60rpx;
  margin-right: 20rpx;
  margin-bottom: 20rpx;
  // border-radius: 30rpx;
  font-size: 24rpx;
  border: 1px solid #CCCCCC;
  white-space: nowrap;
  // background: #FFFFFF;
}

.prodcut-list-wrap .list .order-bts button::after {
  display: none;
}

.prodcut-list-wrap .list .order-bts button.btn-border-red {
  border: 1px solid $dominant-color;
  font-size: 24rpx;
  color: $dominant-color;
}

.prodcut-list-wrap .list .order-bts button.btn-red {
  background: $dominant-color;
  border: 1px solid $dominant-color;
  font-size: 24rpx;
  color: #FFFFFF;
}
</style>
