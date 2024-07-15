<template>
	<view>
		<view class="top-container">
			<view class="top-tabbar">
				<view v-for="(item,index) in tabList" :key="index"
					:class="state_active == index ? 'tab-item active' : 'tab-item'"
					
					:style="{'color':state_active == index?getTabbarSelectColor():getTabbarColor()}"
					@click="stateFunc(index)">
					{{$nws(item.text)}} <text v-if="item.total"> ( {{item.total}})</text> 
				</view>
			</view>
		</view>

		<!--列表-->
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			@scrolltolower="scrolltolowerFunc">
			<view class="p-0-30 bg-white">
				<view class="border-b p-20-0" v-for="(item,index) in tableData" :key="index">
					<view class="d-b-c">
						<view class="agent-team-photo" v-if="item.avatarUrl">
							<image :src="item.avatarUrl" mode="aspectFill"></image>
						</view>
						<view class="flex-1 ml20 f24">
							<view class="d-b-c">
								<text class="f28 gray3">{{ item.nickName }}
								 <text class="gray9"  style="font-size: 26rpx;margin-left: 10rpx;"
								 v-if="item.iden">({{item.iden}})</text>
								 </text>
								<text class="gray9">{{ item.create_time }}</text>
							</view>
							<view class="d-b-c" v-if="item.referee_name">
								<text class="gray9"  style="font-size: 26rpx;">推荐人：{{item.referee_name}}</text>
								
							</view>
							<view class="d-b-c">
								<text class="gray9" v-if="item.expend_money">业绩：{{$nw("¥")}}{{ item.expend_money }}</text>
								<text class="gray9"  v-if="item.teamnum">
									{{ item.teamnum }}个成员</text>
							</view>
					<!-- 		<view class="d-b-c">
								<view class="gray9">
									盒数：{{item.buynum}}
								</view>
						
							</view> -->
							<view class="order-list">
							<!-- 	<view class="order-bts" style="float: right;">
									<button
									style="border:none;"
										:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
										type="default" @click="transer(item.mobile)">转账</button>
								</view> -->
								<view class="order-bts" style="float: right;">
									<button
									style="border:none;"
										:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
										type="default" @click="achie(item.mobile)">收益明细</button>
								</view>
								
								<view class="" style="clear: both;">
									
								</view>
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
		<service :itemData="t_service"></service>
		
	</view>
</template>

<script>
	import uniLoadMore from "@/components/uni-load-more.vue";
	import store from "@/store";
	import utils from "@/common/utils";
	import service from '@/components/diy/service/service';
	
	export default {
		components: {
			uniLoadMore,
			service,
			
		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*状态选中*/
				state_active: 0,
				/*数据列表*/
				tableData: [],
				setting: [],
				teamTotal: 0,
				page: 1,
				no_more: false,
				tabList: [],
				list_rows: 15,
				loading: true,
				team:{}
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
						return Object.assign(this.setColor(true), {
							'border-bottom': '2px solid ' + this.getMainColor()
						})
					}
				}
			},
			getbutton() {
				return this.setButton().button
			}
		},

		mounted() {
			/*初始化*/
			this.init();
			/*获取数据*/
			this.getData();
			this.setGlobalColor()
		},
		methods: {
			transer(mobile) {
				uni.navigateTo({
					url: "/main/pages/agent/walletTransfer/choose?mobile=" + mobile
				})
			},
			achie(mobile) {
				uni.navigateTo({
					url: "/main/pages/agent/achievement/query?mobile=" + mobile
				})
			},
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.phoneHeight = res.windowHeight;
						// 计算组件的高度
						let view = uni.createSelectorQuery().select('.top-container');
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
				self._get('plus.agent.team/lists', {
					level: self.state_active + 1,
					page: self.page || 1,
					list_rows: self.list_rows,
				}, function(res) {
					self.loading = false;
					
					let data = res.data;
					self.team =  data.team
					self.people = self.team.people
					self.z_people = self.team.z_people
					self.j_people = self.team.j_people
					// 导航栏数据
					self.tabList = [{
						value: 1,
						text: data.words.team.words.first.value,
						total: data.team.first
					}];
					if (data.setting.level >= 2) {
						self.tabList.push({
							value: 2,
							text: data.words.team.words.second.value,
							total: data.team.second
						});
					
					}
					if (data.setting.level == 3) {
						self.tabList.push({
							value: 3,
							text: data.words.team.words.third.value,
							total: data.team.third
						});
			
					}
					self.tableData = self.tableData.concat(data.list.data);
					self.tableData = self.getUnique(self.tableData, "user_id");
					self.last_page = data.list.last_page;
					if (self.last_page <= 1) {
						self.no_more = true;
					}
				}, null, function() {
					self.loading = false;
				});
			},

			/*切换类别*/
			stateFunc(e) {
				let self = this;
				if (e != self.state_active) {
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
			}

		}
	}
</script>

<style>
	.top-container .total {
		height: 80rpx;
	}

	.agent-team-photo,
	.agent-team-photo image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.order-list .order-bts {
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.order-list .order-bts button {
		margin: 0;
		padding: 0 30rpx;
		height: 60rpx;
		line-height: 60rpx;
		margin-left: 20rpx;
		border-radius: 30rpx;
		font-size: 24rpx;
		border: 1px solid #CCCCCC;
		white-space: nowrap;
		background: #FFFFFF;
	}

	.order-list .order-bts button::after {
		display: none;
	}

	.order-list .order-bts button.btn-border-red {
		border: 1px solid $dominant-color;
		font-size: 24rpx;
		color: $dominant-color;
	}

	.order-list .order-bts button.btn-red {
		background: $dominant-color;
		border: 1px solid $dominant-color;
		font-size: 24rpx;
		color: #FFFFFF;
	}
</style>