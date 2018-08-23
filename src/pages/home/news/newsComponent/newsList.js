/**
 * Created by chengjuan on 2018/8/2.
 */
import React, {Component} from 'react';
import {
    ScrollView,
    Text,
    View,
    Image,
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
    TouchableOpacity,
    DeviceEventEmitter,
    TouchableHighlight, NetInfo, Platform
} from 'react-native';
import styles from '../newsSyle'
import stylesHome from '../../../home/HomeStyle'
import SettingStyle from '../../../../js/SettingStyle'
import api from '../../../../js/api';
import global from '../../../../js/global';
import http from '../../../../js/http';
import Http from '../../../../js/HttpUtils';

import LoginView from '../../../common/LoginView'
import ErrorView from '../../../common/ErrorView'
import NoDataView from '../../../common/NoDataView';
import LoadingDataView from '../../../common/LoadingDataView';
import { Toast } from 'antd-mobile-rn';
import Util from "../../../../js/util";

let pageNo = 1;//当前第几页
let totalElements;//总的页数

export default class newsList extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
            refreshing: false,
            error: false,
            dataArray: [],
            errorInfo: null,
            messagetype: 1,
            showFoot:2, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            type: 1,
            pageSize:10,
            msg:null
        }
    }

    componentDidMount() {
        this.fetchData(pageNo, this.state.messagetype);
        this.subscription = DeviceEventEmitter.addListener('type', (type) => {
            pageNo = 1;
            this.fetchData(pageNo, type);
        })
        this.subscription1 = DeviceEventEmitter.addListener('Refresh', (type) => {
            pageNo = 1;
            this.fetchData(pageNo, 1);
        })
    }
    // loadingToast = () =>
    componentWillUnmount() {
        pageNo = 1;
        this.subscription && this.subscription.remove();
        this.subscription1 && this.subscription1.remove();
        DeviceEventEmitter.emit('news', '通知来了');
    }

    fetchData(pageNo, type) {
        // this.loadingToast()
        this.setState({showFoot: 2});
        let params = {}
        if (type == undefined) {
            params = {
                pageCurrent: pageNo,
                pageSize: this.state.pageSize,
                type: 1,
            }
        } else {
            params = {
                pageCurrent: pageNo,
                pageSize: this.state.pageSize,
                type: type,
            }
        }
        let _this = this
        Http.post(api.news.messagetList, params).then((res) => {
            if (res.code === 0) {
                _this._data = res.object;
                let data =  _this._data;
                let dataBlob = [];
                totalElements = data.length;

                if(data.length>0){
                    data.map(function (item) {
                        dataBlob.push(item)
                        item.createTime = item.createTime.replace(/-/g, '/')
                        var str = new Date(item.createTime);
                        str.setDate(str.getDate());
                        var year=str.getFullYear()
                        var month = (parseInt(str.getMonth()) + 1)>10?(parseInt(str.getMonth()) + 1):'0'+(parseInt(str.getMonth()) + 1)
                        var date = str.getDate() < 10 ? '0' + str.getDate(): str.getDate()
                        item.createTime= year+'-'+month+'-'+date
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
                data = null;
                dataBlob = null;
            }else if(res.code===101) {
                Toast.info(res.msg,6)
                setTimeout(function () {
                    _this.props._goLogin()
                },3000)
            }else {
                _this.setState({
                    error:true,
                    msg:res.msg
                })
            }

        })
    }

    render() {
        if (this.state.loading && !this.state.error) {
            return <LoginView/>
        } else if (this.state.error) {
            //请求失败view
            return (
                <View style={{justifyContent:'center',marginTop:'40%'}}>
                    <Text style={{textAlign:'center',color:'#666'}}>
                        {this.state.msg}
                    </Text>
                </View>
            )
        } else {
            return (
                <View style={Platform.OS === 'ios'?{height:Util.size.height*0.81+44}:{height:Util.size.height*0.81}}>
                    <FlatList
                        data={this.state.dataArray}
                        //使用 ref 可以获取到相应的组件
                        //ref={(flatList) => this._flatList = flatList}
                        //ListHeaderComponent={this._header}//header头部组件

                        ListFooterComponent={this._renderFooter.bind(this)}

                        //ItemSeparatorComponent={ItemDivideComponent}//分割线组件

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
                        renderItem={({item, index}) => this._renderItem(item, index)}
                    />
                </View>

            );
        }
    }

    _renderFooter() {
        if (this.state.showFoot === 1) {
            return (
                <NoDataView/>
            );
        } else if (this.state.showFoot === 2) {
            return (
                <LoadingDataView/>
            );
        } else if (this.state.showFoot === 0) {
            return (
                <View style={{alignItems:'center'}}>
                    <Text style={[{color:'#999',marginTop:Util.size.height*0.2},SettingStyle.font14]}>暂无消息</Text>
                </View>
            );
        }
    }

    _onRefresh = () => {
        pageNo = 1;
        if (!this.state.refreshing) {
            this.fetchData(pageNo);
        }
    }

    _onEndReached() {
        //如果是正在加载中或没有更多数据了，则返回
        if(this.state.showFoot === 1 || this.state.showFoot === 0){
            return ;
        }
        this.setState({showFoot: 2});
        pageNo++;
        //获取数据
        this.fetchData(pageNo);
    }

    //此函数用于为给定的item生成一个不重复的key
    //若不指定此函数，则默认抽取item.key作为key值。若item.key也不存在，则使用数组下标index。
    _keyExtractor = (item, index) => index;

    _renderItem = (value, index) => {
        return (
            <View style={{backgroundColor: '#f0f2f5'}} key={index}>
                <TouchableOpacity onPress={() => this.props._details('newsDetails', value.id)}>
                    {
                        this.state.type === 1 ?
                            <View style={styles.newsBox}>
                                {
                                    value.readFlag===0?(<Image source={require('../../../../../images/header/news.png')} style={styles.newsNum2} />):null
                                }
                                <View style={[SettingStyle.row, {alignItems: "center"}]}>
                                    <Image style={{marginRight: 16}}
                                           source={require('../../../../../images/news/notie.png')}/>

                                    <Text style={[SettingStyle.font14, styles.newtext]}  ellipsizeMode='tail' numberOfLines={1}>{value.title}</Text>
                                </View>
                                <Text style={[SettingStyle.font12, styles.newtext]}>{value.createTime}</Text>
                            </View> :
                            <View style={styles.personNews}>
                                {
                                    value.readFlag===0?(<Image source={require('../../../../../images/header/news.png')} style={styles.newsNum3} />):null
                                }
                                <Image source={require('../../../../../images/news/renzheng.png')}/>
                                <Text style={[SettingStyle.font18, styles.personInfo]} ellipsizeMode='tail' numberOfLines={2}>{value.title}</Text>
                            </View>
                    }
                </TouchableOpacity>
            </View>
        );
    }

    _delete(id) {
        let params = {messageId: id}
        let _this = this
    }

}