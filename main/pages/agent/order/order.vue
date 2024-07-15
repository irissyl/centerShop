<template>
	<view>

		<view class="top-tabbar">
			<view :class="state_active == item.value? 'tab-item active' : 'tab-item'" :style="[active(state_active, item.value)]" @click="stateFunc(item.value)" v-for="(item,index) in tableList"
			 :key="index">{{item.text}}</view>
		</view>

		<!--列表-->
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
		 @scrolltolower="scrolltolowerFunc">
			<view class="p-0-30 bg-white">
				<view class="border-b p-20-0" v-for="(item,index) in tableData" :key="index">
					<view class="d-b-c f24">
						<text>{{$nw("订单号")}}{{ item.order_master.order_no }}</text>
						<text class="blue" v-if="item.is_settled==1"> {{$nw("已结算")}}</text>
						<text class="gray" v-else>{{$nw("未结算")}}</text>
					</view>
					<view class="d-b-c mt20" v-if="item.user">
						<view class="agent-order-photo" >
							<image :src="item.user.avatarUrl" mode="aspectFill"></image>
						</view>
						<view class="flex-1 ml20 f24">
							<view class="d-b-c">
								<text class="gray3">{{ item.user.nickName }}</text>
								<text class="red" v-if="item.first_user_id ==item.user.user_id ">+{{$nw("¥")}}{{ item.first_money }}</text>
								<text class="red" v-if="item.second_user_id ==item.user.user_id ">+{{$nw("¥")}}{{ item.second_money }}</text>
								<text class="red" v-if="item.third_user_id ==item.user.user_id ">+{{$nw("¥")}}{{ item.third_money }}</text>
							</view>
							<view class="d-b-c">
								<text class="gray9">{{$nw("消费金额")}}：{{$nw("¥")}}{{ item.order_price }}</text>
								<text class="gray9">{{item.create_time}}</text>
							</view>
							<view class="d-b-c" v-if="item.first_user_id==user_id&&item.first_money>=0.01">
								<text class="blue">{{$nw("一级分销佣金")}}：{{$nw("¥")}}{{ item.first_money }}</text>
							</view>
							<view class="d-b-c" v-if="item.second_user_id==user_id&&item.second_money>=0.01">
								<text class="blue">{{$nw("二级分销佣金")}}：{{$nw("¥")}}{{ item.second_money }}</text>
							</view>
							<view class="d-b-c" v-if="item.third_user_id==user_id&&item.third_money>=0.01">
								<text class="blue">{{$nw("三级分销佣金")}}：{{$nw("¥")}}{{ item.third_money }}</text>
							</view>
							
							<view class="d-b-c" v-for="(diff,index) in item.different_level" :key="index"  v-if="diff.user.user_id==user_id">
								<text class="blue" >{{$nw("代理佣金")}}：{{$nw("¥")}}{{ diff.money }}</text>
							</view>
							<view class="d-b-c" v-for="(rules,index2) in item.commission_rules" :key="index2"  v-if="rules.user.user_id==user_id">
								<text class="blue" >{{$nw("推荐佣金")}}：{{$nw("¥")}}{{ rules.money }}</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 没有记录 -->
				<view class="d-c-c p30" v-if="tableData.length==0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
				</view>
				<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
			</view>
		</scroll-view>

	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more.vue";
  import store from "@/store";
  import utils from "@/common/utils";
	export default {
		components: {
			uniLoadMore
		},
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*状态选中*/
				state_active: -1,
				/*数据列表*/
				tableData: [],
				settled: -1,
				page: 1,
				no_more: false,
				loading: true,
				tableList: [],
				list_rows: 15,
				/* 当前用户 */
				user_id:0,
			}
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
			},

      active() {
        return (state_active, value) => {
          if (state_active === value) {
            return Object.assign(this.setColor(true), {'border-bottom': '2px solid ' + this.getMainColor()})
          }
        }
      },

		},
		onLoad(e) {
			if(e.user_id){
				this.user_id = e.user_id;
			}else{
				this.user_id = uni.getStorageSync("user_id");
			}
			
		},
		mounted() {
			/*初始化*/
			this.init();
			/*获取数据*/
			var self = this;
			setTimeout(function(){
				self.getData();
			},500)
			
			this.setGlobalColor()
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
				self.loading = true;
				self._get('plus.agent.order/lists', {
					settled: self.state_active,
					page: self.page || 1,
					list_rows: self.list_rows,
					user_id:self.user_id
				}, function(data) {
					self.loading = false;
					// 导航栏数据
					self.tableList = [{
						value: -1,
						text: data.data.words.order.words.all.value,
					}, {
						value: 0,
						text: data.data.words.order.words.unsettled.value,
					}, {
						value: 1,
						text: data.data.words.order.words.settled.value,
					}];
					self.tableData = self.tableData.concat(data.data.list.data);
					self.tableData = self.getUnique(self.tableData,"id");
					self.last_page = data.data.list.last_page;
					if (self.last_page <= 1) {
						self.no_more = true;
					}
				});
			},

			/*切换*/
			stateFunc(e) {
				let self = this;
				if(e!=self.state_active){
					self.tableData = [];
					self.page = 1;
					self.state_active = e;
					self.getData();
				}
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
      setTextColor(isMainColor = false) {
        let isDefault = store.getters.isDefault
        let res = {};
        if (isDefault) {
          // 主色调
          const mainColor = utils.getMainColor()
          // 文字颜色, 根据后台设置,如果开启反色,获取主色调的反色,未开启就是获取标题字体颜色
          const textColor = utils.getTextColor()
          if (textColor) {
            res.color = textColor
          }
          if (isMainColor) {
            if (mainColor) {
              res.color = mainColor
            }
          }
        }
        return res;
      },
      getMainColor() {
        return utils.getMainColor()
      },

		}
	}
</script>

<style>
	.agent-order-photo,
	.agent-order-photo image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}
</style>
