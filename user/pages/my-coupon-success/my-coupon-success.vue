<template>
	<view>
		<view style="text-align: center;position: fixed;top: 4rem;left: 0;right: 0;">
			<image style="width: 6rem;height: 6rem;margin-left: 35%;" src="http://imgh5.y01.cn/20210606232155ee83c0288.png"></image>
			<view style="font-size: 1rem;font-weight: bold;margin-top: 1rem;">{{$nw("操作成功")}}</view>
			<view style="font-size: 1rem;font-weight: bold;margin-top: 1rem;">{{$nw("正在返回会员中心")}}</view>
			<button @click="reloadyemian" style="background-color: #FF0036;color: #FFFFFF;margin:1rem auto 0 auto;width: 50%;">{{$nw("会员中心")}}</button>
		</view>
	</view>
</template>

<script>
	export default {
		components: {

		},
		data() {
			return {

			};
		},
		onLoad(option) {
      this.setGlobalColor()
			var setout = setTimeout(function(){
				uni.reLaunch({
					url:'/user/pages/index/index'
				})
			},3000);
		},
		methods: {
			reloadyemian(){
				console.log(111)
				uni.reLaunch({
					url:'/user/pages/index/index'
				})
			}
		}
	}
</script>

<style>
</style>
