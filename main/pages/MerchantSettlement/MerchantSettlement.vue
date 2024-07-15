<template>
	<view style="padding: 24rpx;">
		<u-form :model="form" ref="uForm">
			<u-form-item prop="image_url" label-width="135" label-align="right" :border-bottom="false" label="商会logo">
				<UploadFile @success="success"></UploadFile>
			</u-form-item>
			<u-form-item prop="name" label-width="135" label-align="right" :border-bottom="false" label="商会名称"><u-input
					v-model="form.name" placeholder="请输商会名称" /></u-form-item>
			<u-form-item prop="note" label-width="135" label-align="right" :border-bottom="false" label="商会简介">
				<textarea name="" v-model="form.note" id="" cols="30" rows="10" value=""
					placeholder-style="color: rgb(192, 196, 204);" placeholder="请输入商会简介"></textarea>
			</u-form-item>
			<u-form-item prop="province_id" label-width="135" label-align="right" :border-bottom="false" label="所在地区">
				<view class="region dbb" @click="show = true">
					<text v-show="!select_region" style="color: rgb(192, 196, 204);font-size: 28rpx;">请选择地区</text>
					<text v-show="select_region" style="">{{select_region}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item>
			<u-form-item prop="link_name" label-width="135" label-align="right" :border-bottom="false"
				label="联系人员"><u-input v-model="form.link_name" placeholder="请输入联系人姓名" /></u-form-item>
			<u-form-item prop="link_phone" label-width="135" label-align="right" :border-bottom="false"
				label="联系电话"><u-input v-model="form.link_phone" placeholder="请输入联系电话" /></u-form-item>
			<!-- <u-form-item prop="coc_work_type" label-width="135" label-align="right" :border-bottom="false" label="所在行业">
				<view class="region dbb" @click="show1 = true">
					<text v-show="!form.coc_work_type" style="color: rgb(192, 196, 204);font-size: 28rpx;">请选择行业</text>
					<text v-show="form.coc_work_type" style="">{{form.coc_work_type}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item> -->
			<u-form-item prop="prove_type" label-width="135" label-align="right" :border-bottom="false" label="认证方式">
				<view class="region dbb" @click="show2 = true">
					<text v-show="!form.prove_type" style="color: rgb(192, 196, 204);font-size: 28rpx;">请选择认证方式</text>
					<text v-show="form.prove_type" style="">{{form.prove_type}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item>
			<u-form-item v-show="form.prove_type === '登记证书'" prop="prove_img" label-width="135" label-align="right" :border-bottom="false" label="登记证书">
				<UploadFile @success="success1"></UploadFile>
			</u-form-item>
			<u-form-item v-show="form.prove_type === '登记证书'" prop="coc_org_code" label-width="135" label-align="right" :border-bottom="false"
				label="统一码"><u-input v-model="form.coc_org_code" placeholder="添加登记证书图片后自动识别" /></u-form-item>
			<u-form-item v-show="form.prove_type === '法人身份证'" prop="card_face_img" label-width="135" label-align="right" :border-bottom="false"
				label="法人身份证">
				<UploadFile @success="success2" uploadText="身份证人像面"></UploadFile>
				<UploadFile @success="success3" uploadText="身份证国徽面"></UploadFile>
			</u-form-item>
			<u-form-item v-show="form.prove_type === '法人身份证'" prop="card_number" label-width="135" label-align="right" :border-bottom="false"
				label="身份证号"><u-input v-model="form.card_number" placeholder="添加身份证图片后自动识别" /></u-form-item>
		</u-form>
		<view class="flg" style="margin: 40rpx 0 24rpx;">
			<u-checkbox-group>
				<u-checkbox v-model="checked" shape="circle">
					<text style="font-size: 24rpx;">我已阅读并了解</text>
					<text @click.stop="toXieyi" style="font-size: 24rpx;color: #F43434;">【入驻协议】</text>
				</u-checkbox>
			</u-checkbox-group>
		</view>
		<view class="bottom" @click="submit">
			申请入驻
		</view>
		<regionalComponents v-show="show" ref="regionalComponents" :defaultData="defaultData" @cancel="show = false"
			@confirm="confirm1"></regionalComponents>
		<u-select v-model="show1" :list="industry" mode="mutil-column-auto" @confirm="confirm"></u-select>
		<u-select v-model="show2" :list="list" mode="single-column" @confirm="confirm2"></u-select>
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
		data() {
			return {
				industry: industry,
				show: false,
				show1: false,
				show2: false,
				checked: false,
				list: [{
						value: '登记证书',
						label: '登记证书'
					},
					{
						value: '法人身份证',
						label: '法人身份证'
					}
				],
				defaultData: {
					province_id: 0,
					city_id: 0,
					region_id: 0,
					street_id: 0,
					address_id: 0,
				},
				select_region: '',
				form: {
					name: '',
					coc_org_code: '',
					prove_img: '',
					card_face_img: '',
					card_back_img: '',
					card_number: '',
					image_url: '',
					note: '',
					link_name: '',
					link_phone: '',
					province_id: null,
					city_id: null,
					region_id: null,
					street_id: null,
					image_id: 1,
					in_time: '2',
					prove_type: '',
					// coc_work_type: ''
				},
				rules: {
					name: [{
						required: true,
						message: '请输商会名称',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					image_url: [{
						required: true,
						message: '请上传商会logo',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					note: [{
						required: true,
						message: '请输入商会简介',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					link_name: [{
						required: true,
						message: '请输入联系人名字',
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
					// coc_work_type: [{
					// 	required: true,
					// 	message: '请选择行业',
					// 	// 可以单个或者同时写两个触发验证方式 
					// 	trigger: ['change', 'blur'],
					// }],
					// prove_img: [{
					// 	required: true,
					// 	message: '请上传登记证书',
					// 	// 可以单个或者同时写两个触发验证方式 
					// 	trigger: ['change', 'blur'],
					// }],
					// coc_org_code: [{
					// 	required: true,
					// 	message: '请填写统一码',
					// 	// 可以单个或者同时写两个触发验证方式 
					// 	trigger: ['change', 'blur'],
					// }],
					// card_face_img: [{
					// 	required: true,
					// 	message: '请上传身份证人面像',
					// 	// 可以单个或者同时写两个触发验证方式 
					// 	trigger: ['change', 'blur'],
					// }],
					// card_number: [{
					// 	required: true,
					// 	message: '请输身份证号码',
					// 	// 可以单个或者同时写两个触发验证方式 
					// 	trigger: ['change', 'blur'],
					// }],
					select_region: [{
						required: true,
						message: '请选择地区',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					prove_type: [{
						required: true,
						message: '请选择认证方式',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				},
			};
		},
		methods: {
			toXieyi() {
				uni.navigateTo({
					url: '/plus2/pages/xieyi/xieyi?code=coc'
				})
			},
			toTz() {
				console.log(123555);
				uni.navigateTo({
					url: '/main/pages/CommerceChoice/CommerceChoice'
				})
			},
			success(e) {
				this.form.image_url = e.data.file_path
			},
			success1(e) {
				this.form.prove_img = e.data.file_path
			},
			success2(e) {
				this.form.card_face_img = e.data.file_path
			},
			success3(e) {
				this.form.card_back_img = e.data.file_path
			},
			confirm1(e) {
				console.log(e)
				this.form.province_id = e.province_id;
				this.form.city_id = e.city_id;
				this.form.region_id = e.region_id;
				this.form.street_id = e.street_id;
				this.select_region = e.province + e.city + e.area + e.street;
				this.show = false
			},
			submit() {

				this.$refs.uForm.validate(valid => {
					console.log('验证通过', this.form);
					if (valid) {
						if (!this.checked) {
							this.$refs.uToast.show({
								title: '请阅读【入驻协议】',
								type: 'warning',
							})
							return
						}
						if(this.form.prove_type === '登记证书'){
							if (!this.form.prove_img) {
								this.$refs.uToast.show({
									title: '请上传证件',
									type: 'warning',
								})
								return
							}
							if (!this.form.coc_org_code) {
								this.$refs.uToast.show({
									title: '请填写统一码',
									type: 'warning',
								})
								return
							}
						}else{
							if (!this.form.card_face_img) {
								this.$refs.uToast.show({
									title: '请上传身份证人面像',
									type: 'warning',
								})
								return
							}
							if (!this.form.card_back_img) {
								this.$refs.uToast.show({
									title: '身份证国徽面',
									type: 'warning',
								})
								return
							}
						}
						
						this._post('plus.coc.Coc/cocOrgApply', this.form, (res) => {
							this.$refs.uToast.show({
								title: '填加成功',
								// 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
								type: 'success', 
								// 如果不需要图标，请设置为false
								// icon: false
							})
							uni.setStorageSync('work',this.form)
							setTimeout(function() {
								wx.navigateBack()
							}, 1000);
						})
					} else {
						console.log('验证失败');
					}
				});
			},
			confirm(e) {
				console.log(22222, e);
				this.form.coc_work_type = e[1].label
			},
			confirm2(e) {
				console.log(22222, e);
				this.form.prove_type = e[0].label
			},
		},
		onShow() {
			this.setGlobalColor({
				bgc: '#ffffff'
			})
		},
		onReady() {
			this.$nextTick(() => {
				if(this.$refs.uForm){
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