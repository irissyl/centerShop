<template>
	<view style="padding: 24rpx;padding-bottom: 180rpx;">
		<u-form :model="form" ref="uForm">
			<u-form-item prop="head_image_url" label-width="135" label-align="right" :border-bottom="false" label="头像">
				<UploadFile :img="form.head_image_url" @success="success"></UploadFile>
			</u-form-item>
			<u-form-item prop="link_name" label-width="135" label-align="right" :border-bottom="false"
				label="姓名"><u-input v-model="form.link_name" placeholder="请输入您的姓名" /></u-form-item>
			<u-form-item prop="position" label-width="135" label-align="right" :border-bottom="false"
				label="意向职位"><u-input v-model="form.position" placeholder="请输入意向职位" /></u-form-item>
			<u-form-item prop="link_phone" label-width="135" label-align="right" :border-bottom="false"
				label="联系电话"><u-input v-model="form.link_phone" placeholder="请输入电话" /></u-form-item>
			<u-form-item prop="work_type" label-width="135" label-align="right" :border-bottom="false" label="意向行业">
				<view class="region dbb" @click="show1 = true">
					<text v-show="!form.work_type" style="color: rgb(192, 196, 204);font-size: 28rpx;">请选择意向行业</text>
					<text v-show="form.work_type" style="">{{form.work_type}}</text>
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
			<u-form-item prop="work_year" label-width="135" label-align="right" :border-bottom="false"
				label="工作年限"><u-input v-model="form.work_year" placeholder="请输入工作年限" /></u-form-item>
			<u-form-item prop="resource_note" label-width="135" label-align="right" :border-bottom="false" label="资源共享">
				<textarea name="" id="" v-model="form.resource_note" cols="30" rows="10" value=""
					placeholder-style="color: rgb(192, 196, 204);" placeholder="请输入资源共享内容"></textarea>
			</u-form-item>
			<u-form-item prop="resource_need" label-width="135" label-align="right" :border-bottom="false" label="资源需求">
				<textarea name="" id="" v-model="form.resource_need" cols="30" rows="10" value=""
					placeholder-style="color: rgb(192, 196, 204);" placeholder="请输入资源需求内容"></textarea>
			</u-form-item>
		</u-form>
		<view class="work">
			<view class="work-z dbb">
				<text class="work-t">工作经历</text>
				<u-icon name="plus-circle" size="42" @click="qiehuan(1)"></u-icon>
			</view>
			<view class="work-b" v-for="(item,index) in form.work" :key="index" @click="qiehuan(3,index)" style="margin-bottom: 16rpx;">
				<view class="work-b-t dbb">
					<view class="work-b-t1">
						{{item.company_name || '项目名称'}}
					</view>
					<view class="work-b-t2">
						<text
							v-if="item.in_work_time">{{item.in_work_time+' - '+item.out_work_time}}</text>
						<text v-else>2024.04 - 2024.05</text>
					</view>
				</view>
				<view class="" style="font-size: 24rpx;">
					{{item.work_name||'销售经理'}}
				</view>
				<view class="" style="color: #999999;font-size: 24rpx;">
					工作内容
				</view>
				<view class="" style="color: #999999;font-size: 20rpx;">
					<view class="" v-if="item.work_note" style="color: #999999;font-size: 20rpx;">
						{{item.work_note}}
					</view>
					<view class="" v-else style="color: #999999;font-size: 20rpx;">
						1.工作内容描述工作内容描述工作内容描述<br />
						1.工作内容描述工作内容描述工作内容描述
					</view>
				</view>
			</view>
			<view class="work-b" style="margin-bottom: 16rpx;" v-if="form.work.length === 0">
				<view class="work-b-t dbb">
					<view class="work-b-t1">
						{{'项目名称'}}
					</view>
					<view class="work-b-t2">
						<text >2024.04 - 2024.05</text>
					</view>
				</view>
				<view class="" style="font-size: 24rpx;">
					{{'销售经理'}}
				</view>
				<view class="" style="color: #999999;font-size: 24rpx;">
					工作内容
				</view>
				<view class="" style="color: #999999;font-size: 20rpx;">
					<view class=""  style="color: #999999;font-size: 20rpx;">
						1.工作内容描述工作内容描述工作内容描述<br />
						1.工作内容描述工作内容描述工作内容描述
					</view>
				</view>
			</view>
		</view>
		<view class="work">
			<view class="work-z dbb">
				<text class="work-t">项目经历</text>
				<u-icon name="plus-circle" size="42" @click="qiehuan(2)"></u-icon>
			</view>
			<view class="work-b" v-for="(item,index) in form.project" :key="index" @click="qiehuan(4,index)" style="margin-bottom: 16rpx;">
				<view class="work-b-t dbb">
					<view class="work-b-t1">
						{{item.project_name || '项目名称'}}
					</view>
					<view class="work-b-t2">
						<text
							v-if="item.in_work_time">{{item.in_work_time+'-'+item.out_work_time}}</text>
						<text v-else>2024.04-2024.05</text>
					</view>
				</view>
				<view class="" style="font-size: 24rpx;">
					{{item.take_role||'销售经理'}}
				</view>
				<view class="" style="color: #999999;font-size: 24rpx;">
					项目描述
				</view>
				<view class="" style="color: #999999;font-size: 20rpx;">
					<view class="" v-if="item.project_note" style="color: #999999;font-size: 20rpx;">
						{{item.project_note}}
					</view>
					<view class="" v-else style="color: #999999;font-size: 20rpx;">
						1.工作内容描述工作内容描述工作内容描述<br />
						1.工作内容描述工作内容描述工作内容描述
					</view>
				</view>
				<view class="" style="color: #999999;font-size: 24rpx;margin-top: 8rpx;">
					项目业绩
				</view>
				<view class="" style="color: #999999;font-size: 20rpx;" v-if="item.project_score">
					{{item.project_score}}
				</view>
				<view class="" style="color: #999999;font-size: 20rpx;" v-else>
					1.项目业绩描述
				</view>
			</view>
			<view class="work-b" v-if="form.project.length === 0">
				<view class="work-b-t dbb">
					<view class="work-b-t1">
						{{'项目名称'}}
					</view>
					<view class="work-b-t2">
						<text >2024.04-2024.05</text>
					</view>
				</view>
				<view class="" style="font-size: 24rpx;">
					{{'销售经理'}}
				</view>
				<view class="" style="color: #999999;font-size: 24rpx;">
					项目描述
				</view>
				<view class="" style="color: #999999;font-size: 20rpx;">
					<view class="" style="color: #999999;font-size: 20rpx;">
						1.工作内容描述工作内容描述工作内容描述<br />
						1.工作内容描述工作内容描述工作内容描述
					</view>
				</view>
				<view class="" style="color: #999999;font-size: 24rpx;margin-top: 8rpx;">
					项目业绩
				</view>
				<view class="" style="color: #999999;font-size: 20rpx;">
					1.项目业绩描述
				</view>
			</view>
		</view>
		<view class="bottom" @click="submit">
			保存提交
		</view>
		<u-select v-model="show1" :list="industry" mode="mutil-column-auto" @confirm="confirm"></u-select>
		<regionalComponents v-show="show" ref="regionalComponents" :defaultData="defaultData" @cancel="show = false"
			@confirm="confirm1"></regionalComponents>
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
				checked: false,
				defaultData: {
					province_id: 0,
					city_id: 0,
					region_id: 0,
					street_id: 0,
					address_id: 0,
				},
				flg:false,
				form: {
					head_image_url: '',
					link_name: '',
					position: '',
					link_phone: '',
					work_type: '',
					province_id: null,
					city_id: null,
					region_id: null,
					street_id: null,
					select_region: '',
					work_year: '',
					resource_note: '',
					resource_need: '',
					work: [
					// 	{
					// 	company_name: '',
					// 	work_type: '',
					// 	in_work_time: '',
					// 	out_work_time: '',
					// 	work_name: '',
					// 	work_note: '',
					// },
					],
					project: [
					// 	{
					// 	project_name: '',
					// 	take_role: '',
					// 	in_work_time: '',
					// 	out_work_time: '',
					// 	project_note: '',
					// 	project_score: '',
					// },
					],

				},
				rules: {
					head_image_url: [{
						required: true,
						message: '请上传头像',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					link_name: [{
						required: true,
						message: '请输入名字',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					position: [{
						required: true,
						message: '请输入意向职位',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					link_phone: [{
						required: true,
						message: '请输入电话',
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
					work_type: [{
						required: true,
						message: '请选择行业',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					select_region: [{
						required: true,
						message: '请选择地区',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					work_year: [{
						required: true,
						message: '请输入工作年限',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					resource_note: [{
						required: true,
						message: '请输入资源共享内容',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
					resource_need: [{
						required: true,
						message: '请输入资源需求内容',
						// 可以单个或者同时写两个触发验证方式 
						trigger: ['change', 'blur'],
					}],
				}
			}
		},
		onLoad(e) {
			this.flg = e.flg
			if(this.flg){
				this._get('plus.coc.Coc/getCocPersonnelByUserId', {user_id: uni.getStorageSync("user_id")}, (res) => {

					this.form = res.data.list
					this.form.select_region = this.form.district.province+this.form.district.city+this.form.district.region+this.form.district.street
					// console.log(this.form,12333444);
					this.form.work.forEach(e=>{
						e.in_work_time = e.in_work_time.split(' ')[0]
						e.out_work_time = e.out_work_time.split(' ')[0]
					})
					this.form.project.forEach(e=>{
						e.in_work_time = e.in_work_time.split(' ')[0]
						e.out_work_time = e.out_work_time.split(' ')[0]
					})
					uni.setStorageSync('work',this.form.work)
					uni.setStorageSync('project',this.form.project)
				})
			}
			console.log(this.form.work,this.form.project,333);
			const work = wx.getStorageSync('work')
			const project = wx.getStorageSync('project')
			let list = this.form.work.map(e=>{
				return JSON.stringify(e)
			})
			let list1 = this.form.project.map(e=>{
				return JSON.stringify(e)
			})
			console.log(work,project,4444);
			if(list.indexOf(JSON.stringify(work)) == -1 && work){
				this.form.work.push(work)
			}
			if(list1.indexOf(JSON.stringify(project)) == -1 && project){
				this.form.project.push(project)
			}
			console.log(this.form.work,this.form.project,213);
		},
		methods: {
			qiehuan(e,j) {
				if (e == 1) {
					uni.navigateTo({
						url: '/main/pages/RegisteredTalents/workExperience/workExperience'
					});

				} else if (e == 2) {
					uni.navigateTo({
						url: '/main/pages/RegisteredTalents/ProjectExperience/ProjectExperience'
					});
				} else if (e == 3) {
					uni.navigateTo({
						url: '/main/pages/RegisteredTalents/workExperience/workExperience?index='+j
					});
				} else if (e == 4) {
					uni.navigateTo({
						url: '/main/pages/RegisteredTalents/ProjectExperience/ProjectExperience?index='+j
					});
				}
			},
			success(e) {
				// console.log(e,11299);
				this.form.head_image_url = e.data.file_path
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
				console.log(99999);
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						if (!this.form.work.length) {
							this.$refs.uToast.show({
								title: '请填写工作经历',
								type: 'warning',
							})
							return
						}
						if (!this.form.project.length) {
							this.$refs.uToast.show({
								title: '请填写项目经历',
								type: 'warning',
							})
							return
						}

						if(this.flg){
							
							this.form.project.forEach(e=>{
								console.log(Date.parse(e.in_work_time),111,e,Date.parse(e.out_work_time));
								e.in_work_time = Date.parse(e.in_work_time)/1000+''
								e.out_work_time = Date.parse(e.out_work_time)/1000+''
							})
							this.form.work.forEach(e=>{
								e.in_work_time = Date.parse(e.in_work_time)/1000+''
								e.out_work_time = Date.parse(e.out_work_time)/1000+''
							})
							console.log(this.form,123333);
							this._postJson('plus.coc.Coc/updateCocPersonnelById', this.form, (res) => {
								this.$refs.uToast.show({
									title: '修改成功',
									type: 'success',
								})
								wx.removeStorageSync('work')
								wx.removeStorageSync('project')
								setTimeout(e=>{
									wx.navigateBack()
								},1000)
							})
						}else{
							this._postJson('plus.coc.Coc/saveCocPersonnel', this.form, (res) => {
								this.$refs.uToast.show({
									title: '填加成功',
									type: 'success',
								})
								wx.removeStorageSync('work')
								wx.removeStorageSync('project')
								setTimeout(e=>{
									wx.navigateBack()
								},1000)
							
							})
						}
						

					} else {
						console.log('验证失败');
					}
				});
			},
			confirm(e) {
				console.log(22222, e);
				this.form.work_type = e[1].label
			},
		},
		onShow() {
			this.setGlobalColor({
				bgc: '#ffffff'
			})
			

		},
		onHide() {
			// this.form.work = []
			// this.form.project = []
		},
		onReady() {
			this.$nextTick(() => {
				if(this.$refs.uForm){
					this.$refs.uForm.setRules(this.rules);
				}
			})
			
			wx.removeStorageSync('work')
			wx.removeStorageSync('project')
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;

	}

	.work {
		.work-z {
			// height: 50rpx;
			margin-top: 40rpx;
		}

		.work-t {
			font-size: 28rpx;
			// margin-top: 40rpx;
			font-weight: 800;
		}

		.work-b {
			width: 702rpx;
			// height: 240rpx;
			background: #F3F5F7;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			padding: 16rpx;

			.work-b-t {
				.work-b-t1 {
					font-size: 28rpx;
					font-weight: 800;
				}

				.work-b-t2 {
					color: #999999;
					font-size: 20rpx;

					text {
						color: #999999;
						font-size: 20rpx;
					}
				}
			}
		}
	}

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
		position: fixed;
		bottom: 40rpx;
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