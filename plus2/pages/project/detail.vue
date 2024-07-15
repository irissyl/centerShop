<template>
	<view class="project-detail" v-if="loadding" :style="'background:'+getMainColor()+';'">

		<view class="det0" style="margin-bottom: 20rpx;">
			<view class="det" style="padding-top: 0rpx;margin-top: 0rpx;">
				<view class="det2" :style="'background:'+getMainColor()+';'+
				'color:'+getMainTextColor()+';'">
					<view class="det2_1" v-for="(item,index) in typeArray" :key="index"
						v-if="project.type == item.value">{{$nws(item.label)}}</view>

					<view class="det2_2" :style="{'color':getTextColorGrey()}" style="white-space:pre-wrap">
						{{project.title}}
					</view>
					<view style="clear: both;"></view>
				</view>
				<view class="" v-if="project.price.price > 0"
					style="font-size: 28rpx; color: rgb(255, 159, 0); width: 100%;text-align: right;margin-top: 20rpx;">

					<text>{{$nw(project.price.price_type_val)}}：{{project.price.price}}{{project.price.price_type_unit}}</text>
				</view>
				<view class="" :style="{'color':getTextColorWhite()}"
					style="font-size: 28rpx;  width: 100%;text-align: right;">
					<view style="float: left;color: #5b5b5b;" v-if="project.isEnd == true">
						{{$nw("合作已结束")}}
					</view>


					{{project.time}}
					<text style="margin-left: 15rpx;">{{project.view}} {{$nw("次浏览")}}</text>
				</view>

			</view>

		</view>

		<!-- 招募联创股东 -->
		<template v-if="project.type == 'zmlcgd' 
		|| project.type == 'xmtjh' || project.type == 'xpfbh'">
			<view class="det0">
				<view class="det">
					<view class="det1" :style="'color:'+getTextColorGrey()+';'">
						{{$nw("项目所属赛道")}}
					</view>
					<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}" v-if="project.setting && project.setting.track">
						{{project.setting.track}}
					</view>
				</view>
			</view>
			<view class="det0">
				<view class="det">
					<view class="det1" :style="'color:'+getTextColorGrey()+';'">
						{{$nw("项目亮点")}}
					</view>
					<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}" v-if="project.setting &&project.setting.lightspot">
						{{project.setting.lightspot}}
					</view>
				</view>
			</view>
			<view class="det0">
				<view class="det">
					<view class="det1" :style="'color:'+getTextColorGrey()+';'">
						{{$nw("应召者需要条件")}}
					</view>
					<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}" v-if="project.setting &&project.setting.requirement">
						{{project.setting.requirement}}
					</view>
				</view>
			</view>
		</template>


		<view class="det0">
			<view class="det">
				<view class="det1" :style="'color:'+getTextColorGrey()+';'">
					{{$nw("行业")}}
				</view>
				<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}">
					{{project.category.name}}
				</view>
			</view>
		</view>

		<template v-if="project.type == 'tzrfb'">
			<view class="det0">
				<view class="det">
					<view class="det1" :style="'color:'+getTextColorGrey()+';'">
						{{$nw("投资预算")}}
					</view>
					<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}" v-if="project.setting && project.setting.tz_yusuan">
						{{project.setting.tz_yusuan}}
					</view>
				</view>
			</view>

			<view class="det0">
				<view class="det">
					<view class="det1" :style="'color:'+getTextColorGrey()+';'">
						{{$nw("投资行业")}}
					</view>
					<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}" v-if="project.setting && project.setting.category">
						{{project.setting.category}}
					</view>
				</view>
			</view>

			<view class="det0">
				<view class="det">
					<view class="det1" :style="'color:'+getTextColorGrey()+';'">
						{{$nw("项目需备条件")}}
					</view>
					<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}" v-if="project.setting && project.setting.xb_tj">
						{{project.setting.xb_tj}}
					</view>
				</view>
			</view>

			<view class="det0">
				<view class="det">
					<view class="det1" :style="'color:'+getTextColorGrey()+';'">
						{{$nw("年投产比要求")}}
					</view>
					<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}" v-if="project.setting && project.setting.ntcbyq">
						{{project.setting.ntcbyq}}
					</view>
				</view>
			</view>

			<view class="det0">
				<view class="det">
					<view class="det1" :style="'color:'+getTextColorGrey()+';'">
						{{$nw("投资时长")}}
					</view>
					<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}" v-if="project.setting && project.setting.tzsc">
						{{project.setting.tzsc}}
					</view>
				</view>
			</view>

			<view class="det0">
				<view class="det">
					<view class="det1" :style="'color:'+getTextColorGrey()+';'">
						{{$nw("投资轮次")}}
					</view>
					<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}" v-if="project.setting && project.setting.tzlc">
						{{project.setting.tzlc}}
					</view>
				</view>
			</view>

		</template>



		<view class="det0">
			<view class="det">
				<view class="det1" :style="'color:'+getTextColorGrey()+';'">
					{{$nw("地址")}}
				</view>
				<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}">
					<text class=""
						v-if="project.region">{{ project.region.province }}-{{ project.region.city }}-{{ project.region.region }}</text>
				</view>
			</view>
		</view>
		<view class="det0" v-if="project.type == 'gy' || project.type == 'xq'">
			<view class="det">
				<view class="det1" :style="'color:'+getTextColorGrey()+';'">
					{{$nw("预算")}}
				</view>
				<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}">
					<text class="" v-if="project.budget>10000">{{ project.budget/10000 }}万</text>
					<text class="" v-else>{{ project.budget }}元</text>
				</view>
			</view>
		</view>
		<view class="det0" v-if="project.type != 'tzrfb'">
			<view class="det">
				<view :style="'color:'+getTextColorGrey()+';'" class="det1" v-if="project.type == 'xq' || project.type == 'gy'
				">{{$nw("详情")}}</view>
				<view class="det1" v-if="project.type == 'zmlcgd'">{{$nw("项目简单介绍")}}</view>
				<view class="det2" :style="{background:getbutton?getbutton[2].buttonThree:'#E2231A',
					 color:getbutton?getbutton[2].buttonThreeColor:'#ffffff'}">

					<text class="">{{ project.introduce }}</text>
				</view>
			</view>

		</view>

		<view v-if="(project.project_video && project.project_video != '上传视频') || project.project_images"
			class="project-imgs">
			<view class="project-imgs-content">
				<video v-if="project.project_video && project.project_video != '上传视频'" class="project-video"
					:src="project.project_video" />
				<view v-if="project.project_images" class="project-img"
					v-for="(img,index) in project.project_images && project.project_images.split(',') || []"
					:key="index">
					<image class="img" :src="img" mode="widthFix" @click="previewHandle(index)" />
				</view>
			</view>
		</view>

		<view style="height: 150rpx;width: 100%;"></view>

		<view class="btns-wrap" :style="'background:'+getMainColor()+';'">
			<view class="icon-box d-c-c" @click="goHome">
				<button class="icon iconfont icon-Homehomepagemenu" :style="'background:'+getMainColor()+';'"></button>
			</view>
			<!-- #ifdef H5 -->
			<view class="icon-box d-c-c" @click="openMaservice">
				<button class="icon iconfont icon-kefu2" :style="'background:'+getMainColor()+';'"></button>
			</view>
			<!-- #endif -->
			<!-- #ifdef MP-WEIXIN -->
			<view class="icon-box d-c-c" @click="showShare"><button class="icon iconfont icon-share"
					:style="'background:'+getMainColor()+';'"></button>
			</view>
			<!-- #endif -->
			<!-- <template>
				<button v-if="project.isMe == true" type="primary" class="buy3"
					style="background: linear-gradient(to right,#cdcfd0,#828384);"
					@click="concat(project)">{{$nw("联系咨询")}}</button>

				<button v-if="project.isMe == true" type="primary"
					style="background: linear-gradient(to right,#f2b237,#ffda98);" class="buy"
					@click="openPopup(project)">{{$nw("查看联系方式")}}</button>

				<button style="background: linear-gradient(to right,#f2b237,#ffda98);" type="primary"
					v-if="project.isEnd == false && project.isMe == false" class="buy"
					@click="openPopup(project)">{{$nw("我要合作")}}</button>
				<button style="background: linear-gradient(to right,#f2b237,#ffda98);" type="primary"
					v-if="project.isEnd == true && project.isMe == false" class="buy">{{$nw("合作已结束")}}</button>
			</template> -->

			<template>
				<button type="primary" class="buy3" style="background: linear-gradient(to right,#f2b237,#ffda98);"
					@click="phoneHandle(project)">{{$nw("电话联系")}}</button>
			</template>


		</view>
		<!--客服-->
		<Mpservice v-if="isMpservice" :copy_success="copy_success" :isMpservice="isMpservice" @close="closeMpservice">
		</Mpservice>
		<!--底部弹窗-->
		<share :isbottmpanel="isbottmpanel" @close="closeBottmpanel"></share>
	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	import Mpservice from '@/components/mpservice/Mpservice.vue';
	import share from './popup/share.vue'
	export default {
		components: {
			Mpservice,
			share
		},
		data() {
			return {
				isbottmpanel: false,
				/*是否加载完成*/
				loadding: false,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*活动id*/
				project_id: 0,
				/* 类型 */
				type: 0,
				/*活动详情*/
				project: {
					image: {}
				},
				hasReport: false,
				isPopup: false,
				isMpservice: false,
				typeArray: [],
				mobile: null
			};
		},
		computed: {
			textColor() {
				return flag => {
					flag = !!flag
					return this.setColor(flag)
				}
			},
			bgcColor() {
				return this.setBackgroundColor()
			},
			getbutton() {
				return this.setButton().button
			},
		},
		onLoad(e) {
			/*分类id*/
			this.project_id = e.project_id;
			this.type = e.type;
			this.mobile = e.mobile || null
			this.setGlobalColor()
		},
		onShow() {
			/*获取产品详情*/
			this.getData();
			this.getType()
		},
		onShareAppMessage() {},
		onShareTimeline() {},
		methods: {
			// 图片预览
			previewHandle(current) {
				let _this = this
				uni.previewImage({
					urls: _this.project.project_images.split(','),
					current,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			getType() {
				var self = this;
				self._post(
					'plus.project.project/getType', {},
					function(res) {
						self.typeArray = res.data;
					})
			},
			//分享按钮
			showShare() {
				var self = this;
				if (uni.getStorageSync("user_id")) {
					self.isbottmpanel = true;
				} else {
					uni.showModal({
						title: self.$nw("系统提示："),
						content: self.$nw("您还未登录，是否先前往登录"),
						success(re) {
							if (re.confirm) {
								// 根据不同的情况跳转到不同的页面
								self.login("pass_login", [0])
								return;
							}
						}
					})

				}

			},
			goHome() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			//关闭分享
			closeBottmpanel(data) {
				this.isbottmpanel = false;
			},
			openPopup(e) {
				let self = this;

				self._get(
					'plus.rule.Rule/judge', {},
					function(res) {
						if (res.code == 1) {
							self.isPopup = true;
						}
					})

			},
			concat(e) {
				//如果是自己  不能和自己聊天
				if (uni.getStorageSync("user_id") != e.user_id) {
					uni.navigateTo({
						url: "/card/pages/card/chat/staffchat?chat_to_uid=" + e.user_id
					})
				} else {
					uni.showToast({
						title: self.$nw("不能和您自己联系哦"),
						icon: "none"
					})
				}
			},
			phoneHandle(project) {
				if (uni.getStorageSync("user_id") == project.user_id) {
					//如果是自己  不能和自己联系
					this.tip("不能和您自己联系哦", 2000);
					return;
				}
				if (!project.mobile && !this.mobile) {
					this.tip("未获取到联系方式，请稍后再试", 2000);
					return;
				}
				uni.makePhoneCall({
					phoneNumber: project.mobile || this.mobile
				})
			},
			/*关闭弹窗*/
			closePopup() {
				let self = this;
				self.isPopup = false;
			},
			/*获取活动详情*/
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				this.loading = true;
				let project_id = self.project_id;
				this._get(
					'plus.project.project/detail', {
						project_id: project_id,
						type: self.type
					},
					function(res) {
						/*详情内容格式化*/
						res.data.detail.introduce = utils.format_content(res.data.detail.introduce);
						self.project = res.data.detail;
						self.loadding = true;
						uni.setNavigationBarTitle({
							title: self.project.title
						})
						uni.hideLoading();

					}

				);
			},
			callphone() {
				let phoneNumber = this.project.mobile;
				uni.makePhoneCall({
					phoneNumber: phoneNumber
				})
			}
		}
	};
</script>

<style lang="scss" scoped>
	.project-imgs {
		width: 95%;
		margin: 0 auto;

		.project-imgs-content {
			width: 95%;
			padding: 20rpx;
			background: #F2EDED;
			border-radius: 15rpx;

			.project-video {
				width: 100%;
				height: 400rpx;
				border-radius: 15rpx;
				overflow: hidden;
				display: block;
			}

			.project-img {
				width: 100%;
				border-radius: 15rpx;
				overflow: hidden;

				.img {
					width: 100%;
					border-radius: 15rpx;
					overflow: hidden;
					display: block;
					margin-top: 20rpx;
				}
			}

		}
	}
</style>


<style lang="scss">
	.det0 {
		width: 100%;

		.det {
			width: 95%;
			margin: auto;
			padding-bottom: 20rpx;
			padding-top: 20rpx;

			.det1 {
				font-size: 34rpx;
				font-size: 500;


			}

			.det2 {
				margin-top: 20rpx;
				background: #f7f7f7;
				width: 95%;
				padding-top: 20rpx;
				padding-bottom: 20rpx;
				border-radius: 15rpx;
				color: #fff;
				padding-left: 20rpx;
				padding-right: 20rpx;
				font-size: 28rpx;

				.det2_1 {
					float: left;
					padding-left: 20rpx;
					padding-right: 20rpx;
					height: 40rpx;
					line-height: 40rpx;
					text-align: center;
					border-radius: 5rpx;
					background: rgb(255, 159, 0);
					color: #fff;
					margin-right: 15rpx;
					margin-top: 5rpx;
				}

				.det2_2 {
					float: left;
				}
			}
		}
	}

	.share-box {
		position: fixed;
		padding-right: 10rpx;
		width: 80rpx;
		height: 80rpx;
		right: 0;
		bottom: 180rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 16rpx 0 0 16rpx;
		background: rgba(0, 0, 0, 0.8);
	}

	.share-box button {
		padding: 0;
		background: 0;
		line-height: 60rpx;
	}

	.share-box .iconfont {
		margin-bottom: 10rpx;
		font-size: 50rpx;
		color: #ffffff;
	}

	.project-detail {
		/* padding: 30rpx; */

	}

	.project-detail .title {
		font-size: 44rpx;
	}

	.project-detail .info {
		padding: 10rpx 0;
		color: #999999;
	}

	.project-detail .project-content {
		width: 100%;
		box-sizing: border-box;
		line-height: 60rpx;
		font-size: 34 rpx;
		overflow: hidden;
	}

	.project-detail .project-content image,
	.project-detail .project-content img {
		display: block;
		max-width: 100%;
	}

	.btns-wrap {
		position: fixed;
		height: 90rpx;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
	}

	.btns-wrap button,
	.btns-wrap button:after {
		height: 91rpx;
		line-height: 90rpx;
		margin: 0;
		padding: 0;
		flex: 1;
		border-radius: 0;
		border: 0;
	}



	.btns-wrap button.buy {
		background: #5b66fb;
	}

	.btns-wrap button.buy2 {
		background: #adadad;
	}

	input::-webkit-input-placeholder {
		font-size: 10rpx
	}

	.callphone {
		display: inline-block;
		width: 170rpx;
		height: 45rpx;
		padding-left: 50rpx;
	}

	.callphone>image {
		width: 170rpx;
		height: 45rpx;
	}


	.btns-wrap {
		position: fixed;
		height: 90rpx;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;

	}

	.btns-wrap button,
	.btns-wrap button:after {
		height: 91rpx;
		line-height: 90rpx;
		margin: 0;
		padding: 0;
		flex: 1;
		border-radius: 0;
		border: 0;
	}



	.btns-wrap button.buy {
		background: #5b66fb;
	}

	.btns-wrap button.buy2 {
		background: #eb1a1e;
	}

	.btns-wrap button.buy3 {

		view {
			width: 100%;
			line-height: 90rpx;
			text-align: center;
		}
	}


	input::-webkit-input-placeholder {
		font-size: 10rpx
	}



	.btns-wrap {
		position: fixed;
		height: 90rpx;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;

	}

	.btns-wrap .icon-box {
		width: 90rpx;
		height: 90rpx;
		border-right: 1px solid #dddddd;
	}

	.btns-wrap .icon-box .iconfont {
		font-size: 40rpx;
		color: #888888;
	}

	.btns-wrap .icon-box .iconfont .num {
		position: absolute;
		top: 10rpx;
		left: 50%;
		height: 30rpx;
		min-width: 30rpx;
		overflow: hidden;
		line-height: 32rpx;
		border-radius: 15rpx;
		font-size: 20rpx;
		color: #ffffff;
		background: red;
	}

	.btns-wrap button,
	.btns-wrap button:after {
		height: 91rpx;
		line-height: 90rpx;
		margin: 0;
		padding: 0;
		flex: 1;
		border-radius: 0;
		border: 0;
	}

	.btns-wrap button.add-cart {
		background: $orange-color;
	}

	.btns-wrap button.buy {
		background: $dominant-color;
	}
</style>