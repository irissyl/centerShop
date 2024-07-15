<template>
	<view>
		<view class="top-tabbar">
			<view :class="status == 0 ? 'tab-item active' : 'tab-item'" :style="[active(status, 0)]" @click="stateFunc(0)">{{$nw("进行中")}}</view>
			<view :class="status == 1 ? 'tab-item active' : 'tab-item'" :style="[active(status, 1)]" @click="stateFunc(1)">{{$nw("砍价成功")}}</view>
			<view :class="status == 2 ? 'tab-item active' : 'tab-item'" :style="[active(status, 2)]" @click="stateFunc(2)">{{$nw("砍价失败")}}</view>
		</view>

		<!--列表-->
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50" @scrolltolower="scrolltolowerFunc">
			<view class="my-bargaing-list">
				<view class="item" v-for="(item, index) in listData" :key="index">
					<!--时间-->
					<view class="datetime d-b-c">
						<text class="f28">{{ item.create_time }}</text>
						<view class="surplus-time" v-if="status == 0">
							<Countdown :config="rturnObjec(item)"></Countdown>
						</view>
					</view>
					<!--商品-->
					<view class="product d-s-s mt30">
						<view class="cover"><image :src="item.file_path" mode="aspectFill"></image></view>
						<view class="info flex-1 ml20 f28">
							<text class="f30 text-ellipsis-2">{{ item.product_name }}</text>
							<view class="mt20">
								<text class="gray9">{{$nw("砍价享")}}：</text>
								<text class="red">{{$nw("¥")}}{{ item.bargain_price }}</text>
								<text class="ml10 gray9 text-l-t f24">{{$nw("原价")}}：{{item.product_price}}</text>
							</view>
							<view class="d-s-c mt10">
								<text class="gray9">{{$nw("完成度")}}：</text>
								<view class="progress">

								</view>
								<text class="red">{{progressReturn(item)}}%</text>
							</view>
						</view>
					</view>
					<!--按钮-->
					<view class="btns mt30 d-b-c">
						<template v-if="item.status==0">
							<text class="gray3">{{$nw("进行中")}}</text>
						</template>
						<template v-if="item.status==1">
							<text class="green">{{$nw("砍价成功")}}</text>
						</template>
						<template v-if="item.status==2">
							<text class="gray">{{$nw("砍价失败")}}</text>
						</template>
						<button type="primary" class="btn-red" :style="[buttonBgc]" @click="gotoDetail(item.bargain_task_id)">{{$nw("查看详情")}}</button>
					</view>
				</view>
				<view class="d-c-c p30" v-if="listData.length == 0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
				</view>
				<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
			</view>
		</scroll-view>

		<!--更多活动-->
		<view class="more-bargaining"><button type="primary" class="btn-red" :style="[buttonBgc]" @click="gotoMore">{{$nw("更多活动")}}</button></view>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more.vue';
import Countdown from '@/components/countdown/countdown.vue';
export default {
	components: {
		uniLoadMore,
		Countdown
	},
	data() {
		return {
			/*是否正在加载*/
			loading: true,
			/*手机高度*/
			phoneHeight: 0,
			/*可滚动视图区域高度*/
			scrollviewHigh: 0,
			/*状态选中*/
			status: 0,
			/*顶部刷新*/
			topRefresh: false,
			/*当前第几页*/
			page: 1,
			/*一页多少条*/
			list_rows: 20,
			/*数据*/
			listData: [],
			/*是否有更多*/
			no_more: false,
			/*倒计时配置*/
			countdownConfig: {
				/*开始时间*/
				startstamp: 0,
				/*结束时间*/
				endstamp: 0,
				/*显示类别*/
				type: 'text',
				/*文字*/
				title: this.$nw("剩余")+"："
			}
		};
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
      return (state_active, value) => {
        if (state_active === value) {
          return Object.assign(this.setColor(true), {'border-bottom': '2px solid ' + this.getMainColor()})
        }
      }
    },

    buttonBgc() {
      return Object.assign(this.setBackgroundColor(), this.setColor())
    }

	},
	onLoad(e) {},
	mounted() {
    this.setGlobalColor()
		this.init();
	
	},
	onShow() {
		/*获取列表*/
		this.getData();
	},
	methods: {
		/*转换参数*/
		rturnObjec(item) {
			return { type: 'text', startstamp: 0, endstamp: item.end_time, title: '剩余' };
		},

		/*返回百分比*/
		progressReturn(item){
			if(item.is_floor==1){
				return 100;
			}else{
				return item.bargain_rate;
			}
		},

		/*初始化*/
		init() {
			let self = this;
			uni.getSystemInfo({
				success(res) {
					self.phoneHeight = res.windowHeight;
					// 计算组件的高度
					let view = uni.createSelectorQuery().select('.top-tabbar');
					view.boundingClientRect(data => {
						let h = self.phoneHeight - data.height;
						let foot_v = uni.createSelectorQuery().select('.more-bargaining');
						foot_v
							.boundingClientRect(data2 => {
								let h2 = h - data2.height;
								self.scrollviewHigh = h2;
							})
							.exec();
					}).exec();
				}
			});
		},

		/*状态切换*/
		stateFunc(e) {
			let self = this;
			if (self.status != e) {
				self.listData = [];
				self.page = 1;
				self.status = e;
				self.getData();
			}
		},

		/*获取数据*/
		getData() {
			let self = this;
			self.loading = true;
			self._get(
				'user.bargain/lists',
				{
					page: self.page,
					list_rows: self.list_rows,
					status: self.status
				},
				function(res) {
					self.loading = false;
					self.listData = self.listData.concat(res.data.list.data);
					self.listData = self.getUnique(self.listData,"bargain_activity_id");
					self.last_page = res.data.list.last_page;
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
						return false;
					}
				}
			);
		},

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

		/*查看详情*/
		gotoDetail(e) {
			uni.navigateTo({
				url: '/plus/pages/bargain/haggle/haggle?bargain_task_id=' + e
			});
		},

		/*查看更多活动*/
		gotoMore() {
			uni.navigateTo({
				url: '/plus/pages/bargain/list/list'
			});
		},

		/*倒计时返回状态*/
		returnValFunc(e, num) {
			console.log(e, num);
		}
	}
};
</script>

<style lang="scss">
.one-product .pro-info {
	padding: 0 30rpx;
	display: -webkit-box;
	overflow: hidden;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	font-size: 28rpx;
	color: #666666;
}

.total-count .count {
	padding-top: 10rpx;
	color: #666;
	font-size: 28rpx;
}

.product-list .total-count {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	background: rgba(255, 255, 255, 0.9);
}

.product-list .total-count .left-shadow {
	position: absolute;
	top: 0;
	bottom: 0;
	left: -24rpx;
	width: 24rpx;
	overflow: hidden;
}

.product-list .total-count .left-shadow::after {
	position: absolute;
	top: 0;
	bottom: 0;
	width: 24rpx;
	right: -12rpx;
	display: block;
	content: '';
	background-image: radial-gradient(rgba(0, 0, 0, 0.2) 10%, rgba(0, 0, 0, 0.1) 40%, rgba(0, 0, 0, 0) 80%);
}

.buy-checkout {
	width: 100%;
}

.buy-checkout .item {
	min-height: 50rpx;
	line-height: 50rpx;
	padding: 20rpx;
	display: flex;
	justify-content: space-between;
	font-size: 28rpx;
}

.buy-checkout .iconfont.icon-weixin {
	color: #04be01;
	font-size: 50rpx;
}

.buy-checkout .iconfont.icon-yue {
	color: #f0de7c;
	font-size: 50rpx;
}

.buy-checkout .item.active .iconfont.icon-xuanze {
	color: #04be01;
}

.my-bargaing-list .item {
	margin-top: 30rpx;
	padding: 30rpx;
	background: #ffffff;
}

.my-bargaing-list .surplus-time {
	padding: 4rpx 16rpx;
	border-radius: 4rpx;
	background: #666666;
	color: #ffffff;
}

.my-bargaing-list .cover,
.my-bargaing-list .cover image {
	width: 160rpx;
	height: 160rpx;
}

.more-bargaining {
	position: fixed;
	padding: 20rpx;
	right: 0;
	bottom: 0;
	left: 0;
	background: #ffffff;
}

.more-bargaining button {
	height: 88rpx;
	line-height: 80rpx;
	border-radius: 40rpx;
}
.more-bargaining .progress{}
</style>
