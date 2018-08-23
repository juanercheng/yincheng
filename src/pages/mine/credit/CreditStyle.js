/**
 * Created by Ld by 2018/8/1.
 */
import {StyleSheet} from 'react-native';
import Util from './../../../js/util';
import px2dp from './../../../js/px2dp';

const CreditStyle = StyleSheet.create({
    container: {
        width: Util.size.width,
        backgroundColor: '#F8F8FA',
        paddingTop: 20,
    },
    TextBox: {
        backgroundColor:'#fff',
        marginBottom: 21
    },
    NoText: {
        width: '100%',
        color: '#54B1FF',
        paddingTop: 12,
        paddingBottom: 11,
        paddingLeft: 11,
    },
    stateText: {
        width: '100%',
        color: '#54B1FF',
        paddingTop: 12,
        paddingBottom: 11,
        paddingLeft: 11,
    },
    because: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: 11,
        paddingRight: 11,
        marginBottom: 32,
    },
    iptBox: {
        width: '100%',
        backgroundColor: '#fff',
//        box-shadow: 0 2px 4px 0 rgba(245,245,245,0.50);
    },
    rowBox: {
        width: '100%',
        paddingLeft: 12.9,
        paddingRight: 13.6,
    },
    textRow: {
        width:'100%',
        height: 44,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 0.5,
        borderBottomColor: '#D0D4DB',
        alignItems: 'center',
    },
    inputBox: {
//        width: '50%',
        flex: 1,
        justifyContent: 'flex-end',
        textAlign: 'right',
        //        height: 44,
    },
    NoInputText: {
        fontSize: 10,
        color: '#ccc'
    },
    inputText: {
        fontSize: 14,
        color: '#9B9B9B'
    },
    idCardImg: {
        width: 283,
        height: 179
    },
    comText: {
        color:'#54B1FF',
        fontSize:14,
        marginTop: 10,
        marginBottom: 46,
        width: 260,
        textAlign: 'center',
        lineHeight: 20
    },
    subBox: {
        width: '100%',
        paddingRight: 53,
        paddingLeft: 53,
        marginBottom: 86,
    },
    sub: {
        width: '100%',
        height: 40,
        backgroundColor: '#54B1FF',
        borderRadius: 20,
        alignItems: 'center',
        paddingTop: 6
    },
    alertBox: {
        width: '100%',
        paddingHorizontal: 17,
        paddingTop: 16,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 8,
        marginTop: 88,
        alignItems: 'center'
    },
    btn: {
        width: 146,
        height: 40,
        borderRadius: 8,
    },
    cancel: {
        borderWidth: 2,
        borderColor: '#54B1FF',
        backgroundColor: '#fff'
    },
    confirm: {
        backgroundColor: '#54B1FF'
    },
});
export default CreditStyle;