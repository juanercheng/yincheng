/**
 * Created by chengjuan by 18-07-24
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
    ImageBackground,
    AppState,
    NetInfo,
    Text,
    ListView,
    TouchableHighlight,
} from 'react-native';
import { Toast,WhiteSpace } from 'antd-mobile-rn';

import styles from './HomeStyle';
import SettingStyle from './../../js/SettingStyle'
import api from './../../js/api';
import Http from './../../js/HttpUtils';
import dateChange from './../../js/dateChange';
import './../../js/storage'

import LoginView from './../common/LoginView'
import ErrorView from './../common/ErrorView'
import NoDataView from './../common/NoDataView';
import LoadingDataView from './../common/LoadingDataView';
import Util from "../../js/util";
// import HomeList from './HomeList'
storage.save({
    key: 'History',
    data: 'storage'
});
let totalElements;//总的页数
let watchID = null;
// let pageNo = 1
export default class HomeContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            cityName:'定位',
            error: false,
            Tab:[{name:'全部',remarks:'',isSelected:true}],
            longitude:108.95200333333332,
            latitude:34.332,
            Type:1,
            isVisible: false,
            newsNum:null,
            dataArray:[],
            showFoot:2, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            refreshing: false,
            isConnected:true,
            pageNo:1,
            pageSize:5,
            customerState:'',
            customerType:'',
            cityId:null,
            orderType:'全部订单'
        };
    }

    componentDidMount(){
        // console.log(this.props.navigation.state.params)
        if (this.props.navigation.state.params !==undefined) {
            this.setState({
                cityName:this.props.navigation.state.params.cityName
            })
            let cityName = {
                name:this.props.navigation.state.params.cityName
            }
            let _this = this
            Http.get(api.cfg.infaddressCityList, cityName).then((res) => {
                this.setState({
                    cityId:res.object[0].id
                },function () {
                    _this.fetchData()
                })
            })
        }else {
            this._location()
        }
        //监测位置变化
        // this.beginWatch();

        this.menuList();
        //监听网络状态改变
        NetInfo.addEventListener('change', this.handleConnectivityChange);
        //监听抢单是否成功，成功之后刷新列表
        DeviceEventEmitter.addListener('ListRefresh',(dic)=>{this._location();});
        //监听返回按钮，跳转到页面顶部
        DeviceEventEmitter.addListener('scrollToTop',(dic)=>{this._flatList.scrollToIndex({viewPosition: 0,index: 0});this.setState({isVisible: false});});
    }

    //在组件销毁的时候要将其移除
    componentWillUnmount(){
        let _this = this
        _this.setState({
            pageNo:1,
            isVisible: false,
        });
        _this.stopWatch()
        NetInfo.removeEventListener('change', _this.handleConnectivityChange);
    };

    //路由跳转及传参
    endClick(routName,id,type) {
        const { navigate } = this.props.navigation;
        navigate( routName ,{
            Id:id,
            Type:type
        })
    }

    //开始监听位置变化
    // beginWatch() {
    //     watchID = navigator.geolocation.watchPosition(
    //         location => {
    //             var result = "速度：" + location.coords.speed +
    //                 "\n经度：" + location.coords.longitude +
    //                 "\n纬度：" + location.coords.latitude +
    //                 "\n准确度：" + location.coords.accuracy +
    //                 "\n行进方向：" + location.coords.heading +
    //                 "\n海拔：" + location.coords.altitude +
    //                 "\n海拔准确度：" + location.coords.altitudeAccuracy +
    //                 "\n时间戳：" + location.timestamp;
    //             alert(result);
    //             this.setState({
    //                 loading:true,
    //                 error:false
    //             });
    //             this._location();
    //         },
    //         error => {
    //             console.log("获取位置失败："+ error)
    //         }
    //     );
    // }
    //停止监听位置变化
    stopWatch() {
        navigator.geolocation.clearWatch(watchID);
    }

    handleConnectivityChange(status) {
        console.log('status change:' + status);
        // if(status!=='NONE'){
        //     this._location();
        // }
        // this._location();
    }

    //定位
    _location(){
        let _this = this
        navigator.geolocation.getCurrentPosition(
            position => {
                let longitude = JSON.stringify(position.coords.longitude);//经度
                let latitude = JSON.stringify(position.coords.latitude);//纬度
                var aaa = "经度：" + longitude + "\n纬度：" + latitude
                let params;
                if (this.props.navigation.state.params === undefined){
                    params = {
                        longitude:_this.state.longitude,
                        latitude:_this.state.latitude,
                        distance:10000
                    };
                }else{
                    params = {
                        cityId:this.props.navigation.state.params.cityid
                    };
                    this.setState({
                        cityName:this.props.navigation.state.params.cityname
                    })
                }
                // params={
                //     pageCurrent:pageNo,
                //     pageSize:_this.state.pageSize,
                //     type:'',
                //     state:'',
                //     token:''
                // }
                //这是获取当前所在城市的接口
                fetch('https://api.map.baidu.com/geocoder/v2/?output=json&ak=cDCkkEQi3R9SjxEOxUI70liDMGiGzNO0&location='+this.state.latitude+','+this.state.longitude+'&qq-pf-to=pcqq.c2c')
                .then((response) => response.json())
                .then((responseJson) => {
                    // console.log(responseJson.result.addressComponent.city);
                    if(responseJson.status===0){
                        this.setState({
                            cityName:responseJson.result.addressComponent.city,
                            loading:false,
                        },function () {
                            let cityName = {
                                name:responseJson.result.addressComponent.city
                            }
                            Http.get(api.cfg.infaddressCityList, cityName).then((res) => {
                                this.setState({
                                    cityId:res.object[0].id
                                },function () {
                                    _this.fetchData()
                                })
                            })
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            },
            (error) =>{
                console.log(error);
                _this.setState({
                    loading:false,
                    error:true
                });
            },
            {enableHighAccuracy: true, timeout: 5000, maximumAge: 1000}
        );
    }

    menuList(){
        let _this = this
        let params = {
            code:'TYPE_ORDER',
        };
        Http.get(api.cfg.dictInfo, params).then((res) => {
            if (res.code === 0){
                let data = res.object
                for (var i in data){
                    data[i].isSelected=false
                }
                _this.setState({
                    Tab:_this.state.Tab.concat(data)
                })
            }
        },(error)=>{
            console.log(error)
        })

        //消息数量统计
        let params1 = {
            type:'',
        }
        Http.get(api.news.countByUnread, params1).then((res) => {
            if (res.code === 0){
                let data = res.object
                _this.setState({
                    newsNum:data
                })
            }
        },(error)=>{
            console.log(error)
        })
    }

    fetchData() {
        //获取数据
        let _this = this
        let params = {
            pageCurrent:_this.state.pageNo,
            pageSize:_this.state.pageSize,
            type:_this.state.customerType,
            state:_this.state.customerState,
            // city:_this.state.cityId,
            city:'',
        };
        console.log(params)
        Http.post(api.customer.customerList, params).then((res) => {
            if (res.code === 0){
                _this._data = res.object;
                let data =  _this._data;
                totalElements = data.length;
                let dataBlob = [];

                if(data.length>0){
                    data.map(function (item) {
                        dataBlob.push(item)
                    });
                    
                }

                if(  this.state.pageNo === 1){
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

                if(this.state.pageNo===1&&totalElements===0){
                    _this.setState({showFoot:0})
                } else{
                    if( totalElements <_this.state.pageSize){
                        _this.setState({showFoot:1});
                    }
                }

                data = null;
                dataBlob = null;
            }else if(res.code===101) {
                Toast.info(res.msg,6)
                setTimeout(function () {
                    _this.props.navigation.replace('LoginIndex');
                },6000)
            }else {
                _this.setState({
                    error:false
                })
            }
        },(error)=>{
            console.log(error)
        })
    }

    //下拉选择订单
    showSpinner() {
        this.setState({
            isVisible: !this.state.isVisible,
        });
    }

    //下拉列表每一行点击事件
    onItemClick(val,name) {
        // pageNo = 1
        let _this = this
        _this.setState({
            customerState:val,
            isVisible: false,
            dataArray:[],
            orderType:name,
            pageNo:1,
            showFoot:2,
            // loading: true
        },function () {
            _this.fetchData()
        });
    }

    //tabs切换
    tabClick (index, item){
        let _this = this
        let array = _this.state.Tab;
        for (let i = 0; i < array.length; i++) {
            let item = array[i];
            item.isSelected = false;
            if (i === index) {
                item.isSelected = true;
            }
        }
        this.setState({
            dataArray:[],
        })
        // pageNo = 1
        _this.setState({
            Tab: this.state.Tab,
            customerType:item.remarks,
            pageNo:1,
            showFoot:2,
            isVisible: false,
            // loading: true
        },function () {
            _this.fetchData()
        })
    }
    //END tabs切换

    render() {
        if (this.state.loading && !this.state.error) {
            return <LoginView/>
        }else{
            return this.renderView();
        }
    }

    //主内容
    renderView() {
        let _this = this
        return (
            <View style={[this.state.error?{backgroundColor:'transparent',height:Util.size.height,}:this.state.dataArray.length!==0?SettingStyle.bodyColor:{backgroundColor:'#fff',height:Util.size.height}]}>
                <ImageBackground style={Platform.OS === 'ios'?SettingStyle.headerbgIos:SettingStyle.headerbg}
                                 source={require('../../../images/header/headerbg.png')} resizeMode='cover'>
                    <View searchBar rounded style={styles.header}>
                        <TouchableOpacity onPress={()=>this.endClick('locationProvince',this.state.cityName)}
                                          style={{flexDirection:'row',alignItems:'center'}}>
                            <Image source={require('../../../images/header/location.png')}
                                   style={{marginRight: 9.5}}/>
                            <Text style={[SettingStyle.font12,styles.headerText,{backgroundColor:'rgba(0,0,0,0)'}]}
                                  ellipsizeMode='tail' numberOfLines={1}>{this.state.cityName}</Text>
                            <Image source={require('../../../images/header/xiala.png')}
                                   style={{marginLeft: 5}}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={()=>this.endClick('news')}
                            style={{position:'relative',flexDirection:'row',alignItems:'center'}}>
                            <Image source={require('../../../images/header/xiaoxi.png')}
                                   style={{marginRight: 8}}/>
                            {
                                this.state.newsNum!==0?(<Image style={styles.newsInco} source={require('./../../../images/header/news.png')}/>):null
                            }
                            <Text style={[SettingStyle.font12,styles.headerText,{backgroundColor:'rgba(0,0,0,0)',color:'#ffffff'}]}>消息</Text>
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
                {
                    !this.state.error?(
                        this.state.isConnected?(
                            <View style={Platform.OS === 'ios'?{height:Util.size.height*0.8+44}:{height:Util.size.height*0.82}}>
                                <View style={{flexDirection:'row'}}>
                                    {
                                        _this.renderTopic()
                                    }
                                    <View style={styles.select}>
                                        <TouchableOpacity onPress={()=>_this.showSpinner()}
                                            style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                            <Text style={[SettingStyle.font12,SettingStyle.fontWeight,{marginRight:2,paddingLeft:12,}]}>{this.state.orderType}</Text>
                                            <Image source={_this.state.isVisible?require('../../../images/home/select1.png'):require('../../../images/home/select.png')} />
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        this.state.isVisible?(
                                            <View style={styles.selectBox}>
                                                <TouchableOpacity  onPress={()=>_this.onItemClick('','全部订单')}>
                                                    <Text style={[styles.selectItem,styles.selectItem1,SettingStyle.font12,SettingStyle.fontWeight]}>全部订单</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity   onPress={()=>_this.onItemClick(1,'可抢订单')}>
                                                    <Text style={[styles.selectItem,SettingStyle.font12,SettingStyle.fontWeight]}>可抢订单</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ):null
                                    }
                                </View>
                                {
                                    _this.renderListView()
                                }
                            </View>
                        ):(
                            <View style={{justifyContent:'center',marginTop:'40%'}}>
                                <Text style={{textAlign:'center',color:'#666'}}>
                                    网络不可用，请检查联网状态后再重试
                                </Text>
                            </View>
                        )
                        ):(
                        <View style={{justifyContent:'center',marginTop:'40%'}}>
                            <Text style={{textAlign:'center',color:'#666'}}>
                                无法定位当前位置，请开启GPS定位
                            </Text>
                        </View>
                    )
                }
            </View>
        );
    }
    //END主内容

    //顶部tab渲染
    renderTopic() {
        return (
            <View style={styles.topic}>
                <FlatList
                    data={this.state.Tab}
                    keyExtractor={(item, index) => index}
                    renderItem={this.renderTopicItem}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    extraData={this.state}
                />
            </View>
        )
    }
    renderTopicItem = ({ index,item }) => {
        let _this = this
        return (
            <TouchableOpacity style={item.isSelected?styles.topicItemActive:styles.topicItem}
                              key={index}
                              onPress={()=>_this.tabClick(index,item)} >
                <Text style={item.isSelected?styles.Active:styles.topicTitle} >{item.name}</Text>
            </TouchableOpacity>
        )
    }
    //END顶部tab渲染

    //列表渲染
    renderListView(){
        return(
            <FlatList
                data={this.state.dataArray}
                //使用 ref 可以获取到相应的组件
                ref={(flatList) => this._flatList = flatList}
                //ListHeaderComponent={this._header}//header头部组件
                ListFooterComponent={this._renderFooter.bind(this)}
                //ItemSeparatorComponent={ItemDivideComponent}//分割线组件
                //空数据视图,可以是React Component,也可以是一个render函数，或者渲染好的element。
                // ListEmptyComponent={this._createEmptyView()}
                keyExtractor={this._keyExtractor}
                //是一个可选的优化，用于避免动态测量内容尺寸的开销，不过前提是你可以提前知道内容的高度。
                //如果你的行高是固定的，getItemLayout用起来就既高效又简单.
                //注意如果你指定了SeparatorComponent，请把分隔线的尺寸也考虑到offset的计算之中
                // getItemLayout={(data, index) => ( {length: 44, offset: (44 + 1) * index, index} )}
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
        )
    }
    _renderFooter(){
        if (this.state.showFoot === 1) {
            return (
                <NoDataView/>
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
    _createEmptyView(){
        return (
            <View>
                <Text style={[{color:'#999',marginTop:25,textAlign:'center'},SettingStyle.font14]}>暂无数据</Text>
            </View>
        );
    };
    _onRefresh=()=>{
        let _this = this
        _this.setState({
            pageNo:1,
            dataArray:[],
            showFoot:0,
            isVisible: false,
        },function () {
            _this.fetchData()
        })
        // pageNo = 1
        // this.fetchData();
    };
    _onEndReached(){
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot === 1 || this.state.showFoot === 0){
            return ;
        }
        this.setState({showFoot:2})
        let _this = this
        _this.setState({pageNo:_this.state.pageNo+1},function () {
            _this.fetchData()
        })
    }
    //此函数用于为给定的item生成一个不重复的key
    //若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标index。
    _keyExtractor = (item, index) => index;
    _renderItem = (value, index) => {
        return (
            <View style={[styles.listItemBox ]}>
                <TouchableOpacity onPress={()=>this.endClick('customerDetails',value.id,1)}>
                    <View style={styles.listItemName}>
                        <View style={[SettingStyle.row,styles.ss]}>
                            <Text style={[SettingStyle.font18,SettingStyle.fontWeight]}>{value.name}</Text>
                            <View style={styles.userStatus}>
                                {
                                    value.isRealName===1?(
                                        <Text style={[SettingStyle.font10,{color:'#fff'}]}>已实名</Text>
                                    ):(
                                        <Text style={[SettingStyle.font10,{color:'#fff'}]}>未实名</Text>
                                    )
                                }
                            </View>
                        </View>
                        <Text style={styles.time}>{dateChange(value.createTime)} 前</Text>
                    </View>
                </TouchableOpacity>
                <View style={[SettingStyle.row,styles.listItemTime]}>
                    <View style={[SettingStyle.row,styles.listItemTimeCon]}>
                        <Image style={styles.homeIcon} source={require('../../../images/home/dk.png')}/>
                        <Text style={[SettingStyle.font18,SettingStyle.fontWeight]}  ellipsizeMode='tail' numberOfLines={1}>贷款期限{value.loanOverMonth}个月</Text>
                    </View>
                    <View  style={[SettingStyle.row,styles.listItemTimeCon]}>
                        <Image style={styles.homeIcon} source={require('../../../images/home/jine.png')}/>
                        <Text  style={[SettingStyle.font18,SettingStyle.fontWeight]}  ellipsizeMode='tail' numberOfLines={1}>金额{value.loanMoney}元</Text>
                    </View>
                </View>

                <View style={[styles.listItemInfo]}>
                    <TouchableOpacity onPress={()=>this.endClick('customerDetails',value.id,1)}>
                        <View style={[SettingStyle.row,styles.listItemInfoLi]}>
                            <Text style={[SettingStyle.font14,SettingStyle.fontWeight,styles.listItemInfoLicon]}  ellipsizeMode='tail' numberOfLines={1}>月收入{value.monthlyIncome}元</Text>
                            <View style={[SettingStyle.row,styles.listItemInfoLis]}>
                                <Image style={styles.lovationIcon} source={require('../../../images/home/location1.png')}/>
                                <Text style={[SettingStyle.font14,SettingStyle.fontWeight]}  ellipsizeMode='tail' numberOfLines={1}>所在地区：{value.locationCityName}</Text>
                            </View>
                        </View>
                        <View style={[SettingStyle.row,styles.listItemInfoLi]}>
                            <Text style={[SettingStyle.font14,SettingStyle.fontWeight,styles.listItemInfoLicon]}  ellipsizeMode='tail' numberOfLines={1}>行业：{value.vocationName }</Text>
                            <View style={[SettingStyle.row,styles.listItemInfoLis]}>
                                <Image style={styles.lovationIcon} source={require('../../../images/home/location1.png')}/>
                                <Text style={[SettingStyle.font14,SettingStyle.fontWeight]}  ellipsizeMode='tail' numberOfLines={1}>户籍地址：{value.hometownCityName}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <View style={[SettingStyle.row,styles.listItemAction]}>
                        <View style={[SettingStyle.row,{flexWrap:'wrap',maxWidth:'60%'}]}>
                            {
                                value.isHouseProperty ===1?(
                                    <View style={styles.labelBox}><Text style={[styles.label ]}>房产</Text></View>
                                ):null
                            }
                            {
                                value.isCarProperty ===1?(
                                    <View style={styles.labelBox}><Text style={[styles.label ]}>车产</Text></View>
                                ):null
                            }
                            {
                                value.isSspf ===1?(
                                    <View style={styles.labelBox}><Text style={[styles.label ]}>社保公积金</Text></View>
                                ):null
                            }
                            {
                                value.isCommercialInsurance  ===1?(
                                    <View style={styles.labelBox}><Text style={[styles.label ]}>商业保险</Text></View>
                                ):null
                            }
                            {
                                value.isParticleLoan ===1?(
                                    <View style={styles.labelBox}><Text style={[styles.label ]}>微粒贷</Text></View>
                                ):null
                            }
                        </View>
                        {
                            value.state===1?(
                                <TouchableOpacity onPress={()=>this.endClick('customerDetails',value.id,1)}>
                                    <Text style={[styles.jiedan1,SettingStyle.fontWeight,{backgroundColor:'rgba(0,0,0,0)'}]}>可接单</Text>
                                </TouchableOpacity>
                            ):(
                                <TouchableOpacity onPress={()=>this.endClick('customerDetails',value.id,1)}>
                                    <Text style={[styles.jiedan2,SettingStyle.fontWeight,{backgroundColor:'rgba(0,0,0,0)'}]}>已结束</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            </View>
        )
    };
    //END列表渲染
}
