<template>
	<view style="padding: 24rpx;">
		<u-form :model="form" ref="uForm">
			<u-form-item prop="corp_image_url" label-width="135" label-align="right" :border-bottom="false"
				label="商家logo">
				<UploadFile v-if="flg1" :img="form.corp_image_url" @success="success"></UploadFile>
			</u-form-item>
			<u-form-item prop="coc_name" label-width="135" label-align="right" :border-bottom="false" label="公司名称">
				<view class="region dbb" @click="show3 = true">
					<text v-show="!form.coc_name"
						style="color: rgb(192, 196, 204);font-size: 28rpx;">请选择公司</text>
					<text v-show="form.coc_name" style="">{{form.coc_name}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item>
			<u-form-item prop="to_coc_org_name" label-width="135" label-align="right" :border-bottom="false"
				label="所在商会">
				<view class="region dbb" @click="qiehuan(1)">
					<text v-show="!form.to_coc_org_name"
						style="color: rgb(192, 196, 204);font-size: 28rpx;">请选择所在商会</text>
					<text v-show="form.to_coc_org_name" style="">{{form.to_coc_org_name}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item>
			<u-form-item prop="work_type" label-width="135" label-align="right" :border-bottom="false" label="所在行业">
				<view class="region dbb" @click="show1 = true">
					<text v-show="!form.work_type" style="color: rgb(192, 196, 204);font-size: 28rpx;">请选择行业</text>
					<text v-show="form.work_type" style="">{{form.work_type}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item>
			<u-form-item prop="select_region" label-width="135" label-align="right" :border-bottom="false" label="所在地区">
				<view class="region dbb" @click="show = true">
					<text v-show="!form.select_region"
						style="color: rgb(192, 196, 204);font-size: 28rpx;">请选择所在地区</text>
					<text v-show="form.select_region" style="">{{form.select_region}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item>
			<u-form-item prop="corp_note" label-width="135" label-align="right" :border-bottom="false" label="商家简介">
				<textarea name="" id="" cols="30" rows="10" v-model="form.corp_note"
					placeholder-style="color: rgb(192, 196, 204);" placeholder="请输入商家简介"></textarea>
			</u-form-item>
			<u-form-item prop="work_name" label-width="135" label-align="right" :border-bottom="false"
				label="需求岗位"><u-input v-model="form.work_name" placeholder="请输入需求岗位" /></u-form-item>
			<u-form-item prop="work_request" label-width="135" label-align="right" :border-bottom="false" label="任职要求">
				<textarea name="" id="" cols="30" rows="10" v-model="form.work_request"
					placeholder-style="color: rgb(192, 196, 204);" placeholder="请输入人才需求内容"></textarea>
			</u-form-item>
			<u-form-item prop="work_type_request" label-width="135" label-align="right" :border-bottom="false"
				label="行业要求">
				<view class="region dbb" @click="show2 = true">
					<text v-show="!form.work_type_request"
						style="color: rgb(192, 196, 204);font-size: 28rpx;">请选择行业</text>
					<text v-show="form.work_type_request" style="">{{form.work_type_request}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item>
			<u-form-item prop="link_name" label-width="135" label-align="right" :border-bottom="false"
				label="联系人员"><u-input v-model="form.link_name" placeholder="请输入联系人员" /></u-form-item>
			<u-form-item prop="link_phone" label-width="135" label-align="right" :border-bottom="false"
				label="联系电话"><u-input v-model="form.link_phone" placeholder="请输入联系电话" /></u-form-item>


		</u-form>
		<view class="bottom" @click="submit" v-if="!coc_need_id">
			发布
		</view>
		<view class="bottom" @click="submit" v-else>
			确认修改
		</view>
		<u-select v-model="show3" :list="list" mode="mutil-column-auto" @confirm="confirm4"></u-select>
		<u-select v-model="show1" :list="industry" mode="mutil-column-auto" @confirm="confirm1"></u-select>
		<u-select v-model="show2" :list="industry" mode="mutil-column-auto" @confirm="confirm3"></u-select>
		<regionalComponents v-show="show" ref="regionalComponents" :defaultData="defaultData" @cancel="show = false"
			@confirm="confirm2"></regionalComponents>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import UploadFile from '@/components/UploadFile.vue';
	import regionalComponents from '@/components/regionalComponents/regionalComponents.vue'
	import {
		industry
	} from '@/static/industry.js';
	export default {
		components: {
			UploadFile,
			regionalComponents
		},
		watch: {
			merchantObj: {
				deep: true,
				handler(newValue, oldValue) {
					console.log("a change", newValue, oldValue)
					// this.form.coc_org_id = newValue.coc_org_id
					this.form.to_coc_org_name = newValue.name
				}
			}
		},
		data() {
			return {
				industry,
				flg1:true,
				show: false,
				show2: false,
				show3: false,
				show1: false,
				checked: false,
				coc_need_id: null,
				defaultData: {
					province_id: 0,
					city_id: 0,
					region_id: 0,
					street_id: 0,
					address_id: 0,
				},
				merchantObj: {
					name: '东莞河南商会',
					coc_org_id: 1
				},
				list: [{
						value: '1',
						label: '江'
					},
					{
						value: '2',
						label: '湖'
					}
				],
				form: {
					coc_name: '',
					corp_image_url: '',
					to_coc_org_name: '',
					work_type: '',
					link_name: '',
					link_phone: '',
					corp_note: '',
					work_name: '',
					work_request: '',
					work_type_request: '',
					select_region: '',
					province_id: null,
					city_id: null,
					region_id: null,
					street_id: null,
					coc_id: null,
				},
				rules: {
					coc_name: [{
						required: true,
						message: '请输公司名称',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					corp_image_url: [{
						required: true,
						message: '请上传公司logo',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					to_coc_org_name: [{
						required: true,
						message: '请选择所在商会',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					work_type: [{
						required: true,
						message: '请选择所在行业',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					link_name: [{
						required: true,
						message: '请输人联系人名字',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					link_phone: [{
						required: true,
						message: '请输入联系人电话',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}, {
						// 自定义验证函数，见上说明
						validator: (rule, value, callback) => {
							// 上面有说，返回true表示校验通过，返回false表示不通过
							// this.$u.test.mobile()就是返回true或者false的
							return this.$u.test.mobile(value);
						},
						message: '手机号码不正确',
						// 触发器可以同时用blur和change
						trigger: ['change', 'blur'],
					}],
					select_region: [{
						required: true,
						message: '请选择所在地区',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					corp_note: [{
						required: true,
						message: '请输入公司简介',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					work_request: [{
						required: true,
						message: '请输入任职要求',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					work_type_request: [{
						required: true,
						message: '请输入行业要求',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					work_name: [{
						required: true,
						message: '请输入需求岗位',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				}
			};
		},
		onLoad(e) {
			this._post('plus.coc.Coc/getCocByUserId', {
				user_id : uni.getStorageSync('user_id')
			}, (res) => {
				console.log(res, 213);
				this.list = res.data.list.map(e=>{
					return {value:e.coc_id,label:e.name}
				})
			})
			if (e.coc_need_id) {
				this.flg1 = false
				this.coc_need_id = e.coc_need_id
				this._get('plus.coc.Coc/getCocNeedById', {
					coc_need_id: e.coc_need_id
				}, (res) => {
					this.form = res.data.list
					this.flg1 = true
				})
			}


		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						// plus.coc.Coc/saveCocNeed
						if (this.coc_need_id) {

							this._post('plus.coc.Coc/getCocNeedById', this.form, (res) => {
								this.$refs.uToast.show({
									title: '修改成功',
									type: 'success',
								})
								setTimeout(e => {
									wx.navigateBack()
								}, 1000)
							})
						} else {
							this._post('plus.coc.Coc/saveCocNeed', this.form, (res) => {
								this.$refs.uToast.show({
									title: '填加成功',
									type: 'success',
								})
								setTimeout(e => {
									wx.navigateBack()
								}, 1000)
							})
						}

					} else {
						console.log('验证失败');
					}
				});
			},
			qiehuan(e, j) {
				if (e === 1) {
					uni.navigateTo({
						url: '/main/pages/CommerceChoice/CommerceChoice'
					});
				} else if (e === 2) {
					uni.navigateTo({
						url: '/main/pages/businessCard/businessCard?coc_personnel_id=' + j.coc_personnel_id
					});
				} else if (e === 3) {
					uni.navigateTo({
						url: '/main/pages/RegisteredTalents/RegisteredTalents'
					});
				} else if (e === 4) {
					uni.navigateTo({
						url: '/main/pages/talentIntroduction/RequirementDetails/RequirementDetails?coc_need_id=' +
							j
							.coc_need_id
					});
				} else if (e === 5) {
					uni.navigateTo({
						url: '/main/pages/talentIntroduction/MyNeeds/MyNeeds'
					});
				}
			},
			confirm1(e) {
				console.log(11111, e);
				this.form.work_type = e[1].label
			},
			confirm3(e) {
				console.log(11111, e);
				this.form.work_type_request = e[1].label
			},
			confirm2(e) {
				console.log(e)
				this.form.province_id = e.province_id;
				this.form.city_id = e.city_id;
				this.form.region_id = e.region_id;
				this.form.street_id = e.street_id;
				this.form.select_region = e.province + e.city + e.area + e.street;
				this.show = false
			},
			confirm4(e){
				console.log(e,1);
				this.form.coc_name = e[0].label
				this.form.coc_id = e[0].value
			},
			success(e) {
				// console.log(e,11299);
				this.form.corp_image_url = e.data.file_path
			},
		},
		onShow() {
			this.setGlobalColor({
				bgc: '#ffffff'
			})
		},
		onReady() {
			this.$nextTick(() => {
				if (this.$refs.uForm) {
					this.$refs.uForm.setRules(this.rules);
				}
			})
		}
	}
</script>

<style lang="scss">
	.bottom {
		width: 702rpx;
		height: 88rpx;
		line-height: 86rpx;
		background: #1B94E0;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
		font-size: 32rpx;
		font-weight: 800;
		letter-spacing: 4rpx;
		color: #FFFFFF;
		text-align: center;
	}

	.region {
		width: 100%;
		height: 80rpx;
		background-color: #F3F5F7;
		border-radius: 8rpx;
		padding: 0 20rpx;

	}

	/deep/ .u-form-item {
		// padding-bottom: 0px !important;
	}

	textarea {
		background-color: #F3F5F7;
		border-radius: 8rpx;
		padding: 10rpx 20rpx;
		width: 100%;
		height: 160rpx;
	}

	textarea::placeholder {
		color: green;
	}

	page {
		background-color: #fff;

	}

	/deep/ .u-form-item--left__content__label {
		font-weight: 800;
	}

	.text {
		color: #1B94E0;
		font-size: 28rpx;
	}

	// /deep/  .textarea-placeholder{
	// 	background-color: #F3F5F7;
	// 	padding: 10rpx 20rpx;
	// }
	// /deep/ .uni-textarea-textarea{
	// 	padding: 10rpx 20rpx;
	// 	background-color: #F3F5F7;
	// }
	/deep/ .u-input__right-icon {
		background-color: #F3F5F7;
		padding-right: 20rpx;
		border-bottom-right-radius: 8rpx;
		border-top-right-radius: 8rpx;
	}

	/deep/ input {
		padding-left: 24rpx;
		background-color: #F3F5F7 !important;
		border-radius: 8rpx;
	}
</style>