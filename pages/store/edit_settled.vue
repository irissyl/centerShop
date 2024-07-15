<template>
	<view class="apply-agent">
		<!--未入驻-->
		<view class="form-wrap p30 f30">
			<form @submit="formSubmit" >
		
				<view class="form-item border-b">
					<view class="field-name">{{$nw("门店名称")}}</view>
					<input class="flex-1 ml20"
					 :disabled="audit_status==0?true:false"
					 name="store_name" v-model="store_name" type="text" value=""
						placeholder-class="grary" 
						 :placeholder="$nw('请输入门店名称')"/>
				</view>
				<view class="form-item border-b">
					<view class="field-name">{{$nw("联系人")}}</view>
					<input class="flex-1 ml20" 
					:disabled="audit_status==0?true:false"
					name="linkman" type="text" value="" placeholder-class="grary"
						v-model="linkman"  placeholder=""
						 :placeholder="$nw('请输入联系人')"
						 />
				</view>
				
				<view class="form-item border-b" style="margin-top: 30rpx;">
					<view class="field-name">{{$nw("法人姓名")}}</view>
					<input class="flex-1 ml20" 
					:disabled="audit_status==0?true:false"
					name="legal" type="text" value="" placeholder-class="grary"
						v-model="legal"
						  :placeholder="$nw('请输入法人姓名')"/>
				</view>
				
				<view class="form-item border-b" style="margin-top: 30rpx;">
					<view class="field-name">{{$nw("身份证号码")}}</view>
					<input class="flex-1 ml20" 
					:disabled="audit_status==0?true:false"
					name="idcard" type="text" value="" placeholder-class="grary"
						v-model="idcard" 
						 :placeholder="$nw('请输入身份证号码')"
						 />
				</view>
				
				
				<!-- 营业执照 -->
				<!--#ifndef MP-WEIXIN-->
				<view class="p-30-0 border-b" @click="chooseWxImage_business_license">
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">
						{{$nw("营业执照")}}</view>
					<view class="d-e-c" style="float: left;">
						<image mode="aspectFit" style="border-radius: 0%;"  :src="business_license"></image>
					</view>
					<view style="clear: both;"></view>
				</view>
				<!--#endif-->
				<!--#ifdef MP-WEIXIN-->
				<view class="p-30-0 border-b">
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">{{$nw("营业执照")}}</view>
					<button class="avatar-wrapper" open-type="chooseAvatar" 
					@chooseavatar="onChoose_business_license"
						style="display: flex;justify-content: flex-end;float: left;">
						<view class="user-avatar">
							<image v-if="business_license" style="border-radius: 0%;"  :src="business_license" mode="aspectFill"></image>
						</view>
					</button>
					<view class="" style="clear: both;"></view>
				</view>
				<!--#endif-->
				
				
				<!-- 身份证正面 -->
				<!--#ifndef MP-WEIXIN-->
				<view class="p-30-0 border-b" @click="chooseWxImage_idcard_positive">
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">
						{{$nw("身份证正面")}}</view>
					<view class="d-e-c" style="float: left;">
						<image mode="aspectFit" style="border-radius: 0%;"  :src="idcard_positive"></image>
					</view>
					<view style="clear: both;"></view>
				</view>
				<!--#endif-->
				<!--#ifdef MP-WEIXIN-->
				<view class="p-30-0 border-b">
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">{{$nw("身份证正面")}}</view>
					<button class="avatar-wrapper" open-type="chooseAvatar" 
					@chooseavatar="onChoose_idcard_positive"
						style="display: flex;justify-content: flex-end;float: left;">
						<view class="user-avatar">
							<image v-if="idcard_positive" style="border-radius: 0%;"  :src="idcard_positive" mode="aspectFill"></image>
						</view>
					</button>
					<view class="" style="clear: both;"></view>
				</view>
				<!--#endif-->
				
				
				<!-- 身份证反面 -->
				<!--#ifndef MP-WEIXIN-->
				<view class="p-30-0 border-b" @click="chooseWxImage_idcard_reverse">
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">
						{{$nw("身份证反面")}}</view>
					<view class="d-e-c" style="float: left;">
						<image mode="aspectFit" style="border-radius: 0%;"  :src="idcard_reverse"></image>
					</view>
					<view style="clear: both;"></view>
				</view>
				<!--#endif-->
				<!--#ifdef MP-WEIXIN-->
				<view class="p-30-0 border-b">
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">{{$nw("身份证反面")}}</view>
					<button class="avatar-wrapper" open-type="chooseAvatar" 
					@chooseavatar="onChoose_idcard_reverse"
						style="display: flex;justify-content: flex-end;float: left;">
						<view class="user-avatar">
							<image v-if="idcard_reverse" style="border-radius: 0%;"  :src="idcard_reverse" mode="aspectFill"></image>
						</view>
					</button>
					<view class="" style="clear: both;"></view>
				</view>
				<!--#endif-->
	
				<view class="form-item border-b">
					<view class="field-name">{{$nw("营业开始时间")}}</view>
					<view class="leave_cont flex">
						<picker v-model="startime" 
						:disabled="audit_status==0?true:false"
						mode="time" :value="startime" @change="bindTimeChangestar">
							<view class="uni-input">{{startime}}</view>
						</picker>
					
					</view>
				</view>
				<view class="form-item border-b">
					<view class="field-name">{{$nw("营业结束时间")}}</view>
					<view class="leave_cont flex">

						<picker v-model="endtime" 
						:disabled="audit_status==0?true:false"
						mode="time" :value="endtime" :start="endtime"
							@change="bindTimeChangeend">
							<view class="uni-input">{{endtime}}</view>
						</picker>
					</view>
				</view>
				<view class="form-item border-b">
					<view class="field-name">{{$nw("联系电话")}}</view>
					<input class="flex-1 ml20" 
					:disabled="audit_status==0?true:false"
					v-model="phone" name="phone" maxlength="11" type="number" value=""
						placeholder-class="grary" 
						  :placeholder="$nw('请输入联系电话')"/>
				</view>

				<view class="form-item border-b">
					<view class="field-name">{{$nw("所在地区")}}</view>
					<view class="input-box flex-1" @click="showMulLinkageRegionalComponents">
						<view>{{selectRegion}}</view>
					</view>
				</view>
				<!-- 增加获取经纬度的功能 -->
				<view class="form-item border-b">
					<text class="field-name">{{$nw("详细地址")}}</text>
					<textarea @click="gotoMap" 
					:disabled="audit_status==0?true:false"
					class="input-box flex-1" name="address" :auto-height="true"
						v-model="address" :placeholder="$nw('请输入街道小区楼牌号等')"></textarea>
					<!-- <view   class="iconfont icon-edit" 
					style=" width: 70rpx;height: 70rpx;"></view> -->
				</view>

				<view class="form-item border-b">
					<text class="field-name">{{$nw("门牌号")}}</text>
					<textarea class="input-box flex-1" 
					:disabled="audit_status==0?true:false"
					name="house_number" :auto-height="true" v-model="house_number"
					
						 :placeholder="$nw('请输入门牌号')"></textarea>
				</view>
				
				<view style="color: #ababab;" v-if="audit_status == 0">
					{{$nw("说明：审核中不可修改")}}
				</view>

				<view style="color: #ababab;" v-if="audit_status == 2">
					{{$nw("不通过原因如下")}}：【{{reject_reason}}】,{{$nw("请重新提交")}}
				</view>
				<!-- 					<view class="d-c-c p-20-0 f28">
					<checkbox-group @change="changeFunc">
						<checkbox value="checkbox" :checked="is_read" />
					</checkbox-group>
					<text>我已阅读并了解</text>
					<text class="red" @click="isPopup=true">
						【入驻协议】
					</text>
				</view> -->

				<view class="d-c-c mt30">
					<button class="btn-red"  style="border:none;"
					:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
					
					v-if="audit_status==1" form-type="submit">{{$nw("确认修改")}}</button>
					<button class="btn-red" style="border:none;"
					:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
					
					v-if="audit_status==2" form-type="submit">{{$nw("重新提交")}}</button>
				</view>
			</form>
		</view>

		<!--协议-->
		<!-- 		<Popup :show="isPopup" msg="申请协议">
			<view class="agreement-content f28 lh150">
				{{agreement}}
			</view>
			<view class="ww100 pt20 d-c-c">
				<button type="primary" class="btn-red" @click="isPopup=false">我已阅读</button>
			</view>
		</Popup> -->


		<!-- #ifndef APP -->
		<street-picker ref="streetPicker" :streetDataList="streetDataList" @onConfirm="onConfirmStreet"></street-picker>
		<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm">
		</mpvue-city-picker>
		<!-- #endif -->
		
		
		
		<regionalComponents v-show="regionaStatus" ref="regionalComponents" :defaultData="defaultData" @cancel="cancel"
			@confirm="confirm"></regionalComponents>

	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue'
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import streetPicker from '@/components/mpvue-citypicker/streetPicker.vue';
	import regionalComponents from '@/components/regionalComponents/regionalComponents.vue'
	export default {
		components: {
			Popup,
			mpvueCityPicker,
			streetPicker,
			regionalComponents
		},
		data() {
			return {
				/*弹窗是否打开*/
				isPopup: false,
				/*是否阅读了规则*/
				is_read: false,
				agreement: '',
				is_applying: false,
				referee_name: '',
				words: {},
				is_agent: '',
				/*顶部背景*/
				top_background: '',
				/*小程序订阅消息*/
				temlIds: [],
				other:this.$nw("请输入"),
				startime: this.$nw("请选择营业开始时间"), //营业开始时间
				endtime: this.$nw("请选择营业结束时间"), //营业结束时间
				status: -1, //0未入驻  1通过  2  审核中 3驳回 
				reject_reason: '', //驳回原因 
				store_id: '', //门店id
				store_name: '', //门店名称
				linkman: '', //联系人
				address: '', //详细地址
				shop_hours: '', //营业时间
				phone: '', //联系电话
				a_status: 0,
				cityPickerValueDefault: [0, 0, 0],
				defaultData: {
					province_id: 0,
					city_id: 0,
					region_id: 0,
					street_id: 0,
					address_id: 0,
				},
				selectCity: this.$nw("选择省,市,区"),
				province_id: 0,
				city_id: 0,
				region_id: 0,
				street_id: 0,
				addressarr: {},
				selectStreet: this.$nw("选择街道/镇/乡"),
				selectRegion: this.$nw("选择地区"),
				is_street: false,
				streetDataList: [],
				regionaStatus: false,
				longitude: "",
				latitude: "",
				house_number: "",
				audit_status:0,//0 未审核  1  通过  2  不通过
				reject_reason:"",//不通过原因
				legal:"",//法人姓名
				idcard:"",//身份证号码
				business_license: this.websiteUrl + "file/images/business_license.png",//营业执照
				idcard_positive: this.websiteUrl + "file/images/idcard_positive.png",//身份证正面
				idcard_reverse: this.websiteUrl + "file/images/idcard_reverse.png",//身份证负面
				label:"",//类型 标签 ,隔开
			}
		},
		mounted() {
			/*数据*/
			this.getData();
		},
		onLoad(opt) {
			this.store_id = opt.store_id;
		},
		computed: {
			getbutton() {
				return this.setButton().button
			},
		},
		methods: {
			gotoMap() {
				let self = this;

				// #ifdef MP-WEIXIN
				uni.chooseLocation({
					latitude: parseFloat(self.latitude),
					longitude: parseFloat(self.longitude),
					success: function(re) {
						console.log('success', re);
						self.address = re.address+re.name
						self.latitude = re.latitude
						self.longitude = re.longitude
					}
				})

				// #endif

			},
			showMulLinkageRegionalComponents() {
				this.regionaStatus = true;
			},
			cancel() {
				this.regionaStatus = false;
			},
			confirm(e) {
				console.log(e)
				this.province_id = e.province_id;
				this.city_id = e.city_id;
				this.region_id = e.region_id;
				this.street_id = e.street_id;
				this.selectRegion = e.province + e.city + e.area + e.street;
				this.regionaStatus = false;


			},
			// 营业开始时间
			bindTimeChangestar: function(e) {
				this.startime = e.target.value
			},
			// 营业结束时间
			bindTimeChangeend: function(e) {
				this.endtime = e.target.value
			},
			//确定
			okyl() {
				uni.navigateBack({
					delta: 1
				})
			},
			// 重新申请
			newpaly() {
				this.status = 0
			},
			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title:self.$nw("加载中")
				})
				self._get('store.store/detail', {
					"store_id": self.store_id
				}, function(res) {
					console.log("res", res)
					if (res.data == null) {
						self.status = 0
					} else {


						self.store_name = res.data.detail.store_name //门店名称
						self.linkman = res.data.detail.linkman //联系人
						self.address = res.data.detail.address //详细地址
						self.house_number = res.data.detail.house_number; //门牌号
						self.shop_hours = res.data.detail.shop_hours //营业时间
						self.phone = res.data.detail.phone //联系电话
						
						self.audit_status = res.data.detail.audit_status
						self.reject_reason = res.data.detail.reject_reason

						self.province_id = res.data.detail.province_id;
						self.city_id = res.data.detail.city_id;
						self.region_id = res.data.detail.region_id;
						self.street_id = res.data.detail.street_id;
						self.selectRegion = res.data.detail.region.province + " " + res.data.detail.region.city +
							" " +
							res.data.detail.region.region + " " + res.data.detail.region.street + " ";

						self.longitude = res.data.detail.longitude
						self.latitude = res.data.detail.latitude
						self.startime = (res.data.detail.shop_hours.split("-"))[0];
						self.endtime = (res.data.detail.shop_hours.split("-"))[1];
						
						
						self.legal= res.data.detail.legal;//法人姓名
						self.idcard= res.data.detail.idcard;//身份证号码
						self.business_license= res.data.detail.business_license;//营业执照
						self.idcard_positive= res.data.detail.idcard_positive;//身份证正面
						self.idcard_reverse= res.data.detail.idcard_reverse;//身份证负面
						self.label= res.data.detail.label;//类型 标签 ,隔开
				
						uni.hideLoading()


					}
				});
			},

			/*申请*/
			formSubmit: function(e) {
				let formdata = e.detail.value;
				let self = this;
				formdata.city_id = self.city_id;
				formdata.province_id = self.province_id;
				formdata.region_id = self.region_id;
				formdata.street_id = self.street_id;
				formdata.latitude = self.latitude;
				formdata.longitude = self.longitude;

				let startime = self
					.startime
				let endtime = self
					.endtime
				let store_id = self
					.store_id
				if (store_id) {
					formdata
						.store_id =
						store_id
				}
				if (formdata
					.store_name ==
					'') {

					self.tip(self.$nw("请输入门店名称！"), 3000);
					return;
				}
				if (formdata
					.linkman == ''
				) {

					self.tip(self.$nw("请输入联系人！"), 3000);
					return;
				}
				if (formdata
					.address == ''
				) {

					self.tip(self.$nw("请输入详细地址！"), 3000);
					return;
				}
				if (formdata
					.province_id == ''
				) {

					self.tip(self.$nw("请选择地区！"), 3000);
					return;
				}
				if (startime ==
					self.$nw("请选择营业开始时间")) {

					self.tip(self.$nw("请选择营业开始时间！"), 3000);
					return;
				} else if (
					endtime ==
					self.$nw("请选择营业结束时间")) {

					self.tip(self.$nw("请选择营业结束时间！"), 3000);
					return;
				} else {
					formdata
						.shop_hours =
						startime +
						" - " +
						endtime
				}

				if (formdata.phone
					.length == ''
				) {

					self.tip(self.$nw("请输入联系电话！"), 3000);
					return;
				}
				if (!
					/^1(3|4|5|6|7|8|9)\d{9}$/
					.test(formdata
						.phone)) {

					self.tip(self.$nw("手机有误,请重填！"), 3000);
					return;
				}

				// if(!self.is_read){
				// 	uni.showToast({
				// 		title: '请同意协议！',
				// 		icon:'none'
				// 	});
				// 	return;
				// }
				
				formdata.audit_status = self.audit_status;

				let callback =
					function() {
						uni.showLoading({
							title: self.$nw('正在提交'),
							mask: true
						})
						self._post(
							'store.store/upd',
							formdata,
							function(res) {
								uni.hideLoading();
								if(self.audit_status == 2){
									self.tip(self.$nw("重新提交成功"), 1500);
								}else{
									self.tip(self.$nw("修改成功"), 1500);
								}
								
								setTimeout(function() {
									uni.navigateBack({
										delta: 1
									})
								}, 1500)
							});
					};
				self.subMessage(self.temlIds, callback);







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
			//营业执照---start
			chooseWxImage_business_license(){
				let self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						self.uploadFile(res.tempFilePaths[0],2, function(data) {
							if (data.file_path) {
								console.log("data", data)
								self.business_license = data.file_path
							}
						})
					},
					fail: function(t) {
						console.log(t)
						uni.hideLoading()
					},
				})
			},
			onChoose_business_license(e) {
				let self = this
				const {
					business_license
				} = e.detail
				this.uploadFile(business_license, function(data) {
					if (data.file_path) {
						self.business_license = data.file_path
					}
				})
			
			},
			//营业执照-----end
			//身份证正面---start
			chooseWxImage_idcard_positive(){
				let self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						self.uploadFile(res.tempFilePaths[0],2, function(data) {
							if (data.file_path) {
								console.log("data", data)
								self.idcard_positive = data.file_path
							}
						})
					},
					fail: function(t) {
						console.log(t)
						uni.hideLoading()
					},
				})
			},
			onChoose_idcard_positive(e) {
				let self = this
				const {
					idcard_positive
				} = e.detail
				this.uploadFile(idcard_positive, function(data) {
					if (data.file_path) {
						self.idcard_positive = data.file_path
					}
				})
			
			},
			//身份证正面-----end
			//身份证反面---start
			chooseWxImage_idcard_reverse(){
				let self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						self.uploadFile(res.tempFilePaths[0],2, function(data) {
							if (data.file_path) {
								console.log("data", data)
								self.idcard_reverse = data.file_path
							}
						})
					},
					fail: function(t) {
						console.log(t)
						uni.hideLoading()
					},
				})
			},
			onChoose_idcard_reverse(e) {
				let self = this
				const {
					idcard_reverse
				} = e.detail
				this.uploadFile(idcard_reverse, function(data) {
					if (data.file_path) {
						self.idcard_reverse = data.file_path
					}
				})
			
			},
			//身份证反面-----end
		}
	}

	function getLocation(self, latitude, longitude) {
		console.log(latitude)
		if (latitude == "" && longitude == "") {
			// #ifdef MP-WEIXIN
			uni.getLocation({
				type: 'wgs84',
				success(res) {
					self.longitude = res.longitude;
					self.latitude = res.latitude;
				},
				fail() {
					uni.showToast({
						icon: 'none',
						title: self.$nw("获取定位失败，请点击右上角按钮打开定位权限"),
						duration: 2000
					});
				},
			})
			// #endif
			// #ifndef MP-WEIXIN
			//根据IP获取经纬度
			var data = self.getAddressByIp(self, function(re) {
				console.log("getAddressByIp", re.data)
				self.latitude = JSON.stringify(re.data)
			})

			// #endif
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
