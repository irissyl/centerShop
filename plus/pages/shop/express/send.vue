<template>
	<scroll-view scroll-y="true" class="edit-bankcard scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50">
		<view class="edit-bankcard-content">
			<view class="edit-form">
				<view class="form-item flex-c">
					<view class="label">
						快递公司
					</view>
					<picker class="bank-picker" @change="expressChange" :value="express_index" :range="expressList"
						range-key="label">
						<view class="picker-value text-ellipsis"
							:class="{'active' : expressList[express_index] && expressList[express_index].label}">
							{{expressList[express_index] && expressList[express_index].label || '请选择'}}
						</view>
					</picker>
					<i class="iconfont icon-jiantou"></i>
				</view>

				<view class="form-item flex-c has-border">
					<view class="label">
						快递单号
					</view>
					<view class="form-value">
						<input class="form-inp" type="text" v-model="params.express_no" placeholder="请输入快递单号"
							placeholder-style="color:#999;font-weight:400;" />
					</view>
				</view>
			</view>

			<view class="authentication-btn flex-c" @click="merchantDelivery()">
				确定
			</view>
		</view>
	</scroll-view>
</template>

<script>
	export default {
		data() {
			return {
				scrollviewHigh: 0, //滚动区域高度
				express_index: null,
				expressList: [],
				params: {
					order_id: null,
					express_id: '',
					express_no: '',
				}
			}
		},
		onLoad(option) {
			let _this = this
			// 设置全局颜色
			_this.setGlobalColor({
				bgc: '#fff'
			})
			uni.setNavigationBarTitle({
				title: '发货',
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			_this.params.order_id = option.order_id || null
			_this.getAllExpressCode()
		},

		onShow() {},

		methods: {
			getAllExpressCode() {
				uni.showLoading({
					title: '加载中',
					mask: true
				})
				this._post('plus.coc.CocExpressCode/getList', {}, (res) => {
					let data = res.data || []
					this.expressList = data.map(e => {
						return {
							value: e.express_code_id,
							label: e.express_name
						}
					})
					console.log('expressList--->', this.expressList);
					uni.hideLoading();
				}, (err) => {
					console.log('请求结束-->')
					uni.hideLoading();
				})
			},

			merchantDelivery() {
				console.log('this.params', this.params);
				if (!this.params.express_id) {
					this.tip(this.$nw("请选择快递公司"), 2000)
					return
				}

				if (!this.params.express_no) {
					this.tip(this.$nw("请输入快递单号"), 2000)
					return
				}

				uni.showLoading({
					title: this.$nw("正在提交"),
					mask: true
				});
				this._post('user.order/merchantDelivery', this.params, (res) => {
					uni.hideLoading()
					this.tip('发货成功', 2000)
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				}, (err) => {
					uni.hideLoading()
				})
			},




			expressChange(e) {
				this.express_index = e.detail.value
				console.log('this.expressList[this.express_index]', this.expressList[this.express_index]);
				this.params.express_id = this.expressList[this.express_index].value
			},

			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
			},
		},
	}
</script>

<style lang="scss" scoped>
	.edit-bankcard {
		background: #F4F7FB;
		position: relative;

		.edit-bankcard-content {
			min-height: 100%;
			position: relative;
			padding: 0 0 32rpx;
			position: relative;

			.edit-form {
				background: #fff;

				.form-item {
					padding: 24rpx;

					.label {
						width: 152rpx;
						color: #666;
					}

					.bank-picker {
						flex: 1;

						.picker-value {
							max-width: 500rpx;
							color: #999;

							&.active {
								color: #333;
								font-weight: 500;
							}

						}
					}

					.form-value {
						flex: 1;
						font-size: 28rpx;
						color: #333;
						font-weight: 500;

						.form-inp {
							font-size: 28rpx;
							color: #333;
							font-weight: 500;
						}

						&.region {
							max-width: 500rpx;
							color: #999;

							&.active {
								color: #333;
							}
						}
					}

					.iconfont {
						margin-left: auto;
						font-size: 28rpx;
						color: #999;
					}

					&.has-border {
						border-bottom: 8rpx solid #F4F7FB;
					}
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
				left: 50%;
				transform: translateX(-50%);
				bottom: calc(50rpx + env(safe-area-inset-bottom) / 2);
			}
		}
	}
</style>