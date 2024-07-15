<template>
	<view class="apply-agent">
		<!--未入驻-->
		<view class="form-wrap p30 f30">

			<form @submit="formSubmit" @reset="formReset">


				<view class="form-item border-b" style="margin-top: 30rpx;">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name">{{$nw("视频名称")}}</view>
					<input class="flex-1 ml20" name="article_title" v-model="form.article_title" type="text" value=""
						placeholder-class="grary" :placeholder="$nw('请输入视频名称')" />
				</view>

				<view class="form-item border-b">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name"> {{$nw("视频内容")}}</view>
					<input class="flex-1 ml20" name="article_content" v-model="form.article_content" type="text"
						value="" placeholder-class="grary" :placeholder="$nw('请输入视频内容')" />
				</view>





			<view class="p-30-0 border-b" @click="chooseimage_url">
				<text style="float: left;color: red;margin-right: 5rpx;height: 100rpx;line-height:100rpx;">* </text>
				<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">
					封面</view>
				<view class="d-e-c" style="float: left;">
					<image mode="aspectFit" style="border-radius: 0%;" :src="form.image_url"></image>
				</view>
				<view style="clear: both;"></view>
			</view>

				<view class="p-30-0 border-b" @click="choosevideo_url">
					<text style="float: left;color: red;margin-right: 5rpx;height: 100rpx;line-height:100rpx;">* </text>
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">
						{{$nw("短视频")}}</view>
					<view class="d-e-c" style="float: left;">
						<video ref="video" v-if="form.video_url" :src="form.video_url"
							style="border-radius: 0%;margin: auto;width: 400rpx;height: 400rpx;"></video>

						<image v-else style="border-radius: 0%;" :src="form.video_upload" mode="aspectFill">
						</image>


					</view>
					<view style="clear: both;"></view>
				</view>





				<view class="form-item border-b" v-if="form.reject_val">
					<view class="field-name">{{$nw("驳回原因")}}</view>
					<input class="flex-1 ml20" disabled="" v-model="form.reject_val" name="reject_val" type="text"
						value="" placeholder-class="grary" />
				</view>
				<view class="p-20-0 f28">
					<checkbox-group @change="changeFunc" style="float: left; width: 70rpx;transform: scale(0.8);">
						<checkbox value="checkbox" :checked="is_read" />
					</checkbox-group>
					<view style="float: left;">{{$nw("我已阅读并了解")}}</view>
					<view style="float: left;" class="red" @click="xieyi">
						【{{$nw("发布短视频协议")}}】
					</view>
					<view style="clear: both;">

					</view>
				</view>

				<view v-if="form.status == 2">
					{{$nw("未通过原因")}}：{{form.reject_val}}
				</view>

				<view v-if="form.status == 0">{{$nw("正在审核中，敬请稍后")}}</view>


				<view class="d-c-c mt30" v-if="form.status == -1">
					<button class="btn-red" 
					style="border: none;"
					:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
					
					form-type="submit">{{$nw("发布短视频")}}</button>
				</view>

				<view class="d-c-c mt30" v-if="form.status == 2">
					<button class="btn-red" 
					style="border: none;"
					:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
					
					form-type="submit">{{$nw("重新发布")}}</button>
				</view>

				<view class="d-c-c mt30" v-if="form.status == 1">
					<button class="btn-red" 
					style="border: none;"
					:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
					
					form-type="submit">{{$nw("修改信息并重新发布")}}</button>
				</view>


			</form>
		</view>




	<service :itemData="t_service"></service>
	
	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue'
import service from '@/components/diy/service/service';
	
	export default {
		components: {
			Popup,
			service,
		
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})

			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				/*是否阅读了规则*/
				is_read: false,
				form: {
					article_title: "",
					article_content: "",

					image_id: "", //图片ID
					image_url: this.websiteUrl + "file/images/avatar.png",
					video_upload: this.websiteUrl + "file/images/avatar.png",
					video_url: "",
					status: -1, //-1未提交  0未审核  1通过  2  驳回
					reject_val: '', //驳回原因 
				},
				quick: 0,
				article_id: 0
			}
		},
		onShow() {
			this.getData()
		},
		onLoad(option) {
			if (option.article_id) {
				this.article_id = option.article_id;
			}

		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},
			getbutton() {
				return this.setButton().button
			}
		},
		methods: {

			getData() {
				var self = this;
				if (self.article_id) {
					self._post(
						'plus.article.Article/detail', { //获取入会详情
							article_id: self.article_id
						},
						function(res) {
							console.log("res", res.data)
							self.form = res.data.detail
							if (self.form.status == 1) {
								uni.setNavigationBarTitle({
									title: self.$nw('修改')
								})
							}

							if (self.form.status == 2) {
								uni.setNavigationBarTitle({
									title: self.$nw('重新提交审核')
								})
							}

						});
				}

			},
			showMulLinkageRegionalComponents() {
				this.regionaStatus = true;
			},
			cancel() {
				this.regionaStatus = false;
			},
			confirm(e) {
				console.log(e)
				this.form.province_id = e.province_id;
				this.form.city_id = e.city_id;
				this.form.region_id = e.region_id;
				this.form.street_id = e.street_id;
				this.selectRegion = e.province + e.city + e.area + e.street;
				this.regionaStatus = false;


			},


			/*申请*/
			formSubmit: function(e) {
				let self = this;
				if (!self.is_read) {
					uni.showToast({
						title:  self.$nw('请同意协议！'),
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: self.$nw("提交中...")
				})

				clearTimeout(uni.getStorageSync("xt_bar"))
				var xt = setTimeout(function() {
					uni.setStorageSync("xt_bar", xt)
					self.quick = 0;
				}, 5000);
				let formdata = {};

				formdata.image_url = self.form.image_url;
				formdata.video_url = self.form.video_url;

				formdata.article_title = self.form.article_title
				formdata.article_content = self.form.article_content

				if (self.quick == 0) {
					self.quick = 1;
					if (formdata.article_title == '') {
						self.tip(self.$nw("请输入视频标题！"), 3000);
						return;
					}
					if (formdata.article_content == '') {
						self.tip(self.$nw("请输入视频内容！"), 3000);
						return;
					}
					if (formdata.image_url == '' ||
						formdata.image_url == self.websiteUrl + "file/images/avatar.png") {
						self.tip(self.$nw("请上传封面！"), 3000);
						return;
					}

					if (formdata.video_url == '' ||
						formdata.video_url == self.websiteUrl + "file/images/avatar.png") {
						self.tip(self.$nw("请上传短视频！"), 3000);
						return;
					}



					uni.showLoading({
						title: self.$nw("正在提交"),
						mask: true
					})
					if (self.form.status == -1) {
						formdata.type = "apply"
					} else if (self.form.status == 1) {
						formdata.type = "upapply"
						formdata.article_id = self.form.article_id
					} else if (self.form.status == 2) {
						formdata.type = "reapply"
						formdata.article_id = self.form.article_id
					}

					self._post('plus.article.Article/relVideo', formdata,
						function(res) {

							self.tip(self.$nw("发布成功"), 3000);

							setTimeout
								(function() {
									uni.hideLoading();
									uni.navigateBack({
										delta: 1
									})
								}, 3000)
						});

				} else {
					uni.showToast({
						title:self.$nw("你点太快了哦"),
						icon: "none"
					})
				}


			},
			/* 视频上传-----------------start */
			choosevideo_url() {
				var self = this;
				uni.chooseVideo({
					sourceType: ['album'], //从相册选择
					success: function(res) {
						var size = res.size;
						var m = size / (1024 * 1024)

						if (m > 50) {
							uni.showToast({
								title: self.$nw("请上传不要大于50M的视频！"),
								icon: "none"
							})
							return;
						}
						self.uploadFile(res.tempFilePath, 1, "video", function(data) {
							if (data.file_path) {
								self.form.video_url = data.file_path
							}
						})
					},
					fail: function(t) {
						console.log(t)
						uni.hideLoading()
					},
				})
			},
			/* 视频上传------------end */
			/* Logo上传 ---satrt */
			chooseimage_url() {
				let self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						self.uploadFile(res.tempFilePaths[0], 1, "image", function(data) {
							if (data.file_path) {
								self.form.image_url = data.file_path
							}
						})
					},
					fail: function(t) {
						console.log(t)
						uni.hideLoading()
					},
				})
			},
			onChoose_image_url(e) {
				var self = this;
				const {
					avatarUrl
				} = e.detail
				self.uploadFile(avatarUrl, 1, "image", function(data) {
					if (data.file_path) {
						self.form.image_url = data.file_path
					}
				})
			},
			// logo ---end
			/*上传图片*/
			uploadFile: function(filePath, im_upload, type, callback) {
				let self = this
				let params = {
					token: uni.getStorageSync('token') ?? '',
					app_id: self.getAppId(),
				}
				uni.showLoading({
					title: self.$nw("上传中"),
				})
				var url = "";
				if (type == "image") {
					url = self.websiteUrl + '/index.php/api/file.Upload/image'
				} else {
					url = self.websiteUrl + '/index.php/api/file.Upload/video'
				}
				uni.uploadFile({
					url: url,
					filePath: filePath,
					name: 'iFile',
					formData: params,
					success: function(res) {
						let result = typeof res.data === 'object' ? res.data : JSON.parse(res.data)
						callback(result.data)
						if (Number(result.code) !== 1) {
							self.$u.toast(result.msg)
						}
					},
					complete: function() {
						uni.hideLoading()
					},
					fail: res => {
						console.log(res)
					}
				})
			},

			/*去商城看看*/
			gotoShop() {
				uni.redirectTo({
					url: '/pages/index/index'
				})
			},

			/*同意协议*/
			changeFunc(e) {
				if (e.target.value.length > 0) {
					this.is_read = true;
				} else {
					this.is_read = false;
				}
			},
			xieyi() {
				uni.navigateTo({
					url: "/plus2/pages/xieyi/xieyi?code=rel_video"
				})
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
		}
	}
</script>

<style>
	.newborder {
		padding: 20rpx !important;
	}

	.newborder>view:nth-child(1) {
		font-size: 30rpx;
		color: #666;
	}

	.newborder>view:nth-child(2) {
		font-size: 30rpx;
	}

	.leave_cont {
		padding-left: 20rpx;
	}

	.apply-agent .banner {
		background-repeat: no-repeat;
		background-size: 100%;
	}

	.apply-agent .banner image {
		width: 100%;
	}

	.form-wrap {
		background: #FFFFFF;
		box-shadow: 0 0 8rpx 0 rgba(0, 0, 0, .2);
	}

	.form-item {
		padding: 20rpx 0;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 28rpx;
	}

	.form-item .field-name {
		width: 180rpx;
	}

	.form-item input {
		font-size: 28rpx;
	}

	.agreement-content {
		max-height: 60vh;
		overflow-y: auto;
	}

	.apply-agent .btn-red {
		width: 600rpx;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;

	}

	.d-e-c image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 55rpx;
	}

	.key-name {
		width: 200rpx;
	}

	.avatar-wrapper .user-avatar,
	.avatar-wrapper .user-avatar image {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
	}

	.avatar-wrapper {
		background-color: #ffffff;
	}
</style>