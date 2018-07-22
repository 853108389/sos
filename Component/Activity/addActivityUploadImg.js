/**
TODO 一样的图片长按就都删除了... 
 */

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  NativeModules,
  Dimensions,
  ToastAndroid,
  Alert,
} from 'react-native';

import Video from 'react-native-video';
import Title from '../commonView/title';
import Icon from 'react-native-vector-icons/Ionicons';
import CommonCellImg from '../commonView/CommonCellImg'
import DeviceStorage from '../common/deviceStorage';
import ImageUtils from '../common/iamgeUtils'
const { width, height } = Dimensions.get('window');
const imgWidth = width / 4;
const ImagePicker = NativeModules.ImageCropPicker;
const imageUtils = new ImageUtils(imgWidth, imgWidth);
export default class AddActivityUploadImg extends Component {

  static defaultProps = {
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
      imageArr: [],
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

  }

  //清除所有图片
  _cleanupImages() {
    let Imgobj = {};
    Imgobj["activityImg"] = [];
    DeviceStorage.update("activityEditInfo", Imgobj).then(() => {
      this.setState({
        imageArr: [],
      })
      ToastAndroid.show('咻咻~', ToastAndroid.SHORT);
      if (this.props.saveDataCallBack != null) {
        this.props.saveDataCallBack(Imgobj["activityImg"]);
      }
    })
  }

  //清除一张图片
  _cleanupSingleImage(uri) {
    let imageArr = this.state.imageArr;
    imageArr = imageArr.filter((imageObj) => {
      return imageObj.uri !== uri;
    })
    let Imgobj = {};
    Imgobj["activityImg"] = imageArr;
    DeviceStorage.update("activityEditInfo", Imgobj).then(() => {
      this.setState({
        imageArr: imageArr,
      })
      if (this.props.saveDataCallBack != null) {
        this.props.saveDataCallBack(imageArr);
      }
    })
  }

  //选择一张图片 (编辑,圆形编辑)
  _pickSingle(cropit, circular, includeBase64 = false) {
    imageUtils.pickSingle(cropit, circular, includeBase64).then(image => {
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
  _pickMultiple(includeBase64 = false) {
    imageUtils.pickMultiple(includeBase64).then(images => {
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
  _pickSingleWithCamera(cropping, includeBase64 = false) {
    imageUtils.pickSingleWithCamera(cropping, includeBase64).then(image => {
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
        <TouchableOpacity key={i} delayLongPress={1000} onLongPress={() => { this._cleanupSingleImage(uri) }}>
          <Image style={styles.imageStyle} source={{ uri: uri }} />
        </TouchableOpacity>
      cellArr.push(cell)
    })
    return cellArr;
  }

  _saveImgInfo() {
    let Imgobj = {};
    let tempArr = [];
    let imgArr = this.state.imageArr; //props
    Imgobj["activityImg"] = imgArr;
    DeviceStorage.update("activityEditInfo", Imgobj).then(() => {
      ToastAndroid.show('保存成功~', ToastAndroid.SHORT);
      //更新完本地数据后,执行回调,更新上一个视图
      if (this.props.saveDataCallBack != null) {
        this.props.saveDataCallBack();
      }
    })
  }

  componentDidMount() {
    DeviceStorage.get("activityEditInfo").then((value) => {
      return value.activityImg;
    }).then((imageArr) => {
      this.setState({
        imageArr: imageArr,
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Title title='添加图片'
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
          <View style={styles.logoutBox}>
            <TouchableOpacity onPress={this._saveImgInfo}>
              <View style={styles.btn}>
                <Text style={styles.btnText} >保存</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
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
    width: imgWidth,
    height: imgWidth,
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








