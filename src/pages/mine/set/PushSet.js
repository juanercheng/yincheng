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
    Text,
    Switch
} from 'react-native';
import { Toast,WhiteSpace, WingBlank  } from 'antd-mobile';


import styles from './SetStyle';

import api from './../../../js/api';
import global from './../../../js/global';
import Http from './../../../js/HttpUtils';
import SettingStyle from './../../../js/SettingStyle';
import LoginView from './../../common/LoginView';
import ErrorView from './../../common/ErrorView';
import HeaderView from './../../common/HeaderView';

import ImagePicker from 'react-native-image-picker';

export default class PushSet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            value: false,  //开关状态  0 未  1开启
            check:false,
        };
    }

    componentDidMount() {
        this._Push();
    }

    componentWillUnmount() {

    }


    _Push = () => {
        console.log('push');
        let params = {
            token: global.login.token,
        };
        Http.get(api.user.Push, params)
            .then((res) => {
                console.log(res);
                if(res.code === 0) {
                    console.log(res);
                    let data = res.object;
                    this.setState({
                        value:data.isOpenPush,
                        loading: false
                    })
                }
            },(error) => {
                console.log(error);
            })
    }

    goBack = () => {
        const { goBack,navigate } = this.props.navigation
        goBack ()
    };

    onSwitchChange = value => this.setState({ checked: value })

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
            <View style={styles.SetContainer}>
                 <HeaderView
                   title='推送设置'
                   goBack={() => {this.goBack()}}/>
                 <View
                    style={[styles.PushRow,styles.borderTop]}>
                    <Text style={[SettingStyle.font18,SettingStyle.fontWeight]}>推送设置</Text>
                    <Switch
                        value={ this.state.value === 0 ? false : true }
                        disabled={false}
                        onValueChange={(check)=>{this.setState({check})}}
                        onTintColor="#50acff"
                        thumbTintColor='#fff'
                    />
                 </View>
            </View>
        );

    }

}