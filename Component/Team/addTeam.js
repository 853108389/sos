import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    TextInput,
    Picker,
    Alert,
    ToastAndroid,
} from 'react-native'
import Title from './../commonView/title';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../common/config'
import request from '../common/request'
import CommonTextInputWithIcon from './../commonView/CommonTextInputWithIcon';
import CommonButton from './../commonView/CommonButton';
const { width, height } = Dimensions.get('window');

export default class addTeam extends Component {


    static defaultProps = {
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            type: "1",
            flag: false,
            flag1: false,
            flag2: false,
            flag3: false,
            content1: "",
            content2: "",
            content3: "",
        };
    }

    render() {
        return (
            <View>
                <Title title='创建社团' leftView={true} navigator={this.props.navigator} rightMoreView={true} />
                <View style={{ marginVertical: 5, flexDirection: "row", }}>
                    <View style={{ flex: 0.1 }}></View>
                    <View style={{ flex: 0.8 }}>
                        {this._renderPicker()}
                    </View>
                    <View style={{ flex: 0.1 }}></View>
                </View>
                <View style={{ marginVertical: 5 }}>
                    <CommonTextInputWithIcon placeholder="社团名称" onChangeCallBack={(text) => { this._setFlag(1, text) }} />
                </View>
                <View style={{ marginVertical: 5 }}>
                    <CommonTextInputWithIcon placeholder="社团简介" onChangeCallBack={(text) => { this._setFlag(2, text) }} />
                </View>
                {/* 下划线 */}
                <View />
                <View style={{ marginVertical: 5 }}>
                    <CommonTextInputWithIcon placeholder="申请理由" onChangeCallBack={(text) => { this._setFlag(3, text) }} />
                </View>
                <CommonButton title="确认提交" isAble={this.state.flag} clickCallBack={() => { this._clickButton() }} />
            </View>
        )
    }

    _clickButton = () => {
        Alert.alert('温馨提醒', '你确定要申请社团吗?', [
            { text: '取消' },
            {
                text: '确定', onPress: () => {
                    this._fetchAddTeam()
                }
            }
        ])
    }

    _fetchAddTeam = () => {
        //更新自己的服务器
        let url = config.uri.team + config.team.add;
        let params = {
            userId: this.props.userId,//用户Id
            teamName: this.state.content1,
            teamTitle: this.state.content2,
            teamType: this.state.type,
            reason: this.state.content3,
        }
        console.log("params", params);
        // return;
        request.post(url, params).then(
            (result) => {
                if (result && result.success) {
                    ToastAndroid.show('申请成功,等待管理员审核', ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(result.message, ToastAndroid.SHORT);
                }
            }
        ).catch((err) => {
            alert(err);
        })
    }

    _setFlag = (type, text) => {
        let flag = false;
        if (text == "") {
            flag = false
        } else {
            flag = true
        }
        switch (type) {
            case 1:
                this.setState({
                    flag1: flag,
                    content1: text,
                }, () => {
                    this._checkFlag()
                })
                break;
            case 2:
                this.setState({
                    flag2: flag,
                    content2: text,
                }, () => {
                    this._checkFlag()
                })
                break;
            case 3:
                this.setState({
                    flag3: flag,
                    content3: text,
                }, () => {
                    this._checkFlag()
                })
                break;
        }
    }

    _checkFlag = () => {
        if (this.state.flag1 && this.state.flag2 && this.state.flag3) {
            this.setState({
                flag: true
            })
        } else {
            this.setState({
                flag: false
            })
        }
    }

    _renderPicker = () => {
        let dataArr = [
            {
                label: "校级",
                value: "1"
            },
            {
                label: "院级",
                value: "2"
            },
            {
                label: "兴趣",
                value: "3"
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
                prompt={"社团级别"}
                style={{ color: "green" }}
                onValueChange={(value) => { this.setState({ type: value }) }}>
                {itemCellArr}
            </Picker >
        )
    }
}

const styles = StyleSheet.create({
});
