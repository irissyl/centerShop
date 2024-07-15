<template>
	<view class="content">

		<view class="memberA0">
			<view class="memberA" :style="[bgcColor]">

			</view>
			<view class="kt">
				<view style="z-index: 500;width: 120rpx;height: 50rpx;" class="" @click="kt_log">
					{{$nw("开通记录")}}
				</view>

				<view style="z-index: 500; width: 120rpx;height: 50rpx;" @click="qy('权益说明')">
					{{$nw("权益说明")}}
				</view>
			</view>
			<image class="memberqu" :src="quxian"></image>

			<view class="memberB">
				<view class="memberB1">
					<view class="memberB1_1">
						<image :src="user.avatarUrl" mode=""></image>
					</view>
					<view class="" style="flex: 0.3;">

					</view>
					<view class="memberB1_2">
						<view class="memberB1_2_1">
							{{user.nickName}}
						</view>
						<view class="memberB1_2_2" style=" color:#efcf6c;">
							{{user.grade.name}}
						</view>
						<view v-if="user.expire_date_text" class="memberB1_2_2" style="color:#efcf6c;">
							{{$nw("到期时间：")}}{{user.expire_date_text}}
						</view>
					</view>
				</view>

			</view>

		</view>

		<view class="taocan">
			<view class="tabbar-wrapper">
				<view class="tabbar-item" v-for="(item,index) in grade" :key="index" @click="date_click(index)"
					style="position: relative;" :style="'background:'+(item.is_buy==1?( item.flag?'#dedcd5':'#fff'):'#e7e7e7' )+';'
				+'color:'+(item.flag?'#fff':'')+';'+
				'border:1rpx solid '+(item.is_buy==1?( item.flag?'#efcf6c':'#fff'):'#f0f0f0' )+';'">
					<view class="" style="white-space: normal;">
						<view class="tm1" style="font-weight: 600;">
							{{item.name}}
						</view>
						<view class="tm2">
							<text style="font-size: 26rpx;">￥</text>{{item.level_money}}
						</view>
						<view class="tm3">
							{{(item.expire_year&&item.expire_year>0)?item.expire_year+$nw("年"):$nw("永久")}}
						</view>
						<view class="tm3">
							{{item.privilege}}
						</view>
						<view class="tm4" style="word-break: break-all;">
							{{item.content}}
						</view>


					</view>
					<view v-if="item.level != 0" class="tm5" @click.stop="qy(item.name)">
						{{$nw("权益")}}
					</view>



				</view>
				<view style="clear: both;">

				</view>
			</view>
		</view>


		<view class="kait" @click="kaitong">
			{{$nw("立即开通")}}
		</view>



		<recommendProduct></recommendProduct>
	</view>
</template>

<script>
	import recommendProduct from '@/components/recommendProduct/recommendProduct.vue';
	import {
		pay
	} from '@/common/pay.js';
	export default {
		components: {
			recommendProduct,
		},
		data() {
			return {
				grade: [],
				user: {
					grade: {}
				},
				order: {},
				quxian: this.websiteUrl + "file/images/quxian.png"
			}
		},
		computed: {

			active() {
				return Object.assign(this.setBackgroundColor(), this.setColor())
			},
			bgcColor() {
				return this.setBackgroundColor()
			},

			textColor() {
				return flag => {
					flag = !!flag
					return this.setColor(flag)
				}
			},
			textColor2() {
				return Object.assign(this.setColor(), {
					border: '1px solid ' + this.getTextColor(),
				})
			},
		},
		onShow() {
			var self = this;
			this.setGlobalColor()
			//获取会员等级
			self.getUserGrade()
			self._get(
				'user.grade/getGrade', {},
				function(res) {
					console.log("res", res)
					self.order = res.data.last_order;
					self.apply = res.data.apply


				})
			//获取会员详情
			self.getData()
		},
		methods: {
			qy(page_id) {
				uni.navigateTo({
					url: "/pages/diy-page/diy-page-t?page_id=" + page_id
				})
			},
			kt_log() {
				uni.navigateTo({
					url: "/user/pages/member/open_log"
				})
			},
			date_click(index) {
				if (this.grade[index].is_buy == 0) {
					uni.showToast({
						title: this.$nw("该等级无需购买"),
						icon: "none"
					})
					return;
				}
				this.grade.forEach(function(res) {
					res.flag = false;
				})
				this.grade[index].flag = true;
			},
			kaitong() { //开通会员
				var self = this;
				var choose_grade = {};
				this.grade.forEach(function(res) {
					if (res.flag) {
						choose_grade = res
					}
				})
				console.log(choose_grade)
				if (JSON.stringify(choose_grade).length > 10) {


					var apply = self.apply;
					if (apply.is_open == 0) {
						uni.showToast({
							title: self.$nw("未开启会员升级"),
							icon: "none"
						})
						return;
					}

					if (!apply['can_apply']) {
						self.showSuccess(self.$nw("请先实名认证后在升级"), () => {
							uni.navigateTo({
								url: '/plus/pages/certify/apply/apply?from_url=user_apply'
							});
						});
						return false;
					}

					function isJudge(self) {
						uni.showLoading({
							title: self.$nw("正在提交") + '...'
						});
						var payType = 10;
						let pay_source = 'wx';
						// #ifdef  H5
						pay_source = 'mp';
						// #endif
						self._post('user.grade/buy', {
							id: choose_grade.grade_id,
							pay_source: pay_source,
							pay_type: payType,
						}, function(res) {
							uni.showToast({
								title: res.msg.success,
								icon: "none"
							})
							// pay(res, self, self.paySuccess, self.payError);
						});
					}
					uni.showModal({
						title: self.$nw("提示"),
						content: self.$nw("升级需扣除您") + choose_grade.level_money + this.getAppinfo().balance_text + "，"+self.$nw("是否确认") ,
						success: function(o) {
							if (o.confirm) {
								isJudge(self);
							}

						}
					})

				} else {
					uni.showToast({
						title:  self.$nw("请选择开通等级"),
						icon: "none"
					})
					return;
				}
				return;



			},
			paySuccess: function(result) {
				this.showSuccess( self.$nw("请稍等，后台正在审核"), () => {
					uni.navigateTo({
						url: '/user/pages/index/index'
					});
				});
			},
			payError: function(result) {
				this.showError(this.$nw("订单未支付成功"), () => {
					console.log('payError');
				});
			},
			getData() {
				var self = this;
				self._get('user.index/detail', {}, function(res) {
					self.user = res.data.userInfo
				})
			},
			getUserGrade() {
				var self = this;
				self._get('user.index/getUserGrade', {}, function(res) {
					self.grade = res.data.grade
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		background: rgb(24, 26, 32);
	}

	.taocan {
		width: 100%;
		height: 400rpx;
		margin-top: 30rpx;

		.tabbar-wrapper {
			width: 95%;
			margin: auto;
			overflow-x: auto;
			white-space: nowrap;

			padding: 24rpx 0;
			position: relative;

			& .tabbar-item {

				width: 310rpx;
				text-align: center;
				display: inline-block;
				padding: 10rpx 0;
				position: relative;
				border-radius: 16rpx;
				margin-right: 20rpx;
				box-shadow: 0rpx 1rpx 4rpx 1rpx rgba(0, 0, 0, 0.1);
				// border: 1rpx solid red;

				.tm1 {
					width: 90%;
					margin: auto;
					text-align: center;
					font-size: 30rpx;
					margin-top: 50rpx;
					color: #6B4C2B;
				}

				.tm2 {
					width: 90%;
					margin: auto;
					text-align: center;
					font-size: 40rpx;
					margin-top: 20rpx;
					color: #6B4C06;

				}

				.tm3 {
					width: 90%;
					margin: auto;
					text-align: center;
					font-size: 26rpx;
					margin-top: 10rpx;
					color: #DCC5AA;
				}

				.tm4 {
					width: 90%;

					color: #bdbdbd;
					margin: auto;
					text-align: center;
					font-size: 26rpx;
					margin-top: 10rpx;
				}

				.tm5 {
					position: absolute;
					right: 0rpx;
					top: 10rpx;
					color: rgb(141,8,30);
					margin: auto;
					text-align: center;
					font-size: 28rpx;
					width: 80rpx;
					height: 50rpx;
					font-weight: 600;
					
				}

			}
		}
	}

	.memberA0 {
		width: 100%;
		height: 280rpx;

		position: relative;

		.memberA {
			width: 100%;
			height: 280rpx;
		}

		.kt {
			position: absolute;
			top: 20rpx;
			right: 20rpx;
			font-size: 28rpx;
			color: #fff;
		}

		.memberqu {
			width: 101%;
			height: 50rpx;
			position: absolute;
			bottom: -30rpx;
			left: 0rpx;
		}

		.memberB {

			width: 70%;
			height: 130rpx;
			position: absolute;
			bottom: 80rpx;
			left: 7.5%;
			display: flex;
			
			.memberB1 {
				flex: 9;
				height: 130rpx;
				display: flex;

				.memberB1_1 {
					flex: 3;

					image {
						width: 130rpx;
						height: 130rpx;
						border-radius: 50%;
						margin-top: 5rpx;
					}

				}

				.memberB1_2 {

					flex: 10;

					.memberB1_2_1 {
						font-weight: 600;
						color: #fff;
						font-size: 34rpx;
					}

					.memberB1_2_2 {
						font-size: 26rpx;
						color: #fff;
					}
				}
			}

			.memberB2 {
				flex: 1;
				height: 110rpx;

				.memberB2_1 {
					font-size: 28rpx;
					color: #B79039;
				}

				.memberB2_2 {
					width: 120rpx;
					font-size: 24rpx;
					text-align: center;
					height: 60rpx;
					border-radius: 50rpx;
					line-height: 60rpx;
					margin-top: 10rpx;
					font-weight: 500;
					color: #4f2c08;
					background: linear-gradient(to right, #E2D675, #BA956D);
				}
			}

		}
	}


	.member_title {
		width: 100%;
		text-align: center;
		color: #fff;
		font-size: 40rpx;
		font-weight: 600;
		position: absolute;
		top: 0rpx;
		left: 0rpx;
	}

	.kait {
		width: 90%;
		margin: auto;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: linear-gradient(to right, #F1E1C5, #efcf6c);
		border-radius: 50rpx;
		margin-bottom: 20rpx;
		margin-top: 100rpx;
	}

	.member {
		width: 90%;
		margin: auto;
		height: 80rpx;
		line-height: 80rpx;

		.member_1 {
			font-size: 32rpx;
			font-weight: 500;
			float: left;

		}

		.member_2 {
			font-size: 28rpx;
			float: right;
			color: #6B4B1F;
			font-weight: 500;
		}
	}

	.index2 {
		width: 45%;
		height: 480rpx;
		border: 1rpx solid #f5f5f5;
		float: left;
		border-radius: 16rpx;
		margin-left: 3.3%;
		margin-top: 20rpx;

		image {
			height: 300rpx;
			width: 100%;
			border-top-right-radius: 16rpx;
			border-top-left-radius: 16rpx;
		}

		.index2_1 {
			width: 90%;
			margin: auto;
			text-align: left;
			line-height: 60rpx;
			font-size: 32rpx;
		}

		.index2_2 {
			width: 90%;
			margin: auto;
			display: flex;
			height: 100rpx;
			line-height: 100rpx;

			.index2_21 {
				flex: 7;
				font-size: 30rpx;
				color: #D66D33;
				font-weight: 600;
			}

			.index2_22 {
				flex: 3;

				.index2_223 {
					width: 120rpx;
					text-align: center;
					height: 60rpx;
					line-height: 60rpx;
					font-size: 30rpx;
					background: linear-gradient(to right, #9BBDF9, #5E86EC);
					border-radius: 50rpx;
					color: #fff;
					margin-top: 20rpx;
				}
			}

		}
	}
</style>