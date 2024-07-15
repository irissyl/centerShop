<template>
	<view>
		<view class="address-list bg-white">

			<view>
				<view class="address p30 d-s-c border-b-e pr" v-for="(item,index) in storeList" :key="index">

					<view class="info flex-1" style="position: relative;">
						<view class="user f34 store_name">
							<text>{{item.store_name}}</text>
						</view>
						<view class="pt10 user f30 gray6" style="z-index:100">
							{{item.label}}
						</view>
						<view class="pt10 user f30 gray6" style="z-index:100">
							{{item.linkman}} <text style="margin-left: 10rpx;">{{item.phone}} </text>
						</view>
						<view class="pt10 f24 gray6" style="display: inline-block;white-space:normal; width:80%">
							<text> {{item.region.province&&item.region.province!="其他"?item.region.province:""}}{{item.region.city&&item.region.city!="其他"?item.region.city:""}}{{item.region.region&&item.region.region!="其他"?item.region.region:""}}{{item.region.street&&item.region.street!="其他"?item.region.street:""}}{{item.address&&item.address!="其他"?item.address:""}}
							</text>
							<text style="color:#007AFF;font-size:13px ;padding-left: 10px;"
								v-if="item.latitude && item.longitude" @click="showAddress(item.latitude,item.longitude,
								item.address,item.store_name)">{{$nw("导航")}}</text>

							<text style="color:#007AFF;font-size:13px" class="ml30"
								v-if="item.store_wxappid!=''||item.store_qrcode!=''" @click="gotoStore(item)">{{$nw("二维码")}}</text>


						</view>
						<view style="float: right;">
							<text style="color:#007AFF;font-size:13px" class="ml30" @click="jumpStore(item)">查看店铺</text>
							<view v-if="item.audit_status == 0"
								style="text-align: right;font-size: 26rpx;color: #9f9f9f;">
								{{$nw("审核中")}}
							</view>
							<view v-if="item.audit_status == 2"
								style="text-align: right;font-size: 26rpx;color: #9f9f9f;">
								{{$nw("未通过")}}
							</view>
							<view v-if="item.status.value == 0"
								style="text-align: right;font-size: 26rpx;color: #9f9f9f;">
								{{$nw("平台未开启")}}
							</view>
						</view>

						<view style="clear: both;"></view>


					</view>
				</view>
			</view>

			<!-- 无数据提供的页面 -->
			<view v-if="!isLoading && !storeList.length">
				<view class="yoshop-notcont" style="text-align: center;height: 150rpx;line-height: 150rpx;">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">{{$nw("未在您的团队里获取到门店")}}</text>
				</view>
			</view>
		</view>
		<uniPopup :show="qrcode_show" type="middle" @hidePopup="hidePopupFunc">
			<view class="d-c-c d-c create-img">
				<image :src="qrcode_url" mode="widthFix" :show-menu-by-longpress="true"></image>

				<view class="mt20 f34 red" type="default">{{$nw("长按识别或保存图片")}}</view>

			</view>
		</uniPopup>
	</view>
</template>


<script>
	import uniPopup from '@/components/uni-popup.vue';
	export default {
		components: {
			uniPopup,
		},
		data() {
			return {
				/*数据*/
				listData: [],
				isLoading: true, // 是否正在加载中
				storeList: [], // 门店列表,
				longitude: '',
				latitude: '',
				selectedId: -1,
				is_select: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
				keyword: "", //关键字
				qrcode_show: false,
				qrcode_url: '',
				tab_type: 1,
				no_distance: 0
			}
		},
		onLoad(options) {
			this.setGlobalColor()


			uni.showLoading({
				title:this.$nw('加载中')
			})
		},
		onShow() {
			/*获取地址列表*/
			this.page = 1;
			this.storeList = [];
			this.getLocation();
		},

		onReachBottom() {
			var self = this;
			self.page++;
			uni.showLoading({
				title: this.$nw('加载中')
			})
			setTimeout(function() {
				self.getData(self.page);
			}, 500)

		},
		methods: {
			tabFunc(e) {
				this.tab_type = e;
				this.no_distance = e;
				this.page = 1;
				this.storeList = [];
				this.getData(this.page);
			},
			active() {
				return (tab_type, value) => {
					if (tab_type === value) {
						return Object.assign(this.setColor(true), {
							'border-bottom': '2px solid ' + this.getMainColor()
						})
					}
				}
			},
			//关闭
			hidePopupFunc() {
				this.qrcode_show = false;
				this.qrcode_url = '';
			},
			gotoStore(store) {
				let self = this;
				self.qrcode_url = store.store_qrcode;

				if (store.store_wxappid != undefined && store.store_wxappid != '') {
					// 跳转其他小程序
					// #ifdef MP
					uni.navigateToMiniProgram({

						appId: store.store_wxappid,
						path: store.store_wxapp_url != undefined ? store.store_wxapp_url : '',

					})
					// #endif
					// #ifndef MP
					self.qrcode_show = true;
					// #endif
				} else {
					self.qrcode_show = true;
				}


			},
			jumpStore(e) { //跳转可修改的店铺界面
				uni.navigateTo({
					url: "/pages/store/edit_settled?store_id=" + e.store_id
				})
			},
			search() {
				console.log(this.keyword)
				uni.showLoading({
					title: this.$nw('加载中')
				})
				this.storeList = [];
				this.page = 1;
				this.getData(this.page);
			},
			/**
			 * 授权启用定位权限
			 */
			onAuthorize() {
				let self = this;
				uni.openSetting({
					success(res) {
						if (res.authSetting["scope.userLocation"]) {
							self.isAuthor = true;
							setTimeout(() => {
								// 获取用户坐标
								self.getLocation((res) => {

								});
							}, 1000);
						}
					}
				})
			},
			/**
			 * 获取用户坐标
			 */
			getLocation(callback) {
				let self = this;
				// #ifdef MP-WEIXIN
				uni.getLocation({
					type: 'wgs84',
					success(res) {
						self.longitude = res.longitude;
						self.latitude = res.latitude;
						self.getData(self.page);
					},
					fail() {
						uni.showToast({
							icon: 'none',
							title: self.$nw("获取定位失败，请点击右上角按钮打开定位权限"),
							duration: 2000
						});
						self.getData(self.page);
					},
				})
				// #endif
				// #ifndef MP-WEIXIN
				self.getData(self.page);
				// #endif

			},

			/*获取数据*/
			getData(page) {
				let self = this;
				self.isLoading = true;
				self._post('store.store/myLists', {
					no_distance: self.no_distance,
					longitude: self.longitude,
					latitude: self.latitude,
					page: page,
					list_rows: self.list_rows,
					keyword: self.keyword
				}, function(res) {
					self.isLoading = false;
					console.log(res.data.list.data)
					self.storeList = self.storeList.concat(res.data.list.data);
					self.storeList = self.getUnique(self.storeList, "store_id");
				});
			},


			takePhone(e) {
				uni.makePhoneCall({
					phoneNumber: e
				});
			},
			showAddress(lat, lng, addr, store_name) {
				// uni.navigateTo({
				// 	url: '/pages/map/index/index?lat=' + lat + '&lng=' + lng
				// });

				uni.openLocation({
					latitude: parseFloat(lat),
					longitude: parseFloat(lng),
					name: store_name,
					address: addr
				})
			}


		}
	}
</script>

<style>
	.create-img {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.create-img image {
		width: 100%;
	}

	.address-list {
		/* padding-bottom: 90rpx; */
	}

	.foot-btns {
		padding: 0;
	}

	.foot-btns .btn-red {
		width: 100%;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 0;
	}

	.select_store {
		display: inline-block;
		padding: 5rpx 14rpx;
		word-spacing: 2rpx;
		background-color: rgb(226, 35, 26);
		color: white;
		border-radius: 10rpx;
		position: absolute;
		right: 20rpx;
		bottom: 20rpx;
	}

	.store_name {
		font-weight: bolder;
	}
</style>