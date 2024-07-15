<template>
	<div @click="addAddress()">
		<!--地址-->
		<view class="add-address d-s-c" v-if="Address==null">
			<view class="icon-box mr10">
				<span class="icon iconfont icon-dizhi1"></span>
			</view>
			<text>{{$nw("请添加收货地址")}}</text>
		</view>

		<view class="address-defalut-wrap"  @click="addAddress()" v-else>
			<view class="info">
				<!-- <text class="state">{{$nw("默认")}}</text> -->
				<text class="type">{{$nw("地址")}}</text>
				<!-- <text class="province-c-a">{{Address.region.province}} {{Address.region.city}} {{Address.region.region}} </text>-->
				 <text class="province-c-a">{{Address.district.province}} {{Address.district.city}} {{Address.district.region}} {{Address.district.street}} </text>
			</view>
			<view class="address">
				<text class="fb gray3">{{Address.detail}}</text>
				<view class="icon-box" @click="addAddress()">
					<span class="icon iconfont icon-jiantou"></span>
				</view>
			</view>
			<view class="user">
				<text class="name">{{Address.name}}</text>
				<text class="tel">{{Address.phone}}</text>
			</view>
		</view>

		<view class="addree-bottom">
			<view class="stripe" v-for="(item,index) in 10" :key="index">
				<text :class="index%2==0?'red':'blue'"></text>
				<text class="white"></text>
			</view>
		</view>

	</div>
</template>

<script>
	export default{
		data(){
			return {

			}
		},
		props: ['Address','exist_address'],
		onLoad() {
      this.setGlobalColor()
		},
		mounted() {

		},
		methods:{
			/*添加地址*/
			addAddress(){
				let url = '/user/pages/address/address?source=order';
				// if(!this.exist_address){
				// 	url = '/user/pages/address/add/add';
				// }
				uni.navigateTo({url});
			}
		}
	}
</script>

<style>
</style>

