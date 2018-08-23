/**
 * Created by ChengJuan by 18-03-15
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
import MineIndex from './../mine/MineIndex';  //个人中心
import Recharge from './../mine/recharge/Recharge';  //立即充值
import Credit from './../mine/credit/Credit';  //信贷经理认证
import Account from './../mine/account/Account';  //我的账户
import Forget from './../home/login/forget';  //设置密码
import Set from './../mine/set/Set';  //设置
import FeedBack from './../mine/set/FeedBack';  //意见反馈
import SoftWare from './../mine/set/SoftWare';  //软件更新
import PushSet from './../mine/set/PushSet';  //推送设置
import customerDetails from './../classify/customerDetails'  //客户详情，充值之后返回的时候需要
import LoginIndex from './../home/login/Login';  //获取用户详情token失效 返回
const MinePages = StackNavigator({
    MineIndex: {screen: MineIndex,navigationOptions: {header: null},},
    Recharge: {screen: Recharge,navigationOptions: {header: null,tabBarVisible: false},},
    Credit: {screen: Credit,navigationOptions: {header: null,tabBarVisible: false},},
    Account: {screen: Account,navigationOptions: {header: null,tabBarVisible: false},},
    Forget: {screen: Forget,navigationOptions: {header: null,tabBarVisible: false},},
    Set: {screen: Set,navigationOptions: {header: null,tabBarVisible: false},},
    FeedBack: {screen: FeedBack,navigationOptions: {header: null,tabBarVisible: false},},
    SoftWare: {screen: SoftWare,navigationOptions: {header: null,tabBarVisible: false},},
    PushSet: {screen: PushSet,navigationOptions: {header: null,tabBarVisible: false},},
    customerDetails: {screen: customerDetails,navigationOptions: {header: null,tabBarVisible: false},},
    LoginIndex: {screen: LoginIndex,navigationOptions: {header: null,tabBarVisible: false},}
},
{
    headerMode: 'float',
    transitionConfig:()=>({
        screenInterpolator:CardStackStyleInterpolator.forHorizontal,
    })
},{
    initialRouteName:"MineIndex"
});
export default MinePages;