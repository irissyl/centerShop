<template>
	<view class="index-search-box" id="searchBox" style="height: 80rpx;border-bottom:none;"
	:style="'background:'+getMainColor()+';'">
		<view class="index-search diy-search t-c search_inp clearfix" style="margin-bottom: 20rpx;float: left;border:none;background-color: #fff;"  :class="'diy-search-style-'+itemData.style.searchStyle+' diy-search-textAlign-'+itemData.style.textAlign" @click="gotoSearch">
			<span class="icon iconfont icon-sousuo"></span>
			<text class="ml16" style="color: #000;margin-left: 20upx;font-size: 28rpx;">{{$nw(itemData.params.placeholder)}}</text>
		</view>
		<image class="search_box11" style="float: right;" v-if="img" :src="img" @click="runtoPage()"></image>
	</view>
</template>

<script>
	export default{
		data(){
			return{
				img:'',
				// url:'',
				platform:'android'

			}
		},
		props:['itemData','page'],
		created() {
			if(this.page.params.icon_show == '1'){
				this.img = this.page.params.img_url
				// this.url = this.page.params.icon_link
			}

			let platform = uni.getStorageSync('platform');
			console.log(platform)
			this.platform = platform
		},

		methods:{

			/*跳转搜索页面*/
			gotoSearch() {
				let url='/main/pages/product/search/search';
				this.gotoPage(url);
			},
			// 跳转到自定义页面
			runtoPage()
			{
				let url= this.page.params.icon_link;
				this.gotoPage(url);
			}
		},

	}
</script>

<style scoped>
	#searchBox{
		/* height: 100rpx; */
		margin-bottom: 40rpx
	}

	.search_inp{
		height: 84rpx;
	}

	.search_box11{
		width: 74rpx;
		height: 74rpx;
		border-radius: 37rpx;
		margin: 0 0rpx 12rpx 10rpx;
	}

	/*search*/
	.diy-search-style-3{}
	.diy-search-style-6{border-radius: 16rpx;}
	.diy-search-style-9{border-radius: 50rpx;}
	.diy-search-textAlign-3{justify-content: flex-start;}
	.diy-search-textAlign-6{
		/* justify-content: center; */
		width: 700rpx;
		height: 80rpx;
	}
	.diy-search-textAlign-9{justify-content: flex-end;}
	.diy-search .svg-icon {
		margin-right: 10rpx;
	}

	.icon_search{
		width: 280px;
	}
</style>
