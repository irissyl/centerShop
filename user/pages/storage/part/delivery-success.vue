<template >
	<view class="pay-success" >
		<view class="success-icon d-c-c d-c">
			<text class="iconfont icon-queren"></text>
			<text class="name">{{$nw("提货成功")}}</text>
		</view>

		<view class="success-price d-c-c">
			<text class="num">{{$nw("我们会尽快给您寄送")}}</text>
		</view>

		<view class="success-btns d-b-c" style="width: 50%;margin: auto;padding-top: 8%;">

			<button type="default" class="flex-1 mr10" style="background-color: #FFFFFF;margin: auto;" @click="goStorage()">{{$nw("返回")}}</button>


		</view>
	</view>
</template>

<script>
	export default {
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
				number:1

			}
		},
		onLoad(e) {
      this.setGlobalColor()
			this.storage_id = e.storage_id;
			this.number = e.number ? e.number : 1;

		},
		mounted() {
			// document.querySelector('body').setAttribute('style', 'background-color:#E0E0E0;'),
			/*处理订单逻辑*/
			 this.getData();
		},


		methods: {
			/*处理订单逻辑*/
			getData() {
				let _this = this;
				let storage_id = _this.storage_id;

				_this._get(
					'plus.storage.storage/delivery_success', {
						storage_id: storage_id,
						number:_this.number
					},
					function(res) {


					}
				);
			},

			/*前往酒窖*/
			goStorage(){
				uni.navigateTo({
					url: '/user/pages/storage/list'
				});
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
