<template>
	<scroll-view scroll-y="true" :style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'"
		@scrolltolower="in_scrolltolower">

		<view class="search-box" :style="'background:'+getMainColor()+';'">
			<view class="search-item" :style="'background:'+getSecondBackgroundColor()+';'">
				<!-- <span class="icon iconfont2 icon-sousuo" style="line-height: 170rpx;"></span> -->
				<input @confirm="search" v-model="keyword" class="ml-md flex-1" confirmType="search"
					placeholderClass="placeholder" :placeholder="$nw('请输入校友企业名称/手机号/联系人')" type="text"></input>
			</view>
		</view>

		<view class="top-tabbarx">
			<view style="width: 95%;margin: auto;" :style="'color:'+getMainTextColor()+';'">
				<view style="width: 90%;">
					<view style="height: 60rpx;float: left;">

						<view style="float: left;">
							<picker class="filter-box-item b-1px-r" @change="handerCategoryaChange"
								:value="categorya_index" range-key="name" :range="categoryaArray">
								<view class="filter-box-item b-1px-r">
									<view class="filter-box-item-title" style="line-height: 60rpx;">
										{{categoryaArray[categorya_index].name}}
									</view>
								</view>
							</picker>
						</view>
						<image style="float: left;width: 50rpx;height: 50rpx;margin-top: 5rpx;"
							src="/static/sanjiao.png" mode=""></image>

						<view style="clear: both;"></view>
					</view>


					<view style="height: 60rpx;float: left;">

						<view style="float: left;">
							<picker class="filter-box-item b-1px-r" @change="handerTabChange" :value="tab_index"
								range-key="name" :range="tab">
								<view class="filter-box-item b-1px-r">
									<view class="filter-box-item-title" style="line-height: 60rpx;">
										{{tab[tab_index].name}}
									</view>
								</view>
							</picker>
						</view>
						<image style="float: left;width: 50rpx;height: 50rpx;margin-top: 5rpx;"
							src="/static/sanjiao.png" mode=""></image>

						<view style="clear: both;"></view>
					</view>

					<view style="height: 60rpx;float: left;">

						<view style="float: left;">
							<picker class="filter-box-item b-1px-r" @change="handerXiaoChange" :value="xiao_index"
								range-key="name" :range="xiaoArray">
								<view class="filter-box-item b-1px-r">
									<view class="filter-box-item-title" style="line-height: 60rpx;">
										{{xiaoArray[xiao_index].name}}
									</view>
								</view>
							</picker>
						</view>
						<image style="float: left;width: 50rpx;height: 50rpx;margin-top: 5rpx;"
							src="/static/sanjiao.png" mode=""></image>

						<view style="clear: both;"></view>
					</view>

					<view @click="choose(2)" style="height: 60rpx;float: left;">
						<view style="float: left;line-height: 60rpx;">
							{{selectRegion}}
						</view>
						<image style="float: left;width: 50rpx;height:50rpx;margin-top: 5rpx;" src="/static/sanjiao.png"
							mode=""></image>
						<view style="clear: both;"></view>
					</view>
				</view>

				<view @click="reast" :style="'color: '+getTextColorGrey()+';'"
					style="width: 10%; float: right;  100rpx;line-height: 60rpx;">
					{{$nw("重置")}}
				</view>

			</view>

		</view>
		<view style="clear: both;"></view>
		<!-- <Tabbara :tabbar_list="tab" type="2" @tabbarEmit="tabbarEmit"></Tabbara> -->




		<view class="yuyue0" v-for="(item,index) in list" :key="index" @click="yuyue_click(item.coc_id)">
			<view class="yuyue">
				<view class="yuyue_1">
					<image :src="item.image_url" mode=""></image>
				</view>
				<view class="yuyue_2">
					<view class="yuyue_2_1">
						{{item.name}}
					</view>

					<view class="yuyue_2_3" v-if="item.business">
						<text style="font-size: 30rpx;">{{$nw("主营")}}：</text> <text style="color: #888783;font-size: 24rpx;">
							{{item.business}}</text>
					</view>

				</view>

			</view>
			<view class="yuyue_3">
				<view class="yuyue_3_2" v-if="item.is_coc == 1">
					{{$nw("明星企业")}}
				</view>
				<view class="yuyue_3_2" v-if="item.is_coc == 1" style="margin-left: 20rpx;">
					{{item.grade.name}}
				</view>
				<view class="yuyue_3_2" v-if="item.is_coc == 0">
					{{item.grade.name}}
				</view>
				<view style="clear: both;">

				</view>

			</view>
		</view>

		<template v-if="list.length <=0">
			<view class="none-data-box">
				<text :style="'color:'+getTextColorWhite()+';'">{{$nw("未获取到数据")}}</text>

			</view>
		</template>

		<view style="height:100rpx;width:100%;">

		</view>
		<image class="dynaimage" @click="dynaimage" src="/static/apply.png"></image>
		<!-- #ifndef APP -->
		<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm">
		</mpvue-city-picker> 
		<!-- #endif -->
		<regionalComponents v-show="regionaStatus" ref="regionalComponents" :defaultData="defaultData" @cancel="cancel"
			@confirm="confirm"></regionalComponents>
		<service :itemData="t_service"></service> 
	
		
	</scroll-view>
	
		
</template>

<script>
	import Tabbara from '@/components/tabbar/tabbara.vue';
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import streetPicker from '@/components/mpvue-citypicker/streetPicker.vue';
	import regionalComponents from '@/components/regionalComponents/regionalComponentsa.vue'
		import service from '@/components/diy/service/service';
	export default {
		components: {
			Tabbara,
			mpvueCityPicker,
			streetPicker,
			regionalComponents,
			service,
		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},	
				list: [],
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
				bgcolor: "#1F1A17",
				keyword: "",
				scrollviewHigh: 0,

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

				categoryaArray: [],
				categorya_index: 0,

				xiaoArray: [],
				xiao_index: 0,

				tab_index: 0,
				tab: [],
			}
		},
		onShow() {
			this.page = 1;
			this.list = [];
			this.getCategory();
			this.getData()

			/*初始化*/
			this.init();
			//获取分类
			// 设置全局颜色
			this.setGlobalColor()
			uni.setNavigationBarTitle({
				title:this.$nws('诚优企业')
			})

		},
		methods: {
			dynaimage() {
				uni.navigateTo({
					url: "/plus2/pages/coc/apply_se"
				})
			},
			in_scrolltolower() {
				this.page++;
				this.getData();
			},
			getCategory() {
				var self = this;
				self._post(
					'plus.coc.Coc/getXiao', {

					},
					function(
						res
					) {
						self.xiaoArray = res.data
						for(var i=0;i<self.xiaoArray.length;i++){
							self.xiaoArray[i]["name"] = self.$nw(self.xiaoArray[i]["name"])
						}
					})


				self._post(
					'plus.coc.Coc/getCategory', {

					},
					function(
						res
					) {
						self.categoryaArray = res.data
						for(var i=0;i<self.categoryaArray.length;i++){
							self.categoryaArray[i]["name"] = self.$nw(self.categoryaArray[i]["name"])
						}
					})

				self._post(
					'plus.coc.Coc/getGrade', {

					},
					function(
						res
					) {
						self.tab = res.data.grade
						for(var i=0;i<self.tab.length;i++){
							self.tab[i]["name"] = self.$nw(self.tab[i]["name"])
						}
					});
			},
			reast() {
				this.staffInfo = {
					category_id: "",
					province_id: "",
					city_id: "",
					region_id: "",
				}
				this.list = [];
				this.page = 1;
				this.selectRegion = this.$nw("选择地区");
				this.categorya_index = 0;
				this.xiao_index = 0;
				this.tab_index = 0;
				this.getData();
			},
			choose(type) {
				if (type == 1) {

				} else {
					this.regionaStatus = true;
				}
			},
			/*搜索*/
			search() {
				let self = this;
				self.list = [];
				self.getData();

			},
			handerCategoryaChange(e) { //选择行业
				this.categorya_index = e.detail.value
				this.page = 1;
				this.list = [];
				this.getData();
			},
			handerTabChange(e) { //选择行业
				this.tab_index = e.detail.value
				this.page = 1;
				this.list = [];
				this.getData();
			},
			handerXiaoChange(e) { //选择行业
				this.xiao_index = e.detail.value
				this.page = 1;
				this.list = [];
				this.getData();
			},
			showMulLinkageRegionalComponents() {
				this.regionaStatus = true;
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
				this.list = [];
				this.page = 1;
				this.getData();
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
			/**
			 * 设置分享内容
			 */
			onShareAppMessage() {
				let self = this;
				return {
					title: "商会会员",
					path: '/plus2/pages/coc/list'
				};
			},
			getData() {
				var self = this;
				uni.showLoading({
					title: "加载中..."
				})
				self._post(
					'plus.coc.Coc/indexSe', {

						page: self.page,
						list_rows: self.list_rows,
						keywords: self.keyword,
						category_id: self.getTab(2),
						xiao: self.getTab(3),
						grade_id: self.getTab(1),
						province_id: self.staffInfo.province_id,
						city_id: self.staffInfo.city_id,
						region_id: self.staffInfo.region_id,
					},
					function(
						res
					) {
						self.list = self.list.concat(res.data.list.data);
						self.list = self.getUnique(self.list, "coc_id");
						if (res.data.list.data.length <= 0) {
							self.page--;
						}
						uni.hideLoading()
					});
			},

			getTab(type) {
				if (type == 1) {
					return this.tab && this.tab[this.tab_index] ? this.tab[this.tab_index].grade_id : -1;
				} else if (type == 2) {
					return this.categoryaArray && this.categoryaArray[this.categorya_index] ? this.categoryaArray[this
						.categorya_index].categorya_id : -1;
				} else if (type == 3) {
					return this.xiaoArray && this.xiaoArray[this.xiao_index] ? this.xiaoArray[this.xiao_index].name : -1;
				}
			},
			yuyue_click(id) {
				uni.navigateTo({
					url: "/plus2/pages/coc/detail?id=" + id
				})
			}
		}
	}
</script>

<style lang="scss">
	body {
		background: var(--bgcolor);
	}

	.dynaimage {
		width: 150rpx;
		height: 150rpx;
		position: fixed;
		bottom: 300rpx;
		right: 10rpx;
	}

	.yuyue_3 {
		.yuyue_3_2 {

			text-align: center;
			color: #177E15;
			line-height: 40rpx;
			font-size: 24rpx;
			padding-left: 20rpx;
			padding-right: 20rpx;
			float: left;
			height: 40rpx;
			border-radius: 450rpx;
			background: rgb(255, 159, 0);
			color: #fff;
			margin-left: 170rpx;
			margin-top: 10rpx;

		}


	}

	.yuyue0 {
		width: 95%;
		margin: auto;
		background: #fff;
		border-radius: 16rpx;
		box-shadow: 0rpx 2rpx 4rpx 0rpx rgba(0, 0, 0, 0.1);
		margin-top: 20rpx;
		padding-bottom: 30rpx;
	}

	.yuyue {




		margin-top: 20rpx;
		display: flex;




		.yuyue_1 {

			flex: 2;

			image {
				width: 120rpx;
				height: 120rpx;
				margin-left: 20rpx;
				margin-top: 20rpx;
				border-radius: 16rpx;
			}
		}

		.yuyue_2 {
			flex: 7;

			.yuyue_2_1 {
				width: 95%;
				font-size: 34rpx;
				margin: auto;
				margin-top: 20rpx;
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



	.search-box {
		padding: 20rpx;
		display: flex;
		align-items: center;
	}

	.search-item {
		flex: 1;
		height: 64rpx;
		border-radius: 32rpx;
		padding: 0 16rpx 0 35rpx;
		display: flex;
		align-items: center;
		line-height: 1;
		font-size: 28rpx;
		color: #888;
	}

	.placeholder {
		font-size: 28rpx;
	}

	.search-item-btn {
		color: #19a918;
		margin-left: 32rpx;
		font-size: 30rpx;
	}

	.search-btn {
		padding: 0 20rpx 0 40rpx;
	}
</style>