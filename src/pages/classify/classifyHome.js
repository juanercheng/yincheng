/**
 * Created by juaner by 18-07-24
 */
import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    FlatList,
    TouchableOpacity,
    ImageBackground,
    DeviceEventEmitter,
    Platform
} from 'react-native';
import { Toast,WhiteSpace} from 'antd-mobile-rn';

import styles from './classifyStyle';
import stylesHome from './../home/HomeStyle'
import SettingStyle from './../../js/SettingStyle'

import api from './../../js/api';
import Http from './../../js/HttpUtils'
import dateChange from './../../js/dateChange';

import LoginView from './../common/LoginView';  //正在加载
import NoDataView from './../common/NoDataView';  //列表数据加载完毕
import LoadingDataView from './../common/LoadingDataView';  //正在加载
import ErrorView from './../common/ErrorView';
import customerDetails from "./customerDetails";
import Util from "../../js/util";

let pageNo = 1;//当前第几页
let totalElements;//总的页数
export default class classifyHome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            refreshing: false,
            error: false,
            dataArray: [],
            pageSize:5,
            msg:null,
            showFoot:2, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        };
    }

    //componentDidMount 执行一次，在初始化render之前执行，如果在这个方法内调用setState，render()知道state发生变化，并且只执行一次
    componentDidMount(){
        this.fetchData();
        DeviceEventEmitter.addListener('ListRefresh',(dic)=>{
            this.fetchData();
        });
    }

    //在组件销毁的时候要将其移除
    componentWillUnmount(){
        pageNo = 1
    }

    //跳转到详情
    _next(name,id,type) {
        console.log(id);
        const navigation = this.props.navigation;
        navigation.navigate(name,{
            Id:id,
            Type:type
        });
    }

    fetchData(){
        let _this = this;
        let params ={
            pageCurrent:pageNo,
            pageSize:_this.state.pageSize,
        };
        Http.post(api.customer.listByMy, params).then((res) => {
            console.log(res,'res');
            if (res.code === 0) {
                _this._data = res.object;
                let data =  _this._data;
                totalElements = data.length;
                let dataBlob = [];

                if(data.length>0){
                    data.map(function (item) {
                        dataBlob.push(item)
                    });
                }

                if( pageNo === 1){
                    _this.setState({
                        loading: false,
                        dataArray: dataBlob
                    })
                }else{
                    _this.setState({
                        dataArray:_this.state.dataArray.concat(dataBlob),
                        loading: false,
                    })
                }

                if(pageNo===1&&totalElements===0){
                    _this.setState({showFoot:0})
                } else{
                    if( totalElements <_this.state.pageSize){
                        _this.setState({showFoot:1});
                    }
                }
                console.log(_this.state.showFoot)

                data = null;
                dataBlob = null;

            }else if(res.code===101) {
                Toast.info(res.msg,6)
                setTimeout(function () {
                    _this.props.navigation.replace('LoginIndex');
                },6000)
            }else {
                _this.setState({
                    error:true,
                    msg:res.msg
                })
            }
        }, (err) => {
            console.log(err)
        })
    }

    render() {
        if (this.state.loading && !this.state.error) {
            return <LoginView/>
        }else{
            return this.renderView();
        }
    }

    renderView() {
        return (
            <View style={[SettingStyle.bodyColor,this.state.dataArray.length>0?{paddingBottom:74}:{paddingBottom:0}]}>
                <ImageBackground  style={Platform.OS === 'ios'?SettingStyle.headerbgIos:SettingStyle.headerbg}
                                 source={require('../../../images/header/headerbg.png')} resizeMode='cover'>
                    <View searchBar rounded style={SettingStyle.header}>
                        <Text style={[SettingStyle.headerText,{ backgroundColor:'rgba(0,0,0,0)'}]}>客户</Text>
                    </View>
                </ImageBackground>
                {
                    !this.state.error?(
                        <FlatList
                            data={this.state.dataArray}
                            //使用 ref 可以获取到相应的组件
                            //ref={(flatList) => this._flatList = flatList}
                            //ListHeaderComponent={this._header}//header头部组件
                            ListFooterComponent={this._renderFooter.bind(this)}
                            // ItemSeparatorComponent={ItemDivideComponent}//分割线组件
                            //空数据视图,可以是React Component,也可以是一个render函数，或者渲染好的element。
                            // ListEmptyComponent={this.createEmptyView()}
                            keyExtractor={this._keyExtractor}
                            //是一个可选的优化，用于避免动态测量内容尺寸的开销，不过前提是你可以提前知道内容的高度。
                            //如果你的行高是固定的，getItemLayout用起来就既高效又简单.
                            //注意如果你指定了SeparatorComponent，请把分隔线的尺寸也考虑到offset的计算之中
                            //getItemLayout={(data, index) => ( {length: 44, offset: (44 + 1) * index, index} )}
                            //决定当距离内容最底部还有多远时触发onEndReached回调。
                            //注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                            onEndReachedThreshold={0.5}
                            //当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用
                            onEndReached={this._onEndReached.bind(this)}
                            //下拉刷新
                            refreshing={this.state.refreshing}
                            onRefresh={() => this._onRefresh()}
                            //渲染列表数据
                            renderItem={({ item ,index}) => this._renderItem(item,index)}
                        />
                    ):(
                        <View style={{justifyContent:'center',marginTop:'40%'}}>
                            <Text style={{textAlign:'center',color:'#666'}}>
                                {this.state.msg}
                            </Text>
                        </View>
                    )
                }

            </View>
        );
    }

    _renderFooter(){
        if (this.state.showFoot === 1) {
            return (
                <NoDataView />
            );
        } else if(this.state.showFoot === 2) {
            return (
                <LoadingDataView />
            );
        } else if(this.state.showFoot === 0){
            return (
                <View style={{alignItems:'center'}}>
                    <Text style={[{color:'#999',marginTop:Util.size.height*0.2},SettingStyle.font14]}>暂无数据</Text>
                </View>
            );
        }
    };

    createEmptyView() {
        return (
            <View style={{alignItems:'center'}}>
                <Text style={[{color:'#999',marginTop:Util.size.height*0.2},SettingStyle.font14]}>暂无数据</Text>
            </View>
        );
    };

    _onRefresh=()=>{
        pageNo=1;
        if(!this.state.refreshing){
            this.fetchData(pageNo);
        }
    };

    _onEndReached(){
        if(this.state.showFoot === 1 || this.state.showFoot === 0){
            return ;
        }
        this.setState({showFoot:2});
        pageNo++;
        //获取数据
        this.fetchData( pageNo );
    }

    //此函数用于为给定的item生成一个不重复的key
    //若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标index。
    _keyExtractor = (item, index) => index;

    _renderItem = (value, index) => {
        return (
            <View style={[stylesHome.listItemBox,index===0?{marginTop:0}:{marginTop:15}]}>
                <TouchableOpacity onPress={()=>this._next('customerDetails',value.id,2)}>
                    <View style={stylesHome.listItemName}>
                        <View style={[SettingStyle.row,stylesHome.ss]}>
                            <Text style={[SettingStyle.font18,SettingStyle.fontWeight]}>{value.name}</Text>
                            <View style={stylesHome.userStatus}>
                                {
                                    value.isRealName===1?(
                                        <Text style={[SettingStyle.font10,{color:'#fff'}]}>已实名</Text>
                                    ):(
                                        <Text style={[SettingStyle.font10,{color:'#fff'}]}>未实名</Text>
                                    )
                                }
                            </View>
                        </View>
                        <Text style={stylesHome.time}>{dateChange(value.createTime)} 前</Text>
                    </View>
                    <View style={[SettingStyle.row,stylesHome.listItemTime]}>
                        <View style={[SettingStyle.row,stylesHome.listItemTimeCon]}>
                            <Image style={stylesHome.homeIcon} source={require('../../../images/home/dk.png')}/>
                            <Text style={[SettingStyle.font18,SettingStyle.fontWeight]}  ellipsizeMode='tail' numberOfLines={1}>贷款期限{value.loanOverMonth}个月</Text>
                        </View>
                        <View  style={[SettingStyle.row,stylesHome.listItemTimeCon]}>
                            <Image style={stylesHome.homeIcon} source={require('../../../images/home/jine.png')}/>
                            <Text  style={[SettingStyle.font18,SettingStyle.fontWeight]}  ellipsizeMode='tail' numberOfLines={1}>金额{value.loanMoney}元</Text>
                        </View>
                    </View>
                    <View style={[stylesHome.listItemInfo]}>
                        <View style={[SettingStyle.row,stylesHome.listItemInfoLi]}>
                            <Text style={[SettingStyle.font14,SettingStyle.fontWeight,stylesHome.listItemInfoLicon]}  ellipsizeMode='tail' numberOfLines={1}>月收入{value.monthlyIncome}元</Text>
                            <View style={[SettingStyle.row,stylesHome.listItemInfoLis]}>
                                <Image style={stylesHome.lovationIcon} source={require('../../../images/home/location1.png')}/>
                                <Text style={[SettingStyle.font14,SettingStyle.fontWeight]}  ellipsizeMode='tail' numberOfLines={1}>所在地区：{value.locationCityName}</Text>
                            </View>
                        </View>
                        <View style={[SettingStyle.row,stylesHome.listItemInfoLi]}>
                            <Text style={[SettingStyle.font14,SettingStyle.fontWeight,stylesHome.listItemInfoLicon]}  ellipsizeMode='tail' numberOfLines={1}>行业：{value.vocationName }</Text>
                            <View style={[SettingStyle.row,stylesHome.listItemInfoLis]}>
                                <Image style={stylesHome.lovationIcon} source={require('../../../images/home/location1.png')}/>
                                <Text style={[SettingStyle.font14,SettingStyle.fontWeight]}  ellipsizeMode='tail' numberOfLines={1}>户籍地址：{value.hometownCityName}</Text>
                            </View>
                        </View>
                        <View style={[SettingStyle.row,stylesHome.listItemAction]}>
                            <View style={[SettingStyle.row,{flexWrap:'wrap'}]}>
                                {
                                    value.isHouseProperty ===1?(
                                        <View style={stylesHome.labelBox}><Text style={[stylesHome.label ]}>房产</Text></View>
                                    ):null
                                }
                                {
                                    value.isCarProperty ===1?(
                                        <View style={stylesHome.labelBox}><Text style={[stylesHome.label ]}>车产</Text></View>
                                    ):null
                                }
                                {
                                    value.isSspf ===1?(
                                        <View style={stylesHome.labelBox}><Text style={[stylesHome.label ]}>社保公积金</Text></View>
                                    ):null
                                }
                                {
                                    value.isCommercialInsurance  ===1?(
                                        <View style={stylesHome.labelBox}><Text style={[stylesHome.label ]}>商业保险</Text></View>
                                    ):null
                                }
                                {
                                    value.isParticleLoan ===1?(
                                        <View style={stylesHome.labelBox}><Text style={[stylesHome.label ]}>微粒贷</Text></View>
                                    ):null
                                }
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        )
    };
}
