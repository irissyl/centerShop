<template>
	<view>

		<view class="staff-editInfo-sec">
			<view class="child" style="height:120rpx;line-height:120rpx;display:inline-block;margin:20rpx 0rpx;">
				<view class="flex" style="padding-bottom:20rpx;">
					<view class="flex100-2">头像</view>
					<view  class="flex100-8 tr" @click="chooseWxImageShop('avatar')" data-type="toAvatar">
						<i class="iconfont2 icon-right2 fr" style="margin-top: 30rpx;"></i>
						<image class="circle fr mr-10" mode="aspectFill" :src="staffInfo.avatar_image"></image>
					</view>
				</view>
			</view>
			<view class="child"></view>
			<view class="child">
				<view class="flex">
					<view class="flex100-2">姓名</view>
					<view class="flex100-8 tr">
						<input v-model="staffInfo.name"  placeholder="姓名" type="text"></input>
					</view>
				</view>
			</view>
			
			
			<view class="child" >
				<view class="flex">
					<view class="flex100-2">公司名称</view>
					<view class="flex100-8 tr">
						<input v-model="staffInfo.company" placeholder="公司名称" type="text"></input>
					</view>
				</view>
			</view>
			
			<view class="child" >
				<view class="flex">
					<view class="flex100-2">职称</view>
					<view class="flex100-8 tr">
						<input v-model="staffInfo.occupation" placeholder="职称" type="text"></input>
					</view>
				</view>
			</view>
			
			
			<view class="child">
				<view class="flex">
					<view class="flex100-2">手机号</view>
					<view class="flex100-8 tr">
						<input v-model="staffInfo.mobile"  placeholder="手机号" type="text"></input>
					</view>
				</view>
			</view>
		<!-- 	<view class="child">
				<view class="flex">
					<view class="flex100-2">微信号</view>
					<view class="flex100-8 tr">
						<input  placeholder="微信号" type="text" v-model="staffInfo.wechat"></input>
					</view>
				</view>
			</view> -->
		  

			<view class="child">
				<view class="flex">
					<view class="flex100-2">邮箱</view>
					<view class="flex100-8 tr">
						<input v-model="staffInfo.email"  placeholder="邮箱" type="text"></input>
					</view>
				</view>
			</view>
			
			<view class="child">
				<view class="flex" @click="chooseIndustry">
					<view class="flex100-2">行业</view>
					<view class="flex100-8 tr">
						{{currentIndustry}}
					</view>
				</view>
			</view>
			
			<view class="child" @click="showMulLinkageRegionalComponents">
				<view class="flex">
					<view class="flex100-2">地区</view>
					<view class="flex100-8 tr">
						<text>{{selectRegion}}</text>
						
					</view>
				</view>
			</view>

			<view class="staff-editInfo-common">
			    <view class="title">擅长业务</view>
			    <textarea class="br-15" decode="emsp" maxlength="500" name="desc"
				 placeholder="擅长业务" v-model="staffInfo.begoodat"></textarea>
			</view>
			<view class="staff-editInfo-common">
			    <view class="title">资源共享</view>
			    <textarea class="br-15" decode="emsp" maxlength="500" name="desc"
				 placeholder="资源共享" v-model="staffInfo.resource_sharing"></textarea>
			</view>
			
			<view class="staff-editInfo-common">
			    <view class="title">资源需求</view>
			    <textarea class="br-15" decode="emsp" maxlength="500" name="desc"
				 placeholder="资源需求" v-model="staffInfo.resource_request"></textarea>
			</view>

			
			<view class="child" v-if="staffInfo.supply">
				<view class="flex">
					<view class="flex100-2">公司</view>
					<view class="flex100-8 tr">
						{{staffInfo.supply.name?staffInfo.supply.name:'请选择'}}
					</view>
				</view>
			</view>
		</view>
		
		<view class="staff-editInfo-common" >
			<view class="title">视频封面</view>
			<view class="imgs clearfix">
				<view v-model="staffInfo.poster" class="upload-staff-images rel" v-if="staffInfo.poster">
					<em class="abs circle tc"  @click="toDeletePoster">
						<i class="iconfont2 icon-open"></i>
					</em>
					<image mode="aspectFill" :src="staffInfo.poster"></image>
				</view>
				<view  :class="'imgs-icon tc fl ' + (staffInfo.poster==''?'':'hide')"  @click="chooseWxImageShop('poster')">
					<i class="iconfont2 icon-open"></i>
				</view>
			</view>
		
			<view class="title">上传视频</view>
			<view class="videos clearfix">
				
				<view  v-model="staffInfo.video" class="videos-icon tc fl" v-if="staffInfo.video">
					<em class="abs circle tc"  @click="toDeleteVideo">
						<i class="iconfont2 icon-open"></i>
					</em>
					<video controls objectFit="contain" :src="staffInfo.video"></video>
				</view>
				<view  :class="'videos-icon tc fl ' + (staffInfo.video==''?'':'hide')" @click="chooseWxVideo">
					<i class="iconfont2 icon-open"></i>
				</view>
			</view>
		</view>
		<!-- <view class="staff-editInfo-common" v-if="staffInfo.card_id">
			
			<block v-if="staffInfo.card_id">
				<view class="tags-title">我的标签<text class="fr">{{staffInfo.labelList.length?staffInfo.labelList.length:'0'}}/10</text>
				</view>
				<view class="staff-choose-tags">
					<view v-if="staffInfo.labelList.length>0" v-model="staffInfo.labelList" v-for="(item, index) in staffInfo.labelList" :key="index" @click="toDeleteTags(index)" class="child rel fl">
						<em class="abs circle">
							<i class="iconfont2 icon-open"></i>
						</em>
						<button class="btn nobor fl rel" hoverClass="btn-hover" plain="true" style="color:rgba(23,162,52,1);border:0.5px solid rgba(23,162,52,1);background:rgba(23,162,52,0.05)" type="hasbg">
								{{item.name}}
						</button>
					</view>
					<button class="btn nobor fl"  @click="toAddTags"  hoverClass="btn-hover" plain="true" style="color:rgba(100,100,100,1);border:1rpx solid rgba(200,200,200,1);background:rgba(200,200,200,0.05);font-size:38rpx;" type="hasbg" v-if="staffInfo.labelList.length<10">
						+
					</button>
				</view>
			</block>
			<view style="height:50rpx;"></view>
		</view>
		<view class="staff-editInfo-common">
			<view class="title">图片展示</view>
			<view class="imgs clearfix">
				<view v-model="staffInfo.images" v-for="(item, index) in staffInfo.images" :key="index" class="upload-staff-images rel">
					<em class="abs circle tc"  @click="toDeleteImg(index)">
						<i class="iconfont2 icon-open"></i>
					</em>
					<image mode="aspectFill" :src="item"></image>
				</view>
				<view  :class="'imgs-icon tc fl ' + (staffInfo.images.length<8?'':'hide')" @click="chooseWxImageShop('shop')" >
					<i class="iconfont2 icon-open"></i>
				</view>
			</view>
		</view>

		<view class="staff-editInfo-common">
		    <view class="title">个人介绍</view>
		    <textarea class="br-15" decode="emsp" maxlength="-1" name="desc" placeholder="个性介绍" v-model="staffInfo.introduce"></textarea>
		</view> -->
		
		<view>
			
		</view>
		<button class="fix-painter-share tc" @click="toEditStaff" formType="submit" hoverClass="none" style="border-radius:15rpx;width:92%;margin:60rpx auto;background:#e93636;">
			保存
		</button>

	
	<view class="bg_opacity_sec fix" v-if="showAddUseSec==true"></view>
	<view class="add-useMessage-form" v-if="showAddUseSec==true">
		<view class="title">新建标签</view>
		<textarea maxlength="-1" v-model="kmd_label" placeholder="请输入您的印象标签" type="text"></textarea>
		<button class="btn cancel"@click="toCancel" formType="submit" hoverClass="none">取消</button>
		<button class="btn" @click="toSaveUseTag" formType="submit" hoverClass="none">确认</button>
	</view>
	<view :class="globalData.isIphoneX?'isIphoneX':''"></view>
	
	<!-- #ifndef APP -->
	<mpvue-city-picker ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm">
	</mpvue-city-picker>
	<!-- #endif -->
	<regionalComponents v-show="regionaStatus" ref="regionalComponents" :defaultData="defaultData" @cancel="cancel"
		@confirm="confirm"></regionalComponents>
	
	</view>
</template>

<script>
	
	import utils from '@/common/utils.js';
	import config from '@/config.js'
	import mpvueCityPicker from '@/components/mpvue-citypicker/mpvueCityPicker.vue';
	import streetPicker from '@/components/mpvue-citypicker/streetPicker.vue';
	import regionalComponents from '@/components/regionalComponents/regionalComponentsa.vue'
	export default {
		components: {
			mpvueCityPicker,
			streetPicker,
			regionalComponents
		},
		data() {
			return {
				showAddUseSec:false,
				staffInfo:{
					user_id: '',
					supply_id: '',
					status: 1,
					name: '',
					mobile: '',
					wechat:'',
					email:'',
					images_id:"",
					images_str:"",
					images:[],
					video:"",
					introduce:"",
					poster:"",
					video:"",
					labelList:[],
					province_id:0,
					city_id:0,
					region_id:0,
					begoodat:"",//擅长业务
					resource_sharing:"",//资源共享
					resource_request:"",//资源需求
					company:"",//公司名称
					avatar_image:this.websiteUrl + "file/images/avatar.png",

					
				},
				currentIndustry:'所在行业',
				kmd_label:"",
				cityPickerValueDefault: [0, 0, 0],

				categoryData:[],
				multiIndex: [0, 0],
				showIndustry:false,
				globalData:{
					
				},
				from:'',
				showvideo:false,
				
				selectCity: this.$nw("选择省,市,区"),
				defaultData: {
					province_id: 0,
					city_id: 0,
					region_id: 0,
					street_id: 0,
					address_id: 0,
				},	
				addressarr: {},
				selectStreet: this.$nw("选择街道/镇/乡"),
				selectRegion: this.$nw("选择地区"),
				is_street: false,
				streetDataList: [],
				regionaStatus: false,
			}
		},
		onLoad(e){
			/*名片id*/
			let scene = utils.getSceneData(e);

			if(e.card_id||scene.card_id){
				this.card_id = e.card_id ? e.card_id : scene.card_id;
				
			}
			if((e.supply_id||scene.supply_id)&&!this.card_id){
				this.supply_id  =e.supply_id ? e.supply_id : scene.supply_id;
			}
			
			if(e.from||scene.from){
				this.from = e.from ? e.from :  scene.from;
			}
		
			if(this.card_id){
				this.getCardInfo();
			}
			if(this.supply_id){
			 this.getSupplyInfo();
			}
		},
		methods: {
			showMulLinkageRegionalComponents() {
				this.regionaStatus = true;
			},
			cancel() {
				this.regionaStatus = false;
			},
			confirm(e) {
				console.log(e)
				this.staffInfo.province_id = e.province_id;
				this.staffInfo.city_id = e.city_id;
				this.staffInfo.region_id = e.region_id;
				// this.staffInfo.street_id = e.street_id;
				this.selectRegion = e.province + e.city + e.area;// + e.street
				this.regionaStatus = false;
			
			
			},
			/* 获取名片信息 */
			getCardInfo(){
				let self = this;
				let card_id = self.card_id;

				self._get(
					'plus.card.card/detail',
					{
						card_id: card_id,
					},
					function(res) {
						self.staffInfo = res.data.info;
						if( res.data.info.category_id){
							console.log(res.data.info);
							self.currentIndustry = res.data.info.category.name;
							
						}
						self.province_id = res.data.info.province_id;
						self.city_id = res.data.info.city_id;
						self.region_id = res.data.info.region_id;
						self.selectRegion = res.data.info.region.address 
						if(res.data.showvideo){
							self.showvideo = res.data.showvideo;
						}
						self.loadding = false;
					},function(){},function(){},false
				);
			},
			/* 
			 获取供应商信息
			*/
			getSupplyInfo(){
				let self = this;
				let supply_id = self.supply_id;
				uni.showLoading({
					title: '加载中'
				});
				self._get(
					'plus.card.card/supplyInfo',
					{
						supply_id: supply_id,
						from:self.from
					},
					function(res) {
						self.staffInfo.supply = res.data.info;
						self.loadding = false;
						uni.hideLoading();
					}
				);
				
			},
			/* 新增标签 */
			toAddTags(){
				let self = this;
				self.showAddUseSec =true;
			},
			/* 取消 */
			toCancel(){
				let self = this;
				self.showAddUseSec =false;
			},
			
			/* 新建用户标签 */
			toSaveUseTag(){
				let self = this;
				let card_id = self.card_id;
				self._post(
				'plus.card.card/addUserTag',
				{
					card_id: card_id,
					kmd_label:self.kmd_label,
				},
				function(res) {
					if(res.code==1){
						self.staffInfo.labelList.push(res.data.label);
					}
					self.showAddUseSec =false;
					self.loadding = false;
				})
			},
			
			/* 删除标签 */
			toDeleteTags(index){
				let self = this;
				self.staffInfo.labelList.splice(index,1);
			},
			
			/* 删除图片 */
			toDeleteImg(index){
				let self = this;
				self.staffInfo.images.splice(index,1);
				self.staffInfo.images_str = self.staffInfo.images.join(',');
				console.log(self.staffInfo.images,self.staffInfo.images_str);
			},
		
			/* 图片上传 */
			chooseWxImageShop(type){
				let self = this, images = self.staffInfo.images, n = self.staffInfoImages;
				let params = {
					token: uni.getStorageSync('token'),
				    app_id: self.getAppId()
				};
				let count = 1;
				if(type=='shop'){
					count = 12;
				}
				uni.chooseImage({
					count: count,
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
									if(type=='poster'){
										self.staffInfo.poster =a.data.file_path;
									}
									if(type=='shop'){
										self.staffInfo.images.push(a.data.file_path);
										if(self.staffInfo.images){
											self.staffInfo.images_str =self.staffInfo.images.join(',');
										
										}
									}
									if(type=='avatar'){
										self.staffInfo.avatar_image = a.data.file_path;
									}
									uni.hideLoading(); 
								}
							});
						}
					
					},
					fail: function(t) {
						uni.hideLoading();
					}
				});
			},
			
			/* 删除视频封面 */
			toDeletePoster(){
				let self = this;
				self.staffInfo.poster = '';
			},
			/* 删除视频 */
			toDeleteVideo(){
				let self = this;
				self.staffInfo.video = '';
			},
			
			/* 上传视频 */
			chooseWxVideo(){
				let self = this;
				self.staffInfo.video = '';
				let params = {
					token: uni.getStorageSync('token'),
				    app_id: self.getAppId()
				};
				let url  = config.app_url + '/index.php?s=/api/file.upload/video';
				uni.chooseVideo({
					count: 1,
					sourceType: ['camera', 'album'],
					success: function (res) {
						self.src = res.tempFilePath;
						uni.showLoading({
							title: "视频上传中"
						}), uni.uploadFile({
							url: url,
							filePath: res.tempFilePath,
							name: "iFile",
							formData: params,
							success: function(t) {
								var a = JSON.parse(t.data);
								self.staffInfo.video = a.data.file_path;
								uni.hideLoading(); 
							}
						});
					}
				});
			},
			
			/* 选择行业 */
			chooseIndustry(){
				let path = '/plus2/pages/project/category?source=edit';
				uni.navigateTo({
					url: path
				})
			},
			
			closeCategory(e){
				console.log(e);
			},
			
			/* 选择地址 */
			handerPopupAreaChange(){
				this.$refs.mpvueCityPicker.show();
			
			},
			
			/* 保存 */
			toEditStaff(){
				let self = this;
				let params = self.staffInfo;
				let kmd_label_ids = [];
				if(self.staffInfo.labelList){
					self.staffInfo.labelList.forEach(function(item,index){
						kmd_label_ids.push(item.kmd_label_id);
					});
				}
				params.kmd_label_ids = kmd_label_ids.join(',');

				uni.showLoading({
					title: "保存中"
				});
				self._post(
					'plus.card.card/editCard',
					params,
					function(res){
						if(res.code ==1){
							uni.showToast({
								title: res.msg,
								duration: 2000,
								icon:"none"
							})
						}
						if(res.data.noCreated==1){
							uni.showModal({
								title:"创建提醒",
								content:"名片已超数量限制，请联系客服",
								showCancel:false,
								success(res) {
									if(res.confirm){
										let path  = '/pages/user/index/index';
										uni.redirectTo({
											url:path
										});
									}
									return '';
								}
							})
						}
						setTimeout(function(){
							uni.hideLoading(); 
							self.getCardInfo();
							uni.navigateBack()
						},2000)
						self.card_id  = res.data.card_id;
						
						// uni.hideLoading(); 
					}
				)
			}
			
			
		}
	}
</script>

<style>
	@import "/card/statics/card.css";
	.staff-editInfo-common .videos .videos-icon{
		position: relative;
		width: 100%;
		height: 389rpx;
		line-height: 389rpx;
		display: block;
		margin-bottom: 20rpx;
		background: #f3f4f7;
	}
	
	.staff-editInfo-common .videos video{
		width: 100%;
		height: 100%;
	}
	
	.staff-editInfo-common .videos .videos-icon em{
	    top: -8px;
	    right: -8px;
	    line-height: 1;
	    display: block;
	    width: 18px;
	    height: 18px;
	    line-height: 18px;
	    background: #898989;
	    -webkit-transform: rotate(45deg);
	    transform: rotate(45deg);
	    vertical-align: middle;
	    display: -webkit-box;
	    display: -webkit-flex;
	    display: flex;
	    -webkit-box-align: center;
	    -webkit-align-items: center;
	    align-items: center;
	    -webkit-box-pack: center;
	    -webkit-justify-content: center;
	    justify-content: center;
	}
	.tags-title{
		padding-top: 50rpx;
	}
</style>
