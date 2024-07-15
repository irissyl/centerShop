<template>
	<view style="padding: 24rpx;padding-bottom: 180rpx;">
		<u-form :model="form" ref="uForm">

			<u-form-item prop="project_name" label-width="135" label-align="right" :border-bottom="false" label="项目名称"><u-input
					v-model="form.project_name" placeholder="请输入项目名称" /></u-form-item>
			<u-form-item prop="take_role" label-width="135" label-align="right" :border-bottom="false" label="担任角色"><u-input
					v-model="form.take_role" placeholder="请输入担任角色" /></u-form-item>
			<u-form-item prop="in_work_time" label-width="135" label-align="right" :border-bottom="false" label="在职时间">
				<view class="region dbb" @click="show = true">
					<text v-show="!in_work_time" style="color: rgb(192, 196, 204);font-size: 28rpx;">入职时间</text>
					<text v-show="in_work_time" style="">{{in_work_time}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
				<view class="line">
				</view>
				<view class="region dbb" @click="show2 = true">
					<text v-show="!out_work_time" style="color: rgb(192, 196, 204);font-size: 28rpx;">离职时间</text>
					<text v-show="out_work_time" style="">{{out_work_time}}</text>
					<u-icon name="arrow-down-fill" color="rgb(192, 196, 204)" size="26"></u-icon>
				</view>
			</u-form-item>
			<u-form-item prop="name" label-width="135" label-align="right" :border-bottom="false" label="项目描述">
				<textarea name="" id="" cols="30" rows="10" v-model="form.project_note" placeholder-style="color: rgb(192, 196, 204);"
					placeholder="请输入项目描述"></textarea>
			</u-form-item>
			<u-form-item prop="name" label-width="135" label-align="right" :border-bottom="false" label="项目业绩">
				<textarea name="" id="" cols="30" rows="10" v-model="form.project_score" placeholder-style="color: rgb(192, 196, 204);"
					placeholder="请输入项目业绩"></textarea>
			</u-form-item>
		</u-form>
		<u-picker v-model="show" mode="time" @confirm="confirm1"></u-picker>
		<u-picker v-model="show2" mode="time" @confirm="confirm2"></u-picker>
		<!-- <u-select v-model="show1" :list="industry" mode="mutil-column-auto" @confirm="confirm"></u-select> -->
		<u-toast ref="uToast" />
		<view class="bottom" @click="submit">
			保存提交
		</view>
	</view>
</template>

<script>
	import {
		industry
	} from '@/static/industry.js';
	import UploadFile from '@/components/UploadFile.vue';
	export default {
		components: {
			UploadFile
		},
		data() {
			return {
				industry,
					show: false,
					show2: false,
					show1: false,
					checked: false,
					in_work_time: null,
					out_work_time: null,
					form: {
						project_name: null,
						take_role: null,
						in_work_time: null,
						out_work_time: null,
						project_note: null,
						project_score: null,
					},
					rules: {
						project_name: [{
							required: true,
							message: '请输项目名称',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						}],
						take_role: [{
							required: true,
							message: '请输入担任角色',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						}],
						// in_work_time: [{
						// 	required: true,
						// 	message: '请输入入职时间',
						// 	// 可以单个或者同时写两个触发验证方式 
						// 	trigger: ['change', 'blur'],
						// }],
						// out_work_time: [{
						// 	required: true,
						// 	message: '请输入离职时间',
						// 	// 可以单个或者同时写两个触发验证方式 
						// 	trigger: ['change', 'blur'],
						// }],
						project_note: [{
							required: true,
							message: '请输入项目描述',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						}],
						project_score: [{
							required: true,
							message: '项目业绩',
							// 可以单个或者同时写两个触发验证方式 
							trigger: ['change', 'blur'],
						}]
					}
				};
		},
		methods: {
			submit() {
				this.$refs.uForm.validate(valid => {
					if (valid) {
						console.log('验证通过');
						this.$refs.uToast.show({
							title: '填加成功',
							// 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
							type: 'success', 
							// 如果不需要图标，请设置为false
							// icon: false
						})
						uni.setStorageSync('project',this.form)
						setTimeout(function() {
							// wx.removeStorageSync('work')
							wx.removeStorageSync('project')
							wx.navigateBack()
						}, 1000);
					} else {
						console.log('验证失败');
						this.$refs.uToast.show({
							title: '填加失败',
							// 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
							type: 'warning', 
							// 如果不需要图标，请设置为false
							// icon: false
						})
					}
				});
			},
			// confirm(e) {
			// 	this.form.work_type = e[1].label
			// },
			confirm1(e) {
				console.log(11111, e);
				this.in_work_time = `${e.year}.${e.month}.${e.day}`
				this.form.in_work_time = e.timestamp+''
			},
			confirm2(e) {
				this.out_work_time = `${e.year}.${e.month}.${e.day}`
				this.out_work_time = e.timestamp+''
				console.log(11111, e);
			},
		},
		onShow() {
			this.setGlobalColor({
				bgc: '#ffffff'
			})
			
			
		},
		onLoad(e) {
			if(uni.getStorageSync('project').length && e.index){
				this.form = uni.getStorageSync('project')[e.index]
				this.in_work_time = this.form.in_work_time
				this.out_work_time = this.form.out_work_time
			}
		},
		onReady() {
			this.$nextTick(() => {
				if(this.$refs.uForm){
					this.$refs.uForm.setRules(this.rules);
				}
			})
			// wx.removeStorageSync('work')
			// wx.removeStorageSync('project')
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #fff;

	}
	.line{
		flex:0 0 48rpx;
		margin:0 16rpx ;
		border-bottom: 2rpx solid #999999;
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