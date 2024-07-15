<template>
	<view class="login-container">
		<view class="wechatapp">
			<view class="index-search diy-search t-c search_inp clearfix">
				<span class="">{{$nw("uid")}}</span>
				<input type="text" style="width: 90%;" v-model="user_id"  
				:placeholder="$nw('请输入客户user_id')">
			</view>
			<view class="index-search diy-search t-c search_inp clearfix">
				<span class="">{{$nw("密码")}}</span>
				<input type="password" style="width: 90%;" v-model="change_secret"  
				:placeholder="$nw('请输入管理密码')">

			</view>
		</view>

		<!-- <view class="wechatapp" v-if="has_referee_info">
			<view class="header">
				<image :src="user_info.avatarUrl" style="width: 200rpx;height: 300rpx;"></image>
			</view>
			<view>{{user_info.nickName}}</view>
		</view> -->

		<view class="login-btn">
			<button  class="btn-normal" @click="comfirmChangeUser">{{$nw("确认")}}</button>
		</view>
		<view class="no-login-btn">
			<button class="btn-normal" @click="onNotLogin">{{$nw("放弃")}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_id:'',
        change_secret:''
			}
		},
    onShow() {
      this.setGlobalColor()
	  
	  uni.setNavigationBarTitle({
	  	    title: this.$nw("客户服务")
	  	}); 
    },
		methods: {
			onNotLogin(){
				uni.navigateTo({
				    url: '/user/pages/index/index'
				});
			},
			comfirmChangeUser() {
				var self = this;
				var user_id = self.user_id;
				if(!self.user_id){
					return false;
				}
				uni.showLoading({
					title: self.$nw("正在处理"),
					mask: true
				});
				// 切换到其他用户
				self._post('user.user/changeUser', {
					user_id:user_id,
          change_secret:self.change_secret
				}, result => {
					// 执行回调函数
					// 记录token user_id
					uni.setStorageSync('token', result.data.token);
					uni.setStorageSync('user_id', result.data.user_id);
					uni.navigateTo({
					    url: '/user/pages/index/index'
					});
				}, false, () => {
					uni.hideLoading();
				});

			},
		}
	}
</script>

<style scoped>
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
		background: #04be01;
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
	.wechatapp .search-password{
		width: 10%;
		border-right: 1rpx #e3e3e3 solid;
	}
</style>
