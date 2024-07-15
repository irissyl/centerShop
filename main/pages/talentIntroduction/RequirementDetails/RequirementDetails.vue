<template>
	<view style="padding: 24rpx;">
		<view class="top">
			<img :src="obj.corp_image_url" alt="" />
			<view class="">
				<view class="top-t">
					{{obj.corp_name}}
				</view>
				<view class="top-b">
					{{obj.corp_note}}
				</view>
			</view>
		</view>
		<view class="" style="margin-top: 14rpx;">
			<view class="content-box">
				<text class="content-box-t">所属商会</text>
				<text class="content-box-b">{{obj.to_coc_org_name}}</text>
			</view>
			<view class="content-box">
				<text class="content-box-t">所在行业</text>
				<text class="content-box-b">{{obj.work_type}}</text>
			</view>
			<view class="content-box">
				<text class="content-box-t">所在地区</text>
				<text class="content-box-b">郑州市</text>
			</view>
			<view class="content-box">
				<text class="content-box-t">联系人员</text>
				<text class="content-box-b">{{obj.link_name}}</text>
			</view>
			<view class="content-box">
				<text class="content-box-t">联系电话</text>
				<text class="content-box-b">{{obj.linkStatus !== 2 ?maskPhoneNumber(obj.link_phone) : obj.link_phone}}</text>
			</view>
		</view>
		<view class="dlit">
			<view class="dlit-1">
				{{obj.work_name}}
			</view>
			<view class="dlit-2">
				任职要求
			</view>
			<view class="dlit-3">
				{{obj.work_request}}
			</view>
			<view class="dlit-4">
				<text class="dlit-5">行业要求</text>
				<text class="dlit-6">{{obj.work_type_request}}</text>
			</view>
		</view>
		<view class="bottom" @click="contact(obj,3)">
			联系申请
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
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
			this._get('plus.coc.Coc/getCocNeedById', {coc_need_id:e.coc_need_id}, (res) => {
				
				console.log(res,21333);
				this.obj = res.data.list
			})
		},
		onShow() {
			this.setGlobalColor({
				bgc: '#ffffff'
			})
			
		},
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
		position: fixed;
		bottom: 40rpx;
	}
	.dlit{
		width: 702rpx;
		height: 364rpx;
		background: #F3F5F7;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		padding: 16rpx 24rpx;
		margin-top: 48rpx;
		.dlit-1{
			font-size: 32rpx;
			font-weight: 800;
		}
		.dlit-3{
			font-size: 28rpx;
			color: #666666;
			width: 654rpx;
			height: 160rpx;
			padding: 16rpx;
			background: #FFFFFF;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
		}
		.dlit-2{
			font-size: 28rpx;
			font-weight: 800;
		}
		.dlit-4{
			margin-top: 16rpx;
		}
		.dlit-5{
			font-size: 28rpx;
			font-weight: 800;
			margin-right: 16rpx;
		}
	}
	.content-box-t{
		color: #666666;
		font-size: 28rpx;
		margin-right: 16rpx;
	}
	.content-box-b{
		font-size: 28rpx;
		font-weight: 800;
	}
	.top{
		display: flex;
		img{
			width: 112rpx;
			height: 112rpx;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			margin-right: 16rpx;
		}
		.top-t{
			font-weight: 800;
			font-size: 40rpx;
		}
		.top-b{
			color: #666666;
			font-size: 24rpx;
		}
	}
	page {
		background-color: #fff;
	}
</style>