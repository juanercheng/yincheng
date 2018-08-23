/**
 * Created by Ld by 2018/8/1.
 */
import {StyleSheet} from 'react-native';
import Util from './../../../js/util';

const AccountStyle = StyleSheet.create({
    container: {
        width: Util.size.width,
        height: Util.size.height,
//        backgroundColor: '#3994FF',
        paddingLeft: 15,
        paddingRight: 15,
//        paddingTop: 46,
        paddingBottom: 85,
//        paddingTop: 6,
        position: 'relative',
    },
    user: {
//        height: 40,
        width: '100%',
        paddingTop: 11,
        paddingBottom: 10,
        backgroundColor: '#F5F6F8',
        marginTop: -40,
//        marginBottom: 43,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        zIndex: 999,
    },
    topBox: {
//        marginTop: -46,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        paddingLeft: 30,
        paddingRight: 23,
        paddingTop: 28,
        paddingBottom: 28,
        marginBottom: 20,
    },
    headRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
//        marginTop: 28
    },
    headBox: {
        width: 100,
        height:100,
        backgroundColor: '#fff',
        borderRadius: 100,
        marginLeft: 26,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
    },
    rec: {
        paddingTop: 9,
        paddingBottom:11,
        paddingLeft: 57,
        paddingRight: 57,
//        width: 180,
//        height: 46,
        backgroundColor: '#3E9AFF',
        borderRadius: 10,
        alignItems: 'center'
    },
    recordBox: {
//        paddingTop: 12,
        paddingBottom: 11,
        backgroundColor: '#fff',
        borderRadius: 10
    },
    TextBox: {
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 9,
        backgroundColor: '#F5F6F8',
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    recordRow: {
//        height: 59,
        paddingTop: 8,
        paddingBottom: 6,
        borderBottomColor: '#D0D4DB',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        paddingLeft: 9,
        backgroundColor: '#fff'
    },
    head: {
        width: 90,
        height: 90,
        borderRadius: 50,
    },
    dataView: {
        height:30,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius:10
    },
    dataText: {
        color:'#666',
        fontSize:12,
        marginTop:5,
        marginBottom:5
    }
});
export default AccountStyle;