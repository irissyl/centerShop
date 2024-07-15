<template>
	<scroll-view scroll-y="true" :style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'"
		@scrolltolower="in_scrolltolower">
	<view class="diy-page">
		<diy :diyItems="items" :diyPage="page_info"></diy>
		<Tabbar></Tabbar>
	</view>
	</scroll-view>
	
</template>

<script>
	import diy from '@/components/diy/diy.vue';
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import utils from '@/common/utils.js';
	export default {
		components: {
			diy,
			Tabbar
		},
		data() {
			return {
				/*页面ID*/
				page_id:null,
				/*diy类别*/
				items:{},
				/*页面信息*/
				page_info:{},
				scrollviewHigh:0
			}
		},
		onShow() {
			/*初始化*/
			this.init();
		},
		onLoad(e) {
			let scene = utils.getSceneData(e);
			this.page_id = e.page_id ? e.page_id : scene.gid;
			this.getData();
			this.setGlobalColor()
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
					title: self.page_info.params.share_title?self.page_info.params.share_title:self.page_info.params.name,
					path: '/pages/diy-page/diy-page?page_id='+self.page_id
				};
			},
			/*获取数据*/
			getData(page_id) {
				let self = this;
				self._get('index/index', {
					page_id: self.page_id
				}, function(res) {
					self.page_info = res.data.page;
					self.items = res.data.items;
					console.log("self.page_info",self.page_info);
					self.setPage(self.page_info);
					
				});
			},
			
			/*设置页面*/
			setPage(page){
				uni.setNavigationBarTitle({
				    title: page.params.title
				});
			},
		},
		
	}
</script>

<style>

</style>
