import React, { Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    ViewPagerAndroid,
    Text,
    TouchableHighlight,
    ImageBackground
}from 'react-native';

export default class NoDataView extends Component {
    render() {
        return (
            <View style={{height:30,alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
                <Text style={{color:'#666',fontSize:12,marginTop:5,marginBottom:5,}}>
                    没有更多数据了
                </Text>
            </View>
        );
    }
}

module.exports = NoDataView;