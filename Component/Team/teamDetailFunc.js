
/**
 * 社团功能界面
 */
import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter,
    Modal,
    TextInput,
    ToastAndroid
} from 'react-native'
import Title from './../commonView/title';
import config from "../common/config";
import request from '../common/request';
import CommonTopButtonBox from './../commonView/CommonTopButtonBox';
import Icon from 'react-native-vector-icons/Ionicons';
import AddActivity from '../Activity/addActivity';
import TeamImgUploadList from './teamImgUploadList';
import TeamMemberAdd from './teamMemberAdd';
import CommonCellImg from '../commonView/CommonCellImg';
import TeamMemberManage from './teamMemberManage';
import TeamInfoEdit2 from './teamInfoEdit2'

export default class TeamDetailFunc extends Component {

    static defaultProps = {
        teamId: "",
    }; //

    constructor(props) {
        super(props)
        this.state = {
            depNum: 0,
            total: 0,
            data: null,
            modalVisible: false,
            content: "",
        }
        this._clickButton = this._clickButton.bind(this);
        this._logoutTeam = this._logoutTeam.bind(this);
        this._fetchMembersById = this._fetchMembersById.bind(this);
        this._onEndEditing = this._onEndEditing.bind(this);
    }

    _fetchMembersById() {
        let data = {
            id: this.props.teamId,
        }
        //更新自己的服务器
        let url = config.uri.team + config.team.teamUsers;
        return request.post(url, data)
            .then((result) => {
                if (result && result.success) {
                    this.setState({
                        data: result.data,//其他信息
                        total: result.total,//人数
                        depNum: result.depNum, //部门数量
                    })
                    console.log("result", result)
                }
                return result.data;
            }).catch((err) => {
                console.log(err);
            })
    }

    componentDidMount() {
        this._fetchMembersById();
        this.deEmitter = DeviceEventEmitter.addListener('fetchMemData', (data) => {
            if (data == null) {
                DeviceEventEmitter.emit('fetchMemDataOver', null)
                return;
            } else {
                let depName = data.depName;
                this._fetchMembersById().then((data) => {
                    if (data == null) {
                        return;
                    }
                    console.log("data", data)
                    data.forEach((dataObj, i) => {
                        if (dataObj.title == depName) {
                            let tempData = {
                                depMem: dataObj.data,
                                depNameWithNum: dataObj.title + "(" + dataObj.size + ")",
                            }
                            DeviceEventEmitter.emit('fetchMemDataOver', tempData)
                            return;
                        }
                    })
                });
            }
        });
    }

    componentWillUnmount() {
        this.deEmitter.remove();
    }


    renderBottonBox = (buttonArr, type) => {
        let buttonBox = []
        let buttonCell = [];
        buttonArr.forEach((buttonObj, i) => {
            buttonCell.push(
                <TouchableOpacity key={i} onPress={() => { this._clickButton(buttonObj, type) }}>
                    <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 5 }}>
                        <View style={styles.inBlock}>
                            <Icon name={buttonObj.iconName}
                                size={30}
                            />
                            <Text>{buttonObj.iconTitle}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            )
            if (buttonCell.length == 4) {
                buttonBox.push(
                    <View key={"a" + i} style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        {buttonCell}
                    </View>
                )
                buttonCell = [];
            }
            if (i == buttonArr.length - 1 && buttonCell.length > 0) {
                let num = 4 - buttonCell.length;
                let tempCell = [];
                while (num > 0) {
                    tempCell.push(<View style={styles.inBlock} key={"b" + num}></View>)
                    num--;
                }
                buttonBox.push(
                    <View key={"a" + i} style={{ flexDirection: "row", justifyContent: "space-around" }}>
                        {buttonCell}
                        {tempCell}
                    </View>
                )
            }
        })
        return buttonBox;
    }

    _clickButton(buttonObj, type) {
        if (type == 0) {
            this._clickType0Button(buttonObj.iconTitle);
        } else if (type == 1) {
            this._clickType1Button(buttonObj);
        }
    }

    _clickType0Button = (iconTitle) => {
        let { navigator } = this.props;
        if (iconTitle === "办活动") {
            if (navigator) {
                navigator.push({
                    name: 'AddActivity',
                    component: AddActivity,
                    params: {
                        teamId: this.props.teamId//社团id
                    }
                })
            } else {
                alert('跳转失败')
            }
        } else if (iconTitle == "邀社员") {
            if (navigator) {
                navigator.push({
                    name: 'teamMemberAdd',
                    component: TeamMemberAdd,
                    params: {
                        teamId: this.props.teamId//社团id
                    }
                })
            } else {
                alert('跳转失败')
            }
        } else if (iconTitle == "传图片") {
            if (navigator) {
                navigator.push({
                    name: 'teamImgUploadList',
                    component: TeamImgUploadList,
                    params: {
                        teamId: this.props.teamId//社团id
                    }
                })
            } else {
                alert('跳转失败')
            }
        } else if (iconTitle == "改信息") {
            if (navigator) {
                navigator.push({
                    name: 'teamInfoEdit2',
                    component: TeamInfoEdit2,
                    params: {
                        teamId: this.props.teamId//社团id
                    }
                })
            } else {
                alert('跳转失败')
            }
        }
    }

    _clickType1Button = (buttonObj) => {
        let { navigator } = this.props;
        // alert(JSON.stringify(buttonObj))
        if (buttonObj.iconTitle === "...") {
            this.setState({
                modalVisible: true,
            })

        } else {
            if (navigator) {
                navigator.push({
                    name: 'teamMemberManage',
                    component: TeamMemberManage,
                    params: {
                        teamId: this.props.teamId,
                        depMem: buttonObj.params,
                        depName: buttonObj.iconTitle,
                    }
                })
            } else {
                alert('跳转失败')
            }
        }
    }

    _logoutTeam() {
        Alert.alert('温馨提醒', '你确定要退出当前社团吗?', [
            { text: '取消' },
            {
                text: '确定', onPress: () => {
                    alert("TODO:")
                }
            }
        ])
    }

    renderButton = (buttonArr, type) => {
        return <View style={{ borderBottomColor: "#ccc", borderBottomWidth: 1, paddingTop: 10, paddingBottom: 10 }}>
            {this.renderBottonBox(buttonArr, type)}
        </View>
    }

    _renderCommonCellImg = (item) => {
        return (
            <CommonCellImg
                leftTitle={item.leftTitle}
                rightTitle={item.rightTitle}
                callBackLeftIcon={() => {
                    return (
                        <View >
                            <Icon name={item.iconName}
                                size={20}
                                style={styles.leftImgStyle}
                            />
                        </View>
                    )
                }}
            // callBackClickCell={() => {
            //     this._clickCell(item.dataKey);
            // }}
            />
        )
    }

    render() {
        let buttonArr1 = [{
            iconName: "ios-person-add-outline",
            iconTitle: "邀社员",
        }, {
            iconName: "ios-list-box-outline",
            iconTitle: "改信息",
        }, {
            iconName: "ios-add-circle-outline",
            iconTitle: "办活动",
        }, {
            iconName: "ios-image-outline",
            iconTitle: "传图片",
        }];

        let buttonArr2 = []
        let data = this.state.data;
        if (data != null) {
            data.forEach((dataObj) => {
                let tempObj = {};
                tempObj.iconTitle = dataObj.title + "(" + dataObj.size + ")";
                tempObj.iconName = "ios-log-in-outline";
                tempObj.params = dataObj.data;
                buttonArr2.push(tempObj);
            })
        }
        let tempObj = {
            iconTitle: "...",
            iconName: "ios-add",
            params: null,
        };
        buttonArr2.push(tempObj);

        let items1 = {
            leftTitle: '社团功能',
            rightTitle: '',
            iconName: 'ios-arrow-down',
            dataKey: "teamFunc",
        };
        let items2 = {
            leftTitle: '成员管理',
            rightTitle: this.state.total + "人",
            iconName: 'ios-arrow-down',
            dataKey: "teamMem",
        };
        return (

            <View style={{ flex: 1 }}>
                <Title title="社团功能" leftView={true} navigator={this.props.navigator}></Title>
                {this._renderCommonCellImg(items1)}
                {this.renderButton(buttonArr1, 0)}
                {this._renderCommonCellImg(items2)}
                {this.renderButton(buttonArr2, 1)}
                <Modal
                    animationType={'slide'}
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => { }}
                    onShow={() => { }}
                >
                    <View style={styles.modalContainer}>
                        {this._renderModalContent()}
                    </View>
                </Modal >
                {/* <View style={{ marginTop: 10 }}>
                    <TouchableOpacity onPress={() => { this._logoutTeam() }}>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>退出社团</Text>
                        </View>
                    </TouchableOpacity>
                </View> */}
            </View>
        )
    }



    _onEndEditing() {
        let content = this.state.content;
        if (content == '') {
            alert("部门名称不能为空!")
            return;
        }
        Alert.alert('温馨提醒', '你确定要创建[' + content + ']吗?', [
            {
                text: '取消', onPress: () => {
                    this.setState({
                        modalVisible: false
                    })
                }
            },
            {
                text: '确定', onPress: () => {
                    let params = {
                        teamId: this.props.teamId,
                        departmentName: content,
                        userTeamType: 3,
                    }
                    let uri = config.uri.team + config.team.addTeamUser;
                    request.post(uri, params).then((result) => {
                        if (result && result.success) {
                            return true
                        }
                        return false
                    }).then((flag) => {
                        if (flag) {
                            ToastAndroid.show('添加部门成功', ToastAndroid.SHORT);
                            this._fetchMembersById();
                        } else {
                            ToastAndroid.show('添加部门失败', ToastAndroid.SHORT);
                        }
                        this.setState({
                            modalVisible: false,
                            content: '',
                        })
                    })
                }
            }
        ])
    }

    _renderModalContent = () => {
        return <View style={{ marginHorizontal: 20, }}>
            <TextInput
                autoFocus={true}
                blurOnSubmit={true}
                maxLength={8}
                value={this.state.content}
                onChangeText={(text) => {
                    this.setState({
                        content: text,
                    })
                }}
                autoCapitalize={"none"}
                style={{ color: "white" }}
                underlineColorAndroid={"#eee"}
                onEndEditing={() => { this._onEndEditing() }}
            />
            <TouchableOpacity onPress={() => {
                this.setState({
                    modalVisible: false
                })
            }}>
                <View style={[styles.btn, { borderColor: "#ddd" }]}>
                    <Text style={[styles.btnText, { color: "#ddd" }]}>关闭</Text>
                </View>
            </TouchableOpacity>
        </View>
    }
}

const styles = StyleSheet.create({
    btn: {
        height: 40,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ee735d',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
    },
    btnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ee735d'
    },
    inBlock: { alignItems: "center", width: 100 },
    leftImgStyle: {
        marginRight: 6,
        borderRadius: 12,
        backgroundColor: '#eee',
        width: 20,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
});
