<template>
	<view class="address-form">
		<form>
			<view class="bg-white p-0-30 f30">
				<!--#ifndef MP-WEIXIN-->
				<view class="d-b-c p-30-0 border-b" @click="chooseWxImageShop">
					<text class="key-name">{{$nw("头像")}}</text>
					<view class="d-e-c">
						<image v-if="userInfo.avatarUrl" mode="aspectFit" :src="userInfo.avatarUrl"></image>
						<image v-else src="https://shanghui.client.xcx008.com/file/images/avatar.png" mode="aspectFill"></image>
					</view>
					
				</view>
				<view style="color: #b8b8b8;font-size: 26rpx;">
					{{$nw("头像尺寸大小推荐宽度在1500像素以内，高度在1800像素以内")}}
				</view>
				<!--#endif-->
				<!--#ifdef MP-WEIXIN-->
				<view class="d-b-c p-30-0 border-b">
					<text class="key-name">{{$nw("头像")}}</text>
					<button class="avatar-wrapper" open-type="chooseAvatar" 
					@chooseavatar="onChooseAvatar"
						style="display: flex;justify-content: flex-end;">
						<view class="user-avatar">
							<image v-if="userInfo.avatarUrl" :src="userInfo.avatarUrl" mode="aspectFill"></image>
							<image v-else src="https://shanghui.client.xcx008.com/file/images/avatar.png" mode="aspectFill"></image>
						</view>
					</button>
	
				</view>
				<view style="color: #b8b8b8;font-size: 26rpx;">
					{{$nw("头像尺寸大小推荐宽度在1500像素以内，高度在1800像素以内")}}
				</view>
				<!--#endif-->
				<view class="d-b-c p-30-0 border-b" @click="gotoUserName">
					<text class="key-name">{{$nw("昵称")}}</text>
					<view class="d-e-c">
						<text class="mr20">{{userInfo.nickName}}</text>
						<text class="iconfont icon-jiantou"></text>
					</view>
				</view>
				
				<view class="d-b-c p-30-0 border-b" @click="gotoCompany">
					<text class="key-name">{{$nw("公司名称")}}</text>
					<view class="d-e-c">
						<text class="mr20">{{userInfo.company_name}}</text>
						<text class="iconfont icon-jiantou"></text>
					</view>
				</view>
				
				<view class="d-b-c p-30-0 border-b" @click="gotoPost">
					<text class="key-name">{{$nw("职位")}}</text>
					<view class="d-e-c">
						<text class="mr20">{{userInfo.post}}</text>
						<text class="iconfont icon-jiantou"></text>
					</view>
				</view>
	
				
				<view class="d-b-c p-30-0 border-b">
					<text class="key-name">{{$nw("性别")}}</text>
					<view class="d-e-c">
						<view class="log2">
							<picker style="color:#9f9f9f;" mode="selector" @change="bindPickerChange" :value="index"
								:range="array">
								{{array[index]}}
							</picker>
						</view>
							</view>
				</view>
				<view class="d-b-c p-30-0 border-b">
					<text class="key-name">{{$nw("生日")}}</text>
					<view class="d-e-c">
						<picker mode="date" :value="userInfo.birthday" :start="startDate" 
						:end="endDate" @change="bindDateChange">
							<view style="color: grey;" class="mr20">{{userInfo.birthday}}</view>
						</picker>
						<!-- <text class="mr20">{{userInfo.birthday == null ? '' : userInfo.birthday}}</text> -->
					</view>
				</view>
				<view class="d-b-c p-30-0 border-b">
					<text class="key-name">{{$nw("手机号")}}</text>
					<view class="d-e-c">
						<!-- <input class="uni-input" type="number" :placeholder="phone" style="margin-right: -130rpx;" v-model="phone"/> -->
						<text class="mr20">{{userInfo.mobile}}</text>
					</view>
					<!-- <view class="d-e-c" v-if="!phone" @click="gotoBind">
						<text class="mr20">未绑定</text>
						<text class="iconfont icon-jiantou"></text>
					</view> -->
				</view>
				<view class="d-b-c p-30-0 border-b" @click="gotoUserPwd">
					<text class="key-name">{{$nw("密码")}}</text>
					<view class="d-e-c">
						<text class="iconfont icon-jiantou"></text>
					</view>
				</view>
				<!-- <view class="d-b-c p-30-0" @click="gotoAbout">
					<text class="key-name">{{$nw("关于")}}</text>
					<view class="d-e-c">
						<text class="iconfont icon-jiantou"></text>
					</view>
				</view> -->
			</view>
			<view class="btns p30"><button type="default" @click="LoginOut">{{$nw("退出登录")}}</button></view>
		</form>
		<service :itemData="t_service"></service>
	
	</view>
</template>

<script>
	import service from '@/components/diy/service/service';

	export default {
		components:{
			service,
		
		},
		data() {
			const currentDate = this.getDate({
				format: true
			})
			
			return {
					t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				userInfo: {
					birthday:currentDate
				},
				array: [this.$nw("女"), this.$nw("男")],
				index: 0,
				currentDatea:this.getDate({
				format: true
			})
			}

		},
		 computed: {
		        startDate() {
		            return this.getDate('start');
		        },
		        endDate() {
		            return this.getDate('end');
		        }
		    },

		onShow() {
			this.setGlobalColor()
			this.getData();
			uni.setNavigationBarTitle({
				title: this.$nw("个人资料")
			});
		},
		methods: {
			bindDateChange: function(e) {
				let self = this;
				console.log(e.detail.value)
				self.userInfo.birthday = e.detail.value
				self._post('user.user/setUserBirthday', {
					value: e.detail.value
				}, function(res) {
					uni.showToast({
						title: res.msg,
						icon: 'success',
						duration: 2000
					});
					uni.hideLoading();
				});
			},
			getDate(type) {
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year;
				}
				month = month > 9 ? month : '0' + month;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			bindPickerChange(e) {
				var self = this;
				self.index = e.detail.value
				self._post('user.user/setUserGender', {
					value: e.detail.value
				}, function(res) {
					uni.showToast({
						title: res.msg,
						icon: 'success',
						duration: 2000
					});
					 uni.hideLoading();
				});
			},
			gotoUserName() {
				let user_name = this.userInfo.nickName
				uni.navigateTo({
					url: '/user/pages/user/info?data=' + user_name + '&type=1'
				});
			},
			gotoPost() {
				let user_name = this.userInfo.post
				uni.navigateTo({
					url: '/user/pages/user/info?data=' + user_name + '&type=4'
				});
			},
			gotoCompany() {
				let user_name = this.userInfo.company_name
				uni.navigateTo({
					url: '/user/pages/user/info?data=' + user_name + '&type=3'
				});
			},
			gotoUserPwd() {
				uni.navigateTo({
					url: '/user/pages/user/info?type=2'
				});
			},
			gotoAbout() {
				uni.navigateTo({
					url: '/user/pages/user/about'
				})
			},
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				self._get('user.index/detail', {}, function(res) {

					self.userInfo = res.data.userInfo;
					self.index = res.data.userInfo.gender
					
					self.userInfo.post = self.userInfo.post?self.userInfo.post:"";
					self.userInfo.company_name = self.userInfo.company_name?self.userInfo.company_name:"";
					if(!res.data.userInfo.birthday){
						res.data.userInfo.birthday = self.currentDatea;
					}
					uni.hideLoading();
				});
			},
			// h5退出登录
			LoginOut() {
				uni.setStorageSync('token', '');
				uni.setStorageSync('user_id', '');
				uni.reLaunch({
					url: '/user/pages/index/index'
				});
			},
			/* 图片上传 */
			chooseWxImageShop() {
				let self = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						self.uploadFile(res.tempFilePaths[0], function(data) {
							if (data.file_path) {
								self.updateUserAvatar(data.file_path)
							}
						})
					},
					fail: function(t) {
						console.log(t)
						uni.hideLoading()
					},
				})
			},
			onChooseAvatar(e) {
				console.log('onChooseAvatar',e);
				let self = this
				const {
					avatarUrl
				} = e.detail
				this.uploadFile(avatarUrl, function(data) {
					if (data.file_path) {
						self.updateUserAvatar(data.file_path)
					}
				})

			},
			updateUserAvatar(filePath) {
				let self = this
				self._postJson('user.user/updateUserAvatar', {
					avatarUrl: filePath
				}, function(res) {
					if (Number(res.code) === 1) {
						self.userInfo.avatarUrl = filePath
						uni.reLaunch({
							url: "/user/pages/index/index"
						})
					} else {
						self.$u.toast(res.msg)
					}
				}, function(e) {
					console.log(e)
				})
			},
			/*上传图片*/
			uploadFile: function(filePath, callback) {
				let self = this
				let params = {
					token: uni.getStorageSync('token') ?? '',
					app_id: self.getAppId(),
					utype:"avatar"
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
						callback(result.data)
						if (Number(result.code) !== 1) {
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
		}
	};
</script>

<style lang="scss" scoped>
	.address-form .key-name {
		width: 200rpx;
	}

	.address-form .btn-red {
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		box-shadow: 0 8rpx 16rpx 0 rgba(226, 35, 26, .6);
	}

	.save_btn {
		width: 100%;
		height: 45px;
		line-height: 45px;
		-webkit-border-radius: 0;
		border-radius: 0;
		position: fixed;
		bottom: 0;
		display: flex;
		-webkit-box-pack: end;
		justify-content: center;
		align-items: center;
	}

	.d-e-c image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 55rpx;
	}

	.mr20 {
		color: #C5C5C5;
	}

	.p30 {
		margin-top: 100rpx;
	}

	.btns button {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 34rpx;
		border-radius: 45rpx;
		background: #e4dddd;
		color: #ffffff;
	}

	.avatar-wrapper .user-avatar,
	.avatar-wrapper .user-avatar image {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
	}

	.avatar-wrapper {
		background-color: #ffffff;
	}
</style>