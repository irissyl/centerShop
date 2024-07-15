<template>
	<view class="category-wrap">

		<!--类别列表-->
		<view class="category-content">
			<!--二级分类-->
			<view class="cotegory-type cotegory-type-3">
				<view class="category-tab">
					<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+scrollviewHigh+'px;'">
						<view :class="index==select_index?'item active':'item'" v-for="(item,index) in listData" :key="index" @click="selectCategory(index)">
							<text>{{item.name}}</text>
						</view>
					</scroll-view>
				</view>
				<view class="category-content">
					<scroll-view scroll-y="true" class="scroll-Y" :style="'height:'+scrollviewHigh+'px;'">
						<view class="list">
							<view class="item" v-for="(item,index) in childlist" :key="index" @click="gotoList(item)">
								<image :src="hasImages(item)" mode="aspectFit"></image>
								<text class="type-name">{{item.name}}</text>
							</view>
						</view>
					</scroll-view>
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	
	export default {
		
		data() {
			return {
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*数据*/
				listData: [],
				/*子类数据*/
				childlist: [],
				/*当前选中的分类*/
				select_index: 0,
			};
		},
		onLoad() {

		},
		mounted() {
			this.init();
			this.getData();
		},
		methods: {
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
						// // 计算组件的高度
						// let view = uni.createSelectorQuery().select('#searchBox');
						// view.boundingClientRect(data => {
						// 	let h = _this.phoneHeight - data.height;
						// 	_this.scrollviewHigh = h;
						// }).exec();
					}
				});
			},

			/*判断是否有图片*/
			hasImages(e) {
				if (e.path != null) {
					return e.path;
				} else {
					return '';
				}
			},

			/*获取数据*/
			getData() {
				let _this = this;
				uni.showLoading({
					title: this.$nw('加载中')
				});
				_this._get('plus.card.square/getSquare', {}, function(res) {
					_this.listData = res.data.category;
					console.log(_this.listData,res.data.category,'分类');
					if (_this.listData[0].child) {
						_this.childlist = _this.listData[0].child;
					}else{
						_this.childlist = [_this.listData[0]];
					}
					uni.hideLoading();
				});
			},

			/*选择分类*/
			selectCategory(e) {
				if (this.listData[e].child) {
					this.childlist = this.listData[e].child;
					this.select_index = e;
				}else{
					this.childlist = [this.listData[e]];
					this.select_index = e;
				}
			},

			/*跳转产品列表*/
			gotoList(e) {
				let pages = getCurrentPages();  //获取所有页面栈实例列表
				let nowPage = pages[ pages.length - 1];  //当前页页面实例
				let prevPage = pages[ pages.length - 2 ];  //
				prevPage.$vm.currentIndustry = e.name; 
				prevPage.$vm.staffInfo.category_id = e.card_category_id; 
				wx.navigateBack();
			},

		}
	};
</script>

<style lang="scss">
	@import '@/common/mixin.scss';

.cotegory-type {
	line-height: 40rpx;
	background: #ffffff;
}

.cotegory-type image {
	width: 100%;
}

.cotegory-type-1 .list {
	padding: 20rpx;
}

.cotegory-type-1 .list .item {
	margin-top: 30rpx ;
}

.cotegory-type-1 .list .item .pic{
	border: 1px solid #e3e3e3;
	width: 710rpx;
	height: auto;
	overflow: hidden;
	border-radius: 8px;
}

.cotegory-type-1 .list .item image {
	width: 100%;
	height: 100%;
}

.cotegory-type-2 .list,
.cotegory-type-3 .list {
	padding: 0 20rpx;
	display: flex;
	flex-wrap: wrap;
	justify-content: flex-start;
}

.cotegory-type-2 .list .item,
.cotegory-type-3 .list .item {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.cotegory-type-2 .list .item {
	padding: 0 16rpx;
	width: 200rpx;
	height: 300rpx;
	font-size: 28rpx;
}

.cotegory-type-2 .list .item image {
	width: 180rpx;
	height: 180rpx;
	margin-bottom: 20rpx;
}

.cotegory-type-3 {
	display: flex;
}

.cotegory-type-3 .category-tab {
	width: 200rpx;
	background: #FFFFFF;
	border-right: 1px solid #e3e3e3;
}

.cotegory-type-3 .category-tab .item {
	padding: 40rpx 0;
	font-size: 30rpx;
	text-align: center;
}

.cotegory-type-3 .category-tab .item.active {
	position: relative;
	background: #ffffff;
	font-weight: bold;
	color: $dominant-color;
}
.cotegory-type-3 .category-tab .item.active::after{
	position: absolute;
	content: '';
	top: 40rpx;
	bottom: 40rpx;
	left: 0;
	width: 10rpx;
	background: $dominant-color;
}

.cotegory-type-3 .category-content {
	flex: 1;
}

.cotegory-type-3 .list .item {
	width: 140rpx;
	height: 200rpx;
	margin-top: 40rpx;
	margin-right: 40rpx;
	font-size: 24rpx;
}
.cotegory-type-3 .list .item:nth-child(3n) {
	margin-right: 0;
}

.cotegory-type-3 .list .item image {
	width: 140rpx;
	height: 140rpx;
}
.cotegory-type-3 .list .item .type-name {
	display: block;
	margin-top: 20rpx;
	height: 80rpx;
	line-height: 60rpx;
	text-overflow: ellipsis;
	width: 100%;
	color: #818181;
	font-size: 30rpx;
	white-space: nowrap;
	overflow: hidden;
	text-align: center;
}
</style>
