const globalStyle = {
    state: {
        // #2b9939  #EE1414
        titleBackgroundColor: '#EE1414',
        titleTextColor: '#ffffff',
		mainTitleTextColor: '#000',
		secondBackgroundColor:"#1f222a",
		mainGreyTextColor:"#75777b",
		mainWhiteTextColor:"#fff",
		tabbarSelectColor:"#000",
		tabbarColor:"#ababab",
        isDefault: false,
        isReverseColor: false,
        reverseColor: '',
		buttonOne:"#EE1414",
		buttonTwo:"#EE1414",
		buttonThree:"#EE1414",
		buttonOneColor:"#ffffff",
		buttonTwoColor:"#ffffff",
		buttonThreeColor:"#ffffff",
    },
    mutations: {
        SET_TITLE_BACKGROUND_COLOR: (state, type) => {
            state.titleBackgroundColor = type
        },
        SET_IS_DEFAULT: (state, type) => {
            state.isDefault = type
        },
        SET_IS_REVERSE_COLOR: (state, type) => {
            state.isReverseColor = type
        },
        SET_REVERSE_COLOR: (state, type) => {
            state.reverseColor = type
        },
		SET_BUTTON_ONE_COLOR: (state, type) => {
            state.buttonOne = type
        },
		SET_BUTTON_TWO_COLOR: (state, type) => {
		    state.buttonTwo = type
		},
		SET_BUTTON_THREE_COLOR: (state, type) => {
		    state.buttonThree = type
		},
		SET_BUTTON_ONE_COLOR_COLOR: (state, type) => {
		    state.buttonOneColor = type
		},
		SET_BUTTON_TWO_COLOR_COLOR: (state, type) => {
			
		    state.buttonTwoColor = type
		},
		SET_BUTTON_THREE_COLOR_COLOR: (state, type) => {
		    state.buttonThreeColor = type
		},
        SET_TITLE_TEXT_COLOR: (state, type) => {
            let colors = '#000000';
            if (type === 'white') {
                //字母要小写
                colors = '#ffffff'
            }
            state.titleTextColor = colors
        },
		SET_MAIN_TITLE_TEXT_COLOR: (state, type) => {
            state.mainTitleTextColor = type
        },
		
		SET_SECOND_BACKGROUND_COLOR: (state, type) => {
		    state.secondBackgroundColor = type
		},
		SET_MAIN_GREY_TEXT_COLOR: (state, type) => {
		    state.mainGreyTextColor = type
		},
		SET_MAIN_WHITE_TEXT_COLOR: (state, type) => {
		    state.mainWhiteTextColor = type
		},
		SET_TABBAR_SELECT_COLOR:(state, type) => {
		    state.tabbarSelectColor = type
		},SET_TABBAR_COLOR:(state, type) => {
		    state.tabbarColor = type
		},
		
    },
    actions: {
        setTitleBackgroundColor ({ commit }, type) {
            commit('SET_TITLE_BACKGROUND_COLOR', type)
        },
        setTitleTextColor ({ commit }, type) {
            commit('SET_TITLE_TEXT_COLOR', type)
        },
		setMainTitleTextColor ({ commit }, type) {
		    commit('SET_MAIN_TITLE_TEXT_COLOR', type)
		},
		setSecondBackgroundColor ({ commit }, type) {
		    commit('SET_SECOND_BACKGROUND_COLOR', type)
		},
		setMainGreyTextColor ({ commit }, type) {
		    commit('SET_MAIN_GREY_TEXT_COLOR', type)
		},
		setMainWhiteTextColor ({ commit }, type) {
		    commit('SET_MAIN_WHITE_TEXT_COLOR', type)
		},
        setIsDefault ({ commit }, type) {
            commit('SET_IS_DEFAULT', type)
        },
        setIsReverseColor ({ commit }, type) {
            commit('SET_IS_REVERSE_COLOR', type)
        },
        setReverseColor ({ commit }, type) {
            commit('SET_REVERSE_COLOR', type)
        },
		//设置三个预设按钮
		setButtonOne ({ commit }, type) {
		    commit('SET_BUTTON_ONE_COLOR', type)
		},
		setButtonTwo ({ commit }, type) {
		    commit('SET_BUTTON_TWO_COLOR', type)
		},
		setButtonThree ({ commit }, type) {
		    commit('SET_BUTTON_THREE_COLOR', type)
		},
		setButtonOneColor ({ commit }, type) {
		    commit('SET_BUTTON_ONE_COLOR_COLOR', type)
		},
		setButtonTwoColor ({ commit }, type) {
		    commit('SET_BUTTON_TWO_COLOR_COLOR', type)
		},
		setButtonThreeColor ({ commit }, type) {
		    commit('SET_BUTTON_THREE_COLOR_COLOR', type)
		},
		setTabbarSelectColor ({ commit }, type) {
		    commit('SET_TABBAR_SELECT_COLOR', type)
		},
		setTabbarColor ({ commit }, type) {
		    commit('SET_TABBAR_COLOR', type)
		},
		
    }
}

export default globalStyle
