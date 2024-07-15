<template>
	<view class="diy-live" :style="{ background: itemData.style.background }">
		<view class="diy-head d-b-c">
			<view class="left d-s-c">
				<view class="name">{{$nw("微信直播")}}</view>
			</view>
			<view class="right" @click="gotoList">
				<text>{{$nw("更多")}}</text>
				<text class="iconfont icon-jiantou white"></text>
			</view>
		</view>
		<view class="list d-s-c f-w">
			<view class="item" v-for="(item, index) in itemData.data" :key="index" @click="gotoDetail(item)">
				<view class="pic pr">
					<text class="state"
						:class="{bg101:item.live_status==101,bg102:item.live_status==102,bg103:item.live_status==103}"
						v-if="item.live_status==101||item.live_status==102||item.live_status==103">
						{{convertStatus(item.live_status)}}
					</text>
					<image :src="item.cover_img" mode="aspectFit"></image>
				</view>
				<view class="p-20-0 text-ellipsis f30">{{ item.name }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				user_id: 0,
			};
		},
		props: ['itemData'],
		created() {},
		methods: {
			scroll(e) {},

			/*状态转换*/
			convertStatus(num) {
				let str = '';
				switch (num) {
					case 101:
						str = this.$nw("直播中");
						break;
					case 102:
						str = this.$nw("未开始");
						break;
					case 103:
						str = this.$nw("已结束");
		 			break;
					case 104:
						str = this.$nw("禁播");
		 			break;
					case 105:
						str = this.$nw("暂停");
						break;
					case 106:
						str = this.$nw("异常");
						break;
					case 107:
						str = this.$nw("已过期");
						break;
				}
				return str;
			},

			/*跳转列表*/
			gotoList() {
				let url = '/plus/pages/live/wx/list';
				this.gotoPage(url);
			},

			/*跳转产品详情*/
			gotoDetail(item) {
				let self = this;
				self.user_id = uni.getStorageSync('user_id');
				if (!self.user_id) {
					self.login_l(self)
					return;
				}
				self._get(
					'plus.live.wx/checkUserLevel', {
						user_id: self.user_id
					},
					function(res) {
						if (!res.data.result) {
							uni.showToast({
								title: self.$nw("您的等级还无法进入到直播间"),
								icon: 'none',
							})
						} else {
							let roomId = item.roomid;
							let customParams = {
								path: 'pages/index/index'
							};
							wx.navigateTo({
								url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}&custom_params=${encodeURIComponent(JSON.stringify(customParams))}`
							});
						}
					}
				);
			}
		}
	};
</script>

<style lang="scss">
	.diy-live {
		margin: 20rpx;
		border-radius: 20rpx;
		padding: 0 20rpx 20rpx;
		background: #ffffff;
		box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
	}

	.diy-live .diy-head {
		height: 100rpx;
	}

	.diy-live .diy-head .name {
		font-size: 36rpx;
		font-weight: bold;
	}

	.diy-live .list .item {
		width: 325rpx;
		margin-right: 20rpx;
	}

	.diy-live .list .item:nth-child(2n + 0) {
		margin-right: 0;
	}

	.diy-live .list .item .pic {
		width: 325rpx;
		height: 325rpx;
	}

	.diy-live .list .item .pic .state {
		position: absolute;
		top: 20rpx;
		left: 20rpx;
		padding: 4rpx 8rpx;
		background: red;
		color: #FFFFFF;
		border-radius: 8rpx;
	}

	.diy-live .list .item .pic .state.bg101 {
		background: red;
	}

	.diy-live .list .item .pic .state.bg102 {
		background: #ffb100;
	}

	.diy-live .list .item .pic .state.bg103 {
		background: #333333;
	}

	.diy-live .list .item image {
		width: 325rpx;
		height: 325rpx;
		border-radius: 16rpx;
	}
</style>
