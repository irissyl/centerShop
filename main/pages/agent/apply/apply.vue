<template>
	<view class="apply-agent">
		<view class="banner d-c-c d-c" v-if="top_background!=''">
			<image :src="top_background" mode="widthFix"></image>
		</view>
		<!--申请成功-->
		<template v-if="!is_applying ">
			<view class="form-wrap p30 f30">
				<view class="p30 d-c-c gray3 f40 fb">
					{{words.apply.words.title.value}}
				</view>
				<form @submit="formSubmit" @reset="formReset">
					<view class="form-item border-b">
						<view class="field-name">{{$nw("邀请人")}}</view>
						{{referee_name}}
					</view>
					<view class="form-item border-b">
						<text class="field-name">{{$nw("选择身份")}}</text>
						<view class="uni-list-cell-db">
							<picker mode="selector" value=""   :range="agentType" range-key='name'  @change="bindChange">
								<view class="uni-input">{{agent_type_name}}</view>
							</picker>
						</view>
					</view>
					<view class="form-item border-b" v-if="agent_type==1">
						<text class="field-name">{{$nw("入学时间")}}</text>
						<view class="uni-list-cell-db">
							<picker mode="date" fields="month"   @change="bindDateChange">
								<view class="uni-input">{{entrance_date?entrance_date:$nw('请选择入学时间')}}</view>
							</picker>
						</view>
					</view>
					<view class="form-item border-b" v-if="agent_type==1">
						<view class="field-name">{{$nw('班级')}}</view>
						<input class="flex-1 ml20" name="class_name" type="text" value="" placeholder-class="grary" 
						:placeholder="$nw('请输入班级')" />
					</view>
					<view class="form-item border-b">
						<view class="field-name">{{$nw("姓名")}}</view>
						<input class="flex-1 ml20" name="name" type="text" value="" placeholder-class="grary" 
						:placeholder="$nw('请输入姓名')" />
					</view>
					<view class="form-item border-b">
						<view class="field-name">{{$nw("手机号")}}</view>
						<input class="flex-1 ml20" name="mobile" type="number" value="" placeholder-class="grary" 
						:placeholder="$nw('请输入手机号')" />
					</view>
					<view class="d-c-c p-20-0 f28">
						<checkbox-group @change="changeFunc">
							<checkbox value="checkbox" :checked="is_read" />
							<text>{{$nw("我已阅读并了解")}}</text>
							<text class="red" @click="isPopup=true">
								【{{ words.apply.words.license.value }}】
							</text>
						</checkbox-group>
						
					</view>
					<view class="d-c-c mt30">
						<button class="btn-red" form-type="submit" :style="[active]">{{ words.apply.words.submit.value }}</button>
					</view>
				</form>
			</view>
		</template>
		<!--分销商审核中-->
		<template v-if="is_applying">
			<view class="d-c-c pt30">
				<text style=" font-size: 100rpx;" class="icon iconfont icon-icon_xianshi-xian"></text>
			</view>
			<view class="p-30-0 d-c-c gray6 f30">
				{{ words.apply.words.wait_audit.value }}
			</view>
			<view class="p30 mt30 d-c-c">
				<button type="primary" class="btn-red" :style="[active]" @click="gotoShop">{{ words.apply.words.goto_mall.value }}</button>
			</view>
		</template>

		<!--协议-->
		<Popup :show="isPopup" :msg="$nw('申请协议')">
			<view class="agreement-content f28 lh150">
				{{agreement}}
			</view>
			<view class="ww100 pt20 d-c-c">
				<button type="primary" class="btn-red" :style="[active]" @click="isPopup=false">{{$nw("我已阅读")}}</button>
			</view>
		</Popup>
	</view>
</template>

<script>
	import Popup from '@/components/uni-popup.vue'
	export default {
		components: {
			Popup
		},
		data() {
			return {
				/*弹窗是否打开*/
				isPopup: false,
				/*是否阅读了规则*/
				is_read:false,
				agreement: '',
				is_applying: false,
                referee_name:'',
				words:{},
				is_agent:'',
				agent_type:0,
				agent_type_name:this.$nw('请选择'),
				class_name:'',
				entrance_date:'',
				agentType:[
					{
						type:0,
						name:this.$nw('分销商'),
					},
				],
				/*顶部背景*/
				top_background: '',
				/*小程序订阅消息*/
				temlIds: [],
			}
		},
		mounted() {
			/*数据*/
			this.getData();
      this.setGlobalColor()
		},
    computed: {
      active() {
        return Object.assign(this.setBackgroundColor(), this.setColor())
      },
    },
		methods: {
			bindChange(e){
				var index = e.detail.value
				console.log(e)
				let self = this;
				if(index==0){
					self.class_name = ''
					self.entrance_date = ''
				}
				self.agent_type = self.agentType[index].type
				self.agent_type_name = self.agentType[index]['name']
			},
			bindDateChange(e){
				// var index = e.detail.value
				console.log(e)
				let self = this;
				self.entrance_date = e.detail.value
			},
			/*获取数据*/
			getData() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				})
				self._get('user.agent/apply', {
					platform: self.getPlatform(),
					referee_id: uni.getStorageSync('referee_id')
				}, function(res) {
					uni.hideLoading();
					self.top_background = res.data.background;
					self.is_applying = res.data.is_applying;
					self.referee_name = res.data.referee_name!=null?res.data.referee_name: self.$nw("平台");
					self.is_agent=res.data.is_agent;
					self.words = res.data.words;
					self.temlIds = res.data.template_arr;
					self.agreement = res.data.license;
					/*设置标题*/
					uni.setNavigationBarTitle({
					    title: self.words.apply.title.value
					});
					if(self.is_agent){
						uni.navigateBack({});
					}
				});
			},
			
			/*申请*/
			formSubmit: function(e) {
				let formdata = e.detail.value;
				
				formdata.referee_id=uni.getStorageSync('referee_id');
				let self = this;
				formdata.agent_type = self.agent_type
				formdata.class_name = self.class_name
				formdata.entrance_date = self.entrance_date
				
				if(formdata.agent_type==1&&!formdata.entrance_date){
					uni.showToast({
						title: self.$nw('请选择入学时间'),
						icon:'none'
					});
					return;
				}
				if(formdata.name==''){
					uni.showToast({
						title: self.$nw("请输入姓名！"),
						icon:'none'
					});
					return;
				}
				if(formdata.mobile.length==''){
					uni.showToast({
						title: self.$nw("请输入手机号！"),
						icon: 'none'
					});
					return;
				}
				if (!/^1(3|4|5|6|7|8|9)\d{9}$/.test(formdata.mobile)) {
					uni.showToast({
						title: self.$nw("手机有误,请重填！"),
						icon: 'none'
					});
					return;
				}
				
				if(!self.is_read){
					uni.showToast({
						title: self.$nw("请同意协议！"),
						icon:'none'
					});
					return;
				}
				
				let callback = function(){
					uni.showLoading({
						title: self.$nw("正在提交"),
						mask: true
					})
					self._post('plus.agent.apply/submit', formdata, function(res) {
						uni.hideLoading();
						uni.showToast({
							title: self.$nw("申请成功")
						});
						self.getData();
					});
				};
				self.subMessage(self.temlIds, callback);
			},
			
			/*去商城看看*/
			gotoShop(){
				uni.reLaunch({
					url:'/pages/index/index'
				})
			},
			
			/*同意协议*/
			changeFunc(e){
				if(e.target.value.length>0){
					this.is_read=true;
				}else{
					this.is_read=false;
				}
			}
		}
	}
</script>

<style>
.apply-agent .banner {
	background-repeat: no-repeat;
	background-size: 100%;
}
.apply-agent .banner image{ width: 100%;}

	.form-wrap {
		background: #FFFFFF;
		box-shadow: 0 0 8rpx 0 rgba(0, 0, 0, .2);
	}

	.form-item {
		padding: 20rpx 0;
		margin-bottom: 20rpx;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		font-size: 28rpx;
	}

	.form-item .field-name {
		width: 180rpx;
	}

	.form-item input {
		font-size: 28rpx;
	}

	.agreement-content {
		max-height: 60vh;
		overflow-y: auto;
	}
	.apply-agent .btn-red{
		width: 600rpx;
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	box-shadow: 0 8rpx 16rpx 0 rgba(226,35,26,.6);}
</style>
