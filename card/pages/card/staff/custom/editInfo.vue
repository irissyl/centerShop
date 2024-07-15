<template>
	<view>
		<view class="staff-editInfo-sec">

			<view class="child">
				<view class="flex">
					<view class="flex100-2">姓名</view>
					<view class="flex100-8 tr">
						<view class="flex100-8 tr" v-if="param.fromstatus=='boss'">{{clientInfo.nick_name||'暂未填写'}}</view>
						<input placeholder="姓名" type="text" v-model="clientInfo.nick_name"
						 v-else></input>
					</view>
				</view>
			</view>
			<view class="child">
				<view class="flex">
					<view class="flex100-2">性别</view>
					<view class="flex100-8 tr">
						<view class="flex100-8 tr" v-if="param.fromstatus=='boss'">{{setCount[count]?setCount[count].name:'暂未设置'}}</view>
						<block v-else>
							<i class="iconfont2 icon-right2 fr"></i>
							<picker @change="pickerSelected" :range="setCount" :rangeKey="'name'" :value="count">
								{{setCount[count]?setCount[count].name:'请选择'}}
							</picker>
						</block>
					</view>
				</view>
			</view>
			<view class="child">
				<view class="flex">
					<view class="flex100-2">手机号</view>
					<view class="flex100-8 tr">
						<view class="flex100-8 tr" v-if="param.fromstatus=='boss'">{{clientInfo.tel?clientInfo.tel:'暂未填写'}}</view>
						<input  placeholder="电话" type="text" v-model="clientInfo.tel" v-else></input>
					</view>
				</view>
			</view>
			<view class="child">
				<view class="flex">
					<view class="flex100-2">邮箱</view>
					<view class="flex100-8 tr">
						<view class="flex100-8 tr" v-if="param.fromstatus=='boss'">{{clientInfo.email?clientInfo.email:'暂未填写'}}</view>
						<input  placeholder="邮箱" type="text" v-model="clientInfo.email" v-else></input>
					</view>
				</view>
			</view>
			<view class="child">
				<view class="flex">
					<view class="flex100-2">公司</view>
					<view class="flex100-8 tr">
						<view class="flex100-8 tr" v-if="param.fromstatus=='boss'">{{clientInfo.company_name?clientInfo.company_name:'暂未填写'}}</view>
						<input name="company" placeholder="公司" type="text" v-model="clientInfo.company_name" v-else></input>
					</view>
				</view>
			</view>
			<view class="child">
				<view class="flex">
					<view class="flex100-2">职称</view>
					<view class="flex100-8 tr">
						<view class="flex100-8 tr" v-if="param.fromstatus=='boss'">{{clientInfo.position?clientInfo.position:'暂未填写'}}</view>
						<input name="position" placeholder="职称" type="text" v-model="clientInfo.position" v-else></input>
					</view>
				</view>
			</view>
			<view class="child">
				<view class="flex">
					<view class="flex100-2">详细地址</view>
					<view class="flex100-8 tr">
						<view class="flex100-8 tr" v-if="param.fromstatus=='boss'">{{clientInfo.address?clientInfo.address:'暂未填写'}}</view>
						<input name="address" placeholder="详情地址" type="text" v-model="clientInfo.address" v-else></input>
					</view>
				</view>
			</view>
			<view class="child">
				<view class="flex">
					<view class="flex100-2">生日</view>
					<view class="flex100-8 tr">
						<view class="flex100-8 tr" v-if="param.fromstatus=='boss'">{{date?date:'暂未设置'}}</view>
						<block v-else>
							<i class="iconfont2 icon-right2 fr"></i>
							<picker @change="listenerDatePickerSelected" v-model="clientInfo.birthday" mode="date">
								{{clientInfo.birthday?clientInfo.birthday:'请选择'}}
							</picker>
						</block>
					</view>
				</view>
			</view>
			
		</view>
		<!-- <view class="staff-editInfo-common">
			<view class="title">备注</view>
			<view class="remark" v-if="param.fromstatus=='boss'">{{clientInfo.remark?clientInfo.remark:'暂未备注'}}</view>
			<input class="textarea br-15" maxlength="-1" name="remark" placeholder="备注" style="height:80rpx;min-height:80rpx;line-height:80rpx;"
			 type="text" v-model="clientInfo.remark" v-else></input>
		</view> -->
		<button class="fix-painter-share tc" @click="toEditStaff" formType="submit" hoverClass="none" style="border-radius:15rpx;width:92%;margin:60rpx auto;background:#e93636;"
		 v-if="!param.fromstatus">
			保存
		</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				setCount: [{
				  name: "女"
				},{
				  name: "男"
				}, {
				  name: "未知"
				}],
				count: -1,
				date: "",
				clientInfo: {
					nick_name:"",
				},
				param: {
					fromstatus:''
				},
				globalData: "",
				showClientSource: "",
				showClientSourceData: "",
			}
		},
		onLoad(e) {
			if(e.fromstatus!='undefined'){
				this.param.fromstatus = e.fromstatus;
			}
			
			this.client_id = e.client_id;
			this.getClientDetail();
		},
		methods: {
			/* 客户详情 */
			getClientDetail() {
				let self = this;
				self._get('plus.card.client/getClientDetail', {
						client_id: self.client_id
					},
					function(res) {
						if (res.code == 1) {
							self.clientInfo = res.data.clientInfo;
							self.count  = res.data.clientInfo.sex;
						}
					})
			},
			/* 选择性别 */
			pickerSelected(e){
				this.count = e.detail.value;
				this.clientInfo.sex = e.detail.value;
			},
			/* 选择日期 */
			listenerDatePickerSelected(e){
				this.clientInfo.birthday = e.detail.value;
			},
			toEditStaff(){
				let self =this;
				let params = {
					client_id:self.client_id,
					sex:self.clientInfo.sex,
					tel:self.clientInfo.tel,
					email:self.clientInfo.email,
					company_name:self.clientInfo.company_name,
					position:self.clientInfo.position,
					address:self.clientInfo.address,
					birthday:self.clientInfo.birthday
				};
				
				self._get('plus.card.client/editClient', params,
				function(res) {
					if (res.code == 1) {
						uni.showToast({
							title:res.msg
						})
						self.clientInfo = res.data.clientInfo;
						self.count  = res.data.clientInfo.sex;
					}
				});
			}
		}
	}
</script>

<style scoped>
	@import "/card/statics/card.css";
	page {
	    background: #f4f4f8;
	}
	
	view,button {
	    display: block;
	    overflow: initial;
	}
	.staff-editInfo-sec .child .flex{
		height: 100%;
	}
</style>
