// /**
//  * Created by yangHL on 2018/3/16.
//  */
import {Dimensions} from 'react-native'
import {pixelRatio, screenH, screenW} from "./ScreenUtils";

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const basePx = 375;
const baseHeightPx = 667;

export default function px2Width(px) {
    return px * deviceWidth / basePx
}
// export default function px2baseHeight(px) {
//     return px * baseHeightPx / basePx
// }
// export default class px2dp {
//     static  px2Width(px) {
//         return px * deviceWidth / basePx
//     }
//     /**
//      * 屏幕适配,缩放size
//      * @param size
//      * @returns {Number}
//      * @constructor
//      */
//     static px2baseHeight(px) {
//         return px * deviceHeight / baseHeightPx
//     }
// }