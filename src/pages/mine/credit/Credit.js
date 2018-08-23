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
    ScrollView,
    TouchableHighlight,
    Text,
    ToastAndroid,
} from 'react-native';
import { Toast,Picker, List, InputItem, Button,Modal } from 'antd-mobile-rn';

import styles from './CreditStyle';

import api from './../../../js/api';
import global from './../../../js/global';
import Http from './../../../js/HttpUtils';

import SettingStyle from './../../../js/SettingStyle';
import LoginView from './../../common/LoginView';
import ErrorView from './../../common/ErrorView';
import HeaderView from './../../common/HeaderView'


import ImagePicker from 'react-native-image-picker';

const baseURL = 'http://chijun.xin/yincheng/api/';

//图片参数
const options = {
    title: null,
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '相机',
    chooseFromLibraryButtonTitle: '从相册选择',
    cameraType: 'back',
    mediaType: 'photo',
    videoQuality: 'high',
    durationLimit: 10,
    maxWidth: 300,
    maxHeight: 300,
    quality: 0.8,
    angle: 0,
    allowsEditing: true,
    noData: false,
    storageOptions: {
        skipBackup: true,
        path: 'images'
    }
}

export default class Credit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            data: null,
            name: null,
            mobile: null,
            idNumber: null,
            company: null,
            companyMobile: null,
            cityName: null,
            shenfenzheng: null,
            companyImg: null,
            review: null, //认证状态  0 未  1 认证
            creditState: 0,  //认证结果   //1.通过 0.审核中 2.未通过
            remarks: null, //认证失败原因
            avatarSource: null,
            modalVisible: false,
            provinceData: [],
            value: null,
        };
    }

    componentDidMount() {
        this._provincialUrban();
        this._latestExamineRecord();
        this.setState({
            review: this.props.navigation.state.params.review,
        })
    }

    componentWillUnmount(){
    }

    goBack = () => {
        const { goBack,navigate } = this.props.navigation
        goBack ()
    };

    showToast = (tips) => Toast.info(tips)

    //最新认证记录
    _latestExamineRecord = () => {
        let params = {
            token: '17eae47c-ae6d-4263-aa08-d75e73bff3ed',
        };
        let _this = this
        Http.get(api.user.latestExamineRecord, params).then((res)=> {
            if(res.code === 0) {
               console.log(res,'你好');
                let data = res.object;
//                console.log(data);
                _this.setState({
                    name: data.userName,
                    mobile: data.userTel,
                    idNumber: data.userIdCard,
                    company: data.enterpriseName,
                    companyMobile: data.enterpriseTel,
                    shenfenzheng:data.userCertificatesImage,
                    companyImg: data.enterpriseImage,
                    cityName: data.cityName,
                    creditState: data.result,
                    remarks: data.remarks,
                    value: [data.province + '0', data.city + '0'],
                    loading: false,
                })
            }
        },(error) => {
            console.log(error);
        })
    }

    //选择图片
    selectPhotoTapped = (type) => {
        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('用户取消了选择！');
            }
            else if (response.error) {
                console.log('ImagePicker发生错误: ', response.error);
            }
            else if (response.customButton) {
                console.log('自定义点击按钮: ', response.customButton);
            }
            else {
                let source;  // 保存选中的图片
                let path;
                source = { uri: response.uri };
                if (Platform.OS === 'android') {
                    source = { uri: response.uri };
                    path = response.uri;
                } else {
                    source = { uri: response.uri.replace('file://','') };
                    path = response.uri;
                }
//                this.setState({
//                    avatarSource: path
//                });
                //图片上传
                this._fileUpload(path,type);
            }
        });
    }

    //图片上传
    _fileUpload = (path1,type)=> {
        Toast.loading('正在加载...');
        let formData = new FormData();
        let path=  'file://'+ path1;
        let file = {uri:  path, type: 'application/octet-stream', name: 'image.jpg'};
        formData.append("myfile", file);
        return fetch(baseURL + api.fileUpload.Upload, {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data;charset=utf-8',
            },
            body: formData,
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            let shenfenzheng;
            let companyImg;
            if( responseJson.code === 0) {
                Toast.hide();
                if(type === 1) {
                    shenfenzheng = responseJson.object;
                    this.setState({
                        shenfenzheng: shenfenzheng
                    })
                }else if (type === 2) {
                    companyImg = responseJson.object;
                    this.setState({
                        companyImg: companyImg
                    })
                }
            }
        })
        .catch((error) => {
            console.error(error);
        });
    }

    _Sub = () =>  {
       const { name, mobile, idNumber, company, companyMobile, shenfenzheng, companyImg } = this.state;
       let dataSub = {};
       dataSub.name = name;
       dataSub.mobile = mobile;
       dataSub.idNumber = idNumber;
       dataSub.company = company;
       dataSub.companyMobile = companyMobile;
       dataSub.shenfenzheng = shenfenzheng;
       dataSub.companyImg = companyImg;
       if( name == null || !name )    {
           return this.showToast('请输入姓名！');
       }
       if( mobile == null || !mobile )    {
           return this.showToast('请输入手机号码！');
       }
       if( !(/^[1][3,4,5,7,8][0-9]{9}$/.test(mobile))) {
           return this.showToast('请输入正确的手机号码！');
       }
       if( idNumber == null  || !idNumber){
           return this.showToast('请输入身份证号！');
       }
//       if (!(/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(idNumber))){
//          return this.showToast('请输入正确的身份证号！');
//       }
       if( company == null  || !company){
           return this.showToast('请输入公司名称！');
       }
       if( companyMobile == null || !companyMobile ) {
           return this.showToast('请输入公司电话！');
       }
       if( shenfenzheng == null || !shenfenzheng ) {
          return this.showToast('请上传证件照！');
       }
       if( companyImg == null || !companyImg ) {
            return this.showToast('请上传名片！');
       }
//       if(!(/^(\\+\\d{2}-)?0\\d{2,3}-\\d{7,8}$/.test(companyMobile))) {
//           return this.showToast('请输入正确的公司电话！');
//       }
        this._applyExa()
    }

    //申请认证
    _applyExa = () => {
        this.setState({ modalVisible: false });
        const { name, mobile, idNumber, company, companyMobile, shenfenzheng, companyImg, value } = this.state;
        let params = {
            userName: name,
            userIdCard: idNumber,
            userTel: mobile,
            userCertificatesImage: shenfenzheng,
            enterpriseName: company,
            enterpriseTel: companyMobile,
            enterpriseImage: companyImg,
            city: +value[1]/10,
            province: +value[0]/10,
            token: global.login.token,
        };
        Http.post(api.user.applyExamine,params)
            .then((res) => {
                console.log(res);
                if(res.code === 0) {
                    Modal.alert('温馨提示', ('您的信息已提交成功，请等待后台审核！'), [
                        { text: '取消', onPress: () => console.log('cancel') },
                        { text: '确认', onPress: () => {
                                this.goBack()
                            }}
                    ]);
                    // this.setState({ modalVisible: true })
                }else if (res.code === 500) {
                     this.showToast(msg);
                }
            },(error) => {
                console.log(error);
            })
    }


   //查询所有省市信息
   _provincialUrban = () => {
        Http.get(api.cfg.provinceList)
            .then((res) => {
                if(res.code === 0) {
//                    console.log(res.object);
                    let provinceData = res.object;
//                    console.log(provinceData);
                    let data = [];
                    provinceData.map((item) => {
                        item['value'] = item.id + '0';
                        item["label"] = item.name;
                        item["children"] = [];
                        this._getCity(item.id);
                    });
//                    console.log(provinceData);
                    this.setState({
                        provinceData: provinceData
                    })
                }
            })
   }

   _getCity = (id) => {
        let params = {
            province: id,
        };
        let that = this;
        Http.get(api.cfg.cityListByProvince,params)
            .then((res) => {
                if(res.code === 0) {
//                    console.log(res.object);
                    let CityData = res.object;
//                    console.log(CityData);
                    let data = [];
                    const provinceData = that.state.provinceData;
                    CityData.map((item,index) => {
                        item['value'] = item.id + '0';
                        item["label"] = item.name;
                        provinceData.map((value,index) => {
                            if( item.parentNode=== value.id) {
                                value["children"].push(item);
                            }
                        })
                    });
                    this.setState({
                        provinceData: provinceData,
                    })
                }
            })
   }


    render() {
         if (this.state.loading && !this.state.error) {
             console.log(this.state.loading,'login')
             return <LoginView/>
         } else if (this.state.error) {
             //请求失败view
             return <ErrorView/>
         }else{
            return this.renderView();
         }
    }

    _CreditState()  {
        if(this.state.review === 0){
            return (
                <View style={styles.TextBox}>
                    <Text style={[SettingStyle.text,SettingStyle.fontWeight,styles.NoText]}>审核状态：未认证</Text>
                </View>
            );
        }else if (this.state.creditState == 0) {
             return (
                <View style={styles.TextBox}>
                    <Text style={[SettingStyle.text,SettingStyle.fontWeight,styles.NoText]}>审核状态：审核中</Text>
                </View>
             );
        }else if (this.state.creditState == 1) {
            return (
                <View style={styles.TextBox}>
                    <Text style={[SettingStyle.text,SettingStyle.fontWeight,styles.NoText]}>审核状态：认证通过</Text>
                </View>
            );
        }else if (this.state.creditState == 2) {
            return (
                <View style={{backgroundColor:'#fff'}}>
                    <Text style={[SettingStyle.text,styles.stateText]}>审核状态：认证失败</Text>
                    <View style={[styles.because]}>
                         <Text style={[SettingStyle.text,SettingStyle.font14,SettingStyle.fontWeight]}>原因如下</Text>
                         <Text style={[SettingStyle.text,SettingStyle.font14,SettingStyle.fontWeight]}>{this.state.remarks}</Text>
                    </View>
                </View>
            );
        }
    }


   onClick = () => {
       this.setState({
           provinceData: this.state.provinceData
       },function () {
           console.log(this.state.provinceData)
       })
   }

   _change = (value) => {
        console.log(value);
        this.setState({
            value: value
        })
   }

   _pickerCheck(val){
       this.setState({
           value: val,
           provinceData: this.state.provinceData
       },function () {
           console.log(this.state.provinceData);
       })

   }

   //格式化选中的目标函数
   _format(labels) {
//        console.log(labels);
        return labels[1];
   }


   renderView() {
        return (
            <View style={SettingStyle.bodyColor}>
                <HeaderView hasBg='true'
                    title='信贷经理认证'
                    goBack={() => {this.goBack()}}/>
                <ScrollView style={{paddingBottom: 100}}>
                    <View style={styles.container}>
                        {this._CreditState()}
                        <View style={styles.iptBox}>
                            <View style={styles.rowBox}>
                                <View style={styles.textRow}>
                                    <Text style={[SettingStyle.font14,SettingStyle.fontWeight]}>姓名</Text>
                                    <TextInput
                                        placeholder="请输入您的姓名"
                                        underlineColorAndroid='transparent'
                                        placeholderTextColor="#ccc"
                                        style={this.state.name === null ? [styles.inputBox,styles.NoInputText] : [styles.inputBox,styles.inputText] }
                                        value={this.state.name}
                                        onChangeText={ (name) => this.setState({name}) }
                                        editable={this.state.creditState === 1 || this.state.creditState === 0 ? false : true}
                                     />
                                </View>
                            </View>
                            <View style={styles.rowBox}>
                                <View style={styles.textRow}>
                                    <Text style={[SettingStyle.font14,SettingStyle.fontWeight]}>手机号</Text>
                                    <TextInput
                                        placeholder="请输入您的手机号"
                                        placeholderTextColor="#ccc"
                                        keyboardType={'phone-pad'}
                                        underlineColorAndroid='transparent'
                                        style={this.state.name === null ? [styles.inputBox,styles.NoInputText] : [styles.inputBox,styles.inputText] }
                                        value={this.state.mobile}
                                        onChangeText={ (mobile) => this.setState({mobile}) }
                                        editable={this.state.creditState === 1 || this.state.creditState === 0 ? false : true}
                                    />
                                </View>
                            </View>
                            <View style={styles.rowBox}>
                                <View style={styles.textRow}>
                                    <Text style={[SettingStyle.font14,SettingStyle.fontWeight]}>身份证号</Text>
                                    <TextInput
                                        placeholder="请输入正确的身份证号"
                                        placeholderTextColor="#ccc"
                                        underlineColorAndroid='transparent'
                                        style={this.state.name === null ? [styles.inputBox,styles.NoInputText] : [styles.inputBox,styles.inputText] }
                                        value={this.state.idNumber}
                                        onChangeText={ (idNumber) => this.setState({idNumber}) }
                                        editable={this.state.creditState === 1 || this.state.creditState === 0 ? false : true}
                                    />
                                </View>
                            </View>
                            <View style={styles.rowBox}>
                                <View style={styles.textRow}>
                                    <Text style={[SettingStyle.font14,SettingStyle.fontWeight]}>公司名称</Text>
                                     <TextInput
                                        placeholder="请输入正确的公司名称"
                                        placeholderTextColor="#ccc"
                                        underlineColorAndroid='transparent'
                                        style={this.state.name === null ? [styles.inputBox,styles.NoInputText] : [styles.inputBox,styles.inputText] }
                                        value={this.state.company}
                                        onChangeText={ (company) => this.setState({company}) }
                                        editable={this.state.creditState === 1 || this.state.creditState === 0 ? false : true}
                                     />
                                </View>
                            </View>
                            <View style={styles.rowBox}>
                                <View style={styles.textRow}>
                                    <Text style={[SettingStyle.font14,SettingStyle.fontWeight]}>公司电话</Text>
                                    <TextInput
                                        placeholder="请输入正确的公司电话"
                                        placeholderTextColor="#ccc"
                                        keyboardType={'number-pad'}
                                        underlineColorAndroid='transparent'
                                        style={this.state.name === null ? [styles.inputBox,styles.NoInputText] : [styles.inputBox,styles.inputText] }
                                        value={this.state.companyMobile}
                                        onChangeText = {(companyMobile) => this.setState({companyMobile})}
                                        editable={this.state.creditState === 1 || this.state.creditState === 0 ? false : true}
                                    />
                                </View>
                            </View>
                            <View>
                                  <Picker 
                                    indicatorStyle={{height: 100,color:'#fff'}}
                                    data={this.state.provinceData} 
                                    cols={2} 
                                    extra=" "
                                    value={this.state.value} 
                                    onChange={this._change}
                                    onOk={(v)=>{this._pickerCheck(v)}}
                                    format={(labels) => this._format(labels)}
                                    onDismiss={()=>{console.log('onDismiss')}}
                                    disabled={this.state.creditState === 1 || this.state.creditState === 0 ? true : false}>
                                    <List.Item arrow='horizontal' last onClick={this.onClick}>
                                            <Text style={[SettingStyle.font14,SettingStyle.fontWeight,{borderBottomColor: '#D0D4DB',borderTopWidth: 0,}]}>所在区域</Text>
                                        </List.Item>
                                  </Picker>
                            </View>
                        </View>
                        <View style={{alignItems:'center',marginTop: 35}}>
                            <Text style={[SettingStyle.font18,SettingStyle.fontWeight,SettingStyle.text,{marginBottom: 11}]}>请上传证件照</Text>
                            <TouchableOpacity onPress={() => this.selectPhotoTapped(1)}>
                                <Image style={this.state.shenfenzheng ? styles.idCardImg : null}
                                    source={
                                        this.state.shenfenzheng ?
                                        { uri: this.state.shenfenzheng } :
                                        require('./../../../../images/mine/shenfenzheng.png')} />
                            </TouchableOpacity>
                            <Text style={[SettingStyle.text,{fontSize: 14,color:'#54B1FF',marginTop: 9,marginBottom: 36}]}>请上传身份证正面</Text>
                            <TouchableOpacity onPress={() => this.selectPhotoTapped(2)}>
                                <Image style={this.state.companyImg ? styles.idCardImg : null}
                                    source={
                                        this.state.companyImg ?
                                        {uri: this.state.companyImg } :
                                        require('./../../../../images/mine/company.png')} />
                            </TouchableOpacity>
                            <Text style={[SettingStyle.text,styles.comText]}>请上传名片或者工牌照片或者本人与公司LOGO合影（3选1）</Text>
                        </View>
                        <View
                            style={
                                this.state.creditState === 1 || this.state.creditState === 0 ?
                                [styles.subBox,{display: 'none'}] :
                                styles.subBox}>
                            <TouchableOpacity style={styles.sub}
                                onPress={() => this._Sub()}>
                                <Text style={[SettingStyle.text,{fontSize: 18,color: '#fff'}]}>提交</Text>
                            </TouchableOpacity>
                        </View>
                        <Modal
                            animationType="fade"
                            transparent={true}
                            style={SettingStyle.alert}
                            visible={this.state.modalVisible}
                            onRequestClose={() => {
                                alert("Modal has been closed.");
                            }}>
                            <View style={{ marginTop:1}}>
                                <View style={{flexDirection:'row',alignItems:'center',}}>
                                    <Text style={SettingStyle.alertTitle}>温馨提示</Text>
                                    <TouchableOpacity
                                        onPress={() => {this.setState({ modalVisible: false });}}>
                                        <Image source={require('./../../../../images/home/Group.png')}/>
                                    </TouchableOpacity>
                                </View>
                                <View style={SettingStyle.alertContent}>
                                    <Image source={require('./../../../../images/mine/review.png')}/>
                                    <Text style={[SettingStyle.alertContentText,SettingStyle.font18]}>您的信息已提交成功，请等待后台审核！</Text>
                                </View>
                                <View style={SettingStyle.btnBox}>
                                    <TouchableOpacity style={[SettingStyle.alertBtn,SettingStyle.btnCancel]}
                                                      onPress={() => {this.setState({ modalVisible: false })}}>
                                        <Text style={SettingStyle.btnCancelText}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[SettingStyle.alertBtn,SettingStyle.btnConfirm]}
                                                      onPress={() => this._applyExa() }>
                                        <Text style={SettingStyle.btnConfirmText}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </ScrollView>
            </View>
        )

   }

}