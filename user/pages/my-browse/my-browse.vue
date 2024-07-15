<template>
	<view>
		<view class="top-tabbar">
			<view :class="state_active == 0 ? 'tab-item active' : 'tab-item'" :style="[active(state_active, 0)]" @click="stateFunc(0)">{{$nw("看过的商品")}}</view>
			<view :class="state_active == 1 ? 'tab-item active' : 'tab-item'" :style="[active(state_active, 1)]" @click="stateFunc(1)">{{$nw("看过的门店")}}</view>
		</view>

		<!--列表-->
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
		  @scrolltolower="scrolltolowerFunc">
			<view class="product-item-list">
					<view class="item" v-for="(item, index) in DataList" :key="index" @click="gotoProduct(item)">
						<view class="product-item-head d-b-c">
							<view>
								<text class="state-text">
									<text class="icon iconfont icon-Homehomepagemenu"></text>
								</text>

								<text class="shop-name flex-1">{{item.product.supply?item.product.supply.name:$nw("平台")}}</text>
							</view>
						</view>

						<!-- 一个商品显示 -->
						<view class="one-product d-s-c">
							<view class="cover" v-for="(img, num) in item.product.image" :key="num">
								<image :src="img.file_path" mode="aspectFit"></image>
							</view>
							<view class="pro-info flex-1">
								{{item.product.product_name}}
								<view class="price f22">
									{{$nw("¥")}}<text class="f40">{{item.product.product_price}}</text>
								</view>
							</view>
						</view>
					</view>



				<view class="item" v-for="(item, index) in supplyDataList" :key="index" @click="gotoSupply(item)">


					<view class="one-product d-s-c">
						<view class="cover">
							<image :src="item.supply.image_url" mode="aspectFit"></image>
						</view>
						<view class="pro-info flex-1">
							{{item.supply.name}}
							<view class="price f22">
								<text class="f30">{{item.supply.address}}</text>
							</view>
						</view>
					</view>
				</view>



				<view class="">
					<view class="bottom-refresh">
						<view class="d-c-c p30" v-if="loading">
							<text class="gray3">{{$nw("加载中")}}...</text>
						</view>
						<view class="d-c-c p30" v-if="no_more">
							<text class="gray3">~~{{$nw("加载完成")}}~~</text>
						</view>
					</view>
				</view>

				<!-- <view class="d-c-c p30" v-if="DataList.length==0 && !loading">
					<text class="iconfont icon-wushuju"></text>
					<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
				</view> -->
			</view>
		</scroll-view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*状态选中*/
				state_active: 0,
				/*当前页面*/
				page: 1,
				/*列表*/
				DataList: [],
				supplyDataList:[],
				no_more: false,
				loading: false,
				data_type: 'product',
				transfer_setting:true,
			};
		},
		mounted() {
      this.setGlobalColor()
			/*初始化*/
			this.init();
			/*获取数据*/
			this.getData();
		},
    computed: {
      active() {
        return (state_active, value) => {
          if (state_active === value) {
            return Object.assign(this.setColor(true), {'border-bottom': '2px solid ' + this.getMainColor()})
          }
        }
      },
    },
		methods: {
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.phoneHeight = res.windowHeight;
						// 计算组件的高度
						let view = uni.createSelectorQuery().select('.top-tabbar');
						view.boundingClientRect(data => {
							let h = self.phoneHeight - data.height;
							self.scrollviewHigh = h;
						}).exec();
					}
				});
			},

			/*获取数据*/
			getData() {

				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				let data_type = self.data_type;
				let page = self.page;
				self._get('user.browse/lists', {
					data_type: data_type,
					page: page || 1,
				}, function(res) {
					uni.hideLoading();
					if(data_type=='product'){
						self.DataList = self.DataList.concat(res.data.list.data);
						self.DataList = self.getUnique(self.DataList,"user_browse_records_id");
					}else{
						self.supplyDataList = self.supplyDataList.concat(res.data.list.data);
						self.supplyDataList = self.getUnique(self.supplyDataList,"user_browse_records_id");
					}
					console.log(self.supplyDataList);
					self.last_page = res.data.list.last_page;
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}
				});
			},

			/*状态切换*/
			stateFunc(e) {
				let self = this;
				if(self.state_active!=e){
					console.log(e);
					if (e == 0) {
						self.data_type = 'product';
						self.supplyDataList = [];
					}
					if (e == 1) {
						self.data_type = 'supply';
						self.DataList = [];
					}
					self.state_active = e;
					self.page =1;

					self.getData();
				}
			},
			/*可滚动视图区域到底触发*/
			scrolltolowerFunc() {

				let self = this;
				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					self.no_more = true;
					return;
				}
				self.getData();
			},
			/*跳转商品 */
			gotoProduct(row){
				let self = this;
				let product_id = row.product.product_id;

				let url='main/pages/product/detail/detail?product_id=' + product_id
				this.gotoPage(url);
			},
			/* 跳转供应商 */
			gotoSupply(row){
				let self = this;
				let supply_id = row.supply.supply_id;
				let url='plus/pages/supply/detail/detail?supply_id=' + supply_id
				this.gotoPage(url);
			},

		}
	};
</script>

<style>
	.product-item-list .product-item-head .state-text{
		margin-top: auto;
		vertical-align: middle;
		}
	.product-item-list  .item {
		margin-top: 30rpx;
		padding: 30rpx;
		background: #FFFFFF;
	}

	.product-item-list .product-list,
	.product-item-list .one-product {
		padding: 20rpx 0;
		height: 160rpx;
	}
</style>
