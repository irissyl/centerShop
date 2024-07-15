<template>
	<view class="">
		<view style="width: 100%;background: #fff;border-bottom: 1rpx solid #eaeaea;" v-for="(item,index) in clist" 
		:key="index" >
			<view class="comment" >
				<view class="comment1" @click="friend_click(item.id)">
					<image :src="item.user.avatarUrl" mode=""></image>
				</view>
				<view class="comment2" >
					<view class="comment21" @click="friend_click(item.id)">
						<view style="float: left;">
							{{item.user.nickName}}
						</view>
						
						
						<view style="float: left;margin-left: 10rpx;" v-if="item.ind">
							<image v-for="(itemA,indexA) in item.ind" 
							style="margin-top: 9rpx; margin-right: 4rpx; width: 30rpx;height: 30rpx;float: left;"
							src="/static/start.png" mode=""></image>
							<view style="clear: both;"></view>
						</view>
						<view style="clear: both;"></view>
					</view>
					<view class="comment22">
						{{item.content}}
					</view>
					<view class="comment23">
						{{item.create_time}}
			
					</view>
					
				</view>
				<view style="flex: 0.2;">
					
				</view>
			</view>
		</view>
		<template v-if="clist.length <= 0">
			<view class="none-data-box">
				<image class="none-data-icon" src="http://imgh5.y01.cn/20210606225550dd5f35541.png" mode="aspectFill"></image>
				<text>未获取到评论</text>
		
			</view>
		</template>
		<view style="height: 20rpx;width: 100%;background: #F5F5F5;">
			
		</view>
	</view>
</template>

<script>
	export default {
		props: ['clist'],
		data() {
			return {
				
			};
		},
	
		methods: {
	
			friend_click(id){//
				
			}
		
		}
	}
</script>

<style lang="scss">
	
	.none-data-icon{
		width: 200rpx !important;
		height: 150rpx;
	}

	.comment{
		width: 95%;
		margin: auto;
		display: flex;
		padding-top: 20rpx;
		padding-bottom: 20rpx;background: #fff;
		.comment1{
			flex: 1.4;
			image{
				width: 82rpx;
				height: 82rpx;
				border-radius: 50%;
			}
		}
		.comment2{
			flex: 8;
			
			padding-bottom: 20rpx;
			position: relative;
			.dian{
				position: absolute;
				width: 32rpx;
				height: 32rpx;
				right: 20rpx;
				top: 0rpx;
			}
			.comment21{
				font-size: 28rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #33312E;
			}
			.comment22{
				font-size: 26rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #999999;
				margin-top: 8rpx;
			}
			.comment23{
				font-size: 22rpx;
				font-family: PingFang SC-Regular, PingFang SC;
				font-weight: 400;
				color: #999999;margin-top: 8rpx;
			}
			.comment24{
				width: 100%;
				margin-top: 12rpx;
				image{
					width: 186rpx;
					height: 186rpx;
					border-radius: 16rpx;
					margin-bottom: 12rpx;
					margin-right: 10rpx;
				}
			}
		}
	}
</style>