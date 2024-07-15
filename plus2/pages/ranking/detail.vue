<template>
	<view>
		<view>
			<image :src="detail.image_url" style="width: 750rpx;height: 360rpx;" mode="aspectFit"></image>
		</view>
		<!--列表-->

		<view class="p30 bg-white" v-if="!loadding">
			<view class="d-a-c">
				<view class="ww50 tl">
					排名
				</view>
				<view class="ww100">
					{{detail.setting.ranking_name}}
				</view>
				<view class="ww50 tr">
					{{detail.setting.ranking_value}}
				</view>
			</view>
			<view class="d-a-c border-b p-30-0" v-for="(item, index) in tableData" :key="index">
				<view class="tl ww50">
					<text class="f24">{{index+1}}</text>
				</view>
				<view class="red ww100" >
					
					<view>
						<text class="pt10 gray9 f22">{{item[source.rank_key]}}</text>
					</view>
					<view v-if="item.agent_type==1">
						<text class="pt10 gray9 f22">{{item.entrance_date}}</text>
					</view>
				</view>
				<view class="red ww50 tr" >
					{{item[source.rank_value]}}
				</view>
			</view>
			<!-- 没有记录 -->  
			<view class="d-c-c p30" v-if="tableData.length==0 && !loading">
				<text class="iconfont icon-wushuju"></text>
				<text class="cont">{{$nw("亲，暂无相关记录哦")}}</text>
			</view>
			<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
		</view>
	</view>
</template>

<script>
    import uniLoadMore from "@/components/uni-load-more.vue";
	export default {
        components: {
            uniLoadMore
        },
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				/*顶部刷新*/
				topRefresh: false,
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*数据列表*/
				tableData: [],
				/*最后一页码数*/
				last_page: 0,
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 15,
				no_more: false,
				loading: true,
				points: 0,
				is_open: false,
				ranking_id:0,
				detail:{},
				source:{},
				api_url:''
			};
		},
        computed:{

			/*加载中状态*/
            loadingType(){
                if(this.loading){
                    return 1;
                }else{
                    if(this.tableData.length!=0&&this.no_more){
                        return 2;
                    }else{
                        return 0;
                    }
                }
            }
        },
		mounted() {
			this.setGlobalColor()
			
		},
		onReachBottom() {
			let self = this;
			if (self.page < self.last_page||self.no_more) {
				self.page++;
				self.getData();
			}
			self.no_more = true;

		},
		onShow() {
				/*获取数据*/
				
		},
		onLoad(e){
			this.ranking_id = e.ranking_id
			this.getInfo()
		},
		methods: {
			getInfo() {
				let self = this;
				self._get('plus.ranking.index/detail', {
					ranking_id:self.ranking_id
				}, function(res) {
					self.detail = res.data.detail
					uni.setNavigationBarTitle({
						title: self.detail.name
					}); 
					if(res.data.detail.setting.list_rows){
						self.list_rows = res.data.detail.setting.list_rows
					}
					
					if(res.data.detail.source){
						self.source = res.data.detail.source;
						self.api_url = res.data.detail.source.data_link
						self.getData();
					}
					self.loadding = false
				});
			},
			
			/*获取数据*/
			getData() {
				let self = this;
				let page = self.page;
				let list_rows = self.list_rows;
				
				if(self.api_url){
					var page_name = self.detail.source.page_name?self.detail.source.page_name:'page';
					var limit_name = self.detail.source.limit_name?self.detail.source.limit_name:'list_rows';
					let temp = [];
					let data = {};
					temp[page_name]=self.page;
					temp[limit_name]=self.list_rows;
					for(var key in temp){
						data[key]=temp[key]
					}
					uni.request({
						url: self.api_url,
						data: data,
						dataType: 'json',
						method: 'GET',
						success: (res) => {
							console.log(res)
							self.tableData = self.tableData.concat(res.data.data.list.data);
							self.loading = false;
							if (res.data.data.list.data.length<Number(self.list_rows)) {
								self.no_more = true;
								return false;
							}
						},
						fail: (res) => {
							console.log('请求失败')
						},
						complete: (res) => {
							console.log('请求结束')
						},
					});
					
				}
				
			},

			

		}
	};
</script>

<style>
	.points-top {
		height: 100rpx;
		padding: 0 30rpx;
		color: #FFFFFF;
		background: #f44f47;
	}
</style>
