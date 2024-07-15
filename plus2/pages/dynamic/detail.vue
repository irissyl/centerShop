<template>
	<view class="">


		<view class="tdmic">
			<view style="display: flex;width: 95%;margin: auto;" @click="friend_click(detail.user.id)">
				<view class="comment1" style="flex: 1.7;">
					<image style="border: 1rpx solid #c5c5c5; width: 100rpx;height: 100rpx;border-radius: 50%;"
						:src="detail.user.image_url" mode=""></image>
				</view>
				<view class="comment2" style="flex: 8;">
					<view class="comment21" style="font-weight: 600;">
						{{detail.user.name}}
					</view>
					<view class="comment23" style="color: #b1b1b1;">
						{{detail.create_time}}
					</view>

				</view>
			</view>



			<view class="tdmic2" style="margin-top: 20rpx;">
				{{detail.name}}
			</view>

			<view style="width: 95%;margin: auto;margin-top: 30rpx;">
				<!-- #ifdef H5 -->
				<text v-if="detail.content" style="white-space: pre-wrap;"
					v-html="formatContent(detail.content)"></text>
				<!-- #endif -->

				<!-- #ifdef MP-WEIXIN -->
				<view v-if="detail.content" v-html="formatContent(detail.content)"></view>
				<!-- #endif -->

				<!-- #ifdef APP -->
				<view v-if="detail.content" v-html="formatContent(detail.content)"></view>
				<!-- #endif -->
			</view>

			<view style="width: 95%;margin: auto;" v-if="detail.images && detail.images!=''">
				<image v-for="(item,index) in detail.images" class="tdmic1" mode="widthFix" :src="item.file_path"
					@click="pre(index,detail.images)"></image>
				<view style="clear: both;">

				</view>
			</view>



			<view class="tdmic3">
				{{detail.date}}
			</view>

		</view>



		<!-- 评论 -->
		<view class="tdmic4" v-if="detail.comment_len > 0" style="margin-top: 10rpx;">
			<view class="tdmic41">
				{{$nw("共")}} {{detail.comment_len}} {{$nw("条评论")}}
			</view>
		</view>

		<view class="tdmic5" v-if="commentd.length > 0">
			<comment :clist="commentd" style="margin-top: 10rpx;"></comment>
			<view class="" style="height: 100rpx;"></view>
		</view>


		<evl v-if="detail.dynamic_id" :dynamic_id="detail.dynamic_id"></evl>
		<service :itemData="t_service"></service>

	</view>
</template>

<script>
	const app = getApp()
	import comment from "@/components/comment/comment.vue"
	import evl from "@/components/comment/evl.vue"
	import utils from '@/common/utils.js';
	import service from '@/components/diy/service/service';

	export default {
		components: {
			comment,
			evl,
			service,

		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				show_menu: false,

				user: {},
				dynamic_id: "",
				detail: {},
				clist: [],
				commentd: [],
				last_page: 0,
				page: 1,
				list_rows: 10


			}
		},
		onReachBottom() {
			this.page++;
			this.getData();
		},
		onLoad(e) {
			var self = this;
			self.dynamic_id = e.dynamic_id;
			self.setGlobalColor()

			uni.getSystemInfo({
				success(res) {
					self.height = res.windowHeight;
					console.log("self.height", self.height)
				}
			})

			uni.$on("evl", function() {
				self.getData();
			})
		},
		onShow() {
			var self = this;
			this.commentd = [];
			self.getData();
		},
		methods: {
			formatContent(e) {
				return utils.format_content(e);
			},
			pre(index, imgs) {
				var n_im = [];
				for (var i = 0; i < imgs.length; i++) {
					n_im.push(imgs[i].file_path);
				}
				uni.previewImage({
					urls: n_im,
					current: index
				})
			},
			getData() {
				var self = this;
				self._get('plus.dynamic.Dynamic/detail', {
					page: self.page,
					list_rows: self.list_rows,
					dynamic_id: self.dynamic_id,
				}, function(res) {
					console.log(res);
					self.loading = false;
					self.detail = res.data.list;
					if (res.data.comment.data.length <= 0) {
						self.page--;
					}
					self.commentd = self.commentd.concat(res.data.comment.data);
					self.commentd = self.getUnique(self.commentd, "dynamic_comment_id");
					self.last_page = res.data.comment.last_page;
					uni.hideLoading()
				});
			},
		}
	}
</script>

<style scoped lang="scss">
	page {
		background: rgb(245, 245, 245);
	}

	.tdmic5 {
		width: 100%;


		.tdmic50 {
			width: 95%;
			margin: auto;

			.tdmic51 {
				width: 80rpx;
				float: left;

				image {

					width: 72rpx;
					height: 72rpx;
					border-radius: 50%;
				}
			}

			.tdmic52 {
				float: left;
				width: 478rpx;
				height: 72rpx;
				background: #EDEEF0;
				border-radius: 40rpx;
				opacity: 1;
				margin-left: 20rpx;
				text-indent: 50rpx;
				font-size: 24rpx;
				line-height: 72rpx;
				font-family: PingFang SC-Medium, PingFang SC;
				font-weight: 500;
				color: #999999;
			}
		}

	}

	.tdmic4 {
		width: 100%;
		background: #fff;
		// margin-top: 20rpx;
		margin-bottom: 2rpx;

		.tdmic41 {

			width: 95%;
			margin: auto;
			height: 96rpx;
			line-height: 96rpx;
			font-size: 32rpx;
			font-family: PingFang SC-Bold, PingFang SC;
			font-weight: bold;
			color: #333333;
			margin-bottom: 4rpx;
		}



	}

	.tdmic {
		width: 100%;
		background: #fff;
		padding-bottom: 32rpx;
		padding-top: 30rpx;

		.tdmic1 {
			width: 200rpx;
			height: 200rpx;
			border-radius: 15rpx;
			float: left;
			margin-top: 10rpx;
			border: 1rpx solid #f5f5f5;
			margin-left: 20rpx;

		}

		.tdmic2 {
			width: 95%;
			margin: auto;
			font-size: 36rpx;
			font-family: PingFang SC-Bold, PingFang SC;
			font-weight: bold;
			color: #333333;

		}

		.tdmic3 {
			width: 95%;
			margin: auto;
			font-size: 24rpx;
			font-family: PingFang SC-Regular, PingFang SC;
			font-weight: 400;
			color: #999999;
			margin-top: 20rpx;
		}
	}
</style>