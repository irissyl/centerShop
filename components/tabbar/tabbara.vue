<template>
	<view :style="'background:'+getMainColor()+';'">
		<!-- 第一张 固定50% -->
		<view class="tabbar-wrapper" v-if="type != 4" :style="'background:'+getMainColor()+';'">
			<view class="tabbar-item" :style="style_val" v-for="(item,index) in tabbar_list" :key="index"
				@click="tabTypeFunc(index)">
				<view class="tab_1" :style="{
							'color':item.flag==true?getTabbarSelectColor():getTabbarColor(),
							'fontWeight':item.flag==true?'600':'100',
							'fontSize':item.flag==true?'34rpx':'30rpx'}">
					{{$nw(item.name)}}
				</view>

				<view class="tab_2" :style="{
				 			'background':item.flag==true?getTabbarSelectColor():getTabbarColor()}" v-if="item.flag == true"></view>
			</view>
		</view>

		<view class="tabbar-wrapper" v-if="type == 4" :style="'background:'+getMainColor()+';'">
			<view class="tabbar-item" :style="style_val" v-for="(item,index) in tabbar_list" :key="index"
				@click="tabTypeFunc(index)">
				<view class="tab_1" :style="{
							'color':item.flag==true?getTabbarSelectColor():getTabbarColor(),
							'fontWeight':item.flag==true?'600':'400',
							'fontSize':item.flag==true?'40rpx':'32rpx'}">
					{{$nws(item.label)}}
				</view>
				<view class="tab_2" :style="{
				 			'background':item.flag==true?getTabbarSelectColor():getTabbarColor()}" v-if="item.flag == true"></view>
			</view>

		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				style_val: this.type == '1' ? "width: 50%;" : (this.type == '2' || this.type == '4' ?
					"margin-left: 2%;margin-right:2%;" : "width: 33.33%;"),
			}
		},
		props: ["tabbar_list", "type"],
		mounted() {
			console.log('tabbar_list', this.tabbar_list);
		},
		methods: {
			tabTypeFunc(index) {
				this.$emit("tabbarEmit", index)
			}
		}
	}
</script>

<style lang="scss">
	.tabbar-wrapper {
		width: 100%;
		overflow-x: auto;
		white-space: nowrap;

		// padding: 24rpx 0;

		& .tabbar-item {

			text-align: center;
			display: inline-block;
			padding: 10rpx 0;
			position: relative;


			&image {
				&::after {
					content: '';
					width: 90rpx;
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					margin: auto;
					border-bottom: 4rpx solid #1F1A17;
				}
			}
		}

		.tab_2 {
			width: 25%;
			height: 4rpx;

			opacity: 1;
			margin: auto;
			margin-top: 0rpx;
			border-radius: 5rpx;
		}
	}
</style>