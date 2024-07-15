<template>
	<view class="grade">
		<view class="" style="padding: 20rpx;">
			<view class="d-s-c border-b-e">
				<text class="key-name">{{$nw("充值金额")}}：</text>
				<input class="ml20 flex-1 p-20-0" name="money"  min=0 type="number" 
				v-model="money" :placeholder="$nw('请输入充值金额')" />
			</view>
			<view style="color: #E2231A;">
				<text>{{setting.remark}}</text>
			</view>
		</view>

		<!--支付方式v-if="OrderData.order_pay_price != 0||1==1"-->
		<view class="buy-checkout">
			<view :class="pay_type == 20 ? 'item active' : 'item'" @click="payTypeFunc(20)">
				<view class="d-s-c">
					<view class="icon-box d-c-c mr10"><span class="icon iconfont icon-weixin"></span></view>
					<text class="key">{{$nw("微信支付")}}：</text>
				</view>
				<view class="icon-box d-c-c"><span class="icon iconfont icon-xuanze"></span></view>
			</view>
			<view class="p20"><button type="default"  @click="goPay(10)" 
			class="btn-red f30 mt30" :style="[bgcColor]">{{$nw("确定")}}</button></view>
		</view>

		<service :itemData="t_service"></service>
	
		</view>
</template>

<script>
import {pay} from '@/common/pay.js'
	import service from '@/components/diy/service/service';
		
export default {
	components:{
		service,
		
	},
	data() {
		return {
			t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
			setting: {},
			money:"",
			pay_type: 20,
		};
	},

	onShow() {
		this.setGlobalColor()
		uni.showLoading({
			title:this.$nw("加载中")
		});
		/*获取个人中心数据*/
		this.getData();
		uni.setNavigationBarTitle({
			title:this.$nw("余额充值")
		})
	},
	computed:{
		getbutton() {
			var self = this;
			setTimeout(function() {
				var obj = [{
						buttonOne: self.setButton().button[0].buttonOne + " !important",
						buttonOneColor: self.setButton().button[0].buttonOneColor + " !important"
					},
					{
						buttonTwo: self.setButton().button[1].buttonTwo + " !important",
						buttonTwoColor: self.setButton().button[1].buttonTwoColor + " !important"
					},
					{
						buttonThree: self.setButton().button[2].buttonThree + " !important",
						buttonThreeColor: self.setButton().button[2].buttonThreeColor + " !important"
					}
				];
				return obj
			}, 500)
		
		},
		bgcColor() {
			var obj = {
				backgroundColor: this.setBackgroundColor().backgroundColor + " !important",
				border: this.setBackgroundColor().border + " !important"
			}
			return obj
		},textColor() {
			return flag => {
				flag = !!flag
				return this.setColor(flag)
			}
		},
	},
	methods: {
		/*获取数据*/
		getData() {
			let self = this;
			self._get('balance.order/index',{},
				function(res) {
					self.setting = res.data.settings;
					uni.hideLoading();
				}
			);
		},
		/*购买*/
		payTypeFunc(payType){
			let self = this;
			self.pay_type = payType;
		},
		goPay(){
			let self = this;
			let money = self.money
			if(money<=0){
				uni.showToast({
					title: self.$nw("请填写正确的金额"),
					icon:'none'
				});
				return;
			};
			money = parseFloat(self.money)
			uni.showLoading({
				title: self.$nw("正在提交")
			});
			var payType = self.pay_type;
			let pay_source = 'wx';
			// #ifdef  H5
			pay_source = 'mp';
			// #endif
			self._post('balance.order/submit', {
				money:money,
				pay_source: pay_source,
				pay_type: payType,
			}, function(res) {
				pay(res, self, self.paySuccess, self.payError);
			});
		},
		paySuccess:function(result){
			let self = this;
			this.showSuccess(self.$nw("充值成功"), () => {
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
