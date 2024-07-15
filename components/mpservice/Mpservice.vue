<template>
	<Popup :show="isPopup" :width="width" :padding="0" @hidePopup="hidePopupFunc">
		<view class="d-s-s d-c p20 mpservice-wrap">
			<view class="d-b-c p-30-0 f34 ww100 border-b" @click="copyQQ(dataModel.qq)">
				<text class="gray9" style="width: 140rpx;">QQ：</text>
				<text class="p-0-30 flex-1">{{dataModel.qq}}</text>
				<text class="blue">{{$nw("复制")}}</text>
			</view>
			<view class="d-b-c p-30-0 f34 ww100" @click="copyQQ(dataModel.wechat)">
				<text class="gray9" style="width: 140rpx;">{{$nw("微信号")}}：</text>
				<text class="p-0-30 flex-1">{{dataModel.wechat}}</text>
				<text class="blue">{{$nw("复制")}}</text>
			</view>
			<view class="mp-image">
				<image :src="dataModel.mp_image" mode="widthFix"></image>
			</view>
			<view class="ww100 pt10 tc f30 gray9">
				{{$nw("客服")}}
			</view>
		</view>
		<view class="d-c-c ww100">
			<view class="p20" @click="hidePopupFunc(true)"><text class="icon iconfont icon-guanbi"></text></view>
		</view>
	</Popup>
</template>

<script>
	import utils from "@/common/utils"
	import Popup from '@/components/uni-popup.vue';
	export default {
		components: {
			Popup
		},
		data() {
			return {
				/*是否打开*/
				isPopup: false,
				/*宽度*/
				width: 600,
				/*数据对象*/
				dataModel: {}
			}
		},
		props: ["copy_success"],
		created() {
			this.isPopup = true;
			this.getData();
		},
		methods: {

			/*获取数据*/
			getData() {
				let self = this;
				self._get(
					'index/mpService', {},
					function(res) {
						self.dataModel = res.data.mp_service;
					}
				);
			},

			/*关闭弹窗*/
			hidePopupFunc(e) {
				this.isPopup = false;
				this.$emit('close');
			},

			/*复制*/
			copyQQ(message) {
				// #ifdef MP-WEIXIN
				let self = this
				utils.copy({
					content: message,
					success: function() {

						self.$u.toast(self.$nw("复制成功"), 1000)
					},
					fail: function() {
						self.$u.toast(self.$nw("失败了"), 1500)
					}
				})
				// #endif
				// #ifndef MP-WEIXIN
				var input = document.createElement("input");
				input.value = message;
				document.body.appendChild(input);
				input.select();
				input.setSelectionRange(0, input.value.length), document.execCommand('Copy');
				document.body.removeChild(input);
				uni.showToast({
					title: this.copy_success,
					icon: 'success',
					mask: true,
					duration: 2000
				});
				// #endif



			}

		}
	}
</script>

<style>
	.mpservice-wrap .mp-image {
		width: 560rpx;
		margin-top: 40rpx;
	}

	.mpservice-wrap .mp-image image {
		width: 66%;
		margin: 0 auto;
		display: block;
	}
</style>