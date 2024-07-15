<template>
	<view>

		<!--切换-->
		<view class="top-tabbar">
			<view :class="state_active == item.value? 'tab-item active' : 'tab-item'" :style="[active(state_active, item.value)]" @click="stateFunc(item.value)"  v-for="(item,index) in tableList" :key="index">{{item.text}}</view>
		</view>

		<!--列表-->
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
		 @scrolltoupper="scrolltoupperFunc" @scrolltolower="scrolltolowerFunc">
			<view class="p-0-30 bg-white">
				<view class="d-b-c border-b p-20-0" v-for="(item,index) in tableData" :key="index">
					<view class="d-s-s f-w d-c flex-1">
						<text class="30">{{$nw("订单")}}{{item.order.order_no}}</text>
						<text class="gray9 f22">{{item.create_time}}</text>
					</view>
					<view>
						<text :class="item.flow_type=='10'?'green':'gray9'">{{ item.describe}}</text>
						<text class="red ml20"> {{ item.achievement }}{{$nw("元")}}</text>
					</view>
				</view>

		
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
				no_more: false,
				loading: true,
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 20,
				tableList: [
					{
					value: -1,
					text: this.$nw("全部"),
				  }, {
					value: 10,
					text: this.$nw("新增"),
				  }, {
					value: 20,
					text: this.$nw("减少"),
				  }
				],
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
      }

		},
		mounted() {
			/*初始化*/
			this.init();
			/*获取数据*/
			this.getData();
		},
    onShow() {
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
				let page = self.page;
				self.loading = true;
				let list_rows = self.list_rows;
				self._get('plus.agent.achievement/lists', {
					status: self.state_active,
					page: page || 1,
					list_rows: list_rows,
				}, function(data) {
					self.loading = false;
					self.tableData = self.tableData.concat(data.data.list.data);
					self.tableData = self.getUnique(self.tableData,"user_achievement_id");
					self.last_page = data.data.list.last_page;
					if (data.data.list.last_page <= 1) {
						self.no_more = true;
						return false;
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

			/*可滚动视图区域到顶触发*/
			scrolltoupperFunc() {
				console.log('滚动视图区域到顶');
			},

			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {
				let self = this;
				if (self.page < self.last_page) {
					self.page++;
					self.getData();
				}
				self.no_more = true;
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

</style>
