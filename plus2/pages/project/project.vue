<template>
	<view>
		<scroll-view scroll-y="true" :style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'"
			@scrolltolower="in_scrolltolower">
			<view class="top-tabbarx">
				<view style="display: flex;" :style="'color:'+getMainTextColor()+';'">
					<view style="flex: 0.5;"></view>

					<view @click="choose(3)" style=" height: 100rpx;line-height: 100rpx;flex: 3.5;">

						<view style="  width: 200rpx; line-height: 100rpx;text-align: right;">
							<picker @change="shanghuiChange" :range="shanghui_arr" :rangeKey="'belong_to'"
								:value="shanghui_index">
								<image style="float: right;width: 50rpx;height: 50rpx;margin-top: 25rpx;"
									src="/static/sanjiao.png" mode=""></image>

								<view
									style="width: 140rpx; white-space: nowrap;text-overflow:ellipsis; overflow:hidden; line-height: 100rpx; float: right;">
									{{(shanghui_arr[shanghui_index]? $nw(shanghui_arr[shanghui_index].belong_to):'')}}
								</view>

								<view style="clear: both;"></view>
							</picker>
						</view>


					</view>

					<view @click="choose(1)" style="height: 100rpx;line-height: 100rpx;flex: 3;">

						<image style="float: right;width: 50rpx;height: 50rpx;margin-top: 25rpx;"
							src="/static/sanjiao.png" mode=""></image>
						<view style="float: right;line-height: 100rpx;"> {{$nw("行业")}}</view>
						<view style="clear: both;"></view>
					</view>
					<view @click="choose(2)" style="height: 100rpx;line-height: 100rpx;flex: 3;">

						<image style="float: right;width: 50rpx;height:50rpx;margin-top: 25rpx;"
							src="/static/sanjiao.png" mode=""></image>
						<view style="float: right;line-height: 100rpx;">{{$nw("地区")}}</view>
						<view style="clear: both;"></view>
					</view>
					<view @click="reast" style="color: #d0d0d0; flex: 1;height: 100rpx;line-height: 100rpx;">
						{{$nw("重置")}}
					</view>
				</view>


			</view>
			<Tabbara :tabbar_list="typeArray" type="4" @tabbarEmit="tabbarEmit"></Tabbara>

			<!--列表-->
			<view class="cell-list" :style="'background:'+getMainColor()+';'">
				<view class="card-item share-btn card-item-view" :style="'background:'+getSecondBackgroundColor()+';'"
					v-for="(item, index) in projectData" @click="gotoClick(item)" :key="index">
					<view class="diy-product">
						<view class="product-list column__1">

							<view class="" style="width: 95%;margin: auto;">
								<view class="yuyue0">
									<view class="yuyue">
										<view class="yuyue_1">
											<image :src="item.user.avatarUrl" mode=""></image>
										</view>

										<view class="yuyue_2">
											<view class="yuyue_2_1" :style="'color:'+getMainTextColor()+';'">
												{{item.user.nickName}}
											</view>

											<view class="yuyue_2_3" :style="'color:'+getMainTextColor()+';'">
												<text style="font-size: 24rpx;">
													<text v-if="item.user.post">{{item.user.post}} </text> |
													<text
														v-if="item.user.company_name">{{item.user.company_name}}</text>
												</text>
											</view>

										</view>

									</view>

								</view>
							</view>

							<view class="product-item-box">
								<view class="product-info">
									<!-- 项目名称 -->
									<view class="product-title">
										<view class="product-title_label" style="margin-top: 5rpx;">
											{{$nws(item.type_name.label)}}
										</view>
										<view class="product-title_title" :style="'color:'+getTextColorWhite()+';'"
											style="margin-left: 10rpx; float: left;">{{ item.title }}</view>
										<view style="clear: both;">

										</view>
									</view>
									<!-- 行业名称 -->
									<view class="selling-point" style="margin-left: 15rpx; padding: 0rpx;"
										:style="'color: '+getTextColorGrey()+';'">
										<text>{{$nw("行业分类")}}：</text>
										<text>{{item.category?item.category.name:''}}</text>
									</view>


									<view style="margin-left: 15rpx;padding:0rpx; height: 50rpx;line-height: 50rpx; "
										:style="'color: '+getTextColorGrey()+';'">
										<text class="projectIntroduce_text"
											style="padding:0rpx;">{{$nw("项目介绍")}}：</text>
										<view class="projectIntroduce" style="line-height: 50rpx;">
											{{item.introduce}}
										</view>
									</view>

								</view>

							</view>
							<!-- <view class="box-zmt">
								<video v-if="item.project_video"  class="box-zmt-v" :src="item.project_video" ></video>
								<img v-if="item.project_images" class="box-zmt-i" src="" alt="" v-for="(item,index) in item.project_images"/>
							</view> -->

							<view class="product-imgs-list">
								<video v-if="item.project_video" class="vid" :src="item.project_video" />
								<view v-if="item.project_images" class="g-img"
									v-for="(img,index) in item.project_images" :key="index">
									<image :src="img" />
								</view>
							</view>

							<view class="product-item-box" v-if="item.type==1">
								<view class="product-info">
									<!-- 项目名称 -->
									<view class="product-title">
										<text>{{ item.company }}</text>
									</view>
									<!-- 行业名称 -->
									<view class="selling-point" :style="'color: '+getTextColorGrey()+';'">
										<text>投资地区：</text>
										<text>{{item.region.province?item.region.province:''}}
											{{item.region.city?item.region.city:''}}
											{{item.region.region?item.region.region:''}}</text>
									</view>

									<view class="selling-point" :style="'color: '+getTextColorGrey()+';'">
										<text>投资金额：</text>
										<text v-if="item.budget>10000">{{item.budget/10000}}万</text>
										<text v-else>{{item.budget}}元</text>
									</view>

									<view class="selling-point" :style="'color: '+getTextColorGrey()+';'">
										<text class="">投资行业：</text>
										<text>{{item.category_id?item.category.name:''}}</text>
									</view>

								</view>
							</view>
						</view>


						<view class="" style="font-size: 28rpx;text-align: right;"
							:style="'color: '+getTextColorGrey()+';'">
							{{item.time}} {{item.view}}次浏览
						</view>
					</view>
				</view>

				<view class="">


					<template v-if="projectData.length <= 0">
						<view class="none-data-box">
							<!-- <image src="http://imgh5.y01.cn/20210606225550dd5f35541.png" mode="widthFix"></image> -->
							<text>未获取到数据</text>

						</view>
					</template>
				</view>


			</view>


		</scroll-view>


		<!-- #ifndef APP -->
		<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm">
		</mpvue-city-picker>
		<!-- #endif -->


		<regionalComponents v-show="regionaStatus" ref="regionalComponents" :defaultData="defaultData" @cancel="cancel"
			@confirm="confirm"></regionalComponents>

		<Tabbar v-if="show_menu"></Tabbar>

		<service :itemData="t_service"></service>
	</view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import streetPicker from '@/components/mpvue-citypicker/streetPicker.vue';
	import regionalComponents from '@/components/regionalComponents/regionalComponentsa.vue'
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import Tabbara from '@/components/tabbar/tabbara.vue';
	import service from '@/components/diy/service/service';
	export default {
		components: {
			mpvueCityPicker,
			streetPicker,
			regionalComponents,
			Tabbar,
			Tabbara,
			service
		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*状态选中*/
				state_active: -1,
				/*当前页面*/
				page: 1,
				/*列表*/
				projectData: [],
				no_more: false,
				loading: false,
				transfer_setting: true,
				isCodeImg: false,
				codeImg: '',

				type_index: 0,
				typeArray: [],

				cityPickerValueDefault: [0, 0, 0],
				defaultData: {
					province_id: 0,
					city_id: 0,
					region_id: 0,
					street_id: 0,
					address_id: 0,
				},
				selectCity: this.$nw("选择省,市,区"),

				addressarr: {},
				selectStreet: this.$nw("选择街道/镇/乡"),
				selectRegion: this.$nw("选择地区"),
				is_street: false,
				streetDataList: [],
				regionaStatus: false,


				staffInfo: {
					category_id: "",
					province_id: "",
					city_id: "",
					region_id: "",
				},
				currentIndustry: "",
				show_menu: false,

				shanghui_arr: [],
				shanghui_index: 0,
			};
		},
		mounted() {
			/*初始化*/
			this.init();
			/*获取数据*/
			this.getType()



		},
		onShow() {
			var self = this;
			self.isTabbar(self, "plus2/pages/project/project", function(res) {
				self.show_menu = res;
			})
			if (this.staffInfo.category_id) {
				this.projectData = [];
				this.getData();
			}
			this.setGlobalColor()
			uni.setNavigationBarTitle({
				title: this.$nws("供需平台")
			})
		},
		methods: {
			in_scrolltolower() {
				let self = this;
				console.log("触发")
				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					self.no_more = true;
					return;
				}
				self.getData();
			},
			reast() {
				this.staffInfo = {
					category_id: "",
					province_id: "",
					city_id: "",
					region_id: "",
				}
				this.projectData = [];
				this.page = 1;
				this.getData();
			},
			choose(type) {
				if (type == 1) {
					let path = '/plus2/pages/project/category?source=choose';
					uni.navigateTo({
						url: path
					})
				} else if (type == 2) {
					this.regionaStatus = true;
				}
			},
			cancel() {
				this.regionaStatus = false;
			},
			confirm(e) {
				console.log(e)
				this.staffInfo.province_id = e.province_id;
				this.staffInfo.city_id = e.city_id;
				this.staffInfo.region_id = e.region_id;
				this.staffInfo.street_id = e.street_id;
				this.selectRegion = e.province + e.city + e.area + e.street;
				this.regionaStatus = false;
				this.projectData = [];
				this.page = 1;
				this.getData();
			},
			tabbarEmit(index) {
				var self = this;
				self.typeArray.forEach(function(res) {
					res.flag = false;
				})
				self.typeArray[index].flag = true
				self.projectData = [];
				self.page = 1;
				self.getData();
			},
			getArrType() {
				var self = this;
				var type = "";
				self.typeArray.forEach(function(res) {
					if (res.flag) {
						type = res.value
					}
				})
				return type;
			},
			getType() {
				var self = this;
				self._post(
					'plus.project.project/getType', {},
					function(res) {
						self.typeArray = res.data;
						self.getData();
					})
			},
			/*初始化*/
			init() {
				let self = this;

				uni.getSystemInfo({
					success(res) {
						self.scrollviewHigh = res.screenHeight - 123;
					}
				});
				self._get('plus.project.project/getCocShanghui', {


				}, function(res) {
					self.shanghui_arr = res.data
				})

			},
			shanghuiChange(e) {
				var self = this;
				self.page = 1;
				self.projectData = [];
				self.shanghui_index = e.detail.value
				self.getData();
			},
			/*获取数据*/
			getData() {

				let self = this;
				uni.showLoading({
					title: '加载中'
				});
				let page = self.page;
				if (self.state_active == -1) {
					page = 1;
				}
				self._get('plus.project.project/getList', {
					type: self.getArrType(),
					page: page || 1,
					category_id: self.staffInfo.category_id,
					province_id: self.staffInfo.province_id,
					city_id: self.staffInfo.city_id,
					region_id: self.staffInfo.region_id,
					shanghui: (self.shanghui_arr[self.shanghui_index] &&
							self.shanghui_arr[self.shanghui_index].belong_to) ?
						self.shanghui_arr[self.shanghui_index].belong_to : -1
				}, function(res) {
					uni.hideLoading();

					self.projectData = self.projectData.concat(res.data.lists.data);
					self.projectData = self.getUnique(self.projectData, "project_id");
					self.projectData.forEach(e => {
						console.log(e, 1111);
						if (e.project_images) {
							e.project_images = e.project_images.split(',')
						}
					})
					self.last_page = res.data.lists.last_page;
					if (res.data.lists.last_page <= 1) {
						self.no_more = true;
					}
				});
			},

			/*状态切换*/
			stateFunc(e) {
				let self = this;
				if (self.state_active != e) {
					self.projectData = [];
					self.state_active = e;
					self.page = 1;
					self.getData();
				}
			},

			gotoClick(e) {
				let path = '/plus2/pages/project/detail?project_id=' + e.project_id + '&type=' + e.type + '&mobile=' + e
					.mobile
				uni.navigateTo({
					url: path
				})
			}
		}
	};
</script>

<style lang="scss">
	.box-zmt {
		// height: 150rpx;
		width: 100%;

		overflow: auto;
		align-items: center;
		display: flex;
		padding: 10rpx 20rpx;
	}

	.product-imgs-list {
		overflow-x: auto;
		white-space: nowrap;
		margin-top: 20rpx;
		margin-left: 14rpx;

		.vid {
			width: 128rpx;
			height: 128rpx;
			// background-color: red;
			border-radius: 8rpx;
		}

		.g-img {

			display: inline-block;
			width: 128rpx;
			height: 128rpx;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			overflow: hidden;
			margin-left: 24rpx;
			// background-color: red;

			img,
			image {
				width: 128rpx;
				height: 128rpx;
				// background-color: red;
			}
		}
	}

	.box-zmt .box-zmt-v {
		width: 130rpx;
		height: 130rpx;
		border-radius: 6rpx;
	}

	.box-zmt .box-zmt-i {
		width: 130rpx;
		height: 130rpx;
		margin-left: 20rpx;
		border-radius: 6rpx;
	}

	.product-item-list .product-item-head .state-text {
		margin-top: auto;
		vertical-align: middle;
	}

	.product-item-list .item {
		margin-top: 30rpx;
		padding: 30rpx;
		background: #FFFFFF;
	}

	.product-item-list .product-list,
	.product-item-list .one-product {
		padding: 20rpx 0;
		height: 160rpx;
	}

	.cell-list {
		background: #fff;
		padding: 0 22rpx;
	}

	.card-item {
		border-radius: 20rpx;
		margin: auto;
		padding: 12rpx 0;
		background: #fff;
		// border-bottom: 1rpx solid #ececec;
		margin-top: 10rpx;
	}

	.diy-product {
		padding: 20rpx 20rpx;
		padding-top: 5rpx;
		padding-bottom: 0rpx;
		/* background-color: gray; */
	}

	.diy-product .product-list.column__1 .product-item {
		/* margin-bottom: 20rpx; */
		/* margin-top: 1rpx; */
		width: 100%;
		background: #ffffff;
	}

	.diy-product .product-list.column__1 .product-item-box {
		display: flex;
		justify-content: flex-start;
		align-items: stretch;
		/* padding-left: 20rpx; */
		/* background-color: #09BB07; */
	}

	.diy-product .product-list .product-cover image {
		width: 100%;
		height: 100%;
	}

	.diy-product .product-list.column__1 .product-cover {
		width: 240rpx;
		height: 240rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.diy-product .product-list.column__1 .product-info {
		/* margin:20rpx 20rpx 20rpx 30rpx; */
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.diy-product .product-list .product-info .already-sale text {
		padding: 4rpx 8rpx;
		border-radius: 8rpx;
		background: #f2f2f7;
		color: #999;
	}

	.diy-product .product-list .product-title {
		// display: -webkit-box;
		font-size: 32rpx;
		// overflow: hidden;
		// -webkit-line-clamp: 2;
		// -webkit-box-orient: vertical;
		padding: 8rpx;
		padding-bottom: 0rpx;
		height: 50rpx;

	}

	.diy-product .product-list .product-title .product-title_label {
		float: left;
		padding-left: 20rpx;
		padding-right: 20rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		font-size: 24rpx;
		border-radius: 30rpx;
		background: #ffaa00;
		color: #fff;
	}

	.diy-product .product-list .product-title .product-title_title {
		width: 500rpx;
		height: 50rpx;
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}


	.diy-product .product-list.column__1 .product-title {
		max-height: 80rpx;
		line-height: 40rpx;
	}

	.diy-product .product-list.column__1 .selling-point {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		// line-height: 30rpx;
		// max-height: 60rpx;
		padding: 5rpx;
	}

	.diy-product .product-list.column__1 .already-sale {
		margin-top: 10rpx;
	}

	.reportBtn {
		position: relative;
		left: 180rpx;
		width: 150rpx;
		text-align: center;
		padding: 10rpx 10rpx;
		border-radius: 50rpx;
		background-color: #5b67fb;
		color: #ffffff;
	}

	.reportBtn.inactive {
		background-color: #adadad;
	}

	.left-product-item {
		display: flex;
		align-items: center;
	}

	.left-product-item>image,
	.left-product-item>img {
		width: 200rpx;
		height: 200rpx;
		margin-right: 40rpx;
	}

	.product-item-right {
		display: flex;
		flex-direction: column;
	}

	.product-item-right>view:nth-child(2) {
		width: 420rpx;
		display: inline-block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.price-other {
		display: flex;
		align-items: center;
	}

	.price-other .price-other-item {
		width: 100rpx;
	}

	.projectIntroduce_text {
		padding: 10rpx 0;
		display: inline-block;
		overflow: hidden;
	}

	.projectIntroduce {
		width: 420rpx;
		/* word-break: ; */
		display: inline-block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;

	}

	.tab {
		width: 100%;
		background: #fff;
		padding-bottom: 10rpx;



	}



	.yuyue0 {
		width: 100%;
		margin: auto;
		padding-bottom: 15rpx;
	}

	.yuyue {


		width: 100%;
		margin: auto;

		display: flex;




		.yuyue_1 {

			flex: 1.5;

			image {
				width: 100rpx;
				height: 100rpx;


				border-radius: 5rpx;

			}
		}

		.yuyue_2 {
			flex: 7;

			.yuyue_2_1 {
				width: 95%;
				font-size: 34rpx;
				margin: auto;
				margin-top: 10rpx;
				line-height: 40rpx;
			}

			.yuyue_2_3 {
				width: 95%;
				font-size: 30rpx;
				margin: auto;

			}

			.yuyue_2_4 {
				width: 90%;
				font-size: 30rpx;
				margin: auto;
				margin-top: 5rpx;
				color: #c3c1bb;
			}

		}
	}
</style>