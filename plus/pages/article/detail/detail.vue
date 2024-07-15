<template>
	<view class="article-detail" v-if="loadding">
		<view class="title fb">{{ article.article_title }}</view>
		<view class="info d-b-c f24">
			<view>
				<text class="red" :style="'color:'+getMainTextColor()+';'"
					v-if="article.category">{{ article.category.name}}</text>
				<text class="ml30">{{ article.create_time }}</text>
			</view>
		</view>
		<view class="d-b-c" v-if="article.attachment.file_url">
			<view class="">{{article.attachment.name}}</view>
			<view @click="download(article.attachment.file_url)">{{$nw("附件下载")}}</view>
		</view>
		<view class="article-content" v-html="article.article_content"></view>

		<view class="share-box" style="bottom: 280rpx;">
			<button type="primary" @click="zan">
				<image class="icon-collect" v-if="like_status == 0" src="/static/video/like_f.png"></image>
				<image class="icon-collect" src="/static/video/like_o.png" v-else></image>


			</button>
		</view>

		<view class="share-box">
			<button type="primary" @click="collect">
				<image class="icon-collect" v-if="collect_status == 0" src="/static/video/collect_f.png"></image>
				<image class="icon-collect" src="/static/video/collect_o.png" v-else></image>

			</button>
		</view>

		<!--分享-->
		<!-- #ifndef APP -->
		<view class="share-box" style="bottom: 80rpx;">
			<button type="primary" @click="showShare"><text class="icon iconfont icon-share"
					style="color: #fff;"></text></button>
		</view>
		<!-- #endif -->

		<!--底部弹窗-->
		<share :isbottmpanel="isbottmpanel" :article_id="article_id" @close="closeBottmpanel"></share>
		<service :itemData="t_service"></service>

	</view>
</template>

<script>
	import share from './popup/share.vue'
	import utils from '@/common/utils.js';
	import service from '@/components/diy/service/service';

	export default {
		components: {
			share,
			service,

		},
		data() {
			return {
				t_service: {},
				isbottmpanel: false,
				url: null,
				/*是否加载完成*/
				loadding: false,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*文章id*/
				article_id: 0,
				/*文章详情*/
				article: {
					image: {}
				},
				from_user_id: '',
				collect_id: 0, //收藏ID
				collect_status: 0,
				like_status: 0,
			};
		},
		onShow() {
			this.joinShare();
			this.t_service = uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {};
			if (this.t_service) {
				this.t_service.style.bottom = "30"
			}
			uni.setNavigationBarTitle({
				title: this.$nws("文章详情")
			})
		},
		onLoad(e) {
			/*分类id*/
			this.article_id = e.article_id;
			this.from_user_id = e.from_user_id;
			//#ifdef H5
			this.url = window.location.href;
			//#endif
		},
		computed: {
			textColor() {
				return this.setColor()
			},
			bgcColor() {
				return this.setBackgroundColor()
			},
		},
		mounted() {
			this.getData();
			this.setGlobalColor()
		},
		onShareTimeline() {
			let self = this;
			return {
				title: self.article.article_title,
			};
		},
		methods: {
			/**
			 * 设置分享内容
			 */
			onShareAppMessage() {
				let self = this;
				return {
					title: self.article.article_title,
					path: '/plus/pages/article/detail/detail?article_id=' + self.article_id
				};
			},
			zan() { //点赞
				let self = this;
				self._get('product.collect/add', {
					id: self.collect_id,
					product_id: self.article_id,
					type: "like_article"
				}, function(res) {

					if (res.code) {
						uni.showToast({
							title: self.like_status == 0 ? self.$nw("点赞成功") : self.$nw("取消点赞成功"),
							duration: 2000,
							icon: 'none'
						});
						self.like_status = res.data.status;
					}
				}, function() {}, function() {}, false);
			},
			collect() { //收藏
				let self = this;
				self._get('product.collect/add', {
					id: self.collect_id,
					product_id: self.article_id,
					type: "collect_article"
				}, function(res) {

					if (res.code) {
						uni.showToast({
							title: self.collect_status == 0 ? self.$nw("收藏成功") : self.$nw("取消收藏成功"),
							duration: 2000,
							icon: 'none'
						});
						self.collect_status = res.data.status;
					}
				}, function() {}, function() {}, false);
				//this.thumbsup_handle(this, this.article_id, "collect", "article");
			},
			download(url) {
				// #ifdef H5
				window.location.href = url
				// #endif
				// // #ifndef H5
				// copyText(e){
				// 	 uni.setClipboardData({
				// 		 data: e,
				// 		 success: function () {
				// 			 console.log('success');
				// 		 }
				// 	 })
				// },
				// // #endif
			},
			// 用户参与分享
			joinShare() {
				if (this.from_user_id == 0) {
					return false;
				}
				let self = this;
				let params = {
					article_id: self.article_id,
					from_user_id: self.from_user_id,
					to_user_id: uni.getStorageSync('user_id'),
				};
				this._get('plus.sharePolite.SharePolite/getIntegral', params, function(res) {})
			},
			//关闭分享
			closeBottmpanel(data) {
				this.isbottmpanel = false;
				if (data.type == 2) {
					this.poster_img = data.poster_img;
					this.isCreatedImg = true;
				}
			},
			showShare() {
				this.isbottmpanel = true;
			},
			/*获取文章详情*/
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				this.loading = true;
				let article_id = self.article_id;
				this._get(
					'plus.article.article/detail', {
						article_id: article_id,
						url: self.url,
					},
					function(res) {
						/*详情内容格式化*/
						res.data.detail.article_content = utils.format_content(res.data.detail.article_content);

						self.article = res.data.detail;
						self.collect_id = res.data.detail.collect_id
						self.collect_status = res.data.detail.collect_status
						self.loadding = true;
						uni.hideLoading();

						// 配置微信分享参数
						if (self.url != '') {
							if (!uni.getStorageSync('user_id')) {
								// self.doLogin();
								self.login();
							}

							let params = {
								article_id: self.article_id,
								from_user_id: uni.getStorageSync('user_id'),
							};
							self.configWx(res.data.share.signPackage, res.data.share.shareParams, params);
						}
					},
					function() {},
					function() {}, false

				);
			}
		}
	};
</script>

<style scoped>
	.share-box {
		position: fixed;
		padding-right: 10rpx;
		width: 80rpx;
		height: 80rpx;
		right: 0;
		bottom: 180rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 16rpx 0 0 16rpx;
		background: rgba(0, 0, 0, 0.8);
	}

	.icon-collect {
		width: 50rpx;
		height: 45rpx;
	}

	.share-box button {
		padding: 0;
		background: 0;
		line-height: 60rpx;
	}

	.share-box .iconfont {
		margin-bottom: 10rpx;
		font-size: 50rpx;
		color: #ffffff;
	}

	.article-detail {
		padding: 30rpx;
		background: #ffffff;
	}

	.article-detail .title {
		font-size: 44rpx;
	}

	.article-detail .info {
		padding: 40rpx 0;
		color: #999999;
	}

	.article-detail .article-content {
		width: 100%;
		box-sizing: border-box;
		line-height: 60rpx;
		font-size: 34rpx;
		overflow: hidden;
	}

	.article-detail .article-content image,
	.article-detail .article-content img {
		display: block;
		max-width: 100%;
	}
</style>