<template>
	<view class="refund-apply pb100">
		<form @submit="formSubmit" @reset="formReset">
			<view class="bg-white p-0-30 f30">
				<view class="d-s-c p-20-0 border-b-e" v-if="!type_text">
					<text class="key-name">{{$nw("认证类型")}}</text>
					<button  type="default" :class=" type==10?'ml20 btn-red-border':'ml20'" @click="tabType(10)">{{$nw("个人认证")}}</button>
					<button  type="default" :class="type==20?'ml20 btn-red-border':'ml20'" @click="tabType(20)">{{$nw("企业认证")}}</button>
				</view>
				<view class="d-s-c p-20-0 border-b-e" v-else>
					<text class="key-name">{{$nw("认证类型")}}</text>
					<span class="ml20">{{type_text}}</span>
				</view>
				<view  v-if="step==2">
					<view class="d-s-c border-b-e">
						<text class="key-name">{{type_name}}</text>
						<input class="ml20 flex-1 p-30-0" name="name" type="text" v-model="form.name"  
						:placeholder="$nw('请输入')" />
					</view>
					<view class="d-s-c border-b-e">
						<text class="key-name">{{$nw("证件号码")}}</text>
						<input class="ml20 flex-1 p-30-0" name="phone" type="text" v-model="form.certificate_no"  
						:placeholder="$nw('请输入')" />
					</view>
					<!--上传图片-->
					<view class="bg-white border-b-e" v-if="type==10">
					    <view class="group-hd">
					        <view class="left">
					            <text class="min-name">{{$nw("身份证人脸面")}}</text>
					        </view>
					    </view>
					    <view class="upload-list d-s-c">
					        <view class="item" v-if="form.front_idcard" @click="deleteFunc('front_idcard')">
					            <image :src="form.front_idcard" mode="aspectFit"></image>
					        </view>
					        <view class="item d-c-c d-stretch" v-if="!form.front_idcard">
					            <view class="upload-btn d-c-c d-c flex-1" @click="openUpload('front_idcard')">
					                <text class="icon iconfont icon-xiangji f34"></text>
					                <text class="gray9">{{$nw("上传身份证正面")}}</text>
					            </view>
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
					        <view class="item" v-if="form.back_idcard" @click="deleteFunc('back_idcard')">
					            <image :src="form.back_idcard" mode="aspectFit"></image>
					        </view>
					        <view class="item d-c-c d-stretch" v-if="!form.back_idcard">
					            <view class="upload-btn d-c-c d-c flex-1" @click="openUpload('back_idcard')">
					                <text class="icon iconfont icon-xiangji f34"></text>
					                <text class="gray9">{{$nw("上传身份证反面")}}</text>
					            </view>
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
					        <view class="item" v-if="form.business_license" @click="deleteFunc('business_license')">
					            <image :src="form.business_license" mode="aspectFit"></image>
					        </view>
					        <view class="item d-c-c d-stretch" v-if="!form.business_license">
					            <view class="upload-btn d-c-c d-c flex-1" @click="openUpload('business_license')">
					                <text class="icon iconfont icon-xiangji f34"></text>
					                <text class="gray9">{{$nw("上传营业执照")}}</text>
					            </view>
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
						    <view class="item"  v-model="form.images" v-for="(item, index) in form.images" :key="index"  @click="toDeleteImg(index)">
						        <image :src="item" mode="aspectFit"></image>
						    </view>
						    <view class="item d-c-c d-stretch" v-if="form.images.length<3">
						        <view class="upload-btn d-c-c d-c flex-1" @click="chooseWxImageShop()">
						            <text class="icon iconfont icon-xiangji f34"></text>
						        </view>
						    </view>
						</view>

					</view>
				</view>


			</view>
            <view class="p30"  @click="next()" v-if="step==1"><button type="default" class="btn-red f30 mt30">{{$nw("下一步")}}</button></view>
			<view class="p30" v-if="step==2"><button form-type="submit" type="default" class="btn-red f30 mt30">{{$nw("下一步")}}</button></view>
        </form>
		<!--上传图片-->
		<Upload v-if="isUpload" @getImgs="getImgsFunc"></Upload>
    </view>


</template>

<script>
	import Upload from '@/components/upload/upload.vue';
	import config from '@/config.js'
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
					images:[]
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
						}

                    }
                );
            },
            /*切换服务类型*/
            tabType(e){
                this.type = e;
            },
			// 下一步
			next: function ()
			{
				if(!this.type){
					uni.showToast({
						title: this.$nw("请选择认证类别"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				this.type_text = this.type==10?this.$nw("个人认证"):this.$nw("企业认证");
				this.type_name = this.type==10?this.$nw("真实姓名"):this.$nw("主体名称");
				this.step=2;
			},
            /*提交表单*/
            formSubmit: function (e)
            {
                let self = this;
                var formdata = self.form;
                formdata.certify_type = self.type;
				if(!self.type){
					uni.showToast({
						title:  self.$nw("请选择认证类别"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
                if (formdata.name == '') {
                	uni.showToast({
                		title: self.$nw("请输入名称"),
                		duration: 1000,
                		icon: 'none'
                	});
                	return false;
                }
				if (formdata.certificate_no == '') {
					uni.showToast({
						title: self.$nw("请输入证件编号"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				if (formdata.front_idcard == ''&&self.type==10) {
					uni.showToast({
						title: self.$nw("请上传身份证正面"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				if (formdata.front_idcard == ''&&self.type==10) {
					uni.showToast({
						title: self.$nw("请上传身份证反面"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				if (formdata.business_license == ''&&self.type==20) {
					uni.showToast({
						title: self.$nw("请上传营业执照"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
                uni.showLoading({
                	title: self.$nw("正在提交"),
                	mask: true
                });
                self._post('plus.certification.apply/submit', formdata, function (res)
                {
                	uni.hideLoading();
                	uni.showToast({
                		title: res.msg,
                		duration: 3000,
                		complete:function(){
							var url = '/plus/pages/certify/index';
							if(self.from_url=='supply'){
								url = '/plus/pages/supply/apply';
							}
							if(self.from_url=='user_apply'){
								url = '/user/pages/grade/apply';
							}
                			uni.navigateTo({
                				url: url,
                			});
                		}
                	});
                });
            },

			/*打开上传图片*/
			openUpload(f_key){
				this.file_key = f_key;
				this.isUpload=true;
			},

			/*获取上传的图片*/
			getImgsFunc(e){
				let self=this;
				self.isUpload=false;
				if(e&&typeof(e)!='undefined'){
					console.log(e,self.form[self.file_key])
					self.form[self.file_key]=e[0].file_path
				}
			},

			/*删除图片*/
			deleteFunc(e){
				this.form[e]='';
			},
			chooseWxImageShop(){
				let self = this, images = self.form.images, n = self.form;
				let params = {
					token: uni.getStorageSync('token'),
				    app_id: self.getAppId()
				};
				uni.chooseImage({
					count: 3,
					sizeType: [ "original", "compressed" ],
					success: function(res) {

						let url  = config.app_url + '/index.php?s=/api/file.upload/image';
						for (var temp in res.tempFilePaths){
							uni.showLoading({
								title:  self.$nw("正在提交")
							}), uni.uploadFile({
								url: url,
								filePath: res.tempFilePaths[temp],
								name: "iFile",
								formData: params,
								success: function(t) {
									var a = JSON.parse(t.data);
									if(self.form.images_str){
										self.form.images_str +=","+ a.data.file_path;
									}else{
										self.form.images_str = a.data.file_path;
									}
									if(self.form.images_id){
										self.form.images_id +=","+ a.data.file_id;
									}else{
										self.form.images_id = a.data.file_id;
									}


									self.form.images.push(a.data.file_path);
									uni.hideLoading();
								}
							});
						}

					},
					fail: function(t) {
						uni.hideLoading();
					}
				});
			},
			/* 删除图片 */
			toDeleteImg(index){
				let self = this;
				self.form.images.splice(index,1);
				console.log(self.form.images);debugger;
			},
        }
    }
</script>

<style scoped>
	.abs {
	    position: absolute;
	}
	.staff-editInfo-common {
	    width: 92%;
	    height: auto;
	    padding: 0rpx 4%;
	    background: white;
	    margin-top: 20rpx;
	    border: 1rpx solid #e5e5e5;
	    border-left: transparent;
	    border-right: transparent;
	}

	.staff-editInfo-common .title {
	    height: 90rpx;
	    line-height: 90rpx;
	    font-size: 30rpx;
	    color: #2f2f2f;
	}
	.staff-editInfo-common .imgs {
	    padding-bottom: 20rpx;
	}

	.staff-editInfo-common .imgs .imgs-icon {
	    width: 160rpx;
	    height: 160rpx;
	    line-height: 160rpx;
	    display: block;
	    margin-bottom: 20rpx;
	    margin-left: 10rpx;
	    background: #f3f4f7;
	}

	.staff-editInfo-common .imgs .imgs-icon i {
	    font-size: 80rpx;
	    color: #b4b4b4;
	}

	.upload-staff-images {
	    width: 158rpx;
	    height: 158rpx;
	    float: left;
	    margin: 0rpx 9rpx 20rpx 9rpx;
	}

	.imgs .upload-staff-images:nth-child(4n-3) {
	    margin-left: 0rpx;
	}

	.imgs .upload-staff-images:nth-child(4n) {
	    margin-right: 0rpx;
	}

	.upload-staff-images em {
	    top: -16rpx;
	    right: -16rpx;
	    line-height: 1;
	    display: block;
	    width: 36rpx;
	    height: 36rpx;
	    line-height: 36rpx;
	    background: #898989;
	    transform: rotate(45deg);
	    vertical-align: middle;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	}

	.upload-staff-images em i {
	    font-size: 20rpx;
	    color: white;
	}

	.upload-staff-images image {
	    width: 100%;
	    height: 100%;
	}
</style>
