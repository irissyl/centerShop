<template>
	<view class="teamRank">
		<view class="" v-for="item in 10">
			<image src="https://thirdwx.qlogo.cn/mmopen/vi_32/KoIa5QlbG7IVpMnrf3oYJ4eKiblrraVjyUM7crrp7icol9znDjtER3yXQ0n8q8KbmGukryVGLB2icOA8b3OA6w1ibQ/132"
			 mode=""></image>
			<view class="user-info">
				<view class="">
					{{$nw("用户名称")}}
				</view>
				<view class="">
					S1
				</view>
			</view>
			<view class="optinons">
				<view class="money">
					{{$nw("总金额")}}:100元
				</view>
				<view class="">
					{{$nw("红包数量")}}:100
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				redpageborder: 'border',
				teamborder: '',
			}
		},
    onShow() {
      this.setGlobalColor()
    },
		methods: {
			changeTar(val) {
				if (val == 'redpage') {
					this.redpageborder = 'border';
					this.teamborder = '';
				} else {
					this.redpageborder = '';
					this.teamborder = 'border';
				}
			}
		}
	}
</script>

<style scoped>
	.teamRank {
		margin-top: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.teamRank>view {
		display: flex;
		background-color: #fff;
		padding: 20rpx 0;
		border-bottom: 2rpx solid #ccc;
	}

	.teamRank>view image {
		width: 100rpx;
		height: 100rpx;
		margin: 0 20rpx;
	}

	.teamRank>view>view:nth-child(2) {
		width: 55%;
	}

	.teamRank>view>view:nth-child(2)>view:last-child {
		color: #F00808;
	}

	.teamRank>view>view:nth-child(3) {
		width: 30%;
		font-size: 24rpx;
	}
	.teamRank>view>view:nth-child(3)>view:first-child {
		color:#BD3F3F;
		font-weight: 700;
	}
	.teamRank>view>view:nth-child(3)>view:last-child {
		color: #AEACAC;
	}
</style>
