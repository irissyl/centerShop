<template>
	<view class="address-form">
		<form @submit="formSubmit" @reset="formReset">
			<view class="bg-white p-0-30 f30">
				<view class="d-b-c p-30-0">
					<text class="key-name" style="">选择身份</text>
					<view style="width: 68%;">
						<view class="log2">
							<picker style="font-size: 34rpx; float: left;color:#2a2a2a;text-align: left;"
								mode="selector" @change="bindPickerChange1" :value="index1" :range="array1">
								{{array1[index1]}}
							</picker>
							<view style="clear: both;">

							</view>
						</view>
					</view>
				</view>


				<view class="d-b-c p-30-0" v-if="index1 == 1">
					<text class="key-name" style="">选择身份类型</text>
					<view style="width: 68%;">
						<view class="log2">
							<picker style="font-size: 34rpx; float: left;color:#2a2a2a;text-align: left;"
								mode="selector" @change="bindPickerChange2" :value="index2" :range="array2"
								range-key="text">
								{{array2[index2].text}}
							</picker>
							<view style="clear: both;">

							</view>
						</view>
					</view>
				</view>


				<view class="d-s-c">
					<text class="key-name">姓名</text>
					<input class="ml20 flex-1 p-30-0" name="name" type="text" v-model="address.name"
						placeholder="请输入姓名" />
				</view>

				<view class="d-b-c p-30-0">
					<text class="key-name" style="">性别</text>
					<view style="width: 68%;">
						<view class="log2">
							<picker style="font-size: 34rpx; float: left;color:#2a2a2a;text-align: left;"
								mode="selector" @change="bindPickerChange" :value="index" :range="array">
								{{array[index]}}
							</picker>
							<view style="clear: both;">

							</view>
						</view>
					</view>
				</view>

				<view class="d-s-c">
					<text class="key-name">年龄</text>
					<input class="ml20 flex-1 p-30-0" name="age" type="text" v-model="address.age"
						placeholder="请输入年龄" />
				</view>

				<view class="d-s-c">
					<text class="key-name">联系方式</text>
					<input class="ml20 flex-1 p-30-0" name="phone" type="text" v-model="address.phone"
						placeholder="请输入手机号" />
				</view>

				<view class="d-s-c">
					<text class="key-name">身份证</text>
					<input class="ml20 flex-1 p-30-0" name="phone" type="text" v-model="address.idencard"
						placeholder="请输入身份证号" />
				</view>



			</view>
			<view class="p30"><button type="primary" form-type="submit" class="btn-theme f30 mt30"
					:style="[active]">{{$nw('确认')}}</button></view>
		</form>

	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {

			return {

				address: {
					age: 18,
					phone: ""
				},
				array: ['女', '男'],
				index: 0,

				array1: ['人员', '监护人'],
				index1: 0,

				array2: [],
				index2: 0,

				identity_id: ""
			};
		},
		onShow() {
			var self = this;
			self.setGlobalColor()
			self._post('plus.identity.Identity/getIdentityType', {}, function(res) {
				self.array2 = res.data
			});
		},
		onLoad(e) {
			this.identity_id = e.identity_id;
			this.getData()
		},
		computed: {
			active() {
				return Object.assign(this.setBackgroundColor(), this.setColor())

			}
		},
		methods: {
			bindPickerChange2(e) {
				var self = this;
				self.index2 = e.detail.value
			},
			/*获取数据*/
			getData() {
				let self = this;
				let identity_id = self.identity_id;
				self._get(
					'plus.identity.Identity/detail', {
						identity_id: identity_id
					},
					function(res) {
						self.address = res.data;
						self.index1 =  self.address.code == "guardian"?1:0;
						 self.address.type =  self.address.type.value
						self.index2 =  self.address.type - 1;
						self.index = self.address.gender 
						
					}
				);
			},
			bindPickerChange(e) {
				var self = this;
				self.index = e.detail.value
			},

			bindPickerChange1(e) {
				var self = this;
				self.index1 = e.detail.value
			},

			confirm(e) {
				console.log(e)

			},
			/*提交*/
			formSubmit: function(e) {
				let self = this;
				var formdata = e.detail.value;
				formdata.phone = self.address.phone
				formdata.gender = self.index
				formdata.idencard = self.address.idencard
				formdata.type = self.array2[self.index2].id
				formdata.code = self.index1 == 0 ? "camper" : "guardian"
				formdata.identity_id = self.identity_id

				if (formdata.name == '') {
					uni.showToast({
						title: self.$nw("请输入姓名"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}

				if (formdata.phone == '') {
					uni.showToast({
						title: self.$nw("请输入手机号"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}

				let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
				if (!reg.test(formdata.phone)) {
					uni.showToast({
						title: self.$nw("手机号码格式不正确"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}



				self._post('plus.identity.Identity/edit', formdata, function(res) {
					self.showSuccess(res.msg, function() {
						uni.navigateBack();
					});
				});
			},

			formReset: function(e) {
				console.log('清空数据');
			},


		}
	};
</script>

<style>
	.address-form .key-name {
		width: 200rpx;
	}

	.address-form .btn-theme {
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
	}
</style>