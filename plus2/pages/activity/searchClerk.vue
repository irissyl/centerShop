<template>
	<view class="login-container">
		<view class="wechatapp">
			<view class="index-search diy-search t-c search_inp clearfix">
				<input type="text" style="width: 90%;" v-model="activity_record_id"  
				:placeholder="$nw('请输入核销编号')">
				<!-- <span class="icon iconfont icon-sousuo search-referee" ></span> -->
			</view>
		</view>
		<view class="login-btn">
			<button  class="btn-normal" @click="comfirmActivityRecordId">{{$nw("进行核销")}}</button>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: '',
				activity_record_id: '',
				user_info:{}
			}
		},
		onLoad() {
			
		},
		methods: {
			
			comfirmActivityRecordId() {
				var self = this;
		
				let path = '/plus2/pages/activity/clerkorder?order_id='+self.activity_record_id+'&order_type=70';

				uni.redirectTo({
					url:path
				})
			},
		
		},
	}
</script>

<style>
	.login-container {
		padding: 30rpx;
	}

	.wechatapp {
		padding: 80rpx 0 48rpx;
		border-bottom: 1rpx solid #e3e3e3;
		margin-bottom: 72rpx;
		text-align: center;
	}

	.wechatapp .header {
		width: 190rpx;
		height: 190rpx;
		border: 2px solid #fff;
		margin: 0rpx auto 0;
		border-radius: 50%;
		overflow: hidden;
		box-shadow: 1px 0px 5px rgba(50, 50, 50, 0.3);
	}

	.auth-title {
		color: #585858;
		font-size: 34rpx;
		margin-bottom: 40rpx;
	}

	.auth-subtitle {
		color: #888;
		margin-bottom: 88rpx;
		font-size: 28rpx;
	}

	.login-btn {
		padding: 0 20rpx;
	}

	.login-btn button {
		height: 88rpx;
		line-height: 88rpx;
		background: #6599fe;
		color: #fff;
		font-size: 30rpx;
		border-radius: 999rpx;
		text-align: center;
	}

	.no-login-btn {
		margin-top: 20rpx;
		padding: 0 20rpx;
	}

	.no-login-btn button {
		height: 88rpx;
		line-height: 88rpx;
		background: #dfdfdf;
		color: #fff;
		font-size: 30rpx;
		border-radius: 999rpx;
		text-align: center;
	}
	.wechatapp .search-referee{
		width: 10%;
		border-left: 1rpx #e3e3e3 solid;
	}
</style>
