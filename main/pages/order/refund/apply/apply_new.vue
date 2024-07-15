<template>
	<view class="refund-apply-wrap" :style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'">
		<form @submit="formSubmit" @reset="formReset">
			<view class="goods-info flex-c">
				<view class="goods-img">
					<image v-if="product.image && product.image.file_path" :src="product.image.file_path"
						mode="aspectFill"></image>
				</view>
				<view class="goods-text">
					<view class="title">
						{{product.product_name || '--'}}
					</view>
					<view class="tags flex-c">
						<!-- <view class="tag">
							迎客松造型
						</view> -->
						<view class="num">
							×{{product.total_num || 0}}
						</view>
					</view>
					<view class="price">
						￥{{ product.line_price }}
					</view>
				</view>
			</view>

			<view class="apply-form">
				<view class="form-item flex-c">
					<view class="form-label">
						申请类型
					</view>
					<view class="form-inp">
						<picker class="form-picker" @change="typeChange" :value="type_index" :range="typeList"
							range-key="label">
							<view class="picker-value"
								:class="{'empty' : !typeList[type_index] || !typeList[type_index].label}">
								{{typeList[type_index] && typeList[type_index].label || '点击选择申请类型'}}
							</view>
						</picker>
					</view>
					<!-- <view class="form-inp" :class="{'empty' : !typeList[type_index] || !typeList[type_index].label}"
						@click="openSelect(0)">
						{{typeList[type_index] && typeList[type_index].label || '点击选择申请类型'}}
					</view> -->
					<u-icon class="u-icon" name="arrow-right" size="28" color="#999"></u-icon>
				</view>
				<view class="form-item flex-c">
					<view class="form-label">
						申请原因
					</view>
					<view class="form-inp">
						<picker class="form-picker" @change="reasonChange" :value="reason_index" :range="reasonList"
							range-key="label">
							<view class="picker-value"
								:class="{'empty' : !reasonList[reason_index] || !reasonList[reason_index].label}">
								{{reasonList[reason_index] && reasonList[reason_index].label || '点击选择申请原因'}}
							</view>
						</picker>
					</view>
					<!-- <view class="form-inp"
						:class="{'empty' : !reasonList[reason_index] || !reasonList[reason_index].label}"
						@click="openSelect(1)">
						{{reasonList[reason_index] && reasonList[reason_index].label || '点击选择申请原因'}}
					</view> -->
					<u-icon class="u-icon" name="arrow-right" size="28" color="#999"></u-icon>
				</view>
				<view class="form-item flex-c">
					<view class="form-label">
						商品数量
					</view>
					<view class="num-control flex-c">
						<view class="btn">
							-
						</view>
						<view class="num">
							1
						</view>
						<view class="btn">
							+
						</view>
					</view>
				</view>
			</view>
		</form>
		<view class="apply-btn">
			提交申请
		</view>

		<!-- <u-popup class="diy-select-popup" v-model="showPopup" mode="bottom" :mask-close-able="false"
			@close="showPopup = false">
			<view class="popup-content">
				<view class="popup-title">
					申请原因
					<view class="close-btn">
						<i class="iconfont icon-guanbi"></i>
					</view>
				</view>
				<view v-if="popup_type == 0" class="select-list">
					<view class="select-item" v-for="(item,index) in typeList" :key="index"
						:class="{'active' : type_index == index}" @click="popupSelect(index)">
						{{item.label}}
					</view>
				</view>
				<view v-if="popup_type == 1" class="select-list">
					<view class="select-item" v-for="(item,index) in reasonList" :key="index"
						:class="{'active' : reason_index == index}" @click="popupSelect(index)">
						{{item.label}}
					</view>
				</view>
				<view class="select-btn" @click="showPopup = false">
					确定
				</view>
			</view>
		</u-popup> -->
	</view>
</template>

<script>
	import Upload from '@/components/upload/upload.vue';

	export default {
		components: {
			Upload
		},
		data() {
			return {
				showPopup: false,
				scrollviewHigh: 0,
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				type: 10,
				/*是否打开上传图片*/
				isUpload: false,
				/*订单商品id*/
				order_product_id: 0,
				/*订单商品*/
				product: {},
				images: [],
				/*小程序订阅消息*/
				temlIds: [],
				type_index: null,
				typeList: [{
					label: '未收货退款',
					id: 1
				}, {
					label: '退款退货',
					id: 1
				}, {
					label: '换货补发',
					id: 1
				}, {
					label: '仅退款',
					id: 1
				}],
				reasonList: [{
					label: '不想要了',
					id: 1
				}, {
					label: '不喜欢、效果不好',
					id: 1
				}, {
					label: '材质与商品描述不符',
					id: 1
				}, {
					label: '大小尺寸与商品描述不符',
					id: 1
				}, {
					label: '颜色、款式、型号与商品描述不符',
					id: 1
				}, {
					label: '收到商品少件（包括配件）',
					id: 1
				}, {
					label: '质量问题',
					id: 1
				}, {
					label: '做工粗糙、有瑕疵',
					id: 1
				}, {
					label: '商品破损',
					id: 1
				}, {
					label: '空包裹',
					id: 1
				}, {
					label: '其他',
					id: 1
				}, ],
				reason_index: null,
				popup_type: 0
			}
		},
		onLoad(e) {
			let _this = this
			_this.order_product_id = e.order_product_id;
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
		},
		onShow() {
			this.setGlobalColor()
			/*获取订单详情*/
			this.getData();
		},
		mounted() {
			/*获取订单详情*/
			this.getData();
		},
		computed: {
			active() {
				return Object.assign(this.setBackgroundColor(), this.setColor())
			},
		},
		methods: {
			openSelect(e) {
				this.popup_type = e
				this.showPopup = true
			},
			popupSelect(index) {
				if (this.popup_type == 0) {
					this.type_index = index
				} else {
					this.reason_index = index
				}
			},
			typeChange(e) {
				this.type_index = e.detail.value
			},
			reasonChange(e) {
				this.reason_index = e.detail.value
			},
			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				let order_product_id = self.order_product_id;
				self._get('user.refund/apply', {
					order_product_id: order_product_id,
					platform: self.getPlatform()
				}, function(res) {
					self.product = res.data.detail;
					self.temlIds = res.data.template_arr;
					if (self.product.orderM.delivery_type.value == 30) {
						self.type = 30;
					}
					uni.hideLoading();
				});
			},
			/*切换服务类型*/
			tabType(e) {
				this.type = e;
			},

			/*提交表单*/
			formSubmit: function(e) {
				let self = this;
				var formdata = e.detail.value;
				formdata.type = self.type;
				formdata.order_product_id = self.order_product_id;
				formdata.images = JSON.stringify(self.images);
				let callback = function() {
					uni.showLoading({
						title: self.$nw("正在提交"),
						mask: true
					});
					self._post('user.refund/apply', formdata, function(res) {
						uni.hideLoading();
						uni.showToast({
							title: res.msg,
							duration: 3000,
							complete: function() {
								uni.navigateTo({
									url: '/main/pages/order/refund/index/index',
								});
							}
						});
					});
				}
				self.subMessage(self.temlIds, callback);
			},

			/*删除图片*/
			deleteFunc(e) {
				this.images.splice(e, 1);
			},
			/*组件方式打开上传图片, 取消选择后没有对应操作，导致无法再次打开选择 */
			/*改非组件方式 打开相机或者相册，选择图片*/
			chooseImageFunc() {
				let self = this;

				uni.chooseImage({
					count: 9, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album'], //从相册选择
					success: function(res) {
						//console.log(JSON.stringify(res.tempFilePaths));
						//let imgs=JSON.stringify(res.tempFilePaths);
						self.uploadFile(res.tempFilePaths);
					},
					fail: function(res) {
						self.$emit('getImgs', null);
					}
				});
			},

			/*上传图片*/
			uploadFile: function(tempList) {
				let self = this;
				let params = {
					token: uni.getStorageSync('token'),
					app_id: self.getAppId()
				};
				uni.showLoading({
					title: self.$nw("图片上传中")
				});
				console.log('tempList', tempList)
				tempList.forEach(function(filePath, fileKey) {
					console.log('filePath', filePath)
					uni.uploadFile({
						url: self.websiteUrl + '/index.php?s=/api/file.upload/image',
						filePath: filePath,
						name: 'iFile',
						formData: params,
						success: function(res) {
							let result = typeof res.data === 'object' ? res.data : JSON.parse(res
								.data);
							if (result.code === 1) {
								self.images.push(result.data);
								uni.hideLoading();
							}
						}
					});
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.refund-apply-wrap {
		position: relative;

		.goods-info {
			padding: 24rpx 24rpx;
			align-items: flex-start;
			background: #fff;

			.goods-img {
				width: 176rpx;
				height: 176rpx;
				border-radius: 8rpx;
				overflow: hidden;
				background: #eee;
			}

			.goods-text {
				flex: 1;
				margin-left: 16rpx;

				.title {
					font-weight: 500;
					color: #333;
					line-height: 40rpx;
				}

				.tags {
					margin-top: 8rpx;

					.tag,
					.num {
						font-size: 24rpx;
						color: #999;
					}

					.num {
						margin-left: auto;
					}
				}

				.price {
					text-align: right;
					font-weight: 500;
					color: #F31111;
					margin-top: 4rpx;
				}
			}
		}

		.apply-form {
			margin-top: 16rpx;
			background: #fff;
			padding: 0 24rpx;

			.form-item {
				padding: 24rpx 0;
				border-bottom: 1rpx solid #e8e8e8;

				.form-label {
					color: #666;
				}

				.form-inp {
					flex: 1;
					margin-left: 40rpx;
					// color: #333;

					// &.empty {
					// 	color: #999;
					// }

					.picker-value {
						color: #333;

						&.empty {
							color: #999;
						}
					}
				}

				.num-control {
					margin-left: auto;

					.btn {
						width: 32rpx;
						height: 32rpx;
						background: #F5F7FA;
						border-radius: 4px;
						display: flex;
						align-items: center;
						justify-content: center;
						color: #666;
						font-size: 30rpx;
					}

					.num {
						margin: 0 16rpx;
					}
				}

				&:last-of-type {
					border: none;
				}
			}
		}

		.apply-btn {
			width: calc(100vw - 48rpx);
			height: 80rpx;
			background: #1B94E0;
			border-radius: 8rpx;
			font-weight: 500;
			color: #fff;
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: calc(100rpx + env(safe-area-inset-bottom) / 2);
		}
	}
</style>