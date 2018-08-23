import axios from 'axios'
import React, { PureComponent } from 'react';
import { Modal, Toast ,} from 'antd-mobile-rn'
import { StackNavigator } from 'react-navigation';
const alert = Modal.alert;
import global from './global';
import GetSetStorage from './GetSetStorage';
import './storage'


// storage.load({
//     key: 'token',
// }).then(ret => {
//     global.login.token = ret;
//     console.log(ret,'token')
// })
GetSetStorage.getStorageAsync('token').then((result) => {global.login.token = result})
// axios基本配置
axios.defaults.timeout = 15000
axios.defaults.baseURL = 'http://chijun.xin/yincheng/api/'
// axios.defaults.baseURL = 'http://47.100.34.60/farmproduct/api/'


axios.defaults.withCredentials = false;
// http request 拦截器
// axios.interceptors.request.use(
// 	config => {
//         // const token = global.login.token;
//         // if (token) {
//         //     config.headers.Authorization = token;
//         // }
// 		return config
// 	},
// 	err => {
// 		return Promise.reject(err)
// 	}
// );

//http response 拦截器
axios.interceptors.response.use(
	response => {
		if(response.status === 4001){
			Toast.info("身份失效重新登录", 1);

			global.navigation.navigate('Login')
				storage.remove({
					key:'token',
			})
		}
		if (response.status !== 200){
            Toast.info(response.error, 1);
			return response.data
		}else{
			return response.data
		}
	},
	error => {
		console.log(error)
		return Promise.reject(error)
	})

export default class HttpUtils {
	/**
	 * post 请求方法
	 * @param url
	 * @param data
	 * @returns {Promise}
	 */
	static post (url, params) {

        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            url = url+'?token=' + global.login.token
			if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }

		return new Promise((resolve, reject) => {
			axios.post(url)
				.then(response => {
					console.log(response)
					resolve(response)
                    Toast.hide();
                }, err => {
                    console.log(response);
					reject(err)
			 })
		})
	}
	/**
	 * get 请求方法
	 * @param url
	 * @param data
	 * @returns {Promise}
	 */
	static get (url, params) {
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            url = url+'?token=' + global.login.token
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
		return new Promise((resolve, reject) => {
			axios.get(url)
				.then(response => {
					console.log(response)
					resolve(response)
                    Toast.hide();
                }, err => {
					reject(err)
				})
		})
	}
	/**
	 * put 请求方法
	 * @param url
	 * @param id
	 * @param data
	 * @returns {Promise}
	 */
	static put (url, id, data) {
		return new Promise((resolve, reject) => {
			axios.put(url + id, data)
				.then(response => {
					resolve(response)
                    Toast.hide();
				}, err => {
					reject(err)
				})
		})
	}

	/**
	 * delete 请求方法
	 * @param url
	 * @param id
	 * @returns {Promise}
	 */
	static  _delete (url, id) {
		return new Promise((resolve, reject) => {
			axios.delete(url + id)
				.then(response => {
					resolve(response)
                    Toast.hide();
				}, err => {
					reject(err)
				})
		})
	}
    /**
     * 无需token请求方法
     * @param url
     * @param id
     * @returns {Promise}
     */
    static postNormal (url, params) {
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            url = url+'?token=' + global.login.token
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        return new Promise((resolve, reject) => {
            axios.post(url, params)
                .then(response => {
                    resolve(response)
                }, err => {
                    reject(err)
                })
        })
    }
    static getNormal (url, params) {
        if (params) {
            let paramsArray = [];
            //拼接参数
            Object.keys(params).forEach(key => paramsArray.push(key + '=' + params[key]))
            url = url+'?token=' + global.login.token
            if (url.search(/\?/) === -1) {
                url += '?' + paramsArray.join('&')
            } else {
                url += '&' + paramsArray.join('&')
            }
        }
        return new Promise((resolve, reject) => {
            axios.get(url, params)
                .then(response => {
                    resolve(response)
                }, err => {
                    reject(err)
                })
        })
    }

}
