<template>
	<view>
		<view style="width: 100%;height: 1.5rem;line-height: 1.5rem;padding-left: 1rem;">{{$nw("优惠券接收方")}}</view>
		<view>
			<view style="width: 100%;background-color: #FFFFFF;height: 2.5rem;line-height: 2.5rem;padding-left: 1rem;">{{$nw("接收用户")}}：{{userList["nickName"]}}</view>
			<view style="width: 100%;background-color: #FFFFFF;height: 2.5rem;line-height: 2.5rem;padding-left: 1rem;margin-top: .5rem;">{{$nw("电话号码")}}：{{userList["mobile"]}}</view>
		</view>
		<!-- 优惠券列表 -->
		<view style="height: 10rem;margin-top: 2rem;">
			<view style="padding: 1rem 1rem 0.5rem 1rem;">
				<view style="float: left;width: 40%;">{{$nw("您当前未使用的优惠券")}}·</view>
				<view style="float: left;width: 30%;text-align: center;">{{$nw("拥有数量")}}</view>
				<view style="float: right;">{{$nw("转让数量")}}</view>
				<view style="clear: both;"></view>
			</view>
			<view style="height: 10rem;overflow-y: auto;" >

				<view v-for="(item,index) in couponList" :key="index"  style="margin-bottom: .5rem; padding: 0 1rem;height: 2.5rem;background-color: #FFFFFF;line-height: 2.5rem;">
					<view style="float: left;width: 40%;height: 2.5rem;line-height: 2.5rem;">{{item.name}}</view>
					<view style="float: left;width: 30%;text-align: center;line-height: 2.5rem;">{{item.user_true_sum}}</view>
					<view style="float: right;width: 10%;width: 18%;margin-top: .5rem;">
						<input @blur="blur(index)" @focus="foc(index)" v-on:input="Listening(index,item.user_true_sum)"  v-model="couponSum[index]" type="number" style="border: 1px solid #B7B7B7;text-align: center;" />
					</view>
				</view>

			</view>
		</view>
		<!-- an -->
		<view style="clear: both;"></view>
		<!-- 弹窗提示 -->
		<view v-if="again" style="padding: 2rem; position: fixed;top: 13rem; margin: auto;left: 0;right: 0;border: 1px solid #B7B7B7; width: 45%;height: 6rem;background-color: #FFFFFF;z-index: 130;">
			<view style="line-height: 1.3rem;">{{$nw("本次向")}}&nbsp;{{userList['nickName']}}</view>
			<view style="line-height: 1.3rem;">{{$nw("转让优惠券")}}&nbsp;&nbsp;{{$nw("总共")}}&nbsp;{{count}}&nbsp;{{$nw("张")}}</view>
			<view style="line-height: 1.3rem;">{{$nw("确定要转让吗")}}</view>
			<view style="margin-top: 1.5rem;">
				<button @click="cancel()" style="width: 45%; margin: 0; background-color: #FFFFFF;height: 1.5rem;line-height: 1.5rem;border: 1px solid #B7B7B7;float: left;">{{$nw("取消")}}</button>
				<button v-bind:disabled="this.lock == true " @click="trus()" style="width: 45%; margin: 0; background-color: #FF0036;height: 1.5rem;line-height: 1.5rem;color: #FFFFFF;float: right;">{{$nw("确定")}}</button>
			</view>
		</view>

		<view style="margin-top: 3rem;">
			<button @click="go()" style="background-color: #FF0036;color: #FFFFFF;width: 90%;margin-left: 5%;">{{$nw("确认转让")}}</button>
			<view style="margin:.5rem 0 0 1rem;color: #B7B7B7;">{{$nw("注：转让操作不可撤销，请谨慎操作")}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userinfo:false,
				userList:[],
				unuserinfo:false,
				search_user:true,
				go_out:false,
				top:10,
				position:'relative',
				again:false,
				uid:'',
				couponList:[],
				couponSum:[],
				count:0,
				In:0,
				couponID:[],
				lock:false
			};
		},
		onLoad(option) {
      this.setGlobalColor()
			this.userList = getApp().globalData.userList;
			this.userTransfer();
		},
		methods: {
			userTransfer(uid){
				let self = this
				self._get('user.coupon/userTransfer',{user_id:uni.getStorageSync('user_id')},function(res){
					self.couponList = res.data.coupon
					console.log(self.couponList)
					console.log(self.couponList.length)
					let i = self.couponList.length
					for(;(i--) > 0;){
						self.couponID[i] = self.couponList[i]["coupon_id"]
						self.couponSum[i] = 0
					}
				});
			},
			go(){ 
			//	console.log(this.couponSum)

				if(this.userList == ''){
					uni.showModal({
					    title: this.$nw("提示"),
					    content: this.$nw("当前页面请勿刷新"),
						showCancel:false,
					    success: function (res) {
					        if (res.confirm) {
					            uni.navigateTo({
					                url: '/user/pages/my-coupon-transfer/my-coupon-transfer'
					            });
					        }
					    }
					});
				}else{

					var sum = this.couponSum

					if(sum.length == 1){
						this.count = sum[0];
					}else{
						sum.reduce((prve,curr) => {
							curr == ""?curr = 0:'';
							this.count = parseInt(prve)+parseInt(curr);
						//	console.log(parseInt(prve)+parseInt(curr))
						})
					}

					var cun = 0;
				//	console.log(this.count)
					if(this.couponList.length == 1){
						cun = this.couponList[0]["user_true_sum"]
					}else{
						this.couponList.reduce((prve,curr) => {
							cun = parseInt(prve.user_true_sum) + parseInt(curr.user_true_sum);
						})
					}

					console.log(cun)
					//console.log(this.count)
					if(this.count == 0){
						uni.showModal({
						    title: this.$nw("提示"),
						    content: this.$nw("转让数量不可为0"),
							showCancel:false,
						});
						return false;
					}

					// 校验是否修改数据
					if(cun < this.count){
						uni.showModal({
						    title: this.$nw("提示"),
						    content: this.$nw("未知错误"),
							showCancel:false,
						});
					}else{

						this.again = true
					}

				}

			},
			cancel(){
				this.again = false
			},
			trus(){  //  转让
				let self = this
				// 加锁
				self.lock = true
				self._post('user.coupon/turnSpecified',{
					couponSum: self.couponSum,
					couponID:self.couponID,
					uid:uni.getStorageSync('user_id'),
					id:self.userList.user_id,
					count:self.count
				},function(res){
					uni.showModal({
					    title: this.$nw("提示"),
					    content: res.msg,
						showCancel:false,
						success:function(res){
							if (res.confirm) {
								uni.navigateTo({
									url: '/user/pages/my-coupon-success/my-coupon-success'
								});
							}
						}
					});
				},function(){

				})
			},
			Listening(index,max){
				var sum = Number(this.couponSum[index])
				var m = Number(max)
				//console.log(sum)
				if(sum > m){
					this.couponSum[index] = m
				}
			},
			foc(index){
				if(this.couponSum[index] == ''){
					this.couponSum[index] = 0
				}
			},
			blur(index){
				if(this.couponSum[index] == ''){
					this.couponSum[index] = 0
				}
			}
		}
	}
</script>

<style>
</style>
