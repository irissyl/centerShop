<template>
  <!--  请求自定义页面  -->
	<view class="diy-page">
		<diy :diyItems="items" :diyPage="page_info"></diy>
	</view>

</template>

<script>
	import diy from '@/components/diy/diy.vue';
	export default {
		components: {
			diy
		},
    props: ['page_id'],
		data() {
			return {
				/*diy类别*/
				items:{},
				/*页面信息*/
				page_info:{}
			}
		},

    mounted() {
      this.getData()
    },

		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				self._get('page.Page/getPageData', {
					page_id: self.page_id
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
