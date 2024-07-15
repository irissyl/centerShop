<template>
	<view class="content">
		<view class="region-box-layer"></view>
		<view class="region-box" style="padding-bottom: 200rpx;" v-if="!is_loading" :style="'height:'+ heightCot + '%'">
			<view class="title-box">
				<text class="title-txt" @click="cancel">{{$nw("取消")}}</text>
				<text class="title-txt" @click="confirm">{{$nw("确定")}}</text>
			</view>
			<view class="map-txt">
				<text class="w-25" :class="showIndex== 0 ?'select':''" @click="anewSelect(0)">{{province}}</text>
				<text v-if="province != $nw('请选择')">-</text>
				<text class="w-25" v-if="province != $nw('请选择')" :class="showIndex== 1 ?'select':''" @click="anewSelect(1)">{{city}}</text>
				<text v-if="city != $nw('请选择')">-</text>
				<text class="w-25" v-if="city != $nw('请选择')" :class="showIndex== 2 ?'select':''" @click="anewSelect(2)">{{area}}</text>
				</view>
			<view class="main-box">
				<view v-if="showIndex == 0" class="list-box" @click="selectProvince(item.id,item.name)" v-for="(item,index) in provinceData" :key="item.id">
					<text :class="item.id==province_id?'active_text':''" >{{item.name}}</text>
				</view>
				<view v-if="showIndex == 1" class="list-box" @click="selectCity(item.id,item.name)" v-for="(item,index) in cityData" :key="item.id">
					<text :class="item.id==city_id?'active_text':''" >{{item.name}}</text>
				</view>
				<view v-if="showIndex == 2" class="list-box" @click="selectaArea(item.id,item.name)" v-for="(item,index) in areaData" :key="item.id">
					<text :class="item.id==region_id?'active_text':''">{{item.name}}</text>
				</view>
				<view v-if="showIndex == 3 && streetsData.length>0" class="list-box" @click="selectStreet(item.id,item.name)" v-for="(item,index) in streetsData" :key="item.id">
					<text :class="item.id==street_id?'active_text':''">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			    showIndex: 0,//地区显示
				province: this.$nw('请选择'),
				city: this.$nw('请选择'),
				area: this.$nw('请选择'),
				street:this.$nw('请选择'),
				heightCot:30,//设置屏幕高度 0 ~ 100
				provinceData: [], // 当前展示的省数据
				province_id: '',//当前省的下标
				cityData: [], // 当前展示的市数据
				city_id: 0,
				areaData: [], //当前展示的区数据
				region_id: 0,
				streetsData: [], //当前展示的区数据
				street_id: 0,
				is_loading: true,
			}
		},
		props: ['defaultData'],
		created() {
			this.getAreaList();
		},
		methods: {
			getAreaList(){
				let self = this;
				let params = self.defaultData;
				self._get('user.address/getAreaList', params, function(res) {
					self.provinceData = res.data.datas.provinceData;
					self.cityData = res.data.datas.cityData;
					self.areaData = res.data.datas.areaData;
					self.streetsData = res.data.datas.streetsData;
					self.showIndex = res.data.datas.type;
					if(self.defaultData.address_id>0 && res.data.datas.address){
						self.province_id = res.data.datas.address.province_id;
						self.city_id = res.data.datas.address.city_id;
						self.region_id = res.data.datas.address.region_id;
						self.street_id = res.data.datas.address.street_id;
						self.province = res.data.datas.address.district.province;
						self.city = res.data.datas.address.district.city;
						self.area = res.data.datas.address.district.region;
						self.street = res.data.datas.address.district.street;
					}
					self.is_loading = false;
				});
			},
			//组件高度自适应
			getScreen() {
				let that = this;
				uni.getSystemInfo({
					success: res => {
						that.heightCot = (res.safeArea.height * 2) / 2
					}
				})
			},
			//取消
			cancel() {
				this.$emit('cancel')
			},
			//确定
			confirm() {
				let province = this.province;//省
				let city = this.city;//市
				let area = this.area;//区县
				let street = this.street;//街镇
				let province_id = this.province_id;//省
				let city_id = this.city_id;//市
				let region_id = this.region_id;//区县
				let street_id = this.street_id;//街镇
				if(!province_id || !city_id || !region_id){
					uni.showToast({
						title: this.$nw("请选择完整地址"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				if(!street_id && this.streetsData.length>0){
					uni.showToast({
						title:  this.$nw("请选择完整地址"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				if(!street_id){
					street = '';
				}
				const data = {
					'province': province,
					'city': city,
					'area': area,
					'street': street,
					'province_id': province_id,
					'city_id': city_id,
					'region_id': region_id,
					'street_id': street_id,
				};
				this.$emit('confirm',data)
			},
			//下拉选择
			anewSelect(num) {
				switch (num) {
					case 0:
						this.showIndex = 0;
						this.areaData = [];
						this.streetsData = [];
						this.city =  this.$nw("请选择");
						this.city_id = 0;
						this.area = this.$nw("请选择");
						this.region_id = 0;
						this.street = this.$nw("请选择");
						this.street_id = 0;
						break;
					case 1:
						this.showIndex = 1;
						// this.areaData = [];
						this.streetsData = [];
						this.area = this.$nw("请选择");
						this.region_id = 0;
						this.street = this.$nw("请选择")
						this.street_id = 0;
						break;
					case 2:
						this.showIndex = 2;
						// this.streetsData = [];
						this.street = this.$nw("请选择");
						this.street_id = 0;
						break;
					case 3:
						this.showIndex = 3;
						break;
				}
			},
			//高德获取地区信息
			getNexAreaList(id,type) { //name选择名称 type类型
				let self = this;
				let params = {};
				params.id = id;
				params.type = type;
				self._get('user.address/getNexAreaList', params, function(res) {
					if(type==1){
						self.cityData = res.data.list;
					}
					if(type==2){
						self.areaData = res.data.list;
					}
					if(type==3){
						if(res.data.list.length>0){
							self.streetsData = res.data.list;
							self.showIndex = 3;
						} else {
							self.streetsData = [];
							self.showIndex = 2;
						}
					}
				});
			},
			//选择当前省
			selectProvince(province_id, name) {
				this.getNexAreaList(province_id,1);
				this.province_id = province_id; // 当前省份ID
				this.province = name;
				this.showIndex = 1;
			},
			//选择当前市
			selectCity(city_id, name) {
				this.getNexAreaList(city_id,2);
				this.city = name;
				this.city_id = city_id; // 当前城市ID
				this.showIndex = 2;
			},
			// 区、县
			selectaArea(region_id, name) {
				this.area = name;
				this.region_id = region_id; //当前地区ID
				// this.showIndex = 3;
				//this.getNexAreaList(region_id,3);
			},
			//街、镇
			selectStreet(street_id, name) {
				this.street = name;
				this.street_id = street_id; //当前街道ID
			}
		}
	}
</script>

<style lang="less" scoped>
	.w-25{
		overflow: hidden;
		font-size: 24rpx;
	}
	.region-box-layer {
		position: fixed;
		z-index: 998;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background-color:rgba(0, 0, 0, .6);
	}
	.active_text{
		color: rgb(0, 122, 255);
	}
	.region-box {
		position: fixed;
		z-index: 999;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: #FFFFFF;
		padding: 20upx;
		border-top:1upx solid rgba(0, 0, 0, .2);
		border-radius: 16upx 16upx 0 0;
		min-height: 50%;
		max-height: 60%;
		.title-box {
			padding: 0 10upx 30upx 10upx;
			display: flex;
			justify-content: space-between;
			// border-bottom: 2upx solid #f2f2f2;
			.title-txt {
				color: #343434;
				font-size: 30upx;
				&:nth-child(2) {
					color: rgb(0, 122, 255);
				}
			}
		}
		.map-txt {
			display: flex;
			justify-content: center;
			color: #343434;
			font-size: 30upx;
			text {
				margin: 0 6upx;
				border-bottom: 2upx solid #dedede;
				&:nth-child(even) {
					border: none;
				}
			}
			.select {
				color: rgb(0, 122, 255);
				position: relative;
			
				&::after {
					content: '';
					width: 100%;
					height: 6upx;
					background: rgb(0, 122, 255);
					position: absolute;
					left: 0;
					bottom: -8upx;
					// margin-left: -20upx;
				}
			}
		}
		.main-box {
			color: #343434;
			font-size: 30upx;
			height: 100%;
			overflow: auto;
			.list-box {
				display: flex;
				flex-direction: column;
				padding: 20upx 0;
				border-bottom: 2upx solid #dedede;
			}
		}	
	}
</style>
