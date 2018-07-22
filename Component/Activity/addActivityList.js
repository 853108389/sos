/**
 *TODO添加活动页面
 */
import React, { Component } from 'react';
import moment from 'moment';
import Qiniu, { Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    AsyncStorage,
    Image,
    NativeModules,
    Alert,
    ToastAndroid,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Title from '../commonView/title';
import CommonCellImg from '../commonView/CommonCellImg';
import CommonCellsWithModal from '../commonView/CommonCellsWithModal'
import Icon from 'react-native-vector-icons/Ionicons';
import AddActivityUploadImg from './addActivityUploadImg';
import AddActivityItemEdit from './addActivityItemEdit';
import DeviceStorage from '../common/deviceStorage';
import config from '../common/config'
import request from '../common/request'
import addActivityUploadBackImg from '../Activity/addActivityUploadBackImg'
import ImageUtils from './../common/iamgeUtils';
import UploadModal from '../commonView/uploadModal'
import InitJson from '../common/initJson'
const imageUtils = new ImageUtils();

export default class AddActivityList extends Component {

    static defaultProps = {
        isMulty: false,
        teamId: '',
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            data: null,
            message: '',
        };
        this._pushAcitivityUploadImg = this._pushAcitivityUploadImg.bind(this)
        this._pushActivityItemEdit = this._pushActivityItemEdit.bind(this)
        this._asyncGetActivityEditInfo = this._asyncGetActivityEditInfo.bind(this);
        this._saveDataCallBack = this._saveDataCallBack.bind(this);
        this._renderMiddleBoxView = this._renderMiddleBoxView.bind(this)
        this._renderImageBoxView = this._renderImageBoxView.bind(this);
        this._renderButton = this._renderButton.bind(this);
        this._renderImage = this._renderImage.bind(this);
        this._renderBackImage = this._renderBackImage.bind(this);
        this._renderImageBox = this._renderImageBox.bind(this);
        this._fetchAddActivity = this._fetchAddActivity.bind(this);
        this._fetchQiniuUpload = this._fetchQiniuUpload.bind(this);
    }

    render() {
        // console.log(this.state.message)
        let data = this.state.data;
        if (data == null) {
            return <View></View>
        }
        let { activityInfo, activityWay, activityRequire, connectWay, memo, activityImg } = data;
        return (
            <ScrollView>
                <View style={styles.container}>
                    {this._renderMiddleBoxView('基本信息', "共" + activityInfo.length + "条", activityInfo, "activityInfo")}
                    {this._renderMiddleBoxView('活动方式', "共" + activityWay.length + "条", activityWay, "activityWay", true)}
                    {this._renderMiddleBoxView('参赛要求', "共" + activityRequire.length + "条", activityRequire, "activityRequire", true)}
                    {this._renderMiddleBoxView('联系方式', "共" + connectWay.length + "条", connectWay, "connectWay")}
                    {this._renderMiddleBoxView('备注', "共" + memo.length + "条", memo, "memo", true)}
                    {this._renderImageBoxView('附图', "共" + data.activityImg.length + "张", true)}
                    {this._renderImageBoxView('上传头图(封面)', (JSON.stringify(data.activityBackimg) == "{}") ? "共0张" : "共1张")}
                    {this._renderButton()}
                    <UploadModal ref="uplodaModal"></UploadModal>
                </View>
            </ScrollView>
        );
    }

    _setFileParams = (perc, oloaded, total, dataKey) => {
        console.log("fileArr", perc, oloaded, total, dataKey);
        let tempArr = [];
        let isExist = false;//是否存在相同key对象
        let fileObj = {
            dataKey: dataKey,
            perc: perc,
            oloaded, oloaded,
            total: total
        };
        let fileArr = this.refs.uplodaModal.getInfo("fileArr");
        if (fileArr.length > 0) {
            tempArr = fileArr.map((tempObj, i) => {
                // console.log(tempObj.dataKey == fileObj.dataKey)
                if (tempObj.dataKey == fileObj.dataKey) {
                    isExist = true;//是存在相同key对象
                    return fileObj
                } else {
                    return tempObj
                }
            })
            if (!isExist) { //如果不存在
                tempArr.push(fileObj);
                isExist = false;
            }
        } else {
            tempArr.push(fileObj);
            console.log("push2", fileArr.length > 0)
        }
        this.refs.uplodaModal.setInfo({
            fileArr: tempArr,
        })
        console.log("fileArr", JSON.stringify(this.refs.uplodaModal.getInfo("fileArr")));
    }

    _fetchQiniuUploadDetail1 = (uriObj, macParams, myUriObj, afterUpdateCallBack) => {
        if (uriObj.backImgUri == null || uriObj.backImgUri == "") {
            afterUpdateCallBack(myUriObj);
        }
        this.refs.uplodaModal.setInfo({
            message: "上传背景图(0/1)"
        })
        let imgBaseUri = macParams.imageBaseName;//部门id_活动数量+1
        let tempArr = [];
        let time = moment().format('YYYYMMDDHHmm');
        let key = imgBaseUri + "_" + "bkimg" + "_" + time;
        let params = {
            uri: uriObj.backImgUri,
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
        Rpc.uploadFile(params, policy, ((perc, oloaded, total, key) => { this._setFileParams(perc, oloaded, total, key) })).then((data) => {
            myUriObj.backImgUri = config.imgUrl.base + data.key;
            myUriObj.imgUriArr = [];
            this.refs.uplodaModal.setInfo({
                message: "上传背景图(1/1)",
            })
            this._fetchQiniuUploadDetail2(uriObj, macParams, myUriObj, afterUpdateCallBack);
        }).catch((err) => { console.log(err) })
    }

    _fetchQiniuUploadDetail2 = (uriObj, macParams, myUriObj, afterUpdateCallBack) => {
        let size = 0;
        let imgBaseUri = macParams.imageBaseName;
        let imgUriArr = uriObj.imgUriArr;
        if (imgUriArr == null || imgUriArr.length == 0) {
            afterUpdateCallBack(myUriObj);
        }
        this.refs.uplodaModal.setInfo({
            message: "上传附图(" + size + "/" + imgUriArr.length + ")",
        })
        imgUriArr.forEach((imgUri, i) => {
            let time = moment().format('YYYYMMDDHHmm');
            let key = imgBaseUri + "_" + "attimg" + i + "_" + time;
            let params = {
                uri: imgUri,
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
            Rpc.uploadFile(params, policy, ((perc, oloaded, total, key) => { this._setFileParams(perc, oloaded, total, key) })).then((data) => {
                myUriObj.imgUriArr.push(config.imgUrl.base + data.key)
                size++;
                this.refs.uplodaModal.setInfo({
                    message: "上传附图(" + size + "/" + imgUriArr.length + ")"
                })
                if (imgUriArr.length == size) {
                    afterUpdateCallBack(myUriObj);
                }
            }).catch((err) => { size++ })
        })
    }

    _fetchQiniuUpload = (uriObj, afterUpdateCallBack) => {
        this.refs.uplodaModal.setInfo({
            message: "获取上传秘钥(0/1)",
        })
        let params = {
            type: "act",
            id: this.props.teamId,
        }
        return ImageUtils.getMac(params).then((data) => {
            if (data && data.success) {
                let macParams = {};
                data.data.forEach((dataObj) => {
                    macParams[dataObj.dataKey] = dataObj.dataValue;
                })
                this.refs.uplodaModal.setInfo({
                    message: "获取上传秘钥(1/1)",
                })
                return macParams;
            }
        }).then((macParams) => {
            return this._fetchQiniuUploadDetail1(uriObj, macParams, {}, afterUpdateCallBack)
        })
    }


    _fetchAddActivity() {
        Alert.alert('温馨提醒', '你确定要发布活动吗?', [
            { text: '取消' },
            {
                text: '确定', onPress: () => {
                    this.refs.uplodaModal._openModal();
                    let uriObj = {};
                    let params = Object.assign({}, this.state.data); //TODO 深拷贝
                    params.activityInfo.push({ id: params.activityInfo.length + 1, lable: "社团id", dataKey: "teamId", dataValue: this.props.teamId });
                    let url = config.uri.activity + config.activity.add;
                    // alert(JSON.stringify(params))
                    // console.log(JSON.stringify(params));
                    let backImgObj = params.activityBackimg;
                    let imgArr = params.activityImg;
                    uriObj.backImgUri = backImgObj.uri;//背景图uri
                    let tempArr = [];
                    imgArr.forEach((obj, i) => {
                        tempArr.push(obj.uri);
                    })
                    uriObj.imgUriArr = tempArr;//附图uri数组
                    this._fetchQiniuUpload(uriObj, (myUriObj) => {
                        this.refs.uplodaModal.setInfo({
                            message: "上传数据到服务器..."
                        })
                        let data = myUriObj;
                        backImgObj.uri = data.backImgUri;
                        imgArr.forEach((obj, i) => {
                            obj.uri = data.imgUriArr[i]
                        })
                        request.post(url, params).then((result) => {
                            if (result && result.success) {
                                this.refs.uplodaModal.isFinish(true);
                                this.refs.uplodaModal._closeModalWithTime(500);
                                this.forceUpdate();
                                ToastAndroid.show('发布成功~', ToastAndroid.SHORT);
                            }
                        }).then(() => {
                            //清空缓存数据
                            InitJson.reActivityEditInfo();
                            ImageUtils.cleanImage();
                        }).catch((err) => {
                            alert(err)
                        })
                    });
                }
            }
        ])
    }

    _renderImage(imageArr) {
        // alert(JSON.stringify(imageArr))
        let cellArr = [];
        imageArr.forEach((imageObj, i) => {
            let uri = imageObj.uri;
            let cell =
                <TouchableOpacity key={i} >
                    <Image style={styles.imageStyle} source={{ uri: uri }} />
                </TouchableOpacity>
            cellArr.push(cell)
        })
        return cellArr;
    }

    _renderBackImage(imageObj) {
        let cell =
            <TouchableOpacity >
                <Image style={styles.imageStyle} source={{ uri: imageObj.uri }} />
            </TouchableOpacity>
        return cell;
    }

    _renderImageBox(isMulty) {
        let cell = null;
        if (isMulty) {
            cell = <View style={styles.imgBox}>
                {this.state.data.activityImg ? this._renderImage(this.state.data.activityImg) : null}
            </View>
        } else {
            cell = <View style={styles.imgBox}>
                {this.state.data.activityBackimg ? this._renderBackImage(this.state.data.activityBackimg) : null}
            </View>
        }
        return cell
    }

    _renderButton() {
        return (
            <View style={styles.submitBox}>
                <TouchableOpacity onPress={() => { this._fetchAddActivity() }}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText} >发布活动</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    refreshData = () => {
        this._asyncGetActivityEditInfo();
    }

    componentDidMount() {
        this.refreshData();
    }

    _asyncGetActivityEditInfo() {
        AsyncStorage.getItem('activityEditInfo')
            .then((data) => {
                if (data) {
                    activityEditInfo = JSON.parse(data);
                }
                this.setState({
                    data: activityEditInfo,
                });
            })
            .catch((err) => {
                alert(err);
            });
    }


    _pushAcitivityUploadImg() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'addActivityUploadImg',
                component: AddActivityUploadImg,
                params: {
                    saveDataCallBack: (() => { this._asyncGetActivityEditInfo() }),
                }
            })
        } else {
            alert(111)
        }
    }

    _pushActivityUploadBackImg() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'addActivityUploadBackImg',
                component: addActivityUploadBackImg,
                params: {
                    saveDataCallBack: (() => { this._asyncGetActivityEditInfo() }),
                }
            })
        } else {
            alert(111)
        }
    }

    _saveDataCallBack(activityEditInfo, dataKey) {
        this.refs[dataKey]._saveDataInfo(activityEditInfo[dataKey])
        this.setState({
            data: activityEditInfo,
        })
    }

    _pushActivityItemEdit(dataKey, data, isMulty = false) {
        if (dataKey === "activityInfo") {
            return;
        }
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'addActivityItemEdit',
                component: AddActivityItemEdit,
                params: {
                    //当前数据
                    dataKey: dataKey,
                    ansyKey: "activityEditInfo",
                    data: data,
                    isMulty: isMulty,
                    saveDataCallBack: this._saveDataCallBack
                    //先本地储存  发布活动时统一上传到服务器
                }
            })
        } else {
            alert(111)
        }
    }

    _renderImageBoxView(leftTitle, rightTitle, isMulty = false) {
        return (
            <View>
                <View style={styles.middleBoxView}>
                    <View style={styles.middleView}>
                        <CommonCellImg leftTitle={leftTitle} rightTitle={rightTitle} callBackLeftIcon={() => {
                            return (
                                <View >
                                    <Icon name='ios-information'
                                        size={20}
                                        style={styles.leftImgStyle}
                                    />
                                </View>
                            )
                        }}
                            callBackClickCell={() => { isMulty ? this._pushAcitivityUploadImg() : this._pushActivityUploadBackImg() }}
                        />
                    </View>
                </View>
                {this._renderImageBox(isMulty)}
            </View>
        )
    }


    _renderMiddleBoxView(leftTitle, rightTitle, data, dataKey, isMulty = false) {
        return (
            <View style={styles.middleBoxView}>
                <View style={styles.middleView}>
                    <CommonCellImg leftTitle={leftTitle} rightTitle={rightTitle} callBackLeftIcon={() => {
                        return (
                            <View >
                                <Icon name='ios-information'
                                    size={20}
                                    style={styles.leftImgStyle}
                                />
                            </View>
                        )
                    }}
                        callBackClickCell={() => { this._pushActivityItemEdit(dataKey, data, isMulty) }}
                    />
                </View>
                <CommonCellsWithModal ref={dataKey} isMulty={isMulty} data={data} dataKey={dataKey} ansyKey="activityEditInfo"></CommonCellsWithModal>
            </View>
        )
    }

}
const styles = StyleSheet.create({
    imageStyle: {
        width: width / 8,
        height: width / 8,
        resizeMode: 'stretch',
        borderWidth: 1,
        borderColor: "#C0FF3E"
    },
    btn: {
        height: 50,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ee735d',
        marginTop: 25,
        marginRight: 10,
        marginLeft: 10,
    },
    btnText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ee735d'
    },
    submitBox: {
        marginBottom: 40
    },
    container: {
        flex: 1,
        backgroundColor: '#eee',
    },
    middleBoxView: {
        flex: 1,
    },
    middleView: {
        marginTop: 15,
    },
    leftImgStyle: {
        marginRight: 6,
        borderRadius: 12,
        backgroundColor: '#eee',
        width: 20,
        textAlign: 'center',
    },
    imgBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
});








