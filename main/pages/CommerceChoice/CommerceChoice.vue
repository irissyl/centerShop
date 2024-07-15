<template>
	<view style="padding: 24rpx;">
		<view class="input">
			<u-icon class="icon" name="search" size="35"></u-icon>
			<u-input v-model="value" type="text" placeholder="搜索" :border="false" />
		</view>
		<!-- <view class="already">
			<view class="" style="font-size: 36rpx;font-weight: 800;margin-bottom: 16rpx;">
				已加入商会
			</view>
			<view class="already-c">
				<view class="already-box dcc" v-for="(item,index) in 3" @click="choice(item)">
					<img src="https://hbimg.b0.upaiyun.com/3f2f7b529d61e4a94969ab535058bdea18a61c07ba1c-u4oX3S_fw658"
						alt="" />
					<text>东莞市河南商会</text>
				</view>
			</view>
		</view> -->
		<view class="already">
			<view class="" style="font-size: 36rpx;font-weight: 800;margin-bottom: 16rpx;">
				全部商会
			</view>
			<view class="already-c">
				<view class="already-box" v-for="(item,index) in list" @click="choice(item)">
					<img :src="item.image_url"
						alt="" />
					<text>{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				value: '',
				list:[]
			};
		},
		onShow() {
			this.setGlobalColor()
			this._get('plus.coc.Coc/getCocOrgAll', {}, (res) => {
				// console.log(res,2132111);
				this.list = res.data.list
			})
			
		},
		methods: {
			choice(e) {
				let pages = getCurrentPages(); //获取所有页面栈实例列表
				let nowPage = pages[pages.length - 1]; //当前页页面实例
				let prevPage = pages[pages.length - 2]; //上一页页面实例
				prevPage.$vm.merchantObj = e; //修改上一页data里面的参数值
				uni.navigateBack({ //uni.navigateTo跳转的返回，默认1为返回上一级
					delta: 1
				});
			}
		},
	}
</script>

<style lang="scss">
	.already {
		margin-top: 40rpx;

		.already-c {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
		}

		.already-box {
			width: 344rpx;
			height: 128rpx;
			display: flex;
			align-items: center;
			padding: 0 34rpx;
			background: #FFFFFF;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			margin-bottom: 16rpx;

			img {
				width: 64rpx;
				height: 64rpx;
				border-radius: 50%;
				margin-right: 16rpx;
			}

			text {
				margin-left: 16rpx;
				font-size: 28rpx;
			}
		}
	}

	.input {
		display: flex;
		width: 702rpx;
		height: 80rpx;
		background: #FFFFFF;
		border-radius: 44rpx 44rpx 44rpx 44rpx;
		padding: 0 28rpx;
		align-items: center;

		.icon {
			margin-right: 16rpx;
		}
	}
</style>