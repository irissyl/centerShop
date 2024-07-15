<template>
	<view>
		<view :class="isIphoneX?'tabbarheightPhone':'tabbarheight'"></view>
		<view :class="isIphoneX?'tabbar isIphoneX':'tabbar'">
			<view class="item" v-for="(item, index) in tabbarData.data" :key="index" :style="'width:'+item_width+';'" @click="gotoDetail(item,index)">
				<image :src="curIndex==index?item.selectImgUrl:item.imgUrl" mode="widthFix"></image>
				<text :class="curIndex==index?'gray3 active':'gray3'" :style="{color:curIndex==index?'#C82829':item.color}">{{item.text}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				curIndex:0,
				isIphoneX:0,
				tabbarData:{
					"style":{
						"background":"#ffffff",
						"rowsNum":"4",
					},
					"data":[
						{
							"imgUrl":"/static/icon/icon-radar.png",
							"selectImgUrl":"/static/icon/icon-radar-cur.png",
							"imgName":"icon-1.png",
							"linkUrl":"card/pages/card/staff/radar/radar",
							"text":"雷达",
						},
						{
							"imgUrl":"/static/icon/icon-message.png",
							"selectImgUrl":"/static/icon/icon-message-cur.png",
							"imgName":"icon-2.jpg",
							"linkUrl":"card/pages/card/staff/message/message",
							"text":"消息",
						},
						{
							"imgUrl":"/static/icon/icon-custom.png",
							"selectImgUrl":"/static/icon/icon-custom-cur.png",
							"imgName":"icon-3.jpg",
							"linkUrl":"card/pages/card/staff/custom/custom",
							"text":"客户",
						},
						{
							"imgUrl":"/static/icon/icon-mine.png",
							"selectImgUrl":"/static/icon/icon-mine-cur.png",
							"imgName":"icon-4.jpg",
							"linkUrl":"card/pages/card/staff/mine/mine",
							"text":"我的",
						},
					],
				},
				item_width:'25%'
			}
		},
		created(){
			console.log('created')
			var pages = getCurrentPages();
			var currentpage = pages[pages.length - 1];
			let self = this;
			let count = 0;
			
			self.tabbarData.data.forEach(function(item,index){
				let linkUrl = item.linkUrl;
				if(item.linkUrl.indexOf('?')!==false){
					let linkUrl_arr = item.linkUrl.split('?');
					linkUrl = linkUrl_arr[0];
				}
				if(currentpage.route==linkUrl){
					count=1;
					self.curIndex=index;
					uni.setStorageSync('curIndex', index);
				}
			});
			if(count==0){
				uni.setStorageSync('curIndex', 0);
			}
			this.curIndex =uni.getStorageSync('curIndex');
			this.item_width=100/Math.abs(this.tabbarData.style.rowsNum) +'%';
			
			if(uni.getStorageSync('isIphoneX')){
				this.isIphoneX = uni.getStorageSync('isIphoneX');
				console.log(this.isIphoneX);
			}
		},
		methods: {
			gotoDetail(e,key){
				this.curIndex = key;
				let timestamp = new Date().getTime();
				uni.setStorageSync('curIndex', this.curIndex);
				let card_id = uni.getStorageSync('card_id');
				console.log("名片id:"+card_id);
				if(e.appid!=undefined&&e.appid!=''){
					uni.navigateToMiniProgram({
						// #ifdef MP
						appId:e.appid,
						path:e.linkUrl!=undefined?e.linkUrl:'',
						// #endif
					})
				}else{
					
					let url = e.linkUrl;
					
					if(card_id&&e.linkUrl=='card/pages/card/index'){
						let params = this.getShareUrlParams({
							card_id: card_id
						});
						console.log(params);
						url = url+"?"+params;
						console.log(url);
					}
					if(e.linkUrl.indexOf('?')===false){
						url = url+"&t="+timestamp;
					}else{
						url = url+"?t="+timestamp;
					}
					console.log("当前路径:"+e.linkUrl);
					
					uni.reLaunch({
						url: '/'+url
					});
				}
			}
		}
	}
</script>

<style>
	.tabbarheightPhone{
		height: 130rpx;
	}
	.tabbarheight{
		height: 100rpx;
	}
	.tabbar{
		box-sizing: border-box;
		border-top: 1rpx solid #aaaa7f;
		position: fixed;
		background: #FFFFFF;
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		left: 0;
		width: 100%;
		z-index: 998;
		bottom: 0;
	}
	.tabbar .item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		margin-top: 10rpx;
		height: 100rpx;
	}
	
	.tabbar .item image {
		position: relative;
		display: inline-block;
		margin-top: 5px;
		width: 48rpx;
		height: 48rpx;
	}
	
	.tabbar .item text {
		 position: relative;
		text-align: center;
		line-height: 1.8;
		font-size: 24rpx;

	}
	.active{
		color:#C82829;
	}
	.isIphoneX {
		padding-bottom: 30rpx;
	}
</style>
