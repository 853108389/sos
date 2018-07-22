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
import myStyle from "../common/myStyle"
const { width, height } = Dimensions.get('window');
const imgWidth = myStyle.activity.img.imageStyle.width;
const imgHeight = myStyle.activity.img.imageStyle.height;
const imageUtils = new ImageUtils(imgWidth, imgHeight);
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
      imgObj: {},
    };
    //pick
    this._cleanupImages = this._cleanupImages.bind(this);
    this._pickSingle = this._pickSingle.bind(this);
    this._pickSingleWithCamera = this._pickSingleWithCamera.bind(this);
    //render
    this._renderImage = this._renderImage.bind(this);
    //ansy
    this._saveImgInfo = this._saveImgInfo.bind(this);

  }

  //清除图片
  _cleanupImages() {
    let imageobj = {};
    imageobj["activityBackimg"] = "";
    DeviceStorage.update("activityEditInfo", imageobj).then(() => {
      ToastAndroid.show('保存成功~', ToastAndroid.SHORT);
      //更新完本地数据后,执行回调,更新上一个视图
      if (this.props.saveDataCallBack != null) {
        this.props.saveDataCallBack(this.state.imgObj);
      }
    })
    DeviceStorage.save("activityEditBackImg", {}).then(() => {
      this.setState({
        imgObj: {},
      });
    });
  }

  // image: {uri: `data:${image.mime};base64,`+ image.data, width: image.width, height: image.height},
  //选择一张图片 (编辑,圆形编辑)
  _pickSingle(cropit, circular, includeBase64) {
    imageUtils.pickSingle(cropit, circular, includeBase64).then(image => {
      let imageObj = {
        uri: image.path,
        width: image.width,
        height: image.height,
        mime: image.mime
      };
      this.setState({
        imgObj: imageObj
      });
    }).catch(e => {
      console.log(e);
      Alert.alert(e.message ? e.message : e);
    });
  }

  //从相机拍照
  _pickSingleWithCamera(cropping, includeBase64) {
    imageUtils.pickSingleWithCamera(cropping, includeBase64).then(image => {
      let imageObj = {
        uri: image.path,
        width: image.width,
        height: image.height,
        mime: image.mime
      };
      this.setState({
        imgObj: imageObj
      });
    }).catch(e => alert(e));
  }


  _renderImage(imageObj) {
    let uri = imageObj.uri;
    let cell =
      <Image style={styles.imageStyle} source={{ uri: uri }} />
    return cell;
  }

  _renderNoImg() {
    let cell =
      <Image style={styles.imageStyle} />
    return cell;
  }

  _saveImgInfo() {
    let tempObj = {}
    let imgObj = this.state.imgObj;
    if (imgObj == null || JSON.stringify(imgObj) == "{}") {
      ToastAndroid.show('您还未选择图片- -', ToastAndroid.SHORT);
      return;
    }
    tempObj["activityBackimg"] = imgObj;
    DeviceStorage.update("activityEditInfo", tempObj).then(() => {
      // DeviceStorage.get("activityEditInfo").then((data)=>{
      //   alert(JSON.stringify(data))
      // });
      ToastAndroid.show('保存成功~', ToastAndroid.SHORT);
      //更新完本地数据后,执行回调,更新上一个视图
      if (this.props.saveDataCallBack != null) {
        this.props.saveDataCallBack();
      }
    })
  }

  componentDidMount() {
    DeviceStorage.get("activityEditInfo").then((value) => {
      return value.activityBackimg;
    }).then((imageObj) => {
      this.setState({
        imgObj: imageObj,
      })
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Title title='添加头图(封面)'
          leftView={true}
          navigator={this.props.navigator}
        >
        </Title>
        <ScrollView>
          <CommonCellImg leftTitle={"图片"} rightTitle={"点击清空"} callBackLeftIcon={() => {
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
          <TouchableOpacity onPress={() => { this._pickSingle(false, false) }}>
            <View style={styles.imgBox} >
              {this.state.imgObj ? this._renderImage(this.state.imgObj) : this._renderNoImg()}
            </View>
          </TouchableOpacity>
          <View style={styles.logoutBox}>
            <TouchableOpacity onPress={this._saveImgInfo}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>保存</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  ...myStyle.activity.img,
  //图片
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
});








