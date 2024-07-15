<template>
	<view>
		
	<!-- 	<view class="fix set-tag-sec tc">
		    <view @click="toStarMark" :class="'text ' + (clientSource.is_star==1?'active':'')" >
		        <i class="iconfont2 icon-xingji" style="display: inline-block;"></i>
				<view style="display: inline-block;">{{clientSource.is_star==1?'取消':'设为'}}星标</view>
			</view>
		    <view @click="toJumpUrl" class="text">
		        <i class="iconfont2 icon-biaoqian" style="display: inline-block;"></i>
				<view style="display: inline-block;">添加标签</view>
			</view>
		</view> -->
		<view style="height:80rpx;"></view>
			<scroll-view  class="scroll-Y" scroll-y="true":style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50" :scroll-into-view="toView">
			<view @click="hideExtra"  class="speak_box" :style="'height:' + (showUseMessage==true?inputObj.windowHeight+'rpx':'auto') + ';padding:' + (isIphoneX?'20rpx 20rpx 356rpx 20rpx':'20rpx 20rpx 288rpx 20rpx')">
				<!-- <scroll-view  class="scroll-Y" scroll-y="true":style="'height:' + scrollviewHigh + 'px;'" lower-threshold="50" :scroll-into-view="toView"> -->
				<view v-for="(item1, index1) in messageList" :key="index1" :id="'uid_'+item1.card_message_id">
					<view class="line-text-time">{{item1.create_time}}</view>
					<view  :class="item1.user_id==user_id?'question':'answer'" >
						<view :class="'heard_img ' + (item1.user_id==user_id?'right':'left')">
							<image :src="item1.user_id==user_id?chatAvatarUrl:toChatAvatarUrl"></image>
						</view>
						<view :class="item1.user_id==user_id?'question_text clear rel':'answer_text'">
							<view class="abs read-message" v-if="item1.user_id==user_id">{{item1.status==1?'未读':'已读'}}</view>
							<view  :class="(item1.user_id==user_id?'question':'answer') + '_img'"  v-if="item1.message_type=='image'">
								<image mode="widthFix" :src="item1.content"></image>
							</view>
							<block v-if="item1.message_type=='text'">
								<view class="p">{{item1.content}}</view>
								<i></i>
							</block>
						</view>
					</view>
				</view>
				<!-- </scroll-view> -->
			</view>
			</scroll-view>
		
		
		<view class="bg_opacity_sec fix" v-if="showAddUseSec==true"></view>
		
		
		<view :class="'input-flex-column ' + (isIphoneX?'isIphoneX':'')" :style="'padding-bottom:' + (isIphoneX?88:20) + 'rpx'">
			<view class="input-text-voice-super">
				<input 
				style="background: #efeff0;"
				@confirm="chatInputSendTextMessage('text')" @focus="chatInputBindFocusEvent" @input="chatInputGetValueEvent" class="chat-input-style" confirmType="send" maxlength="500" :style="'margin-left:' + (false ? 0 : 16) + 'rpx'" v-model="textMessage">
				</input>
				<block v-if="inputObj.inputType==='text'">
					<button @click="chatInputSendTextMessage('text')" class="chat-input-send-button-style" formType="submit" hoverClass="none" style="background-color: green ;color:#fff;padding:0rpx" >
					{{$nw("发送")}}
					</button>
				</block>
				<image @click="chatInputExtraClickEvent" class="extra-btn-style" src="https://s101.kemanduo.cc/addons/longbing_card/resource/images/chat/extra.png" v-else></image>
			</view>
			<view class="extra-super" v-if="showExtra">
				<view @click="chatInputExtraItemClickEvent" class="flex-column" style="width: 25%">
					<image class="extra-image-size" src="https://s101.kemanduo.cc/addons/longbing_card/images/images/chat/extra/choose_picture.png"></image>
					<text class="extra-text-size">{{$nw("拍照")}}</text>
				</view>
			</view>
		</view>
		
		

	</view>
</template>

<script>
	import config from '@/config.js'
	export default {
		data() {
			return {
				card_id:"",
				user_id: "",
				chat_to_uid: "",
				contactUserName: "",
				chatAvatarUrl: "",
				toChatAvatarUrl: "",
				messageDate: "",
				useMessageType: [],
				currUType: 0,
				useMessage: [],
				showEditSec: !1,
				clientSource: {
					radar_client_id:0,
					is_star:0,
				},
				messageList: [],
				showAddUseSec: !1,
				showUseMessage: !1,
				countMessage: 0,
				isIphoneX:'',
				inputObj:{
					inputType:'',
					windowHeight:''
				},
				textMessage:'',
				showExtra:false,
				i_time:'',
				toView:"",
				scrollviewHigh:''
			}
		},
		onLoad(e) {
			console.log(e,"聊天")
			this.card_id = e.card_id;
			this.chat_to_uid = e.chat_to_uid;
			this.init();
			this.getChatId();
			this.setGlobalColor()	
		},
		onHide() {
			clearInterval(this.i_time)
		},
		methods: {
			init() {
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						_this.inputObj.windowHeight = res.windowHeight;
						_this.scrollviewHigh = res.windowHeight;
					}
				});
			},
			getChatId(){
				let self = this;
				self._get('plus.card.chat/getChatId',
				{
					chat_to_uid:self.chat_to_uid,
				},
				function(res){
					if(res.code==1){
						self.chat_id = res.data.chat_id;
						self.clientSource = res.data.clientSoure;
						if(res.data.target_info){
							self.chat_to_uid = res.data.target_info.user_id;
							self.toChatAvatarUrl = res.data.target_info.avatarUrl;
						}
						
						if(res.data.user_info){
							self.user_id = res.data.user_info.user_id;
							self.chatAvatarUrl = res.data.user_info.avatarUrl;
						}
					
						self.getMessage();
						var d = setInterval(function() {
							self.record();
						}, 3e3);
						self.i_time = d;
					}
				})
			},
			chatInputBindFocusEvent(){
				console.log(1);
			},
			chatInputExtraClickEvent(){
				this.showExtra = !this.showExtra;
			},
			/* 输入内容 */
			chatInputGetValueEvent(){
				
				if(this.textMessage==''){
					this.inputObj.inputType = '';
				}else{
					
					this.inputObj.inputType = 'text';
				}
			},
			chatInputSendTextMessage(type=''){
				
				let self =this;
				this.inputObj.inputType = '';
				if(type==''){
					type = 'text';
				}
				self._get('plus.card.chat/message',
				{
					card_id:self.card_id,
					chat_id:self.chat_id,
					content:self.textMessage,
					chat_to_uid:self.chat_to_uid,
					message_type:type
				},
				function(res){
					if(res.code==1&&res.data.message){
						self.textMessage = '';
						self.messageList.push(res.data.message);

					}
					
				})
			},
			/* 获取聊天记录 */
			getMessage(){
				let self =this;
	
				self._get('plus.card.chat/getMessage',
				{
					chat_id:self.chat_id,
					chat_to_uid:self.chat_to_uid
				},
				function(res){
					
					if(res.code==1){
						self.messageList = res.data.messageList;
						self.toView = "uid_"+res.data.toView_id;
						console.log(self.toView);
					}
				});
			},
			toStarMark(){
				this.clientSource.is_star = this.clientSource.is_star==1?0:1;
				let  self  = this;
				let content = "设为星标";
				if(!this.clientSource.is_star==0){
					content = '取消星标';
				}
				self._get('plus.card.client/customOperate',
				{
					client_id:self.clientSource.radar_client_id,
					content:content,
					is_star:this.clientSource.is_star
				},
				function(res){
					console.log(res);
				})
			},
			toJumpUrl(){
				let path = '/card/pages/card/staff/custom/tag?client_id='+this.client_id;
				this.gotoPage(path);
			},
			/* 获取最新message */
			record(){
				let self =this;
					
				self._get('plus.card.chat/getNewsMessage',
				{
					chat_id:self.chat_id,
					chat_to_uid:self.chat_to_uid
				},
				function(res){
					if(res.code==1&&res.data.message){
						self.toView = "uid_"+res.data.message.card_message_id;
						console.log(self.toView);
						self.messageList.push(res.data.message)
					}
				
				});
			},
			/* 点击隐藏发图片 */
			hideExtra(){
				this.showExtra =false;
			},
			/* 发送图片 */
			chatInputExtraItemClickEvent(){
	
				let self = this;
				let params = {
					token: uni.getStorageSync('token'),
				    app_id: self.getAppId()
				};
				uni.chooseImage({
					count: 1,
					sizeType: [ "original", "compressed" ],
					success: function(res) {
						
						let url  = config.app_url + '/index.php?s=/api/file.upload/image';
						for (var temp in res.tempFilePaths){
							uni.showLoading({
								title: "图片上传中"
							}), uni.uploadFile({
								url: url,
								filePath: res.tempFilePaths[temp],
								name: "iFile",
								formData: params,
								success: function(t) {
									var a = JSON.parse(t.data);
									self.textMessage = a.data.file_path;
									self.chatInputSendTextMessage('image');
									self.showExtra =false;
									uni.hideLoading(); 
								}
							});
						}
					
					},
					fail: function(t) {
						uni.hideLoading();
					}
				});
			}
			
		}
	}
</script>

<style scoped>
	@import "/card/statics/card.css";
	@import "/card/statics/chat-input.css";
	page {
	    background-color: #efeff0;
	}
	
	.show {
	    display: block!important;
	}
	
	.hide {
	    display: none!important;
	}
	
	.headimg>image {
	    width: 74rpx;
	    height: 74rpx;
	    border-radius: 4rpx;
	}
	
	.overfollow-y {
	    overflow: hidden;
	}
	
	.speak_box {
	    padding: 20rpx;
	}
	
	.line-text-time {
	    width: 100%;
	    text-align: center;
	    font-size: 28rpx;
	    line-height: 40rpx;
	    margin-bottom: 20rpx;
	    color: #333;
	}
	
	.last_time2 {
	    width: auto;
	    font-size: 28rpx;
	    height: 50rpx;
	    line-height: 50rpx;
	    padding: 0rpx 20rpx;
	    margin: 20rpx auto;
	    text-align: center;
	    border-radius: 10rpx;
	    color: white;
	    display: inline-block;
	    background: #cecece;
	}
	
	.rel {
	    position: relative;
	}
	
	.abs {
	    position: absolute;
	}
	
	.question_text .read-message {
	    font-size: 24rpx;
	    color: #b0b3b8;
	    bottom: 23rpx;
	    left: -70rpx;
	}
	
	.question,.answer {
	    margin-bottom: 20rpx;
	}
	
	.question {
	    text-align: right;
	}
	
	.question>div {
	    display: inline-block;
	}
	
	.left {
	    float: left;
	}
	
	.right {
	    float: right;
	}
	
	.clear {
	    clear: both;
	}
	
	.heard_img {
	    height: 74rpx;
	    width: 74rpx;
	    border-radius: 5px;
	    overflow: hidden;
	    background: #ddd;
	}
	
	.heard_img image {
	    width: 100%;
	    height: 100%;
	}
	
	.question_text,.answer_text {
	    box-sizing: border-box;
	    position: relative;
	    display: inline-block;
	}
	
	.question_text {
	    margin-right: 20rpx;
	}
	
	.answer_text {
	    margin-left: 20rpx;
	}
	
	.question_text .p,.answer_text .p {
	    border-radius: 10rpx;
	    padding: 20rpx;
	    margin: 0;
	    font-size: 28rpx;
	    line-height: 1.4;
	    box-sizing: border-box;
	    vertical-align: middle;
	    display: table-cell;
	    word-wrap: break-word;
	    max-width: 520rpx;
	}
	
	.answer_text .p {
	    background: #fff;
	    border: 1px solid #eeeeee;
	    box-sizing: border-box;
	}
	
	.question_text .p {
	    background: #a2e65b;
	    text-align: left;
	    border: 1px solid #94d64f;
	    box-sizing: border-box;
	}
	
	.question_text i::before {
	    content: '';
	    position: absolute;
	    left: 100%;
	    top: 27rpx;
	    border: 14rpx solid transparent;
	    border-left-color: #94d64f;
	}
	
	.question_text i::after {
	    content: '';
	    position: absolute;
	    left: 100%;
	    top: 27rpx;
	    margin-left: -1px;
	    border: 14rpx solid transparent;
	    border-left-color: #a2e65b;
	}
	
	.answer_text i::before {
	    content: '';
	    position: absolute;
	    left: 0;
	    top: 26rpx;
	    margin-left: -22rpx;
	    border: 14rpx solid transparent;
	    border-right-color: #eee;
	}
	
	.answer_text i::after {
	    content: '';
	    position: absolute;
	    left: 0rpx;
	    top: 26rpx;
	    margin-left: -21rpx;
	    border: 14rpx solid transparent;
	    border-right-color: white;
	}
	
	.answer_text .p a {
	    color: #42929d;
	    display: inline-block;
	}
	
	audio {
	    display: none;
	}
	
	.saying {
	    position: fixed;
	    bottom: 30%;
	    left: 50%;
	    width: 120px;
	    margin-left: -74rpx;
	    display: none;
	}
	
	.saying img {
	    width: 100%;
	}
	
	.write_list {
	    position: absolute;
	    left: 0;
	    width: 100%;
	    background: #fff;
	    border-top: solid 1px #ddd;
	    padding: 5px;
	    line-height: 30px;
	}
	
	.question_img,.answer_img {
	    box-sizing: border-box;
	    position: relative;
	    display: inline-block;
	    min-height: 74rpx;
	}
	
	.answer_img>image,.question_img>image {
	    width: 190rpx;
	}
	
	.question_voice,.answer_voice {
	    box-sizing: border-box;
	    position: relative;
	    display: inline-block;
	    min-height: 74rpx;
	}
	
	.question_voice {
	    margin-right: 20rpx;
	    padding-left: 20px;
	}
	
	.answer_voice {
	    margin-left: 20rpx;
	    padding-right: 20px;
	}
	
	.question_voice .voiceview,.answer_voice .voiceview {
	    border-radius: 10px;
	    padding: 20rpx;
	    margin: 0;
	    font-size: 14px;
	    box-sizing: border-box;
	    height: 74rpx;
	}
	
	.answer_voice .voiceview {
	    background: #fff;
	}
	
	.question_voice .voiceview {
	    background: #b1e46e;
	    color: #fff;
	    text-align: right;
	}
	
	.question_voice>i,.answer_voice>i {
	    width: 0;
	    height: 0;
	    border-top: 14rpx solid transparent;
	    border-bottom: 14rpx solid transparent;
	    position: absolute;
	    top: 27rpx;
	}
	
	.answer_voice>i {
	    border-right: 14rpx solid #fff;
	    left: -10rpx;
	}
	
	.question_voice>i {
	    border-left: 14rpx solid #b1e46e;
	    right: -10rpx;
	}
	
	.answer_voice .voiceview i {
	    transform: rotate(180deg);
	    display: inline-block;
	}
	
	.noread {
	    display: inline-block;
	    width: 18rpx;
	    height: 18rpx;
	    background-color: #f00;
	    border-radius: 50%;
	    position: absolute;
	    top: 29rpx;
	}
	
	.answer_voice .noread {
	    right: 0;
	}
	
	.question_voice .noread {
	    left: 0;
	}
	
	video {
	    width: 400rpx;
	    height: 300rpx;
	}
	
	.oldqq {
	    display: flex;
	    flex-direction: column;
	}
	
	.oldqq_container {
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    height: 60rpx;
	    border: 1px solid #f0f0f0;
	    border-radius: 10rpx;
	    margin: 20rpx 0;
	}
	
	.oldqq_container image {
	    width: 35rpx;
	    height: 33rpx;
	    margin: 0;
	    padding: 0;
	}
	
	.oldqq_bottom {
	    display: flex;
	    justify-content: space-between;
	    align-items: center;
	    height: 60rpx;
	    border: 1px solid #f0f0f0;
	    border-radius: 10rpx;
	    background: #f9f9f9;
	    margin-bottom: 20rpx;
	}
	
	.oldqq_bottom image {
	    width: 35rpx;
	    height: 33rpx;
	    margin: 0;
	    padding-right: 20rpx;
	}
	
	.oldqq_bottom text {
	    padding-left: 20rpx;
	}
	
	.set-tag-sec {
	    width: 90%;
	    height: 78rpx;
	    line-height: 78rpx;
	    padding: 0rpx 5%;
	    display: block;
	    background: white;
	    z-index: 1;
	    border-bottom: 1rpx solid #e5e5e5;
	}
	
	.set-tag-sec .text {
	    width: 50%;
	    height: 78rpx;
	    line-height: 78rpx;
	    display: inline-block;
	    font-size: 26rpx;
	    color: #b2b2b2;
	}
	
	.set-tag-sec .text i {
	    font-size: 28rpx;
	    color: #b2b2b2;
	    margin-right: 10rpx;
	}
	
	.set-tag-sec .text.active,.set-tag-sec .text.active i {
	    color: #fab161;
	}
</style>
