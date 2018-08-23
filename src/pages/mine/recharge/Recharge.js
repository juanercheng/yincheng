/**
 * Created by Ld on 2018/8/1.
 */

import React, { Component } from 'react';
import {
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
    ImageBackground,
} from 'react-native';
import { Toast, WhiteSpace, Checkbox, List, Modal} from 'antd-mobile-rn';
import styles from './RechargeStyle';

import api from './../../../js/api';
import global from './../../../js/global';
import Http from './../../../js/HttpUtils';
import SettingStyle from './../../../js/SettingStyle';
import LoginView from './../../common/LoginView';
import ErrorView from './../../common/ErrorView';
import HeaderView from './../../common/HeaderView';

import *as wechat from 'react-native-wechat';
import Alipay from './../../common/Alipay';

const nocheckImage=require('./../../../../images/mine/weixuanzhong.png');
const checkImage=require('./../../../../images/mine/xuanzhong.png');
const payType = [
    {name: '支付宝支付', src: require( './../../../../images/mine/ali.png')},
    {name: '微信支付', src: require('./../../../../images/mine/wx.png')},
];

let pageCurrent = 1; //第几页
let totalPage; //总页数

export default class Recharge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            type: null, //充值套餐
            checkMoney: null,
            money: [
                {id: 0, money: 888, bgSrc: require('./../../../../images/mine/rechargeo.png'), Check: require('./../../../../images/mine/rechargech.png')},
                {id: 1, money: 1888, bgSrc: require('./../../../../images/mine/recharget.png') , Check: require('./../../../../images/mine/rechargech.png')},
                {id: 2, money: 2888, bgSrc: require('./../../../../images/mine/rechargeth.png'),Check: require('./../../../../images/mine/rechargech.png') },
                {id: 3, money: 3888, moneyS: 300,bgSrc: require('./../../../../images/mine/rechargef.png') ,Check: require('./../../../../images/mine/rechargech.png') },
            ],
            rechargeList: [],
            payType: 0,
            modalVisible: false,
            pageSize: 4,
            showModal: false,
        };
    }

    //建议在应用启动时初始化，初始化之前无法使用此模块的其他方法。WeChat模块只需要初始化一次。
    componentDidMount() {
//        wechat.registerApp('your appid');
        //获取充值套餐
        this._getMealList();

    }

    componentWillUnmount() {

    }

    goBack = () => {
        const { goBack,navigate } = this.props.navigation
        goBack ()
    };

    //获取充值套餐信息
    _getMealList = () => {
        let params = {
            pageCurrent: pageCurrent,
            pageSize: this.state.pageSize,
        };
        Http.post(api.recharge.infsetmeal,params)
            .then((res) => {
                console.log(res);
                if(res.code === 0) {
                    console.log(res.object);
                    this.setState({
                        rechargeList: res.object,
                        loading: false,
                    })
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

    showToast = (tip) => Toast.info(tip)

    //选择充值套餐
    _checkMoney(id) {
        this.setState({
            type: id,
        })
    }

    //选择支付方式
    _Check = (index) => {
        this.setState({
            payType: index
        })
    }


    //支付
    _pay = () => {
        if(this.state.type == null || !this.state.type ) {
            return this.showToast('请选择充值套餐');
        }else {
            Modal.alert('温馨提示', '确定支付吗', [
                { text: '取消', onPress: () => console.log('cancel') },
                { text: '确认', onPress: () => {
                        console.log('confirm');
                        this._payConfirm();
                    }}
            ]);
        }
    }

    _payConfirm = () => {
        console.log(555);
        if (this.state.payType === 0) {
            this._AliPay();
        }else if (this.state.payType === 1) {
            this._WxPay();
        }
    }


    _WxPay(){
        console.log('wx');
        let params = {
            infSetMealId: this.state.type,
            infSetMealId: this.state.payType,
            token: global.login.token,
        }
        Http.get(api.user.recharge,params)
            .then((res) => {
                if(res.code === 0){
                    console.log(res.object);
                }
            })
//        Http.get( 'http://47.100.34.60/farmproduct/api/wxpay/getPayParams',
//            function(res){
//                console.log(res);
//                if(res.code == 0) {
//                    wechat.isWXAppInstalled()
//                    .then((isInstalled)=>{
//                        if(isInstalled){
//                             wechat.openWXApp();
//                             wechat.pay(
//                                   {
//                                       partnerId: '',  // 商家向财付通申请的商家id
//                                       prepayId: '',   // 预支付订单
//                                       nonceStr: '',   // 随机串，防重发
//                                       timeStamp: '',  // 时间戳，防重发
//                                       package: '',    // 商家根据财付通文档填写的数据和签名
//                                       sign: ''        // 商家根据微信开放平台文档对数据做的签名
//                                   }
//                               ).then((success)=>{
//                                   console.log(success);
//                                   //通知后台支付成功
//                                   this._WxPaySuccess();
//                               }).catch((error)=>{
//                                   console.log(error)
//                               })
//                         }else {
//                             console.log('没有安装微信软件，请您安装微信之后再试')
//                         }
//                    })
//                }
//            }
//        )
    }

    //通知后台微信支付成功
//     _WxPaySuccess = ()=> {
//        let params = {
//            orderno: type,
//        }
//        http.getNoTokenData(api.pay.wxsuccess,params,
//            (res) => {
//                console.log(res);
//                if(res.code == 0) {
//                    this.showToast('微信支付成功');
//                }
//            }
//        )
//     }


    //获取支付宝支付的订单字符串
    _AliPay() {
        console.log('Ali');
//        let params = {
//            orderno: type,
//        }
//        http.postData(api.pay.aligetPayParams,params,
//            (res) => {
//                console.log(res);
//                if(res.code === 0) {
//                    Alipay.pay(res.object).then((data) => {
//                        if (data.length && data[0].resultStatus) {
//                        /*处理支付结果*/
//                            switch (data[0].resultStatus) {
//                                case "9000":
//                                     opt.success && opt.success(data);
//                                    this._AliPaySuccess();
//                                break;
//                                case "8000":
//                                    this.showToast('支付结果未知,请查询订单状态')
//                                break;
//                                case "4000":
//                                    this.showToast('订单支付失败')
//                                break;
//                                case "5000":
//                                    this.showToast('重复请求')
//                                break;
//                                case "6001":
//                                    this.showToast('用户中途取消')
//                                break;
//                                case "6002":
//                                    this.showToast('网络连接出错')
//                                break;
//                                case "6004":
//                                    this.showToast('支付结果未知,请查询订单状态')
//                                break;
//                                default:
//                                    this.showToast('其他失败原因')
//                                break;
//                            }
//                        } else {
//                            this.showToast('其他失败原因')
//                        }, (err) => {
//                             opt.fail && opt.fail('支付失败，请重新支付')
//                           }
//                    }
//                }
//            }
//        )
    }

    //通知后台支付宝支付成功
//     _AliPaySuccess = ()=> {
//        let params = {
//            orderno: type,
//        }
//        http.getNoTokenData(api.pay.alisuccess,params,
//            (res) => {
//                console.log(res);
//                if(res.code == 0) {
//                    this.showToast('支付宝支付成功');
//                }
//            }
//        )
//     }



    renderView() {
        return (
            <View style={styles.containerBox}>
                <HeaderView hasBg='true'
                    title='账户充值'
                    goBack={() => {this.goBack()}}/>
                <ScrollView>
                    <View style={styles.container}>
                        <View style={styles.itemRow}>
                            {
                                this.state.rechargeList.map( (item,index) => (
                                    <TouchableOpacity onPress={() => this._checkMoney(item.id)}
                                        key={item.id + 1}
                                        activeOpacity={0.6}>
                                        <ImageBackground  resizeMode='contain' style={styles.bgImg}
                                             source={
                                                this.state.type === item.id ?
                                                require('./../../../../images/mine/rechargech.png') :
                                                require('./../../../../images/mine/recharget.png')
                                                }>
                                            <Text style={this.state.type === item.id ? styles.checkMon : styles.mon }>{item.payMoney.substr(0,3)}元</Text>
                                            { parseFloat(item.giveMoney) !== 0 ?
                                                <Text style={ this.state.type === item.id ? styles.checkMons : styles.mons}>赠送{parseFloat(item.giveMoney)}元</Text>
                                              : null}
                                        </ImageBackground>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                        <Text style={[SettingStyle.font14,SettingStyle.fontWeight,SettingStyle.text,{marginBottom:18}]}>请选择支付方式</Text>
                        <View style={styles.payBox}>
                            {
                                payType.map( (item,index) => (
                                        <TouchableOpacity
                                            activeOpacity={0.6}
                                            style={index === 1 ? styles.borderBottomNone : styles.payRow}
                                            key={index}
                                            onPress={() => this._Check(index)}
                                        >
                                            <View style={{flexDirection:'row'}}>
                                                <Image source={item.src} />
                                                <Text style={[SettingStyle.font14,{marginLeft: 15,alignSelf: 'center'}]}>{item.name}</Text>
                                            </View>
                                            <Image
                                                source={this.state.payType===index ? checkImage : nocheckImage} />
                                        </TouchableOpacity>
                                ))
                            }
                        </View>
                        <View style={styles.confirm}>
                            <TouchableOpacity  style={styles.con}
                                onPress={ () => this._pay()} >
                                <Text style={[SettingStyle.text,{fontSize: 18,color: '#fff'}]}>确认支付</Text>
                            </TouchableOpacity>
                        </View>
                        {/*<Modal*/}
                            {/*animationType="fade"*/}
                            {/*transparent={true}*/}
                            {/*visible={this.state.modalVisible}*/}
                            {/*onRequestClose={() => {*/}
                                {/*alert("Modal has been closed.");*/}
                            {/*}}>*/}
                            {/*<View style={{width: '80%',height:'40%',backgroundColor:'#fff',marginTop:22,alignItems:'center'}}>*/}
                                 {/*<View style={{flexDirection:'row'}}>*/}
                                    {/*<Text style={{}}>温馨提示</Text>*/}
                                    {/*<Text style={{alignSelf:'flex-end'}}*/}
                                    {/*onPress={() => {this.setState({ modalVisible: false })}}>x</Text>*/}
                                {/*</View>*/}
                                {/*<Text>确认支付吗</Text>*/}
                                {/*<View style={{flexDirection:'row',justifyContent:'space-between'}}>*/}
                                    {/*<Text onPress={() => {this.setState({ modalVisible: false })}}>取消</Text>*/}
                                    {/*<Text>确认</Text>*/}
                                {/*</View>*/}
                            {/*</View>*/}
                        {/*</Modal>*/}
                     </View>
                </ScrollView>
            </View>
        );

    }

}







