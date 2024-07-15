<template>
	<view class="order-refund-detail pb100">
		<!--售后状态-->
		<view class="order-state d-s-c">
			<view class="icon-box"><span class="icon iconfont icon-gantanhao"></span></view>
			<view class="state-cont flex-1">
				<view class="state-txt d-b-c">
					<text class="desc f34">{{detail.state_text}}</text>
				</view>
			</view>
			<view class="dot-bg"></view>
		</view>

		<!--商品信息-->
		<view class="p30 mt20 bg-white">
			<view class="one-product border-b-e d-s-c pb20">
				<view class="cover">
					<image :src="detail.orderproduct.image ? detail.orderproduct.image.file_path : err_img" mode="aspectFit"></image>
				</view>
				<view class="flex-1">
					<view class="pro-info">{{detail.orderproduct.product_name}}</view>
					<view class="pt10 p-0-30">
						<text class="f24 gray9">
							<!--斤:10斤; 颜色:红; 出产地:北方; 销量:大于1000; 大小:直径1分米; 口感:甜;-->
						</text>
					</view>
				</view>
			</view>
			<view class="d-e-c pt20 lh150">
				<view class="f24">
					 {{$nw("商品金额")}}：
					<text class="red">{{$nw("¥")}}{{detail.order_master.order_price}}</text>
				</view>
			</view>
			<view class="d-e-c pt10 lh150">
				<view class="f24">
					 {{$nw("订单实付金额")}}：
					<text class="red">{{$nw("¥")}}{{detail.order_master.pay_price}}</text>
				</view>
			</view>
		</view>

		<!-- 已退款金额 -->
		<view class="group bg-white" v-if=" detail.status.value == 20 && detail.type.value == 10 ">
			<text class="gray9">{{$nw("已退款金额")}}：</text>
			<text class="gray9">{{$nw("¥")}}{{ detail.refund_money }}</text>
		</view>

		<!--申请售后信息-->
		<view class="group bg-white f24">
			<view class="p-20-0 border-b f34">
				{{$nw("申请退货信息")}}
			</view>
			<view class="p-20-0 f28">
				<text class="gray9">{{$nw("售后类型")}}：</text>
				<text>{{detail.type.text}}</text>
			</view>
			<view class="p-20-0 f28">
				<text class="gray9">{{$nw("申请原因")}}：</text>
				<text>
					{{detail.apply_desc}}
				</text>
			</view>
			<view class="p-20-0 upload-list d-s-s f28">
				<text class="gray9">{{$nw("申请凭证")}}：</text>
				<view class="d-s-s f-w">
					<block v-if="detail.image.length>0">
						<view class="item" v-for="(imgs,img_num) in detail.image" :key="img_num">
							<image :src="imgs ? imgs.file_path : err_img" mode="aspectFit"></image>
						</view>
					</block>
					 <block v-else>
						 {{$nw("无")}}
					 </block>
				</view>
			</view>
		</view>

		<!-- 售后信息-->
		<view v-if="detail.status.value == 10" class="group bg-white">
			<view class="p-20-0 border-b f34">
				{{$nw("拒绝理由")}}
			</view>
			<view class="p-20-0">
				<text class="red f28">{{ detail.refuse_desc }}</text>
			</view>
		</view>

		<!--退货地址-->
		<view class="group bg-white" v-if="detail.is_agree.value == 10">
			<view class="p-20-0 border-b f34">
				{{$nw("退货地址")}}
			</view>
			<view class="pt30 f28">
				<text class="gray9">{{$nw("收货人")}}：</text>
				<text>{{detail.address.name}}</text>
			</view>
			<view class="pt30 f28">
				<text class="gray9">{{$nw("联系电话")}}：</text>
				<text>{{detail.address.phone}}</text>
			</view>
			<view class="pt30 f28">
				<text class="gray9">{{$nw("详情地址")}}：</text>
				<text>{{detail.address.detail}}</text>
			</view>
			<view class="pt30 d-b-c f28" v-if="detail.express_no">
				<view class="">
					<text class="gray9">{{$nw("物流公司")}}：</text>
					<text>{{detail.express.express_name}}</text>
				</view>
				<view class="">
					<text class="gray9">{{$nw("物流单号")}}：</text>
					<text>{{detail.express_no}}</text>
				</view>
			</view>
			<view class="mt20 pb20 border-t gray9">
				<view class="pt20">
					· {{$nw("未与卖家协商一致情况下，请勿寄到付或平邮")}}
				</view>
				<view class="pt10">
					· {{$nw("请填写真实有效物流信息")}}
				</view>
			</view>
		</view>
		<!-- 填写物流信息 -->
		<form @submit="formSubmit" v-if="detail.type.value == 10 && detail.is_agree.value == 10 && detail.is_user_send == 0 " report-submit>
			<view class="group bg-white">
				<view class="p-20-0 border-b f34">
					{{$nw("填写物流信息")}}
				</view>
                <view class="p-20-0 d-s-c">
                    <view class="gray9">{{$nw("物流公司")}}：</view>
					<view class="flex-1 p20 border">
					    <picker mode="selector" @change="onExpressChange" :range="expressList"
							range-key="express_name" :value="index">
					        <text v-if="index > -1 ">{{expressList[index].express_name}}</text>
					        <text v-else class="col-80">{{$nw("请选择物流公司")}}</text>
					    </picker>
					</view>
                </view>
                <view class="p-20-0 d-s-c">
                    <view class="gray9">{{$nw("物流单号")}}：</view>
                    <view class="flex-1 border">
                        <input class="p10" :placeholder="$nw('请填写物流单号')" name="express_no"></input>
                    </view>
                </view>
				<view class="mt20">
				    <button class="btn-red" :style="[active]" formType="submit">{{$nw("确认发货")}}</button>
				</view>
            </view>
        </form>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				expressList: {},
				index: -1,
				order_refund_id: 0,
				/*退货详情*/
				detail: {
					address: {},
				},
				express_id: 0,
				/*消息模板*/
				temlIds: [],
				err_img:''
			}
		},
		onLoad(e) {
      this.setGlobalColor()
			this.order_refund_id = e.order_refund_id;
		},
		mounted() {
			/*获取详情*/
			this.getData();
		},
    computed: {
      active() {
        return Object.assign(this.setBackgroundColor(), this.setColor())
      },
    },
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				let order_refund_id = self.order_refund_id;
				self._get(
					'user.refund/detail', {
						order_refund_id: order_refund_id,
						platform: self.getPlatform()
					},
					function(res) {
                        uni.hideLoading();
						self.detail = res.data.detail;
						self.expressList = res.data.expressList;
						self.temlIds = res.data.template_arr;
						self.err_img = res.data.default_img.file_path
					}
				);
			},
			/*选择物流*/
            onExpressChange: function(e) {
				this.index=e.target.value;
                this.express_id=this.expressList[this.index].express_id;
			},

			/*发货*/
            formSubmit: function(e) {
				let self = this;
				var formdata = e.detail.value;
				formdata.order_refund_id = self.order_refund_id;
				formdata.express_id = self.express_id;
				let callback = function(){
					uni.showLoading({
						title: self.$nw("正在提交"),
						mask: true
					});
					self._post('user.refund/delivery', formdata, function(res) {
						uni.hideLoading();
						uni.showToast({
							title: res.msg,
							duration: 3000,
							complete: function() {
								uni.navigateTo({
									url: '/main/pages/order/refund/detail/detail?order_refund_id=' + self.order_refund_id,
								});
							}
						});
					});
				};
				self.subMessage(self.temlIds, callback);
			},
		}
	}
</script>

<style>
.order-refund-detail .btn-red{
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	box-shadow: 0 8rpx 16rpx 0 rgba(226,35,26,.6);}
</style>
