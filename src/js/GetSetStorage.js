import {
    AsyncStorage,
} from 'react-native';

class GetSetStorage {
    /**
     * 异步保存
     */
    setStorageAsync(key, value) {
        return new Promise((resolve, reject) => {
            AsyncStorage.setItem(key, value, (error) => {
                if (error) {
                    console.log('==========================');
                    console.log(`设置${key}失败${error}`);
                    console.log('==========================');
                    reject(`设置${key}失败${error}`);
                } else {
                    console.log('==========================');
                    console.log(`设置${key}成功`);
                    console.log('==========================');
                    resolve(true);
                }
            });
        });
    }
    /**
     * 异步获取
     */
    getStorageAsync(key) {
        return new Promise((resolve, reject) => {
            AsyncStorage.getItem(key, (error, result) => {
                if (error) {
                    console.log('==========================');
                    console.log(`读取${key}失败` + error);
                    console.log('==========================');
                    reject(`读取${key}失败${error}`);
                } else {
                    console.log('==========================');
                    console.log(`读取${key}成功`);
                    console.log('==========================');
                    resolve(result);
                }
            });
        });

    }

    ClearStorageAsync(key) {
        return new Promise((resolve, reject) => {
            //removeItem( key: string, callback?: ( error?: Error ) => void ): Promise<string>
            AsyncStorage.removeItem(key, (error, result) => {
                if (error) {
                    console.log('==========================');
                    console.log(`删除${key}失败` + error);
                    console.log('==========================');
                    reject(`删除${key}失败${error}`);
                } else {
                    console.log('==========================');
                    console.log(`删除${key}成功`);
                    console.log('==========================');
                    resolve('ok');
                }
            });
            // AsyncStorage.clear(key,reject).then(
            //     (res)=>{
            //         //删除成功后的操作
            //         console.log("success delete");
            //         reject(res)
            //     }
            // ).catch(
            //     (error)=>{
            //         //处理异常操作
            //         console.log("error:"+error.message);
            //     }
            // )
        });

    }

}
export default new GetSetStorage();