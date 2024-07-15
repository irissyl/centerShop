<template>
	<scroll-view scroll-y="true" 
	:style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'"
	>
		<Ad location_id="album_top" :interval="1500" ></Ad>
		<view class="album"  :style="'color:'+getMainTextColor()+';'">
			{{detail.name}}
			<view v-if="detail.image.length > 0"  class="album_1">{{detail.time}} 
			<text style="margin-left: 30rpx;">{{$nw("共")}}{{detail.image.length}}{{$nw("张")}}</text> </view>
	
		</view>
		<view class="" style="margin-top: 50rpx;">
			<image class="album_2"
			 v-for="(item,index) in detail.image" 
			 :src="item.file_path"
			:key="index" @click="pre(detail.image,item.file_path)">
				
				
			</image>
			
			<view style="height: 80rpx;width: 100%;clear: both;">
				
			</view>
				
		</view>
		
		<template v-if="detail.image.length <= 0">
			<view class="none-data-box">
				<image src="http://imgh5.y01.cn/20210606225550dd5f35541.png" mode="widthFix"></image>
				<text>{{$nw("未获取到相册图片")}}</text>
		
			</view>
		</template>
		
		<Ad location_id="album_bottom" :interval="1500" ></Ad>
	
			
		<Tabbar v-if="show_menu"></Tabbar>
		
		<service :itemData="t_service"></service>
		
	</scroll-view>
</template>

<script>
	const app = getApp()
	import dynamic from "@/components/comment/dynamic.vue"
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import Ad from '@/components/ad/ad.vue';
	import service from '@/components/diy/service/service';
	
	export default {
		components: {
			Ad,
			Tabbar,
			dynamic,
			service,
			
		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				height: "",
				show_menu: false,
				detail:{
					image:[]
				},
				last_page: "",
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
				album_id:0,
				scrollviewHigh:0
			}
		},
		onShow() {
			this.getData();
			this.init();
		},
		onLoad(option) {
			var self = this;
			 self.setGlobalColor()
			 this.album_id = option.album_id

		},
		created() {
			var self = this;
			let curPage = getCurrentPages();
			let route = curPage[curPage.length - 1].route; //获取当前页面的路由
			self._get('index/tabbar', {}, function(res) {
				console.log("--", res.data.tabbar[0].data)
				if (res.code == 1) {
					if (res.data.tabbar) {
						for (var i = 0; i < res.data.tabbar[0].data.length; i++) {
							var str = res.data.tabbar[0].data[i].linkUrl;
							if (str == "plus2/pages/album/album") {
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
		onShareTimeline() {
			var self =this;
			return {
				title: self.detail.name,
				path: '/plus2/pages/album/list'
			};
		},
		methods: {
			/*初始化*/
			init() {
				let self = this;
				uni.getSystemInfo({
					success(res) {
						self.scrollviewHigh = res.windowHeight;
			
					}
				});
			},
			/**
			 * 设置分享内容
			 */
			onShareAppMessage() {
				let self = this;
				return {
					title: self.detail.name,
					path: '/plus2/pages/album/album?album_id='+self.album_id
				};
			},
			pre(arr,url){
				var new_arr = [];
				console.log("arr",arr);
				arr.forEach(function(res){
					new_arr.push(res.file_path);
				})
				uni.previewImage({
					current:url,
					urls:new_arr
				})
			},
			dynaimage() {
				uni.navigateTo({
					url: "/plus2/pages/dynamic/rel_dynamic"
				})
			},
			getData() {
				var self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				})
				self._get('plus.album.Index/detail', {
					page: self.page,
					list_rows: self.list_rows,
					album_id:self.album_id,
				}, function(res) {
					self.loading = false;
					self.detail = res.data.detail
					uni.setNavigationBarTitle({
						title:self.detail.name
					})
				});
			},

		}
	}
</script>

<style lang="scss">
	page {
		background: #fff;
	}
	
	.album {
		margin: auto;
		margin-top: 50rpx;
		width: 95%;
		font-size: 36rpx;
		font-weight: 600;
		text-align: center;
		.album_1{
			font-size: 30rpx;
			font-weight: 400;
			color: #7a7a7a;
		}
		
	}
	
	.album_2{
		width: 220rpx;
		height: 220rpx;
		float: left;
		margin-left: 20rpx;
		margin-top: 20rpx;
	}

</style>