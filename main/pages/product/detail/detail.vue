<template>
	<scroll-view scroll-y="true" class="product-detail scroll-Y"
		:style="'height:' + scrollviewHigh + 'px;'+'background:'+getMainColor()+';'" v-if="!loadding">
		<!--视频-->
		<view class="product-pic product-video">
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration" circular="true">
				<swiper-item v-if="detail.video">
					<video :src="detail.video" controls style="width: 100%;height: 100%;"></video>
				</swiper-item>
				<swiper-item v-for="(item, index) in detail.image" v-if="detail.image.length>0" :key="index">
					<image :src="item.file_path" mode="aspectFill" @click="previewImg(index)"></image>
				</swiper-item>
				<swiper-item v-for="(item, index) in detail.default_image"
					v-if="detail.image.length==0&&detail.default_image.length>0" :key="index">
					<image :src="item.file_path" mode="aspectFill" @click="previewImg(index)"></image>
				</swiper-item>
			</swiper>
		</view>
		<!--基本信息-->
		<view class="base-info bg-white">
			<view class="price-row flex-c">
				<view class="price">
					￥{{ detail.product_sku.product_price || detail.product_price || '--' }}
				</view>
				<view v-if="detail.product_sku.line_price && detail.product_sku.line_price > 0" class="line-price">
					￥{{ detail.product_sku.line_price }}
				</view>
				<view v-if="detail.show_self_commission == 1 && detail.self_commission > 0" class="self-commission">
					自购返现￥{{ detail.self_commission }}
				</view>
				<!-- <view class="sell-num">
					{{$nw("库存")}}{{detail.product_stock || '0'}}件
				</view> -->
				<view class="sell-num">
					{{$nw("已售")}}{{detail.product_sales || '0'}}
				</view>
			</view>
			<view class="product-title">
				{{detail.product_name || '--'}}
			</view>
			<view v-if="detail.selling_point" class="product-note">
				{{detail.selling_point}}
			</view>
			<view v-if="relation_label.length && label_show" class="product-tags">
				<view class="tag" v-for="(tag,i) in relation_label" :key="i">
					{{tag}}
				</view>
			</view>

			<view v-if="detail.show_commission && detail.direct_commission > 0" class="share-tips flex-c">
				<view class="label">
					{{$nw("推荐")}}
				</view>
				<view class="content">
					{{$nw("分享可赚佣金")}}￥
					<text class="money">
						{{toFixed(detail.direct_commission)}}
					</text>
				</view>
				<view class="share-btn flex-c" @click="showShare">
					{{$nw("立即分享")}}
					<i class="iconfont icon-jiantou"></i>
				</view>
			</view>

			<view class="product-other-info">
				<view class="other-info-item flex-c" @click="findGoodsAttr()">
					<view class="label">
						{{$nw("产品")}}
					</view>
					<view class="value">
						{{$nw("品牌")}}
					</view>
					<view class="value">
						{{$nw("参数")}}
					</view>
					<i class="iconfont icon-jiantou"></i>
				</view>
				<view class="other-info-item flex-c">
					<view class="label">
						{{$nw("服务")}}
					</view>
					<view class="value">
						{{$nw("7天无理由退货")}}
					</view>
				</view>
			</view>
		</view>
		<!-- 评价 -->
		<view class="product-evaluate bg-white">
			<view class="evaluat-title flex-c">
				{{$nw("评价")}}({{detail.comment_data_count || 0}})
				<view class="more-btn flex-c" @click="lookEvaluate(detail.product_id)">
					{{$nw("查看全部")}}
					<i class="iconfont icon-jiantou"></i>
				</view>
			</view>
			<!-- <view class="evaluat-tags">
				<view class="tag">
					物流快
				</view>
				<view class="tag">
					质量好
				</view>
			</view> -->
			<view class="evaluat-list">
				<view class="evaluat-item" v-for="(item, index) in detail.commentData" :key="index">
					<view class="evaluat-user flex-c">
						<view class="user-photo">
							<image :src="item.user.avatarUrl" mode="aspectFill" />
						</view>
						<view class="user-info">
							<view class="user-name">
								{{item.user.nickName}}
							</view>
						</view>
						<view class="evaluat-date">
							{{item.create_time}}
						</view>
					</view>
					<view class="evaluat-content">
						<view class="content-text text-ellipsis2">
							{{item.content}}
						</view>
						<!-- <view class="content-imgs">
							<view class="img" v-for="index in 3" :key="index">
								<image
									src="https://shanghui.client.xcx008.com/file/uploads/20240426/35404455d98164dc135a7f7cfe2dfa74.jpeg"
									mode="aspectFill"></image>
							</view>
						</view> -->
					</view>
				</view>
			</view>
		</view>
		<!-- 店铺信息 -->
		<view class="shop-group bg-white" v-if="detail.supply_id && supply_open && supply_show">
			<view class="shop-content">
				<view class="shop-info flex" @click="gotoSupply(detail.supply_id)">
					<view class="shop-logo">
						<image :src="supply.image_url" mode="aspectFill"></image>
					</view>
					<view class="shop-name">
						{{supply.name || '--'}}
					</view>
					<view class="more-btn flex-c" @click="gotoSupply(detail.supply_id)">
						{{$nw("进入店铺")}}
						<i class="iconfont icon-jiantou"></i>
					</view>
				</view>
				<view v-if="supply.introduce" class="shop-dec">
					{{$nw("简介：")}}{{supply.introduce}}
				</view>

				<!-- <view class="shop-goods flex">
				<view class="goods-item" v-for="index in 4">
					<view class="goods-img">
						<image
							src="https://shanghui.client.xcx008.com/file/uploads/20240426/35404455d98164dc135a7f7cfe2dfa74.jpeg"
							mode="aspectFill"></image>
					</view>
					<view class="goods-title text-ellipsis2">
						日式木植自种盆栽diy桌面办公桌摆件
					</view>
					<view class="goods-price">
						￥28
					</view>
				</view>
			</view> -->
			</view>
		</view>
		<!-- 商品详情 -->
		<view v-if="detail.content || plus_img" class="product-introduce bg-white">
			<view class="introduce-title">
				{{$nw("商品详情")}}
			</view>
			<u-parse v-if="detail.content" class="introduce-content" :html="detail.content"></u-parse>
			<image v-if="plus_img" :src="plus_img" mode="widthFix" style="width: 100%;" />
		</view>

		<!-- 底部栏 -->
		<view class="product-tabbar flex-c">
			<view class="tabbar-handle flex-c">
				<view v-if="detail.supply_id && supply_open && supply_show" class="handle-item"
					@click="gotoSupply(detail.supply_id)">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon1.png"></image>
					</view>
					<view class="handle-label">
						{{$nw("店铺")}}
					</view>
				</view>
				<view class="handle-item" @click="showShare">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon8.png"></image>
					</view>
					<view class="handle-label">
						{{$nw("分享")}}
					</view>
				</view>
				<!-- #ifdef MP-WEIXIN -->
				<view class="handle-item">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon3.png"></image>
					</view>
					<view class="handle-label">
						{{$nw("客服")}}
					</view>
					<button class="service-btn" open-type="contact" session-from="wxapp"></button>
				</view>
				<!-- #endif -->

				<!-- #ifdef H5 -->
				<view class="handle-item" @click="openMaservice">
					<view class="icon">
						<image class="common-img" src="@/static/product/icon3.png"></image>
					</view>
					<view class="handle-label">
						{{$nw("客服")}}
					</view>
				</view>
				<!-- #endif -->
			</view>
			<view class="buy-btn" @click="openPopup('order')">
				{{$nw("立即购买")}}
			</view>
		</view>

		<!-- 参数弹窗 -->
		<u-popup class="diy-select-popup" v-model="showPopup" mode="bottom">
			<view class="popup-content">
				<view class="popup-title">
					{{$nw("产品参数")}}
					<view class="close-btn" @click="showPopup = false">
						<i class="iconfont icon-guanbi"></i>
					</view>
				</view>
				<view class="parameter-list">
					<view class="parameter-item flex-c" v-for="(item,index) in attrList" :key="index">
						<view class="label">
							{{item.attr_value_name}}
						</view>
						<view class="value">
							{{item.attr_value}}
						</view>
					</view>
				</view>
				<view class="select-btn" @click="showPopup = false">
					{{$nw("确定")}}
				</view>
			</view>
		</u-popup>

		<!-- 立即购买弹窗 -->
		<!-- <u-popup class="diy-select-popup" v-model="buyPopup" mode="bottom" :mask-close-able="false">
			<view class="popup-content">
				<view class="popup-title">
					确认订单
					<view class="close-btn" @click="buyPopup = false">
						<i class="iconfont icon-guanbi"></i>
					</view>
				</view>

				<view class="buy-popup-content">
					<view class="address-box flex-c">
						<view class="icon">
							<image src="../../../../static/product/icon4.png" />
						</view>
						<view class="info">
							<view class="name flex-c">
								张三
								<view class="phone">
									12345678901
								</view>
							</view>
							<view class="address">
								广东省东莞市东城区鸿福路201号
							</view>
						</view>
						<i class="iconfont icon-jiantou"></i>
					</view>
					<view class="goods-info flex-c">
						<view class="goods-img">
							<image
								src="https://shanghui.client.xcx008.com/file/uploads/20240522/2039eb4fd3f42d53b589017e6f303b72.jpg"
								mode="aspectFill"></image>
						</view>
						<view class="info">
							<view class="price flex">
								￥289
								<view class="line-price">
									￥299
								</view>
							</view>
							<view class="tips flex-c">
								<view class="label">
									已选择
								</view>
								<view class="value">
									六月雪盆栽 迎客松形状
								</view>
							</view>
							<view class="count-box flex-c">
								<view class="item icon">
									<i class="icon iconfont icon-jian"></i>
								</view>
								<view class="item num">
									1
								</view>
								<view class="item icon">
									<i class="icon iconfont icon-jia"></i>
								</view>
							</view>
						</view>
					</view>
					<view class="category">
						<view class="category-title">
							商品种类
						</view>
						<view class="category-list flex">
							<view class="category-item" v-for="index in 2" :key="index">
								迎客松造型
							</view>
						</view>
					</view>
				</view>

				<view class="select-btn">
					立即支付
				</view>
			</view>
		</u-popup> -->

		<!--购物确定-->
		<!-- <spec :isPopup="isPopup" :productModel="productModel" @close="closePopup"></spec> -->
		<QuickOrder :isPopup_q="isPopup" :productModel_q="productModel" @close="closePopup" type="detail"></QuickOrder>

		<!--底部弹窗-->
		<share :isbottmpanel="isbottmpanel" :product_id="product_id" :show_commission="detail.show_commission"
			:direct_commission="detail.direct_commission" @close="closeBottmpanel"></share>

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
	</scroll-view>
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
				relation_label: [],
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
				showPopup: false,
				attrList: null,
				label_show: 0,
				is_first: true
			};
		},
		onShow() {
			var self = this;
			uni.setNavigationBarTitle({
				title: self.$nw("商品详情")
			});

			if (self.referee_id && !this.is_first) {
				self.bindUser()
			}
			this.is_first = false
		},
		onLoad(e) {
			console.log('eeeeeeee', e);
			this.setGlobalColor()
			this.init();
			/*商品id*/
			let scene = utils.getSceneData(e);
			this.product_id = e.product_id ? e.product_id : scene.gid;
			/*获取产品详情*/
			this.getData();
			this.referee_id = e.uid || e.referee_id || scene.uid || null;
			console.log("this.referee_id--->", this.referee_id)
			uni.setStorageSync("referee_id", this.referee_id)
			if (this.referee_id) {
				this.bindUser()
			}
			//#ifdef H5
			this.share_url = window.location.href;
			console.log('this.share_url', this.share_url);
			//#endif
		},

		mounted() {

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
		/*分享*/
		onShareAppMessage() {
			let self = this;
			// 构建页面参数
			let params = self.getShareUrlParams({
				product_id: self.product_id,
				uid: uni.getStorageSync("user_id")
			});
			console.log('分享参数', params);
			self.getShareUser()
			return {
				title: self.detail.product_name,
				path: '/main/pages/product/detail/detail?' + params
			};
		},
		onShareTimeline() {
			let self = this;
			// 构建页面参数
			let params = self.getShareUrlParams({
				product_id: self.product_id,
				uid: uni.getStorageSync("user_id")
			});
			console.log('分享参数', params);
			self.getShareUser()
			return {
				title: self.detail.product_name,
				path: '/main/pages/product/detail/detail?' + params
			};
		},
		methods: {
			// 分享邀请次数
			getShareUser() {
				this._get(
					'user.user/getShareUser', {}
				);
			},
			// 商品分享绑定
			bindUser() {
				if (!uni.getStorageSync('token')) {
					this.login("pass_login", [0])
					return
				}
				console.log('商品分享绑定--->');
				this._get(
					'plus.sharebind.Bind/BindUser', {
						product_id: this.product_id,
						referee_id: this.referee_id
					}
				);
			},
			// 查看产品参数
			findGoodsAttr() {
				if (this.attrList && this.attrList.length) {
					this.showPopup = true;
					return
				}
				// uni.showLoading({
				// 	title: '加载中'
				// });
				this._get(
					'product.product/findGoodsAttr', {
						product_id: this.product_id,
					},
					(res) => {
						if (res.data && res.data.info && res.data.info.length) {
							this.attrList = res.data.info
							this.showPopup = true
						} else {
							this.attrList = null
							setTimeout(() => {
								this.tip(this.$nw("暂无产品参数"), 2000)
							}, 16)
						}
					},
					(err) => {
						// uni.hideLoading();
					}
				);
			},
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


			/*初始化*/
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneWidth = res.windowWidth;
						_this.phoneHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
						// 计算组件的高度
						// let view = uni.createSelectorQuery().select('.btns-wrap');
						// view.boundingClientRect(data => {
						// 	let h = _this.phoneHeight - data.height || 0;
						// 	_this.scrollviewHigh = h;
						// }).exec();
					}
				});
			},

			/*获取数据*/
			getData() {
				uni.showLoading({
					title: this.$nw("加载中")
				});
				let product_id = this.product_id;
				this._get(
					'product.product/detail', {
						product_id: product_id,
						url: this.share_url
					},
					(res) => {
						this.cart_total_num = res.data.cart_total_num;
						this.isshow = res.data.is_show_stock;
						/*详情内容格式化*/
						res.data.detail.content = utils.format_content(res.data.detail.content);

						// 初始化商品多规格
						if (res.data.detail.spec_type == 20) {
							this.initSpecData(res.data.specData);
						}

						this.detail = res.data.detail
						if ((!this.detail.image || !this.detail.image.length) && this.detail.product_main_img) {
							this.detail.image = []
							this.detail.image.push({
								file_path: this.detail.product_main_img
							})
							console.log('this.detail.image', this.detail.image);
						}
						this.detail.product_sku = this.detail.product_sku || {}
						this.text = res.data.text
						if (this.detail.page_id < 0) {
							this.product_type = 'show'
						}
						this.relation_product = res.data.relation_product;
						this.relation_label = res.data.relation_label || [];


						this.supply = res.data.supply;
						this.supply_open = res.data.supply_open;
						let product_vars = res.data.product_vars;
						this.store = res.data.store;


						if (this.store.is_open_cart === true) {
							this.store.is_open_cart = 0;
						} else if (this.store.is_open_cart === false) {
							this.store.is_open_cart = 2;
						}
						this.product_no_show = product_vars.product_no_show;
						this.product_diy_no_show = product_vars.product_diy_no_show;
						this.product_no_text = !product_vars.product_no_text ? this.$nw("商品编号") :
							product_vars.product_no_text;
						this.product_diy_no_text = !product_vars.product_diy_no_text ? this.$nw("商品自编号") :
							product_vars
							.product_diy_no_text;
						this.plus_img = product_vars.product_plus_image ? product_vars.product_plus_image : '';
						this.supply_show = product_vars.supply_show;
						this.label_show = product_vars.label_show;
						this.attrStatus = res.data.attr_data > 0 ? true : false;
						this.error_img = product_vars.product_default_image ? product_vars.product_default_image
							.file_path : ''

						if (this.detail.video) {
							this.showvideo = true;
							this.showpic = false;
							this.cover = true;
						}

						// 配置微信分享参数
						//#ifdef H5
						if (this.share_url != '') {
							let params = {
								product_id: this.product_id
							};
							this.configWx(res.data.share.signPackage, res.data.share.shareParams, params);
						}
						//#endif
						this.loadding = false;
						uni.hideLoading();
					},
					(err) => {
						this.loadding = false;
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
				if (!uni.getStorageSync('token')) {
					this.login("pass_login", [0])
					return
				}

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
					current: index,
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
	.buy-popup-content {
		margin-top: 12rpx;

		.address-box {
			padding: 0 24rpx 24rpx;
			border-bottom: 16rpx solid #F5F7FA;

			.icon {
				width: 48rpx;
				height: 48rpx;
			}

			.info {
				margin-left: 16rpx;

				.name {
					font-size: 24rpx;
					font-weight: 500;

					.phone {
						font-size: 24rpx;
						font-weight: 500;
						margin-left: 32rpx;
					}
				}

				.address {
					font-size: 24rpx;
					color: #666;
				}
			}

			.iconfont {
				margin-left: auto;
				font-size: 28rpx;
				color: #999;
				margin-right: 10rpx;
			}
		}

		.goods-info {
			padding: 24rpx 24rpx 32rpx;

			.goods-img {
				width: 144rpx;
				height: 144rpx;
				border-radius: 8rpx;
				background: #eee;
				overflow: hidden;
			}

			.info {
				height: 144rpx;
				margin-left: 24rpx;
				display: flex;
				flex-direction: column;
				padding: 10rpx 0 0;

				.price {
					font-weight: 600;
					line-height: 1;

					.line-price {
						font-size: 20rpx;
						color: #999;
						margin-left: 16rpx;
						margin-top: auto;
						line-height: 1;
						text-decoration: line-through;
						font-weight: 400;
						position: relative;
						top: 2rpx;
					}
				}

				.tips {
					margin-top: 8rpx;

					.label {
						font-size: 24rpx;
						color: #666;
					}

					.value {
						font-size: 24rpx;
						margin-left: 16rpx;
					}
				}

				.count-box {
					margin-top: auto;

					.item {
						width: 32rpx;
						height: 32rpx;
						background: #F5F7FA;
						border-radius: 4rpx;
						display: flex;
						align-items: center;
						justify-content: center;

						.iconfont {
							font-size: 20rpx;
							transform: scale(.8);
							color: #666;
						}

						&.active {
							background: #E1F3FF;

							.iconfont {
								color: #1B94E0;
							}
						}

						&.num {
							min-width: 24rpx;
							font-size: 20rpx;
							font-weight: 500;
							background: none;
							margin: 0 8rpx;
						}
					}
				}
			}
		}

		.category {
			padding: 0 24rpx 80rpx;

			.category-title {
				font-weight: 500;
				line-height: 1;
			}

			.category-list {
				flex-wrap: wrap;
				margin-left: -16rpx;
				margin-top: 20rpx;

				.category-item {
					line-height: 1;
					font-size: 24rpx;
					color: #333333;
					height: 52rpx;
					padding: 0 16rpx;
					border-radius: 8rpx;
					border: 2rpx solid #F5F7FA;
					background: #F5F7FA;
					display: flex;
					align-items: center;
					justify-content: center;
					margin-left: 16rpx;
					margin-bottom: 16rpx;

				}
			}
		}
	}

	.product-detail {
		background: #fff !important;
		overflow: hidden;

		// padding-bottom: calc(120rpx + env(safe-area-inset-bottom) / 2);
		.scroll-Y {
			background: #fff !important;

		}

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

		.base-info {
			padding: 24rpx 24rpx 0;

			.price-row {
				.price {
					font-size: 32rpx;
					color: #F31111;
					font-weight: 600;
				}

				.line-price {
					font-size: 24rpx;
					color: #999;
					text-decoration: line-through;
					margin-left: 16rpx;
					position: relative;
					top: 2rpx;
				}

				.self-commission {
					height: 32rpx;
					font-size: 20rpx;
					color: #fff;
					display: flex;
					align-items: center;
					padding: 0 6rpx;
					background: #1B94E0;
					border-radius: 4rpx;
					margin-left: 12rpx;
				}

				.sell-num {
					margin-left: auto;
					font-size: 24rpx;
					color: #999;

					&.sell {
						margin-left: 24rpx;
					}
				}
			}

			.product-title {
				font-size: 32rpx;
				font-weight: 500;
				color: #333;
				line-height: 42rpx;
				margin-top: 8rpx;
				text-align: justify;
			}

			.product-note {
				font-size: 24rpx;
				color: #666;
				line-height: 30rpx;
				margin-top: 16rpx;
			}

			.product-tags {
				display: flex;
				padding: 28rpx 0;
				border-bottom: 2rpx solid #EDEDED;

				.tag {
					height: 36rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 20rpx;
					color: #FC512C;
					line-height: 1;
					padding: 0 8rpx;
					background: #FFEEEB;
					border-radius: 4rpx;
					margin-right: 16rpx;

					&:last-of-type {
						margin-right: 0;
					}
				}
			}

			.share-tips {
				height: 56rpx;
				background: #FFEBEB;
				margin-top: 24rpx;
				padding: 0 12rpx;

				.label {
					width: 56rpx;
					height: 36rpx;
					line-height: 1;
					display: flex;
					align-items: center;
					justify-content: center;
					background: linear-gradient(90deg, #FE413D 0%, #FF2E60 100%);
					font-size: 20rpx;
					color: #fff;
					border-radius: 4rpx;
				}

				.content {
					margin-left: 8rpx;
					font-size: 24rpx;
					color: #F43434;
					line-height: 1;
					display: flex;
					align-items: center;

					.money {
						font-size: 32rpx;
						color: #F43434;
						font-weight: 500;
						line-height: 1;
					}
				}

				.share-btn {
					margin-left: auto;
					font-size: 20rpx;
					color: #F43434;

					.iconfont {
						font-size: 20rpx;
						color: #F43434;
						margin-left: 4rpx;
					}
				}
			}

			.product-other-info {
				padding: 20rpx 0 0;

				.other-info-item {
					margin: 20rpx 0;

					.label {
						font-weight: 500;
						padding-right: 12rpx;
					}

					.value {
						margin-left: 16rpx;
					}

					.iconfont {
						margin-left: auto;
						font-size: 24rpx;
						color: #999;
					}

				}
			}
		}

		.more-btn {
			height: 36rpx;
			font-size: 20rpx;
			color: #999;
			margin-left: auto;

			.iconfont {
				font-size: 20rpx;
				color: #999;
				margin-left: 8rpx;
			}
		}

		.product-evaluate {
			padding: 16rpx 24rpx;
			border-top: 16rpx solid #f5f7fa;
			border-bottom: 16rpx solid #f5f7fa;

			.evaluat-title {
				font-weight: 500;
			}

			.evaluat-tags {
				margin-top: 8rpx;
				display: flex;

				.tag {
					height: 36rpx;
					display: flex;
					align-items: center;
					justify-content: center;
					font-size: 20rpx;
					color: #1B94E0;
					line-height: 1;
					padding: 0 8rpx;
					background: #E4F2FF;
					border-radius: 4rpx;
					margin-right: 16rpx;

					&:last-of-type {
						margin-right: 0;
					}
				}

			}

			.evaluat-list {
				margin-top: 4rpx;

				.evaluat-item {
					padding: 20rpx 0;
					border-bottom: 2rpx solid #EDEDED;

					.evaluat-user {
						.user-photo {
							width: 64rpx;
							height: 64rpx;
							border-radius: 8rpx;
							background: #eee;
							overflow: hidden;
						}

						.user-info {
							height: 64rpx;
							padding: 6rpx 0;
							margin-left: 16rpx;
							display: flex;
							flex-direction: column;
							justify-content: center;

							.user-name {
								font-size: 24rpx;
								line-height: 1;
							}
						}

						.evaluat-date {
							font-size: 20rpx;
							color: #999;
							margin-left: auto;
						}
					}

					.evaluat-content {
						margin-top: 16rpx;

						.content-text {
							line-height: 42rpx;
						}

						.content-imgs {
							display: flex;
							flex-wrap: wrap;

							.img {
								width: 164rpx;
								height: 164rpx;
								border-radius: 8rpx;
								background: #eee;
								overflow: hidden;
								margin-right: 16rpx;
								margin-top: 16rpx;

								&:nth-of-type(4n) {
									margin-right: 0;
								}
							}
						}
					}
				}
			}
		}

		.shop-group {
			padding: 24rpx 24rpx 0;

			.shop-content {
				padding-bottom: 24rpx;
				border-bottom: 2rpx solid #EDEDED;
			}

			.shop-info {
				.shop-logo {
					width: 80rpx;
					height: 80rpx;
					border-radius: 8rpx;
					background: #eee;
					overflow: hidden;
				}

				.shop-name {
					margin-left: 16rpx;
					flex: 1;
				}
			}

			.shop-dec {
				padding: 24rpx 0 0;
				font-size: 24rpx;
				color: #999;
				line-height: 36rpx;
			}

			.shop-goods {
				margin-top: 24rpx;
				flex-wrap: wrap;
				padding-bottom: 24rpx;
				border-bottom: 2rpx solid #EDEDED;

				.goods-item {
					width: 164rpx;
					margin-right: 16rpx;

					&:nth-of-type(4n) {
						margin-right: 0;
					}

					.goods-img {
						width: 164rpx;
						height: 164rpx;
						border-radius: 8rpx;
						background: #eee;
						overflow: hidden;
					}
				}

				.goods-title {
					font-size: 24rpx;
					line-height: 32rpx;
					margin-top: 8rpx;
				}

				.goods-price {
					font-size: 20rpx;
					color: #F31111;
					margin-top: 8rpx;
				}
			}
		}

		.product-introduce {
			padding: 24rpx 24rpx 0;
			padding-bottom: calc(158rpx + env(safe-area-inset-bottom) / 2);

			.introduce-title {
				font-size: 32rpx;
				font-weight: 500;
				text-align: center;
			}

			.introduce-content {
				margin-top: 16rpx;

				/deep/p,
				img {
					width: 100%;
				}
			}
		}

		.product-tabbar {
			width: 100vw;
			// height: 100rpx;
			background: #fff;
			box-shadow: 0rpx -4rpx 8rpx 0rpx rgba(0, 0, 0, 0.06);
			position: fixed;
			bottom: 0;
			left: 0;
			z-index: 99;
			padding: 20rpx 24rpx 0;
			padding-bottom: calc(20rpx + env(safe-area-inset-bottom) / 2);

			.tabbar-handle {
				.handle-item {
					width: 82rpx;
					margin-left: 8rpx;
					position: relative;

					.icon {
						width: 48rpx;
						height: 48rpx;
						margin: 0 auto;
					}

					.handle-label {
						font-size: 28rpx;
						color: #666;
						text-align: center;
						line-height: 1;
						margin-top: 8rpx;
						text-align: center;
					}

					.service-btn {
						width: 100%;
						height: 100%;
						position: absolute;
						top: 0;
						left: 0;
						z-index: 33;
						opacity: 0;
						padding: 0;
						margin: 0;
					}

					&:first-of-type {
						margin-left: 0;
					}
				}
			}

			.buy-btn {
				// width: 520rpx;
				flex: 1;
				height: 86rpx;
				background: #1B94E0;
				font-size: 32rpx;
				color: #fff;
				font-weight: 500;
				border-radius: 12rpx;
				display: flex;
				align-items: center;
				justify-content: center;
				margin-left: 20rpx;
			}
		}
	}



	.product-detail .product-pic,
	.product-detail .product-pic .swiper,
	.product-detail .product-pic image {
		width: 100vw;
		height: 560rpx;
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
		width: 60rpx;
		height: 55rpx;
	}

	.plus_img {
		width: 750rpx;
		height: 750rpx;
	}
</style>