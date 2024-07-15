<template>
	<view class="order-datail pb100" v-if="!loadding">
		<view class="pay-success">
			<view class="success-icon d-c-c d-c" v-if="is_SUCCESS==1">
				<image src="http://imgh5.y01.cn/20210606232155ee83c0288.png" style="width: 200rpx;height: 200rpx;"></image>
				<text class="name">{{$nw("支付成功")}}</text>
			</view>
			<view class="success-icon d-c-c d-c" v-if="is_SUCCESS==-1">
				<image src="http://bmrj.gushn.cn/file/uploads/20210822/43bd33b5bf081c7d4c11e7bfac779ee1.png" style="width: 200rpx;height: 200rpx;"></image>
				<text class="name">{{$nw("支付失败")}}</text>
			</view>
			<view v-if="is_SUCCESS==1 || is_SUCCESS==-1">
				<view class="success-btns d-b-c">
					<navigator class="flex-1 mr10 tc close-btn" target="miniProgram" open-type="exit" hover-class="none">{{$nw("关闭")}}</navigator>
				</view>
			</view>
		</view>
		<block v-if="is_SUCCESS==0">
		<!--详情状态-->
		<view class="order-state d-s-c">
			<view class="icon-box">
				<span v-if="detail.state_text == $nw('已付款，待发货')" class="icon iconfont icon-icon"></span>
				<span v-if="detail.state_text == $nw('待付款')" class="icon iconfont icon-icon"></span>
				<span v-if="detail.state_text == $nw('已发货，待收货')" class="icon iconfont icon-daishouhuo"></span>
				<span v-if="detail.state_text == $nw('已完成')" class="icon iconfont icon-xuanze"></span>
				<span v-if="detail.state_text == $nw('已取消')" class="icon iconfont icon-gantanhao"></span>
			</view>
			<view class="state-cont flex-1">
				<view class="state-txt d-b-c">
					<text class="desc f34">{{ detail.state_text }}</text>
				</view>
				<view class="status-price pt10" v-if="detail.pay_status.value == 10">{{$nw("应付金额")}}：{{$nw("¥")}} {{ detail.pay_price }}</view>
			</view>
			<view class="dot-bg"></view>
		</view>

		<!--物流地址-->
		<view class="order-express p30 d-s-s" v-if="detail.delivery_type.value == 10">
			<view class="icon-box"><span class="icon iconfont icon-dizhi1"></span></view>
			<view class="cont-text flex-1 o-h ml20 f30">
				<view class="express-text">{{ detail.address.name }} {{ detail.address.phone }}</view>
				<view class="gray9 pt10">{{ detail.address.region.province }} {{ detail.address.region.city }} {{ detail.address.region.region }} {{ detail.address.detail }}</view>
			</view>
		</view>

		<!--购物列表-->
		<view class="shops group bg-white">
			<view class="group-hd border-b-e">
				<view class="left"><text class="min-name">{{$nw("商品")}}</text></view>
			</view>
			<view class="list">
				<view class="one-product p-20-0" v-for="(item, index) in detail.product" :key="index">
					<view class="d-s-c">
						<view class="cover"><image :src="item.image.file_path" mode="aspectFit"></image></view>
						<view class="flex-1">
							<view class="p-0-30 text-ellipsis-2 gray3 f30">
								{{ item.product_name }}
							</view>
							<view class="pt10 p-0-30 gray6 f24">
								{{item.product_attr}}
							</view>
							
							<view class="pt10 p-0-30 d-b-c">
								<template v-if="item.is_user_grade!=1">
									<view class="price f22">
										{{$nw("¥")}}
										<text class="f40">{{ item.product_price }}</text>
									</view>
								</template>
								<template v-else>
									<view class="text-l-t f22">
										{{$nw("¥")}}
										<text class="f40">{{ item.product_price }}</text>
									</view>
								</template>
								<view class="f24 gray9">x{{ item.total_num }}</view>
							</view>
							<view class="mt10 tr f28" v-if="item.is_user_grade==1">
								<text class="red">{{$nw("会员折扣价")}}：</text>
								<text class="red">{{item.grade_product_price}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!--订单信息-->
		<view class="group bg-white f28">
			<view class="p-20-0">
				<text class="gray9">{{$nw("订单编号")}}：</text>
				<text>{{ detail.order_no }}</text>
			</view>
			<view class="p-20-0">
				<text class="gray9">{{$nw("下单时间")}}：</text>
				<text>{{ detail.create_time }}</text>
			</view>
			<view class="p-20-0">
				<text class="gray9">{{$nw("支付方式")}}：</text>
				<text>{{ detail.pay_type.text }}</text>
			</view>
			<!-- <view class="p-20-0">
				<text class="gray9">{{$nw("配送方式")}}：</text>
				<text>{{ detail.delivery_type.text }}</text>
			</view> -->
			<!-- <view class="p-20-0" v-if="detail.reserve_date||detail.reserve_time">
				<text class="gray9">{{$nw("预约时间")}}：</text>
				<text>{{ detail.reserve_date?detail.reserve_date:''}} {{ detail.reserve_time?detail.reserve_time:''}}</text>
				<text class="icon iconfont icon-dizhi1"></text>
			</view> -->
			<view class="p-20-0" v-if="detail.buyer_remark">
				<text class="gray9">{{$nw("留言备注")}}：</text>
				<text>{{ detail.buyer_remark}}</text>
			</view>
		</view>
		
		<view class="group bg-white f28">
			<view class="p-20-0 d-b-c" v-if="detail.order_source==20">
				<text class="gray9">{{$nw("扣除积分数")}}：</text>
				<text>-{{ detail.points_num }}</text>
			</view>
			<view class="p-20-0 d-b-c">
				<text class="gray9">{{$nw("商品金额")}}</text>
				<text>{{$nw("¥")}} {{ detail.order_price }}</text>
			</view>
			<view class="p-20-0 d-b-c"v-if="detail.express_price>0" >
				<text class="gray9">{{$nw("运费")}}</text>
				<text>+ {{$nw("¥")}} {{ detail.express_price }}</text>
			</view>
			<view class="p-20-0 d-e-c fb f34">
				{{$nw("应付金额")}}：
				<text class="red">{{$nw("¥")}} {{ detail.pay_price }}</text>
			</view>
		</view>
		</block>
	</view>
</template>

<script>
import Popup from '@/components/uni-popup.vue';
import { pay } from '@/common/pay.js';
export default {
	data() {
		return {
			/*是否加载完成*/
			loadding: true,
			indicatorDots: true,
			autoplay: true,
			interval: 2000,
			duration: 500,
			/*是否显示支付类别弹窗*/
			isPayPopup: false,
			/*订单id*/
			order_id: 0,
			payment_id: 0,
			code: '',
			payment: {},
			is_SUCCESS: 0,
			/*订单详情*/
			detail: {
				order_status: [],
				address: {
					region: []
				},
				product: '',
				pay_type: [],
				delivery_type: [],
				pay_status: []
			},
			extractStore: {},
			/*是否显示拼团*/
			is_fightgroup: false,
		};
	},
	components: {
		Popup
	},
	onLoad(e) {
		let self = this;
		let scene = e.scene ? self.scene_decode(query.scene) : {};
		self.order_id = e.order_id ? e.order_id : scene.order_id;
		self.payment_id = e.payment_id ? e.payment_id : scene.payment_id;
		
		wx.login({
			success: function (res) {
				if (res.code) {
					console.log(res.code);
					self.code = res.code;
					self.getData();
				} else {
				  console.log('获取用户登录态失败！' + res.errMsg)
				}
			}
		});
	},
	mounted() {
		uni.showLoading({
			title: this.$nw("加载中")
		});
	},
	methods: {
		/*获取数据*/
		getData() {
			let self = this;
			let order_id = self.order_id;
			let payment_id = self.payment_id;
			let code = self.code;

			uni.request({
				url: 'http://bmrj.gushn.cn/index.php/job/notify/getUnionPayOrder',
				data: {
					order_id: order_id,
					payment_id: payment_id,
					code: code
				},
				dataType: 'json',
				method: 'GET',
				success: (res) => {
					console.log(res)
					self.detail = res.data.order;
					self.payment = res.data.payment;
					self.pay();
				},
				fail: (res) => {
					console.log(res)
				},
				complete: (res) => {
					self.loadding = false;
					uni.hideLoading();
					console.log(res)
				},
			})
		},
		
		/**
		 * scene解码
		 */
		scene_decode(e) {
			if (e === undefined)
				return {};
			let scene = decodeURIComponent(e),
				params = scene.split(','),
				data = {};
			for (let i in params) {
				var val = params[i].split(':');
				val.length > 0 && val[0] && (data[val[0]] = val[1] || null)
			}
			return data;
		},

		pay(){
			let self = this;
			let payment = self.payment;
			uni.requestPayment({
				provider: 'wxpay',
				timeStamp: payment.timeStamp,
				nonceStr: payment.nonceStr,
				package: payment.package,
				signType: payment.signType,
				paySign: payment.paySign,
				success: res => {
					self.is_SUCCESS = 1;
				},
				fail: res => {
					uni.showToast({
						icon: 'none',
						title: self.$nw('订单未支付成功')
					})
					self.is_SUCCESS = -1;
				},
			});
		}
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
	padding-bottom: 90rpx;
}
.order-datail .fight-users {
	margin: 0 auto;
}
.order-datail .fight-users .user-box {
	width: 80rpx;
	height: 80rpx;
	margin: 10rpx;
	border-radius: 50%;
	border: 1px dashed #cccccc;
}
.order-datail .fight-users {
	padding: 30rpx;
}
.order-datail .fight-users .user-box image {
	width: 80rpx;
	height: 80rpx;
	border-radius: 50%;
}
.order-datail .fight-users .user-box .leader {
	position: absolute;
	top: -20rpx;
	left: 50%;
	margin-left: -30rpx;
	width: 60rpx;
	height: 30rpx;
	line-height: 30rpx;
	text-align: center;
	color: #ffffff;
	border-radius: 30rpx;
	border: 1px solid #ffffff;
	background: red;
}
.order-datail .fight-users .user-box.user-who {
	font-size: 50rpx;
	color: #999999;
}
.confirm-btn{
	background-color: red;
	color: white;
}
.close-btn{
	border: solid 1rpx #ccc;
	padding: 10px;
	border-radius: 10px;
	background: #ccc;
}
.pay-success .success-icon {
	display: flex;
	padding: 60rpx;
}

.pay-success .success-icon .iconfont {
	padding: 30rpx;
	background: #04BE01;
	border-radius: 50%;
	font-size: 80rpx;
	color: #FFFFFF;
}

.pay-success .success-icon .name {
	margin-top: 20rpx;
	font-size: 30rpx;
}

.pay-success .success-btns {
	margin-top: 50rpx;
	padding: 30rpx;
}
</style>
