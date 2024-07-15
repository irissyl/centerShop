<template>
	<view>
		<view class="shop_c" :style="'background:'+getMainColor()+';'">
			<view class="shop_c1">
				<view class="dyna0" v-for="(item,index) in dynamic" :key="index">
					<view class="dyna">
						<view class="dyna1">
							<image :src="item.user.avatarUrl"></image>
						</view>
						<view style="flex: 0.2;">

						</view>
						<view class="dyna2">
							<view class="dyna2_1" :style="'color:'+getTextColorGrey()+';'" @click="zuopin_click(item)">
								{{item.user.name}}
							</view>
							<view class="dyna2_3">
								<image v-if="index < 3" v-for="(itemA,indexA) in item.images" class="tdmic1"
									:src="itemA.file_path" @click="pre(indexA,item.images)"></image>
								<view style="clear: both;">

								</view>
							</view>
							<view class="dyna2_2" @click="zuopin_click(item)" :style="'color:'+getTextColorGrey()+';'">
								<!-- #ifdef H5 -->
								<text style="white-space: pre-wrap;" v-html="formatWord(item.content)"></text>
								<!-- #endif -->
								<!-- #ifdef MP-WEIXIN -->
								<view v-html="formatContent(item.content)"></view>
								<!-- #endif -->
								<!-- #ifdef APP -->
								<view v-html="formatContent(item.content)"></view>
								<!-- #endif -->
							</view>
						</view>


					</view>
					<view style="clear: both;">

					</view>

					<view class="dyna4" @click="zuopin_click(item)">
						{{item.time}}
						<image src="../../static/evl.png"></image>
					</view>
				</view>


				<template v-if="!dynamic.length">
					<view class="none-data-box">
						<image class="none-data-icon" src="http://imgh5.y01.cn/20210606225550dd5f35541.png"
							mode="aspectFill"></image>
						<text>未获取到动态</text>
					</view>
				</template>

			</view>

		</view>

	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	export default {
		props: ["dynamic"],
		data() {
			return {

			};
		},
		created() {
			// 设置全局颜色
			this.setGlobalColor()

		},
		methods: {
			pre(index, imgs) {
				var n_im = [];
				for (var i = 0; i < imgs.length; i++) {
					n_im.push(imgs[i].file_path);
				}
				uni.previewImage({
					urls: n_im,
					current: index
				})
			},
			zuopin_click(e) {
				uni.navigateTo({
					url: "/plus2/pages/dynamic/detail?dynamic_id=" + e.dynamic_id
				})
			},
			formatContent(e) {
				return utils.format_content(e);
			},

		}
	}
</script>

<style lang="scss">
	.none-data-icon {
		width: 200rpx !important;
		height: 150rpx;
	}

	.shop_c {
		.dyna0 {
			padding-bottom: 20rpx;

			.dyna4 {
				width: 94%;
				margin: auto;
				font-size: 26rpx;
				color: #aaaaaa;
				position: relative;
				text-indent: 115rpx;

				image {
					width: 40rpx;
					height: 40rpx;
					position: absolute;
					right: 0rpx;
					top: 10rpx;
				}
			}

			.dyna {
				width: 95%;
				margin: auto;


				margin-top: 20rpx;
				display: flex;


				.dyna1 {
					flex: 1.5;


					image {
						width: 100rpx;
						height: 100rpx;

						border-radius: 50%;
						margin-top: 20rpx;
					}
				}

				.dyna2 {
					flex: 8.5;


					.dyna2_1 {
						height: 50rpx;

						line-height: 50rpx;
						font-size: 32rpx;
						font-weight: 500;
						margin-top: 20rpx;
					}

					.dyna2_2 {
						max-height: 170rpx;

						display: -webkit-box;
						word-break: break-all;
						text-overflow: ellipsis;
						font-size: 28rpx; //自适应字体
						overflow: hidden;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 3; //设置 需要显示的行数
						line-height: 40rpx;
						// width: 94%;
						margin: auto;
						margin-top: 10rpx;
					}

					.dyna2_3 {
						.tdmic1 {
							width: 170rpx;
							height: 170rpx;
							border-radius: 15rpx;
							float: left;
							margin-top: 10rpx;
							border: 1rpx solid #f5f5f5;

							margin-right: 20rpx;

						}

					}

				}
			}
		}


	}


	.shopName {
		font-size: 14px;
		font-family: PingFang SC;
		font-weight: 500;
		line-height: 20px;
		color: #333333;
		background-color: #FFFFFF;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;
	}

	.newPrice {
		font-size: 16px;
		font-family: DIN;
		font-weight: bold;
		line-height: 14px;
		color: #FF0909;
	}

	.shop_con {
		width: 47%;
		height: 520rpx;
		background-color: #FFFFFF;
		z-index: 800;
		margin-top: 20rpx;
		box-shadow: 0px 6px 16px 2px rgba(220, 220, 220, 0.2);
		border-radius: 16rpx;
		float: left;
		margin-left: 2%;

		.item_title {
			font-size: 28rpx;
			font-family: PingFang SC-Bold, PingFang SC;
			font-weight: bold;
			color: #333333;
			-webkit-background-clip: text;

			display: -webkit-box;
			overflow: hidden;
			text-overflow: ellipsis;
			word-wrap: break-word;
			white-space: normal !important;
			-webkit-line-clamp: 2;
			-webkit-box-orient: vertical;

		}

		.shop_con0 {
			width: 100%;
			position: relative;
			z-index: 500;
			background-color: #FFFFFF;
			// height: 400rpx;
			border-radius: 16rpx 16rpx 0 0;

			image {
				width: 100%;
				height: 100%;
				z-index: 200;
				min-height: 400rpx;
				border-radius: 16rpx 16rpx 0 0;
			}

			.shop_con0_name {
				background: linear-gradient(-45deg, transparent 20px, #0e171d 0);
				z-index: 500;
				padding-left: 15rpx;
				padding-right: 50%;
				height: 50rpx;
				text-align: center;
				line-height: 50rpx;
				position: absolute;
				top: 0rpx;
				left: 0rpx;
				color: #fff;
				font-weight: 600;
				font-size: 28rpx;
			}

		}


		.oldprice {
			text-decoration: line-through;
			font-size: 12px;
			font-family: PingFang SC;
			font-weight: 400;
			line-height: 17px;
			color: #CCCCCC;
			z-index: 800;
			background-color: #FFFFFF;
		}

		.manjian {
			border: 1px solid #f68d8d;
			padding: 3px;
			color: #f68d8d;
			z-index: 800;
			background-color: #FFFFFF;
		}

	}
</style>