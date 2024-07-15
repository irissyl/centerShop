<template>
	<view>
		<view style="margin-top: 5%;">
			<view style="padding-left: 5%; float: left; background-color: #FFFFFF;width: 20%;height: 2rem;line-height: 2rem;">{{$nw('手机号')}}</view>
			<view style="line-height: 2rem; width: 75%;height: 2rem;background-color: #FFFFFF;float: right;">
				<input style="line-height: 2rem;height: 1rem;margin-top: .5rem;" type="number" v-model="mobile" 
				:placeholder="$nw('请输入接收用户的手机号码')" @confirm="search()"/>
			</view>
		</view>
		<view style="clear: both;"></view>
		<!-- 用户信息 -->
		<view v-if="userinfo" style="padding: 2rem; margin: 1rem;background-color: #FFFFFF;">

			<view style="font-size: .8rem;line-height: 1.8rem;">{{$nw('用户昵称')}}：{{userList['nickName']}}</view>
			<view style="font-size: .8rem;line-height: 1.8rem;">{{$nw('手机号码')}}：{{userList['mobile']}}</view>
			<view style="color: #FFB800;line-height: 1.8rem;">{{$nw('请仔细核对转让人信息是否正确')}}</view>
		</view>

		<view v-if="unuserinfo" style="background-color: #FFFFFF; color: #FFB800;padding: 2rem;margin: 2rem;text-align: center;">{{$nw('该用户不存在！请重新输入手机号')}}</view>


		<view v-bind:style="{position: 'relative',top: top + 'rem'}">
			<button @click="search()" v-if="search_user" style="width: 90%;background-color: #FF0036;color: #FFFFFF;margin-left: 5%;">{{$nw('查询用户')}}</button>
			<button @click="go()" v-if="go_out" style="margin-left: 5%; width: 90%;background-color: green;margin-top: 1px;color: #FFFFFF;margin-top: .5rem;">{{$nw('下一步')}}</button>
			<view style="color: #B7B7B7;margin-left: 5%;">{{$nw('注：转让操作不可撤销，请谨慎操作')}}</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userinfo:false,
				userList:[],
				unuserinfo:false,
				search_user:true,
				go_out:false,
				top:10,
				position:'relative',
				mobile:'',
			};
		},
		onLoad(option) {
      this.setGlobalColor()
		},
		methods: {
			search(){
				let self = this;
				uni.showLoading({
					title:  self.$nw("查询中")
				});
				self._get('user.coupon/queryReceive', {
					mobile: self.mobile,
				},function(res){
					self.userList = res.data.user;
					getApp().globalData.userList = self.userList
					self.userinfo = true
					self.unuserinfo = false
					self.go_out = true
					self.top = 0
				},function(){
					self.unuserinfo = true
					self.userinfo = false
					self.go_out = false
					self.top = 0
				});
			},
			go(){
				let self = this
			//	console.log(self.userList["user_id"])
				if(uni.getStorageSync('user_id') == this.userList["user_id"]){
					uni.showModal({
					    title: self.$nw("提示"),
					    content: self.$nw("不可转让给自己"),
						showCancel:false,
					});
				}else{
					uni.navigateTo({
						url: '/user/pages/my-coupon-choose/my-coupon-choose'
					});
				}
			}
		}
	}
</script>

<style>
</style>
