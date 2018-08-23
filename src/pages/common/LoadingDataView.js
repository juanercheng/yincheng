import React, { Component } from 'react';
import {
    View,
    Image,
    Text,
    ViewPagerAndroid,
    StyleSheet,
    TouchableHighlight,
    ImageBackground
}from 'react-native';

export default class LoadingDataView extends Component {

    render() {
        return (
            <View style={{height:30,alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
                <Text style={{color:'#666',fontSize:12,marginTop:5,marginBottom:5,}}>
                    正在加载数据...
                </Text>
            </View>
        );
    }
}

module.exports = LoadingDataView;