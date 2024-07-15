<template>
	<!--pickerHospital 子组件-->
	<view class="date-background" v-show="value">
		<view class='date-gray-background' @click="hiddeDatePicker"></view>
		<view class='date-container'>
			<view class="transparent">
				<view class='date-confirm'>
					<view @click="hiddeDatePicker" class="pickerCancel">取消</view>
					<!-- 输入框 -->
					<u-search style="width: 70%;" placeholder="请输入医院查询" @clear="clearSearch" @change='searchChange'
						:show-action='false' v-model="searchValue" shape="round" clearabled></u-search>
					<view @click="confirm1" class="pickerConfirm">确认</view>
				</view>
				<picker-view :immediate-change='true' indicator-class="indicator" :value="setValues"
					@change="bindChange" mask-style="height:100rpx;"
					style="width: 100%; height: 80%;position:absolute;bottom:0rpx;text-align:center;background:white">
					<picker-view-column class="pickViewColumn">
						<view v-for="item in list" :key="item.id" class="u-column-item"
							style="height: 68rpx;overflow: hidden;">{{item.name}}
						</view>
					</picker-view-column>
				</picker-view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			dataSource: {
				type: Array,
				default () {
					return []
				}
			},
			pickerValues: { //picker默认展示的值
				type: Array,
				default () {
					return [0]
				}
			},
			value: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {
				searchValue: '', // 搜索值
				setValues: [0], // picker 选择值
				form: { //要传过去的值
					id: '',
					name: ''
				},
				list: this.dataSource,
			}
		},
		onLoad(option) {},
		watch: {
			dataSource: {
				handler(newValue, oldValue) {
					this.list = newValue
				},
				deep: true,
				immediate: true,
			},
			value(newValue, oldValue) {
				this.init()
			}
		},
		methods: {
			init() {
				this.$nextTick(() => { //组件渲染完成后在更新数据
					this.setValues = this.pickerValues
				})
			},
			bindChange(e) {
				let value = e.detail.value.toString();
				this.list.forEach((item, index) => {
					if (value == index) {
						this.form.id = item.id;
						this.form.name = item.name
					}
				});
			},
			hiddeDatePicker() {
				this.$emit('input', false)
			},
			confirm1(e) {
				if (this.form.id == '' && this.list.length > 0) {
					this.form = {
						id: this.list[0].id,
						name: this.list[0].name
					}
				}
				this.hiddeDatePicker()
				this.$emit('recload', this.form);
			},
			// 搜索查询
			async searchChange(e) {
				// ，调模糊查询然后 把返回的结果传给this.list数组
				let findList = this.dataSource.filter(item => item.name.includes(e))
				this.list = findList
				if (e == '') {
					this.list = this.dataSource
				}
				this.reset()
			},
			reset() { //重置
				this.form = {
					id: '',
					name: ''
				}
			},
			clearSearch() { //清空搜索内容
				this.searchValue = ''
				this.list = this.dataSource
			}
		},
	}
</script>

<style lang="scss" scoped>
	.date-background {
		position: fixed;
		left: 0;
		top: 0;
		bottom: 0;
		width: 100%;
		height: 100%;
		z-index: 1111;
	}

	.date-gray-background {
		position: absolute;
		width: 100%;
		top: 0rpx;
		background: rgba(0, 0, 0, .5);
		height: calc(100% - 500rpx);
	}

	.date-container {
		position: absolute;
		width: 100%;
		height: 60%;
		overflow: hidden;
		background: #fff;
		bottom: 0;
		z-index: 1000;
	}

	.date-confirm {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		font-size: 34rpx;
		line-height: 100rpx;
		z-index: 2;
		// line-height: 70rpx;
		// color: var(--ThemeColor)
	}

	.pickViewColumn {
		height: 60%;
		/* margin-top: -300rpx; */
	}

	.indicator {
		height: 40rpx;
		/* border: 1rpx solid #E5E8E8; */
	}

	.pickerCancel {
		font-size: 30rpx;
		color: #606266;
		// margin-right: 30rpx;
		// padding: 16rpx;
		box-sizing: border-box;
		text-align: center;
		text-decoration: none;

		padding: 0rpx 8rpx;
	}

	.pickerConfirm {
		font-size: 30rpx;
		color: #2979ff;
		// margin-left: 30rpx;
		// padding: 16rpx;
		box-sizing: border-box;
		text-align: center;
		text-decoration: none;
		padding: 0rpx 8rpx;
	}

	.u-column-item {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		font-size: 30rpx;
		color: #303133;
		padding: 0 8rpx;
	}
</style>