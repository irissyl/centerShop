<template>
	<view style="height: 100vh;" :style="'background:'+getMainColor()+';'">
		<view v-if="!loadding">
			<view class="address-list bg-white">
				<view class="address p30 d-s-c" :style="'background:'+getSecondBackgroundColor()+';'"
					v-for="(item,index) in listData" :key="index">
					<view class="radio">
						<radio :value="item.address_id+''" :checked="default_id==item.address_id+''"
							@click="radioChange(item.address_id)" />
					</view>
					<view class="info flex-1 ml20" @click="selectAddress(item.address_id)">
						<view class="user f34" :style="'color:'+getTextColorWhite()+';'">
							<text>{{item.name}}</text>
							<text class="ml20">{{item.phone}}</text>
							<text class="ml20 orange f24"
								v-if="default_id==item.address_id">{{$nw("默认")}}</text>
						</view>
						<!-- <view class="pt10 f28 gray6">
							{{item.region.province}} {{item.region.city}} {{item.region.region}} {{item.detail}}
						</view> -->
						<view class="pt10 f28 gray6">
							{{item.district.province}} {{item.district.city}} {{item.district.region}}
							{{item.district.street}} {{item.detail}}
						</view>
					</view>
					<view class="icon-box plus d-c-c ml30" @click="editAddress(item.address_id)">
						<span class="icon iconfont icon-edit" :style="'color:'+getTextColorWhite()+';'"></span>
					</view>
					<view class="icon-box plus d-c-c ml30" @click="delAddress(item.address_id)">
						<span class="icon iconfont icon-lajitong" :style="'color:'+getTextColorWhite()+';'"></span>
					</view>
				</view>
				
			
			</view>
			<view style="padding-top: 200rpx;" :style="'background:'+getMainColor()+';'" v-if="listData.length <= 0">
				<image style="text-align: center;margin: auto; width: 280rpx;height: 280rpx;display: block;" :src="noAddressUrl"></image>
			</view>
			<view class="margin-bottom" style="height: 300rpx;">

			</view>

			<!-- #ifdef MP-WEIXIN -->
			<!--一键添加微信收货地址-->
			<!-- <view class="foot-btn">
				<button  class="btn-theme" :style="[active]" @click="chooseAddress()">{{$nw("一键添加微信收货地址")}}</button>
			</view> -->
			<!-- #endif -->

			<!--添加地址-->
			<view class="foot-btns" style="background: none;">
				<button
					:style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}"
					@click="gotoPage('/user/pages/address/add/add')">{{$nw("新增收货地址")}}</button>
			</view>
		</view>
		
		<service :itemData="t_service"></service>
	
	</view>
</template>

<script>
	import service from '@/components/diy/service/service';
	
	export default {
		components:{
			service,
		
		},
		data() {
			return {
					t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*数据*/
				listData: [],
				/*默认地址id*/
				default_id: '0',
				options: {},
				address: {},
				noAddressUrl:this.websiteUrl+"file/images/noAddressUrl.png",
			}
		},
		mounted() {
			this.setGlobalColor()
		},

		onLoad: function(options) {
			this.options = options;
		},
		onShow: function() {
			uni.showLoading({
				title: this.$nw("加载中")
			});
			/*获取地址列表*/
			this.getData();
			uni.setNavigationBarTitle({
				title: this.$nw("设置地址")
			});
		},
		computed: {
			active() {
				return Object.assign(this.setBackgroundColor(), this.setColor())
			},
			getbutton() {
				return this.setButton().button
			}
		},

		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				let dataType = self.dataType;
				self._get('user.address/lists', {}, function(res) {
					self.listData = res.data.list;
					self.default_id = res.data.default_id + '';
					self.loadding = false;
					uni.hideLoading();
				});
			},
			chooseAddress() {
				let that = this
				// #ifdef  MP-WEIXIN
				uni.getSetting({
					success(res) {
						if (res.authSetting['scope.address']) {
							uni.chooseAddress({
								success(res) {
									var formdata = that.address;
									formdata.name = res.userName;
									formdata.phone = res.telNumber;
									formdata.detail = res.detailInfo;
									formdata.provinceName = res.provinceName;
									formdata.cityName = res.cityName;
									formdata.countyName = res.countyName;
									that._post('user.address/addByWX', formdata, function(res) {
										uni.showToast({
											title: res.msg,
											duration: 2000
										});
										that.getData();

									});


								},
								fail(err) {
									self.getData();
								}
							})
						} else if (!res.authSetting['scope.address']) {
							// 如果要获取的权限尚未授权,则此时触发授权
							uni.showModal({
								//弹出提示框
								title: that.$nw("是否打开设置页"),
								content: that.$nw("需要在设置中获取xx信息和xx权限"),
								success(res) {
									if (res.confirm) {
										uni.openSetting({
											// 确认后打开设置页面
											success(res) {
												console.log(res.authSetting)
											},
										})
									} else if (res.cancel) {
										console.log('‘用户点击取消‘');
									}
								}
							});
						}
					}
				})
				// #endif
			},

			/*跳转页面*/
			gotoPage(path) {
				uni.navigateTo({
					url: path
				});
			},

			/*点击单选*/
			radioChange(e) {
				let self = this;
				self.default_id = e;
				self._post('user.address/setDefault', {
					address_id: e,
				}, function(res) {
					if (self.options.source === 'order') {
						uni.setStorageSync('address_id', e)
						uni.navigateBack()
					}
				});
				return false;

			},
			selectAddress(e) {
				let self = this;
				if (self.options.source === 'order') {
					uni.setStorageSync('address_id', e)
					uni.navigateBack()
				}
			},

			/*编辑地址*/
			editAddress(e) {
				uni.navigateTo({
					url: '/user/pages/address/edit/edit?address_id=' + e,
				});
			},

			/*删除地址*/
			delAddress(e) {
				let self = this;
				wx.showModal({
					title: self.$nw("提示"),
					content: self.$nw("您确定要移除当前收货地址吗？"),
					success: function(o) {
						o.confirm && self._get('user.address/delete', {
							address_id: e
						}, function(result) {
							if (result.code == 1) {
								uni.showToast({
									title: self.$nw("删除成功"),
									duration: 2000
								});
								self.getData();
							}

						});
					}
				});

			}
		}
	}
</script>

<style>
	.address-list {
		/* padding-bottom: 90rpx; */
	}

	.foot-btns {
		padding: 0;
		box-shadow: 0 0rpx 0rpx 0 rgb(0, 0, 0);
	}

	.foot-btn button {
		width: 640rpx;
		border-radius: 37px;
		margin: auto;
	}

	.foot-btn {
		position: fixed;
		bottom: 100rpx;
		left: 0;
		right: 0;
	}

	.foot-btns button {
		width: 640rpx;
		border-radius: 37px;
		margin: auto;
		/* border-radius: 0; */
	}
</style>