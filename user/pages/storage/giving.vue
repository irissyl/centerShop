<template style="background-color: rgba(227, 227, 227, 1);position: relative; ">
	<view v-if="!loadding" class="uni-padding-wrap">
		<view class="uni-flex uni-column" style="border-radius: 5px; background-color:#FFFFFF;margin-bottom: 14rpx;">
			<!-- <view  class="products">商品</view> -->
			<view class="uni-flex uni-row" style="height: 238rpx; margin-bottom: 14rpx;">
				<view class="uni-flex" style="-webkit-justify-content: center;justify-content: center;-webkit-align-items: center;align-items: center;">
					<image :src="detail.image.file_path"></image>
				</view>
				<view class="uni-flex uni-column" style="-webkit-flex: 1;flex: 1;-webkit-justify-content: space-between;justify-content: center;">
					<view class="uni-flex uni-row">
						<view class="text" style="padding-left: 40rpx;">{{$nw("名称")}}</view>
						<view class="text"  style="padding-left: 40rpx;">{{detail.product_name}}</view>
					</view>
					<view class="uni-flex uni-row">
						<view class="text" style="padding-left: 40rpx;">{{$nw("规格")}}</view>
						<view class="text" style="padding-left: 40rpx;">{{detail.product_attr}}</view>
					</view>
					<view class="uni-flex uni-row">
						<view class="text" style="padding-left: 40rpx;">{{$nw("数量")}}</view>
						<view class="text" style="padding-left: 40rpx;">{{detail.number}}</view>
					</view>
				</view>
			</view>
		</view>

		<view class="jiu">
			<view class="title">{{$nw("赠送")}}</view>

			<view class="giving-cont">
				<view class="con-tips">
					<view class="left-con">{{$nw("赠送数量")}}：
					</view>
				</view>
				<view class="right-con">
					<input @input="receiveNumber" v-model="receivenumber" placeholder-class="d-c" type="number" value="" 
					 :placeholder="$nw('请输入赠送数量')" />
				</view>
			</view>
			<view class="giving-cont">
				<view class="con-tips">
					<view class="left-con">{{$nw("接收方式")}}：
					</view>
				</view>
				<view class="right-con">
					<radio-group style="display: flex;"@change="checkoutOne" >
						<label class="radio">
							<radio value="userid" style="transform:scale(0.7)" /><text>{{$nw("会员ID")}}</text>
						</label>
						<label class="radio">
							<radio value="phonenumber" checked style="transform:scale(0.7)"/><text>{{$nw("手机号码")}}</text>
						</label>
					</radio-group>
				</view>
			</view>

			<view class="giving-cont">
				<view class="con-tips">
					<view class="left-con">
						{{$nw("信息")}}：
					</view>
				</view>
				<view class="right-con" style="width: 60%;display: flex;">
					<input  @input="receivePhone" v-model="receivephone" placeholder-class="d-c" type="number" maxlength="11" value="" 
					 :placeholder="$nw('请输入')"/>
					<view class="" style=" margin-left: 20rpx;">
						<button style="width: 140rpx;height: 56rpx;line-height: 56rpx;" type="primary" @click="search()">{{$nw("查询")}}</button>
					</view>
				</view>
			</view>
			<view class="giving-cont" style="width: 100%;">
				<view v-if="isNull ==1" class="" style="margin: 0 auto;">
					{{$nw("用户昵称")}}：{{userinfo.nickName}}
				</view>
				<view v-if="isNull==2" class="" style="margin: 0 auto;">
					{{$nw("未查询到该用户")}}
				</view>
			</view>
			<view style="padding-bottom: 40rpx;"><button type="warn"style="width: 40%;margin: auto;margin-top: 5%;" @click="confirm_giving(detail.storage_id)">{{$nw("确认")}}</button></view>
		</view>

		<view v-if="vars.detail" class="shuoming" style="border-radius: 5px;padding-bottom: 30rpx;margin-top: 18rpx;font-weight: blod;">
			<view class="uni-text">{{$nw("赠送说明")}}：</view>
			<view class="uni-text" v-html="vars.detail"></view>
		</view>

	</view>
</template>

<script>

	import '@/common/uni.css';
	import utils from '@/common/utils.js';
	export default {
		components: {

		},
		data() {

			return {
					/*是否加载完成*/
					loadding: true,
					/*酒id*/
					storage_id: 0,
					/*酒详情*/
					detail: {},
					vars: {},
					/*输入框值*/
					receivenumber:'',
					receivephone:'',
					receiveway:'phonenumber',
					userinfo:{},
					isNull:'',
				};
		},
		onLoad(e) {
			this.storage_id = e.storage_id;
		},
		mounted() {
      this.setGlobalColor()
			uni.showLoading({
				title: this.$nw("加载中")
			});
			/*获取酒详情*/
			this.getData();
		},
		methods: {

			/*获取数据*/
			getData() {
				let self = this;
				let storage_id = self.storage_id;
				self._get(
					'plus.storage.storage/detail',
					{
						storage_id: storage_id
					},
					function(res) {

						self.detail = res.data.detail;
						self.vars.detail = '';
						if(res.data.vars.giving_detail){
							self.vars.detail = utils.preText(res.data.vars.giving_detail);
						}
						self.loadding = false;
						uni.hideLoading();
					}
				);
			},
			receiveNumber:function(e){
				this.receiveumber=e.target.value;
			},
			receivePhone:function(e){
				this.receivephone = e.target.value;
			},
			checkoutOne(e){
				this.receiveway= e.detail.value;

			},

			//查询用户
			search(){
				let self =this;
				let receiveway =self.receiveway;
				let param= self.receivephone;
				if(param==''&& receiveway=='userid'){
					uni.showToast({
					title: self.$nw("请输入会员ID"),
					icon:'none',
					duration: 2000
					});
					return;
				}
				if(param==''&& receiveway=='phonenumber'){
					uni.showToast({
					title: self.$nw("请输入手机号码"),
					icon:'none',
					duration: 2000
					});
					return;
				}
				self._get(
					'plus.storage.storage/searchUser',
					{
						receiveway: receiveway,
						param:param
					},
					function(res) {
						self.userinfo=res.data.userinfo;
						if(self.userinfo){
						 self.isNull=1;
						}
						else{
							 self.isNull =2;
						}
					}
				);
			},

			//确认赠送
			confirm_giving(storage_id){
				let self=this;
				let num= self.receivenumber;
				let phone= self.receivephone;
				let number =self.detail.number;
				let receiveway =self.receiveway;
				let params = {
					num:num,
					phone:phone,
					receiveway:receiveway,
					storage_id:storage_id
				};
				if(num==''){
					uni.showToast({
					title: self.$nw("请输入赠送数量"),
					icon:'none',
					duration: 2000
					});
					return;
				}
				if(num==0){
					uni.showToast({
					title: self.$nw("赠送数量不能为0"),
					icon:'none',
					duration: 2000
					});
					return;
				}
				if(num>number){
					uni.showToast({
					title: self.$nw("赠送数量不能大于库存数量"),
					icon:'none',
					duration: 2000
					});
					return;
				}
				if(phone==''&& receiveway=='userid'){
					uni.showToast({
					title: self.$nw("请输入会员ID"),
					icon:'none',
					duration: 2000
					});
					return;
				}
				if(phone==''&& receiveway=='phonenumber'){
					uni.showToast({
					title: self.$nw("请输入手机号码"),
					icon:'none',
					duration: 2000
					});
					return;
				}
				self._get(
					'plus.storage.storage/giving',
					{
						params:params
					},
					function(res) {
						self.status=res.data;
						if(self.status==1){
							uni.reLaunch({
								url: '/user/pages/storage/part/giving-success?storage_id='+storage_id+'&user_id='+self.detail.user_id+'&product_img='+self.detail.image.file_path +'&number='+self.receivenumber
							});
						}
					}
				);
			},
		}
	}
</script>

<style>

	.uni-padding-wrap{
		padding: 0 20rpx;
		width: 710rpx;
	}
	.img{
		width: 100%;
		height: 300rpx;
		}
	.uni-flex image{
		margin-left: 16rpx;
		width: 200rpx;
		height: 200rpx;
		border-radius: 5px;
	}

	.jiu {
		margin-top: 18rpx;
		margin-bottom: 8rpx;
		background-color:#FFFFFF;
		border-radius: 5px;
	}
	.title{
		font-size: 14px;
		height: 80rpx;
		line-height:80rpx;
		padding-left: 10rpx;
		padding-left:20rpx;
		/* border-bottom: 4rpx solid #CCCCCC; */
		font-weight: bold;
	}

	.title1{
		line-height:50rpx;
		padding-left:20rpx;
		padding-bottom: 14rpx;

	}
	.jiu .uni-row{
		margin-top: 0rpx;
		-webkit-flex-wrap: wrap;
		flex-wrap: wrap;
		-webkit-flex: 1;
		flex: 1;
		margin-bottom: 24rpx;
	}
	.jiu .text {
		padding: 0 35rpx;
		height: 112rpx;
		border-radius: 5px;
		line-height: 112rpx;
		text-align: center;
		font-size: 28rpx;
		margin-right: 35rpx;
		margin-bottom: 14rpx;
	}
	.uni-flex .uni-column .text {
		text-align: left;
		padding-left: 84rpx;
		padding-top: 10rpx;
		font-size: 14px;
	}
	.shuoming .uni-text{
		padding-top: 10rpx;
		padding-left: 20rpx;
	}
	.products{
		font-size: 14px;
		padding-left:20rpx;
		border-bottom: 2rpx solid #CCCCCC;
		height: 80rpx;
		line-height: 80rpx;
	}
	.giving-cont{
		display: flex;
		height: 80rpx;
		line-height: 80rpx;
	}
	.con-tips{
		width: 30%;
	}
	.left-con{
		float: right;
		font-size: .8rem;
	}
	.right-con{
		width: 50%;
		float: right;
		padding-left: 10rpx;
	}
	.right-con input{
		border: 1px solid #C0C0C0;
		padding-left: 20rpx;
	}
	.d-c{
		font-size: .8rem;

	}

</style>
