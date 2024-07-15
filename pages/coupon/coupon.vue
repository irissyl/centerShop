<template>
	<view class="coupon-wrap bg-white" v-if="!loadding">
		<block v-if="DataList.length > 0">
			<view class="item-wrap" v-for="(item, index) in DataList" :key="index">
				<view :class="'coupon-item coupon-item-'+item.color.text" @click="lookRule(item)">
					<!--装饰用的小圆-->
					<view class="circles">
						<text v-for="(circle,num) in 8" :key="num"></text>
					</view>
					<view class="info">
						<view >{{item.coupon_type.text}}</view>
					</view>
					<view class="operation d-b-c w-b">
						<view class="flex-1 coupon-content">
							<view :class="item.is_expire==0&&item.is_use==0?item.color.text:''">
								<template v-if=" item.coupon_type.value == 10 ">
									<view class="price" >
										<text>{{$nw("¥")}}</text>
										<text class="f40 fb">{{ item.reduce_price }}</text>
									</view>
								</template>
								<template v-if="item.coupon_type.value == 20 ">
									<text class="f40 fb">{{ item.discount }}</text><text>{{$nw("折")}}</text>
								</template>
							</view>
							<view class="f30">{{item.name}}</view>
							<view class="f24">
								<template v-if="item.expire_type ==10">
									{{$nw("有效期")}}：{{$nw("领取")}}{{ item.expire_day }}{{$nw("天")}}{{$nw("内")}}{{$nw("有效")}}
								</template>
								<template v-if="item.expire_type ==20">
									{{$nw("有效期")}}：{{item.start_time.text}}{{$nw("至")}}{{item.end_time.text}}
								</template>
							</view>
						</view>
						<view class="btns d-c-c">
							<button type="default" style="border: none;" v-if="item.state.value>0" :class="'btn-'+item.color.text" v-on:click.stop="receive(item.coupon_id )">
								{{$nw("立即领取")}}
							</button>
							<button type="default" v-else class="btn-gray" v-on:click.stop>
								{{ item.state.text }}
							</button>
						</view>
					</view>
				</view>
				<!--使用规则-->
				<view :class="item.rule?'rule-wrap rule-wrap-auto':'rule-wrap'">
					<view class="rule">
						<view class="d-b-c">
							<text class="f30">{{$nw("使用规则")}}</text>
							<view class="btn" @click="closeRule(item)">
								<text class="icon iconfont icon-jiantoushang"></text>
							</view>
						</view>
						<view class="content f28 gray6">
							<view class="pt20">
								No:10928312314414
							</view>
							<view class="pt10 d-s-c d-c">
								<text>{{$nw("1、优惠券的基本使用说明,优惠券是仅限在乐融商城使用,按面值总额减免支付的优惠码。")}}</text>
								<text>{{$nw("2、优惠券分三种:满减券、免邮券、以旧换新优惠券。")}}</text>
								<text>{{$nw("3、优惠券获取方式:通过乐融商城的买赠、活动参与等形式获取。")}}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</block>
		<block v-else>
			<view class="none-data-box">
				<image src="http://imgh5.y01.cn/20210606225550dd5f35541.png" mode="widthFix"></image>
				<text>{{$nw("暂无数据")}}</text>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				DataList: [],
				/*当前页面*/
				page: 1,
				/*每页条数*/
				list_rows: 10,
			};
		},
		onShow() {
			uni.setNavigationBarTitle({
				    title: this.$nw("我的优惠券")
				}); 
		},
		mounted() {
      this.setGlobalColor()
			uni.showLoading({
				title: this.$nw("加载中")
			});
			/*获取优惠券列表*/
			this.getData();
		},
		methods: {
			
			/*获取数据*/
			getData() {
				let self = this;
				self._get('coupon.coupon/lists', {
					page: self.page,
					list_rows: self.list_rows,
				}, function(res) {
					self.DataList = res.data.list;
					self.loadding = false;
					uni.hideLoading();
				});
			},
			/*查看规则*/
			lookRule(item) {
				item.rule = true;
			},

			/*关闭规则*/
			closeRule(item) {
				item.rule = false;
			},

			/*领取优惠券*/
			receive(e) {

				let self = this;
				uni.showLoading({
					title:  self.$nw("领取中")
				});
				self._post('user.coupon/receive', {
					coupon_id: e,
				}, function(res) {
					uni.hideLoading();
					uni.showToast({
						title:  self.$nw("领取成功"),
						duration: 2000,
						icon: 'success'
					});
				});
				self.getData();
			},

      /*分享当前页面*/
      onShareAppMessage() {
        return {}
      },

		}
	};
</script>

<style>
	.coupon-wrap {
		padding: 30rpx;
	}

	.item-wrap {
		margin-bottom: 20rpx;
	}
</style>
