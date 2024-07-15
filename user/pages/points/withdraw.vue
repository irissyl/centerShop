<template>
	<view class="grade">
		<view class="" style="padding: 20rpx;">
			<view class="d-s-c border-b-e">
				<text class="key-name">{{$nw("当前积分")}}： </text>
				<input class="ml20 flex-1 p-20-0" style="font-size: 30rpx;" disabled v-model="points"
				 />
			</view>
			<view class="d-s-c border-b-e">
				<text class="key-name">{{$nw("转换佣金")}}：</text>
				<input class="ml20 flex-1 p-20-0" name="money"  min=0 type="number" v-model="money"  
				placeholder="请输入转换的佣金数量" style="font-size: 30rpx;" />
			
			</view>
			<view class="d-s-c border-b-e" v-if="ratio  && (money<= points)">
				<text class="key-name">{{$nw("实际获得佣金")}}：</text>
				<input class="ml20 flex-1 p-20-0" name="money"  min=0  :value="money/ratio" 
				disabled style="font-size: 30rpx;" />
			
			</view>
			<view class="" style="margin-top: 20rpx;" v-if="ratio">
				<p>1{{$nw("积分等于")}}{{1/ratio}}{{$nw("元")}}，{{$nw("最低转换")}}{{less_withdraw}}{{$nw("积分，佣金可提现")}}</p>
			</view>
		</view>


		<view class="p20"><button type="default"  @click="goPay(10)" class="btn-red f30 mt30">{{$nw("确定")}}</button></view>

		</view>
</template>

<script>

export default {

	data() {
		return {
			money:"",
			points:0,
			ratio:0,
			less_withdraw:0,
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
			    title: this.$nw("积分充值")
			}); 
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
				'user.point/index',
				{},
				function(res) {
				
					var setting = res.data.settings;
					self.points = res.data.points;
					self.ratio = setting.balance_ratio
					self.less_withdraw =  setting.less_withdraw
					console.log(self.ratio)
					uni.hideLoading();
				}
			);
		},

			goPay(){
				let self = this;
				let money = parseFloat(self.money)
				console.log(money)
				if(money<=0){
					uni.showToast({
						title: self.$nw("请填写正确的积分"),
						icon:'none'
					});
					return;
				};
				if(money < self.less_withdraw){
					uni.showToast({
						title: self.$nw("最低转换")+self.less_withdraw+self.$nw("积分"),
						icon:'none'
					});
					return;
				}
				
				if(money > self.points){
					uni.showToast({
						title: self.$nw("请输入正确的转换积分"),
						icon:'none'
					});
					return;
				}
				
				uni.showLoading({
					title: self.$nw("正在提交")
				});
				var payType = self.pay_type;
				let pay_source = 'wx';
				// #ifdef  H5
				pay_source = 'mp';
				// #endif
				self._post('user.point/withdraw', {
					money:money,
				}, function(res) {
					uni.showToast({
						title:self.$nw("转换成功"),
						icon:"none"
					})
					self.getData()
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
