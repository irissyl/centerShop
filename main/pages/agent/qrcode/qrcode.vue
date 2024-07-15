<template>
	<view class="qrcode">
		<view :style="'height:'+windowTop+'px;'"></view>
		<view class="qrcode-img">
			<image :src="qrcode_url" style="width: 100%;height: 100%;"></image>
		</view>
		<view class="occupy"></view>
		<view class="btns-wrap">
			<button class="btn-red" type="default" :style="[active]" @click="renewPosterImg">{{$nw("重新生成")}}</button>
			<view style="float:left;width: 1rpx;height: 100rpx; background: #F2F2F2;"></view>
			<!-- #ifdef MP -->
			<button class="btn-red" type="default" :style="[active]" @click="savePosterImg">{{$nw("保存图片")}}</button>
			<!-- #endif  -->
			<!-- #ifdef H5 -->
			<view class="conserve f34 tc ww100" type="default">{{$nw("长按保存图片")}}</view>
			<!-- #endif -->
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				qrcode_url: '',
				renew: false,
				windowTop: 0, // 导航头高度
			}
		},
		onLoad() {
			this.init()
			/*获取数据*/
			this.getData();
			this.setGlobalColor()
		},
		computed: {
			active() {
				return Object.assign(this.setBackgroundColor(), this.setColor())
			},
		},
		onShareTimeline() {
			let self = this;
			return {
				title: "",
			};
		},
		methods: {
			/**
			 * 设置分享内容
			 */
			onShareAppMessage() {
				let self = this;
				return {
					title: "",
					path: '/pages/index/index'
				};
			},
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.windowTop = res.windowTop
					}
				});
			},

			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中"),
				});
				let source = 'wx';
				//#ifdef H5
				source = 'mp';
				//#endif
				self._get('plus.agent.qrcode/poster', {
					source: source,
					renew: self.renew
				}, function(data) {
					self.qrcode_url = data.data.qrcode;
					uni.hideLoading();
				});
			},

			/*保存图片*/
			savePosterImg() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				// 下载海报图片
				uni.downloadFile({
					url: self.qrcode_url,
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
								// 关闭商品海报
								self.isCreatedImg = false;
							},
							fail(err) {
								console.log(err.errMsg);
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
							}
						});
					}
				});
			},
			/* 重新生成海报 */
			renewPosterImg() {
				let self = this;
				self.renew = true;
				self.getData();
			}
		}
	}
</script>

<style>
	.qrcode {}

	.qrcode-img {
		position: fixed;
		/*height: 88rpx;*/
		/* #ifdef H5 */
		top: 43px;
		/* #endif */
		/* #ifndef h5 */
		top: 0rpx;
		/* #endif */

		right: 0;
		bottom: 88rpx;
		left: 0;
		display: flex;
		z-index: 10;
	}

	.qrcode image {
		width: 100%;
	}

	.btns-wrap {
		position: fixed;
		height: 88rpx;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		z-index: 10;
	}

	.btns-wrap .btn-red {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 0;
	}

	.conserve {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		text-align: center;
		background: #FFFFFF;
	}
</style>