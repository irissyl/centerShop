<template>
	<view v-if="isTuiguang">
		<!--图标入口-->
		<view :class="'diy-navbar' + ' column-4'" :style="{background:'#fff',marginTop:'20upx'}">
			<view class="item" v-for="(item, index) in itemData" :key="index" :style="'width:'+item_width+';'"
				@click="gotoDetail(item,index)">
				<img :src="item.imgUrl" mode="widthFix"></img>
				<!-- <img :src="item.imgUrl" alt="" /> -->
				<text class="gray3" style="font-size: 24rpx;color: #333333;">{{ $nws(item.text) }}</text>
			</view>
		</view>
		<u-modal v-model="show" :showConfirmButton='false' :maskCloseAble="true" :showTitle="false" :negativeTop='100'>
			<view class="tuiguang-code-box">
				<image class="code-img"
					src="https://shanghui.client.xcx008.com/file/uploads/20240430/6cd8ad69bea55d1470e49f2bf5eeca50.jpg"
					mode="widthFix" :show-menu-by-longpress="true"></image>
				<view class="code-text">
					长按分享/保存小程序二维码
				</view>
			</view>
		</u-modal>
	</view>
</template>

<script>
	import 'common/iconfont.css'
	import utils from '../../../common/utils'

	export default {
		data() {
			return {
				//单个宽度
				item_width: '25%',
				itemData: [{
						imgUrl: 'https://shanghuitest.client.xcx008.com/file/uploads/20240420/158b88fd27d77c11677b4b3e0747fc0b.png',
						text: '企业入驻'
					},
					{
						imgUrl: 'https://shanghuitest.client.xcx008.com/file/uploads/20240420/fe45827f2421f6c9e25a81ad794ebe21.png',
						text: '商会入驻'
					},
					{
						imgUrl: 'https://shanghuitest.client.xcx008.com/file/uploads/20240420/032464572fd5934ae3bfdceb1bb2585e.png',
						text: '人脉资源'
					},
					{
						imgUrl: 'https://shanghuitest.client.xcx008.com/file/uploads/20240420/ae65e4c57a2808035e9f032ad8c80c0a.png',
						text: '人才引进'
					},
					{
						imgUrl: 'https://shanghuitest.client.xcx008.com/file/uploads/20240420/4b6722b4374e5d159920095f19cf6251.png',
						text: '宣传视频'
					},
					// {
					// 	imgUrl: 'https://shanghuitest.client.xcx008.com/file/uploads/20240420/442525ae0d0d885a4f75c057663cd6db.png',
					// 	text: '公司官网'
					// }
				],
				show: false
			}
		},
		// props: ['itemData'],
		props: ['isTuiguang'],
		created() {
			this.item_width = 100 / Math.abs(3) + '%';
		},
		mounted() {
			console.log('isTuiguang', this.isTuiguang);
			if (this.isTuiguang) {
				this.itemData.push({
					imgUrl: 'https://shanghui.client.xcx008.com/file/uploads/20240430/3054b5cf6fa1a548f93d262f202c6a93.png',
					text: '推广二维码'
				})
			}else{
				this.itemData.push({
					imgUrl: 'https://shanghui.client.xcx008.com/file/uploads/20240506/ff5c15379b6bcffd2ea2a7363f557a0d.png',
					text: '分享推广'
				})
			}
		},
		methods: {

			/*跳转页面*/
			gotoDetail(e, i) {
				if (i === 0) {
					uni.navigateTo({
						url: '/main/pages/JoiningTheMembership/JoiningTheMembership'
					})
				} else if (i === 1) {
					uni.navigateTo({
						url: '/main/pages/MerchantSettlement/MerchantSettlement'
					})
				} else if (i === 2) {
					uni.navigateTo({
						url: '/main/pages/networkResources/networkResources'
					})
				} else if (i === 3) {
					uni.navigateTo({
						url: '/main/pages/talentIntroduction/talentIntroduction'
					})
				} else if (i === 4) {
					uni.navigateTo({
						url: '/plus2/pages/video/index/index'
					})
				} else if (e.text === '分享推广') {
					// this.gotoPage('https://www.wsyhkj.com')
					uni.navigateTo({
						url: '/main/pages/agent/index/index'
					})
				} else if (e.text === '推广二维码') {
					console.log('弹出推广二维码');
					this.show = true
				}
			},
			callPhone(e) {
				uni.makePhoneCall({
					phoneNumber: e.phone_num
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	// @import "../../../card/statics/5.css";

	.tuiguang-code-box {
		padding: 80rpx 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.code-img {
			width: 400rpx;
			height: 400rpx;
		}

		.code-text {
			font-size: 28rpx;
			color: #666;
			margin-top: 40rpx;
		}
	}

	.column-1 .item {
		// border-bottom: #f2f2f2 1px solid;
		display: flex;
		margin: 20rpx 35rpx;
		justify-content: space-between;
		align-items: center;
		padding-top: 5rpx;
		padding-bottom: 5rpx;

		&:last-child {
			border: none;
		}

		image {
			width: 60rpx;
			height: 60rpx;
			//border-radius: 50%;
		}

		.navbar-icon-box {
			width: 60rpx;
			height: 60rpx;
			border-radius: 50%;
			color: #ffffff;
			text-align: center;

			i {
				font-size: 45rpx;
				color: #ffffff;
				line-height: 60rpx;
			}
		}

		.gray3 {
			line-height: 60rpx;
			flex: 0.9 1 auto;
		}

		.icon-right {
			line-height: 60rpx;
			color: #c9c9c9;
			font-size: 24rpx;
		}
	}

	.diy-navbar {
		border-radius: 20rpx;
		background: #FFFFFF;
		// box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
		width: 700upx;
		margin: 20upx auto;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		overflow: hidden;
	}

	.diy-navbar .item {
		position: relative;
	}

	.contract-btn {
		position: absolute;
		opacity: 0;
		width: 100%;
		height: 100%;
	}

	.column-3.diy-navbar,
	.column-4.diy-navbar,
	.column-5.diy-navbar {
		.item {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			margin-top: 20rpx;
			width: 120rpx;

			.icon-right {
				display: none;
			}

			img {
				width: 80rpx;
				height: 80rpx;
				//border-radius: 50%;
			}

			.navbar-icon-box {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				color: #ffffff;
				text-align: center;

				i {
					font-size: 55rpx;
					color: #ffffff;
					line-height: 80rpx;
				}
			}

			text {
				display: block;
				text-overflow: ellipsis;
				white-space: nowrap;
				width: 100%;
				overflow: hidden;
				line-height: 60rpx;
				font-size: 28rpx;
				text-align: center;
			}
		}
	}
</style>