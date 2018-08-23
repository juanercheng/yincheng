/**
 * Created by yangHL on 2018/4/12.
 */


import React from 'react';

let api = {
    login:{
        login: 'login/login',
        forget: 'login/pwdUpdate',
        getImageCode: 'login/checkImageCode',
        getMobileCode: 'login/getMobileCode',
        register:'login/register'
    },
    news:{
        messagetList:'infmessage/list',//所有消息列表
        messageCountByType:'infmessage/countByUnread',//我的消息未读条数
        messageDetail:"infmessage/findMessageById",//消息详情
        countByUnread:'infmessage/countByUnread',
    },
    cfg:{
        areaProvinceList:'infaddress/list',
        areaCityList: 'cfg/areaCityList',
        infaddressCityList:'infaddress/cityList',
        dictInfo:'cfg/dictInfo',//首页菜单接口
        provinceList: 'infaddress/provinceList',  //获取所有省信息
        cityListByProvince: 'infaddress/cityListByProvince',  //根据省获取市信息
    },
    home:{
        getShopForNearby:'shop/getShopForNearby'
    },
    customer:{
        customerList:'customer/list',
        findCustomerById:'customer/findCustomerById',
        robbing:"customer/robbing",
        listByMy:"customer/listByMy"
    },
    user: {
        userInfos : 'user/info',
        updateHead: 'user/updateHead',
        recharge: 'user/recharge',
        applyExamine: 'user/applyExamine',
        latestExamineRecord: 'user/latestExamineRecord',
        feedBack: 'cfg/userFeedback',
        Push: 'user/updateOpenPush'
    },
    recharge: {
        infsetmeal: 'infsetmeal/list',
        inftransaction: 'inftransaction/list',
    },
    pay: {
        wxgetPayParams: 'wxpay/getPayParams',
        wxsuccess: 'wxpay/payNotifyByAppSync',
        aligetPayParams: 'alipay/getPayParams',
        alisuccess: 'alipay/payNotifyByAppSync',
    },
    fileUpload: {
        Upload: 'fileUpload',
    },
    Version: {
        findNewInfVersionInfo: 'cfg/findNewInfVersionInfo',
    }
};

export default api;