<template>
	<scroll-view scroll-y="true" :style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'"
		>
	<view >
		<view style="padding: 20rpx;" :style="'background:'+getMainColor()+';'">
			<u-parse :html="article" :style="'color:'+getTextColorWhite()+';'"></u-parse>
		</view>
	</view>
	</scroll-view>
	
</template>

<script>

	export default {
		components: {
		    
		  },
		data() {
			return {
				article: "",
				scrollviewHigh:0,
			}
		},
		onShow() {
			this.setGlobalColor()
			this.init();
		},
		onLoad(opt) {
			var self = this;
			if(opt.code){
				self._get('plus.xieyi.Index/detail', {
					code:opt.code
				}, function(res) {
					console.log(res)
					self.article = res.data.content
					uni.setNavigationBarTitle({
						title:res.data.name
					})
				})	
			}else{
				uni.showToast({
					title:self.$nw("未找到协议"),
					icon:"none"
				})
			}
			
		},
		methods: {
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.scrollviewHigh = res.windowHeight;
			
					}
				});
			},
		}
	}
</script>

<style >

</style>
