<template>
	<view>
		<view class="istest" v-if="istest" @click="hiddenTest">
			<view class="aui_close"></view>{{testTips}}
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				istest: false,
				testTips: this.$nw("您的系统处于测试中，请不要进行支付操作")
			}
		},
		mounted() {

			this.getAppInfo();

		},
		methods: {
			getAppInfo() {
				let self = this;
				let platform = self.getPlatform();
				self._get('index/getAppInfo', {'platform':platform}, function(res) {
					if (res.code == 1) {
						
						if(res.data.appinfo.is_system_test ==1||res.data.appinfo.is_system_test==2){
							self.istest =true ;	
						}
						
						if (res.data.appinfo.test_tips) {

							self.testTips = res.data.appinfo.test_tips;
						}

					}

				});

			},
			hiddenTest() {

				this.istest = !this.istest;
			}

		}


	}
</script>

<style>
	.istest {
		top: 0rpx;
		background-color: #ffaa00;
		color: #FF0000;
		position: fixed;
		width: 100%;
		text-align: center;
		height: 80rpx;
		line-height: 80rpx;
		z-index: 99999;

	}

	.aui_close {
		width: 20px;
		height: 20px;
		line-height: 20px;
		display: block;
		position: absolute;
		right: 10px;
		top: 10px;
		font-family: Helvetica, STHeiti;
		_font-family: '\u9ed1\u4f53', 'Book Antiqua', Palatino;
		font-size: 18px;
		border-radius: 20px;
		background: #d08a00;
		color: #ffe5e5;
		box-shadow: 0 1px 3px rgba(0, 0, 0, .3);
		-moz-transition: linear .06s;
		-webkit-transition: linear .06s;
		transition: linear .06s;
		padding: 0;
		text-align: center;
		text-decoration: none;
		outline: none;
		cursor: pointer;
	}

	.aui_close::before {
		content: '\2A2F';
	}
</style>
