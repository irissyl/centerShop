<template>
	<view style="padding: 80rpx 24rpx 24rpx;">
		<view class="top dbb">
			<view class="top-l " @click="qiehuan(1)">
				<view class="text u-line-1">{{merchantObj.name}}</view>
				<u-icon class="icon" name="arrow-down-fill" color="#1B94E0" size="18"></u-icon>
			</view>
			<view style="opacity: 0;" class="top-r">
				<u-tabs font-size="28" bg-color="#F4F7FB" :list="list" :is-scroll="false" :current="current"
					@change="change"></u-tabs>
			</view>
		</view>
		<view class="content">
			<view class="content-box" v-for="(item,index) in gsList" @click="qiehuan(2,item)">
				<view class="box-top">
					<img :src="item.image_url" alt="" />
					<view class="">
						<view class="box-top-t u-line-1" style="width: 500rpx;">
							{{item.name}}
						</view>
						<view class="box-top-b">
							<view class="t active">
								{{item.belong_to}}
							</view>
							<!-- <view class="t">
								一年零三月
							</view> -->
						</view>
					</view>
					<u-icon class="right" name="arrow-right" color="#999999" size="28"></u-icon>
				</view>
				<view class="title u-line-2" style="height: 80rpx;">
					{{item.business}}
				</view>
				<view class="title1">
					<text class="title-t">联系人员</text>
					<text class="title-b">{{item.linkman}}</text>
				</view>
				<view class="title1">
					<text class="title-t">联系电话</text>
					<text class="title-b">{{item.linkStatus !== 2 ?maskPhoneNumber(item.phone) : item.phone}}</text>
				</view>
				<!-- <view class="lianxi" @click.stop="contact(item)" v-show="item.linkStatus === 0">
					联系申请
				</view>
				<view class="lianxi" v-show="item.linkStatus === 1">
					申请中
				</view> -->
				<view class="lianxi" @click.stop="phoneHandle(item)">
					电话联系
				</view>
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				merchantObj: {
					name: '东莞河南商会',
					coc_org_id: 1
				},
				list: [{
					name: '全部'
				}, {
					name: '申请中'
				}, {
					name: '已通过'
				}, {
					name: '已拒绝'
				}],
				gsList: [],
				current: 0,
				status: 1
			};
		},
		methods: {
			phoneHandle(e){
				console.log(e);
				if (uni.getStorageSync("user_id") == e.user_id) {
					//如果是自己  不能和自己联系
					this.tip("不能和您自己联系哦", 2000);
					return;
				}
				if (!e.phone) {
					this.tip("未获取到联系方式，请稍后再试", 2000);
					return;
				}
				uni.makePhoneCall({
					phoneNumber: e.phone
				})
			},
			contact(e) {
				console.log(uni.getStorageSync('userInfo'), 1222);
				let obj = {
					type: '1',
					answer_personnel_id: '',
					answer_coc_id: '' + e.coc_id,
					answer_user_id: '' + e.user_id,
					create_user_name: uni.getStorageSync('userInfo').nickName,
					create_user_id: '' + uni.getStorageSync('user_id'),
				}
				console.log('请求参数', obj);
				this._post('plus.coc.Coc/saveCocLinkMessage', obj, (res) => {
					console.log(res);
					if (res.code == 1) {
						this.$refs.uToast.show({
							title: '消息已发送',
							type: 'success'
						})
						e.linkStatus = 1
					} else {
						this.$refs.uToast.show({
							title: '提交失败，请稍后再试',
							type: 'error'
						})
					}
				})
			},
			change(e) {
				return
				this.current = e
				this._get('plus.coc.Coc/getCocListByOrgId', {
					coc_org_id: this.merchantObj.coc_org_id,
					linkStatus: this.current
				}, (res) => {
					this.gsList = res.data.list
				})
			},
			qiehuan(e, j) {
				console.log('j===>',j);
				if (e == 1) {
					uni.navigateTo({
						url: '/main/pages/CommerceChoice/CommerceChoice'
					});
				} else {
					uni.navigateTo({
						url: '/main/pages/enterprisesAll/CompanyDetails/CompanyDetails?coc_id=' + j.coc_id +
							'&user_id=' + j.user_id
					});
				}

			}
		},
		onShow() {
			this.setGlobalColor()
			this._get('plus.coc.Coc/getCocListByOrgId', {
				coc_org_id: this.merchantObj.coc_org_id,
				linkStatus: this.current
			}, (res) => {
				this.gsList = res.data.list
			})
		},
	}
</script>

<style lang="scss">
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

				font-size: 24rpx;
				margin: 10rpx 0 24rpx;
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
		left: 0;
		display: flex;
		background-color: #F4F7FB;
		padding-left: 24rpx;
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
			display: flex;
			align-items: center;
			.text {
				font-size: 24rpx;
				margin-right: 8rpx;
				color: #1B94E0;
				width: 140rpx;
				line-height: 50rpx;
			}

			.icon {
				// position: absolute;
				// right: 10rpx;
				// top: 16rpx;
			}
		}
	}
</style>