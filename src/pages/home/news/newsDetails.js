/**
 * Created by chengjuan on 2018/8/2.
 */
import React, {Component} from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    ImageBackground,
    TextInput,
    TouchableOpacity,
    DeviceEventEmitter
} from 'react-native';
import styles from './newsSyle'
import SettingStyle from '../../../js/SettingStyle'
import api from '../../../js/api';
import Http from "../../../js/HttpUtils";

import LoginView from '../../common/LoginView'
import ErrorView from '../../common/ErrorView'
import NoDataView from '../../common/NoDataView';
import LoadingDataView from '../../common/LoadingDataView';
import HeaderView from '../../common/HeaderView'
import { Toast } from 'antd-mobile-rn';

export default class newsDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: null,
            loading: true,
            content:null
        }
    }

    componentDidMount() {
        let params ={
            pageCurrent:1,
            pageSize:2,
            id:this.props.navigation.state.params.Id,
        }
        let _this = this
        Http.post(api.news.messageDetail, params).then((res) => {
            if(res.code===0){
                res.object.createTime = res.object.createTime.replace(/-/g, '/')
                var str = new Date(res.object.createTime);
                str.setDate(str.getDate());
                var year=str.getFullYear()
                var month = (parseInt(str.getMonth()) + 1)>10?(parseInt(str.getMonth()) + 1):'0'+(parseInt(str.getMonth()) + 1)
                var date = str.getDate() < 10 ? '0' + str.getDate(): str.getDate()
                res.object.createTime = year+'-'+month+'-'+date
                _this.setState({
                    content: res.object,
                    loading: false,
                });
            }
        })
    }

    goBack = () => {
        DeviceEventEmitter.emit('Refresh', true);
        const { goBack,navigate } = this.props.navigation
        goBack ()
    }

    render() {
        if (this.state.loading) {
            return <LoginView/>
        }else{
            return this.renderView();
        }
    }
    renderView() {
        let content = this.state.content
        return (
            <View>
                <HeaderView  title='消息详情' hasBg={true}
                             goBack={() => {this.goBack()}}/>
                <View style={{backgroundColor:'#fff',paddingTop:17,paddingRight:13,paddingLeft:13,paddingBottom:20}}>
                    <Text style={[SettingStyle.font18,{textAlign:'center'}]}>{content.title}</Text>
                    <Text style={[SettingStyle.font12,styles.newtext,{textAlign:'right',marginBottom:10,marginTop:10}]}>{content.createTime}</Text>
                    <Text style={[[SettingStyle.font14,{lineHeight:20}]]}>{content.content}</Text>
                </View>
            </View>
        )
    }
}