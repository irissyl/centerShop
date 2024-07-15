<template>
	<view class="grade">
		<view class="banner-image d-c-c">
			<image :src="setting.banner_file_path" mode="widthFix"></image>
		</view>
		<view class="" style="padding: 20rpx;">
			<view class="d-s-c border-b-e">
				<text class="key-name">{{$nw('供应商名称')}}</text>
				<input class="ml20 flex-1 p-30-0" name="name" type="text" v-model="name"  
				:placeholder="$nw('请输入名称')" />
			</view>
			<view class="d-s-c border-b-e">
				<text class="key-name">{{$nw('供应商简介')}}</text>
				<input class="ml20 flex-1 p-30-0" name="introduce" type="text" v-model="introduce"  
				:placeholder="$nw('请输入简介')" />
			</view>
			<view class="d-c-c p-20-0 f28">
				<checkbox-group @change="changeFunc">
					<checkbox value="checkbox" :checked="is_read" />
					<text>{{$nw('我已阅读并了解')}}</text>
					<text class="red" @click="isPopup=true">
						【{{$nw('商家入驻协议')}}】
					</text>
				</checkbox-group>

			</view>
		</view>

		<view class="title d-c-c">
			<text class="line left-line"></text>
			<text class="name">{{$nw('请选择升级等级')}}</text>
			<text class="line right-line"></text>
		</view>
		<view class="grade-list">
			<view  v-for="(item, index) in listData" :key="index" @click="chooseGrade(item.kmd_grade_id)">
				<view  :class=" type==item.kmd_grade_id?'item red-border':'item'">
					<view  class="grade-info">
						<view class="grade-title">{{ item.name }}</view>
						<view class="d-b-c mt20">
							<view class="gray">
								{{$nw('申请金额')}}
							</view>
							<view class="price">
								{{$nw("¥")}}
								<text class="num">{{ item.money }}</text>
							</view>
						</view>
					</view>
				</view>

			</view>
			<!-- 没有记录 -->

		</view>
		<!--支付方式v-if="OrderData.order_pay_price != 0||1==1"-->
		<view class="buy-checkout" v-if="kmd_grade_id!=0">
			
			<payOptions :payTypeList="payTypeList" :need_sel="0" :checkedPayType="pay_type" @click="payTypeFunc">
			</payOptions>
			
			<view class="p20"><button type="default"  @click="goPay(10)" class="btn-red f30 mt30">{{$nw('下一步')}}</button></view>
		</view>

		<view class="banner-image d-c-c">
			<image :src="setting.file_path" mode="scaleToFill"></image>
		</view>
		<!--协议-->
		<Popup :show="isPopup" :msg="$nw('申请协议')">
			<view class="agreement-content f28 lh150">
				{{setting.license}}
			</view>
			<view class="ww100 pt20 d-c-c">
				<button type="primary" class="btn-red" :style="[active]" @click="isPopup=false">{{$nw('我已阅读')}}</button>
			</view>
		</Popup>
	</view>
</template>

<script>
import Popup from '@/components/uni-popup.vue';
	import {pay} from '@/common/pay.js'
	import payOptions from "@/components/order/payOptions";
export default {
	components: {
		Popup,
		payOptions
	},
	data() {
		return {
			/*弹窗是否打开*/
			isPopup: false,
			/*是否阅读了规则*/
			is_read:false,

			type:'no',
			name:'',
			introduce:'',
			kmd_grade_id:0,
			/*数据*/
			listData: [],
			setting:{},
			/*是否显示支付类别弹窗*/
			payTypeList:[],
			/*支付方式*/
			pay_type:10,
		};
	},

	onShow() {
    this.setGlobalColor()
		uni.showLoading({
			title: this.$nw("加载中")
		});
		/*获取个人中心数据*/
		this.getData();
	},
	computed: {
		/*加载中状态*/
    active() {
      return Object.assign(this.setBackgroundColor(), this.setColor())
    },
	},
	onPullDownRefresh() {

	},
	methods: {
		/*获取数据*/
		getData() {

			let self = this;
			self._get(
				'plus.supply.supply/apply',
				{},
				function(res) {
					self.listData = res.data.list;
					self.setting = res.data.setting;
					self.payTypeList = res.data.payTypeList.val
					self.pay_type = res.data.payTypeList.pay_type
					var apply = res.data.apply;
					uni.hideLoading();
					if(apply['need_mobile']){
						self.showSuccess(self.$nw("需要绑定手机号后才能操作"), () => {
							uni.navigateTo({
								url:'/pages/login/bindmobile'
							});
						});
						return false;
					}
					if(!apply['is_open']||!apply['is_apply']){
						self.showSuccess(self.$nw("未开启申请"), () => {
							uni.redirectTo({
								url:'/user/pages/index/index'
							});
						});
						return false;
					}
					if(apply['can_apply']!=1){
						let remark = self.$nw("请先实名认证后再升级");
						let url = '/plus/pages/certify/apply/apply?from_url=supply';
						if(apply['can_apply']==2){
							remark = self.$nw("实名认证正在审核中，请在通过后继续申请");
							url = '/user/pages/index/index';
						}
						self.showSuccess(remark, () => {
							uni.redirectTo({
								url:url
							});
						});
						return false;
					}
					if(apply['has_apply']){
						self.showSuccess(self.$nw("已经申请过了，请联系管理员"), () => {
							uni.redirectTo({
								url:'/user/pages/index/index'
							});
						});
						return false;
					}
				}
			);
		},
			/*购买*/
			payTypeFunc(objs){
				let self = this;
				self.pay_type = objs.value;
			},
			goPay(){
				let self = this;

				if(!self.name){
					uni.showToast({
						title: self.$nw("请填写名称！"),
						icon:'none'
					});
					return;
				};
				if(!self.introduce){
					uni.showToast({
						title: self.$nw("请输入简介！"),
						icon:'none'
					});
					return;
				};
				if(!self.is_read){
					uni.showToast({
						title: self.$nw("请同意协议！"),
						icon:'none'
					});
					return;
				};
				uni.showLoading({
					title: self.$nw("正在提交")+'...'
				});
				var payType = self.pay_type;
				let pay_source = 'wx';
				// #ifdef  H5
				pay_source = 'mp';
				// #endif
				self._post('plus.supply.supply/buy', {
					id: self.kmd_grade_id,
					name: self.name,
					introduce: self.introduce,
					pay_source: pay_source,
					pay_type: payType,
				}, function(res) {
					pay(res, self, self.paySuccess, self.payError);
				});
			},
			paySuccess:function(result){
				this.showSuccess(self.$nw("申请成功"), () => {
					uni.navigateTo({
						url:'/user/pages/index/index'
					});
				});
			},
			payError:function(result){
				this.showError(this.$nw('订单未支付成功'), () => {
					console.log('payError');
				});
			},
		/*推荐商品跳转*/
        chooseGrade(e){
			console.log(e)
			this.type=e;
			this.kmd_grade_id=e;
		},
		/*同意协议*/
		changeFunc(e){
			if(e.target.value.length>0){
				this.is_read=true;
			}else{
				this.is_read=false;
			}
		},
	}
};
</script>

<style lang="scss">
.grade{
	// margin-top: 40rpx;
	height: 100%;
	}
.grade .title{ heigth:100rpx; font-size:30rpx;}
.grade .title .name{ margin:0 20rpx; font-size:30rpx;}
.grade .title .line{position: relative; display: block; width: 100rpx; border-top:1px solid red;}
.grade .title .line::after{ position: absolute; content:''; display: block; width: 16rpx; height:16rpx; border-radius:50%; background: red;}
.grade .title .left-line::after{ right:0; top:-9rpx;}
.grade .title .right-line::after{ left:0; top:-9rpx;}
.grade-list {
	padding: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	flex-wrap: wrap;
}
.grade-list .item {
	width: 346rpx;
	border-radius: 20rpx;
	p-right: 10rpx;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	overflow: hidden;
	background: #ffffff;
	box-shadow: 0 0 8rpx rgba(0,0,0,.1);
	margin-bottom: 10rpx;
}
.red-border{
	border:solid 2rpx $dominant-color;
}
.grade-list .item:nth-child(2n+0){
	margin-right: 0;
}

 .banner-image {
	width: 100%;
	box-sizing: border-box;
	padding: 20rpx;
}
.banner-image image {
	width: 710rpx;
	height: 294rpx;
}
.grade-list .grade-info{ padding: 0 24rpx;}
.grade-list .grade-title {
	// height: 80rpx;
	margin-top: 20rpx;
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	font-size: 30rpx;
}
.grade-list .price {
	color: $dominant-color;
}
.grade-list .price .num {
	font-size: 30rpx;
	font-weight: bold;
}
</style>
