<template>
	<view class="search-wrap">

		<!-- 搜索框 -->
		<view class="index-search-box d-b-c" id="searchBox">
			<view class="index-search t-c flex-1">
				<span class="icon iconfont icon-sousuo"></span>
				<input type="text" v-model="form.keyWord" class="flex-1 ml10 f30 gray3" value=""
					placeholder-class="f24 gray6" :placeholder="$nw('输入你要查询的商品')" confirm-type="search"
					@confirm="search()" />
			</view>
			<!--<button class="btn ml10" @click="search()" type="default">搜索</button>-->
		</view>

		<view class="p-0-20 bg-white">
			<view class="group-hd">
				<view class="left">
					<text class="min-name">{{$nw('最近搜索')}}</text>
				</view>
				<view class="right">
					<span class="icon iconfont icon-lajitong" @click='clearStorage'></span>
				</view>
			</view>
			<view class="before-search">
				<text class="item" v-for="(item,index) in arr" :key="index"
					@click="search(arr[index])">{{ arr[index] }}</text>
			</view>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: '',
				assemble_activity_id: 0,
				form: {},
				arr: [],
			}
		},
		onShow() {
			uni.setNavigationBarTitle({
				title: this.$nw("搜索")
			});
		},
		onLoad(e) {
			if (e.type) {
				this.type = e.type;
			}
			if (e.assemble_activity_id) {
				this.assemble_activity_id = e.assemble_activity_id;
			}
		},
		mounted() {
			this.setGlobalColor()
			/*获取缓存数据*/
			this.getData();
		},
		methods: {
			/*获取缓存里的搜索历史*/
			getData() {
				let self = this;
				/*获取搜索记录*/
				uni.getStorage({
					key: 'search_list',
					success: function(res) {
						if (res != null && res.data != null) {
							self.arr = res.data;
						}
					}
				});

			},
			/*搜索*/
			search(str) {
				let self = this;
				let search = null;
				if (str != null) {
					search = str;
				} else {
					search = this.form.keyWord;
					let arrs = this.arr;
					if (typeof search != "undefined" && search != null && search != '') {
						arrs.push(search);
					} else {
						uni.showToast({
							title: self.$nw("请输入搜索的关键字"),
							icon: 'none',
							duration: 2000
						});
						return false;
					}
					/*设置搜索记录*/
					uni.setStorage({
						key: 'search_list',
						data: arrs,
						success: function() {
							console.log('success');
						}
					});
				}
				let category_id = 0;
				let sortType = 'all';
				let url = '/main/pages/product/list/list?search=' + search + '&category_id=' + category_id + '&sortType=' +
					sortType;
				if (this.type == 'supply') {
					url = '/plus/pages/supply/product/list/list?search=' + search + '&category_id=' + category_id +
						'&sortType=' + sortType + '&assemble_activity_id=' + this.assemble_activity_id;
				}
				uni.redirectTo({
					url: url,
				});

			},
			/*清楚缓存*/
			clearStorage() {
				let self = this;
				uni.removeStorage({
					key: 'search_list',
					success: function(res) {
						self.arr = [];
					}
				});
			}
		}
	}
</script>

<style>
	.search-wrap .index-search-box .search-box {
		padding: 0 20rpx;
		height: 64rpx;
		line-height: 64rpx;
		background: #f7f7f7;
		border-radius: 50rpx;
		overflow: hidden;
		font-size: 28rpx;
		color: #999;
		box-sizing: border-box;
	}

	.search-wrap .index-search-box button {
		height: 78rpx;
		line-height: 78rpx;
		border: solid 1rpx #CCCCCC;
		color: #333333;
		background: #FFFFFF;
	}

	.before-search {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		flex-flow: wrap;
		margin-left: -16rpx;
	}

	.before-search .item {
		padding: 12rpx 20rpx;
		margin-left: 16rpx;
		margin-bottom: 16rpx;
		border-radius: 8rpx;
		color: #686868;
		background: #f0f2f5;
		font-size: 24rpx;
		line-height: 1;
	}
</style>