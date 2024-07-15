<template>
	<scroll-view scroll-y="true" class="authentication-idcard scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50">
		<view v-if="!status" class="authentication-idcard-content">
			<view class="upload-box flex-c">
				<view class="upload-item">
					<view class="upload-card" @click="chooseImage(1)">
						<view class="upload-icon">
							<i class="iconfont xiangji_camera"></i>
						</view>
						<image v-if="params.front_img" class="common-img" :src="params.front_img" mode="aspectFill">
						</image>
					</view>
					<view class="upload-label">
						身份证人像面
					</view>
				</view>
				<view class="upload-item">
					<view class="upload-card back" @click="chooseImage(2)">
						<view class="upload-icon">
							<i class="iconfont xiangji_camera"></i>
						</view>
						<image v-if="params.rear_img" class="common-img" :src="params.rear_img" mode="aspectFill">
						</image>
					</view>
					<view class="upload-label">
						身份证国徽面
					</view>
				</view>
			</view>

			<view class="idcard-form">
				<view class="form-tips">
					请确认您的个人信息，如有误请修改
				</view>
				<view class="form-list">
					<view class="form-item flex-c">
						<view class="label">
							真实姓名
						</view>
						<view class="inp">
							<input class="inp-content" type="text" v-model="params.id_card_name" placeholder="请输入真实姓名"
								placeholder-style="color:#999;font-weight:400;" />
						</view>
					</view>
					<view class="form-item flex-c">
						<view class="label">
							身份证号码
						</view>
						<view class="inp">
							<input class="inp-content" type="text" v-model="params.id_card" placeholder="请输入身份证号码"
								placeholder-style="color:#999;font-weight:400;" />
						</view>
					</view>
				</view>
			</view>

			<view class="authentication-btn flex-c" @click="submitHandle">
				提交
			</view>
		</view>

		<!-- 认证成功/失败 -->
		<view v-else class="authentication-idcard-content">
			<view class="idcard-status flex">
				<view class="status-img">
					<image class="common-img"
						:src="status == 1 ? 'https://shanghui.client.xcx008.com/file/uploads/20240625/12c1de8d912b66b4a23490cd2d62374d.png' : 'https://shanghui.client.xcx008.com/file/uploads/20240625/80c95f585e5b2d25a7d6349d31c89e19.png'"
						mode="aspectFill"></image>
				</view>
				<view class="status-text">
					{{status == 1 ? '恭喜您，个人实名认证成功' : '实名认证失败'}}
				</view>
				<view class="status-tips">
					{{status == 1 ? '您提交的认证资料已通过审核' : '您的身份证已失效或过期'}}
				</view>
			</view>
			<view class="authentication-btn flex-c">
				{{status == 1 ? '确认' : '重新认证'}}
			</view>
		</view>

	</scroll-view>
</template>

<script>
	import {
		setTimeout
	} from 'timers';
	import UploadFile from '@/components/UploadFile.vue';
	export default {
		components: {
			UploadFile
		},
		data() {
			return {
				loadding: false,
				scrollviewHigh: 0, //滚动区域高度
				params: {
					front_img: '',
					rear_img: '',
					id_card_name: '',
					id_card: '',
					app_id: '10016'
				},
				status: 0,
			}
		},
		onLoad() {
			let _this = this
			// 设置全局颜色
			_this.setGlobalColor({
				bgc: '#fff'
			})
			uni.setNavigationBarTitle({
				title: _this.$nw('身份认证'),
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			this.params.token = uni.getStorageSync('token')
		},

		onShow() {},

		methods: {
			chooseImage(type) {
				let _this = this
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album', 'camera'],
					success: async (res) => {
						this.loading = true;
						uni.showLoading({
							title: this.$nw("上传中"),
							mask: true
						});
						console.log('chooseImage res', res);
						const filePath = res.tempFilePaths[0];
						uni.uploadFile({
							url: _this.websiteUrl + 'index.php/api/user.user/idcardIdentify',
							filePath,
							name:'file',
							header: {
								"authorization": this.params.token,
							},
							formData: {
								type,
								app_id: '10016',
								token: this.params.token
							},
							success: (uploadFileRes) => {
								console.log('上传成功', uploadFileRes)
								const data = JSON.parse(uploadFileRes.data)
								console.log('data', data);
								if (data.code != 200) {
									this.tip(data.message || data.msg || '上传失败，请稍后再试', 2000)
									this.loading = false;
									uni.hideLoading()
									return
								}
								if (type == 1) {
									this.params.front_img = data.data.path || null
									this.params.id_card_name = data.data.name || ''
									this.params.id_card = data.data.num || ''
								} else {
									this.params.rear_img = data.data.path || null
								}
								setTimeout(() => {
									this.loading = false;
									uni.hideLoading()
								}, 300)
							},
							fail: (uploadFileErr) => {
								console.log('上传失败', uploadFileErr)
								this.tip('上传失败，请稍后再试', 2000)
								this.loading = false;
								uni.hideLoading()
							}
						})
					},
					fail: (err) => {
						console.error('选择图片失败：', err);
						this.loading = false;
						uni.hideLoading()
					}
				});
			},
			submitHandle() {
				if (this.loading) return
				console.log('params--->', this.params);
				if (!this.params.front_img) {
					this.tip(this.$nw("请上传身份证人像面"), 2000)
					return
				}
				if (!this.params.rear_img) {
					this.tip(this.$nw("请上传身份证国徽面"), 2000)
					return
				}
				if (!this.params.id_card_name) {
					this.tip(this.$nw("请输入真实姓名"), 2000)
					return
				}
				if (!this.params.id_card) {
					this.tip(this.$nw("请输入身份证号码"), 2000)
					return
				}
				this.loading = true;
				uni.showLoading({
					title: this.$nw("正在提交"),
					mask: true
				});
				this._post('user.user/saveCertification', this.params, (res) => {
					if (res.code == 200) {
						this.loading = false;
						uni.hideLoading()
						this.tip('认证成功', 2000)
						setTimeout(() => {
							uni.navigateBack()
						}, 1000)
					} else {
						this.loading = false;
						uni.hideLoading()
						this.tip(res.message || res.msg || '请求失败，请稍后再试', 2000)
					}
				}, (err) => {
					this.loading = false;
					uni.hideLoading()
				})
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
			},
		},
	}
</script>

<style lang="scss" scoped>
	.authentication-idcard {
		background: #fff;
		position: relative;

		.authentication-idcard-content {
			min-height: 100%;
			position: relative;
			padding: 32rpx 24rpx;
			position: relative;

			.upload-box {
				justify-content: center;

				.upload-item {
					.upload-card {
						width: 268rpx;
						height: 168rpx;
						border-radius: 8rpx;
						overflow: hidden;
						position: relative;
						background: url('https://shanghui.client.xcx008.com/file/uploads/20240625/6e341e1346816e7a90c8d5b7dec93b0e.png') no-repeat;
						background-size: 100% 100%;
						background-position: center;

						&.back {
							background-image: url('https://shanghui.client.xcx008.com/file/uploads/20240625/7b8cdd05f0ae4ba43d9e737ff837e155.png');
						}

						.upload-icon {
							position: absolute;
							z-index: 0;
							width: 64rpx;
							height: 64rpx;
							border-radius: 50%;
							background: rgba(0, 0, 0, 0.35);
							top: 50%;
							left: 50%;
							transform: translate(-50%, -50%);
							display: flex;
							align-items: center;
							justify-content: center;

							.iconfont {
								font-size: 40rpx;
								color: #fff;
							}
						}

						.common-img {
							position: relative;
							z-index: 1;
						}

						/deep/.u-upload {
							position: relative;

							.u-list-item {
								width: 268rpx !important;
								height: 168rpx !important;
								margin: 0;
								background: none;

								.u-icon,
								.u-add-tips {
									opacity: 0;
								}

								.u-delete-icon {
									.u-icon {
										opacity: 1;
									}
								}
							}
						}
					}

					.upload-label {
						text-align: center;
						font-size: 24rpx;
						line-height: 34rpx;
						margin-top: 24rpx;
					}

					&:last-of-type {
						margin-left: 70rpx;
					}
				}
			}

			.idcard-form {
				margin-top: 64rpx;

				.form-tips {
					font-size: 20rpx;
					color: #999;
					line-height: 28rpx;
				}

				.form-list {
					margin-top: 32rpx;

					.form-item {
						justify-content: space-between;
						margin-bottom: 24rpx;

						.label {
							color: #666;
						}

						.inp {
							.inp-content {
								text-align: right;
								font-size: 28rpx;
								font-weight: 500;
							}
						}
					}
				}
			}

			.idcard-status {
				flex-direction: column;
				margin-top: 144rpx;
				align-items: center;

				.status-img {
					width: 424rpx;
					height: 264rpx;
				}

				.status-text {
					font-size: 32rpx;
					line-height: 44rpx;
					margin-top: 64rpx;
				}

				.status-tips {
					font-size: 20rpx;
					line-height: 28rpx;
					margin-top: 16rpx;
					color: #999;
				}
			}




			.authentication-btn {
				width: 702rpx;
				height: 80rpx;
				background: #1B94E0;
				justify-content: center;
				border-radius: 8rpx;
				font-weight: 500;
				color: #fff;
				position: absolute;
				bottom: calc(50rpx + env(safe-area-inset-bottom) / 2);
			}
		}
	}
</style>