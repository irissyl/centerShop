<template>
	<view class="apply-agent">
		<!--未入驻-->
		<view class="form-wrap p30 f30">
			<view class="p30 d-c-c gray3 f40 fb">
				{{$nw("请填写商家信息")}}
			</view>
			<form @submit="formSubmit" @reset="formReset">
				<!--#ifndef MP-WEIXIN-->
				<view class="p-30-0 border-b" @click="chooseWxImageShop">
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">
						Logo</view>
					<view class="d-e-c" style="float: left;">
						<image mode="aspectFit" :src="avatarUrl"></image>
					</view>
					<view style="clear: both;"></view>
				</view>
				<!--#endif-->
				<!--#ifdef MP-WEIXIN-->
				<view class="p-30-0 border-b">
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">Logo</view>
					<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseLogo"
						style="display: flex;justify-content: flex-end;float: left;">
						<view class="user-avatar">
							<image v-if="avatarUrl" :src="avatarUrl" mode="aspectFill"></image>
						</view>
					</button>
					<view class="" style="clear: both;"></view>
				</view>
				<!--#endif-->



				<view class="form-item border-b">
					<view class="field-name">{{$nw("商家账号")}}</view>
					<input class="flex-1 ml20" name="user_name" v-model="user_name" type="text" value=""
						placeholder-class="grary" :placeholder="$nw('请输入商家账号')" />

					<view class="" style="color: #72b6ff;" @click="isExist">
						{{$nw("检查是否存在")}}
					</view>
				</view>

				<view class="form-item border-b">
					<view class="field-name">{{$nw("商家名称")}}</view>
					<input class="flex-1 ml20" name="supply_name" v-model="supply_name" type="text" value=""
						placeholder-class="grary" :placeholder="$nw('请输入商家名称')" />
				</view>



				<view class="form-item border-b">
					<view class="field-name">{{$nw('所属商会')}}</view>
					<input class="flex-1 ml20" name="shanghui" v-model="shanghui" type="text" value=""
						placeholder-class="grary" :placeholder="$nw('请输入所属商会')" />
				</view>

				<view class="form-item border-b">
					<view class="field-name">{{$nw('商家介绍')}}</view>
					<input class="flex-1 ml20" name="supply_introduce" type="text" value="" placeholder-class="grary"
						v-model="supply_introduce" :placeholder="$nw('请输入商家介绍')" />
				</view>

				<view class="form-item border-b">
					<view class="field-name">{{$nw('所属行业')}}</view>
					<view @click="chooseIndustry" class="flex-1 ml20" style="font-size: 32rpx;color:#808080;">
						{{currentIndustry}}
					</view>
				</view>




				<view style="color: #565656;" @click="copy(supply_user_name)">
					{{$nw('这是你的商家账号')}}：{{supply_user_name}} {{$nw('复制')}}
				</view>

				<view style="color: #ababab;margin-top: 20rpx;">
					{{$nw('如果商家账户已存在，即不会再创建商家账号，新门店所属该账户；一个用户只能创建一个商家账户；')}}
				</view>
				<view style="color: #ababab;">
					{{$nw('登录密码默认123456，后台可修改')}}
				</view>
				<view style="color: #ababab;">
					{{$nw('行业选择即修改')}}
				</view>


				<view class="d-c-c mt30" v-if="supply_id > 0">
					<button class="btn-red" style="border:none;" :style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',
					color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}" @click="updSupply">{{$nw('修改商家信息')}}</button>
				</view>



				<view class="p30 d-c-c gray3 f40 fb">
					{{$nw('请填写门店信息')}}
				</view>


				<view class="form-item border-b">
					<view class="field-name">{{$nw('门店名称')}}</view>
					<input class="flex-1 ml20" name="store_name" v-model="store_name" type="text" value=""
						placeholder-class="grary" :placeholder="$nw('请输入门店名称')" />
				</view>

				<view class="form-item border-b">
					<view class="field-name">{{$nw('门店介绍')}}</view>
					<input class="flex-1 ml20" name="summary" type="text" value="" placeholder-class="grary"
						v-model="summary" :placeholder="$nw('请输入门店介绍')" />
				</view>

				<view class="form-item border-b" style="margin-top: 30rpx;">
					<view class="field-name">{{$nw('联系人')}}</view>
					<input class="flex-1 ml20" name="linkman" type="text" value="" placeholder-class="grary"
						v-model="linkman" :placeholder="$nw('请输入联系人')" />
				</view>

				<view class="form-item border-b" style="margin-top: 30rpx;">
					<view class="field-name">{{$nw('类型')}}</view>
					<input class="flex-1 ml20" name="label" type="text" value="" placeholder-class="grary"
						v-model="label" :placeholder="$nw('请输入类型(多个可用,隔开)')" />
				</view>

				<view class="form-item border-b" style="margin-top: 30rpx;">
					<view class="field-name">{{$nw('法人姓名')}}</view>
					<input class="flex-1 ml20" name="legal" type="text" value="" placeholder-class="grary"
						v-model="legal" :placeholder="$nw('请输入法人姓名')" />
				</view>

				<view class="form-item border-b" style="margin-top: 30rpx;">
					<view class="field-name">{{$nw('身份证号码')}}</view>
					<input class="flex-1 ml20" name="idcard" type="text" value="" placeholder-class="grary"
						v-model="idcard" :placeholder="$nw('请输入身份证号码')" />
				</view>


				<!-- 营业执照 -->

				<view class="p-30-0 border-b" @click="chooseWxImage_business_license">
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">
						{{$nw('营业执照')}}</view>
					<view class="d-e-c" style="float: left;">
						<image mode="aspectFit" style="border-radius: 0%;" :src="business_license"></image>
					</view>
					<view style="clear: both;"></view>
				</view>



				<!-- 身份证正面 -->

				<view class="p-30-0 border-b" @click="chooseWxImage_idcard_positive">
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">
						{{$nw('身份证正面营业执照')}}</view>
					<view class="d-e-c" style="float: left;">
						<image mode="aspectFit" style="border-radius: 0%;" :src="idcard_positive"></image>
					</view>
					<view style="clear: both;"></view>
				</view>


				<!-- 身份证反面 -->

				<view class="p-30-0 border-b" @click="chooseWxImage_idcard_reverse">
					<view class="key-name" style="float: left;height: 100rpx;line-height:100rpx;">
						{{$nw('身份证反面')}}</view>
					<view class="d-e-c" style="float: left;">
						<image mode="aspectFit" style="border-radius: 0%;" :src="idcard_reverse"></image>
					</view>
					<view style="clear: both;"></view>
				</view>





				<view class="form-item border-b">
					<view class="field-name">{{$nw('营业开始时间')}}</view>
					<view class="leave_cont flex">
						<picker v-model="startime" mode="time" :value="startime" @change="bindTimeChangestar">
							<view class="uni-input">{{startime}}</view>
						</picker>
					</view>
				</view>
				<view class="form-item border-b">
					<view class="field-name">{{$nw('营业结束时间')}}</view>
					<view class="leave_cont flex">

						<picker v-model="endtime" mode="time" :value="endtime" :start="endtime"
							@change="bindTimeChangeend">
							<view class="uni-input">{{endtime}}</view>
						</picker>
					</view>
				</view>
				<view class="form-item border-b">
					<view class="field-name">{{$nw('联系电话')}}</view>
					<input class="flex-1 ml20" v-model="phone" name="phone" maxlength="11" type="number" value=""
						placeholder-class="grary" :placeholder="$nw('请输入联系电话')" />
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
					<textarea @click="gotoMap" class="input-box flex-1" name="address" :auto-height="true"
						v-model="address" :placeholder="$nw('请输入街道小区楼牌号等')"></textarea>
					<!-- <view   class="iconfont icon-edit" 
					style=" width: 70rpx;height: 70rpx;"></view> -->
				</view>

				<view class="form-item border-b">
					<text class="field-name">{{$nw("门牌号")}}</text>
					<textarea class="input-box flex-1" name="house_number" :auto-height="true" v-model="house_number"
						:placeholder="$nw('请输入门牌号')"></textarea>
				</view>

				<view class="form-item border-b" v-if="reject_reason">
					<view class="field-name">{{$nw("驳回原因")}}</view>
					<input class="flex-1 ml20" disabled="" v-model="reject_reason" name="reject_reason" type="text"
						value="" placeholder-class="grary" />
				</view>
				<view class="p-20-0 f28">
					<checkbox-group @change="changeFunc" style="float: left; width: 70rpx;transform: scale(0.8);">
						<checkbox value="checkbox" :checked="is_read" />
					</checkbox-group>
					<view style="float: left;">{{$nw("我已阅读并了解")}}</view>
					<view style="float: left;" class="red" @click="xieyi">
						【{{$nw("入驻协议")}}】
					</view>
					<view style="clear: both;">

					</view>
				</view>


				<view class="d-c-c mt30">
					<button class="btn-red" style="border:none;"
						:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
						form-type="submit">{{$nw("申请入驻")}}</button>
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
	import regionalComponents from '@/components/regionalComponents/regionalComponents.vue'
	import service from '@/components/diy/service/service';
	
	export default {
		components: {
			Popup,
			mpvueCityPicker,
			streetPicker,
			regionalComponents,
			service,
		
		},
		data() {
			return {
					t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
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
				other: this.$nw("请输入"),
				startime: this.$nw("请选择营业开始时间"), //营业开始时间
				endtime: this.$nw("请选择营业结束时间"), //营业结束时间
				status: -1, //0未入驻  1通过  2  审核中 3驳回 
				reject_reason: '', //驳回原因 
				user_name: "", //商家账号
				password: "", //商家密码
				supply_name: "", //商家名称
				shanghui: "", //所属商会
				supply_user_name: "", //商家账户
				supply_introduce: "", //商家介绍
				store_id: '', //门店id
				store_name: '', //门店名称
				summary: "", //门店介绍
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
				quick: 0,
				avatarUrl: this.websiteUrl + "file/images/avatar.png",
				image_id: "", //图片ID
				legal: "", //法人姓名
				idcard: "", //身份证号码
				business_license: this.websiteUrl + "file/images/business_license.png", //营业执照
				idcard_positive: this.websiteUrl + "file/images/idcard_positive.png", //身份证正面
				idcard_reverse: this.websiteUrl + "file/images/idcard_reverse.png", //身份证负面
				label: "", //类型 标签 ,隔开
				category_id: 0, //行业分类
				currentIndustry: this.$nw("请选择行业"),
				supply_id: 0,
			}
		},
		onShow() {
			this.getSupply()
			// 设置全局颜色
			this.setGlobalColor()
		},
		computed: {
			getbutton() {
				return this.setButton().button
			},
		},
		methods: {
			/* 选择行业 */
			chooseIndustry() {
				var self = this;
				let path = '/plus2/pages/project/category?source=supply&&supply_id=' + self.supply_id;
				uni.navigateTo({
					url: path
				})
			},
			copy(e) {
				uni.setClipboardData({
					data: e,
					success: function() {

					}
				});
			},
			getSupply() {
				var self = this;
				self._post(
					'store.store/getSupply', {

					},
					function(
						res
					) {
						console.log("res", res)
						if (res.data.user_name && res.data.user_name.length > 0) {
							self.user_name = res.data.user_name;
						}
						if (res.data.supply_user_name) {
							self.supply_user_name = res.data.supply_user_name;
						}
						if (res.data.name) {
							self.supply_name = res.data.name;
						}
						if (res.data.shanghui) {
							self.shanghui = res.data.shanghui;
						}
						if (res.data.introduce) {
							self.supply_introduce = res.data.introduce;
						}
						if (res.data.image_url) {
							self.avatarUrl = res.data.image_url;
						}

						if (res.data.supply_id) {
							self.supply_id = res.data.supply_id;
						}
						if (res.data.currentIndustry) {
							self.currentIndustry = res.data.currentIndustry;
						}

						if (res.data.category_id) {
							self.category_id = res.data.category_id;
						}

					});
			},
			isExist() { //检测商家账户是否存在
				var self = this;
				if (self.user_name === '') {
					self.tip(self.$nw("请输入商家账号！"), 3000);
					return;
				}
				self._post(
					'store.store/isSupplyExist', {
						user_name: self.user_name
					},
					function(
						res
					) {
						console.log("res", res)
						uni.showToast({
							title: res.msg,
							icon: "none"
						})
						self.supply_name = res.data.name;
						self.supply_introduce = res.data.introduce;
						self.avatarUrl = res.data.image_url;
					});
			},
			gotoMap() {
				let self = this;

				// #ifdef MP-WEIXIN
				uni.chooseLocation({
					latitude: parseFloat(self.latitude),
					longitude: parseFloat(self.longitude),
					success: function(re) {
						console.log('success', re);
						self.address = re.address + re.name
						self.latitude = re.latitude
						self.longitude = re.longitude
					}
				})

				// #endif

			},
			showMulLinkageRegionalComponents() {
				console.log(1111)
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
			updSupply() { //修该商家信息
				var self = this;
				if (self.supply_name.length <= 0) {

					self.tip(self.$nw("请输入商家名称！"), 3000);
					return;
				}

				var formdata = {
					supply_id: self.supply_id,
					name: self.supply_name,
					shanghui: self.shanghui,
					supply_introduce: self.supply_introduce
				};
				console.log("formdata", formdata)
				uni.showModal({
					title: self.$nw("系统提示："),
					content: self.$nw("是否修改商家信息"),
					success(rex) {
						if (rex.confirm) {
							uni.showLoading({
								title: self.$nw("正在提交"),
								mask: true
							})
							self._post(
								'store.store/updSupply',
								formdata,
								function(
									res
								) {
									uni
										.hideLoading();


									self.tip(
										self.$nw("修改成功"),
										3000);
									setTimeout
										(function() {
												uni.navigateBack({
													delta: 1
												})
											},
											3000
										)
								});
						}
					}
				})


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

				clearTimeout(uni.getStorageSync("xt_bar"))
				var xt = setTimeout(function() {
					uni.setStorageSync("xt_bar", xt)
					self.quick = 0;
				}, 5000);
				let formdata = e.detail.value;

				formdata.city_id = self.city_id;
				formdata.province_id = self.province_id;
				formdata.region_id = self.region_id;
				formdata.street_id = self.street_id;
				formdata.latitude = self.latitude;
				formdata.longitude = self.longitude;
				formdata.avatarUrl = self.avatarUrl;
				formdata.image_id = self.image_id;
				formdata.business_license = self.business_license;
				formdata.idcard_positive = self.idcard_positive;
				formdata.idcard_reverse = self.idcard_reverse;
				formdata.category_id = self.category_id;
				if (self.quick == 0) {
					self.quick = 1;
					self.is_apply_store_num(self, function(re) {
						if (re == false) {
							self.tip(self.$nw("门店申请已达上限，申请失败"), 3000);
							return;
						} else {
							//检测是否有正在审核的门店申请
							self.is_apply_store(self, function(re) {
								if (re) {
									self.tip(self.$nw("有正在申请的门店，请先等待通过"), 3000);
									return;
								} else {

									//检测是否开启【是否开启绑定上级】如果开启则提示前往绑定上级
									self.is_open_bind_referee_id(self, function(
										result) {
										if (result.data) {
											uni.showModal({
												title:self.$nw("系统提示："),
												content: self.$nw("检测到您还未绑定上级，是否前往绑定上级"),
												success(re) {
													if (re.confirm) {
														uni.navigateTo({
															url: "/main/pages/login/bindUserId"
														})
														return;
													}
												}
											})
										} else {
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
												.user_name ==
												'') {

												self.tip(self.$nw("请输入商家账号！"), 3000);
												return;
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
												.legal == ''
											) {

												self.tip(self.$nw("请输入法人姓名！"), 3000);
												return;
											}
											if (formdata
												.business_license == '' ||
												formdata.business_license == (self.websiteUrl +
													"file/images/business_license.png")
											) {

												self.tip(self.$nw("请上传营业执照！"), 3000);
												return;
											}
											if (formdata
												.idcard_positive == '' ||
												formdata.idcard_positive == (self.websiteUrl +
													"file/images/idcard_positive.png")
											) {

												self.tip(self.$nw("请上传身份证正面！"), 3000);
												return;
											}
											if (formdata
												.idcard_reverse == '' ||
												formdata.idcard_reverse == (self.websiteUrl +
													"file/images/idcard_reverse.png")
											) {

												self.tip(self.$nw("请上传身份证反面！"), 3000);
												return;
											}
											if (formdata
												.idcard == ''
											) {

												self.tip(self.$nw("请输入身份证号码！"), 3000);
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
											if (startime ==self.$nw("请选择营业开始时间")) {

												self.tip(self.$nw("请选择营业开始时间！"), 3000);
												return;
											} else if (
												endtime ==self.$nw("请选择营业结束时间")) {

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


											let callback =
												function() {
													uni.showLoading({
														title: self.$nw("正在提交"),
														mask: true
													})
													self._post(
														'store.store/apply',
														formdata,
														function(
															res
														) {
															uni
																.hideLoading();


															self.tip(
																 self.$nw("申请成功,后台正在审核"),
																3000);
															setTimeout
																(function() {
																		uni.navigateBack({
																			delta: 1
																		})
																	},
																	3000
																)
														});
												};
											self.subMessage(
												self
												.temlIds,
												callback);
										}
									});

								}
							})
						}
					})
				} else {
					uni.showToast({
						title:self.$nw("你点太快了哦"),
						icon: "none"
					})
				}


			},
			/* Logo上传 ---satrt */
			chooseWxImageShop() {
				let self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						self.uploadFile(res.tempFilePaths[0], function(data) {
							if (data.file_path) {
								console.log("data", data)
								self.avatarUrl = data.file_path
								self.image_id = data.uploadFile.id
							}
						})
					},
					fail: function(t) {
						console.log(t)
						uni.hideLoading()
					},
				})
			},
			onChooseLogo(e) {
				let self = this
				const {
					avatarUrl
				} = e.detail
				this.uploadFile(avatarUrl, function(data) {
					if (data.file_path) {
						self.avatarUrl = data.file_path
						self.image_id = data.uploadFile.id
					}
				})

			},
			// logo ---end
			//营业执照---start
			chooseWxImage_business_license() {
				let self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						self.uploadFile(res.tempFilePaths[0], function(data) {
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

			//营业执照-----end
			//身份证正面---start
			chooseWxImage_idcard_positive() {
				let self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						self.uploadFile(res.tempFilePaths[0], function(data) {
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

			//身份证正面-----end
			//身份证反面---start
			chooseWxImage_idcard_reverse() {
				let self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						self.uploadFile(res.tempFilePaths[0], function(data) {
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

			//身份证反面-----end
			/*上传图片*/
			uploadFile: function(filePath, callback) {
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
					url: "/plus2/pages/xieyi/xieyi?code=ruzhu"
				})
			}
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