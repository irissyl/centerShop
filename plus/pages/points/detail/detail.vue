<template>
	<view class="product-detail" v-if="!loadding">
		<!--图片-->
		<view class="product-pic">
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval" :duration="duration">
				<swiper-item v-for="(item,index) in detail.product.image" :key="index">
					<image :src="item.file_path" mode="aspectFit"></image>
				</swiper-item>
			</swiper>
		</view>
		
		<!--基本信息-->
		<view class="bg-white">
			<view class="price-wrap">
				<view class="flex-1 d-s-s d-c">
					<view class="new-price">
						<text class="red f24">{{$nw("所需积分")}}</text>
						<text class="red fb f50">{{detail.sku[0].point_num}}</text>
						<template v-if="detail.sku[0].point_money > 0">
							<text class="red f40 gray9">+</text>
							<text>{{$nw("¥")}}</text>
							<text class="num fb f40">{{detail.sku[0].point_money}}</text>
						</template>
					</view>
					<text class="old-price" v-if="detail.line_price && detail.line_price > 0">{{$nw("¥")}}{{detail.line_price}}</text>
				</view>
				<text class="already-sale">{{$nw("还剩余")}}{{detail.stock}}{{$nw("件")}}</text>
			</view>
			<view class="product-name">
				{{detail.product.product_name}}
			</view>
			<view class="product-describe">
				{{detail.product.selling_point}}
			</view>
		</view>
		
		<!--详情内容-->
		<view class="product-content">
			<view class="group-hd border-b-e">
				<view class="left"><text class="min-name">{{$nw("商品介绍")}}</text></view>
			</view>
			<view class="content-box p30" v-html="detail.product.content"></view>
		</view>
		
		<!--底部按钮-->
		<view class="btns-wrap">
			<view class="customer-service d-c-c">
				<!-- #ifdef MP-WEIXIN -->
				<view class="icon-box"><button class="icon iconfont icon-kefu2" open-type="contact" session-from="wxapp"></button></view>
				<!-- #endif -->
				<!-- #ifdef H5 -->
				<view class="icon-box" @click="openMaservice"><button class="icon iconfont icon-kefu2"></button></view>
				<!-- #endif -->
			</view>
			<button type="primary" class="buy" @click="openPopup('order')">{{$nw("立即抢购")}}</button>
		</view>
		
		<!--购物确定-->
		<!-- <spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec> -->
		<QuickOrder  :isPopup_q="isPopup" :productModel_q="productModel" @close="closePopup" type="point" ></QuickOrder>
		<!--客服-->
		<Mpservice v-if="isMpservice" :isMpservice="isMpservice" @close="closeMpservice"></Mpservice>
		
	</view>
</template>

<script>
	// import Spec from './popup/Spec.vue';
	import Mpservice from '@/components/mpservice/Mpservice.vue';
	import utils from '@/common/utils.js';
		import QuickOrder from '@/components/quickOrder/quickOrder.vue';
export default {
	components:{
		/*选择规格*/
		// Spec,
		/*客服*/
		Mpservice,
		QuickOrder
	},
	data() {
		return {
			/*手机高度*/
			phoneHeight: 0,
			/*可滚动视图区域高度*/
			scrollviewHigh: 0,
			/*是否加载完成*/
			loadding: true,
			/*是否显示面板指示点*/
			indicatorDots: true,
			/*是否自动切换*/
			autoplay: true,
			/*自动切换时间间隔*/
			interval: 2000,
			/*滑动动画时长*/
			duration: 500,
			/*积分商品id*/
			point_product_id: null,
			/*产品图片展示*/
			imagList: [],
			/*详情*/
			detail:{
				/*商品规格*/
				product_sku: {},
				/*当前规格对象*/
				show_sku: {
					/*商品价格*/
					product_price: '',
					/*商品规格ID*/
					product_sku_id: 0,
					/*划线价*/
					line_price: '',
					/*库存*/
					stock_num: 0,
					/*图片*/
					sku_image: ''
				},
				show_point_sku:{}
			},
			/*是否确定购买弹窗*/
			isPopup: false,
			/*商品属性*/
			specData: null,
			/*子级页面传参*/
			productModel: {},
			/*商品规格*/
			productSku:[],
			/*是否打开客服*/
			isMpservice: false,
		};
	},
	onLoad(e) {
		
		/*分类id*/
		this.point_product_id = e.point_product_id;
	},
	mounted() {
    this.setGlobalColor()
		/*获取产品详情*/
		this.getData();
	},
	onShow() {
		
		uni.setNavigationBarTitle({
			    title: this.$nw("积分商品详情")
			}); 
	},
	methods: {
		/*获取数据*/
		getData() {
			let self = this;
			let point_product_id = self.point_product_id;
			uni.showLoading({
				title: this.$nw("加载中")
			});
			self._get(
				'plus.points.product/detail',
				{
					point_product_id: point_product_id
				},
				function(res) {
					/*详情内容格式化*/
					res.data.detail.product.content =utils.format_content(res.data.detail.product.content);
					
					/*初始化商品多规格*/
					if (res.data.detail.product.spec_type == 20) {
						self.initSpecData(res.data.detail.sku,res.data.specData);
					}
					self.detail = res.data.detail;
					self.loadding = false;
					uni.hideLoading();
				}
			);
		},
		
		/*多规格商品*/
		initSpecData(list,data) {
			
			for(let i=0;i<list.length;i++){
				let item=list[i];
				if(item.productSku){
					let arr=item.productSku.spec_sku_id.split('_').map(Number);
					this.productSku.push(arr);
				}
			}
			for (let i in data.spec_attr) {
				for (let j =0; j< data.spec_attr[i].spec_items.length;j++) {
					let item=data.spec_attr[i].spec_items[j];
					if(this.hasSpec(item.item_id,i)){
						item.checked = false;
						item.disabled=false;
					}else{
						data.spec_attr[i].spec_items.splice(j,1);
						j--;
					}
				}
			}
			this.specData = data;
		},
		
		/*判断有没有规格*/
		hasSpec(id,_index){
			let flag=false;
			for(let i=0;i<this.productSku.length;i++){
				let arr=this.productSku[i];
				if(arr[_index]==id){
					flag=true;
					break;
				}
			}
			return flag;
		},
		
		/*打开窗口*/
		openPopup(e) {
			let obj={
				specData:this.specData,
				detail:this.detail,
				productSpecArr:this.specData!=null? new Array(this.specData.spec_attr.length):[],
				show_sku:{
					sku_image:'',
					seckill_price:0,
					product_sku_id:0,
					line_price:0,
					seckill_stock:0,
					seckill_product_sku_id:0,
					sum:1
				},
				productSku:this.productSku,
				type:e
			}
			this.productModel=obj;
			this.isPopup = true;
		},
		
		/*关闭弹窗*/
		closePopup(){
			this.isPopup=false;
		},
		
		/*打开客服*/
		openMaservice() {
			this.isMpservice = true;
		},
		
		/*关闭客服*/
		closeMpservice() {
			this.isMpservice = false;
		},

    /*分享当前页面*/
    onShareAppMessage() {
      return {}
    },

	}
};
</script>

<style lang="scss">
.product-detail {
	padding-bottom: 90rpx;
}

.product-detail .product-pic,
.product-detail .product-pic .swiper,
.product-detail .product-pic image {
	width: 750rpx;
	height: 750rpx;
}

.product-detail .price-wrap {
	padding: 20rpx 20rpx 0;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.product-detail .price-wrap .old-price {
	padding: 10rpx 0;
	font-size: 30rpx;
	color: #888888;
	text-decoration: line-through;
}

.product-detail .already-sale {
	font-size: 24rpx;
	color: #999999;
}

.product-detail .product-name {
	padding: 10rpx 20rpx 0;
	font-size: 30rpx;
	font-weight: bold;
	color: #333333;
}

.product-detail .product-describe {
	padding: 20rpx;
	line-height: 40rpx;
	font-size: 24rpx;
	color: red;
}

.product-comment,
.product-content {
	margin-top: 20rpx;
	background: #ffffff;
}

.product-content .content-box p image {
	width: 100%;
}

.product-content .content-box {
	font-size: 36rpx;
}

.btns-wrap {
	position: fixed;
	height: 90rpx;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	background: #ffffff;
}

.btns-wrap .icon-box {
	width: 90rpx;
	height: 90rpx;
	border-right: 1px solid #dddddd;
}

.btns-wrap .icon-box .iconfont {
	font-size: 40rpx;
	color: #888888;
}

.btns-wrap .icon-box .iconfont .num {
	position: absolute;
	padding: 0 5rpx;
	top: 10rpx;
	left: 50%;
	height: 30rpx;
	line-height: 30rpx;
	border-radius: 15rpx;
	font-size: 20rpx;
	color: #ffffff;
	background: red;
}

.btns-wrap button,
.btns-wrap button:after {
	height: 91rpx;
	line-height: 90rpx;
	margin: 0;
	padding: 0;
	flex: 1;
	border-radius: 0;
	border: 0;
}

.btns-wrap button.add-cart {
	background: $orange-color;
}

.btns-wrap button.buy {
	background: $dominant-color;
}

.share-box {
	position: fixed;
	padding-right: 10rpx;
	width: 80rpx;
	height: 80rpx;
	right: 0;
	bottom: 180rpx;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 16rpx 0 0 16rpx;
	background: rgba(0, 0, 0, 0.8);
}

.share-box button {
	padding: 0;
	background: 0;
	line-height: 60rpx;
}

.share-box .iconfont {
	margin-bottom: 10rpx;
	font-size: 50rpx;
	color: #ffffff;
}

.create-img {
	width: 100%;
	padding: 20rpx;
	box-sizing: border-box;
}

.create-img image {
	width: 100%;
}

.create-img button {
	width: 100%;
}
</style>
