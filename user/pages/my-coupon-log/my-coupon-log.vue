<template>
	<view>
		<view class="top-tabbar">
			<view :class="state_active == 0 ? 'tab-item active' : 'tab-item'" :style="[active(state_active, 0)]" @click="stateFunc(0)">{{$nw("全部")}}</view>
			<view :class="state_active == 1 ? 'tab-item active' : 'tab-item'" :style="[active(state_active, 1)]" @click="stateFunc(1)">{{$nw("转让")}}</view>
			<view :class="state_active == 2 ? 'tab-item active' : 'tab-item'" :style="[active(state_active, 2)]" @click="stateFunc(2)">{{$nw("接收")}}</view>
		</view>

		<!--列表-->
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
		 @scrolltoupper="scrolltoupperFunc" @scrolltolower="scrolltolowerFunc">
			<view class="p30">
				<view style="background-color: #FFFFFF;height: 3rem;" class="item-wrap mb20" v-for="(item, index) in DataList" :key="index">
					<view style="float: left;width: 40%;text-align: center;margin-top: .5rem;">
						<view>{{item.coupon_name}}</view>
						<view>{{item.transfer_time}}</view>
					</view>
					<view style="float: left;text-align: center;width: 40%;margin-top: .5rem;">
						<view>
							<view v-if="item.type == 1">{{$nw("转让给")}}</view>
							<view v-if="item.type == 0">{{$nw("接收于")}}</view>
						</view>
						<view>
							<view v-if="item.type == 1">{{item.receive_name}}</view>
							<view v-if="item.type == 0">{{item.transfer_name}}</view>
						</view>
					</view>
					<view style="float: right;width: 15%;text-align: center;line-height: 3rem;">
						x{{item.count}}{{$nw("张")}}
					</view>
					<view style="clear: both;"></view>
				</view>
				<view class="">
					<view class="bottom-refresh">
						<view class="d-c-c p30" v-if="loading">
							<text class="gray3">{{$nw("加载中")}}...</text>
						</view>
						<view class="d-c-c p30" v-if="no_more ">
							<text class="gray3">~~{{$nw("加载完成")}}~~</text>
						</view>
					</view>
				</view>
				<view class="d-c-c p30" v-if="DataList.length==0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
				</view>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*状态选中*/
				state_active: 0,
				/*列表*/
				DataList: {},
				no_more: false,
				loading: false,
				data_type: 'all',
				transfer_setting:true,
			};
		},
		mounted() {
      this.setGlobalColor()
			/*初始化*/
			this.init();
			/*获取数据*/
			this.getData();
		},
    computed: {
      active() {
        return (state_active, value) => {
          if (state_active === value) {
            return Object.assign(this.setColor(true), {'border-bottom': '2px solid ' + this.getMainColor()})
          }
        }
      },
    },
		methods: {
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
							self.scrollviewHigh = h;
						}).exec();
					}
				});
			},

			/*获取数据*/
			getData() {

				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				let data_type = self.data_type;
				self._get('user.coupon/couponLogList', {
					data_type: data_type,
				//	user_id:uni.getStorageSync('user_id'),
				}, function(res) {
					uni.hideLoading();
					console.log(res)
					self.DataList = res.data.list;
				});
			},

			/*状态切换*/
			stateFunc(e) {
				let self = this;
				if(self.state_active!=e){
					if (e == 0) {
						self.data_type = 'all';
					}
					if (e == 1) {
						self.data_type = 'transfer';
					}
					if (e == 2) {
						self.data_type = 'receive';
					}
					self.state_active = e;
					self.getData();
				}
			},

			/*可滚动视图区域到顶触发*/
			scrolltoupperFunc() {
				console.log('滚动视图区域到顶');
			},

			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {
				console.log('滚动视图区域到底');
			},

			/*查看规则*/
			lookRule(item) {
				item.rule = true;
			},

			/*关闭规则*/
			closeRule(item) {
				item.rule = false;
			},
			/* 转让优惠券  */
			transfer(){
				let self = this
				if(self.DataList.length == 0){
					uni.showModal({
					    title: self.$nw("提示"),
					    content: self.$nw("您还没有优惠券"),
						showCancel:false,
					});
					return false;
				}
				uni.navigateTo({
					url: '/user/pages/my-coupon-transfer/my-coupon-transfer'
				});
			},
			/* 转让记录 */
			log(){
				uni.navigateTo({
					url: '/user/pages/my-coupon-log/my-coupon-log'
				});
			}
		}
	};
</script>

<style></style>
