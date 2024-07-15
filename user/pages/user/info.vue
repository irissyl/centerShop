<template>
	<view class="address-form">
		<form @submit="formSubmit">
			<view class="bg-white p-0-30 f30">
				<view class="d-b-c p-30-0 border-b">
					<text class="key-name">{{show_text}}</text>
					<view class="d-e-c" v-if="type == 1 || type == 2">
						<input class="uni-input" type="text" :password="type == 2" 
						style="text-align: right;"  v-model="value" 
						:placeholder="type == 1 ? 
						$nw('请输入昵称'):
						$nw('请输入密码')"/>
					</view>
					<view class="d-e-c" v-if="type == 3">
						<input class="uni-input" type="text"  
						style="text-align: right;" v-model="value" 
						maxlength="100"
						:placeholder="$nw('请输入公司名称')"/>
					</view>
					<view class="d-e-c" v-if="type == 4">
						<input class="uni-input" type="text"  
						style="text-align: right;" v-model="value" 
						:placeholder="$nw('请输入职位')"/>
					</view>
				</view>
				
			</view>
			<view class="bg-white p-0-30 f30" v-if="type == 2">
				<view class="d-b-c p-30-0">
					<text class="key-name">{{$nw("确认密码")}}</text>
					<view class="d-e-c">
						<input class="uni-input" type="text" password="true" 
						style="text-align: right;" 
						v-model="pwd2" :placeholder="$nw('请再次输入密码')"/>
					</view>
				</view>
				
			</view>
			<view>
				<button :style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}" type="warn" @click="saveInfo()" class="save_btn">{{$nw("保存")}}</button>
			</view>
		</form>
		<service :itemData="t_service"></service>
		
	</view>
</template>

<script>
import service from '@/components/diy/service/service';
		
export default {
	components: {
		service,
		
	},
	data() {
		return {
			t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},	
			show_text:'',//显示文本
			value:'',//修改内容
			type:1,//修改类型
			pwd2:''
		};
	},
	computed: {
		getbutton() {
			return this.setButton().button
		},
	},
	onShow() {
		uni.setNavigationBarTitle({
			    title: this.$nw("修改资料")
			}); 
	},
	onLoad(e) {
    this.setGlobalColor()
		this.value = e.data==null||e.data=='null'?"":e.data;
		this.type = e.type;
		if(e.type == 1){
			this.show_text = this.$nw("昵称");
		}else if(e.type == 2){
			this.show_text = this.$nw("新密码");
		}else if(e.type == 3){
			this.show_text = this.$nw("公司名称");
		}else if(e.type == 4){
			this.show_text = this.$nw("职务");
		}
	},
	methods: {
		// 修改用户信息
		saveInfo(){
			let self = this;
			if(self.value == ''){
				uni.showToast({
					title: self.$nw("请提交数据！"),
					duration: 2000,
					icon: 'none'
				});
				return;
			}
			
			if(self.type == 2){
				if(self.pwd2 == ''){
					uni.showToast({
						title: self.$nw("请确认密码！"),
						duration: 2000,
						icon: 'none'
					});
					return;
				}
				
				if(self.pwd2 != self.value){
					uni.showToast({
						title: self.$nw("密码不一致"),
						duration: 2000,
						icon: 'none'
					});
					return;
				}
			}
			
			self._post('user.user/setUserInfo', {value:self.value,type:self.type}, function(res) {
				uni.showToast({
					title: res.msg,
					icon: 'success',
					duration: 2000
				});
				uni.navigateBack({
					delta:1
				});
				// uni.hideLoading();
			});
		}
	}
};
</script>

<style>
.address-form .key-name {
	width: 200rpx;
}
.address-form .btn-red{
	height: 88rpx;
	line-height: 88rpx;
	border-radius: 44rpx;
	box-shadow: 0 8rpx 16rpx 0 rgba(226,35,26,.6);
}
.save_btn{
	width: 100%;
	height: 45px;
	line-height: 45px;
	-webkit-border-radius: 0;
	border-radius: 0;
	position: fixed;
	bottom: 0;
	display: flex;
	-webkit-box-pack: end;
	justify-content: center;
	align-items: center;
}
.uni-input{
	color: #C5C5C5;
}
</style>
