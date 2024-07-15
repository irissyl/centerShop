<template>
	<view>
		<view class="container">
		    <view class="top">
		        <view class="old" v-if="lists.length>0">
		            <view v-for="(item, index) in lists" :key="index" :class="(param.fromstatus=='boss'?'tx_col_ba':clickIndex==index?'tx_col_ba_c':'tx_col_ba') + ' center_label'">
		                <text>{{item.name}}</text>
		                <block v-if="param.fromstatus!='boss'">
		                    <text @click="reduceTags(item)" class="iconfont2 icon-shanchu"></text>
		                </block>
		            </view>
		        </view>
		        <view style="margin:0rpx auto;font-size:30rpx;color:#333;line-height:200rpx;" v-if="param.fromstatus=='boss'&&lists.length==0">暂未添加标签</view>
		        <input @confirm="blur_addsInput" placeholder="添加标签" style="width:100rpx;font-size: 12px;" v-model="addsInput" v-if="param.fromstatus!='boss'"></input>
		    </view>
		    <view class="center" v-if="param.fromstatus!='boss'">
		        <text class="center_title">所有标签</text>
		        <view class="center_labels">
		            <view v-for="(item, index) in tagsList" :key="index" @click="selectClick(item)" class="tx_col_ba center_label">
		                <text>{{item.name}}</text>
		            </view>
		        </view>
		    </view>
		    <!-- <view :class="globalData.isIphoneX?'isIphoneX':''" style="height:100rpx;"></view> -->
		    <view :class="'bottom ' + (globalData.isIphoneX?'isIphoneX':'')" v-if="param.fromstatus!='boss'">
		        <text @click="return1">确定发布</text>
		    </view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				tagsList: [],
				lists: [],
				addsInput: "",
				clickIndex: "0",
				globalData: "",
				param: {
					fromstatus:''
				}
			}
		},
		onLoad(e) {
			this.client_id = e.client_id;
			this.param.fromstatus = e.fromstatus;
			this.getAllTags();
		},
		methods: {
			/* */
			getAllTags(){
				let self = this;
				self._get('plus.card.client/getAllTags',
				{
					client_id:self.client_id
				},
				function(res){
					if(res.code ==1){
						self.tagsList = res.data.tagsList;
						self.lists = res.data.lists;
					}
				});
			},
			/* 选择 */
			selectClick(e){
				let self = this;
				let radar_label_id  = e.radar_label_id;
				self._get('plus.card.client/selectClick',{
					client_id:self.client_id,
					radar_label_id:radar_label_id,
					type:'add'
				},function(res){
					
					if(res.code ==1){
						self.getAllTags();
					}
				});
			},
			/* 减少标签 */
			reduceTags(e){
				let self = this;
				let label_id  = e.label_id;
				self._get('plus.card.client/selectClick',{
					client_id:self.client_id,
					radar_label_id:label_id,
					type:'reduce'
				},function(res){
					
					if(res.code ==1){
						self.getAllTags();
					}
				});
			},
			/* 发布新标签 */
			return1(){
				let self = this;
				let addsInput  = self.addsInput;
				self._get('plus.card.client/addLabel',{
					client_id:self.client_id,
					name:addsInput,
				},function(res){
					
					if(res.code ==1){
						self.getAllTags();
					}
				});
			}
		}
	}
</script>
	
<style>
@import "/card/statics/card.css";
	.container {
	    width: 750rpx;
	    display: flex;
	    flex-direction: column;
		padding: 0;
	}
	
	.top {
	    width: 750rpx;
	    min-height: 200rpx;
	    display: flex;
	    font-size: 24rpx;
	    background: #fff;
	    flex-wrap: wrap;
	}
	
	.old {
	    display: flex;
	    flex-wrap: wrap;
	}
	
	.old view {
	    height: 45rpx;
	    padding: 0rpx 15rpx;
	    border-radius: 50rpx;
	    display: flex;
	    align-items: center;
	    margin: 20rpx 20rpx;
	}
	
	.tx_col_ba {
	    color: #e93636;
	    background: #fceeee;
	}
	
	.tx_col_ba_c {
	    color: #e93636;
	    background: #f4bfbf;
	}
	
	input {
	    height: 45rpx;
	    padding: 0rpx 20rpx;
	    border: 1px dotted #c6c6c6;
	    margin: 20rpx 20rpx;
	    border-radius: 30rpx;
	}
	
	.center {
	    width: 750rpx;
	    min-height: 200rpx;
	    display: flex;
	    font-size: 24rpx;
	    background: #fff;
	    margin-top: 20rpx;
	    flex-direction: column;
	}
	
	.center_title {
	    font-size: 30rpx;
	    padding: 20rpx;
	}
	
	.center_labels {
	    width: 750rpx;
	    padding: 20rpx 0;
	    display: flex;
	    flex-wrap: wrap;
	}
	
	.center_label {
	    margin: 5rpx 15rpx;
	    padding: 10rpx 20rpx;
	    border-radius: 30rpx;
	    position: relative;
	}
	
	.icon-shanchu {
	    position: absolute;
	    top: -10rpx;
	    right: -22rpx;
	    color: #717171;
	}
	
	.bottom {
	    position: fixed;
	    bottom: 0rpx;
	    width: 750rpx;
	    height: 100rpx;
	    background: #fff;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	}
	
	.bottom text {
	    background: #e93636;
	    width: 700rpx;
	    height: 80rpx;
	    color: #fff;
	    display: flex;
	    justify-content: center;
	    align-items: center;
	}
</style>
