<template>

	<view class="container">
		<view class="custom-user-sec rel">
			<image class="abs br-10 userimg" :src="Customer.person_avatar||defaultUserImg"></image>
			<view class="flex">
				<view class="flex100-4">
					<view class="title ellipsis">{{Customer.nick_name}}</view>
					<view @tap="callTel" class="tag" style="color:#666;" v-if="Customer.tel">
						<i class="iconfont2 icon-shouji" style="color:#c0c0c0;font-size:28rpx;">{{Customer.tel}}</i>
					</view>
					<view class="tag" v-if="Customer.value1">{{Customer.value1}}</view>
				</view>
				<view class="flex100-6">
					<view class="child fl tc rel">
						<image class="abs br-10" src="https://retail.xiaochengxucms.com/images/12/2018/11/xpwoLEKZJZj4BOolbVwKZBJJZ4bwdw.png"></image>
						<view class="abs text">预计成交日期</view>
						<view :class="'pickerview abs ' + (date?'active':'')" v-if="fromstatus">
							<block v-if="date">
								<text class="abs year-em">{{Customer.year}}</text>{{Customer.month}}/{{Customer.day}}
							</block>
							<block v-else>未设置</block>
						</view>
						<picker @change="listenerDatePickerSelected" :class="'abs br-10 ' + (date?'active':'')" mode="date" :start="startDate"
						 v-model="date" v-if="!fromstatus">
							<block v-if="date">
								<text class="abs year-em">{{Customer.year}}</text>{{Customer.month}}/{{Customer.day}}
							</block>
							<block v-else>未设置</block>
						</picker>
					</view>

				</view>
			</view>
		</view>
		<view class="edit">
			<view @click="editClient" class="edit_content">
				<text style="display: flex; flex: 1">客户信息</text>
				<view style="color: #606060">
					<view style="display: inline-block;">{{fromstatus == "boss" ? "查看" : "修改" }}</view>
					<i class="iconfont2 icon-right2" style="display: inline-block;font-size: 30rpx; padding-left: 20rpx; color: #c7c7cc"></i>
				</view>
			</view>
		</view>
		<view class="lables">
			<view @click="addsLables" class="lable_content">
				<view style="padding-right: 20rpx; display: flex; align-items: center">标签</view>
				<view class="ellipsis" style="display: flex;flex: 1;">
					<view v-for="(item, index) in labelList" :key="index" v-if="index<2" class="fs_col lable">{{ item.name }}</view>
				</view>
				<view style="color: #606060;">
					<view style="display: inline-flex;">{{fromstatus == "boss" ? "查看" : "添加" }}</view>
					<i class="iconfont2 icon-right2" style="display: inline-block;font-size: 30rpx; padding-left: 20rpx; color: #c7c7cc"></i>
				</view>
			</view>
		</view>

		<view style="height:12rpx;"></view>

		<view class="setTab-box-view">
			<view class="swiper-tab">
				<button v-for="(item, index) in tabList" :key="index" :class="'swiper-tab-list ' + (currentIndex==index?'active':'')"
				 @click="changeTab(item,index)" hoverClass="none">
					{{item.name?item.name:item}}
				</button>
			</view>
		</view>
		<scroll-view scroll-y="true" class="scroll-Y" :style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50"
		 @scrolltolower="scrolltolowerFunc">
			<block v-if="currentTab=='browse'">

				<view class="radar-sec">
					<view v-for="(item1, index1) in viewList.data" :key="index1" class="child">
						<view class="time" v-if="index1==0||item1.date!=viewList.data[index1-1].date">{{item1.date}}</view>
						<view class="dynamic rel">
							<view class="dynamic-child rel">
								<image class="abs circle" mode="aspectFill" :src="item1.user?item1.user.avatarUrl:defaultUserImg"></image>
								<view class="flex">
									<view class="flex100-7" style="flex:0 0 80%;">TA
										<block v-if="item1.sign=='copy'">
											<block v-if="item1.type==1">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次
												</text>保存了你的<text>电话</text>，请随时保持电话畅通
											</block>
											<block v-if="item1.type==2">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次拨打
												</text>你的<text>手机号</text>
											</block>
											<block v-if="item1.type==3">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次拨打
												</text>你的<text>座机号</text>
											</block>
											<block v-if="item1.type==4">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次
												</text>复制了你的<text>微信</text>，请随时查看微信通讯录
											</block>
											<block v-if="item1.type==5">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次
												</text>复制了你的<text>邮箱</text>，可能随时邮寄文件给你，请注意查收
											</block>
											<block v-if="item1.type==6">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次复制
												</text>你公司的<text>名称</text>
											</block>
											<block v-if="item1.type==7">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次查看
												</text>你公司的<text>导航定位</text>
											</block>
											<block v-if="item1.type==8">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次咨询
												</text>你公司的<text>产品</text>
											</block>

											<block v-if="item1.type==10">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次保存
												</text>你的<text>名片海报</text>，请及时留意雷达动态
											</block>

										</block>
										<block v-if="item1.sign=='view'">
											<block v-if="item1.type==1">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次查看
												</text>你的<text>商城</text>{{item1.countText}}
											</block>


											<block v-if="item1.type==6">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次查看公司官网
												</text>{{item1.countText}}
											</block>


											<block v-if="item1.type==11">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次浏览
												</text>你的<text>商城栏目：{{item1.target_name}}</text>
											</block>

										</block>
										<block v-if="item1.sign=='praise'">

											<block v-if="item1.type==2">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次查看
												</text>你的<text>名片</text>{{item1.countText}}
											</block>
											<block v-if="item1.type==3">
												给你点赞了，看来TA觉得你<text>非常靠谱</text>
											</block>
											<block v-if="item1.type==4">
												<text>
													<block v-if="item1.count==1">首</block>
													<block v-if="item1.count>1">第{{item1.count}}</block>次分享
												</text>了你的<text>名片</text>请及时留意<text>雷达动态</text>
											</block>
										</block>


									</view>
									<view class="flex100-3 tr" style="flex:0 0 20%;">{{item1.create_time2}}</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view class="page">
					<view class="loadmore" v-if="loading">
						<view class="loading"></view>
						<view class="loadmore_tips">正在加载</view>
					</view>
					<block v-else>
						<view class="loadmore loadmore_line" v-if="page>=viewList.last_page&&viewList.data.length>0">
							<view class="loadmore_tips loadmore_tips_in-line">没有更多数据了</view>
						</view>
						<view class="loadmore loadmore_line" v-if="viewList.data.length<=0">
							<view class="loadmore_tips loadmore_tips_in-line">没有找到数据</view>
						</view>
					</block>
				</view>

			</block>
			</block>
			<block v-if="currentTab=='follow'">

				<view class="radar-sec">
					<view v-for="(item2, index2) in followList.data" :key="index2" class="child">
						<view class="time" v-if="index2==0||item2.date!=followList.data[index2-1].date">{{item2.date}}</view>
						<view class="dynamic rel">
							<view class="dynamic-child rel">
								<image class="abs circle" mode="aspectFill" :src="item2.person_avatar||defaultUserImg"></image>
								<view class="flex">
									<view class="flex100-7" style="flex:0 0 80%;">
										新增记录:
										<text>{{item2.content}}</text>
									</view>
									<view class="flex100-3 tr" style="flex:0 0 20%;">
										{{item2.create_time1}}

									</view>
								</view>

							</view>
						</view>
					</view>
				</view>

				<view class="page">
					<view class="loadmore" v-if="loading">
						<view class="loading"></view>
						<view class="loadmore_tips">正在加载</view>
					</view>
					<block v-else>
						<view class="loadmore loadmore_line" v-if="page>=followList.last_page&&followList.data.length>0">
							<view class="loadmore_tips loadmore_tips_in-line">没有更多数据了</view>
						</view>
						<view class="loadmore loadmore_line" v-if="followList.data.length<=0">
							<view class="loadmore_tips loadmore_tips_in-line">没有找到数据</view>
						</view>
					</block>
				</view>

			</block>
		</scroll-view>

		<view :class="'footer ' + (isIphoneX?'isIphoneX':'') + ' ' + (isShowFooter?'':'hide')">
			<view class="footer_left">
				<view @click="addsRecord" class="footer_left_a">
					<i class="iconfont2 icon icon-jilu"></i>
					<text>跟进记录</text>
				</view>
				<view @click="toOpera('bottomOK')" :class="'footer_left_a ' + (Customer.status==3?'active':'')">
					<i :class="'iconfont2 icon ' + (Customer.status==3?'icon-chengjiao':'icon-wancheng1')"></i>
					<text>{{Customer.status==3?'已成交':'未成交'}}</text>
				</view>
				<view @click="toOpera('star')" :class="'footer_left_a ' + (Customer.is_star==1?'active':'')">
					<i :class="'iconfont2 icon ' + (Customer.is_star==1?'icon-xingxing1':'icon-star')"></i>
					<text>星标</text>
				</view>
			</view>
			<view class="flex">
				<view @click="callTel" class="child tc br-10 mr-20" style="background:#ff9000" v-if="Customer.tel">电话</view>
				<view @click="chat" class="child tc br-10" style="background:#e93636" v-if="Customer.import!=1">私信</view>
			</view>
		</view>
		
		<view class="addsRecord" v-if="RecordShow">
		    <view class="addsRecord_top">
		        <text @click="cancel">取消</text>
		        <text @click="adds">保存</text>
		    </view>
		    <textarea adjustPosition autoFocus="true"  cursorSpacing="100" fixed="true" maxlength="-1" placeholder="请输入..." placeholderClass="textarea" showConfirmBar="false" v-model="content"></textarea>
		</view>
		<view @click="cancel" class="vague" v-if="vagueShow"></view>
	</view>

</template>

<script>
	export default {
		data() {
			return {
				client_id: '',
				types: "",
				img2: "",
				param: "",
				isIphoneX: "",
				defaultUserImg: "",
				isShowFooter: 1,
				startDate: "",
				viewList: {
					data: []
				},
				followList: {
					data: []
				},
				toFollowType: "",
				interest: "",
				activity: "",
				client: "",
				date: "",
				content: "",
				rate: "",
				RecordShow: false,
				vagueShow: false,
				textValue: "",
				tmp_errno: 0,
				Customer: {
					nickName: "郑炜华",
					avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/4bDUibn2FHb2tKZ0gJbe1X7NybHIRXEfWicGok8aVs0kNhQtd0H3qcvibWSKyDYLdJsxbCt1R0O27ap147RhbZ59g/132",
					is_staff: "1"
				},
				firstTime: "",
				labelList: [],
				toFolledit: "",
				currEditInd: "",
				tabList: [{
					status: "browse",
					name: "浏览记录"
				}, {
					status: "follow",
					name: "跟进记录"
				}],
				currentIndex: 0,
				currentTab: "browse",
				page: 1,
				loading: false,
				fromstatus:"",
				/*手机高度*/
				phoneHeight: 0,
				/*可滚动视图区域高度*/
				scrollviewHigh: 0,
				
				
			}
		},
		onLoad(e) {
			this.client_id = e.client_id ? e.client_id : 0;
			this.fromstatus = e.fromstatus;
			this.init();
			this.getClientDetail();
			this.getCustomViewList();
		},
		methods: {

			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.phoneHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
					}
				});
			},
			/*还原初始化*/
			restoreData() {
				this.viewList.data = [];
				this.followList.data = [];
			},
			/* 客户详情 */
			getClientDetail() {
				let self = this;
				self._get('plus.card.client/getClientDetail', {
						client_id: self.client_id
					},
					function(res) {
						if (res.code == 1) {
							if(res.data.fromstatus){
								self.fromstatus = res.data.fromstatus;
							}
							
							self.Customer = res.data.clientInfo;
							self.date = res.data.clientInfo.date;
							self.labelList = res.data.clientInfo.labelList;
						}
					})
			},
			/*设置成交日期 */
			listenerDatePickerSelected(e) {
				let self = this;
				let deal_time = e.detail.value;
				self._post('plus.card.client/setClientDate', {
					client_id: self.client_id,
					deal_time: deal_time,

				}, function(res) {
					if (res.code == 1) {
						self.Customer = res.data.clientInfo;
						self.date = res.data.clientInfo.date;
						self.labelList = res.data.clientInfo.labelList;
						uni.showToast({
							title: res.msg
						});
					}
				});
			},
			/*获取客户浏览记录 */
			getCustomViewList() {
				let self = this;
				self._post('plus.card.client/getCustomViewList', {
					page: self.page || 1,
					client_id: self.client_id,

				}, function(res) {
					if (res.code == 1) {

						self.viewList.data = self.viewList.data.concat(res.data.viewList.data);
						self.viewList.last_page = res.data.viewList.last_page;
					}
				});
			},
			getfollowViewList() {
				let self = this;
				self._post('plus.card.client/getfollowViewList', {
					page: self.page || 1,
					client_id: self.client_id,

				}, function(res) {
					if (res.code == 1) {

						self.followList.data = self.followList.data.concat(res.data.followList.data);
						self.followList.last_page = res.data.followList.last_page;
					}
				});
			},

			/* 切换tab栏*/
			changeTab(item, key) {
				this.currentTab = item.status
				this.currentIndex = key;
				this.page = 1;
				this.viewList.data = []
				this.followList.data = []
				if (this.currentTab == 'follow') {
					
					this.getfollowViewList();
				} else {
					this.getCustomViewList();
				}
			},
			scrolltolowerFunc() {

				let self = this;
				self.page++;
				self.loading = true;
				console.log(self.page);
				if (this.currentTab == 'browse') {
					if (self.page > self.viewList.last_page) {
						self.loading = false;
						self.no_more = true;
						return;
					}
					self.getCustomViewList();
				} else {
					if (self.page > self.followList.last_page) {
						self.loading = false;
						self.no_more = true;
						return;
					}
					self.getfollowViewList();
				}



			},
			/* 添加跟进记录 */
			addsRecord() {
				this.RecordShow = true;
				this.vagueShow = true;
				this.content = '';
			},
			cancel(){
				this.RecordShow = false;
				this.vagueShow = false;
			},
			
			adds(){
				let self = this;
				self._get('plus.card.client/saveFollow', {
					client_id: self.client_id,
					content:self.content
				},
				function(res) {
					if (res.code == 1) {
						uni.showToast({
							title:res.msg
						});
						self.RecordShow = false;
						self.vagueShow = false;
						self.content = '';
					}
				})
			},
			/* 设为成交 */
			toOpera(type){
				let self = this;
				let params = {};
				params.client_id= self.client_id;
				if(type=='bottomOK'){
					params.status = self.Customer.status==3?1:3
					if(params.status==3){
						params.content = "设置为成交";
					}else{
						params.content = "取消成交";
					}
					
				}else if(type=='star'){
					params.is_star = self.Customer.is_star==1?0:1
					if(params.is_star==1){
						params.content = "设置为星标";
					}else{
						params.content = "取消星标";
					}
				}
				self._get('plus.card.client/customOperate', params,
				function(res) {
					if (res.code == 1) {
						uni.showToast({
							title:res.msg
						});
						self.getClientDetail();
					}
				})
			},
			/* 打电话 */
			callTel(){
				let phone = this.Customer.tel;
				uni.makePhoneCall({
					phoneNumber: phone
				});
			},
			//编辑客户信息
			editClient(){
				let client_id = this.client_id
				let fromstatus = this.fromstatus;
				let path = '/card/pages/card/staff/custom/editInfo?client_id='+client_id+"&fromstatus="+fromstatus;
				this.gotoPage(path);
			},
			/* 标签 */
			addsLables(){
				let client_id = this.client_id
				let fromstatus = this.fromstatus;
				let path = '/card/pages/card/staff/custom/tag?client_id='+client_id+"&fromstatus="+fromstatus;
				this.gotoPage(path);
			},
			/* 跳转聊天 */
			chat(){
				let chat_to_uid = this.Customer.c_uid;
				let fromstatus = this.fromstatus;
				let path = '/card/pages/card/chat/staffchat?chat_to_uid='+chat_to_uid+"&fromstatus="+fromstatus;
				this.gotoPage(path);
			}
		}
	}
</script>

<style scoped>
	@import "/card/statics/card.css";
	
	view,button {
	    display: block;
	    overflow: initial;
	}
	page {
		background: #f4f4f8;
	}

	.setTab-box-view {
		z-index: 99;
	}

	.setTab-box-view,
	.swiper-tab,
	.swiper-tab-list {
		height: 90rpx;
		line-height: 90rpx;
	}

	.setTab-box-view .active::before {
		width: 120rpx;
		margin-left: -60rpx;
	}

	.ellipsis {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		word-wrap: normal;
	}

	.vague {
		position: fixed;
		background: #6b6b6b;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 99999;
		opacity: 0.6;
	}

	page image {
		width: 100rpx;
		height: 100rpx;
		border-radius: 10rpx;
		margin: 0 20rpx;
	}

	.fs_col {
		color: #e93636;
	}

	.lable {
		margin: 0 10rpx;
		padding: 5rpx 20rpx;
		background: #fff5f5;
		height: 45rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 30rpx;
	}

	.container {
		display: flex;
		flex-direction: column;
		font-size: 30rpx;
		overflow-x: hidden;
		padding: 0;
	}

	.custom-user-sec {
		width: 97%;
		height: 140rpx;
		padding: 25rpx 0rpx 25rpx 3%;
		display: block;
		background: white;
	}

	.custom-user-sec .userimg {
		width: 140rpx;
		height: 140rpx;
		display: block;
		margin: 0rpx;
	}

	.custom-user-sec .flex {
		margin-left: 160rpx;
		height: 140rpx;
	}

	.custom-user-sec .flex .flex100-4,
	.custom-user-sec .flex .flex100-6 {
		height: 140rpx;
	}

	.custom-user-sec .flex .flex100-4 .title {
		font-size: 30rpx;
		color: #2d2d2d;
		width: 230rpx;
	}

	.custom-user-sec .flex .flex100-4 .tag {
		font-size: 24rpx;
		color: #e93636;
	}

	.custom-user-sec .flex .flex100-6 .child {
		width: 50%;
		height: 100rpx;
		display: block;
	}

	.custom-user-sec .flex .flex100-6 .child image {
		margin: 0rpx auto;
		left: 50%;
		margin-left: -50rpx;
	}

	.custom-user-sec .flex .flex100-6 .child .text {
		width: 100%;
		bottom: -40rpx;
		font-size: 24rpx;
		color: #969696;
		height: 30rpx;
		line-height: 30rpx;
	}

	.custom-user-sec .flex .flex100-6 .child picker,
	.custom-user-sec .flex .flex100-6 .child .pickerview,
	.custom-user-sec .flex .flex100-6 .child .count {
		top: 22rpx;
		font-size: 20rpx;
		color: #242424;
		width: 100rpx;
		left: 50%;
		margin-left: -50rpx;
	}

	.custom-user-sec .flex .flex100-6 .child picker,
	.custom-user-sec .flex .flex100-6 .child .pickerview {
		font-size: 24rpx;
		color: #242424;
		top: 22rpx;
	}

	.custom-user-sec .flex .flex100-6 .child picker.active,
	.custom-user-sec .flex .flex100-6 .child .pickerview.active {
		font-size: 30rpx;
	}

	.custom-user-sec .flex .flex100-6 .child picker.active .year-em,
	.custom-user-sec .flex .flex100-6 .child .pickerview.active .year-em {
		font-size: 20rpx;
		color: white;
		top: -30rpx;
		width: 100rpx;
		left: 50%;
		margin-left: -50rpx;
	}

	.custom-user-sec .flex .flex100-6 .child .count text {
		font-size: 32rpx;
	}

	.top {
		width: 750rpx;
		height: 100rpx;
		background: #fff;
		padding: 25rpx 0;
		display: flex;
	}

	.top_right {
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		font-size: 20rpx;
		flex: 1;
	}

	.top_right view {
		display: flex;
		justify-content: space-between;
	}

	.top_right_right {
		width: 82rpx;
		height: 36rpx;
		background: linear-gradient(to right, #fe7e01, #e05c1c);
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		border-top-left-radius: 20rpx;
		border-bottom-left-radius: 20rpx;
	}

	.edit {
		width: 750rpx;
		background: #fff;
		display: flex;
		justify-content: center;
		margin-top: 20rpx;
	}

	.lables {
		width: 750rpx;
		background: #fff;
		display: flex;
		justify-content: center;
	}

	.edit_content {
		display: flex;
		width: 700rpx;
		height: 100rpx;
		font-size: 28rpx;
		color: #b1b1b1;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px solid #e7e7e7;
	}

	.lable_content {
		display: flex;
		width: 700rpx;
		height: 100rpx;
		font-size: 28rpx;
		color: #b1b1b1;
		justify-content: space-between;
		align-items: center;
	}

	.tabs {
		display: flex;
		width: 750rpx;
		height: 100rpx;
		justify-content: space-around;
		align-items: center;
		background: #fff;
		margin-top: 20rpx;
	}

	.tabs text {
		height: 100rpx;
		display: inline-block;
		position: relative;
		top: 0rpx;
	}

	.tabs .Select {
		border-bottom: 2px solid #e93636;
		color: #e93636;
	}

	.content {
		display: flex;
		flex-direction: column;
		background: #fff;
		width: 750rpx;
		margin-top: 10rpx;
	}

	.content_date {
		padding-left: 20rpx;
		border-bottom: 1px solid #e7e7e7;
		display: flex;
		align-items: center;
		height: 100rpx;
	}

	.content_details {
		height: 100rpx;
		width: 750rpx;
		padding: 20rpx 0;
		display: flex;
		font-size: 28rpx;
		align-items: center;
	}

	.content_details image {
		border-radius: 50rpx;
	}

	.content_details_right {
		display: flex;
		justify-content: space-between;
		flex: 1;
		align-items: center;
		height: 100rpx;
		border-bottom: 1px solid #e7e7e7;
	}

	.content_details_right text {
		color: #e93636;
	}

	.content_details_right .newdays {
		padding: 0 20rpx 0 20rpx;
		color: #6b6b6b;
		display: flex;
		align-items: center;
	}

	.footer {
		position: fixed;
		bottom: 0;
		display: flex;
		width: 100%;
		height: 120rpx;
		justify-content: space-between;
		align-items: center;
		background: #fff;
		z-index: 999;
		opacity: 1;
	}

	.footer_left {
		display: flex;
	}

	.footer_left_a {
		display: flex;
		flex-direction: column;
		justify-content: center;
		height: 90rpx;
		padding: 0rpx 10rpx 0rpx 30rpx;
		font-size: 20rpx;
		color: #838591;
	}

	.footer_left_a.active i,
	.footer_left_a.active text {
		color: #e93636;
	}

	.icon {
		font-size: 40rpx;
		display: flex;
		justify-content: center;
	}

	.qq {
		height: 95rpx;
		width: 300rpx;
		display: flex;
		background: #e93636;
		color: #fff;
		justify-content: center;
		align-items: center;
	}

	.flex {
		margin-right: 4%;
	}

	.flex .child {
		width: 170rpx;
		height: 70rpx;
		line-height: 70rpx;
		font-size: 28rpx;
		color: #ffffff;
		display: block;
	}

	.Analysis {
		display: flex;
		flex-direction: column;
	}

	ec-canvas {
		width: 100%;
		height: 400rpx;
		z-index: 9;
	}

	.echarts1 {
		width: 750rpx;
		min-height: 500rpx;
		background: #fff;
		margin-top: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.percent {
		width: 750rpx;
		height: auto;
		background: #fff;
		margin-top: 10rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-bottom: 40rpx;
	}

	.myProgress {
		width: 700rpx;
		height: 60rpx;
		background-color: #fff;
		display: flex;
		align-items: center;
		position: relative;
		color: #838591;
		font-size: 22rpx;
	}

	.myProgress text:nth-child(1) {
		padding-right: 20rpx;
	}

	.myProgress text:nth-child(3) {
		padding-left: 30rpx;
	}

	.myBar {
		height: 20rpx;
		border-radius: 20rpx;
		background-color: #f6acac;
	}

	.percent_title {
		width: 700rpx;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.echarts1_top {
		width: 700rpx;
		height: 100rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.addsRecord {
		width: 750rpx;
		min-height: 300rpx;
		z-index: 999999;
		position: fixed;
		background: #fff;
		bottom: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-end;
	}

	.addsRecord_top {
		width: 100%;
		height: 80rpx;
		border-bottom: 1px solid #b1b1b1;
		font-size: 30rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.addsRecord_top text:nth-child(1) {
		color: #838591;
		padding-left: 20rpx;
	}

	.addsRecord_top text:nth-child(2) {
		color: #669de0;
		padding-right: 20rpx;
	}
</style>
