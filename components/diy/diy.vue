<template>
	<view>
		<block v-for="(item,index) in diyItems" :key="index">

			<!--搜索框-->
			<template v-if="item.type==='search'">
				<search style="margin-bottom: 20rpx;" :itemData="item" :page="diyPage"></search>
			</template>

			<!--轮播图-->
			<template v-if="item.type==='banner'&&item.data!=null">
				<banner :itemData="item"></banner>
			</template>
			
			<!--全分类-->
			<template v-if="item.type==='categorya'&&item.data!=null">
				<categorya :itemData="item"></categorya>
			</template>
			<!--热门视频-->
			<template v-if="item.type==='hotvideo'&&item.data!=null">
				<!-- <hotvideo :itemData="item"></hotvideo> -->
			</template>
			<!--热门活动-->
			<template v-if="item.type==='hotactivity'&&item.data!=null">
				<hotactivity :itemData="item"></hotactivity>
			</template>
			<!--财富机遇-->
			<template v-if="item.type==='hotproject'&&item.data!=null">
				<!-- <hotproject :itemData="item"></hotproject> -->
				<!-- 推荐企业 -->
				<recommendedEnterprises :cocOrgId="cocOrgId" :itemData="item"></recommendedEnterprises>
			</template>

			<!--单组图-->
			<template v-if="item.type==='imageSingle'&&item.data!=null">
				<!-- <imagesingle :itemData="item"></imagesingle> -->
			</template>

			<!-- 橱窗-->
			<template v-if="item.type == 'window'&&item.data!=null">
				<windows :itemData="item"></windows>
			</template>

			<!-- 视频组-->
			<template v-if="item.type == 'video'">
				<videos :itemData="item"></videos>
			</template>

			<!--文章-->
			<template v-if="item.type == 'article'&&item.data!=null">
				<!-- <articles :itemData="item"></articles> -->
			</template>

			<!--头条快报-->
			<template v-if="item.type == 'special'&&item.data!=null">
				<special :itemData="item"></special>
			</template>

			<!--公告组-->
			<template v-if="item.type == 'notice'">
				<!-- <notice :itemData="item"></notice> -->
			</template>

			<!--导航组-->
			<template v-if="item.type==='navBar'&&item.data!=null">
				<navBar :itemData="item" :isTuiguang='isTuiguang' @change_loginShow="change_loginShow"></navBar>
			</template>

			<!--菜单组-->
			<template v-if="item.type==='menu'&&item.data!=null">
				<menus :itemData="item" @change_loginShow="change_loginShow"></menus>
			</template>

			<!--新菜单组-->
			<template v-if="item.type==='menua'&&item.data!=null">
				<menusa :itemData="item" @change_loginShow="change_loginShow"></menusa>
			</template>

			<!--商品组-->
			<template v-if="item.type==='product'&&item.data!=null">
				<product :itemData="item"></product>
			</template>

			<!--优惠券-->
			<template v-if="item.type==='coupon'&&item.data!=null">
				<coupon :itemData="item"></coupon>
			</template>

			<!--门店-->
			<template v-if="item.type == 'store'&&item.data!=null">
				<store :itemData="item"></store>
			</template>

			<!--客服-->
			<template v-if="item.type == 'service'">
				<service :itemData="item"></service>
			</template>

			<!--富文本-->
			<template v-if="item.type==='richText'">
				<richText :itemData="item"></richText>
			</template>

			<!--辅助空白-->
			<template v-if="item.type == 'blank'">
				<blank :itemData="item"></blank>
			</template>

			<!--辅助线-->
			<template v-if="item.type == 'guide'">
				<guide :itemData="item"></guide>
			</template>

			<!--秒杀-->
			<template v-if="item.type == 'seckillProduct' && item.data != null">
				<seckillProduct :itemData="item"></seckillProduct>
			</template>

			<!--拼团-->
			<template v-if="item.type == 'assembleProduct'&&item.data!=null">
				<assembleProduct :itemData="item"></assembleProduct>
			</template>

			<!--砍价-->
			<template v-if="item.type == 'bargainProduct'&&item.data!=null">
				<bargainProduct :itemData="item"></bargainProduct>
			</template>
			<!--积分商品组-->
			<template v-if="item.type==='pointsProduct'&&item.data!=null">
				<pointProduct :itemData="item"></pointProduct>
			</template>
			<!--微信直播-->
			<template v-if="item.type == 'wxlive'&&item.data!=null">
				<wxlive :itemData="item"></wxlive>
			</template>

			<!--选项卡-->
			<template v-if="item.type == 'option'&&item.data!=null">
				<options :itemData="item"></options>
			</template>


			<!--分销中心 &&item.data!=null-->

			<template v-if="item.type == 'agentinfo'&&item.data!=null">
				<AgentInfo :itemData="item"></AgentInfo>
			</template>

		</block>
		<view class="support" v-if="showSupport">
			<view class="" style="display: flex;">

				<view :class="support_icon" style=" margin-right: 10rpx;"></view>
				<!-- #ifdef MP-WEIXIN -->
				<view style="height: 70rpx;line-height: 70rpx;">{{support}}</view>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view>{{support}}</view>
				<!-- #endif -->
			</view>

			<view class="" style="display: flex;">
				<view :class="link_icon" style="margin-right: 10rpx;"></view>
				<!-- #ifdef MP-WEIXIN -->
				<view style="height: 70rpx;line-height: 70rpx;" v-if='link_show' class="support_link" @click="gotoUrl">
					{{link_text}}
				</view>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<view v-if='link_show' class="support_link" @click="gotoUrl">{{link_text}}</view>
				<!-- #endif -->

			</view>

		</view>

		<!-- 打开授权 -->
		<Autho :loginShow="loginShow" @change_loginShow="change_loginShow"></Autho>
	</view>

</template>

<script>
	import search from './search/search';
	import banner from './banner/banner';
	import categorya from './categorya/categorya'
	// import hotvideo from './hotvideo/hotvideo'
	import hotactivity from './hotactivity/hotactivity'
	// import hotproject from './hotproject/hotproject'
	import recommendedEnterprises from './recommendedEnterprises/recommendedEnterprises'
	// import imagesingle from './imagesingle/imagesingle';
	import windows from './window/window';
	import videos from './videos/videos';
	// import articles from './article/article';
	import special from './special/special';
	// import notice from './notice/notice';
	import coupon from './coupon/coupon';
	import richText from './richText/richText';
	import navBar from './navBar/navBar';
	import menus from './menu/menu';
	import store from './store/store';
	import service from './service/service';
	import blank from './blank/blank';
	import guide from './guide/guide';
	import product from './product/product';
	import seckillProduct from './seckillProduct/seckillProduct';
	import assembleProduct from './assembleProduct/assembleProduct';
	import bargainProduct from './bargainProduct/bargainProduct';
	import pointProduct from './pointProduct/pointProduct';
	import wxlive from './wxlive/wxlive';
	import options from './option/option';
	import Autho from '@/components/autho/autho.vue';
	import menusa from './menu/menua';
	import AgentInfo from './agentInfo/agentInfo';
	export default {
		components: {
			search,
			banner,
			// imagesingle,
			windows,
			videos,
			// articles,
			special,
			// notice,
			coupon,
			richText,
			navBar,
			store,
			service,
			blank,
			guide,
			product,
			seckillProduct,
			assembleProduct,
			bargainProduct,
			pointProduct,
			wxlive,
			options,
			menus,
			Autho,
			menusa,
			AgentInfo,
			categorya,
			// hotvideo,
			hotactivity,
			// hotproject,
			recommendedEnterprises
		},
		data() {
			return {
				link_show: false,
				link_text: "1",
				link_page: "2",
				loginShow: false,
				support_icon: "",
				link_icon: ""
			}
		},
		props: ['diyItems', 'diyPage', 'showSupport', 'support', 'link','cocOrgId','isTuiguang'],
		mounted() {
			var links = this.link ? JSON.parse(JSON.stringify(this.link)) : []

			if (this.support) {
				this.support_icon = links.support_icon
			}
			if (links != null && (links.show == 'true' || links.show == 1 || links.show == "1")) {
				this.link_show = true;
				this.link_text = links['text'];
				this.link_page = links['url'];
				this.link_icon = links.link_icon
			}
		},

		methods: {
			change_loginShow(e) {
				var self = this;
				self.loginShow = e;
			},
			gotoUrl: function() {
				let _self = this;
				let url = _self.link_page;
				url = url.replace(/^\s+|\s+$/g, "");
				if (url.slice(0, 4) === 'http' || url.slice(0, 5) === 'https') {
					window.location.href = url;
					return;
				}
				if (url.indexOf('pages') !== -1) {
					uni.navigateTo({
						url: _self.link_page
					})
				}
				if (/^1[3456789]\d{9}$/.test(url)) {
					uni.makePhoneCall({
						phoneNumber: url
					})
				}
			}
		}
	}
</script>

<style>
	.support {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #bbb;
		padding-bottom: 20px;
		;
		flex-direction: column;
	}

	.support_link {
		color: -webkit-link;
		cursor: pointer;
		text-decoration: underline;
	}
</style>