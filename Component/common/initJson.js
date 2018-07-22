import {
    AsyncStorage,
} from 'react-native';
import DeviceStorage from "../common/deviceStorage"

var activityEditInfoJson = require("../../LocalData/addActivity.json");
/**
 * 初始化本地JSON
 */
export default class InitJson {
    static initJsonData = () => {
        DeviceStorage.get('activityEditInfo').then((value) => {
            if (value == null || value == "undefined" || JSON.stringify(value) == "{}") {
                InitJson.reActivityEditInfo();
            }
        })
    }

    static cleanJsonData = () => {
        InitJson.initJsonData();
    }

    static reActivityEditInfo = () => {
        return DeviceStorage.save('activityEditInfo', activityEditInfoJson).catch((err) => {
            alert("初始化json失败:" + err);
        });
    }
}
