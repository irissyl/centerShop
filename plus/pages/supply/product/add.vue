<template>
  <view class=" pb100">
    <form @submit="formSubmit" @reset="formReset">
      <view class="bg-white p-0-30 f30">
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("商品名")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="product_name" type="text" v-model="form.product_name" 
		  :placeholder="$nw('请输入')"/>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("商品编号")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="product_no" type="text" v-model="form.product_no" 
		  :placeholder="$nw('请输入')"/>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("商品分类")}}：</text>
          <view class="uni-list-cell-db">
            <picker mode="selector" value="" :range="category" range-key='name' @change="bindCatChange">
              <view class="uni-input">{{ cat_name }}</view>
            </picker>
          </view>
        </view>
        <!--上传图片-->
        <view class=" bg-white">
          <view class="group-hd">
            <view class="left">
              <text class="min-name">{{$nw("商品图片")}}：</text>
              <text class="gray9">({{$nw("最多6张")}})</text>
            </view>
          </view>
          <view class="upload-list d-s-c">
            <view class="item" v-for="(imgs,img_num) in form.image" :key="img_num" @click="deleteFunc(imgs)">
              <image :src="imgs.file_path" mode="aspectFit"></image>
            </view>
            <view class="item d-c-c d-stretch" v-if="form.image.length<6">
              <view class="upload-btn d-c-c d-c flex-1" @click="openUpload()">
                <text class="icon iconfont icon-xiangji f34"></text>
                <text class="gray9">{{$nw("上传图片")}}</text>
              </view>
            </view>
          </view>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("销售价")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="product_price" type="text" v-model="form.sku.product_price" 
		  :placeholder="$nw('请输入')" />
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("成本价")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="product_supply_price" type="text" v-model="form.sku.product_supply_price" 
		   :placeholder="$nw('请输入')" />
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("划线价")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="line_price" type="text" v-model="form.sku.line_price"  :placeholder="$nw('请输入')"/>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("总库存")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="stock_num" type="text" v-model="form.sku.stock_num"  :placeholder="$nw('请输入')"/>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("运费模板")}}：</text>
          <view class="uni-list-cell-db">
            <picker mode="selector" value="" :range="delivery" range-key='name' @change="bindDeliveryChange">
              <view class="uni-input">{{ delivery_name }}</view>
            </picker>
          </view>
        </view>
        <view class="d-s-c border-b-e" @click="gotoContent">
          <text class="key-name">{{$nw("商品详情")}}：</text>
          <view class="m20 flex-1 p-30-0" style="width: 80%;text-align: right;">{{$nw("plus.detail.详情")}}</view>
        </view>
      </view>
      <view class="p30">
        <button form-type="submit" type="default" class="btn-red f30 mt30">{{$nw("下一步")}}</button>
      </view>
    </form>
    <view class="popup-bg" v-if="isUpload">
      <view class="wechat-box">
        {{$nw("图片正在上传中")}}...
      </view>
    </view>
    <!--上传图片-->
    <!-- <Upload v-if="isUpload" @getImgs="getImgsFunc"></Upload> -->
  </view>


</template>

<script>
import Upload from '@/components/upload/upload.vue';

export default {
  components: {
    Upload,
  },
  data() {
    return {
      imageList: [],
      gongsijieshao: '',
      images: [],
      /*是否加载完成*/
      loadding: true,
      /*是否打开上传图片*/
      isUpload: false,
      cat_name: this.$nw("选择分类"),
      delivery_name: this.$nw("选择运费模板"),
      category: [],
      delivery: [],
      form: {
        /*商品名称*/
        product_name: '',
        product_days: '',
        /*商品配送方式 */
        delivery_type: [],
        /*商品编码*/
        product_no: '',
        /*商品内部编码*/
        product_diy_no: '',
        /*商品分类*/
        category_id: null,
        // 品牌
        brand_id: null,
        /*商品图片*/
        image: [],
        /*商品卖点*/
        selling_point: '',
        /*规格类别,默认10单规格，20多规格*/
        spec_type: 10,
        /*库存计算方式,默认20付款减库存，10下单减库存*/
        deduct_stock_type: 20,
        sale_time: '',
        delivery_time: '',
        /*单规格*/
        sku: {
          /*产品价格*/
          product_price: 0,
          /*产品供货价格*/
          product_supply_price: 0,
          /*产品划线价*/
          line_price: 0,
          /*库存数量*/
          stock_num: 0,
          /*商品重量*/
          product_weight: '0',
        },
        /*商品详情内容*/
        content: '',
        /*运费模板ID*/
        delivery_id: '',
        /*商品状态*/
        product_status: 10,
        // 商品链接状态
        link_status: 0,
        // 链接显示开始时间
        link_start_at: '',
        // 链接显示结束时间
        link_end_at: '',
        /*初始销量*/
        sales_initial: 0,
        /*商品排序，默认100*/
        product_sort: 100,
        setting: {
          buy_auth: {
            show_price_id: [],
            buy_auth_id: [],
            tips: '',
            name: this.$nw("跳转连接"),
            linkUrl: ''
          },
        },
        commission_type: [],
        automatic_shelves: 0,
      },
      from_url: ''
    }
  },
  onLoad(e) {
    this.from_url = e.from_url ? e.from_url : ''
    uni.setStorageSync('goods_content', '')
  },
  onShow() {
    this.setGlobalColor()
    console.log(100)
    var detail = uni.getStorageSync('goods_content');
    console.log(detail)
    if (detail) {
      this.form.content = detail
    }
  },
  mounted() {
    /*获取订单详情*/
    this.getData();
  },
  methods: {
    bindCatChange(e) {
      var index = e.detail.value
      let self = this;
      self.form.category_id = self.category[index].category_id
      self.cat_name = self.category[index]['name']
    },
    bindDeliveryChange(e) {
      var index = e.detail.value
      let self = this;
      self.form.delivery_id = self.delivery[index].delivery_id
      self.delivery_name = self.delivery[index]['name']
    },
    gotoContent() {
      uni.navigateTo({
        url: '/plus/pages/supply/product/part/content'
      })
    },
    /*获取数据*/
    getData() {
      let self = this;
      uni.showLoading({
        title: self.$nw("加载中")
      });
      self._get('plus.supply.product/add', {}, function (res) {

            var category = res.data.catgory
            category.forEach(function (item) {
              self.category.push(item);
              if (item.child) {
                item.child.forEach(function (child) {
                  self.category.push(child);
                })
              }
            })
            self.delivery = res.data.delivery
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
      var params = {};
      formdata.certify_type = self.type;
      params.product_data = JSON.stringify(formdata)

      if (formdata.product_name == '') {
        self.alert(self.$nw("请输入名称"));
        return false;
      }
      if (!formdata.category_id) {
        self.alert(self.$nw("请选择分类"));
        return false;
      }
      if (formdata.sku.product_price == 0) {
        self.alert(self.$nw("请输入销售价"));
        return false;
      }
      if (formdata.sku.product_supply_price == 0) {
        self.alert(self.$nw("请输入供货价格"));
        return false;
      }
      if (formdata.sku.stock_num == 0) {
        self.alert(self.$nw("请输入库存"));
        return false;
      }
      if (formdata.delivery_id == 0) {
        self.alert(self.$nw("请选择运费模板"));
        return false;
      }
      uni.showLoading({
        title: self.$nw("正在提交"),
        mask: true
      });
      self._post('plus.supply.product/add', params, function (res) {
        uni.hideLoading();
        uni.showModal({
          title: self.$nw("提示"),
          content: res.msg,
          showCancel: false,
          success: function () {
            uni.redirectTo({
              url: '/plus/pages/supply/product/list/list',
            });
          }
        });
      });
    },

    /*打开上传图片*/
    openUpload(f_key) {
      this.file_key = f_key;
      let self = this;
      uni.chooseImage({
        count: 9, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: function (res) {
          self.isUpload = true;
          uni.showLoading({
            title: self.$nw("图片上传中")
          });
          self.uploadFile(res.tempFilePaths);
        },
        fail: function (res) {
          self.isUpload = false;
          // self.$emit('getImgs',null);
        },
        complete: function (res) {

        }
      });
    },
    /*上传图片*/
    uploadFile: function (tempList) {
      let self = this;
      let i = 0;
      let img_length = tempList.length;
      let params = {
        token: uni.getStorageSync('token'),
        app_id: self.getAppId()
      };
      self.imageList = [];

      tempList.forEach(function (filePath, fileKey) {
        uni.uploadFile({
          url: self.websiteUrl + '/index.php?s=/api/file.upload/image',
          filePath: filePath,
          name: 'iFile',
          formData: params,
          success: function (res) {
            let result = typeof res.data === 'object' ? res.data : JSON.parse(res.data);
            if (result.code === 1) {
              self.imageList.push(result.data);
            }
          },
          complete: function () {
            i++;
            if (img_length === i) {
              // 所有文件上传完成
              self.getImgsFunc(self.imageList);

            }
          }
        });
      });
    },

    /*获取上传的图片*/
    getImgsFunc(e) {
      let self = this;
      self.isUpload = false;
      if (e && typeof (e) != 'undefined') {
        let this_length = self.form.image.length,
            upload_length = e.length;
        if (this_length + upload_length < 7) {
          self.form.image = self.form.image.concat(e);
        } else {
          let leng = 6 - this_length;
          for (let i = 0; i < leng; i++) {
            self.form.image.push(e[i]);
          }
        }
      }
      uni.hideLoading();
    },
    /*删除图片*/
    deleteFunc(e) {
      this.form.image.splice(e, 1);
    }
  }
}
</script>

<style>
.popup-bg {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 98;
}

.wechat-box {
  margin-top: 50%;
  text-align: center;
  color: #fff;
}
</style>
