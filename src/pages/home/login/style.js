/**
 * Created by Ld by 2018/8/7.
 */
import {StyleSheet,} from 'react-native';
import Util from './../../../js/util';

const LoginStyle = StyleSheet.create({
    container: {
        // width: Util.size.width,
        height: Util.size.height,
        backgroundColor: '#f8f8fa',
        alignItems: 'center',
        // paddingTop: 100
    },
    forget:{
        width: Util.size.width,
        height: Util.size.height,
        backgroundColor: '#fff',
    },
   textRow: {
        // width:'80%',
       height:32,
       marginTop:31,
       marginLeft:20,
       marginRight:20,
       flexDirection: 'row',
       justifyContent: 'center',
       alignItems: 'center',
   },
    logo:{

        position:'absolute',
        // top:111,
        marginTop:100
    },
    loginText:{
        color:'#fff',
    },
    bg:{
        width:'80%',
        backgroundColor: '#fff',
        borderRadius:3,
        position:'absolute',
        // height:429,
        // marginTop:196
        // top:315
        bottom:0
    },
    left:{
        flex:1,
        borderBottomWidth:1,
        borderColor:'#d0d4db',
        height:32,
        flexDirection: 'row',
        alignItems:'center',
        marginLeft:16,
    },
   inputBox: {
        flex:1,
        height:38,
        // position: 'relative',
   },
    code:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:3,
        width:83,
        height:25,
        borderWidth:1,
        borderColor:'#54b1ff'
    },
    login:{
        // width:'100%',
        marginTop:20,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft:20,
        marginRight:20,
        height:40,
        borderRadius:20,
        backgroundColor:'#54b1ff'
    },
    other:{
        marginTop:15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    otherText:{
        fontSize:12,
    },
    line:{
        height:13,
        width:1,
        backgroundColor:'#d0d4db',
        marginRight:24,
        marginLeft:24
    },
});
export default LoginStyle;