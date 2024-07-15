<template>
	<scroll-view scroll-y="true" class="project-list-wrap scroll-Y" :style="'height:' + scrollviewHigh + 'px;'"
		lower-threshold="50" @scrolltolower="scrolltolowerFunc">
		<view class="project-top" :class="{'low':!child_cate_list.length}">
			<view class="project-tab flex-c">
				<view class="tab" v-for="(item,index) in tabList" :key="index" :class="{'active' : cur_tab == index}"
					@click="tabChange(index,item.value)">
					{{item.label}}
				</view>
			</view>
			<view class="screen-bar flex-c">
				<view class="screen-item flex-c">
					<picker class="category-picker" @change="categoryChange" :value="category_index"
						:range="category_list" range-key="label">
						<view class="screen-value text-ellipsis"
							:class="{'active' : category_list[category_index] && category_list[category_index].label}">
							{{category_list[category_index] && category_list[category_index].label || '行业'}}
						</view>
					</picker>
					<i class="iconfont CaretDown-f"></i>
				</view>
				<view class="screen-item flex-c" @click="regionalStatus = true">
					<view class="screen-value text-ellipsis" :class="{'active' : regionText}">
						{{regionText || '地区'}}
					</view>
					<i class="iconfont CaretDown-f"></i>
				</view>

				<view v-if="regionText || params.category_id" class="reset-btn" @click="resetHandle">
					重置
				</view>
			</view>
			<view v-if="child_cate_list.length" class="category-list hide-scrollbar flex">
				<view class="category-item" v-for="(item,index) in child_cate_list" :key="index"
					:class="{'active':child_cate_id == item.category_id}" @click="childCateChange(item.category_id)">
					{{item.name}}
				</view>
			</view>
		</view>
		<view class="project-list-content" :class="{'low':!child_cate_list.length}">
			<!-- 供需列表 -->
			<ProjectList :project_list="project_list" :loading='loading' :no_more='no_more' />
		</view>

		<regionalComponents v-show="regionalStatus" ref="regionalComponents" :defaultData="defaultData"
			@cancel="regionalCancel" @confirm="regionalConfirm"></regionalComponents>
	</scroll-view>
</template>

<script>
	import ProjectList from '@/components/ProjectList.vue'
	import regionalComponents from '@/components/regionalComponents/regionalComponentsa.vue'
	export default {
		components: {
			ProjectList,
			regionalComponents
		},
		data() {
			return {
				loading: true,
				scrollviewHigh: 0,
				tabList: [{
					label: this.$nw("需求"),
					value: 'xq'
				}, {
					label: this.$nw("供应"),
					value: 'gy'
				}],
				cur_tab: 0,
				project_list: [],
				regionalStatus: false,
				regionalComponents: null,
				defaultData: {
					province_id: 0,
					city_id: 0,
					region_id: 0,
					street_id: 0,
					address_id: 0,
				},
				params: {
					type: 'xq',
					page: 1,
					category_id: '',
					province_id: '',
					city_id: '',
					region_id: '',
					shanghui: -1,
				},
				child_cate_id: null,
				regionText: '',
				category_list: [],
				child_cate_list: [],
				category_index: null,
				no_more: false
			}
		},
		onShow() {

		},
		onShareAppMessage() {},
		onShareTimeline() {},
		onLoad(option) {
			let _this = this
			_this.setGlobalColor({
				bgc: '#fff'
			})
			uni.getSystemInfo({
				success(res) {
					_this.scrollviewHigh = res.windowHeight;
				}
			});
			uni.setNavigationBarTitle({
				title: _this.$nw('供需列表'),
			})
			_this.getCategory(option.category_id || null)
			_this.getProjectList(option.category_id || null)
		},
		methods: {
			childCateChange(id) {
				if (this.child_cate_id == id) return
				this.child_cate_id = id
				this.params.page = 1
				this.getProjectList(id)
			},
			categoryChange(e) {
				console.log('categoryChange', e);
				this.category_index = e.detail.value
				this.params.category_id = this.category_list[this.category_index] && this.category_list[this
					.category_index].value
				this.params.page = 1
				this.child_cate_id = null
				this.getProjectList()
				this.child_cate_list = this.category_list[this.category_index].child || []
			},
			// 获取分类列表
			getCategory(category_id) {
				this._get('plus.supply.supply/getCategory', {}, (res) => {
					if (res.code == 1) {
						this.category_list = res.data.category || []
						for (let i = 0; i < this.category_list.length; i++) {
							this.category_list[i].label = this.category_list[i].name
							this.category_list[i].value = this.category_list[i].category_id
							if (category_id && category_id == this.category_list[i].category_id) {
								this.category_index = i
								this.child_cate_list = this.category_list[i].child || []
							}
						}
						console.log('category_list--->', this.category_list);
					}
				}, (err) => {
					console.log('请求结束-->')
				})
			},

			getProjectList(category_id) {
				this.loading = true;
				uni.showLoading({
					title: this.$nw("加载中")
				});
				this.no_more = false
				if (category_id) {
					this.params.category_id = category_id
				}
				this._get('plus.project.project/getList', this.params, (res) => {
					if (res.code == 1) {
						if (this.params.page <= 1) {
							this.project_list = []
						}
						this.project_list = this.project_list.concat(res.data.lists.data);
						console.log('project_list---->', this.project_list);
						if (res.data.lists.last_page <= this.params.page) {
							this.no_more = true;
						}
					}
					uni.hideLoading();
					setTimeout(() => {
						this.loading = false
					}, 500)
				}, (err) => {
					console.log('请求结束-->')
					uni.hideLoading();
					this.loading = false
				})
			},

			regionalCancel() {
				this.regionalStatus = false;
			},

			regionalConfirm(e) {
				console.log('regionalConfirm', e)
				this.params.province_id = e.province_id;
				this.params.city_id = e.city_id;
				this.params.region_id = e.region_id;
				this.params.street_id = e.street_id;
				this.regionText = e.province + e.city + e.area + e.street;
				this.regionalStatus = false;
				this.params.page = 1
				this.getProjectList()
			},

			tabChange(index, type) {
				if (this.cur_tab == index) return
				this.cur_tab = index
				this.params.type = type
				this.params.page = 1
				this.getProjectList()
			},

			/* 下拉加载 */
			scrolltolowerFunc() {
				console.log('scrolltolowerFunc---->');
			},

			// 重置
			resetHandle() {
				this.params.province_id = '';
				this.params.city_id = '';
				this.params.region_id = '';
				this.params.street_id = '';
				this.params.category_id = '';
				this.regionText = '';
				this.params.page = 1;
				this.category_index = null;
				this.child_cate_list = []
				this.child_cate_id = null
				this.getProjectList();
			},

			// 秒杀商品详情
			toDetail(item) {
				uni.navigateTo({
					url: '/main/pages/product/detail/detail?product_type=product&product_id=' + item.product_id
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.project-list-wrap {
		position: relative;
		background-color: #F4F7FB;

		.project-top {
			width: 100%;
			height: 190rpx;
			background: #fff;
			position: fixed;
			z-index: 2;

			&.low {
				height: 144rpx;
			}

			.project-tab {
				justify-content: center;

				.tab {
					padding: 6rpx 0;
					margin: 0 70rpx;
					color: #999;
					position: relative;

					&::after {
						content: "";
						width: 100%;
						height: 4rpx;
						background: #1B94E0;
						border-radius: 18rpx;
						position: absolute;
						bottom: 0;
						left: 50%;
						transform: translateX(-50%);
						opacity: 0;
					}

					&.active {
						color: #333;
						font-weight: 500;

						&::after {
							opacity: 1;
						}
					}
				}
			}

			.screen-bar {
				padding: 24rpx 24rpx 0;

				.screen-item {
					margin-left: 36rpx;

					.screen-value {
						max-width: 240rpx;
						font-size: 24rpx;

						&.active {
							color: #1B94E0;
						}
					}

					.iconfont {
						color: #333;
						font-size: 22rpx;
						margin-left: 8rpx;
					}

					&:first-of-type {
						margin-left: 0;
					}
				}

				.reset-btn {
					margin-left: auto;
					font-size: 24rpx;
					color: #1B94E0;
				}
			}

			.category-list {
				overflow: hidden;
				overflow-x: auto;
				white-space: nowrap;
				margin: 8rpx 24rpx 0;

				.category-item {
					flex: 0 0 auto;
					font-size: 20rpx;
					padding: 8rpx 0;
					margin-right: 16rpx;

					&.active {
						color: #1B94E0;
					}

					&:last-of-type {
						margin-right: 0;
					}
				}
			}
		}

		.project-list-content {
			box-sizing: border-box;
			position: relative;
			z-index: 1;
			padding: 0 24rpx;
			padding-top: 190rpx;
			padding-bottom: calc(40rpx + env(safe-area-inset-bottom) / 2);

			&.low {
				padding-top: 144rpx;
			}
		}
	}
</style>