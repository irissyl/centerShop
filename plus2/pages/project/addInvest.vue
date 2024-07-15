<template>
	<view>
		<view class="staff-editInfo-sec">
			<!-- <view class="child"></view> -->
			<view class="child">
				<view class="flex">
					<view class="flex100-2">公司名称</view>
					<view class="flex100-8 tl">
						<input v-model="staffInfo.company"  placeholder="请填写公司名称" type="text"></input>
					</view>
				</view>
			</view>
			
			<view class="child">
				<view class="flex" @click="handerPopupAreaChange">
					<view class="flex100-2">投资地区</view>
					<view class="flex100-8 tl" style="font-size: 32rpx;color:#808080;">
						<text>{{selectCity}}</text>
						<!-- <input v-model="staffInfo.address"  placeholder="请选择投资地区" type="text" disabled="true"></input> -->
					</view>
				</view>
			</view>
			
			<view class="child">
				<view class="flex">
					<view class="flex100-2">投资金额</view>
					<view class="flex100-8 tl">
						<input  placeholder="请填写投资金额" type="text" v-model="staffInfo.budget"></input>
					</view>
				</view>
			</view>
			
			<view class="child">
				<view class="flex" @click="chooseIndustry">
					<view class="flex100-2">投资行业</view>
					<view class="flex100-8 tl" style="font-size: 32rpx;color:#808080;">
						{{currentIndustry}}
					</view>
				</view>
			</view>
			
			<view class="child">
				<view class="flex">
					<view class="flex100-2">联系方式</view>
					<view class="flex100-8 tl">
						<input v-model="staffInfo.mobile"  placeholder="请填写手机号码" type="number"></input>
					</view>
				</view>
			</view>
		
		</view>
		
		<view class="staff-editInfo-common">
		    <view class="title">投资要求</view>
		    <textarea class="br-15" decode="emsp" maxlength="-1" name="desc" placeholder="请填写项目投资要求" v-model="staffInfo.introduce"></textarea>
		</view>
		
		<view>
			
		</view>
		<button class="fix-painter-share tc" v-if="!disabledFlag"   @click="toEditStaff" formType="submit" hoverClass="none" style="border-radius:15rpx;width:92%;margin:60rpx auto;background:#6599fe;">
			保存
		</button>
		<button class="fix-painter-share tc" v-else disabled="disabled"   @click="toEditStaff" formType="submit" hoverClass="none" style="border-radius:15rpx;width:92%;margin:60rpx auto;background:#6599fe;">
			保存
		</button>

		<view :class="globalData.isIphoneX?'isIphoneX':''"></view>
		<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import utils from '@/common/utils.js';
	import config from '@/config.js'
	export default {
		components: {
			mpvueCityPicker
		},
		data() {
			return {
				staffInfo:{
					title: '',
					mobile: '',
					introduce:'',
					category_id:'',
					budget:'',
					address:'',
					latitude:'',
					longitude:'',
					type:1,
				},
				currentIndustry:'请选择投资行业',
				selectCity:'请选择投资地区',
				cityPickerValueDefault: [0, 0, 0],
				categoryData:[],
				multiIndex: [0, 0],
				showIndustry:false,
				globalData:{
					
				},
				from:'',
				disabledFlag:''
			}
		},
		onLoad(){
			
		},
		methods: {

			/* 选择行业 */
			chooseIndustry(){
				let path = '/pages/project/category?source=edit';
				uni.navigateTo({
					url: path
				})
			},
			
			closeCategory(e){
				console.log(e);
			},
			
			
			/* 保存 */
			toEditStaff(){
				let self = this;
				let params = self.staffInfo;
				
				self._post(
					'plus.project.project/edit',
					params,
					function(res){
						if(res.code ==1){
							self.disabledFlag = 'disabled';
							uni.showModal({
								title: "提示",
								content:res.msg,
								showCancel:false,
								success: function (res) {
									
									if (res.confirm) {
										let path = '/pages/project/index';
										uni.redirectTo({
											url:path
										})
									} else if (res.cancel) {
										console.log('用户点击取消');
									}
								}
							});
							
						}
					}
				)
			},
			chooseLocation(){
				let self = this;
				uni.chooseLocation({
					success(res) {
						if(res.errMsg=='chooseLocation:ok'){
							self.staffInfo.address = res.address
							self.staffInfo.longitude = res.longitude;
							self.staffInfo.latitude = res.latitude;
						}
						
					}
				})
				console.log(self.staffInfo);
			},
			/* 选择地址 */
			handerPopupAreaChange(){
				this.$refs.mpvueCityPicker.show();
			},
			/*选择之后绑定*/
			onConfirm(e) {
				console.log(e);
				this.selectCity = e.label;
				this.staffInfo.province_id = e.cityCode[0];
				this.staffInfo.city_id = e.cityCode[1];
				this.staffInfo.region_id = e.cityCode[2];
			},
			
			
		}
	}
</script>

<style>
	.staff-editInfo-sec {
	    width: 100%;
	    height: auto;
	    display: block;
	    margin-top: 20rpx;
	    background: white;
	    /* border: 1rpx solid #e5e5e5; */
	    border-left: transparent;
	    border-right: transparent;
	}
	
	.staff-editInfo-sec .child {
	    width: 92%;
	    height: 90rpx;
	    line-height: 90rpx;
	    padding: 0rpx 4%;
	    display: block;
	}
	
	.staff-editInfo-sec .child .flex {
	    border-bottom: 1rpx solid #e5e5e5;
	    font-size: 28rpx;
		height: 90rpx;
	    color: #000000;
	}
	.flex{
		display: flex;
	}
	
	.flex,.flex100 {
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	}
	
	.flex100 {
	    width: 100%;
	}

	.flex100-2 {
	    flex: 0 0 20%;
	    box-sizing: border-box;
		font-size: 32rpx;
	}
	
	.flex100-8 {
	    flex: 0 0 80%;
	    box-sizing: border-box;
	}
	
	.staff-editInfo-sec .child:nth-last-child(1) .flex {
	    border: transparent;
	}
	
	.staff-editInfo-sec .child .flex .tr {
	    color: #595959;
	}
	
	.staff-editInfo-sec .child .flex .nothing {
	    color: #969696;
	}
	
	.staff-editInfo-sec .child .flex .tr image {
	    width: 120rpx;
	    height: 120rpx;
	    display: block;
	}
	
	.staff-editInfo-sec .child .flex .tr picker {
	    width: 70%;
	    padding-right: 10rpx;
	    float: right;
	}
	
	.staff-editInfo-common {
	    width: 92%;
	    height: auto;
	    padding: 0rpx 4%;
	    background: white;
	    border-bottom: 1rpx solid #e5e5e5;
	    border-left: transparent;
	    border-right: transparent;
	}
	
	.staff-editInfo-common .title {
	    height: 90rpx;
	    line-height: 90rpx;
	    font-size: 30rpx;
	    color: #2f2f2f;
		border-top: 1rpx solid #e5e5e5;
	}
	
	.staff-editInfo-common .remark {
	    font-size: 30rpx;
	    color: #2f2f2f;
	    line-height: 38rpx;
	    padding-bottom: 40rpx;
	}
	
	.staff-editInfo-common textarea,.staff-editInfo-common .textarea,.staff-editInfo-common .voice {
	    width: 94%;
	    min-height: 170rpx;
	    font-size: 32rpx;
		color:#808080;
	    line-height: 34rpx;
	    padding: 14rpx 3%;
	    resize: none;
	    outline: none;
	    display: block;
	    margin-bottom: 20rpx;
	    background: #f4f4f4;
	    border: 1rpx solid #e5e5e5;
	}
	
	.staff-editInfo-common textarea {
	    height: 170rpx;
	}
	
	.staff-editInfo-common .tag-em-left {
	    width: 20rpx;
	    height: 20rpx;
	    display: block;
	    top: 53rpx;
	    left: 125rpx;
	    background: white;
	    border-top: transparent;
	    border-right: transparent;
	    transform: rotate(45deg);
	}
	
	.staff-editInfo-common .content {
	    width: 83%;
	    height: 102rpx;
	    line-height: 102rpx;
	    display: block;
	    padding: 0rpx 5%;
	    margin-left: 11rpx;
	    background: white;
	}
	
	
	.fix-painter-share {
	    width: 100%;
	    height: 90rpx;
	    line-height: 90rpx;
	    bottom: 0rpx;
	    color: white;
	    background: white;
	    border-radius: 0rpx;
	}
	
	.fix-painter-share button {
	    width: 100%;
	    height: 90rpx;
	    line-height: 90rpx;
	    color: white;
	    background: #6599fe;
	    border-radius: 0rpx;
	}
	input{
		font-size:32rpx;
	}
</style>
