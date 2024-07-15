<template>
	<div>
		<view class="address-defalut-wrap">
			<!-- <view class="info">
				<text class="state">默认</text>
				<text class="type">家</text>
				<text class="province-c-a">商品进入云仓 </text>
			</view> -->
			
			<view class="user">
				<text class="title" style="color: #c6c6c6;font-size: large;">{{show_text}}</text>
			</view>
		</view>

		

	</div>
</template>

<script>
	export default{
		data(){
			return {}
		},
		props: ['tab_type'],
		computed: {
			show_text() {
				return Number(this.tab_type) === 2 ? 
				this.$nw("购买的商品将会进入云仓") : 
				this.$nw("虚拟商品无需配送")
			}
		},
		onLoad() {
			this.setGlobalColor()
		},
		methods:{
		}
	}
</script>

<style>
</style>

