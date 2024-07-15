<template>
	<view>
		<view v-if="permissionShow" class="permission-tips">
			<view class="permission-title">
				相机存储权限使用说明
			</view>
			<view class="permission-content">
				“万商联营”想使用您的相机、相册、存储，用于帮助您后续使用上传或保存照片视频等功能。
			</view>
		</view>
		<u-upload ref="uUpload" :max-count="maxCount" :upload-text="uploadText" :toJSON="true" @on-success="success"
			@on-remove="remove" @on-change="change" @on-error="error" :action="action" name="iFile" :form-data="params"
			:file-list="fileList"></u-upload>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import {
		nextTick
	} from "vue";
	export default {
		name: "UploadFile",
		data() {
			return {
				fileList: [],
				permissionShow: true
			}
		},
		props: {
			maxCount: {
				type: Number,
				default: 1
			},
			uploadText: {
				type: String,
				default: '添加图片'
			},
			img: {
				type: String,
				default: ''
			},
			imgs: {
				type: Array,
				default: () => {
					return []
				}
			},
			is_auth: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			'img': {
				handler(n, o) {
					console.log(n, o, 123);

					// if (!o) {
					// 	this.fileList = []
					// 	this.fileList.push({
					// 		url: n
					// 	})
					// }
				}
			},
		},
		data() {
			return {
				action: this.websiteUrl + 'index.php/api/file.image/upload',
				fileList: [],
				params: {
					token: uni.getStorageSync('token'),
					app_id: this.getAppId(),
					utype: 'avatar'
				}
			};
		},
		methods: {
			setFileList(imgs) {
				for (let i = 0; i < imgs.length; i++) {
					this.fileList.push({
						url: imgs[i]
					})
				}
			},
			change(e) {
				this.$emit('change', e)
			},
			error(e) {
				console.log(e, 123);
			},
			success(e) {
				let files = [];
				// 通过filter，筛选出上传进度为100的文件(因为某些上传失败的文件，进度值不为100，这个是可选的操作)
				files = this.$refs.uUpload.lists.filter(val => {
					return val.progress == 100;
				})
				// 如果您不需要进行太多的处理，直接如下即可
				// files = this.$refs.uUpload.lists;
				if (e.code == 1) {
					this.$emit('success', e, files)
				} else {
					this.$refs.uToast.show({
						title: e.msg || '上传失败，请稍后再试',
						type: 'error',
					})
				}
			},
			remove(e) {
				console.log('remove--->', e);
				this.$emit('remove', e)
			}
		},
		mounted() {},
		created() {
			if (this.img) {
				this.fileList.push({
					url: this.img
				})
			}
			console.log(this.action, this.websiteUrl + 'index.php/api/file.image/upload', 1222222);
		},
		onLoad() {

			// this.params = {
			// 	token: uni.getStorageSync('token'),
			// 	app_id: self.getAppId()
			// };
		}
	}
</script>

<style lang="scss">
	/deep/ .u-add-tips {
		font-size: 24rpx;
		color: #999999;
	}

	/deep/ .u-iconfont {
		color: #999999;
	}
</style>