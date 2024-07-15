<template>
	<view :style="'background:'+getMainColor()+';'">
		<view class="audit" :style="'background:'+getMainColor()+';'">
			<view style="flex: 1;"></view>
			<view class="audit1" v-for="(item,index) in tabbar" :key="index" @click="tabbar_click(index)">
				<view class="audit1_1" 
				
				:style="{'color':item.flag==true?getTabbarSelectColor():getTabbarColor()}"
				>
					{{$nw(item.text)}}
				</view>
				<view class="audit1_2" 
				 :style="{'background':item.flag==true? getTabbarSelectColor():getTabbarColor()}"
				 v-if="item.flag"></view>
			</view>
			<view style="flex: 1;"></view>

		</view>
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			@scrolltolower="scrolltolowerFunc">

			<!-- 导入动态页面 -->
			<view v-if="getTabbar(2) == true">
				<dynamic :dynamic="dynamic" @zuopin_click="zuopinclick"></dynamic>
				<image class="dynaimage" @click="dynaimage" src="/static/dynamic.png"></image>
			</view>

			<view class="message-sec" style="border: 0rpx solid #fff;" v-if="getTabbar(1) == true">
				<view :style="'background:'+getMainColor()+';'" v-for="(item, index) in dataList.list" :key="index"
					class="child rel">
					<image class="abs br-10" :data-index="index" data-status="toUserInfo" mode="aspectFill"
						:src="item.user.person_avatar||defaultUserImg"></image>
					<em :class="'abs ' + (item.message_not_read_count<100?'dot':'dotbig')"
						v-if="item.message_not_read_count>0">{{item.message_not_read_count}}</em>
					<view class="content" style="border: 0rpx solid #fff;" @click="gotoChat(item)">
						<view class="flex">
							<view class="flex100-5 ellipsis" style="font-size:30rpx;font-weight: 500;"
								:style="'color:'+getTextColorWhite()+';'">
								<text class="iconfont2 icon-shouji" v-if="item.tel"></text>
								<text>{{item.user.nick_name?item.user.nick_name:'新客户'}}</text>

							</view>
							<view class="flex100-5 tr" :style="'color: '+getTextColorGrey()+';'">{{item.time}}</view>
						</view>
						<view class="text ellipsis" :style="'color: '+getTextColorGrey()+';'">
							<block v-if="item.message_type=='image'">[图片]</block>
							<block v-if="item.message_type=='text'"> {{item.content}}</block>
						</view>
					</view>
				</view>
			</view>

			<view :style="'color:'+getTextColorGrey()+';'"
				style="height: 200rpx;line-height: 200rpx;text-align: center;font-size: 30rpx;"
				v-if="getTabbar(1) == true && dataList.list.length <= 0">
			{{	$nw("您暂未有新消息")}}
			</view>

		</scroll-view>
		<!-- <Radarbar ></Radarbar> -->
		<Tabbar v-if="show_menu"></Tabbar>
		<service :itemData="t_service"></service>
	</view>
</template>

<script>
	import Radarbar from '@/components/radarbar/radarbar.vue';
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import dynamic from "@/components/comment/dynamic.vue"
	import service from '@/components/diy/service/service';
	export default {
		components: {
			Radarbar,
			Tabbar,
			dynamic,
			service
		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				globalData: {},
				defaultUserImg: '',
				messageTime: "",
				staffInfo: [],
				dataList: {
					last_page: 0,
					list: [],
					refresh: !1,
					loading: !0
				},
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				temlIds: [],
				card_id: 0,
				show_menu: false,

				tabbar: [{
					id: 2,
					text: "动态",
					flag: true,
				},{
					id: 1,
					text: "消息",
					flag: false,
				}],
				dynamic: [],
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
			}
		},
		onShow() {
			let self = this;
			self.isTabbar(self, "card/pages/card/staff/message/message", function(res) {
				self.show_menu = res;
			})
			self.setGlobalColor()

			self.tabbar.forEach(function(res) {
				if (res.flag) {
					if (res.id == 1) {
						self.getChatList();
					} else {
						self.getDyna();
					}
				}
			})
			uni.setNavigationBarTitle({
				title:self.$nw("消息动态")
			})
		},
		onLoad() {
			this.init();


		},
		methods: {
			getDyna() {
				var self = this;
				uni.showLoading({
					title: "加载中"
				})
				self._get('plus.dynamic.Dynamic/index', {
					page: self.page,
					list_rows: self.list_rows,

				}, function(res) {
					self.loading = false;
					if (res.data.list.data.length <= 0) {
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
			dynaimage() {
				uni.navigateTo({
					url: "/plus2/pages/dynamic/rel_dynamic"
				})
			},
			getTabbar(id) {
				var flag = false;
				this.tabbar.forEach(function(res) {
					if (res.id == id) {
						flag = res.flag;
					}
				})
				return flag
			},
			tabbar_click(index) { //顶部点击
				this.tabbar.forEach(function(res) {
					res.flag = false
				})
				this.tabbar[index].flag = true
				if (this.tabbar[index].id == 1) {
					this.getChatList();
				} else {
					this.getDyna();
				}
				this.$forceUpdate()
			},
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
					}
				});
			},
			getChatList() {
				let self = this;
				self._get('plus.card.chat/getChatList', {
						page: self.page || 1
					},
					function(res) {
						if (res.code == 1) {
							self.dataList.loading = false
							self.dataList.list = self.dataList.list.concat(res.data.chatList.list);
							self.dataList.list = self.getUnique(self.dataList.list, "card_chat_id");
							self.dataList.last_page = res.data.chatList.total_page;
							self.temlIds = res.data.temlIds_arr;
							self.card_id = res.data.card_id;
						}
					})
			},
			gotoChat(e) {
				let self = this;
				let chat_to_uid = e.chat_to_uid;
				if (!chat_to_uid || chat_to_uid == 'undefined') {
					uni.showToast({
						title: "该用户不存在"
					})
					return false
				}
				let callback = function() {
					let path = '/card/pages/card/chat/staffchat?chat_to_uid=' + e.chat_to_uid + "&card_id=" + self
						.card_id;
					self.gotoPage(path);
				};
				self.subMessage(this.temlIds, callback);

			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				let self = this;
				self.page++;
				self.loading = true;
				if (self.page > self.dataList.last_page) {
					self.dataList.loading = false;
					return;
				}
				self.getChatList();
			},
		}
	}
</script>

<style lang="scss">
	@import "/card/statics/card.css";

	page {
		background: #f4f4f8;
	}

	.dynaimage {
		width: 150rpx;
		height: 150rpx;
		position: fixed;
		bottom: 300rpx;
		right: 20rpx;
	}


	view,
	button {
		display: block;
		overflow: initial;
		line-height: none;
	}

	.message-sec .child .content .flex {
		margin: 0;
	}

	.message-sec .child em {
		left: 100rpx;
	}

	.audit {
		display: flex;
		height: 80rpx;
		line-height: 80rpx;
		background: #fff;
		padding-bottom: 10rpx;
		width: 100%;
		margin: auto;

		.audit1 {
			flex: 1;

			.audit1_1 {

				text-align: center;
				font-size: 32rpx;
				font-family: PingFang SC-Bold, PingFang SC;

				color: #333333;
			}

			.audit1_2 {
				width: 30rpx;
				height: 6rpx;
				background: #1F1A17;
				border-radius: 180rpx;
				margin: auto;

			}

		}
	}
</style>