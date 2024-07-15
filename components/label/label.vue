<template>
	<view class="">
		<view class="label">
			<view class="label_0" v-if="item.title">
				<view class="" :style="'background:'+item.color"></view>
			</view>
			<view class="label_1" :style="'color:'+item.color" v-if="item.title">
				{{name&&name.length>0?$nws(name):$nws(item.title)}}
			</view>
			
			<view class="label_2" :style="'color:'+item.color" v-if="item.right" @click="more">
				{{$nw("查看更多")}}>
			</view>
			<view style="clear: both;"></view>
		</view>	
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		props: ["item","name"],
	
		computed: {
			getbutton() {
				return this.setButton().button
			}
		},
		methods: {
			detailClick(item){
				let path = "/card/pages/card/index?card_id=" + item.card_id;
				this.gotoPage(path);
			},
			more(){//更多跳转
				if(this.item.code == "eval"){//跳转更多评论
					uni.navigateTo({
						url:"/card/pages/card/evaluate?card_id="+this.item.card_id
					})
				}else if(this.item.code == "cf_jy"){
					uni.navigateTo({
						url:"/plus2/pages/project/index"
					})
				}else if(this.item.code == "re_video"){
					uni.navigateTo({
						url:"/plus2/pages/video/index/index"
					})
				}else if(this.item.code == "s_act"){
					uni.navigateTo({
						url:"/plus2/pages/activity/activity"
					})
				}else if(this.item.code == "activity_list"){
					let path = '/plus2/pages/activity/list'
					uni.navigateTo({
						url:path
					})
				}else if(this.item.code == "new_article"){
					let path = '/plus/pages/article/list/list'
					uni.navigateTo({
						url:path
					})
				}
				
			},

		}
	}
	
</script>

<style lang="scss">
	
	.label {
		height: 70rpx;
	
		.label_0 {
			float: left;
	
			view {
				width: 6rpx;
				height: 30rpx;
				background: #000;
				border-radius: 5rpx;
				margin-left: 20rpx;
				margin-top: 22rpx;
			}
		}
	
		.label_1 {
			font-size: 30rpx;
			float: left;
			margin-left: 15rpx;
			line-height: 70rpx;
		}
		.label_2{
			font-size: 26rpx;
			float: right;
			margin-right: 15rpx;
			line-height: 70rpx;
		}
	}
</style>