<template>
	<view>
		<view class="address-list bg-white">
				<view style="position: fixed;z-index:1000; width: 100%;margin: auto; background: #fff;border: none;">
					<!-- <view class="top-tabbar">
								<block >
									<view :class="tab_type == 0 ? 'tab-item active' : 'tab-item'" :style="[active(tab_type, 0)]"
										@click="tabFunc(0)">{{$nw('附近门店')}}</view>
								</block>
								<block >
									<view :class="tab_type == 1 ? 'tab-item active' : 'tab-item'" :style="[active(tab_type, 1)]"
										@click="tabFunc(1)">{{$nw('全部门店')}}</view>
								</block>

							</view> -->
					<!-- <view class="pt10 d-b-c" id="searchBox"
					      >
					  <view class="index-search t-c flex-1">
					    <span class="icon iconfont icon-sousuo"></span>
					    <input type="text" v-model="keyword" class="flex-1 ml10 f30 gray3" value=""
					           placeholder-class="f24 gray6"
					           :placeholder="$nw('输入你要查询的门店')" />

					    <button class="btn ml10" @click="search()" type="default">{{$nw('搜索')}}</button>
					  </view>
					</view> -->
				</view>

			<view   >
				<view class="address p30 d-s-c border-b-e pr"v-for="(item,index) in storeList" :key="index">

					<view class="info flex-1" style="position: relative;">
						<view class="user f34 store_name">
							<text>{{item.store_name}}</text>
						</view>
						<view class="pt10 user f30 gray6" style="z-index:100">
							{{item.linkman}} <text style="margin-left: 10rpx;" @click="takePhone(item.phone)">{{item.phone}} <text
									style="color:#007AFF;font-size:13px ;padding-left: 10px;">{{$nw("拨打")}}</text></text>
						</view>
						<view class="pt10 f24 gray6" v-if="item.latitude && item.longitude"
							style="display: inline-block;white-space:normal; width:80%">
							<text> {{item.region.province&&item.region.province!="其他"?item.region.province:""}} {{item.region.city&&item.region.city!="其他"?item.region.city:""}} {{item.region.region&&item.region.region!="其他"?item.region.region:""}} {{item.region.street&&item.region.street!="其他"?item.region.street:""}}
								{{item.address&&item.address!="其他"?item.address:""}}
							</text>
							<text style="color:#007AFF;font-size:13px ;padding-left: 10px;"
								@click="showAddress(item.latitude,item.longitude,item.address,item.store_name)">{{$nw("导航")}}</text>

							<text style="color:#007AFF;font-size:13px" class="ml30"
								v-if="item.store_wxappid!=''||item.store_qrcode!=''"
								@click="gotoStore(item)">{{$nw("查看店铺")}}</text>
						</view>
						<view v-if="is_select" class="pt10 f24 gray6 fr select_store"
							@click="onSelectedStore(item.store_id)">{{$nw("选择")}}</view>
						<!-- 	<view>
							<text class="iconfont icon-dingwei"></text>
							<text>{{item.distance_unit}}</text>
						</view> -->
						<!-- 选中状态 -->
						<view v-if="item.store_id == selectedId" class="shop-item__right">
							<text class="iconfont icon-iconfontduihaocopy"></text>
						</view>
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
				is_select:0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
				keyword:"",//关键字
				qrcode_show:false,
				qrcode_url:'',
				tab_type:1,
				no_distance:0
			}
		},
		onLoad(options) {
			this.setGlobalColor()
			// 记录已选中的id
			this.selectedId = options.store_id;
			this.is_select = options.is_select ? options.is_select : 0;
			/*获取地址列表*/
			this.getLocation();
			this.page = 1;
			uni.showLoading({
				title:"加载中"
			})
			// this.getData(this.page);
		},
		onReachBottom() {
		  var self =this;
			if(self.no_distance==0){
				return
			}
		  self.page++;
		  uni.showLoading({
		  	title:"加载中"
		  })
		  setTimeout(function(){
		  	self.getData(self.page);
		  },500)

		},
		methods: {
			tabFunc(e) {
				this.tab_type = e;
					this.no_distance=e;
					this.page=1;
					this.storeList=[];
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
			gotoStore(store){
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
				}else{
					self.qrcode_show = true;
				}


			},
			search(){
				console.log(this.keyword)
				uni.showLoading({
					title:"加载中"
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
							icon:'none',
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
				self._post('store.store/lists', {
					no_distance:self.no_distance,
					longitude: self.longitude,
					latitude: self.latitude,
					page:page,
					list_rows:self.list_rows,
					keyword:self.keyword
				}, function(res) {
					self.isLoading = false;
					self.isLoading = false;
					if(self.no_distance==0){
						 self.storeList = res.data.list;
					}else{
						self.storeList = self.storeList.concat(res.data.list.data);
						self.storeList = self.getUnique(self.storeList, "store_id");
					}
				});
			},

			/**
			 * 选择门店
			 */
			onSelectedStore(e) {
				let self = this;
				self.selectedId = e;
				// 设置上级页面的门店id
				let pages = getCurrentPages();
				if (pages.length < 2) {
					return false;
				}
				// 触发全局的 选择门店 自定义事件,其他页面监听接收
				uni.$emit('selectStoreId',e)
				// 返回上级页面
				uni.navigateBack({
					delta: 1
				});
			},
			takePhone(e){
				uni.makePhoneCall({
				    phoneNumber: e
				});
			},
			showAddress(lat,lng,addr,store_name){
				// uni.navigateTo({
				// 	url: '/pages/map/index/index?lat=' + lat + '&lng=' + lng
				// });

				uni.openLocation({
					latitude:parseFloat(lat),
					longitude:parseFloat(lng),
					name:store_name,
					address:addr
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
	.select_store{
		display: inline-block;
		padding: 5rpx 14rpx;
		word-spacing:2rpx;
		background-color: rgb(226, 35, 26);
		color:white;
		border-radius: 10rpx;
		position: absolute;
		right:20rpx;
		bottom: 20rpx;
	}
	.store_name{
		font-weight: bolder;
	}
</style>
