<template>
  <view class=" pb100">
    <form @submit="formSubmit" @reset="formReset">
      <view class="bg-white p-0-30 f30">
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("活动名")}}：</text>
          <view class="p-30-0">
            {{ activity.title }}
          </view>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("开始时间")}}：</text>
          <view class="p-30-0">
            {{ activity.start_time_text }}
          </view>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("结束时间")}}：</text>
          <view class="p-30-0">
            {{ activity.end_time_text }}
          </view>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("商品名")}}：</text>
          <view class="p-30-0">
            {{ form.product_name }}
          </view>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("图片")}}：</text>
          <view class="upload-list d-s-c">
            <view class="item">
              <image :src="form.product_image" mode="aspectFit"></image>
            </view>
          </view>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("拼团价")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="assemble_price" type="number" min=0 v-model="form.assemble_price" :placeholder="$nw('请输入')"/>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("拼团库存")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="assemble_stock" type="number" min=0 v-model="form.assemble_stock" :placeholder="$nw('请输入')"/>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("开团人数")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="assemble_num" type="number" min=0 v-model="form.assemble_num" :placeholder="$nw('请输入')"/>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("限购数量")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="limit_num" type="number" min=0 v-model="form.limit_num" :placeholder="$nw('请输入')"/>
        </view>

        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("销售价")}}：</text>
          <view class="p-30-0">
            {{ form.product_price }}
          </view>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("供货价")}}：</text>
          <view class="p-30-0">
            {{ form.sku.product_supply_price }}
          </view>
        </view>
      </view>
      <view class="p30">
        <button form-type="submit" type="default" class="btn-red f30 mt30">{{$nw("确定")}}</button>
      </view>
    </form>

  </view>


</template>

<script>
export default {
  components: {},
  data() {
    return {

      /*是否加载完成*/
      loadding: true,
      /*是否打开上传图片*/
      form: {
        // 商品名
        product_name: '',
        product_id: 0,
        // 拼团价格
        assemble_price: '',
        // 拼团库存
        assemble_stock: '',
        // 拼团人数
        assemble_num: '',
        // 限购数量
        limit_num: '',
        // 销售价格
        product_price: '',
        sort: 100,
        // 规格
        sku: {
          product_id: 0,
          product_price: 0,
          product_sku_id: 0,
          product_supply_price: 0,
        }
      },
      model: {},
      activity: {}
    }
  },
  onLoad(e) {
    this.product_id = e.product_id ? e.product_id : 0
    this.assemble_activity_id = e.assemble_activity_id ? e.assemble_activity_id : 0
  },
  onShow() {
    this.setGlobalColor()
  },
  mounted() {
    /*获取订单详情*/
    this.getData();
  },
  methods: {
    /*获取数据*/
    getData() {
      let self = this;
      let product_id = self.product_id
      let assemble_activity_id = self.assemble_activity_id
      uni.showLoading({
        title: self.$nw("加载中")
      });
      self._get('plus.supply.assemble/detail', {
            product_id: product_id,
            assemble_activity_id: assemble_activity_id
          }, function (res) {
            console.log(res)
            var product = res.data.detail
            var activity = res.data.activity
            self.form.assemble_name = activity.title;
            self.form.product_name = product.product_name
            self.form.product_image = product.product_image
            self.form.product_price = product.product_price
            var sku = product.product_sku
            self.form.sku.product_sku_id = sku.product_sku_id
            self.form.sku.product_id = sku.product_id
            self.form.sku.product_supply_price = sku.product_supply_price
            self.activity = activity
            uni.hideLoading();

          }
      );
    },
    alert(msg = '') {
      uni.showToast({
        title: msg,
        duration: 1000,
        icon: 'none'
      });
    },
    /*提交表单*/
    formSubmit: function (e) {
      let self = this;
      var params = {
        product_id: self.product_id,
        assemble_activity_id: self.assemble_activity_id
      }
      self.form.product_id = self.product_id;
      params.product_data = JSON.stringify(self.form);


      if (!self.form.assemble_price) {
        self.alert( self.$nw("请输入拼团价"));
        return false;
      }
      if (self.form.assemble_price < parseFloat(self.form.sku.product_supply_price)) {
        self.alert( self.$nw("拼团价不能低于供货价"));
        return false;
      }
      if (!self.form.assemble_stock) {
        self.alert(self.$nw("请输入拼团库存"));
        return false;
      }
      if (!self.form.assemble_num) {
        self.alert( self.$nw("请输入开团人数"));
        return false;
      }
      if (!self.form.limit_num) {
        self.alert( self.$nw("请输入限购数量"));
        return false;
      }
      uni.showLoading({
        title: self.$nw("正在提交"),
        mask: true
      });
      self._post('plus.supply.assemble/add', params, function (res) {
        uni.hideLoading();
        uni.showModal({
          title: self.$nw("提示"),
          content: res.msg,
          showCancel: false,
          success: function () {
            uni.redirectTo({
              url: '/plus/pages/supply/product/assemble/product?assemble_activity_id=' + self.assemble_activity_id,
            });
          }
        });
      });
    },

  }
}
</script>

<style>

</style>
