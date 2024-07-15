<template >
	<view style="width:100%;height:100vh;display:block;overflow-x: hidden; "
	:style="'background:'+getMainColor()+';'">

		<view class="ind">
			<view class="ind1" v-if="cardIndexData.info.avatar_image">
				<image :src="cardIndexData.info.avatar_image" mode=""></image>
			</view>
			<view class="ind2" v-if="cardIndexData.info.name">
				{{cardIndexData.info.name}}
			</view>
			<view class="ind3" v-if="cardIndexData.info.user.grade">
				{{cardIndexData.info.user.grade}}
			</view>
		</view>

		<view class="inde">
			<view class="inde1" :style="'color:'+getMainTextColor()+';'" v-if="cardIndexData.info.occupation">
				{{cardIndexData.info.occupation}}
			</view>
			<view class="inde2" :style="'color:'+getMainTextColor()+';'" v-if="cardIndexData.info.company">
				{{cardIndexData.info.company}}
			</view>
		</view>

		<view class="concat">
			<view class="concat1" :style="'color:'+getTextColorWhite()+';'" 
			v-if="cardIndexData.info.mobile" @click="makePhone(cardIndexData.info.mobile)">
				{{$nw("手机号")}}：{{cardIndexData.info.mobile}}
				<text style="margin-left: 5rpx;" class="iconfont2 icon-zixun"></text>
			</view>
			<view class="concat2" v-if="cardIndexData.info.category && cardIndexData.info.category.name" :style="'color:'+getTextColorWhite()+';'">
				{{$nw("所属行业")}}：{{cardIndexData.info.category.name}}
			</view>
			<view class="concat3" v-if="cardIndexData.info.begoodat" :style="'color:'+getTextColorWhite()+';'">
				{{$nw("擅长业务")}}：{{cardIndexData.info.begoodat}}
			</view>
			
			<view class="concat3" v-if="cardIndexData.info.address&&cardIndexData.info.address.address" 
			:style="'color:'+getTextColorWhite()+';'"
			@click="jumpAddress(cardIndexData.info.address,cardIndexData.info.company)">
				{{$nw("地址")}}：{{cardIndexData.info.address.address}}
				<text style="margin-left: 5rpx;" class="iconfont2 icon-dizhi"></text>
			</view>
		</view>
		

		<view class="xet" :style="'background:'+getSecondBackgroundColor()+';'">
			<view class="xet1" @click = "jump(1,cardIndexData.info.supply.id)">
				<!-- <view class="xet1_0">
					{{cardIndexData.info.supply.name}}
				</view> -->
				<view class="xet1_1">
					{{$nw("店铺")}}
				</view>
			</view>
			
			<view class="xet1" @click = "jump(2,cardIndexData.info.coc.id)">
				<!-- <view class="xet1_0" >
					{{cardIndexData.info.coc.name}}
				</view> -->
				<view class="xet1_1">
					{{$nw("公司")}}
				</view>
			</view>
		
			
		</view>
		

		<view class="zy" 
		:style="'background:'+getSecondBackgroundColor()+';'"
		v-if="cardIndexData.info.resource_sharing && cardIndexData.info.resource_sharing.length > 0">
			<view class="zy1" :style="'color:'+getTextColorWhite()+';'">{{$nw("资源共享")}}：</view>
			<view class="zy2">
				<!-- #ifdef H5 -->
				<text :style="'color:'+getTextColorGrey()+';'" style="white-space: pre-wrap;" 
				v-html="formatWord(cardIndexData.info.resource_sharing)"></text>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view :style="'color:'+getTextColorGrey()+';'" v-html="formatContent(cardIndexData.info.resource_sharing)"></view>
				<!-- #endif -->
				<!-- #ifdef APP -->
				<view :style="'color:'+getTextColorGrey()+';'" v-html="formatContent(cardIndexData.info.resource_sharing)"></view>
				<!-- #endif -->
			</view>

		</view>

		<view class="zy"
		 :style="'background:'+getSecondBackgroundColor()+';'"
		 v-if="cardIndexData.info.resource_request && cardIndexData.info.resource_request.length > 0">
			<view class="zy1" :style="'color:'+getTextColorWhite()+';'">{{$nw("资源需求")}}：</view>
			<view class="zy2">
				<!-- #ifdef H5 -->
				<text :style="'color:'+getTextColorGrey()+';'" style="white-space: pre-wrap;" v-html="formatWord(cardIndexData.info.resource_request)"></text>
				<!-- #endif -->
				<!-- #ifdef MP-WEIXIN -->
				<view :style="'color:'+getTextColorGrey()+';'" v-html="formatContent(cardIndexData.info.resource_request)"></view>
				<!-- #endif -->
				<!-- #ifdef APP -->
				<view :style="'color:'+getTextColorGrey()+';'" v-html="formatContent(cardIndexData.info.resource_sharing)"></view>
				<!-- #endif -->
			</view>
		</view>

		<!-- 标签 -->
		<Label :item="item" :name="''" v-if="cardIndexData.info.video && cardIndexData.info.video.length > 0"></Label>

		<view v-if="cardIndexData.info.video && cardIndexData.info.video.length > 0">
			<video style="border-radius: 15rpx; height: 350rpx; width: 95%;margin: auto;margin-left: 2.5%;"
				:src="cardIndexData.info.video" :poster="cardIndexData.info.poster" objectFit="contain"></video>
		</view>

		<Label :item="item1" :name="''" v-if="commentd.length > 0"></Label>
		<view class="tdmic5" v-if="commentd.length > 0">
			<comment :clist="commentd" style="border-radius: 15rpx; width: 95%;margin: auto;margin-top: 10rpx;">
			</comment>
		</view>

		<!-- 显示评论按钮 -->
		<!-- <view class="eval" v-if="evalProject && evalProject.project_id" @click="eval">{{$nw("评价这次合作")}}</view> -->

		<!-- 三个按钮 -->
		<view class="btn">

			<view class="btn1">
				<view class="btn1_1" @click="toChat">
					{{$nw("发消息")}}
				</view>
			</view>
			<view class="btn1" v-if="cardIndexData.info.is_save_phone == 1">
				<view class="btn1_1" @click="toAddPhone">
						{{$nw("保存到通讯录")}}
				</view>
			</view>
			<view class="btn1">
				<view class="btn1_1" @click="toShowShare">
					{{$nw("分享名片")}}
				</view>
			</view>
		</view>

		<view class="" style="height: 100rpx;width: 100%;">

		</view>


		<block v-if="cardIndexData.info">

			<form :class="'fix-show-share-sec tc fix ' + (showShareStatus==true?'':'hide') ">
				<view class="flex">
					<button class="flex100-5" hoverClass="none" open-type="share">
						<i class="iconfont2 icon-weixin1"></i>
						<view class="title">{{$nw("微信好友")}}</view>
					</button>
					<button class="flex100-5" @click="toShareCard" hoverClass="none">
						<i class="iconfont2 icon-pengyouquan-copy"></i>
						<view class="title">{{$nw("名片码")}}</view>
					</button>
				</view>
				<button class="cancel" @click="toCancleShareCard" hoverClass="none">{{$nw("取消")}}</button>
			</form>
		</block>
		<Tabbar v-if="show_menu"></Tabbar>
		<TestTips></TestTips>
		<Option v-if="isPopup" :isPopup="isPopup" :evalProject="evalProject" :cardIndexData="cardIndexData" @close="closePopup">
		</Option>
		
		<view v-if="isPopup1" class="commodity_screen" @click="closePopup1"></view>
		<Copy v-if="isPopup1" :isPopup="isPopup1" :item="obj" @close="closePopup1"></Copy>
		
	
	</view>
</template>

<script>
	import utils from '@/common/utils.js';
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import TestTips from '@/components/test-tips.vue';
	import Label from '@/components/label/label.vue';
	import comment from "@/components/comment/comment_card.vue"
	import Option from './popup/option.vue';
	import Copy from './popup/copy.vue';
	import service from '@/components/diy/service/service';
	
	export default {
		components: {
			Tabbar,
			TestTips,
			Label,
			comment,
			Option,
			Copy,
			service
		},
		data() {
			return {
				t_service: uni.getStorageSync('t_service') ? uni.getStorageSync('t_service') : {},
				item: {
					code: "video_intro",
					title: "视频介绍",
					color: "#000",
					right: false
				},
				item1: {
					code: "eval",
					title: "评价",
					color: "#000",
					right: true,
					card_id: 0,
				},
				commentd: [],
				card_id: 0,
				showShareStatus: false,
				cardIndexData: {
					"info": {
						name: '',
						cardCount: [],
						productList: [],
						images: [],
						labelList: [],
						supply: {
							name: '',
						},
						user: {
							grade: ""
						},
						category: {
							name: ""
						}
					},

				},
				globalData: {
					configInfo: {
						config: {
							card_type: 1,

						}
					}

				},
				clientUnread: 0,
				moreStatus: true,
				is_share: false,
				show_menu: false,
				showChat: false,
				temlIds: [],
				showMySelf: false,
				myCardId: 0,
				getdefault: 0,
				product_column: 'one_column',
				jumpUrl: '',
				isPopup: false,
				isPopup1:false,
				evalProject: {},
				obj:{}
			}
		},
		onLoad(e) {
			/*名片id*/
			let scene = utils.getSceneData(e);
			if (e.card_id || scene.card_id) {
				this.card_id = e.card_id ? e.card_id : scene.card_id;
				uni.setStorageSync('card_id', this.card_id);
			}
			console.log(this.card_id);
			if (this.card_id) {
				this.getCardTabbar(this.card_id);
			}
			this.setGlobalColor()

		},
		mounted() {
			/*获取名片详情*/
			this.getBaseData();
			var self = this;
			setTimeout(function(){
				self.item.color = self.getMainTextColor()
				self.item1.color = self.getMainTextColor()
				
			},500)	
		},
		methods: {
			jump(type,id){
				if(type == 1){
					
					if(id != 0 ){
						uni.navigateTo({
							url:"/plus/pages/supply/detail/detail?supply_id="+id
						})
					}
				}else{
					if(id != 0 ){
						uni.navigateTo({
							url:"/plus2/pages/coc/detail?id="+id
						})
					}
					
				}
			},
			makePhone(phone){
				uni.makePhoneCall({
					phoneNumber:""+phone
				})
			},
			jumpAddress(address,store_name){//跳转地址
				if(address.longitude.length >0 && address.latitude.length){
					uni.openLocation({
						latitude: parseFloat( address.latitude),
						longitude: parseFloat(address.longitude),
						name: store_name?store_name:"",
						address: address.address
					})
				}
			},
			formatContent(e) {
				return utils.format_content(e);
			},
			getHz() {
				//获取是否可以评价
				var self = this;
				self._post('plus.card.card/getHz', {
					user_id: self.cardIndexData.info.user_id
				}, function(res) {
					self.evalProject = res.data;
					return;
				})
			},
			eval() { //评价这次合作
				this.isPopup = true;
			},
			/*关闭弹窗*/
			closePopup() {
				this.isPopup = false;
			},
			closePopup1() {
				this.isPopup1 = false;
			},
			getBaseData() {
				let self = this;
				let card_id = self.card_id;
				if (!card_id) {
					card_id = uni.getStorageSync('card_id');
				}
				uni.showLoading({
					title: self.$nw('加载中')
				});
				self._get(
					'plus.card.card/detail', {
						card_id: card_id,
						getdefault: self.getdefault,
					},
					function(res) {
						self.cardIndexData.info = res.data.info;
						self.item1.card_id = self.cardIndexData.info.card_id
						self.commentd = res.data.comment;
						self.getHz();
						//如果是访问自己的名片
						if (res.data.outofdate == 1) {
							uni.showModal({
								title: self.$nw('名片服务'),
								content: self.$nw('您的名片已到期'),
								showCancel: false,
								success(res) {
									let path = '';
									if (res.confirm) {
										path = '/pages/user/index/index';
									}
									uni.redirectTo({
										url: path
									});
									return;
								}
							});
						} else if (res.data.outofdate == 2) {
							//如果访问的别人的名片到期
							uni.showModal({
							title: self.$nw('名片服务'),
							content: self.$nw('您的名片已到期'),
								showCancel: false,
								success(res) {
									let path = '';
									if (res.confirm) {
										self.getdefault = 1;
										self.getBaseData();
									}
									return;
								}
							});
						}

						if (!card_id) {
							self.card_id = res.data.info.card_id;
							self.getCardTabbar(self.card_id);
						}
						if (res.data.info.supply) {
							uni.setStorageSync('currentSupplyId', res.data.info.supply.supply_id);
							self.product_column = res.data.info.supply.product_show;
							// self.product_column = 'video_scale'
						}
						let user_id = uni.getStorageSync('user_id');
						if (self.cardIndexData.info.user_id && user_id != self.cardIndexData.info.user_id && user_id !=
							'undefined') {
							self.showChat = true;
							self.clientUnread = res.data.clientUnread;
						}
						self.temlIds = res.data.temlIds_arr ? res.data.temlIds_arr : [
							'G1sRvqG8LTRT1KLrgpdU328lw9RBEEXGpaBDKTAO3Rk'
						];
						self.loadding = false;
						self.showMySelf = res.data.showMySelf;
						self.myCardId = res.data.myCardId;
						if (res.data.jumpUrl) {
							self.jumpUrl = res.data.jumpUrl;
						}
						uni.setNavigationBarTitle({
							title: res.data.cardTitle || self.$nw("名片")
						});


						uni.hideLoading();
					}
				);
			},

			/* 复制 */
			toCopy(type, more_info = '') {
				
				let clipboardData = '';
				if (type == 'wechat') {
					clipboardData = this.cardIndexData.info.wechat;
				} else if (type == 'email') {
					clipboardData = this.cardIndexData.info.email;
				} else if (type == 'company') {
					clipboardData = this.cardIndexData.info.supply.name;
					if (more_info != '') {
						clipboardData = more_info;
					}
				} else if (type == 'name') {
					clipboardData = this.cardIndexData.info.name;
				} else if (type == 'occupation') {
					clipboardData = this.cardIndexData.info.name;
				} else if (type == 'mobile') {
					clipboardData = this.cardIndexData.info.mobile;
				}
				let self = this;
				let card_id = self.card_id;

				uni.setClipboardData({
					data: clipboardData,
					success: function() {
						uni.showToast({
							title: this.$nw("复制成功"),
							duration: 2000
						})
					},
					fail: function() {
						uni.showToast({
							title: this.$nw("复制失败"),
							duration: 2000
						})
					}
				});
				//点击复制事件
				self._get(
					'plus.card.card/copyClick', {
						card_id: card_id,
						type: type
					},
					function(res) {
						console.log(res);
					}
				);

			},

			/* 显示更多 */
			toCardMore() {
				this.moreStatus = !this.moreStatus;

			},
			/* 显示分享名片 */
			toShowShare() {
				this.showShareStatus = !this.showShareStatus;
			},
			/* 取消分享 */
			toCancleShareCard() {
				this.showShareStatus = !this.showShareStatus;
			},

			/* 分享名片 */
			toShareCard() {
				let self = this;
				let card_id = self.card_id;
				uni.navigateTo({
					url: "/card/pages/card/share/index?card_id=" + card_id
				})
			},
			/* 存入手机通讯录 */
			toAddPhone() {
				// this.isPopup1 = true;
				// console.log(this.cardIndexData.info);
				// this.obj = {
				// 	name:this.cardIndexData.info.name,
				// 	mobile:this.cardIndexData.info.mobile,
				// 	company:this.cardIndexData.info.company,
				// 	address:this.cardIndexData.info.region.address
				// }
				// return;
				let self = this;
				let card_id = self.card_id;
				//点击复制事件
				self._get(
					'plus.card.card/copyClick', {
						card_id: card_id,
						type: 'communicationbook'
					},
					function(res) {
						console.log(res);
					}
				);
				uni.addPhoneContact({
					mobilePhoneNumber: self.cardIndexData.info.mobile,
					firstName: self.cardIndexData.info.name,
					organization:self.cardIndexData.info.company,
					workAddressCountry:"中国",
					workAddressState:self.cardIndexData.info.region.province,
					workAddressCity:self.cardIndexData.info.region.city,
					workAddressStreet:self.cardIndexData.info.address.address,
				})
			},




			/*
			 * 拨打电话
			 */
			toCall() {
				let self = this;
				let mobile = this.cardIndexData.info.mobile;
				let card_id = self.card_id;
				//点击复制事件
				self._get(
					'plus.card.card/copyClick', {
						card_id: card_id,
						type: 'mobile'
					},
					function(res) {
						console.log(res);
					}
				);
				uni.makePhoneCall({
					phoneNumber: mobile
				});
			},
			onShareAppMessage() {
				let self = this;
				let card_id = self.card_id;
				// 构建页面参数
				let params = self.getShareUrlParams({
					card_id: card_id
				});

				let name = this.cardIndexData.info.name ? this.cardIndexData.info.name : "我";
				let title = name + "的名片";
				let obj = {
					title: title,
					path: '/card/pages/card/index?' + params
				};
				return obj
			},
			/*
			去聊天
			*/
			toChat() {
				var self = this;
				self.jump_chat(self.cardIndexData.info.user_id, self.cardIndexData.info.card_id);
			},
			/* 获取菜单 */
			getCardTabbar(card_id = '') {
				let self = this;
				self.isTabbar(self, "card/pages/card/index", function(res) {
					self.show_menu = res;
				});
			},
			/*
			跳转到指定供应商页面
			*/
			toSupply() {
				if (!this.jumpUrl) {
					return false;
				}
				this.gotoPage(this.jumpUrl);
			}

		}
	}
</script>

<style lang="scss">
	@import "/card/statics/card.css";

	page {
		width: 100%;
		overflow-x: hidden;
	}
	
	/*使屏幕变暗  */
	
	.commodity_screen {
		width: 100%;
		height: 100%;
		position: fixed;
		top: 0;
		left: 0;
		background: #000;
		opacity: 0.3;
		overflow: hidden;
		z-index: 500;
		color: #fff;
	}
	

	.eval {
		width: 95%;
		margin: auto;
		height: 80rpx;
		line-height: 80rpx;
		text-align: center;
		background: linear-gradient(to right, #d6bd5a, #fdf4b3);
		border-radius: 15rpx;
		font-size: 26rpx;
		color: #000;
		font-weight: 500;
	}

	.btn {
		display: flex;
		margin-top: 20rpx;

		.btn1 {
			flex: 1;

			.btn1_1 {
				width: 80%;
				margin: auto;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				background: linear-gradient(to right, #d6bd5a, #fdf4b3);
				border-radius: 15rpx;
				font-size: 26rpx;
				font-weight: 500;
			}
		}
	}


	.zy {
		width: 95%;
		margin: auto;
		border-radius: 20rpx;
		background: #fff;
		margin-top: 30rpx;
		padding-bottom: 30rpx;

		.zy1 {
			width: 90%;
			margin: auto;
			font-size: 34rpx;
			font-weight: 600;
			padding-top: 30rpx;
		}

		.zy2 {
			width: 90%;
			margin: auto;
			margin-top: 10rpx;
		}
	}

	.concat {
		width: 90%;
		margin: auto;

		margin-top: 30rpx;

		.concat1 {
			font-size: 26rpx;
		}

		.concat2 {
			font-size: 26rpx;
		}

		.concat3 {
			font-size: 26rpx;
		}
	}


	.ind {
		width: 130%;
		margin-left: -15%;
		height: 350rpx;
		background: linear-gradient(to bottom, #d6bd5a, #fdf4b3);
		border-bottom-right-radius: 300rpx;
		border-bottom-left-radius: 300rpx;
		position: relative;

		.ind1 {
			position: absolute;
			top: 40rpx;
			width: 100%;
			text-align: center;

			image {
				width: 180rpx;
				height: 180rpx;
				border-radius: 50%;
				margin: auto;


			}
		}

		.ind2 {
			font-size: 36rpx;
			width: 100%;
			text-align: center;
			z-index: 500;
			position: absolute;
			// left: 9%;
			bottom: 60rpx;
			font-weight: 600;
		}

		.ind3 {
			font-size: 26rpx;
			width: 100%;
			text-align: center;
			z-index: 500;
			position: absolute;
			// left: 9%;
			bottom: 20rpx;
		}
	}

	.inde {

		.inde1 {
			font-size: 36rpx;
			width: 100%;
			text-align: center;
			z-index: 500;

			font-weight: 600;
			margin-top: 10rpx;
		}

		.inde2 {
			font-size: 26rpx;
			width: 100%;
			text-align: center;
			z-index: 500;

		}
	}



	view,
	button {
		display: block;
		overflow: initial;
	}

	.share-communication-sec button {
		margin-right: 20px;
	}

	.animatoins {
		width: 94%;
		height: 118rpx;
		background: #fefefd;
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: fixed;
		top: 10rpx;
		left: 3%;
		z-index: 9999999;
		color: #000;
		font-size: 28rpx;
		transition: transform 1s;
		transform: translateY(-140rpx);
		box-shadow: 0 3rpx 12rpx rgba(0, 0, 0, .1);
	}

	.animatoins text {
		width: 500rpx;
		position: relative;
		top: -5rpx;
	}

	.aa {
		transform: translateY(0rpx);
	}

	.f-icontext {
		font-size: 22rpx;
	}

	.f-paragraph {
		font-size: 28rpx;
	}

	.c-paragraph-sm {
		color: #969696;
	}

	.card-index-sec-0 {
		width: 750rpx;
		height: 430rpx;
		margin: 0rpx auto;
		background: white;
		overflow: hidden;
	}

	.user-card-info-0 {
		margin: auto;
	}

	.user-card-info-0 .card_type_avatar {
		display: inline-block;
		width: 25%;

	}

	.user-card-info-0 .card_type_avatar .circle0 {
		width: 49px;
		height: 49px;
		display: block;
		border-radius: 50%;
	}

	.user-card-info-0 .card_type_info {
		display: inline-block;
		width: 68%;
		text-align: left;
	}

	.user-card-info-0 .card_type_info .name {
		padding-top: 50rpx;
	}

	.card-index-sec-0 video {
		width: 100%;
		height: 100%;
	}

	.child.flex.avatar {
		height: 140rpx;
		line-height: 140rpx;
	}

	.uniquetags {
		padding-bottom: 50rpx;
		padding-top: 25rpx
	}

	.card-more-btn {
		height: 50rpx;
		line-height: 50rpx;
	}

	.more-card-info-sec .child {
		height: 60rpx;
		line-height: 60rpx;
	}

	.shop-product-sec .one_column {
		width: 100%;
		padding-top: 10rpx;
		border: 1rpx solid #f0f0f0;
	}

	.shop-product-sec .video_scale {
		padding-top: 10rpx;
		border: 1rpx solid #f0f0f0;
	}

	.shop-product-sec .one_column image {
		width: 686rpx;
		height: 686rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.shop-product-sec .video_scale image {
		width: 686rpx;
		height: 386rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.shop-product-sec .video_scale video {
		width: 686rpx;
		height: 386rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.shop-product-sec .video_scale .clamp2 {
		padding: 15rpx 15rpx 0rpx 15rpx;
		font-size: 28rpx;
		color: #282828;
		line-height: 36rpx;
		height: 72rpx;
	}

	.shop-product-sec .video_scale .price {
		font-size: 32rpx;
		height: 50rpx;
		line-height: 50rpx;
		color: #f31a33;
		padding: 0rpx 15rpx 15rpx 15rpx;
	}

	.shop-product-sec .video_scale .price text {
		font-size: 26rpx;
		color: #959595;
		margin-left: 10rpx;
		text-decoration: line-through;
	}

	.shop-product-sec .one_column video {
		width: 686rpx;
		height: 386rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.shop-product-sec .one_column .clamp2 {
		padding: 15rpx 15rpx 0rpx 15rpx;
		font-size: 28rpx;
		color: #282828;
		line-height: 36rpx;
		height: 72rpx;
	}

	.shop-product-sec .one_column .price {
		font-size: 32rpx;
		height: 50rpx;
		line-height: 50rpx;
		color: #f31a33;
		padding: 0rpx 15rpx 15rpx 15rpx;
	}

	.shop-product-sec .one_column .price text {
		font-size: 26rpx;
		color: #959595;
		margin-left: 10rpx;
		text-decoration: line-through;
	}

	/* .diy-service .service-icon{ width: 120rpx; height: 120rpx; } */
	button {
		padding: 0;
	}

	/* .diy-service .service-icon image{ width: 50%; height: 50%;} */
	
	.xet {
		width: 96%;
		padding-bottom: 30rpx;
		border-radius: 10rpx;
	
		margin: auto;
		margin-top: 10rpx;
		display: flex;
	
		.xet1 {
			flex: 1;
	
			.xet1_0 {
				margin-top:40rpx;
				text-align: center;
				line-height: 40rpx;
				position: relative;
				color: #fff;
				.im_text {
					width: 100%;
					height: 50rpx;
					top: 25rpx;
					position: absolute;
					left: 0rpx;
					color: rgb(255, 159, 0);
					font-size: 24rpx;
				}
	
				.image1 {
					width: 100rpx;
					height: 100rpx;
					margin: auto;
	
	
				}
	
				.image2 {
					width: 100rpx;
					height: 100rpx;
					margin: auto;
					border-radius: 50%;
				}
			}
	
			.xet1_1 {
				width: 150rpx;
				height: 60rpx;
				border-radius: 50rpx;
				text-align: center;
				line-height: 60rpx;
				background: rgb(255, 159, 0);
				color: #fff;
				font-size: 24rpx;
				margin: auto;
				margin-top: 30rpx;
			}
		}
	}
</style>