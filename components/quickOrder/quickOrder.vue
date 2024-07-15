<template>
	<view>
		<view v-if="isPopup" class="commodity_screen"></view>
		<view v-if="isPopup" class="qo">
			<!-- 产品快速下单详情 -->
			<!-- 正常 -->
			<SpecDetail @addCart="addCarts" v-if="type=='detail'" :isPopup="isPopup_q" :productModel="productModel_q" @close="closePopup">

			</SpecDetail>
			<!-- 限时秒杀 -->
			<SpecSeckill v-if="type=='seckill'" :isPopup="isPopup_q" :productModel="productModel_q" @close="closePopup">

			</SpecSeckill>
			<!-- k砍价商品 -->
			<SpecBargain v-if="type=='bargain'" :isPopup="isPopup_q" :productModel="productModel_q" @close="closePopup">

			</SpecBargain>
			<!-- 限时拼团 -->
			<SpecAssemble v-if="type=='assemble'" :isPopup="isPopup_q" :productModel="productModel_q"
				@close="closePopup">

			</SpecAssemble>
			<!-- 积分 -->
			<SpecPoint v-if="type=='point'" :isPopup="isPopup_q" :productModel="productModel_q"
				@close="closePopup">
			
			</SpecPoint>
		</view>



	</view>
</template>

<script>
	import SpecDetail from './detail/spec.vue';
	import SpecSeckill from './seckill/Spec.vue';
	import SpecBargain from './bargain/Spec.vue';
	import SpecAssemble from './assemble/Spec.vue';
	import SpecPoint from './point/Spec.vue';
	export default {
		components: {
			SpecDetail, //正常快速下单
			SpecSeckill, //限时秒杀快速下单
			SpecBargain, //砍价活动快速下单
			SpecAssemble, //限时拼团快速下单
			SpecPoint,//积分快速下单
		},
		data() {
			return {
				isPopup: false,
				productModel: {}
			}
		},
		props: ["isPopup_q", "productModel_q", "type"],
		watch: {
			'isPopup_q': function(n, o) {
				if (n != o) {
					this.isPopup = n;
					this.productModel = this.productModel_q;
				}
			}
		},
		methods: {
			closePopup() {
				this.$emit('close', {})
			},
			addCarts(){
				this.$emit('addCart', {})
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '@/components/quickOrder/menu.scss';
	/*使屏幕变暗  */

	.commodity_screen {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		opacity: 0.3;
		overflow: hidden;
		z-index: 1000;
		color: #fff;
	}

	.qo {
		width: 90%;
		min-height: 50%;
		max-height: 70%;
		position: fixed;
		top: 22%;
		left: 5%;
		background: #fff;
		border-radius: 12rpx;
		border-bottom-left-radius: 20rpx;
		border-bottom-right-radius: 20rpx;
		z-index: 5000;

		.main {
			width: 100%;
			height: 100%;
		}
	}





	.container {
		min-height: 40vw;
		max-height: 120vw;
		overflow: scroll;
		margin-bottom: 50rpx;
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
		border-radius: 12rpx;
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
		// max-height: 600rpx;
		height: 70%;
		// border: #007AFF 1px solid;
		overflow-y: auto;

		.body-scroll {
			height: 100%;
		}
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
		width: 100%;
		border-bottom-left-radius: 12rpx;
		border-bottom-right-radius: 12rpx;
	}
</style>
