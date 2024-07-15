<template>
	<view class="container_box22">
		<view class="menu-list">
			<view class="menu-item item" v-for="(item, index) in  itemData.data" :key="index"
				:style="{background:itemData.style.background}" @click="gotoDetail(item)">
				<button v-if="item.linktype == 'service' && item.type=='chat'" type="default" open-type="contact"
					session-from="wxapp" class="contract-btn"></button>
				<view class="contract-btn" v-else-if="item.linktype == 'service' && item.type=='phone'"
					@click="callPhone(item)">
				</view>
				<view class="item-left">
					<image :src="item.imgUrl" mode="aspectFit"></image>
					<text class="f26" :style="{color:item.color}">{{ $nws(item.text )}}</text>
				</view>
				<view class="item-right">
					<!-- <text> -->
					<view class="iconfont icon-jiantou"></view>
					<!-- </text> -->
				</view>
			</view>
		</view>

	</view>
</template>


<script>
	import utils from '../../../common/utils'
	export default {
		data() {
			return {
				//单个宽度
				item_width: '25%'
			}
		},
		props: ['itemData'],
		created() {
			this.item_width = 100 / Math.abs(this.itemData.style.rowsNum) + '%';
		},
		methods: {

			/*跳转页面*/
			gotoDetail(e) {
				console.log("e", e)
				if (e.appid != undefined && e.appid != '') {
					console.log(e);
					uni.navigateToMiniProgram({
						// #ifdef MP
						appId: e.appid,
						path: e.linkUrl != undefined ? e.linkUrl : '',
						// #endif
					})
				} else {
					let self = this
					self._get('user.index/detail', {}, function(res) {
						let userInfo = res.data.userInfo
						var isA = utils.isNick_Avatar(self, userInfo); //1  正常  -1 没昵称  -2 没头像
						if (isA == 1) {
							self.gotoPage(e.linkUrl);
						} else {
							// #ifdef MP-WEIXIN
								self.change_loginShow(true)
							// #endif
							// #ifdef H5
							if (isA == -1) {
								uni.navigateTo({ //跳转修改昵称
									url: "/user/pages/user/info?data=&type=1"
								})
							} else if (isA == -2) {
								uni.navigateTo({ //跳转修复头像
									url: "/user/pages/user/edit"
								})
							}else if(isA == -3){
								uni.navigateTo({//跳转设置手机号
									url: "pages/login/bindmobile"
								})
								
							}
							// #endif
						}
					})
				}

			},
			callPhone(e) {
				let self = this;
				uni.makePhoneCall({
					phoneNumber: e.phone_num
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../../card/statics/5.css";

	.container_box22 {
		border-radius: 20rpx !important;
		//border: 1px solid red;
		box-shadow: 0 0 8rpx rgba(0, 0, 0, .1);
		background-color: #FFF;
		margin: 0 20rpx;
	}

	.menu-list .item {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid #f2f2f2;
		align-items: center;
		height: 94rpx;
	}

	.item image {
		width: 44rpx;
		height: 44rpx;
		margin-right: 20rpx;
	}


	.menu-item {
		/* padding: 30rpx; */
		margin: 0rpx 30rpx;
	}

	.item-left {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.item-right {
		display: flex;
		align-items: center;
	}

	.contract-btn {
		position: absolute;
		height: 94rpx;
		left: 10rpx;
		right: 10rpx;
		opacity: 0;
	}
</style>
