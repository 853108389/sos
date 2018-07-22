/**
TODO 一样的图片长按就都删除了... 
TODO 手势拖动界面 ,可以移动图片位置
 */

import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Dimensions,
    ToastAndroid,
    Alert,
} from 'react-native';

import Video from 'react-native-video';
import Title from '../commonView/title';
import Icon from 'react-native-vector-icons/Ionicons';
import CommonCellImg from '../commonView/CommonCellImg'
import DeviceStorage from '../common/deviceStorage';
import config from '../common/config';
import request from '../common/request';
import MyStyle from "../common/myStyle"
import moment from 'moment';
import Qiniu, { Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu';
import ImageUtils from './../common/iamgeUtils';
import UploadModal from '../commonView/uploadModal'
import CommonChooseImage from './../commonView/CommonChooseImage';
const { width, height } = Dimensions.get('window');
const imageUtils = new ImageUtils(MyStyle.team.img.swiper.width, MyStyle.team.img.swiper.height);
export default class TeamUploadSwipImg extends Component {
    static defaultProps = {
        teamId: "",
    }; //
    /**
     * imageArr:[
     *  {
     *    //id:xxx,
     *    uri:xxx,
     *    width:xxx,
     *    height:xxx,
     *    mime:xxx,
     *  }
     * ]
     */
    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            imageArr: [],//imageOBj形式  选择的照片
            imageArr2: [],//uri数组形式 已经上传过得照片
        };
        //pick
        this._cleanupImages = this._cleanupImages.bind(this);
        this._cleanupSingleImage = this._cleanupSingleImage.bind(this);
        this._pickSingle = this._pickSingle.bind(this);
        this._pickMultiple = this._pickMultiple.bind(this);
        this._pickSingleWithCamera = this._pickSingleWithCamera.bind(this);
        //select
        this._selectMoreMenu = this._selectMoreMenu.bind(this);
        //render
        this._renderImage = this._renderImage.bind(this);
        //ansy
        this._saveImgInfo = this._saveImgInfo.bind(this);
        //fetch
        this._fetchTeamDetailById = this._fetchTeamDetailById.bind(this);

    }
    /**
     * 获取原有的轮播
     */
    _fetchTeamDetailById() {
        let teamId = this.props.teamId;
        if (teamId == "") {
            return
        }
        let data = {
            id: teamId,
        }
        let url = config.uri.team + config.team.detail;
        request.post(url, data)
            .then((result) => {
                if (result && result.success) {
                    let imageArr2 = result.data.teamSwipimg.split("<#>");
                    imageArr2.shift();
                    this.setState({
                        imageArr2: imageArr2,
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    //清除所有图片
    _cleanupImages() {
        this.setState({
            imageArr: [],
        })
    }

    //清除一张图片
    _cleanupSingleImage(uri) {
        let imageArr = this.state.imageArr;
        imageArr = imageArr.filter((imageObj) => {
            return imageObj.uri !== uri;
        })
        this.setState({
            imageArr: imageArr,
        })
    }

    //选择一张图片 (编辑,圆形编辑)
    _pickSingle(cropit, circular = false) {
        imageUtils.pickSingle(cropit, circular).then(image => {
            let imageArr = this.state.imageArr;
            let imageObj = {
                uri: image.path,
                width: image.width,
                height: image.height,
                mime: image.mime
            };
            imageArr.push(imageObj)
            this.setState({
                imageArr: imageArr
            });
        }).catch(e => {
            console.log(e);
            Alert.alert(e.message ? e.message : e);
        });
    }

    //选择多张图片
    _pickMultiple() {
        imageUtils.pickMultiple().then(images => {
            let imageArr = this.state.imageArr;
            images = images.map(i => {
                return { uri: i.path, width: i.width, height: i.height, mime: i.mime };
            });
            imageArr = [...imageArr, ...images]
            this.setState({
                imageArr: imageArr,
            })
        }).catch(e => Alert.alert(e));
    }

    //从相机拍照
    _pickSingleWithCamera(cropping) {
        imageUtils.pickSingleWithCamera().then(image => {
            let imageArr = this.state.imageArr;
            let imageObj = {
                uri: image.path,
                width: image.width,
                height: image.height,
                mime: image.mime
            };
            imageArr.push(imageObj)
            this.setState({
                imageArr: imageArr
            });
        }).catch(e => alert(e));
    }

    _selectMoreMenu(idx, value) {
        if (value === "从相机..") {
            this._pickSingleWithCamera(false)
        } else if (value === "从相册(编辑)") {
            this._pickSingle(true)
        } else if (value === "从相册(多选)") {
            this._pickMultiple();
        }
    }

    _renderImage(imageArr) {
        let cellArr = [];
        imageArr.forEach((imageObj, i) => {
            let uri = imageObj.uri;
            let cell =
                <TouchableOpacity key={i} delayLongPress={3000} onLongPress={() => { this._cleanupSingleImage(uri) }}>
                    <Image style={styles.imageStyle} source={{ uri: uri }} />
                </TouchableOpacity>
            cellArr.push(cell)
        })
        return cellArr;
    }

    _renderImage2 = (imageArr2) => {
        if (!Array.isArray(imageArr2) || imageArr2.length == 0) {
            return;
        }
        let cellArr = [];
        imageArr2.forEach((uri, i) => {
            let cell = <CommonChooseImage ref={"choose" + i} key={i} uri={uri}></CommonChooseImage>
            cellArr.push(cell)
        })
        return cellArr;
    }


    _setFileParams = (perc, oloaded, total, dataKey) => {
        // console.log("fileArr", perc, oloaded, total, dataKey);
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
        // console.log("fileArr", JSON.stringify(this.refs.uplodaModal.getInfo("fileArr")));
    }

    _saveImgInfo() {
        let url = config.uri.team + config.team.update2;//更新用户uri
        let imgArr = this.state.imageArr; //选择后的图片数组
        imgArr = imgArr.map((imgObj) => {
            return imgObj.uri;
        })
        // console.log("imgArr", imgArr)
        Alert.alert('温馨提醒', '你确定要更新轮播图吗?', [
            { text: '取消' },
            {
                text: '确定', onPress: () => {
                    //TODO: 保留已选择的轮播 拼接str
                    this.refs.uplodaModal._openModal();
                    this._fetchQiniuUpload(imgArr, (imgArr) => {
                        this.refs.uplodaModal.setInfo({
                            message: "上传数据到服务器..."
                        })
                        let tempStr = ""; //上传的图片字符串
                        for (let i = 0; i < this.state.imageArr2.length; i++) {
                            if (this.refs["choose" + i].isChoose()) {
                                tempStr += "<#>";
                                tempStr += this.refs["choose" + i].getUri();
                            }
                        }
                        let params = {}; //上传参数
                        imgArr.forEach((uri, i) => {
                            tempStr += "<#>";
                            tempStr += uri;
                        })
                        params.teamId = this.props.teamId;
                        params.teamSwipimg = tempStr;
                        console.log("params", params);
                        request.post(url, params).then((result) => {
                            if (result && result.success) {
                                this._fetchTeamDetailById()//更新原有视图
                                this.refs.uplodaModal.isFinish(true);
                                this.refs.uplodaModal._closeModalWithTime(500);
                                ToastAndroid.show('上传成功~', ToastAndroid.SHORT);
                            }
                        }).then(() => {
                            //清空缓存数据
                            ImageUtils.cleanImage();
                        }).catch((err) => {
                            alert(err)
                        })
                    });
                }
            }
        ])

    }

    componentDidMount() {
        //根据社团id从网络中fetch轮播图地址 
        this._fetchTeamDetailById();
        ImageUtils.cleanImage();
    }

    render() {
        return (
            <View style={styles.container}>
                <Title title='添加轮播图'
                    leftView={true}
                    navigator={this.props.navigator}
                    rightMoreView={true}
                    moreMenuData={['从相机..', '从相册(编辑)', '从相册(多选)']}
                    selectMoreMenuCallBack={(idx, value) => { this._selectMoreMenu(idx, value) }}>
                </Title>
                <ScrollView>
                    <CommonCellImg leftTitle={"图片列表"} rightTitle={"长按图片删除"} callBackLeftIcon={() => {
                        return (
                            <View >
                                <Icon name={"ios-information"}
                                    size={20}
                                    style={styles.leftImgStyle}
                                />
                            </View>
                        )
                    }}
                        callBackClickCell={() => {
                            Alert.alert('温馨提醒', '你确定要清空图片吗?', [
                                { text: '取消' },
                                {
                                    text: '确定', onPress: () => {
                                        this._cleanupImages()
                                        ToastAndroid.show('咻咻~', ToastAndroid.SHORT)
                                    }
                                }
                            ])
                        }}
                    />
                    <View style={styles.imgBox}>
                        {this.state.imageArr ? this._renderImage(this.state.imageArr) : null}
                    </View>
                    <View style={{ marginVertical: 10 }}></View>
                    <CommonCellImg leftTitle={"已有轮播图片"} rightTitle={"选择保留的图片"} callBackLeftIcon={() => {
                        return (
                            <View >
                                <Icon name={"ios-information"}
                                    size={20}
                                    style={styles.leftImgStyle}
                                />
                            </View>
                        )
                    }}
                        callBackClickCell={() => {
                            Alert.alert('温馨提醒', '你确定要清空轮播吗?', [
                                { text: '取消' },
                                {
                                    text: '确定', onPress: () => {
                                        ToastAndroid.show('咻咻~', ToastAndroid.SHORT)
                                    }
                                }
                            ])
                        }}
                    />
                    <View style={styles.imgBox}>
                        {this.state.imageArr2 ? this._renderImage2(this.state.imageArr2) : null}
                    </View>
                    <View style={styles.logoutBox}>
                        <TouchableOpacity onPress={this._saveImgInfo}>
                            <View style={styles.btn}>
                                <Text style={styles.btnText} >保存</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                <UploadModal ref="uplodaModal"></UploadModal>
            </View>
        );
    }

    _fetchQiniuUpload = (imgArr, afterUpdateCallBack) => {
        this.refs.uplodaModal.setInfo({
            message: "获取上传秘钥(0/1)",
        })
        let params = {
            type: "team",
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
            return this._fetchQiniuUploadDetail1(imgArr, macParams, afterUpdateCallBack)
        })
    }

    _fetchQiniuUploadDetail1 = (imgUriArr, macParams, afterUpdateCallBack) => {
        let resultArr = []; //返回结果数组
        let size = 0; //当前进度
        let imgBaseUri = macParams.imageBaseName; //图片前缀名
        if (imgUriArr == null || imgUriArr.length == 0) {
            afterUpdateCallBack(resultArr); //回调
        }
        this.refs.uplodaModal.setInfo({
            message: "上传新轮播图(" + size + "/" + imgUriArr.length + ")",
        })
        imgUriArr.forEach((imgUri, i) => {
            let time = moment().format('YYYYMMDDHHmm');
            let key = imgBaseUri + "_" + "swipimg" + i + "_" + time;
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
                resultArr.push(config.imgUrl.base + data.key)
                size++;
                this.refs.uplodaModal.setInfo({
                    message: "上传新轮播图(" + size + "/" + imgUriArr.length + ")"
                })
                if (imgUriArr.length == size) {
                    afterUpdateCallBack(resultArr);
                }
            }).catch((err) => { size++ })
        })
    }


}
const styles = StyleSheet.create({
    leftImgStyle: {
        marginRight: 6,
        borderRadius: 12,
        backgroundColor: '#eee',
        width: 20,
        textAlign: 'center',
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
    logoutBox: {
        marginBottom: 40
    },
    imageStyle: {
        width: width / 2,
        height: 190 / 2,
        resizeMode: 'stretch',
        borderWidth: 1,
        borderColor: "#C0FF3E"
    },
    container: {
        flex: 1,
    },
    button: {
        backgroundColor: 'blue',
        marginBottom: 10
    },
    text: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    },
    imgBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    }
});








