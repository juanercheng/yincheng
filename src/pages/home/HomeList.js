/**
 * Created by juaner by 18-03-27
 */
import React, { Component } from 'react';
import {Alert, Text , View, Platform, FlatList, Image, ImageBackground, TouchableOpacity, ViewPagerAndroid, ScrollView, ListView, TouchableHighlight,}from 'react-native';
import { Toast,  WhiteSpace, WingBlank,  Modal,} from 'antd-mobile';

import LoginView from './../common/LoginView'
import NoDataView from './../common/NoDataView';
import LoadingDataView from './../common/LoadingDataView';
import ErrorView from './../common/ErrorView';

import SettingStyle from './../../js/SettingStyle';
import styles from './HomeStyle'
import http from './../../js/http';
import api from "../../js/api";
import global from "../../js/global";

const Url = 'order/findMyOrderList';
let pageNo = 1;//当前第几页
let totalElements;//总的页数

export  default class HomeList extends Component{

    constructor(props){
        super(props);
        this.state = {
            loaded: false,
            refreshing: false,
            error: false,
            dataArray: [],
            Type:this.props.Type||null,
            showFoot:0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
        };
    }
    componentDidMount(){
        this.fetchData(pageNo);
    }

    componentWillUnmount(){
        pageNo = 1
    }

    fetchData(pageNo) {
        let params ={
            orderState:1,
            orderType:'',
            pageCurrent:pageNo,
            pageSize:10,
        };
        let _this = this;
        http.getData( Url,params,
            function(res){
                if(res.code===0){
                    _this._data = res.object;
                    console.log(res);

                    let data =  _this._data;
                    let dataBlob = [];
                    if(data.length>0){
                        data.map(function (item) {
                            dataBlob.push(item)
                        });
                    }

                    if( pageNo === 1){
                        _this.setState({
                            loaded: true,
                            dataArray: dataBlob
                        })
                    }else{
                        _this.setState({
                            dataArray:_this.state.dataArray.concat(dataBlob),
                            loaded: true,
                        })
                    }

                    totalElements = data.length;
                    if( totalElements <10){
                        _this.setState({showFoot:1});
                    }
                    data = null;
                    dataBlob = null;
                }
            }
        )
    }

    render(){
        if (!this.state.loaded && !this.state.error) {
            return <LoginView/>
        } else if (this.state.error) {
            //请求失败view
            return <ErrorView/>
        }
        return (
            <View>
                <FlatList
                    data={this.state.dataArray}

                    //使用 ref 可以获取到相应的组件
                    //ref={(flatList) => this._flatList = flatList}
                    //ListHeaderComponent={this._header}//header头部组件

                    ListFooterComponent={this._renderFooter.bind(this)}

                    //ItemSeparatorComponent={ItemDivideComponent}//分割线组件

                    //空数据视图,可以是React Component,也可以是一个render函数，或者渲染好的element。
                    ListEmptyComponent={this.createEmptyView()}

                    keyExtractor={this._keyExtractor}

                    //是一个可选的优化，用于避免动态测量内容尺寸的开销，不过前提是你可以提前知道内容的高度。
                    //如果你的行高是固定的，getItemLayout用起来就既高效又简单.
                    //注意如果你指定了SeparatorComponent，请把分隔线的尺寸也考虑到offset的计算之中
                    //                      getItemLayout={(data, index) => ( {length: 44, offset: (44 + 1) * index, index} )}

                    //决定当距离内容最底部还有多远时触发onEndReached回调。
                    //注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                    onEndReachedThreshold={1}
                    //当列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用
                    onEndReached={this._onEndReached.bind(this)}

                    //下拉刷新
                    refreshing={this.state.refreshing}
                    onRefresh={() => this._onRefresh()}
                    //渲染列表数据
                    renderItem={({ item ,index}) => this._renderItem(item,index)}
                />
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
                <View style={styles.footer}>
                    <Text></Text>
                </View>
            );
        }
    };

    createEmptyView() {
        return (
            <View style={{backgroundColor:'#ddd',height:'100%'}}>
                <View style={{backgroundColor:'#ddd',alignItems:'center',paddingTop:50}}>
                    <Text style={[{color:'#999',marginTop:25},SettingStyle.font14]}>没有相关订单</Text>
                </View>
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
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot != 0 ){
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
        let busOrderDetailsVoList = value.busOrderDetailsVoList;
        return (
            <View style={styles.content}>
                <View style={styles.Item}>
                    <TouchableOpacity onPress={()=>this.props.nextClick('OrderDetails', value.orderNo,value.orderState)}>
                        <View style={styles.NoBox}>
                            <Text style={[SettingStyle.font14,styles.Color99]}>订单编号：{value.orderNo}</Text>
                            <Text style={SettingStyle.font14}>待发货</Text>
                        </View>
                        <View style={busOrderDetailsVoList.length<=1?styles.center:styles.center1}>
                            {
                                busOrderDetailsVoList.length<=1?(
                                    busOrderDetailsVoList.map(function (item,index) {
                                        return(
                                            <View key={index} style={styles.center}>
                                                <Image  source={{uri: item.picture}}
                                                        style={styles.listLeft}/>
                                                <View style={styles.listRight}>
                                                    <Text style={[SettingStyle.font14,{marginBottom:11}]}
                                                        ellipsizeMode='tail' numberOfLines={2}>{item.productName }</Text>
                                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                                        <Text style={[SettingStyle.font14,styles.Color99]}>规格：{item.standardName}</Text>
                                                        <Text style={[SettingStyle.font14,styles.Color99,{marginRight:10}]}>x {item.productNumber}</Text>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                    })
                                ):(
                                    busOrderDetailsVoList.map(function (item,index) {
                                        if(index<=4){
                                            return(
                                                <Image  source={{uri: item.picture}} key={index}
                                                        style={[styles.listLeft,{marginRight:10}]}/>
                                            )
                                        }

                                    })

                                )
                            }
                        </View>
                    </TouchableOpacity>                    
                    <Text style={{textAlign:'right',marginRight:15,marginBottom:12.5}}>共{busOrderDetailsVoList.length}件商品 合计: ￥{value.orderTotalPirce}</Text>
                </View>
            </View>
        )
    };

}
