<template>
	<view class="apply-agent">
		<!--未入驻-->
		<view class="form-wrap p30 f30">
			<view style="font-size: 30rpx;font-weight: 600;">
				{{$nw("申请成为诚优企业")}}
				<view style="font-size: 28rpx;">
					{{$nw("申请成功后会出现在诚优企业列表")}}
				</view>
			</view>
			<form @submit="formSubmit" @reset="formReset">


				<view class="form-item border-b" style="margin-top: 30rpx;">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name">{{$nw('您的机构名称')}}</view>
					<input class="flex-1 ml20" disabled="true" name="name" v-model="form.name" type="text" value=""
						placeholder-class="grary" :placeholder="$nw('您的机构名称')" />
				</view>

				<view class="form-item border-b" style="margin-top: 30rpx;">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name">{{$nw('标识到期时间')}}</view>
					<input class="flex-1 ml20" disabled="true" name="name" v-model="form.expire_time" type="text"
						value="" placeholder-class="grary" :placeholder="$nw('您的标识到期时间')" />
				</view>


				<view class="form-item border-b">
					<view class="field-name" style="color: red;">{{$nw('费用')}}</view>
					<view style="color: red;">{{form.price}}元</view>
				</view>

				<view class="form-item border-b">
					<view class="field-name" style="color: red;">{{$nw('购买多少天')}}</view>
					<input class="flex-1 ml20" name="num" v-model="form.num" type="number" placeholder-class="grary"
						:placeholder="$nw('购买多少天')" />
				</view>
				
				<view class="form-item border-b">
					<view class="field-name" style="color: red;">{{$nw('所需费用')}}</view>
					{{form.price * form.num}}
				</view>

			<!-- 	<view>历史购买记录</view> -->


				<view class="p-20-0 f28">
					<checkbox-group @change="changeFunc" style="float: left; width: 70rpx;transform: scale(0.8);">
						<checkbox value="checkbox" :checked="is_read" />
					</checkbox-group>
					<view style="float: left;">{{$nw('我已阅读并了解')}}</view>
					<view style="float: left;" class="red" @click="xieyi">
						【{{$nw('申请成为诚优企业协议')}}】
					</view>
					<view style="clear: both;">

					</view>
				</view>


				<view class="d-c-c mt30" v-if="form.status == -1">
					<button class="btn-red">{{$nw('敬请期待')}}</button>
				</view>

				<view class="d-c-c mt30" v-if="form.status == 0">
					<button class="btn-red" form-type="submit">{{$nw('申请成为诚优企业')}}</button>
				</view>

				<view class="d-c-c mt30" v-if="form.status == 1">
					<button class="btn-red" form-type="submit">{{$nw('续费')}}</button>
				</view>

				<view class="d-c-c mt30" v-if="form.status ==2">
					<button class="btn-red" form-type="submit">{{$nw('申请成为诚优企业')}}</button>
				</view>


			</form>
		</view>


	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue'

	export default {
		components: {
			Popup,
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})

			return {

				/*是否阅读了规则*/
				is_read: false,
				form: {
					name: "",
					status: -1, //0没有广告  1 有正在进行的广告 2  已过期
					price: 0, //广告费用
					expire_time: "", //到期时间
					num: 1,
				}
			}
		},
		onShow() {
			this.getData()
			this.setGlobalColor()
			uni.setNavigationBarTitle({
				title:this.$nw('申请成为诚优企业')
			})
		},
		methods: {

			getData() {
				var self = this;
				self._post(
					'plus.coc.Coc/detailSe', { //获取入会详情

					},
					function(
						res
					) {
						console.log("res", res.data)

						self.form = res.data.detail


						if (self.form.status == 1) {
							uni.setNavigationBarTitle({
								title: self.$nw("续费")
							})
						}
					});
			},
			showMulLinkageRegionalComponents() {
				this.regionaStatus = true;
			},
			cancel() {
				this.regionaStatus = false;
			},

			/*申请*/
			formSubmit: function(e) {
				let self = this;
				if (!self.is_read) {
					uni.showToast({
						title: self.$nw("请同意协议！"),
						icon: 'none'
					});
					return;
				}
				uni.showLoading({
					title: self.$nw("提交中...")
				})

				clearTimeout(uni.getStorageSync("xt_bar"))
				// var xt = setTimeout(function() {
				// 	uni.setStorageSync("xt_bar", xt)
				// 	self.quick = 0;
				// }, 5000);
				let formdata = {};
				formdata.name = self.form.name
				formdata.num = self.form.num
				self.quick = 0;
				if (self.quick == 0) {
					// self.quick = 1;
					if (formdata.num <= 0) {
						self.tip(self.$nw("请输入正确的天数！"), 3000);
						return;
					}

					uni.showLoading({
						title: self.$nw("正在提交"),
						mask: true
					})
					if (self.form.status == 0) {
						formdata.type = "apply"
					} else if (self.form.status == 1) {
						formdata.type = "xfapply"
					} else if (self.form.status == 2) {
						formdata.type = "apply"
					}


					self._post('plus.coc.Coc/applySe', formdata,
						function(res) {
							uni.hideLoading();
							self.tip(self.$nw("提交成功"), 3000);

							setTimeout
								(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 3000)
						});

				} else {
					uni.showToast({
						title: self.$nw("你点太快了哦"),
						icon: "none"
					})
				}


			},
			/* Logo上传 ---satrt */
			chooseimage_url() {
				let self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						self.uploadFile(res.tempFilePaths[0], 1, function(data) {
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
			// logo ---end
			/*上传图片*/
			uploadFile: function(filePath, im_upload, callback) {
				let self = this
				let params = {
					token: uni.getStorageSync('token') ?? '',
					app_id: self.getAppId(),
				}
				uni.showLoading({
					title: self.$nw('图片上传中'),
				})
				uni.uploadFile({
					url: self.websiteUrl + '/index.php/api/file.image/upload',
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
					url: "/plus2/pages/xieyi/xieyi?code=apply_se"
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