/*全局状态*/
const tabbar = {

    /*状态值*/
    state: {
        tabBarData: {
            style: {
                "background": "#ffffff",
                "rowsNum": "4",
            },
            data: [],
        },
    },

    /*状态值转换*/
    getters: {

    },

    /*改变状态的方法 不可异步*/
    mutations: {
        SET_TAB_BAR(state, value) {
            state.tabBarData = value;
        }

    },

    /*可异步改变*/
    actions: {
        setTabbBar({ commit }, type) {
            commit('SET_TAB_BAR', type)
        }
    }
}
export default tabbar;
