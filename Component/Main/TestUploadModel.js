import React, { Component } from 'react'
import {
  Text,
  View,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
export default class TestUploadModel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animationType: 'fade',//none slide fade
      modalVisible: false,//模态场景是否可见
      transparent: true,//是否透明显示
      isFinish: true,
      info: {
        fileArr: [{
          perc: "100",
          fileSize: "0",
          uploadFileSize: "0",
        }],
        message: "message.................",
      }
    };
  }
  render() {
    let cell1 = <View style={{ flex: 1 }}>
      {this._renderModal()}
    </View>
    let cell2 = <TouchableOpacity onPress={this._openModal}>
      <View>
        <Text>打开modal</Text>
      </View>
    </TouchableOpacity>;
    return (
      <View>
        {cell1}
        {cell2}
      </View>
    )
  }
  _renderModal = () => {
    let titleCell = null;
    let flagCell = null;
    let showCellArr = [];
    let fileArr = this.state.info.fileArr;
    let messageCell = <View style={{ alignSelf: "center" }}>
      <Text style={{ marginBottom: 5 }}>{this.state.info.message}</Text>
    </View>;
    fileArr.forEach((fileObj, i) => {
      let showCell =
        <Text key={i}>
          <Text style={{ marginBottom: 5, color: "#aaa" }}>
            {fileObj.perc}%
          </Text>
          <Text style={{ marginBottom: 5, }}>
            <Text style={{ color: "#ccc" }}>({fileObj.uploadFileSize}</Text>
            <Text style={{ color: "#ccc" }}>/</Text>
            <Text style={{ color: "#ccc" }}>{fileObj.fileSize})</Text>
          </Text>
        </Text>
      showCellArr.push(showCell)
    })
    if (this.state.isFinish) {
      titleCell = <Text style={{ fontSize: 18, color: "black", marginVertical: 12 }}>上传完毕</Text>
      flagCell = <Icon name='md-checkmark' size={36} style={{ color: "green" }} />
    } else {
      titleCell = <Text style={{ fontSize: 18, color: "black", marginVertical: 12 }}>上传文件中...</Text>
      flagCell = <ActivityIndicator animating={true} size={"large"} style={{ marginVertical: 10 }} />
    }
    return <Modal
      animationType={this.state.animationType}
      transparent={this.state.transparent}
      visible={this.state.modalVisible}
      onRequestClose={() => {
        this._closeModalWithTime(200)
      }}
      onShow={this._startShow}
    >
      <View style={styles.modalContainer}>
        <View style={{ alignSelf: "center", borderRadius: 5, backgroundColor: "#ffffcc", width: width / 1.5, height: width / 1.5 }}>
          <View style={{ justifyContent: "space-between", marginHorizontal: 10 }}>
            <View style={{ alignItems: "center" }}>
              {titleCell}
            </View>
            {flagCell}
            {messageCell}
            <View style={{ alignSelf: "center", alignItems: "center", justifyContent: "space-between" }}>
              {showCellArr}
            </View>
            <TouchableOpacity onPress={() => { this._closeModalWithTime(200) }}>
              <Text> aaa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View >
    </Modal >
  }


  _startShow = () => {

  }

  _closeModal = () => {
    this._setModalVisible(false);
  }

  _closeModalWithTime = (time) => {
    let timer = setTimeout(() => {
      this._closeModal();
      clearTimeout(timer)
    }, time);
  }

  _openModal = () => {
    this._setModalVisible(true);
  }

  _setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
}


const styles = StyleSheet.create({
  modalBox: {
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

});
