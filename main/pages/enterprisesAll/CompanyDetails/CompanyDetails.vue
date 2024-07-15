<template>
	<view>
		<u-swiper :list="list3" height="424" :border-radius="0"></u-swiper>
		<view class="content">
			<view class="top">
				<img :src="obj.image_url" alt="" />
				<view class="">
					{{obj.name}}
				</view>
			</view>
			<view class="xingxi">
				<!-- <text>民营</text> -->
				<!-- <text>A轮</text> -->
				<!-- <text>100-299人</text> -->
				<text>{{obj.coc_work_type}}</text>
			</view>
			<view class="shanghui">
				<view class="shanghui-t">
					<view class="shanghui-l">

					</view>
					<view class="shanghui-r">
						所在商会
					</view>
				</view>
				<view class="shanghui-t1">
					<view class="shanghui-t1-box" v-for="(item,index) in shList">
						<img :src="item.image_url" alt="" />
						<view class="">
							{{item.name}}
						</view>
					</view>
				</view>
			</view>
			<view class="shanghui">
				<view class="shanghui-t">
					<view class="shanghui-l">

					</view>
					<view class="shanghui-r">
						公司简介
					</view>
				</view>
				<view class="" style="font-size: 28rpx;">
					{{obj.intro}}
				</view>
				<video v-if="obj.coc_video" style="margin: 0 auto;display: block;border-radius: 8rpx;" class="vid"
					:src="obj.coc_video"></video>
			</view>
			<view class="shanghui">
				<view class="shanghui-t">
					<view class="shanghui-l">

					</view>
					<view class="shanghui-r">
						公司产品
					</view>
				</view>
				<view class="ProductList">
					<view class="ProductList-box" v-for="(item,index) in list1" @click="gotoList1(item.product_id)">
						<img :src="item.product_main_img" alt="" />
						<view class="">
							<view class="u-line-1" style="font-size: 28rpx;width: 500rpx;">
								{{item.product_name}}
							</view>
							<view class="" style="font-size: 20rpx;color: #666;">
								产品介绍：{{item.product_note}}
							</view>
						</view>
						<u-icon class="icon" name="arrow-right" color="#666666" size="30"></u-icon>
					</view>
					<view class="dcc" style="margin-top: 24rpx;" @click="gotoList">
						<text style="font-size: 24rpx;color: #666;margin-right: 10rpx;">查看全部</text>
						<u-icon class="icon" name="arrow-right" color="#666666" size="22"
							style="margin-top: 4rpx;"></u-icon>
					</view>
				</view>
			</view>
			<view class="shanghui">
				<view class="shanghui-t">
					<view class="shanghui-l">

					</view>
					<view class="shanghui-r">
						合作伙伴
					</view>
				</view>
				<view class="logoq">
					<img style="height: 316rpx;"
						src="https://shanghuitest.client.xcx008.com/file/uploads/20240420/bedb1661a960bcfa50efc44389f035f5.png"
						alt="" />
				</view>
			</view>
			<view class="shanghui">
				<view class="shanghui-t">
					<view class="shanghui-l">

					</view>
					<view class="shanghui-r">
						联系方式
					</view>
				</view>
				<view class="contact">
					<view class="">
						<text class="contact-t">联系人员</text>
						<text class="contact-t">{{obj.linkman}}</text>
					</view>
					<view class="">
						<text class="contact-t">联系方式</text>
						<text class="contact-t">{{obj.linkStatus !== 2 ?maskPhoneNumber(obj.phone) : obj.phone}}</text>
					</view>
					<view class="">
						<text class="contact-t">联系地址</text>
						<text class="contact-t">{{obj.link_address}}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="hezuo">
			<!-- <view class="hezuo-1">
				<button class="share" open-type="share">
					<u-icon name="zhuanfa" color="#999" size="40"></u-icon>
					<text>分享</text>
				</button>
			</view> -->
			<!-- <view class="hezuo-1">
				<u-icon name="star" color="#999" size="40"></u-icon>
				<text>收藏</text>
			</view> -->
			<!-- <view v-if="obj.linkStatus == 1" class="botton">
				申请中
			</view>
			<view v-else class="botton" @click="contact(obj)">
				合作咨询
			</view> -->
			<view class="botton" @click="phoneHandle(obj)">
				电话联系
			</view>
		</view>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list: [],
				obj: {},
				list1: [],
				list3: [],
				shList: [],
				user_id: ''
			};
		},
		methods: {
			phoneHandle(e) {
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
				let obj = {
					type: '1',
					answer_personnel_id: '',
					answer_coc_id: '' + e.coc_id,
					answer_user_id: this.user_id,
					create_user_name: uni.getStorageSync('userInfo').nickName,
					create_user_id: '' + uni.getStorageSync('user_id'),
				}
				this._post('plus.coc.Coc/saveCocLinkMessage', obj, (res) => {
					console.log(res);
					if (res.code == 1) {
						this.$refs.uToast.show({
							title: '消息已发送',
							type: 'success'
						})
						this.obj.linkStatus = 1
					}
				})
			},
			gotoList(e) {
				uni.navigateTo({
					url: '/main/pages/productsAll/productsAll?coc_id=' + this.obj.coc_id
				})


			},
			gotoList1(e) {
				let url = 'main/pages/product/detail/detail?product_id=' + e
				this.gotoPage(url);
			}
		},
		onLoad(e) {
			console.log('e===>', e);
			this.user_id = e.user_id || ''
			this._get('plus.coc.Coc/getCocOrgByCocId', {
				coc_id: e.coc_id
			}, (res) => {
				this.shList = res.data.list
				console.log(res.data.list, 999222);
			})
			this._get('plus.coc.Coc/getCocById', {
				coc_id: e.coc_id
			}, (res) => {
				this.obj = res.data.list
				console.log(this.obj, 123333);
				this.list3 = this.obj.coc_images.split(',').map(e => {
					return {
						image: e
					}
				})
				console.log(this.list3, 12133333);
			})
			this._get('plus.coc.Coc/getAllProduct', {
				coc_id: e.coc_id
			}, (res) => {
				console.log(res);
				this.list = res.data.list
				if (this.list.length >= 3) {
					for (let i = 0; i < 3; i++) {
						let item = res.data.list[i]
						this.list1.push(item)
					}
				} else {
					this.list1 = this.list
				}


			})

		},
		onShow() {
			this.setGlobalColor({
				bgc: '#ffffff'
			})
			// plus.coc.Coc/getCocById

		},
	}
</script>

<style lang="scss">
	.share {
		padding: 0;
		border: none;
		background-color: #fff;
		line-height: 1.8;
	}

	.hezuo {
		padding-bottom: calc(0rpx + env(safe-area-inset-bottom) / 2);
		.botton {
			width: 702rpx;
			height: 80rpx;
			background: #1B94E0;
			border-radius: 8rpx 8rpx 8rpx 8rpx;
			text-align: center;
			line-height: 74rpx;
			font-weight: 800;
			letter-spacing: 4rpx;
			color: #fff;
		}

		display: flex;
		padding: 16rpx 24rpx;

		.hezuo-1 {
			text-align: center;
			margin-right: 40rpx;

			text {
				display: block;
				font-size: 20rpx;
				color: #999;
				margin-top: -10rpx;
			}
		}

		width: 750rpx;
		// height: 100rpx;
		background: #FFFFFF;
		box-shadow: 0rpx -4rpx 8rpx 0rpx rgba(0, 0, 0, 0.06);
		position: fixed;
		bottom: 0;
		left: 0;
		z-index: 10;
	}

	.content {
		margin-top: -24rpx;
		width: 750rpx;
		background: #FFFFFF;
		border-radius: 24rpx 24rpx 0rpx 0rpx;
		position: relative;
		z-index: 1;
		padding: 24rpx;
		padding-bottom: calc(160rpx + env(safe-area-inset-bottom) / 2);
		.shanghui {
			.contact-t {
				font-size: 28rpx;
				line-height: 2;
				margin-right: 24rpx;
			}

			.logoq {
				img {
					width: 100%;
				}
			}

			.ProductList {
				.ProductList-box {
					margin-top: 16rpx;
					position: relative;

					.icon {
						position: absolute;
						top: 54rpx;
						right: 10rpx;
					}

					display: flex;

					img {
						width: 128rpx;
						height: 128rpx;
						border-radius: 8rpx 8rpx 8rpx 8rpx;
						margin-right: 16rpx;
					}
				}
			}

			.shanghui-t1 {
				display: flex;

				.shanghui-t1-box {
					width: 170rpx;
					text-align: center;
					margin-right: 48rpx;

					img {
						width: 96rpx;
						height: 96rpx;
						border-radius: 16rpx;
					}

					view {
						font-size: 24rpx;
					}
				}
			}

			margin-top: 28rpx;

			.shanghui-t {
				display: flex;
				align-items: center;
			}

			.shanghui-l {
				width: 8rpx;
				height: 32rpx;
				background: #1B94E0;
				border-radius: 26rpx 26rpx 26rpx 26rpx;
				margin-right: 16rpx;
			}

			.shanghui-r {
				font-size: 32rpx;
				font-weight: 800;
			}
		}

		.xingxi {
			margin-top: 12rpx;

			text {
				font-size: 24rpx;
				color: #666666;
				margin-right: 24rpx;
			}
		}

		.top {
			align-items: center;
			display: flex;

			img {
				width: 64rpx;
				height: 64rpx;
				border-radius: 8rpx 8rpx 8rpx 8rpx;
				margin-right: 16rpx;
			}

			view {
				font-size: 40rpx;
				font-weight: 800;
			}
		}
	}

	/deep/ .u-swiper-indicator {
		bottom: 40rpx !important;
	}

	page {
		background-color: #fff;
	}
</style>