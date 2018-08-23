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
} from 'react-native';
import { Toast,WhiteSpace, WingBlank } from 'antd-mobile-rn';
import LinearGradient from 'react-native-linear-gradient';
import styles from './AccountStyle';

import api from './../../../js/api';
import global from './../../../js/global';
import Http from './../../../js/HttpUtils';
import SettingStyle from './../../../js/SettingStyle';

import LoginView from './../../common/LoginView';
import ErrorView from './../../common/ErrorView';
import HeaderView from './../../common/HeaderView';
import NoDataView from './../../common/NoDataView';

let total=null; //总数
export default class Account extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            avatarSource: null,
            user: null,
            money: null,  //抢单金额
            createTime: null,
            type: null, //1 充值  2抢单
            remark: null,
            pageCurrent: 1,  //当前页数
            pageSize: 4,   //页长
            recordData: [],
            refreshing: false,
            balance: null,  //账户余额
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        };
    }

    componentDidMount() {
        let params = this.props.navigation.state.params;
        console.log(params);
        this.setState({
            avatarSource: params.avatarSource,
            balance: params.balance  //账户余额
        })
        this._inftransaction();
    }


    componentWillUnmount() {

    }

    goBack = () => {
        const { goBack,navigate } = this.props.navigation;
        goBack ()
    };

    _inftransaction = () => {
        let params = {
            pageCurrent: this.state.pageCurrent,
            pageSize: this.state.pageSize,
            token: global.login.token,
        };
        console.log(params);
        Http.post(api.recharge.inftransaction,params)
            .then((res) => {
//                console.log(res);
                if(res.code === 0) {
                    console.log(res.object);
                    let data = res.object;
                    let _data = res.object[0];
                    this.setState({
                        user: _data.userName,
                        money: _data.money,
                        loading: false
                    })
                    let dataArray = [];
                    if (data.length > 0) {
                        data.map((value) => {
                            dataArray.push(value);
                        });
                    }

                    if(this.state.pageCurrent === 1){
                        this.setState({
                            recordData: dataArray
                        })
                    }else{
                        this.setState({
                            recordData: this.state.recordData.concat(dataArray),
                        })
                    }

                    console.log(this.state.recordData);
                    total = data.length;
                    if( total < this.state.pageSize){
                        this.setState({showFoot:1},function () {
                            console.log(this.state.showFoot)
                        });
                    }

                    data = null;
                    dataArray = null;

                }
            },(error) => {
                console.log(error);
            })
    }


    // '2018-08-08 11:58:55' => '8/8'
    _date = (date) => {
        return date.slice(5,10).split('-').map((value)=>{ return (value - 0)}).join('/')
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

    //交易列表
    _renderList() {
        return (
            <View>
                <FlatList
                    data={this.state.recordData}
                    keyExtractor={(item, index) => item.id }
                    //头部组件
                    ListHeaderComponent={this._renderHeader.bind(this)}
                    //尾部组件
                    ListFooterComponent={this._renderFooter.bind(this)}
                    //注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                    onEndReachedThreshold={0.5}
                    //当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用
                    onEndReached={this._onEndReached.bind(this)}
                    //下拉刷新
                    refreshing={this.state.refreshing}
                    onRefresh={() => this._onRefresh()}
                    renderItem={this._renderRecordList}
                />
            </View>
        )
    }
    _renderRecordList = ({ item, index }) => {
        return (
            <View style={styles.recordRow} key={item.id}>
                <Text style={{fontSize: 14,color: '#ccc',marginRight: 15}}>
                    {this._date(item.createTime)}
                </Text>
                <View>
                    <Text style={SettingStyle.font14}>{item.remark}成功</Text>
                    <Text style={[SettingStyle.font18,SettingStyle.fontWeight]}>￥{item.money}</Text>
                </View>
            </View>
        )
    }
    _renderHeader() {
        const { navigate } = this.props.navigation;
        return (
               <View>
                    <View style={styles.headBox}>
                        <Image
                            style={ this.state.avatarSource ? styles.head : null}
                               source={
                                this.state.avatarSource ?
                                {uri:this.state.avatarSource} :
                                require('./../../../../images/mine/Ahead.png')
                                } />
                    </View>
                    <View style={styles.user}>
                        <Text style={[SettingStyle.font18,{marginLeft: 131}]}>{this.state.user}</Text>
                    </View>
                    <View style={styles.topBox}>
                        <View style={styles.headRow}>
                            <View>
                                <Text style={[SettingStyle.font20,SettingStyle.fontWeight,{alignSelf:'center'}]}>{this.state.balance}</Text>
                                <Text style={[SettingStyle.font12,SettingStyle.fontWeight,{alignSelf: 'center'}]}>账户余额</Text>
                            </View>
                            <TouchableOpacity onPress={() => {navigate('Recharge')}}
                                style={styles.rec}>
                                <Text style={[SettingStyle.text,{fontSize: 18,color: '#fff'}]}>立即充值</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.TextBox}>
                        <Text style={[SettingStyle.font18,SettingStyle.text]}>交易记录</Text>
                    </View>
               </View>
        )
    }
    _renderFooter(){
        if (this.state.showFoot === 1) {
            return (
                <View style={styles.dataView}>
                    <Text style={styles.dataText}>
                        没有更多数据了
                    </Text>
                </View>
            );
        } else if(this.state.showFoot === 2) {
            return (
                <View style={styles.dataView}>
                    <Text style={styles.dataText}>
                        正在加载数据...
                    </Text>
                </View>
            );
        } else if(this.state.showFoot === 0){
            return (
                <View style={styles.dataView}>
                    <Text style={styles.dataText}>正在加载... </Text>
                </View>
            );
        }
    };

    _onRefresh=()=>{
//        this._inftransaction()
        this.setState({
            pageCurrent: 1,
            recordData: [],
            showFoot: 0,
        },function(){
            this._inftransaction()
        })
    };
    _onEndReached(){
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot !== 0 ){
            return ;
        }
        let _this = this
        _this.setState({pageCurrent:_this.state.pageCurrent + 1},function () {
            _this._inftransaction()
        })
    }


    renderView() {
        const { navigate } = this.props.navigation;
        return (
            <LinearGradient colors={['#3994FF','#68C9FE']}>
                {/*{ <HeaderView*/}
                {/*title='我的账户' hasBg='true'*/}
                {/*goBack={() => {this.goBack()}}/>  }*/}
                <View searchBar rounded style={[SettingStyle.header,Platform.OS == 'ios'?{justifyContent:'center',marginTop:20}:{justifyContent:'center'}]}>
                    <TouchableOpacity transparent style={SettingStyle.back} onPress={()=>this.goBack()}>
                        <Image style={SettingStyle.headerBack} source={require('./../../../../images/header/go-back-white.png')} />
                    </TouchableOpacity>
                    <Text style={[SettingStyle.headerText,SettingStyle.text]}>我的账户</Text>
                </View>
                <View style={styles.container}>
                        { this._renderList() }
                </View>
            </LinearGradient>
        );
    }
}