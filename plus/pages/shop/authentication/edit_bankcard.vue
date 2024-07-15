<template>
	<scroll-view scroll-y="true" class="edit-bankcard scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50">
		<view class="edit-bankcard-content">
			<view class="edit-form">
				<view class="form-item flex-c">
					<view class="label">
						所属银行
					</view>
					<picker class="bank-picker" @change="bankChange" :value="bank_index" :range="bank_list"
						range-key="label">
						<view class="picker-value text-ellipsis"
							:class="{'active' : bank_list[bank_index] && bank_list[bank_index].label}">
							{{bank_list[bank_index] && bank_list[bank_index].label || '请选择'}}
						</view>
					</picker>
					<i class="iconfont icon-jiantou"></i>
				</view>
				<view class="form-item flex-c">
					<view class="label">
						开户区域
					</view>
					<view class="form-value region text-ellipsis" :class="{'active' : regionText}"
						@click="regionalStatus = true">
						{{regionText || '请选择'}}
					</view>
					<i class="iconfont icon-jiantou"></i>
				</view>
				<view class="form-item flex-c">
					<view class="label">
						开户行
					</view>
					<picker class="bank-picker" @change="branchChange" :value="branch_index" :range="branch_List"
						range-key="label">
						<view class="picker-value text-ellipsis"
							:class="{'active' : branch_List[branch_index] && branch_List[branch_index].label}">
							{{branch_List[branch_index] && branch_List[branch_index].label || '请选择'}}
						</view>
					</picker>
					<i class="iconfont icon-jiantou"></i>
				</view>
				<!-- <view class="form-item flex-c">
					<view class="label">
						银行卡
					</view>
					<view class="form-value">
						<input class="form-inp" type="text" :value="params.bankName" placeholder="请输入银行卡"
							placeholder-style="color:#999;font-weight:400;" />
					</view>
				</view> -->
				<view class="form-item flex-c has-border">
					<view class="label">
						卡号
					</view>
					<view class="form-value">
						<input class="form-inp" type="text" v-model="params.card_number" placeholder="请输入银行卡号"
							placeholder-style="color:#999;font-weight:400;" />
					</view>
				</view>

				<view class="form-item flex-c">
					<view class="label">
						持卡人
					</view>
					<view class="form-value">
						<input class="form-inp" type="text" :value="id_card_name" placeholder="请输入持卡人真实姓名"
							placeholder-style="color:#999;font-weight:400;" disabled />
					</view>
				</view>

				<view class="form-item flex-c">
					<view class="label">
						身份证号
					</view>
					<view class="form-value">
						<input class="form-inp" type="text" :value="id_card" placeholder="请输入持卡人身份证号码"
							placeholder-style="color:#999;font-weight:400;" disabled />
					</view>
				</view>

				<view class="form-item flex-c has-border">
					<view class="label">
						手机号
					</view>
					<view class="form-value">
						<input class="form-inp" type="text" v-model="params.card_phone" placeholder="请输入银行卡绑定手机号"
							placeholder-style="color:#999;font-weight:400;" />
					</view>
				</view>

				<view class="form-item flex-c has-border">
					<view class="label" style="width: initial;">
						设为默认收款卡
					</view>
					<switch :checked="params.is_default == 1"
						:disabled="(is_edit && card_count <= 1) || (!is_edit && card_count < 1)" @change='switchChange'
						color="#1b94e0" style="transform:scale(0.8);margin-left: auto;" />
				</view>
			</view>

			<view v-if="!is_edit" class="authentication-btn flex-c" @click="bindBankCard()">
				提交绑卡
			</view>
			<view v-else class="authentication-btn several flex-c">
				<view class="btn plain flex-c" @click="unBindBank()">
					解绑
				</view>
				<view class="btn flex-c" @click="bindBankCard()">
					确认
				</view>
			</view>
		</view>

		<Regional v-if="showRegional" v-show="regionalStatus" ref="RegionalRef" :defaultData="defaultData"
			@cancel="regionalCancel" @confirm="regionalConfirm" :is_edit="is_edit" :bankBranch='bankBranch'></Regional>
	</scroll-view>
</template>

<script>
	import Regional from '../components/Regional.vue'
	// import BranchBankPicker from '../components/BranchBankPicker.vue'
	export default {
		components: {
			Regional,
			// BranchBankPicker
		},
		data() {
			return {
				scrollviewHigh: 0, //滚动区域高度
				is_edit: 0,
				bank_index: null,
				bank_list: [],
				branch_index: null,
				branch_List: [],
				defaultData: {
					province_id: 0,
					city_id: 0,
				},
				params: {
					bank_id: '', //银行卡类型id
					bank_branch_id: '', //支行id
					card_number: '', //银行卡号
					card_phone: '', //银行预留手机号
					is_default: 2
				},
				province_id: '',
				city_id: '',
				id_card_name: '',
				id_card: '',
				regionalStatus: false,
				RegionalRef: null,
				regionText: '',
				showRegional: false,
				bankBranch: {},
				card_count: 0,
				card_is_default: 2
			}
		},
		computed: {
			isValidCardNumber() {
				const regex = /^\d{16,19}$/;
				return regex.test(this.params.card_number);
			},
			isValidPhone() {
				// 中国大陆手机号码正则表达式
				const regex = /^1[3-9]\d{9}$/;
				return regex.test(this.params.card_phone);
			}
		},
		onLoad(option) {
			let _this = this
			_this.is_edit = option.is_edit || 0
			_this.bank_id = option.id || null
			// 设置全局颜色
			_this.setGlobalColor({
				bgc: '#fff'
			})
			uni.setNavigationBarTitle({
				title: _this.is_edit ? '编辑银行卡' : '添加银行卡',
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			_this.getUserBankList()
			_this.getBankList()
			if (!_this.is_edit) {
				_this.showRegional = true
				_this.getUserAuthInfo()
			}
		},

		onShow() {},

		methods: {
			// 获取用户绑定银行卡列表
			getUserBankList() {
				this._get('user.userBankCard/getList', {}, (res) => {
					let card_list = res.data || []
					this.card_count = card_list.length
					if (!this.is_edit && this.card_count < 1) {
						this.params.is_default = 1
					}
				}, (err) => {})
			},
			switchChange(e) {
				console.log('switchChange', e);
				this.params.is_default = e.detail.value ? 1 : 2
				console.log('is_default-->', this.params.is_default);
			},
			getBankDetails() {
				uni.showLoading({
					title: this.$nw("加载中"),
					mask: true
				});
				this._post('user.userBankCard/getInfo', {
					id: this.bank_id
				}, (res) => {
					let data = res.data
					let bank = res.data.bank
					let bankBranch = res.data.bankBranch
					this.bankBranch = res.data.bankBranch
					this.params.bank_id = bank.id
					this.params.bank_branch_id = bankBranch.id
					this.params.card_number = data.card_number
					this.params.card_phone = data.card_phone
					this.params.is_default = data.is_default
					this.card_is_default = data.is_default
					this.id_card_name = data.card_name
					this.id_card = data.id_card
					this.province_id = bankBranch.province_id * 1000000
					this.city_id = bankBranch.city_id * 1000000
					// 所属银行回显
					for (let i = 0; i < this.bank_list.length; i++) {
						if (this.bank_list[i].id == bank.id) {
							this.bank_index = i
							break
						}
					}
					// 开户行回显
					this.getBranchList(bankBranch.id)
					// 区域回显
					this.showRegional = true
					uni.hideLoading()
				}, (err) => {
					uni.hideLoading()
				})
			},
			bindBankCard() {
				if (!this.params.bank_id) {
					this.tip(this.$nw("请选择所属银行"), 2000)
					return
				}
				if (!this.params.bank_branch_id) {
					this.tip(this.$nw("请选择开户行"), 2000)
					return
				}
				if (!this.params.card_number) {
					this.tip(this.$nw("请输入银行卡号"), 2000)
					return
				}
				console.log('isValidCardNumber', this.isValidCardNumber);
				if (!this.isValidCardNumber) {
					this.tip(this.$nw("银行卡输入有误，请核对后重新输入"), 2000)
					return
				}
				if (!this.params.card_phone) {
					this.tip(this.$nw("请输入银行卡绑定手机号"), 2000)
					return
				}
				if (!this.isValidPhone) {
					this.tip(this.$nw("请输入正确的手机号"), 2000)
					return
				}
				uni.showLoading({
					title: this.$nw("正在提交"),
					mask: true
				});
				if (this.is_edit) {
					this.params.id = this.bank_id
				}
				this._post('user.UserBankCard/bindBankCard', this.params, (res) => {
					uni.hideLoading()
					this.tip('提交成功', 2000)
					setTimeout(() => {
						uni.navigateBack()
					}, 1000)
				}, (err) => {
					uni.hideLoading()
				}, () => {
					console.log('请求结束');
				})
			},
			/*解绑银行卡*/
			unBindBank() {
				if (this.card_count <= 1) {
					this.tip('至少绑定一张银行卡', 2000)
					return
				}
				if (this.card_is_default == 1) {
					this.tip('当前银行卡为默认收款卡', 2000)
					return
				}
				let self = this;
				wx.showModal({
					title: self.$nw("提示"),
					content: self.$nw("确定要解绑该银行卡吗？"),
					success: (e) => {
						console.log(e);
						if (e.cancel) {

						}
						if (e.confirm) {
							uni.showLoading({
								title: this.$nw("解绑中"),
								mask: true
							});
							self._post('user.userBankCard/unBindBank', {
								id: self.bank_id,
							}, (res) => {
								uni.hideLoading();
								uni.showToast({
									title: self.$nw("解绑成功"),
									duration: 2000,
									icon: 'success'
								});
								setTimeout(() => {
									uni.navigateBack()
								}, 1000)
							});
						}

					}
				});
			},

			// 获取银行卡类型
			getBankList() {
				this._get('tongguan.bank/getList', {}, (res) => {
					let data = res.data || []
					for (let i = 0; i < data.length; i++) {
						data[i].label = data[i].name
						data[i].value = data[i].id
					}
					this.bank_list = data
					if (this.is_edit) {
						this.getBankDetails()
					}
				})
			},
			// 获取支行列表
			getBranchList(id) {
				this._get('tongguan.bank/getBranchList', {
					bank_id: this.bank_list[this.bank_index].id,
					province_id: this.province_id / 1000000,
					city_id: this.city_id / 1000000
				}, (res) => {
					let data = res.data || []
					if (!data.length) {
						this.tip('未查询到支行数据', 2000)
						return
					}
					for (let i = 0; i < data.length; i++) {
						data[i].label = data[i].name
						data[i].value = data[i].id
					}
					this.branch_List = data
					if (id) {
						for (let i = 0; i < this.branch_List.length; i++) {
							if (this.branch_List[i].id == id) {
								this.branch_index = i
								break
							}
						}
					}
				})
			},
			regionalCancel() {
				this.regionalStatus = false;
			},

			regionalConfirm(e) {
				console.log('regionalConfirm', e)
				this.province_id = e.province_id;
				this.city_id = e.city_id;
				// this.params.region_id = e.region_id;
				// this.params.street_id = e.street_id;
				// this.regionText = e.province + e.city + e.area + e.street;
				this.regionText = e.province + e.city;
				this.regionalStatus = false;
				if (this.bank_list[this.bank_index] && this.bank_list[this.bank_index].id) {
					this.getBranchList()
				}
				if (!e.not_reset) {
					this.branch_index = null
					this.params.bank_branch_id = ''
				}
			},
			bankChange(e) {
				this.branch_index = null
				this.params.bank_branch_id = ''
				this.bank_index = e.detail.value
				this.params.bank_id = this.bank_list[this.bank_index].id
				if (this.province_id && this.city_id) {
					this.getBranchList()
				}
			},
			branchChange(e) {
				this.branch_index = e.detail.value
				this.params.bank_branch_id = this.branch_List[this.branch_index].id
			},
			// 获取用户实名信息
			getUserAuthInfo() {
				uni.showLoading({
					title: this.$nw("加载中"),
					mask: true
				});
				this._get('user.user/getUserAuthInfo', {}, (res) => {
					this.id_card_name = res.data.id_card_name
					this.id_card = res.data.id_card
					uni.hideLoading()
				}, (err) => {
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

				&.several {
					background: none;
					justify-content: space-between;

					.btn {
						width: 340rpx;
						height: 80rpx;
						justify-content: center;
						border-radius: 8rpx;
						font-weight: 500;
						color: #fff;
						background: #1B94E0;

						&.plain {
							background: #fff;
							border: 2rpx solid #1B94E0;
							color: #1B94E0;
						}
					}
				}
			}

			.btns {}
		}
	}
</style>