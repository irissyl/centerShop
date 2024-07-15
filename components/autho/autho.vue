<template>
	<div>
		<u-popup :show="loginShow" @close="loginClose" @open="loginOpen">
			<view class="p30">
				<p style="font-size: 34rpx;font-weight: 600;">{{$nw("获取您的昵称、头像")}}</p>
				<p style="color: #adadad;margin-top: 30rpx;">
					{{$nw("获取用户头像、昵称完善个人资料，主要用于向用户提供具有辨识度的用户中心界面")}}
				</p>
				<u-divider></u-divider>
				<u--form labelPosition="left" :model="userInfo" ref="loginForm">
					<u-form-item :label="$nw('头像')" labelWidth="50" prop="avatarUrl" borderBottom>
						<button class="avatar-wrapper" open-type="chooseAvatar" @chooseavatar="onChooseAvatar"
							style="display: flex;justify-content: left;">
							<view class="user-avatar">
								<image v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" mode="aspectFill">
								</image>
								<image v-else :src="avatar" mode="aspectFill"></image>
							</view>

						</button>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item :label="$nw('昵称')" labelWidth="55" prop="nickName" borderBottom>
						<input type="nickname" v-model="userInfo.nickName" class="weui-input"
							:placeholder="$nw('请设置昵称')"
							style="text-align: left;padding-left: 25rpx;font-size: 35rpx;" @blur="nickNameBlur" />
					</u-form-item>
					<u-form-item :label="$nw('手机号')" labelWidth="50" prop="mobile" borderBottom>
						<button style="background: #fff; color:rgb(67,167,241);border:0rpx solid #fff !important; 
						text-align: left !important;
						justify-content: left !important;font-size: 35rpx;" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber"
							withCredentials="true">
							{{ userInfo.mobile ==""?$nw('获取手机号码'):userInfo.mobile}}
						</button>
					</u-form-item>
				</u--form>
				<!-- v-if="!is_user_id" -->
				<u-button open-type="getUserInfo" :custom-style="{
					
						backgroundColor:setButton().button?setButton().button[0].buttonOne:'#E2231A',
						color:setButton().button?setButton().button[0].buttonOneColor:'#ffffff',
						border:'none'
					
				}" :text="$nw('保存')" type="primary" throttleTime="2000" @click="register"></u-button>
			</view>
		</u-popup>

	</div>
</template>

<script>
	import utils from "@/common/utils";
	import store from "../../store";
	export default {
		data() {
			return {
				curIndex: 0,
				isIphoneX: 0,
				tabbarData: {},
				item_width: '25%',
				userInfo: {
					avatarUrl: "",
					nickName: "",
					mobile: "",
				},
				avatar: this.fileImg('images/user/touxiang.png'),
				loginRules: {
					avatarUrl: [{
						type: 'string',
						required: true,
						message: this.$nw("请设置头像"),
						trigger: ['blur', 'change'],
					}],
					nickName: [{
						type: 'string',
						required: true,
						message: this.$nw("请设置昵称"),
						trigger: ['blur', 'change']
					}],
					mobile: [{
						type: 'string',
						required: true,
						message: this.$nw("请设置电话号码"),
						trigger: ['blur', 'change']
					}],
				},
				code: ""
			}
		},
		props: ["loginShow"],
		onReady() {
			// #ifdef MP  
			this.$nextTick(() => {
				if(this.$refs.loginForm){
					this.$refs.loginForm.setRules(this.loginRules);
				}
			});
			// #endif
		},

		methods: {
			fileImg: utils.fileImg,
			loginClose() {
				this.$emit("change_loginShow", false)
			},
			loginOpen() {
				var self = this;
				self._get('user.index/detail', {}, function(res) {
					console.log('user.index/detail',res.data);
					self.userInfo = {
						avatarUrl: res.data.userInfo.avatarUrl,
						nickName: res.data.userInfo.nickName,
						mobile: res.data.userInfo.mobile,
					}
					self.$props.loginShow = true
				})


				wx.login({
					success(res) {
						self.code = res.code;
					}
				})

			},

			nickNameBlur(t) {
				this.userInfo.nickName = t.detail.value
			},
			onChooseAvatar(e) {
				const {
					avatarUrl
				} = e.detail
				this.uploadFile(avatarUrl)
				this.userInfo.avatarUrl = avatarUrl
			},
			/*上传图片*/
			uploadFile: function(filePath) {
				let self = this
				let params = {
					token: uni.getStorageSync('token') ?? '',
					app_id: self.getAppId(),
				}
				uni.showLoading({
					title: self.$nw('图片上传中'),
				})
				uni.uploadFile({
					url: self.websiteUrl + '/index.php/api/file.image/upload',
					filePath: filePath,
					name: 'iFile',
					formData: params,
					success: function(res) {
						let result = typeof res.data === 'object' ? res.data : JSON.parse(res.data)
						if (Number(result.code) === 1) {
							self.userInfo.avatarUrl = result.data.file_path
						} else {
							self.$u.toast(result.msg)
						}
					},
					complete: function() {
						uni.hideLoading()
					},
					fail: res => {
						console.log(res)
					}
				})
			},
			getPhoneNumber(e) {
				let self = this
				if (e.detail.errMsg !== 'getPhoneNumber:ok') {
					return false
				}
				uni.showLoading({
					title: self.$nw('正在处理'),
					mask: true,
				})
				wx.login({
					success(res) {
						// 查询电话号码
						self._post('user.user/getMobileByCode', {
							code: res.code,
							encrypted_data: encodeURIComponent(e.detail.encryptedData),
							iv: encodeURIComponent(e.detail.iv),
						}, result => {
							self.userInfo.mobile = self.mobile = result.data.mobile
						}, false, () => {
							uni.hideLoading()
						})
					}
				})


			},
			register() {
				let self = this
				self.$refs.loginForm.validate().then(res => {
					try {
						wx.getUserProfile({
							desc: self.$nw('获取用户信息'),
							success: function(effect) {

								// 发送用户信息
								self._postJson('user.user/registerOrLogin', {
									code: self.code,
									user_info: effect.rawData,
									userInfoFrom: self.userInfo,
									encrypted_data: encodeURIComponent(effect
										.encryptedData),
									iv: encodeURIComponent(effect.iv),
									signature: effect.signature,
									referee_id: uni.getStorageSync(
										'referee_id'),
									source: 'wx',
								}, result => {
									// 记录token user_id
									uni.setStorageSync('token', result.data
										.token)
									uni.setStorageSync('user_id', result.data
										.user_id)
									// 执行回调函数
									self.loginClose()
									self.$emit("refresh", true);

								}, false, () => {
									uni.hideLoading()
								})

							},
						})
					} catch (e) {
						console.log(e)
					}
				}).catch(errors => {
					uni.$u.toast(self.$nw("请完善信息"))
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.user-header {
		position: relative;
		background: #e2231a;
	}

	.user-header .user-header-inner {
		position: relative;
		padding: 30rpx 30rpx 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;
	}

	.user-header .user-header-inner::after,
	.user-header .user-header-inner::before {
		display: block;
		content: '';
		position: absolute;
		border-radius: 50%;
		z-index: 0;
	}

	.user-header .user-header-inner::after {
		width: 400rpx;
		height: 400rpx;
		right: -100rpx;
		bottom: -200rpx;
		background-image: radial-gradient(90deg, rgba(255, 255, 255, 0.2) 10%, rgba(255, 255, 255, 0));
	}

	.user-header .user-header-inner::before {
		width: 200rpx;
		height: 200rpx;
		left: -60rpx;
		top: -20rpx;
		background-image: radial-gradient(-90deg, rgba(255, 255, 255, 0.2) 10%, rgba(255, 255, 255, 0));
	}

	.user-header .user-info {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.avatar-wrapper .user-avatar,
	.avatar-wrapper .user-avatar image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.avatar-wrapper {
		background-color: #ffffff;
	}

	.user-header .photo,
	.user-header .photo image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}

	.user-header .photo {
		border: 4rpx solid #ffffff;
	}

	.user-header .info {
		padding-left: 20rpx;
		box-sizing: border-box;
		overflow: hidden;
		color: #ffffff;
	}

	.user-header .info .name {
		font-weight: bold;
		font-size: 30rpx;
	}

	.user-header .info .tel {
		font-size: 26rpx;
	}

	.user-header .info .grade {
		display: block;
		padding: 0 16rpx;
		height: 40rpx;
		line-height: 36rpx;
		border-radius: 20rpx;
		background: rgba(0, 0, 0, 0.2);
		color: #ffc670;
	}

	.user-header .sign-box {
		position: absolute;
		right: 20rpx;
		padding: 0 10rpx;
		height: 50rpx;
		border: 1px solid #ffe300;
		border-radius: 25rpx;
		font-size: 24rpx;
		color: #ffe300;
		z-index: 10;
	}

	.user-header .sign-box .iconfont {
		color: #ffe300;
	}

	.user-header .my-order {
		position: absolute;
		padding: 0 30rpx;
		height: 240rpx;
		right: 30rpx;
		bottom: -150rpx;
		left: 30rpx;
		box-sizing: border-box;
		border-radius: 16rpx;
		box-shadow: 0 0 6rpx 0 rgba(0, 0, 0, 0.1);
		background: #ffffff;
		z-index: 10;
	}

	.my-order .item {
		display: flex;
		padding: 20rpx 0;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 26rpx;
	}

	.my-order .icon-box,
	.my-assets .icon-box {
		width: 60rpx;
		height: 60rpx;
	}

	.my-order .icon-box .iconfont,
	.my-assets .icon-box .iconfont {
		font-size: 50rpx;
		color: #333333;
	}

	.my-order .icon-box .dot {
		position: absolute;
		top: 0;
		left: 30rpx;
		height: 30rpx;
		min-width: 30rpx;
		padding: 4rpx;
		border-radius: 20rpx;
		font-size: 20rpx;
		background: #f00808;
		color: #ffffff;
	}

	.my-assets {
		margin-top: 180rpx;
		padding: 30rpx;
		background: #ffffff;
	}

	.my-wallet {
		position: relative;
		width: 200rpx;
		border-left: 1px solid #dddddd;
	}

	.my-wallet::after {
		position: absolute;
		display: block;
		content: '';
		left: 0;
		border: 8rpx solid transparent;
		border-left-color: #dddddd;
	}

	.menu-wrap {
		margin-top: 30rpx;
		background: #ffffff;
	}

	.menu-wrap .group-bd {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.menu-wrap .item {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 190rpx;
		height: 150rpx;
		font-size: 24rpx;
	}

	.menu-wrap .item.icon-dizhi1-box .icon-round {
		background-image: linear-gradient(135deg, #67b4e2 10%, #356dce 70%, #5c8fe8 90%);
	}

	.menu-wrap .item.icon-youhuiquan1-box .icon-round {
		background-image: linear-gradient(135deg, #e87ea4 10%, #ff268a 70%, #fe0d76 90%);
	}

	.menu-wrap .item.icon-youhuiquan--box .icon-round {
		background-image: linear-gradient(135deg, #ff5a30 10%, #ff2b3c 70%, #ff1740 90%);
	}

	.menu-wrap .item.icon-fenxiao1-box .icon-round {
		background-image: linear-gradient(135deg, #7ceeba 10%, #1ed2b7 70%, #17c0ad 90%);
	}

	.menu-wrap .item.icon-kanjia-box .icon-round {
		background-image: linear-gradient(135deg, #f2a904 10%, #f27d04 70%, #eaa031 90%);
	}

	.menu-wrap .icon-round {
		width: 60rpx;
		height: 60rpx;
		background: red;
		border-radius: 50%;
		color: #ffffff;
	}

	.menu-wrap .item .iconfont {
		font-size: 40rpx;
		color: #ffffff;
	}

	.menu-wrap .item .name {
		margin-top: 10rpx;
	}

	.friend {
		margin-top: 30rpx;
		background: #ffffff;
	}

	.friend .text {
		margin-top: 22rpx;
		margin-left: 30rpx;
		font-size: 32rpx;
	}

	.friend .img {
		margin-top: 12rpx;
		margin-left: 30rpx;
		width: 690rpx;
		height: 220rpx;
		background: #000000;
	}
</style>
