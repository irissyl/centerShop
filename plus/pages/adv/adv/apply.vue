<template>
	<view class="bg-white p-0-30 f30">
		<view class="d-s-c p-20-0 border-b-e">
			<text class="key-name">{{$nw("选择广告位")}}：</text>
			<view class="uni-list-cell-db">
				<picker mode="selector" value=""  :range="listData" range-key='name'  @change="bindAdvChange">
					<view class="uni-input">{{adv_name}}</view>
				</picker>
			</view>
		</view>
		<view class="group bg-white f28" v-if="adv_id>0">
			<view class="p-20-0 border-b-e" >
				<text class="gray9">{{$nw("描述")}}：</text>
				<text>{{ adv.content}}</text>
			</view>
			<view class="p-20-0 border-b-e">
				<text class="gray9">{{$nw("剩余数量")}}：</text>
				<text>{{ adv.limit }}</text>

				<text v-if="!adv.limit" style="color: red;"><br>{{$nw("当前广告位剩余")}}{{ adv.limit }},{{$nw("plus.pay_auto_paidui.支付后自动进行排队")}}</text>
			</view>
			<view class="p-20-0 border-b-e"  v-if="setting.price_pay==1">
				<text class="gray9">{{$nw("余额价")}}：</text>
				<text>{{ adv.price }}/{{$nw("天")}}</text>
			</view>
			<view class="p-20-0 border-b-e" v-if="setting.points_pay==1">
				<text class="gray9">{{$nw("积分价")}}：</text>
				<text>{{ adv.points }}/{{$nw("天")}}</text>
			</view>
			<view class="d-s-c border-b-e">
				<text class="key-name">{{$nw("广告时长")}}：</text>
				<input class="ml20 flex-1 p-30-0"  @input="changeDay" name="days" type="number" v-model="days"  
				:laceholder="$nw('请输入天数')" />
				<text>天</text>
			</view>
		</view>

		<!--支付方式v-if="OrderData.order_pay_price != 0||1==1"-->
		<view class="buy-checkout" v-if="adv_id!=0">
			<block v-if="money>0||points>0">
				<view v-if="setting.points_pay==1" :class="pay_type == 30 ? 'item active' : 'item'" @click="payTypeFunc(30)">
					<view class="d-s-c">
						<view class="icon-box d-c-c mr10"><span class="icon iconfont icon-yue"></span></view>
						<text class="key">{{$nw("积分支付")}}({{$nw("总计")}}：{{points}}{{$nw("积分")}})</text>
					</view>
					<view class="icon-box d-c-c"><span class="icon iconfont icon-xuanze"></span></view>
				</view>
				<view v-if="setting.price_pay==1" :class="pay_type == 10 ? 'item active' : 'item'" @click="payTypeFunc(10)">
					<view class="d-s-c">
						<view class="icon-box d-c-c mr10"><span class="icon iconfont icon-yue"></span></view>
						<text class="key">{{$nw("余额支付")}}({{$nw("总计")}}：{{money}}{{$nw("余额")}})</text>
					</view>
					<view class="icon-box d-c-c"><span class="icon iconfont icon-xuanze"></span></view>
				</view>
				<view class="p20"><button type="default"  @click="goPay(10)" class="btn-red f30 mt30">{{$nw("申请")}}</button></view>
			</block>
		</view>

	</view>
</template>

<script>
import {pay} from '@/common/pay.js'
export default {
	data() {
		return {
			/*支付方式*/
			pay_type: 0,
			type:'no',
			adv_id:0,
			/*数据*/
			listData: [],
			setting:{},
			order:{},
			adv:{},
			days:1,
			money:0,
			points:0,
			adv_name:this.$nw("选择广告位")
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

	},
	onPullDownRefresh() {

	},
	methods: {
		/*获取数据*/
		getData() {

			let self = this;
			self._get(
				'plus.adv.adv/apply',
				{},
				function(res) {
					self.listData = res.data.list;
					var setting = res.data.setting;
					self.setting = setting;
					self.order = res.data.last_order;
					uni.hideLoading();
					if(!setting['is_open']){
						self.showSuccess(self.$nw("未开启广告申请"), () => {
							uni.redirectTo({
								url:'/user/pages/index/index'
							});
						});
						return false;
					}
				},function(res){
					uni.redirectTo({
						url:'/user/pages/index/index'
					});
				}
			);
		},
		bindAdvChange(e){
			var index = e.detail.value
			let self = this;
			var adv = self.listData[index];
			self.adv = adv;
			self.type=adv.adv_id;
			self.adv_id=adv.adv_id;
			self.money = parseFloat(adv.price*self.days,2);
			self.points = parseFloat(adv.points*self.days,2);
			self.adv_name = adv.name
		},
		changeDay(e){
			var days = e.target.value>0?e.target.value:1;
			let self = this;
			var adv = self.adv;
			self.money = parseFloat(adv.price*days,2);
			self.points = parseFloat(adv.points*days,2);
		},
			/*购买*/
			payTypeFunc(payType){
				let self = this;
				self.pay_type = payType;
			},
			goPay(){
				let self = this;
				if(self.days<1||self.days>30){
					uni.showToast({
						title: self.$nw("广告有效天数最多30天"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				uni.showLoading({
					title: self.$nw("正在提交")
				});
				var payType = self.pay_type;
				if(payType==0){
					uni.showToast({
						title: self.$nw("请选择支付方式"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				let pay_source = 'wx';
				// #ifdef  H5
				pay_source = 'mp';
				// #endif
				self._post('plus.adv.adv/buy', {
					id: self.adv_id,
					days:self.days,
					pay_source: pay_source,
					pay_type: payType,
				}, function(res) {
					pay(res, self, self.paySuccess, self.payError);
				});
			},
			paySuccess:function(result){
				this.showSuccess(this.$nw("支付成功"), () => {
					uni.navigateTo({
						url:'/plus/pages/adv/adv/order'
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
			this.adv = e;
			this.type=e.adv_id;
			this.adv_id=e.adv_id;
			this.money = parseFloat(e.price);
			console.log(this.money);
		},
		gotoApply(){
			let self = this;
			uni.showLoading({
				title: self.$nw("正在提交")
			});

			self._post('user.grade/apply', {
				id: self.adv_id,
			}, function(res) {
				if(res.code==1){
					uni.showToast({
						title:res.data
					})
				}
			});
		}
	}
};
</script>

<style lang="scss">
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
