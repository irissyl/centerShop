<template>
	<view>
		<view class="top-tabbar">
			<view :class="state_active == 0 ? 'tab-item active' : 'tab-item'" @click="stateFunc(0)">马上续费</view>
			<view :class="state_active == 1 ? 'tab-item active' : 'tab-item'" @click="stateFunc(1)">续费记录</view>
		</view>
		
		<view class="grade" v-if="state_active==0">
			<view class="grade-list">
				<view  v-for="(item, index) in listData" :key="index" >
					<view  class="item" :style="index === current?'background-color: #e2231a;':'background-color:#dfdfdf'" >
						<view class="grade-info">
							<view class="price">
								<radio-group @change="radioChange" style="height: 100%;width: 100%;" >
										<view style="height:200rpx ; display: flex;border-bottom: 1rpx solid #999999;">
											<view style="position:relative;width: 90%;">
												<view class="card_grade_money" :style="index === current?'color: #ffffff;':''">
													￥{{item.money}}元
												</view>
												<view class="card_grade_name" :style="index === current?'color: #ffffff;':''">
													{{item.name}}
												</view>
											</view>
											<view class="radio_style">
												<radio :value="item.card_grade_id" :checked="index === current"/>
											</view>
										</view>
										<view style="padding-top: 20rpx;" :style="index === current?'color: #ffffff;':''">
											续费时长 :{{item.time}}天
										</view>
								</radio-group>
							</view>
						</view>

					</view>
				</view>
				<!-- 没有记录 -->
				
			</view>
			<view class="cover" @click="closePopup()" v-if="grade_show"></view>
			<view class="buy-checkout" v-if="grade_show">
				<view :class="pay_type == 20 ? 'item active' : 'item'" @click="payTypeFunc(20)">
					<view class="d-s-c">
						<view class="icon-box d-c-c mr10"><span class="icon iconfont icon-weixin"></span></view>
						<text class="key">微信支付：</text>
					</view>
					<view class="icon-box d-c-c"><span class="icon iconfont icon-xuanze"></span></view>
				</view>
				<view :class="pay_type == 10 ? 'item active' : 'item'" @click="payTypeFunc(10)">
					<view class="d-s-c">
						<view class="icon-box d-c-c mr10"><span class="icon iconfont icon-yue"></span></view>
						<text class="key">{{getAppinfo().balance_text}}支付：</text>
					</view>
					<view class="icon-box d-c-c"><span class="icon iconfont icon-xuanze"></span></view>
				</view>
				<view class="p20"><button type="primary"  @click="goPay(10)" class="f30 mt30" style="margin:auto;margin-top: 450rpx;width: 500rpx;border-radius: 30rpx;">付款</button></view>
			</view>

			<view class="p20"><button type="default" class="btn-red f30 mt30" @click="pay_box">{{$nw("立即购买")}}</button></view>
		
		</view>
		
		<view class="grade" v-if="state_active==1">
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			  @scrolltolower="scrolltolowerFunc">
				<view class="product-item-list">
					<view class="order-list">
						<view class="item" v-for="(item, index) in orderlistData" :key="index">
							<view class="order-head d-b-c">
								<view>
									<text class="shop-name flex-1 fb">订单号：{{item.order_no}}</text>
								</view>
								<view class="state">
									<text class="red">{{item.state_text}}</text>
								</view>
							</view>
							<view class="one-product d-s-c">
								
								<view class="pro-info flex-1" v-if="item.cardGrade">
									名片续费{{item.cardGrade.time}}天
								</view>
								<view class="total-count">
									<view class="left-shadow"></view>
									<view class="price f22">
										¥<text class="f40">{{item.order_price}}</text>
									</view>
								</view>
							</view>
							<view class="order-bts">

							</view>
						</view>
						<view class="d-c-c p30" v-if="listData.length==0 && !loading">
							<text class="iconfont icon-wushuju"></text>
							<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
						</view>
						
					</view>
			
					<view class="">
						<view class="bottom-refresh">
							<view class="d-c-c p30" v-if="loading">
								<text class="gray3">加载中...</text>
							</view>
							<view class="d-c-c p30" v-if="no_more">
								<text class="gray3">~~加载完成~~</text>
							</view>
						</view>
					</view>
		
				</view>
			</scroll-view>
		</view>
	</view>
	
</template>

<script>
import {pay} from '@/common/pay.js'
export default {
	data() {
		return {
			/*支付方式*/
			pay_type: 20,
			type:'no',
			card_grade_id:0,
			/*数据*/
			listData: [],
			setting:{},
			radio_val:false,
			current:0,
			grade_show:false,
			path_before:'',
			state_active:0,
			last_page:0,
			page:1,
			list_rows:15,
			/*手机高度*/
			phoneHeight: 0,
			/*可滚动视图区域高度*/
			scrollviewHigh: 0,
			no_more:false,
			orderlistData: [],
			loading:true
		};
	},
	
	onShow() {
		/*获取个人中心数据*/
		this.getData();
	},
	computed: {
		/*加载中状态*/
		
	},
	mounted() {
		this.init();
	},
	onPullDownRefresh() {
		
	},
	methods: {
		/*获取数据*/
		getData() {
			let self = this;
			uni.showLoading({
				title: '加载中'
			});
			self._get(
				'plus.card.card/getGrade',
				{},
				function(res) {
					self.listData = res.data.list.data;
					if(self.listData.length>=1){
						self.card_grade_id = self.listData[0].card_grade_id;
					}
					self.setting = res.data.setting;
					uni.hideLoading();
				}
			);
		},
		change(e){
			console.log(e);
		},
		pay_box(){
			this.grade_show=true;
		},
		radioChange: function(evt) {
			let self = this;
			for (let i = 0; i < self.listData.length; i++) {
				if (self.listData[i].card_grade_id == evt.target.value) {
					self.current = i;
					self.card_grade_id = evt.target.value;
					break;
				}
			}
			
		},
		/*购买*/
		payTypeFunc(payType){
			let self = this;
			self.pay_type = payType;
		},
		goPay(){
			let self = this;
			uni.showLoading({
				title: '正在提交...'
			});
			var payType = self.pay_type;
			let pay_source = 'wx';
			// #ifdef  H5
			pay_source = 'mp';
			// #endif
			self._post('plus.card.card/buyGrade', {
				card_grade_id: self.card_grade_id,
				pay_source: pay_source,
				pay_type: payType,
			}, function(res) {
				pay(res, self, self.paySuccess, self.payError);
			});
		},
		paySuccess:function(result){
			this.showSuccess(this.$nw('提交成功'), () => {
				uni.navigateTo({
					url:'/card/pages/card/staff/mine/mine'
				});
			});
		},
		payError:function(result){
			this.showError(this.$nw('订单未支付成功'), () => {
				console.log('payError');
			});
		},
			
		/*关闭弹窗*/
		closePopup() {
			let self = this;
			self.grade_show = false;
			self.getData();
		},
		stateFunc(e){
			this.state_active = e;
			if(e==1){
				this.page=1;
				this.orderlistData = [];
				this.getGradeOrderList();
			}
		},
		/* 获取续费订单 */
		getGradeOrderList(){
			let self = this;
			uni.showLoading({
				title: '正在提交...'
			});
			
			self._post('plus.card.card/getGradeOrderList', {
				page: self.page,
				list_rows: self.list_rows,
			}, function(res) {
				self.loading = false;
				self.orderlistData = self.orderlistData.concat(res.data.list.data);
				self.last_page = res.data.list.last_page;
				if (res.data.list.last_page <= 1) {
					self.no_more = true;
				}else{
					self.no_more = false;
				}
			});
		},
		init() {
			let self = this;
			uni.getSystemInfo({
				success(res) {
					self.phoneHeight = res.windowHeight;
					// 计算组件的高度
					let view = uni.createSelectorQuery().select('.top-tabbar');
					view.boundingClientRect(data => {
						let h = self.phoneHeight - data.height;
						self.scrollviewHigh = h;
					}).exec();
				}
			});
		},
		/*可滚动视图区域到底触发*/
		scrolltolowerFunc() {
			let self = this;
			if(self.no_more){return;}
			self.page++;
			if (self.page <= self.last_page) {
				self.getGradeOrderList();
			}else{
				self.no_more = true;
			}
		},
	}
};
</script>

<style lang="scss" scoped>

page{background-color: #fff;}
.grade{ height: 100%;}
.grade .title{ heigth:100rpx; font-size:30rpx;}
.grade .title .name{ margin:0 20rpx; font-size:30rpx;}
.grade .title .line{position: relative; display: block; width: 100rpx; border-top:1px solid red;}
.grade .title .line::after{ position: absolute; content:''; display: block; width: 16rpx; height:16rpx; border-radius:50%; background: red;}
.grade .title .left-line::after{ right:0; top:-9rpx;}
.grade .title .right-line::after{ left:0; top:-9rpx;}
.grade-list {
	padding: 30rpx;
}
.p20{
	margin: auto;
}
.card_grade_money{
	font-size: 40rpx;
}
.card_grade_name{
	padding-top: 50rpx;
	color: #999999;
}
.card_grade_name>.active{
	color: #FFFFFF;
}
.radio_style{
	display:flex;
}

.btn-red{
	width: 600rpx;
	margin: auto;
	height: 100rpx;
	border-radius: 30rpx;
	font-size: 35rpx;
	line-height: 100rpx;
	// position:fixed;
	// top: 1000rpx;
	// left: 80rpx;
}
.path_img_css{
	position: relative;
	// border: 1px solid red;
	z-index: -1;
	width: 690rpx;
	height: 350rpx;
	left: -634rpx;
	top: -95rpx;
}
.grade_css{
	position:relative;
	left: 450rpx;
}
.grade-list .item {
	border-radius: 20rpx;
	margin-bottom: 30rpx;
	padding-bottom: 20rpx;
	overflow: hidden;
	background: #ffffff;
	box-shadow: 0 0 8rpx rgba(0,0,0,.1);
	height: 300rpx;
}
.red-border{
	border:solid 2rpx $dominant-color;
}
.grade-list .item:nth-child(2n+0){
	margin-right: 0;
}

 .banner-image {
	width: 100%;
	box-sizing: border-box;
	padding: 20rpx;
}
.banner-image image {
	width: 710rpx;
	height: 294rpx;
}
.grade-list .grade-info{ padding: 20rpx 24rpx;z-index: 10;}
.grade-list .grade-title {
	// height: 80rpx;
	margin-top: 20rpx;
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	font-size: 30rpx;
}
.grade-list .price {
	// color: $dominant-color;
	color: #6b6b6b;
}
.grade-list .price .num {
	font-size: 30rpx;
	z-index: 10;
	font-weight: bold;
	// position: fixed;
}
.buy-checkout{
	width: 80%;
	height: 75vh;
	position: fixed;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	z-index: 999;
	border-radius: 30rpx;
	background-color: #FFF;
}
.cover{
	background-color: rgba(0, 0, 0, 0.6);
	z-index: 900;
	position: fixed;
	top: 0;
	left: 0;
	bottom: 0;
	right: 0;
}
// .active{
// 	background-color: #04BE01;
// }

	.order-list .order-head .state-text{
		padding: 4rpx 8rpx; margin-right: 10rpx; border-radius: 4rpx; background: #E2231A;  color:#FFFFFF;
	}
	
	.order-list  .item {
		margin-top: 30rpx;
		padding: 30rpx;
		background: #FFFFFF;
		box-shadow: 0 0 8rpx rgba(0,0,0,.1);
	}

	.order-list .product-list,
	.order-list .one-product {
		padding: 20rpx 0;
		height: 160rpx;
	}

	.one-product .pro-info {
		padding: 0 30rpx;
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 28rpx;
		color: #666666;
	}

	.order-list .cover,
	.order-list .cover image {
		width: 160rpx;
		height: 160rpx;
	}

	.order-list .total-count {
		padding-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: flex-end;
	}

	.total-count .count {
		padding-top: 10rpx;
		color: #666;
		font-size: 28rpx;
	}

	.product-list .total-count {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, .9);
	}

	.product-list .total-count .left-shadow {
		position: absolute;
		top: 0;
		bottom: 0;
		left: -24rpx;
		width: 24rpx;
		overflow: hidden;
	}

</style>
