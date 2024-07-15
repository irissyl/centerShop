class Storage {

  /**
    * set 存储方法
    * @ param {String}     key 键
    * @ param {String}     value 值，
    * @ param {String}     expired 过期时间，以毫秒为单位，非必须
    */
  set(key, value, expired) {
    if (this.__isString(value)) {
      uni.setStorageSync(key, value)
    } else {
      uni.setStorageSync(key, JSON.stringify(value))
    }
    if (expired) {
      uni.setStorageSync(`${key}__expires__`, Date.now() + expired)
    }
    return value
  }

  /**
    * get 获取方法
    * @ param {String}     key 键
    * @ param {String}     expired 存储时为非必须字段，所以有可能取不到，默认为 Date.now+1
    */
  get(key) {
    const source = uni.getStorageSync(key)
    const expired = uni.getStorageSync(`${key}__expires__`) || Date.now + 1
    if (Date.now() >= expired) {
      this.remove(key)
      return
    }
    return (source && this.__isJSONStr(source)) ? JSON.parse(source) : source
  }

  remove(key) {
    const source = uni.getStorageSync(key)
    if (source) {
      uni.removeStorageSync(key)
    }
    uni.removeStorageSync(`${key}__expires__`)
    return source
  }

  /**
   *  是否为json字符串
   * @param str
   * @returns {boolean}
   * @private
   */
  __isJSONStr(str) {
    if (this.__isString(str)) {
      try {
        let obj = JSON.parse(str)
        return !!(typeof obj == 'object' && obj)
      } catch (e) {
        return false
      }
    }
    return false
  }

  /**
   * 是否为字符串
   * @param str
   * @returns {boolean}
   */
  __isString(str) {
    return typeof str === 'string' || str instanceof String;
  }

}

export default Storage