<template>
	<view class="article-list-wrap">
		
		<view class="yuyue0" v-for="(item,index) in list" :key="index" 
		@click="yuyue_click(item.article_id)">
			<view class="yuyue">
				<view class="yuyue_1">
					<image :src="item.image_url" mode=""></image>
				</view>
				<view class="yuyue_2">
					<view class="yuyue_2_1">
						{{item.article_title}}
					</view>
					<view class="yuyue_2_3">
						<text style="font-size: 30rpx;" v-if="item.article_content">视频内容：</text> 
							<!-- #ifdef H5 -->
							<text style="text-indent: 50; white-space: pre-wrap;color: #888783;font-size: 24rpx;" 
							v-html="formatWord(item.article_content)"></text>
							<!-- #endif -->
							
							<!-- #ifdef MP-WEIXIN -->
							<view style="text-indent: 50;color: #888783;font-size: 24rpx;" 
							v-html="formatContent(item.article_content)"></view>
							<!-- #endif -->
					</view>
				</view>

			</view>
			<view class="yuyue_3">
				<view class="yuyue_3_2" v-if="item.status == 0">
					平台正在审核中
				</view>
				<view class="yuyue_3_2"  v-if="item.status == 1" style="margin-left: 20rpx;">
					修改
				</view>
				<view class="yuyue_3_2"  v-if="item.status == 2">
					重新提交
				</view>
				<view style="clear: both;">
					
				</view>

			</view>
		</view>
		
		<template v-if="list.length <=0">
			<view class="none-data-box">
				<text>未获取到数据</text>
			
			</view>
		</template>

	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	
	export default {
		components:{
		
		},
		data() {
			return {
				index: 0,
				tab: [],
				list: [],
			}
		},
		mounted() {
			 this.setGlobalColor()
		},
		onShow() {
			this.getData()
		},
		methods: {
			formatContent(e) {
				return utils.format_content(e);
			},
	
			getData() {
				var self = this;
				self._post(
					'plus.article.Article/myVideo', {	},
					function(res) {
						self.list = res.data.list.data
					});
			},

			yuyue_click(article_id) {
				uni.navigateTo({
					url: "/plus2/pages/video/index/rel_video?article_id=" + article_id
				})
			},
			videoClick(){
				
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: rgb(246, 246, 246);
	}
	
	.article-list-wrap .type-list .tab-item {
		padding: 0 30rpx;
		font-size: 34rpx;
		height: 86rpx;
		line-height: 86rpx;
		white-space: nowrap;

	}
	.article-list-wrap .type-list .tab-item.active{
		border-bottom: 4rpx solid #E2231A;
		margin-bottom: 0;
	}
	

	.yuyue_3 {
		.yuyue_3_2 {

			text-align: center;
			color: #177E15;
			line-height: 40rpx;
			font-size: 24rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;
			float: right;
			height: 40rpx;
			border-radius: 450rpx;
			background: rgb(255, 159, 0);
			color: #fff;
			margin-right: 20rpx;
			margin-top: 10rpx;

		}


	}

	.yuyue0 {
		width: 95%;
		margin: auto;
		background: #fff;
		border-radius: 16rpx;
		box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.1);
		margin-top: 20rpx;
		padding-bottom: 30rpx;
	}

	.yuyue {




		margin-top: 20rpx;
		display: flex;




		.yuyue_1 {

			flex: 2;

			image {
				width: 120rpx;
				height: 120rpx;
				margin-left: 20rpx;
				margin-top: 20rpx;
				border-radius: 16rpx;
			}
		}

		.yuyue_2 {
			flex: 7;

			.yuyue_2_1 {
				width: 95%;
				font-size: 34rpx;
				margin: auto;
				margin-top: 20rpx;
			}

			.yuyue_2_3 {
				width: 95%;
				font-size: 30rpx;
				margin: auto;
				height: 90rpx;
				overflow: hidden;
				-webkit-line-clamp: 1;
				-webkit-box-orient: vertical;
		

			}

			.yuyue_2_4 {
				width: 90%;
				font-size: 30rpx;
				margin: auto;
				margin-top: 5rpx;
				color: #c3c1bb;
			}

		}
	}

	
	
</style>