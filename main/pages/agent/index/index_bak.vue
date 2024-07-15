<template>
	<view class="index-agent" v-if="!loadding">
		<!--头部图片-->
		<view class="banner d-c-c d-c">
			<image :src="top_background" mode="widthFix"></image>
		</view>

		<!--是分销商-->
		<template v-if="is_agent && isData">
			<!--金额信息-->
			<view class="agent-wrap p30" style="margin-top: -60rpx;">
				<view class="d-b-c border-b p-20-0 f28 lh150">
					<view>
						<text class="gray9">{{$nw("用户名")}}：</text>
						<text class="fb gray3 f32">{{ user.nickName }}</text>
					</view>
					<view>
						<text class="gray9">{{$nw(info_words.index.words.referee.value)  }}：</text>
						<text
							class="pt10 gray3">{{ agent.referee ? agent.referee.nickName : $nw("平台") }}</text>
					</view>
				</view>
				<view class="d-s-c p-30-0 mt20">
					<view class="flex-1 d-c-c d-c">
						<view class="red">
							<text class="f22">{{$nw("¥")}}</text>
							<text class="f40">{{to_be_settle_money}}</text>
						</view>
						<view class="pt10 f28 gray6">{{$nw("待结算")}}</view>
					</view>

					<view class="flex-1 d-c-c d-c">
						<view class="red">
							<text class="f22">{{$nw("¥")}}</text>
							<text class="f40">{{ agent.user.money?agent.user.money:"0.00" }}</text>
						</view>
						<view class="pt10 f28 gray6">{{$nw( info_words.index.words.money.value) }}</view>
					</view>

					<view class="flex-1 d-c-c d-c">
						<view class="red">
							<text class="f22">{{$nw("¥")}}</text>
							<text class="f40">{{ agent.user.freeze_money?agent.user.freeze_money:"0.00" }}</text>
						</view>
						<view class="pt10 f28 gray6">{{$nw( info_words.index.words.freeze_money.value) }}</view>
					</view>
					<view class="flex-1 d-c-c d-c">
						<view class="red">
							<text class="f22">{{$nw("¥")}}</text>
							<text class="f40">{{ agent.user.total_money?agent.user.total_money:"0.00" }}</text>
						</view>
						<view class="pt10 f28 gray6">{{ $nw(info_words.index.words.total_money.value) }}</view>
					</view>
				</view>
				<view class="d-c-c p-30-0">
					<button type="primary" class="btn-red flex-1"
						@click="gotoCash">{{ $nw(info_words.index.words.cash.value) }}</button>
				</view>
			</view>
			<!--图标入口-->


		</template>


		<diy :diyItems="menus" :isTuiguang='1' v-if="is_agent && isData"></diy>

		
		<!--不是分销商-->
		<template v-if="!is_agent && isData">
			<view class="no-agent">
				<view class="mt50 p-0-20 red f34 tc">{{ info_words.index.words.not_agent.value }}</view>
				<view class="p30 mt30">
					<button type="primary" class="btn-red" :style="[active]"
						@click="applyagent">{{ info_words.index.words.apply_now.value }}</button>
				</view>
			</view>
		</template>
		
		<Ad location_id="center_bottom" :interval="1500"></Ad>
		
		<service :itemData="t_service"></service>
	
	</view>
</template>

<script>
	import Ad from '@/components/ad/ad.vue';
	import service from '@/components/diy/service/service';
	
	export default {
		components: {
			Ad,
			service,
			
		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				/*菜单*/
				menus: [],
				phoneHeight: 0,
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*0：不是分销商，1：分销商申请中，2：已经是分销商*/
				is_agent: false,
				isData: false,
				/*顶部背景*/
				top_background: '',
				/*基本信息*/
				info_words: {},
				words: {},
				user: {},

				is_open_achievement: 0,
				to_be_settle_money: 0,
				agent:{
					referee:{
						nickName:""
					}
				},

			};
		},
		onLoad(e) {
			if (e.is_agent) {
				this.is_agent = e.is_agent;
			}
		},
		onShow() {
			uni.showLoading({
				title: this.$nw("加载中")
			});
			this.init()
			/*获取个人中心数据*/
			this.getData();
			this.setGlobalColor()
		},
		computed: {
			active() {
				return Object.assign(this.setBackgroundColor(), this.setColor())
			},
		},
		methods: {

			/*去提现*/
			gotoCash() {
				uni.navigateTo({
					url: '/main/pages/agent/cash/apply/apply'
				});
			},
			/*初始化*/
			init() {
				let _this = this
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight
					},
				})
			},
			/*获取数据*/
			getData() {
				let self = this;
				self._get('user.agent/center', {}, function(data) {
					console.log(data);
					self.info_words = data.data.words;
					uni.setNavigationBarTitle({
						title: self.info_words.index.title.value != '' ? self.info_words.index.title
							.value : self.info_words.index.title.default
					});
					self.top_background = data.data.background;
					self.agent = data.data.agent;
					self.user = data.data.user;
					self.menus = data.data.menus
					
					self.is_agent = data.data.is_agent;
					self.isData = true;
					self.loadding = false;
					self.is_open_achievement = data.data.is_open_achievement;
					self.to_be_settle_money = data.data.to_be_settle_money;

					uni.hideLoading();
				});
			},

			/*申请分销商*/
			applyagent() {
				uni.navigateTo({
					url: '/main/pages/agent/apply/apply'
				});
			},

			/*去商城逛逛*/
			gotoShop() {
				uni.reLaunch({
					url: '/pages/index/index'
				});
			},



			/*跳转页面*/
			gotoPage(path) {
				let timestamp = new Date().getTime();
				let url = path + "?t=" + timestamp;
				uni.navigateTo({
					url: path + "?t=" + timestamp
				});
			}
		}
	};
</script>

<style>
	.index-agent .banner {
		min-height: 167rpx;
		padding-bottom: 60rpx;
		background-repeat: no-repeat;
		background-size: 100%;
	}

	.index-agent .banner image {
		width: 100%;
	}

	.no-agent-img {
		padding-top: 60rpx;
	}

	.no-agent-img image {
		width: 300rpx;
	}

	.agent-wrap {
		background: #ffffff;
		box-shadow: 0 0 12rpx 0 rgba(0, 0, 0, 0.1);
	}

	.index-agent .agent-wrap .iconfont {
		font-size: 60rpx;
	}

	.index-agent .btn-red {
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		box-shadow: 0 8rpx 16rpx 0 rgba(226, 35, 26, .6);
	}
</style>