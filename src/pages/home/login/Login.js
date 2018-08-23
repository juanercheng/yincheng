import React, {Component} from 'react';
import {
    Alert,
    TextInput,
    View,
    Text,
    Platform,
    Image,
    Linking,
    FlatList,
    DeviceEventEmitter,
    TouchableOpacity,
    ViewPagerAndroid,
    ScrollView,
    ImageBackground,
    TouchableHighlight,
    StyleSheet,
    Modal
} from 'react-native';
import { NavigationActions } from 'react-navigation';

import {Toast, WhiteSpace, WingBlank, Button, InputItem} from 'antd-mobile-rn';
import Util from './../../../js/util';
import api from './../../../js/api';
import global from './../../../js/global';
import http from './../../../js/http';
import Http from './../../../js/HttpUtils';
import SettingStyle from './../../../js/SettingStyle';
import styles from './style';
import HeaderView from './../../common/HeaderView';
import JPushModule from 'jpush-react-native'
import GetSetStorage from '../../../js/GetSetStorage';
import  '../../../js/storage';

export default class LoginIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mobile: null,
            password: null,
        };
    }
    //componentDidMount 执行一次，在初始化render之前执行，如果在这个方法内调用setState，render()知道state发生变化，并且只执行一次
    componentDidMount() {
        console.log(Platform.OS)
        this.subscription = DeviceEventEmitter.addListener('userNameDidChange',(userName) =>{
            console.log(123)
        })
        JPushModule.addReceiveExtrasListener(map => {
            console.log('Got extra, key: hello, value: ' + map.hello)
        })
    }

    //在组件销毁的时候要将其移除
    componentWillUnmount() {

        this.subscription.remove();
    };

    //DES加密
    encryptByDES(message, key) {
        var CryptoJS = require("crypto-js");
        var keyHex = CryptoJS.enc.Utf8.parse(key);
        var encrypted = CryptoJS.DES.encrypt(message, keyHex, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.toString();
    }

    showToast = (tips) => Toast.info(tips);

    _login () {

        // const navigateAction = NavigationActions.navigate({
        //     routeName: 'Recharge',
        //     //
        //     // params: {},
        //     //
        //     // action: NavigationActions.navigate({ routeName: 'Recharge' }),
        // });
        // this.props.navigation.dispatch(navigateAction)


        const {mobile, password} = this.state;
        let data = {};
        data.mobile = mobile;
        data.password = password;
        if (mobile == null || !mobile) {
            return this.showToast('请输入手机号！');
        }
        if (!(/^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(mobile))) {
            return this.showToast('请输入正确的手机号！');
        }
        if (password == null || !password) {
            return this.showToast('请输入密码！');
        } else {
            
            data.password = encodeURIComponent(encodeURIComponent(this.encryptByDES(password, 'DES_KEY_PASSWORD')));
            this.fetchData(data);
        }
    }

    //登录接口
    fetchData(data) {
        console.log(data)
        let _this = this
        return Http.postNormal(api.login.login,data)
        .then(function (response) {
                console.log(response);
                if(response.code === 0){
                    _this.props.navigation.replace('Home');
                    var token = response.object.token
                    global.login.token = token
                    GetSetStorage.setStorageAsync('token',token)
                }else{
                    // storage.save({
                    //     key: 'token',  // 注意:请不要在key中使用_下划线符号!
                    //     data: response.object.token,
                    // });
                    _this.showToast(response.msg)
                }
            
        })
        .catch(function (error) {
                console.log(error);
        });
//         return fetch(Util.Path + api.login.login, {
//             method: 'post',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded',
//             },
//             body: 'mobile=' + dat
// a.mobile + '&password=' + data.password,
//         })
//         .then((response) => response.json())
//         .then((responseJson) => {
//             console.log(responseJson);
//             if (responseJson.code === 0) {
// //                        alert(responseJson.msg);
//                 let token = responseJson.object.token;
//                 let userId = responseJson.object.userid;
//                 let mobile = responseJson.object.mobile;
//                 console.log(token, '这里是登录过后的token');
//                 storage.save({
//                     key: 'token',  // 注意:请不要在key中使用_下划线符号!
//                     data: token,
//                 });
//                 storage.save({
//                     key: 'userId',  // 注意:请不要在key中使用_下划线符号!
//                     data: userId,
//                 });
//                 global.login.mobile = mobile;
//                 global.login.token = token;
//                 global.login.userId = userId;
//
//                 console.log(global.login.token);
//                 console.log(responseJson.msg);
//                 const navigation = this.props.navigation;
//                 navigation.navigate('Home');
//             }
//             if (responseJson.code === 500) {
//                 this.showToast(responseJson.msg);
//             }
//         })
//         .catch(function (err) {
//             console.log("Fetch错误:" + err);
//         });
    }
    _signUpOrForget = (name) => {
        const navigation = this.props.navigation;
        navigation.navigate(name);
    }
    _reset() {
        this.refs.scrollView.scrollTo({y: 0});
    }
    render() {
        return (
            <ScrollView ref='scrollView'
                        scrollEnabled={true}>
                <View style={styles.container}>
                    <Image source={require('./../../../../images/login/loginBg.png')}/>
                    <Image style={[styles.logo,Platform.OS === 'ios'?{marginTop:120}:{marginTop:100}]} source={require('./../../../../images/login/logo.png')}/>
                    <View style={Platform.OS == 'ios'?{position: 'absolute', top: 33}:{position: 'absolute', top: 13}}><Text
                        style={[SettingStyle.fontWeight, {color: '#fff', fontSize: 18, backgroundColor:'rgba(0,0,0,0)'}]}>登录</Text></View>
                    <View style={[styles.bg]}>
                        <View style={styles.textRow}>
                            <Image source={require('./../../../../images/login/phone.png')}/>
                            <View style={styles.left}>
                                <TextInput
                                    ref="textInput"
                                    placeholder="请输入手机号"
                                    maxLength={11}
                                    placeholderTextColor="#cfcfcf"
                                    keyboardType={'phone-pad'}
                                    underlineColorAndroid='transparent'
                                    style={styles.inputBox}
                                    onChangeText={(mobile) => this.setState({mobile})}
                                />
                            </View>
                        </View>
                        <View style={styles.textRow}>
                            <Image source={require('./../../../../images/login/password.png')}/>
                            <View style={styles.left}>
                                <TextInput
                                    ref="textInput"
                                    style={[styles.inputBox]}
                                    onBlur={this._reset.bind(this)}
                                    placeholder="请输入密码"
                                    maxLength={20}
                                    secureTextEntry={true}
                                    placeholderTextColor="#cfcfcf"
                                    underlineColorAndroid='transparent'
                                    onChangeText={(password) => this.setState({password})}
                                />
                            </View>
                        </View>
                        {/*<TouchableOpacity onPress={()=>this._login()} >*/}
                        {/*<View style={styles.login}>*/}
                        {/*<Text style={[SettingStyle.fontWeight,{color:'#fff',fontSize:18}]}>登录</Text>*/}
                        {/*</View>*/}
                        {/*</TouchableOpacity>*/}
                        <Button style={[styles.login, {marginTop: 47}]} onClick={() => this._login()}>
                            <Text style={[SettingStyle.fontWeight, {color: '#fff', fontSize: 18}]}>登录</Text>
                        </Button>
                        <View style={[SettingStyle.row, styles.other]}>
                            <Text style={[styles.otherText, {color: '#54b1ff'}]}
                                  onPress={() => this._signUpOrForget('signUp')}>快捷登录</Text>
                            <View style={styles.line}></View>
                            <Text style={[styles.otherText, {color: '#9b9b9b'}]}
                                  onPress={() => this._signUpOrForget('Forget')}>忘记密码</Text>
                        </View>
                        <View style={[SettingStyle.row, {justifyContent: 'center',paddingBottom:30},Platform.OS == 'ios'?{marginTop: 145}:{marginTop:60}]}>
                            <Text style={{color: '#9b9b9b', fontSize: 12}}>点击登录按钮表示您已同意寅成投资的</Text>
                            <Text style={{color: '#54b1ff', fontSize: 12}}
                                  onPress={() => this._signUpOrForget('AgreenMent')}>注册协议</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}


