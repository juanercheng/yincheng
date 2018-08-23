/**
 * Created by Ld by 2018/8/1.
 */
import {StyleSheet} from 'react-native';
import Util from './../../../js/util';
import px2dp from './../../../js/px2dp';


const SetStyle = StyleSheet.create({
    SetContainer:{
        width: Util.size.width,
        height: Util.size.height,
        backgroundColor: '#F8F8FA',
        position: 'relative'
    },
    //Set
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: '#D0D4DB',
    },
    SetRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 55,
        alignItems: 'center',
        borderColor: '#D0D4DB',
        borderBottomWidth: 0.5,
        paddingLeft: 14,
        paddingRight: 11,
        backgroundColor: '#fff'
    },
    SetIcon: {
        marginRight: 13,
        alignSelf: 'center'
    },
    SetArrow: {
    },
    //Soft
    SoftRow: {
        paddingTop: 17,
        paddingBottom: 18,
        borderBottomWidth: 0.5,
        borderBottomColor: '#D0D4DB',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 15,
        paddingRight: 13,
        backgroundColor: '#fff'
    },
    //PushRow
    PushRow: {
        flexDirection:'row',
        justifyContent: 'space-between',
        height: 57.3,
        backgroundColor: '#fff',
//        paddingTop: 17,
//        paddingBottom: 18,
        borderBottomColor: '#D0D4DB',
        borderBottomWidth: 0.5,
        paddingLeft: 16,
        paddingRight: 15,
        alignItems: 'center',
    },
    //FeedBack
    textBox: {
//        paddingLeft: 15,
//        paddingRight: 15,
        width: '100%',
        paddingHorizontal:15,
        marginTop: 8,
        marginBottom: 9,
        borderRadius: 8,
        position: 'relative'
    },
    text: {
        width: '100%',
        height: 200,
        textAlignVertical: 'top',
        backgroundColor:'#F8F8FA',
        borderRadius:10
    },
    maxLength: {
//        textAlign: 'right',
        color:'#9B9B9B',
        fontSize:14,
        paddingRight: 11,
        position: 'absolute',
        right: 26,
        top: 196
    },
    connectBox: {
        width: '100%',
        paddingHorizontal:15,
        marginTop: 8,
        borderRadius: 8,
    },
    connect: {
        width: '100%',
        backgroundColor:'#F8F8FA',
        height: 60,
        borderRadius:10
    },
    sub: {
        width: Util.size.width,
        paddingTop: 11,
        paddingBottom: 11,
        backgroundColor: '#54B1FF',
        alignItems: 'center',
        position: 'absolute',
        bottom: 23,
        left:0
    },
    fontBold: {
        fontWeight: '400'
    },
});
export default SetStyle;