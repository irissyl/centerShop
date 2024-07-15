<template>
<view>
	<view class="diy-option" :style="{background:itemData.style.background}">
		<view :class="tab_index==index?'item item_active':'item'"  v-for="(item, index) in itemData.data" :key="index" :style="'width:'+item_width+';'" @click="gotoDetail(item,index)">
			<text :class="tab_index==index?'gray4':'gray3'" :style="{color:item.color}">{{item.text}}</text>
		</view>
	</view>
	<view class="diy-product">
		<view :class="['display__' + currentItem.show.display]">
			<template v-if="currentItem.show.display == 'list'">
				<view class="product-list" :class="['column__' + currentItem.show.column]">
					<view class="product-item" v-for="(product, index) in productDataList" :key="index" @click="goProductDetail(product.product_id)">
						<!-- 单列商品 -->
						<template v-if="currentItem.show.column == 'true'">
							<view class="product-item-box">
								<!-- 商品图片 -->
								<view class="product-cover"><image :src="product.image" mode="aspectFill"></image></view>
								<view class="product-info">
									<!-- 商品名称 -->
									<view v-if="currentItem.show.productName" class="product-title">
										<text>{{ product.product_name }}</text>
									</view>
									<!-- 商品卖点 -->
									<view v-if="currentItem.show.sellingPoint" class="selling-point gray9">
										<text>{{ product.selling_point }}</text>
									</view>
									<!-- 商品销量 -->
									<view v-if="currentItem.show.productSales" class="already-sale">
										<text>{{$nw("已售")}}{{ product.product_sales }}{{$nw("件")}}</text>
									</view>
									<!-- 商品价格 -->
									<view class="price d-s-c mt10">
										<view v-if="currentItem.show.productPrice" class="red">
											<text>{{$nw("¥")}}</text>
											<text class="">{{ product.product_price }}</text>
										</view>
										<view class="ml10 gray9 text-d-line f28" v-if="currentItem.show.linePrice && product.line_price > 0">
											<text>{{$nw("¥")}}</text>
											<text>{{ product.line_price }}</text>
										</view>
									</view>
									<view class="price d-s-c mt10 directCommissionstyle" v-if="(currentItem.show.directCommission == 'true'||product.show_commission)&&product.direct_commission>0">
										<view  style="margin: 0 auto;">
											<text>{{$nw("赚")}}&nbsp;{{$nw("¥")}}&nbsp;</text>&nbsp;
											<text class="" style="padding-left: 5rpx;">{{ product.direct_commission }}</text>
										</view>
									</view>
								</view>
							</view>
						</template>

						<!-- 两列三列 -->
						<template v-else>
							<view class="product-cover"><image :src="product.image" mode="aspectFill"></image></view>
							<view class="product-info">
								<view v-if="currentItem.show.productName == 'true'" class="product-title">{{ product.product_name }}</view>
								<view class="price d-s-c">
									<view v-if="currentItem.show.productPrice == 'true'" class="red">
										<text class="f22">{{$nw("¥")}}</text>
										<text class="">{{ product.product_price }}</text>
									</view>
									<view class="ml20 gray9 text-d-line" v-if="currentItem.show.linePrice == 'true' && product.line_price > 0"><text class="f22">{{$nw("¥")}}</text>{{ product.line_price }}</view>
								</view>

							</view>
							<view class="price d-s-c directCommissionstyle" v-if="(currentItem.show.directCommission == 'true'||product.show_commission)&&product.direct_commission>0" >
								<view style="margin: 0 auto;">
									<text >{{$nw("赚")}} {{$nw("¥")}}</text>
									<text class="" style="padding-left: 5rpx;">{{ product.direct_commission }}</text>
								</view>
							</view>
						</template>
					</view>
				</view>
			</template>
			<template v-else>
				<scroll-view :scroll-top="scrollTop" scroll-x="'true'">
					<view class="product-list" :class="['column__' + currentItem.show.column]">
						<view v-for="(product, index) in productDataList" :key="index" @click="goProductDetail(product.product_id)">
							<view class="product-item">
								<view class="product-cover"><image :src="product.image" mode="aspectFill"></image></view>
								<view class="product-info">
									<view v-if="currentItem.show.productName == 'true'" class="product-title">{{ product.product_name }}</view>
									<view class="price d-s-c f12">
										<view v-if="currentItem.show.productPrice == 'true'" class="orange">
											<text>{{$nw("¥")}}</text>
											<text class="">{{ product.product_price }}</text>
										</view>
										<view class="ml10 gray9 text-d-line" v-if="currentItem.show.linePrice == 'true' && product.line_price > 0">{{$nw("¥")}}{{ product.line_price }}</view>
									</view>

								</view>
								<view class="price d-s-c directCommissionstyle" v-if="(currentItem.show.directCommission == 'true'||product.show_commission)&&product.direct_commission>0">
									<view style="margin: 0 auto;" >
										<text>{{$nw("赚")}} {{$nw("¥")}}</text>
										<text class="">{{ product.direct_commission }}</text>
									</view>
								</view>
								<view style="height: 50rpx;" v-else>

								</view>


							</view>
						</view>
					</view>
				</scroll-view>
			</template>
		</view>
	</view>
</view>

</template>

<script>

	export default {
		data() {
			return {
				//单个宽度
				item_width:'25%',
				tab_index:0,
				scrollTop:0,
				currentItem:{},
				productDataList:[]
			}
		},
		props:['itemData'],
		created(){
			this.currentItem = this.itemData.data[0];
			if(this.itemData.data[0].source=='goods'){
					this.productDataList = this.itemData.data[0].goodsdata
			}

			// if(this.itemData.data[0].source=='goods'){
			// 	this.productDataList = this.itemData[0].goodsdata;
			// }

			this.item_width=100/Math.abs(this.itemData.style.rowsNum) +'%';
		},
		methods: {

			/*跳转页面*/
			gotoDetail(e,o){
				this.tab_index = o;
				this.currentItem = this.itemData.data[o];
				this.productDataList = [];
				if(e.source=='links'){
					if(e.appid!=undefined&&e.appid!=''){
						uni.navigateToMiniProgram({
							// #ifdef MP
							appId:e.appid,
							path:e.linkUrl!=undefined?e.linkUrl:'',
							// #endif
						})
					}else{
						this.gotoPage(e.linkUrl);
					}
				}else{
					this.productDataList = e.goodsdata?e.goodsdata:[];

				}


			},
			/*跳转产品详情*/
			goProductDetail(e) {
				let url='/main/pages/product/detail/detail?product_id=' + e;
				this.gotoPage(url);
			}
		}
	}
</script>

<style>
	.diy-product {
		padding:0 20rpx;
	}
	.diy-product .product-list.column__1 .product-item {
		margin-bottom: 20rpx;
		background: #ffffff;
	}
	.diy-product .product-list.column__1 .product-item-box {
		display: flex;
		justify-content: flex-start;
		align-items: stretch;
	}
	.diy-product .product-list .product-cover image{
		width: 100%;
		height: 100%;
	}

	.diy-product .product-list.column__1 .product-cover {
		width: 240rpx;
		height: 240rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.diy-product .product-list.column__1 .product-info {
		margin:20rpx 20rpx 20rpx 30rpx;
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	.diy-product .product-list .product-info .already-sale text {
		padding: 4rpx 8rpx;
		border-radius: 8rpx;
		background: #f2f2f7;
		color: #999;
	}
	.diy-product .product-list .product-title {
		display: -webkit-box;
		font-size: 32rpx;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.diy-product .product-list.column__1 .product-title {
		max-height: 80rpx;
		line-height: 40rpx;
	}

	.diy-product .product-list.column__1 .selling-point{
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		line-height: 30rpx;
		max-height: 60rpx;
	}

	.diy-product .product-list.column__1  .already-sale{
		margin-top: 10rpx;
	}

	.diy-product .product-list.column__2 .product-title {
		height: 80rpx;
		line-height: 40rpx;
		margin-top: 20rpx;
	}
	.diy-product .product-list.column__3 .product-title {
		margin-top: 20rpx;
		margin-left: 10rpx;
		margin-right: 10rpx;
		height: 72rpx;
		line-height: 36rpx;
		font-size: 30rpx;
	}
	.diy-product .product-list.column__2 .product-info {
		padding: 0 24rpx;
	}
	.diy-product .product-list .price {
		font-size: 34rpx;
	}
	.diy-product .product-list.column__2 .price {
		margin-top: 10rpx;
		font-size: 30rpx;
	}
	.diy-product .product-list.column__3 .price {
		margin-top: 10rpx;
		padding: 0 10rpx;
		font-size: 28rpx;
	}
	.diy-product .product-list.column__3 .price .text-d-line {
		font-size: 22rpx;
	}

	.diy-product .product-list.column__2,
	.diy-product .product-list.column__3 {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
	}
	.diy-product .column__2 .product-item {
		width: 350rpx;
		border-radius: 20rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		overflow: hidden;
		background: #ffffff;
		box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
	}
	.diy-product .display__list .column__2 .product-item:nth-child(2n + 0) {
		margin-right: 0;
	}
	.diy-product .column__2 .product-cover {
		width: 350rpx;
		height: 350rpx;
	}
	.diy-product .column__3 .product-item {
		width: 230rpx;
		margin-bottom: 10rpx;
		margin-right: 10rpx;
		border-radius: 8rpx;
		overflow: hidden;
		background: #ffffff;
		box-shadow: 0 0 8rpx rgba(0, 0, 0, 0.1);
	}
	.diy-product .display__list .column__3 .product-item:nth-child(3n + 0) {
		margin-right: 0;
	}
	.diy-product .column__3 .product-cover {
		width: 230rpx;
		height: 230rpx;
	}

	.diy-product .display__slide .product-list {
		flex-wrap: nowrap;
	}
	.diy-product .display__slide .column__2 .product-item {
		width: 300rpx;
	}
	.diy-product .display__slide .column__3 .product-item {
		width: 200rpx;
	}
	.directCommissionstyle{
		height: 50rpx;
		background-color: #E2231A;
		color: #ffffff;
	}
	.diy-option {
		overflow: auto;
		background: #FFFFFF;
		display: flex;
		justify-content: flex-start;
		flex-wrap: nowrap;
		margin-bottom: 15rpx;
		/* margin-top: -20rpx; */
	}

	.diy-option .item {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		padding: 8rpx 8rpx;
	}

	.item_active::after{
		content: '';
		width: 25%;
		height: 3px;
		background-color: red;

	}
	.diy-option .item text {
		display: block;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 100%;
		overflow: hidden;
		line-height: 80rpx;
		font-size: 28rpx;
		text-align: center;
	}
	.gray3{
		font-size: 16px!important;
		margin: 10rpx;
		color: #999999!important;
	}
	.gray4{
		color: #333333!important;
		font-size: 18px!important;
		font-weight: bold;
		margin: 10rpx;
	}
	::-webkit-scrollbar {
	/*隐藏滚轮*/
	display: none;
	}
</style>
