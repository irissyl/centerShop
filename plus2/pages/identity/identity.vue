<template>
	<view v-if="!loadding">
		<view class="top-tabbar">
			
			<view :class="state_active == 'camper' ? 'tab-item active' : 'tab-item'" 
			@click="stateFunc('camper')">{{$nw("参与人（用于活动报名补充的参与人员）")}}</view>
			<!-- <view :class="state_active == 'guardian' ? 'tab-item active' : 'tab-item'" @click="stateFunc('guardian')">
				监护人</view> -->
		</view>

		<view class="address-list bg-white">
			<view class="address p30 d-s-c border-b-e" v-for="(item,index) in listData" :key="index">
				<view class="radio" v-if="state_active == 'guardian'">
					<radio :value="item.identity_id+''" :checked="default_id==item.identity_id+''"
						@click="radioChange(item.identity_id)" />
				</view>
				<view class="info flex-1 ml20" @click="selectAddress(item)">
					<view class="user f34">
						<text>{{item.name}} </text>
						<text class="ml20">{{item.phone}} <text class="f26" style="color: #959595;"
								v-if="state_active == 'guardian'">({{item.type.text}})</text></text> <text
							class="ml20 orange f24"
							v-if="default_id==item.identity_id">{{$nw("默认")}}</text>
					</view>
					<view class="pt10 f28 gray6">
						{{item.idencard}}
					</view>
				</view>
				<view  v-if="state_active != 'guardian'" class="icon-box plus d-c-c ml30" @click="selectAddress(item)">
					<span class="icon iconfont icon-jia"></span>
				</view>
				<view class="icon-box plus d-c-c ml30" @click="editAddress(item.identity_id)">
					<span class="icon iconfont icon-edit"></span>
				</view>
				<view class="icon-box plus d-c-c ml30" @click="delAddress(item.identity_id)">
					<span class="icon iconfont icon-lajitong"></span>
				</view>
			</view>
		</view>
		<view class="margin-bottom" style="height: 150rpx;">

		</view>
		
		<template v-if="listData.length <= 0">
			<view class="none-data-box">
				<image src="http://imgh5.y01.cn/20210606225550dd5f35541.png" mode="widthFix"></image>
				<text>{{$nw("未获取到数据")}}</text>
	
			</view>
		</template>


		<!--添加地址-->
		<view class="foot-btns">
			<button class="btn" :style="[active]" @click="gotoPage('/plus2/pages/identity/add/add')">新增身份</button>
		</view>
	</view>
</template>

<script>
	export default {
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
				/*默认地址id*/
				default_id: '0',
				options: {},
				address: {},
				/*状态选中*/
				state_active: 'camper',
				activity_id:"",
				activity_record_id:""

			}
		},
		onLoad: function(options) {
			this.options = options;
			this.activity_id = options.activity_id
			this.activity_record_id = options.activity_record_id
		},
		onShow: function() {
			this.setGlobalColor()
			uni.showLoading({
				title: this.$nw("加载中")
			});
			/*获取地址列表*/
			this.getData();
		},
		computed: {
			active() {
				return Object.assign(this.setBackgroundColor(), this.setColor())
			},
		},
		methods: {
			/*状态切换*/
			stateFunc(e) {
				let self = this;
				if (self.state_active != e) {
					self.listData = [];
					self.state_active = e;
					console.log(self.state_active)
					self.getData();
				}


			},
			/*获取数据*/
			getData() {
				let self = this;
				let dataType = self.dataType;
				self._get('plus.identity.Identity/getIdentity', {
					code: self.state_active,
				}, function(res) {
					console.log(res)
					self.listData = res.data.list;
					self.default_id = res.data.default_id + '';
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

			/*点击单选 设置默认值*/
			radioChange(e) {
				let self = this;
				self.default_id = e;
				self._post('plus.identity.Identity/setDefault', {
					identity_id: e,
				}, function(res) {
					uni.showToast({
						title: "设置成功",
						icon: "none"
					})
				});
				return false;

			},
			selectAddress(e) {
				let self = this;
				console.log(e)
				if(e.code == "camper"){
					//添加人员
					self._post('plus.activity.Activity/addActivityIdentity', {
						identity_id: e.identity_id,
						activity_id:self.activity_id,
						activity_record_id:self.activity_record_id
					}, function(res) {
						uni.navigateBack()
					});
					
					
				}else{
					uni.showToast({
						title:"只能选择人员参加哦",
						icon:"none"
					})
				}

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
					content: self.$nw("您确定要删除该身份吗？"),
					success: function(o) {
						o.confirm && self._get('plus.identity.Identity/del', {
							identity_id: e
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