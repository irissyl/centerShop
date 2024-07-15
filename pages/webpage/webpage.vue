<template>
	<view>
		<web-view :src="url" v-if="url"></web-view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				//单个宽度
				url: ""
			}
		},
		onLoad(e) {
			this.setGlobalColor()
			this.url = e.url
			console.log(this.url)
		}
	}
</script>

<style>
</style>