/**
 * Created by juaner by 18-07-24
 */
import React, {Component} from 'react';
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
    ToastAndroid,
    ImageBackground,
} from 'react-native';
import { NavigationActions } from 'react-navigation';
import LinearGradient from 'react-native-linear-gradient';
import { Toast,WhiteSpace, WingBlank } from 'antd-mobile-rn';

import SettingStyle from './../../js/SettingStyle';
import styles from './MineStyle';

import api from './../../js/api';
import global from './../../js/global';
import http from './../../js/http';
import Http from './../../js/HttpUtils';
import LoginView from './../common/LoginView';
import ErrorView from './../common/ErrorView';
import ImagePicker from 'react-native-image-picker';
import px2dp from './../../js/px2dp';

//图片弹出框参数
const options = {
    title: null,
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '相机',
    chooseFromLibraryButtonTitle: '从相册选择',
    quality: 0.75,
    allowsEditing:true,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}

const PagesValue = [
    { id: 0, page: 'Recharge', name: '立即充值', iconSrc: require('./../../../images/mine/recharge.png') } ,
    { id: 1, page: 'Credit', name: '信贷经理认证', iconSrc: require('./../../../images/mine/credit.png')} ,
    { id: 2, page: 'Account', name: '我的账户', iconSrc: require('./../../../images/mine/account.png')} ,
    { id: 3, page: 'Forget', name: '设置密码',iconSrc: require('./../../../images/mine/setpassword.png') },
];
const baseURL = 'http://chijun.xin/yincheng/api/';
export default class MineIndex extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            review: null,  //认证状态 0 未  1认证
            userId: null,
            mobile: null,
            name: null,
            money: null,
            avatarSource: null,
            isOpenPush: null, //是否开启推送
        };
    }

    //componentDidMount 执行一次，在初始化render之前执行，如果在这个方法内调用setState，render()知道state发生变化，并且只执行一次
    componentDidMount(){
        this._userInfos();
    }

    //在组件销毁的时候要将其移除
    componentWillUnmount(){
    };


    //获取用户信息
    _userInfos = () => {
        let params = {
            token: global.login.token,
        };
        Http.get(api.user.userInfos, params).then((res)=> {
           console.log(res);
            if(res.code === 0) {
//                console.log(res);
                let data = res.object;
                console.log(data);
                this.setState({
                    avatarSource: data.headPortrait,
                    name: data.userName,
                    money: data.balance,
                    userId: data.id,
                    isOpenPush: data.isOpenPush,
                    mobile: data.tel,
                    review: data.userLevel,
                    loading: false
                })
            }else if(res.code===101) {
                Toast.info(res.msg,6)
                setTimeout(function () {
                    _this.props.navigation.replace('LoginIndex');
                },6000)
            }
        },(error) => {
            console.log(error);
        })
    }

    //选择图片
    selectPhotoTapped = () => {
        ImagePicker.showImagePicker(options, (response) => {
                console.log('Response = ', response);
                if (response.didCancel) {
                    console.log('用户取消了选择！');
                }
                else if (response.error) {
                    console.log('ImagePicker发生错误: ', response.error);
                }
                else if (response.customButton) {
                    console.log('自定义点击按钮: ', response.customButton);
                }
                else {
                    let source;  // 保存选中的图片
                    let path;
                    source = { uri: response.uri };
                    if (Platform.OS === 'android') {
                        source = { uri: response.uri };
                        path = response.uri;
                    } else {
                        source = { uri: response.uri.replace('file://','') };
                        path = response.uri;
                    }
                    //图片上传
                    this._fileUpload(path);
                }
            });
    }

    //图片上传
    _fileUpload = (path1)=> {
        let formData = new FormData();
        let path=  'file://'+ path1;
        let file = {uri:  path, type: 'application/octet-stream', name: 'image.jpg'};
        formData.append("myfile", file);
        return fetch(baseURL + api.fileUpload.Upload, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data;charset=utf-8',
            },
            body: formData,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            let headUri;
            if( responseJson.code === 0) {
                headUri = responseJson.object;
                //修改头像
                this._updateHead(headUri);
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    //修改头像
    _updateHead = (source)=> {
        Toast.loading('正在加载....');
        let _this = this;
        let params = {
            headPortrait: source,
            // token: global.login.token,
        };
        Http.post(api.user.updateHead,params)
            .then((res) => {
                if(res.code === 0) {
                    Toast.hide();
                    console.log(res);
                    Toast.success('修改头像成功');
                    _this.setState({
                        avatarSource: res.object.headPortrait,
                        loading: false
                    });
                }
            },(error) => {
                console.log(error);
            })
    }

     //跳转其他页面
    _Pages(name) {
         const navigation = this.props.navigation;
         navigation.navigate(name,{
            avatarSource: this.state.avatarSource, //头像
            balance: this.state.money,  //账户余额
            review: this.state.review,  //认证状态
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
    _jump(){
        const navigateAction = NavigationActions.navigate({
            routeName: 'Forget',
            //
            params: {type:false},
            //
            // action: NavigationActions.navigate({ routeName: 'Recharge' }),
        });
        this.props.navigation.dispatch(navigateAction)
    }

    renderView() {
        const { navigate } = this.props.navigation;
        return (
            <View style={SettingStyle.bodyColor}>
                <View style={styles.container}>
                    <LinearGradient colors={['#3994FF','#6BCAFF']}>
                        <View style={[styles.topBox,Platform.OS == 'ios'?{marginTop:20}:{marginTop:0}]}>
                            <View style={SettingStyle.header}><Text style={[SettingStyle.text,SettingStyle.headerText,{backgroundColor:'rgba(0,0,0,0)'}]}>我的</Text></View>
                            <View style={styles.bgF}></View>
                            <View style={styles.headBox}>
                                <View style={SettingStyle.row}>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={this.selectPhotoTapped}>
                                        <Image style={ this.state.avatarSource ? styles.headImg : null}
                                            source={
                                                this.state.avatarSource ?
                                                { uri: this.state.avatarSource } :
                                                require('./../../../images/mine/head.png')
                                            } />
                                    </TouchableOpacity>
                                    <View style={{alignSelf: 'center'}}>
                                        <Text style={[SettingStyle.font14,SettingStyle.fontWeight,{marginLeft: 12}]}>{this.state.name}</Text>
                                        {
                                            this.state.review === 1 ?
                                            <Text style={[SettingStyle.text,styles.credit]}>认证成功</Text> :
                                            <Text style={[SettingStyle.text,styles.credit]}>{this.state.mobile}</Text>
                                        }
                                    </View>
                                </View>
                                <View>
                                    <Text style={[SettingStyle.font20,SettingStyle.fontWeight,{alignSelf:'center'}]}>{this.state.money}</Text>
                                    <Text style={[SettingStyle.font12,SettingStyle.fontWeight,{alignSelf:'center'}]}>账户余额</Text>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>
                    <View style={styles.contentBox}>
                        <View style={styles.content}>
                            <View>
                                <TouchableOpacity
                                    style={styles.row}
                                    activeOpacity={1}
                                    onPress={() => this._Pages('Recharge')}
                                >
                                    <View style={SettingStyle.row}>
                                        <Image style={{alignSelf: 'center'}} source={require('./../../../images/mine/recharge.png')} />
                                        <Text style={styles.txt}>立即充值</Text>
                                    </View>
                                        <Image source={require('./../../../images/mine/listarrow.png')} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={styles.row}
                                    activeOpacity={1}
                                    onPress={() => this._Pages('Credit')}
                                >
                                    <View style={SettingStyle.row}>
                                        <Image style={{alignSelf: 'center'}} source={require('./../../../images/mine/credit.png')} />
                                        <Text style={styles.txt}>信贷经理认证</Text>
                                    </View>
                                        <Image source={require('./../../../images/mine/listarrow.png')} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={styles.row}
                                    activeOpacity={1}
                                    onPress={() => this._Pages('Account')}
                                >
                                    <View style={SettingStyle.row}>
                                        <Image style={{alignSelf: 'center'}} source={require('./../../../images/mine/account.png')} />
                                        <Text style={styles.txt}>我的账户</Text>
                                    </View>
                                        <Image source={require('./../../../images/mine/listarrow.png')} />
                                </TouchableOpacity>
                            </View>
                            <View>
                                <TouchableOpacity
                                    style={[styles.row,{borderBottomWidth: 0}]}
                                    activeOpacity={0.6}
                                    onPress={() => this._jump()}
                                >
                                    <View style={SettingStyle.row}>
                                        <Image style={{alignSelf: 'center'}} source={require('./../../../images/mine/setpassword.png')} />
                                        <Text style={styles.txt}>设置密码</Text>
                                    </View>
                                        <Image source={require('./../../../images/mine/listarrow.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{width: '100%',paddingLeft:10,paddingRight: 10}}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => this._Pages('Set')}
                             style={styles.setRow}
                        >
                            <View style={styles.set}>
                                <View style={SettingStyle.row}>
                                    <Image
                                        source={require('./../../../images/mine/set.png')} />
                                    <Text style={styles.txt}>设置</Text>
                                </View>
                                <Image source={require('./../../../images/mine/listarrow.png')} />
                            </View>
                         </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

}
