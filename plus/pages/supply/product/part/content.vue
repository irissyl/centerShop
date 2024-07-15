<template>
	<jinEdit :placeholder="$nw('商品详情')" @editOk="editOk" :html="content"></jinEdit>
</template>

<script>
	import jinEdit from '@/components/jin-edit/jin-edit.vue';
	export default {
		data() {
			return {
				content:''
			}
		},
		components: {
			jinEdit
		},
		onLoad() {
      this.setGlobalColor()
			var detail = uni.getStorageSync('goods_content');
			this.content=detail
		},
		methods: {
		// 点击发布
			editOk(res) {
				var content=res.html
				console.log(content)
				uni.setStorageSync('goods_content',content)
				uni.navigateBack({
					
				})
			}
		}
	}
</script>
<style>
</style>
