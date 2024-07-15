<template>
	<view class="search-wrap">
		<!-- 搜索框 -->
		<view class="index-search-box d-b-c" id="searchBox">
			<view class="index-search t-c flex-1">
				<span class="icon iconfont icon-sousuo"></span>
				<input type="text" v-model="form.keyWord" class="flex-1 ml10 f30 gray3" value="" placeholder-class="f24 gray6"
				 :placeholder="{{$nw("输入你要查找的域名")}}" confirm-type="search" @confirm="search()"/>
			</view>
		</view>
		
		<view id="icp-table" v-if="result.company">
			<table class="table">
				<tbody>
				<tr>
					<td class="thead">{{$nw("主办单位名称")}}</td>
					<td>{{result.company}}</td>
				</tr>
				<tr>
					<td class="thead">{{$nw("主办单位性质")}}</td>
					<td id="type">{{result.type}}</td>
				</tr>
				<tr>
					<td class="thead">{{$nw("网站备案/许可证号")}}</td>
					<td>{{result.icp}}</td>
				</tr>
				<tr>
					<td class="thead">{{$nw("网站名称")}}</td>
					<td>{{result.name}}</td>
				</tr>
				<tr>
					<td class="thead">{{$nw("网站首页网址")}}</td>
					<td>{{result.homes}}</td>
				</tr>
				<tr>
					<td class="thead">{{$nw("网站域名")}}</td>
					<td>{{result.domains}}</td>
				</tr>
				<tr>
					<td class="thead">{{$nw("审核时间")}}</td>
					<td>{{result.icp_time}}</td>
				</tr>
				</tbody>
			</table>
		</view>
	</view>
</template>

<script>

export default {
	components: {
	},
	data() {
		return {
			form: {
				keyWord: ''
			},
			result: {}
		};
	},
  onShow() {
    this.setGlobalColor()
  },
	methods: {
		/**
		 * 搜索
		 */
		search(){
			var that = this
			if(that.form.keyWord.length < 1){
				uni.showToast({
					title: self.$nw("请提供域名"),
					duration: 2000,
					icon: 'fail',
				})
				return false
			}
			this._post(
				'plus.icp.icp/query2', {
					website: that.form.keyWord
				},
				function(res) {
					var code = res.data.res.code
					if (code !== 200000){
						uni.showToast({
							title: res.data.res.msg,
							duration: 2000,
							icon: 'fail',
						})
						return false
					}
					that.result = res.data.res.data.success[0]
					if (Object.prototype.toString.call(temp) !== '[object Object]'){
						uni.showToast({
							title: self.$nw("未备案或备案缓存没有更新"),
							duration: 2000,
							icon: 'fail',
						})
						return false
					}
					uni.showToast({
						title: res.msg,
						duration: 2000,
						icon: 'success',
					})
				}
			)
		}

	}
};
</script>

<style>
	
	.icp-table{
		box-sizing: border-box;
	}
	
	.table{
		width: 100%;
		margin-top: 30rpx;
		padding-left: 15rpx;
		padding-right: 15rpx;
		border-spacing: 0;
		border-collapse: collapse;
		background: #e6f9ff;
	}
	
	.table td.thead{
		padding-right: 15rpx;
		width: 200rpx;
		text-align: right;
		color: #888;
		background: #fafafa;
	}
	
	.table td{
		padding: 10px 0 10px 20px;
		border: 1px solid #e6e6e6;
	}
</style>
