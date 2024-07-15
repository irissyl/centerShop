<template>
	<view class="qrcode-wrap">
		<view class="supply-title">
			<view>{{supply_name || '--'}}</view>
		</view>
		<view class="code-img">
			<image v-if="qrcode" class="qrcode" :src="qrcode" mode="aspectFill" :show-menu-by-longpress='true'></image>
		</view>
		<view class="code-tips">{{$nw("扫描或长按识别，成为会员")}}</view>

		<view class="save-btn flex-c" @click="saveImage">
			{{$nw("保存图片")}}
		</view>
	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	export default {
		data() {
			return {
				supply_id: 0,
				qrcode: '',
				supply_name: ','
			}
		},
		onLoad(e) {
			/*门店id*/
			let scene = utils.getSceneData(e);
			if (e.supply_id || scene.supply_id) {
				this.supply_id = e.supply_id ? e.supply_id : scene.supply_id;
			}

		},
		mounted() {
			this.setGlobalColor()
			/*获取门店码*/
			this.getCardQrcode();
		},
		methods: {
			/*获取门店详情*/
			getCardQrcode() {
				let self = this;
				let supply_id = self.supply_id;

				let source = 'wx';
				//#ifdef H5
				source = 'mp';
				//#endif
				uni.showLoading({
					title: self.$nw("加载中")
				});
				self._get(
					'plus.supply.supply/qrCode', {
						supply_id: supply_id,
						source: source,
						url: self.url,
					},
					function(res) {
						self.qrcode = res.data.qrcode;
						self.supply_name = res.data.supply_name;
						self.loadding = false;
						uni.hideLoading();
					}
				);
			},

			/* 保存 */
			saveImage() {

				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				// 下载海报图片
				uni.downloadFile({
					url: self.qrcode,
					success(res) {
						uni.hideLoading();
						// 图片保存到本地
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success(data) {
								uni.showToast({
									title: self.$nw("保存成功"),
									icon: 'success',
									duration: 2000
								});
							},
							fail(err) {
								if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
									uni.showToast({
										title: self.$nw("请允许访问相册后重试"),
										icon: 'none',
										duration: 1000
									});
									setTimeout(() => {
										uni.openSetting();
									}, 1000);
								}
							},
							complete(res) {
								console.log('complete');
								uni.hideLoading()
							}
						});
					}
				});

			}
		}
	}
</script>

<style lang="scss" scoped>
	.qrcode-wrap{
		padding: 40rpx 0;
		.supply-title{
			text-align: center;
		}
		
		.code-img {
			width: 400rpx;
			height: 400rpx;
			background-color: #fff;
			border-radius: 8rpx;
			overflow: hidden;
			margin: 0 auto;
			margin-top: 40rpx;
		
			.qrcode {
				width: 100%;
				height: 100%;
			}
		}
		
		.code-tips{
			margin-top: 24rpx;
			text-align: center;
			color: #666;
		}
		
		.save-btn{
			width: 400rpx;
			height: 80rpx;
			background: #07c160;
			border-radius: 8rpx;
			font-size: 32rpx;
			font-weight: 500;
			color: #fff;
			justify-content: center;
			position: absolute;
			left: 50%;
			bottom: calc(100rpx + env(safe-area-inset-bottom) / 2);
			transform: translateX(-50%);
		}
		
	}
	
</style>

<style>
	page {
		background: #efeff5;
	}

	.fix-painter-share {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		bottom: 0rpx;
		color: white;
		background: white;
		border-radius: 0rpx;
	}

	.fix-painter-share button {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		color: white;
		background: #1aad19;
		border-radius: 0rpx;
	}

	.fix-painter-share {
		width: 90%;
		padding: 0rpx 5%;
		background: none;
	}

	.fix-painter-share button {
		padding: 0rpx;
		width: 47.5%;
		font-size: 32rpx;
		border-radius: 10rpx;
	}

	.fix-painter-share button.fl {
		color: #000000;
		background: none;
		border: 1rpx solid #d8d8d8;
	}
</style>