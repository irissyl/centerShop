<template>
	<view class="refund-apply pb100">
		<form @submit="formSubmit" @reset="formReset">
			<view class="bg-white p-0-30 f30">
				<view class="d-s-c p-20-0 border-b-e" >
					<text class="key-name">{{$nw("认证类型")}}：</text>
					<span class="ml20">{{type_text}}</span>
				</view>
				<view  v-if="step==2">
					<view class="d-s-c p-20-0 border-b-e">
						<text class="key-name">{{type_name}}:</text>
						<span class="ml20">{{form.name}}</span>
					</view>
					<view class="d-s-c p-20-0 border-b-e">
						<text class="key-name">{{$nw("证件号码")}}：</text>
						<span class="ml20">{{form.certificate_no}}</span>
					</view>
					<view class="d-s-c p-20-0 border-b-e">
						<text class="key-name">{{$nw("认证状态")}}：</text>
						<span class="ml20">{{form.apply_status.text}}</span>
					</view>
					<!--上传图片-->
					<view class="bg-white border-b-e" v-if="type==10">
					    <view class="group-hd">
					        <view class="left">
					            <text class="min-name">{{$nw("身份证人脸面")}}</text>
					        </view>
					    </view>
					    <view class="upload-list d-s-c">
					        <view class="item" v-if="form.front_idcard">
					            <image :src="form.front_idcard" mode="aspectFit"></image>
					        </view>
					    </view>
					</view>
					<view class=" bg-white border-b-e" v-if="type==10">
					    <view class="group-hd">
					        <view class="left">
					            <text class="min-name">{{$nw("身份证国徽面")}}</text>
					        </view>
					    </view>
					    <view class="upload-list d-s-c">
					        <view class="item" v-if="form.back_idcard" >
					            <image :src="form.back_idcard" mode="aspectFit"></image>
					        </view>
					    </view>
					</view>
					<view class=" bg-white border-b-e" v-if="type==20">
					    <view class="group-hd">
					        <view class="left">
					            <text class="min-name">{{$nw("营业执照照片")}}</text>
					        </view>
					    </view>
					    <view class="upload-list d-s-c">
					        <view class="item" v-if="form.business_license" >
					            <image :src="form.business_license" mode="aspectFit"></image>
					        </view>
					    </view>
					</view>

					<view class=" bg-white border-b-e">
						<view class="group-hd">
						    <view class="left">
						        <text class="min-name">{{$nw("补充材料")}}</text>
						    </view>
						</view>
						<view class="upload-list d-s-c">
						    <view class="item"  v-model="form.images" v-for="(item, index) in form.images" :key="index">
						        <image :src="item" mode="aspectFit"></image>
						    </view>
						</view>

					</view>

					<view class="d-s-c p-20-0 border-b-e">
						<text class="key-name">{{$nw("审核结果")}}：</text>
						<span class="ml20">{{form.reject_reason}}</span>
					</view>
					<view class="d-s-c p-20-0 border-b-e">
						<text class="key-name">{{$nw("认证时间")}}：</text>
						<span class="ml20">{{form.apply_time}}</span>
					</view>
				</view>
				<view class="d-s-c p-20-0 border-b-e">
					<button  type="default" class="ml20" @click="gotoPages('/user/pages/index/index',0)">{{$nw("返回个人中心")}}</button>
					<button  type="default" class="ml20"  @click="gotoPages('/plus/pages/certify/apply/apply',2)">{{$nw("修改认证")}}</button>
				</view>

			</view>
        </form>
		<!--上传图片-->
    </view>


</template>

<script>
    export default {
        data() {
            return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
                type: '',
				/*是否打开上传图片*/
				isUpload:false,
				step:1,
				type_text:'',
				type_name:'',
				file_key:'',
				certificate_apply_id:0,
				form:{
					name:'',
					certificate_no:'',
					certify_type:'',
					front_idcard:'',
					back_idcard:'',
					business_license:'',
				},
				from_url:''
            }
        },
        onLoad(e) {
        	this.from_url = e.from_url ? e.from_url : ''
        },
        mounted() {
          this.setGlobalColor()
            /*获取订单详情*/
            this.getData();
        },
        methods: {
            /*获取数据*/
            getData(){
                let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
                self._get( 'plus.certification.apply/getDetail',  {},  function (res)  {

                       uni.hideLoading();
                       if(res.data.detail){
						self.form = res.data.detail;
                       	self.type = self.form.certify_type.value;
                       	self.step=2
                       	self.type_text = self.type==10?self.$nw("个人认证"):self.$nw("企业认证");
                       	self.type_name = self.type==10?self.$nw("真实姓名"):self.$nw("主体名称");
                       }else{
						   uni.showModal({
						       title: self.$nw("提示"),
						       content: self.$nw("请先实名认证"),
							   showCancel:false,
						       success: function (res) {
						           uni.redirectTo({
										url: '/plus/pages/certify/apply/apply',
									});
						       }
						   });
						   // uni.showToast({
						   // 	title: self.$nw("请先实名认证"),
						   // 	duration: 3000,
						   // 	complete:function(){
						   // 		uni.redirectTo({
						   // 			url: '/plus/pages/certify/apply/apply',
						   // 		});
						   // 	}
						   // });
					   }
                    }
                );
            },
			// 页面跳转
			gotoPages:function(url,type){
				url = url+'?from_url=' + this.from_url;
				if(type==0){
					uni.redirectTo({
						url: url
					});
				}else{
					uni.navigateTo({
						url: url
					});
				}

			},
            /*切换服务类型*/
            tabType(e){
                this.type = e;
            },
        }
    }
</script>

<style>

</style>
