<template>

	<view 	class="index-agent">
		<!--是分销商 v-if="is_agent && isData"-->
		<template v-if="itemData">
			<view class="banner d-c-c d-c">
				<image :src="itemData.data.background" mode="widthFix"></image>
			</view>
			<!--金额信息-->
			<view class="agent-wrap p30" style="margin-top: -60rpx;">
				<view class="d-b-c border-b p-20-0 f28 lh150">
					<view>
						<text class="gray9">{{$nw("用户名")}}：</text>
						
						<text class="fb gray3 f34" v-if="itemData.data.user">{{ itemData.data.user.nickName }}</text>
					</view>
					<view>
						<text class="gray9" v-if="itemData.data.info_words">{{ itemData.data.info_words.index.words.referee.value }}：</text>
						<text
							class="pt10 gray3" v-if="itemData.data.agent">{{ itemData.data.agent.referee ? itemData.data.agent.referee.nickName : $nw("平台") }}</text>
					</view>
				</view>
				<view class="d-s-c p-30-0 mt20">
					<view class="flex-1 d-c-c d-c">
						<view class="red">
							<text class="f22">{{$nw("¥")}}</text>
							<text class="f40">{{itemData.data.to_be_settle_money}}</text>
						</view>
						<view class="pt10 f28 gray6">{{$nw("待结算")}}</view>
					</view>

					<view class="flex-1 d-c-c d-c">
						<view class="red">
							<text class="f22">{{$nw("¥")}}</text>
							<text class="f40" v-if="itemData.data.agent">{{ itemData.data.agent.user.money }}</text>
						</view>
					
						<view class="pt10 f28 gray6" v-if="itemData.data.info_words">{{ itemData.data.info_words.index.words.money.value }}</view>
					</view>

					<view class="flex-1 d-c-c d-c">
						<view class="red">
							<text class="f22">{{$nw("¥")}}</text>
							<text class="f40" v-if="itemData.data.agent">{{ itemData.data.agent.user.freeze_money }}</text>
						</view>
						<view class="pt10 f28 gray6" v-if="itemData.data.info_words">{{ itemData.data.info_words.index.words.freeze_money.value }}</view>
					</view>
					<view class="flex-1 d-c-c d-c">
						<view class="red">
							<text class="f22">{{$nw("¥")}}</text>
							<text class="f40" v-if="itemData.data.agent">{{ itemData.data.agent.user.total_money }}</text>
						</view>
						<view class="pt10 f28 gray6" v-if="itemData.data.info_words">{{ itemData.data.info_words.index.words.total_money.value }}</view>
					</view>
				</view>
				<view class="d-c-c p-30-0">
					<button type="primary" class="btn-red flex-1"
						@click="gotoCash" v-if="itemData.data.info_words">{{ itemData.data.info_words.index.words.cash.value }}</button>
				</view>
			</view>


		</template>


	</view>
</template>

<script>
	export default {
		components: {},
		data() {
			return {
				scrollTop:0
			};
		},
		props: ['itemData'],
		created() {
	
		},
		mounted() {
				console.log("itemData",this.itemData)
		},
		methods: {
			/*去提现*/
			gotoCash() {
				uni.navigateTo({
					url: '/main/pages/agent/cash/apply/apply'
				});
			},
			
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
.index-agent .banner image{ width: 100%;}

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
	box-shadow: 0 8rpx 16rpx 0 rgba(226,35,26,.6);
}
</style>
