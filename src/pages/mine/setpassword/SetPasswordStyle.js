/**
 * Created by Ld by 2018/8/1.
 */
import {StyleSheet} from 'react-native';
import Util from './../../../js/util';
import px2dp from './../../../js/px2dp';

const SetPasswordStyle = StyleSheet.create({
    container: {
        width: Util.size.width,
        height: Util.size.height,
        backgroundColor: '#F8F8FA',
        alignItems: 'center',
        paddingTop: '18.8%',
        paddingLeft: '13%',
        paddingRight: '12.6%',
    },
   textRow: {
       width: '100%',
       height: 72.5,
       flexDirection: 'row',
       alignItems: 'center',
       position: 'relative',
   },
   iconBox: {
        width: '7.7%',
        alignItems: 'center',
        marginRight: '3.9%'
   },
   icon: {
//       marginRight: 16,
//       alignSelf: 'center'
   },
   inputBox: {
       flex: 1,
       borderBottomColor: '#D0D4DB',
       borderBottomWidth: 0.5,
//       backgroundColor: '#000',
       paddingLeft: 0,
       fontSize: 12,
   },
  code: {
//       width: 83,
//       height: 25,
        paddingTop: 7,
        paddingRight: 3,
        paddingBottom: 6,
        paddingLeft: 2,
//       alignItems: 'center',
//       alignSelf: 'center',
       borderWidth: 1,
       borderColor: '#54b1ff',
       backgroundColor: '#fff',
       position: 'absolute',
       right:0,
       bottom: 18,
       borderRadius: 3
    },
   sub: {
       width: '100%',
       height: 40,
       backgroundColor: '#54b1ff',
       borderRadius: 20,
       alignItems: 'center',
       marginTop: 50.5,
       flexDirection: 'row',
       justifyContent: 'center'
   }
});
export default SetPasswordStyle;