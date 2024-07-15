<template>
  <view class="refund-apply pb100">
    <form @submit="formSubmit" @reset="formReset">
      <view class="one-product d-s-c p30 bg-white ">
        <view class="cover">
          <image :src="product.image.file_path" mode="aspectFit"></image>
        </view>
        <view class="flex-1">
          <view class="pro-info">{{ product.product_name }}</view>
          <view class="pt10 p-0-30 f24 gray9">
            <text class="">
              {{$nw("单价")}}：{{$nw("¥")}}{{ product.line_price }}
            </text>
            <text class="ml20">
              {{$nw("数量")}}：{{ product.total_num }}
            </text>
          </view>
        </view>
      </view>


			<!-- 服务类型 -->
			<view class="group bg-white">
				<view class="group-hd border-b-e">
					<view class="left">
						<text class="min-name"> {{$nw("服务类型")}}</text>
					</view>
				</view>
				<view class="d-s-c p-20-0">
					<button v-if="product.orderM.delivery_type.value!=30" type="default" :class="type==10?'btn-red-border':''" @click="tabType(10)"> {{$nw("退货/退款")}}</button>
					<button v-if="product.orderM.delivery_type.value==30" type="default" :class="type==30?'ml20 btn-red-border':'ml20'" @click="tabType(30)"> {{$nw("仅退款")}}</button>
				</view>
			</view>


      <!--申请原因-->
      <view class="group bg-white">
        <view class="group-hd">
          <view class="left">
            <text class="min-name"> {{$nw("申请原因")}}</text>
          </view>
        </view>
        <view class="d-s-c">
          <textarea class="p10 box-s-b border flex-1 f28 lh150" value="" name="content" 
		  :placeholder="$nw('请详细填写申请原因，注意保持商品的完好，建议您先与卖家沟通')"/>
        </view>
      </view>

      <!--退款金额-->
      <view class="group bg-white" v-if="type==10 || type==30">
        <view class="group-hd">
          <view class="left">
            <text class="min-name"> {{$nw("退款金额")}}：</text>
            <text class="red f30">{{$nw("¥")}}{{ product.total_price }}</text>
          </view>
        </view>
      </view>

      <!--上传图片-->
      <view class="group bg-white">
        <view class="group-hd">
          <view class="left">
            <text class="min-name"> {{$nw("上传凭证")}}</text>
            <text class="gray9">( {{$nw("最多6张")}})</text>
          </view>
        </view>
        <view class="upload-list d-s-c">
          <view class="item" v-for="(imgs,img_num) in images" :key="img_num" @click="deleteFunc(imgs)">
            <image :src="imgs.file_path" mode="aspectFit"></image>
          </view>
          <view class="item d-c-c d-stretch" v-if="images.length<6">
            <view class="upload-btn d-c-c d-c flex-1" @click="chooseImageFunc">
              <text class="icon iconfont icon-xiangji f34"></text>
              <text class="gray9"> {{$nw("上传图片")}}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="foot-btns">
        <button form-type="submit" class="btn-red" :style="[active]"> {{$nw("确认提交")}}</button>
        <!--<button type="primary" >确认提交</button>-->
      </view>
    </form>
    <!--上传图片-->
<!--    <Upload v-if="isUpload" @getImgs="getImgsFunc"></Upload>-->
  </view>


</template>

<script>
import Upload from '@/components/upload/upload.vue';

export default {
  components: {
    Upload
  },
  data() {
    return {
      /*是否加载完成*/
      loadding: true,
      indicatorDots: true,
      autoplay: true,
      interval: 2000,
      duration: 500,
      type: 10,
      /*是否打开上传图片*/
      isUpload: false,
      /*订单商品id*/
      order_product_id: 0,
      /*订单商品*/
      product: {},
      images: [],
      /*小程序订阅消息*/
      temlIds: [],
    }
  },
  onLoad(e) {
    this.order_product_id = e.order_product_id;
  },
  onShow() {
    this.setGlobalColor()
    /*获取订单详情*/
    this.getData();
  },
  mounted() {
    /*获取订单详情*/
    this.getData();
  },
  computed: {
    active() {
      return Object.assign(this.setBackgroundColor(), this.setColor())
    },
  },
  methods: {
    /*获取数据*/
    getData() {
      let self = this;
      uni.showLoading({
        title: self.$nw("加载中")
      });
      let order_product_id = self.order_product_id;
      self._get('user.refund/apply', {
            order_product_id: order_product_id,
            platform: self.getPlatform()
          }, function (res) {
            self.product = res.data.detail;
            self.temlIds = res.data.template_arr;
            if (self.product.orderM.delivery_type.value == 30) {
              self.type = 30;
            }
            uni.hideLoading();
          }
      );
    },
    /*切换服务类型*/
    tabType(e) {
      this.type = e;
    },

    /*提交表单*/
    formSubmit: function (e) {
      let self = this;
      var formdata = e.detail.value;
      formdata.type = self.type;
      formdata.order_product_id = self.order_product_id;
      formdata.images = JSON.stringify(self.images);
      let callback = function () {
        uni.showLoading({
          title:  self.$nw("正在提交"),
          mask: true
        });
        self._post('user.refund/apply', formdata, function (res) {
          uni.hideLoading();
          uni.showToast({
            title: res.msg,
            duration: 3000,
            complete: function () {
              uni.navigateTo({
                url: '/main/pages/order/refund/index/index',
              });
            }
          });
        });
      }
      self.subMessage(self.temlIds, callback);
    },

    /*删除图片*/
    deleteFunc(e) {
      this.images.splice(e, 1);
    },
    /*组件方式打开上传图片, 取消选择后没有对应操作，导致无法再次打开选择 */
    /*改非组件方式 打开相机或者相册，选择图片*/
    chooseImageFunc() {
      let self=this;

      uni.chooseImage({
        count: 9, //默认9
        sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album'], //从相册选择
        success: function(res) {
          //console.log(JSON.stringify(res.tempFilePaths));
          //let imgs=JSON.stringify(res.tempFilePaths);
          self.uploadFile(res.tempFilePaths);
        },
        fail:function(res){
          self.$emit('getImgs',null);
        }
      });
    },

    /*上传图片*/
    uploadFile: function(tempList) {
      let self = this;
      let params = {
        token: uni.getStorageSync('token'),
        app_id: self.getAppId()
      };
      uni.showLoading({
        title:  self.$nw("图片上传中")
      });
      console.log('tempList',tempList)
      tempList.forEach(function(filePath, fileKey) {
        console.log('filePath',filePath)
        uni.uploadFile({
          url: self.websiteUrl + '/index.php?s=/api/file.upload/image',
          filePath: filePath,
          name: 'iFile',
          formData: params,
          success: function(res) {
            let result = typeof res.data === 'object' ? res.data : JSON.parse(res.data);
            if (result.code === 1) {
              self.images.push(result.data);
              uni.hideLoading();
            }
          }
        });
      });
    }
  }
}
</script>

<style>

</style>
