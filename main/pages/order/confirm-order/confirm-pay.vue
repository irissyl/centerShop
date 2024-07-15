<template>
	<view>
		<scroll-view>
			<view class="price">
				<text style="font-size: 38rpx;">￥</text>{{order_pay_price}}
			</view>
			<view class="title">
				{{product_name}}
			</view>
			
		</scroll-view>
		
		<button class="sure_pay" type="primary" @click="submitOrder">{{$nw("确认支付")}}</button>
	</view>
</template>

<script>
	import {
		pay
	} from '@/common/pay.js';
	import utils from '../../../../common/utils'
	export default {
		data() {
			return {
				params:{
					
				},
				url:"",
				temlIds:"",
				order_pay_price:0,
				wx_code:"",
				openid:"",
				order_type:""
			};
		},
		onLoad(e) {
			let self = this;
			self.setGlobalColor()
			var obj = JSON.parse(e.obj);
			self.url = obj.url
			self.params = obj.params
			self.temlIds = obj.temlIds;
			self.order_pay_price = obj.order_pay_price;
			self.product_name = obj.product_name
			self.code = self.getUrlCode().code
			self.order_type = obj.order_type;
			self._post("auth.WxMn/getOpenId", {wx_code:self.code}, function(result) {
				let openid = result.data.openid;
				self.openid = openid
				self.params.openid = openid
			})
			
		},
		methods:{
			getOpenId(code) { // 截取url中的code方法
			  var url = location.search
			  this.winUrl = url
			  var theRequest = new Object()
			  if (url.indexOf("?") != -1) {
			    var str = url.substr(1)
			    var strs = str.split("&")
			    for (var i = 0; i < strs.length; i++) {
			      theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1])
			    }
			  }
			  return theRequest
			},
			submitOrder(){
				var self = this;
				let callback = function() {
					self._post(self.url, self.params, function(result) {
						pay(result, self)
					})
				}
				self.subMessage(self.temlIds, callback)
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #fff;
	}
	.price{
		text-align: center;
		width: 100%;
		height: 100rpx;
		font-size: 60rpx;
		color: #2f2f2f;
		font-weight: 600;
		margin-top: 150rpx;
	}
	.title{
		width: 90%;
		text-align: center;
		font-size: 30rpx;
		
		margin: auto;
	}
	.sure_pay{
		width: 90%;
		margin: auto;
		position: fixed;
		bottom: 50rpx;
		left: 5%;
	}
</style>
