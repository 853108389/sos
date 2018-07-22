/**
TODO
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Modal,
    TextInput,
    Dimensions,
    TouchableOpacity,
    ToastAndroid,
} from 'react-native';
import Login from '../../login'
import Title from "../commonView/title"
import CommonCell from "../commonView/CommonCell"
import config from '../common/config'
import request from '../common/request'
import DeviceStorage from '../common/deviceStorage';
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
export default class SerectSetting extends Component {

    static defaultProps = {
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            data: [
                {
                    "id": 1,
                    "lable": "是否隐藏个人信息",
                    "dataKey": "secretSetting",
                    "dataValue": ""
                },
                {
                    "id": 1,
                    "lable": "修改密码",
                    "dataKey": "editPassword",
                    "dataValue": ""
                },
            ],
            user: null,
            modalVisible: false,
            content1: "",
            isOK1: null,
            content2: "",
            isOK2: null,
            content3: "",
            isOK3: null,
            isAble: false,
        };
        this._renderInfoCell = this._renderInfoCell.bind(this);
        this._renderModal = this._renderModal.bind(this);
        this._fetchSetUserHidden = this._fetchSetUserHidden.bind(this);
        this._asyncGetUser = this._asyncGetUser.bind(this);
        this._asyncSetUser = this._asyncSetUser.bind(this);
        this._fetchConfirmPw = this._fetchConfirmPw.bind(this);
        this._fetchEditPw = this._fetchEditPw.bind(this);
        this._isAble = this._isAble.bind(this);
        this._pushLogin = this._pushLogin.bind(this);
    }

    _fetchEditPw() {
        if (!this.state.isAble) {
            ToastAndroid.show("请先填写正确", ToastAndroid.SHORT);
            return;
        }
        let userId = this.state.user.userId;
        let url = config.uri.user + config.user.editPw;
        let params = {
            userId: userId,
            oldPw: this.state.content1,
            newPw: this.state.content2,
        }
        console.log("params", params)
        request.post(url, params).then((result) => {
            if (result && result.success) {
                ToastAndroid.show("1s后重新登入", ToastAndroid.SHORT);
                let timer = setTimeout(() => {
                    //修改密码成功,重新登入
                    this._pushLogin();
                    clearTimeout(timer)
                }, 1000);
            } else {
                //修改失败
                ToastAndroid.show("修改失败,请再试一次", ToastAndroid.SHORT);
            }
        })
    }

    _fetchConfirmPw() {
        let userId = this.state.user.userId;
        let url = config.uri.user + config.user.confirmPw;
        let params = {
            userId: userId,
            userPassword: this.state.content1,
        }
        console.log(params)
        request.post(url, params).then((result) => {
            if (result && result.success) {
                this.setState({
                    isOK1: true,
                }, () => {
                    this._isAble();
                })
            } else {
                this.setState({
                    isOK1: false,
                }, () => {
                    this._isAble();
                })
            }
            console.log("a", result)
        })
    }

    _isAble() {
        console.log(this.state.isOK1 + " " + this.state.isOK2 + " " + this.state.isOK3)
        if (this.state.isOK1 && this.state.isOK2 && this.state.isOK3) {
            this.setState({
                isAble: true,
            })
        } else {
            this.setState({
                isAble: false,
            })
        }
    }
    _renderBlock1 = () => {
        let flagCell = null;
        // console.log("isOK1", this.state.isOK1)
        if (this.state.isOK1 !== null) {
            if (this.state.isOK1) {
                flagCell = <Icon name='ios-checkmark-circle-outline' size={36} style={{ color: "green" }} />;
            } else {
                flagCell = <Icon name='ios-close-circle-outline' size={36} style={{ color: "red" }} />;
            }
        }
        return (
            <View style={styles.block}>
                <View style={styles.iconBox}>
                </View>
                <View style={styles.textInputBox}>
                    <TextInput
                        placeholder='请输入旧密码'
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                        style={styles.content}
                        onChangeText={(text) => {
                            this.setState({
                                content1: text
                            }, () => {
                                if (this.state.content1 == "") {
                                    this.setState({
                                        isOK1: null
                                    }, () => {
                                        this._isAble();
                                    });
                                    return;
                                }
                            });
                        }}
                        onBlur={() => {
                            this._fetchConfirmPw();
                        }}
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.iconBox}>
                    {flagCell}
                </View>
            </View>
        )
    }

    _renderBlock2 = () => {
        let flagCell = null;
        if (this.state.isOK2 !== null) {
            if (this.state.isOK2) {
                flagCell = <Icon name='ios-checkmark-circle-outline' size={36} style={{ color: "green" }} />;
            } else {
                flagCell = <Icon name='ios-close-circle-outline' size={36} style={{ color: "red" }} />;
            }
        }
        return (
            <View style={[styles.block, { marginTop: 10 }]}>
                <View style={styles.iconBox}>
                </View>
                <View style={styles.textInputBox}>
                    <TextInput
                        placeholder='请输入新密码'
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                        style={styles.content}
                        onChangeText={(text) => {
                            this.setState({
                                content2: text
                            }, () => {
                                if (this.state.content2 == "") {
                                    this.setState({
                                        isOK2: null
                                    }, () => {
                                        this._isAble();
                                    });
                                    return;
                                }
                                //两次新密码相同
                                if (this.state.content3 === this.state.content2) {
                                    this.setState({
                                        isOK3: true
                                    }, () => {
                                        this._isAble();
                                    });
                                } else {
                                    this.setState({
                                        isOK3: null
                                    }, () => {
                                        this._isAble();
                                    });
                                }
                            });
                        }}
                        onBlur={() => {
                            if (this.state.content2 == "") {
                                this.setState({
                                    isOK2: null
                                }, () => {
                                    this._isAble();
                                });
                            } else {
                                //两次新密码相同
                                if (this.state.content3 === this.state.content2) {
                                    this.setState({
                                        isOK3: true,
                                        isOK2: true,
                                    }, () => {
                                        this._isAble();
                                    });
                                } else {
                                    this.setState({
                                        isOK2: true,
                                        isOK3: null,
                                    }, () => {
                                        this._isAble();
                                    })
                                }

                            }
                        }}
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.iconBox}>
                    {flagCell}
                </View>
            </View>
        )
    }

    _renderBlock3 = () => {
        let flagCell = null;
        if (this.state.isOK3 !== null) {
            if (this.state.isOK3) {
                flagCell = <Icon name='ios-checkmark-circle-outline' size={36} style={{ color: "green" }} />;
            } else {
                flagCell = <Icon name='ios-close-circle-outline' size={36} style={{ color: "red" }} />;
            }
        }
        return (
            <View style={[styles.block, { marginTop: 10 }]}>
                <View style={styles.iconBox}>
                </View>
                <View style={styles.textInputBox}>
                    <TextInput
                        placeholder='确认密码'
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                        style={styles.content}
                        onChangeText={(text) => {
                            this.setState({
                                content3: text
                            }, () => {
                                if (this.state.content3 == "") {
                                    this.setState({
                                        isOK3: null
                                    }, () => {
                                        this._isAble();
                                    });
                                    return;
                                }
                                if (this.state.content3 === this.state.content2) {
                                    //两次新密码相同
                                    if (this.state.content3 != "" && this.state.content2 != "") {
                                        this.setState({
                                            isOK3: true
                                        }, () => {
                                            this._isAble();
                                        });
                                    } else {
                                        this.setState({
                                            isOK3: false
                                        }, () => {
                                            this._isAble();
                                        });
                                    }
                                } else {
                                    this.setState({
                                        isOK3: null
                                    }, () => {
                                        this._isAble();
                                    });
                                }
                            });
                        }}
                        onBlur={() => {
                            if (this.state.content3 == "") {
                                this.setState({
                                    isOK3: null
                                }, () => {
                                    this._isAble();
                                });
                            } else {
                                if (this.state.content3 === this.state.content2) {
                                    //两次新密码相同
                                    if (this.state.content3 != "" && this.state.content2 != "") {
                                        this.setState({
                                            isOK3: true
                                        }, () => {
                                            this._isAble();
                                        });
                                    } else {
                                        this.setState({
                                            isOK3: false
                                        }, () => {
                                            this._isAble();
                                        });
                                    }
                                } else {
                                    this.setState({
                                        isOK3: false
                                    }, () => {
                                        this._isAble();
                                    });
                                }
                            }
                        }}
                        secureTextEntry={true}
                    />
                </View>
                <View style={styles.iconBox}>
                    {flagCell}
                </View>
            </View>
        )
    }

    _pushLogin() {
        //解构 与 模式匹配
        let { navigator } = this.props;
        if (navigator) {
            navigator.resetTo({
                name: 'login',
                component: Login,
                params: {

                }
            })
        } else {
            alert('跳转失败')
        }
    }

    _renderModal() {
        return (
            <Modal
                animationType={'fade'}
                transparent={false}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this.setState({
                        modalVisible: false
                    })
                }}
                onShow={() => { }}
            >
                <Title title='修改密码' leftView={true} navigator={this.props.navigator}></Title>
                <View style={styles.modalContainer}>
                    <View style={styles.initModalContainer}>
                        <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 80 }}>
                            <Icon name='ios-cafe-outline' size={80} style={{ color: "green" }} />
                        </View>
                        {this._renderBlock1()}
                        {this._renderBlock2()}
                        {this._renderBlock3()}
                        <View style={styles.confirmBox}>
                            <TouchableOpacity disabled={!this.state.isAble} onPress={() => { this._fetchEditPw() }}>
                                <View style={this.state.isAble ? styles.btn : styles.btn2}>
                                    <Text style={this.state.isAble ? styles.btnText : styles.btnText2}>修改密码</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <Title title='隐私' leftView={true} navigator={this.props.navigator}></Title>
                {this._renderInfoCell()}
                {this._renderModal()}
            </View>
        );
    }

    _asyncGetUser() {
        DeviceStorage.get("user").then((value) => {
            this.refs.switch.setSwithState(value.userIshidden == 0 ? false : true);
            this.setState({
                user: value
            });
            console.log("asynget", value.userIshidden)
        })
    }

    _asyncSetUser() {
        DeviceStorage.save("user", this.state.user).then((value) => {
            this.refs.switch.setSwithState(this.state.user.userIshidden == 0 ? false : true);
            this.setState({
                user: this.state.user
            });
            console.log("asynSet1", this.state.user)
        })
    }
    componentDidMount() {
        this._asyncGetUser();
    }

    _fetchSetUserHidden(flag) {
        let num = (flag == true ? 1 : 0);
        let uri = config.uri.user + config.user.hideInfo;
        let user = this.state.user;
        let id = user.userId;
        user.userIshidden = num;
        this.setState({
            user: user
        })
        request.post(uri, { userId: id, userIshidden: num }).then((result) => {
            if (result && result.success) {
                this._asyncSetUser(user);
            }
        })
    }

    //渲染公共info组件
    _renderInfoCell() {
        let data = this.state.data;
        let cellView = [];
        for (let i = 0; i < data.length; i++) {
            let dataObj = data[i]
            let lable = dataObj.lable //左标题 数据lable
            let dataValue = dataObj.dataValue; //右标题 数据值
            let dataKey = dataObj.dataKey; //右标题 数据值
            let title = lable;//标题
            if (dataKey == "secretSetting") {
                var cell = <CommonCell ref="switch" key={i} title={lable} rightTitle={dataValue} isSwitch={true}
                    switchCallBack={(flag) => {
                        this._fetchSetUserHidden(flag);
                    }}>
                </CommonCell>;
            } else {
                var cell = <CommonCell key={i} title={lable} rightTitle={dataValue} rightIcon={true}
                    callBackClickCell={() => {
                        this.setState({
                            modalVisible: true,
                        })
                    }}>
                </CommonCell>;
            }
            cellView.push(cell)
        }
        return cellView;
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
    btn2: {
        height: 50,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 25,
        marginRight: 10,
        marginLeft: 10,
    },
    btnText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ee735d'
    },
    btnText2: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ccc'
    },
    confirmBox: {
        marginBottom: 10,
        marginTop: 10,
    },
    content: {
        fontSize: 18,
    },
    iconBox: { flex: 0.1, height: 50, justifyContent: "center", alignItems: "center" },
    textInputBox: { flex: 0.8, borderColor: "#666", borderWidth: 1, height: 50, justifyContent: "center", borderRadius: 3 },
    textBox: { flex: 0.08, justifyContent: "center", alignItems: "center" },
    block: { flexDirection: "row", alignItems: "center" },
    initModalContainer: { flex: 1, marginHorizontal: 10, justifyContent: "center", },
    modalContainer: {
        flex: 1,
        backgroundColor: "white",
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});








