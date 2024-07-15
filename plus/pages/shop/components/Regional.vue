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
				<text class="w-25" v-if="province != $nw('请选择')" :class="showIndex== 1 ?'select':''"
					@click="anewSelect(1)">{{city}}</text>
			</view>
			<view class="main-box">
				<view v-if="showIndex == 0" class="list-box" @click="selectProvince(item.id,item.name)"
					v-for="(item,index) in provinceData" :key="item.id">
					<text :class="item.id==province_id?'active_text':''">{{item.name}}</text>
				</view>
				<view v-if="showIndex == 1" class="list-box" @click="selectCity(item.id,item.name)"
					v-for="(item,index) in cityData" :key="item.id">
					<text :class="item.id==city_id?'active_text':''">{{item.name}}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showIndex: 0, //地区显示
				province: this.$nw('请选择'),
				city: this.$nw('请选择'),
				area: this.$nw('请选择'),
				street: this.$nw('请选择'),
				heightCot: 30, //设置屏幕高度 0 ~ 100
				provinceData: [], // 当前展示的省数据
				province_id: '', //当前省的下标
				cityData: [], // 当前展示的市数据
				city_id: 0,
				areaData: [], //当前展示的区数据
				region_id: 0,
				streetsData: [], //当前展示的区数据
				street_id: 0,
				is_loading: true,
				is_first: false
			}
		},
		props: ['defaultData', 'bankBranch', 'is_edit'],
		created() {
			this.getAreaList();
		},
		methods: {
			getAreaList() {
				let params = this.defaultData;
				this._get('user.address/getAreaList', params, (res) => {
					this.provinceData = res.data.datas.provinceData;
					this.cityData = res.data.datas.cityData;
					if (this.is_edit) {
						this.is_first = true
						for (var i = 0; i < this.provinceData.length; i++) {
							if (this.provinceData[i].id == this.bankBranch.province_id * 1000000) {
								this.selectProvince(this.provinceData[i].id, this.provinceData[i].name)
								break
							}
						}
					}
					this.is_loading = false;
					// this.areaData = res.data.datas.areaData;
					// this.streetsData = res.data.datas.streetsData;
					// this.showIndex = res.data.datas.type;
					// if (this.defaultData.address_id > 0 && res.data.datas.address) {
					// 	this.province_id = res.data.datas.address.province_id;
					// 	this.city_id = res.data.datas.address.city_id;
					// 	this.region_id = res.data.datas.address.region_id;
					// 	this.street_id = res.data.datas.address.street_id;
					// 	this.province = res.data.datas.address.district.province;
					// 	this.city = res.data.datas.address.district.city;
					// 	this.area = res.data.datas.address.district.region;
					// 	this.street = res.data.datas.address.district.street;
					// }
					// this.is_loading = false;
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
				let province = this.province; //省
				let city = this.city; //市
				let area = this.area; //区县
				let street = this.street; //街镇
				let province_id = this.province_id; //省
				let city_id = this.city_id; //市
				let region_id = this.region_id; //区县
				let street_id = this.street_id; //街镇
				if (!province_id || !city_id) {
					uni.showToast({
						title: this.$nw("请选择完整地址"),
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				const data = {
					'province': province,
					'city': city,
					'province_id': province_id,
					'city_id': city_id,
					'not_reset': this.is_first
				};
				this.$emit('confirm', data)
				this.is_first = false
			},
			//下拉选择
			anewSelect(num) {
				switch (num) {
					case 0:
						this.showIndex = 0;
						this.areaData = [];
						this.streetsData = [];
						this.city = this.$nw("请选择");
						this.city_id = 0;
						break;
					case 1:
						this.showIndex = 1;
						// this.areaData = [];
						this.streetsData = [];
						break;
				}
			},
			//高德获取地区信息
			getNexAreaList(id, type) { //name选择名称 type类型
				let params = {};
				params.id = id;
				params.type = type;
				this._get('user.address/getNexAreaList', params, (res) => {
					if (type == 1) {
						this.cityData = res.data.list;
						if (this.is_edit) {
							for (var i = 0; i < this.cityData.length; i++) {
								if (this.cityData[i].id == this.bankBranch.city_id * 1000000) {
									this.selectCity(this.cityData[i].id, this.cityData[i].name)
									break
								}
							}
							this.confirm()
						}
					}
				});
			},
			//选择当前省
			selectProvince(province_id, name) {
				this.getNexAreaList(province_id, 1);
				this.province_id = province_id; // 当前省份ID
				this.province = name;
				this.showIndex = 1;
			},
			//选择当前市
			selectCity(city_id, name) {
				// this.getNexAreaList(city_id,2);
				this.city = name;
				this.city_id = city_id; // 当前城市ID
			},
		}
	}
</script>

<style lang="less" scoped>
	.w-25 {
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
		background-color: rgba(0, 0, 0, .6);
	}

	.active_text {
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
		border-top: 1upx solid rgba(0, 0, 0, .2);
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