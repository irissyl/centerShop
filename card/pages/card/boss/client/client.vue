<template>
	<view>
		<view class="boss-client-top-sec tc">共有<text>{{total_count||0}}</text>位客户</view>
		<view class="message-sec" v-if="dataList.length>0">
		    <view v-for="(item, index) in dataList" :key="index"  class="child rel" @click="toCusDetail(item)" style="line-height: 1;">
		        <image class="abs br-10" mode="aspectFill" :src="item.person_avatar?item.person_avatar:defaultUserImg"></image>
		        <view class="content">
		            <view class="flex">
		                <view class="flex100-5 ellipsis">
		                    {{item.nick_name?item.nick_name:'新客户'}}
						</view>
		                <view class="flex100-5 tr" v-if="item.status!=1">AI成交率{{item.deal_rate?item.deal_rate*100:0}}%</view>
		            </view>
		            <view class="flex" style="margin:0rpx;">
		                <view class="flex100-5 ellipsis" style="flex:0 0 30%;color:#e93636;">
		                    <block v-if="item.status==1">新增客户</block>
		                    <block v-if="item.status==2">开始跟进</block>
		                    <block v-if="item.status==3">已成交</block>
		                </view>
		                <view class="flex100-5 tr" style="flex:0 0 70%;" v-if="item.status!=1">预计成交时间：{{item.date==0?'未设置':item.date}}</view>
		               
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
				defaultUserImg:'',
				user_id:0,
				total_count:0,
				dataList:[],
				page:1,
				last_page:0
			}
		},
		onLoad(e) {
			this.user_id = e.to_user_id;
			this.getCustomList();
		},
		methods: {
			getCustomList(){
				let self = this;
				self._get('plus.card.boss/custom',{
					user_id:self.user_id,
					page:self.page
				},function(res){
					if(res.code==1){
						self.dataList = self.dataList.concat(res.data.customList.data);
						self.last_page = res.data.customList.last_page;
						self.total_count = res.data.customList.total;
					}
					console.log(res);
				})
			},
			toCusDetail(e){
				let client_id = e.radar_client_id;
				let path = '/card/pages/card/staff/custom/detail?client_id='+client_id+"&fromstatus=boss";
				this.gotoPage(path)
			}
		}
	}
</script>

<style scoped>
	view{
	    display: block;
	    overflow: initial;
		line-height: initial;
	}
	.boss-client-top-sec {
	    width: 100%;
	    height: 70rpx;
	    line-height: 70rpx;
	    display: block;
	    font-size: 24rpx;
	    color: #636363;
	    background: #fafafa;
	    border-bottom: 1rpx solid #ededed;
	}
	
	.boss-client-top-sec text {
	    color: #e93636;
	}
	.tc {
	    text-align: center;
	}
	.br-10 {
	    border-radius: 10rpx;
	}
	.abs {
	    position: absolute;
	}
	.rel {
	    position: relative;
	}
	.message-sec {
	    width: 100%;
	    height: auto;
	    display: block;
	    background: white;
	    border-bottom: 1rpx solid #ededed;
	}
	
	.message-sec .child {
	    width: 96%;
	    height: 90rpx;
	    padding: 25rpx 0rpx 25rpx 4%;
	}
	
	.message-sec .child image {
	    width: 90rpx;
	    height: 90rpx;
	    display: block;
	    left: 4%;
	}
	
	.message-sec .child em {
	    top: 10rpx;
	    left: 70rpx;
	    right: inherit;
	}
	
	.message-sec .child .content {
	    height: 90rpx;
	    margin-left: 110rpx;
	    padding: 0rpx 4% 15rpx 0rpx;
	    border-bottom: 1rpx solid #ededed;
	}
	
	.message-sec .child .content .flex {
	    margin: 10rpx 0rpx 5rpx 0rpx;
	}
	
	.message-sec .child .content .flex .flex100-5 {
	    font-size: 28rpx;
	    color: #303030;
	}
	
	.message-sec .child .content .flex .flex100-5 i.icon-shouji {
	    color: #c0c0c0;
	    font-size: 28rpx;
	}
	
	.message-sec .child .content .flex .flex100-5 i.icon-xingji {
	    color: #fab161;
	    font-size: 28rpx;
	    margin-left: 10rpx;
	}
	
	.message-sec .child .content .flex .tr {
	    color: #6a6a6a;
	}
	
	.message-sec .child .content .text {
	    font-size: 24rpx;
	    color: #989898;
	}
	.flex, .flex100 {
	    display: flex;
	    align-items: center;
	    justify-content: space-between;
	}
	.flex100-5 {
	    flex: 0 0 50%;
	    box-sizing: border-box;
	}
	.ellipsis {
	    display: block;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	}
	
</style>
