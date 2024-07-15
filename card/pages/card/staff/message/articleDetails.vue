<template>
	<view class="article-detail" :style="'min-height:' + scrollviewHigh + 'px;'">
		<view class="article-title">
			{{articleData.article_title || '--'}}
		</view>
		<view class="other-info flex-c">
			<view class="other-item">
				{{articleData.update_time || articleData.create_time || ''}}
			</view>
		</view>
		<view v-if="articleData.video_url" class="article-img video">
			<video class="common-img" :src="articleData.video_url" mode="aspectFill" />
		</view>
		<view v-if="articleData.image_url" class="article-img">
			<image class="common-img" :src="articleData.image_url" mode="widthFix" />
		</view>
		<view class="article-content">
			<u-parse :html="articleData.article_content"></u-parse>
		</view>
		<view class="article-disclaimers">
			免责声明：
			<view class="item">1.部分文章、图片、音频视频来源于网络；</view>
			<view class="item">2.因编辑需要，文字和图片、音频视频之间亦无必然联系，仅供读者参考，并不代表平台观点，不构成投资建议或决策建议，不构成对任何用户交易提供素材，请用户谨慎阅读并合理分析；
			</view>
			<view class="item">
				3.我们所转载的所有文章、图片、音频视频文件等资料版权归版权归原创所有人，因非原创文章及图片等内容无法和版权者联系，如原作者或编辑认为作品不宜上网供大家浏览，或不应无偿使用，或涉及版权问题，请及时通知我们，以迅速采取适当措施，避免给双方造成不必要的经济损失或版权纠纷问题；
			</view>
			<view class="item">4.本网页如无意中侵犯了媒体或个人的知识产权，请于文章发布后的30日内联系，我们将在第一时间删除内容，谢谢。</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phoneHeight: 0,
				scrollviewHigh: 0,
				articleData: {}
			}
		},
		onLoad(e) {
			let _this = this
			uni.getSystemInfo({
				success(res) {
					_this.phoneHeight = res.windowHeight;
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			if (!e.id) {
				_this.tip("数据获取异常，请稍后重试", 2000);
				return
			}
			_this.getArticleById(e.id)
		},
		onShow() {
			this.setGlobalColor()
		},
		onShareAppMessage() {},
		onShareTimeline() {},
		methods: {
			getArticleById(id) {
				uni.showLoading({
					title: "加载中"
				})
				this._post('plus.coc.Coc/getArticleById', {
					article_id: id,
				}, (res) => {
					this.articleData = res.data && res.data[0] || {}
					uni.hideLoading()
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.article-detail {
		background: #fff;
		padding: 16rpx 24rpx;
		padding-bottom: calc(100rpx + env(safe-area-inset-bottom) / 2);

		.article-title {
			font-size: 32rpx;
			color: #333;
			font-weight: 500;
			line-height: 1.5;
		}

		.other-info {
			margin-top: 16rpx;

			.other-item {
				color: #999;
				font-size: 20rpx;
			}
		}

		.article-img {
			width: 100%;
			background: #f1f1f1;
			border-radius: 8rpx;
			overflow: hidden;
			margin-top: 24rpx;

			&.video {
				height: 400rpx;
			}
		}

		.article-content {
			margin-top: 24rpx;
		}

		.article-disclaimers {
			padding: 30rpx 0 0;
			font-size: 24rpx;
			color: #999;
			line-height: 40rpx;
			letter-spacing: 1rpx;
			margin: 60rpx 0 0;
			border-top: 1rpx solid #eeeeee;

			.item {
				margin-top: 16rpx;
				font-size: 24rpx;
				color: #999;
				text-align: justify;
			}

		}
	}
</style>