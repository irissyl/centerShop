<template>
	<view style="padding: 24rpx;padding-bottom: 180rpx;">
		<view class="top">
			<img :src="obj.head_image_url" alt="" />
			<view class="xq">
				<view class="">
					<text class="xq-1">{{obj.link_name}}</text>
					<text class="xq-2">{{obj.linkStatus !== 2 ?maskPhoneNumber(obj.link_phone) : obj.link_phone}}</text>
				</view>
				<view class="">
					<text class="xq-3">{{obj.work_year}}</text>
					<text class="xq-3">广东东莞</text>
				</view>
			</view>
		</view>
		<view class="intention">
			<view class="intention-x">
				<text class="intention-x1">意向职位</text>
				<text class="intention-x2">{{obj.position}}</text>
			</view>
			<view class="intention-x">
				<text class="intention-x1">意向行业</text>
				<text class="intention-x2">{{obj.work_type}}</text>
			</view>
			<view class="intention-x">
				<text class="intention-x1">资源共享</text>
				<text class="intention-x2">{{obj.resource_note}}</text>
			</view>
			<view class="intention-x">
				<text class="intention-x1">资源需求</text>
				<text class="intention-x2">{{obj.resource_need}}</text>
			</view>
		</view>
		<view class="work">
			<view class="work-t">
				工作经历
			</view>
			<view class="work-b" v-for="(item,index) in obj.work" :key="index">
				<view class="work-b-t dbb">
					<view class="work-b-t1">
						{{item.company_name}}
					</view>
					<view class="work-b-t2">
						{{item.in_work_time}}-{{item.out_work_time}}
					</view>
				</view>
				<view class="" style="font-size: 24rpx;">
					{{item.work_name}}
				</view>
				<view class="" style="color: #999999;font-size: 24rpx;">
					工作内容
				</view>
				<view class="" style="color: #999999;font-size: 20rpx;">
					{{item.work_note}}
				</view>
			</view>
		</view>
		<view class="work">
			<view class="work-t">
				项目经历
			</view>
			<view class="work-b" v-for="(item,index) in obj.project" :key="index">
				<view class="work-b-t dbb">
					<view class="work-b-t1">
						{{item.project_name}}
					</view>
					<view class="work-b-t2">
						{{item.in_work_time}}-{{item.out_work_time}}
					</view>
				</view>
				<view class="" style="font-size: 24rpx;">
					{{item.take_role}}
				</view>
				<view class="" style="color: #999999;font-size: 24rpx;">
					项目描述
				</view>
				<view class="" style="color: #999999;font-size: 20rpx;">
					{{item.project_note}}
				</view>
				<view class="" style="color: #999999;font-size: 24rpx;">
					项目业绩
				</view>
				<view class="" style="color: #999999;font-size: 20rpx;">
					{{item.project_score}}
				</view>
			</view>
		</view>
		<view class="button" @click="contact(obj,1)">
			联系申请
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				coc_personnel_id: null,
				obj:{}
			};
		},
		methods:{
			contact(e,j) {
				console.log(uni.getStorageSync('userInfo'), 999999999,e);
				let obj = {
					type: j,
					answer_coc_id: j==3?e.coc_id:null,
					answer_user_id: e.user_id,
					create_user_name: uni.getStorageSync('userInfo').nickName,
					create_user_id: uni.getStorageSync('user_id'),
				}
				this._get('plus.coc.Coc/saveCocLinkMessage', obj, (res) => {
					console.log(res);
					if (res.code == 1) {
						this.$refs.uToast.show({
							title: '消息已发送',
							type:'success'
						})
					}
				})
			},
		},
		onLoad(e) {
			this.coc_personnel_id = e.coc_personnel_id
		},
		onShow() {
			this.setGlobalColor({
				bgc: '#ffffff'
			})
			this._get('plus.coc.Coc/getCocPersonnelById', {
				coc_personnel_id: this.coc_personnel_id
			}, (res) => {
				console.log(res, 1122);
				this.obj = res.data.list
			})
		},
	}
</script>

<style lang="scss">
	.button {
		width: 702rpx;
		height: 80rpx;
		text-align: center;
		line-height: 78rpx;
		position: fixed;
		bottom: 80rpx;
		color: #fff;
		font-weight: 800;
		letter-spacing: 4rpx;
		background: #1B94E0;
		border-radius: 8rpx 8rpx 8rpx 8rpx;
	}

	.work {
		.work-t {
			font-size: 28rpx;
			margin-top: 40rpx;
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
				}
			}
		}
	}

	.intention {
		margin-top: 10rpx;

		.intention-x {
			.intention-x1 {
				color: #666666;
				margin-right: 16rpx;
				font-size: 28rpx;
				line-height: 2;
			}

			.intention-x2 {
				line-height: 2;
				color: #333333;
				margin-right: 16rpx;
				font-size: 28rpx;
			}
		}
	}

	page {
		background-color: #fff;
	}

	.top {
		display: flex;

		img {
			width: 112rpx;
			height: 112rpx;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			margin-right: 16rpx;
		}

		.xq {
			.xq-1 {
				font-size: 40rpx;
				font-weight: 800;
				margin-right: 24rpx;
			}

			.xq-2 {
				font-size: 28rpx;
			}

			.xq-3 {
				font-size: 20rpx;
				padding: 4rpx 10rpx;
				margin-right: 16rpx;
				background: #F5F7FA;
				color: #999;
			}
		}
	}
</style>