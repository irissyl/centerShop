<template style="background-color: rgba(227, 227, 227, 100); ">
	<view v-if="!loadding" class="uni-padding-wrap">
		<view class="uni-flex uni-column" style="border-radius: 5px; background-color:#FFFFFF;margin-bottom: 14rpx;">
			<view class="products">{{$nw("商品")}}</view>
			<view class="uni-flex uni-row" style="height: 238rpx; margin-bottom: 14rpx;">
				<view class="uni-flex" style="-webkit-justify-content: center;justify-content: center;-webkit-align-items: center;align-items: center;">
					<image :src="detail.image.file_path"></image>
				</view>
				<view class="uni-flex uni-column" style="-webkit-flex: 1;flex: 1;-webkit-justify-content: space-between;justify-content: center;">
					<view class="uni-flex uni-row">
						<view class="text" style="padding-left: 40rpx;">{{$nw("名称")}}</view>
						<view class="text" style="padding-left: 40rpx;">{{detail.product_name}}</view>
					</view>
					<view class="uni-flex uni-row">
						<view class="text" style="padding-left: 40rpx;">{{$nw("编码")}}</view>
						<view class="text" style="padding-left: 40rpx;">{{detail.code}}</view>
					</view>
					<view class="uni-flex uni-row">
						<view class="text" style="padding-left: 40rpx;">{{$nw("规格")}}</view>
						<view class="text" style="padding-left: 40rpx;">{{detail.product_attr}}</view>
					</view>
				</view>
			</view>
		</view>
		<view class="kuc">
			<view class="uni-flex uni-row">
				<view class="text" style="padding-left: 40rpx;">{{$nw("库存数量")}}</view>
				<view class="text" style="padding-left: 40rpx;">{{detail.number}}</view>
			</view>
			<view class="uni-flex uni-row">
				<view class="text" style="padding-left: 40rpx;">{{$nw("提货数量")}}</view>
				<view class="text" style="padding-left: 40rpx;">
					<input type="number" placeholder="" v-model="number">
				</view>
			</view>
		</view>

		<view class="jiu">
			<view class="title">{{$nw("收货地址")}}</view>
			<view class="uni-body">
				<Myinfo :Address="Address" :exist_address="exist_address"></Myinfo>
			</view>
		</view>

		<view class="jiu">
			<view class="title">{{$nw("库存费用")}}</view>

		</view>

		<view class="" style="background-color: #FFFFFF;">
			<view class="title1" style="padding-top: 14rpx;">{{$nw("购买日期")}}：{{detail.buy_time}}</view>
			<view class="title1">{{$nw("需支付费")}}：{{detail.hoard_fee}}{{$nw("元")}}</view>
		</view>


		<view class="pay-type" v-if="detail.hoard_fee != 0">
			<view class="title">{{$nw("请选择支付方式")}}</view>

		</view>
		<!--支付方式-->
		<view class="buy-checkout" style="background-color: #FFFFFF;" v-if="detail.hoard_fee != 0">
			<payOptions :payTypeList="payTypeList" :need_sel="0" :checkedPayType="pay_type"
			@click="payTypeFunc">
			</payOptions>

		</view>
		<button type="warn" style="width: 40%;margin: auto;margin-bottom: 8%;margin-top: 5%;" @click="confirm_delivery(detail.hoard_fee,detail.storage_id)">{{$nw("确认提货")}}</button>

	</view>
</template>

<script>
	import Myinfo from '@/user/pages/storage/part/my-address.vue';
	import {
		pay
	} from '@/common/storagePay.js';
	import '@/common/uni.css';
	export default {
		components: {
			Myinfo,
		},
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				/*酒id*/
				storage_id: 0,
				/*酒详情*/
				detail: {},
				category: {},
				customized: false,
				dashi: true,
				// 是否存在收货地址
				exist_address: false,
				/*默认地址*/
				Address: {
					region: []
				},
				/*消息模板*/
				temlIds: [],
				number:1,
				/*是否显示支付类别弹窗*/
				payTypeList:[],
					/*支付方式*/
				pay_type:10,
			};
		},
		onLoad(e) {
			this.storage_id = e.storage_id;
		},
		mounted() {
      this.setGlobalColor()
			uni.showLoading({
				title: this.$nw("加载中")
			});
			/*获取酒详情*/
			this.getData();
		},
		methods: {

			/*支付方式选择*/
			payTypeFunc(objs) {
				this.pay_type = objs.value;
			},
			/*获取数据*/
			getData() {
				let self = this;
				let storage_id = self.storage_id;
				self._get(
					'plus.storage.storage/delivery', {
						storage_id: storage_id
					},
					function(res) {

						self.detail = res.data.delivery;
						self.exist_address = res.data.delivery.exist_address;
						self.Address = res.data.delivery.address;
						self.payTypeList = res.data.payTypeList.val;
						self.pay_type = es.data.payTypeList.pay_type
						self.Address = res.data.delivery.address;
						self.loadding = false;
						uni.hideLoading();
					}
				);
			},


			/*确认提货*/
			confirm_delivery(hoard_fee, storage_id) {
				let self = this;
				if (hoard_fee < 1) {
					self.pay_type = 10;
				}
				if	(self.number > self.detail.number) {
					uni.showToast({
						title: self.$nw("库存不足"),
						icon: 'none',
						duration: 2000
					});
					return false;
				}
				let params = {
					pay_type: self.pay_type,
					pay_source: self.getPlatform(),
					exist_address: self.exist_address,
					address: JSON.stringify(self.Address)
				};
				let url = '';

				url = 'plus.storage.order/buy';
				params = Object.assign(params, {
					storage_id: storage_id,
					hoard_fee: hoard_fee,
					number:self.number

				});

				let callback = function() {
					if (params.exist_address == false) {
						uni.showToast({
							title: self.$nw("请添加收货地址"),
							icon: 'none',
							duration: 2000
						});
					} else {
						self._post(url, params, function(result) {
							pay(result, self);
						});
					}
				};

				self.subMessage(self.temlIds, callback);


			}

		}
	}
</script>

<style>
	.uni-padding-wrap {
		padding: 0 20rpx;
		width: 710rpx;
	}

	.img {
		width: 100%;
		height: 300rpx;
	}

	.uni-flex image {
		margin-left: 16rpx;
		width: 200rpx;
		height: 200rpx;
		border-radius: 5px;
	}

	.dingzhi {
		height: 280rpx;
		margin-bottom: 14rpx;
		background-color: #FFFFFF;
		border-radius: 5px;
	}

	.dingzhi .uni-body {
		height: 200rpx;
	}

	.dingzhi .uni-row {
		-webkit-flex: 1;
		flex: 1;
		height: 200rpx;
		align-items: center;
	}

	.dingzhi .uni-row .flex-item {
		width: 210rpx;
		margin-right: 30rpx;
		text-align: center;
		line-height: 132rpx;
		background-color: rgba(251, 145, 32, 100);
		color: rgba(255, 255, 255, 100);
		border-radius: 5px;
	}

	.jiu {
		margin-top: 18rpx;
		margin-bottom: 8rpx;
		background-color: #FFFFFF;
		border-radius: 5px;
	}

	.kuc {
		margin-top: 18rpx;
		margin-bottom: 8rpx;
		background-color: #FFFFFF;
		border-radius: 5px;
	}

	.title {
		font-size: 14px;
		height: 80rpx;
		line-height: 80rpx;
		padding-left: 10rpx;
		padding-left: 20rpx;
		border-bottom: 4rpx solid #CCCCCC;
	}

	.title1 {
		line-height: 50rpx;
		padding-left: 20rpx;
		padding-bottom: 14rpx;

	}

	.jiu .uni-row {
		margin-top: 0rpx;
		-webkit-flex-wrap: wrap;
		flex-wrap: wrap;
		-webkit-flex: 1;
		flex: 1;
		margin-bottom: 24rpx;
	}

	.jiu .text {
		padding: 0 35rpx;
		height: 112rpx;
		border-radius: 5px;
		line-height: 112rpx;
		text-align: center;
		font-size: 28rpx;
		margin-right: 35rpx;
		margin-bottom: 14rpx;
	}

	.uni-flex .uni-column .text {
		text-align: left;
		padding-left: 84rpx;
		padding-top: 10rpx;
		font-size: 14px;
	}

	.shuoming .uni-text {
		padding-top: 10rpx;
		padding-left: 20rpx;
	}

	.products {
		font-size: 14px;
		padding-left: 20rpx;
		border-bottom: 2rpx solid #CCCCCC;
		height: 80rpx;
		line-height: 80rpx;
	}

	.uni-text {
		color: #999999;
	}

	.buy-checkout .item {
		padding-top: 8rpx;
		padding-right: 28rpx;
		padding-bottom: 8rpx;
		padding-left: 28rpx;
	}

	.pay-type {

		background-color: #FFFFFF;
		margin-top: 18rpx;
		border-bottom: 4rpx solid #CCCCCC;
	}
</style>
