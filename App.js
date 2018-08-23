/**
 * Created by ChengJuan by 18-07-24
 */
import React, { Component } from 'react';
import {
    AppRegistry, NetInfo
} from 'react-native';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    AsyncStorage
} from 'react-native';
import {StackNavigator,TabNavigator,TabBarBottom} from 'react-navigation';
import Home from './src/pages/navigation/Home';
import Mine from './src/pages/navigation/Mine';
import Classify from './src/pages/navigation/Classify';

class TabBarItem extends Component {
    render() {
        return(
            <Image source={ this.props.focused ? this.props.selectedImage : this.props.normalImage }/>
        )
    }
}
const Tab = TabNavigator(
    {
        Home:{
            screen:Home,
            navigationOptions:{
                tabBarLabel:'首页',
                tabBarIcon:({focused,tintColor}) => (
                <TabBarItem
                    tintColor={tintColor}
                    focused={focused}
                    normalImage={require('./images/tabs/weidianjishouye.png')}
                    selectedImage={require('./images/tabs/shouye.png')}/>),
            },
        },
        Classify:{
            screen:Classify,
                navigationOptions:{
                    tabBarLabel:'客户',
                    tabBarIcon:({focused,tintColor}) => (
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        normalImage={require('./images/tabs/miaosha.png')}
                        selectedImage={require('./images/tabs/tuijian.png')}/>
                    ),
                },
        },
        Mine:{
            screen:Mine,
                navigationOptions:{
                tabBarLabel:'我的',
                tabBarIcon:({focused,tintColor}) => (
                    <TabBarItem
                        tintColor={tintColor}
                        focused={focused}
                        normalImage={require('./images/tabs/gerenzhongxin.png')}
                        selectedImage={require('./images/tabs/gerenzhongxina.png')}/>
                )
            },
        },
    },
    {
        tabBarComponent:TabBarBottom,
        tabBarPosition:'bottom',
        swipeEnabled:false,
        animationEnabled:false,
        lazy:true,
        tabBarOptions:{
            activeTintColor:'#4A4A4A',
            inactiveTintColor:'#9B9B9B',
            style:{backgroundColor:'#ffffff', overflow:"hidden"},
            labelStyle: {
                fontSize: 10, // 文字大小
                fontWeight:'500'
            },
        }

    }
);

AppRegistry.registerComponent('yincheng', () => Tab);
