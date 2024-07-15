<template>
  <view class="refund-apply pb100">
    <form @submit="formSubmit" @reset="formReset">
      <view class="bg-white p-0-30 f30">

        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("活动名")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="title" type="text" v-model="form.title" 
		  :placeholder="$nw('请输入')"/>
        </view>
        <view class="d-s-c border-b-e">
          <text class="key-name">{{$nw("凑团时间(小时)")}}：</text>
          <input class="ml20 flex-1 p-30-0" name="together_time" min=1 type="number" v-model="form.together_time" 
		   :placeholder="$nw('请输入整数')"/>
        </view>
        <!--上传图片-->
        <view class=" bg-white border-b-e">
          <view class="group-hd">
            <view class="left">
              <text class="min-name">{{$nw("活动海报")}}：</text>
            </view>
          </view>
          <view class="upload-list d-s-c">
            <view class="item" v-if="form.poster" @click="deleteFunc('poster')">
              <image :src="form.poster" mode="aspectFit"></image>
            </view>
            <view class="item d-c-c d-stretch" v-if="!form.poster">
              <view class="upload-btn d-c-c d-c flex-1" @click="openUpload('poster')">
                <text class="icon iconfont icon-xiangji f34"></text>
                <text class="gray9">{{$nw("上传活动海报")}}</text>
              </view>
            </view>
          </view>
          <view class="uni-list">
            <view class="uni-list-cell">
              <view class="uni-list-cell-left">
               {{$nw("开始日期")}}：
              </view>
              <view class="uni-list-cell-db">
                <picker mode="date" @change="bindStartTime">
                  <view class="uni-input">{{ form.start_time || $nw("请选择活动开始日期") }}</view>
                </picker>
              </view>
            </view>
          </view>
          <view class="uni-list">
            <view class="uni-list-cell">
              <view class="uni-list-cell-left">
                {{$nw("结束日期")}}：
              </view>
              <view class="uni-list-cell-db">
                <picker mode="date" @change="bindEndTime">
                  <view class="uni-input">{{ form.end_time ||  $nw("请选择活动结束日期") }}</view>
                </picker>
              </view>
            </view>
          </view>
        </view>

      </view>
      <view class="p30">
        <button form-type="submit" type="default" class="btn-red f30 mt30">{{$nw("确定")}}</button>
      </view>
    </form>
    <!--上传图片-->
    <Upload v-if="isUpload" @getImgs="getImgsFunc"></Upload>
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
      type: '',
      /*是否打开上传图片*/
      isUpload: false,
      form: {
        title: '',
        image_id: '',
        start_time: '',
        end_time: '',
        assemble_type: 1,
        status: 1,
        together_time: 24,
        sort: 100,
        poster: ''
      },
      from_url: ''
    }
  },
  onLoad(e) {
    this.assemble_activity_id = e.assemble_activity_id ? e.assemble_activity_id : 0
  },
  mounted() {
    this.setGlobalColor()
    /*获取订单详情*/
    this.getData();
  },
  methods: {
    /*获取数据*/
    getData() {
      let self = this;
      let assemble_activity_id = self.assemble_activity_id
      uni.showLoading({
        title: self.$nw("加载中")
      });
      self._get('plus.supply.assemble/editActive', {assemble_activity_id: assemble_activity_id}, function (res) {
            console.log(res)
            var detail = res.data.detail;
            self.form.title = detail.title
            self.form.image_id = detail.image_id;
            self.form.start_time = detail.start_time;
            self.form.end_time = detail.end_time;
            self.form.together_time = detail.together_time
            self.form.poster = detail.file.file_path;
            uni.hideLoading();

          }
      );
    },
    /*提交表单*/
    formSubmit: function (e) {
      let self = this;
      var formdata = self.form;
      formdata.assemble_activity_id = self.assemble_activity_id
      if (!formdata.title) {
        uni.showToast({
          title: self.$nw("请设置名称"),
          duration: 1000,
          icon: 'none'
        });
        return false;
      }
      if (!formdata.together_time) {
        uni.showToast({
          title:self.$nw("请输入凑团时间"),
          duration: 1000,
          icon: 'none'
        });
        return false;
      }
      if (!formdata.start_time || !formdata.end_time) {
        uni.showToast({
          title:self.$nw("请设置活动时间"),
          duration: 1000,
          icon: 'none'
        });
        return false;
      }
      if (!formdata.image_id) {
        uni.showToast({
          title:  self.$nw("请上传活动海报"),
          duration: 1000,
          icon: 'none'
        });
        return false;
      }
      uni.showLoading({
        title: self.$nw("正在提交"),
        mask: true
      });
      self._post('plus.supply.assemble/editActive', formdata, function (res) {
        uni.hideLoading();
        uni.showToast({
          title: res.msg,
          duration: 3000,
          complete: function () {

            uni.navigateTo({
              url: '/plus/pages/supply/product/assemble/list',
            });
          }
        });
      });
    },
    bindStartTime: function (e) {
      this.form.start_time = e.target.value;
    },
    bindEndTime: function (e) {
      this.form.end_time = e.target.value;
    },
    /*打开上传图片*/
    openUpload(f_key) {
      this.file_key = f_key;
      this.isUpload = true;
    },

    /*获取上传的图片*/
    getImgsFunc(e) {
      let self = this;
      self.isUpload = false;
      if (e && typeof (e) != 'undefined') {
        console.log(e, self.form[self.file_key])
        self.form[self.file_key] = e[0].file_path
        self.form.image_id = e[0].file_id
      }
    },

    /*删除图片*/
    deleteFunc(e) {
      this.form[e] = '';
    }
  }
}
</script>

<style>

</style>
