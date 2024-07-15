<template>
	<view class="salesa" v-if="!loadding">
		<view>
			<!--图片-->
			<view class="sales-pic">
				<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
					:duration="duration"  @change="changeSwiper"
      :current="currentIndex" >
					<swiper-item  v-for="(item,index) in obj.setting.image" :key="index">
						<view :id="'content-wrap' + index">
							<image  :style="{ height: swiperHeight + 'px' }" :src="item.file_path" mode="widthFix">
						</view>
						
					</swiper-item>
				</swiper>
			</view>
			
			

			<!-- 销售目标 -->
			<view class="sales">
				<view class="sales_1">
					{{$nw("salestarget.xiaoshou_target.新客户销售目标")}}
				</view>
				<view class="sales_2">
					<view class="sales_2_1">
						{{$nw("salestarget.kehu_num.新客户数量")}}：
					</view>
					<input class="sales_2_1_in" v-model="obj.new_num" placeholder-class="sales_2_1_in"
						:placeholder="$nw('salestarget.in_kehu_num.请输入新客户数量')" />
					<view style="flex: 1;"></view>
				</view>
				<view class="sales_2">
					<view class="sales_2_1">
						{{$nw("salestarget.kehu_price.新客户均价")}}：
					</view>
					<input class="sales_2_1_in" v-model="obj.new_per_price" placeholder-class="sales_2_1_in"
						:placeholder="$nw('salestarget.in_kehu_price.请输入新客户均价')" />
					<view style="flex: 1;"></view>
				</view>

				<view class="sales_1">
					{{$nw("salestarget.xufei_target.老客户续费目标")}}
				</view>

				<view class="sales_2">
					<view class="sales_2_1">
						{{$nw("salestarget.xufei_kehu_num.老客户数量")}}：
					</view>
					<input class="sales_2_1_in" v-model="obj.renew_num" placeholder-class="sales_2_1_in"
						:placeholder="$nw('salestarget.in_xufei_kehu_num.请输入老客户数量')" />
					<view style="flex: 1;"></view>
				</view>
				<view class="sales_2">
					<view class="sales_2_1">
						{{$nw("salestarget.xufei_kehu_price.老客户均价")}}：
					</view>
					<input class="sales_2_1_in" v-model="obj.renew_per_price" placeholder-class="sales_2_1_in"
						:placeholder="$nw('salestarget.in_xufei_kehu_price.请输入老客户均价')" />
					<view style="flex: 1;"></view>
				</view>
				
				
				<view class="sales_1">
					{{$nw("salestarget.intro.说明")}}
				</view>
				
				<view class="sales_2">
					<view class="sales_2_1">
						{{$nw("salestarget.intro.说明")}}：
					</view>
					<input class="sales_2_1_in" v-model="obj.introduce" placeholder-class="sales_2_1_in"
						:placeholder="$nw('salestarget.intro.说明')" />
				
					<view style="flex: 1;"></view>
				</view>
				

				<view class="sales_1">
					{{$nw("salestarget.year_total.年度总额")}}
				</view>

				<view class="sales_2">
					<view class="sales_2_1">
						{{$nw("salestarget.total.总额")}}：
					</view>
					<input style='border: none;' class="sales_2_1_in" disabled
						v-model="obj.new_num * obj.new_per_price+obj.renew_num * obj.renew_per_price"
						placeholder-class="sales_2_1_in" />
					<view style="flex: 1;"></view>
				</view>




				<view class="fix-painter-share" style="margin-top:50rpx;">
					<button @click="save" :style="{background:getbutton?getbutton[0].buttonOne:'#E2231A',color:getbutton?getbutton[0].buttonOneColor:'#ffffff'}" class="fr"
						style=" border-radius:50rpx; width:92%;margin: auto;">{{$nw("保存")}}</button>
				</view>

				<view class="fix-painter-share" style="margin-top: 40rpx;">
					<button :style="{background:getbutton?getbutton[1].buttonOne:'#E2231A',color:getbutton?getbutton[1].buttonOneColor:'#ffffff'}" @click="jump(obj.setting.link)"
						class="fr"
						style="margin-top:100rpx; border-radius:50rpx; width:92%;margin: auto;">{{obj.setting.text}}</button>
				</view>

				<view class="diy-richText" style="width: 92%;margin: auto;margin-top: 20rpx;"
					v-html="obj.setting.content">
				</view>
			</view>

		</view>
	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	export default {
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				obj: {},
				duration: 3000,
				autoplay: true,
				indicatorDots: true,
				interval: 2000,
				swiperHeight: 360,
				//当前索引
				currentIndex: 0,
			};
		},
		created() {
			var self = this;
			//动态设置swiper的高度

			// self.$nextTick(() => {
			// 		self.setSwiperHeight();
			// });
		},
		onShow() {
			this.setGlobalColor()
			getData(this)
			uni.setNavigationBarTitle({
				title: this.$nw("销售目标")
			});

		},
		computed: {
			getbutton() {
				return this.setButton().button
			},
		},
		methods: {
			//手动切换题目
			changeSwiper(e) {
				this.currentIndex = e.detail.current;
				//动态设置swiper的高度，使用nextTick延时设置
				// this.$nextTick(() => {
				// 	this.setSwiperHeight();
				// });
			},
			//动态设置swiper的高度
			setSwiperHeight() {
				var self = this;
				let element = "#content-wrap" + this.currentIndex;
				let query = uni.createSelectorQuery().in(this);
				query.select(element).boundingClientRect();
				query.exec((res) => {
					if (res && res[0]) {
						this.swiperHeight = res[0].height;
					}else{
						setTimeout(function(){
							self.setSwiperHeight();
						},1000)
						
					}
				});
			},

			jump(url) {
				console.log(url)
				uni.navigateTo({
					url: "/" + url
				})
			},
			save() {
				var self = this;
				var obj = this.obj;
				obj.user_id = uni.getStorageSync("user_id")
				obj.total =obj.new_num * obj.new_per_price+obj.renew_num * obj.renew_per_price
				console.log(obj)
				self._get(
					'plus.salestarget.Salestarget/save', {
						obj: JSON.stringify(obj)
					},
					function(res) {
						console.log(res)
						if (res.code == 1) {
							uni.showToast({
								title: self.$nw("salestarget.save_success.保存成功"),
								icon: "none"
							})
						} else {
							uni.showToast({
								title: self.$nw("salestarget.save_error.保存失败"),
								icon: "none"
							})
						}
					}
				);
			}
		}
	}

	function getData(self) {

		uni.showLoading({
			title: self.$nw("加载中")
		});
		self._get(
			'plus.salestarget.Salestarget/list', {},
			function(res) {
				self.obj = res.data
				console.log("obj.setting.image",self.obj.setting.image)
				if (self.obj.setting.content) {
					self.obj.setting.content = utils.format_content(self.obj.setting.content);
				}

				self.loadding = false;
				uni.hideLoading();
			}
		);
	}
</script>

<style lang="scss">
	.sales {
		background: #fff;
		padding-bottom: 90rpx;

		.text {
			line-height: 100rpx;
			width: 92%;
			margin: auto;
			margin-top: 20rpx;
			text-align: left;
		}

		/* 销售目标 */
		.sales_1 {
			width: 95%;
			margin: auto;
			height: 100rpx;
			line-height: 100rpx;
			font-weight: 600;
			font-size: 32rpx;
		}

		.sales_2 {
			width: 92%;
			height: 80rpx;
			margin: auto;
			display: flex;
			margin-bottom: 30rpx;

			.sales_2_1 {
				flex: 3.5;
				text-align: right;
				font-size: 34rpx;
				height: 80rpx;
				line-height: 80rpx;
			}

			.sales_2_1_in {
				flex: 6.5;
				color: #999;
				font-size: 34rpx;
				height: 80rpx;
				line-height: 80rpx;
				border-bottom: 1rpx solid #dadada;

			}

			.sales_2_1_te {
				flex: 6;
				color: #999;
				font-size: 34rpx;
				height: 330rpx;
				line-height: 60rpx;

				padding-top: 8rpx;
			}

		}
	}



	.sales .sales-pic,
	.sales .sales-pic .swiper,
	.sales .sales-pic image {
		width: 750rpx;

	}
</style>
