<template>
	<view>
		<view class="index-search-box d-b-c" id="searchBox">
			<view class="index-search t-c flex-1">
				<span class="icon iconfont icon-sousuo"></span>
				<input type="text" v-model="form.keyWord" class="flex-1 ml10 f30 gray3" value=""
					placeholder-class="f24 gray6" :placeholder="$nw('请输入昵称/ID/手机号')" confirm-type="search"
					@confirm="search()" />
			</view>
			<button class="btn ml10" @click="search()" type="default">{{$nw('查询')}}</button>
		</view>
		<!-- v-if="user.user_id != ''" -->
		<view class="" v-if="user.user_id != ''">
			<view class='user-header'>
				<view class="user-header-inner">
					<view class="user-info">
						<view class="photo">
							<image :src="user.avatarUrl" mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="name1 u-line-1">{{$nw('用户昵称')}}：{{user.nickName}}</view>
							<view class="name2 u-line-1">{{$nw('用户ID')}}：{{user.user_id}}</view>
							<view class="name2 u-line-1">{{$nw('手机号码')}}：{{user.mobile}}</view>
							<view class="name2 u-line-1">{{$nw('总人数(包括查询账户)')}}：{{user.total}}人</view>
							<view class="name2 u-line-1">{{$nw('累计消费金额')}}：{{user.pay_money}}元</view>
						</view>
					</view>
				</view>
			</view>

			<view class="top-tabbar">
				<view :class="state_active==3?'tab-item active':'tab-item'" :style="[active(state_active, 3)]"
					@click="stateFunc(3)">
					{{$nw('订单总数')}}
				</view>
				<view :class="state_active==2?'tab-item active':'tab-item'" :style="[active(state_active, 2)]"
					@click="stateFunc(2)">
					{{$nw('收益总数')}}
				</view>
				<view :class="state_active==0?'tab-item active':'tab-item'" :style="[active(state_active, 0)]"
					@click="stateFunc(0)">
					{{$nw('团队业绩')}}
				</view>
				<view :class="state_active==1?'tab-item active':'tab-item'" :style="[active(state_active, 1)]"
					@click="stateFunc(1)">
					{{$nw('个人业绩')}}
				</view>

			</view>


			<view v-if="(state_active == 2 || state_active == 3)" style="width: 93%;margin: auto;margin-top: 10rpx;">
				<view @click="todaya" style="float: left;margin-right: 10rpx;">
					{{$nw('今日')}}
				</view>
				<view @click="weeka" style="float: left;margin-right: 10rpx;">
					{{$nw('本周')}}
				</view>
				<view @click="montha" style="float: left;margin-right: 10rpx;">
					{{$nw('本月')}}
				</view>
				<picker style="float: right;" @change="bindPickerChangeb" :value="dateb" mode="date" cancel=""
					:start="startDateb" :end="endDateb">
					<view class="picker">
						{{dateb}}
					</view>
				</picker>

				<view style="float: right;">~</view>
				<picker style="float: right;" @change="bindPickerChangea" :value="datea" mode="date" cancel=""
					:start="startDatea" :end="endDatea">
					<view class="picker">
						{{datea}}
					</view>
				</picker>
				<view style="float: right;">{{$nw('选择日期')}}：</view>
				<view style="clear: both;">

				</view>
			</view>
			<view v-if="(state_active == 2 || state_active == 3)">
				<view style="width: 90%;height: 300rpx;
				margin: auto;margin-top: 20rpx;background: #f0f0ef;
				border-radius: 10rpx;position: relative;">
					<view v-if="state_active == 3" style="width: 90%;margin: auto;padding-top: 40rpx;">
						{{$nw('订单总数')}}：
					</view>
					<view v-if="state_active == 3" style="text-align: center; width: 100%;font-size: 30rpx;">
						<text style="font-size: 60rpx;">{{order_num}}</text>
					</view>
					<view v-if="state_active == 2" style="width: 90%;margin: auto;padding-top: 40rpx;">
						{{$nw('收益总数')}}：
					</view>
					<view v-if="state_active == 2" style="text-align: center; width: 100%;font-size: 30rpx;">
						<text style="font-size: 60rpx;">{{earnings}}</text>
					</view>
					
					<view style="position: absolute;top: 20rpx;right: 20rpx;" @click="detail(user.user_id,state_active)">
						{{$nw('详情')}}
					</view>
					
				</view>
			</view>
			<view v-if="(state_active == 0 || state_active == 1)" style="width: 93%;margin: auto;margin-top: 10rpx;">
				<view class="" style="float:left;">
					<view v-if="state_active==0">{{$nw('团队总业绩')}}：{{team_total}}</view>
					<view v-if="state_active==1">{{$nw('个人总业绩')}}：{{people_total}}</view>
				</view>

				<picker style="float: right;" @change="bindPickerChange" :value="date" mode="date" fields="year"
					cancel="" :start="startDate" :end="endDate">
					<view class="picker">
						{{$nw('选择年份')}}：{{date}}
					</view>
				</picker>
				<view style="clear: both;">

				</view>
			</view>

			<view class="query" style="margin-top: 15rpx;"
				v-if="month.length > 0 && (state_active == 0 || state_active == 1)">
				<view class="query1" v-for="(item,index) in month" :key="index">

					<view class="query1_val" style="color:#ff0000; margin-top: 20rpx;font-weight: 600;">
						{{item.val?item.val:0}}
					</view>
					<view class="">
						{{item.month}}{{$nw('月')}}
					</view>
				</view>
			</view>
		</view>




	</view>
</template>

<script>
	function getDate(type) {
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		if (type === 'start') {
			year = year - 10;
		} else if (type === 'end') {
			year = year;
		}
		return `${year}`;
	}

	function getDatea(type) {
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		if (type === 'start') {
			year = year - 10;
		} else if (type === 'end') {
			year = year;
		}
		return `${year}-${month}-${day}`;
	}

	function getDatec(type) {
		const date = new Date();
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();

		if (type === 'today') {
			month = month<10?"0"+month:month;
			day = day<10?"0"+day:day;
			return [
				`${year}-${month}-${day}`,
				`${year}-${month}-${day}`
			];
		} else if (type === 'week') {
			let oneDay = 1000 * 60 * 60 * 24 * 7 // 一天的时间毫秒数
			let endDay = new Date(date - oneDay)
			day = endDay.getDate() // 本月最后一天
			month = month<10?"0"+month:month;
			day = day<10?"0"+day:day;
			return [
				`${year}-${month}-${day}`,
				`${year}-${month}-${day}`
			];
		} else if (type === 'month1') {
			date.setDate(1)
			day = date.getDate()
			month = month<10?"0"+month:month;
			day = day<10?"0"+day:day;
			return [
				`${year}-${month}-${day}`
			];
		} else if (type === 'month2') {
			let nextMonthFirthDay = new Date(year,( month+1), 1) // 下个月的第一天
			let oneDay = 1000 * 60 * 60 * 24 // 一天的时间毫秒数
			let endDay = new Date(nextMonthFirthDay - oneDay)
			day = endDay.getDate() // 本月最后一天
			month = month<10?"0"+month:month;
			day = day<10?"0"+day:day;	
			return [
				`${year}-${month}-${day}`
			];
		}

	}
	
	
	/**
	 * 获取本周中任意一天的时间
	 */
	function getTargetTimeInCurrentWeek(targetNum) {
	  console.log('targetNum =>', targetNum)
	 
	  // 本周任意一天，例如：本周二，则得到2，本周六，则得到6，本周日，则得到7
	  let tarDayInWeek
	  if (targetNum === '一') {
	    tarDayInWeek = 1
	  } else if (targetNum === '二') {
	    tarDayInWeek = 2
	  } else if (targetNum === '三') {
	    tarDayInWeek = 3
	  } else if (targetNum === '四') {
	    tarDayInWeek = 4
	  } else if (targetNum === '五') {
	    tarDayInWeek = 5
	  } else if (targetNum === '六') {
	    tarDayInWeek = 6
	  } else if (targetNum === '日') {
	    tarDayInWeek = 7
	  } else {
	    console.info('getTargetTimeInCurrentWeek =>', '参数错误')
	    return
	  }
	 
	  // 实例化当前时间
	  const currentDate = new Date()
	 
	  // 今天是星期几？例如：今天是星期一，则得到1。（注：一 => 1, 二 => 2, 三 => 3, 四 => 4, 五 => 5, 六 => 6, 日 => 0）
	  const curDayInWeek = currentDate.getDay()
	  
	  // 计算偏移量
	  const offset = tarDayInWeek - curDayInWeek
	 
	  // 计算目标时间戳
	  const timestamp = currentDate.getTime() + offset * 24 * 3600 * 1000
	 
	  // 转成时间对象
	  const targetDate = new Date(timestamp)
	 
	  const year = targetDate.getFullYear() // 年份
	  let month = targetDate.getMonth() + 1 // 月份
	  month = month < 10 ? '0' + month : month.toString() // 若月份小于10则补个0
	  let day = targetDate.getDate(); // 日期
	  day = day < 10 ? '0' + day : day.toString() // 若日期小于10则补个0
	  const hours = targetDate.getHours()
	  const minutes = targetDate.getMinutes()
	  const seconds = targetDate.getSeconds()
	 
	  return year + `-` + month + `-` + day
	}

	export default {
		data() {
			return {
				/*状态选中*/
				state_active: 3,
				dataType: 3,
				form: {
					keyWord: "",
				},
				user: {
					user_id: "",

				},
				month: [{
					"month": 1,
					"val": 20
				}, {
					"month": 2,
					"val": 20
				}, {
					"month": 3,
					"val": 20
				}, {
					"month": 4,
					"val": 20
				}, {
					"month": 5,
					"val": 20
				}, {
					"month": 6,
					"val": 20
				}, {
					"month": 7,
					"val": 20
				}, {
					"month": 8,
					"val": 20
				}, {
					"month": 9,
					"val": 20
				}, {
					"month": 10,
					"val": 20
				}, {
					"month": 11,
					"val": 20
				}, {
					"month": 12,
					"val": 20
				}],
				date: getDate({
					format: true
				}),
				startDate: getDate('start'),
				endDate: getDate('end'),

				datea: getDatea({
					format: true
				}),
				startDatea: getDatea('start'),
				endDatea: getDatea('end'),

				dateb: getDatea({
					format: true
				}),
				startDateb: getDatea('start'),
				endDateb: getDatea('end'),
				team_total: "",
				people_total: "",
				order_num:0,
				earnings: 0

			}
		},
		onLoad(e) {
			if (e.mobile) {
				this.form.keyWord = e.mobile;
				this.search();
			}
		},
		onShow() {
			if (uni.getStorageSync("chooseProduct")) {
				this.form.product = uni.getStorageSync("chooseProduct");
				this.form.product_id = this.form.product.product_id;
				this.search();
			}
		},
		computed: {

			active() {
				let self = this
				return (state_active, value) => {
					if (state_active === value) {
						return Object.assign(self.setColor(true), {
							'border-bottom': '2px solid ' + self.getMainColor()
						})
					}
				}
			},

		},
		mounted() {
			this.setGlobalColor()

		},
		methods: {
			detail(user_id,state_active){
				if(state_active == 2){//收益
					uni.navigateTo({
						url:"/main/pages/agent/log/log?user_id="+user_id
					})
				}else if(state_active == 3){//订单
					uni.navigateTo({
						url:"/main/pages/agent/order/order?user_id="+user_id
					})
				}
			},
			bindPickerChange: function(e) {
				console.log(e)
				this.date = e.detail.value.substr(0, 7);
				this.search();
			},
			bindPickerChangea: function(e) {
				console.log(e.detail.value)
				this.datea = e.detail.value;
				this.search();
			},
			bindPickerChangeb: function(e) {
				console.log(e.detail.value)
				this.dateb = e.detail.value;
				this.search();
			},
			todaya() {
				this.datea = getDatec("today")[0]
				this.dateb = getDatec("today")[1]
				this.search();
			},
			weeka() {
				console.log(getTargetTimeInCurrentWeek("一"))
				console.log(getTargetTimeInCurrentWeek("日"))
				this.datea = getTargetTimeInCurrentWeek("一")
				this.dateb = getTargetTimeInCurrentWeek("日")
				this.search();
			},
			montha() {
				this.datea = getDatec("month1")[0]
				this.dateb = getDatec("month2")[0]
				this.search();
			},
			search() {
				var self = this;
				self.loading = true;
				self.form.year = self.date;
				self.form.datea = self.datea;
				self.form.dateb = self.dateb;
				self.form.dataType = self.dataType
				self._get('plus.agent.achievement/query', self.form, function(data) {
					self.loading = false;
					console.log(data.data)
					if (data.data.length == 0) {
						self.user = {
							user_id: ""
						}
						uni.showToast({
							title: data.msg,
							icon: "none"
						})
					} else {
						self.user = data.data.user
						self.month = data.data.month
						self.team_total = data.data.team_total
						self.people_total = data.data.people_total
						self.earnings = data.data.earnings
						self.order_num = data.data.order_num
					}

				});
			},
			/*状态切换*/
			stateFunc(e) {
				console.log(11111, e);
				let self = this;
				if (self.state_active != e) {
					self.page = 1;
					self.loading = true;
					self.state_active = e;
					switch (e) {
						case 0:
							self.list = [];
							self.dataType = 0;
							break;
						case 1:
							self.list = [];
							self.dataType = 1;
							break;
						case 2:
							self.list = [];
							self.dataType = 2;
							break;
						case 3:
							self.list = [];
							self.dataType = 3;
							break;
					};
					self.search();
				}
			},
		},
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}

	.query1 {
		height: 140rpx;
		float: left;
		text-align: center;
		width: 32.5%;
		line-height: 150rpx;
		border: 1rpx solid #f5f5f5;

		.query1_val {
			font-size: 28rpx;
		}
	}

	.user-header {
		position: relative;
	}

	.user-header .user-header-inner {
		position: relative;
		padding: 10rpx 30rpx 10rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		overflow: hidden;

	}

	.user-header .user-header-inner::after,
	.user-header .user-header-inner::before {
		display: block;
		content: '';
		position: absolute;
		border-radius: 50%;
		z-index: 0;
	}

	.user-header .user-header-inner::after {
		width: 400rpx;

		right: -100rpx;
		bottom: -200rpx;
		background-image: radial-gradient(90deg, rgba(255, 255, 255, 0.2) 10%, rgba(255, 255, 255, 0));
	}

	.user-header .user-header-inner::before {
		width: 200rpx;

		left: -60rpx;
		top: -20rpx;
		background-image: radial-gradient(-90deg, rgba(255, 255, 255, 0.2) 10%, rgba(255, 255, 255, 0));
	}

	.user-header .user-info {
		display: flex;
		justify-content: flex-start;
		align-items: center;
	}

	.avatar-wrapper .user-avatar,
	.avatar-wrapper .user-avatar image {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: #f7f7f7;
	}

	.avatar-wrapper {
		background-color: #eee;
	}

	.user-header .photo,
	.user-header .photo image {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
	}

	.user-header .photo {
		border: 4rpx solid #ffffff;
	}

	.user-header .info {
		padding-left: 20rpx;
		box-sizing: border-box;
		overflow: hidden;
		color: #444444;
	}

	.user-header .info .name1 {
		font-weight: 500;
		font-size: 30rpx;
	}

	.user-header .info .name2 {
		font-weight: 500;
		font-size: 28rpx;
	}

	.user-header .info .tel {
		font-size: 26rpx;
	}

	.user-header .info .grade {
		display: block;
		padding: 0 16rpx;
		height: 40rpx;
		line-height: 36rpx;
		border-radius: 20rpx;
		background: rgba(0, 0, 0, 0.2);
		color: #ffc670;
	}

	.user-header .sign-box {
		position: absolute;
		right: 20rpx;
		padding: 0 10rpx;
		height: 50rpx;
		border: 1px solid #ffe300;
		border-radius: 25rpx;
		font-size: 24rpx;
		color: #ffe300;
		z-index: 10;
	}

	.user-header .sign-box .iconfont {
		color: #ffe300;
	}
</style>