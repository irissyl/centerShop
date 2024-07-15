<template>

	<view class="bottom-panel" :class="Visible?'bottom-panel open':'bottom-panel close'" @click="closePopup">
		<view class="popup-bg">
			<!-- <view class="wechat-box" v-if="wechat_share">
				<image src="/static/share.png" mode="widthFix"></image>
			</view> -->
		</view>
		
		<view class="content" v-on:click.stop>

			<view class="module-box module-share">
				<view @click="auditPop" class="hd d-c-c b-1px-b">
					审核
				</view>
				<view @click="deletePop" class="hd d-c-c b-1px-b">
					删除
				</view>
				<view class="hd d-c-c b-1px-b" @click="closePopup(1)">
					取消
				</view>
			</view>
		</view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				/*是否可见*/
				Visible: false,
			}
		},
		props: ['isbottmpanel', 'card_id'],
		watch: {
			'isbottmpanel': function(n, o) {
				if (n != o) {
					this.Visible = n;
				}
			}
		},
		methods: {
			/*关闭弹窗*/
			closePopup(type) {
				this.$emit('close', {})
			},
			auditPop(){
				let self = this;
				self._get('plus.card.boss/audit',{
					
					card_id:self.card_id,
					
				},function(res){
					uni.showToast({
						title:res.msg
					});
					self.closePopup();
				});
			},
			deletePop(){
				let self = this;
				self._get('plus.card.boss/delete',{
					
					card_id:self.card_id,
					
				},function(res){
					uni.showToast({
						title:res.msg
					});
					self.closePopup();
				});
			}
			
		}
	}
</script>

<style scoped>
	.bottom-panel .popup-bg {
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background: rgba(0, 0, 0, .6);
		z-index: 98;
	}
	.bottom-panel .popup-bg .wechat-box{ padding-top: var(--window-top);}
	.bottom-panel .popup-bg .wechat-box image{ width: 100%;}

	.bottom-panel .content {
		position: fixed;
		width: 100%;
		bottom: 0;
		min-height: 200rpx;
		max-height: 900rpx;
		background-color: #fff;
		transform: translate3d(0, 980rpx, 0);
		transition: transform .2s cubic-bezier(0, 0, .25, 1);
		bottom: env(safe-area-inset-bottom);
		z-index: 99;
	}

	.bottom-panel.open .content {
		transform: translate3d(0, 0, 0);
	}

	.bottom-panel.close .popup-bg {
		display: none;
	}

	.module-share .hd {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 36rpx;
	}
	
	.module-share .item button,.module-share .item button::after{ background: none; border: none;}
	

	.module-share .icon-box {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		background: #f6bd1d;
	}

	.module-share .icon-box .iconfont {
		font-size: 60rpx;
		color: #FFFFFF;
	}

	.module-share .btns {
		margin-top: 30rpx;
	}

	.module-share .btns button {
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 0;
		border-top: 1px solid #EEEEEE;
	}

	.module-share .btns button::after {
		border-radius: 0;
	}

	.module-share .share-friend {
		background: #04BE01;
	}
	.action-item {
	    display: flex;
	    align-items: center;
	    justify-content: center;
	    height: 90rpx;
	}
	.b-1px, .b-1px-t, .b-1px-b, .b-1px-tb, .b-1px-l, .b-1px-r {
	    position: relative;
		border-top: 1px solid #EEEEEE;
	}
</style>
