<template>
	<view :class="Visible?'product-popup open':'product-popup close'" 
	@touchmove.stop.prevent="" @click="closePopup"
	  style="z-index: 800;">
		<view class="popup-bg"  style="z-index: 800;"></view>
		<view class="main"  style="z-index: 800;" v-on:click.stop>
			<view class="body p30">
				<view class="group-bd">

					<view class="form-level d-s-c">
						<view class="d-s-c field-name">
							<text class="gray3">姓名：</text>
						</view>
						<view class="val flex-1" >
							{{item.name}} <text style="color: #40acff;margin-left: 20rpx;" @click="copys(item.name,1)">复制</text>
						</view>
					</view>
					
					<view class="form-level d-s-c">
						<view class="d-s-c field-name">
							<text class="gray3">手机号：</text>
						</view>
						<view class="val flex-1" >
							{{item.mobile}} <text style="color: #40acff;margin-left: 20rpx;" @click="copys(item.mobile,2)">复制</text>
						</view>
					</view>
					
					<view class="form-level d-s-c">
						<view class="d-s-c field-name">
							<text class="gray3">公司名：</text>
						</view>
						<view class="val flex-1" >
							{{item.company}} <text style="color: #40acff;margin-left: 20rpx;" @click="copys(item.company,3)">复制</text>
						</view>
					</view>
					
					<view class="form-level d-s-c">
						<view class="d-s-c field-name">
							<text class="gray3">地址：</text>
						</view>
						<view class="val flex-1" >
							{{item.address}} <text style="color: #40acff;margin-left: 20rpx;" @click="copys(item.address,4)">复制</text>
						</view>
					</view>
					
					<view class="closed" 
					style="background: linear-gradient(to right, #f2b237, #ffda98);" 
					@click="closePopup">
						关闭
					</view>

					
				</view>

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
					remark: '',
					num: 1,
					time_bucket_id:""
				},
			}

		},
		watch: {
			'isPopup': function(n, o) {

				if (n != o) {
					this.Visible = n;
				}
			}
		},
		props: ['isPopup', 'item'],

	

		methods: {
			copys(val,type){//复制
			console.log(val)
				uni.setClipboardData({
					data: val,
					success: function() {
						uni.showToast({
							title: this.$nw("复制成功"),
							duration: 2000
						})
					},
					fail: function() {
						uni.showToast({
							title: '复制失败',
							duration: 2000
						})
					}
				});
			},
			/*关闭弹窗*/
			closePopup() {
				this.$emit('close', {})
			},


		}
	}
</script>

<style lang="scss">
	.closed{
		width: 200rpx;
		height: 60rpx;
		border-radius: 15rpx;
		background: linear-gradient(to right, #f2b237, #ffda98);
		margin: auto;
		text-align: center;
		line-height: 60rpx;
		color: #fff;
		margin-top: 30rpx;
	}
	.product-popup {
		z-index: 2000;
	}

	.product-popup .popup-bg {
		position: fixed;
		right: 0;
		top: 20%;
		left: 5%;
		background: rgba(0, 0, 0, .6);
		z-index: 99;
		width: 90%;
		border-radius: 15rpx;
	}

	.product-popup .main {
		position: fixed;
		width: 90%;
		bottom: 10%;
		left:5%;
		min-height: 200rpx;
		max-height: 1200rpx;
		background-color: #fff;
		transform: translate3d(0, 1280rpx, 0);
		transition: transform .2s cubic-bezier(0, 0, .25, 1);
		// bottom: env(safe-area-inset-bottom);
		z-index: 99;
		border-radius: 15rpx;
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
		max-height: 1000rpx;
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
</style>