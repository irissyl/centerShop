<template>
	<view>
		<view v-if="list && list.length >0 && item.rate && item.rate!=0" class="list" @click="goPage(item)"
			:style="{background:item.background,color:item.color}" v-for="(item,index) in list" :key="index">
			{{item.text}}
		</view>

		<view v-if="list.length <= 0" style="width: 100%;text-align: center;
		height: 300rpx; line-height: 300rpx;font-size: 30rpx;">
			{{$nw('未开启代理')}}
			
		</view>
		
		<Tabbar v-if="show_menu"></Tabbar>
	</view>
</template>

<script>
	import Tabbar from '@/components/tabbar/tabbar.vue';
	export default {
		components:{
			Tabbar
		},
		data() {
			return {
				list: [],
show_menu: false,
			};
		},
		onLoad() {
			var self = this;
			//判断底部菜单
			let curPage = getCurrentPages();
			let route = curPage[curPage.length - 1].route; //获取当前页面的路由
			self._get('index/tabbar', {}, function(res) {
				if (res.code == 1) {
					if (res.data.tabbar) {
						for (var i = 0; i < res.data.tabbar[0].data.length; i++) {
							if (res.data.tabbar[0].data[i].linkUrl == "plus2/pages/region_agent/index") {	
								self.show_menu = true;
								break;
							}
						}
					} else {
						self.show_menu = false;
					}
			
				} else {
					self.show_menu = false;
				}
			
			})
		},
		onShow() {
			var self = this;
			uni.showLoading({
				title: self.$nw("加载中")
			});

			self._post('plus.regionagent.Regiontree/getBgColor', {}, function(res) {
				self.list = [];
				if(res.data.values.is_open == 1){
					self.list.push({
						background: res.data.values.townBg,
						text: res.data.values.townText,
						color: res.data.values.townColor,
						type: "town",
						rate: res.data.values.street_rate
					}, )
					
					self.list.push({
						background: res.data.values.countyBg,
						text: res.data.values.countyText,
						color: res.data.values.countyColor,
						type: "county",
						rate: res.data.values.region_rate
					}, )
					
					self.list.push({
						background: res.data.values.cityBg,
						text: res.data.values.cityText,
						color: res.data.values.cityColor,
						type: "city",
						rate: res.data.values.city_rate
					}, )
					
					self.list.push({
						background: res.data.values.provinceBg,
						text: res.data.values.provinceText,
						color: res.data.values.provinceColor,
						type: "province",
						rate: res.data.values.province_rate
					}, )
				}
				

				uni.hideLoading();

			})
		},
		methods: {
			goPage(item) {
				uni.navigateTo({
					url: "/plus2/pages/region_agent/list?type=" + item.type
				})
			}
		}
	}
</script>

<style lang="scss">
	.list {
		width: 80%;
		margin: auto;
		margin-top: 10%;
		border-radius: 10rpx;
		text-align: center;
		line-height: 200rpx;
		height: 200rpx;
		font-size: 36rpx;
	}
</style>
