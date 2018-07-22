
//昵称      <Img></Img>
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    Dimensions,
    Alert,
    ToastAndroid,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import moment from 'moment';
import MyStlye from '../common/myStyle';
import Icon from 'react-native-vector-icons/Ionicons';
import ImageUtils from './../common/iamgeUtils';
import Qiniu, { Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu';
import config from "../common/config"
import request from "../common/request"
import DeviceStorage from './../common/deviceStorage';
export default class CommonCellRightImg extends Component {

    static defaultProps = {
        title: '',  // 左标题
        rightTitle: '',
        dataKey: '',
        params: {},
        uploadCallBack: null,
        // isTouchable: true,
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
        };
        this._renderRightView = this._renderRightView.bind(this);
        this._clickCell = this._clickCell.bind(this);
        this._uploadImage = this._uploadImage.bind(this);
        this._uploadCallBack = this._uploadCallBack.bind(this);
        this._fetchUpdate = this._fetchUpdate.bind(this);
        this._asyncUpdateData = this._asyncUpdateData.bind(this)
    }

    _uploadImage(uri, imageNextName) {
        let params = this.props.params;
        if (params.hasOwnProperty("type") && params.hasOwnProperty("id"));
        ImageUtils.getMac(params).then((data) => {
            if (data && data.success) {
                let macParams = {};
                data.data.forEach((dataObj) => {
                    macParams[dataObj.dataKey] = dataObj.dataValue;
                })
                return macParams;
            }
        }).then((macParams) => {
            console.log(macParams)
            let imgBaseUri = macParams.imageBaseName;
            let tempArr = [];
            let time = moment().format('YYYYMMDDHHmm');
            let key = imgBaseUri + "_" + imageNextName + "_" + time;//TODO: 但是不加的話 就會有問題 不显示最新图片 不需要時間戳
            let params = {
                uri: uri,
                key: key,
            }
            let policy = {
                scope: config.imgUrl.bucket + ":" + key,
                returnBody:
                    {
                        key: "$(key)",
                        hash: "$(etag)",
                    },
            }
            Rpc.uploadFile(params, policy).then((data) => {
                overImgUri = config.imgUrl.base + data.key;
                this._fetchUpdate(overImgUri);
            }).catch((err) => { console.log(err) })
        })
    }

    _fetchUpdate(overImgUri) {
        let url = "";
        let key = this.props.dataKey;
        let params = this.props.params;
        let upParams = {};
        let id = "";
        let asynKey = "";
        switch (params.type) {
            case "user":
                url = config.uri.user + config.user.update2;
                id = "userId";
                asynKey = "user"
                break;
            case "team":
                url = config.uri.team + config.team.update2;
                id = "teamId";
                break;
            default:
                break;
        }
        upParams[id] = params.id;
        upParams[key] = overImgUri;
        request.post(url, upParams).then((result) => {
            if (result && result.success) {
                if (asynKey == "user") {
                    this._asyncUpdateData(result.data); //更新本地緩存
                    this._uploadCallBack(overImgUri);//更新界面
                } else {
                    this._uploadCallBack(overImgUri);
                    ToastAndroid.show('更新成功', ToastAndroid.SHORT);
                }

            } else {
                ToastAndroid.show('更新失敗', ToastAndroid.SHORT);
            }
        })
    }

    _asyncUpdateData(data) {
        console.log("user", data)
        DeviceStorage.save("user", data).then(() => {
            ToastAndroid.show('更新成功', ToastAndroid.SHORT);
        })
    }

    _uploadCallBack(uri) {
        if (this.props.uploadCallBack != null) {
            this.props.uploadCallBack(this.props.dataKey, uri)
        } else {
            return;
        }
    }

    render() {
        return (
            <TouchableOpacity onPress={() => this._clickCell(this.props.dataKey)}>
                <View style={styles.container}>
                    {/*左边*/}
                    <Text style={styles.leftTextStyle}>{this.props.title}</Text>
                    {/*右边*/}
                    {this._renderRightView()}
                </View>
            </TouchableOpacity>
        );
    }

    _clickCell(dataKey) {
        let util1 = new ImageUtils(MyStlye.account.img.avatar.width, MyStlye.account.img.avatar.height);
        let util2 = new ImageUtils(MyStlye.account.img.backImg.width, MyStlye.account.img.backImg.height);
        // 判断处理
        if (dataKey.endsWith("Backimg")) {
            util2.pickSingle(true, ).then((result) => {
                console.log(result);
                this._uploadImage(result.path, "bkimg");
            });
        } else if (dataKey.endsWith("Avatar")) {
            console.log("avatar", 111)
            util1.pickSingle(true, true).then((result) => {
                console.log("avatar", result);
                this._uploadImage(result.path, "avatar");
            });
        }
    }

    _renderRightView() {
        let dataKey = this.props.dataKey;
        if (dataKey == "userBackimg" || dataKey == "teamBackimg") {
            var imageCell = <Image source={{ uri: this.props.rightTitle }} style={styles.rightBackImg} />
        } else if (dataKey == "userAvatar" || dataKey == "teamAvatar") {
            var imageCell = <Image source={{ uri: this.props.rightTitle }} style={styles.rightAvatar} />
        }
        // 判断
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {imageCell}
            </View>
        )
    }


}



const styles = StyleSheet.create({
    rightAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    rightBackImg: {
        width: 40,
        height: 40,
        marginRight: 8,
    },
    container: {
        height: Platform.OS == 'ios' ? 50 : 55,
        backgroundColor: 'white',
        borderBottomColor: '#dddddd',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        // 主轴的对齐方式
        justifyContent: 'space-between',
        // 垂直居中
        alignItems: 'center',
        width: width,
    },
    leftTextStyle: {
        marginLeft: 8,
        color: 'black',
    },
    rightTextStyle: {
        color: '#aaa',
        marginRight: 8,
        width: width / 3,
        textAlign: 'right',
    }

});

