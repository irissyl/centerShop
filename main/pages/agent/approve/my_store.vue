<template>
	<view>


		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			@scrolltolower="scrolltolowerFunc">




			<view class="prodcut-list-wrap">
				<view class="list">
					<view class="item" v-for="(item,index) in listData" :key="index">
						<view class="" style="display: flex;">
							<!-- <view class="product-cover">
								<image :src="item.rel_val.user.avatarUrl" mode="aspectFit"></image>
							</view> -->
							<view class="product-info">

								<view class="product-title" style="font-size: 30rpx;">{{$nw("门店")}}：{{ item.store_name }}</view>
								<view class="product-title1">{{$nw("店主")}}：{{ item.linkman }}</view>
								<view class="product-title1" @click="makePhone(item.phone)">{{$nw("联系人")}}：<text style="color: #55aaff;">{{ item.phone }}</text> </view>
								<view class="product-title2" @click="nav(item)">{{$nw("地址")}}：{{ item.address }}	<span class="icon iconfont icon-dizhi1" style="font-size: 28rpx;">{{$nw("导航")}}</span></view>

							</view>
						</view>

	<view class="" style="height: 80rpx;width: 100%;"></view>
						<view class="ind2">
						
							<view class="buy4" :style="{background:getbutton?
								  getbutton[0].buttonOne:'#E2231A',
								  color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}" @click="edit(item)">
								门店编辑
							</view>
							<view class="buy4" :style="{background:getbutton?
								 getbutton[1].buttonTwo:'#E2231A',
								 color:getbutton?getbutton[1].buttonTwoColor:'#ffffff'}" @click="detail(item)">
								门店详情
							</view>

						</view>


					</view>

				</view>
			</view>






			<view class="" v-if="state_active !=2">
				<view class="d-c-c p30" v-if="listData.length==0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
				</view>
				<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
			</view>

		</scroll-view>


		<view class="commodity_screen" @click="hideModel" v-if="bohui_status"></view>


	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more.vue"
	import Tabbar from '@/components/tabbar/tabbar.vue';
	export default {
		components: {
			uniLoadMore,
			Tabbar,
		},
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*状态选中*/
				state_active: 0,
				/*顶部刷新*/
				topRefresh: false,
				/*数据*/
				listData: [{

				}],
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
				order_price: 0,
				/*有没有等多*/
				no_more: false,
				/*是否正在加载*/
				loading: true,
				status: 3,
				setting: {},
				total: {
					total_profits: 0,
					total_self: 0,
					total_join: 0,
				},
				show_menu: false,
				bohui_status: false,
				reject_reason: "",
				item: {},
				search: "",
				user_id: uni.getStorageSync("user_id")
			}
		},
		computed: {

			/*加载中状态*/
			loadingType() {
				if (this.loading) {
					return 1;
				} else {

					if (this.listData.length != 0 && this.no_more) {
						return 2;
					} else {
						return 0;
					}
				}
			},

			active() {
				let that = this
				return (state_active, value) => {
					if (state_active === value) {
						return Object.assign(that.setColor(true), {
							'border-bottom': '2px solid ' + that.getMainColor()
						})
					}
				}
			},
			bgcColor() {
				var obj = {
					backgroundColor: this.setBackgroundColor().backgroundColor + " !important",
					border: this.setBackgroundColor().border + " !important"
				}
				return obj
			},
			textColor() {
				return flag => {
					flag = !!flag
					return this.setColor(flag)
				}
			},
			getbutton() {
				return this.setButton().button
			}

		},
		onShow() {
			// 设置全局颜色
			this.setGlobalColor()
			this.listData = [];
			/*获取订单列表*/
			this.getData();
			let self = this;
			let curPage = getCurrentPages();
			let route = curPage[curPage.length - 1].route; //获取当前页面的路由
			self._get('index/tabbar', {}, function(res) {
				if (res.code == 1) {
					if (res.data.tabbar) {
						for (var i = 0; i < res.data.tabbar[0].data.length; i++) {
							if (res.data.tabbar[0].data[i].linkUrl == "plus2/pages/pushagainst/index") {
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
				console.log("self.show_menu", self.show_menu)
			})
		},
		mounted() {
			this.init();
		},
		onLoad(opt) {
			console.log(opt)

			this.state_active = 3


		},
		methods: {
			makePhone(phone){
				uni.makePhoneCall({
					phoneNumber:""+phone
				})
			},
			nav(item){
				uni.openLocation({
					latitude: parseFloat(item.latitude),
					longitude: parseFloat(item.longitude),
					name:item.store_name,
					address:item.address,
					success: function() {
						console.log('success');
					}
				});
			},
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.phoneHeight = res.windowHeight;
						self.scrollviewHigh = self.phoneHeight;
					}
				});
			},

			/*状态切换*/
			stateFunc(e) {
				console.log(11111, e);
				let self = this;
				if (self.state_active != e) {
					self.page = 1;
					self.loading = true;
					self.state_active = e;
					self.listData = [];
					self.status = e;
					self.getData();
				}
			},
			re_applay() {
				this.is_apply_store_num(this, function(re) {
					if (re) {
						uni.navigateTo({
							url: "/pages/store/settled"
						})
					} else {
						uni.showToast({
							title: "门店申请已达上限，申请失败",
							icon: "none"
						})
					}
				})


			},
			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {
				let self = this;
				if (self.no_more) {
					return;
				}
				self.page++;
				self.getData();

			},
			edit(item){//门店编辑
				uni.navigateTo({
					url:"/pages/store/edit_settled?store_id=" + item.store_id
				})
			},
			detail(item) {
				uni.navigateTo({
					url: "/pages/store/detail/detail?store_id=" + item.store_id
				})
			},
			yijiao(item) {
				var self = this;
				//检测是否开启【是否开启绑定上级】如果开启则提示前往绑定上级
				self.is_open_bind_referee_id(self, function(result) {
					if (result.data) {
						uni.showModal({
							title:self.$nw("系统提示："),
							content: "检测到您还未绑定上级，是否前往绑定上级",
							success(re) {
								if (re.confirm) {
									uni.navigateTo({
										url: "/main/pages/login/bindUserId"
									})
								}
							}
						})
					} else {
						//移交上级处理
						uni.showModal({
							title:self.$nw("系统提示："),
							content: "是否移交上级审批",
							success(re) {
								if (re.confirm) {
									self.loading = true;
									self._get('plus.agent.ApproveLog/yijiao', {
										code: "store",
										order_status: 30,
										reject_reason: "",
										order_id: item.rel_val.store_id,
										user_id: item.user_id,
										approve_log_id: item.approve_log_id
									}, function(res) {
										self.loading = false;
										uni.showToast({
											title: "移交成功",
											icon: "none"
										})
										self.getData()
									});
								}
							}
						})
					}
				});
			},
			searchv() {
				this.getData()
			},
			/*获取数据*/
			getData() {
				let self = this;
				self.loading = true;

				self._get('plus.agent.ApproveLog/getStore', {
					type: self.status,
					page: self.page,
					search: self.search,
					code: "store"
				}, function(res) {
					self.loading = true;
					self.loading = false;
					console.log(res)
					self.listData = res.data
					if (self.listData.length > 0) {
						self.no_more = res.data[0].no_more
					} else {
						self.no_more = true
					}

				});





			},

		},

	}
</script>

<style lang="scss">
	.prodcut-list-wrap .list {
		background: #ffffff;
	}

	.prodcut-list-wrap .list .item {
		padding: 20rpx;

		border-bottom: 1px solid #dddddd;
		position: relative;

	}

	.buy {
		position: absolute;
		right: 180rpx;
		bottom: 20rpx;
		width: 140rpx;
		height: 60rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 60rpx;
		color: #fff;
	}

	.buy1 {
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		width: 140rpx;
		height: 60rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 60rpx;
		color: #fff;
	}
	.ind2{
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
		display: flex;
		.buy4 {
			
			width: 150rpx;
			height: 60rpx;
			border-radius: 50rpx;
			text-align: center;
			line-height: 60rpx;
			color: #fff;
			margin-left: 20rpx;
		}
	}
	

	.buy3 {
		margin: auto;
		width: 90%;
		height: 90rpx;
		border-radius: 50rpx;
		text-align: center;
		line-height: 90rpx;
		color: #fff;
		margin-top: 200rpx;
		font-size: 28rpx;
	}

	.prodcut-list-wrap .product-cover {}

	.prodcut-list-wrap .product-cover image {
		width: 160rpx;
		height: 160rpx;
		border: 1rpx solid #f5f5f5;
	}

	.prodcut-list-wrap .product-info {
		flex: 1;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-around;
	}

	.prodcut-list-wrap .product-title {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		font-size: 30rpx;
	}

	.prodcut-list-wrap .product-title1 {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		font-size: 28rpx;
	}

	.prodcut-list-wrap .product-title2 {

		font-size: 28rpx;
	}

	.prodcut-list-wrap .price {
		padding: 8rpx 0;
		color: $dominant-color;
		font-size: 24rpx;
	}

	.prodcut-list-wrap .price .num {
		padding: 0 4rpx;
		font-size: 28rpx;
	}

	.prodcut-list-wrap .already-sale {
		color: #999;
		font-size: 24rpx;
	}

	.prodcut-list-wrap .already-sale .btn-red {
		line-height: 2;
		font-size: 28rpx;
	}

	.fanbo {
		z-index: 1500;
		width: 70%;
		height: 420rpx;
		position: fixed;
		left: 15%;
		top: 30%;
		background: #fff;

		border-radius: 10rpx;

		.fanbo1 {
			width: 100%;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			color: #222222;

			font-weight: 500;
			border-bottom: 3rpx solid #F9F9F9;
		}

		.fanbo2 {
			width: 100%;

			margin-top: 20rpx;

			textarea {
				background: #F9F9F9;
				width: 80%;
				height: 150rpx;
				padding: 20rpx;
				margin: auto;
				color: #999999;

			}
		}

		.fanbo3 {
			width: 100%;
			height: 90rpx;
			text-align: center;
			line-height: 90rpx;
			background: #2799EC;

			color: #fff;
			position: absolute;
			bottom: -5rpx;

			border-radius: 0rpx 0rpx 10rpx 10rpx;
			display: flex;

			.fanbo31 {
				flex: 1;
				line-height: 90rpx;
			}

			.fanbo32 {
				flex: 1;
				line-height: 90rpx;
			}
		}

		.fanbo99 {
			display: flex;
			position: absolute;
			bottom: 0rpx;
			width: 100%;
			border-top: 1rpx solid #eee;

			.fanbo99_1 {
				margin: 0;
				padding: 0;
				flex: 1;
				text-align: center;
				height: 80rpx;
				line-height: 80rpx;

				border-radius: 0;
				background: #fff;
				border-bottom-left-radius: 10rpx;
			}

			.fanbo99_2 {
				margin: 0;
				padding: 0;
				flex: 1;
				text-align: center;
				height: 80rpx;
				line-height: 80rpx;

				background: #fff;
				// background: #2799EC;
				color: #2799EC;
				border-radius: 0;
				border-left: 1rpx solid #eee;
				border-bottom-right-radius: 10rpx;
			}
		}
	}


	.commodity_screen {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: rgba(0, 0, 0, 0.3);
		overflow: hidden;
		color: #fff;
		z-index: 1000;
	}
</style>
