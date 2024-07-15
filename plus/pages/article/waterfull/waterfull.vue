<template>
	<view>
		<view class="banner" v-show='!loadding'>
					<bannera :itemData="itemData" :height='height' ref='bannera'></bannera>
					<!-- <view class="profile"> -->
					<view :class="[selfuserid==data1.user_id ? 'wwww' : 'profile']">
						<view class="profile1 pro-info">
							<view class="profile2"><image style="" :src="data1.avatarUrl"></image></view>
							<view style="margin-left: 20rpx;">
								<view><text>{{name}}</text></view>
								<view style="color: #999999;font-size: 24rpx;"><text>{{data1.create_time1}}</text></view>
							</view>
						</view>			
						<!--点赞-->
						<view class="profile1 profile3" :class="[selfuserid==data1.user_id ? 'www' : '']">
							<view>
								<view style="width: 50rpx;height: 50rpx;" @click="showActive()" >
									<view v-if="type.islove === 0"><image style="width: 50rpx;height: 50rpx;" 
									:src="websiteUrl+'/file/images/active_love1.png'"></image></view>
									<view v-else><image style="width: 50rpx;height: 50rpx;" 

									:src="websiteUrl+'/file/images/love1.png'"
									></image></view>
								</view>
								<view style="width: 50rpx;height: 50rpx;" v-if="false">
									<image style="width: 50rpx;height: 50rpx;" 
									:src="websiteUrl+'/file/images/active_love1.png'"></image>
								</view>
							</view>
							
							<view style="color: #999;"><text>{{type.num}}</text></view>
						</view>
						<!--删除-->
						<view class="profile3" v-if="selfuserid==data1.user_id" :class="[selfuserid==data1.user_id ? 'ww' : '']">
							<!-- <view>
								<view style="width: 50rpx;height: 50rpx;" @click="deleteStory()" >
									<view><image style="width: 50rpx;height: 50rpx;" src="https://czjy.y01.cn/image/image/delete1.png"></image></view>
									
								</view>
								
							</view> -->
							
						</view>
					</view>
					<view v-html="article_content" style="margin: 40rpx 40rpx;line-height: 56rpx; font-size: 30rpx; !important"></view>
				<!-- 评论 -->
				<view v-if="data1.category.show_comment == 1">
					<view>
						<view style="font-size: 28rpx; font-weight: bold;border-top: 2rpx solid #EDEEED;padding-top: 20rpx;color: #114b42;margin:  0 40rpx;">评论</view>
						<view style="display: flex;justify-content: space-between;align-items: center;height: 100rpx;margin: 0 40rpx;">
							<view style="width: 60rpx;height: 60rpx;border-radius: 50%; "><image style="width: 60rpx;height: 60rpx;border-radius: 50%;" :src="avatarUrl1"></image></view>
							<view><input style="width: 400rpx;background-color: #E3E3E3;border-radius: 55rpx;height: 60rpx;padding-left: 30rpx;" v-model="content" ></input></view>
							<view style="padding: 0 20rpx;100rpx;height: 60rpx;background-color: #F2921B;text-align: center;line-height: 60rpx;border-radius: 20rpx;color: #FFFFFF;" @click="send_conment">发评论</view>
						</view>
					</view>
					<view v-for="(item,index) in CommentList" style="margin: 0 40rpx;">
						<view class="comment">
							<view class="comment_left"><image :src="item.avatarUrl" mode=""></image></view>
							<view class="comment_middle">
								<view class="mend">
									<view class="mena">
										<view style="margin-right:200rpx;flex: 1;"><text>{{item.nickName}}</text></view>
										<view><text>{{item.create_time}}</text></view>
									</view>
								</view>
								<view class="menb"><text>{{item.content}}</text></view>
							</view>
						</view>
						<view style="margin-bottom: 20rpx;"></view>
					</view>
				</view>
		</view>
		<Tabbar v-if="show_menu"></Tabbar>
	</view>
</template>

<script>
	import config from '@/config.js'
	import bannera from '@/components/abanner/bannera.vue'
	import comment from '@/components/comment/comment.vue'
	import evaluate from '@/components/evaluate/evaluate.vue';
	import utils from '@/common/utils.js';
	import Tabbar from '@/components/tabbar/tabbar.vue';
	export default { 
		components: {
			Tabbar,
			evaluate,
			comment,
			bannera
		},
		data() {
			return {
				websiteUrl: this.websiteUrl,
				show_menu:false,
				itemData: {
							data:[]
				},
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*文章id*/
				article_id: 0,
				/*文章详情*/
				article_content: '',
				article: {
					image: {}
				},
				dataList: {},
				data1: {},
				type: {},
				CommentList:[],
				content: '',
				avatarUrl1: '',
				name: '',
				height:"",
				selfuserid:'',
				category_id:'',
			};
		},
		onLoad(e) {
			/*分类id*/
			this.article_id = e.article_id;
			this.name = e.name;
			this.category_id = e.category_id
			
			// console.log(2222)
			
			//#ifdef H5
			//            this.url = window.location.href;
			//#endif
			
			let self = this;
			let curPage = getCurrentPages();
			let route = curPage[curPage.length - 1].route; //获取当前页面的路由
			self._get('index/tabbar', {}, function(res) {
				if (res.code == 1) {
					if (res.data.tabbar) {
						for (var i = 0; i < res.data.tabbar[0].data.length; i++) {
							if (res.data.tabbar[0].data[i].linkUrl == "plus/pages/article/waterfull/waterfull") {	
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
		created() {
			
		},
		mounted() {
			/*获取产品详情*/
			uni.showLoading({})
			this.getData();
			this.loadding=false
		},
		methods: {
			send_conment() {

				this.content =this.content.trim();
				this.content = this.content.replace(/\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDE4F]/g, "");
				if(this.content == '') {
					uni.showToast({
					    title: '评论不能为空或者表情包哟',
					    duration: 2000,
						icon: "none"
					});
				}else {
						let self = this;
						let article_id = self.dataList.data.detail.article_id;
						let user_id = uni.getStorageSync("user_id")
						let app_id = config.app_id;
						let content = self.content
						self._get(
							'plus.article.article/comment',
							{
								content,
								app_id,
								article_id,
								user_id
								
							},
							function(res) {
								/*详情内容格式化*/
								self.CommentList = res.data.list
								self.content = ' '
								// uni.redirectTo({
								// 	url: "/pages/article/waterfull/waterfull?article_id="+article_id
								// })
							}
					)
				}
				
			},
			/*获取文章详情*/
			getData() {
				
				let self = this;
				self.loadding=true
				let article_id = self.article_id;
				self._get(
					'plus.article.article/memoryDetail',
					{
						article_id: article_id
					},
					function(res) {
						/*详情内容格式化*/
						// res.data.detail.article_content =utils.format_content(res.data.detail.article_content);
						// console.log(res.data.detail.article_content);
						// self.article = res.data.detail;
						self.avatarUrl1 = res.data.userInfo.avatarUrl
						self.selfuserid =res.data.userInfo.user_id
						self.CommentList = res.data.CommentList
						self.data1 = res.data.detail
						self.article_content = utils.preText(self.data1.article_content);
						self.type = res.data.type
						self.dataList = res
						self.height= res.data.detail.height[1]
						let image = res.data.image
						// let image = res.data.thumbnailImg
						let images = image.map((item) => {
							return {"imgUrl":item.file_path}
						})
						// 处理图片高度
						let winWid = uni.getSystemInfoSync().windowWidth;
						 let imgh =res.data.detail.height[1];　　　　　　　　　　　　　　　　
						 let imgw = res.data.detail.height[0];
						 let swiperH = winWid * imgh / imgw +'px'
						 // 处理轮播图下方点点不一致问题
						 if(imgh==imgw){
						 	swiperH=winWid * imgh / imgw + 6 +'px'
						 }
						 if(imgh<imgw){
						 	swiperH=winWid * imgh / imgw + 13 +'px'
						 }
						 if(imgh>imgw && imgh/imgw>2){
						 	swiperH=winWid * imgh / imgw - 20 +'px'
						 }
						self.itemData.height= swiperH
						self.$refs.bannera.showImg()
						self.itemData.data = images
						self.loadding=false
						
						
					}
				);
			},
			//纪忆故事删除
			deleteStory(){
				let self =this;
				let article_id =self.data1.article_id;
				let user_id =self.data1.user_id;
				uni.showModal({
					title:"提示",
					content:"你确定要删除该条故事？",
					success:  (res) =>{
					       if (res.confirm) {
					        self._get(
					        	'plus.article.article/deleteStory',
					        	{
					        		article_id:article_id,
									user_id:user_id
					        	},
					        	function(res) {
									let status =res.data.result;
									if(status){
										uni.showToast({
											title: '删除成功',
											icon: 'none',
											duration: 2000
										});
									}
									setTimeout(function(){
										uni.navigateTo({
											url: '/plus/pages/article/list/list?category_id='+ self.category_id
										});
									},500)
					        	})
					       } else if (res.cancel) {
					           console.log('用户点击取消');
					       }
					   }, 
					})
				
			},
			showActive() {
					let self = this;
					let article_id = self.data1.article_id;
					let user_id = self.data1.user_id;
					let islove = self.type.islove;
					if(islove ==0 ){
						islove = 1
					}else {
						islove = 0
					}
					let app_id = config.app_id;
					self._get(
						'plus.article.article/zang',
						{
							article_id,
							user_id,
							islove,
							app_id,
						},
						function(res) {
							/*详情内容格式化*/
							// console.log(res.data.detail.article_content);
							if(self.type.islove == 0) {
								self.type.islove = 1
								self.type.num--
							}else {
								self.type.islove = 0
								self.type.num++
							}
							
						}
					);
				
			}
		}
	};
</script>

<style>
	/* .ww {
		margin-left: 100rpx;
	} */
	.www {
		margin-left: 50rpx;
	}
	.wwww {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 20rpx 40rpx;
		margin-right: 20rpx;
	}
	.wwww .pro-info {
		width: 70%;
	}
.profile {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin: 20rpx 40rpx;
}
.profile1 {
	display: flex;
	align-items: center;
	/* justify-content: center; */
}
.profile2 {
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
	border: 2rpx solid #BBBBBB;
}
.profile2 image {
	width: 70rpx;
	height: 70rpx;
	border-radius: 50%;
}
.article {
	margin: 40rpx 40rpx;
	font-size: 30rpx;
	font-family: -apple-system,SF UI Text,PingFang SC,Hiragino Sans GB,Microsoft YaHei,WenQuanYi Micro Hei,Helvetica Neue,Helvetica,Arial,sans-serif;
}
.banner {
	background-color: #FFFFFF;margin: 0 20rpx;
}
.profile3 {
	width: 50rpx;
	height: 50rpx;
}
.comment {display: flex; background-color: #FFFFFF;
			 border: 1px solid #FFFFFF;margin: 20rpx 0;
			}
	.comment_left {width: 60rpx; height: 60rpx;}
	.comment_left image {width: 100%; height: 100%;border-radius: 50%;}
	.comment_middle { font-size: 30rpx;flex: 1;padding-left:10rpx;border-bottom: 2rpx solid #EDEEED;flex: 1;}
	image {width: 50rpx; height: 50rpx;}
	.mena {display: flex;font-size: 18rpx;}
	.menb {padding: 20rpx 0;font-size: 24rpx;}

</style>
