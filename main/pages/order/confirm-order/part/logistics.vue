<template>
	<view :class="Visible ? 'usable-logistics open' : 'usable-logistics close'">
		<view class="popup-bg" @click="closePopup"></view>
		<view class="main pt30" v-on:click.stop>
			<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'">
				<view class="p30">
          <view class="logistics-item mb30 bg-white  radius16 p10" :class="activeIndex === index ? 'border-theme' : 'border'" v-for="(item, index) in datalist" :key="index" @click="selectLogistics(index,item)">
            <!--<image class="wh140 radius16" src="@/static/car.jpg" mode="aspectFill"></image>-->
            <view class="d-c ml20">
              <view>{{ item.name }}</view>
              <!--<view class="f22">地址:  <span class="gray3 ml10">北京市东城区长安街（天安门和正阳门之间</span></view>-->
              <!--<view class="f22">简介: <span class="gray6 ml10">简介姐呢|分解减肥|佛教斯恶</span></view>-->
              <!--<view class="f24">客服: <span class="red ml10">1008655</span></view>-->
              <!--<view class="f24">剩余库存: 44</view>-->
            </view>
          </view>
				</view>
			</scroll-view>
			<view class="logistics-btns">
        <button type="default" @click="sure" class="btn-cancel">{{$nw("确认物流中心")}}</button>
      </view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			/*手机高度*/
			phoneHeight: 0,
			/*可滚动视图区域高度*/
			scrollviewHigh: 0,
			/*是否可见*/
			Visible: false,
			/*物流中心列表*/
			datalist: {},
			/*尺寸比例*/
			ratio:1,
      /*选中的物流*/
      activeIndex: '',
      chooseLogisticsId: '',
		};
	},
	props: ['isLogistics', 'logisticsList'],

	onLoad() {
    this.setGlobalColor()
  },
	mounted() {
		this.init();
	},
	watch: {
		isLogistics: function(n, o) {
			if (n != o) {
				this.Visible = n;
				this.datalist = this.logisticsList;
				this.getHeight();
			}
		}
	},
	methods: {
		/*初始化*/
		init() {
			let self = this;
			uni.getSystemInfo({
				success(res) {
					self.phoneHeight = res.windowHeight;
					self.ratio=res.windowWidth/750;
					self.getHeight();
				}
			});
		},

		/*获取高度*/
		getHeight(){
			let count=Object.keys(this.logisticsList).length;
			if(count>2){
				this.scrollviewHigh=this.phoneHeight* 0.6;
			}else{
				if(count==1){
					this.scrollviewHigh=230*this.ratio;
				}else if(count==2){
					this.scrollviewHigh=460*this.ratio;
				}
			}
		},
		/*选择优惠券*/
		selectLogistics(i,e) {
      this.activeIndex = i
      this.chooseLogisticsId = e.logistics_id
      this.closePopup(e)
		},
    /*确认物流中心*/
    sure(){
      this.closePopup(this.chooseLogisticsId);
    },
		/*关闭弹窗*/
		closePopup(e) {
			this.$emit('close', e);
		}
	}
};
</script>

<style lang="scss" scoped>
.usable-logistics .popup-bg {
	position: fixed;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	background: rgba(0, 0, 0, 0.6);
	z-index: 99;
}
.usable-logistics .main {
	position: fixed;
	width: 100%;
	bottom: 0;
	min-height: 200rpx;
	max-height: 900rpx;
	background-color: #fff;
	transform: translate3d(0, 980rpx, 0);
	transition: transform 0.2s cubic-bezier(0, 0, 0.25, 1);
	bottom: env(safe-area-inset-bottom);
	z-index: 99;
}
.usable-logistics .main {
	position: fixed;
	width: 100%;
	bottom: 0;
	min-height: 200rpx;
	max-height: 900rpx;
	background-color: #fff;
	transform: translate3d(0, 980rpx, 0);
	transition: transform 0.2s cubic-bezier(0, 0, 0.25, 1);
	bottom: env(safe-area-inset-bottom);
	z-index: 99;
}

.usable-logistics.open .main {
	transform: translate3d(0, 0, 0);
}
.usable-logistics.close .popup-bg {
	display: none;
}
.logistics-btns .btn-cancel {
	height: 88rpx;
	line-height: 88rpx;
	font-size: 30rpx;
	background: rgb(255, 0, 77);
	color: #ffffff;
	border-radius: 0;
}

.logistics-item {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
}
</style>
