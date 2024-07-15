<template>
	<view>
		<!-- tarrbar -->
		<view class="tarrbar">
			<view :class="redpageborder" @click="changeTar('redpage')">{{$nw("我的红包")}}</view>
			<view :class="teamborder" @click="changeTar('team')">{{$nw("团队排行")}}</view>
		</view>

		<!-- 内容列表 -->
		<teamRank v-if="modelName == 'teamRank'"></teamRank>
		<redPage v-else></redPage>
	</view>
</template>

<script>
	import teamRank from './teamrank.vue';
	import redPage from './redpage.vue';
	export default {
		data() {
			return {
				modelName:'redpage',
				redpageborder: 'border',
				teamborder: '',
			}
		},
    onShow() {
      this.setGlobalColor()
    },
		methods: {
			changeTar(val) {
				if (val == 'redpage') {
					this.modelName = 'redpage';
					this.redpageborder = 'border';
					this.teamborder = '';
				} else {
					this.modelName = 'teamRank';
					this.redpageborder = '';
					this.teamborder = 'border';
				}
			}
		},
		components:{
			teamRank,redPage
		}
	}
</script>

<style scoped>
	.tarrbar {
		display: flex;
		height: 88rpx;
		align-items: center;
	}

	.tarrbar>view {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50%;
		height: 100%;
	}

	.border {
		padding-bottom: 4rpx;
		border-bottom: 4rpx solid #E60909 !important;
		border: none;
	}
</style>
