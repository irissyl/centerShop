<template>
	<view class="content">

		<view class="redit">

			<view class="redit10">
				<textarea name="" placeholder-class="redit10_textarea" :placeholder="$nw('动态标题')" v-model="name"
					maxlength="40">

				</textarea>
			</view>

			<view class="redit1">
				<textarea name="" placeholder-class="redit1_textarea" :placeholder="$nw('说点什么...')" v-model="context"
					id="" cols="30" rows="10" maxlength="300">

				</textarea>
			</view>
			<!-- 选择的封面和图片 -->
			<view class="cover_img">
				<view class="cover_img_1" v-for="(item,index) in coverimgs" :key="index">
					<image class="cover_img_2" :src="item.file_path" mode=""></image>

					<image @click="cha(index)" class="cover_img_1_1" src="/static/cha.png"></image>

					<view class="choose_cover" v-if="index == 0">
						{{$nw("封面")}}
					</view>
				</view>
				<view class="cover_img_1" @click="add" v-if="coverimgs.length < coverimgs_limit">
					<image class="plus" src="@/static/jia_upload.png" mode=""></image>
				</view>
			</view>

			<view class="" style="height: 200rpx;width: 100%;">

			</view>

			<view class="rel_dyna" @click="rel_dyna"
				:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}">
				{{$nw("发布动态")}}
			</view>

		</view>
		<service :itemData="t_service"></service>

	</view>
</template>

<script>
	const app = getApp()
	import service from '@/components/diy/service/service';

	export default {
		components: {
			service,



		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				height: "",
				name: "", //动态内容名称
				context: "", //发布动态内容
				coverimgs: [],
				coverimgs_limit: 10,

			}
		},
		computed: {
			getbutton() {
				return this.setButton().button
			}
		},
		onLoad() {
			var self = this;
			uni.getSystemInfo({
				success(res) {
					self.height = res.windowHeight - app.globalData.customBar;
				}
			})
			this.setGlobalColor()

		},
		methods: {
			itemClick(item) {
				console.log(item)
			},
			cha(index) { //删除选择图片
				if (index > -1) {
					this.coverimgs.splice(index, 1);
				}
			},
			rel_dyna() { //发布动态
				var self = this;
				console.log(self.coverimgs)
				console.log(self.context)
				console.log(self.name)
				if (self.coverimgs.length <= 0) {
					uni.showToast({
						title: self.$nw("请至少上传一张图片"),
						icon: "none"
					})
					return;
				}
				if (self.name.length <= 0) {
					uni.showToast({
						title: self.$nw("标题不能为空哦"),
						icon: "none"
					})
					return;
				}
				//先上传图片

				var promiseA = new Promise(function(resolveA, rejectA) {

					uni.showLoading({
						title: self.$nw('发布中...'),
					})
					var coverimgs_arr = [];
					var coverimgs = self.coverimgs;
					for (var i = 0; i < coverimgs.length; i++) {
						var promise = new Promise(function(resolve, reject) {
							let params = {
								token: uni.getStorageSync('token') ?? '',
								app_id: self.getAppId(),
							}
							uni.uploadFile({
								url: self.websiteUrl + '/index.php/api/file.image/upload',
								filePath: coverimgs[i].file_path,
								name: 'iFile',
								formData: params,
								success: function(res) {
									let result = typeof res.data === 'object' ? res.data : JSON
										.parse(res.data)
									if (result.data.file_path) {
										coverimgs_arr.push({
											"file_path": result.data.file_path,
											'file_id': 0
										})
										resolve(coverimgs_arr);
									} else {
										self.$u.toast(result.msg)
									}
								}
							})

						});
						promise.then(function(coverimgs, ind) {
							if (coverimgs.length == self.coverimgs.length) {
								resolveA(coverimgs);
							}
						})
					}

				});

				promiseA.then(function(coverimgs_arr) {
					var cover_image = coverimgs_arr[0].file_path
					var new_arr = [];
					//去除第一张
					for (var i = 0; i < coverimgs_arr.length; i++) {
						new_arr.push(coverimgs_arr[i]);
					}
					self._get('plus.dynamic.Dynamic/relDynamic', {
						coverimgs: JSON.stringify(new_arr),
						name: self.name,
						content: self.context,
						cover_image: cover_image
					}, function(res) {
						console.log(res);

						uni.showToast({
							title: self.$nw('发布成功'),
							icon: "none"
						})
						setTimeout(function() {
							uni.hideLoading()
							uni.navigateBack()
						}, 1500)

					});
				}, function(error) {
					// failure
				});




			},

			add() { //添加图片
				var self = this;
				uni.chooseImage({
					count: 10, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						console.log(res.tempFilePaths)
						for (var i = 0; i < res.tempFilePaths.length; i++) {
							if (self.coverimgs.length < 10) {
								self.coverimgs.push({
									file_id: 0,
									file_path: res.tempFilePaths[i]
								})
							}

						}
					},
					fail: function(t) {
						console.log(t)
						uni.hideLoading()
					},
				})


			}
		}
	}
</script>

<style lang="scss">
	page {

		background: #f5f5f5;
	}

	.redit {
		width: 100%;
		// height: 500rpx;
		background: #fff;
		padding-top: 20rpx;

		/* 选择的封面和图片 */
		.cover_img {
			width: 90%;
			margin: auto;

			.cover_img_1 {
				display: -webkit-inline-box;
				position: relative;
				width: 215.9rpx;
				height: 220rpx;
				margin-right: 10rpx;
				margin-bottom: 10rpx;

				.plus {
					width: 215.9rpx;
					height: 220rpx;
					border-radius: 16rpx;
				}

				.cover_img_2 {
					width: 215.9rpx;
					height: 220rpx;
					border-radius: 16rpx;


				}

				.cover_img_1_1 {
					width: 34rpx;
					height: 34rpx;
					right: 10rpx;
					top: 10rpx;
					position: absolute;
					color: #fff;
				}

				.choose_cover {
					width: 100%;
					height: 50rpx;
					position: absolute;
					bottom: 0rpx;
					left: 0rpx;
					background: rgba(0, 0, 0, 0.4);
					color: #fff;
					text-align: center;
					line-height: 50rpx;
					font-size: 24rpx;
					font-family: PingFang SC-Medium, PingFang SC;
					font-weight: 500;
					color: #FFFFFF;
					border-bottom-left-radius: 16rpx;
					border-bottom-right-radius: 16rpx;
				}
			}
		}

		.redit10 {
			background: #EDEEF0;
			width: 90%;
			margin: auto;

			height: 130rpx;
			background: #EDEEF0;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			opacity: 1;
			position: relative;
			margin-bottom: 24rpx;

			textarea {
				width: 94%;
				padding: 20rpx;
				height: 80rpx;
			}

			.redit10_textarea {
				font-size: 28rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #666666;
			}
		}

		.redit1 {
			background: #EDEEF0;
			width: 90%;
			margin: auto;

			height: 230rpx;
			background: #EDEEF0;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			opacity: 1;
			position: relative;
			margin-bottom: 24rpx;

			textarea {
				width: 94%;
				padding: 20rpx;
				height: 190rpx;
			}

			.redit1_textarea {
				font-size: 28rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #666666;
			}

			.redit2 {
				font-size: 28rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				position: absolute;
				left: 20rpx;
				bottom: 30rpx;
			}

			.redit3 {
				font-size: 28rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #333333;
				position: absolute;
				left: 140rpx;
				bottom: 30rpx;
			}
		}
	}

	.rel_dyna {
		width: 95%;
		margin: auto;
		height: 80rpx;
		border-radius: 50rpx;
		position: fixed;
		bottom: 30rpx;
		left: 2.5%;
		text-align: center;
		line-height: 80rpx;

	}
</style>