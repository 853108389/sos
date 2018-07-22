
//TODO 验证成功后 登入的数据存储在本地   吧user作为参数传递到下一个界面
//TODO 用户连续点击登入会登入多次
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    Dimensions,
    TouchableOpacity,
    AsyncStorage,
    ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import config from './Component/common/config';
import request from './Component/common/request';
import Main from './Component/Main/Main'
import { Navigator } from "react-native-deprecated-custom-components";
import Title from './Component/commonView/title'
const { width, height } = Dimensions.get('window');

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            //1
            username: '',
            password: '',
            //2
            phoneNumber: '',
            verifyCode: '',
            //
            loginWay: true,
            codeAlreadySend: false,
            seconds: 6,
            isLogging: false,
        };

        this._login1 = this._login1.bind(this);
        this._login2 = this._login2.bind(this);
        this._changeLoginWay = this._changeLoginWay.bind(this);
        this._renderLoginWay = this._renderLoginWay.bind(this);
        this._clickLogin = this._clickLogin.bind(this);
        this._getVerifyCode = this._getVerifyCode.bind(this);
        this._showVerifyCode = this._showVerifyCode.bind(this);
        this._afterLogin = this._afterLogin.bind(this);
        this._pushHome = this._pushHome.bind(this);
        this._renderTelLogin = this._renderTelLogin.bind(this);
        this._renderStuNoLogin = this._renderStuNoLogin.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <Title title='登入'></Title>
                {this.state.loginWay ? this._renderStuNoLogin() : this._renderTelLogin()}
                {this._renderLoginWay()}
            </View>
        );
    }

    _renderLoginWay() {
        return (
            <View style={{ alignItems: "center", marginTop: 10 }} >
                <Text>使用其他方式登入</Text>
                <TouchableOpacity onPress={() => { this._changeLoginWay() }}>
                    <View style={styles.ImgStyle}>
                        <Icon name='ios-information'
                            size={25}
                        />
                    </View>
                </TouchableOpacity>
            </View>
        )
    }

    _changeLoginWay() {
        this.setState({
            loginWay: !this.state.loginWay,
        })
    }
    _renderStuNoLogin() {
        let url = config.uri.user + config.user.login;
        // let url = config.api.base + config.api.verify;
        return (
            <View style={styles.signupBox}>
                <Text style={styles.title}>用户登录</Text>
                <TextInput
                    placeholder='您的学号'
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    underlineColorAndroid='transparent'
                    style={styles.inputField}
                    value={this.state.username}
                    keyboardType={"email-address"}
                    onChangeText={(text) => {
                        this.setState({
                            username: text
                        });
                    }}

                />
                <TextInput
                    placeholder='您的密码'
                    secureTextEntry={true}
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    underlineColorAndroid='transparent'
                    style={styles.inputField}
                    onChangeText={(text) => {
                        this.setState({
                            password: text
                        });
                    }}
                />
                <TouchableOpacity onPress={() => { this._clickLogin(url, 1) }}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>登录</Text>
                    </View>
                </TouchableOpacity>
            </View>

        )
    }

    _renderTelLogin() {
        let url = config.api.base + config.api.verify;
        return (
            <View style={styles.signupBox}>

                <Text style={styles.title}>快速登录</Text>

                <TextInput
                    value={this.state.phoneNumber}
                    placeholder='输入手机号'
                    autoCapitalize={'none'}
                    autoCorrect={false}
                    keyboardType={'phone-pad'}
                    underlineColorAndroid='transparent'
                    style={styles.inputField}
                    onChangeText={(text) => {
                        this.setState({
                            phoneNumber: text
                        });
                    }}
                />
                {this.state.codeAlreadySend ?
                    <View style={styles.verifyCodeBox}>
                        <TextInput
                            placeholder='输入验证码'
                            autoCapitalize={'none'}
                            autoCorrect={false}
                            keyboardType={'phone-pad'}
                            style={styles.inputField2}
                            onChangeText={(text) => {
                                this.setState({
                                    verifyCode: text
                                });
                            }}
                        />
                        {this.state.seconds === 0 ?
                            <TouchableOpacity onPress={this._getVerifyCode}>
                                <View style={styles.countDownBox}>
                                    <Text style={styles.countDownText} >重新获取</Text>
                                </View>
                            </TouchableOpacity>
                            :

                            <View style={styles.countDownBox}>
                                <Text style={styles.countDownText}>剩余{this.state.seconds}秒</Text>

                            </View>
                        }
                    </View>
                    : null
                }
                {this.state.codeAlreadySend ?
                    <TouchableOpacity onPress={() => { this._clickLogin(url, 2) }}>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>登录</Text>
                        </View>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity onPress={this._getVerifyCode}>
                        <View style={styles.btn}>
                            <Text style={styles.btnText} >获取验证码</Text>
                        </View>
                    </TouchableOpacity>

                }
            </View>
        )
    }

    componentWillUnmount() {
        console.log('组件即将卸载');
        this._interval && clearInterval(this._interval);
    }

    _clickLogin(url, type) {
        if (this.state.isLogging == false) {
            this.setState({
                isLogging: true,
            })
            if (type === 1) {
                this._login1(url);
            } else if (type === 2) {
                this._login2(url);
            }
        }
    }

    _login1(url) {
        //去服务器验证是否匹配
        //正则匹配的
        let username = this.state.username.trim();
        let password = this.state.password.trim();
        if (!username || !password) {
            ToastAndroid.show('学号或密码不能为空', ToastAndroid.SHORT);
            this.setState({
                isLogging: false,
            })
            return;
        }

        let body = {
            stuNo: username,
            password: password
        };
        request.post(url, body)
            .then(
            (data) => {
                if (data && data.success) {
                    console.log('验证成功了，可以登陆，页面可以跳转了');
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);

                    this._afterLogin(data.data);
                } else {
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                }
            })
            .catch((err) => {
                // alert('错误：' + err);
                ToastAndroid.show('登入失败', ToastAndroid.SHORT);
            })
            .finally(() => {
                this.setState({
                    isLogging: false,
                })
            });
    }

    _login2(url) {
        //去服务器验证手机号码与验证码是否匹配
        //正则匹配的
        let phoneNumber = this.state.phoneNumber;
        let verifyCode = this.state.verifyCode;
        if (!phoneNumber || !verifyCode) {
            alert('手机号码或者验证码不能为空');
            return;
        }

        let body = {
            phoneNumber: phoneNumber,
            code: verifyCode
        };

        request.post(url, body)
            .then(
            (data) => {
                if (data && data.success) {
                    console.log('验证成功了，可以登陆，页面可以跳转了');
                    // console.log(data);
                    this._afterLogin(data.data)
                } else {
                    alert('获取验证码失败了,请检查一下你的手机号');
                }
            })
            .catch((err) => {
                // alert('错误：' + err);
                ToastAndroid.show('登入失败', ToastAndroid.SHORT);
            })
            .finally(() => {
                this.setState({
                    isLogging: false,
                })
            });
    }

    _pushHome() {
        //解构 与 模式匹配
        let { navigator } = this.props;
        if (navigator) {
            navigator.replacePrevious({
                name: 'main',
                component: Main,
                params: {
                }
            })
        } else {
            alert('跳转失败')
        }
    }

    _showVerifyCode() {

        console.log('开始显示验证码的输入框与开始倒计时');

        this.setState({
            codeAlreadySend: true,
            seconds: 60,
        });

        this._interval = setInterval(() => {

            if (this.state.seconds === 0) {
                return clearInterval(this._interval);

            }

            this.setState({
                seconds: this.state.seconds - 1
            });
        }, 1000);

    }

    _getVerifyCode() {

        //去服务器获取验证码了
        //正则匹配的
        let phoneNumber = this.state.phoneNumber;
        if (!phoneNumber) {
            alert('手机号码不能为空');
            return;
        }

        let body = {
            phoneNumber: phoneNumber
        };
        this._showVerifyCode();
        // let url = config.api.base + config.api.signup;
        // request.post(url, body)
        //     .then(
        //     (data) => {

        //         if (data && data.success) {
        //             // console.log(data);
        //             this._showVerifyCode();

        //         } else {
        //             alert('获取验证码失败了,请检查一下你的手机号');
        //         }
        //     }
        //     )
        //     .catch((err) => {
        //         alert('错误：' + err);
        //     });
    }

    //存储用户信息
    _afterLogin(user) {
        // alert(11)
        //user是一个用户信息的对象
        let user2 = JSON.stringify(user);
        // alert(user2)
        AsyncStorage.setItem('user', user2)
            .then(
            () => {
                this.setState({
                    logined: true,
                    user: user
                });
            })
            .then(
            () => {
                this._pushHome();
            })
            .catch((err) => {
                alert(err);
            });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },

    ImgStyle: {
        marginTop: 15,
        borderRadius: 20,
        backgroundColor: '#eee',
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },

    signupBox: {
        marginTop: 30,
        padding: 10,
    },

    title: {
        marginBottom: 20,
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#555'
    },

    inputField: {
        height: 40,
        padding: 5,
        color: '#666',
        fontSize: 16,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
        borderColor: '#ee735d'

    },
    inputField2: {
        flex: 1,
        height: 40,
        padding: 5,
        color: '#666',
        fontSize: 16,
        backgroundColor: 'white',
        borderWidth: 1,
        borderRadius: 4,
        marginBottom: 10,
        borderColor: '#ee735d'

    },

    verifyCodeBox: {
        height: 40,
        marginBottom: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    countDownBox: {
        width: 100,
        height: 40,
        borderWidth: 1,
        borderRadius: 4,
        backgroundColor: '#eee',
        borderColor: '#ee735d',
        marginLeft: 5,
        marginBottom: 5,
        justifyContent: 'center',
        alignItems: 'center',

    },

    countDownText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600'
    },

    btn: {
        height: 40,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ee735d',
    },
    btnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ee735d'
    },


});

