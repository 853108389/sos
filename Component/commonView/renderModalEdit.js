/**
 * TODO TextInput 只有一行  有的需要多行 1.在修改列表界面显示单一的数据 比如联系方式-> 电话 邮箱 *
 * TODO 用户点击多次保存
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TextInput,
    AsyncStorage,
    TouchableOpacity,
    Dimensions,
    ToastAndroid,
} from 'react-native';
import Title from '../commonView/title';
import config from '../common/config';
import request from '../common/request';
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
import DeviceStorage from '../common/deviceStorage';

export default class RenderModalEdit extends Component {

    static defaultProps = {
        title: '',
        saveDataCallBack: null,//更新上个界面视图
        url: '', //updateUrl 传url 意味着先更新服务器,成功后更新本地  如果没有这个参数,只更新本地
        ansyKey: '',//更新本地数据时的key
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            isMulty: false,//允许多行
            content: '',//TextInput的值
            dataKey: '',//对象数组所对应的key
            data: '',//外部传来的对象数组
            dataObj: null,//外部传来的修改前对象
            animationType: 'fade',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: false,//是否透明显示
        };
        //modal
        this._setModalVisible = this._setModalVisible.bind(this);
        this._startShow = this._startShow.bind(this);
        this._closeModal = this._closeModal.bind(this);

        this._changeDataInfo = this._changeDataInfo.bind(this);
        this._saveDataInfo = this._saveDataInfo.bind(this);
        this._asyncUpdateData = this._asyncUpdateData.bind(this);
        //set
        this._setDataObj = this._setDataObj.bind(this);
        this._setContent = this._setContent.bind(this);
        this._setIsMulty = this._setIsMulty.bind(this);
        //TextInput
        this._clearContent = this._clearContent.bind(this);
        //render
        this._renderTextInput = this._renderTextInput.bind(this);
        //fetch
        this._fetchUpdataData = this._fetchUpdataData.bind(this);

    }

    render() {
        // alert(JSON.stringify(this.state.dataObj))
        let dataObj = this.state.dataObj;
        let defaultValue = '';
        if (dataObj == null) {
            return null;
        }
        let dataValue = this.state.content;
        return (
            <Modal
                animationType={this.state.animationType}
                transparent={this.state.transparent}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this._closeModal()
                }}
                onShow={this._startShow}
            >
                <Title title={this.props.title} leftView={true} leftClick={this._closeModal} rightSaveView={true} rightClick={() => { this._saveDataInfo(dataValue) }} ></Title>
                <View style={styles.modalContainer}>
                    {this._renderTextInput(dataValue)}
                </View>
            </Modal>
        );
    }

    _renderTextInput(dataValue, defaultValue) {
        if (this.state.isMulty) {
            return (
                <View>
                    <View style={styles.multyFieldItem}>
                        <TextInput
                            multiline={true}
                            numberOfLines={6}
                            autoFocus={true}
                            value={dataValue}
                            placeholder='请输入...'
                            placeholderTextColor='#ddd'
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            style={styles.multyInputField}
                            onChangeText={(text) => {
                                this._changeDataInfo(text);
                            }}
                        />
                    </View>
                    <Text style={{ textAlign: 'right', marginRight: 20, marginTop: 10 }}>{dataValue.length}</Text>
                </View>
            )
        } else {
            return (
                <View>
                    <View style={styles.fieldItem}>
                        <TextInput
                            autoFocus={true}
                            value={dataValue}
                            placeholder='请输入...'
                            placeholderTextColor='#ddd'
                            underlineColorAndroid='transparent'
                            autoCorrect={false}
                            autoCapitalize={'none'}
                            style={styles.inputField}
                            onChangeText={(text) => {
                                this._changeDataInfo(text);
                            }}
                        />
                        <TouchableOpacity onPress={() => { this._clearContent() }}>
                            <View style={styles.closeImgStyle}>
                                <Icon name='ios-close'
                                    size={25}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Text style={{ textAlign: 'right', marginRight: 20, marginTop: 10 }}>{dataValue.length}</Text>
                </View>
            )
        }

    }

    _clearContent() {
        this.setState({
            content: '',
        })
    }

    //ref 方法
    _setDataObj(data, dataKey, dataObj) {
        this.setState({
            dataObj: dataObj,
            data: data,
            dataKey: dataKey,
        })
    }
    _setContent(content) {
        this.setState({
            content: content
        })
    }

    _setIsMulty(flag) {
        this.setState({ isMulty: flag })
    }
    //

    _setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    _startShow() {
        console.log('开始显示modal');
    }

    _closeModal() {
        this._setModalVisible(false);
        this._clearContent();
    }

    _openModal() {
        this._setModalVisible(true);
    }

    _changeDataInfo(value) {
        // console.log('改变后' + JSON.stringify(value));
        this.setState({
            content: value
        });
    }
    _saveDataInfo(dataValue) {
        //更新dataObj
        let dataKey = this.state.dataKey
        let dataObj = this.state.dataObj;
        dataObj.dataValue = dataValue;
        //更新data
        let data = this.state.data
        data.forEach(function (item) {
            if (item.id === dataObj.id) {
                //  alert(JSON.stringify(item) +"  aaaa  "+ JSON.stringify(dataObj))
                //这里是编辑操作
                item = dataObj
            }
        })
        // alert(JSON.stringify(data))
        this._fetchUpdataData(data);
    }

    _fetchUpdataData(data) {
        //更新策略
        let asyncFlag = true;  //是否更新本地
        let updateFlag = true; //是否更新服务器
        if (this.props.ansyKey == '' || this.props.ansyKey == null || typeof (this.props.ansyKey) == "undefined") {
            //没传本地储存key
            asyncFlag = false;
        }
        if (this.props.url == '' || this.props.url == null || typeof (this.props.url) == "undefined") {
            //没传服务器更新url
            updateFlag = false;
        }
        let dataKey = this.state.dataKey
        //更新自己的服务器
        let url = this.props.url;
        if (updateFlag) {
            request.post(url, data)
                .then((result) => {
                    if (result && result.success) {
                        // alert(JSON.stringify(data));
                        //TODO自己去实现 从服务器返回的数据里去更新本地的data state
                        if (asyncFlag) {
                            this._asyncUpdateData(data);
                        } else {
                            ToastAndroid.show("更新完毕~", ToastAndroid.SHORT)
                            //更新完本地数据后,执行回调,更新上一个视图
                            if (this.props.saveDataCallBack != null) {
                                this.props.saveDataCallBack(data);
                            }
                            this._closeModal();
                            this._clearContent();
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                })
        } else {
            if (asyncFlag) {
                this._asyncUpdateData(data);
            } else {
                //测试
                // alert(JSON.stringify(data))
                // ToastAndroid.show("测试保存", ToastAndroid.SHORT)
                //更新完本地数据后,执行回调,更新上一个视图
                this.props.saveDataCallBack(data);
                this._closeModal();
                this._clearContent();
                // ToastAndroid.show("无url也无ansyKey", ToastAndroid.SHORT)
            }
        }
    }

    _asyncUpdateData(data) {
        let dataKey = this.state.dataKey;
        let ansyKey = this.props.ansyKey;
        //更新信息到：自己的服务器  本地
        DeviceStorage.get(ansyKey).then((value) => {
            value[dataKey] = data
            // data已经有key了
            // alert(JSON.stringify(value) +"*********************"+JSON.stringify(data))
            return value
        }).then((value) => {
            // alert(JSON.stringify(value))
            DeviceStorage.save(ansyKey, value).then(() => {
                ToastAndroid.show("保存完毕~", ToastAndroid.SHORT)
                //更新完本地数据后,执行回调,更新上一个视图
                if (this.props.saveDataCallBack != null) {
                    this.props.saveDataCallBack(value[dataKey]);
                }
                this._closeModal();
                this._clearContent();
            })
        })
    }
}

const styles = StyleSheet.create({
    closeImgStyle: {

    },
    container: {
        flex: 1,
        // backgroundColor: '#F5FCFF',
        backgroundColor: '#eee',
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
    multyFieldItem: {
        // backgroundColor:'#aaa',
        flexWrap: 'wrap',
        height: 100,
        paddingLeft: 20,
        paddingRight: 15,
        borderColor: '#ee735d',
        borderBottomWidth: 1,
    },
    multyInputField: {
        flex: 1,
        height: 100,
        fontSize: 14,
        color: 'black',
    },
    // label: {
    //     color: '#ccc',
    //     marginRight: 10,
    //     textAlign: 'center',
    // },


    gender: {
        backgroundColor: '#ccc'
    },
    genderChecked: {
        backgroundColor: '#ee735d'
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

});






