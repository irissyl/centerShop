<template>
	<view>
		<QuickBuy :timestamp_chage="timestamp_chage"></QuickBuy>
	</view>
</template>

<script>
	import QuickBuy from '@/components/quickOrder/quickBuy.vue';
	export default {
		components: {
			QuickBuy
		},
		data() {
			return {
				timestamp_chage: 0
			};
		},
		onLoad() {
			wx.showShareMenu({
				withShareTicket: true,
				//设置下方的Menus菜单，才能够让发送给朋友与分享到朋友圈两个按钮可以点击
				menus: ["shareAppMessage", "shareTimeline"]
			})
		},
		onShow() {
			this.timestamp_chage = Date.now()
			clearInterval(uni.getStorageSync("xt_checkPay"))
		},
		/**
		 * 设置分享内容
		 */
		onShareAppMessage() {
			// 构建分享参数
			return {
				title: this.$nw("在线点单"),
				path: "/plus2/pages/quick/buy"
			};
		},
		onShareTimeline(res) {
			return {
				title: this.$nw("在线点单"),
				type: 0,
				summary: "",
			}
		}
	}
</script>

<style lang="scss">

</style>