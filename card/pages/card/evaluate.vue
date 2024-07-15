<template>
	<view class="look-evaluate">
	

		<!--评论列表-->
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			 @scrolltolower="scrolltolowerFunc">
			<view class="comment-list">
				<view class="item" 
				 v-for="(item, index) in tableData" 
				:key="index" >
					<view class="cmt-user">
						<view class="left">
							<image class="photo" :src="item.user.avatarUrl" mode="aspectFill"></image>
							<text class="name">{{ item.user.nickName }}</text>
							<view style="float: left;margin-left: 10rpx;" v-if="item.ind">
								<image v-for="(itemA,indexA) in item.ind"  :key="indexA"
								style=" margin-right: 4rpx; width: 30rpx;height: 30rpx;float: left;"
								src="/static/start.png" mode=""></image>
								<view style="clear: both;"></view>
							</view>
						</view>
					</view>
					<view class="p-0-20 f24 gray3" 
					style="width: 80%;margin-left: 13%;">{{ item.content }}</view>
					<view class="p20" style=" width: 95%; text-align: right;">
				
						<text class="datetime gray9">{{ item.create_time }}</text>
					</view>
					
					
				</view>
				<!-- 没有记录 -->
				<view class="d-c-c p30" v-if="tableData.length==0 && !loading">
					<view class="none-data-box">
						<image src="http://imgh5.y01.cn/20210606225550dd5f35541.png" mode="widthFix"></image>
						<text>{{$nw("亲，暂无相关记录哦")}}</text>
					</view>
				</view>
				<uni-load-more v-else :loadingType="loadingType"></uni-load-more>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import uniLoadMore from "@/components/uni-load-more.vue";
export default {
	components:{
		uniLoadMore
	},
	data() {
		return {
			/*手机高度*/
			phoneHeight: 0,
			/*可滚动视图区域高度*/
			scrollviewHigh: 0,
			/*选中状态*/
			state_active: -1,
			/*商品id*/
			card_id: 0,
			/*评论列表*/
			tableData: [],
			/*统计*/
			Total: {
				/*总数*/
				all: 0,
				/*score = 10*/
				praise: 0,
				/*score = 20*/
				negative: 0,
				review: 0
			},
			/*页码*/
			page: 1,
			list_rows: 15,
			no_more: false,
			loading: true,
			/*最后一页码数*/
			last_page: 0
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
		},
		

    active() {
      return (state_active, value) => {
        if (state_active === value) {
          return Object.assign(this.setColor(true), {'border-bottom': '2px solid ' + this.getMainColor()})
        }
      }
    },

	},
	onLoad(e) {
		this.card_id = e.card_id;
	},
	mounted() {
    this.setGlobalColor()
		this.init();
		/*获取数据*/
		this.getData();
	},
	methods: {
		/*初始化*/
		init() {
			let self = this;
			uni.getSystemInfo({
				success(res) {
					self.phoneHeight = res.windowHeight;
					// 计算组件的高度
					self.scrollviewHigh =  self.phoneHeight ;
				}
			});
		},

		/*获取数据*/
		getData() {
			let self = this;
			self._get(
				'plus.card.card/getCardComment',
				{
					card_id: self.card_id,
					page: self.page,
					list_rows: self.list_rows
				},
				function(res) {
					self.loading = false;
					self.Total = res.data.total;
					self.tableData = self.tableData.concat(res.data.list.data);
					self.tableData = self.getUnique(self.tableData,"card_comment_id");
					self.last_page = res.data.list.last_page;
					if (res.data.list.last_page <= 1) {
						self.no_more = true;
					}
				}
			);
		},
		
		/*可滚动视图区域到底触发*/
		scrolltolowerFunc() {
			let self = this;
			self.bottomRefresh = true;
			self.page++;
			self.loading = true;
			if (self.page > self.last_page) {
				self.loading = false;
				self.no_more = true;
				return;
			}
			self.getData();
		},

		/*类别切换*/
		stateFunc(e) {
			let self = this;
			if(self.state_active!=e){
				self.tableData = [];
				self.no_more = false;
				self.loading = true;
				self.state_active = e;
				self.page = 1;
				self.getData();
			}
		}
	}
};
</script>

<style>
.look-evaluate .comment-list {
	background: #ffffff;
}
.look-evaluate .comment-list .item {
	padding-top: 30rpx;
	padding-bottom: 30rpx;
	border-top: none;
	border-bottom: 1px solid #dddddd;
}

.look-evaluate .iconfont {
	border-radius: 50%;
	font-size: 40rpx;
	text-align: center;
}

.look-evaluate .icon-pingjiahaoping {
	color: #f42222;
}

.look-evaluate .icon-pingjiazhongping {
	color: #f2b509;
}

.look-evaluate .icon-pingjiachaping {
	color: #999999;
}

.look-evaluate .imgs {
	flex-wrap: wrap;
}

.look-evaluate .imgs .box {
	margin-top: 10rpx;
	margin-right: 10rpx;
}

.look-evaluate .imgs .box:nth-child(3n) {
	margin-right: 0;
}

.look-evaluate .imgs .box,
.look-evaluate .imgs .box image {
	width: 210rpx;
	height: 210rpx;
}
</style>
