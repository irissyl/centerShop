<template>
	<view class="">
		<view class="search">
			<image class="search1" src="/static/icon/search.png" mode=""></image>
			<input placeholder-style="font-size: 28rpx;font-weight: 500;color: #999999;" placeholder="请输入产品名称"
				class="search2" type="text" @confirm="search" v-model="keyword">
			<view style="font-size: 30rpx; width: 80rpx;height: 80rx;float: right;line-height: 80rpx;" @click="search">
				{{$nw("搜索")}}
			</view>


		</view>

		<scroll-view scroll-y="true" :style="'height:'+(height-65)+'px;'" style="margin-top: 10rpx;"
			@scrolltolower="scrolltolowerFunc">

			<view class="nf">

				<view v-for="(item,index) in apply" :key="index">
					<view class="applyt1" @click="chooseC(index,item.flag)">


						<view class="applyt1_2">

							<view class="applyt1_2_1">
								{{item.product_name}}
							</view>

						</view>

						<view class="applyt1_3" style="line-height:100rpx ;font-size: 28rpx;color: #999;">
								{{$nw("选择")}}
						</view>

						<view style="clear: both;"></view>
					</view>
					<view v-if="(index+1) < apply.length" style="border: 2rpx solid #F2F2F2;width: 100%;">

					</view>


				</view>

			</view>
			<view v-if="apply.length <=0"
				style="font-size: 28rpx;color: #999; width: 100%;text-align: center;line-height: 100rpx;">
				{{$nw("未找到产品")}}
			</view>
		</scroll-view>


	</view>
</template>

<script>
	const app = getApp()
	import uniLoadMore from "@/components/uni-load-more.vue";
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				keyword: "",
				height: "",
				apply: [],
				tempStatus: "",
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
				/*是否正在加载*/
				loading: true,
				agents: []

			}
		},
		onLoad() {
			var self = this;
			uni.getSystemInfo({
				success(res) {
					self.height = res.windowHeight;

				}
			})


		},
		onShow() {
			var self = this;
			self.apply = [];
			self.getData();
		},
		computed: {

			/*加载中状态*/
			loadingType() {

				if (this.loading) {
					return 1;
				} else {
					if (this.quesireList.length != 0 && this.no_more) {
						return 2;
					} else {
						return 0;
					}
				}
			},


		},
		methods: {
			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {
				let self = this;
				if (self.no_more) {
					return;
				}
				self.page++;
				if (self.page <= self.last_page) {
					self.getData();
				} else {
					self.no_more = true;
				}
			},
			getData() {
				var self = this;
				self._get('plus.agent.achievement/getProduct', {
					keyword: self.keyword,
					page: self.page,
					list_rows: self.list_rows
				}, function(data) {
					self.loading = false;

					if (data.data.val.length == 0) {
						uni.showToast({
							title: self.$nw("已经到底了"),
							icon: "none"
						})
					} else {

						self.apply = self.apply.concat(data.data.val);
						self.apply = self.getUnique(self.apply, "product_id");
						self.last_page = data.data.last_page
						if (self.last_page <= 1 || self.last_page < self.page) {
							self.no_more = true;
						} else {
							self.no_more = false;
						}

					}

				});

			},
			chooseC(index, flag) {
				console.log(index)
				console.log(flag)
				console.log(this.tempStatus)

				// 触发全局的 选择门店 自定义事件,其他页面监听接收
				uni.setStorageSync("chooseProduct", this.apply[index])
				uni.navigateBack({
					delta: 1
				});
			},

			search() {
				this.page = 1;
				console.log("??")
				this.apply = []
				this.getData();
			},



		}
	}
</script>

<style lang="scss">
	page {
		background: #F5F5F5;
	}

	.nf1 {
		font-size: 24rpx;
		font-weight: 500;
		color: #666666;
		width: 93%;
		margin: auto;
		margin-top: 32rpx;
	}

	.nf {
		width: 100%;
		background: #fff;
		margin-top: 20rpx;

		.applyt1 {
			width: 93%;
			margin: auto;

			position: relative;

			.right {
				position: absolute;
				right: 20rpx;
				top: 20rpx;
				font-size: 24rpx;

				font-weight: 500;
				color: #666666;

				.right1 {
					width: 140rpx;
					height: 52rpx;
					background: #F64E54;
					border-radius: 28rpx;
					text-align: center;
					line-height: 52rpx;
					font-size: 22rpx;

					font-weight: 500;
					color: #FFFFFF;
				}
			}

			.applyt1_1 {
				width: 60rpx;
				height: 80rpx;
				border-radius: 16rpx;
				float: left;
				margin-top: 24rpx;
			}

			.applyt1_2 {
				// margin-top: 20rpx;


				.applyt1_2_1 {
					width: 85%;
					font-size: 28rpx;
					height: 100rpx;

					line-height: 100rpx;
					font-weight: 500;
					color: #333333;
					float: left;
					margin-left: 10rpx;

				}



			}
		}
	}

	.item {
		position: fixed;
		bottom: 30rpx;
		left: 5%;

		.item1 {
			height: 88rpx;
			background: linear-gradient(180deg, #2DA7DC 0%, #2D73DC 100%);
			border-radius: 180px 180px 180px 180px;
			font-size: 28rpx;

			font-weight: 500;
			color: #FFFFFF;
			line-height: 88rpx;

			image {
				width: 32rpx;
				height: 32rpx;
			}

		}
	}


	.search {
		height: 80rpx;
		background: #FFFFFF;
		border-radius: 44rpx;
		background: #fff;
		margin: auto;
		margin-top: 20rpx;
		width: 93%;

		.search1 {
			width: 40rpx;
			height: 40rpx;
			float: left;
			margin-top: 20rpx;
			margin-left: 32rpx;
		}

		.search2 {
			font-size: 28rpx;

			font-weight: 500;
			color: #999999;
			float: left;
			height: 80rpx;
			line-height: 80rpx;
			margin-left: 20rpx;
			width: 67%;

		}

		.search3 {
			width: 40rpx;
			height: 40rpx;
			margin-top: 20rpx;
			float: left;
		}

	}

	.bottom {
		position: fixed;
		bottom: 0rpx;
		left: 0rpx;
		width: 100%;

		background: #fff;

		.no {
			font-size: 28rpx;

			font-weight: 500;
			color: #FFFFFF;
			height: 88rpx;
			background: #1F1A17;
			border-radius: 16rpx;
			text-align: center;
			line-height: 88rpx;
			width: 90%;
			margin: auto;
			position: fixed;
			bottom: 20rpx;
			left: 5%;
		}
	}
</style>