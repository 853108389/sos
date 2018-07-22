import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Platform,
    Text,
    View,
    AsyncStorage,
    Alert,
    ScrollView,
    ToastAndroid,
} from 'react-native';

import Title from '../commonView/title'
import CommonCellsWithModal from '../commonView/CommonCellsWithModal'
import AccountImgUpload from './accountImgUpload'
import Login from '../../login'
import CellWithModal from './cellWithModal'
import config from '../common/config'
import request from '../common/request'
import DeviceStorage from '../common/deviceStorage';
import CommonCell from '../commonView/CommonCell';
export default class AccountDetail extends Component {
    static defaultProps = {
        //需要编辑的信息数组
        isMulty: false,//是否多行显示
    }; //
    constructor(props) {
        super(props);
        this.state = {
            logined: false,
            user: this.props.user,
            logout: null,
            data: null,
        };

        // this._asyncGetAppStatus = this._asyncGetAppStatus.bind(this);
        //存储信息
        //登出
        this._confirmLogout = this._confirmLogout.bind(this);
        this._logout = this._logout.bind(this);
        //push
        this._pushLogin = this._pushLogin.bind(this);
        //render
        this._renderDataCell = this._renderDataCell.bind(this);
        // fetch
        this._fetchUserData = this._fetchUserData.bind(this)
        this._asyncUpdateData = this._asyncUpdateData.bind(this)
        //回调
        this._saveCallBack = this._saveCallBack.bind(this)
    }

    _saveCallBack() {
        this._fetchUpdateUser();
    }

    _renderDataCell() {
        let data = this.state.data;
        let dataCell = null;
        let tempArr = [];
        let params = {
            type: "user",
            id: this.state.user.userId,
        }//用于图片上传时的参数
        if (data) {
            let data2 = [];
            let data1 = [];
            data.forEach((dataObj,i) => {
                let dataKey = dataObj.dataKey;
                if (dataKey === "userBirthday" || dataKey === "userGender") {
                    data2.push(dataObj);
                } else if (dataKey == "userType" || dataKey == "userStuno") {
                    tempArr.push(<CommonCell key={"dis"+i} disStyle={{ backgroundColor: "rgba(0,0,0,0.5)", }} title={dataObj.lable} rightTitle={dataObj.dataValue} ></CommonCell>)
                }/*  else if (dataKey == "teamBackimg") {
                    alert(dataObj.dataValue)
                    //不展示
                }  */else {
                    data1.push(dataObj);
                }
            })
            dataCell =
                <View>
                    {tempArr}
                    <CommonCellsWithModal params={params} isMulty={this.props.isMulty} data={data1} saveCallBack={() => { this._saveCallBack() }}></CommonCellsWithModal>
                    <CellWithModal data={data2} saveCallBack={() => { this._saveCallBack() }}></CellWithModal>
                </View>
        }
        return dataCell;
    }
    render() {
        if (this.state.user == null) {
            return <View></View>
        }
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Title title='我的账户' leftView={true} navigator={this.props.navigator}></Title>
                    {this._renderDataCell()}

                    <View style={styles.logoutBox}>
                        <TouchableOpacity onPress={this._confirmLogout}>
                            <View style={styles.btn}>
                                <Text style={styles.btnText} >退出登录</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        );
    }

    componentDidMount() {
        this._fetchUserData();
    }

    _fetchUpdateUser() {
        let url = config.uri.user + config.user.update;
        let userIdObj = {
            dataKey: "userId",
            dataValue: this.state.user.userId,
            id: 0,
            lable: "社团id",
        }
        let params = this.state.data;
        params.push(userIdObj);
        request.post(url, params).then((result) => {
            if (result && result.success) {
                this._asyncUpdateData(result.data);
            } else {
                ToastAndroid.show('更新失败', ToastAndroid.SHORT);
            }
        })
    }

    _fetchUserData() {
        //更新自己的服务器
        let url = config.uri.user + config.user.userVo;
        let userId = this.state.user.userId;
        request.post(url, {
            id: userId
        }).then((result) => {
            if (result && result.success) {
                // alert(JSON.stringify(result.data))
                this.setState({
                    data: result.data
                })
            }
        }).catch((err) => {
            alert(err);
        })
    }

    _confirmLogout() {
        Alert.alert('温馨提醒', '你确定要退出登入吗?', [
            { text: '取消' },
            {
                text: '确定', onPress: () => {
                    this._logout()
                }
            }
        ])
    }

    _asyncUpdateData(data) {
        DeviceStorage.save("user", data).then(() => {
            ToastAndroid.show('更新成功', ToastAndroid.SHORT);
        })
    }


    _logout() {
        //TODO: 登出时 清空accessToken
        AsyncStorage.removeItem('user');
        this.setState({
            logined: false,
            user: null
        }, () => {
            this._pushLogin();
        });
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

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F5FCFF',
    },

    InfoCell: {
        marginBottom: 10,
        backgroundColor: 'red',
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
        marginBottom: 20,
        marginTop: 20,
    }
});

