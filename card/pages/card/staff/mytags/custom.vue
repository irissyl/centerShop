<template>
	<view>
		<view class="card-toSearch-sec">
		    <input  @confirm="toSearchCardConfirm"  class="br-10" focus="true" placeholder="搜索客户" type="text" v-model="cardSearchKey" v-if="toSearchCard==true"></input>
		   <view @tap="toSearchLabel" class="input tc" v-else>
		        <i class="iconfont2 icon-sousuo" style="display: inline-block;">{{cardSearchKey?cardSearchKey:'搜索客户'}}</i>
			</view>
		</view>
		<view style="height:100rpx;"></view>
		<block v-if="labelInfo">
		    <view class="staff-myTag-title">标签名称</view>
		    <view class="staff-edit-tagName">
		        <view :class="tagType==1?'active':''">
		            <input class="fl" name="label_name" placeholder="编辑标签名称" type="text" v-model="labelInfo.name"></input>
		            <button :class="'fr br-5 tc ' + (tagType==1?'active':'')" @click="toEditSave" hoverClass="none">{{tagType==1?'保存':'修改'}}</button>
		        </view>
		    </view>
		    <view class="staff-myTag-title">标签成员</view>
		</block>
		<scroll-view  scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
		@scrolltolower="scrolltolowerFunc">
		<view class="message-sec custom-sec custom-sec2" v-if="customList.length>0">
		    <view v-for="(item, index) in customList" :key="index" @click="toJumpCustom(item)" class="child rel">
		        <image class="abs br-10" mode="aspectFill" :src="item.person_avatar||defaultUserImg"></image>
		        <view class="content">
		            <view class="flex">
		                <view class="flex100-5 ellipsis" style="flex:0 0 50%;">
		                    <i class="iconfont2 icon-shouji" style="display: inline-block;" v-if="item.tel"></i>
							<view style="display: inline-block;">{{item.nick_name?item.nick_name:'客户'}}</view>
						</view>
		                <view class="flex100-5 tr" style="flex:0 0 50%;">{{item.create_time}}</view>
		            </view>
		            <view class="text ellipsis flex">
		                <view class="flex100-5">{{item.count}}次互动</view>
		                <view class="flex100-5 tr" style="color:#4877bc;" v-if="item.status==1">进行中</view>
		                <view class="flex100-5 tr" style="color:#ff9000;" v-if="item.status==2">跟进中</view>
		                <view class="flex100-5 tr" style="color:#fc1111;" v-if="item.status==3">已完成</view>
		            </view>
		        </view>
		    </view>
		</view>
		
		<view class="page">
			<view class="loadmore" v-if="loading">
				<view class="loading"></view>
				<view class="loadmore_tips">正在加载</view>
			</view>
			<block v-else>
				<view class="loadmore loadmore_line" v-if="page>=last_page&&customList.length>0">
					<view class="loadmore_tips loadmore_tips_in-line">没有更多数据了</view>
				</view>
				<view class="loadmore loadmore_line" v-if="customList.length<=0">
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
				label_id:0,
				toSearchCard: !1,
				tagType: 0,
				customList:[],
				page: 1,
				last_page: 0,
				loading: !1,
				labelInfo:{},
				paramObj:{},
				cardSearchKey:'',
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
			}
		},
		onLoad(e) {
			this.label_id = e.label_id?e.label_id:0;
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
			getLabelData(){
				let self=  this;
				self._get('plus.card.client/getLabelData',
				{	
					page:self.page||1,
					label_id:self.label_id,
					keywords:self.cardSearchKey
				},function(res){
					if(res.code==1){
						self.customList = res.data.customList.data;
						self.last_page  = res.data.customList.last_page;
						self.labelInfo = res.data.labelInfo;
					}
				});
			},
			toEditSave(){
				if(this.tagType){
					let self=  this;
					self._get('plus.card.client/saveLabelData',
					{
						label_id:self.label_id,
						name:self.labelInfo.name,
					},function(res){
						if(res.code==1){
							uni.showToast({
								title:res.msg
							});
							self.labelInfo = res.data.labelInfo;
						}
					});
					this.tagType = 0;
				}else{
					this.tagType = 1;
				}	
			},
			/* 搜索栏点击事件 */
			toSearchLabel(){
				this.toSearchCard = true;
			},
			toSearchCardConfirm(){
				this.getLabelData();
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
			/* 跳转客户 */
			toJumpCustom(e){

				let path = '/card/pages/card/staff/custom/detail?client_id='+e.client_id;
				console.log(path);
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
		z-index: 0;
	}
	.card-toSearch-sec input,.card-toSearch-sec .input {
	    border-radius: 32rpx;
	    background: #ebebeb;
		
	}
	.message-sec.custom-sec2 .child {
	    height: auto;
	    padding-bottom: 0rpx;
	}
	
	.message-sec.custom-sec2 .child .content {
	    height: auto;
	    padding-bottom: 25rpx;
	}
	
	.message-sec.custom-sec2 .child .content .flex {
	    margin-top: 0rpx;
	}
	
	.message-sec.custom-sec2 .child .content .source {
	    font-size: 26rpx;
	    color: #969696;
	    height: 30rpx;
	    line-height: 30rpx;
	}
</style>
