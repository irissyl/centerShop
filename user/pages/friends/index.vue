<template>
	<view class="container">
		<view class="address-list">
			<view class="a-address" v-for="(item,index) in listData" :key="index">
				<view class="left-text">
					<view class="name-tel">
						{{$nw("姓名")}}:   {{item.name}}
					</view>
					<view class="name-tel">
						{{$nw("生日")}}:   {{dateFormat(item.birthday_time)}}
					</view>
					<view class="name-tel">
						{{$nw("备注")}}:   {{item.remark}}
					</view>
				</view>
				<view class="centent-text">
					<text class="day">{{item.day}}</text>{{$nw("天后生日")}}
				</view>
				<view class="right-edit" @tap="editAddess(item.id)"></view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/*是否加载完成*/
				loadding:true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				listData:[]
			}
		},
		onLoad:function(options){
			this.options = options;
		},
		onShow:function(){
      this.setGlobalColor()
			uni.showLoading({
			    title: this.$nw("加载中")
			});
			/*获取地址列表*/
			this.getData();
		},
		methods: {
			/*获取数据*/
			getData() {
				let self = this;
				let dataType = self.dataType;
				self._get('plus.friends.friends/lists', {}, function(res) {
					self.listData = res.data.list.data;
					self.default_id = res.data.default_id + '';
					self.loadding=false;
					console.log(self.listData);
					uni.hideLoading();
				});
			},
			dateFormat(time){
			        if  (time >0) {
			        let date = new Date(time*1000);
			        	let year = date.getFullYear();
			        	let month = date.getMonth()+1;
			        	let day = date.getDate();
			        	let h = date.getHours();
			        	let m = date.getMinutes();
			        	let s = date.getSeconds();
			        	month = month < 10 ? "0"+month:month;
			        	day = day < 10 ? "0"+day:day;
			        	h = h < 10 ? "0"+h:h;
			        	m = m < 10 ? "0"+m:m;
			        	s = s < 10 ? "0"+s:s;
			        	date = year+this.$nw("年")+month+this.$nw("月")+day+this.$nw("日");
						return date;
			        }
			},
			/*跳转页面*/
			gotoPage(path) {
				uni.navigateTo({
					url: path
				});
			},
		}
	}
</script>

<style>
	
	.container {
		background-color: #E3E3E3 100%;
	}
	
	.address-list {
		width: 100%;
		background-color: #fff;
		/* margin-top: 20upx; */
		padding-bottom: 100upx;
	}
	
	.address-list .a-address {
		width: 720upx;
		margin-left: 30upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px 0;
		border-bottom: 3px solid #eee;
	}
	
	.a-address .left-text {
		width: 220px;
		box-sizing: border-box;
		padding-left:2px;
	}
	.a-address .left-text .name-tel {
		margin-top: 5px;
	}
	
	.a-address .centent-text {
		width: 140px;
		box-sizing: border-box;
		padding-left:4px;
	}
	.a-address .centent-text .day {
		color: rgba(223, 35, 27, 1);
		font-size: 20px;
	}
	
	.a-address .left-text .address-box {
		font-size: 24upx;
		color: #888888;
		line-height: 36upx;
	}
	
	.a-address .right-edit {
		width: 120px;
		height: 100%;
		padding-top: 40px;
		box-sizing: border-box;
		background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAAAXNSR0IArs4c6QAABPhJREFUeAHtnE1oE0EUx80HQW39SCvYgBVBqhUU+l1FD1ZFPIgnQdDiRfGmh168eBDR4k1B8OLHSVTQg6gnUQ+CaNLWQGu8lSqtrZQKgk1jkzb1/zSzvKyTIO0mM7uZgc28eftm571fZnaTzGR8y4qkRCJRPTMzswsmG3HULiwsBIqYO3bK5/PNoa1oR0fHG8cuWuBCIyMjyycnJy+hzW6YIPPdr6uru1BfX5+iKj57PTjm6+vrOwz9WchdyIN2mzKWL3R2dl4pVXujo6MrJiYmniHO/bwNQLqFN+cM6fIA9ff3b85ms7dRYS+voFCehqNr4HDWaR8KwaF20F4mHA6vamhomLV6RzQabZufn3+B82GnnVnC9RaWULdg1WJwcpWCYBGC/BcQ4GxB4RWO1TkDLTK8k71O957/gEOxv25sbPxJQhDDyR+Lxe5ALgRnEE4OwG7Y7/enqVIZ0hzaiLW3t791si2CMz4+/hzX3FfkumPBYPCUOB/EDfkgCnuEQuSAMoSjB06+FDo356LnIIaicAKBwN6WlpYvIlbqQSdFQeQAk4C+CzfI70Ln5lzAQUx5TytbTGMEp62tbZjrg4DRiopctwxD6RQMKx4OQfEDDn0ItBKAzba2tsYshYuFpfQcEbYfwnJRyOUpQMrvUjYDNxSdgENxEiDPJafgEBjPAXISjucAOQ3HU4BKAcczgEoFxxOASgnH9YBKDcfVgMoBx7WAygWHAFk/mFHBDYng/M9PFrIvnouJz1UfFMsNh4C6BpAKOK4BpAqOKwCphKM9INVwtAakAxxtAekCR0tAOsHRDpBucLQCpCMcbQDpCocAKf8upgOcoaGh9VgHdRrzgTSRehcTpqMEh5LSrxq0eKmcXzz/hpz/Go/H1wJOP7SXsfTnIvI41irUCSulgKampsihfcIZSS6dDpbYLVqVyWRosdgGcQH0oFrMCx4VZaWA4Mxx4YgkLzmcXJu19rbRk9YJnVJAcKLQDG654AgOBXOlgNCD7kk80wYO+aYUUE1NzSU8OW7Aj18Y97QO8QV+CdxtX4JCjqpKSh/ztEgSgZ9DT+oZGBgIAcyMKhCF2lUKSDiF3kNL7ujQLikdYtrRkDhkAEmgcJUBxGlIZANIAoWrDCBOQyIbQBIoXGUAcRoS2QCSQOEqA4jTkMgGkAQKVxlAnIZENoAkULjKAOI0JLIBJIHCVQYQpyGRDSAJFK4ygDgNiWwASaBwlQHEaUhkA0gChav8uekWS4cZhoqChngDVvA5gTMhGN9sBqsHBwd12p7C5p6zRcDI+1Nz7uo/RCv0r+e8/4nTiVQq1S0MKiDfbo8RTCaEjobYU1FgeW9uPw+m8p6IXSe2IiraAigvgcl7ofCHQqEHUNAMJ0/VKDzBdjmNXOklGZtHhdBTruOw33M/5S2gampq+orAr0mC34YtYj6gJ53nC4okdq5T0eiYnp6mjZUO2Z3HWoGbXPdngyXaiiuZTL5DhX/GozBGL0tCzoiyi3PqOStl/iPG4UgkskNsz0U21g5UWIq2KZ1O09hbL6vsdR3g0Jt/AMPrDY/VGn/Nzc2fcT/aCcOP3KBC5Hn0qhN2OBS7BYgKBKmqqmoXIF1F8c8ucKT3cqJhhWM/NpN7JIvTGmL2k3iCRUD1GNbrHcG5BhwRHP986rTX070MGBnENQ4/E7ghP8SWgI/5Pcfu/2//c4lF4CDN7wAAAABJRU5ErkJggg==) no-repeat 10px bottom;
		background-size: 18px;
	}
	
	.bottom-box {
		position: fixed;
		width: 100%;
		bottom: 0;
		font-size: 28upx;
		color: #000000;
		border-top: 1upx solid #eee;
		height: 100upx;
		line-height: 100upx;
		background: #fff url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAYCAYAAADzoH0MAAAAAXNSR0IArs4c6QAAAj1JREFUOBGVVE1LHEEQ7e4EkRBjiBL9AQqCQmB32d3xEMgxp6CCssEFFUMiBA+e9pKTgeBBBRGChEBCPAghISgiiEhu87Gzq/4Df4Yf292+Wulx2llXbRiq+1W9N9VVNcMYltaau2741fOqU3S+zxIUDOIKzAdIfXPdygRhd10ChCUQPxIBmQjO2XcIFu8sANox51wbAokA++H74VuDNbOcnAieRhnWLslRuORcjOfzqY0IabCpCxBOb1SK/cT2YSxOCsEKuVzmdwyztpEAob5fGdKabSCTllhUjTE+5jjpvzEs2loChLpu9TVjioJbTRQKe45nFJn8M5ixCQFyeF74CjXZRDEfR4EQEYKPZLPpLYORbShADt+vOlqrHVypnc600K0zNGwYmWxfIk0EKCAMw1StxnYh0mEIoJziGXKc1A5hN2ZgCEFw2C+l3Md1nhsM9gQ1eZPPZ3broxxzJLZayy6Qn1xzoNWijbCmAkFQfYmWUtGijmBPA1bEgP0hgfjQ0DlaQXAwKKWiYj0yIIqocOvJ+HQ2zKBcPswqJVGkeBvpe+HvQP5lBMkmiuh5lTTwPaT+1ATSx4aizeRy6TWDGWtlgN6/ABFtuyJTIMizjcjkiwTK5aMBDM4esGfkMAvTNwfyqjlft3UBDEyflOdIm3XaAaIE8rKN2acHnnfQq5T+D3K37RKfMG1fbCx5ErhvD2DrzbjzPMifk+FJpN4FFK8AoXU8Aj+QBXwspWToLQh+Ju/xV1q8JSzhvgCBx9kzUoIj2gAAAABJRU5ErkJggg==) no-repeat 705upx center;
		background-size: 15upx auto;
	}
	
	.bottom-box .add-btn {
		margin-left: 30upx;
		padding-left: 70upx;
		background: url(data:image/png;base64,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) no-repeat left center;
		background-size: 40upx auto;
	}

</style>
