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
import { Toast,WhiteSpace, WingBlank } from 'antd-mobile';

import styles from './SetStyle';

import api from './../../../js/api';
import global from './../../../js/global';
import Http from './../../../js/HttpUtils';
import SettingStyle from './../../../js/SettingStyle';
import LoginView from './../../common/LoginView';
import ErrorView from './../../common/ErrorView';
import HeaderView from './../../common/HeaderView';

import ImagePicker from 'react-native-image-picker';

export default class Set extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: false,
        };
    }

    componentDidMount() {


    }

    componentWillUnmount() {

    }

    goBack = () => {
        const { goBack,navigate } = this.props.navigation
        goBack ()
    };

    _Sets(page) {
        const navigation = this.props.navigation;
        navigation.navigate(page);
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
            <View style={styles.SetContainer}>
                <HeaderView
                    title='设置'
                    goBack={() => {this.goBack()}}/>
                <TouchableOpacity
                    activeOpacity={1}
                    style={[styles.SetRow,styles.borderTop]}
                    onPress={() => this._Sets('FeedBack')}>
                    <View style={{flexDirection: 'row'}}>
                        <Image style={styles.SetIcon}
                            source={require('./../../../../images/mine/feed.png')} />
                        <Text style={[SettingStyle.font14,SettingStyle.fontWeight]}>意见反馈</Text>
                    </View>
                    <Image style={styles.SetArrow}
                        source={require('./../../../../images/mine/listarrow.png')} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.SetRow}
                    onPress={() => this._Sets('SoftWare')}>
                    <View style={{flexDirection: 'row'}}>
                        <Image style={styles.SetIcon}
                            source={require('./../../../../images/mine/soft.png')} />
                        <Text style={[SettingStyle.font14,SettingStyle.fontWeight]}>软件更新</Text>
                    </View>
                    <Image style={styles.SetArrow}
                        source={require('./../../../../images/mine/listarrow.png')} />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.SetRow}
                    onPress={() => this._Sets('PushSet')}>
                    <View style={{flexDirection: 'row'}}>
                        <Image style={styles.SetIcon}
                            source={require('./../../../../images/mine/pushset.png')} />
                        <Text style={[SettingStyle.font14,SettingStyle.fontWeight]}>推送设置</Text>
                    </View>
                    <Image style={styles.SetArrow}
                        source={require('./../../../../images/mine/listarrow.png')} />
                </TouchableOpacity>
            </View>
        );
    }

}