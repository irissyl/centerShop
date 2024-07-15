<template >
	<view class="pay-success" >
		<view class="success-icon d-c-c d-c">
			<text class="iconfont icon-queren"></text>
			<text class="name">{{$nw("赠送成功")}}</text>
		</view>

		<view class="success-btns d-b-c" style="width: 66%;margin: auto;padding-top: 8%;">
			<button type="default" class="flex-1 mr10" style="background-color: #FFFFFF;margin: auto;" @click="gotongzhi()">{{$nw("通知好友")}}</button>
			<button type="default" class="flex-1 mr10" style="background-color: #FFFFFF;margin: auto;margin-left: 15%;" @click="goStorage()">{{$nw("马上返回")}}</button>

		</view>

		<!--底部弹窗-->
		<share :isbottmpanel="isbottmpanel"  @close="closeBottmpanel" ></share>

	</view>
</template>

<script>
import share from './share.vue';
	export default {
		components: {
			share
		},

		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*仓库id*/
				storage_id: 0,
				number:1,
				user_id:0,
				product_img:'',
				img_path:'',
				user_name:'',
				userinfo:'',
				/*分享*/
				isbottmpanel: false,
				url:'',
			}
		},
		onLoad(e) {
      this.setGlobalColor()
			this.storage_id = e.storage_id;
			this.number = e.number ? e.number : 1;
			this.user_id =e.user_id;
			this.img_path=decodeURIComponent(e.product_img);
		},
		mounted() {
			 this.getData();
		},

		methods: {

			/*获取用户信息*/
			getData() {
				let _this = this;
				_this._get(
					'plus.storage.storage/giving_success', {

					},
					function(res) {
						_this.userinfo = res.data.user;
					}
				);
			},

			/*通知好友*/
			gotongzhi(){
				this.isbottmpanel = true;
				let img_path =this.img_path;
				let number =this.number;
				let user_name=this.userinfo.nickName;
			},

			/*分享*/
			onShareAppMessage() {
				let self = this;
				 // 构建页面参数
				let params = self.getShareUrlParams({

				});
				return {

					title: self.$nw("您的好友")+ this.userinfo.nickName+self.$nw("给您送了")+this.number +self.$nw("件礼物，赶快去看看吧"),
					imageUrl:this.img_path,
					path: '/user/pages/storage/list'
				};
			},

			/*前往酒窖*/
			goStorage(){
				uni.navigateTo({
					url: '/user/pages/storage/list'
				});
			},
			//关闭分享
			closeBottmpanel(data) {
				this.isbottmpanel = false;

			},
		}
	}
</script>

<style>
	page{
		background-color:#E8E8E8;
	}
	.pay-success .success-icon {
		display: flex;
		padding: 60rpx;
	}

	.pay-success .success-icon .iconfont {
		padding: 30rpx;
		background: #04BE01;
		border-radius: 60%;
		font-size: 80rpx;
		color: #FFFFFF;
	}

	.pay-success .success-icon .name {
		margin-top: 20rpx;
		font-size: 30rpx;
	}

	.pay-success .success-price {
		font-size: 36rpx;
	}

	.pay-success .success-price .num {
		font-size: 36rpx;
		font-weight: bold;
		padding-top: 10%;
	}

	.pay-success .order-info {
		background: #FFFFFF;
	}

	.pay-success .success-btns {
		margin-top: 50rpx;
		padding: 30rpx;
	}

	.pay-success .success-btns button {
		font-size: 30rpx;
	}

</style>
