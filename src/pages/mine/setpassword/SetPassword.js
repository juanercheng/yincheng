/**
 * Created by Ld on 2018/8/1.
 */

import React, { Component } from 'react';
import {
    Alert,
    TextInput,
    View,
    Platform,
    Image,
    Linking,
    FlatList,
    DeviceEventEmitter,
    TouchableOpacity,
    ViewPagerAndroid,
    ScrollView,
    TouchableHighlight,
    Text
} from 'react-native';
import { Toast,WhiteSpace, WingBlank, InputItem } from 'antd-mobile-rn';

import styles from './SetPasswordStyle';

import api from './../../../js/api';
import global from './../../../js/global';
import Http from './../../../js/HttpUtils';
import ErrorView from './../../common/ErrorView';
import LoginView from './../../common/LoginView';
import HeaderView from './../../common/HeaderView';

import SettingStyle from './../../../js/SettingStyle';
import ImagePicker from 'react-native-image-picker';

export default class SetPassword extends Component {
    constructor(props) {
         super(props);
         this.state = {
             loading: false,
             error: false,
             mobile: null,
             password: null,
             code: null,
             codeS: true,
             codeTime: 60,
         }
    }

    goBack = () => {
        const { goBack,navigate } = this.props.navigation
        goBack ()
    };

    showToast = (tip) => Toast.info(tip)

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


    //获取验证码
    _code = () => {
       const { mobile, codeS, codeTime } = this.state;
       if( mobile == null || !mobile )    {
           return this.showToast('手机号码不能为空');
       }
       if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(mobile))) {
           return this.showToast('请输入正确的手机号码');
       }else {
           this.setState({
               codeS: !codeS,
           })
           let that = this;
           let timer = setInterval( () => {
               let codeTime = that.state.codeTime - 1;
               that.setState({
                   codeTime:codeTime
               });
               if(that.state.codeTime === 0){
                   clearInterval(timer);
                   that.setState({
                       codeS:!that.state.codeS,
                       codeTime:60
                   });
               }
           },1000);

           let data ={};
            //DES加密
           data.mobileEncrypt = encodeURIComponent(this.encryptByDES(this.state.mobile,'mdi1f84h60gj68e3hdkgt74gg13``》《《《《*&&*****./,..,y'));


           //赋值
           data.mobile = this.state.mobile;
           if (Platform.OS == 'android') {
               data.driverName = 2;
           }else if(Platform.OS == 'ios'){
               data.driverName = 1;
           }
           data.type = 2;  //忘记
           this.fetchCode(data);

       }
    }

    //手机验证码接口
    fetchCode(data){
       console.log(data);
       return fetch( Util.Path + api.login.getCode ,{
           method: 'post',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
          body:'type=' + data.type + '&mobile='+ data.mobile +
               '&mobileEncrypt=' + data.mobileEncrypt + '&driverName=' + data.driverName
       })
       .then((response) => response.json())
       .then((responseJson) => {
           console.log(responseJson);
           if(responseJson.code == 0){
               this.showToast('验证码已发送请注意查收');
           }else {
               this.showToast(responseJson.msg)
           }
           console.log(responseJson);
       })
       .catch(function(err){
           alert('发送失败请检查网络设置')
           console.log("Fetch错误:"+err);
       });
    }

    _Modify = () => {
           const { mobile, password, code, codeS, codeTime } = this.state;
           let dataModify = {};
           dataModify.mobile = mobile;
           dataModify.code = code;
           dataModify.password = password;
           if( mobile == null || !mobile )    {
               return this.showToast('手机号码不能为空');
           }
           if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(mobile))) {
               return this.showToast('请输入正确的手机号码');
           }
           if (code == null  || !code){
               return this.showToast('请输入验证码');
           }
           if(password == null || !password ) {
               return this.showToast('密码不能为空');
           }

           //密码DES加密
           dataModify.password = encodeURIComponent(this.encryptByDES(this.state.password,'DES_KEY_PASSWORD'));
           this.fetchSet(dataModify);
    }

    //设置密码接口
    fetchSet(data){
       return fetch( Util.Path + api.login.forget +'?mobile=' + data.mobile + '&msgcode='
           + data.code + '&password=' + data.password + '&userType=0',{
           method:"post",
           headers:{
               "Content-type":"application:/x-www-form-urlencoded"
           },
       })
       .then((response) => response.json())
       .then((responseJson) => {
           if(responseJson.code == 0){
               console.log(responseJson.object);
               const { goBack } = this.props.navigation;
               goBack();
           }else{
               console.log(responseJson.msg);
           }
       })
       .catch(function(err){
           console.log("Fetch错误:"+err);
       });
    }

    render() {
        if (this.state.loading && !this.state.error) {
            return <LoginView/>
        } else if (this.state.error) {
            //请求失败view
            return <ErrorView/>
        }else{
            return this.renderView();
        }
    }

    renderView() {
       return (
           <View>
                <HeaderView hasBg='true'
                title='设置密码'
                goBack={() => {this.goBack()}}/>
                <View style={styles.container}>
                    <View style={styles.textRow}>
                        <View style={styles.iconBox}>
                            <Image style={styles.icon}
                                source={require('./../../../../images/login/phone.png')}/>
                        </View>
                        <TextInput
                            placeholder="请输入手机号"
                            placeholderTextColor="#cfcfcf"
                            keyboardType={'phone-pad'}
                            underlineColorAndroid='transparent'
                            style={styles.inputBox}
                            onChangeText={ (mobile) => this.setState({mobile}) }
                        />
                    </View>
                    <View style={styles.textRow}>
                         <View style={styles.iconBox}>
                             <Image style={styles.icon}
                                source={require('./../../../../images/login/imageCode.png')}/>
                         </View>
                         <TextInput
                            placeholder="请输入图中文字"
                            placeholderTextColor="#cfcfcf"
                            underlineColorAndroid='transparent'
                            style={styles.inputBox}
                            onChangeText={ (mobile) => this.setState({mobile}) }
                         />
                         <TouchableOpacity onPress={() => this._code }  style={styles.code}>
                             <Text style={[SettingStyle.fontWeight,{fontSize: 14,color:'#54B1FF'}]}>获取图形文字</Text>
                         </TouchableOpacity>
                    </View>
                    <View style={styles.textRow}>
                        <View style={styles.iconBox}>
                            <Image style={styles.icon}
                                source={require('./../../../../images/login/code.png')}/>
                        </View>
                        <TextInput
                            placeholder="请输入验证码"
                            placeholderTextColor="#cfcfcf"
                            onChangeText={(code) => this.setState({code})}
                            underlineColorAndroid='transparent'
                            style={styles.inputBox}
                        />
                        {
                           this.state.codeS ?
                            <TouchableOpacity onPress={() => this._code }  style={styles.code}>
                                <Text style={[SettingStyle.fontWeight,{fontSize: 14,color:'#54B1FF'}]}>获取验证码</Text>
                            </TouchableOpacity>
                           :
                           <TouchableOpacity onPress={() => this._code } style={styles.code}>
                                <Text style={[SettingStyle.fontWeight,{fontSize: 14,color:'#54B1FF'}]}>{this.state.codeTime}S后重新获取</Text>
                            </TouchableOpacity>
                        }
                    </View>
                    <View style={styles.textRow}>
                        <View style={styles.iconBox}>
                            <Image style={styles.icon}
                            source={require('./../../../../images/login/password.png')}/>
                        </View>
                        <TextInput
                            placeholder="请确认新密码"
                            placeholderTextColor="#cfcfcf"
                            keyboardType={'number-pad'}
                            underlineColorAndroid='transparent'
                            style={styles.inputBox}
                            secureTextEntry={true}
                            onChangeText = {(password) => this.setState({password})}
                        />
                    </View>
                    <TouchableOpacity
                        onPress={this._Modify}
                        style={styles.sub}
                    >
                        <Text style={{fontSize:18,color:'#fff'}}>确认修改</Text>
                    </TouchableOpacity>
                 </View>
           </View>
       );
    }

}

