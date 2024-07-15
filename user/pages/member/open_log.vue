<template>
	<view class="">
		
		<view class="group bg-white f28" v-for="(item,index) in order" :key="index" >
		
			<view class="p-20-0" v-if="item.oldgrade">
				<text class="gray9">{{$nw("支付金额：")}}</text>
				<text>{{ item.pay_price}}</text>
			</view>
		
			<view class="p-20-0" v-if="item.oldgrade">
				<text class="gray9">{{$nw("开通前等级：")}}</text>
				<text>{{ item.oldgrade.name }}</text>
			</view>
			<view class="p-20-0" v-if="item.grade">
				<text class="gray9">{{$nw("开通等级：")}}</text>
				<text>{{ item.grade.name }}</text>
			</view>
			
			<view class="p-20-0">
				<text class="gray9">{{$nw("支付结果：")}}</text>
				<text>{{ item.state_text }}</text>
			</view>
			<view class="p-20-0">
				<text class="gray9">{{$nw("审核结果")}}：</text>
				<text>{{ item.order_text }}</text>
			</view>
			<view class="p-20-0" v-if="item.reject_reason">
				<text class="gray9">{{$nw("拒绝原因")}}：</text>
				<text>{{ item.reject_reason}}</text>
			</view>
			
			<view class="p-20-0">
				<text class="gray9">{{$nw("申请开通时间：")}}</text>
				<text>{{ item.create_time }}</text>
			</view>
		</view>
		<template v-if="order.length <= 0">
			<view class="none-data-box">
				<image src="http://imgh5.y01.cn/20210606225550dd5f35541.png" mode="widthFix"></image>
				<text>未获取到数据</text>
		
			</view>
		</template>
	</view>
</template>

<script>

	export default {

		data() {
			return {
				order: [],
			}
		},
	
		onShow() {
			var self = this;
			self._get(
				'user.grade/getUpGradeOrder', {},
				function(res) {
					console.log("res", res)
					self.order = res.data.order;
				})
	
		},
		methods: {
		
		}
	}
</script>

<style>
</style>