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
    Modal
} from 'react-native';

import Util from './../../../js/util';
import api from './../../../js/api';
import global from './../../../js/global';
import http from './../../../js/http';
import SettingStyle from './../../../js/SettingStyle';
import styles from './style';
import LoginView from './../../common/LoginView';
import HeaderView from './../../common/HeaderView';
import {Toast,InputItem,Button} from 'antd-mobile-rn';
import Http from "../../../js/HttpUtils";

export default class Forget extends Component {
    static navigationOptions = ({navigation}) => ({
        header: null,
        tabBarVisible: false,
    });

    constructor(props) {
        super(props);
        this.state = {
            mobile: null,
            password: null,
            newPassword: null,
            code: null,
            codeS: true,
            imageCodeS:true,
            codeTime: 60,
            imageOne: Util.Path + 'login/captcha.jpg',
            imageCode: null,
            confirmNewPassword:null,
            type:true,//type == true 为忘记密码反之为设置密码
            number:1
        }
    }
    componentDidMount() {
        if(this.props.navigation.state.params !== undefined){
            this.setState({
                type:this.props.navigation.state.params.type
            })
        }else{
            this.setState({
                type:true
            })
        }
    }
    componentWillUnmount() {
        // 移除
        DeviceEventEmitter.emit('userNameDidChange', '通知来了');
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

    showToast = (tips) => Toast.info(tips)
    //获取图形文字
    _imageCode() {
        this.setState({
            number: Math.floor(Math.random() * 10)
        })
    }

    //获取验证码
    _code = () => {
        const {mobile} = this.state;
        let dataSingUp = {};
        dataSingUp.mobileEncrypt = mobile;
        console.log(dataSingUp)
        if (mobile == null || !mobile) {
            return this.showToast('请输入手机号！');
        }
        if (!(/^0?(13[0-9]|14[5-9]|15[012356789]|166|17[0-8]|18[0-9]|19[8-9])[0-9]{8}$/.test(mobile))) {
            return this.showToast('请输入正确的手机号！')
        }else {
            // 密码DES加密
            dataSingUp.mobileEncrypt = encodeURIComponent(encodeURIComponent(this.encryptByDES(mobile, 'mdi1f84h60gj68e3hdkgt74gg13``》《《《《*&&*****./,..,y')));
            this.fetchCode(dataSingUp);
        }
    }

    //手机验证码接口
    fetchCode(data) {
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

    _login = () => {
        // this.props.navigation.popToTop('LoginIndex');
        const {mobile, newPassword, code, imageCode,confirmNewPassword} = this.state;
        let dataForget = {};
        dataForget.mobile = mobile;
        dataForget.imgageCode = imageCode;
        dataForget.msgCode = code;
        dataForget.newPassword = newPassword;
        if (mobile == null || !mobile) {
            return this.showToast('手机号码不能为空！');
        }
        if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(mobile))) {
            return this.showToast('请输入正确的手机号码！');
        }
        if (imageCode == null || !imageCode){
            return this.showToast('请输入图中文字！');
        }
        if (code == null || !code) {
            return this.showToast('请输入验证码！');
        }
        if (newPassword == null || !newPassword) {
            return this.showToast('请输入新密码！');
        }
        if(this.state.type){
            if (confirmNewPassword == null || !confirmNewPassword) {
                return this.showToast('请确认新密码！');
            }
            if (newPassword !== confirmNewPassword) {
                return this.showToast('两次密码不一致！');
            }
        }
        //密码DES加密
        dataForget.newPassword = encodeURIComponent(this.encryptByDES(this.state.newPassword, 'DES_KEY_PASSWORD'));
        this.fetchSignUp(dataForget);
    }

    //忘记密码接口
    fetchSignUp(data) {
        let _this = this
        return Http.postNormal(api.login.forget, data)
            .then(function (response) {
                console.log(response);
                if (response.code === 500) {
                    _this.showToast(response.msg);
                }else{
                    _this.props.navigation.replace('LoginIndex');
                }
                // _this.showToast(response.msg)
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    render() {
        return (
                <View style={styles.forget}>
                    {
                        this.state.type?
                            <HeaderView
                                title='忘记密码'
                                hasBg='true'
                                goBack={() => {
                                    this.goBack()
                                }}/>:
                            <HeaderView
                                title='设置密码'
                                hasBg='true'
                                goBack={() => {
                                    this.goBack()
                                }}/>
                    }
                    <ScrollView>

                    <View style={[{paddingTop:69,paddingLeft:5,paddingRight:5,backgroundColor:'#fff',height:'100%'}]}>
                        <View style={styles.textRow}>
                            <Image style={styles.icon}
                                   source={require('./../../../../images/login/phone.png')}/>
                            <View style={styles.left}>
                                <TextInput
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
                            <Image style={styles.icon}
                                   source={require('./../../../../images/login/imageCode.png')}/>
                            <View style={styles.left}>
                                <TextInput
                                    placeholder="请输入图中文字"
                                    maxLength={5}
                                    placeholderTextColor="#cfcfcf"
                                    keyboardType={'phone-pad'}
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
                        <View style={styles.textRow}>
                            <Image style={styles.icon}
                                   source={require('./../../../../images/login/password.png')}/>
                            <View style={styles.left}>
                                <TextInput
                                    placeholder="请输入新密码"
                                    maxLength={20}
                                    placeholderTextColor="#cfcfcf"
                                    underlineColorAndroid='transparent'
                                    secureTextEntry={true}
                                    style={styles.inputBox}
                                    onChangeText={(newPassword) => this.setState({newPassword})}
                                />
                            </View>
                        </View>
                        {
                            this.state.type ?
                                <View style={styles.textRow}>
                                    <Image style={styles.icon}
                                           source={require('./../../../../images/login/password.png')}/>
                                    <View style={styles.left}>
                                        <TextInput
                                            placeholder="请确认新密码"
                                            maxLength={20}
                                            placeholderTextColor="#cfcfcf"
                                            underlineColorAndroid='transparent'
                                            secureTextEntry={true}
                                            style={styles.inputBox}
                                            onChangeText={(confirmNewPassword) => this.setState({confirmNewPassword})}
                                        />
                                    </View>
                                </View>:null

                        }

                        {/*<TouchableOpacity onPress={()=>this._login()}>*/}
                        {/*<View style={{flexDirection: 'row',backgroundColor:'#54b1ff'}}>*/}
                        {/*<Text style={[SettingStyle.fontWeight,{color:'#000',fontSize:18}]}>修改密码</Text>*/}
                        {/*</View>*/}
                        <Button style={[styles.login,{marginTop:50}]} onClick={()=>this._login()}>
                            <Text style={[SettingStyle.fontWeight,{color:'#fff',fontSize:18}]}>修改密码</Text>
                        </Button>
                        {/*</TouchableOpacity>*/}
                    </View>
                    </ScrollView>
                </View>
        );
    }
}

