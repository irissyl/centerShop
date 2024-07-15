<template>
  <view class=" pb100">
    <form @submit="formSubmit" @reset="formReset">
      <view class="bg-white p-0-30 f30">
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("活动名")}}：</text>
          <view class="p-30-0">
            {{ form.product.product_name }}
          </view>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("图片")}}：</text>
          <view class="upload-list d-s-c">
            <view class="item">
              <image :src="form.product.image[0].file_path" mode="aspectFit"></image>
            </view>
          </view>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("拼团价")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="assemble_price" type="text" v-model="form.assemble_price" :placeholder="$nw('请输入')"/>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("拼团库存")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="stock" type="text" v-model="form.stock" :placeholder="$nw('请输入')"/>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("开团人数")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="assemble_num" type="text" v-model="form.assemble_num" :placeholder="$nw('请输入')"/>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("限购数量")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="limit_num" type="text" v-model="form.limit_num" :placeholder="$nw('请输入')"/>
        </view>

        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("销售价")}}：</text>
          <view class="p-30-0">
            {{ form.line_price }}
          </view>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("供货价")}}：</text>
          <view class="p-30-0">
            {{ sku.product_supply_price }}
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
      form: {},
      model: {},
      sku: {}
    }
  },
  onLoad(e) {
    this.assemble_product_id = e.assemble_product_id ? e.assemble_product_id : 0
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
      let assemble_product_id = self.assemble_product_id
      uni.showLoading({
        title: self.$nw("加载中")
      });
      self._get('plus.supply.assemble/edit', {assemble_product_id: assemble_product_id}, function (res) {
            console.log(res)
            self.form = res.data.detail;
            self.sku = res.data.detail.assembleSku[0].productSku
            console.log(self.sku)
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
      var formdata = self.form;
      var params = {assemble_product_id: self.assemble_product_id};
      params.product_data = JSON.stringify(formdata)


      if (formdata.assemble_price == 0) {
        self.alert(self.$nw("请输入拼团价"));
        return false;
      }
      if (formdata.assemble_price < parseFloat(self.sku.product_supply_price)) {
        self.alert(self.$nw("拼团价不能低于供货价"));
        return false;
      }
      if (formdata.stock == 0) {
        self.alert(self.$nw("请输入拼团库存"));
        return false;
      }
      if (formdata.assemble_num == 0) {
        self.alert(self.$nw("请输入开团人数"));
        return false;
      }
      if (formdata.limit_num == 0) {
        self.alert(self.$nw("请输入限购数量"));
        return false;
      }
      uni.showLoading({
        title:  self.$nw("正在提交"),
        mask: true
      });
      self._post('plus.supply.assemble/edit', params, function (res) {
        uni.hideLoading();
        uni.showModal({
          title:  self.$nw("正在提交"),
          content: res.msg,
          showCancel: false,
          success: function () {
            uni.redirectTo({
              url: '/plus/pages/supply/product/assemble/product?assemble_activity_id=' + formdata.assemble_activity_id,
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
