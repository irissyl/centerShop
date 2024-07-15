<template>
	<view class="login-container">
		<view class="wechatapp">
			<view class="index-search diy-search t-c search_inp clearfix">
				<input type="text" style="width: 90%;" v-model="referee_id"  
				:placeholder="$nw('请输入上级UserId')">
				<span class="icon iconfont icon-sousuo search-referee" @click="seachReferee"></span>
			</view>
		</view>
		
		<view class="wechatapp" v-if="has_referee_info">
			<view class="header">
				<image :src="user_info.avatarUrl" style="width: 200rpx;height: 300rpx;"></image>
			</view>
			<view>{{user_info.nickName}}</view>
		</view>
		<view class="auth-title">{{$nw("绑定上级UserId获取更多使用权限")}}</view>
		<view class="auth-subtitle">{{$nw("为了为您提供更优质的服务，我们需要为你绑定上级")}}</view>
		<view class="login-btn">
			<button  :style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}" class="btn-normal" @click="comfirmRefereeId">{{$nw("确认绑定")}}</button>
		</view>
		<view class="no-login-btn">
			<button class="btn-normal" @click="onNotLogin">{{$nw("暂不绑定")}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: '',
				referee_id: '',
				has_referee_info:false,
				user_info:{}
			}
		},
		computed: {
			getbutton() {
				return this.setButton().button
			},
		},
		onLoad() {
      this.setGlobalColor()
			this.getbasedata();
		},
		methods: {
			onNotLogin: function() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
			comfirmRefereeId() {
				var self = this;
				var referee_id = self.referee_id;
				if(!self.referee_id){
					return false;
				}
				uni.showLoading({
					title: self.$nw("正在处理"),
					mask: true
				});
				// 绑定用户上级
				self._post('user.user/bindRefereeId', {
					referee_id:referee_id
				}, result => {
					// 执行回调函数
					uni.navigateBack();
				}, false, () => {
					uni.hideLoading();
				});
					
			},
			/* 搜寻上级 */
			seachReferee(){
				var self = this;
				var referee_id = self.referee_id;
				if(!self.referee_id){
					return false;
				}
				self._get('user.user/searchReferee', {
					referee_id:referee_id
				}, function(res){
					if(res.code==1){
						if(res.data.user_info){
							self.user_info = res.data.user_info;
							self.has_referee_info = true;
						}
					}
				});
			},
			
			getbasedata(){
				var self = this;
				self._get('user.user/bindRefereeId', {
					
				}, function(res){
					if(res.code==1){
						uni.showModal({
						    title: self.$nw("提示"),
						    content: res.msg,
							showCancel:false,
						    success: function (res) {
						        if (res.confirm) {
						           uni.reLaunch({
						           	url: '/pages/index/index'
						           })
						        }
						    }
						});
					}
				});
			}
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
	.wechatapp .search-referee{
		width: 10%;
		border-left: 1rpx #e3e3e3 solid;
	}
</style>
