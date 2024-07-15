<template>
	<view class="architecture-detail" v-if="loadding">
		<view class="architecture-content" v-html="architecture.architecture_introduce"></view>
	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	export default {
		components: {
		},
		data() {
			return {
				isbottmpanel: false,
				url: null,
				/*是否加载完成*/
				loadding: false,
				/*文章详情*/
				architecture: {
					image: {}
				},
			};
		},
		onShow() {
			this.getData();
		},
		onLoad(e) {
			//#ifdef H5
			this.url = window.location.href;
			//#endif
		},
		mounted() {
			/*获取产品详情*/
			
		},
		methods: {

			/*获取文章详情*/
			getData() {
				let self = this;
				uni.showLoading({
					title: '加载中'
				});
		
				this.loading = true;
				this._get(
					'plus.card.square/getSquare', {
				
					},
					function(res) {
						/*详情内容格式化*/
						res.data.setting.architecture_introduce = utils.format_content(res.data.setting.architecture_introduce);

						self.architecture = res.data.setting;
						self.loadding = true;
						uni.hideLoading();
					}

				);
			}
		}
	};
</script>

<style scoped>
	.architecture-detail {
		padding: 30rpx;
		background: #ffffff;
	}

	.architecture-detail .title {
		font-size: 44rpx;
	}

	.architecture-detail .info {
		padding: 40rpx 0;
		color: #999999;
	}

	.architecture-detail .architecture-content {
		width: 100%;
		box-sizing: border-box;
		line-height: 60rpx;
		font-size: 34 rpx;
		overflow: hidden;
	}

	.architecture-detail .architecture-content image,
	.architecture-detail .architecture-content img {
		display: block;
		max-width: 100%;
	}
</style>
