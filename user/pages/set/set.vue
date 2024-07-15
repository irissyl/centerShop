<template>
	<view class="address-form">
		<form @submit="formSubmit">
			<!-- 改为可装修 -->
			<view class="">
				<diy :diyItems="menus"></diy>
			</view>
			<view class="btns p30">
				<button type="default" @click="LoginOut">{{$nw("退出登录")}}</button>
			</view>
		</form>
		<service :itemData="t_service"></service>
	</view>
</template>

<script>
	import service from '@/components/diy/service/service';

	export default {
		components: {
			service,

		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				userInfo: {},
				menus: [],
			};
		},
		onShow() {
			this.setGlobalColor()
			/*获取个人中心数据*/
			this.getData();
			uni.setNavigationBarTitle({
				title: this.$nw("设置")
			})
		},
		computed: {
			getbutton() {
				return this.setButton().button
			}
		},
		methods: {
			// h5退出登录
			LoginOut() {
				uni.setStorageSync('token', '');
				uni.setStorageSync('rider_id', '');
				uni.setStorageSync('user_id', '');
				uni.reLaunch({
					url: '/user/pages/index/index'
				});
			},
			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				self._get('user.index/setting', {}, function(res) {
					self.userInfo = res.data.userInfo;
					console.log("res.data.items.items[0]", res.data.items.items)
					res.data.items.items[0].type = "menua";
					self.menus = res.data.items.items
					uni.hideLoading();
				});
			},
			gotoBind() {
				uni.navigateTo({
					url: '/pages/login/bindmobile'
				});
			},
		}
	};
</script>

<style>
	.address-form .key-name {
		width: 200rpx;
	}

	.address-form .btn-red {
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		box-shadow: 0 8rpx 16rpx 0 rgba(226, 35, 26, .6);
	}

	.btns button {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 34rpx;
		border-radius: 45rpx;
		background: #e4dddd;
		color: #ffffff;
	}
</style>