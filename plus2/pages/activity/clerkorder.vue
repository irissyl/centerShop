<template>
	<view class="order-datail">
		<!--详情状态-->
		<view class="order-state d-s-c">
			<view class="icon-box"><span class="icon iconfont icon-gantanhao"></span></view>
			<view class="state-cont flex-1">
				<view class="state-txt d-b-c">
					<text class="desc f34">{{ detail.state_text }}</text>
				</view>
			</view>
			<view class="dot-bg"></view>
		</view>

		<!--购物列表-->
		<view class="shops group bg-white">
			<view class="group-hd border-b-e">
				<view class="left">
					<text class="min-name">{{$nw('活动')}}</text>
				</view>
			</view>
			<view class="list">
				<view class="one-product p-20-0">
					<view class="d-s-c">
						<view class="cover">
							<image :src="detail.activity.imgUrl" mode="aspectFit"></image>
						</view>
						<view class="flex-1">
							<view class="pro-info">{{ detail.activity.title }}</view>
							<view class="pt10 p-0-30 d-b-c">
								<view class="price f22">
									¥
									<text class="f40">{{ detail.activity.price }}</text>
								</view>
								<!-- <view class="f24 gray9">x{{ item.total_num }}</view> -->
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!--订单信息-->
		<view class="group bg-white f28">
			<view class="p-20-0">
				<text class="gray9">报名编号{{$nw('活动')}}：</text>
				<text>{{ detail.order_no }}</text>
			</view>
			<view class="p-20-0">
				<text class="gray9">{{$nw('报名时间')}}：</text>
				<text>{{ detail.create_time }}</text>
			</view>
			<view class="p-20-0" v-if="detail.pay_type==20">
				<text class="gray9">{{$nw('支付方式')}}：</text>
				<text>{{ detail.pay_text }}</text>
			</view>
	
			<view class="p-20-0 d-b-c">
				<text class="gray9">{{$nw('金额')}}</text>
				<text v-if="detail.pay_price>0">¥ {{ detail.pay_price }}</text>
				<text v-else>{{$nw('免费')}}</text>
			</view>
			<view class="p-20-0 d-e-c fb f34" v-if="detail.pay_price>0">
				{{$nw('应付金额')}}：
				<text class="red">¥ {{ detail.pay_price }}</text>
			</view>
		</view>

		<!-- 操作栏 -->
		<view v-if="detail.order_status != 20 " class="flow-fixed-footer b-f">
			<!-- 订单核销 -->
			<view v-if="detail.pay_status==20 ">
				<button class="submitButton" @click="onSubmitExtract(detail.activity_record_id)">{{$nw('确认核销')}}</button>
			</view>
		</view>
	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue'
	import utils from '@/common/utils.js'
	export default {
		data() {
			return {
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*是否显示支付类别弹窗*/
				isPayPopup: false,
				/*订单id*/
				activity_record_id: 0,
				/*订单详情*/
				detail: {
					order_status: [],
					address: {
						region: []
					},
					product: [],
					pay_type: [],
					delivery_type: [],
					pay_status: []
				},
				extractStore: {},
			};
		},
		components: {},
		onLoad(e) {

			let scene = utils.getSceneData(e);
			this.activity_record_id = e.order_id ? e.order_id : scene.oid;

		},
		mounted() {
			/*获取订单详情*/
			this.getData();
		},
		methods: {
			
			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				self._get(
					'plus.activity.activity/recordDetail', {
						activity_record_id: self.activity_record_id,
						order_type: self.order_type
					},
					function(res) {
						self.detail = res.data.order;
						self.extractStore = res.data.order.extractStore;
						uni.hideLoading();
					}
				);
			},


			/*核销*/
			onSubmitExtract(activity_record_id) {
				let self = this;
				wx.showModal({
					title: self.$nw("提示"),
					content: self.$nw("您确定要核销吗?"),
					success: function(o) {
						o.confirm && self._post(
							'plus.activity.activity/extract', {
								activity_record_id: activity_record_id
							},
							function(res) {
								uni.showModal({
									title: self.$nw("提示"),
									content:res.msg,
									showCancel:false,
									success: function (res) {
										console.log(123);
									}
								})
								setTimeout(function () {
								    self.getData();
								}, 2000);
							}
						);
					}
				});
			},
		}
	};
</script>

<style scoped>
	.order-express {
		background: #ffffff;
	}

	.order-express .icon-box .iconfont {
		font-size: 50rpx;
	}

	.order-datail {
		padding-bottom: 90 rpx;
	}
	.submitButton{
		color: #FFFFFF;
		margin: 20rpx;
		background-color: #6599fe;
	}
</style>
