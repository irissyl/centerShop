<template style="background-color: rgba(227, 227, 227, 100); ">
	<view v-if="!loadding" class="uni-padding-wrap">
		<view class="uni-flex uni-column" style="border-radius: 5px; background-color:#FFFFFF;margin-bottom: 14rpx;">
			<view class="uni-flex uni-row" style="height: 238rpx; margin-bottom: 14rpx;">
				<view class="uni-flex" style="-webkit-justify-content: center;justify-content: center;-webkit-align-items: center;align-items: center;">
					<image :src="detail.image.file_path"></image>
				</view>
				<view class="uni-flex uni-column" style="-webkit-flex: 1;flex: 1;-webkit-justify-content: space-between;justify-content: center;">
					<view class="uni-flex uni-row">
						<view class="text" style="padding-left: 40rpx;">{{$nw("名称")}}</view>
						<view class="text" style="padding-left: 40rpx;">{{detail.product_name}}</view>
					</view>
					<view class="uni-flex uni-row">
						<view class="text" style="padding-left: 40rpx;">{{$nw("编码")}}</view>
						<view class="text" style="padding-left: 40rpx;">{{detail.code}}</view>
					</view>
					<view class="uni-flex uni-row">
						<view class="text" style="padding-left: 40rpx;">{{$nw("规格")}}</view>
						<view class="text" style="padding-left: 40rpx;">{{detail.product_attr}}</view>
					</view>
					<view class="uni-flex uni-row">
						<view class="text" style="padding-left: 40rpx;">{{$nw("数量")}}</view>
						<view class="text" style="padding-left: 40rpx;">{{detail.number}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="jiu">
			<view class="title">{{$nw("管理")}}</view>
			<view class="uni-body">
				<view class="uni-flex uni-row">
					<view class="uni-flex uni-column" @click="gotogiving(detail.storage_id)">
						<view class="flex-item flex-item-V">
							<image src="http://imgh5.y01.cn/20210606232147a97580491.png"></image>
						</view>
						<view class="flex-item flex-item-V name" style="text-align: center;">
							{{$nw("转赠")}}
						</view>
					</view>

					<view class="uni-flex uni-column" @click="gotodelivery(detail.storage_id)">
						<view class="flex-item flex-item-V">
							<image src="http://imgh5.y01.cn/202106062321449aec25732.png"></image>
						</view>
						<view class="flex-item flex-item-V name" style="text-align: center;">
							{{$nw("提货")}}
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="shuoming" style="background-color:#FFFFFF;border-radius: 5px;">
			<view class="title">{{$nw("提示说明")}}</view>
			<view class="uni-text">
				1、{{$nw("下单超出7天不退")}}
			</view>
			<view class="uni-text">
				2、
			</view>
			<view class="uni-text">
				3、
			</view>
		</view>
		<Tabbar></Tabbar>
	</view>
</template>

<script>
	import '@/common/uni.css';
	import Tabbar from '@/components/tabbar/tabbar.vue';
	export default {
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				/*酒id*/
				storage_id: 0,
				/*酒详情*/
				detail: {},
			};
		},
		onLoad(e) {
			this.storage_id = e.storage_id;
		},
		mounted() {
      this.setGlobalColor()
			uni.showLoading({
				title: this.$nw("加载中")
			});
			/*获取酒详情*/
			this.getData();
		},
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				let storage_id = self.storage_id;
				self._get(
					'plus.storage.storage/detail', {
						storage_id: storage_id
					},
					function(res) {
						self.detail = res.data.detail;
						self.loadding = false;
						uni.hideLoading();
					}
				);
			},
			/*跳转提货页面*/
			gotodelivery(e) {
				uni.navigateTo({
					url: '/user/pages/storage/delivery?storage_id=' + e
				});

			},
			/*跳转赠送页面*/
			gotogiving(e) {
				uni.navigateTo({
					url: '/user/pages/storage/giving?storage_id=' + e
				});

			},
		}
	}
</script>

<style>
	.uni-padding-wrap {
		padding: 0 20rpx;
		width: 710rpx;
	}

	.img {
		width: 100%;
		height: 300rpx;
	}

	.uni-flex image {
		margin-left: 16rpx;
		width: 200rpx;
		height: 200rpx;
		border-radius: 5px;
	}

	.dingzhi {
		height: 280rpx;
		margin-bottom: 14rpx;
		background-color: #FFFFFF;
		border-radius: 5px;
	}


	.dingzhi .uni-row {
		-webkit-flex: 1;
		flex: 1;
		height: 200rpx;
		align-items: center;
	}

	.dingzhi .uni-flex .uni-column {
		margin-right: 50rpx;
	}

	.dingzhi .uni-flex image {
		display: block;
		margin: auto;
	}

	.dingzhi .uni-flex .uni-column .tltle {
		text-align: center;
	}

	.jiu {
		margin-bottom: 24rpx;
		background-color: #FFFFFF;
		border-radius: 5px;
	}

	.title {
		font-size: 16px;
		height: 80rpx;
		line-height: 80rpx;
		padding-left: 10rpx;
	}

	.jiu .uni-row {
		margin-top: 20rpx;
		-webkit-flex-wrap: wrap;
		flex-wrap: wrap;
		-webkit-flex: 1;
		flex: 1;
		margin-bottom: 24rpx;
	}

	.jiu .text {
		padding: 0 35rpx;
		height: 112rpx;
		/* border: 1rpx solid #444444; */
		border-radius: 5px;
		line-height: 112rpx;
		text-align: center;
		/* color: #777; */
		font-size: 28rpx;
		margin-right: 35rpx;
		margin-bottom: 14rpx;
	}

	.jiu .uni-flex .uni-column {
		padding-right: 10rpx;
		display: block;
		margin: auto;
	}

	.uni-flex .uni-column .text {
		text-align: left;
		padding-left: 84rpx;
		padding-top: 10rpx;
		font-size: 14px;
	}

	.shuoming .uni-text {
		padding-left: 20rpx;
	}

	.flex-item-V image {
		display: block;
		margin: auto;
		width: 80rpx;
		height: 80rpx;
	}

	.flex-item-V .name {
		text-align: center;
		padding-left: 10rpx;
	}
</style>
