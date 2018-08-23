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
    NativeModules
} from 'react-native';
import { Toast,WhiteSpace, WingBlank, Modal } from 'antd-mobile-rn';
import styles from './SetStyle';

import api from './../../../js/api';
import global from './../../../js/global';
import Http from './../../../js/HttpUtils';
import SettingStyle from './../../../js/SettingStyle';
import LoginView from './../../common/LoginView';
import ErrorView from './../../common/ErrorView';
import HeaderView from './../../common/HeaderView';

let device = null;
let message = null;
export default class SoftWare extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            currentVersion: null,
            versioncode: null,
            downloadurl: null,
            versioncode: null,
            message: null,
        };
    }

    componentDidMount() {
        if (Platform.OS == 'ios') {
            device = 1;
            message = 'AppStore';
        }else {
            device = 2;
            message = '应用市场';
        }
        this._Version(device,message);
    }

    goBack = () => {
        const { goBack,navigate } = this.props.navigation
        goBack ()
    };

    _Version = (device,message) => {
        console.log('version');
        let params = {
            device: device,
        };
        console.log(params);
        Http.get(api.Version.findNewInfVersionInfo,params)
            .then((res) => {
                if(res.code === 0) {
                    let data = res.object;
                    console.log(data);
                    this.setState({
                        currentVersion: data.versionname,
                        versioncode: data.versioncode,
                        downloadurl: data.downloadurl,
                        message: message,
                        loading: false
                    })
                }
            },(error) => {
                console.log(error);
            })
    }

    componentWillMount(){
    }


    //版本更新
    _downLoad = () => {
        console.log(22);
        Modal.alert('温馨提示', '是否下载新版本', [
            { text: '取消', onPress: () => console.log('cancel') },
            { text: '确认', onPress: () => {
                    //打开外部链接,先检查是否安装了对应的应用
                    Linking.canOpenURL(this.state.downloadurl).then(supported => {
                        if (!supported) {
//                            console.log('Can\'t handle url: ' + url);
                            Toast.info('请先安装' + this.state.message)
                        } else {
                            return Linking.openURL(this.state.downloadurl);
                        }
                    }).catch(err => console.error('An error occurred', err));
                }}
        ]);
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
                  title='软件更新'
                  goBack={() => {this.goBack()}}/>
              <View style={[styles.SoftRow,styles.borderTop]}>
                   <Text style={[SettingStyle.font18,SettingStyle.fontWeight]}>当前版本</Text>
                   <Text style={[SettingStyle.font18,SettingStyle.fontWeight]}>{this.state.currentVersion}</Text>
              </View>
              <View style={styles.SoftRow}>
                  <Text style={[SettingStyle.font18,SettingStyle.fontWeight]}>新版更新</Text>
                    {
                        this.state.downloadurl ?
                        <Text onPress={() => this._downLoad() }
                            style={[SettingStyle.fontWeight,{fontSize: 14,color: '#9B9B9B'}]}
                        >{this.state.versioncode}</Text> :
                        <Text
                            style={[SettingStyle.fontWeight,{fontSize: 14,color: '#9B9B9B'}]}
                        >暂无新版</Text>
                    }
              </View>
           </View>
        );
    }

}