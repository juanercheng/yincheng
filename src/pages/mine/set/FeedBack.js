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
import { Toast, WhiteSpace, WingBlank} from 'antd-mobile-rn';
import styles from './SetStyle';

import api from './../../../js/api';
import global from './../../../js/global';
import Http from './../../../js/HttpUtils';
import SettingStyle from './../../../js/SettingStyle';
import LoginView from './../../common/LoginView';
import ErrorView from './../../common/ErrorView';
import HeaderView from './../../common/HeaderView';
import Util from "../../../js/util";

export default class FeedBack extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: false,
            text: '',
            mobile: null,
        };
    }

    goBack = () => {
        const { goBack,navigate } = this.props.navigation
        goBack ()
    };

    componentDidMount() {
        setTimeout(() => {
            Toast.hide();
        }, 3000);
    }

    componentWillUnmount() {

    }

    showToast = (tip) => Toast.info(tip)

    _SubMit() {
        let data = {};
        data.mobile = this.state.mobile;
        data.text = this.state.text;
        if (this.state.text === '' || !this.state.text){
            return this.showToast('请输入反馈！');
        }
        if (this.state.mobile === null || !this.state.mobile){
            return this.showToast('请输入手机号！');
        }
        if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.state.mobile))) {
            return this.showToast('请输入正确的手机号！')
        }else {
             if (Platform.OS == 'android') {
                data.feedbackfsource = 2;
             }else if(Platform.OS == 'ios'){
                data.feedbackfsource = 1;
             }
            this._feedBack(data);
        }
    }

    //意见反馈
    _feedBack = (data) => {
        let params = {
            feedbackcontent: data.text,
            feedbackfsource: data.feedbackfsource,
            tel: data.mobile,
        };
        console.log(params);
        Http.post(api.user.feedBack,params)
            .then((res) => {
                if(res.code === 0) {
                    console.log(res.object);
                    this.showToast(res.object);
                    setTimeout(function () {
                        this.goBack();
                    },1000)
                }
            },(error) => {
                console.log(error);
            })
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
            <View style={[styles.SetContainer,{backgroundColor:'#fff'}]}>
                <HeaderView
                    title='意见反馈'
                    goBack={() => {this.goBack()}}/>
                <ScrollView keyboardShouldPersistTaps='always'>
                    <View style={[styles.borderTop,{paddingTop: 8.3,}]}>
                        <Text style={[SettingStyle.font14,SettingStyle.fontWeight,SettingStyle.text,{paddingLeft:15}]}>请填写您的意见和建议</Text>
                        <View style={styles.textBox}>
                            <TextInput style={[SettingStyle.text,styles.text]}
                                multiline={true}
                                underlineColorAndroid='transparent'
                                placeholderTextColor="#cfcfcf"
                                clearTextOnFocus={true}
                                maxLength={100}
                                onChangeText={ (text) => this.setState({text})}
                            />
                        </View>
                        <Text style={[SettingStyle.text,styles.maxLength]}>{this.state.text.length}/100字</Text>
                        <Text style={[SettingStyle.font14,SettingStyle.fontWeight,SettingStyle.text,{paddingLeft:15}]}>请填写您的联系方式</Text>
                        <View style={styles.connectBox}>
                             <TextInput style={[SettingStyle.text,styles.connect]}
                                // multiline={true}
                                keyboardType='phone-pad'
                                placeholderTextColor="#cfcfcf"
                                underlineColorAndroid='transparent'
                                // onEndEditing={()=>{this.refs.scroll.scrollTo({y:0,x:0,animated:true})}}
                                onChangeText={(mobile) => this.setState({mobile})}
                             />
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.sub}>
                    <TouchableOpacity onPress={() => this._SubMit()}>
                        <Text style={[SettingStyle.text,{fontSize: 24,color: '#fff'}]}>提交</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );

    }

}