<template>
	<view>
		<view class="card-toSearch-sec fix">
		    <input  @confirm="toSearchCardConfirm" class="br-10" placeholder="搜索标签" type="text" v-model="cardSearchKey" v-if="toSearchCard==true"></input>
		    <view @click="toSearchLabel" class="input tc" v-else>
		        <i class="iconfont2 icon-sousuo" style="display: inline-block;"></i>
				<view style="display: inline-block;">{{cardSearchKey?cardSearchKey:'搜索标签'}}</view>
			</view>
		</view>
		<view style="height:120rpx;"></view>
		<scroll-view  scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
		@scrolltolower="scrolltolowerFunc">
			<view class="staff-myTag-sec">
				<view v-for="(item, index) in labelList" :key="index" @click="toJumpLabel(item)" class="child flex" >
					<view class="flex100-5">{{item.name}}</view>
					<view class="flex100-5 tr">共{{item.clients}}位客户</view>
				</view>
			</view>
		
		
		<view class="page">
			<view class="loadmore" v-if="loading">
				<view class="loading"></view>
				<view class="loadmore_tips">正在加载</view>
			</view>
			<block v-else>
				<view class="loadmore loadmore_line" v-if="page>=last_page&&labelList.length>0">
					<view class="loadmore_tips loadmore_tips_in-line">没有更多数据了</view>
				</view>
				<view class="loadmore loadmore_line" v-if="labelList.length<=0">
					<view class="loadmore_tips loadmore_tips_in-line">没有找到数据</view>
				</view>
			</block>
		</view>
		</scroll-view>

	</view>
</template>

<script>
	export default {
		data() {
			return {
				labelList:[],
				page: 1,
				last_page:0,
				total_page: 1,
				loading: !0,
				toSearchCard: false,
				cardSearchKey: "",
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
	
			}
		},
		onLoad() {
			this.init();
			this.getLabelData();
		},
		onPullDownRefresh() {
			/*下拉到顶，页面值还原初始化*/
			this.getLabelData();
			
		},
		methods: {
			
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
					}
				});
			},
			/* 搜索栏点击事件 */
			toSearchLabel(){
				this.toSearchCard = true;
			},
			toSearchCardConfirm(){
				console.log(this.cardSearchKey);
				this.labelList = [];
				this.getLabelData();
			},
			getLabelData(){
				let self = this;
				self._get('plus.card.client/getLabelList',
				{
					keywords:self.cardSearchKey
				},
				function(res) {
					self.labelList = self.labelList.concat(res.data.labelList.data);
					self.last_page = res.data.labelList.last_page;
					self.loading = false;
					uni.hideLoading();
				});
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				let self = this;
				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					self.no_more = true;
					return;
				}
				self.getLabelData();
			},
			/* 跳转页面 */
			toJumpLabel(e){
				console.log(e.radar_label_id);
				let path = '/card/pages/card/staff/mytags/custom?label_id='+e.radar_label_id;
				this.gotoPage(path);
				
			}
		}
	}
</script>

<style scoped>
	@import "/card/statics/card.css";
	page {
	    background: #f0f0f4;
	}
	
	view,button {
	    display: block;
	    overflow: initial;
	}
	.card-toSearch-sec{
		position: absolute;
	}
	.card-toSearch-sec input,.card-toSearch-sec .input {
	    border-radius: 32rpx;
	    background: #ebebeb;
	}
</style>
