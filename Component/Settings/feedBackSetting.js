/**
TODO
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Picker,
    Dimensions,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';
import CommonCell from "../commonView/CommonCell";
import AutoExpandingTextInput from '../commonView/AutoExpandingTextInput'
import CommonCellImg from '../commonView/CommonCellImg';
import Title from '../commonView/title';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../common/config';
import request from '../common/request';
import DeviceStorage from './../common/deviceStorage';
const { width, height } = Dimensions.get('window');
export default class FeedBackSetting extends Component {

    static defaultProps = {
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            content: '',//TextInput的值
            type: 'advices',//建议的类型
            conWay: "",//联系方式
            userId: "",//用戶id
            isFetching: false,//状态机 是否正在提交
        };
        this._renderFeedback = this._renderFeedback.bind(this)
        this._renderFbBlock = this._renderFbBlock.bind(this)
        this._renderPicker = this._renderPicker.bind(this)
        this._changeDataInfo = this._changeDataInfo.bind(this);
        this._clickButton = this._clickButton.bind(this);
        this._asyncGetUser = this._asyncGetUser.bind(this);
    }

    _asyncGetUser() {
        DeviceStorage.get("user").then((value) => {
            this.setState({
                userId: value.userId,
            });
        })
    }

    componentDidMount() {
        this._asyncGetUser();
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <Title title='反馈' leftView={true} navigator={this.props.navigator}></Title>
                {this._renderPickerBlock()}
                {this._renderFbBlock()}
                {this._renderConBlock()}
                <View style={styles.buttonBox}>
                    <TouchableOpacity onPress={() => { this._clickButton() }}>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>提交</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    _clickButton() {
        // alert(1)
        if (this.state.isFetching) {
            return;
        }
        this.setState({
            isFetching: true,
        })
        if (this.state.content == "") {
            ToastAndroid.show('内容不能为空', ToastAndroid.SHORT);
            return;
        }
        let conWay = this.state.conWay;
        let type = this.state.type;
        let content = this.state.content;
        let url = config.uri.user + config.user.addFb;
        let params = {
            userId: this.state.userId,
            feedbackConway: conWay,
            feedbackType: type,
            feedbackContent: content,
        };
        request.post(url, params).then((result) => {
            if (result && result.success) {
                ToastAndroid.show('提交成功,感谢您的反馈', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show('提交失败...', ToastAndroid.SHORT);
            }
        }).then(() => {
            this.setState({
                isFetching: false,
            })
        }).catch(() => {
            this.setState({
                isFetching: false,
            })
        })

    }

    _renderFbBlock() {
        return (
            <View style={{ marginTop: 10 }}>
                {this._renderFeedback()}
            </View>
        )
    }

    _renderConBlock = () => {
        return (
            <View style={{ marginTop: 10 }}>
                <CommonCellImg leftTitle='联系方式' rightTitle='可选' callBackLeftIcon={() => {
                    return (
                        <View >
                            <Icon name='ios-information'
                                size={20}
                                style={styles.leftImgStyle}
                            />
                        </View>
                    )
                }} />
                <View style={styles.textInputBox}>
                    <AutoExpandingTextInput
                        value={this.state.conWay}
                        placeholder='请输入您的联系方式吧...'
                        placeholderTextColor='#ddd'
                        underlineColorAndroid='transparent'
                        autoCorrect={false}
                        blurOnSubmit={false}
                        autoCapitalize={'none'}
                        onChangeText={(text) => {
                            this.setState({
                                conWay: text,
                            })
                        }}
                    />
                </View>
            </View>
        )
    }

    _renderPicker = () => {
        let dataArr = [
            {
                label: "布局样式",
                value: "style"
            },
            {
                label: "遇到bug",
                value: "bug"
            },
            {
                label: "其他建议",
                value: "advices"
            },
        ]
        let itemCellArr = [];
        let firCell = null;
        dataArr.forEach((dataObj, i) => {
            if (dataObj.value == this.state.type) {
                firCell = <Picker.Item key={i} label={dataObj.label} value={dataObj.value} />
            } else {
                itemCellArr.push(<Picker.Item key={i} label={dataObj.label} value={dataObj.value} />)
            }
        })
        if (firCell != null) {
            itemCellArr.unshift(firCell);
        }
        return (
            <Picker
                prompt={"问题类型"}
                style={{ color: "green" }}
                onValueChange={(value) => { this.setState({ type: value }) }}>
                {itemCellArr}
            </Picker >
        )
    }

    _renderPickerBlock = () => {
        return (
            <View>
                <CommonCellImg leftTitle='问题类型' rightTitle='' callBackLeftIcon={() => {
                    return (
                        <View >
                            <Icon name='ios-information'
                                size={20}
                                style={styles.leftImgStyle}
                            />
                        </View>
                    )
                }} />
                <View style={{ width: width }}>
                    {this._renderPicker()}
                </View>
            </View>
        )
    }

    _renderFeedback() {
        return (
            <View>
                <CommonCellImg leftTitle='问题描述' rightTitle='' callBackLeftIcon={() => {
                    return (
                        <View >
                            <Icon name='ios-information'
                                size={20}
                                style={styles.leftImgStyle}
                            />
                        </View>
                    )
                }} />
                <View style={styles.textInputBox}>
                    <AutoExpandingTextInput
                        value={this.state.content}
                        placeholder='请输入您的意见或反馈...'
                        placeholderTextColor='#ddd'
                        underlineColorAndroid='transparent'
                        autoCorrect={false}
                        blurOnSubmit={false}
                        autoCapitalize={'none'}
                        onChangeText={(text) => {
                            this._changeDataInfo(text);
                        }}
                    />
                </View>
            </View>
        )
    }

    _changeDataInfo(value) {
        this.setState({
            content: value
        });
    }
}
const styles = StyleSheet.create({
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
    buttonBox: {
        marginBottom: 5,
        marginTop: 5,
    },
    block: {
        marginBottom: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    textInputBox: {
        marginTop: 5,
        backgroundColor: "#eee",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    leftImgStyle: {
        marginRight: 6,
        borderRadius: 12,
        backgroundColor: '#eee',
        width: 20,
        textAlign: 'center',
    },
});








