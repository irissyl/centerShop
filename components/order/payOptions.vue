<template>
	<!--支付方式-->
	<view class="buy-checkout" v-if="payTypeList && payTypeList.length > 0">
		<view :class="pay_type === payType.value ? 'item active' : 'item'" 
		v-for="payType in payTypeList"
			:key="payType.payment_id" @click="payTypeFunc(payType)">
			<view class="d-s-c">
				<view class="icon-box d-c-c mr10">
					<!-- <span :class="'icon iconfont ' + payType.icon" :style="'color: ' + payType.icon_color"></span> -->
					<image :src="payType.file_url" style="width: 40rpx;height: 40rpx;"></image>
				</view>
				<text class="key">{{ payType.name }} <text v-if="payType.val">({{$nw("余额")}}：{{payType.val}})</text> <text v-if="need_sel == 0"> ：</text></text>
			</view>
			<view class="icon-box d-c-c" v-if="need_sel == 0"> <span class="icon iconfont icon-xuanze"></span></view>
		</view>
	</view>
</template>

<script>
	export default {
		name: "payOptions",
		data() {
			return {
				pay_type: "",
			}
		},
		props: {
			payTypeList: {
			  type: Array,
			  default: [
			    // {
			    //   'name': '微信',
			    //   'value': 20,
			    //   'en_name': 'wechat',
			    //   'icon': 'icon-weixin',
			    //   'icon_color': '#04BE01',
			    // }
			  ]
			},
			need_sel: {
				type: Number,
				default: 0
			},
			checkedPayType: {
				type: Number,
				default: 0
			}
		},
		watch: {
			checkedPayType(newVal, oldVal) {
				console.log("newVal",newVal)
				if (newVal !== oldVal) {
					this.pay_type = newVal
				}
			}
		},
		mounted(){
			this.pay_type = this.checkedPayType;
		},
		methods: {
			/**
			 * 选择支付方式触发
			 * @param  obj:{
				 * payment_id:"支付ID",
				 * pay_type:"支付方式"
			 }
			 */
			payTypeFunc(obj) {
				this.pay_type = obj.payment_id
				this.$emit('click',obj);
			},

		}

	}
</script>

<style scoped></style>
