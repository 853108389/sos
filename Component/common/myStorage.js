import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

export default class MyStorage {
    constructor(props) {

    }

    static init(size = 1000, defaultExpires = null, enableCache = true) {
        let storage = new Storage({
            // 最大容量，默认值1000条数据循环存储
            size: size,
            // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
            // 如果不指定则数据只会保存在内存中，重启后即丢失
            storageBackend: AsyncStorage,
            // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
            defaultExpires: defaultExpires,
            // 读写时在内存中缓存数据。默认启用。
            enableCache: enableCache,
            // 如果storage中没有相应数据，或数据已过期，
            // 则会调用相应的sync方法，无缝返回最新数据。
            // sync方法的具体说明会在后文提到
            // 你可以在构造函数这里就写好sync的方法
            // 或是在任何时候，直接对storage.sync进行赋值修改
            // 或是写到另一个文件里，这里require引入
            // TODO:
            // sync: require('你可以另外写一个文件专门处理sync')
        })
        return storage;
    }

    static save = (key, data, expires = null) => {
        storage.save({
            key: key,
            data: data,
            //expires为有效时间
            expires: expires
        })
    }
    static load(key, data, extraFetchOptions = {}, expires = null) {
        // 读取
        return storage.load({
            key: key,
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: true,
            // syncInBackground(默认为true)意味着如果数据过期，
            // 在调用sync方法的同时先返回已经过期的数据。
            // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
            syncInBackground: true,
            // 你还可以给sync方法传递额外的参数
            syncParams: {
                extraFetchOptions: extraFetchOptions,
                someFlag: true,
            },
        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            console.warn(err.message);
            switch (err.name) {
                case 'NotFoundError':
                    // TODO;
                    break;
                case 'ExpiredError':
                    // TODO
                    break;
            }
        })
    }

    static getBatchData(objectArr) {
        return storage.getBatchData(objectArr)
    }
    static remove(object) {
        return storage.remove(object)
    }

}

