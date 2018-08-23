/**
 * Created by chengjuan on 2018/8/2.
 */
import React, {Component} from 'react';
import {Text, StyleSheet, View, Image, ImageBackground, TextInput, DeviceEventEmitter, TouchableOpacity} from 'react-native';
import styles from './newsSyle'
import SettingStyle from '../../../js/SettingStyle'

import api from '../../../js/api';
import Http from '../../../js/HttpUtils';

import LoginView from '../../common/LoginView'
import ErrorView from '../../common/ErrorView'
import NoDataView from '../../common/NoDataView';
import LoadingDataView from '../../common/LoadingDataView';
import HeaderView from '../../common/HeaderView'

import NewList from './newsComponent/newsList'
import {Toast} from "antd-mobile-rn/lib/index.native";
import Util from "../../../js/util";

export default class news extends Component {
    componentDidMount() {
        this.props.navigation.setParams({navigatePressBack: this.goBack});
        this.newsNum(1);
        this.newsNum(2);
        this.subscription = DeviceEventEmitter.addListener('type',(type) =>{
            this.setState({
                tabType:type
            })
        })
        this.news = DeviceEventEmitter.addListener('news',(userName) =>{
            this.newsNum(1);
            this.newsNum(2);
        })
    }

    componentWillUnmount(){
        this.subscription && this.subscription.remove();
        this.news && this.news.remove();
    }

    goBack = () => {
        DeviceEventEmitter.emit('scrollToTop', true);
        const { goBack,navigate } = this.props.navigation
        goBack ()
    }

    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            newsNum1:false,
            newsNum2:false,
            newsNum3:false,
            tabType:1,
        }
    }

    _newsDetails(name,id){
        const navigation = this.props.navigation;
        navigation.navigate(name,{
            Id:id
        });
    }

    goLogin(){
        const navigation = this.props.navigation;
        navigation.replace('LoginIndex');
    }

    newsNum(type){
        let params ={}
            params.type = type
        let _this = this
        Http.get(api.news.messageCountByType, params).then((res) => {
            if (res.object > 0){
                if(type == 1){
                    _this.setState({newsNum1:true});
                }else {
                    _this.setState({newsNum2:true});
                }
            }
        })
    }

    render() {
        return (
            <View style={[{position:'relative'}]}>
                <HeaderView  title='消息' hasBg='true' style={styles.headNews}
                             goBack={() => {this.goBack()}}/>
                <View style={styles.newsTab}>
                    <TouchableOpacity onPress={()=>this.tabsChange(1)}
                      style={[styles.ViewChange,this.state.tabType===1?styles.activeViewStyle:null,{borderRightWidth:.5,borderRightColor:'#D0D4DB'}]}>
                        {
                            this.state.newsNum1?(<Image source={require('../../../../images/header/news.png')} style={styles.newsNum1} />):null
                        }
                        <Text style={[SettingStyle.font14,SettingStyle.fontWeight,this.state.tabType==='10003'?styles.activeTextStyle:styles.tabsText]}>系统消息</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.tabsChange(2)}
                      style={[styles.ViewChange,this.state.tabType===2?styles.activeViewStyle:null]}>
                        {
                            this.state.newsNum2?(<Image source={require('../../../../images/header/news.png')} style={styles.newsNum1} />):null
                        }
                        <Text style={[SettingStyle.font14,SettingStyle.fontWeight,this.state.tabType==='10002'?styles.activeTextStyle:styles.tabsText]}>个人消息</Text>
                    </TouchableOpacity>
                </View>
                <NewList
                    _details={(name,id)=>{this._newsDetails(name,id)}}
                    _goLogin={()=>this.goLogin()}
                    onClick={this._newsDetails}/>
            </View>
        )
    }

    tabsChange(type){
        DeviceEventEmitter.emit('type', type);
        this.setState({
            tabType:type
        })
    }

}