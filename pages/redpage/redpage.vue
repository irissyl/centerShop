<template>
	<view class="">
		<view class="redpage-detail">
			<view class="">
				<view class="">
					{{$nw("红包总额(元)")}}
				</view>
				<view class="">
					{{$nw("¥")}}100
				</view>
			</view>
			<view class="">
				<view class="">
					{{$nw("红包总数量(个)")}}
				</view>
				<view class="">
					100
				</view>
			</view>
		</view>
		
		<!-- 红包类型选择 -->
		<view class="uni-list redpage-type">
		            <view class="uni-list-cell">
		                <view class="uni-list-cell-left">
		                    {{$nw("红包类型选择")}}
		                </view>
		                <view class="uni-list-cell-db">
		                    <picker mode="selector" :value="redpageIndex" :range="redpageType" @change="bindredpage">
		                        <view class="uni-input">{{redpageName}}</view>
		                    </picker>
		                </view>
		            </view>
		        </view>
		
		<!-- 获得红包列表 -->
		<view class="">
			<view class="redpage-items" v-for="(item,index) in 3">
				<image src="https://thirdwx.qlogo.cn/mmopen/vi_32/KoIa5QlbG7IVpMnrf3oYJ4eKiblrraVjyUM7crrp7icol9znDjtER3yXQ0n8q8KbmGukryVGLB2icOA8b3OA6w1ibQ/132" mode=""></image>
				<view class="">
					<view class="">
						<view class="">
							<view class="username">
								{{$nw("用户名称")}}
							</view>
							<view class="">
								{{$nw("佣金红包")}}
							</view>
						</view>
						<view class="identify">
							<view class="">
								S1
							</view>
							<view class="">
								2020-10-1 10:18:12
							</view>
						</view>
					</view>
				</view>
				<view class="">
					+10.50
				</view>
			</view>
			<view class="redpage-items">
				<image src="https://thirdwx.qlogo.cn/mmopen/vi_32/KoIa5QlbG7IVpMnrf3oYJ4eKiblrraVjyUM7crrp7icol9znDjtER3yXQ0n8q8KbmGukryVGLB2icOA8b3OA6w1ibQ/132" mode=""></image>
				<view class="">
					<view class="">
						<view class="">
							<view class="username">
								{{$nw("用户名称")}}
							</view>
							<view class="">
								{{$nw("分享红包")}}
							</view>
						</view>
						<view class="identify">
							<view class="">
								S3
							</view>
							<view class="">
								2020-10-1 10:18:12
							</view>
						</view>
					</view>
				</view>
				<view class="">
					+10.00
				</view>
			</view>
			<view class="redpage-items">
				<image src="https://thirdwx.qlogo.cn/mmopen/vi_32/KoIa5QlbG7IVpMnrf3oYJ4eKiblrraVjyUM7crrp7icol9znDjtER3yXQ0n8q8KbmGukryVGLB2icOA8b3OA6w1ibQ/132" mode=""></image>
				<view class="">
					<view class="">
						<view class="">
							<view class="username">
								{{$nw("用户名称")}}
							</view>
							<view class="">
								{{$nw("代理红包")}}
							</view>
						</view>
						<view class="identify">
							<view class="">
								S5
							</view>
							<view class="">
								2020-10-1 10:18:12
							</view>
						</view>
					</view>
				</view>
				<view class="">
					+100.00
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				redpageIndex:'0',
				redpageType:[this.$nw("全部"),
				this.$nw("佣金红包")'',
				this.$nw("分享红包")'',
				this.$nw("代理红包")''],
				redpageName:this.$nw("全部"),
			}
		},
		methods: {
			bindredpage(val){
				let index = val.target.value;
				this.redpageName = this.redpageType[index]
				// 请求数据
				// xxxx
			},
			changeTar(val) {
				if (val == 'redpage') {
					this.modelName = 'redpage';
					this.redpageborder = 'border';
					this.teamborder = '';
				} else {
					this.modelName = 'teamRank';
					this.redpageborder = '';
					this.teamborder = 'border';
				}
			}
		},
		mounted(){
      this.setGlobalColor()
			// let params = {user_id:uni.getStorageSync('user_id')}
			// this._get('plus.rank.team/teamDetail',params,function(res){
			// 	console.log(res.data.data)
			// })
		}
	}
</script>

<style scoped>
	.tarrbar {
		display: flex;
		height: 88rpx;
		align-items: center;
	}

	.tarrbar>view {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 50%;
		height: 100%;
	}

	.border {
		padding-bottom: 4rpx;
		border-bottom: 4rpx solid #E60909 !important;
		border: none;
	}
	.redpage-detail{
		margin-top: 20rpx;
		display: flex;
		justify-content: space-around;
	}
	.redpage-detail>view{
		border-radius: 10rpx;
		width: 45%;
		height: 120rpx;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		background-color: #D22929;
		color: #fff;
	}
	.redpage-type{
		margin: 20rpx 0;
	}
	.redpage-items{
		padding: 20rpx 0;
		background-color: #fff;
		border-bottom: 2rpx solid #ccc;
		display: flex;
	}
	.redpage-items image{
		width: 100rpx;
		height: 100rpx;
		margin: 0 20rpx;
	}
	.redpage-items>view{
		width: 65%;
		display: flex;
		flex-direction: column;
	}
	.redpage-items>view>view{
		display: flex;
	}
	.redpage-items>view>view>view:first-child>view:last-child{
		color: #912D2D;
	}
	.redpage-items>view>view>view:last-child>view:first-child{
		color: #f40;
		margin-left: 10rpx;
	}
	.redpage-items>view>view>view:last-child>view:last-child{
		margin-left: 20rpx;
	}
	
	.redpage-items>view:last-child{
		width: 10%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
