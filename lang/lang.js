//替换文字
	export const init = (Vue) => {
		/* 
		系统层的文字
		 */
		Vue.prototype.$nws = function(words) {
				var new_word = words;
				var translation_language = uni.getStorageSync("system_language")[words]
				if(translation_language){
					new_word = translation_language;
				}else{
					new_word = words;
				}
			
				return new_word;
		
			}
		
	/* 
	普通文字 
	 */
	Vue.prototype.$nw = function(words) {
			var new_word = words;
			var translation_language = uni.getStorageSync("translation_language")[words]
			if(translation_language){
				new_word = translation_language;
			}else{
				new_word = words;
			}
			return new_word;
	
		}


	}

	module.exports = {
		init
	}
