<template>
	<view class="bg-lottery pr" style="position: fixed;" 
	>
		<image :src="bg_image"
		style=" width: 750rpx;position: fixed;top: 0rpx;left: 0rpx;"
		 :style="'height:'+(height+45)+'px;'"></image>
		<view class="d-b-c top-box ww100">
			<view class="d-s-c">
				<image class="lottery-points" src="/static/icon/lottery-points.png" mode=""></image>
				<text class="yellow f28">{{$nw("账户")}}{{ points_name() }}</text>
				<text class="white f36 ml10">{{ user_points }}</text>
			</view>
			<view class="points-rule" @click="isRule = true">{{$nw("活动规则")}}</view>
		</view>
		<view class="rule-title" style="font-weight: 600;">
			<view class="tc mt20 f28">{{$nw("每次抽奖消耗")}} {{ points }} {{ points_name() }},{{$nw("今日剩余")}}{{ times }}{{$nw("次")}}</view>
		</view>

		<view class="lottery-title">
			<almost-lottery
				:prizeList="prizeList"
				:prizeIndex="prizeIndex"
				:lotteryBg="'/uni_modules/almost-lottery/static/almost-lottery/almost-lottery__bg.png'"
				:actionBg="'/uni_modules/almost-lottery/static/almost-lottery/action.png'"
				@reset-index="prizeIndex = -1"
				@draw-start="handleDrawStart"
				@draw-end="handleDrawEnd"
				@finish="handleDrawFinish"
				v-if="prizeList.length"
			/>
		</view>

		<view class="ww100 mb23 mt40" v-if="prizeList.length">
			<button type="default" class="record" @click="gotoPage('plus2/pages/lottery/WinningRecord')">
				{{$nw("中奖记录")}}
				<text class="icon iconfont icon-bofang"></text>
			</button>
		</view>
		<scroll-view scroll-y="true" class="content" style="height: 280rpx;"> 
			<swiper class="swiper" vertical circular autoplay interval="2000" display-multiple-items="5">
				<swiper-item v-for="(item, index) in listData" :key="index">
					<view class="box">
						<view class="text-ellipsis" style="font-weight: 600;">{{ points_name(item.showText) }}</view>
					</view>
				</swiper-item>
			</swiper>
		</scroll-view>
		<popup :show="isPopup" type="middle" backgroundColor="#ea564c" :padding="40" :width="638" @hidePopup="hidePopup">
			<view class="pr ww100 tc mb38">
				<view class="pop-tit-line"></view>
				<view v-if="result.type == 3" class="pop-tit-text">{{$nw("恭喜，中奖啦")}}</view>
				<view v-if="result.type == 0" class="pop-tit-text">{{$nw("很遗憾，您未中奖哦")}}</view>
			</view>
			<view class="d-c-c d-c ww100 product-box pr">
				<view class="circular-left"></view>
				<view class="circular-right"></view>
				<view></view>
				<view class="pop_img"><image :src="result.image" mode=""></image></view>
				<view class="targetLink" v-if="result.type == 3" @click="gotoPage('/pages/plus/lottery/WinningRecord')">
					<view class="f26 text-ellipsis fb">{{ result.name }}</view>
				</view>
				<view class="" v-else>
					<view class="f26 text-ellipsis fb">{{ result.name }}</view>
				</view>
			</view>
		</popup>
		<popup :show="isRule" :width="575" :heigth="550" :padding="0" @hidePopup="isRule = false"
		 backgroundColor="none">
			<view class="pop-center" style="background: rgba(0,0,0,0.3);">
				<image class="bg-rule" src="/static/invite/bg-rule.png" mode=""></image>
				<view class="pop-title">{{$nw("活动规则")}}</view>
				<scroll-view scroll-y="true" style="height: 473rpx;">
					<view class="pop-title-box" style="color: #fff;">{{ content }}</view>
				</scroll-view>
			</view>
		</popup>
	</view>
</template>

<script>
import popup from '@/components/uni-popup.vue';
import AlmostLottery from '@/uni_modules/almost-lottery/components/almost-lottery/almost-lottery.vue';
import uniLoadMore from '@/components/uni-load-more.vue';
export default {
	components: {
		AlmostLottery,
		popup,
		uniLoadMore
	},
	data() {
		return {
			height:667,
			loading: true,
			finish: false,
			times: 0,
			points: '',
			user_points: '',
			bg_image: '',
			content: '',
			// 以下是奖品配置数据
			// 奖品数据
			prizeList: [],
			// 奖品是否设有库存
			onStock: true,
			// 中奖下标
			prizeIndex: -1,
			result: {},
			listData: [],
			/*样式*/
			styleValue: '',
			/*当前角标*/
			index_num: 0,
			/*高度*/
			lineHeight: 0,
			/*最大数*/
			maxSize: 0,
			/*时间*/
			timer: null,
			isPopup: false,
			isRecord: false,
			recordList: [],
			list_rows: 10,
			last_page: 0,
			/*当前页面*/
			page: 1,
			/*没有更多*/
			no_more: false,
			isRule: false,
			order_id:"",
			
		};
	},
	computed: {
		/*加载中状态*/
		loadingType() {
			if (this.loading) {
				return 1;
			} else {
				if (this.recordList.length != 0 && this.no_more) {
					return 2;
				} else {
					return 0;
				}
			}
		}
	},
	onShow() {
		this.isRecord = false;
		this.restoreData();
		this.handleInitCanvas();
	},
	onLoad(e) {
		this.order_id = e.order_id
		
	},
	methods: {
		/*初始化*/
		init() {
			let self = this;
			if (this.listData.length > 1) {
				uni.getSystemInfo({
					success(res) {
						self.lineHeight = (res.windowWidth / 750) * 60;
						self.maxSize = self.listData.length;
						self.timer = setInterval(function() {
							self.animation();
						}, 3000);
					}
				});
				uni.getSystemInfo({
					success(res) {
						self.height = res.windowHeight;
						
					}
				});
			}
		},
		/*动画*/
		animation() {
			let self = this;
			self.index_num++;
			if (self.index_num >= self.maxSize) {
				self.index_num = 0;
			}
			this.styleValue = -self.lineHeight * self.index_num;
		},
		async getPrizeList() {
			uni.showLoading({
				title:this.$nw('奖品准备中...')
			});
			this.loading = true;
			// 等待接口返回的数据进一步处理
			let res = await this.requestApiGetPrizeList();
			if (res.ok) {
				let data = res.data;
				if (data.length) {
					this.prizeList = data;
					this.prizeIndex = -1;
				}
			} else {
				uni.hideLoading();
				uni.showToast({
					title: this.$nw('获取奖品失败')
				});
			}
		},
		requestApiGetPrizeList() {
			let self = this;
			return new Promise((resolve, reject) => {
				self._post('plus.lottery.Lottery/getLottery', {
					order_id:self.order_id
				}, function(res) {
					self.loading = false;
					self.bg_image = res.data.data.file_path;
					console.log(self.bg_image)
					self.content = res.data.data.content;
					self.prizeList = res.data.data.prize;
					self.listData = res.data.recordList;
					self.listData.forEach((item, index) => {
						let num = self.GetDateDiff(item.create_time);
						let user = item.user ? item.user.nickName : self.$nw('匿名用户');
						item.showText = num + user +  self.$nw('抽中了') + item.record_name;
					});
					self.times = res.data.nums;
					self.points = res.data.data.points;
					self.user_points = res.data.data.user_points;
					self.init();
					resolve({
						ok: true,
						data: self.prizeList
					});
				});
			});
		},
		GetDateDiff(startTime) {
			var t2 = startTime; //格式不正确需要转换
			var aftert2 = new Date(t2.replace(/-/g, '/'));
			var data = new Date();
			let times = data.getTime() - aftert2.getTime();
			var days = parseInt(times / (24 * 1000 * 3600)); //计算相差的天数
			var leave = times % (24 * 3600 * 1000); //计算天数后剩余的毫秒数

			var h = parseInt(leave / (3600 * 1000)); //计算小时数

			//计算分钟数
			var h_leave = leave % (3600 * 1000);
			var min = parseInt(h_leave / (60 * 1000));

			//计算秒数
			var min_leave = h_leave % (60 * 1000);
			var sec = parseInt(min_leave / 1000);
			let text = '';
			if (days > 0) {
				text = `${days}`+ self.$nw('天前');
			} else if (h > 0) {
				text = `${h}`+ self.$nw('小时前');
			} else if (min > 0) {
				text = `${min}`+ self.$nw('分钟前');
			} else {
				text = `${sec}`+ self.$nw('秒前');
			}
			console.log(days);
			return text;
		},
		// 重新生成
		handleInitCanvas() {
			this.prizeList = [];
			this.getPrizeList();
		},
		// 本次抽奖开始
		handleDrawStart() {
			console.log('start');
			let self = this;
			if (self.loading || !self.finish) {
				return;
			}
			// if (self.times <= 0) {
			// 	self.showError('次数不足');
			// 	return;
			// }
			self.loading = true;
			self._post(
				'plus.lottery.Lottery/draw',
				{
					order_id:self.order_id
				},
				function(res) {
					self.times--;
					self.loading = false;
					self.result = res.data.result;
					let list = [...self.prizeList];
					let prizeId = res.data.result.prize_id;
					for (let i = 0; i < list.length; i++) {
						let item = list[i];
						if (item.prize_id === prizeId) {
							// 中奖下标
							self.prizeIndex = i;
							break;
						}
					}
				},
				function(err) {
					self.loading = false;
				}
			);
		},
		hidePopup() {
			this.isPopup = false;
		},
		hideRecordPopup() {
			this.isRecord = false;
		},

		// 本次抽奖结束
		handleDrawEnd() {
			this.isPopup = true;
			this.handleInitCanvas();

			// 完成抽奖后，这里处理你拿到结果后的逻辑
		},
		// 抽奖转盘绘制完成
		handleDrawFinish(res) {
			this.finish = true;
			// 抽奖转盘准备就绪后，这里处理你的逻辑
			// console.log('抽奖转盘绘制完成', res)
		},
		/*还原初始化*/
		restoreData() {
			this.recordList = [];
			this.page = 1;
			this.no_more = false;
			this.last_page = 1;
		},
		getList() {
			let self = this;
			self.loading = true;
			self._post(
				'plus.lottery.Lottery/record',
				{
					list_rows: self.list_rows,
					page: self.page || 1
				},
				function(res) {
					self.loading = false;
					self.recordList = self.recordList.concat(res.data.list.data);
					self.last_page = res.data.list.last_page;
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}
				}
			);
		},
		getRecord() {
			this.restoreData();
			this.getList();
			this.isRecord = true;
		},
		/*可滚动视图区域到底触发*/
		scrolltolowerFunc() {
			let self = this;
			self.page++;
			self.loading = true;
			if (self.page > self.last_page) {
				self.loading = false;
				self.no_more = true;
				return;
			}
			self.getList();
		}
	}
};
</script>

<style lang="scss">
.bg-lottery {
	width: 100%;
	
	background-position: 0 0;
	overflow: hidden;
}

.rule-title {
	font-size: 26rpx;
	margin: 0 auto;
	width: 640rpx;
	margin-top: 287rpx;
	color: #ffffff;
}

.rule-title-t {
	background-color: #ee1413;
	border-radius: 12rpx;
	height: 80rpx;
	line-height: 80rpx;
	width: 400rpx;
	padding: 25rpx 35rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto;
}

.lottery-title {
	margin-top: 10%;
	position: relative;
	z-index: 1;
}

.lottery-base {
	position: relative;
	z-index: 0;
	margin-top: -6rpx;
	margin-bottom: 80rpx;
}

.base-image {
	width: 424rpx;
	height: 186rpx;
	margin: 0 auto;
}

.btn-image {
	position: absolute;
	left: 0;
	right: 0;
	margin: 0 auto;
	bottom: -48rpx;
	width: 262rpx;
	height: 130rpx;
}

button.record {
	width: 252rpx;
	height: 64rpx;
	background: #ffc519;
	border: 1px solid #ff840a;
	box-shadow: 0rpx 6rpx 5rpx 0rpx rgba(0, 0, 0, 0.12);
	border-radius: 32rpx;
	padding: 0;
	color: #956746;
	font-size: 26rpx;
	margin: 0 auto;
	display: flex;
	justify-content: center;
	align-items: center;
}
.record .icon.icon-bofang {
	font-size: 22rpx;
	color: #956746;
	margin-left: 10rpx;
}
.ruler-box {
	box-sizing: border-box;
	width: 678rpx;
	margin: 0 auto;
	background: #ffffff;
	border-radius: 12rpx;
	padding: 20rpx 45rpx;
}

.special-box {
	width: 678rpx;
	height: 60rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 22rpx;
	padding: 0 64rpx;
	box-sizing: border-box;
	margin: 60rpx auto;
}

.special-content {
	width: 551rpx;
	font-size: 30rpx;
	font-family: Source Han Sans CN;
	font-weight: 500;
	color: #e8573c;
	flex: 1;
	margin: 0 auto;
	overflow: hidden;
}

.special-content-list {
	transition: transform 0.4s;
}

.content-item {
	height: 60rpx;
	line-height: 60rpx;
}

.special-content.display_1 {
	height: 60rpx;
}

.pop_img {
	width: 130rpx;
	height: 130rpx;
	margin-bottom: 20rpx;

	image {
		width: 130rpx;
		height: 130rpx;
	}
}

.pop-record-line {
	background-color: #333333;
	width: 245rpx;
	height: 1rpx;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
	z-index: -1;
}

.pop-record-text {
	color: #333333;
	font-size: 28rpx;
	background-color: #ffffff;
	display: inline;
	padding: 0 12rpx;
}

.pop-tit-line {
	background-color: #f5ddc1;
	width: 472rpx;
	height: 2rpx;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	margin: auto;
	z-index: -1;
}

.pop-tit-text {
	color: #f5ddc1;
	font-size: 52rpx;
	background-color: #ea564c;
	display: inline;
	padding: 0 16rpx;
}

.product-box {
	border-radius: 24rpx;
	background-color: #ffffff;
	padding: 45rpx 0;
}

.circular-right {
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	background-color: #ea564c;
	position: absolute;
	top: 0;
	bottom: 0;
	margin: auto 0;
	right: -22rpx;
}

.circular-left {
	width: 44rpx;
	height: 44rpx;
	border-radius: 50%;
	background-color: #ea564c;
	position: absolute;
	top: 0;
	bottom: 0;
	margin: auto 0;
	left: -22rpx;
}

.record-box {
	padding-bottom: 70rpx;
}

.record-list-btn {
	width: 96rpx;
	height: 40rpx;
	line-height: 40rpx;
	font-size: 22rpx;
	color: #ffffff;
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 0;
	margin-left: 16rpx;
}
.targetLink {
	text-decoration: underline;
	color: #ea564c;
}
.top-box {
	position: absolute;
	top: 30rpx;
	z-index: 2;
}
.lottery-points {
	width: 56rpx;
	height: 56rpx;
	margin-right: 14rpx;
	flex-shrink: 0;
	margin-left: 20rpx;
}
.points-rule {
	width: 175rpx;
	height: 64rpx;
	background: #ffc519;
	border-radius: 31rpx 0 0 31rpx;
	color: #956746;
	font-size: 28rpx;
	line-height: 64rpx;
	text-align: center;
}
.yellow {
	color: #ffc519;
}
.pop-center {
	position: relative;
	width: 575rpx;
	height: 550rpx;
}

.pop-title {
	position: relative;
	height: 77rpx;
	line-height: 77rpx;
	color: #ffffff;
	font-size: 28rpx;
	text-align: center;
	z-index: 1;
}
.pop-title-box {
	padding: 78rpx 52rpx 20rpx 42rpx;
	white-space: pre-line;
	color: #7f685a;
	font-size: 26rpx;
	line-height: 46rpx;
}
.bg-rule {
	width: 575rpx;
	height: 550rpx;
	position: absolute;
	left: 0;
	top: 0;
	z-index: 0;
}
.swiper {
	width: 660rpx;
	/* 高度跟自己需要的子元素更改，我这里是显示3个，每个50rpx 所以是150rpx */
	height: 300rpx;
	margin: 50rpx auto;
}
.box {
	color: #ffffff;
	font-size: 24rpx;
	line-height: 1.2;
	height: 60rpx;
	box-sizing: border-box;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0 10rpx;
}
</style>
