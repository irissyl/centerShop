<template>
	<view class="diy-page">
		<diy :diyItems="items" :diyPage="page_info"></diy>
		<Tabbar></Tabbar>
	</view>
	
</template>

<script>
	import diy from '@/components/diy/diy.vue';
	import Tabbar from '@/components/tabbar/tabbar.vue';
	export default {
		components: {
			diy,
			Tabbar
		},
		data() {
			return {
				/*页面ID*/
				page_id:0,
				/*diy类别*/
				items:{},
				/*页面信息*/
				page_info:{}
			}
		},
		onLoad(e) {
      this.setGlobalColor()
			this.page_id=e.page_id?e.page_id:0;
			// 商家id
			this.supply_id = e.supply_id?e.supply_id:0;
			let current_supply_id = uni.getStorageSync('currentSupplyId');
			if(!this.supply_id&&current_supply_id){
				this.supply_id = current_supply_id;
			}
			this.getData();
		},
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				self._get('index/website', {
					page_id: self.page_id,
					supply_id:self.supply_id
				}, function(res) {
					self.page_info = res.data.page;
					self.items = res.data.items;
					self.setPage(self.page_info);
					
				});
			},
			
			/*设置页面*/
			setPage(page){
				
				uni.setNavigationBarTitle({
				    title: page.params.title
				});
				
				let colors='#000000';
				if(page.style.titleTextColor=='white'){
					//字母要小写
					colors='#ffffff'
				}
				uni.setNavigationBarColor({
				    frontColor: colors,
				    backgroundColor: page.style.titleBackgroundColor
				})
				
			},
		},
		
	}
</script>

<style>

</style>
