<template>
	<view class="rich-text-page">
		<u-parse v-if="detailsData" class="introduce-content" :html="detailsData"></u-parse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				loading: false,
				detailsData: ""
			}
		},
		onLoad(option) {
			this.setGlobalColor()
			if (option.id) {
				this.getData(option.id)
			}
		},
		methods: {
			getData(id) {
				this.loading = true;
				uni.showLoading({
					title: "加载中"
				});
				this._get('plus.content.content/getContent', {
					id
				}, (res) => {
					if (res.code == 1) {
						this.detailsData = res.data || ''
					}
					uni.hideLoading();
					this.loading = false
				}, (err) => {
					console.log('请求结束-->')
					uni.hideLoading();
					this.loading = false
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.rich-text-page {
		background: #f4f7fb;
		padding: 0 24rpx;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom) / 2);
	}
</style>