<template>
	<scroll-view v-if="!loading" scroll-y="true" class="project-index-wrap scroll-Y"
		:style="'height:' + scrollviewHigh + 'px;'" lower-threshold="200" @scrolltolower="scrolltolowerFunc">
		<view v-if="permissionShow" class="permission-tips">
			<view class="permission-title">
				电话权限使用说明
			</view>
			<view class="permission-content">
				“万商联营”想使用您的电话，用于帮助您后续使用联系客服、合作咨询等功能。
			</view>
		</view>
		<view class="project-index-content">
			<view class="category-bar flex-wrap">
				<view class="category-item" v-for="(item,index) in category_list" :key='index'
					@click="toProjectList(item.category_id)">
					<view class="category-icon">
						<image class="common-img" :src="item.path" mode="aspectFill" />
					</view>
					<view class="category-label text-ellipsis">
						{{item.alias_name || item.name || '--'}}
					</view>
				</view>
				<view class="category-item" @click="toProjectList()">
					<view class="category-icon">
						<image class="common-img"
							src="https://shanghuitest.client.xcx008.com/file/uploads/20240617/4488425b9b17c26be7fbf10d50e6e91c.png"
							mode="aspectFill" />
					</view>
					<view class="category-label">
						{{$nw('全部')}}
					</view>
				</view>
			</view>

			<view v-if="banner_list && banner_list.length" class="swiper-wrap">
				<swiper class="swiper" :indicator-dots="false" autoplay :interval="3000" :duration="300"
					circular="true">
					<swiper-item v-for="(item,index) in banner_list" :key="index" @click="bannerTo(item)">
						<image class="common-img" :src="item.img" mode="aspectFill" />
					</swiper-item>
				</swiper>
			</view>

			<view class="procurement-card flex-c">
				<view class="icon">
					<image class="common-img"
						src="https://shanghuitest.client.xcx008.com/file/uploads/20240617/538321c860726cde9412508c4ede376a.png"
						mode="aspectFill"></image>
				</view>
				<view class="text">
					<view class="label">
						{{$nw('集采中心')}}
					</view>
					<view class="tip">
						{{$nw('一对一服务对接')}}
					</view>
				</view>
				<view class="btn" @click="toProcurement">
					{{$nw('点击进入')}}
				</view>
			</view>

			<!-- 供需列表 -->
			<ProjectList showTitle :project_list="project_list" @setPermissionShow='setPermissionShow' />
			<!-- 菜单栏 -->
			<Tabbar />
		</view>
	</scroll-view>
</template>

<script>
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import ProjectList from '@/components/ProjectList.vue'
	export default {
		components: {
			Tabbar,
			ProjectList
		},
		data() {
			return {
				loading: true,
				scrollviewHigh: 0,
				page: 1,
				banner_list: [],
				category_list: [],
				project_list: [],
				no_more: false,
				permissionShow: false
			}
		},
		onShow() {
			// this.permissionShow = false
		},
		onShareAppMessage() {},
		onShareTimeline() {},
		onLoad() {
			let _this = this
			_this.setGlobalColor({
				bgc: '#EBF5FF'
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			uni.setNavigationBarTitle({
				title: _this.$nw('供需平台'),
			})
			// 获取banner和产品分类
			_this.getData()
			_this.getProjectList()
		},
		methods: {
			setPermissionShow() {
				this.permissionShow = true
			},
			// 获取banner和分类列表
			getData() {
				this.loading = true;
				uni.showLoading({
					title: "加载中"
				});
				this._get('plus.supply.supply/getIndex', {}, (res) => {
					this.banner_list = res.data.banner_list || []
					console.log('banner_list--->', this.banner_list);
					let category = res.data.category_list || []
					this.category_list = category.slice(0, 7);
					console.log('category_list--->', this.category_list);
					uni.hideLoading();
					this.loading = false
				}, (err) => {
					console.log('请求结束-->')
					uni.hideLoading();
					this.loading = false
				})
			},
			// 获取供需列表
			getProjectList() {
				this._get('plus.project.project/getList', {
					page: this.page,
				}, (res) => {
					if (res.code == 1) {
						let data = res.data.lists.data || []
						let list = []
						for (let i = 0; i < data.length; i++) {
							if (data[i].type == 'gy' || data[i].type == 'xq') {
								list.push(data[i])
							}
						}
						this.project_list = list.slice(0, 5);
					}

				}, (err) => {})
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
			},
			bannerTo(item) {
				console.log('item-->', item);
				let type = item.type;
				switch (type) {
					case 1:
						// 外链
						console.log('外链');
						uni.navigateTo({
							url: '/pages/webpage/webpage?url=' + item.url_link
						})
						break;
					case 2:
						// 商品详情
						console.log('商品详情');
						uni.navigateTo({
							url: '/main/pages/product/detail/detail?product_id=' + item.platform_content_id
						})
						break;
					case 3:
						// 秒杀会场
						console.log('秒杀会场');
						this.toVenue()
						break;
					case 4:
						// 图文资讯
						console.log('图文资讯');
						uni.navigateTo({
							url: '/pages/richTextPage/index?id=' + item.id
						})
						break;
					default:
						return false
				}
			},
			toVenue() {
				uni.navigateTo({
					url: '/plus/pages/seckill/list/list'
				})
			},
			toProjectList(category_id) {
				if (!category_id) {
					uni.navigateTo({
						url: '/plus2/pages/project/list'
					})
				} else {
					console.log('category_id', category_id);
					uni.navigateTo({
						url: '/plus2/pages/project/list?category_id=' + category_id
					})
				}
			},
			toProcurement() {
				uni.navigateTo({
					url: '/plus2/pages/project/procurement/index'
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.project-index-wrap {
		background: #F4F7FB;
		position: relative;

		&::before {
			content: '';
			width: 100%;
			height: 320rpx;
			background: linear-gradient(180deg, #EBF5FF 0%, rgba(225, 238, 250, 0) 100%);
			position: absolute;
			top: 0;
			left: 0;
			z-index: 0;
		}

		.project-index-content {
			padding: 12rpx 24rpx 0;
			box-sizing: border-box;
		}

		.category-bar {
			padding: 32rpx 16rpx 0rpx;
			background: #fff;
			border-radius: 16rpx;

			.category-item {
				width: 25%;
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				margin-bottom: 32rpx;

				&:nth-of-type(4n) {
					margin-right: 0;
				}

				.category-icon {
					width: 88rpx;
					height: 88rpx;
					background: #F4F7FC;
					border-radius: 24rpx;
					overflow: hidden;
					// padding: 12rpx;
				}

				.category-label {
					width: calc(100% - 20rpx);
					font-size: 22rpx;
					line-height: 1;
					margin-top: 16rpx;
					color: #444;
					text-align: center;
				}
			}
		}

		.swiper-wrap {
			height: 280rpx;
			margin-top: 16rpx;
			border-radius: 16rpx;
			background: #fff;
			overflow: hidden;

			.swiper {
				height: 100%;
			}
		}

		.procurement-card {
			height: 128rpx;
			margin-top: 16rpx;
			background: linear-gradient(90deg, #C1E7FF 0%, #F1FAFF 100%);
			border-radius: 16rpx;
			overflow: hidden;
			padding: 8rpx 16rpx;

			.icon {
				width: 112rpx;
				height: 112rpx;
			}

			.text {
				margin-left: 8rpx;

				.label {
					font-size: 32rpx;
					font-weight: 600;
					color: #1B94E0;
					line-height: 1;
				}

				.tip {
					font-size: 20rpx;
					font-weight: 500;
					color: #1B94E0;
					line-height: 1;
					margin-top: 20rpx;
				}
			}

			.btn {
				width: 136rpx;
				height: 52rpx;
				background: linear-gradient(270deg, #1B94E0 0%, #40B4FD 100%);
				font-size: 24rpx;
				color: #fff;
				font-weight: 500;
				display: flex;
				align-items: center;
				justify-content: center;
				border-radius: 99px;
				margin-left: auto;
			}
		}
	}
</style>