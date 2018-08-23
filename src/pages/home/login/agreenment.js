/**
 * Created by juaner by 18-06-12
 */
import React, { Component } from 'react';
import {
    Button,
    Text ,
    View,
    Platform,
    Image,
    ImageBackground,
    TouchableOpacity,
    ViewPagerAndroid,
    ScrollView,
    TouchableHighlight,
}from 'react-native';
import LoginView from './../../common/LoginView'
import SettingStyle from '../../../js/SettingStyle';
import http from "../../../js/http";
import Util from "../../../js/util";
const Url = 'cfg/findAdvertisementDetail';

export  default class AgreenMent extends Component{
    static navigationOptions = ({ navigation }) => ({
    tabBarVisible: false,  //隐藏导航栏
    headerTitle: ("注册协议"),
    headerStyle: {
        backgroundColor: "#52affd",
        elevation: 0
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
        color: "#fff",
        alignSelf: 'center',
    },
        headerLeft:(
            <Button   style={SettingStyle.Back} onPress={()=>navigation.state.params.navigatePressBack()}>
                <Image style={SettingStyle.headerBack} source={require('./../../../../images/header/go-back-white.png')} />
            </Button>
        ),
        headerRight: (
            <Button  ></Button>
        )
    });

    constructor(props){
        super(props);
        this.state = {
            dataSource: null,
            integral:true,
            loaded: false,
        };
    }

    goBack = () => {
        const { goBack,navigate } = this.props.navigation
        goBack ()
    };

    componentDidMount(){
        this.props.navigation.setParams({
            navigatePressBack:this.goBack,
        })
        this.fetchData();

    }

    fetchData() {
        let params ={param:'用户注册协议',type:1}
        let _this = this
        http.postData( Url,params,
            function(res){
                _this._data = res.object;
                console.log(res)
                _this.setState({
                    dataSource: _this._data,
                    loaded: true,
                });
                _this.state.dataSource.content=_this.state.dataSource.content.replace(/<\/?.+?>/g,"");
                _this.state.dataSource.content=_this.state.dataSource.content.replace(/ /g,"");
                _this.state.dataSource.content=_this.state.dataSource.content.replace(/&nbsp;/ig, "");
            }
        )
    }

    render(){
        if (!this.state.loaded ) {
            return <LoginView/>
        }
        return this.renderView()
    }

    renderView() {
        return (
            <View style={{paddingTop:15,backgroundColor:'#fff'}}>
                <ScrollView style={{width:Util.width}}>
                    <Text style={{fontSize:18,textAlign:'center'}}>{this.state.dataSource.name}</Text>
                    <Text style={{fontSize:13,textAlign:'center',color:'#999',marginTop:10,marginBottom:12}}>{this.state.dataSource.modifytime}</Text>
                    <Text style={{marginLeft:15,marginRight:15}}>{this.state.dataSource.content}</Text>
                </ScrollView>
            </View>
        );
    }
}
