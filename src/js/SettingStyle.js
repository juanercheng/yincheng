/**
 * Created by ChengJuan by 18-07-24
 */
import {StyleSheet} from 'react-native';
import Util from './util';
import ScreenUtils from './ScreenUtils'

const SettingStyle = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height:42,
        // height:ScreenUtils.scaleSize(42),
    },
    headerWrite:{
        backgroundColor: "#fff",
        justifyContent:'center'
    },
    headerText:{
        color:'#fff',
        fontSize:18
        // fontSize:ScreenUtils.setSpText(18),
    },
    headerTextBlack:{
        color:'#4A4A4A',
        fontSize:18
    },
    back:{
        position:'absolute',
        top:12,
        left:15,
        width:'20%'
    },
    bodyColor:{
        backgroundColor:'#f8f8fa',
        height:Util.size.height,
    },
    headerbg:{
        height:42,
    },
    headerbgIos:{
        paddingTop:20,
        height:62,
    },
    headerIcon:{
        width:10
    },
    headerBack:{
       // width:11,
       // height:19,
       // marginLeft:15
   },
   arrowIcon:{
        width:8,
        height:10,
   },
   radioIcon:{
        width:18,
        height:18,
   },
   font14:{
        fontSize:14, color:'#4a4a4a'
   },
   fontRed:{
        color:'#f23030'
   },
   font12:{
        // fontSize:ScreenUtils.setSpText(12), color:'#4a4a4a'
        fontSize:12, color:'#4a4a4a'
   },
   font13:{
        fontSize:13, color:'#4a4a4a'
   },
   font10:{
        fontSize:10, color:'#4a4a4a'
   },
   font16:{
        fontSize:16, color:'#4a4a4a'
   },
   font18:{
        fontSize:18,
        // fontSize:ScreenUtils.setText(18),
        color:'#4a4a4a'
   },
   font20:{
        fontSize:20,
        color:'#4a4a4a'
   },
   emptyWrap:{
        flexDirection:"column",
        alignItems:"center",
        backgroundColor:"#fff",
        flex:1,
        paddingTop:20,
   },
   emptyImg:{
        width:"55%",
        height:"35%"
   },
   colorWhite:{
        color:"#fff",
   },
   textCenter:{
        textAlign: "center"
   },
   Back:{
        alignItems:'center',
        alignSelf:'center',
   },
   row:{
        flexDirection:'row',
   },
   alert:{
        width:Util.size.width*0.91,
        // height:Util.size.width*0.6,
        borderWidth:1,
        borderColor:'#fff',
        borderRadius:10
   },
   fontWeight:{
        fontWeight:'400'
   },
   alertTitle:{
        flex:12,textAlign:'center',fontSize:20,color:'#54B1FF',
   },
   alertContent:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        marginBottom:36,
        marginTop:15
   },
   alertContentText:{
        textAlign:'center',
        marginTop:16,
        fontWeight:'400'
   },
   btnBox:{
        flexDirection:'row',
        justifyContent:'space-between'
   },
   alertBtn:{
        borderWidth:1,
        paddingTop:5,
        paddingBottom:5,
        paddingLeft:45,
        paddingRight:45,
        marginBottom:10,
        marginLeft:26,
        borderRadius:10
   } ,
   btnCancel:{
        backgroundColor:'#fff',
        borderColor:'#54B1FF',
        // marginRight:'7%'
   },
   btnConfirm:{
        backgroundColor:'#54B1FF',
        borderColor:'#54B1FF',
        marginRight:26,
   },
   btnCancelText:{
        color:'#54B1FF',
        fontSize:16

   },
   btnConfirmText:{
        color:"#fff",
        fontSize:16
   },
    text:{
        backgroundColor:'rgba(0,0,0,0)'
    }
});

export default SettingStyle;
