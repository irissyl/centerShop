<template>
	<view class="apply-cash" v-if="!loading">
		<!--申请成功-->
		<view class="form-wrap p30 f30">
			<view class="d-c-c d-c pb20">
				<view class="red">
					<text class="f30">{{$nw("¥")}}</text>
					<text class="f50 fb">{{agent.agent.user.money}}</text>
				</view>
				<view class="f28 gray9">
					{{ words.cash_apply.words.capital.value }}
				</view>
				<view v-if="withdraw_type==50&&total_money>0" class="red">
					当前最高可提 {{total_money}} 元
				</view>
			</view>

			<form @submit="formSubmit" @reset="formReset">
				<view class="form-item">
					<view class="field-name">{{ words.cash_apply.words.money.value }}</view>
					<input class="flex-1 text-price" name="money" type="digit" placeholder-class="grary"
						:placeholder="words.cash_apply.words.money_placeholder.value"
						placeholder-style="font-weight: 400;font-size:28rpx;" @input="moneyChange" />
				</view>
				<view class="p-0-20 red f30 tc">
					{{ words.cash_apply.words.min_money.value }} {{agent.settlement.min_money}}{{$nw("元")}}
				</view>
				<view class="p-0-20 red f30 tc" v-if="settlement.cash_fee&&withdraw_type!=50">
					{{$nw("提现将按")}}{{settlement.cash_fee}}%{{$nw("收取提现手续费")}}
				</view>
				<view class="mt30 p-20-0 fb">{{$nw("提现方式")}}</view>
				<view class="form-item">
					<view class="ww100">
						<template v-if="hasType('50')&&total_money>0">
							<view class="p-30-0 border-b">
								<view class="d-b-c" :class="withdraw_type==50?'active':''" @click="TabType(50)">
									<text>{{$nw("汇付账户")}}</text>
									<text class="icon iconfont icon-xuanze"></text>
								</view>
							</view>
						</template>
						<template v-if="hasType('40')">
							<view class="p-30-0 border-b">
								<view class="d-b-c" :class="withdraw_type==40?'active':''" @click="TabType(40)">
									<text>{{getAppinfo().balance_text}}</text>
									<text class="icon iconfont icon-xuanze"></text>
								</view>
							</view>
						</template>
						<template v-if="hasType('10')">
							<view class="p-30-0 border-b">
								<view class="d-b-c" :class="withdraw_type==10?'active':''" @click="TabType(10)">
									<text>{{$nw("微信支付")}}</text>
									<text class="icon iconfont icon-xuanze"></text>
								</view>
							</view>
						</template>
						<template v-if="hasType('20')">
							<view class="p-30-0 border-b">
								<view class="d-b-c" :class="withdraw_type==20?'active':''" @click="TabType(20)">
									<text>{{$nw("支付宝")}}</text>
									<text class="icon iconfont icon-xuanze"></text>
								</view>
								<template v-if="withdraw_type==20">
									<view class="mt20">
										<input class="p20 border" name="alipay_name"
											v-model="last_cash_info.alipay_name" type="text" value=""
											placeholder-class="grary" :placeholder="$nw('请输入姓名')" />
									</view>
									<view class="mt20">
										<input class="p20 border" name="alipay_account"
											v-model="last_cash_info.alipay_account" type="text" value=""
											placeholder-class="grary" :placeholder="$nw('请输入支付宝账号')" />
									</view>
								</template>
							</view>
						</template>
						<template v-if="hasType('30')">
							<view class="p-30-0 border-b">
								<view class="d-b-c" :class="withdraw_type==30?'active':''" @click="TabType(30)">
									<text>{{$nw("银行卡")}}</text>
									<text class="icon iconfont icon-xuanze"></text>
								</view>
								<template v-if="withdraw_type==30">
									<view class="mt20">
										<input class="p20 border" name="bank_name" type="text"
											v-model="last_cash_info.bank_name" value="" placeholder-class="grary"
											:placeholder="$nw('请输入姓名')" />
									</view>
									<view class="mt20">
										<input class="p20 border" name="bank_account" type="text"
											v-model="last_cash_info.bank_account" value="" placeholder-class="grary"
											:placeholder="$nw('请输入开户行名称/地址')" />
									</view>
									<view class="mt20">
										<input class="p20 border" name="bank_card" type="text"
											v-model="last_cash_info.bank_card" value="" placeholder-class="grary"
											:placeholder="$nw('请输入银行卡号')" />
									</view>
								</template>
							</view>
						</template>

					</view>
				</view>
				<view class="d-c-c mt30">
					<button type="primary" class="btn-red flex-1"
						form-type="submit">{{ words.cash_apply.words.submit.value }}</button>
				</view>

				<view class="d-c-c p-20-0 f28">
					<checkbox-group @change="changeFunc" class="groupcheck">
						<checkbox value="checkbox" :checked="is_read" />
						<text>{{$nw("我已阅读并了解提现说明")}}</text>
						<!-- <text class="red" @click="isPopup=true">
							提现说明
						</text> -->
					</checkbox-group>

				</view>
			</form>

		</view>
		<!--协议-->
		<Popup :show="isPopup" :msg="$nw('提现说明')">
			<view class="agreement-content f28 lh150">
				{{settlement.settle_tips?settlement.settle_tips:''}}
			</view>
			<view class="ww100 pt20 d-c-c">
				<button type="primary" class="btn-red" :style="[active]" @click="isPopup=false">{{$nw("我已阅读")}}</button>
			</view>
		</Popup>


		<view class="form-wrap p30 f30 mt30">
			<view class=" p-20-0 fb">{{$nw('提现说明')}}</view>
			{{settlement.settle_tips?settlement.settle_tips:''}}
		</view>
		<service :itemData="t_service"></service>

	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue';
	import service from '@/components/diy/service/service';

	export default {
		components: {
			Popup,
			service,

		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				/*是否加载完成*/
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*支付类别*/
				withdraw_type: 10,
				isData: false,
				agent: {},
				payType: [],
				words: {},
				/*小程序订阅消息*/
				temlIds: [],
				/* 是否加载 */
				loading: true,
				/* 最后一次提现信息 */
				last_cash_info: [],
				/*弹窗是否打开*/
				isPopup: false,
				/*是否阅读规则*/
				is_read: true,
				/* 提现配置 */
				settlement: [],
				total_money: -1,
				submitLoading: false
			}
		},
		mounted() {
			/*获取数据*/
			this.getData();
			this.setGlobalColor()
		},
		computed: {
			active() {
				return Object.assign(this.setBackgroundColor(), this.setColor())
			},
		},
		methods: {
			moneyChange(e) {
				// console.log(e);
				
			},
			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				self.loading = true;
				self._get('user.agent/cash', {
					platform: self.getPlatform()
				}, function(res) {
					self.agent = res.data;
					self.words = res.data.words;
					self.payType = self.agent.settlement.pay_type;
					self.agent.isData = true;
					self.temlIds = res.data.template_arr;
					if (res.data.last_cash_info) {
						self.withdraw_type = res.data.last_cash_info.pay_type;
					}
					self.last_cash_info = res.data.last_cash_info;
					self.settlement = res.data.settlement;
					console.log(self.agent.total_money)
					self.total_money = (self.agent.agent.user.money > self.agent.total_money) ? self.agent
						.total_money : self.agent.agent.user.money;
					self.loading = false;
					uni.hideLoading();
				});
			},

			/*切换提现方式*/
			TabType(e) {
				this.withdraw_type = e;
			},

			/*判断是否存在*/
			hasType(e) {
				if (this.payType.indexOf(e) != -1) {
					return true;
				} else {
					return false;
				}
			},

			// 发起申请提现
			formSubmit(e) {
				if (this.submitLoading) return
				if (!this.is_read) {
					this.tip(this.$nw("请先确认阅读提现协议"), 2000)
					return;
				}
				let formdata = e.detail.value;
				formdata.pay_type = this.withdraw_type;
				if (formdata.pay_type == 50 && formdata.money > this.total_money || Number(formdata.money) > Number(this
						.agent.agent.user.money)) {
					this.tip(this.$nw("超过当前可提现最高额度"), 2000)
					return;
				}
				this.submitLoading = true
				uni.showLoading({
					title: this.$nw("正在提交"),
					mask: true
				})
				this._get('plus.sharebind.Bind/submitCash', {
					money: formdata.money
				}, (res) => {
					uni.hideLoading();
					uni.showToast({
						title: res.msg || this.$nw("申请成功"),
						icon: 'success',
						mask: true,
						duration: 2000,
					});
					setTimeout(() => {
						this.submitLoading = false
						uni.navigateBack(-1);
					}, 2000)
				}, (err) => {
					this.submitLoading = false
					uni.hideLoading();
				});
			},
			/*同意协议*/
			changeFunc(e) {
				if (e.target.value.length > 0) {
					this.is_read = true;
				} else {
					this.is_read = false;
				}
			}
		}
	}
</script>

<style>
	.apply-cash {
		padding: 30rpx 30rpx 30rpx;
		background-position: center 0;
		background-size: 750rpx auto;
		background-repeat: no-repeat;
	}

	.form-wrap {
		border-radius: 20rpx;
		background: #FFFFFF;
		box-shadow: 0 0 16rpx 0 rgba(0, 0, 0, .2);
	}

	.form-item {
		padding: 20rpx 0;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 28rpx;
	}

	.form-item .field-name {
		width: 140rpx;
	}

	.form-item input {
		font-size: 28rpx;
	}

	.form-item .text-price {
		padding: 0 24rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 40rpx;
		border: 1px solid #CCCCCC;
		font-size: 32rpx;
		font-weight: bold;
	}

	.agreement-content {
		max-height: 60vh;
		overflow-y: auto;
	}

	.form-item .active .iconfont.icon-xuanze {
		color: #04BE01;
	}

	.apply-cash .btn-red {
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		box-shadow: 0 8rpx 16rpx 0 rgba(226, 35, 26, .6);
	}
</style>