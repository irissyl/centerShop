<template>
	<view>
		<view class="sel" :style="{borderTop: index!=0?'1rpx solid #efefef':''}" v-for="(item,index) in language"
			:key="index">
			<view style="flex: 0.6;">

			</view>
			<view class="sel1">{{$nw(item.name)}}</view>
			<view class="sel2">

				<switch color="#2CAAE3" @change="swit(item,index)" :checked="item.is_use == 1"
					style="transform: scale(0.7)"></switch>
			</view>
			<!-- 	<view style="flex: 0.2;">
				
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				language: []
			};
		},
		onLoad() {


		},
		onShow() {
			var self = this;
			self.getData(self)

		},
		methods: {
			getData(self) {
				//获取语言
				self._post('lang.Lang/getLanguage', {
					lang:uni.getStorageSync("lang")
				}, function(resz) {
					self.language = resz.data;

				})
			},
			swit(item, index) {
				var self = this;

				uni.showLoading({
					title: self.$nw("切换中...")
				})

				var data = {
					lang_id:item.lang_id
				}
				data.token = uni.getStorageSync('token') || ''
				data.app_id = self.getAppId()
				uni.request({
					url: self.websiteUrl + '/index.php/api/' + 'lang.Lang/changeLanguage',
					data: data,
					dataType: 'json',
					method: 'POST',
					header: {
						'content-type': 'application/x-www-form-urlencoded',
					},
					success: (res) => {
						var json_val = res.data.data;
						uni.setStorageSync("lang", item.code)
						uni.setStorageSync("translation_language", json_val.custom_lang)
						uni.setStorageSync("system_language", json_val.system_lang)
						uni.hideLoading()
						uni.reLaunch({
							url: '/pages/index/index'
						})
						//#ifdef H5
						location.reload();
						//#endif
						//#ifdef MP-WEIXIN
						var app = getApp();
						app.onLaunch();
						//#endif

					}
				})
			}

		}
	}
</script>

<style lang="scss">
	.sel {
		background: #fff;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 24rpx;
		display: flex;

		.sel1 {
			flex: 8;
			line-height: 80rpx;
		}

		.sel2 {
			flex: 2;
			line-height: 80rpx;

		}
	}
</style>