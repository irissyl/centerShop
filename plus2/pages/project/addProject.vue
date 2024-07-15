<template>
	<view :style="'background:'+getMainColor()+';'">
		<view class="staff-editInfo-sec" :style="'background:'+getMainColor()+';'">
			<view class="child">
				<view class="flex">
					<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('选择类型')}}</view>
					<view class="flex100-8 tl">
						<picker class="filter-box-item b-1px-r" @change="handerTypeChange" :value="type_index"
							range-key="label" :range="typeArray">
							<view class="filter-box-item b-1px-r">
								<view class="filter-box-item-title">
									{{$nws(typeArray[type_index].label)}}
								</view>

							</view>
						</picker>
					</view>
				</view>
			</view>
			<view class="child">
				<view class="flex">
					<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('选择公司')}}</view>
					<!-- <view class="flex100-8 tl" style="font-size: 32rpx;color:#cccccc;">
						<view @click="show = true">
							<view>{{staffInfo.coc_name}}</view>
						</view>
					</view> -->
					<view class="flex100-8 tl">
						<picker class="filter-box-item b-1px-r" @change="cocChange" :value="coc_index" range-key="label"
							:range="list">
							<view class="filter-box-item b-1px-r">
								<view class="filter-box-item-title"
									:class="{'grey-label':staffInfo.coc_name && staffInfo.coc_name != '选择公司'}">
									<!-- {{$nws(list[coc_index][0].label || '选择公司')}} -->
									{{staffInfo.coc_name}}
								</view>
							</view>
						</picker>
					</view>
				</view>
			</view>
			<view class="child">
				<view class="flex">
					<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('上传视频')}}</view>
					<view class="flex100-8 tl" style="font-size: 32rpx;color:#cccccc;">
						<!-- <video controls objectFit="contain" :src="staffInfo.video"></video> -->
						<view @click="chooseWxVideo">
							<view class="u-line-1" style="width: 450rpx;">{{staffInfo.project_video || '上传视频'}}</view>
						</view>
					</view>
				</view>
			</view>
			<view class="child" style="height: auto;">
				<view class="flex" style="height: auto;">
					<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('上传图片')}}</view>
					<view class="flex100-8 tl" style="font-size: 32rpx;color:#cccccc;">
						<UploadFile ref="uUpload" :imgs="project_images" :maxCount="9" @success="imgsSuccess"
							@remove="imgsRemove"></UploadFile>
					</view>
				</view>
			</view>

			<!-- <view class="child"></view> -->
			<view class="staff-editInfo-common" :style="'background:'+getMainColor()+';'">
				<view class="title" style="font-weight: 500;" :style="'color:'+getTextColorWhite()+';'">{{$nw('项目名称')}}
				</view>
				<textarea decode="emsp" maxlength="-1" style="color:#111" placeholder-style="color:#cccccc;"
					:style="'background:'+getSecondBackgroundColor()+';'" name="desc" :placeholder="$nw('请填写项目名称')"
					v-model="staffInfo.title"></textarea>

			</view>


			<view class="child">
				<view class="flex" @click="chooseIndustry">
					<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('所属行业')}}</view>
					<view class="flex100-8 tl" style="font-size: 32rpx;">
						{{currentIndustry}}
					</view>
				</view>
			</view>

			<!-- 招募联创股东 -----start -->
			<template v-if="typeArray[type_index].value == 'zmlcgd' || typeArray[type_index].value == 'xmtjh'
			|| typeArray[type_index].value == 'xpfbh'">
				<view class="child">
					<view class="flex">
						<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('所属赛道')}}</view>
						<view class="flex100-8 tl">
							<input style="color:#cccccc;" placeholder-style="color:#cccccc;"
								:placeholder="$nw('请填写所属赛道')" type="text" v-model="staffInfo.setting.track"></input>
						</view>
					</view>
				</view>

				<view class="child">
					<view class="flex">
						<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('项目亮点')}}</view>
						<view class="flex100-8 tl">
							<input style="color:#cccccc;" placeholder-style="color:#cccccc;"
								:placeholder="$nw('请填写项目亮点')" type="text" v-model="staffInfo.setting.lightspot"></input>
						</view>
					</view>
				</view>

				<view class="child" v-if="typeArray[type_index].value != 'xpfbh'">
					<view class="flex">
						<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('应召者条件')}}</view>
						<view class="flex100-8 tl">
							<input style="color:#cccccc;" placeholder-style="color:#cccccc;"
								:placeholder="$nw('请填写应召者条件')" type="text"
								v-model="staffInfo.setting.requirement"></input>
						</view>
					</view>
				</view>


			</template>

			<!-- 招募联创股东 -----end -->

			<!-- 投资人发布----start -->
			<template v-if="typeArray[type_index].value == 'tzrfb'">
				<view class="child">
					<view class="flex">
						<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('投资预算')}}</view>
						<view class="flex100-8 tl">
							<input :placeholder="$nw('请填写投资预算')" type="text" style="color:#111;"
								placeholder-style="color:#cccccc;" v-model="staffInfo.setting.tz_yusuan"></input>
						</view>
					</view>
				</view>
				<view class="child">
					<view class="flex" @click="chooseIndustry_tz">
						<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('投资行业')}}</view>
						<view class="flex100-8 tl" style="font-size: 32rpx;color:#cccccc;">
							{{currentIndustry_tz}}
						</view>
					</view>
				</view>
				<view class="child">
					<view class="flex">
						<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('需备条件')}}</view>
						<view class="flex100-8 tl">
							<input :placeholder="$nw('请填写需备条件')" type="text" style="color:#cccccc;"
								placeholder-style="color:#cccccc;" v-model="staffInfo.setting.xb_tj"></input>
						</view>
					</view>
				</view>
				<view class="child">
					<view class="flex">
						<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('年投产比要求')}}</view>
						<view class="flex100-8 tl">
							<input :placeholder="$nw('请填写年投产比要求')" type="text" style="color:#cccccc;"
								placeholder-style="color:#cccccc;" v-model="staffInfo.setting.ntcbyq"></input>
						</view>
					</view>
				</view>
				<view class="child">
					<view class="flex">
						<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('投资时长')}}</view>
						<view class="flex100-8 tl">
							<input :placeholder="$nw('请填写投资时长')" type="text" style="color:#cccccc;"
								placeholder-style="color:#cccccc;" v-model="staffInfo.setting.tzsc"></input>
						</view>
					</view>
				</view>
				<view class="child">
					<view class="flex">
						<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('投资轮次')}}</view>
						<view class="flex100-8 tl">
							<input :placeholder="$nw('请填写投资轮次')" type="text" style="color:#cccccc;"
								placeholder-style="color:#cccccc;" v-model="staffInfo.setting.tzlc"></input>
						</view>
					</view>
				</view>

			</template>
			<!-- 投资人发布----end -->
			<view class="child" v-if="typeArray[type_index].value == 'gy' || 
			typeArray[type_index].value == 'xq'">
				<view class="flex">
					<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('项目预算')}}</view>
					<view class="flex100-8 tl">
						<input :placeholder="$nw('请填写项目预算')" type="text" style="color:#111;"
							v-model="staffInfo.budget"></input>
					</view>
				</view>
			</view>

			<view class="child">
				<view class="flex">
					<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('联系方式')}}</view>
					<view class="flex100-8 tl">
						<input type="number" maxlength="11" style="color: #111;" v-model="staffInfo.mobile"
							:placeholder="$nw('请填写联系方式')"></input>
					</view>
				</view>
			</view>

			<view class="child">
				<view class="flex">
					<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('项目地址')}}</view>
					<view class="flex100-8 tl" style="font-size: 32rpx;color:#cccccc;">
						<view @click="showMulLinkageRegionalComponents">
							<view>{{selectRegion}}</view>
						</view>
					</view>
				</view>
			</view>







			<view class="staff-editInfo-common" :style="'background:'+getMainColor()+';'">
				<view class="title" style="font-weight: 500;" :style="'color:'+getTextColorWhite()+';'">{{$nw('项目介绍')}}
				</view>
				<textarea decode="emsp" maxlength="-1" style="color:#111;" placeholder-style="color:#cccccc;"
					:style="'background:'+getSecondBackgroundColor()+';'" name="desc" :placeholder="$nw('请填写项目介绍内容')"
					v-model="staffInfo.introduce"></textarea>
			</view>


			<view class="child">
				<view class="flex">
					<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">{{$nw('人数限制')}}</view>
					<view class="flex100-8 tl">
						<picker class="filter-box-item b-1px-r" @change="handerPeopleChange" :value="people_index"
							range-key="label" :range="peopleArray">
							<view class="filter-box-item b-1px-r">
								<view class="filter-box-item-title" style="color: #111;">
									{{peopleArray[people_index].label}}
								</view>

							</view>
						</picker>
					</view>
				</view>
			</view>


			<view class="child" v-if="typeArray[type_index].price > 0">
				<view class="flex">
					<view class="flex100-2" :style="'color:'+getTextColorWhite()+';'">
						{{$nw(typeArray[type_index].price_type_val)}}
					</view>
					<view class="flex100-8 tl" style="color: #cccccc;">
						{{typeArray[type_index].price}}
					</view>
				</view>
			</view>


			<view class="p-20-0 f28" style="padding-left: 20rpx;">
				<checkbox-group @change="changeFunc" style="float: left; width: 70rpx;transform: scale(0.8);">
					<checkbox value="checkbox" :checked="is_read" />
				</checkbox-group>
				<view style="float: left;" :style="'color:'+getTextColorWhite()+';'">{{$nw('我已阅读并了解')}}</view>
				<view style="float: left;" class="red" :style="'color:'+getMainTextColor()+';'" @click="xieyi">
					【{{$nw('发布协议')}}】
				</view>
				<view style="clear: both;">

				</view>
			</view>




		</view>


		<view class="" style="width: 100%;padding-bottom: 40rpx;padding-top: 40rpx;">
			<view v-if="staffInfo.status == 0" style="width: 95%;margin: auto;"
				:style="'color:'+getTextColorWhite()+';'">
				{{$nw('平台正在审核中')}}
			</view>

			<view v-if="staffInfo.status == 2" style="width: 95%;margin: auto;"
				:style="'color:'+getTextColorWhite()+';'">
				{{$nw('审核未通过，未通过原因')}}：{{staffInfo.reject_val}}
			</view>


		</view>


		<button v-if="staffInfo.status == -1" class="fix-painter-share tc"
			:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#fff'}"
			@click="toEditStaff" formType="submit" hoverClass="none"
			style="border-radius:15rpx;width:92%;margin:60rpx auto;">
			{{$nw('发布项目')}}
		</button>
		<button v-if="staffInfo.status == 1" class="fix-painter-share tc" @click="toEditStaff" formType="submit"
			:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#fff'}"
			hoverClass="none" style="border-radius:15rpx;width:92%;margin:60rpx auto;">
			{{$nw('修改项目')}}
		</button>
		<button v-if="staffInfo.status == 2" class="fix-painter-share tc" @click="toEditStaff" formType="submit"
			:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#fff'}"
			hoverClass="none" style="border-radius:15rpx;width:92%;margin:60rpx auto;">
			{{$nw('重新提交')}}
		</button>

		<view class="" style="height: 150rpx;width: 100%;">

		</view>


		<view :class="globalData.isIphoneX?'isIphoneX':''"></view>
		<u-select v-model="show" :list="list" @confirm="confirm1"></u-select>
		<!-- #ifndef APP -->
		<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm">
		</mpvue-city-picker>
		<!-- #endif -->
		<regionalComponents v-show="regionaStatus" ref="regionalComponents" :defaultData="defaultData" @cancel="cancel"
			@confirm="confirm"></regionalComponents>

		<service :itemData="t_service"></service>

	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	import config from '@/config.js'
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import streetPicker from '@/components/mpvue-citypicker/streetPicker.vue';
	import regionalComponents from '@/components/regionalComponents/regionalComponentsa.vue'
	import service from '@/components/diy/service/service';
	import UploadFile from '@/components/UploadFile.vue';
	export default {
		components: {
			mpvueCityPicker,
			streetPicker,
			regionalComponents,
			service,
			UploadFile
		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				company: '选择公司',
				project_images: [],
				show: false,
				list: [],
				staffInfo: {
					title: '',
					type: "",
					introduce: '',
					category_id: '',
					province_id: 0,
					city_id: 0,
					region_id: 0,
					street_id: 0,
					mobile: '',
					budget: '',
					address: '',
					latitude: '',
					longitude: '',
					project_video: '上传视频',
					project_images: null,
					coc_id: null,
					coc_name: '选择公司',
					setting: {
						//招募联创股东--start
						track: "", //所属赛道
						lightspot: "", //亮点
						requirement: "", //应召者需要条件
						//招募联创股东--end
						tz_yusuan: "", //投资预算
						category_id: "", //投资行业
						xb_tj: "", //项目需备条件
						ntcbyq: "", //年投产比要求
						tzsc: "", //投资时长
						tzlc: "", //投资轮次

					},
					status: -1, //未提交  0 审核中  1  审核通过  2 审核失败
					reject_val: ""

				},
				currentIndustry: this.$nw("请选择行业"),
				currentIndustry_tz: this.$nw("请选择投资行业"),
				categoryData: [],
				multiIndex: [0, 0],
				showIndustry: false,
				globalData: {

				},
				from: '',
				disabledFlag: '',
				//类型
				type_index: 0,
				coc_index: null,
				typeArray: [],
				peopleArray: [{
					"id": 1,
					"label": this.$nw("单人"),
				}, {
					"id": 2,
					"label": this.$nw("不限"),
				}],
				people_index: 0,

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
				project_id: "",
				quick: 0,
				is_read: false,
				video: ''
			}
		},

		onShow() {
			var self = this;
			self.getType();
			setTimeout(function() {
				self.getDetail();
			}, 200)
			this.setGlobalColor()

		},
		onLoad(option) {
			this.project_id = option.project_id
			this._get('plus.coc.Coc/getCocByUserId', {
				user_id: uni.getStorageSync("user_id")
			}, (e) => {
				this.list = e.data.list.map(e => {
					return {
						value: e.coc_id,
						label: e.name
					}
				})

			})
		},
		computed: {
			getbutton() {
				return this.setButton().button
			}
		},
		methods: {
			cocChange(e) {
				console.log('list', this.list);
				console.log('cocChange', e);
				let index = e.detail.value
				this.staffInfo.coc_id = this.list[index].value
				this.staffInfo.coc_name = this.list[index].label
			},
			confirm1(e) {
				this.staffInfo.coc_id = e[0].value
				this.staffInfo.coc_name = e[0].label
			},
			imgsRemove(e) {
				console.log('imgsRemove---->', e);
				this.project_images.splice(e, 1)
				console.log('删除后的project_images', this.project_images);
			},
			imgsSuccess(e, j) {
				console.log('imgsSuccess e-->', e);
				console.log('imgsSuccess j-->', j);
				this.project_images.push(e.data.file_path)
				console.log('上传后的project_images', this.project_images);
				// this.form.image_url = e.data.file_path
			},
			chooseWxVideo() {
				let self = this;
				// self.staffInfo.video = '';
				let params = {
					token: uni.getStorageSync('token'),
					app_id: self.getAppId()
				};
				let url = config.app_url + '/index.php?s=/api/file.upload/video';
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: function(res) {
						self.src = res.tempFilePath;
						uni.showLoading({
							title: "视频上传中"
						}), uni.uploadFile({
							url: url,
							filePath: res.tempFilePath,
							name: "iFile",
							formData: params,
							success: function(t) {
								var a = JSON.parse(t.data);
								self.staffInfo.project_video = a.data.file_path;
								uni.hideLoading();
							}
						});
					}
				});
			},

			/*同意协议*/
			changeFunc(e) {
				if (e.target.value.length > 0) {
					this.is_read = true;
				} else {
					this.is_read = false;
				}
			},
			getDetail() { //获取详情
				var self = this;
				self._post(
					'plus.project.project/getDetail', {
						project_id: self.project_id
					},
					function(res) {
						if (res.data) {
							self.staffInfo = res.data
							self.selectRegion = res.data.region.province +
								res.data.region.city +
								res.data.region.region
							self.currentIndustry = res.data.category.name

							// 赋值图片回显
							if (res.data.project_images) {
								self.project_images = res.data.project_images && res.data.project_images.split(',')
								console.log('project_images--->', self.project_images);
								self.$refs.uUpload.setFileList(self.project_images)
							}


							//赋值投资行业
							if (res.data.setting && res.data.setting.category_id) {
								self.currentIndustry_tz = res.data.setting.category;
							}
							//赋值单人、不限
							for (var i = 0; i < self.typeArray.length; i++) {


								if (self.typeArray[i].value == self.staffInfo.type) {
									self.type_index = i;
									break;
								}
							}
							for (var i = 0; i < self.peopleArray.length; i++) {
								if (self.peopleArray[i].id == self.staffInfo.people_type) {
									self.people_index = i;
									break;
								}
							}

							if (self.staffInfo.status == 0) {
								uni.setNavigationBarTitle({
									title: self.$nw("平台正在审核中")
								})
							} else if (self.staffInfo.status == 1) {
								uni.setNavigationBarTitle({
									title: self.$nw("修改项目")
								})
							} else if (self.staffInfo.status == 2) {
								uni.setNavigationBarTitle({
									title: self.$nw("审核未通过")
								})
							}

						}

					})
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


			},

			getType() {
				var self = this;
				self._post(
					'plus.project.project/getType', {},
					function(res) {
						self.typeArray = res.data;
						for (var i = 0; i < self.typeArray.length; i++) {
							self.typeArray[i].label = self.$nws(self.typeArray[i].label)
						}
					})
			},
			handerTypeChange(e) { //选择类型
				this.type_index = e.detail.value

				//检测setting是不是对象
				var re = Object.prototype.toString.call(this.staffInfo.setting) === '[object Object]'
				if (!re) {
					this.staffInfo.setting = JSON.parse(this.staffInfo.setting)
				}
			},
			handerPeopleChange(e) {
				this.people_index = e.detail.value
			},
			/* 选择行业 */
			chooseIndustry() {
				let path = '/plus2/pages/project/category?source=edit';
				uni.navigateTo({
					url: path
				})
			},
			/* 选择行业 */
			chooseIndustry_tz() {
				let path = '/plus2/pages/project/category?source=tz';
				uni.navigateTo({
					url: path
				})
			},
			xieyi() {
				uni.navigateTo({
					url: "/plus2/pages/xieyi/xieyi?code=project"
				})
			},
			/* 保存 */
			toEditStaff() {
				let self = this;
				console.log('self.staffInfo',self.staffInfo);
				let params = self.staffInfo;
				params.project_images = this.project_images.join(',')
				// params.project_images = params.project_images.toString()
				if (!self.is_read) {
					uni.showToast({
						title: self.$nw("请同意协议！"),
						icon: 'none'
					});
					return;
				}
				params.type = self.typeArray[self.type_index].value;
				if (!params.title || !params.category_id || !params.mobile || !params.introduce ||
					(!params.budget && (params.type == 'xq' || params.type == 'gy'))) {
					uni.showModal({
						title: self.$nw("提示"),
						content: self.$nw("选项不可为空"),
						showCancel: false,
						success: function(res) {
							if (res.confirm) {
								console.log("确认");
							}
						}
					})
					return false;
				}

				if (params.type == 'zmlcgd' || 'xmtjh' == params.type) {
					if (!params.setting.track || !params.setting.lightspot || !params.setting.requirement) {
						uni.showModal({
							title: self.$nw("提示"),
							content: self.$nw("选项不可为空"),
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									console.log("确认");
								}
							}
						})
						return false;
					}
				}
				if (params.type == 'xpfbh') {
					if (!params.setting.track || !params.setting.lightspot) {
						uni.showModal({
							title: self.$nw("提示"),
							content: self.$nw("选项不可为空"),
							showCancel: false,
							success: function(res) {
								if (res.confirm) {
									console.log("确认");
								}
							}
						})
						return false;
					}
				}


				if (!
					/^1(3|4|5|6|7|8|9)\d{9}$/
					.test(params
						.mobile)) {

					self.tip(self.$nw("联系方式有误,请重填！"), 3000);
					return;
				}
				var re = Object.prototype.toString.call(params.setting) === '[object Object]'
				if (!re) {
					params.setting = JSON.parse(params.setting)
				}

				params.setting = JSON.stringify(params.setting)
				params.people_type = self.peopleArray[self.people_index].id

				if (params.status == -1) { //发布项目
					params.audit_type = "rel";
				} else if (params.status == 1) { //修改项目
					params.audit_type = "upd";
				} else if (params.status == 2) { //重新提交项目
					params.audit_type = "re_rel";
				}

				clearTimeout(uni.getStorageSync("xt_bar"))
				var xt = setTimeout(function() {
					uni.setStorageSync("xt_bar", xt)
					self.quick = 0;
				}, 5000);
				if (self.quick == 0) {
					self.quick = 1;

					function isJudge(self) {
						self._post(
							'plus.project.project/edit',
							params,
							function(res) {
								if (res.code == 1) {
									if (params.status == -1) {
										uni.showModal({
											title: self.$nw("提示"),
											content: self.$nw("发布成功，后台正在审核"),
											showCancel: false,
											success: function(res) {

												if (res.confirm) {
													uni.navigateBack()
												} else if (res.cancel) {
													console.log('用户点击取消');
												}
											}
										});
									} else if (params.status == 1) {
										uni.showModal({
											title: self.$nw("提示"),
											content: self.$nw("修改成功，后台正在审核"),
											showCancel: false,
											success: function(res) {

												if (res.confirm) {
													uni.navigateBack()
												} else if (res.cancel) {
													console.log('用户点击取消');
												}
											}
										});
									} else if (params.status == 2) {
										uni.showModal({
											title: self.$nw("提示"),
											content: self.$nw("重新提交成功，后台正在审核"),
											showCancel: false,
											success: function(res) {
												if (res.confirm) {
													uni.navigateBack()
												} else if (res.cancel) {
													console.log('用户点击取消');
												}
											}
										});
									}


								}
							},
							function(res) {
								var re = Object.prototype.toString.call(self.staffInfo.setting) === '[object Object]'
								if (!re) {
									self.staffInfo.setting = JSON.parse(self.staffInfo.setting)
								}
							}
						)
					}
					var ty = self.typeArray[self.type_index];
					if (ty.price > 0) {
						uni.showModal({
							title: self.$nw("提示"),
							content: self.$nw("发布项目需") + ty.price_type_val + ':' + ty.price + "，" + self.$nw(
								"是否确认"),
							success: function(o) {
								if (o.confirm) {
									isJudge(self);
								}

							}
						})
					} else {
						isJudge(self);
					}



				} else {
					var re = Object.prototype.toString.call(self.staffInfo.setting) === '[object Object]'
					if (!re) {
						self.staffInfo.setting = JSON.parse(self.staffInfo.setting)
					}
					uni.showToast({
						title: self.$nw("你点太快了哦"),
						icon: "none"
					})
				}

			},
		}
	}
</script>

<style>
	view {
		font-size: 30rpx;
	}

	.staff-editInfo-sec {
		width: 100%;
		height: auto;
		display: block;
		padding-top: 20rpx;
		background: white;
		/* border: 1rpx solid #e5e5e5; */
		border-left: transparent;
		border-right: transparent;
	}

	.staff-editInfo-sec .child {
		width: 92%;
		height: 120rpx;
		line-height: 120rpx;
		padding: 0rpx 4%;
		display: block;
	}

	.staff-editInfo-sec .child .flex {
		border-bottom: 1rpx solid #a2a2a2;
		font-size: 28rpx;
		height: 120rpx;
		color: #000000;
	}

	.staff-editInfo-sec .child .flexx {
		border-bottom: 1rpx solid #a2a2a2;
		font-size: 28rpx;
		color: #000000;
	}

	.flex {
		display: flex;
	}

	.flexx {
		display: flex;
	}

	.flex,
	.flex100 {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.flex100 {
		width: 100%;
	}

	.flex100-2 {
		flex: 0 0 25%;
		box-sizing: border-box;
		font-size: 32rpx;
	}

	.flex100-8 {
		flex: 0 0 80%;
		box-sizing: border-box;
	}

	.staff-editInfo-sec .child:nth-last-child(1) .flex {
		border: transparent;
	}

	.staff-editInfo-sec .child .flex .tr {
		color: #595959;
	}

	.staff-editInfo-sec .child .flex .nothing {
		color: #969696;
	}

	.staff-editInfo-sec .child .flex .tr image {
		width: 120rpx;
		height: 120rpx;
		display: block;
	}

	.staff-editInfo-sec .child .flex .tr picker {
		width: 70%;
		padding-right: 10rpx;
		float: right;
	}

	.staff-editInfo-common {
		width: 92%;
		height: auto;
		padding: 0rpx 4%;
		background: white;
		/* border-bottom: 1rpx solid #e5e5e5; */
		border-left: transparent;
		border-right: transparent;
	}

	.staff-editInfo-common .title {
		height: 90rpx;
		line-height: 90rpx;
		font-size: 30rpx;
		color: #2f2f2f;
		border-top: 1rpx solid #a8a8a8;
	}

	.staff-editInfo-common .remark {
		font-size: 30rpx;
		color: #2f2f2f;
		line-height: 38rpx;
		padding-bottom: 40rpx;
	}

	.staff-editInfo-common textarea,
	.staff-editInfo-common .textarea,
	.staff-editInfo-common .voice {
		width: 94%;
		min-height: 170rpx;
		font-size: 32rpx;
		color: #cccccc;
		line-height: 34rpx;
		padding: 14rpx 3%;
		resize: none;
		outline: none;
		display: block;
		margin-bottom: 20rpx;
		background: #f4f4f4;
		/* border: 1rpx solid #f1f1f1; */
		border-radius: 15rpx;
	}

	.staff-editInfo-common textarea {
		height: 170rpx;
	}

	.staff-editInfo-common .tag-em-left {
		width: 20rpx;
		height: 20rpx;
		display: block;
		top: 53rpx;
		left: 125rpx;
		background: white;
		border-top: transparent;
		border-right: transparent;
		transform: rotate(45deg);
	}

	.staff-editInfo-common .content {
		width: 83%;
		height: 102rpx;
		line-height: 102rpx;
		display: block;
		padding: 0rpx 5%;
		margin-left: 11rpx;
		background: white;
	}


	.fix-painter-share {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		bottom: 0rpx;
		color: white;
		background: linear-gradient(to right, #d6bd5a, #fdf4b3);
		border-radius: 0rpx;
	}

	.fix-painter-share button {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		color: white;
		background: linear-gradient(to right, #d6bd5a, #fdf4b3);
		border-radius: 0rpx;
	}

	input {
		font-size: 32rpx;
		color: #cccccc;
	}
</style>