<template>
	<view class="project-list-wrap">
		<view v-if="showTitle" class="project-list-title flex-c">
			{{$nw('优质供需')}}
			<view class="more-btn flex-c" @click="toProjectList">
				{{$nw('全部')}}
				<i class="iconfont icon-jiantou"></i>
			</view>
		</view>
		<view class="project-list">
			<view class="project-item" v-for="(item,index) in project_list" :key="index" @click="gotoDetail(item)">
				<view class="user-info flex-c">
					<view class="avatar">
						<image v-if="item.avatarUrl || item.user.avatarUrl" class="common-img"
							:src="item.avatarUrl || item.user.avatarUrl" mode="aspectFill"></image>
					</view>
					<view class="user-text">
						<view class="name">
							{{item.nickName || item.user.nickName || '--'}}
						</view>
						<view class="dec flex-c">
							<view class="post">
								{{item.post || item.user.post || '暂无职位'}}
							</view>
							<view class="company">
								{{item.company_name || item.user.company_name || ''}}
							</view>
						</view>
					</view>
					<view class="date">
						{{item.update_time || '--'}}
					</view>
				</view>
				<view class="project-title flex-c">
					<view class="tag flex-c" :class="{'xq' : item.type == 'xq'}">
						{{item.type == 'gy' ? '供应' : '需求'}}
					</view>
					<view class="title text-ellipsis">
						{{item.title || '--'}}
					</view>
				</view>
				<view class="project-label flex-wrap">
					<view v-if="item.region && item.region.city" class="label">
						{{item.region.city}}
					</view>
					<view v-if="item.category && item.category.name" class="label flex-c">
						{{item.category.name}}
					</view>
				</view>
				<view class="project-imgs-wrap flex-c">
					<view class="imgs-box flex hide-scrollbar">
						<view v-if="item.project_video && item.project_video != '上传视频'"
							class="imgs-item common-img-bg small video">
							<video class="common-img" :src="item.project_video" :controls="false"
								:show-center-play-btn="false" :show-loading="false" :enable-progress-gesture="false"
								object-fit='cover'></video>
							<view class="video-mask">
								<i class="iconfont bofang"></i>
							</view>
						</view>
						<view class="imgs-item common-img-bg small"
							v-for="(img,i) in (item.project_images && item.project_images.split(',')) || []" :key="i">
							<image class="common-img" :src="img" mode="aspectFill"></image>
						</view>
					</view>
					<view v-if="item.project_video || (item.project_images && item.project_images.length)"
						class="arrow-box">
						<i class="iconfont icon-jiantou"></i>
					</view>
				</view>
				<view class="project-bot flex">
					<view class="bot-group flex-c">
						<view class="group-item">
							<view class="label">
								{{$nw('项目金额')}}
							</view>
							<view class="value">
								{{item.budget > 10000 ? (item.budget / 10000) + '万' : item.budget ? item.budget + '元'  : '0.00元'}}
							</view>
						</view>
						<view class="group-item">
							<view class="label">
								{{$nw('浏览量')}}
							</view>
							<view class="value">
								{{item.view || '0'}}
							</view>
						</view>
					</view>
					<view class="bot-btn" @click.stop="phoneHandle(item)">
						{{$nw('合作咨询')}}
					</view>
				</view>
			</view>
		</view>

		<view v-show="loading && project_list && project_list.length" class="load-box flex-c">
			<i class="iconfont jiazaizhong"></i>
			{{$nw('加载中')}}
		</view>

		<view v-if="no_more && !loading && project_list && project_list.length" class="nomore-box">
			<text class="nomore-content">
				{{$nw("到底了")}}
			</text>
		</view>

		<view v-if="(!project_list || !project_list.length) && !loading" class="empty-box">
			<view class="empty-icon">
				<image class="common-img"
					src="https://shanghuitest.client.xcx008.com/file/uploads/20240605/b798199e3c83e9b818f20576e825a1b9.png">
				</image>
			</view>
			<view class="empty-text">
				{{$nw("暂无数据")}}
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		name: 'ProjectList',
		data() {
			return {}
		},
		props: ['showTitle', 'project_list', 'no_more', 'loading'],

		methods: {
			phoneHandle(project) {
				if (!uni.getStorageSync('token')) {
					this.login("pass_login", [0])
					return
				}
				if (uni.getStorageSync("user_id") == project.user_id) {
					//如果是自己  不能和自己联系
					this.tip("不能和您自己联系哦", 2000);
					return;
				}
				if (!project.mobile) {
					this.tip("未获取到联系方式，请稍后再试", 2000);
					return;
				}
				// #ifdef APP-PLUS
				if (plus.os.name == "Android") {
					let Manifest = plus.android.importClass("android.Manifest");
					let MainActivity = plus.android.runtimeMainActivity();
					const CALL_PHONE = MainActivity.checkSelfPermission(Manifest.permission.CALL_PHONE)
					console.log('查看是否拥有电话权限', CALL_PHONE); // 查看是否拥有电话权限 -1/0
					if (CALL_PHONE == -1) {
						this.$emit('setPermissionShow')
						uni.makePhoneCall({
							phoneNumber: project.mobile
						})
						return
					}
				}
				// #endif
				uni.makePhoneCall({
					phoneNumber: project.mobile
				})
			},
			toProjectList() {
				uni.navigateTo({
					url: '/plus2/pages/project/list'
				})
			},
			gotoDetail(e) {
				let path = '/plus2/pages/project/detail?project_id=' + e.project_id + '&type=' + e.type + '&mobile=' + e
					.mobile
				uni.navigateTo({
					url: path
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.project-list-wrap {
		margin-top: 16rpx;

		.project-list-title {
			padding: 8rpx 0 4rpx;
			font-size: 32rpx;
			font-weight: 500;

			.more-btn {
				margin-left: auto;
				font-size: 24rpx;
				color: #999;
				line-height: 1;

				.iconfont {
					font-size: 20rpx;
					color: #999;
					margin-left: 4rpx;
					line-height: 1;
				}
			}
		}

		.project-list {
			.project-item {
				background: #fff;
				border-radius: 16rpx;
				padding: 24rpx;
				margin-bottom: 16rpx;

				.user-info {
					.avatar {
						width: 64rpx;
						height: 64rpx;
						border-radius: 8rpx;
						background: #f1f1f1;
						overflow: hidden;
					}

					.user-text {
						margin-left: 16rpx;

						.name {
							font-weight: 500;
							line-height: 1;
						}

						.dec {
							margin-top: 12rpx;

							.post,
							.company {
								font-size: 20rpx;
								color: #A7A7A7;
								line-height: 1;
							}

							.company {
								margin-left: 16rpx;
							}
						}
					}

					.date {
						font-size: 20rpx;
						color: #999;
						margin-left: auto;
					}
				}

				.project-title {
					margin-top: 20rpx;

					.tag {
						width: 56rpx;
						height: 36rpx;
						background: #1B94E0;
						font-size: 20rpx;
						color: #fff;
						border-radius: 4rpx;
						justify-content: center;

						&.xq {
							background: linear-gradient(90deg, #FE413D 0%, #FF2E60 100%);
						}
					}

					.title {
						width: calc(100% - 64rpx);
						margin-left: 8rpx;
						font-size: 32rpx;
						font-weight: 500;
					}
				}

				.project-label {
					margin-top: 8rpx;
					margin-left: -16rpx;

					.label {
						height: 36rpx;
						padding: 0 8rpx;
						background: #EEEEEE;
						border-radius: 4rpx;
						font-size: 20rpx;
						color: #666;
						margin-left: 16rpx;
					}
				}

				.project-imgs-wrap {
					margin-top: 24rpx;

					.imgs-box {
						width: calc(100% - 74rpx);
						overflow: hidden;
						overflow-x: auto;
						white-space: nowrap;

						.imgs-item {
							flex: 0 0 auto;
							width: 128rpx;
							height: 128rpx;
							border-radius: 8rpx;
							margin-right: 24rpx;
							overflow: hidden;
							background: #f1f1f1;
							position: relative;

							.video-mask {
								width: 100%;
								height: 100%;
								position: absolute;
								top: 0;
								left: 0;
								background: rgba(0, 0, 0, .2);
								z-index: 1;
								display: flex;
								align-items: center;
								justify-content: center;

								.iconfont {
									color: #fff;
									font-size: 48rpx;
								}
							}

							&:last-of-type {
								margin-right: 0;
							}
						}
					}

					.arrow-box {
						margin-left: auto;
						padding-right: 14rpx;

						.iconfont {
							font-size: 28rpx;
							color: #999;
						}
					}
				}

				.project-bot {
					margin-top: 24rpx;
					align-items: flex-end;

					.bot-group {
						.group-item {
							.label {
								font-size: 20rpx;
								line-height: 1;
							}

							.value {
								font-size: 32rpx;
								font-weight: bold;
								color: #EB1C1C;
								line-height: 1;
								margin-top: 16rpx;
							}

							&:last-of-type {
								margin-left: 62rpx;
							}
						}
					}

					.bot-btn {
						width: 156rpx;
						height: 64rpx;
						background: linear-gradient(270deg, #1B94E0 0%, #40B4FD 100%);
						border-radius: 8rpx;
						color: #fff;
						font-weight: 500;
						display: flex;
						align-items: center;
						justify-content: center;
						margin-left: auto;
					}
				}
			}
		}
	}
</style>