/**
 * Created by chengjuan on 2018/8/2.
 */
import React, {Component} from 'react';
import {ScrollView, StyleSheet, View, Image, Text,Platform, DeviceEventEmitter, TouchableOpacity} from 'react-native';
import { Toast,WhiteSpace, WingBlank ,Modal,List} from 'antd-mobile-rn';

import styles from './classifyStyle';
import SettingStyle from './../../js/SettingStyle'

import api from './../../js/api';
import Http from './../../js/HttpUtils'
import dateChange from './../../js/dateChange';

import LoginView from './../common/LoginView';  //正在加载
import NoDataView from './../common/NoDataView';  //列表数据加载完毕
import LoadingDataView from './../common/LoadingDataView';  //正在加载
import ErrorView from './../common/ErrorView';
import HeaderView from './../common/HeaderView';

export default class customerDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            error: false,
            data:null,
            type:1,
            modalVisible: false
        }
    }

    componentDidMount() {
        this.setState({
            type:this.props.navigation.state.params.Type
        },()=>console.log(this.state.type,'type'));
        this.fetchData();
    }

    goBack = () => {
        const { goBack,navigate } = this.props.navigation
        goBack ()
    };

    _next(routName,orderNo,type) {
        const {navigate} = this.props.navigation;
        navigate(routName, {
            orderNo: orderNo,
            type: type,
            key:this.props.navigation.state.key
        })
    }

    fetchData() {
        let _this = this;
        let params ={
            id:this.props.navigation.state.params.Id,
            // token:global.login.token
        };
        Http.get(api.customer.findCustomerById, params).then((res) => {
            console.log(res);
            if(res.code===0){
                _this._data = res.object;
                _this.setState({
                    loading: false,
                    data:_this._data,
                });
            }
            },(error)=>{
                console.log(error);
        })
    }

    take(id){
        //先判断用户账户是否有钱，有的话直接抢单，没钱的提示先去充值，充值成功之后返回再继续抢单
        let _this = this;
        let params = {
            id:this.props.navigation.state.params.Id,
        }
        Http.get(api.customer.robbing, params).then((res) => {
            console.log(res);
            if(res.code===0){
                Toast.success('成功抢单！')
                //搶單成功的話就自動刷新客戶和首頁列表信息，返回列表頁面
                DeviceEventEmitter.emit('ListRefresh', true);
                setTimeout(function () {
                    _this.goBack()
                },3000)
            }else if(res.code===500){
                Modal.alert('温馨提示', (res.msg), [
                    { text: '取消', onPress: () => console.log('cancel') },
                    { text: '确认', onPress: () => {
                        _this._next('Recharge')
                    }}
                ]);
                // this.setState({ modalVisible: true });
            }else {
                Toast.info(res.msg)
            }
        },(error)=>{
            console.log(error);
        })
    }

    confirm(){
        this.setState({ modalVisible: false });
        this._next('Recharge')
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
        let data = this.state.data
        return(
            <View style={SettingStyle.bodyColor}>
                <HeaderView
                    title='客户信息'
                    goBack={() => {this.goBack()}}/>
                <ScrollView style={Platform.OS==='ios'? {marginBottom:0}:{marginBottom:24}}>
                    <View style={styles.topBox}>
                        <View style={styles.titleText}>
                            <View style={styles.titleName}>
                                <View><Text style={[styles.writeText,SettingStyle.fontWeight,{fontSize:18,color:'#fff'}]}>{data.name}</Text></View>
                                <View style={[styles.blueText]}>
                                    {
                                        data.isRealName===1?(<Text style={[SettingStyle.font10,{color:'#429cfd',}]}>已实名</Text>):(
                                            <Text style={[SettingStyle.font10,{color:'#429cfd',}]}>未实名</Text>
                                        )
                                    }
                                </View>
                            </View>
                            <View><Text style={{color:'#fff',fontSize:10}}>{dateChange(data.createTime)}前</Text></View>
                        </View>
                        <View style={styles.phone}>
                            <Text style={[styles.writeText,SettingStyle.fontWeight,{fontSize:16}]}>{data.tel}</Text>
                            <Image style={styles.phoneImage} source={require('../../../images/customer/phone.png')}/>
                        </View>
                        <View style={styles.test}><Text style={{color:'#f8f8fa'}}>34r</Text></View>
                        <View  style={styles.topCenterBox}>
                            <View style={styles.money}>
                                <Text style={[styles.textB,SettingStyle.fontWeight,{fontSize:20}]}>{data.loanMoney}元</Text>
                                <Text style={[styles.textB,SettingStyle.fontWeight,{fontSize:10}]}>贷款金额</Text>
                            </View>
                            <View style={styles.line}></View>
                            <View style={styles.money}>
                                <Text style={[styles.textB,SettingStyle.fontWeight,{fontSize:20}]}>{data.loanOverMonth}个月</Text>
                                <Text style={[styles.textB,SettingStyle.fontWeight,{fontSize:10}]}>贷款期限</Text>
                            </View>
                        </View>
                    </View>
                    <View style={styles.ContentDetails}>
                        <View style={styles.ContentDetailsItem}>
                            <View style={styles.Item01}>
                                <Image source={require('../../../images/customer/personal.png')}/>
                                <Text style={styles.Item01Tilte}>个人信息</Text>
                            </View>
                            <View style={styles.ItemTextBox}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>年龄：</Text>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>{data.age}</Text>
                            </View>
                            <View style={styles.ItemTextBox}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>城市：</Text>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>{data.locationCityName}</Text>
                            </View>
                            <View style={styles.ItemTextBox}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>户籍地址：</Text>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>{data.hometownCityName}</Text>
                            </View>
                            <View style={[styles.ItemTextBox,styles.ItemTextBoxLast]}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>学历：</Text>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>{data.educationName}</Text>
                            </View>
                        </View>
                        <View style={styles.ContentDetailsItem}>
                            <View style={styles.Item01}>
                                <Image source={require('../../../images/customer/customer.png')}/>
                                <Text style={styles.Item01Tilte}>工作信息</Text>
                            </View>
                            <View style={styles.ItemTextBox}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>月收入：</Text>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>{data.monthlyIncome}元</Text>
                            </View>
                            <View style={styles.ItemTextBox}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>收入形式：</Text>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>{data.incomeTypeName}</Text>
                            </View>
                            {
                                data.companyName?(<View style={styles.ItemTextBox}>
                                    <Text style={[styles.ItemText,SettingStyle.fontWeight]}>公司名称：</Text>
                                    <Text style={[styles.ItemText,SettingStyle.fontWeight]}>{data.companyName}</Text>
                                </View>):null
                            }
                            <View style={styles.ItemTextBox}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>职业身份：</Text>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>{data.vocationName}</Text>
                            </View>
                            <View style={[styles.ItemTextBox,styles.ItemTextBoxLast]}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>社保公积：</Text>
                                {
                                    data.isSspf===1?(<Text style={[styles.ItemText,SettingStyle.fontWeight]}>有</Text>):(<Text style={[styles.ItemText,SettingStyle.fontWeight]}>无</Text>)
                                }
                            </View>
                        </View>
                        <View style={styles.ContentDetailsItem}>
                            <View style={styles.Item01}>
                                <Image source={require('../../../images/customer/assets.png')}/>
                                <Text style={styles.Item01Tilte}>资产信息</Text>
                            </View>
                            <View style={styles.ItemTextBox}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>信用卡额度：</Text>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>{data.creditCardAmount}元</Text>
                            </View>
                            <View style={styles.ItemTextBox}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>信用记录：</Text>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>{data.creditRecordName}</Text>
                            </View>
                            <View style={styles.ItemTextBox}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>微粒贷：</Text>
                                {
                                    data.isParticleLoan ===1?(<Text style={[styles.ItemText,SettingStyle.fontWeight]}>有</Text>):(<Text style={[styles.ItemText,SettingStyle.fontWeight]}>无</Text>)
                                }
                            </View>
                            <View style={styles.ItemTextBox}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>房产：</Text>
                                {
                                    data.isHouseProperty===1?(
                                        <View style={[SettingStyle.row]}>
                                            <Text style={[styles.ItemText,SettingStyle.fontWeight,{flex:1}]}>有</Text>
                                            {
                                                data.isCanCustodyHouseProperty===1?(
                                                    <Text style={{flex:1}}>接受抵押</Text>
                                                ):(
                                                    <View style={[SettingStyle.row,{alignItems:'center',flex:1}]}>
                                                        <Image source={require('../../../images/customer/tt.png')}/>
                                                        <Text style={{marginLeft:5}}>不接受抵押</Text>
                                                    </View>
                                                )
                                            }
                                        </View>
                                    ):(<Text style={[styles.ItemText,SettingStyle.fontWeight]}>无</Text>)
                                }
                            </View>
                            <View style={styles.ItemTextBox}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>车产：</Text>
                                {
                                    data.isCarProperty ===1?(
                                        <View style={[SettingStyle.row]}>
                                            <Text style={[styles.ItemText,SettingStyle.fontWeight,{flex:1}]}>有</Text>
                                            {
                                                data.isCanCustodyCarProperty===1?(
                                                    <Text style={{flex:1}}>接受抵押</Text>
                                                ):(
                                                    <View style={[SettingStyle.row,{alignItems:'center',flex:1}]}>
                                                        <Image source={require('../../../images/customer/tt.png')}/>
                                                        <Text style={{marginLeft:5}}>不接受抵押</Text>
                                                    </View>
                                                )
                                            }
                                        </View>

                                    ):(<Text style={[styles.ItemText,SettingStyle.fontWeight]}>无</Text>)
                                }
                            </View>
                            <View style={[styles.ItemTextBox,styles.ItemTextBoxLast]}>
                                <Text style={[styles.ItemText,SettingStyle.fontWeight]}>商业保险：</Text>
                                {
                                    data.isCommercialInsurance===1?(<Text style={[styles.ItemText,SettingStyle.fontWeight]}>有</Text>):(<Text style={[styles.ItemText,SettingStyle.fontWeight]}>无</Text>)
                                }
                            </View>
                        </View>
                    </View>

                    {/*<Modal*/}
                        {/*animationType="fade"*/}
                        {/*transparent={true}*/}
                        {/*style={SettingStyle.alert}*/}
                        {/*visible={this.state.modalVisible}*/}
                        {/*onRequestClose={() => {*/}
                            {/*alert("Modal has been closed.");*/}
                        {/*}}>*/}
                        {/*<View style={{ marginTop:1}}>*/}
                            {/*<View style={{flexDirection:'row',alignItems:'center',}}>*/}
                                {/*<Text style={SettingStyle.alertTitle}>温馨提示</Text>*/}
                                {/*<TouchableOpacity*/}
                                    {/*onPress={() => {this.setState({ modalVisible: false });}}>*/}
                                    {/*<Image source={require('../../../images/home/Group.png')}/>*/}
                                {/*</TouchableOpacity>*/}
                            {/*</View>*/}
                            {/*<View style={SettingStyle.alertContent}>*/}
                                {/*<Image source={require('../../../images/home/charge.png')}/>*/}
                                {/*<Text style={[SettingStyle.alertContentText,SettingStyle.font18]}>您的余额不足，请充值</Text>*/}
                            {/*</View>*/}
                            {/*<View style={SettingStyle.btnBox}>*/}
                                {/*<TouchableOpacity style={[SettingStyle.alertBtn,SettingStyle.btnCancel]}*/}
                                                  {/*onPress={() => {this.setState({ modalVisible: false });}}>*/}
                                    {/*<Text style={SettingStyle.btnCancelText}>取消</Text>*/}
                                {/*</TouchableOpacity>*/}
                                {/*<TouchableOpacity style={[SettingStyle.alertBtn,SettingStyle.btnConfirm]}*/}
                                                  {/*onPress={() => this.confirm()}>*/}
                                    {/*<Text style={SettingStyle.btnConfirmText}>确定</Text>*/}
                                {/*</TouchableOpacity>*/}
                            {/*</View>*/}
                        {/*</View>*/}
                    {/*</Modal>*/}
                    {
                        this.state.type === 1 ? (
                            <View>
                                {
                                    data.state===1?(
                                        <TouchableOpacity style={styles.buttonBox} onPress={()=>this.take()}>
                                            <Text style={[styles.btnText,SettingStyle.fontWeight,{fontSize:20}]}>立即抢单</Text>
                                            <Text style={[styles.btnText,SettingStyle.fontWeight,{fontSize:14}]}>￥{data.belongToMoney}</Text>
                                        </TouchableOpacity>
                                    ):(
                                        <TouchableOpacity style={styles.buttonBox}>
                                            <Text style={[styles.btnText,SettingStyle.fontWeight,{fontSize:20}]}>已结束</Text>
                                            {/*<Text style={[styles.btnText,SettingStyle.fontWeight,{fontSize:14}]}>￥{data.belongToMoney}</Text>*/}
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        ) : (
                            <TouchableOpacity style={styles.buttonBox}>
                                <Text style={[styles.btnText,SettingStyle.fontWeight,{fontSize:20}]}>已抢单</Text>
                                {/*<Text style={[styles.btnText,SettingStyle.fontWeight,{fontSize:14}]}>￥{data.belongToMoney}</Text>*/}
                            </TouchableOpacity>
                        )
                    }
                </ScrollView>
            </View>
        )
    }
}