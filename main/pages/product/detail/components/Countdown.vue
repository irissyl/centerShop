<template>
	<view class="count-down">
		{{develop_time || '--'}}
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				develop_time: ''
			}
		},
		props: ['startTime'],
		mounted() {
			console.log('this.startTime--->', this.startTime);
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
				if (startTime === '--') {
					this.develop_time = '--'
					return false
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
				let h = days * 24 + hours
				h = h < 10 ? '0' + h : h
				const m = minutes < 10 ? '0' + minutes : minutes
				const s = seconds < 10 ? '0' + seconds : seconds
				const str = h + ':' + m + ':' + s
				this.develop_time = str
			}
		}
	}
</script>

<style lang="scss" scoped>
	.count-down {
		color: #fff;
		font-size: 24rpx;
	}
</style>