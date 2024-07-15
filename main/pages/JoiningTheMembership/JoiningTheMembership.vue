<template>
	<view style="padding: 24rpx;">
		<view class="text">
			请正确填写相关信息 提交后将有工作人员进行审核
		</view>
		<u-form :model="form" ref="uForm">
			<u-form-item prop="belong_to" label-width="135" label-align="right" :border-bottom="false" label="入驻商会">
				<view class="region dbb" @click="toTz" style="height: 70rpx;">
					<text v-show="!form.belong_to" style="color: rgb(192, 196, 204);font-size: 28rpx;">请选择商会</text>
					<text v-show="form.belong_to" style="">{{form.belong_to}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item>
			<u-form-item prop="name" label-width="135" label-align="right" :border-bottom="false" label="公司名称"><u-input
					v-model="form.name" placeholder="请输公司名称" /></u-form-item>
			<u-form-item prop="coc_code" label-width="135" label-align="right" :border-bottom="false"
				label="统一码"><u-input v-model="form.coc_code" placeholder="请输入统一社会信用代码" /></u-form-item>
			<u-form-item prop="image_url" label-width="135" label-align="right" :border-bottom="false" label="公司logo">
				<UploadFile @success="success"></UploadFile>
			</u-form-item>
			<u-form-item prop="coc_create_time" label-width="135" label-align="right" :border-bottom="false"
				label="创建时间">
				<view class="region dbb" @click="show2 = true">
					<text v-show="!coc_create_time" style="color: rgb(192, 196, 204);font-size: 28rpx;">请输入公司创建时间</text>
					<text v-show="coc_create_time" style="">{{coc_create_time}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item>
			<u-form-item prop="select_region" label-width="135" label-align="right" :border-bottom="false" label="所在地区">
				<view class="region dbb" @click="show = true">
					<text v-show="!form.select_region" style="color: rgb(192, 196, 204);font-size: 28rpx;">请选择地区</text>
					<text v-show="form.select_region" style="">{{form.select_region}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item>
			<u-form-item prop="coc_work_type" label-width="135" label-align="right" :border-bottom="false" label="所在行业">
				<view class="region dbb" @click="show1 = true">
					<text v-show="!form.coc_work_type" style="color: rgb(192, 196, 204);font-size: 28rpx;">请选择行业</text>
					<text v-show="form.coc_work_type" style="">{{form.coc_work_type}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item>
			<u-form-item prop="business" label-width="135" label-align="right" :border-bottom="false" label="主营业务">
				<textarea name="" id="" v-model="form.business" cols="30" rows="10" value=""
					placeholder-style="color: rgb(192, 196, 204);" placeholder="请输入公司主营业务"></textarea>
			</u-form-item>
			<u-form-item prop="intro" label-width="135" label-align="right" :border-bottom="false" label="公司简介">
				<textarea name="" v-model="form.intro" id="" cols="30" rows="10" value=""
					placeholder-style="color: rgb(192, 196, 204);" placeholder="请输入公司简介"></textarea>
			</u-form-item>
			<u-form-item prop="linkman" label-width="135" label-align="right" :border-bottom="false"
				label="联系人员"><u-input v-model="form.linkman" placeholder="请输入联系人姓名" /></u-form-item>
			<u-form-item prop="phone" label-width="135" label-align="right" :border-bottom="false" label="联系电话"><u-input
					v-model="form.phone" placeholder="请输入联系电话" /></u-form-item>
			<u-form-item prop="link_address" label-width="135" label-align="right" :border-bottom="false"
				label="联系地址"><u-input v-model="form.link_address" placeholder="请输入联系地址" /></u-form-item>
			<u-form-item prop="post" label-width="135" label-align="right" :border-bottom="false" label="职位"><u-input
					v-model="form.post" placeholder="请输入职位" /></u-form-item>
			<u-form-item prop="price" label-width="135" label-align="right" :border-bottom="false" label="入驻押金"><u-input
					v-model="form.price" disabled placeholder="请输入入驻押金" /></u-form-item>
			<u-select v-model="show1" :list="industry" mode="mutil-column-auto" @confirm="confirm"></u-select>
		</u-form>
		<regionalComponents v-show="show" ref="regionalComponents" :defaultData="defaultData" @cancel="show = false"
			@confirm="confirm1"></regionalComponents>
		<view class="flg" style="margin: 40rpx 0 24rpx;">
			<u-checkbox-group>
				<u-checkbox v-model="checked" shape="circle">
					<text style="font-size: 24rpx;">我已阅读并了解</text>
					<text @click.stop="toXieyi()" style="font-size: 24rpx;color: #F43434;">【入驻协议】</text>
				</u-checkbox>
			</u-checkbox-group>
		</view>
		<u-picker v-model="show2" mode="time" @confirm="confirm2"></u-picker>
		<view class="bottom" @click="submit">
			提交申请并支付入驻押金
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import regionalComponents from '@/components/regionalComponents/regionalComponents.vue'
	import UploadFile from '@/components/UploadFile.vue';
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
				merchantObj: {
					name: '东莞河南商会',
					coc_org_id: 1
				},
				show: false,
				show1: false,
				show2: false,
				checked: false,
				defaultData: {
					province_id: 0,
					city_id: 0,
					region_id: 0,
					street_id: 0,
					address_id: 0,
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
				coc_create_time: '',
				form: {
					name: '',
					image_url: '',
					intro: '',
					business: '',
					linkman: '',
					phone: '',
					post: '',
					belong_to: '',
					price: 0,
					coc_code: '',
					link_address: '',
					select_region: '',
					coc_work_type: '',
					province_id: null,
					city_id: null,
					region_id: null,
					street_id: null,
					coc_org_id: null,
					time: '1',
					categorya_id: 1,
					grade_id: 1,
					coc_create_time: '',
				},
				rules: {
					name: [{
						required: true,
						message: '请输公司名称',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					coc_create_time: [{
						required: true,
						message: '请输公司创建时间',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					image_url: [{
						required: true,
						message: '请上传公司logo',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					intro: [{
						required: true,
						message: '请输入公司简介',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					business: [{
						required: true,
						message: '请输入公司主营业务',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					business: [{
						required: true,
						message: '请输入公司主营业务',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					business: [{
						required: true,
						message: '请输入公司主营业务',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					linkman: [{
						required: true,
						message: '请输入联系人名字',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					phone: [{
						required: true,
						message: '请输入联系人手机号',
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
					link_address: [{
						required: true,
						message: '请输入联系人地址',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					post: [{
						required: true,
						message: '请输入职位',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					coc_code: [{
						required: true,
						message: '请输入统一社会信用代码',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					select_region: [{
						required: true,
						message: '请选择地区',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					coc_work_type: [{
						required: true,
						message: '请选择行业',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				}
			};
		},
		watch: {
			merchantObj: {
				deep: true,
				handler(newValue, oldValue) {
					console.log("a change", newValue, oldValue)
					this.form.coc_org_id = newValue.coc_org_id
					this.form.belong_to = newValue.name
					console.log(this.form, 1112222);
				}
			}
		},
		methods: {
			toXieyi() {
				uni.navigateTo({
					url: '/plus2/pages/xieyi/xieyi?code=ruzhu'
				})
			},
			toTz() {
				console.log(123555);
				uni.navigateTo({
					url: '/main/pages/CommerceChoice/CommerceChoice'
				})
			},
			success(e) {
				// console.log(e,11299);
				this.form.image_url = e.data.file_path
			},
			confirm2(e) {
				console.log(e, 123333);
				this.coc_create_time = `${e.year}-${e.month}-${e.day}`
				this.form.coc_create_time = e.timestamp + ''
			},
			confirm1(e) {
				console.log(e)
				this.form.province_id = e.province_id;
				this.form.city_id = e.city_id;
				this.form.region_id = e.region_id;
				this.form.street_id = e.street_id;
				this.form.select_region = e.province + e.city + e.area + e.street;
				this.show = false
			},
			submit() {
				// checked
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						if (!this.checked) {
							this.$refs.uToast.show({
								title: '请阅读【入驻协议】',
								type: 'warning',
							})
							return
						}
						this._post('plus.coc.Coc/cocApply', this.form, (res) => {
							this.$refs.uToast.show({
								title: '填加成功',
								// 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
								type: 'success',
								// 如果不需要图标，请设置为false
								// icon: false
							})
							uni.setStorageSync('work', this.form)
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