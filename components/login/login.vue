<template>
	<div>
		<view class="other" v-if="ind > 0" :style="'color:'+getTextColorWhite()+';'">
			—— {{$nw("其它登陆方式")}} ——
		</view>
		<view class="aother_login" v-if="ind > 0">
			<view class="aother_login_1" v-for="(item,index) in login_type" :key="index" 
			v-if="item.sta == 1"
				@click="goPage(item.url)">
				<image class="aother_login_1_1_img" :src="item.img" mode=""></image>
				<view class="aother_login_1_1" :style="'color:'+getTextColorWhite()+';'">
					{{$nw(item.text)}}
				</view>
			</view>
			<view class="aother_login_1" v-for="(item,index) in login_type" :key="index" v-if="item.sta == 0">

			</view>

		</view>

	</div>
</template>

<script>
	import utils from "@/common/utils";
	import config from '@/config.js'
	export default {
		data() {
			return {
				login_type: [],
				ind: 0,
				is_open_authlogin:false
			}
		},
		props: ["type"],
		created() {
			var self = this;
			let appinfo = uni.getStorageSync('appinfo');
			self.is_open_authlogin =  appinfo.is_open_authlogin;
			var login_type = [{
				"img": config.app_url + "/file/images/user/autho.png",
				"text":  "授权登录",
				"sta": 0,
				"url": "/main/pages/login/auth_login"
			}, {
				"img": config.app_url + "/file/images/user/password.png",
				"text": "密码登录",
				"sta": 0,
				"url": "/main/pages/login/login?curr_page=2&back=2"
			}, {
				"img": config.app_url + "/file/images/user/yan_code.png",
				"text": "验证码登录",
				"sta": 0,
				"url": "/main/pages/login/weblogin"
			}]
			//根据环境  决定哪些参数必须不显示
			// #ifdef H5
			if (self.isWeixn()) { //微信环境——公众号
				login_type[0].sta = 1;
				login_type[2].sta = 1;
				login_type[1].sta = 1;
				if (self.type == "pass") {
					login_type[1].sta = 0;
				}
				if (self.type == "autho") {
					login_type[0].sta = 0;
				}
				if (self.is_open_authlogin == false) {
					login_type[0].sta = 0;
				}

			} else { //H5
				login_type[0].sta = 0;
				login_type[1].sta = 0;
				login_type[2].sta = 1;
				if (self.type == "pass") {
					login_type[1].sta = 0;
				}
				if (self.type == "autho") {
					login_type[0].sta = 0;
				}
			}
			// #endif
			// #ifdef MP-WEIXIN
			login_type[0].sta = 1;
			login_type[1].sta = 1;
			login_type[2].sta = 1;
			if (self.type == "pass") {
				login_type[1].sta = 0;
			}
			if (self.type == "autho") {
				login_type[0].sta = 0;
			}
			// #endif

			//这个地方判断 哪些是否不显示
			if(uni.getStorageSync("login_j")){
				var login_j = JSON.parse(uni.getStorageSync("login_j"));
				if (login_j) {
					var type = login_j.type;
					if (type.length > 0) {
						for (var i = 0; i < login_type.length; i++) {
							if (login_type[i].sta != 0) {
								for (var j = 0; j < type.length; j++) {
									if (i == type[j]) {
										login_type[i].sta = 0
										break;
									}
								}
							}
						}
					}
				
				}
			}
			

			//这里再判断是否显示验证码代理
			let platform = self.getPlatform();
			self._get('index/getAppInfo', {
				'platform': platform
			}, function(res) {

				if (res.code == 1) {
					console.log(res)
					var is_open_sms = res.data.appinfo.is_open_sms
					if (!is_open_sms) { //说明验证码未开启
						login_type[2].sta = 0;
					}
					
					var ind = 0;
					for (var i = 0; i < login_type.length; i++) {
						if (login_type[i].sta == 1) {
							ind++;
						}
					}
					console.log(ind)
					self.ind = ind;
					self.login_type = login_type;
				}
			})

		
		},

		methods: {
			goPage(url) {
				uni.navigateTo({
					url: url
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.other {
		width: 100%;
		text-align: center;
		margin-bottom: 40rpx;
		font-size: 30rpx;
		color: #919191;
	}

	.aother_login {
		width: 90%;
		margin: auto;
		display: flex;
		height: 200rpx;

		.aother_login_1 {
			flex: 1;
			height: 200rpx;
			text-align: center;

			.aother_login_1_1_img {
				width: 80rpx;
				height: 80rpx;
				border-radius: 50%;
				align-items: center;
				justify-content: center;
				justify-items: center;
				vertical-align: middle;
				display: inline-block;
			}

			.aother_login_1_1 {
				width: 100%;
				text-align: center;
				font-size: 30rpx;

				color: #303030;
			}
		}
	}
</style>
