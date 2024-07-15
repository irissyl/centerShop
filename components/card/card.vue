<template>
	<view class="">
		<view class="squ" v-if="item.card_id && item.status == 1" 
		:style="'background:'+getSecondBackgroundColor()+';'">
			<view class="yuyue0">
				<view class="yuyue">
					<view class="yuyue_1">
						<image :src="item.avatar_image" mode=""></image>
					</view>
					<view style="flex: 0.3;">

					</view>
					<view class="yuyue_2">
						<view class="yuyue_2_1" :style="'color:'+getTextColorWhite()+';'">
							{{item.name}}
						</view>

						<view class="yuyue_2_3">
							<text :style="'color: '+getTextColorGrey()+';'" style="font-size: 24rpx;">
								{{item.occupation}}</text>
						</view>
						
						<view class="yuyue_2_3" style="line-height: 30rpx;">
							<text :style="'color: '+getTextColorGrey()+';'" style="font-size: 24rpx;">
								{{item.company}}</text>
						</view>
						
					

					</view>

				</view>
				<view class="squ1" :style="'color:'+getTextColorGrey()+';'">
					<image class="squ1_image" src="/static/address.png" mode=""></image>
					<view class="squ1_view">
						{{item.region.address}}
					</view>
					<view style="clear: both;"></view>
				</view>
				<view class="squ1" style="margin-top: 20rpx;" @click="makePhone(item.mobile)"
					:style="'color:'+getTextColorGrey()+';'">
					<image class="squ1_image" src="/static/phone.png" mode=""></image>
					<view class="squ1_view">
						{{item.mobile}}
					</view>
					<view style="clear: both;"></view>
				</view>
			</view>


			<view class="card0"
				v-if="item.resource_sharing && item.resource_sharing.length > 0 && item.resource_request && item.resource_request.length > 0">
				<view class="card0_1" v-if="item.resource_sharing && item.resource_sharing.length >0 ">
					{{$nw("资源共享")}}:{{item.resource_sharing}}
				</view>
				<view class="card0_2" v-if="item.resource_request && item.resource_request.length >0 ">
					{{$nw("资源需求")}}:{{item.resource_request}}
				</view>

			</view>


			<view @click="detailClick(item)" class="squ_btn_1">
				{{$nw("详情")}}
			</view>
			<view @click="editClick(item)" v-if="user_id == item.user_id" class="squ_btn_2">
				{{$nw("编辑名片")}}
			</view>
			<view @click="sendClick(item)" v-if="user_id != item.user_id" class="squ_btn_2">
				{{$nw("发送信息")}}
			</view>
		</view>


		<view class="create" v-if="( isJ&& isJ == 1)">

			<view :style="'color:'+getTextColorWhite()+';'" class="" @click="createCard" v-if="item.status == -2">
				{{$nw("您还未创建名片，点击创建名片")}}
			</view>
			<view :style="'color:'+getTextColorWhite()+';'" class="" v-if="item.status == -1">
				{{$nw("您的名片正在，审核中")}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_id: uni.getStorageSync("user_id")
			}
		},
		props: ["item", "isJ"],

		computed: {
			getbutton() {
				return this.setButton().button
			}
		},
		methods: {
			makePhone(phone) {
				uni.makePhoneCall({
					phoneNumber: "" + phone
				})
			},
			detailClick(item) {
				let path = "/card/pages/card/index?card_id=" + item.card_id;
				this.gotoPage(path);
			},
			editClick(item) {
				uni.navigateTo({
					url: "/card/pages/card/edit?card_id=" + item.card_id
				})
			},
			sendClick(item) {
				this.jump_chat(item.user_id, item.card_id);
			},
			createCard() { //创建名片
				uni.navigateTo({
					url: "/card/pages/card/edit"
				})
			}
		}
	}
</script>

<style lang="scss">
	.create {
		width: 100%;
		
		view {
			height: 150rpx;
			line-height: 150rpx;
			text-align: center;
		
			font-size: 30rpx;
		}
	}

	.card0 {
		width: 100%;
		background: #fff;
		margin-top: 70rpx;
		background: linear-gradient(to right, #4E463B, #2F2720);
		border-bottom-left-radius: 15rpx;
		border-bottom-right-radius: 15rpx;
		color: #fff;
		padding-top: 20rpx;
		padding-bottom: 20rpx;

		.card0_1 {
			width: 80%;
			margin: auto;
			display: -webkit-box;
			word-break: break-all;
			text-overflow: ellipsis;
			overflow: hidden;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			/*设置 需要显示的行数*/
		}

		.card0_2 {
			width: 80%;
			margin: auto;
			display: -webkit-box;
			word-break: break-all;
			text-overflow: ellipsis;
			overflow: hidden;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			/*设置 需要显示的行数*/
		}
	}

	.squ {
		width: 95%;
		margin: auto;
		padding-bottom: 60rpx;
		background: #fff;
		border-top-left-radius: 15rpx;
		border-top-right-radius: 15rpx;
		position: relative;
		margin-bottom: 20rpx;

		.squ_btn_1 {
			position: absolute;
			right: 30rpx;
			top: 220rpx;
			width: 220rpx;
			height: 70rpx;
			border-radius: 50rpx;
			text-align: center;
			line-height: 70rpx;
			background: linear-gradient(to right, #f2b237, #ffda98);
			font-size: 28rpx;
			color: #636363;
		}

		.squ_btn_2 {
			position: absolute;
			right: 30rpx;
			top: 320rpx;
			width: 220rpx;
			height: 70rpx;
			border-radius: 50rpx;
			text-align: center;
			line-height: 70rpx;
			font-size: 28rpx;
			background: #d8d8d8;
			color: #636363;
		}

		.yuyue0 {
			width: 100%;
			margin: auto;
			margin-top: 20rpx;
			padding-bottom: 30rpx;

			.squ1 {
				width: 82%;
				margin: auto;
				margin-top: 50rpx;

				.squ1_image {
					float: left;
					width: 40rpx;
					height: 40rpx;
				}

				.squ1_view {
					float: left;
					font-size: 28rpx;
					line-height: 40rpx;
					margin-left: 15rpx;
				}
			}
		}

		.yuyue {


			width: 90%;
			margin: auto;

			margin-top: 20rpx;
			display: flex;




			.yuyue_1 {

				flex: 2;

				image {
					width: 150rpx;
					height: 150rpx;
					margin-left: 20rpx;
					margin-top: 20rpx;
					border-radius: 2rpx;
					border-radius: 50%;

				}
			}

			.yuyue_2 {
				flex: 7;

				.yuyue_2_1 {
					width: 95%;
					font-size: 34rpx;
					margin: auto;
					margin-top: 55rpx;
					line-height: 40rpx;
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
	}
</style>