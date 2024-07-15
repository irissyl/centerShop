<template>
	<view :class="Visible?'product-popup open':'product-popup close'" @touchmove.stop.prevent="" @click="closePopup">
		<view class="popup-bg"></view>
		<view class="main" v-on:click.stop>
			<view class="body p30">
				<view class="group-bd" >

					<view class="form-level d-s-c" style="margin-top: 20rpx;">
						<view class="d-s-c field-name">
							<text class="orange">*</text>
							<text class="gray3">合作项目：</text>
						</view>
						<view class="val flex-1">
							{{evalProject.title}}
						</view>
					</view>
					
					<view class="form-level d-s-c" style="margin-bottom: 20rpx;margin-top: 60rpx;">
						<view class="d-s-c field-name">
							<text class="orange"></text>
							<text class="gray3" style="padding-left: 10rpx;">选择评论：</text>
						</view>
						<scroll-view scroll-y="true" style="height: 220rpx;">
							
							<view 
							 style="float: left; height: 70rpx;line-height: 70rpx;  background: red; border-radius: 15rpx; padding-left: 20rpx;padding-right: 20rpx;margin-bottom: 15rpx;"
							 v-for="(item,index) in cardEval" :key="index"
							@click="time_bucket_click(index)"
							
							:style="'background:'+(item.flag?'#ff1b1e;':'#dfdfdf;')+
							'color:'+(item.flag?'#fff;':'')"
						
							>
								{{item.context}}
							</view>
							<view style="clear: both;">
								
							</view>
						</scroll-view>
					</view>

			
				</view>
			

			</view>

			<view style="height: 50rpx;width: 100%;"></view>

			<view class="btns" >
				<button type="primary" class="confirm-btn" @click="confirmFunc()">确认评价</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/*是否可见*/
				Visible: false,
				/*表单对象*/
				remark: {
					name: '',
					mobile: '',
					remark: ""
				},
				cardEval:[]
			}

		},
		watch: {
			'isPopup': function(n, o) {

				if (n != o) {
					this.Visible = n;
					this.getCardEval();
				}
			}
		},
		props: ['isPopup', 'cardIndexData',"evalProject"],
		methods: {
			getCardEval(){
				//获取名片固定评论
				var self = this;
				self._post('plus.card.card/getCardEval', {}, function(res) {
					self.cardEval = res.data.eval
					console.log(self.cardEval)
					return;
				})
			},
			/*关闭弹窗*/
			closePopup() {
				this.$emit('close', {})
			},
			/*确认提交*/
			confirmFunc() {
				this.createdOrder();
			},
			confirmConcat(){
				uni.makePhoneCall({
					phoneNumber:this.cardIndexData.hz_user.phone
				})
			},
			time_bucket_click(index){
	
				this.cardEval.forEach(function(res){
					res.flag = false;
				})
				this.cardEval[index].flag = true;
			},
			/*创建订单*/
			createdOrder() {
				let self = this;
				let param = {};
				var item = {};
				this.cardEval.forEach(function(res){
					if(res.flag ){
						item = res
					}
				})
				if(JSON.stringify(item).length < 5){
					uni.showToast({
						title: "请选择评价",
						icon: "none"
					})
					return;
				}
				param.project_id = self.evalProject.project_id;
				param.ind =item.ind;
				param.content =item.context;
				param.card_id =self.cardIndexData.info.card_id;
				uni.showModal({
					title: self.$nw("系统提示："),
					content: "是否评价，一次合作只能评价一次，优先显示最近的合作",
					success(re) {
						if (re.confirm) {
							self._post('plus.card.card/EvalCard', param, function(res) {
								uni.showToast({
									title: "评价成功",
									icon: "none"
								})
								self.closePopup()
								return;
							})
						}
					}
				})


			},
			paySuccess: function(result) {
				this.showSuccess('提交成功', () => {
					uni.navigateTo({
						url: '/plus2/pages/cardIndexData/paySuccess'
					});
				});
			},
			payError: function(result) {
				this.showError(this.$nw('订单未支付成功'), () => {
					console.log('payError');
				});
			},


		}
	}
</script>

<style lang="scss">
	.product-popup {}

	.product-popup .popup-bg {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, .6);
		z-index: 99;
	}

	.product-popup .main {
		position: fixed;
		width: 100%;
		bottom: 0;
		min-height: 200rpx;
		max-height: 1200rpx;
		background-color: #fff;
		transform: translate3d(0, 1280rpx, 0);
		transition: transform .2s cubic-bezier(0, 0, .25, 1);
		bottom: env(safe-area-inset-bottom);
		z-index: 99;
	}

	.product-popup.open .main {
		transform: translate3d(0, 0, 0);
	}

	.product-popup.close .popup-bg {
		display: none;
	}

	.product-popup .header {
		height: 120rpx;
		padding: 10rpx 0 10rpx 250rpx;
		position: relative;
		border-bottom: 1px solid #EEEEEE;
	}

	.product-popup .header .avt {
		position: absolute;
		top: -80rpx;
		left: 30rpx;
		width: 200rpx;
		height: 200rpx;
		border: 2px solid #FFFFFF;
		background: #FFFFFF;
	}

	.product-popup .header .stock {
		font-size: 24rpx;
		color: #999999;
	}

	.product-popup .close-btn {
		position: absolute;
		width: 40rpx;
		height: 40rpx;
		top: 10rpx;
		right: 10rpx;
	}

	.product-popup .price {
		color: $dominant-color;
		font-size: 30rpx;
	}

	.product-popup .price .num {
		padding: 0 4rpx;
		font-size: 50rpx;
	}

	.product-popup .old-price {
		margin-left: 10rpx;
		font-size: 30rpx;
		color: #999999;
		text-decoration: line-through;
	}

	.product-popup .body {
		padding: 20rpx 30rpx;
		max-height: 900rpx;
		overflow-y: auto;
	}

	.product-popup .level-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.product-popup .level-box .key {
		font-size: 24rpx;
		color: #999999;
	}

	.product-popup .level-box .icon-box {
		width: 60rpx;
		height: 60rpx;
		border: 1px solid #DDDDDD;
		background: #f7f7f7;
	}

	.product-popup .num-wrap .iconfont {
		color: #666;
	}

	.product-popup .num-wrap.no-stock .iconfont {
		color: #CCCCCC;
	}

	.product-popup .level-box .text-wrap {
		margin: 0 4rpx;
		height: 60rpx;
		border: 1px solid #DDDDDD;
		background: #f7f7f7;
	}

	.product-popup .level-box .text-wrap input {
		padding: 0 10rpx;
		height: 60rpx;
		line-height: 60rpx;
		width: 80rpx;
		text-align: center;
	}

	.specs .specs-list {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-wrap: wrap;
	}

	.specs .specs-list button {
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		font-size: 24rpx;
	}

	.specs .specs-list button:after,
	.product-popup .btns button,
	.product-popup .btns button:after {
		height: 88rpx;
		line-height: 88rpx;
		border: 0;
		border-radius: 0;
	}

	.product-popup .btns .confirm-btn {
		background: $dominant-color;
	}

	// .field-name{
	// 	width: 20%;
	// }
	.body input,
	.body textarea {
		font-size: 20rpx;
	}

	.body input {
		width: 500rpx;
		height: 88rpx;
		line-height: 88rpx;
		background-color: #f3f4f6;
		margin: 10rpx 0;
	}

	.form-level textarea {
		width: 80%;
		font-size: 28rpx;
		height: 68rpx;
		line-height: 34rpx;
		padding: 14rpx 2%;
		resize: none;
		outline: none;
		display: block;
		margin-bottom: 20rpx;
		background: #f4f4f4;
		// border: 1rpx solid #e5e5e5;
	}

	.form-level input {
		width: 80%;
		font-size: 28rpx;
		height: 34rpx;
		line-height: 34rpx;
		padding: 14rpx 2%;
		resize: none;
		outline: none;
		display: block;
		margin-bottom: 20rpx;
		background: #f4f4f4;
	}
	
	
	.yuyue0 {
		width: 100%;
		margin: auto;
		margin-top: 20rpx;
		padding-bottom: 30rpx;
	}
	
	.yuyue {
	
	
		width: 90%;
		margin: auto;
	
		margin-top: 20rpx;
		display: flex;
	
	
	
	
		.yuyue_1 {
	
			flex: 2;
	
			image {
				width: 150rpx;
				height: 150rpx;
				margin-left: 20rpx;
				margin-top: 20rpx;
				border-radius: 2rpx;
	
			}
		}
	
		.yuyue_2 {
			flex: 7;
	
			.yuyue_2_1 {
				width: 95%;
				font-size: 34rpx;
				margin: auto;
				margin-top: 20rpx;
				line-height: 40rpx;
			}
	
			.yuyue_2_3 {
				width: 95%;
				font-size: 30rpx;
				margin: auto;
	
			}
	
			.yuyue_2_4 {
				width: 90%;
				font-size: 30rpx;
				margin: auto;
				margin-top: 5rpx;
				color: #c3c1bb;
			}
	
		}
	}
	
	
</style>