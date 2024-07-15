<template >
	<view class="pay-success" v-if="!loadding">
		<view class="success-icon d-c-c d-c">
      <text class="iconfont icon-queren d-c-c" style="width: 100rpx;height: 100rpx;"></text>
			<text class="name">{{$nw("支付成功")}}</text>
		</view>
		<view class="success-price d-c-c">
			{{$nw("¥")}}<text class="num">{{detail.pay_price}}</text>
		</view>
		<view class="order-info mt30 f28" v-if="detail.points_bonus > 0">
			<view class="d-b-c p20 border-b">
				<text class="gray9">{{$nw("积分赠送")}}</text>
				<text class="gray3">{{detail.points_bonus}}</text>
			</view>
		</view>
		<!-- <view v-if="detail.delivery_type.value==20">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{$nw("服务日期")}}
					</view>
					<view class="uni-list-cell-db">
						<picker mode="selector" :value="index" :range="dataArray"  @change="bindDateChange">
							<view class="uni-input">{{reserve_date||$nw("请选择预约日期") }}</view>
						</picker>
					</view>
				</view>
			</view>

			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{$nw("服务时间")}}
					</view>
					<view class="uni-list-cell-db">
						<picker mode="selector" :value="index" :range="timeRange" @change="bindTimeChange">
							<view class="uni-input">{{reserve_time||$nw("请选择预约时间") }}</view>
						</picker>
					</view>
				</view>
			</view>
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						{{$nw("门店地址")}}
					</view>
					<view @click="gotoMap" class="uni-list-cell-db" style="padding: 20rpx 20rpx 20rpx 0rpx;">
						{{detail.extractStore.address}}
						<text class="icon iconfont icon-dizhi1"></text>
					</view>

				</view>
			</view>
			<view class="success-btns d-b-c">
				<button type="default" class="flex-1 mr10" @click="goReserve()">{{$nw("确认预约")}}</button>
			</view>
		</view> -->
		<view>
			<view class="success-btns d-b-c">

				<button type="default" class="flex-1 mr10" @click="goHome()">{{$nw("返回首页")}}</button>

				<button type="default" class="flex-1 mr10" @click="goMiniprogram()" v-if="mini_appid!=''&&mini_name!=''">{{mini_name}}</button>
				<button type="primary" class="flex-1 ml10" @click="goMyorder" v-else>
				<text v-if="getAppinfo().lottery_status">{{$nw("去抽奖")}}</text>
				<text v-else>{{$nw("我的订单")}}</text>
				</button>

			</view>
		</view>
	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue'
	export default {
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*订单id*/
				order_id: 0,
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
				/* 小程序appid */
				mini_appid:'',
				/* 按钮名称 */
				mini_name:'',
				/* 跳转链接 */
				mini_page:'',
				/* 附加参数 */
				extraData:{},
				index: 0,
				/* 选择日期 */
				dataArray: [],
				/* 选择时间 */
				timeRange: [],
				/* 预约日期 */
				reserve_date:'',
				/* 预约时间 */
				reserve_time:'',
			}
		},
		onLoad(e) {
      this.setGlobalColor()
			this.order_id = e.order_id;
		},

		mounted() {
			uni.showLoading({
				title: this.$nw("加载中")
			});
			/*获取订单详情*/
			this.getData();
		},
		onShow() {
			
		},
		methods: {
			/*获取订单详情*/
			getData() {
				let _this = this;
				let order_id = _this.order_id;
				_this._get(
					'user.order/detail', {
						order_id: order_id
					},
					function(res) {
						_this.detail = res.data.order;
						_this.mini_appid = res.data.mini_appid;
						_this.mini_name = res.data.mini_name;
						_this.mini_page = res.data.mini_page;
						_this.extraData = res.data.extraData;
						_this.dataArray = res.data.dataArray;
						_this.timeRange = res.data.timeRange;
						_this.loadding = false;
						uni.hideLoading();
						
						// if(_this.detail.points_bonus > 0){//说明是积分赠送
						// 	uni.navigateTo({
						// 		url:"/plus2/pages/lottery/lottery?order_id="+order_id
						// 	})
						// }
						
					}
				);
			},
			/*返回首页*/
			goHome(){
				uni.reLaunch({
					url: '/pages/index/index'
				});
			},
			/*返回我的订单*/
			goMyorder(){
				uni.navigateTo({
					url: '/main/pages/order/myorder/myorder'
				});
			},
			/* 跳转其他小程序 */
			goMiniprogram(){
				let mini_appid = this.mini_appid;
				let mini_page = this.mini_page;
				let extraData = this.extraData;
				uni.navigateToMiniProgram({
					// #ifdef MP-WEIXIN
					appId: mini_appid,
					path: mini_page,
					extraData: extraData,
					success(res) {
						console.log(res);
					 }
					// #endif
				})
			},
			/* 跳转 */
			goReserve(){

				let _this = this;
				if(!_this.reserve_date||!_this.reserve_time){
					uni.showModal({
						title:_this.$nw("请选择预约的时间"),
					})
					return false;
				}
				_this._get(
					'user.order/reserve', {
						order_id: _this.order_id,
						reserve_date:_this.reserve_date,
						reserve_time:_this.reserve_time
					},
					function(res) {
						uni.showModal({
							title:res.msg,
							success: function (res) {
								if (res.confirm) {
									uni.navigateTo({
										url: '/main/pages/order/myorder/myorder'
									});
								} else if (res.cancel) {
									uni.navigateTo({
										url: '/main/pages/order/myorder/myorder'
									});
								}
							}
						});
						_this.loadding = false;
						uni.hideLoading();
					}
				);
			},

			bindDateChange: function(e) {

				this.reserve_date =this.dataArray[e.target.value];
			},
			bindTimeChange: function(e) {
				this.reserve_time =this.timeRange[e.target.value];
			},
			gotoMap(){
				let self = this;
				let extractStore = self.detail.extractStore;
				uni.openLocation({
					latitude:parseFloat(extractStore.latitude),
					longitude:parseFloat(extractStore.longitude),
					success: function () {
						console.log('success');
					}
				});
			}
		}
	}
</script>

<style scoped>
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

	.pay-success .success-price {
		font-size: 36rpx;
	}

	.pay-success .success-price .num {
		font-size: 60rpx;
		font-weight: bold;
	}

	.pay-success .order-info {
		background: #FFFFFF;
	}

	.pay-success .success-btns {
		margin-top: 50rpx;
		padding: 30rpx;
	}

	.pay-success .success-btns button {
		font-size: 30rpx;
	}

	.pay-success .success-btns button[type="default"] {
		border: 1px solid #04BE01;
		color: #04BE01;
	}
</style>
