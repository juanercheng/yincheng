/**
 * Created by juaner by 18-07-24
 */
import {StyleSheet} from 'react-native';
import Util from './../../js/util';
import ScreenUtils from './../../js/ScreenUtils'

const HomeStyle = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // height:ScreenUtils.scaleSize(42),
        // paddingLeft:ScreenUtils.scaleSize(19),
        height:42,
        paddingLeft:19,
        paddingRight:19,
    },
    headerText:{
        color:'#fff',
        fontSize:12,
        maxWidth:56
        // fontSize:ScreenUtils.setSpText(12),
    },
    newsInco:{
        position:'absolute',
        top:1,
        left:11,
        width:6,
        height:6
    },
    topic: {
        width:Util.size.width*0.76,
        // height:32,
        // alignItems:'center',
        justifyContent:'flex-start',
        backgroundColor: '#fff',
        borderBottomWidth:1,
        borderBottomColor:'#E5E5E5',
        paddingLeft:15
    },
    topicItem: {
        marginRight:22,
        paddingTop:10,
        paddingBottom:5,
    },
    topicItemActive:{
        marginRight:22,
        paddingTop:10,
        paddingBottom:5,
        borderBottomColor:'#54B1FF',
        borderBottomWidth:5,
    },
    topicTitle:{
        color:'#9B9B9B',
        // fontSize:ScreenUtils.setSpText(12)
        fontSize:12,
    },
    Active:{
        color:"#4a4a4a",
        // fontSize:ScreenUtils.setSpText(12)
        fontSize:12,
        fontWeight:'400'
    },
    select:{
        backgroundColor:'#fff',
        paddingTop:10,
        paddingBottom:10,
        paddingRight:11,
        width:Util.size.width*0.24,
        // height:32,
        borderLeftColor:'#E5E5E5',
        borderLeftWidth:1,
        borderBottomWidth:1,
        borderBottomColor:'#E5E5E5',
    },
    selectBox:{
        width:Util.size.width*0.24,
        borderLeftColor:'#E5E5E5',
        borderLeftWidth:1,
        borderRightColor:'#E5E5E5',
        borderRightWidth:1,
        borderBottomWidth:1,
        borderBottomColor:'#E5E5E5',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
        position:'absolute',
        top:38,
        right:0,
        zIndex:999,
        backgroundColor:'#fff',
    },
    selectItem:{
        padding:10,
        color:'#333',
        textAlign:'center'
    },
    selectItem1:{
        borderBottomColor:'#D0D4DB',
        borderBottomWidth:0.5,
    },
    listItemBox:{
        backgroundColor:'#fff',
        marginTop:15,
        paddingLeft:9,
        paddingRight:9
    },
    listItemName:{
        flexDirection:'row',
        justifyContent:'space-between',
        borderBottomColor:'#D0D4DB',
        borderBottomWidth:0.5,
        paddingLeft:7,
        paddingTop:9,
        paddingBottom:8,
        paddingRight:3
    },
    ss:{
        justifyContent:'center',
        alignItems:'center'
    },
    userStatus:{
        backgroundColor:'#54B1FF',
        // color:'#fff',
        // paddingTop:3,
        // paddingBottom:3,
        // paddingRight:5,
        // paddingLeft:5,
        borderRadius:10,
        marginLeft:3,
        width:40,
        height:16,
        alignItems:'center',
        justifyContent:'center'
        // fontSize:10
    },
    homeIcon:{
        marginRight:8
    },
    lovationIcon:{
        marginRight:9
    },
    time:{
        fontSize:10,
        color:'#ccc'
    },
    listItemTime:{
        paddingLeft:7,
        paddingRight:8,
        paddingTop:11,
        paddingBottom:12,
        borderBottomColor:'#D0D4DB',
        borderBottomWidth:0.5,
    },
    listItemTimeCon:{
        alignItems:'center',
        marginRight:28,
        maxWidth:'45%'
    },
    listItemInfoLicon:{
        flex:1
    },
    listItemInfoLis:{
        alignItems:'center',
        marginLeft:45,
        flex:2
    },
    listItemInfo:{
        backgroundColor:'#f8f8fa',
        marginBottom:10,
        marginTop:8,
        paddingLeft:7,
        paddingRight:8,
        paddingTop:11,
    },
    listItemInfoLi:{
        marginBottom:15,
        marginRight:46,
    },

    listItemAction:{
        justifyContent:'space-between',
        marginTop:15,
        alignItems:'center',
    },
    labelBox:{
        borderWidth:1,
        borderColor:'#ddd',
        borderRadius:10,
        marginRight:12,
        alignItems:'center',
        justifyContent:'center',
        height:17,
        backgroundColor:'#f8f8fa',
        marginBottom:12
    },
    label:{
        color:'#cccccc',
        fontSize:12,
        paddingLeft:7,
        paddingRight:7,
    },
    jiedan1:{
        backgroundColor:"#fff",
        paddingTop:6,
        paddingBottom:6,
        paddingLeft:18,
        paddingRight:18,
        borderRadius:10,
        fontSize:18,
        color:'#4a4a4a',
        marginBottom:10
    },
    jiedan2:{
        backgroundColor:"#fff",
        paddingTop:3,
        paddingBottom:3,
        paddingLeft:18,
        borderRadius:10,
        paddingRight:18,
        color:'#ccc',
        fontSize:18,
        marginBottom:10
    }
});
export default HomeStyle;