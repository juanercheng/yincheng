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
    TouchableHighlight,
    StyleSheet,
    Modal
} from 'react-native';


import Util from './../../../js/util';
import api from './../../../js/api';
import global from './../../../js/global';
import http from './../../../js/http';
import Http from './../../../js/HttpUtils';
import SettingStyle from './../../../js/SettingStyle';
import styles from './style';
import LoginView from './../../common/LoginView';
import HeaderView from './../../common/HeaderView';
import GetSetStorage from '../../../js/GetSetStorage';
import {Toast, InputItem, Button} from 'antd-mobile-rn';

export default class signUp extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        tabBarVisible: false,
    });

    constructor(props) {
        super(props);
        this.state = {
            mobile: null,
            imageCode: null,
            imageCodeS: true,
            code: null,
            codeS: true,
            codeTime: 60,
            imageCodeTime: 60,
            imageOne: null,
            number: 1,
        };
    }

    componentDidMount() {
        let imageOne = Util.Path + 'login/captcha.jpg'
        this.setState({
            imageOne: imageOne
        })
    }

    goBack = () => {
        const {goBack, navigate} = this.props.navigation
        goBack()
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


    showToast = (tips) => Toast.info(tips, 2)

    //获取图形文字
    _imageCode() {
        this.setState({
            number: Math.floor(Math.random() * 10)
        })
    }

    // _imageText() {
    //     let data = {
    //         code: this.state.imageCode
    //     }
    //     let _this = this
    //     Http.postNormal(api.login.getImageCode, data)
    //         .then(function (response) {
    //             console.log(response);
    //             _this.showToast(response.msg)
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    // }

    _code() {
        const {mobile, imageCode} = this.state;
        let dataSingUp = {};
        dataSingUp.mobileEncrypt = mobile;
        console.log(dataSingUp)
        if (mobile == null || !mobile) {
            return this.showToast('请输入手机号！');
        }
        if (!(/^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(mobile))) {
            return this.showToast('请输入正确的手机号！')
        }
        else {
            // 密码DES加密
            dataSingUp.mobileEncrypt = encodeURIComponent(encodeURIComponent(this.encryptByDES(mobile, 'mdi1f84h60gj68e3hdkgt74gg13``》《《《《*&&*****./,..,y')));
            this.fetchImageCode(dataSingUp);
        }
    }

    //获取验证码
    fetchImageCode(data) {
        console.log(data);
        let _this = this
        return Http.postNormal(api.login.getMobileCode, data)
            .then(function (response) {
                console.log(response);
                if (response.code == 0) {
                    _this.showToast('验证码已发送请注意查收');
                    _this.setState({
                        codeS: false,
                    })
                    let timer = setInterval(function () {
                        if (_this.state.codeTime === 0) {
                            clearInterval(timer);
                            _this.setState({
                                codeS: true,
                                codeTime: 60
                            })
                        } else {
                            _this.setState({
                                codeTime: _this.state.codeTime - 1
                            })
                        }
                    }, 1000);

                } else {
                    _this.showToast(response.msg)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //快捷登录
    _login() {
        const {mobile, code, imageCode} = this.state;
        let dataSingUp = {};
        dataSingUp.mobile = mobile;
        dataSingUp.msgCode = code;
        dataSingUp.imageCode = imageCode;

        if (mobile == null || !mobile) {
            return this.showToast('请输入手机号！');
        }
        if (!(/^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(mobile))) {
            return this.showToast('请输入正确的手机号！')
        }
        if (imageCode == null || !imageCode) {
            return this.showToast('请输入图形文字！');
        }
        if (code == null || !code) {
            return this.showToast('请输入验证码！');
        } else {
            //密码DES加密
            dataSingUp.password = encodeURIComponent(encodeURIComponent(this.encryptByDES(this.state.password, 'DES_KEY_PASSWORD')));
            this.fetchData(dataSingUp);
        }
    }

    //快捷登录接口
    fetchData(data) {
        console.log(data)
        let _this = this
        return Http.postNormal(api.login.register, data)
            .then(function (response) {
                console.log(response);
                if (response.code === 500) {
                    _this.showToast(response.msg);
                }else{
                    // storage.save({
                    //     key: 'token',  // 注意:请不要在key中使用_下划线符号!
                    //     data: response.object.token,
                    // });
                    var token = response.object.token
                    global.login.token = token
                    GetSetStorage.setStorageAsync('token',token)
                    _this.props.navigation.replace('Home');
                }
                // _this.showToast(response.msg)
            })
            .catch(function (error) {
                console.log(error);
            });
        // fetch(Util.Path + api.login.login, {
        //     method: 'post',
        //     headers: {
        //         'Content-Type': 'application/x-www-form-urlencoded',
        //     },
        //     body: 'mobile=' + data.mobile + '&password=' + data.password,
        //
        // })
        //     .then((response) => response.json())
        //     .then((responseJson) => {
        //         console.log(responseJson);
        //         if (responseJson.code === 0) {
        //             //                        alert(responseJson.msg);
        //             let token = responseJson.object.token;
        //             let userId = responseJson.object.userid;
        //             let mobile = responseJson.object.mobile;
        //             console.log(token, '这里是登录过后的token');
        //             storage.save({
        //                 key: 'token',  // 注意:请不要在key中使用_下划线符号!
        //                 data: token,
        //             });
        //             storage.save({
        //                 key: 'userId',  // 注意:请不要在key中使用_下划线符号!
        //                 data: userId,
        //             });
        //             global.login.mobile = mobile;
        //             global.login.token = token;
        //             global.login.userId = userId;
        //
        //             console.log(global.login.token);
        //             console.log(responseJson.msg);
        //             const navigation = this.props.navigation;
        //             navigation.navigate('Home');
        //         }

        //     })
        //     .catch(function (err) {
        //         console.log("Fetch错误:" + err);
        //     });
    }

    _pages = (name) => {
        const {navigate} = this.props.navigation;
        navigate(name);
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Image source={require('./../../../../images/login/loginBg.png')}/>
                    <Image style={styles.logo} source={require('./../../../../images/login/logo.png')}/>
                    <View style={Platform.OS == 'ios'?{position: 'absolute', top: 33}:{position: 'absolute', top: 13}}>
                        <Text style={[SettingStyle.fontWeight, {color: '#fff', fontSize: 18,backgroundColor:'rgba(0,0,0,0)'}]}>快捷登录</Text>
                    </View>
                    <TouchableOpacity onPress={() => this.goBack()} style={[{position: 'absolute', left: 15},Platform.OS == 'ios'?{top: 33}:{top: 13}]}>
                        <Image source={require('./../../../../images/header/go-back-white.png')}/>
                    </TouchableOpacity>
                    <View style={styles.bg}>
                        <View style={styles.textRow}>
                            <Image style={styles.icon} source={require('./../../../../images/login/phone.png')}/>
                            <View style={styles.left}>
                                <TextInput
                                    placeholder="请输入手机号"
                                    placeholderTextColor="#cfcfcf"
                                    keyboardType={'numeric'}
                                    maxLength={11}
                                    multiline={true}
                                    underlineColorAndroid='transparent'
                                    style={styles.inputBox}
                                    onChangeText={(mobile) => this.setState({mobile})}
                                />
                            </View>
                        </View>
                        <View style={styles.textRow}>
                            <Image style={styles.icon}
                                   source={require('./../../../../images/login/imageCode.png')}/>
                            <View style={styles.left}>
                                <TextInput
                                    placeholder="请输入图中文字"
                                    maxLength={5}
                                    placeholderTextColor="#cfcfcf"
                                    keyboardType={'phone-pad'}
                                    // onBlur={() => this._imageText()}
                                    underlineColorAndroid='transparent'
                                    style={styles.inputBox}
                                    onChangeText={(imageCode) => this.setState({imageCode})}
                                />
                                <TouchableOpacity onPress={() => this._imageCode()} style={{width: 85, height: 26}}>
                                    <Image source={{uri: this.state.imageOne + "?" + this.state.number}}
                                           style={{width: '100%', height: '100%'}}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.textRow}>
                            <Image style={styles.icon}
                                   source={require('./../../../../images/login/code.png')}/>
                            <View style={styles.left}>
                                <TextInput
                                    placeholder="请输入验证码"
                                    maxLength={6}
                                    onChangeText={(code) => this.setState({code})}
                                    placeholderTextColor="#cfcfcf"
                                    underlineColorAndroid='transparent'
                                    style={styles.inputBox}
                                />
                                {
                                    this.state.codeS ?
                                        <TouchableOpacity onPress={() => this._code()} style={styles.code}>
                                            <Text style={{fontSize: 14, color: '#54b1ff'}}>获取验证码</Text>
                                        </TouchableOpacity>
                                        :
                                        <TouchableOpacity onPress={() => this._code()}
                                                          style={[styles.code, {borderColor: '#cccccc'}]}>
                                            <Text style={{fontSize: 14, color: '#cccccc'}}>{this.state.codeTime}S</Text>
                                        </TouchableOpacity>
                                }
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

                        <View style={[SettingStyle.row, { justifyContent: 'center', marginBottom: 30},Platform.OS == 'ios'?{marginTop: 79}:{marginTop:50}]}>
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

