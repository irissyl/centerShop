<template>
	<view class="store-container bg-white" >
		<view class="store-map">
			<map  :latitude="lat" :longitude="lng" :markers="covers">
			</map>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				lat:'',
				lng:'',
				covers:[]
			}
		},
		onLoad(e) {
      this.setGlobalColor()
			this.lat = e.lat;
			this.lng = e.lng;
			let obj={
				latitude: e.lat,
			    longitude:  e.lng
			}
			this.covers.push(obj);
		},
		methods: {
			
		}
	}
</script>

<style>

.store-container .store-map{ width: 750rpx; height:1500rpx;}
.store-container .store-map map{ width: 100%; height: 100%;}
</style>
