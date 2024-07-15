<template>
	<view style="padding: 80rpx 24rpx 24rpx;">
		<view class="top dbb">
			<view class="top-l " @click="qiehuan(1)">
				<view class="text u-line-1">{{name || '--'}}</view>
				<u-icon class="icon" name="arrow-down-fill" color="#1B94E0" size="18"></u-icon>
			</view>
			<view class="top-r">
				<u-tabs font-size="28" bg-color="#F4F7FB" :list="list" :is-scroll="false" :current="current"
					@change="change"></u-tabs>
			</view>
		</view>
		<view class="content" v-show="name == '人才展示'">
			<view class="content-box" v-for="(item,index) in rcList" @click="qiehuan(2,item)">
				<view class="box-top">
					<img :src="item.head_image_url" alt="" />
					<view class="">
						<view v-if="item.link_name" class="box-top-t">
							{{item.link_name}}
						</view>
						<view class="box-top-b">
							<view v-if="item.work_year" class="t">
								{{item.work_year}}
							</view>
							<view class="t">
								{{item.district.province+(item.district.city != item.district.city ? item.district.city : '')+item.district.region+item.district.street}}
							</view>
						</view>
					</view>
					<u-icon class="right" name="arrow-right" color="#999999" size="28"></u-icon>
				</view>
				<view class="title dbb">
					<view class="">
						<view class="">
							<text class="title-1">意向职位</text>
							<text class="title-2">{{item.position}}</text>
						</view>
						<view class="">
							<text class="title-1">意向行业</text>
							<text class="title-2">{{item.work_type}}</text>
						</view>
					</view>
					<view class="">
						<view class="">
							<text class="title-1">资源共享</text>
							<text class="title-2">{{item.resource_note}}</text>
						</view>
						<view class="">
							<text class="title-1">资源需求</text>
							<text class="title-2">{{item.resource_need}}</text>
						</view>
					</view>
				</view>
				<view class="title1">
					<text class="title-t">联系电话</text>
					<text
						class="title-b">{{item.linkStatus !== 2 ?maskPhoneNumber(item.link_phone) : item.link_phone}}</text>
				</view>
				<view class="lianxi" @click.stop="contact(item,2)" v-show="item.linkStatus === 0">
					联系申请
				</view>
				<view class="lianxi" v-show="item.linkStatus === 1">
					申请中
				</view>
			</view>
		</view>
		<view class="content" v-show="name == '人才需求'">
			<view class="content-box" v-for="(item,index) in xqList" @click="qiehuan(4,item)">
				<view class="box-top">
					<img :src="item.corp_image_url" alt="" />
					<view class="">
						<view class="box-top-t">
							{{item.corp_name || '--'}}
						</view>
						<view class="box-top-b">
							<view v-if="item.to_coc_org_name" class="t">
								{{item.to_coc_org_name}}
							</view>
							<view v-if="item.work_type" class="t">
								{{item.work_type}}
							</view>
							<view v-if="item.district" class="t">
								{{item.district.province+(item.district.city != item.district.city ? item.district.city : '')+item.district.region+item.district.street}}
							</view>
						</view>
					</view>
					<u-icon class="right" name="arrow-right" color="#999999" size="28"></u-icon>
				</view>
				<view class="title">
					<view class="" style="font-size: 24rpx;">
						{{item.corp_note}}
					</view>
					<view class="" style="display: flex;">
						<view class="" style="margin-right: 80rpx;">
							<text class="title-1">人才需求</text>
							<text class="title-2">{{item.work_name}}</text>
						</view>
						<view class="">
							<text class="title-1">行业要求</text>
							<text class="title-2">{{item.work_type_request}}</text>
						</view>
					</view>
				</view>
				<view class="title1">
					<text class="title-t">联系人员</text>
					<text class="title-b">{{item.link_name}}</text>
				</view>
				<view class="title1">
					<text class="title-t">联系电话</text>
					<text
						class="title-b">{{item.linkStatus !== 2 ?maskPhoneNumber(item.link_phone) : item.link_phone}}</text>
				</view>
				<view class="lianxi" @click.stop="contact(item,3)" v-show="item.linkStatus === 0">
					联系申请
				</view>
				<view class="lianxi" v-show="item.linkStatus === 1">
					申请中
				</view>
			</view>
		</view>
		<view v-show="name == '人才展示'" v-if="is_have" class="signUp" @click="qiehuan(6)">
			<img src="../../../static/img/r1.png" alt="" />
			<text>我的名片</text>
		</view>
		<view v-show="name == '人才展示'" v-if="!is_have" class="signUp" @click="qiehuan(3)">
			<img src="../../../static/img/r2.png" alt="" />
			<text>报名人才</text>
		</view>

		<view v-show="name == '人才需求'" class="signUp" @click="qiehuan(5)">
			<img src="../../../static/img/r3.png" alt="" />
			<text>我的需求</text>
		</view>
		<!-- <view v-show="name == '人才需求'" class="signUp" @click="qiehuan(5)">
			<img src="../../static/img/r4.png" alt="" />
			<text>提交需求</text>
		</view> -->
		<u-select v-model="show" :list="list1" @confirm="confirm"></u-select>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				name: '人才需求',
				list1: [{
						value: '1',
						label: '人才展示'
					},
					{
						value: '2',
						label: '人才需求'
					}
				],
				list: [{
					name: '全部'
				}, {
					name: '申请中'
				}, {
					name: '已通过'
				}, {
					name: '已拒绝'
				}],
				rcList: [],
				xqList: [],
				current: 0,
				is_have: 0,
				is_have1: 0,
			};
		},
		methods: {
			contact(e, j) {
				console.log(uni.getStorageSync('userInfo'), 999999999, e);
				let obj = {
					type: j,
					answer_personnel_id: j == 2 ? e.coc_personnel_id : null,
					answer_coc_id: j == 3 ? e.coc_id : null,
					answer_user_id: e.user_id,
					create_user_name: uni.getStorageSync('userInfo').nickName,
					create_user_id: uni.getStorageSync('user_id'),
				}
				e.linkStatus = 1
				this._get('plus.coc.Coc/saveCocLinkMessage', obj, (res) => {
					console.log(res);
					if (res.code == 1) {
						this.$refs.uToast.show({
							title: '消息已发送',
							type: 'success'
						})
					}
				})
			},
			change(e) {
				this.current = e
				if (this.name == '人才展示') {
					this.initPersonne()
				} else {
					this.initNeed()
				}
			},
			confirm(e) {
				this.name = e[0].label
			},
			qiehuan(e, j) {
				console.log(j, 111);
				if (e === 1) {
					this.show = true
				} else if (e === 2) {
					uni.navigateTo({
						url: '/main/pages/businessCard/businessCard?coc_personnel_id=' + j
							.coc_personnel_id
					});
				} else if (e === 3) {
					uni.navigateTo({
						url: '/main/pages/RegisteredTalents/RegisteredTalents'
					});
				} else if (e === 4) {
					uni.navigateTo({
						url: '/main/pages/talentIntroduction/RequirementDetails/RequirementDetails?coc_need_id=' +
							j.coc_need_id
					});
				} else if (e === 5) {
					uni.navigateTo({
						url: '/main/pages/talentIntroduction/MyNeeds/MyNeeds'
					});
				} else if (e === 6) {
					uni.navigateTo({
						url: '/main/pages/RegisteredTalents/RegisteredTalents?flg=' + true
					});
				}



			},
			initPersonne() {
				this._get('plus.coc.Coc/getCocPersonnelList', {
					linkStatus: this.current
				}, (res) => {
					this.rcList = res.data.list.data
					this.is_have = res.data.list.is_have
				})
			},
			initNeed() {
				this._get('plus.coc.Coc/getCocNeedList', {
					linkStatus: this.current
				}, (res) => {
					this.xqList = res.data.list.data
					this.is_have1 = res.data.list.is_have
				})
			},
		},
		onShow() {
			this.setGlobalColor()
			this.initPersonne()
			this.initNeed()
			// console.log(			this.phoneNumber('15571547097'));
		},
	}
</script>

<style lang="scss">
	.signUp {
		position: fixed;
		right: 24rpx;
		bottom: 128rpx;
		width: 96rpx;
		height: 104rpx;
		background: #1B94E0;
		border-radius: 16rpx 16rpx 16rpx 16rpx;
		text-align: center;

		img {
			width: 64rpx;
			height: 64rpx;
			margin-top: 6rpx;
		}

		text {
			font-size: 20rpx;
			color: #FFFFFF;
			display: block;
			margin-top: -16rpx;
			line-height: 1;
		}
	}

	.content {
		.content-box {
			position: relative;
			width: 702rpx;
			// height: 308rpx;
			background: #FFFFFF;
			border-radius: 16rpx 16rpx 16rpx 16rpx;
			margin-top: 16rpx;

			.lianxi {
				width: 144rpx;
				height: 56rpx;
				background: linear-gradient(270deg, #1B94E0 0%, #40B4FD 100%);
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				text-align: center;
				line-height: 54rpx;
				color: #FFFFFF;
				position: absolute;
				bottom: 24rpx;
				right: 24rpx;
			}

			.title-t {
				font-size: 28rpx;
				color: #666;
				margin-right: 16rpx;
			}

			.title {
				.title-1 {
					color: #666666;
					font-size: 28rpx;
					margin-right: 16rpx;
				}

				.title-2 {
					font-size: 28rpx;
				}

				font-size: 24rpx;
				margin: 10rpx 0 14rpx;
				border-bottom: 2rpx solid #F5F7FA;
			}

			.box-top {

				position: relative;

				.right {
					position: absolute;
					top: 40rpx;
					right: 10rpx;
				}

				.box-top-t {
					font-size: 32rpx;
				}

				.box-top-b {
					display: flex;

					.t {
						font-size: 20rpx;
						padding: 4rpx 10rpx;
						margin-right: 16rpx;
						background: #F5F7FA;
					}

					.active {
						background: #E0FFE9;
						border-radius: 4rpx;
						color: #068129;
					}
				}

				display: flex;

				img {
					margin-right: 16rpx;
					width: 96rpx;
					height: 96rpx;
					border-radius: 8rpx 8rpx 8rpx 8rpx;
				}
			}

			padding: 24rpx;
		}


	}

	/deep/ .u-tabs {
		// flex: 1;
		width: auto;
	}

	.top {
		position: fixed;
		z-index: 1000;
		top: 0;
		display: flex;
		background-color: #F4F7FB;

		.top-r {
			width: 550rpx;

		}

		.top-l {
			padding: 0 20rpx;
			height: 52rpx;
			line-height: 50rpx;
			text-align: center;
			background: #FFFFFF;
			border-radius: 84rpx 84rpx 84rpx 84rpx;
			position: relative;

			.text {
				font-size: 24rpx;
				margin-right: 6rpx;
				color: #1B94E0;
				width: 140rpx;
				line-height: 50rpx;
			}

			.icon {
				position: absolute;
				right: 10rpx;
				top: 16rpx;
			}
		}
	}
</style>