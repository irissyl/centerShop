<template>
	<view class="apply-agent">
		<!--未入驻-->
		<view class="form-wrap p30 f30">
			<view style="font-size: 30rpx;font-weight: 600;">
				{{$nw("请正确填写相关信息")}}
				<view style="font-size: 28rpx;" v-if="form.status == -1 || form.status == 2">{{$nw('提交后将有工作人员进行审核')}}</view>
			</view>
			<form @submit="formSubmit" @reset="formReset">


				<view class="form-item border-b" style="margin-top: 30rpx;">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name">{{$nw('机构名称')}}</view>
					<input class="flex-1 ml20" name="name" v-model="form.name" type="text" value=""
						placeholder-class="grary" :placeholder="$nw('请输入机构名称')" />
				</view>

				<view class="form-item border-b" style="margin-top: 30rpx;">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name">{{$nw('职位')}}</view>
					<input class="flex-1 ml20" name="post" type="text" value="" placeholder-class="grary"
						v-model="form.post" :placeholder="$nw('请输入职位')" />
				</view>
				
				<view class="form-item border-b" style="margin-top: 30rpx;">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name">{{$nw('所属商会')}}</view>
					<input class="flex-1 ml20" name="belong_to" type="text" value="" placeholder-class="grary"
						v-model="form.belong_to" :placeholder="$nw('请输入所属商会')" />
				</view>

				<view class="form-item border-b">
					<view class="field-name"> {{$nw('机构简称')}}</view>
					<input class="flex-1 ml20" name="short_name" v-model="form.short_name" type="text" value=""
						placeholder-class="grary" :placeholder="$nw('请输入机构简称')" />
				</view>

				<view class="form-item border-b">
					<view class="field-name">{{$nw('主营业务')}}</view>
					<input class="flex-1 ml20" name="short_name" v-model="form.business" type="text" value=""
						placeholder-class="grary" :placeholder="$nw('请输入主营业务')" />
				</view>




				<!-- 机构logo -->
				<!--#ifndef MP-WEIXIN-->
				<view class="p-30-0 border-b" @click="chooseimage_url">
					<text style="float: left;color: red;margin-right: 5rpx;height: 100rpx;line-height:100rpx;">* </text>
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">
						{{$nw('机构logo')}}</view>
					<view class="d-e-c" style="float: left;">
						<image mode="aspectFit" style="border-radius: 0%;" :src="form.image_url"></image>
					</view>
					<view style="clear: both;"></view>
				</view>
				<!--#endif-->
				<!--#ifdef MP-WEIXIN-->
				<view class="p-30-0 border-b">
					<text style="color: red;margin-right: 5rpx;float: left;height: 100rpx;line-height:100rpx;">* </text>
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">机构Logo</view>
					<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChoose_image_url"
						style="display: flex;justify-content: flex-end;float: left;">
						<view class="user-avatar">
							<image v-if="form.image_url" style="border-radius: 0%;" :src="form.image_url"
								mode="aspectFill">
							</image>
						</view>
					</button>
					<view class="" style="clear: both;"></view>
				</view>
				<!--#endif-->

				<!-- 所在地区 -->
				<view class="form-item border-b">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name">{{$nw("所在地区")}}</view>
					<view class="input-box flex-1" @click="showMulLinkageRegionalComponents">
						<view>{{selectRegion}}</view>
					</view>
				</view>


				<!-- 行业 -->
				<view class="form-item border-b">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name">{{$nw("选择行业")}}</view>
					<view class="input-box flex-1">
						<picker class="filter-box-item b-1px-r" @change="handerCategoryaChange" :value="categorya_index"
							range-key="name" :range="categoryaArray">
							<view class="filter-box-item b-1px-r">
								<view class="filter-box-item-title">{{categoryaArray[categorya_index].name}}</view>

							</view>
						</picker>
					</view>
				</view>




				<view class="form-item border-b">
					<view class="field-name">{{$nw('机构介绍')}}</view>
					<textarea class="flex-1 ml20" name="summary" type="text" value="" placeholder-class="grary"
						v-model="form.intro" :placeholder="$nw('请输入机构介绍')" maxlength="255" /> </textarea>
				</view>

				<view class="form-item border-b"
				v-if="form.status == -1">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name">{{$nw('选择会员等级')}}</view>
					<view class="input-box flex-1">
						<picker class="filter-box-item b-1px-r" @change="handerGradeChange" :value="grade_index"
							range-key="name" :range="gradeArray">
							<view class="filter-box-item b-1px-r">
								<view class="filter-box-item-title">{{gradeArray[grade_index].name}}</view>

							</view>
						</picker>
					</view>
				</view>

				<view class="form-item border-b" v-if="form.status == -1">
					<view class="field-name" style="color: red;">{{$nw('入驻押金')}}</view>
					<view style="color: red;">{{getGradePrice()}}{{$nw('元')}}</view>
				</view>

				<view class="form-item border-b" v-if="form.status == -1 && getGradeExpireYear() >0">
					<view class="field-name" style="color: red;">{{$nw('有限期限')}}</view>
					<view style="color: red;">{{getGradeExpireYear()}}{{$nw('年')}}</view>
				</view>

				<view v-if="form.status == 1 && form.level < getGrade()" class="form-item border-b" style="margin-top: 30rpx;">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name">{{$nw('入驻时间')}}</view>
					<picker mode="date" :disabled="true" :value="form.time" :start="startDate" :end="endDate"
						@change="bindDateChange">
						<view style="color: grey;" class="mr20">{{form.time}}</view>
					</picker>
				</view>



				<view class="form-item border-b" style="margin-top: 30rpx;">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name">{{$nw('联系人')}}</view>
					<input class="flex-1 ml20" name="linkman" type="text" value="" placeholder-class="grary"
						v-model="form.linkman" :placeholder="$nw('请输入联系人')" />
				</view>


				<view class="form-item border-b">
					<text style="color: red;margin-right: 5rpx;">* </text>
					<view class="field-name">{{$nw('联系电话')}}</view>
					<input class="flex-1 ml20" v-model="form.phone" name="phone" maxlength="11" type="number" value=""
						placeholder-class="grary" :placeholder="$nw('请输入联系电话')" />
				</view>



				<view class="form-item border-b" v-if="form.reject_val">
					<view class="field-name">{{$nw('驳回原因')}}</view>
					<input class="flex-1 ml20" disabled="" v-model="form.reject_val" name="reject_val" type="text"
						value="" placeholder-class="grary" />
				</view>
				<view class="p-20-0 f28">
					<checkbox-group @change="changeFunc" style="float: left; width: 70rpx;transform: scale(0.8);">
						<checkbox value="checkbox" :checked="is_read" />
					</checkbox-group>
					<view style="float: left;">{{$nw('我已阅读并了解')}}</view>
					<view style="float: left;" class="red" @click="xieyi">
						【{{$nw('入会协议')}}】
					</view>
					<view style="clear: both;">

					</view>
				</view>

				<view v-if="form.status == 2">
					{{$nw('未通过原因')}}：{{form.reject_val}}
				</view>

				<view v-if="form.status == 0">{{$nw('正在审核中，敬请稍后')}}</view>



				<view class="d-c-c mt30" v-if="form.status == -1">
					<button class="btn-red" style="border: none;"
						:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
						form-type="submit">{{$nw('提交申请并支付入驻押金')}}</button>
				</view>

				<view class="d-c-c mt30" v-if="form.status == 2">
					<button class="btn-red" style="border: none;"
						:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
						form-type="submit">{{$nw('重新提交审核')}}</button>
				</view>

				<view class="d-c-c mt30" v-if="form.status == 1 && form.level >= getGrade()">
					<button class="btn-red" style="border: none;"
						:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
						form-type="submit">{{$nw('修改信息')}}</button>
				</view>
				<view class="d-c-c mt30" v-if="form.status == 1 && form.level < getGrade()">
					<button class="btn-red" style="border: none;"
						:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
						form-type="submit">{{$nw('升级等级并支付升级费用')}}</button>
				</view>

			</form>
		</view>



		<!-- #ifndef APP -->
		<street-picker ref="streetPicker" :streetDataList="streetDataList" @onConfirm="onConfirmStreet"></street-picker>
		
			<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm">
			</mpvue-city-picker>
		<!-- #endif -->
		
		<regionalComponents v-show="regionaStatus" ref="regionalComponents" :defaultData="defaultData" @cancel="cancel"
			@confirm="confirm"></regionalComponents>
<service :itemData="t_service"></service>
	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue'
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import streetPicker from '@/components/mpvue-citypicker/streetPicker.vue';
	import regionalComponents from '@/components/regionalComponents/regionalComponentsa.vue'
	import service from '@/components/diy/service/service';
	export default {
		components: {
			Popup,
			mpvueCityPicker,
			streetPicker,
			regionalComponents,
			service
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})

			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				/*是否阅读了规则*/
				is_read: false,
				agreement: '',
				cityPickerValueDefault: [0, 0, 0],
				defaultData: {
					province_id: 0,
					city_id: 0,
					region_id: 0,
					street_id: 0,
					address_id: 0,
				},
				selectCity: this.$nw("选择省,市,区"),

				addressarr: {},
				selectStreet: this.$nw("选择街道/镇/乡"),
				selectRegion: this.$nw("选择地区"),
				is_street: false,
				streetDataList: [],
				regionaStatus: false,


				categoryaArray: [],
				categorya_index: 0,

				gradeArray: [],
				grade_index: 0,

				form: {
					province_id: 0,
					city_id: 0,
					region_id: 0,
					street_id: 0,
					name: "",
					short_name: "",
					image_id: "", //图片ID
					image_url: this.websiteUrl + "file/images/avatar.png",
					intro: "",
					post: "",
					belong_to: "",
					time: currentDate,
					phone: '', //联系电话
					business: "",
					status: -1, //-1未提交  0未审核  1通过  2  驳回
					reject_val: '', //驳回原因 
					linkman: "",

				},
				quick: 0,
			}
		},
		onShow() {
			this.getData()
			this.setGlobalColor()
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
			bindDateChange: function(e) {
				let self = this;
				console.log(e.detail.value)
				self.form.time = e.detail.value

			},
			handerCategoryaChange(e) { //选择行业
				this.categorya_index = e.detail.value
			},
			handerGradeChange(e) { //选择等级
				this.grade_index = e.detail.value
			},
			getGradePrice() {
				var price = this.gradeArray[this.grade_index].price;
				return price ? price : 0;
			},
			getGradeExpireYear() {
				var price = this.gradeArray[this.grade_index].expire_year;
				return price ? price : 0;
			},
			getGrade() {
				var level = this.gradeArray[this.grade_index].level;
				return level ? level : 0;
			},
			copy(e) {
				uni.setClipboardData({
					data: e,
					success: function() {

					}
				});
			},
			getData() {
				var self = this;
				self._post(
					'plus.coc.Coc/detail', { //获取入会详情

					},
					function(
						res
					) {
						console.log("res", res.data)
						self.categoryaArray = res.data.categorya
						self.gradeArray = res.data.grade

						if (res.data.detail) {
							self.form = res.data.detail
							for (var i = 0; i < self.categoryaArray.length; i++) {
								if (self.categoryaArray[i].categorya_id == self.form.categorya_id) {
									self.categorya_index = i;
								}
							}
							for (var i = 0; i < self.gradeArray.length; i++) {
								if (self.gradeArray[i].grade_id == self.form.grade_id) {
									self.grade_index = i;
								}
							}
							self.selectRegion = self.form.province ? (self.form.province + self.form.city + self.form
								.area) : self.$nw('请选择地区');

							if (self.form.status == 1 && self.form.level >= self.getGrade()) {
								uni.setNavigationBarTitle({
									title: self.$nw('修改信息')
								})
							}
							if (self.form.status == 1 && self.form.level < self.getGrade()) {
								uni.setNavigationBarTitle({
									title: self.$nw('升级成功')
								})
							}
							if (self.form.status == 2) {
								uni.setNavigationBarTitle({
									title: self.$nw('重新提交审核')
								})
							}
						}


					});
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
						title: self.$nw('请同意协议！'),
						icon: 'none'
					});
					return;
				}

				clearTimeout(uni.getStorageSync("xt_bar"))
				var xt = setTimeout(function() {
					uni.setStorageSync("xt_bar", xt)
					self.quick = 0;
				}, 5000);
				let formdata = {};
				formdata.linkman = self.form.linkman;
				formdata.phone = self.form.phone;
				formdata.city_id = self.form.city_id;
				formdata.province_id = self.form.province_id;
				formdata.region_id = self.form.region_id;
				formdata.street_id = self.form.street_id;
				formdata.image_url = self.form.image_url;
				formdata.categorya_id = self.categoryaArray[self.categorya_index].categorya_id
				formdata.grade_id = self.gradeArray[self.grade_index].grade_id
				formdata.business = self.form.business;
				formdata.intro = self.form.intro;
				formdata.time = self.form.time
				formdata.name = self.form.name
				formdata.short_name = self.form.short_name
				formdata.post = self.form.post
				formdata.belong_to = self.form.belong_to;
				if (self.quick == 0) {
					self.quick = 1;

					if (self.form.status == -1) {
						formdata.type = "apply"
					} else if (self.form.status == 1) {
						formdata.type = "upapply"
						formdata.coc_id = self.form.coc_id
					} else if (self.form.status == 2) {
						formdata.type = "reapply"
						formdata.coc_id = self.form.coc_id
					}

					function isJudge(self) {
						uni.showLoading({
							title:self.$nw('提交中...')
						})

						if (formdata.name == '') {
							self.tip(self.$nw('请输入公司名称！'), 3000);
							return;
						}
						if (formdata.image_url == '' ||
							formdata.image_url == self.websiteUrl + "file/images/avatar.png") {
							self.tip(self.$nw('请上传Logo！'), 3000);
							return;
						}

						if (formdata.province_id == '') {
							self.tip(self.$nw('请选择地区！'), 3000);
							return;
						}
						if (formdata.categorya_id == 0) {
							self.tip(self.$nw('请选择行业！'), 3000);
							return;
						}
						if (formdata.grade_id == 0) {
							self.tip(self.$nw('请选择会员等级！'), 3000);
							return;
						}


						if (formdata.linkman == '') {
							self.tip(self.$nw('请输入联系人！'), 3000);
							return;
						}
						if (formdata.phone.length == '') {

							self.tip(self.$nw('请输入联系电话！'), 3000);
							return;
						}
						if (formdata.belong_to.length == '') {

							self.tip(self.$nw('请输入所属商会'), 3000);
							return;
						}
						if (!
							/^1(3|4|5|6|7|8|9)\d{9}$/
							.test(formdata
								.phone)) {

							self.tip(self.$nw('联系电话有误,请重填！'), 3000);
							return;
						}

						uni.showLoading({
							title: self.$nw('正在提交'),
							mask: true
						})


						self._post('plus.coc.Coc/apply', formdata,
							function(res) {
								uni.hideLoading();
								if (formdata.type == 'upapply') {
									if (self.form.status == 1 && self.form.level >= self.getGrade()) {
										self.tip( self.$nw('修改成功'), 3000);
									}
									if (self.form.status == 1 && self.form.level < self.getGrade()) {
										self.tip( self.$nw('升级成功'), 3000);

									}
								} else {
									self.tip( self.$nw('申请成功,后台正在审核'), 3000);
								}

								setTimeout
									(function() {
										uni.navigateBack({
											delta: 1
										})
									}, 3000)
							});
					}

					var price = self.gradeArray[self.grade_index].price ?
						self.gradeArray[self.grade_index].price : 0
					if (price > 0) {
						if("apply" == formdata.type){
							uni.showModal({
								title: self.$nw("提示"),
								content:  self.$nw('申请入驻需扣除您')+price+this.getAppinfo().balance_text+"，"+self.$nw('是否确认'),
								success: function(o) {
									if (o.confirm) {
										isJudge(self);
									}

								}
							})
						}else{
							isJudge(self);
						}


					} else {
						isJudge(self);
					}




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
			onChoose_image_url(e) {
				var self = this;
				const {
					avatarUrl
				} = e.detail
				self.uploadFile(avatarUrl, 1, function(data) {
					if (data.file_path) {
						self.form.image_url = data.file_path
					}
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
					url: "/plus2/pages/xieyi/xieyi?code=coc"
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