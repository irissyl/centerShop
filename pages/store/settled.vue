<template>
	<view class="apply-agent">
		<!--未入驻-->
		<view class="form-wrap p30 f30">
			<view class="p30 d-c-c gray3 f40 fb">
				{{$nw('请填写店铺信息')}}
			</view>
			<form @submit="formSubmit" @reset="formReset">
				<view class="form-item border-b">
					<view class="field-name">{{$nw('门店名称')}}</view>
					<input class="flex-1 ml20" name="store_name" v-model="store_name" type="text" value=""
						placeholder-class="grary" :placeholder="$nw('请输入门店名称')" />
				</view>
				<view class="form-item border-b">
					<view class="field-name">{{$nw('联系人')}}</view>
					<input class="flex-1 ml20" name="linkman" type="text" value="" placeholder-class="grary"
						v-model="linkman" :placeholder="$nw('请输入联系人')" />
				</view>
				<!-- 		<view class="form-item border-b">
					<view class="field-name">详细地址</view>
					<input class="flex-1 ml20" name="address" type="text" value="" placeholder-class="grary"
						v-model="address" placeholder="请输入详细地址" />
				</view> -->
				<view class="form-item border-b">
					<view class="field-name">{{$nw('营业开始时间')}}</view>
					<view class="leave_cont flex">
						<picker v-model="startime" mode="time" :value="startime" @change="bindTimeChangestar">
							<view class="uni-input">{{startime}}</view>
						</picker>
						<!-- 							<view> - </view>
						<picker mode="time" :value="startime" :start="startime" @change="bindTimeChangeend">
							<view class="uni-input">{{endtime}}</view>
						</picker> -->
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
					<view class="field-name">{{$nw("联系电话")}}</view>
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
					<text class="field-name">{{$nw('门牌号')}}</text>
					<textarea class="input-box flex-1" name="house_number" :auto-height="true" v-model="house_number"
						:placeholder="$nw('请输入门牌号')"></textarea>
				</view>

				<view class="form-item border-b" v-if="reject_reason">
					<view class="field-name">>{{$nw('驳回原因')}}</view>
					<input class="flex-1 ml20" disabled="" v-model="reject_reason" name="reject_reason" type="text"
						value="" placeholder-class="grary" />
				</view>
				<view class="p-20-0 f28">
					<checkbox-group @change="changeFunc" style="float: left; width: 70rpx;transform: scale(0.8);">
						<checkbox value="checkbox" :checked="is_read" />
					</checkbox-group>
					<view style="float: left;">{{$nw('我已阅读并了解')}}</view>
					<view style="float: left;" class="red" @click="xieyi">
						【{{$nw('入驻协议')}}】
					</view>
					<view style="clear: both;">

					</view>
				</view>
				<view class="d-c-c mt30" v-if="a_status == 2">
					<button class="btn-red" form-type="submit">{{$nw('重新申请')}}</button>
				</view>
				<view class="d-c-c mt30" v-else>
					<button class="btn-red" form-type="submit">{{$nw('申请入驻')}}</button>
				</view>
			</form>
		</view>

		<!--协议-->
		<Popup :show="isPopup" msg="申请协议">
			<view class="agreement-content f28 lh150">
				{{agreement}}
			</view>
			<view class="ww100 pt20 d-c-c">
				<button type="primary" class="btn-red" @click="isPopup=false">{{$nw('我已阅读')}}</button>
			</view>
		</Popup>

		
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
				other: this.$nw('请输入'),
				startime: this.$nw('请选择营业开始时间'), //营业开始时间
				endtime: this.$nw('请选择营业结束时间'), //营业结束时间
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
				quick: 0
			}
		},
		mounted() {
			/*数据*/
			this.getData();
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
			/*获取数据*/
			getData() {
				let self = this;
				self._get('store.store/applyDetail', {}, function(res) {
					if (res.data == null) {
						self.status = 0

					} else {
						console.log(res)
						self.a_status = res.data.a_status;

						if (res.data.stores) {
							self.latitude = res.data.stores.latitude;
							self.longitude = res.data.stores.longitude;
							getLocation(self, self.latitude, self.longitude)
						} else {
							getLocation(self, "", "")
						}

						if (res.data.a_status == 2) {

							self.store_id = res.data.stores.store_id
							self.store_name = res.data.stores.store_name //门店名称
							self.linkman = res.data.stores.linkman //联系人
							self.address = res.data.stores.address //详细地址
							self.house_number = res.data.stores.house_number; //门牌号
							self.shop_hours = res.data.stores.shop_hours //营业时间
							self.phone = res.data.stores.phone //联系电话
							self.reject_reason = res.data.reject_reason

							self.province_id = res.data.stores.province_id;
							self.city_id = res.data.stores.city_id;
							self.region_id = res.data.stores.region_id;
							self.street_id = res.data.stores.street_id;

							self.startime = (res.data.stores.shop_hours.split("-"))[0];
							self.endtime = (res.data.stores.shop_hours.split("-"))[1];


						}

					}
				});
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
				if (self.quick == 0) {
					self.quick = 1;
					self.is_apply_store_num(self, function(re) {
						if (re == false) {
							self.tip(self.$nw("门店申请已达上限，申请失败"), 3000);
							return;
						} else {
							self.apply_store(self, function(re) {
								if (re == false) {
									uni.showModal({
										title: self.$nw("系统提示："),
										content: self.$nw("门店申请失败，请提升您的会员等级，是否前往升级"),
										success(rs) {
											if (rs.confirm) {
												uni.navigateTo({
													url: "/user/pages/grade/apply"
												})
												return;
											} else {
												return;
											}
										}
									})

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
														title: self.$nw("系统提示："),
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
														self.$nw('请选择营业开始时间')) {

														self.tip(self.$nw("请选择营业开始时间！"), 3000);
														return;
													} else if (
														endtime ==
														self.$nw('请选择营业结束时间')) {

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

														self.tip(self.$nw('请输入联系电话！'), 3000);
														return;
													}
													if (!
														/^1(3|4|5|6|7|8|9)\d{9}$/
														.test(formdata
															.phone)) {

														self.tip(self.$nw('手机有误,请重填！'), 3000);
														return;
													}


													let callback =
														function() {
															uni.showLoading({
																title: self.$nw('正在提交'),
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
																		self.$nw('申请成功'),
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
						}
					})
				} else {
					uni.showToast({
						title: self.$nw("你点太快了哦"),
						icon: "none"
					})
				}







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
</style>