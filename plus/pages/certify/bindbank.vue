<template>
	<view class="refund-apply pb100">
		<form @submit="formSubmit" @reset="formReset">
			<view class="bg-white p-0-30 f30">
				<view >
					<view class="d-s-c border-b-e">
						<text class="key-name">银行卡姓名</text>
						<input class="ml20 flex-1 p-30-0 tr" :disabled="disabled" name="card_name" type="text" v-model="form.card_name"  
						placeholder="请输入银卡对应姓名" />
					</view>
					<view class="d-s-c border-b-e">
						<text class="key-name">身份证号 </text>
						<input class="ml20 flex-1 p-30-0 tr" :disabled="disabled"  name="cert_id" type="idcard" v-model="form.cert_id"  
						placeholder="请输入身份证号" />
					</view>
					<view class="d-b-c border-b-e">
						<text class="key-name">提现银行</text>
						<picker @change="bindPickerChange" :value="index" range-key='name' :range="list">
							<view class="uni-input">{{bank_name}}</view>
						</picker>
					</view>
					<view class="d-s-c border-b-e">
						<text class="key-name">银行卡号 </text>
						<input class="ml20 flex-1 p-30-0 tr" name="card_id" type="number" v-model="form.card_id"  
						placeholder="请输入银行卡号" />
					</view>
					
					<view class="d-s-c border-b-e">
						<text class="key-name">手机号 </text>
						<input class="ml20 flex-1 p-30-0 tr" name="tel_no" type="number" v-model="form.tel_no"  
						placeholder="请输入手机号" />
					</view>
				</view>
			</view>
			<view class="p30"><button form-type="submit" type="default" class="btn-red f30 mt30">提交</button></view>
        </form>
    </view>
</template>
<script>
	import config from '@/config.js'
    export default {
		components: {
		},
        data() {
            return {
				/*是否加载完成*/
				loadding: true,
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				form:{
					card_name:'',
					cert_id:'',
					card_id:'',
					tel_no:'',
					bank_name:'',
				},
				bank_name:'请点击选择银行',
				list:[],
				from_url:'',
				index:0,
				disabled:false,
            }
        },
        onLoad() {
        },
        mounted() {
          this.setGlobalColor()
            /*获取订单详情*/
            this.getData();
        },
        methods: {
			bindPickerChange: function(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				let self = this;
				self.bank_name = self.list[e.detail.value].name;
				self.form.bank_name = self.list[e.detail.value].name;
				self.form.bank_code_id = self.list[e.detail.value].bank_code_id;
				// this.index = e.detail.value
			},
            /*获取数据*/
            getData(){
                let self = this;
				uni.showLoading({
					title: self.$nw("加载中")
				});
                self._get( 'user.agent/bindBank',  {},  function (res)  {

						uni.hideLoading();
						if(res.data.account){
							self.form = res.data.account;
							self.bank_name = res.data.account.bank.name
							self.form.bank_name = res.data.account.bank.name
							self.form.card_name = res.data.account.truename
							self.form.card_id = res.data.account.account;
							self.form.cert_id = res.data.account.id_card
							self.form.tel_no = res.data.account.mobile
							self.disabled = true;
						}
						self.list = res.data.list;

                    }
                );
            },
            /*提交表单*/
            formSubmit: function (e)
            {
                let self = this;
                var formdata = self.form;
				// card_name:'',
				// cert_id:'',
				// card_id:'',
				// tel_no:'',
				// bank_name:'',
                if (formdata.bank_name == '') {
                	uni.showToast({
                		title: '请选择银行',
                		duration: 1000,
                		icon: 'none'
                	});
                	return false;
                }
				if (formdata.card_name == '') {
					uni.showToast({
						title: '请输入银行卡对应姓名',
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				if (formdata.card_id == '') {
					uni.showToast({
						title: '请输入银行卡号码',
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				if (formdata.cert_id == ''||!self.validateIdentity(formdata.cert_id)) {
					uni.showToast({
						title: '请输入身份证号',
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
				let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/;
				if (formdata.tel_no == ''||!reg.test(formdata.tel_no)) {
					uni.showToast({
						title: '请输入本人手机号',
						duration: 1000,
						icon: 'none'
					});
					return false;
				}
                uni.showLoading({
                	title: '正在提交',
                	mask: true
                });
                self._post('user.agent/bindBank', formdata, function (res)
                {
                	uni.hideLoading();
                	uni.showModal({
                		title:'提示',
                		content:'提现账户绑定成功',
                		showCancel:false,
                		success:function(e){
							if(e.confirm){
								uni.redirectTo({
									url:'/main/pages/agent/index/index'
								})
							}
                			
                		}
                	})
                });
            },
			/*
			校验身份证
			*/
			validateIdentity(id) {
			   // 1 "验证通过!", 0 //校验不通过 // id为身份证号码
			    var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
			    //号码规则校验
			    if(!format.test(id)){
			      return false;
			    }
			    //区位码校验
			    //出生年月日校验  前正则限制起始年份为1900;
			    var year = id.substr(6,4),//身份证年
			      month = id.substr(10,2),//身份证月
			      date = id.substr(12,2),//身份证日
			      time = Date.parse(month+'-'+date+'-'+year),//身份证日期时间戳date
			      now_time = Date.parse(new Date()),//当前时间戳
			      dates = (new Date(year,month,0)).getDate();//身份证当月天数
			    if(time>now_time||date>dates){
			      return false;
			    }
			    //校验码判断
			    var c = new Array(7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2);  //系数
			    var b = new Array('1','0','X','9','8','7','6','5','4','3','2'); //校验码对照表
			    var id_array = id.split("");
			    var sum = 0;
			    for(var k=0;k<17;k++){
			      sum+=parseInt(id_array[k])*parseInt(c[k]);
			    }
			    if(id_array[17].toUpperCase() != b[sum%11].toUpperCase()){
			      return false;
			    }
			    return true
			},
        }
    }
</script>

<style scoped>
	.abs {
	    position: absolute;
	}
	.staff-editInfo-common {
	    width: 92%;
	    height: auto;
	    padding: 0rpx 4%;
	    background: white;
	    margin-top: 20rpx;
	    border: 1rpx solid #e5e5e5;
	    border-left: transparent;
	    border-right: transparent;
	}

	.staff-editInfo-common .title {
	    height: 90rpx;
	    line-height: 90rpx;
	    font-size: 30rpx;
	    color: #2f2f2f;
	}
	.staff-editInfo-common .imgs {
	    padding-bottom: 20rpx;
	}

	.staff-editInfo-common .imgs .imgs-icon {
	    width: 160rpx;
	    height: 160rpx;
	    line-height: 160rpx;
	    display: block;
	    margin-bottom: 20rpx;
	    margin-left: 10rpx;
	    background: #f3f4f7;
	}

	.staff-editInfo-common .imgs .imgs-icon i {
	    font-size: 80rpx;
	    color: #b4b4b4;
	}

	.upload-staff-images {
	    width: 158rpx;
	    height: 158rpx;
	    float: left;
	    margin: 0rpx 9rpx 20rpx 9rpx;
	}

	.imgs .upload-staff-images:nth-child(4n-3) {
	    margin-left: 0rpx;
	}

	.imgs .upload-staff-images:nth-child(4n) {
	    margin-right: 0rpx;
	}

	.upload-staff-images em {
	    top: -16rpx;
	    right: -16rpx;
	    line-height: 1;
	    display: block;
	    width: 36rpx;
	    height: 36rpx;
	    line-height: 36rpx;
	    background: #898989;
	    transform: rotate(45deg);
	    vertical-align: middle;
	    display: flex;
	    align-items: center;
	    justify-content: center;
	}

	.upload-staff-images em i {
	    font-size: 20rpx;
	    color: white;
	}

	.upload-staff-images image {
	    width: 100%;
	    height: 100%;
	}
</style>
