<template>
	<view>
		<!--图标入口-->
		<view class="diy-navbar mt10 " >
			<view class="item d-b-c border-b-e p20"  v-for="(item,index) in list" @click="gotoPage('plus2/pages/ranking/detail?ranking_id='+item.ranking_id)">
				<view class="gray3" >{{item.name}}</view>
				<view class="">
					<i class="icon iconfont2 icon-right"></i>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import 'common/iconfont.css'
	import utils from '../../../common/utils'
	
	export default {
		data() {
			return {
				list:[]
			}
		},
		created() {
			
		},
		onLoad() {
			this.getData()
		},
		methods: {
			getData(){
				let self = this
				self._get('plus.ranking.index/list', {}, function(res) {
					self.list = res.data
				})
			}
		},
	}
</script>

<style lang="scss" scoped>
@import "../../../card/statics/5.css";
	.column-1 .item {
		// border-bottom: #f2f2f2 1px solid;
		// display: flex;
		// margin: 20rpx 35rpx;
		// justify-content: space-around;
		// align-items: center;

		.gray3 {
			line-height: 60rpx;
			flex: 0.9 1 auto;
		}

		.icon-right {
			line-height: 60rpx;
			color: #c9c9c9;
			font-size: 24rpx;
		}
	}

	.diy-navbar {
		// margin: 20rpx;
		// padding: 20rpx;
		// border-radius: 20rpx;
		background: #FFFFFF;
		// box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
		// display: flex;
		// justify-content: flex-start;
		// flex-wrap: wrap;
	}

	.diy-navbar .item {
		// position: relative;
	}

</style>
