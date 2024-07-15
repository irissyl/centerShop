<template>
	<view class="grade">
		<view class="title d-c-c" v-if="(!order||(order&&order.order_status==30)
		||(order&&order.order_status==20))  && listData.length > 0">
			<text class="line left-line"></text>
			<text class="name">{{$nw("请选择升级等级")}}</text>
			<text class="line right-line"></text>
		</view>
		<view class="grade-list" v-if="!order||(order&&order.order_status==30)||(order&&order.order_status==20)">
			<view  v-for="(item, index) in listData" :key="index" @click="chooseGrade(item)">
				<view  :class=" type==item.grade_id?'item red-border':'item'">
					<view  class="grade-info">
						<view class="grade-title">{{ item.name }}</view>
						<view class="d-b-c mt20" v-if="item.level_money !=0">
							<view class="gray">
								{{$nw("升级金额")}}
							</view>
							<view class="price" v-if="item.level_money>0.00">
								{{$nw("¥")}}
								<text class="num">{{ item.level_money }}</text>
							</view>
							<view class="price" v-else>
								<text class="num">{{$nw("免费")}}</text>
							</view>
						</view>
					</view>
				</view>

			</view>
			<!-- 没有记录 -->
		</view>
		<view class="group bg-white f28" v-if="order">
			<view class="group-hd border-b-e">
				<view class="left"><text class="min-name">{{$nw("最近申请记录")}}</text></view>
			</view>
			<view class="p-20-0" v-if="order.oldgrade">
				<text class="gray9">{{$nw("升级前等级")}}：</text>
				<text>{{ order.oldgrade.name }}</text>
			</view>
			<view class="p-20-0" v-if="order.grade">
				<text class="gray9">{{$nw("申请等级")}}：</text>
				<text>{{ order.grade.name }}</text>
			</view>
			<view class="p-20-0">
				<text class="gray9">{{$nw("申请时间")}}：</text>
				<text>{{ order.create_time }}</text>
			</view>
			<view class="p-20-0">
				<text class="gray9">{{$nw("审核结果")}}：</text>
				<text>{{ order.order_text }}</text>
			</view>
			<view class="p-20-0" v-if="order.reject_reason">
				<text class="gray9">{{$nw("拒绝原因")}}：</text>
				<text>{{ order.reject_reason}}</text>
			</view>
		</view>


		<view class="buy-checkout" v-if="grade_id!=0">
			<block v-if="money>=0">

				<view class="p20"><button type="default"  @click="goPay(10)" class="btn-red f30 mt30">{{$nw("下一步")}}</button></view>
			</block>
			<block v-else>
				<view class="p20"><button type="default"  @click="gotoApply(10)" class="btn-red f30 mt30">{{$nw("申请")}}</button></view>
			</block>
		</view>

		<view class="banner-image d-c-c">
			<image :src="setting.file_path" mode="widthFix"></image>
		</view>
	</view>
</template>

<script>
import Popup from '@/components/uni-popup.vue';
	import {pay} from '@/common/pay.js'
	import payOptions from "@/components/order/payOptions";
export default {
	components: {
		Popup,
		payOptions
	},
	data() {
		return {
		
			type:'no',
			grade_id:0,
			/*数据*/
			listData: [],
			setting:{},
			order:{},
			money:0,
			/*是否显示支付类别弹窗*/
			payTypeList:[],
				/*支付方式*/
			pay_type:10,
		};
	},

	onShow() {
    this.setGlobalColor()
		uni.showLoading({
			title:this.$nw("加载中")
		});
		/*获取个人中心数据*/
		this.getData();
	},
	computed: {
		/*加载中状态*/

	},
	onPullDownRefresh() {

	},
	methods: {
		/*获取数据*/
		getData() {

			let self = this;
			self._get(
				'user.grade/getGrade',
				{},
				function(res) {
					self.listData = res.data.list;
					self.setting = res.data.setting;
					self.order = res.data.last_order;
					self.payTypeList = res.data.payTypeList;
					for(var i=0;i<self.payTypeList.length;i++){
						if(self.payTypeList[i].value == 10){
							self.pay_type = self.payTypeList[i].value
						}
					}
					var apply = res.data.apply;
					uni.hideLoading();
					if(!apply['is_open']){
						self.showSuccess(self.$nw("未开启会员升级"), () => {
							uni.redirectTo({
								url:'/user/pages/index/index'
							});
						});
						return false;
					}
					if(!apply['can_apply']){
						self.showSuccess( self.$nw("请先实名认证后在升级"), () => {
							uni.redirectTo({
								url:'/plus/pages/certify/apply/apply?from_url=user_apply'
							});
						});
						return false;
					}
				}
			);
		},
			/*购买*/
			payTypeFunc(objs){
				let self = this;
				self.pay_type = objs.value;
			},
			goPay(){
				let self = this;
				//检测是否开启【是否开启绑定上级】如果开启则提示前往绑定上级
				self.is_open_bind_referee_id(self,function(result){
					if(result.data){
						uni.showModal({
							title:self.$nw("系统提示："),
							content:"检测到您还未绑定上级，是否前往绑定上级",
							success(re) {
								if(re.confirm){
									uni.navigateTo({
										url:"/main/pages/login/bindUserId"
									})
								}
							}
						})
					}else{
						uni.showLoading({
							title: self.$nw("正在提交")+'...'
						});
						var payType = self.pay_type;
						let pay_source = 'wx';
						// #ifdef  H5
						pay_source = 'mp';
						// #endif
						self._post('user.grade/buy', {
							id: self.grade_id,
							pay_source: pay_source,
							pay_type: payType,
						}, function(res) {
							pay(res, self, self.paySuccess, self.payError);
						});
					}
				});
				
			},
			paySuccess:function(result){
				this.showSuccess(self.$nw("请稍等，后台正在审核"), () => {
					uni.navigateTo({
						url:'/user/pages/index/index'
					});
				});
			},
			payError:function(result){
				this.showError(this.$nw("订单未支付成功"), () => {
					console.log('payError');
				});
			},
		/*推荐商品跳转*/
        chooseGrade(e){
			console.log(e)
			this.type=e.grade_id;
			this.grade_id=e.grade_id;
			this.money = parseFloat(e.level_money);
			console.log(this.money);
		},
		gotoApply(){
			let self = this;
			uni.showLoading({
				title:self.$nw("正在提交") +'...'
			});

			self._post('user.grade/apply', {
				id: self.grade_id,
			}, function(res) {
				if(res.code==1){
					uni.showToast({
						title:res.data
					})
				}
			});
		}
	}
};
</script>

<style lang="scss">
.grade{ margin-top: 40rpx;height: 100%;}
.grade .title{ heigth:100rpx; font-size:30rpx;}
.grade .title .name{ margin:0 20rpx; font-size:30rpx;}
.grade .title .line{position: relative; display: block; width: 100rpx; border-top:1px solid red;}
.grade .title .line::after{ position: absolute; content:''; display: block; width: 16rpx; height:16rpx; border-radius:50%; background: red;}
.grade .title .left-line::after{ right:0; top:-9rpx;}
.grade .title .right-line::after{ left:0; top:-9rpx;}
.grade-list {
	padding: 20rpx;
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	flex-wrap: wrap;
}
.grade-list .item {
	width: 346rpx;
	border-radius: 20rpx;
	p-right: 10rpx;
	margin-bottom: 20rpx;
	padding-bottom: 20rpx;
	overflow: hidden;
	background: #ffffff;
	box-shadow: 0 0 8rpx rgba(0,0,0,.1);
	margin-bottom: 10rpx;
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
.grade-list .grade-info{ padding: 0 24rpx;}
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
	color: $dominant-color;
}
.grade-list .price .num {
	font-size: 30rpx;
	font-weight: bold;
}
</style>
