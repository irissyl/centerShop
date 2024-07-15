<template>
	<view class="refund-apply pb100">
		<form @submit="formSubmit" @reset="formReset">
			<view class="bg-white p-0-30 f30">
				<view class="bg-white ">
					<view class="d-s-c p-20-0 border-b-e" >
						<text class="key-name">{{$nw("广告位")}}：</text>
						<span class="ml20">{{name}}</span>
					</view>
					<view class="group-hd border-b-e">
						<view class="left">
							<text class="min-name">{{$nw("广告图片")}}:</text>
							<text class="gray9"></text>
						</view>
					</view>
					<view class="upload-list d-s-c">
						<view class="item" v-if="form.adv_img" @click="deleteFunc()">
							<image :src="form.adv_img" mode="aspectFill"></image>
						</view>
						<view class="item d-c-c d-stretch" v-if="!form.adv_img">
							<view class="upload-btn d-c-c d-c flex-1" @click="openUpload()">
								<text class="icon iconfont icon-xiangji f34"></text>
								<text class="gray9">{{$nw("上传广告图")}}</text>
							</view>
						</view>
					</view>
				</view>

				<view class="d-s-c border-b-e" >
						<text class="key-name">{{$nw("广告链接")}}：</text>
						<text class=" adv_name" style="width: 60%;">{{form.adv_name}}</text>
						<view class="m20 flex-1 p-30-0" style="text-align: right;"  @click="gotoContent">{{$nw("设置")}}</view>
				</view>
				<view class="d-s-c p-20-0 border-b-e" >
					<text class="key-name">{{$nw("状态")}}：</text>
					<span class="ml20">{{status_text}}</span>
				</view>
				<view class="d-s-c p-20-0 border-b-e" >
					<text class="key-name">{{$nw("提示说明")}}</text>
				</view>
				<view class="d-s-c p-20-0 border-b-e" >
					<text class="ml20 gray9">{{content}}</text>
				</view>
			</view>
			<view class="p30" v-if="status<2"><button form-type="submit" type="default" class="btn-red f30 mt30">{{$nw("提交审核")}}</button></view>
        </form>
		<view class="popup-bg" v-if="isUpload">
			<view class="wechat-box" >
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
			Upload
		},
        data() {
            return {
				imageList:[],
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*是否打开上传图片*/
				isUpload:false,
				form:{
					order_id:0,
					adv_img:'',
					adv_link:'',
					adv_name:this.$nw("请设置广告链接"),
				},
				status:0,
				name:'',
				status_text:'',
				content:'',
				order_id:0
            }
        },
        onLoad(e) {
        	this.order_id = e.order_id ? e.order_id : 0
			uni.setStorageSync('choose_link','');
			uni.setStorageSync('choose_name','');
        },
		onShow(){
      this.setGlobalColor()
			var url = uni.getStorageSync('choose_link');
			var adv_name = uni.getStorageSync('choose_name');
			if(url){
				this.form.adv_link = url
				this.form.adv_name = adv_name
			}
		},
        mounted() {
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
                self._get( 'plus.adv.order/edit',  {order_id:self.order_id},  function (res)  {
						uni.hideLoading();
						if(res.data.data){
							var detail= res.data.data;
							self.name = detail.adv.name
							self.content = detail.adv.content
							self.form.adv_img = detail.adv_img
							self.form.adv_link = detail.adv_link
							self.form.adv_name = detail.adv_name
							self.form.order_id = detail.order_id
							self.status = detail.status
							self.status_text = detail.status_text

						}
                    }
                );
            },
			gotoContent(){
				if (this.status>1) {
					uni.showToast({
						title: this.$nw("当前不能操作"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				uni.navigateTo({
					url:'/plus/pages/adv/order/adv-info'
				})
			},
            /*提交表单*/
            formSubmit: function (e)
            {
                let self = this;
                var formdata = self.form;

				if (formdata.adv_img == '') {
					uni.showToast({
						title: self.$nw("请上传广告图片"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				if (formdata.adv_link == '') {
					uni.showToast({
						title: self.$nw("请选择广告链接"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}

                uni.showLoading({
                	title: self.$nw("正在提交"),
                	mask: true
                });
                self._post('plus.adv.order/edit', formdata, function (res)
                {
                	uni.hideLoading();
					self.showSuccess(res.msg, () => {
						uni.navigateBack({
						})
					});
                });
            },
			/*打开上传图片*/
			openUpload(){
				if (this.status>1) {
					uni.showToast({
						title: this.$nw("当前不能操作"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				let self=this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						self.isUpload=true;
						uni.showLoading({
						    title: self.$nw("图片上传中")
						});
						self.uploadFile(res.tempFilePaths);
					},
					fail:function(res){
						self.isUpload=false;
						// self.$emit('getImgs',null);
					},
					complete:function(res){

					}
				});



			},
			/*上传图片*/
			uploadFile: function(tempList) {
				let self = this;
				let i = 0;
				let img_length=tempList.length;
				let params = {
					token: uni.getStorageSync('token'),
			        app_id: self.getAppId()
				};
				self.imageList=[];

				tempList.forEach(function(filePath, fileKey) {
					uni.uploadFile({
						url: self.websiteUrl + '/index.php?s=/api/file.upload/image',
						filePath: filePath,
						name: 'iFile',
						formData: params,
						success: function(res) {
							let result = typeof res.data === 'object' ? res.data : JSON.parse(res.data);
							if (result.code === 1) {
								self.imageList.push(result.data);
							}
						},
						complete: function() {
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
			getImgsFunc(e){
				let self=this;
				self.isUpload=false;
				if(e&&typeof(e)!='undefined'){
					self.form.adv_img=e[0].file_path
				}
				uni.hideLoading();
			},

			/*删除图片*/
			deleteFunc(){
				if (this.status>1) {
					uni.showToast({
						title: this.$nw("当前不能操作"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				this.form.adv_img='';
			},

        }
    }
</script>

<style scoped>
	.upload-list .item {
		margin:0 auto;
	    width: 600rpx;
	    height: 300rpx;
	}
	.upload-list .item  .upload-btn{
	    width: 600rpx;
	    height: 300rpx;
	}
	.upload-list .item  image{
	    width: 600rpx;
	    height: 300rpx;
	}
	.popup-bg {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, .6);
		z-index: 98;
	}
	.wechat-box{
		margin-top: 50%;
		text-align: center;
		color: #fff;
	}
	.adv_name{
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
