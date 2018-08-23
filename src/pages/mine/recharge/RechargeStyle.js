/**
 * Created by Ld by 2018/8/1.
 */
import {StyleSheet} from 'react-native';
import Util from './../../../js/util';
import px2dp from './../../../js/px2dp';
const boxWidth = Util.size.width / 2 - 12;
const RechargeStyle = StyleSheet.create({
    containerBox: {
        width: Util.size.width,
        backgroundColor: '#F8F8FA',
    },
    container: {
        width: Util.size.width,
//        height: Util.size.height,
        paddingTop: 21,
        paddingHorizontal: 15
    },
    itemRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginBottom: 32,
    },
    bgImg: {
        width: Util.size.width*0.45,
        height: Util.size.width*0.27,
//        marginRight: 12,
        alignItems: 'center',
        justifyContent:'center',
        // paddingTop: 30,
        marginBottom: 12
//        position: 'relative',
    },
    mon: {
        fontSize: 36,
        color: '#fff',
        backgroundColor:'rgba(0,0,0,0)'
    },
    checkMon: {
        fontSize: 36,
        color: '#54B1FF',
        backgroundColor:'rgba(0,0,0,0)'
    },
    mons: {
        fontSize: 12,
        color: '#fff',
        backgroundColor:'rgba(0,0,0,0)'
    },
    checkMons: {
        fontSize: 12,
        color: '#54B1FF',
        backgroundColor:'rgba(0,0,0,0)'
    },
    payBox: {
        width: '100%',
        paddingLeft: 7,
        paddingRight: 6.9,
        borderRadius: 7,
        backgroundColor: '#fff',
//        box-shadow: 0 2px 4px 0 rgba(245,245,245,0.50);
    },
    payRow: {
        width: '100%',
//        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 9,
        paddingBottom: 10,
        paddingLeft: 3,
        paddingRight: 20,
        justifyContent: 'space-between',
        borderBottomColor: '#D0D4DB',
        borderBottomWidth: 0.5,
        alignSelf: 'center'
    },
    borderBottomNone: {
        width: '100%',
//        height: 64,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 9,
        paddingBottom: 10,
        paddingLeft: 3,
        paddingRight: 20,
        justifyContent: 'space-between',
        alignSelf: 'center'
    },
    confirm: {
        width: '100%',
        paddingLeft: 38,
        paddingRight: 38,
        marginTop: 140,
        marginBottom: 80
    },
    con: {
        width: '100%',
        height: 40,
        backgroundColor: '#54B1FF',
        borderRadius: 20,
        alignItems: 'center',
        paddingTop: 6,
    }
});
export default RechargeStyle;