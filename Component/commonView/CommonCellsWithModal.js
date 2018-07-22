import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Platform,
    Modal,
    Text,
    View,
    Dimensions,
} from 'react-native';

import config from '../common/config';
import request from '../common/request';
import CommonCell from '../commonView/CommonCell';
import CommonCellRightImg from '../commonView/CommonCellRightImg';
import Title from '../commonView/title'
import RenderModalEdit from './renderModalEdit'
const { width, height } = Dimensions.get('window');

export default class CommonCellsWithModal extends Component {
    static defaultProps = {
        data: {},
        dataKey: "",//{dataKey:[dataObj:xxx,dataObj:xxx]}
        isMulty: false,//多行显示
        url: '', //更新服务器时的url
        ansyKey: '', //更新本地时的key
        disStyle: null,//禁用时候的样式 ,传入此值意味禁用
        saveCallBack: null,
        params: {},//传入的参数,暂用于图片上传时,上传者的id
    }; //

    constructor(props) {
        super(props);
        this.state = {
            data: this.props.data,
            dataObj: '',//每一个独立对象
            modalTitle: '',
        };

        // this._asyncGetAppStatus = this._asyncGetAppStatus.bind(this);
        //存储信息
        this._saveDataInfo = this._saveDataInfo.bind(this);
        //render
        this._renderInfoCell = this._renderInfoCell.bind(this);
        //模态回调
        this._setModalProps = this._setModalProps.bind(this);
        //更新图片后回调
        this._uploadCallBack = this._uploadCallBack.bind(this);
    }
    render() {
        let data = this.state.data;
        // alert(JSON.stringify(data))
        let dataObj = this.props.dataObj;
        return (
            <View style={styles.container}>
                {this._renderInfoCell(data)}
                <RenderModalEdit ref='modal'
                    url={this.props.url}
                    ansyKey={this.props.ansyKey}
                    modalVisible={this.state.modalVisible}
                    title={this.state.modalTitle}
                    saveDataCallBack={(dataObj) => { this._saveDataInfo(dataObj) }} >
                </RenderModalEdit>
            </View>
        );
    }

    componentDidMount() {
    }

    //渲染公共info组件
    _renderInfoCell() {
        let dataKey = this.props.dataKey;
        let data = this.state.data;
        let cellView = [];
        let cellView2 = [];
        let disCell = [];
        let disStyle = this.props.disStyle;
        for (let i = 0; i < data.length; i++) {
            let dataObj = data[i]
            let lable = dataObj.lable //左标题 数据lable
            let dataValue = dataObj.dataValue; //右标题 数据值
            let title = lable;//标题
            let dataObjKey = dataObj.dataKey; //每个对象里的Key
            if (disStyle != null) {
                var cell3 = <CommonCell disStyle={disStyle} key={i} title={lable} rightTitle={dataValue} ></CommonCell>;
                disCell.push(cell3);
            } else {
                if (dataObjKey.endsWith("Backimg") || dataObjKey.endsWith("Avatar")) {
                    var cell2 = <CommonCellRightImg uploadCallBack={(dataKey, dataValue) => { this._uploadCallBack(dataKey, dataValue) }} params={this.props.params} dataKey={dataObjKey} key={i} title={lable} rightTitle={dataValue} ></CommonCellRightImg>
                    cellView2.push(cell2)
                } else {
                    var cell = <CommonCell key={i} title={lable} rightTitle={dataValue} callBackClickCell={(dataValue) => { this._setModalProps(data, dataKey, dataObj, title) }}></CommonCell>;
                    cellView.push(cell)
                }
            }

        }
        cellView2.forEach((cell2) => {
            cellView.unshift(cell2);
        })
        disCell.forEach((disCell) => {
            cellView.push(disCell);
        })
        return cellView;
    }

    _setModalProps(data, dataKey, dataObj, title) {
        this.setState({
            modalTitle: title, //模态标题
            dataObj: dataObj,
        })
        let a = this.refs.modal;
        a._setDataObj(data, dataKey, dataObj);
        a._setContent(dataObj.dataValue);
        a._setIsMulty(this.props.isMulty);
        a._openModal();
    }

    //刷新本界面
    _saveDataInfo(data) {
        this.setState({
            data: data,
        })
        if (this.props.saveCallBack != null) {
            this.props.saveCallBack();
        }
        //    alert(JSON.stringify(data))
    }

    //commonvo key =value
    _uploadCallBack(key, value) {
        let data = this.state.data;
        // console.log("data", data)
        // return;
        data = data.map((dataObj) => {
            if (dataObj.dataKey == key) {
                dataObj.dataValue = value;
                console.log(dataObj)
            }
            return dataObj
        })
        this.setState({
            data: data,
        })
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F5FCFF',
        backgroundColor: '#eee',
    },
    InfoCell: {
        marginBottom: 10,
        backgroundColor: 'red',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 20,
    },

    fieldItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 40,
        paddingLeft: 15,
        paddingRight: 15,
        borderColor: '#ee735d',
        borderBottomWidth: 1,

    },
    inputField: {
        flex: 1,
        height: 40,
        fontSize: 14,
        color: 'black',
    },
    gender: {
        backgroundColor: '#ccc'
    },
    genderChecked: {
        backgroundColor: '#ee735d'
    },
});

