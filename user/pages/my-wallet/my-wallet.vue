<template>
	<view class="p-0-0 bg-white">
		<view class="points-top d-b-c" :style="'background:'+getMainColor()+';'">
			<view class="" :style="'color:'+getMainTextColor()+';'">
				<text class="f26">{{$nws(getAppinfo().balance_text)}}：</text>
				<text class="f34 fb">{{balance}}</text>
			</view>
			<!-- #ifndef APP -->
			<!-- <view style="display: flex;padding-top: 10rpx;">
				<button type="default" 
				v-if="getAppinfo().open_wx_recharge == 1"
				class=""
				 style="height:70rpx;line-height:70rpx;" 
				 @click="gotoCharge">{{$nws(getAppinfo().balance_word_text)}}</button>
			</view> -->
			<!-- #endif -->
			
		
		</view>
	<!-- 	<view class="points-top d-b-c">
			<view style="display: flex;padding-top: 10rpx;">
				<button type="default" class=""
				 style="font-size:34rpx;height:90rpx;line-height:90rpx;" 
				 @click="gotoCharge">{{getAppinfo().balance_text}}充值</button>
			</view>
		</view> -->
		<!--列表-->
		<view class="p-0-30">
			<view class="d-b-c border-b p-30-0" v-for="(item, index) in tableData" :key="index">
				<view class="d-s-s f-w d-c flex-1">
					<text class="30">{{ item.scene.text }}</text>
					<text class="pt10 gray9 f22">{{ item.create_time }}</text>
				</view>
				<view class="red" v-if="item.money > 0">+{{ item.money }}{{$nw("元")}}</view>
				<view class="red" v-else="">{{ item.money }}{{$nw("元")}}</view>
			</view>
			<!-- 没有记录 -->
			<view class="d-c-c p30" v-if="tableData.length == 0 && !loading">
				<text class="iconfont icon-wushuju"></text>
				<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
			</view>
			<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
		</view>
		
			<service :itemData="t_service"></service>
			
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more.vue';
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
			loading: true,
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
			balance:0
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
			    title: this.$nw("我的钱包")
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
			self.loading = true;
			self._get(
				'balance.log/lists',
				{
					page: page || 1,
					list_rows: list_rows
				},
				function(data) {
					self.loading = false;
					self.tableData = self.tableData.concat(data.data.list.data);
					self.tableData = self.getUnique(self.tableData,"log_id");
					self.last_page = data.data.list.last_page;
					self.balance = data.data.balance;
					if (data.data.list.last_page <= 1) {
						self.no_more = true;
						return false;
					}
				}
			);
		},
		gotoCharge(){
			uni.navigateTo({
			    url: '/user/pages/my-wallet/recharge'
			});
		}
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
