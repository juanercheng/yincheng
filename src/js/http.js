import {
    Platform,NetInfo
} from 'react-native';
import global from './global'
import './storage'
import sha1 from 'crypto-js/sha1';
import md5 from 'crypto-js/md5';

// const rootPath='http://47.100.34.60/farmproduct/api/';
const rootPath='http://chijun.xin/yincheng/api/';

// const rootPath = 'http://47.100.34.60/angelogis/api/';
// const rootPath = 'http://chijun.xin/guower/api/';
storage.load({
    key: 'token',
}).then(ret => {
    global.login.token = ret;
    console.log(ret,'token')
})
storage.load({
    key: 'userId',
}).then(ret => {
    global.login.userId = ret;
    console.log(ret,'userId')
})
export default class HttpUtils {
    /**
     * 对象空过滤
     * @param obj
     * @returns {{}}
     */
    static dataNullOrUndefinedfilter(obj) {

        var newObj = {};
        for (var key in obj) {
            if (obj[key] !== null) {
                newObj[key] = obj[key]
            }
        }
        return newObj;
    };

    /**
     * 异步数据处理
     * @param obj
     * @returns {string}
     */
    static transformRequest(obj, splitSymbol) {
        var str = [];
        for (var s in obj) {
            var value = obj[s];
            if (typeof value === 'object') {
                value = JSON.stringify(value)
            }
            str.push(s + "=" + value);
        }
        splitSymbol = (splitSymbol === '' || splitSymbol) ? '' : '&';
        return str.join(splitSymbol);
    };

    /*
     签名方法：
    */
    static getSignature(params) {
        if (Platform.OS === 'ios') {
            params['driverName'] = 'iOS';
            params['privateKey'] = 'pikb25cc12ee8e677418c738460b05';
            params['uuid'] = 'web123456789';
        } else {
            params['driverName'] = 'android';
            params['privateKey'] = 'pakf98dc169b0ce15f4f4248198322';
            params['uuid'] = 'web123456789';
        }
        params['timestamp'] = Date.parse(new Date()) / 1000;

        var keyArray = Object.keys(params).sort();
        var newObj = {};
        keyArray.map(function (item) {
            newObj[item] = params[item];
        });
        var objToString = sha1(md5(this.transformRequest(this.dataNullOrUndefinedfilter(newObj), '').substring(3, 28)))
        return objToString;
    }

    static postData(url, params, callback) {
        var signature = this.getSignature(params);
        delete params['privateKey'];
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
//        console.log(global.token)
        fetch(rootPath + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                    // token:"ac91a4a5-15be-4adf-acbc-57a39ee15dd4",
                token:global.login.token,
                signature: signature
            }
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            callback(responseJSON)
        })
        .catch((error) => {
            console.log(error)
        });
    }
    //POST请求没有token方法
    static postNoTokenData(url, params, callback) {
        var signature = this.getSignature(params);
        console.log(signature);
        delete params['privateKey'];
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        fetch(rootPath + url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // signature: signature
            }
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            callback(responseJSON)
        })
        .catch((error) => {
            console.log(error,3434)
        });
    }
    //GET请求没有token方法
    static getNoTokenData(url, params, callback) {
        var signature = this.getSignature(params);
        console.log(signature);
        delete params['privateKey'];
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        fetch(rootPath + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                // signature: signature
            }
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            // console.log(responseJSON);
            callback(responseJSON)
        })
        .catch((error) => {
            console.log(error)
        });
    }

    /*
     *  get请求
     *  url:请求地址
     *  params:参数
     *  callback:回调函数
     * */
    static getData(url, params, callback) {
        var signature = this.getSignature(params);
        delete params['privateKey'];
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        fetch(rootPath + url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: global.login.token,
                signature: signature
            }
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            // console.log(responseJSON);
            callback(responseJSON)
        })
        .catch((error) => {
            console.log(error)
        });
    }
    static deleteData(url, params, callback) {
        var signature = this.getSignature(params);
        delete params['privateKey'];
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        fetch(rootPath + url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: global.login.token,
                signature: signature
            }
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            callback(responseJSON)
        })
        .catch((error) => {
            console.log(error)
        });
    }
    static PutData(url, params, callback) {
        var signature = this.getSignature(params);
        delete params['privateKey'];
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        fetch(rootPath + url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                token: global.login.token,
                signature: signature
            }
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            callback(responseJSON)
        })
        .catch((error) => {
            console.log(error)
        });
    }

}