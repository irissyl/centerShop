<template>
	<view :style="phoneHeight" class='errorText'>
		<view :style="imageHeight" class="error-content">
			<image src="http://imgh5.y01.cn/20210606225550dd5f35541.png" mode="aspectFit" class='errorImg'></image>
			<text>{{text}}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				//屏幕高度
				phoneHeight: "",
				text: this.$nw("站点关闭"),
				//图片高度
				imageHeight: "",
			}
		},
		onLoad(options) {
      this.setGlobalColor()
			this.text = options.text;
		},
		mounted() {

			this.init();
			// this.getAppInfo();
		},
		methods: {
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = "height:" + res.windowHeight + "px"
						_this.imageHeight = "height:" + res.windowHeight / 2 + "px"
					}
				});
			},

			/**
			 * 获取当前应用信息
			 */
			getAppInfo() {
				let self = this;
				let platform = self.getPlatform();
				self._get('index/getAppInfo', {'platform':platform}, function(res) {

					if (res.code == 1) {
						console.log(res);
						var info = res.data.appinfo;
						if (!info.close_site) {
							uni.redirectTo({
								url: "../index/index"
							})
						}

					}

				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.errorText {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
    .error-content {
      width: 90%;
      text {
        font-size: 35rpx;
      }
    }
	}

	.errorImg {
		width: 60%;
		height: 60%;
		padding: 0 20%;
	}
</style>
