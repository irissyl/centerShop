<template>
	<view>
		<view class="points-top d-b-c" :style="'background:'+getMainColor()+';'">
			<view class="" :style="'color:'+getMainTextColor()+';'">
				<text class="f26">{{$nw("积分总数")}}：</text>
				<text class="f34 fb">{{points}}</text>
			</view>
			<view style="display: flex;">
				<!-- <button v-if="is_wopen == 1" type="default" class="btn-red-border" @click="gotoWithdraw">{{$nw("转换佣金")}}</button> -->
				<!-- <button type="default" class="btn-red-border" @click="gotoCharge">{{$nw("充值")}}</button> -->
				<button v-if="is_open" type="default" class="btn-red-border"
					@click="gotoShop">{{$nw("积分商城")}}</button>
			</view>

		</view>
		
		<view class="d-b-c p-0-10" v-if="release">
			<view class="">
				<text class="f26">{{$nw("冻结积分数")}}：</text>
				<text class="f34 fb">{{release.amount}}</text>
			</view>
			<view style="display: flex;">
				<text>{{$nw("释放速度")}}：{{release.release_rate}}/{{$nw("天")}}</text>
			</view>
		
		</view>
		<!--列表-->

		<view class="p-0-30 bg-white">
			<view class="d-b-c border-b p-30-0" v-for="(item, index) in tableData" :key="index">
				<view class="d-s-s f-w d-c flex-1">
					<text class="f24">{{item.describe.length>0?item.describe:item.remark}}</text>
					<text class="pt10 gray9 f22">{{item.create_time}}</text>
				</view>
				<view class="red" v-if="item.value>0">+{{item.value}}</view>
				<view class="red" v-else="">{{item.value}}</view>
			</view>
			<!-- 没有记录 -->
			<view class="d-c-c p30" v-if="tableData.length==0 && !loading">
				<text class="iconfont icon-wushuju"></text>
				<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
			</view>
			<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
		</view>
		<service :itemData="t_service"></service>
		
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more.vue";
	import service from '@/components/diy/service/service';
	
	export default {
		components: {
			uniLoadMore,
			service,
		
		},
		data() {
			return {
					t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*顶部刷新*/
				topRefresh: false,
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*数据列表*/
				tableData: [],
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 20,
				no_more: false,
				loading: true,
				points: 0,
				is_open: false,
				is_wopen:0,
				release:null
			};
		},
		computed: {

			/*加载中状态*/
			loadingType() {
				if (this.loading) {
					return 1;
				} else {
					if (this.tableData.length != 0 && this.no_more) {
						return 2;
					} else {
						return 0;
					}
				}
			}
		},
		mounted() {
			this.setGlobalColor()

		},
		onReachBottom() {
			let self = this;
			if (self.page < self.last_page) {
				self.page++;
				self.getData();
			}
			self.no_more = true;

		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$nw("积分")
			});
			/*获取数据*/
			this.getData();
		},
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				let page = self.page;
				let list_rows = self.list_rows;
				self._get('points.log/index', {
					page: page || 1,
					list_rows: list_rows,
				}, function(data) {
					self.loading = false;
					self.points = data.data.points;
					self.is_open = data.data.is_open;
					self.is_wopen = data.data.is_wopen;
					self.release = data.data.release;
					self.tableData = self.tableData.concat(data.data.list.data);
					self.tableData = self.getUnique(self.tableData, "log_id");
					self.last_page = data.data.list.last_page;
					if (data.data.list.last_page <= 1) {
						self.no_more = true;
						return false;
					}

				});
			},

			/*跳转积分商城*/
			gotoShop() {
				uni.navigateTo({
					url: '/plus/pages/points/list/list'
				});
			},
			gotoCharge() {
				uni.navigateTo({
					url: '/user/pages/points/charge'
				});
			},
			gotoWithdraw() {
				uni.navigateTo({
					url: '/user/pages/points/withdraw'
				});
			},

		}
	};
</script>

<style>
	.points-top {
		height: 100rpx;
		padding: 0 30rpx;
		color: #FFFFFF;
		background: #f44f47;
	}
</style>