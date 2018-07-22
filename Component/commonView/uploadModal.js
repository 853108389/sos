/**
 * 文件上传modal
 */
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
// import * as Progress from 'react-native-progress';
const { width, height } = Dimensions.get('window');
export default class UploadModal extends Component {

    static defaultProps = {
    }; //

    constructor(props) {
        super(props);
        this.state = {
            animationType: 'fade',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            isFinish: false,
            info: {
                fileArr: [],
                message: ".................",
            }
        };
    }
    render() {
        let cell1 = <View style={{ flex: 1 }}>
            {this._renderModal()}
        </View>
        return (
            <View>
                {cell1}
            </View>
        )
    }
    _renderModal = () => {
        let titleCell = null;
        let flagCell = null;
        let showCellArr = [];
        let fileArr = this.state.info.fileArr;
        if (fileArr.length > 0) {

        } else {

        }
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
                        <Text style={{ color: "#ccc" }}>({fileObj.oloaded}</Text>
                        <Text style={{ color: "#ccc" }}>/</Text>
                        <Text style={{ color: "#ccc" }}>{fileObj.total})</Text>
                    </Text>
                </Text>
            showCellArr.push(showCell)
        })
        if (this.state.isFinish) {
            titleCell = <Text style={{ fontSize: 18, color: "black", marginVertical: 12 }}>上传完毕</Text>
            flagCell = <Icon name='md-checkmark' size={36} style={{ color: "green" }} />
        } else {
            titleCell = <Text style={{ fontSize: 18, color: "black", marginVertical: 12 }}>上传文件中...</Text>
            // flagCell = <Progress.Circle
            //     size={75}
            //     showsText={true}
            //     color={'#ee735d'}
            //     progress={fileObj.perc}
            // /> 多文件无法使用饼状进度图 TODO: 使用条状之类的
            flagCell = <ActivityIndicator animating={true} size={"large"} />
        }
        return <Modal
            animationType={this.state.animationType}
            transparent={this.state.transparent}
            visible={this.state.modalVisible}
            onRequestClose={() => {
                this._closeModal()
            }}
            onShow={this._startShow}
        >
            <View style={styles.modalContainer}>
                <View style={{ alignSelf: "center", borderRadius: 5, backgroundColor: "#ffffcc", width: width / 1.5, height: width / 1.5 }}>
                    <View style={{ justifyContent: "space-between", marginHorizontal: 10 }}>
                        <View style={{ alignItems: "center" }}>
                            {titleCell}
                        </View>
                        <View style={{ marginVertical: 10, alignItems: 'center' }}>
                            {flagCell}
                        </View>
                        {messageCell}
                        <View style={{ alignSelf: "center", alignItems: "center", justifyContent: "space-between" }}>
                            {showCellArr}
                        </View>
                    </View>
                </View>
            </View >
        </Modal>
    }

    setInfo = (info) => {
        let infoState = this.state.info;
        for (let key of Object.keys(info)) {
            infoState[key] = info[key];
        }
        this.setState({
            info: infoState,
        })
        // console.log("info", this.state.info)
    }

    getInfo = (key) => {
        let infoState = this.state.info;
        return infoState[key];
    }

    isFinish = (flag) => {
        this.setState({
            isFinish: flag,
        })
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
