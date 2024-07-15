<template>
	<view class="article-detail" v-if="loadding">
		<view class="title fb" style="height: 162px;border-bottom: 2px solid #ccc;">
			<view class="paimai_img" style="text-align: center;padding-left: 30%;">
			<view class="pic" style="align:center;" ><image src="http://imgh5.y01.cn/202106062321413d5321929.png" mode="aspectFill"></image></view>
			<span></span>
			</view>
		</view>
		<view class="info d-b-c f24" style="border-bottom: 2px solid #ccc;">
			<view>
				<view class="ml30" ><span>{{$nw("拍卖品名称")}}：</span>{{ auction.auction_name }}</view>
				<view class="ml30"><span>{{$nw("拍卖品类型")}}：</span>{{ auction.auction_type }}</view>
				<view class="ml30"><span>{{$nw("拍卖品编号")}}：</span>{{ auction.auction_number }}</view>
				<view class="ml30"><span>{{$nw("拍卖品价格")}}：</span>{{ auction.auction_price }}</view>
				<view class="ml30"><span>{{$nw("拍卖品年份")}}：</span>{{ auction.auction_year }}</view>
				
			</view>
		</view>
		<view class="" style="width: 100%;">
			<view class="cancelpaimai"  @click="">
				<span class="">{{$nw("立即抢购/取消拍卖")}}</span>
				<text class="ml10"></text>
			</view>
		</view>
		
	</view>
	
</template>

<script>
import utils from '@/common/utils.js';
export default {
	data() {
		return {
			/*是否加载完成*/
			loadding: false,
			indicatorDots: true,
			autoplay: true,
			interval: 2000,
			duration: 500,
			/*id*/
			auction_id: 0,
			/*详情*/
			auction: {
				
			}
		};
	},
	onLoad(e) {
		/*分类id*/
		this.auction_id = e.auction_id;
		//#ifdef H5
		//            this.url = window.location.href;
		//#endif
	},
	mounted() {
		/*获取产品详情*/
		this.getData();
    this.setGlobalColor()
	},
	methods: {
		/*获取详情*/
		getData() {
			let self = this;
			uni.showLoading({
				title: self.$nw("加载中")
			});
			self.loading = true;
			let auction_id = self.auction_id;
			self._get(
				'plus.auction.auction/detail',
				{
					auction_id: auction_id
				},
				function(res) {					
					self.auction = res.data.detail;
					self.loadding = true;
					uni.hideLoading();
				}
			);
		}
	}
};
</script>

<style>
.article-detail {
	padding: 30rpx;
	background: #ffffff;
}

.article-detail .title {
	font-size: 44rpx;
}

.article-detail .info {
	padding: 40rpx 0;
	color: #999999;
}


.pic, .pic image {
	text-align: center;
	width: 128px;
    height: 120px;
}
.article-detail .article-content {
	width: 100%;
	box-sizing: border-box;
	line-height: 60rpx;
	font-size: 34rpx;
	overflow: hidden;
}
.article-detail .article-content image,.article-detail .article-content img {
	display: block;
	max-width: 100%;
}
.ml30{
	height: 30px;
	line-height: 30px;
	padding-left: 50px;
}
.ml30 span{
	padding-right: 30px;
}
.cancelpaimai{
	text-align: center;
	color: #888;
	width: 40%;
	height: 37px;
	line-height: 36px;
	border: 1px solid #ccc;
	align-items: center;
	border-radius: 19px;
	margin-top: 30px;
	margin-right: auto;
	margin-bottom: 0px;
	margin-left: auto;
}
</style>
