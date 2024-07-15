<template>
	<view>
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
			@scrolltolower="scrolltolowerFunc">
			<!-- 搜索 -->
			<view class="search">
				<view class="search_1">
					<input class="search_1_1" v-model="search_val" @input="search_in" placeholder-class="search_1_1_p"
						:placeholder="$nw('请输入关键词')" />
					<view class="search_1_2">
						<view class="search_1_2_1" @click="search">{{$nw('搜索')}}</view>
					</view>

				</view>
			</view>
			<view class="d-s-c" style="width: 90%;margin: auto;" v-if="current_address && current_address.length >0">
				
				<view class="key-name" >{{$nw('您的位置')}}：</view>
				<view class="input-box flex-1">
					{{current_address[0]?current_address[0].province:""}}{{current_address[1]?"/"+current_address[1].city:""}}{{current_address[2]?"/"+current_address[2].region:""}}{{current_address[3] && current_address[3].street?"/"+current_address[3].street:""}}
				</view>
				
				<view @click="reflush"  style="min-width: 75rpx; text-align: right;font-size: 30rpx;color: #55aaff;line-height: 72rpx;">{{$nw('刷新')}}</view>
			</view>
			<view class="d-s-c" style="width: 90%;margin: auto;" v-if="isOpen == 1 &&type!='province'">
				<text class="key-name">{{$nw('地区选择')}}:</text>
				<view class="input-box flex-1">
					<input class="ml20 flex-1 p-30-10" style="width: 90%; font-size: 30rpx;" placeholder-style="font-size:30rpx;"
						type="text" value="" placeholder-class="grary" placeholder="" v-model="selectRegion"
						disabled="true" @click="showMulLinkageRegionalComponents" />
				</view>
				<view @click="reast" style="font-size: 30rpx;color: #55aaff;line-height: 72rpx;">{{$nw('返回')}}</view>
			</view>
			<!-- 列表 -->
			<view class="region" v-for="(item,index) in list" :key="index" v-if="isOpen == 1">
				<view class="region_1" style="margin-bottom: 20rpx;">
					<view class="region_1_1">
						<view class=""
							:style="{background:getButton.button[2].buttonThree,color:getButton.button[2].buttonThreeColor}">
							{{item.label}}
						</view>
					</view>
					<view class="region_1_2">
						<input v-model="item.long_name"/>
					</view>
					<view class="region_1_3" v-if="type != 'town'">
						<text v-if="type == 'province' && rate.city_rate!=0" @click="jump(item,'city')">{{$nw('下级')}}</text>
						<text v-if="type == 'city'  && rate.region_rate!=0" @click="jump(item,'county')">{{$nw('下级')}}</text>
						<text v-if="type == 'county' && rate.street_rate!=0" @click="jump(item,'town')">{{$nw('下级')}}</text>
					</view>
				</view>

				<!-- <view v-if="item.distance" class="region_2">
					{{$nw('预估距离')}}：{{item.distance}}{{item.distance?'KM':''}}
				</view> -->
				<view class="region_2">
					{{$nw('名额剩余')}}：{{item.quota_surplus}}{{item.quota_surplus?$nw('名，先到先得'):''}}
				</view>
				<view class="region_2">
					{{$nw('收藏人数')}}：{{item.interest}}{{item.interest?'个':''}}
				</view>
				<view class="region_2">
					{{$nw('总客户数量预估')}}：{{item.customer_num_all}}{{item.customer_num_all?'个':''}}
				</view>
				<view class="region_2_3">
					{{$nw('总市场总额预估')}}：{{item.market_total_all}}{{item.market_total_all?'元':''}}

					<view class="region_2_3_1"
						:style="{background:getButton.button[0].buttonOne,color:getButton.button[0].buttonOneColor}">
						{{$nw('抢占市场')}}
					</view>
				</view>
				<view class="region3" style="margin-top: 40rpx;">
					<view class="region3_1_1">

					</view>

					<view class="region3_1"
						:style="{background:getButton.button[2].buttonThree,color:getButton.button[2].buttonThreeColor}">
						{{$nw('能赚多少钱')}}
					</view>
					<view class="region3_1" @click="in_interest(item,item.region_agent_district_id)"
						:style="{background:getButton.button[1].buttonTwo,color:getButton.button[1].buttonTwoColor}">
						{{$nw('我感兴趣')}}
					</view>
					<view class="region3_1"
						:style="{background:getButton.button[0].buttonOne,color:getButton.button[0].buttonOneColor}">
						{{$nw('马上申请')}}
					</view>

				</view>
				<view class="" style="clear: both;">

				</view>

			</view>


			<view v-if="list.length <= 0 && isOpen == -1" class="regionx">
				{{$nw('未开启代理')}}
			</view>



			<view class="page" v-if="isOpen == 1">
				<view class="loadmore" v-if="loading">
					<view class="loading"></view>
					<view class="loadmore_tips">{{$nw("正在加载")}}</view>
				</view>
				<block v-else>
					<view class="loadmore loadmore_line" v-if="page<last_page&&list.length>0">
						<view class="loadmore_tips loadmore_tips_in-line">{{$nw('下拉加载')}}</view>
					</view>
					<view class="loadmore loadmore_line" v-if="page>=last_page&&list.length>0">
						<view class="loadmore_tips loadmore_tips_in-line">{{$nw("没有更多数据了")}}</view>
					</view>
					<view class="loadmore loadmore_line" v-if="list.length<=0">
						<view class="loadmore_tips loadmore_tips_in-line">{{$nw("没有找到数据")}}</view>
					</view>
				</block>
				<view style="height: 50rpx;width: 100%;"></view>
			</view>
		</scroll-view>

		<regionalComponents :last_id="id"  :wa_status="wa_status" :types="type" v-show="regionaStatus" ref="regionalComponents" @cancel="cancel"
			@confirm="confirm" @is_open="is_open"></regionalComponents>
			
			<Tabbar v-if="show_menu"></Tabbar>
	</view>
</template>

<script>
	import regionalComponents from '@/components/regionalComponents/regionalC.vue'
	import Tabbar from '@/components/tabbar/tabbar.vue';
	export default {
		components: {
			regionalComponents,
			Tabbar
		},
		data() {
			return {
				list: [],
				search_val: "",
				selectStreet: this.$nw("选择街道/镇/乡"),
				selectRegion: this.$nw("选择地区"),
				regionaStatus: false,
				province_id: 0,
				city_id: 0,
				region_id: 0,
				street_id: 0,
				address: {},
				id: "",//上级ID
				type: "", //town   county   city  province 
				current_type: "",
				current_address: [],
				full_address:[],
				isOpen: 1,
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				last_page: 1,
				page: 1,
				loading: true,
				longitude: "",
				latitude: "",
				rate: {
					street_rate: 0,
					region_rate: 0,
					city_rate: 0,
					province_rate: 0,
				},
				show_menu: false,
				wa_status:1,//用于监听 判断是否重新获取ip地址
			};
		},
		computed: {
			MainColor() {
				return this.getMainColor()
			},
			TextColor() {
				return this.getTextColor()
			},
			getButton() {
				console.log(this.setButton())
				return this.setButton()
			}
		},
		onLoad(e) {
			var self = this;
			if(e.last_id){
				self.id = e.last_id;
			}
			if(e.type){
				self.type = e.type
			}else{
				self.type = "province";
			}
		
			self.init();
			self.setGlobalColor()
			self.province_id = "";

			self._post('plus.regionagent.Regiontree/getBgColor', {}, function(res) {
				self.rate = {
					street_rate: res.data.values.street_rate,
					region_rate: res.data.values.region_rate,
					city_rate: res.data.values.city_rate,
					province_rate: res.data.values.province_rate
				}

			})
			//判断底部菜单
			let curPage = getCurrentPages();
			let route = curPage[curPage.length - 1].route; //获取当前页面的路由
			self._get('index/tabbar', {}, function(res) {
				if (res.code == 1) {
					if (res.data.tabbar) {
						for (var i = 0; i < res.data.tabbar[0].data.length; i++) {
							if (res.data.tabbar[0].data[i].linkUrl == "plus2/pages/region_agent/list") {	
								self.show_menu = true;
								break;
							}
						}
					} else {
						self.show_menu = false;
					}
			
				} else {
					self.show_menu = false;
				}
			
			})
		},
		methods: {
			reast() {//改成返回上一级
				var self = this;
				
				var current_index = self.getArrayIndex(this.current_type,1);
				var last_val = self.getArrayIndex(this.current_type,2,current_index-1)
				this.type = last_val;
				if(last_val == "province"){//返回到省之后 就把后面的清除掉
					this.full_address[1].city = "";this.full_address[1].city_id = "";
					this.full_address[2].region = "";this.full_address[2].region_id = "";
					this.full_address[3].street = "";this.full_address[3].street_id = "";
				}else if(last_val == "city"){//就把后面的清除掉
					this.full_address[1].city = "";this.full_address[1].city_id = "";
					this.full_address[2].region = "";this.full_address[2].region_id = "";
					this.full_address[3].street = "";this.full_address[3].street_id = "";
				}else if(last_val == "county"){//就把后面的清除掉
				this.full_address[2].region = "";this.full_address[2].region_id = "";
					this.full_address[3].street = "";this.full_address[3].street_id = "";
				}
				this.page = 1;
				this.selectRegion = this.full_address[0].province+
				(this.full_address[1].city?"/"+this.full_address[1].city:"")+
				(this.full_address[2].region?"/"+this.full_address[2].region:"")
				this.id = ""	
				get(this, {
					level: this.type,
					search_val: this.search_val,
					selectRegion: this.selectRegion,
					page: this.page,
					current_address: JSON.stringify(this.current_address), //当前地址
					full_address: JSON.stringify(this.full_address), //当前地址
				})
				
			},
			reflush(){//重新获取IP
				if(this.wa_status == 1){
					this.wa_status = 2
				}else{
					this.wa_status = 1
				}
			},
			jump(item, type) {
				console.log("item",item)
				console.log(type)
				this.type = type
				var name = item.long_name.split("/")
				if (type == "city") {
					this.province_id = item.district_id
					this.id = item.district_id
					this.full_address[0].province_id = item.district_id
					this.full_address[0].province = name[0]
				} else if (type == "county") {
					this.city_id = item.district_id
					this.id = item.district_id
					this.full_address[1].city_id = item.district_id
					this.full_address[1].city = name[1]
				} else if (type == "town") {
					this.region_id = item.district_id
					this.id = item.district_id
					this.full_address[2].region_id = item.district_id
					this.full_address[2].region = name[2]
				}
				
				this.page = 1;
				get(this, {
					level: this.type,
					search_val: this.search_val,
					selectRegion: this.selectRegion,
					page: this.page,
					current_address: JSON.stringify(this.current_address), //当前地址
					full_address: JSON.stringify(this.full_address), //当前地址
				})
			},
			in_interest(item,region_agent_district_id) { //感兴趣
				var self = this;
				self._get('plus.regionagent.Regiontree/in_interest', {
					"region_agent_district_id": region_agent_district_id,
					"type":this.type,
					"url":"plus2/pages/region_agent/list?type="+this.type+"&last_id="+item.district_id,
					"user_id":uni.getStorageSync("user_id"),
					"name":item.long_name
				}, function(res) {
					uni.showToast({
						title: res.msg,
						icon: "none"
					})
					setTimeout(function(){
						get(self, {
							level: self.type,
							search_val: self.search_val,
							selectRegion: self.selectRegion,
							page: self.page,
							current_address: JSON.stringify(self.current_address),
							full_address: JSON.stringify(self.full_address), //当前地址
						})
					},1500)
					
					

				})
			},
			init() { //初始化
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
					}
				});
			},
			showMulLinkageRegionalComponents() {
				this.regionaStatus = true;
			},
			cancel() {
				this.regionaStatus = false;
			},
			is_open(e) {
				this.isOpen = e
			},
			confirm(e) {
				console.log("e",e)
				this.current_address = e.current_address;
				// this.full_address = [
				// 	{province: e.province,province_id:  e.province_id},
				// 	{city: e.city,city_id:  e.city_id},
				// 	{region: e.region,region_id:  e.region_id},
				// 	{street: e.street,street_id:  e.street_id},
				// ]
				this.full_address = e.full_address
				this.province_id = e.province_id;
				this.city_id = e.city_id;
				this.region_id = e.region_id;
				this.street_id = e.street_id;
				var city = e.city && e.province ? "/" + e.city : ""
				var area = e.area && e.city && e.province ? "/" + e.area : ""
				var street = e.street && e.area && e.city && e.province ? "/" + e.street : ""
				this.selectRegion = e.province  + (e.city?"/"+e.city:"") + (e.area?"/"+e.area:"") + (e.street?"/"+e.street:"");
				this.regionaStatus = false;
				this.latitude = e.latitude;
				this.longitude = e.longitude;
				console.log("this.selectRegion ",this.selectRegion )
				get(this, {
					level: this.type,
					search_val: this.search_val,
					selectRegion: this.selectRegion,
					page: this.page,
					current_address: JSON.stringify(this.current_address), //当前地址
					full_address: JSON.stringify(this.full_address), //当前地址
				})

			},
			search_in(e) {
				console.log(e.target.value)
				this.search_val = e.target.value

			},
			search() {
				get(this, {
					level: this.type,
					search_val: this.search_val,
					selectRegion: this.selectRegion,
					page: this.page,
					current_address: JSON.stringify(this.current_address),
					full_address: JSON.stringify(this.full_address), //当前地址
				})
			},
			/* 下拉加载 */
			scrolltolowerFunc() {
				let self = this;

				self.page++;
				self.loading = true;
				if (self.page > self.last_page) {
					self.loading = false;
					return;
				}
				get(self, {
					level: self.type,
					search_val: self.search_val,
					selectRegion: self.selectRegion,
					page: self.page,
					current_address: JSON.stringify(self.current_address),
					full_address: JSON.stringify(this.full_address), //当前地址
				})
			},
		}
	}
 
	function get(self, obj) { //区域列表
		uni.showLoading({
			title: self.$nw("加载中"),
		});

		obj.id = self.id
		//经纬度
		obj.longitude = self.longitude,
		obj.latitude = self.latitude

		//来源
		// #ifdef H5
		obj.source = "h5"
		// #endif
		// #ifdef MP-WEIXIN
		obj.source = "weixin"
		// #endif

		var selectRegion = obj.selectRegion.split("/");
		if (obj.level == "city") {
			obj.selectRegion = selectRegion[0];
		}
		console.log("obj:",obj);
		self._post('plus.regionagent.Regiontree/index', obj, function(res) {
			console.log(res.data)
			self.list = res.data.list
			self.last_page = res.data.last_page
			self.type = res.data.slevel
			self.current_type = self.type;
			self.loading = false
			self.selectRegion =res.data.choose_location;
			uni.setNavigationBarTitle({
				title: self.list[0].label + self.$nw("代理"),
			})
			uni.hideLoading();

		})
	}
</script>

<style lang="scss">
	@import "/card/statics/card.css";

	page {
		background: #fff;
	}

	.regionx {
		width: 100%;
		text-align: center;
		height: 300rpx;
		line-height: 300rpx;
		font-size: 30rpx;
		color: #999;
	}

	.search_1 {
		width: 90%;
		margin: auto;
		height: 70rpx;
		line-height: 70rpx;
		display: flex;
		margin-top: 30rpx;
		margin-bottom: 30rpx;

		.search_1_1 {
			flex: 8;
			background: rgb(247, 247, 247);
			border-radius: 20rpx;
			text-indent: 20rpx;
			height: 70rpx;
			line-height: 70rpx;
			font-size: 28rpx;
		}

		.search_1_1_p {
			font-size: 28rpx;
		}

		.search_1_2 {
			flex: 2;

			.search_1_2_1 {
				text-align: center;
				width: 100%;
				margin: auto;
				height: 70rpx;
				line-height: 70rpx;
				font-size: 28rpx;
				color: rgb(22, 132, 252);

			}



		}
	}

	.region {
		border-radius: 10rpx;
		border: 1rpx solid rgba(0, 0, 0, 0.2);
		width: 95%;
		margin: auto;
		margin-top: 15rpx;
		background: #fff;
		padding-top: 20rpx;
		padding-bottom: 50rpx;
		// box-shadow: 2px 2px 1px #888888;

		.region3 {
			width: 100%;
			margin: auto;

			.region3_1_1 {
				float: left;
				margin-right: 4%;
				bottom: 0rpx;
				border-radius: 15rpx;
				width: 11%;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;

				color: #fff;
				font-size: 30rpx;
			}

			.region3_1 {
				float: left;
				margin-right: 4%;
				bottom: 0rpx;
				border-radius: 15rpx;
				width: 24%;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				background: #bddfff;
				color: #fff;
				font-size: 30rpx;
			}
		}

		.region_2 {
			width: 93%;
			margin: auto;
			font-size: 30rpx;
			height: 55rpx;
			line-height: 55rpx;
		}

		.region_2_3 {
			width: 93%;
			margin: auto;
			font-size: 30rpx;
			height: 55rpx;
			line-height: 55rpx;
			position: relative;

			.region_2_3_1 {
				position: absolute;
				right: 20rpx;
				bottom: 0rpx;
				border-radius: 15rpx;
				width: 160rpx;
				height: 60rpx;
				line-height: 60rpx;
				text-align: center;
				background: #bddfff;
				color: #fff;
				font-size: 30rpx;
			}
		}

		.region_1 {
			display: flex;
			width: 95%;
			margin: auto;
			height: 75rpx;
			line-height: 75rpx;
			border-bottom: 1rpx solid rgba(0, 0, 0, 0.2);

			.region_1_1 {
				flex: 2.5;

				view {
					border-radius: 10rpx;
					height: 45rpx;
					width: 90%;
					text-align: center;
					line-height: 45rpx;
					background: #7eccff;
					color: #fff;
					font-size: 30rpx;
					margin-top: 15rpx;
				}
			}

			.region_1_2 {
				flex: 6.5;
				font-size: 30rpx;
				line-height: 75rpx;
				padding-left: 10rpx;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
				input{
					font-size: 30rpx;
					height: 75rpx;
					line-height: 75rpx;
				}
			}

			.region_1_3 {
				flex: 1;
				font-size: 28rpx;
				line-height: 75rpx;
				color: #2e8cff;

			}
		}
	}


	.message-sec .child .content .flex {
		margin: 0;
	}

	.message-sec .child em {
		left: 100rpx;
	}
</style>
