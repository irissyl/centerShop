<template>
	<view class="">
		<view class="evl">
			<view class="evl1">
				<image src="/static/7.png" mode=""></image>

				<input type="text" v-model="content" placeholder-style="color:#000;"
				 :placeholder="$nw('说点什么...')"
				 style="padding-left: 100rpx;">
			</view>
			<view class="evl2">
				<view class="evl21" @click="comment" 
				style="background: linear-gradient(to right, #f2b237, #ffda98);">{{$nw("评论")}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: ['dynamic_id'],
		data() {
			return {
				content: ""
			};
		},

		methods: {
			comment() {
				if(!this.content){
					this.tip("请输入内容", 2000);
					return
				}
				var self = this;
				self._get('plus.dynamic.DynamicComment/eval_dynamic', {
					content: self.content,
					dynamic_id: self.dynamic_id,
				}, function(res) {
					uni.$emit("evl", [])
					uni.showToast({
						title: "评价成功",
						icon: "none"
					})

				});
			}
		}
	}
</script>

<style lang="scss">
	.evl {
		width: 100%;
		position: fixed;
		left: 0rpx;
		bottom: 0rpx;
		height: 100rpx;
		background: #fff;
		border-top: 2rpx solid #f7f7f7;
		padding-top: 15rpx;

		.evl1 {

			width: 76%;
			height: 72rpx;
			background: #EDEEF0;
			border-radius: 40rpx;
			margin-left: 20rpx;
			margin-top: 14rpx;
			position: relative;
			float: left;

			image {
				width: 36rpx;
				height: 36rpx;
				position: absolute;
				left: 32rpx;
				top: 18rpx;
			}

			input {
				width: 93%;
				opacity: 1;
			
				font-size: 24rpx;
				height: 72rpx;
				line-height: 72rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #000;
				font-weight: 600;


			}
		}

		.evl2 {
			height: 100rpx;
			float: right;
			width: 19%;

			.evl21 {
				text-align: center;
				height: 65rpx;
				line-height: 65rpx;

				font-size: 24rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				margin-right: 19rpx;
				background: #ff0339;
				border-radius: 35rpx;
				color: #fff;
				font-weight: 600;
				margin-top: 17.5rpx;

			}
		}
	}
</style>