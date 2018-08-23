import React, { Component } from 'react';
import {
    View,
    Image,
    TouchableOpacity,
    ViewPagerAndroid,
    Platform,
    Text,
    TouchableHighlight,
    ImageBackground
}from 'react-native';
import SettingStyle from '../../js/SettingStyle'
export default class HeaderView extends Component {
    constructor(props){
        super(props);
    }

    componentDidMount(){

    }

    render() {
        return (
            <ImageBackground style={Platform.OS === 'ios'?SettingStyle.headerbgIos:SettingStyle.headerbg}
                             source={this.props.hasBg?require('../../../images/header/headerbg.png'):null} resizeMode='cover'>
                <View searchBar rounded style={[SettingStyle.header,!this.props.hasBg?SettingStyle.headerWrite:{justifyContent:'center'}]}>
                    <TouchableOpacity transparent style={SettingStyle.back} onPress={()=>this.props.goBack()}>
                        <Image style={SettingStyle.headerBack} source={this.props.hasBg?require('../../../images/header/go-back-white.png'):require('../../../images/header/fanhui.png')} />
                    </TouchableOpacity>
                    <Text style={[this.props.hasBg?SettingStyle.headerText:SettingStyle.headerTextBlack,{ backgroundColor:'rgba(0,0,0,0)'}]}>{this.props.title}</Text>
                </View>
            </ImageBackground>

        );
    }
}

module.exports = HeaderView;