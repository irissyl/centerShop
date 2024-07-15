<template>
	<view>
		<view class="order-msg" v-if="list.length > 0" :animation="animationData">
			<view class="item d-s-c mr20 ml10">
				<text v-if="msg" class="ml10">{{msg}}</text>
			</view>		
		</view>
	</view>
</template>

<script>
	export default {
		name: "order-msg",
		data() {
			return {
				list: [],
				index:0,
				timer: 0,
				msg: '',
				animationData: {}
			};
		},
		created() {		
			this.getList();
		},
		methods:{
			showAni(){
				let self = this;
				var animation = uni.createAnimation({
					duration: 1000,
					timingFunction: 'ease',
				})
				this.animation = animation;
				clearInterval(this.timer); 
				this.ani();
				this.timer = setInterval(()=>{
					this.ani();
				},5000);
			},
			ani(){
				let i = Math.floor(Math.random()*this.list.length);
				this.msg = this.list[i];
				console.log(this.msg)
				this.animation.translateY(-10).opacity(1).step({duration:1000}).step()
				this.animationData = this.animation.export()
				setTimeout(function() {
					this.animation.opacity(0).step({duration:1000})
					this.animationData = this.animation.export()
				}.bind(this), 3000)
			},
			closeInterval(timer) {
				this.timer = timer;
			},
			getList(){
				let self = this;
				self._get('index/orderPushMsg', {}, function(res) {
					self.list = res.data;
					self.showAni();
				});
			}
		},
		beforeDestroy(){
			clearInterval(this.timer); 
		}, 
	}
</script>

<style lang="scss">
	.order-msg {
		position: fixed;
		top: 120rpx;
		left: 20rpx;
		background-color: rgba(0,0,0,0.5);
		z-index: 99999;
		color: #FFFFFF;
		border-radius: 20rpx;
		
	}
	.order-msg .item {
		padding: 4rpx 6rpx;
	}
	.order-msg .avatar {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		overflow: hidden;
	}
</style>
