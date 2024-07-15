<template>
	<view v-if="!loadding">
		<button class="btn"
		style="float: right; width: 200rpx;height: 70rpx;line-height: 70rpx;margin-top: 20rpx;margin-right: 20rpx;" 
		:style="[active]"
		 @click="gotoPage('/plus2/pages/identity/identity?activity_id='+activity_id)">新增人员</button>
		 
		 <view style="clear: both;">
		 	
		 </view>

		<view class="address-list bg-white" style="margin-top: 20rpx;">
			<view class="address p30 d-s-c border-b-e" v-for="(item,index) in listData" :key="index">
	
				<view class="info flex-1 ml20" >
					<view class="user f34">
						<text>{{item.identity.name}} </text>
						<text class="ml20">{{item.identity.phone}}</text> 
					</view>
					<view class="pt10 f28 gray6">
						{{item.identity.idencard}}
					</view>
				</view>

				<view class="icon-box plus d-c-c ml30" @click="delAddress(item.activity_identity_id)">
					<span class="icon iconfont icon-lajitong"></span>
				</view>
			</view>
		</view>
		<view class="margin-bottom" style="height: 150rpx;">

		</view>
		
		<template v-if="listData.length <= 0">
			<view class="none-data-box">
				<image src="http://imgh5.y01.cn/20210606225550dd5f35541.png" mode="widthFix"></image>
				<text>未获取到数据</text>
	
			</view>
		</template>


		<!--添加地址-->
		<view class="foot-btns">
			<button class="btn" :style="[active]" @click="openPopup" >立即报名</button>
		</view>
		
		<Option :isPopup="isPopup" :listData="listData"  :activity="activity" @close="closePopup"></Option>
	</view>
</template>

<script>
	import Option from './popup/option.vue';
	export default {
		components: {
			Option
		},
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*数据*/
				listData: [],
				options: {},
				address: {},
				activity_id:"",
				isPopup: false,
				activity:{},
			

			}
		},
		onLoad: function(options) {
			this.options = options;
			console.log(options)
			this.activity_id = options.activity_id
		
		},
		onShow: function() {
			this.setGlobalColor()
			uni.showLoading({
				title: this.$nw("加载中")
			});
			this.isPopup = false;
			/*获取地址列表*/
			this.getData();
		},
		computed: {
			active() {
				return Object.assign(this.setBackgroundColor(), this.setColor())
			},
		},
		methods: {
			/*关闭弹窗*/
			closePopup() {
				let self = this;
				self.isPopup = false;
			},
			openPopup(e) {
				let self = this;
				if(this.listData.length <= 0){
					uni.showToast({
						title:"至少选择一位人员",
						icon:"none"
					})
					return
				}else{
					//检测是否超过活动人数
					if(this.listData.length > self.activity.iden_num){
						uni.showToast({
							title:"人员已超过该活动的最大人数限制"+self.activity.iden_num+"人，请重新选择人员",
							icon:"none"
						})
						return;
					}
					this.isPopup = true;
				}
				
			},
			/*获取数据*/
			getData() {
				let self = this;
				let dataType = self.dataType;
				self._get('plus.activity.Activity/getPublicActivityIdentity', {
					activity_id: self.activity_id,
				}, function(res) {
					console.log(res)
					self.listData = res.data.list;
					self.activity = res.data.activity
					self.loadding = false;
					uni.hideLoading();
				});
			},
			chooseAddress() {
				let self = this

			},

			/*跳转页面*/
			gotoPage(path) {
				uni.navigateTo({
					url: path
				});
			},

			/*编辑地址*/
			editAddress(e) {
				uni.navigateTo({
					url: '/plus2/pages/identity/edit/edit?identity_id=' + e,
				});
			},

			/*删除地址*/
			delAddress(e) {
				let self = this;
				wx.showModal({
					title: self.$nw("提示"),
					content: "您确定要删除该人员吗？",
					success: function(o) {
						o.confirm && self._get('plus.activity.Activity/delActivityIdentity', {
							activity_identity_id: e
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
	
	.foot-btns1 {
		padding: 0;
		box-shadow: 0 0rpx 0rpx 0 rgb(0, 0, 0);
	}
	.foot-btns1 button {
		width: 640rpx;
		border-radius: 37px;
		margin: auto;
		/* border-radius: 0; */
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