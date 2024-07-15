<template>
	<view class="" :style="'background:'+getMainColor()+';'">
		<Ad location_id="dynamic_top" :interval="1500"></Ad>	
		<dynamic :dynamic="dynamic" @zuopin_click="zuopinclick"></dynamic>
		<image class="dynaimage" @click="dynaimage" src="/static/dynamic.png"></image>

		<Tabbar v-if="show_menu"></Tabbar>
	</view>
</template>

<script>
	const app = getApp()
	import dynamic from "@/components/comment/dynamic.vue"
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import Ad from '@/components/ad/ad.vue';
	export default {
		components: {
			Ad,
			Tabbar,
			dynamic
		},
		data() {
			return {
				height: "",
				show_menu: false,
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
				dynamic: [],
			}
		},
		mounted() {
			console.log("触发11111")
			this.getData();
		},
		onShow() {
			
		},
		onLoad() {
			var self = this;
			// self.setGlobalColor()

			uni.getSystemInfo({
				success(res) {
					self.height = res.windowHeight;
					console.log("self.height", self.height)
				}
			})
		},
		onReachBottom() {
			console.log("碰底触发")
			this.page++;
			this.getData();
		},
		created() {
			var self = this;
			let curPage = getCurrentPages();
			let route = curPage[curPage.length - 1].route; //获取当前页面的路由
			self._get('index/tabbar', {}, function(res) {
				console.log("--", res.data.tabbar[0].data)
				if (res.code == 1) {
					if (res.data.tabbar) {
						for (var i = 0; i < res.data.tabbar[0].data.length; i++) {
							var str = res.data.tabbar[0].data[i].linkUrl;
							str = str.substring(0, ("plus2/pages/dynamic/dynamic").length).trim();
							if (str == "plus2/pages/dynamic/dynamic") {
								self.show_menu = true;
								break;
							}
						}
					} else {
						self.show_menu = false;
					}

				} else {
					self.show_menu = false;
				}

			})
		},
		methods: {
			dynaimage() {
				uni.navigateTo({
					url: "/plus2/pages/dynamic/rel_dynamic"
				})
			},
			getData() {
				var self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				})
				self._get('plus.dynamic.Dynamic/index', {
					page: self.page,
					list_rows: self.list_rows,

				}, function(res) {
					self.loading = false;
					if(res.data.list.data.length <= 0){
						self.page--;
					}
					self.dynamic = self.dynamic.concat(res.data.list.data);
					self.dynamic = self.getUnique(self.dynamic, "dynamic_id");
					self.last_page = res.data.list.last_page;
					uni.hideLoading()
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}

				});
			},

		}
	}
</script>

<style lang="scss">
	

	.dynaimage {
		width: 150rpx;
		height: 150rpx;
		position: fixed;
		bottom: 300rpx;
		right: 20rpx;
	}

	.tdmic5 {
		width: 100%;


		.tdmic50 {
			width: 95%;
			margin: auto;

			.tdmic51 {
				width: 80rpx;
				float: left;

				image {

					width: 72rpx;
					height: 72rpx;
					border-radius: 50%;
				}
			}

			.tdmic52 {
				float: left;
				width: 478rpx;
				height: 72rpx;
				background: #EDEEF0;
				border-radius: 40rpx;
				opacity: 1;
				margin-left: 20rpx;
				text-indent: 50rpx;
				font-size: 24rpx;
				line-height: 72rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #999999;
			}
		}

	}

	.tdmic4 {
		width: 100%;
		background: #fff;
		// margin-top: 20rpx;
		margin-bottom: 2rpx;

		.tdmic41 {

			width: 95%;
			margin: auto;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 32rpx;
			font-family: PingFang SC-Bold, PingFang SC;
			font-weight: bold;
			color: #333333;
			margin-bottom: 4rpx;
		}



	}

	.tdmic {
		width: 100%;
		background: #fff;
		padding-bottom: 32rpx;

		.tdmic1 {
			width: 95%;
			margin: auto;
			max-height: 702rpx;
			border-radius: 16rpx;
			margin-left: 2.5%;

		}

		.tdmic2 {
			width: 95%;
			margin: auto;
			font-size: 36rpx;
			font-family: PingFang SC-Bold, PingFang SC;
			font-weight: bold;
			color: #333333;
			margin-top: 32rpx;
		}

		.tdmic3 {
			width: 95%;
			margin: auto;
			font-size: 24rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
			margin-top: 20rpx;
		}
	}
</style>