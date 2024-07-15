<template >
	<view class="pay-success" >
		<view class="success-icon d-c-c d-c">
			<text class="iconfont icon-queren"></text>
			<text class="name">{{$nw("报名成功")}}</text>
		</view>
		<view class="success-btns d-b-c">
			<button type="default" class="flex-1 mr10" @click="goHome()">{{$nw("返回首页")}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
			
			}
		},
		onLoad(e) {
			//调用发货方法
		},
		
		mounted() {
			
		},
		methods: {
			/*返回首页*/
			goHome(){
				uni.navigateBack({delta:2})
			},
		}
	}
</script>

<style scoped>
	.pay-success .success-icon {
		display: flex;
		padding: 60rpx;
	}

	.pay-success .success-icon .iconfont {
		padding: 30rpx 60rpx;
		background: #6599fe;
		border-radius: 50%;
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
		font-size: 60rpx;
		font-weight: bold;
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

	.pay-success .success-btns button[type="default"] {
		border: 1px solid #6599fe;
		color: #6599fe;
	}
</style>
