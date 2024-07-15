<template>
	<view class="count-down" :class="{'active' : is_active}">
		<text v-if="page_type == 'detail'" class="together-time">
			{{develop_time || '--'}}
		</text>
		<view v-else-if="page_type == 'list'" class="separated-group flex-c">
			<view class="item">
				{{h_text}}
			</view>
			<text class="symbol">:</text>
			<view class="item">
				{{m_text}}
			</view>
			<text class="symbol">:</text>
			<view class="item">
				{{s_text}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				develop_time: '',
				h_text: '',
				m_text: '',
				s_text: ''

			}
		},
		props: ['page_type', 'startTime', 'currentTime', 'overTime', 'list_index', 'is_active'],
		mounted() {
			console.log('this.startTime--->', this.startTime);
			if (this.currentTime > this.overTime) {
				return
			}
			// const testTime = '2024-06-07 11:28:00'
			// this.getTimeDiffFromString(testTime)
			// this.startTiming(testTime)

			this.getTimeDiffFromString(this.startTime)
			this.startTiming(this.startTime)
		},
		methods: {
			formatDate() {

			},
			startTiming(startTime) {
				console.log('startTime---------------------------', startTime)
				clearInterval(this.timer)
				this.timer = null
				this.timer = setInterval(() => {
					this.getTimeDiffFromString(startTime)
				}, 1000)
			},
			getTimeDiffFromString(startTime) {
				if (!startTime || startTime === '--') {
					this.develop_time = '--'
					return
				}
				const createTimeStamp = Date.parse(startTime)
				const diff = createTimeStamp - Date.now()
				const msPerSec = 1000
				const msPerMin = msPerSec * 60
				const msPerHour = msPerMin * 60
				const msPerDay = msPerHour * 24
				const days = Math.floor(diff / msPerDay)
				const hours = Math.floor((diff % msPerDay) / msPerHour)
				const minutes = Math.floor((diff % msPerHour) / msPerMin)
				const seconds = Math.floor((diff % msPerMin) / msPerSec)
				const d = days < 10 ? '0' + days : days
				// console.log('days-->', days);
				// console.log('hours-->', hours);
				// console.log('minutes-->', minutes);
				// console.log('seconds-->', seconds);
				if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
					console.log('倒计时结束');
					clearInterval(this.timer)
					this.timer = null
					this.$emit('countdDownOver', this.list_index)
					return
				}
				this.h_text = (days * 24) + hours
				this.h_text = this.h_text < 10 ? '0' + this.h_text : this.h_text
				this.m_text = minutes < 10 ? '0' + minutes : minutes
				this.s_text = seconds < 10 ? '0' + seconds : seconds
				const str = this.h_text + ':' + this.m_text + ':' + this.s_text
				this.develop_time = str
				// console.log('develop_time-->', this.develop_time);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.count-down {
		.together-time {
			color: #fff;
			font-size: 24rpx;
		}

		.separated-group {
			justify-content: center;

			.item {
				font-size: 20rpx;
				color: #F31111;
				height: 28rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				// padding: 0 8rpx;
				width: 40rpx;
				background: #fff;
				border-radius: 4rpx;
				line-height: 1;
				transition: all .2s;
			}

			.symbol {
				line-height: 1;
				font-size: 24rpx;
				color: #fff;
				margin: 0 4rpx;
				transition: all .2s;
			}
		}

		&.active {
			.separated-group {
				.item {
					background: #FA3E3E;
					color: #fff;
				}

				.symbol {
					color: #F31111;
				}
			}
		}

	}
</style>