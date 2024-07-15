<template>
	<view class="">
		<view class="i_one">
			<view class="i_one_1" @click="close"></view>
			<view class="i_one_2">
				<view class="i_one_20">
					<view class="i_one_2_1">
						<view class="i_one_2_1_1" 
						v-for="(item,index) in odata.arr" 
						@click="jump(item,index)"
						:key="index">
							<image v-if="index == 0" class="i_one_2_1_1_1" :src="item.image"></image>
							<view v-if="index == 0" class="i_one_2_1_1_2" style="text-align: center;">
								{{item.text}}
							</view>
							
							
							<image v-if="index == 1 && item.status == 0" class="i_one_2_1_1_1" :src="item.image"></image>
							<image v-if="index == 1 && item.status == 1" class="i_one_2_1_1_1" :src="item.image1"></image>
							<view v-if="index == 1&& item.status == 0" class="i_one_2_1_1_2" style="text-align: center;">
								{{item.text}}
							</view>
							<view v-if="index == 1&& item.status == 1" class="i_one_2_1_1_2" style="text-align: center;">
								{{item.text1}}
							</view>
							
							<!-- #ifdef MP-WEIXIN -->
							 <button open-type="share"></button>
							<!-- #endif -->
							
							
							
						</view>
						<view style="clear: both;">

						</view>

					</view>
					<view class="i_one_2_2">
						<view class="i_one_2_2_2" @click="close">
							取消
						</view>
					</view>
				</view>

			</view>

		</view>
	</view>
</template>

<script>
	const app = getApp()
	export default {
		data() {
			return {
				height: "",
				show_flag: false,
			}
		},
		props:["odata"],
		onLoad() {
			var self = this;
			uni.getSystemInfo({
				success(res) {
					self.height = res.windowHeight - app.globalData.customBar;

				}
			})


		},
		methods: {
			
			close() {
				this.$emit("closez", {})
			},
			sure() {
				console.log("操作")
			},
			jump(obj,index){
				console.log(obj);
				console.log(index);
				if(index == 0){
					if(obj.val){
						uni.makePhoneCall({
							phoneNumber:obj.val
						})
					}
					
				}else if(index == 1){
					//收藏视频
					let self = this;
					self._get('product.collect/add', {
						id: obj.collect_id,
						product_id: self.odata.video_id,
						type:"collect_video"
					}, function(res) {
						if (res.code) {
							uni.showToast({
								title:  obj.status==0 ? self.$nw("收藏成功") : self.$nw(
									"取消成功"),
								duration: 2000,
								icon: 'none'
							});
							self.$emit("closez", {})
						}
					});
				}
			},


		}
	}
</script>

<style lang="scss">
	.i_one {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0rpx;
		left: 0rpx;
		z-index: 10000;


		.i_one_1 {
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.6);
			position: fixed;
			top: 0rpx;
			left: 0rpx;


		}

		.i_one_2 {
			width: 100%;
			position: fixed;
			bottom: 0%;
			left: 0%;
			height: 394rpx;
			background: #FFFFFF;
			border-top-left-radius: 16rpx;
			border-top-right-radius: 16rpx;


			.i_one_20 {

				position: relative;
				height: 354rpx;
				width: 92%;
				margin: auto;
				// padding-left: 70rpx;
				margin-top: 48rpx;


				.i_one_2_1 {

					height: 150rpx;
					width: 100%;
					display: -webkit-inline-box;

					.i_one_2_1_1 {
						width: 50%;
						/* #ifdef H5 */
						display: -webkit-inline-box;
						/* #endif */
						
						// margin-right: 65rpx;

						height: 150rpx;
						position: relative;
						.i_one_2_1_1_1 {

							width: 72rpx;
							height: 72rpx;
							display: block;
							margin: 0 auto;

						}

						.i_one_2_1_1_2 {
							font-size: 28rpx;
							font-family: PingFang SC-Medium, PingFang SC;
							font-weight: 500;
							color: #333333;
						}
					}
				}

				.i_one_2_2 {
					width: 100%;
					height: 80rpx;
					line-height: 80rpx;
					position: absolute;
					bottom: 100rpx;
					left: 0rpx;
					border-top: 2rpx solid #F2F2F2;

					.i_one_2_2_1 {
						font-size: 28rpx;
						font-family: PingFang SC-Medium, PingFang SC;
						font-weight: 500;
						
						text-align: center;
						height: 70rpx;
						line-height: 70rpx;
						margin-top: 20rpx;
						
					}

					.i_one_2_2_2 {
						font-size: 28rpx;
						font-family: PingFang SC-Medium, PingFang SC;
						font-weight: 500;
						color: #999999;
						text-align: center;
						height: 70rpx;
						line-height: 70rpx;
					}
				}
			}

		}
	}
</style>