<template>
	<view class="">
		<view class="cell-list" :style="'background:'+getMainColor()+';'">
	
			<view class="card-item share-btn card-item-view" 
			:style="'background:'+getSecondBackgroundColor()+';'"
				v-for="(item, index) in projectData" @click="gotoClick(item)" :key="index">
				<view class="diy-product">
					<view class="product-list column__1">

						<view class="" style="width: 95%;margin: auto;">
							<view class="yuyue0">
								<view class="yuyue">
									<view class="yuyue_1">
										<image v-if="item.user" :src="item.user.avatarUrl" mode=""></image>
									</view>

									<view class="yuyue_2">
										<view class="yuyue_2_1" v-if="item.user" :style="'color:'+getMainTextColor()+';'">
											{{item.user.nickName}}
										</view>

										<view class="yuyue_2_3" :style="'color:'+getMainTextColor()+';'">
											<text v-if="item.user"  style="font-size: 24rpx;">
												<text v-if="item.user.post">{{item.user.post}} </text>
												<text style="margin-left: 5rpx;margin-right: 5rpx;" v-if="item.user.post && item.user.company_name"> | </text> 
												<text v-if="item.user.company_name"> {{item.user.company_name}}</text>
											</text>
										</view>

									</view>

								</view>

							</view>
						</view>

						<view class="product-item-box">
							<view class="product-info">
								<!-- 项目名称 -->
								<view class="product-title">
									<view v-if="item.type_name" class="product-title_label" style="margin-top: 5rpx;">
										{{$nws(item.type_name.label)}}
									</view>
									<view class="product-title_title" style="margin-left: 10rpx; float: left;"
									:style="'color:'+getTextColorWhite()+';'">{{ item.title }}</view>
									<view style="clear: both;">

									</view>
								</view>
								<!-- 行业名称 -->
								<view class="selling-point" style="margin-left: 15rpx; padding: 0rpx;" :style="'color: '+getTextColorGrey()+';'">
									<text>{{$nw("行业分类")}}：</text>
									<text>{{item.category?item.category.name:''}}</text>
								</view>
								
								
								<view style="margin-left: 15rpx;padding:0rpx; height: 50rpx;line-height: 50rpx; " :style="'color: '+getTextColorGrey()+';'">
									<text class="projectIntroduce_text" style="padding:0rpx;">{{$nw("项目介绍")}}：</text>
									<view class="projectIntroduce" style="line-height: 50rpx;">
										{{item.introduce}}
									</view>
								</view>

							</view>

						</view>
						<view class="product-item-box" v-if="item.type==1">
							<view class="product-info">
								<!-- 项目名称 -->
								<view class="product-title">
									<text>{{ item.company }}</text>
								</view>
								<!-- 行业名称 -->
								<view class="selling-point" :style="'color: '+getTextColorGrey()+';'">
									<text>{{$nw("投资地区")}}：</text>
									<text>{{item.region.province?item.region.province:''}}
										{{item.region.city?item.region.city:''}}
										{{item.region.region?item.region.region:''}}</text>
								</view>

								<view class="selling-point" :style="'color: '+getTextColorGrey()+';'">
									<text>{{$nw("投资金额")}}：</text>
									<text v-if="item.budget>10000">{{item.budget/10000}}万</text>
									<text v-else>{{item.budget}}元</text>
								</view>

								<view class="selling-point" :style="'color: '+getTextColorGrey()+';'">
									<text class="">{{$nw("投资行业")}}：</text>
									<text>{{item.category_id?item.category.name:''}}</text>
								</view>

							</view>
						</view>
					</view>


					<view class="" style="font-size: 28rpx;text-align: right;" :style="'color: '+getTextColorGrey()+';'">
						{{item.time}} {{item.view}} {{$nw("次浏览")}}
					</view>
				</view>
			</view>



		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user_id: uni.getStorageSync("user_id")
			}
		},
		props: ["projectData"],

		computed: {
		
		},
		methods:{
			gotoClick(e) {
				let path = '/plus2/pages/project/detail?project_id=' + e.project_id + '&type=' + e.type
				uni.navigateTo({
					url: path
				})
			}
		}
	
	
	}
</script>

<style lang="scss">
	.product-item-list .product-item-head .state-text {
		margin-top: auto;
		vertical-align: middle;
	}

	.product-item-list .item {
		margin-top: 30rpx;
		padding: 30rpx;
		background: #FFFFFF;
	}

	.product-item-list .product-list,
	.product-item-list .one-product {
		padding: 20rpx 0;
		height: 160rpx;
	}

	.cell-list {
		background: #fff;
		padding: 0 32rpx;
	}

	.card-item {
		border-radius: 20rpx;
		margin: auto;
		padding: 16rpx 0;
		background: #fff;

		margin-top: 20rpx;
	}

	.diy-product {
		padding: 20rpx 20rpx;
		padding-top: 5rpx;
		padding-bottom: 0rpx;
		/* background-color: gray; */
	}

	.diy-product .product-list.column__1 .product-item {
		/* margin-bottom: 20rpx; */
		/* margin-top: 1rpx; */
		width: 100%;
		background: #ffffff;
	}

	.diy-product .product-list.column__1 .product-item-box {
		display: flex;
		justify-content: flex-start;
		align-items: stretch;
		/* padding-left: 20rpx; */
		/* background-color: #09BB07; */
	}

	.diy-product .product-list .product-cover image {
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
		/* margin:20rpx 20rpx 20rpx 30rpx; */
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
	// display: -webkit-box;
	font-size: 32rpx;
	// overflow: hidden;
	// -webkit-line-clamp: 2;
	// -webkit-box-orient: vertical;
	padding: 8rpx;
	padding-bottom: 0rpx;
	height: 50rpx;
	}

	.diy-product .product-list .product-title .product-title_label {
		float: left;
		padding-left: 20rpx;
		padding-right: 20rpx;
		height: 40rpx;
		line-height: 40rpx;
		text-align: center;
		font-size: 24rpx;
		border-radius: 30rpx;
		background: #ffaa00;
		color: #fff;
	}
.diy-product .product-list .product-title .product-title_title{
	width: 400rpx;
		height: 50rpx;
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
	}



	.diy-product .product-list.column__1 .selling-point {
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		// line-height: 30rpx;
		// max-height: 60rpx;
		padding: 8rpx;
	}

	.diy-product .product-list.column__1 .already-sale {
		margin-top: 10rpx;
	}

	.reportBtn {
		position: relative;
		left: 180rpx;
		width: 150rpx;
		text-align: center;
		padding: 10rpx 10rpx;
		border-radius: 50rpx;
		background-color: #5b67fb;
		color: #ffffff;
	}

	.reportBtn.inactive {
		background-color: #adadad;
	}

	.left-product-item {
		display: flex;
		align-items: center;
	}

	.left-product-item>image,
	.left-product-item>img {
		width: 200rpx;
		height: 200rpx;
		margin-right: 40rpx;
	}

	.product-item-right {
		display: flex;
		flex-direction: column;
	}

	.product-item-right>view:nth-child(2) {
		width: 420rpx;
		display: inline-block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.price-other {
		display: flex;
		align-items: center;
	}

	.price-other .price-other-item {
		width: 100rpx;
	}

	.projectIntroduce_text {
		padding: 10rpx 0;
		display: inline-block;
		overflow: hidden;
	}

	.projectIntroduce {
		width: 420rpx;
		/* word-break: ; */
		display: inline-block;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		word-break: break-all;

	}

	.tab {
		width: 100%;
		background: #fff;
		padding-bottom: 10rpx;



	}

	.tabbar-wrapper {
		width: 100%;
		overflow-x: auto;
		white-space: nowrap;
		padding: 24rpx 0;

		& .tabbar-item {
			text-align: center;
			display: inline-block;
			position: relative;
			padding-left: 25rpx;
			padding-right: 25rpx;

			&__active {
				&::after {
					content: '';
					width: 90rpx;
					position: absolute;
					bottom: 0;
					left: 0;
					right: 0;
					margin: auto;
					border-bottom: 4rpx solid #1F1A17;
				}
			}
		}
	}

	.yuyue0 {
		width: 100%;
		margin: auto;
		padding-bottom: 30rpx;
	}

	.yuyue {


		width: 100%;
		margin: auto;

		display: flex;




		.yuyue_1 {

			flex: 1.5;

			image {
				width: 100rpx;
				height: 100rpx;


				border-radius: 5rpx;

			}
		}

		.yuyue_2 {
			flex: 7;

			.yuyue_2_1 {
				width: 95%;
				font-size: 34rpx;
				margin: auto;
				margin-top: 10rpx;
				line-height: 40rpx;
			}

			.yuyue_2_3 {
				width: 95%;
				font-size: 30rpx;
				margin: auto;

			}

			.yuyue_2_4 {
				width: 90%;
				font-size: 30rpx;
				margin: auto;
				margin-top: 5rpx;
				color: #c3c1bb;
			}

		}
	}
</style>