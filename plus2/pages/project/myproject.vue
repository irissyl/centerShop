<template>
	<scroll-view scroll-y="true" :style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'"
		@scrolltolower="in_scrolltolower">
		<view class="article-list-wrap" :style="'background:'+getMainColor()+';'">

			<Tabbara :tabbar_list="tab" type="1" @tabbarEmit="tabbarEmit1"></Tabbara>
		</view>

		<view class="top-tabbarx">
			<view style="display: flex;" :style="'background:'+getMainColor()+';'">
				<view style="flex: 1;"></view>
				<view @click="choose(1)" style="height: 100rpx;line-height: 100rpx;flex: 3;">
					<view style="float: left;margin-left: 105rpx;line-height: 100rpx;"
						:style="'color:'+getTextColorWhite()+';'"> {{$nw('行业')}}</view>
					<image style="float: left;width: 30rpx;height: 30rpx;margin-top: 35rpx;" src="/static/sanjiao.png"
						mode=""></image>
					<view style="clear: both;"></view>
				</view>
				<view @click="choose(2)" style="height: 100rpx;line-height: 100rpx;flex: 3;">
					<view style="float: left;margin-left: 105rpx;line-height: 100rpx;"
						:style="'color:'+getTextColorWhite()+';'">{{$nw('地区')}}</view>
					<image style="float: left;width: 30rpx;height:30rpx;margin-top: 35rpx;" src="/static/sanjiao.png"
						mode=""></image>
					<view style="clear: both;"></view>
				</view>
				<view @click="reast" style="flex: 1;height: 100rpx;line-height: 100rpx;color: #adadad;">
					{{$nw('重置')}}
				</view>
			</view>

			<Tabbara :tabbar_list="typeArray" type="4" @tabbarEmit="tabbarEmit"></Tabbara>

		</view>

		<!--列表-->

		<view class="cell-list" :style="'background:'+getMainColor()+';'">
			<view class="card-item share-btn card-item-view" 
			:style="'background:'+getSecondBackgroundColor()+';'"
				v-for="(item, index) in projectData" :key="index">
				<view class="diy-product">
					<view class="product-list column__1">
						<view class="product-item-box">
							<view class="product-info" @click="gotoClick(item)">
								<!-- 项目名称 -->
								<view class="product-title" :style="'color:'+getMainTextColor()+';'">
									<text>{{ item.title }}</text>
								</view>
								<!-- 行业名称 -->
								<view class="selling-point gray9">
									<text>行业分类：</text>
									<text>{{item.category?item.category.name:''}}</text>
								</view>

								<template v-if="item.type == 'zmlcgd' || item.type =='xmtjh' ||'xpfbh' == item.type">
									<view class="selling-point gray9">
										<text>项目所属赛道：</text>
										<text v-if="item.setting.track"> {{item.setting.track}}</text>
									</view>
									<view class="selling-point gray9">
										<text>项目亮点：</text>
										<text v-if="item.setting.lightspot"> {{item.setting.lightspot}}</text>
									</view>
									<view class="selling-point gray9" v-if="'xpfbh' != item.type">
										<text>应召者需要条件：</text>
										<text v-if="item.setting.requirement"> {{item.setting.requirement}}</text>
									</view>
								</template>

								<template v-if="item.type == 'tzrfb'">
									<view class="selling-point gray9">
										<text>投资预算：</text>
										<text v-if="item.setting.tz_yusuan"> {{item.setting.tz_yusuan}}</text>
									</view>

									<view class="selling-point gray9">
										<text>投资行业：</text>
										<text v-if="item.setting.category"> {{item.setting.category}}</text>
									</view>

								</template>


								<view class="selling-point gray9" v-if="item.type == 'gy' || item.type == 'xq' ">
									<text>项目预算：</text>
									<text v-if="item.budget>10000">{{item.budget/10000}}万</text>
									<text v-else>{{item.budget}}元</text>
								</view>





								<view class="selling-point gray9">
									<text class="projectIntroduce_text">项目介绍：</text>
									<view class="projectIntroduce">
										{{item.introduce}}
									</view>
								</view>



							</view>
							<view class="hzlist" @click="hezuo(item)" v-if="tab_active == 0">
								合作名单
							</view>
							<view style="clear: both;"></view>

						</view>

					</view>


					<view class="gray9" style="font-size: 28rpx;text-align: right;">
						{{item.time}} {{item.view}}次浏览
					</view>

					<view class="gray9" v-if="tab_active == 0" style="font-size: 28rpx;text-align: right;">
						审核状态：
						<span v-if="item.status == 0">审核中</span>
						<span v-if="item.status == 1">审核通过</span>
						<span v-if="item.status == 2">审核不通过</span>
					</view>


				</view>
			</view>

			<view :style="'background:'+getMainColor()+';'">


				<template v-if="projectData.length <= 0">
					<view class="none-data-box" :style="'background:'+getMainColor()+';'">
						<text :style="'color:'+getTextColorWhite()+';'">{{$nw("未获取到数据")}}</text>

					</view>
				</template>
			</view>


		</view>



		<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm">
		</mpvue-city-picker>
		<regionalComponents v-show="regionaStatus" ref="regionalComponents" :defaultData="defaultData" @cancel="cancel"
			@confirm="confirm"></regionalComponents>
		<!-- v-if="hezuo_flag" -->
		<view class="commodity_screen" @click="hezuo_flag = false" v-if="hezuo_flag"></view>
		<view class="fix_select" v-if="hezuo_flag">
			<view class="fix_select0" style="border: 1rpx solid #fff;">
				<view @click="hezuo_flag = false" class="fix_select_1"
					style="position: absolute;right: 20rpx;top: 20rpx;">
					关闭
				</view>
				<scroll-view scroll-y="true" style=" margin-top: 100rpx; height: 600rpx;">
					<view style="display: flex;height: 70rpx;line-height: 70rpx;border-bottom: 1rpx solid #c3c3c3;"
						v-for="(item,index) in projectuser" :key="index">
						<view style="flex: 0.8;margin-left: 10rpx;line-height: 70rpx;">
							{{index+1}}
						</view>
						<view
							style="flex: 2;line-height: 70rpx;overflow: hidden; -webkit-line-clamp: 2;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;">
							{{item.user.nickName}}
						</view>
						<view style="flex: 2.7;text-align: right;line-height: 70rpx;">
							{{item.user.mobile}}
						</view>
						<view style="flex: 0.3;">

						</view>
						<view style="flex: 1.5;">
							<view v-if="item.status == 0" @click="sureHz(item)"
								style="font-size: 24rpx;margin-top: 10rpx; border: 1rpx solid #adadad;   border-radius: 10rpx; margin-right: 10rpx; height: 50rpx;line-height: 50rpx;  text-align: center;">
								确认合作
							</view>
							<view v-if="item.status == 1" @click="sureHz(item)"
								:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
								style="font-size: 24rpx;margin-top: 10rpx; border: 1rpx solid #adadad;   border-radius: 10rpx; margin-right: 10rpx; height: 50rpx;line-height: 50rpx;  text-align: center;">
								已合作
							</view>
						</view>
					</view>

					<template v-if="projectuser.length <= 0">
						<view class="none-data-box">
							<image src="http://imgh5.y01.cn/20210606225550dd5f35541.png" mode="widthFix"></image>
							<text>未获取到数据</text>

						</view>
					</template>
				</scroll-view>



			</view>

		</view>
		<service :itemData="t_service"></service>
	
	</scroll-view>
</template>

<script>
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import streetPicker from '@/components/mpvue-citypicker/streetPicker.vue';
	import regionalComponents from '@/components/regionalComponents/regionalComponentsa.vue'
	import Tabbara from '@/components/tabbar/tabbara.vue';
	import service from '@/components/diy/service/service';

	export default {
		components: {
			mpvueCityPicker,
			streetPicker,
			regionalComponents,
			Tabbara,
			service,
			
		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				tab: [{
					id: 1,
					name: "我发布的",
					flag: true
				}, {
					id: 2,
					name: "我参与的",
					flag: false
				}],
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

				tab_active: 0,
				currentParent: 0,
				hezuo_flag: false,
				projectuser: []

			};
		},
		mounted() {
			/*初始化*/
			this.init();
			/*获取数据*/
			this.getType()
			this.setGlobalColor()


		},
		computed: {
			getbutton() {
				return this.setButton().button
			},
		},
		onShow() {
			if (this.staffInfo.category_id) {
				this.projectData = [];
				this.getData();
			}
		},
		methods: {
			in_scrolltolower() {
				console.log("出发了")
				this.page++;
				this.getData();
			},
			sureHz(item) {
				var self = this;
				console.log(item)
				//获取可合作的人数
				if (item.people_type == 1) {
					uni.showModal({
						title: self.$nw("系统提示："),
						content: "当前合作模式是单人，确认选择一人合作后，不再支持选择其他人和做，是否确认",
						success(r) {
							if (r.confirm) {
								self._post(
									'plus.project.project/sureHz', {
										project_user_id: item.project_user_id
									},
									function(res) {
										uni.showToast({
											title: "确认完成",
											icon: "none"
										})
										self.getProjectUser(item);
									})
							}
						}
					})
				} else {
					self._post(
						'plus.project.project/sureHz', {
							project_user_id: item.project_user_id
						},
						function(res) {
							uni.showToast({
								title: "确认完成",
								icon: "none"
							})
							self.getProjectUser(item);
						})
				}


			},
			hezuo(e) {
				var self = this;
				self.hezuo_flag = true;
				self.getProjectUser(e);
			},
			getProjectUser(e) {
				var self = this;
				//获取可合作的人数
				self._post(
					'plus.project.project/getProjectUser', {
						project_id: e.project_id
					},
					function(res) {
						self.projectuser = res.data.list.data;
					})
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
			tabbarEmit1(index) {
				var self = this;
				self.tab.forEach(function(res) {
					res.flag = false;
				})
				self.tab[index].flag = true
				self.tab_active = index;
				this.projectData = [];
				this.page = 1;
				this.getData();
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
				} else {
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
						self.scrollviewHigh = res.windowHeight;

					}
				});
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
				var parmas = {
					type: self.getArrType(),
					page: page || 1,
					category_id: self.staffInfo.category_id,
					province_id: self.staffInfo.province_id,
					city_id: self.staffInfo.city_id,
					region_id: self.staffInfo.region_id,
				}
				if (self.tab_active == 0) {
					parmas.code = "rel";
				} else {
					parmas.code = "join";
				}
				self._post('plus.project.project/getMyList', parmas, function(res) {
					uni.hideLoading();
					self.projectData = self.projectData.concat(res.data.lists.data);
					if (self.tab_active == 0) {
						self.projectData = self.getUnique(self.projectData, "project_id");
					} else {
						self.projectData = self.getUnique(self.projectData, "project_user_id");
					}
					if (res.data.lists.data.length <= 0) {
						self.page--;
					}
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
			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {

				let self = this;
				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					self.no_more = true;
					return;
				}
				self.getData();
			},
			gotoClick(e) {
				if (e.code == "rel") {
					uni.navigateTo({
						url: "/plus2/pages/project/addProject?project_id=" + e.project_id
					})
				} else {
					let path = '/plus2/pages/project/detail?project_id=' + e.project_id + '&type=' + e.type
					uni.navigateTo({
						url: path
					})
				}

			}
		}
	};
</script>

<style lang="scss">
	.fix_select {
		position: fixed;
		top: 25%;
		left: 5%;
		width: 90%;
		height: 700rpx;
		z-index: 2000;
		border-radius: 10rpx;
		background: #fff;
		.fix_select0 {
			position: relative;
			z-index: 2000;

			.fix_select_1 {
				width: 120rpx;
				text-align: center;
				font-size: 30rpx;
				z-index: 2500;
				color: #000;

				image {
					width: 70rpx;
					height: 70rpx;
					vertical-align: middle;
					margin: auto;
					text-align: center;
					z-index: 2000;
				}


			}
		}

	}

	/*使屏幕变暗  */

	.commodity_screen {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		opacity: 0.3;
		overflow: hidden;
		z-index: 500;
		color: #fff;
	}

	.hzlist {
		width: 140rpx;
		height: 50rpx;
		line-height: 50rpx;
		text-align: center;
		font-size: 28rpx;
		float: right;
		background: linear-gradient(to right, #f2b237, #ffda98);

	}

	.article-list-wrap {}

	.article-list-wrap .type-list .tab-item {
		padding: 0 30rpx;
		font-size: 34rpx;
		height: 86rpx;
		line-height: 86rpx;
		white-space: nowrap;

	}

	.article-list-wrap .type-list .tab-item.active {
		border-bottom: 4rpx solid var(--mainTitleTextColor);
		margin-bottom: 0;
		color: var(--mainTitleTextColor);
	}



	.product-item-list .product-item-head .state-text {
		margin-top: auto;
		vertical-align: middle;
	}

	.product-item-list .item {
		margin-top: 30rpx;
		padding: 30rpx;

	}

	.product-item-list .product-list,
	.product-item-list .one-product {
		padding: 20rpx 0;
		height: 160rpx;
	}

	.cell-list {
		padding: 0 32rpx;
	}

	.card-item {
		padding: 16rpx 0;
		border-radius: 15rpx;
		margin-bottom: 20rpx;
	}

	.diy-product {
		padding: 20rpx 20rpx;
		/* background-color: gray; */
	}

	.diy-product .product-list.column__1 .product-item {
		/* margin-bottom: 20rpx; */
		/* margin-top: 1rpx; */
		width: 100%;

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
		display: -webkit-box;
		font-size: 32rpx;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		padding: 8rpx;
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
		padding: 8rpx;
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
		padding-bottom: 10rpx;

		.tab_1 {
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;

		}

		.tab_11 {
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
			text-align: center;
			margin-right: 20rpx;
			font-size: 30rpx;
			font-family: PingFang SC-Medium, PingFang SC;
			font-weight: 500;
			color: #666666;
		}

		.tab_12 {
			image {
				width: 48rpx;
				height: 48rpx;
				margin-top: 16rpx;
			}
		}

		.tab_2 {
			width: 35%;
			height: 4rpx;
			opacity: 1;
			margin-left: 32%;
			margin-top: -15rpx;
		}

	}

	.tabbar-wrapper {
		width: 100%;
		overflow-x: auto;
		white-space: nowrap;

		& .tabbar-item {

			text-align: center;
			display: inline-block;
			position: relative;
			padding-left: 25rpx;
			padding-right: 25rpx;

			&__active {
				&::after {
					content: '';
					width: 90rpx;
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					margin: auto;
					border-bottom: 4rpx solid #1F1A17;
				}
			}
		}
	}
</style>