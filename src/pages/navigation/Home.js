/**
 * Created by ChengJuan by 18-07-24
 */
import React from 'react';
import {
    AppRegistry,
    View,
    Text,
    StyleSheet,
    Button,
    ScrollableTab,
    TouchableHighlight,
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import HomePage from './../home/HomeContent';
import LoginIndex from './../home/login/Login';
import signUp from './../home/login/signUp';
import Forget from './../home/login/forget';
import AgreenMent from './../home/login/agreenment';
import locationCity from './../home/location/locationCity'
import locationProvince from './../home/location/locationProvince'
import customerDetails from './../classify/customerDetails'
import news from './../home/news/news'
import newsDetails from "../home/news/newsDetails";
import Recharge from './../mine/recharge/Recharge';  //立即充值
import WelcomeView from './../common/WelcomeView'
import SplashView from './../common/splashView' //启动页
import GuideView from "../common/guideView";   //引导页
import MineIndex from './../mine/MineIndex';  //个人中心-忘记密码 返回
const HomePages = StackNavigator({

    Home: {screen: HomePage,navigationOptions: {header: null}},
    LoginIndex: {
        screen: LoginIndex,
        navigationOptions: {
            header: null,
            tabBarVisible: false
        },
    },

    // SplashView:{
    //     screen:SplashView,
    //     navigationOptions: {
    //         header: null,
    //         tabBarVisible: false
    //     },
    // },
    // WelcomeView:{
    //     screen:WelcomeView,
    //     navigationOptions: {
    //         header: null,
    //         tabBarVisible: false
    //     },
    // },
    Forget: {screen: Forget,navigationOptions: {header: null,tabBarVisible: false},},
    GuideView: {
        screen: GuideView,
        navigationOptions: {
            header: null,
            tabBarVisible: false
        },
    },
    signUp: {screen: signUp,navigationOptions: {header: null,tabBarVisible: false},},
    AgreenMent: {screen: AgreenMent},
    locationCity: {screen: locationCity},
    locationProvince: {screen: locationProvince,navigationOptions: {header: null,tabBarVisible: false},},
    customerDetails: {screen: customerDetails,navigationOptions: {header: null,tabBarVisible: false},},
    news:{screen: news,navigationOptions: {header: null,tabBarVisible: false},},
    newsDetails:{screen:newsDetails,navigationOptions: {header: null,tabBarVisible: false},},
    Recharge: {screen: Recharge},
    MineIndex: {screen: MineIndex }
}, {
    headerMode: 'float',
    transitionConfig: () => ({
        screenInterpolator: CardStackStyleInterpolator.forHorizontal,
    })
}, {
    initialRouteName: "Home"
});
export default HomePages;