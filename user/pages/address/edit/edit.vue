<template>
	<view class="address-form">
		<form @submit="formSubmit" @reset="formReset">
			<view class="bg-white p-0-30 f30">
				<view class="d-s-c">
					<text class="key-name">{{$nw("收货人")}}</text>
					<input class="ml20 flex-1 p-30-0" name="name" type="text" v-model="address.name"
					 placeholder-class="grary" :placeholder="$nw('请输入收货人姓名')" />
				</view>
				<view class="d-s-c">
					<text class="key-name">{{$nw("联系方式")}}</text>
					<input class="ml20 flex-1 p-30-0" name="phone" type="text" v-model="address.phone" 
					placeholder-class="grary" :placeholder="$nw('请输入收货人手机号')" />
				</view>
	
				<view class="d-s-c">
					<text class="key-name">{{$nw("所在地区")}}</text>
					<view class="input-box flex-1">
						<input
							class="ml20 flex-1 p-30-0"
							type="text"
							value=""
							placeholder-class="grary"
							placeholder=""
							v-model="selectRegion"
							disabled="true"
							@click="showMulLinkageRegionalComponents"
						/>
					</view>
				</view>
				<view class="d-s-c">
					<text class="key-name">{{$nw("详细地址")}}</text>
					<textarea class="ml20 flex-1 p-30-0 lh150" name="detail" :auto-height="true" 
					v-model="address.detail" :placeholder="$nw('请输入街道小区楼牌号等')"></textarea>
				</view>
			</view>
			<view class="p30"><button type="primary" form-type="submit" class="btn-red f30 mt30" 
			
			:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#fff'}"
			
			>{{$nw('确认')}}</button></view>
		</form>
		
		<!-- #ifndef APP -->
		<street-picker ref="streetPicker" :streetDataList="streetDataList" @onConfirm="onConfirmStreet"></street-picker>
		<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm">
		</mpvue-city-picker>
		<!-- #endif -->
		<regionalComponents v-if="regionaStatus" v-show="regionaStatus" ref="regionalComponents" :defaultData="defaultData" @cancel="cancel" @confirm="confirm" ></regionalComponents>
		<service :itemData="t_service"></service>
	
	</view>
</template>

<script>
import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
import streetPicker from '@/components/mpvue-citypicker/streetPicker.vue';
import regionalComponents from '@/components/regionalComponents/regionalComponents.vue'
	import service from '@/components/diy/service/service';
	
export default {
	components: {
		mpvueCityPicker,
		streetPicker,
		regionalComponents,
		service,
		
	},
	data() {
		return {
			t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
			cityPickerValueDefault: [0, 0, 0],
			selectCity: this.$nw("选择省,市,区"),
			province_id: 0,
			city_id: 0,
			region_id: 0,
			/*地址id*/
			address_id: 0,
			/*街道id*/ 
			street_id: 0,
			/*地址数据*/
			address: {},
			/*地区*/
			region: {},
			selectStreet: this.$nw("街道/镇/乡"),
			is_street: false,
			streetDataList:[],
			selectRegion: this.$nw("选择地区"),
			defaultData: {
				address_id: 0,
			},
			regionaStatus: false,
		};
	},
	onShow() {
		uni.setNavigationBarTitle({
			    title: this.$nw("修改地址")
			}); 
			this.setGlobalColor()
	},
	onLoad(e) {
		this.address_id = e.address_id;
		this.defaultData.address_id = e.address_id;
	},
	mounted() {
		/*获取地址数据*/
		this.getData();
	},
  computed: {
    active() {
      return Object.assign(this.setBackgroundColor(), this.setColor())
    },
	getbutton() {
		return this.setButton().button
	}
  },
	methods: {
		showMulLinkageRegionalComponents(){
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
			this.selectRegion = e.province+e.city+e.area+e.street;
			this.regionaStatus = false;
		},
		/*获取数据*/
		getData() {
			let self = this;
			let address_id = self.address_id;
			self._get(
				'user.address/detail',
				{
					address_id: address_id
				},
				function(res) {
					self.address = res.data.detail;
					self.address_id = res.data.detail.address_id;
					self.province_id = res.data.detail.province_id;
					self.city_id = res.data.detail.city_id;
					self.region_id = res.data.detail.region_id;
					self.street_id = res.data.detail.street_id;
					self.region = res.data.region;
					self.streetDataList = res.data.street_list;
					if(res.data.street_list.length){
						self.is_street = true;
					}
					self.defaultData.province_id = res.data.detail.province_id;
					self.defaultData.city_id = res.data.detail.city_id;
					self.defaultData.region_id = res.data.detail.region_id;
					self.defaultData.street_id = res.data.detail.street_id;
					let add = '';
					// var b = self.region.forEach(item => {
					// 	add += item;
					// });
					add += res.data.detail.district.province;
					add += res.data.detail.district.city;
					add += res.data.detail.district.region;
					if(res.data.detail.district.street){
						self.selectStreet = res.data.detail.district.street;
						add += res.data.detail.district.street;
					}
					self.selectCity = add;
					self.selectRegion = add;
				}
			);
		},

		/*提交地址*/
		formSubmit: function(e) {
			let self = this;
			var formdata = e.detail.value;
			formdata.province_id = self.province_id;
			formdata.city_id = self.city_id;
			formdata.region_id = self.region_id;
			formdata.street_id = self.street_id;
			formdata.address_id = self.address_id;
			formdata.region = self.region;

			if (formdata.name == '') {
				uni.showToast({
					title: self.$nw("请输入收货人姓名"),
					duration: 1000,
					icon: 'none'
				});
				return false;
			}

			if (formdata.phone == '') {
				uni.showToast({
					title: self.$nw("请输入收货人手机号"),
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

			if (formdata.province_id == 0 || formdata.city_id == 0 || formdata.region_id == 0||formdata.detail == '') {

				uni.showToast({
					title: self.$nw("请选择完整省市区"),
					duration: 1000,
					icon: 'none'
				});
				return false;
			}

			self._post('user.address/edit', formdata, function(res) {
				self.showSuccess(res.msg, function() {
					uni.navigateBack();
				});
			});
		},

		/*清空数据*/
		formReset: function(e) {
			console.log('清空数据');
		},

		/*三级联动选择*/
		showMulLinkageThreePicker() {
			this.$refs.mpvueCityPicker.show();
		},
		
		/*选择街道镇乡*/
		showMulLinkageStreetPicker() {
			this.$refs.streetPicker.show();
		},
		
		onConfirmStreet(e){
			console.log(e)
			this.selectStreet = e.label;
			this.street_id = e.cityCode;
		},

		/*选择之后绑定*/
		onConfirm(e) {
			console.log(e);
			this.selectCity = e.label;
			this.province_id = e.cityCode[0];
			this.city_id = e.cityCode[1];
			this.region_id = e.cityCode[2];
			this.region = e.label;
			this.street_id = 0;
			this.streetDataList = [];
			this.selectStreet = self.$nw("选择街道/镇/乡");
			this.getStreet();
		},
		getStreet(){
			let self = this;
			var params = {};
			params.province_id = self.province_id;
			params.city_id = self.city_id;
			params.region_id = self.region_id;
			self._post('user.address/getStreet', params, function(res) {
				if(res.data.list.length>0){
					self.streetDataList = res.data.list;
					self.is_street = true;
				} else {
					self.is_street = false;
				}
			});
		}
	}
};
</script>

<style>
.address-form .key-name {
	width: 200rpx;
}
.address-form .btn-red{
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
}
</style>
