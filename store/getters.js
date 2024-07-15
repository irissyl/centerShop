const getters = {
    titleBackgroundColor: state => state.globalStyle.titleBackgroundColor,
    titleTextColor: state => state.globalStyle.titleTextColor,
	mainTitleTextColor: state => state.globalStyle.mainTitleTextColor,
	secondBackgroundColor: state => state.globalStyle.secondBackgroundColor,
	mainGreyTextColor: state => state.globalStyle.mainGreyTextColor,
	mainWhiteTextColor: state => state.globalStyle.mainWhiteTextColor,
	tabbarSelectColor: state => state.globalStyle.tabbarSelectColor,
	tabbarColor: state => state.globalStyle.tabbarColor,
    isDefault: state => state.globalStyle.isDefault,
    isReverseColor: state => state.globalStyle.isReverseColor,
    reverseColor: state => state.globalStyle.reverseColor,
    tabBarX: state => state.tabBar.tabBarData,
	buttonOne: state => state.globalStyle.buttonOne,
	buttonTwo: state => state.globalStyle.buttonTwo,
	buttonThree: state => state.globalStyle.buttonThree,
	buttonOneColor: state => state.globalStyle.buttonOneColor,
	buttonTwoColor: state => state.globalStyle.buttonTwoColor,
	buttonThreeColor: state => state.globalStyle.buttonThreeColor,
	state_ex: state => state.express.state_ex,
	state_list: state => state.express.state_list,
}

export default getters
