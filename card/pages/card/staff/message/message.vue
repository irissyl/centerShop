<template>
	<!-- <view class="message-wrap" :style="'background:'+getMainColor()+';'"> -->
	<scroll-view scroll-y="true" class="message-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50" @scrolltolower="scrolltolowerFunc">
		<!-- <view class="audit" style="width: 100%;background-color: #F4F7FB;padding: 0 100rpx;">
			<u-tabs style="background-color: #F4F7FB !important;" :list="tabbar" :is-scroll="false" :current="current"
				@change="change"></u-tabs>
		</view> -->
		<!-- 消息 -->
		<!-- <view class="message-tabs flex-c" :style="'background:'+getMainColor()+';'">
			<view class="tabs-item" v-for="(item,index) in tabbarList" :key="index"
				:class="{'active' : current == index}" @click="change(index)">
				{{item.name}}
			</view>
		</view> -->
		<view class="message-content" style="padding-top: 24rpx;">
			<view class="message" v-show="current == 2">
				<view class="message1 " v-for="(item,index) in 5">
					<img src="https://q1.itc.cn/q_70/images03/20240320/fcf023d835c54f78bac6c7efc98fbb4c.jpeg" alt="" />
					<view class="" style="flex: 1;border-bottom: 2rpx solid rgba(0,0,0,0.1);">
						<view class="dbb">
							<view class="message-name">
								万先生
							</view>
							<view class="message-msg">
								10:03
							</view>
						</view>
						<view class="dbb" style="">
							<view class="message-itme">
								你好，欢迎咨询一站式电商托管项目
							</view>
							<view class="message-n">
								1
							</view>
						</view>
					</view>

				</view>
			</view>
			<!-- 动态 -->
			<view class="dynamic" v-show="current == 1">
				<view class="dynamic-box" v-for="(item,index) in dynamicList" :key="index" @click="zuopin_click(item)">
					<view class="dynamic-top">
						<view class="user-avatar">
							<image :src="item.user && item.user.avatarUrl" mode="aspectFill" />
						</view>
						<text style="font-size: 28rpx;">{{item.user && item.user.name || '--'}}</text>
					</view>
					<view class="dynamic-t" style="font-size: 28rpx;">
						{{item.name || '--'}}
					</view>
					<view v-if="item.images" class="img">
						<view class="img-item" v-for="(img,i) in item.images" :key="i">
							<image :src="img.file_path" mode="aspectFill" @click.stop="previewHandle(i,item.images)" />
						</view>

					</view>
					<view class="dynamic-dz dbb">
						<view class="" style="font-size: 20rpx;color: #999;">
							{{item.time || '--'}}
						</view>
						<view class="dynamic-handle" style="display: flex;">
							<!-- <view class="" style="margin-right: 48rpx;">
								<u-icon v-show="true" style="margin-right: 10rpx;" name="thumb-up" color="#999"
									size="28"></u-icon>
								<u-icon v-show="false" name="thumb-up-fill	" color="red" size="28"></u-icon>
								<text style="color: #999999;">342</text>
							</view> -->
							<view class="handle-item">
								<image class="handle-icon" src="@/static/message/icon2.png" mode=""></image>
								<!-- <text style="color: #999999;">14</text> -->
							</view>
						</view>

					</view>
				</view>
			</view>
			<!-- 资讯 -->
			<view class="article-list" v-show="current == 0">
				<view class="dbb article-item" v-for="(item,index) in articleList" :key="index"
					@click="articleDetails(item.article_id)">
					<view class="article-left">
						<view class="u-line-2">
							{{item.article_title || '--'}}
						</view>
						<view class="other-info flex-c">
							<!-- <text class="u-font-20">万商云汇</text> -->
							<text class="u-font-20">{{item.update_time || item.create_time || ''}}</text>
							<!-- <view class="dcc">
								<u-icon name="eye" color="#999" size="30"></u-icon>
								<text class="u-font-20">{{item.virtual_views || '0'}}</text>
							</view> -->
						</view>
					</view>
					<view class="article-img">
						<image v-if="item.image_url" class="common-img" :src="item.image_url" mode="aspectFill" />
						<video v-else-if="item.video_url" class='article-video' :src="item.video_url"></video>
						<image v-else class="common-img"
							src="https://shanghui.client.xcx008.com/file/uploads/20240515/f5d3ca63a02c5a42138bc016648eaff7.jpg"
							mode="scaleToFill"></image>
					</view>
				</view>
			</view>

			<view v-show="current == 0 && loading && articleList.length" class="load-box flex-c has-padding">
				<i class="iconfont jiazaizhong"></i>
				{{$nw('加载中')}}
			</view>

			<view v-if="current == 0 && no_more && !loading && articleList.length" class="nomore-box has-padding">
				<text class="nomore-content">
					{{$nw("到底了")}}
				</text>
			</view>
			<view v-if="current == 0 && !articleList.length && !loading" class="empty-box">
				<view class="empty-icon">
					<image class="common-img"
						src="https://shanghuitest.client.xcx008.com/file/uploads/20240605/b798199e3c83e9b818f20576e825a1b9.png">
					</image>

				</view>
				<view class="empty-text">
					{{$nw("暂无数据")}}
				</view>
			</view>
		</view>
		<Tabbar v-if="show_menu"></Tabbar>
		<!-- <service :itemData="t_service"></service> -->
		<!-- <view class="release" v-show="current == 0" @click="dynaimage">
			<image class="release-icon" src="../../../../../static/release_icon.png" mode=""></image>
			<text class="release-text">发布</text>
		</view> -->
	</scroll-view>

	<!-- </view> -->
</template>

<script>
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import service from '@/components/diy/service/service';
	export default {
		components: {
			Tabbar,
			service
		},
		data() {
			return {
				loading: false,
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
				show_menu: true,
				tabbarList: [
					{
						id: 1,
						name: "动态",
						flag: false,

					},
					{
						id: 2,
						name: "资讯",
						flag: false,
					},
					// }
					{
						id: 1,
						name: "消息",
						flag: true,

					},

				],
				dynamicList: [],
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
				current: 0,
				articleList: [],
				no_more: false
			}
		},
		onShow() {
			let self = this;
			// self.isTabbar(self, "card/pages/card/staff/message/message", function(res) {
			// 	self.show_menu = res;
			// })
			self.setGlobalColor()

			// self.tabbar.forEach(function(res) {
			// 	if (res.flag) {
			// 		if (res.id == 1) {
			// 			self.getChatList();
			// 		} else {
			// 			self.getDyna();
			// 		}
			// 	}
			// })
			uni.setNavigationBarTitle({
				title: self.$nw("资讯")
			})
		},
		onLoad() {
			this.init();
			// this.getDyna()
			this.getArticlePage()
		},
		onShareAppMessage() {},
		onShareTimeline() {},
		methods: {
			change(index) {
				if (this.current == index) return
				this.current = index;
				this.page = 1
				this.no_more = false
				this.loading = false
				this.last_page = 0
				if (this.tabbar[index].id == 1) {
					this.dynamicList = []
					this.getDyna();
				} else if (this.tabbar[index].id == 2) {
					this.articleList = []
					this.getArticlePage()
				} else {
					this.getChatList();
				}
			},
			getDyna() {
				var self = this;
				if (self.page == 1) {
					uni.showLoading({
						title: "加载中"
					})
				}
				self._post('plus.dynamic.Dynamic/index', {
					page: self.page,
					list_rows: self.list_rows,

				}, function(res) {
					if (res.data.list.data.length <= 0) {
						self.page--;
					}
					if (self.page == 1) {
						self.dynamicList = []
					}
					self.dynamicList = self.dynamicList.concat(res.data.list.data);
					self.dynamicList = self.getUnique(self.dynamicList, "dynamic_id");
					self.last_page = res.data.list.last_page;
					uni.hideLoading()
					self.loading = false;
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}

				});
			},
			getArticlePage() {
				this.loading = true
				if (this.page == 1) {
					uni.showLoading({
						title: "加载中"
					})
				}
				this.no_more = false
				this._post('plus.coc.Coc/getArticlePage', {
					page: this.page,
					list_rows: this.list_rows,

				}, (res) => {
					let data = res.data.data
					if (data.length <= 0) {
						this.page--;
					}
					if (this.page == 1) {
						this.articleList = []
					}
					this.articleList = this.articleList.concat(data);
					this.articleList = this.getUnique(this.articleList, "article_id");
					this.last_page = res.data.last_page;
					if (res.data.last_page <= this.page) {
						this.no_more = true;
					}
					uni.hideLoading()
					setTimeout(() => {
						this.loading = false;
					}, this.page == 1 ? 0 : 500)
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
				console.log('scrolltolowerFunc---->');
				if (this.no_more) return;
				this.page++;
				if (this.current == 1) {
					this.getDyna();
				} else if (this.current == 0) {
					this.getArticlePage()
				} else {
					this.getChatList();
				}
			},
			// 动态详情
			zuopin_click(e) {
				uni.navigateTo({
					url: "/plus2/pages/dynamic/detail?dynamic_id=" + e.dynamic_id
				})
			},
			// 资讯详情
			articleDetails(id) {
				uni.navigateTo({
					url: "/card/pages/card/staff/message/articleDetails?id=" + id
				})
			},
			// 查看图片
			previewHandle(index, imgs) {
				var n_im = [];
				for (var i = 0; i < imgs.length; i++) {
					n_im.push(imgs[i].file_path);
				}
				uni.previewImage({
					urls: n_im,
					current: index
				})
			},
		}
	}
</script>

<style lang="scss">
	.message-wrap {
		background: #fff;

		.message-tabs {
			width: 100%;
			height: 80rpx;
			justify-content: center;
			position: fixed;
			left: 0;
			z-index: 22;

			.tabs-item {
				width: 30%;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: center;
				font-size: 28rpx;
				color: #999;
				position: relative;

				&::after {
					content: '';
					width: 52rpx;
					height: 4rpx;
					background: #1B94E0;
					position: absolute;
					bottom: 8rpx;
					left: 50%;
					transform: translateX(-50%);
					opacity: 0;
				}

				&.active {
					color: #333333;
					font-weight: 500;

					&::after {
						opacity: 1;
					}
				}
			}
		}

		.message-content {
			padding-top: 120rpx;
			padding-bottom: calc(20rpx + env(safe-area-inset-bottom) / 2);
		}

		/deep/.tabbarheight {
			background: #fff !important;
		}
	}

	.release {
		width: 96rpx;
		height: 104rpx;
		background: #1B94E0;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		position: fixed;
		right: 24rpx;
		bottom: 150rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;

		.release-icon {
			width: 56rpx;
			height: 56rpx;
		}

		.release-text {
			color: #fff;
			display: block;
			font-size: 20rpx;
			line-height: 20rpx;
			margin-top: 0rpx;
		}



	}


	.dynamic {
		padding: 0 24rpx;

		.dynamic-box {
			margin-top: 40rpx;

			&:first-of-type {
				margin-top: 0;
			}

			.dynamic-dz {
				margin-top: 20rpx;

				.dynamic-handle {
					.handle-item {
						.handle-icon {
							width: 40rpx;
							height: 40rpx;
						}
					}
				}

			}

			.img {
				display: flex;
				flex-wrap: wrap;

				.img-item {
					width: calc(50% - 6rpx);
					height: 240rpx;
					border-radius: 10rpx;
					margin-bottom: 12rpx;
					overflow: hidden;
					background: #cdcdcd;

					img,
					image {
						width: 100%;
						height: 100%;
						display: block;
					}

					&:nth-of-type(2n) {
						margin-left: 12rpx;
					}
				}

			}

			.dynamic-t {
				font-size: 28rpx;
				margin: 12rpx 0;
			}

			.dynamic-top {
				display: flex;
				align-items: center;

				.user-avatar {
					width: 64rpx;
					height: 64rpx;
					border-radius: 8rpx;
					margin-right: 16rpx;
					overflow: hidden;
					background: #cdcdcd;

					img,
					image {
						width: 100%;
						height: 100%;
						border-radius: 8rpx;
					}
				}



				text {
					color: #333333;
					font-size: 28rpx;
				}
			}
		}
	}

	.message1 {
		font-size: 24rpx;
		margin-top: 40rpx;
		display: flex;

		img {
			width: 96rpx;
			height: 96rpx;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			color: #333333;
			margin-right: 24rpx;
		}

		.message-name {
			color: #333333;
			font-size: 28rpx !important;
			font-weight: 800;
		}

		.message-msg {
			font-size: 24rpx;
			color: #999999;
		}

		.message-itme {
			font-size: 24rpx;
		}

		.message-n {
			width: 32rpx;
			height: 32rpx;
			background: #EB1C1C;
			line-height: 30rpx;
			text-align: center;
			color: #fff;
			font-size: 24rpx;
			border-radius: 4rpx 4rpx 4rpx 4rpx;
		}
	}

	.article-list {
		padding: 0 24rpx;

		.article-item {
			margin-bottom: 40rpx;
			height: 152rpx;

			.article-left {
				flex: 1;
				height: 100%;
				display: flex;
				flex-direction: column;
				justify-content: space-between;

				.u-line-2 {
					font-size: 32rpx;
					color: #333;
					line-height: 1.5;
				}

				.other-info {
					.u-font-20 {
						color: #999;
						margin-right: 24rpx;
					}

					.dcc {
						color: #999;

						.u-icon {
							margin-right: 8rpx;
						}
					}
				}
			}

			.article-img {
				width: 200rpx;
				height: 152rpx;
				background: #f1f1f1;
				border-radius: 8rpx;
				overflow: hidden;
				margin-left: 24rpx;

				.article-video {
					width: 100%;
					height: 100%;
				}
			}

			&:last-of-type {
				// margin-bottom: 0;
			}
		}
	}
</style>