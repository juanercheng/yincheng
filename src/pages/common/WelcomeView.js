import React, { Component } from 'react';
import {Image, ScrollView, StyleSheet, Text, Dimensions, TouchableOpacity, View, Animated} from 'react-native';
import SettingStyle from "../../js/SettingStyle";
import GuideView from './guideView'
let image1 = require('../../../images/start.png');
// let image2 = require('../../../images/home/weizhi.png');
// let image3 = require('../../../images/header/location.png');
const { width, height } = Dimensions.get('window');
export default class WelcomeView extends Component {

    constructor() {
        super();
    };

    //加载计时器
    componentDidMount(){
        this.timer=setTimeout(()=>{
            this.props.navigation.navigate('Home');
        },5000)
    }
    //卸载计时器
    componentWillUnmount(){
        this.timer&&clearTimeout(this.timer);
    }

    render() {
        return (
            <View style={styles.WelcomeContainer}>
                <Image source={image1}
                       style={styles.backgroundImage} />
                <Text style={styles.info}>只做一手单</Text>
                <Text style={styles.info}>每位客户只推给一位客户经理</Text>
                <TouchableOpacity
                    style={styles.btn}
                    onPress={() => {this.props.navigation.navigate('Home');}}>
                    <Text style={styles.btnText}>立即体验</Text>
                </TouchableOpacity>
            </View>
        );
    }

};
var styles = StyleSheet.create({
    WelcomeContainer: {
        width: width,
        height: height,
        backgroundColor:'#fff',
        flexDirection:"column",
        justifyContent:'center',
        alignItems:'center',
    },
    backgroundImage: {
        marginBottom:27
    },
    btn:{
        width:'74%',
        // height:40,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        marginTop:55,
        marginBottom:104,
        borderWidth:2,
        borderColor:'#54B1FF',
        borderRadius:10
    },
    btnText:{
        fontSize:18,
        color:'#54B1FF',
        paddingTop:11,
        paddingBottom:11
    },
    info:{
        color:'#C4CEDE',
        fontSize:18,
    }
});