import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    PixelRatio,
    ToastAndroid,
    Dimensions,
    Modal,
} from 'react-native'
import Title from './../commonView/title';
import config from '../common/config';
import request from '../common/request';
import Avatar from './../commonView/avatar';
import AccountShow from './../Account/accountShow';
import DeviceStorage from '../common/deviceStorage';
const { width, height } = Dimensions.get('window');
export default class TeamMemberAdd extends Component {
    static defaultProps = {
        teamId: "",
    }; //

    constructor(props) {
        super(props)
        this.state = {
            username: "",
            user: null,//搜索到的用户
            depNames: null,//部门信息
            modalVisible: false,//模态场景是否可见
            userId: "",//当前登入用户的id
        }
        this._fetchUserByStuNo = this._fetchUserByStuNo.bind(this);
        this._fetchAddUserMs = this._fetchAddUserMs.bind(this);
        this._fetchDepData = this._fetchDepData.bind(this);
        this._pushAccountShow = this._pushAccountShow.bind(this);
        this._asyncGetUser = this._asyncGetUser.bind(this);
    }

    _renderModal = () => {
        return <Modal
            animationType={'slide'}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => { this.setState({ modalVisible: false }) }}
        >
            <View style={styles.modalContainer}>
                {this._renderModalContentType0()}
            </View>
        </Modal >
    }
    /**
     * 部门模态
     */
    _renderModalContentType0 = () => {
        let depNames = this.state.depNames;
        if (depNames == null) {
            return;
        }
        let cellArr = [];
        depNames.forEach((depName, i) => {
            if (depName !== "主席团") {
                let cell =
                    <TouchableOpacity key={i} onPress={() => { this._fetchAddUserMs(depName) }}>
                        <View style={styles.block0}>
                            <Text style={{ fontSize: 17 }}>{depName}</Text>
                        </View>
                    </TouchableOpacity>
                cellArr.push(cell);
            }
        })
        cellArr.push(<TouchableOpacity key={depNames.length + 1} onPress={() => { this.setState({ modalVisible: false }) }} >
            <View style={[styles.block0, { marginTop: 5 }]}>
                <Text style={{ fontSize: 17 }}>取消</Text>
            </View>
        </TouchableOpacity>)
        return <View style={styles.block0Container}>
            {cellArr}
        </View >
    }
    /**
     * 获取部门信息
     */
    _fetchDepData() {
        let uri = config.uri.team + config.team.teamDeps;
        request.post(uri, { id: this.props.teamId }).then((result) => {
            if (result && result.success) {
                this.setState({
                    depNames: result.data,
                })
            }
        })
    }

    componentDidMount() {
        this._asyncGetUser();
        this._fetchDepData();
    }

    _fetchAddUserMs(depName) {
        let userId = this.state.user.userId;
        if (this.state.userId == userId) {
            ToastAndroid.show('不可以邀请自己哦', ToastAndroid.SHORT);
            return;
        }
        //不可以邀请自己
        let params = {
            messagesFromid: this.props.teamId,//发送方id
            messagesFromtype: 0,//发送方的类型
            messagesToid: userId,//接收方id
            messagesTotype: 1, //接收方类型 0社团 1用户
            messagesType: "100",//消息类型 用户被邀请
            messagesParams: {
                depName: depName,
            }
            // messagesDate: "",//邀请时间
            // messagesContent: "",//邀请内容
        }
        let url = config.uri.user + config.user.addMs;
        request.post(url, params).then((result) => {
            if (result && result.success) {
                ToastAndroid.show('消息已发出,请耐心等候', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(result.message, ToastAndroid.SHORT);
            }
            this.setState({
                modalVisible: false,
            })
        })
    }

    _asyncGetUser() {
        DeviceStorage.get("user").then((value) => {
            this.setState({
                userId: value.userId,
            });
        })
    }

    _fetchUserByStuNo() {
        let url = config.uri.user + config.user.findByStuNo;
        let stuNo = this.state.username;
        let reg = /(^[a-zA-Z]{1}[0-9]{8}$)|(^a$)/;
        if (!stuNo.match(reg)) {
            ToastAndroid.show("学号格式不正确", ToastAndroid.SHORT);
            return;
        }
        let params = {
            stuNo: stuNo,
        };
        request.post(url, params).then((result) => {
            if (result && result.success) {
                if (result.data == null) {
                    ToastAndroid.show('该学号不存在', ToastAndroid.SHORT);
                } else {
                    this.setState({
                        user: result.data,
                    })
                }
            }
        })
    }

    _renderInvite = () => {
        return <View style={styles.signupBox}>
            <Text style={styles.title}>查询</Text>
            <TextInput
                placeholder='学号'
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
            <TouchableOpacity onPress={() => { this._fetchUserByStuNo() }}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>查询</Text>
                </View>
            </TouchableOpacity>
        </View>
    }

    _pushAccountShow(userId) {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'accountShow',
                component: AccountShow,
                params: {
                    userId: userId,
                }
            })
        } else {
            alert(111)
        }
    }

    _renderSearchList = () => {
        let user = this.state.user;
        console.log(user)
        let avatarCell =
            <TouchableOpacity activeOpacity={0.5} onPress={() => { this._pushAccountShow(user.userId) }}>
                <View style={styles.imgBox}>
                    <Avatar imgUrl={user.userAvatar} avatarStyle={styles.avatar} noAvatarStyle={styles.noImage}>
                    </Avatar>
                </View>
            </TouchableOpacity>

        return <View style={styles.rowStyle}>
            <View style={{ flexDirection: 'row', alignItems: "center" }}>
                {avatarCell}
                <Text style={{ marginLeft: 5, fontSize: 15, color: "black" }}>{user.userNickname}</Text>
            </View>
            <TouchableOpacity activeOpacity={0.5} onPress={() => { this.setState({ modalVisible: true }) }}>
                <View style={styles.leftTextBox}>
                    <Text>邀请</Text>
                </View>
            </TouchableOpacity>
        </View >
    }

    render() {
        return (
            <View>
                <Title title='邀请同学'
                    leftView={true}
                    navigator={this.props.navigator}
                />
                <View style={{ marginTop: 5 }}>
                    {this._renderInvite()}
                    {this.state.user == null ? null : this._renderSearchList()}
                </View>
                {this._renderModal()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    block0: { borderRadius: 3, marginBottom: 5, height: 50, backgroundColor: "#DFFF70", width: width - 60, alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderColor: "#eee" },
    block0Container: { alignItems: "center", justifyContent: "center", marginHorizontal: 20, flex: 1 },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    imgBox: {
        marginRight: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    noImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#eee",
    },
    leftTextBox: {
        backgroundColor: "#ddd",
        borderBottomWidth: 1,
        borderColor: "#eee",
        borderRadius: 5,
        padding: 5,
    },

    rowStyle: {
        flexDirection: 'row',
        justifyContent: "space-between",
        alignItems: 'center',
        padding: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 1 / PixelRatio.get()
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