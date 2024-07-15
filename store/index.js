import Vue from 'vue'
import Vuex from 'vuex'

import globalStyle from './modules/globalStyle'
import getters from './getters'
import tabBar from './modules/tabbar'
import express from './modules/express'

Vue.use(Vuex);//vue的插件机制

//Vuex.Store 构造器选项
const store = new Vuex.Store({
    modules: {
        globalStyle,
        tabBar,
		express
    },
    state: {},
    mutations: {},
    actions: {},
    getters
})
export default store
