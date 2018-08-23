/**
 * Created by juaner by 18-07-24
 */
import {StyleSheet} from 'react-native';
import Util from './../../js/util';
import px2dp from './../../js/px2dp';

const MineStyle = StyleSheet.create({
    container: {
        width: Util.size.width,
        height: Util.size.height,
        backgroundColor: '#F8F8FA'
    },
    topBox:{
//        backgroundColor: '#429cfd',
//        paddingLeft:10,
//        paddingRight:10,
        paddingHorizontal: 10,
//        paddingTop:16
    },
    headBox:{
        width:'100%',
        flexDirection:'row',
        justifyContent:'space-between',
        backgroundColor:'#fff',
        alignItems:'center',
        alignSelf:'center',
        marginTop: 17,
        paddingVertical: 25,
        paddingLeft:25,
        paddingRight:23,
//        borderLeftWidth: 1,
//        borderRightWidth: 1,
//        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderLeftColor: '#F5F5F5',
        borderTopColor: '#F5F5F5',
        borderRightColor: '#F5F5F5',
        borderBottomColor: '#F5F5F5',
        borderColor: '#F5F5F5',
        borderRadius: 8,
    },
    bgF:{
        backgroundColor:'#F8F8FA',
        position:'absolute',
        bottom:0,
        right:0,
        width:Util.size.width,
        height: 46,
    },
    headImg: {
        width: 50,
        height: 50,
        borderRadius: 50
    },
    credit:{
        fontSize: 9,
        color: '#fff',
        fontWeight: 'bold',
//        width: 50,
//        height: 15,
        paddingHorizontal: 7,
        paddingVertical: 1,
        backgroundColor: '#54B1FF',
        textAlign: 'center',
        borderRadius: 5,
        marginLeft: 10,
        marginTop: 6,
    },
    contentBox: {
        width: '100%',
        alignSelf: 'center',
        paddingHorizontal: 10,
        borderRadius: 8,
        marginTop: 20,
        marginBottom: 20,
        //        boxShadow: 0 2px 4px 0 #F5F5F5;
    },
    content: {
        width: '100%',
        alignSelf: 'center',
        paddingLeft: 16,
        paddingRight: 15.9,
        backgroundColor: '#fff',
        borderRadius: 8
    },
    row: {
        width:'100%',
        flexDirection: 'row',
        justifyContent:'space-between',
        height: 54,
        borderBottomWidth: 0.5,
        borderBottomColor: '#D0D4DB',
        alignItems: 'center',
        paddingLeft: 10,
        paddingRight: 9.3,
    },
    txt: {
        marginLeft: 13,
        fontSize: 12,
        color: '#747474',
        alignSelf: 'center'
    },
    setRow: {
        width: '100%',
        height: 55,
        backgroundColor: '#fff',
//        boxShadow: 0 2px 4px 0 #F5F5F5;
        // shadowColor:'#000',
        // shadowOffset:{h:2,w:4},
        // shadowRadius: 10,
        // shadowOpacity: 4,
        borderRadius: 10,
        paddingLeft: 16,
        paddingRight: 15.9,
    },
    set: {
        width:'100%',
        height: 55,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent:'space-between',
        paddingLeft: 10,
        paddingRight: 9.3,
    },
    font18White: {
        fontSize: 18,
        color: '#fff',
    },
});
export default MineStyle;