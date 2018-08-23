/**
 * Created by yangHL on 2018/3/28.
 */
import React from 'react';
import {StyleSheet} from 'react-native';
import Util from "../../../js/util";
const newsStyle=StyleSheet.create({
    headNews:{

    },
    news:{
        backgroundColor:'#fff',
        marginLeft:15,
        marginRight:15,
        borderRadius:10,
        borderWidth:1,
        borderColor:'#e6e6e6'
    },
    newsNum1:{
        position:'absolute',
        top:'30%',
        right:'30%',
        width:8,
        height:8,
        zIndex:999
    },
    newsNum2:{
        position:'absolute',
        top:'40%',
        left:'12%',
        width:8,
        height:8,
        zIndex:999
    },
    newsNum3:{
        position:'absolute',
        top:'10%',
        right:'44%',
        width:8,
        height:8,
        zIndex:999
    },
    newsTab:{
        flexDirection: 'row',
        // justifyContent: 'space-around',
        backgroundColor:'#fff',
        // borderBottomColor:'#D0D4DB',
        // borderBottomWidth:.5,
    },
    tabsText:{
        paddingBottom:16,
        paddingTop:14,
        color:'#9B9B9B'
    },
    activeTextStyle:{
        paddingTop:14,
        paddingBottom:11,
        color:'#4A4A4A'
    },
    activeViewStyle:{
        borderBottomWidth:5,
        borderBottomColor:'#54B1FF',
        // borderRightWidth:.5,borderRightColor:'#54B1FF'
    },
    ViewChange:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        borderBottomColor:'#D0D4DB',
        borderBottomWidth:.5,
    },
    personNews:{
        backgroundColor:'#fff',
        marginLeft:14,
        marginRight:14,
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        paddingTop:14,
        marginTop:20
    },
    personInfo:{
        marginTop:10,
        marginBottom:14,
        maxWidth:Util.size.width*0.8
    },
    newsBox:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:"center",
        paddingTop:15,
        paddingBottom:16,
        paddingLeft:15,
        paddingRight:14,
        backgroundColor:'#fff',
        borderBottomColor:'#D0D4DB',
        borderBottomWidth:.5,
    },
    newtext:{
        color:'#9b9b9b',
        maxWidth:Util.size.width*0.6
    }

})
export default newsStyle