<template>
	<view class="diy-service drag optional drag__nomove"
		:style="{ right: '24rpx', bottom: (itemData.style.bottom || '11') + '%' }">
		<!-- <view class="service-icon" v-if="itemData.params.type=='phone'" @click="callPhone">
			<image :src="'../../static/img/kf.png'" mode="aspectFill"></image>
			<text style="color: #fff;z-index: 10000;position: relative;">客服</text>
		</view> -->
		<view v-if="itemData.params.type=='phone'" class="service-icon phone" @click="callPhone">
			<view class="service-show">
				<u-icon name="kefu-ermai" color="#fff" size="60"></u-icon>
				<text class="service-text">客服</text>
			</view>
		</view>
		<view v-else class="service-icon chat">
			<button class="service-icon1" open-type="contact" session-from="wxapp" />
			<view class="service-show">
				<u-icon name="kefu-ermai" color="#fff" size="60"></u-icon>
				<text class="service-text">客服</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		props: ['itemData'],
		created() {
			console.log('itemData--->', this.itemData);
		},
		methods: {
			/*拨打电话*/
			callPhone() {
				let self = this;
				uni.makePhoneCall({
					phoneNumber: self.itemData.params.phone_num
				});
			},
			f1() {
				console.log(1235);
			}
		}
	};
</script>

<style lang="scss">
	.drag__nomove {
		background-color: #1B94E0;
		width: 96rpx;
		height: 104rpx;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		display: flex;
		/* align-items: center; */
		justify-content: center;
	}

	.diy-service {
		position: fixed;
		width: 120rpx;
		height: 120rpx;
		z-index: 90;
		right: 0;
		bottom: 0;
	}

	.service-icon {
		position: relative;
	}

	.service-icon1 {
		width: 100%;
		height: 100%;
		opacity: 0;
		position: relative;
		z-index: 1000;
		padding: 0;
	}

	.service-show {
		width: 100%;
		height: 100%;
		position: absolute;
		left: 0;
		top: 0;
		z-index: 88;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.service-text {
			color: #fff;
		}

	}

	.diy-service .service-icon {
		width: 100%;
		height: 100%;
		text-align: center;

		image {
			margin: 0 auto;
			width: 64rpx;
			height: 64rpx;
			text-align: center;
		}
	}

	.diy-service button.service-icon {
		padding: 0;
		background: none;
	}

	.diy-service .service-icon image {
		/* 		width: 100%;
		height: 100%; */
	}
</style>