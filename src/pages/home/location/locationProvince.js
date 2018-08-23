/**
 * Created by chengjuan on 2018-07-30
 */
import React, {Component} from 'react';
import {View, Image, TouchableOpacity, AsyncStorage,DeviceEventEmitter, Text,TextInput, ListView, Platform,Dimensions,StyleSheet,Alert} from 'react-native';
import { SearchBar ,Toast} from 'antd-mobile-rn'
import _ from 'lodash';
import SettingStyle from "../../../js/SettingStyle";
import http from "../../../js/http";
import Http from "../../../js/HttpUtils"
import LoginView from './../../common/LoginView'
import HeaderView from './../../common/HeaderView'
import GetSetStorage from '../../../js/GetSetStorage';
import global from "../../../js/global";
import api from '../../../js/api';

const {width,height} = Dimensions.get('window');
const SECTIONHEIGHT = 44,ROWHEIGHT = 40;
const letters = _
    .range('A'.charCodeAt(0), 'Z'.charCodeAt(0) + 1)
    .map(n => String.fromCharCode(n).substr(0))
_.pull(letters,'O','V')//去掉o和V,这两个下面没有城市
let city=[]//城市的数组
var totalheight=[];//每个字母对应的城市和字母的总高度
var that = null;

export default class locationProvince extends Component {
    constructor(props) {
        super(props);
        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };
        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[rowID];
        };
        this.state={
            letters:[],
            loade:true,
            cityName:'当前城市',
            dataSource:new ListView.DataSource({
                getRowData: getRowData,
                getSectionHeaderData: getSectionData,
                rowHasChanged: (row1, row2) => row1 !== row2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
            }),
            searCity:null,
            focus:false,
            isSearchList:false,
            searchHistory:[],
            searchList:[]
        }
        // that = this
    }
    componentWillMount () {
        this.setState({letters:[]})
    }
    componentDidMount () {
        let _this = this;
        city=[]
        GetSetStorage.getStorageAsync('isSearched').then((result) => {
            if (result) {
                // GetSetStorage.setStorageAsync('isSearched', result);
                let arr = []
                arr = result.split(',')
                this.setState({
                    searchHistory:arr
                })
            }
        }).catch((error) => {
            console.log('==========================');
            console.log('系统异常' + error);
            console.log('==========================');
        });
        this.setState({
            cityName:_this.props.navigation.state.params.Id
        })
        Http.get(api.cfg.areaProvinceList, '').then((res) => {
            console.log(res);
            if (res.code == 0){
                _this.setState({
                    province:res.object
                });
                let data = res.object;
                //把省份放到对应的字母中
                for(let j = 0;j<letters.length;j++){
                    let each =[];
                    for(let i = 0;i<data.length;i++){
                        if(letters[j] == data[i].initial.toUpperCase() ){
                            each.push(data[i].name);
                        }
                    }
                    let _city={};
                    _city.index = letters[j];
                    _city.name = each;
                    city.push(_city); 
                }
                var dataBlob = {};
                var sectionIDs = [];
                var rowIDs = [];
                //去掉没有省份的字母
                for(let k = 0;k<city.length;k++){
                    if(city[k].name.length == 0){
                        city.splice(k,1)
                    }
                    for(let i = 0;i<city.length;i++){
                        if(city[i].name.length == 0){
                            city.splice(i,1)
                        }
                    }
                }
                //去掉右边字母
                city.map((value,index)=>{
                    for(let m = 0;m<letters.length;m++){
                        if(letters[m] == value.index){
                            _this.state.letters.push(letters[m])
                        }
                    }
                });
                for(let ii = 0;ii<city.length;ii++){
                    var sectionName = 'Section ' + ii;
                    sectionIDs.push(sectionName);
                    dataBlob[sectionName] = _this.state.letters[ii];
                    rowIDs[ii] = [];
                    for(let j = 0;j<city[ii].name.length;j++){
                        var rowName = ii + '-' + j;
                        rowIDs[ii].push(rowName);
                        dataBlob[rowName] = city[ii].name[j]
                    }
                    //计算每个字母和下面城市的总高度，递增放到数组中
                    var eachheight = SECTIONHEIGHT+ROWHEIGHT*city[ii].name.length;
                    totalheight.push(eachheight)
                }
                letters = _this.state.letters
                _this.setState({
                    dataSource:_this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs),
                    loade:false
                })
            }else{
                console.log(res.msg)
            }
        })
    }
    goBack = () => {
        const { goBack,navigate } = this.props.navigation
        goBack ()
    }
    renderRow(rowData,sectionID, rowID){
        return (
            <TouchableOpacity
                style={{height:ROWHEIGHT,justifyContent:'center',borderBottomColor:'#faf0e6', borderBottomWidth:0.5}}
                onPress={()=>this._locationCity(rowData,sectionID, rowID)}
                >
                <View key={rowID} style={styles.rowdata}><Text style={styles.rowdatatext}>{rowData}</Text></View>
            </TouchableOpacity>
        )
    }
    //首字母
    renderSectionHeader = (sectionData, sectionID) => {
        return (
            <View style={{height:SECTIONHEIGHT,justifyContent:'center',paddingLeft:15,backgroundColor:'#f0f2f5'}}>
                <Text  style={{color:'#999999'}}>
                    {sectionData}
                </Text>
            </View>
        )
    }
    // render ringht index Letters
    renderLetters(letter, index) {
        return (
            <TouchableOpacity key={index} activeOpacity={0.6} onPress={()=>{this.scrollTo(index)}}>
                <View style={styles.letter}>
                    <Text style={styles.letterText}>{letter}</Text>
                </View>
            </TouchableOpacity>
        )
    }
    //定位
    _locationCity(rowData,sectionID, rowID){

        // let province = this.state.province;
        // let provinceId = null;
        // province.map((value,index)=>{
        //     if(value.name == rowData){
        //         provinceId = value.provinceId
        //     }
        // })
        console.log(rowData,sectionID, rowID);
        DeviceEventEmitter.emit('ListRefresh', true);
        // this.props.navigation.replace('Home',{cityName:rowData})
        // const navigation = this.props.navigation;
        // navigation.navigate('Home',{cityName:rowData});
    }

    //touch right indexLetters, scroll the left
    scrollTo=(index)=>{
        let position=0;
        for(let i = 0;i<index;i++){
            position += totalheight[i]
        }
        this._listView.scrollTo({
            y:position
        })
    }

    render(){
        if (this.state.loade){
            return <View style={{backgroundColor:'#fff'}}><LoginView/></View>
        }
        return this._render()
    }

    _onSubmitEditing() {
        let cityName = {
            name:this.state.searCity
        }
        Http.get(api.cfg.infaddressCityList, cityName).then((res) => {
            if(res.code===0){
                this.setState({
                    focus:false,
                    isSearchList:true,
                    searchList:res.object
                })
                console.log(res)
            }
        })
    }

    _onSearchListIem(city){
        let _this = this
        GetSetStorage.getStorageAsync('isSearched').then((result) => {
            if (result) {
                let arr = []
                arr = result.split(',')
                for (var i in arr){
                    if(arr[i]!==city){
                        _this.state.searchHistory.push(city)
                        let val = _this.state.searchHistory.join(',')
                        GetSetStorage.setStorageAsync('isSearched', val);
                        setTimeout(function () {
                            _this.props.navigation.replace('Home',{cityName:city})
                        },1000)
                    }
                }
            }else {
                _this.state.searchHistory.push(city)
                let val = _this.state.searchHistory.join(',')
                GetSetStorage.setStorageAsync('isSearched', val);
                setTimeout(function () {
                    _this.props.navigation.replace('Home',{cityName:city})
                },1000)
            }
        }).catch((error) => {
            console.log('==========================');
            console.log('系统异常' + error);
            console.log('==========================');
        });

    }

    _onFocus() {
        this.setState({ focus:true,isSearchList:false})
        GetSetStorage.getStorageAsync('isSearched').then((result) => {
            console.log(result)
            if (result) {
                let arr = []
                arr = result.split(',')
                this.setState({
                    searchHistory:arr
                })
            }
        }).catch((error) => {
            console.log('==========================');
            console.log('系统异常' + error);
            console.log('==========================');
        });
    }

    cancel() {
        this.setState({focus:false,isSearchList:false,searCity:''})
        // this.refs.textInput.blur();
    }

    clearHistory(){
        GetSetStorage.ClearStorageAsync('isSearched').then((result) => {
            console.log(result)
            if (result) {
                // Toast.info('清除成功！')
                this.setState({
                    searchHistory:[]
                })
            }
        }).catch((error) => {
            console.log('==========================');
            console.log('系统异常' + error);
            console.log('==========================');
        });
    }
    onChange = searCity => this.setState({ searCity })
    _render() {
        return (
            <View>
                <HeaderView
                    title='所在位置' hasBg='true'
                    goBack={() => {this.goBack()}}/>
                <View style={{height: Dimensions.get('window').height,paddingBottom:80}}>
                    {/*<View style={{backgroundColor:'#f0f2f5',flexDirection:'row' ,justifyContent:'center',*/}
                        {/*marginBottom:10,alignItems:'center',*/}
                        {/*marginTop:10,marginLeft:15,marginRight:15}}>*/}
                        {/*<TextInput style={[this.state.focus?styles.searText:styles.searText1]}*/}
                                   {/*onChangeText={(searCity) => this.setState({searCity})}*/}
                                   {/*underlineColorAndroid='transparent'*/}
                                   {/*placeholder='请输入附近位置...'*/}
                                   {/*onSubmitEditing={()=>this._onSubmitEditing()}*/}
                                   {/*onFocus={()=>this._onFocus()}*/}
                                   {/*placeholderTextColor='#666'*/}
                                   {/*ref="textInput"*/}
                                   {/*value={this.state.searCity}/>*/}
                        {/*<Image style={styles.searchImg} source={require('./../../../../images/header/search.png')}/>*/}
                        {/*{*/}
                            {/*this.state.focus?(*/}
                                {/*<View style={this.state.focus?styles.onCancel:styles.onCancel1}>*/}
                                    {/*<TouchableOpacity  onPress={()=>this.clear()}>*/}
                                        {/*<Text>取消</Text>*/}
                                    {/*</TouchableOpacity>*/}
                                {/*</View>*/}
                            {/*):null*/}
                        {/*}*/}
                    {/*</View>*/}
                    <SearchBar
                        value={this.state.value}
                        placeholder="请输入附近位置..."
                        onSubmit={()=>this._onSubmitEditing()}
                        // onSubmit={(value) => console.log(value, 'onSubmit')}
                        onChangeText={(searCity) => this.setState({searCity})}
                        onClear={value => console.log(value, 'onClear')}
                        onFocus={()=>this._onFocus()}
                        onBlur={() => console.log('onBlur')}
                        onCancel={() =>this.cancel()}
                        showCancelButton={false}
                        onChange={this.onChange}
                        style={{marginLeft:3}}/>
                    {
                        !this.state.focus&&!this.state.isSearchList?(
                            <View>
                                <View style={{backgroundColor:'#ffffff'}}>
                                    <Text style={{color:"#000",marginLeft:15}}>当前位置</Text>
                                    <TouchableOpacity onPress={()=>this._locationCity(this.state.cityName)}>
                                        <Text style={{color:"#000",marginLeft:15}}>{this.state.cityName}</Text>
                                    </TouchableOpacity>
                                </View>
                                <ListView
                                    contentContainerStyle={styles.contentContainer}
                                    ref={listView => this._listView = listView}
                                    dataSource={this.state.dataSource}
                                    renderRow={this.renderRow.bind(this)}
                                    renderSectionHeader={this.renderSectionHeader}
                                    enableEmptySections={true}
                                    initialListSize={500}
                                />
                                <View style={styles.letters}>
                                    {letters.map((letter, index) => this.renderLetters(letter, index))}
                                </View>
                            </View>
                        ):(
                            !this.state.isSearchList?(
                                <View>
                                    <View style={[styles.historyItem,{backgroundColor:'#ffffff', flexDirection:'row', justifyContent:'space-between'}]}>
                                        <Text style={[{color:"#9B9B9B"},styles.historyText]}>搜索记录</Text>
                                        <TouchableOpacity onPress={()=>this.clearHistory()}>
                                            <Text style={[{color:"#6ECEFF",marginRight:12},styles.historyText]}>清除记录</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        this.state.searchHistory.map((item, index) =>
                                            <View key={index} style={styles.searchItem}>
                                                <TouchableOpacity>
                                                    <Text style={[styles.historyItem,SettingStyle.font14]}>{item}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }
                                </View>
                            ):(
                                <View>
                                    {
                                        this.state.searchList.map((item, index) =>
                                            <View key={index} style={styles.searchItem}>
                                                <TouchableOpacity onPress={()=>this._onSearchListIem(item.name)}>
                                                    <Text style={[styles.historyItem,SettingStyle.font14]}>{item.name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }
                                </View>
                            )

                        )
                    }
                </View>
            </View>
        );
    }
};

const styles = StyleSheet.create({
    contentContainer: {
        width: width,
        backgroundColor: 'white',
        marginBottom:100
    },
    searText:{
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius:5,
        backgroundColor:'#fff',
        paddingLeft:30,
        width:'90%',
    },
    searText1:{
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius:5,
        backgroundColor:'#fff',
        paddingLeft:30,
        width: '100%',
    },
    onCancel:{width: '8%',marginLeft:'2%',color:'#333'},
    onCancel1:{width: 0,},
    searchImg:{
        position:'absolute',
        top:10,
        left:10
    },
    searchItem:{
        backgroundColor:'#fff'
    },
    historyText:{
        fontSize:10,
        // paddingTop:13,
        // paddingBottom:13
    },
    historyItem:{
        paddingTop:14,
        paddingBottom:14,
        borderBottomWidth:1,
        borderBottomColor:'#D0D4DB',
        paddingLeft:14
    },
    letters: {
        position: 'absolute',
        height: height,
        top: -40,
        bottom: 0,
        right: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        height: 18,
        width: width*3/50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letterText: {
        textAlign: 'center',
        fontSize: 10,
        color:'rgb(40,169,185)'
    },
    rowdata:{
        paddingLeft:15,
        marginTop:10,
        justifyContent:'center',
        marginBottom:10
    },
    rowdatatext:{
        color:'gray',
    }
})