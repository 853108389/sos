/**
TODO
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    DatePickerAndroid,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Title from '../commonView/title'
import CommonCell from '../commonView/CommonCell'
const { width, height } = Dimensions.get('window');
export default class CellWithModal extends Component {

    static defaultProps = {
        data: {},
        modalType: '',
        saveCallBack: null,
        // dataKey: "",//{dataKey:[dataObj:xxx,dataObj:xxx]}
        // url: '', //更新服务器时的url
        // ansyKey: '', //更新本地时的key

    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            data: this.props.data,
            dataObj: {},
            renderView: '',
            //modal
            animationType: 'fade',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            //picker
        };
        //render
        this._renderInfoCell = this._renderInfoCell.bind(this);
        this._renderModal = this._renderModal.bind(this);
        this._renderGenderView = this._renderGenderView.bind(this);
        this._renderDatePickerView = this._renderDatePickerView.bind(this);
        this._renderPasswordView = this._renderPasswordView.bind(this);
        //modal
        this._closeModal = this._closeModal.bind(this);
        this._openModal = this._openModal.bind(this);
        this._setModalVisible = this._setModalVisible.bind(this);
        //open
        this._openDatePicker = this._openDatePicker.bind(this);
        //click
        this._onclickCell = this._onclickCell.bind(this);
        this._clickGender = this._clickGender.bind(this);

    }

    //渲染公共info组件
    _renderInfoCell() {
        let dataKey = this.props.dataKey;
        let data = this.state.data;
        let cellView = [];
        for (let i = 0; i < data.length; i++) {
            let dataObj = data[i]
            let lable = dataObj.lable //左标题 数据lable
            let dataValue = dataObj.dataValue; //右标题 数据值
            let title = lable;//标题
            var cell = <CommonCell key={i} title={lable} rightTitle={dataValue}
                callBackClickCell={() => {
                    this._onclickCell(dataObj);
                }}>
            </CommonCell>;
            cellView.push(cell)
        }
        return cellView;
    }

    _saveDataInfo(dataObj) {
        // alert(JSON.stringify(dataObj))
        let data = this.state.data;
        data.forEach((item) => {
            if (item.dataKey == dataObj.dataKey) {
                item = dataObj
            }
        })
        if (this.props.saveCallBack != null) {
            this.props.saveCallBack();
        }
        // alert(JSON.stringify(data))
        // this._fetchUpdataData(data);
    }

    _onclickCell(dataObj) {
        this.setState({
            dataObj: dataObj,
        }, () => {
            this._openModal();
        })
    }

    _openDatePicker() {
        let dataObj = this.state.dataObj;
        let dataValue = dataObj.dataValue;
        let myDate = new Date();
        if (dataValue != null && dataValue != "") {
            let dateArr = dataValue.split("-");
            myDate.setFullYear(dateArr[0], dateArr[1] - 1, dateArr[2])
        }
        // let theMinDate = new Date(2015, 1, 1);
        // let theMaxDate = new Date(2025, 1, 1);
        let option = {
            date: myDate,
            // minDate: theMinDate,
            // maxDate: theMaxDate,
        };

        DatePickerAndroid.open(option).then(
            result => {
                if (result.action === DatePickerAndroid.dismissedAction) {

                } else {
                    let dataObj = this.state.dataObj;
                    dataObj.dataValue = `${result.year}-${result.month + 1}-${result.day}`
                    this.setState({
                        dataObj: dataObj,
                    }, () => {
                        this._saveDataInfo(dataObj)
                    });
                }
                this._closeModal();
            }
        ).catch(
            error => {
                console.log('出错了:' + error);

            });
    }


    render() {
        return (
            <View style={styles.container}>
                {this._renderInfoCell()}
                {this._renderModal()}
            </View>
        );
    }

    _clickGender(genderType) {
        let dataObj = this.state.dataObj;
        if (genderType == "0") {
            //男
            dataObj.dataValue = "男";
        } else if (genderType == "1") {
            //女
            dataObj.dataValue = "女";
        }
        this.setState({
            dataObj: dataObj,
        }, () => {
            this._saveDataInfo(dataObj)
            this._closeModal();
        });

    }

    _renderPasswordView() {
        return <View>
            <Text>userPassword</Text>
        </View>
    }

    _renderGenderView() {
        return (
            <Modal
                animationType={this.state.animationType}
                transparent={this.state.transparent}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                }}
                onShow={() => { }}
            >
                <TouchableWithoutFeedback onPress={() => { this._closeModal() }} style={styles.modalContainer}>
                    <View style={styles.modalContainer}>
                        <View style={styles.genderPickBox}>
                            <TouchableOpacity onPress={() => { this._clickGender("0") }}>
                                <View style={styles.genderBox}>
                                    <FontAwesome name="mars" size={40} color="rgba(255,0,0,0.4)" style={styles.imgStyle} />
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { this._clickGender("1") }}>
                                <View style={styles.genderBox}>
                                    <FontAwesome name="venus" size={40} color="rgba(255,0,0,0.4)" style={styles.imgStyle} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>
        )
    }


    _renderDatePickerView() {
        return (
            <Modal
                animationType={this.state.animationType}
                transparent={this.state.transparent}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                }}
                onShow={this._openDatePicker}
            >
            </Modal>
        )
    }

    _renderModal() {
        let dataObj = this.state.dataObj;
        let dataKey = dataObj.dataKey;
        if (dataKey === "userBirthday") {
            return this._renderDatePickerView();
        } else if (dataKey === "userGender") {
            return this._renderGenderView();
        } else if (dataKey === "userPassword") {
            return this._renderPasswordView();
        }
        return (
            null
        )

    }


    _closeModal() {
        this._setModalVisible(false);
    }

    _openModal() {
        this._setModalVisible(true);
    }

    _setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: 'center',
    },
    modalBox: {
        alignItems: "center",
        justifyContent: 'center',
    },
    genderPickBox: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    genderBox: {
        backgroundColor: "white",
        width: width / 3,
        height: width / 3,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: width / 6,
    },
    imgStyle: {
    },
});








