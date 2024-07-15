<template>
	<view>
		<view>
		    <view style="width:750rpx;height:800rpx;margin-top: auto;">
				<view style="height:200rpx;"></view>
		        <image :src="qrcode" class="qrcode" mode=""></image>
			</view>
			
		    <view style="height:40rpx;"></view>

		    <view class="fix-painter-share">
		        <button @click="saveImage" class="fr" style="width:100%;">保存邀请海报</button>
		    </view>
		    <view style="height:40rpx;"></view>
		</view>
	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	export default {
		data() {
			return {
				supply_id:0,
				qrcode:'',
			}
		},
		onLoad(e) {
			/*名片id*/
			let scene = utils.getSceneData(e);
			if(e.supply_id||scene.supply_id){
				this.supply_id = e.supply_id ? e.supply_id : scene.supply_id;
			}
		},
		mounted() {
			/*获取名片码*/
			this.getInviterQrcode();
		},
		methods: {
			/*获取邀请名片*/
			getInviterQrcode(){
				let self = this;

				let source = 'wx';
				//#ifdef H5
				source = 'mp';
				//#endif
				uni.showLoading({
					title: '加载中'
				});
				self._get(
					'plus.card.boss/inviterCode',
					{	
						supply_id:self.supply_id,
						source:source,
						url: self.url,
						from:'inviter'
					},
					function(res) {
						self.qrcode = res.data.qrcode;
						self.loadding = false;
						uni.hideLoading();
					}
				);
			},
			
			/* 保存 */
			saveImage(){
				
				let self = this;
				uni.showLoading({
					title: '加载中'
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
									title: '保存成功',
									icon: 'success',
									duration: 2000
								});
							},
							fail(err) {
								if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
									uni.showToast({
										title: '请允许访问相册后重试',
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
							}
						});
					}
				});
				
			}
		}
	}
</script>

<style>
	@import "/card/statics/card.css";
	page {
		background: #efeff5;
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
	.qrcode{
		width: 400rpx;
		height: 400rpx;
		margin: auto;
	}
</style>
