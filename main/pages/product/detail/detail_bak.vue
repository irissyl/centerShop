<template>
	<view class="product-detail">
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" v-if="!loadding">
			<!--视频-->
			<view class="product-pic product-video">
				<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
					:duration="duration" circular="true">
					<swiper-item v-if="detail.video">
						<video style="width: 100%;height: 100%;" :src="detail.video" controls></video>
					</swiper-item>
					<swiper-item class="common-img-bg" v-for="(item, index) in detail.image" v-if="detail.image.length>0" :key="index">
						<image :src="item.file_path" mode="aspectFill" @click="previewImg(index)"></image>
					</swiper-item>
					<swiper-item class="common-img-bg" v-for="(item, index) in detail.default_image"
						v-if="detail.image.length==0&&detail.default_image.length>0" :key="index">
						<image :src="item.file_path" mode="aspectFill" @click="previewImg(index)"></image>
					</swiper-item>
				</swiper>
			</view>

			<view @click="onCollect"
				style="position: absolute;top:30rpx;right:20rpx;z-index: 1000;display: flex;align-items: center;justify-content: center;width: 44rpx;height: 40rpx;">
				<image class="icon-collect common-img" v-if="!detail.collect.status"
					:src="websiteUrl + 'file/images/product/no_collect.png'"></image>
				<image class="icon-collect common-img" :src="websiteUrl + 'file/images/product/collect.png'" v-else>
				</image>
			</view>
			<!--基本信息-->
			<view class="bg-white">
				<view class="price-wrap" v-if="product_type == 'goods'">
					<view class="d-s-s d-c" v-if="detail.buy_auth.can_buy>0||detail.buy_auth.no_price==0">
						<view class="d-s-c">
							<view class="new-price">
								<text>{{$nw("¥")}}</text>
								<text
									class="num">{{ detail.product_sku.product_price || detail.product_price || '--' }}</text>
							</view>
							<text class="is-user-grade" v-if="detail.is_user_grade == true">{{$nw("会员折扣价")}}</text>
						</view>
						<view>
							<text class="old-price"
								v-if="detail.product_sku.line_price && detail.product_sku.line_price > 0">{{$nw("¥")}}{{ detail.product_sku.line_price }}</text>
						</view>
					</view>
					<text class="already-sale">{{$nw("库存")}} {{ detail.product_stock }} {{$nw("件")}}</text>
					<text class="already-sale">{{$nw("已售")}} {{ detail.product_sales }} {{$nw("件")}}</text>
				</view>
				<view class="product-name">{{ detail.product_name }}</view>
				<view v-if="detail.subtitle" class="product-subtitle">{{ detail.subtitle }}</view>
				<view class="product-describe">{{ detail.selling_point }}</view>
			</view>
			<!--标签-->
			<view v-if="relation_label.length>0&&label_show>0">
				<view class="label-title">
					<text class="label-name" v-for="(item, index) in relation_label"
						:key="index">{{ item.name }}&nbsp;&nbsp;</text>
				</view>

			</view>
			<view class="product-no" v-if="product_no_show>0&&detail.product_no">
				<view>{{product_no_text}}：{{detail.product_no}}</view>
			</view>
			<view class="product-no" v-if="product_diy_no_show>0&&detail.product_diy_no">
				<view>{{product_diy_no_text}}：{{detail.product_diy_no}}</view>
			</view>
			<view class="product-no" v-if="detail.province_id">
				<view>{{$nw("所在地")}}：{{detail.region.province}} {{detail.region.city}}</view>
			</view>
			<!-- 店家 -->
			<view class="supply-item" v-if="detail.supply_id > 0&&supply_open>0&&supply_show>0"
				@click="gotoSupply(detail.supply_id)">
				<view class="cmt-user">
					<view class="left">
						<image class="supply" :src="supply.image_url" mode="aspectFill"></image>
						<view class="supply1">
							<view class="name">{{ supply.name }}</view>
							<view class="supply-desc" v-if="supply.introduce">
								{{$nw("简介")}}:{{ supply.introduce }}
							</view>
						</view>
						<view style="clear: both;">

						</view>

					</view>
				</view>
			</view>
			<!-- 相关推荐 -->
			<view class="recommend-product" v-if="relation_product.length>0">
				<view class=" d-c-c title">
					<text class="line left-line"></text>
					<text class="name">{{$nw("关联产品")}}</text>
					<text class="line right-line"></text>
				</view>
				<view class="recommend-product-list">
					<view class="item" v-for="(item, index) in relation_product" :key="index"
						@click="gotoList(item.product_id)">
						<view class="product-cover">
							<image :src="item.image[0]['file_path']" mode="aspectFill"></image>
						</view>
						<view class="product-info">
							<view class="product-title">{{ item.product_name }}</view>
							<view class="d-b-c">
								<!-- <view class="already-sale f22 gray9">已售{{ item.product_sales }}件</view> -->
								<view class="price" v-if="(item.buy_auth.can_buy>0||item.buy_auth.no_price==0)">
									{{$nw("¥")}}
									<text class="num">{{ item.product_price }}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!--产品参数-->
			<view class="product-comment" v-if="attrStatus">
				<view class="group-hd" @click="showAttr">
					<view class="left">
						<text class="min-name">{{$nw("参数")}}</text>
					</view>
					<view class="right" @click="showAttr">
						<span class="icon iconfont icon-jiantou"></span>
					</view>
				</view>
			</view>
			<!--评价-->
			<view class="product-comment" v-if="product_type == 'goods'">
				<view class="group-hd">
					<view class="left">
						<text class="min-name">{{$nw("评价")}}</text>
						<text class="num">({{ detail.comment_data_count }}{{$nw("条")}})</text>
					</view>
					<view class="right" @click="lookEvaluate(detail.product_id)">
						<text class="more">{{$nw("查看更多")}}</text>
						<span class="icon iconfont icon-jiantou"></span>
					</view>
				</view>
				<view class="comment-list" v-if="detail.comment_data_count > 0">
					<view class="item" v-for="(item, index) in detail.commentData" :key="index">
						<view class="cmt-user">
							<view class="left" v-if="item.user">
								<image class="photo" :src="item.user.avatarUrl" mode="aspectFill"></image>
								<text class="name">{{ item.user.nickName }}</text>
							</view>
							<text class="datetime">{{ item.create_time }}</text>
						</view>
						<view class="mt20 lh150 f24">{{ item.content }}</view>
					</view>
				</view>

			</view>

			<!--详情内容-->
			<view class="product-content">
				<view class="group-hd border-b-e">
					<view class="left"><text class="min-name">{{$nw("商品介绍")}}</text></view>
				</view>
				<!-- <view class="content-box" v-html="detail.content"></view> -->
				<!-- <rich-text class="content-box" :nodes="detail.content" @itemclick="getImagesUrl"></rich-text> -->
				<u-parse v-if="detail.content" class="content-box" :html="detail.content"></u-parse>
				<img :src="plus_img" v-if="plus_img != ''" mode="widthFix" style="width: 100%;">
			</view>
		</scroll-view>

		<!-- -->
		<view class="" style="position: relative;" v-if="detail.supply_id > 0&&supply_open>0&&supply_show>0">
			<view class="share-box2" style="color: #3a3a3a;">
				<view @click="callSupply(supply)" class="position-c">
					<text class="icon iconfont icon-phone"></text>
				</view>
				<view @click="callSupply(supply)"
					style="position: absolute;left: 0rpx;bottom: -4rpx;width: 100%;z-index: 500;display: none;">
					<view style="transform: scale(0.7);color:#fff;font-size: 20rpx;text-align: center;">{{$nw("联系商家")}}
					</view>

				</view>
			</view>
		</view>

		<!--分享-->
		<view class="" style="position: relative;">
			<view class="share-box1" style="color: #3a3a3a;">
				<view @click="goUser" class="position-c">
					<text class="icon iconfont icon-pintuan"></text>
				</view>
				<view @click="goUser"
					style="position: absolute;left: 0rpx;bottom: -4rpx;width: 100%;z-index: 500;display: none;">

					<view style="transform: scale(0.7);color:#fff;font-size: 20rpx;text-align: center;">{{$nw("个人中心")}}
					</view>

				</view>
			</view>
		</view>

		<!-- #ifndef APP -->
		<view style="position: relative;">
			<view class="share-box" @click="showShare" style="color: #3a3a3a;padding-right: 0;">
				<view class="">
					<button class="position-c" type="primary" style="line-height: 1;"><text
							class="icon iconfont icon-share"></text></button>
				</view>
				<view style="position: absolute;left: 0rpx;bottom: -2rpx;
				width: 100%;z-index: 500;display: none;">
					<view style="transform: scale(0.7);color:#fff;font-size: 20rpx;text-align: center;">{{$nw("分享")}}
					</view>

				</view>

			</view>

		</view>
		<!-- #endif -->




		<!--底部按钮-->
		<view class="btns-wrap" v-if="product_type == 'goods'">

			<view class="icon-box d-c-c" @click="goHome">
				<button class="icon iconfont icon-Homehomepagemenu"
					style="background: #fcfcfc;color: #3a3a3a;"></button>
			</view>
			<!-- #ifdef MP-WEIXIN -->
			<view class="icon-box d-c-c"><button class="icon iconfont icon-kefu2"
					style="background: #fcfcfc;color: #3a3a3a;" open-type="contact" session-from="wxapp"></button>
			</view>
			<!-- #endif -->
			<!-- #ifdef H5 -->
			<view class="icon-box d-c-c" @click="openMaservice"><button class="icon iconfont icon-kefu2"
					:style="[textColor(true)]"></button>
			</view>
			<!-- #endif -->
			<!--收藏-->
			<view class="">
				<view class="icon-box d-c-c" @click="gotocart" v-if="(shopp_cart_is_open == 0 && (store.is_open_cart == 1 || store.is_open_cart == 0)) ||
				(shopp_cart_is_open == 2)">
					<button class="pr icon iconfont icon-gouwuche">
						<text v-if="cart_total_num > 0" class="num">{{ cart_total_num }}</text>
					</button>
				</view>
			</view>
			<template v-if="(detail.buy_auth.can_buy>0)">
				<!-- shopp_cart_is_open  0 不干预商家设置  1  强制所有站点关闭  2 强制所以站点开启 -->
				<!-- 开启购物车+立即购买 -->
				<template>
					<button v-if="(shopp_cart_is_open == 0 && (store.is_open_cart == 1 || store.is_open_cart == 0)) ||
				(shopp_cart_is_open == 2)" type="primary" class="add-cart" @click="openPopup('card')">{{$nw("加入购物车")}}</button>


					<button type="primary" v-if="store.is_open_cart == 0 || store.is_open_cart == 2" class="buy"
						@click="openPopup('order')">{{$nw("立即购买")}}</button>
				</template>


			</template>
			<template v-if="(detail.buy_auth.can_buy<1)">
				<button type="primary" class="buy"
					@click="gotoPages(detail.buy_auth)">{{detail.buy_auth.tips ? detail.buy_auth.tips : $nw("无权限")}}</button>
			</template>

		</view>
		<view v-else>
			<Tabbar></Tabbar>
		</view>

		<!--购物确定-->
		<!-- <spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec> -->
		<QuickOrder :isPopup_q="isPopup" :productModel_q="productModel" @close="closePopup" type="detail"></QuickOrder>

		<!--底部弹窗-->
		<share :isbottmpanel="isbottmpanel" :product_id="product_id" @close="closeBottmpanel"></share>

		<!--生成图片-->
		<uniPopup :show="isCreatedImg" type="middle" @hidePopup="hidePopupFunc">
			<view class="d-c-c d-c create-img">
				<image :src="poster_img" mode="widthFix"></image>
				<!-- #ifdef MP -->
				<button class="btn-red mt20" type="default" @click="savePosterImg">{{$nw("保存图片")}}</button>
				<!-- #endif  -->
				<!-- #ifdef H5 -->
				<view class="mt20 f34 red" type="default">{{$nw("长按保存图片")}}</view>
				<!-- #endif -->
			</view>
		</uniPopup>

		<!--客服-->
		<Mpservice v-if="isMpservice" :copy_success="copy_success" :isMpservice="isMpservice" @close="closeMpservice">
		</Mpservice>
		<!-- 提示 -->
		<tips v-if="is_tips" :tips_data="tips_data" @changeTips="changeTips"></tips>
		<!-- 产品参数 -->
		<attr v-if="isShowAttr" :isShowAttr="isShowAttr" :product_id="product_id" @changeAttr="changeAttr"></attr>
	</view>
</template>

<script>
	import share from './popup/share.vue';
	// import spec from './popup/spec.vue';
	import uniPopup from '@/components/uni-popup.vue';
	import Tabbar from '@/components/tabbar/tabbar.vue';
	import Mpservice from '@/components/mpservice/Mpservice.vue';
	import utils from '@/common/utils.js';
	import tips from './popup/tips.vue';
	import attr from './popup/attr.vue';
	import QuickOrder from '@/components/quickOrder/quickOrder.vue';
	export default {
		components: {
			// spec,
			share,
			uniPopup,
			Mpservice,
			tips,
			attr,
			Tabbar,
			QuickOrder
		},
		data() {
			return {
				copy_success: this.$nw("复制成功"),
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				/*是否加载完成*/
				loadding: true,
				/*是否显示面板指示点*/
				indicatorDots: true,
				/*是否知道切换*/
				autoplay: false,
				/*自动切换时间间隔*/
				interval: 2000,
				/*滑动动画时长*/
				duration: 500,
				/*是否确定购买弹窗*/
				isPopup: false,
				/*商品id*/
				product_id: null,
				/*商品详情*/
				detail: {
					product_sku: {},
					show_sku: {
						product_price: '',
						product_sku_id: 0,
						line_price: '',
						stock_num: 0,
						sku_image: ''
					},
					buy_auth: {
						monthLimit: 0,
						maxMonthProductNum: 0,
					},
					collect: {
						collect_id: 0,
						status: 0
					}
				},
				relation_product: {},
				relation_label: {},
				supply_open: '',
				supply: {},
				store: {},
				/*商品属性*/
				specData: null,
				/*子级页面传参*/
				productModel: {},

				buyNow: false,
				share_url: '',
				/*规格数组*/
				productSpecArr: [],
				/*购物车商品数量*/
				cart_total_num: 0,
				/*分享*/
				isbottmpanel: false,
				/*是否生成图片*/
				isCreatedImg: false,
				poster_img: '',
				/*是否打开客服*/
				isMpservice: false,
				isshow: true,
				/* 是否打开提示页面 */
				is_tips: false,
				tips_data: {},
				play: "https://s101.kemanduo.cc/app/static/images/video_play.png",
				showvideo: false,
				showpic: true,
				videoContext: false,
				cover: false,
				phoneWidth: '',
				isShowAttr: false,
				attrStatus: false,
				plus_img: '',
				product_type: 'goods',
				text: {
					buy_text: this.$nw("立即抢购"),
				},
				shopp_cart_is_open: uni.getStorageSync("appinfo").shopp_cart_is_open,
				supply_show: 0,
			};
		},
		onShow() {
			var self = this;
			uni.setNavigationBarTitle({
				title: self.$nw("商品详情")
			});
		},
		onLoad(e) {
			/*商品id*/
			let scene = utils.getSceneData(e);
			this.product_id = e.product_id ? e.product_id : scene.gid;
			this.referee_id = e.uid ? e.uid : scene.uid;
			console.log("this.referee_id", this.referee_id)
			uni.setStorageSync("referee_id", this.referee_id)
			//#ifdef H5
			this.share_url = window.location.href;
			//#endif
		},

		mounted() {
			this.setGlobalColor()
			this.init();
			/*获取产品详情*/
			this.getData();
		},
		computed: {
			textColor() {
				return flag => {
					flag = !!flag
					return this.setColor(flag)
				}
			},
			bgcColor() {
				return this.setBackgroundColor()
			},
		},
		methods: {
			// 商品详情图片预览
			getImagesUrl(e) {
				console.log('e--->', e);
				let imgPath = e.detail.node.attrs.src;
				if (imgPath) {
					let arr = []
					arr.push(imgPath)
					uni.previewImage({
						urls: arr
					})
				}
			},

			/*分享*/
			onShareAppMessage() {
				let self = this;
				// 构建页面参数
				let params = self.getShareUrlParams({
					product_id: self.product_id,
					uid: uni.getStorageSync("user_id")
				});
				return {
					title: self.detail.product_name,
					path: '/main/pages/product/detail/detail?' + params
				};
			},
			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneWidth = res.windowWidth;
						_this.phoneHeight = res.windowHeight;
						// 计算组件的高度
						let view = uni.createSelectorQuery().select('.btns-wrap');
						view.boundingClientRect(data => {
							let h = _this.phoneHeight - data.height;
							_this.scrollviewHigh = h;
						}).exec();
					}
				});
			},

			/*获取数据*/
			getData() {
				let self = this;
				let product_id = self.product_id;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				self._get(
					'product.product/detail', {
						product_id: product_id,
						url: self.share_url
					},
					function(res) {
						self.cart_total_num = res.data.cart_total_num;
						self.isshow = res.data.is_show_stock;
						/*详情内容格式化*/
						res.data.detail.content = utils.format_content(res.data.detail.content);

						// 初始化商品多规格
						if (res.data.detail.spec_type == 20) {
							self.initSpecData(res.data.specData);
						}

						self.detail = res.data.detail
						if ((!self.detail.image || !self.detail.image.length) && self.detail.product_main_img) {
							self.detail.image = []
							self.detail.image.push({
								file_path: self.detail.product_main_img
							})
							console.log('self.detail.image', self.detail.image);
						}
						self.detail.product_sku = self.detail.product_sku || {}
						self.text = res.data.text
						if (self.detail.page_id < 0) {
							self.product_type = 'show'
						}
						self.relation_product = res.data.relation_product;
						self.relation_label = res.data.relation_label || [];


						self.supply = res.data.supply;
						self.supply_open = res.data.supply_open;
						var product_vars = res.data.product_vars;
						self.store = res.data.store;


						if (self.store.is_open_cart === true) {
							self.store.is_open_cart = 0;
						} else if (self.store.is_open_cart === false) {
							self.store.is_open_cart = 2;
						}
						self.product_no_show = product_vars.product_no_show;
						self.product_diy_no_show = product_vars.product_diy_no_show;
						self.product_no_text = !product_vars.product_no_text ? self.$nw("商品编号") :
							product_vars.product_no_text;
						self.product_diy_no_text = !product_vars.product_diy_no_text ? self.$nw("商品自编号") :
							product_vars
							.product_diy_no_text;
						self.plus_img = product_vars.product_plus_image ? product_vars.product_plus_image : '';
						self.supply_show = product_vars.supply_show;
						self.label_show = product_vars.label_show;
						self.attrStatus = res.data.attr_data > 0 ? true : false;
						self.error_img = product_vars.product_default_image ? product_vars.product_default_image
							.file_path : ''

						if (self.detail.video) {
							self.showvideo = true;
							self.showpic = false;
							self.cover = true;
						}

						// 配置微信分享参数
						//#ifdef H5
						if (self.share_url != '') {
							let params = {
								product_id: self.product_id
							};
							self.configWx(res.data.share.signPackage, res.data.share.shareParams, params);
						}
						//#endif
						self.loadding = false;
						uni.hideLoading();
					},
					function() {
						self.loadding = false;
						uni.hideLoading();
					},
				);
			},

			/*多规格商品*/
			initSpecData(data) {
				for (let i in data.spec_attr) {
					var spec = [];
					if (data.spec_attr[i] &&
						data.spec_attr[i].spec_items &&
						data.spec_attr[i].spec_items.length > 0) {
						for (let j in data.spec_attr[i].spec_items) {
							data.spec_attr[i].spec_items[j].checked = false;
							spec.push(data.spec_attr[i].spec_items[j])
						}
						data.spec_attr[i].spec_items = spec;
					}
				}
				this.specData = data;
			},

			/*选规格*/
			openPopup(e) {
				let self = this;
				if (self.supply && self.supply.is_forbidden_buy == 1) {
					self.tips_data = {
						img: self.supply.wxqrcode,
					};
					self.is_tips = true;
					return;
				}

				let obj = {
					specData: this.specData,
					detail: this.detail,
					productSpecArr: this.specData != null ? new Array(this.specData.spec_attr.length) : [],
					show_sku: {
						sku_image: '',
						seckill_price: 0,
						product_sku_id: 0,
						line_price: 0,
						seckill_stock: 0,
						seckill_product_sku_id: 0,
						sum: 1
					},
					type: e,
					isshow: this.isshow
				};

				this.productModel = obj;
				this.isPopup = true;
			},

			/* 修改is_tips */
			changeTips(e) {
				this.is_tips = false;
			},

			/*关闭属性弹框 */
			changeAttr(e) {
				this.isShowAttr = false;
			},

			/*关闭弹窗*/
			closePopup() {
				let self = this;
				self.isPopup = false;
				self.getData();
			},

			/*查看更多评价*/
			lookEvaluate(product_id) {
				uni.navigateTo({
					url: '/main/pages/product/detail/look-evaluate/look-evaluate?product_id=' + product_id
				});
			},



			/*跳转购物车*/
			gotocart() {
				/* uni.switchTab({
					url: '/pages/cart/cart'
				}); */
				uni.navigateTo({
					url: '/pages/cart/cart'
				});
			},
			goHome() {
				uni.navigateTo({
					url: '/pages/index/index'
				})
			},
			goUser() {
				uni.navigateTo({
					url: '/user/pages/index/index'
				})
			},
			callSupply(item) {
				if (item.user && item.user.mobile) {
					uni.makePhoneCall({
						phoneNumber: "" + item.user.mobile
					})
				}

			},
			gotoPages(e) {
				if (!e.linkUrl) {
					return
				}
				uni.navigateTo({
					url: '/' + e.linkUrl
				})
			},
			//关闭分享
			closeBottmpanel(data) {
				this.isbottmpanel = false;
				if (data.type == 2) {
					this.poster_img = data.poster_img;
					this.isCreatedImg = true;
				}
			},
			//分享按钮
			showShare() {
				var self = this;
				if (uni.getStorageSync("user_id")) {
					self.isbottmpanel = true;
				} else {
					uni.showModal({
						title: self.$nw("系统提示："),
						content: self.$nw("您还未登录，是否先前往登录"),
						success(re) {
							if (re.confirm) {
								// 根据不同的情况跳转到不同的页面
								self.login("pass_login", [0])
								return;
							}
						}
					})

				}

			},

			//关闭生成图片
			hidePopupFunc() {
				this.isCreatedImg = false;
			},

			//保存海报图片
			savePosterImg() {
				let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
				// 下载海报图片
				uni.downloadFile({
					url: self.poster_img,
					success(res) {
						uni.hideLoading();
						// 图片保存到本地
						uni.saveImageToPhotosAlbum({
							filePath: res.tempFilePath,
							success(data) {
								uni.showToast({
									title: self.$nw("保存成功"),
									icon: 'success',
									duration: 2000
								});
								// 关闭商品海报
								self.isCreatedImg = false;
							},
							fail(err) {
								if (err.errMsg === 'saveImageToPhotosAlbum:fail auth deny') {
									uni.showToast({
										title: self.$nw("请允许访问相册后重试"),
										icon: 'none',
										duration: 1000
									});
									setTimeout(() => {
										uni.openSetting();
									}, 1000);
								}
							},
							complete(res) {
								console.log('complete');
							}
						});
					}
				});
			},

			/*打开客服*/
			openMaservice() {
				this.isMpservice = true;
			},

			/*推荐商品跳转*/
			gotoList(e) {
				let url = 'main/pages/product/detail/detail?product_id=' + e
				this.gotoPage(url);
			},
			/*进入店铺跳转*/
			gotoSupply(e) {
				let url = 'plus/pages/supply/detail/detail?supply_id=' + e
				this.gotoPage(url);
			},
			/*关闭客服*/
			closeMpservice() {
				this.isMpservice = false;
			},
			toShowPic() {
				this.showpic = !0;
				this.showvideo = false;
				this.cover = false;
				// #ifdef MP
				this.videoContext = uni.createVideoContext("myVideo"), this.videoContext.pause();
				// #endif
			},
			toShowVideo() {
				this.showpic = !1;
				this.showvideo = !0;
				// #ifdef MP
				this.videoContext = uni.createVideoContext("myVideo"), this.videoContext.play()
				// #endif
			},
			startplay() {
				this.cover = !1;
				// #ifdef MP
				this.videoContext = uni.createVideoContext("myVideo"), this.videoContext.play();
				// #endif
			},
			/*收藏*/
			onCollect() {
				let self = this;
				self._get('product.collect/add', {
					id: self.detail.collect.collect_id,
					product_id: self.detail.product_id,
					type: "collect_product"
				}, function(res) {
					if (res.code) {
						if (!self.detail.collect.collect_id) {
							self.detail.collect = res.data;
						} else {
							self.detail.collect.status = !self.detail.collect.status;
						}
						uni.showToast({
							title: self.detail.collect.status ? self.$nw("收藏成功") : self.$nw(
								"取消成功"),
							duration: 2000,
							icon: 'none'
						});
					}
				});
			},
			// 预览图片多张
			previewImg(index) {
				let _this = this;
				let imgsArray = [];
				let imgUrlList = this.detail.image;
				for (let i = 0; i < imgUrlList.length; i++) {
					if (imgUrlList[i].file_path != "") {
						imgsArray.push(imgUrlList[i].file_path);
					}
				}
				uni.previewImage({
					current: index - 1,
					urls: imgsArray,
					indicator: 'number',
					loop: true
				});

			},
			// 显示商品属性
			showAttr() {
				let _self = this;
				_self.isShowAttr = true
			}
		}
	};
</script>

<style lang="scss" scoped>
	.product-detail {
		padding-bottom: 90rpx;

		/deep/.uni-swiper-dots {
			padding: 8rpx 12rpx;
			border-radius: 999px;
			background: rgba(0, 0, 0, 0.4);

			.uni-swiper-dot {
				width: 8rpx;
				height: 8rpx;
				background: rgba(255, 255, 255, 0.6);
				transition: all .2s;
				margin: 0 5rpx !important;

				&.uni-swiper-dot-active {
					width: 24rpx;
					border-radius: 999px;
					background: #fff;
				}
			}
		}

		/deep/.wx-swiper-dots {
			padding: 8rpx 12rpx;
			border-radius: 999px;
			background: rgba(0, 0, 0, 0.4);

			.wx-swiper-dot {
				width: 8rpx;
				height: 8rpx;
				background: rgba(255, 255, 255, 0.6);
				transition: all .2s;
				margin: 0 5rpx !important;

				&.wx-swiper-dot-active {
					width: 24rpx;
					border-radius: 999px;
					background: #fff;
				}
			}
		}
	}

	.product-detail .product-pic,
	.product-detail .product-pic .swiper,
	.product-detail .product-pic image {
		width: 750rpx;
		// height: 750rpx;
		height: 560rpx;
	}

	.product-detail .price-wrap {
		padding: 20rpx 20rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.product-detail .price-wrap .left {
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
	}

	.product-detail .price-wrap .new-price {
		color: $dominant-color;
		font-size: 30rpx;
		font-weight: bold;
	}

	.product-detail .price-wrap .new-price .num {
		padding: 0 4rpx;
		font-size: 50rpx;
	}

	.product-detail .price-wrap .old-price {
		font-size: 30rpx;
		color: #999999;
		text-decoration: line-through;
	}

	.product-detail .price-wrap .is-user-grade {
		padding: 0 10rpx;
		border-radius: 30rpx;
		margin-left: 10rpx;
		background: $dominant-color;
		color: #ffffff;
	}

	.product-detail .already-sale {
		font-size: 24rpx;
		color: #333333;
	}

	.product-detail .product-name {
		padding: 20rpx 20rpx 0;
		font-size: 30rpx;
		font-weight: bold;
		color: #333333;
	}

	.product-detail .product-subtitle {
		padding: 20rpx 20rpx 0;
		font-size: 30rpx;
		font-weight: bold;
		color: #999999;
	}

	.product-detail .product-describe {
		padding: 20rpx;
		line-height: 40rpx;
		font-size: 24rpx;
		color: red;
	}

	.product-comment,
	.product-content {
		margin-top: 20rpx;
		background: #ffffff;
	}

	.product-content .content-box p image {
		width: 100%;
	}

	.product-content .content-box {
		font-size: 36rpx;
	}


	.btns-wrap {
		position: fixed;
		height: 90rpx;
		right: 0;
		bottom: 0;
		left: 0;
		display: flex;
		background: #ffffff;
	}

	.btns-wrap .icon-box {
		width: 90rpx;
		height: 90rpx;
		border-right: 1px solid #dddddd;
	}

	.btns-wrap .icon-box .iconfont {
		font-size: 40rpx;
		color: #888888;
	}

	.btns-wrap .icon-box .iconfont .num {
		position: absolute;
		top: 10rpx;
		left: 50%;
		height: 30rpx;
		min-width: 30rpx;
		overflow: hidden;
		line-height: 32rpx;
		border-radius: 15rpx;
		font-size: 20rpx;
		color: #ffffff;
		background: red;
	}

	.btns-wrap button,
	.btns-wrap button:after {
		height: 91rpx;
		line-height: 90rpx;
		margin: 0;
		padding: 0;
		flex: 1;
		border-radius: 0;
		border: 0;
	}

	.btns-wrap button.add-cart {
		background: $orange-color;
	}

	.btns-wrap button.buy {
		background: $dominant-color;
	}

	.share-box1 {
		position: fixed;
		padding-right: 10rpx;
		width: 100rpx;
		height: 90rpx;
		right: 0;
		bottom: 266rpx;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		border-radius: 16rpx 0 0 16rpx;
		background: rgba(0, 0, 0, 0.8);

		.iconfont {
			margin-bottom: 10rpx;
			font-size: 50rpx;
			color: #ffffff;
		}
	}

	.share-box2 {
		position: fixed;
		padding-right: 10rpx;
		width: 100rpx;
		height: 90rpx;
		right: 0;
		bottom: 366rpx;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		border-radius: 16rpx 0 0 16rpx;
		background: rgba(0, 0, 0, 0.8);

		.iconfont {
			margin-bottom: 10rpx;
			font-size: 50rpx;
			color: #ffffff;
		}
	}

	.share-box {
		position: fixed;
		padding-right: 10rpx;
		width: 100rpx;
		height: 90rpx;
		right: 0;
		bottom: 170rpx;
		// display: flex;
		// justify-content: center;
		// align-items: center;
		border-radius: 16rpx 0 0 16rpx;
		background: rgba(0, 0, 0, 0.8);
	}

	.share-box button {
		padding: 0;
		background: 0;
		line-height: 60rpx;
	}

	.share-box .iconfont {
		margin-bottom: 10rpx;
		font-size: 50rpx;
		color: #ffffff;
	}

	.create-img {
		width: 100%;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.create-img image {
		width: 100%;
	}

	.create-img button {
		width: 100%;
		height: 88rpx;
		line-height: 88rpx;
		border-radius: 44rpx;
		box-shadow: 0 8rpx 16rpx 0 rgba(226, 35, 26, 0.6);
	}

	.label-title {
		border-top: 1rpx solid #ddd;
		padding: 20rpx;
		background-color: #fff;
	}

	.label-title .label-name {
		line-height: 48rpx;
		margin: 8rpx;
		padding: 8rpx;
		border-radius: 10rpx;
		background-color: #f6f6f6;
		display: inline-block;
	}

	.recommend-product {
		margin-top: 10rpx;
	}

	.recommend-product .title {
		heigth: 100rpx;
		font-size: 30rpx;
		background-color: #fff;
		text-align: left;
		-webkit-justify-content: left
	}

	.recommend-product .title .name {
		margin: 0 20rpx;
		font-size: 30rpx;
		line-height: 70rpx;
	}

	.recommend-product-list {
		padding: 10rpx 10rpx 0 10rpx;
		display: -webkit-box;
		-webkit-box-orient: horizontal;
		overflow: scroll;
	}

	.recommend-product-list .item {
		width: 33%;
		border-radius: 20rpx;
		margin-right: 10rpx;
		margin-bottom: 20rpx;
		padding-bottom: 20rpx;
		overflow: hidden;
		background: #ffffff;
		box-shadow: 0 0 8rpx rgba(0, 0, 0, .1);
		margin-bottom: 10rpx;
	}

	.recommend-product-list .product-cover {
		width: 100%;
		height: 240rpx;
	}

	.recommend-product-list image {
		width: 100%;
		height: 100%;
	}

	.recommend-product-list .product-info {
		padding: 0 8rpx;
	}

	.recommend-product-list .product-title {
		// height: 80rpx;
		// margin-top: 10rpx;
		display: -webkit-box;
		overflow: hidden;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		font-size: 28rpx;
	}

	.recommend-product-list .price {
		color: red;
	}

	.recommend-product-list .price .num {
		font-size: 30rpx;
		font-weight: bold;
	}

	.supply-item {
		padding: 10px 10px 0 10px;
		background: #fff;
		margin-top: 10rpx;
	}

	// .supply-item .cmt-user{
	// 	background-color: #fff;
	// }
	.supply-item .left {

		padding-bottom: 20rpx;
	}

	.supply-item .supply {
		width: 140rpx;
		height: 140rpx;
		border-radius: 20rpx;
		float: left;
	}

	.supply-item .supply1 {
		float: left;
		overflow: hidden;
		height: 150rpx;
		width: 75%;
	}

	.supply-item .name {
		width: 100%;
		height: 150rpx;
		overflow: hidden;
		-webkit-line-clamp: 1;
		padding: 0 16rpx 16rpx 16rpx;
		font-size: 36rpx;

		overflow: hidden;
		text-overflow: ellipsis; //显示省略号
		display: -webkit-box;
		word-break: break-all; //换行
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 1; //控制行数

	}

	.supply-item .supply-desc {
		width: 100%;
		height: 70rpx;
		line-height: 40rpx;


		padding: 16rpx;
		font-size: 28rpx;
		color: #757575;

		overflow: hidden;
		text-overflow: ellipsis; //显示省略号
		display: -webkit-box;
		word-break: break-all; //换行
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2; //控制行数
	}

	.product-no {
		margin-top: 10rpx;
		padding-left: 20rpx;
		line-height: 70rpx;
		font-size: 30rpx;
		background-color: #ffffff;
	}

	.product-video {
		position: relative;
	}

	.product-video .bg,
	.cover .bg {
		position: absolute;
		left: 0;
		top: 0;
	}

	.product-video .play,
	.cover .play {
		position: absolute;
		left: 50%;
		top: 50%;
		margin-top: -70rpx;
		margin-left: -70rpx;
	}

	.change-mc {
		width: auto;
		height: auto;
		position: absolute;
		bottom: 80rpx;
		left: 50%;
		margin-left: -105rpx;
	}

	.change-mc view {
		display: inline-block;
		color: #ff5555;
		width: 100rpx;
		height: 44rpx;
		border-radius: 20rpx;
		text-align: center;
		line-height: 44rpx;
		float: left;
		background: rgba(255, 255, 255, 0.6);
		margin: 0 10rpx;
		font-size: 22rpx;
	}

	.change-mc view.active {
		color: #ffffff;
		background: #ff5555;
	}

	.video .block {
		display: block;
	}

	.video .none {
		display: none;
	}

	video {
		width: 750rpx;
		height: 750rpx;
	}

	.icon-collect {
		// width: 60rpx;
		// height: 55rpx;
	}

	.plus_img {
		width: 750rpx;
		height: 750rpx;
	}
</style>