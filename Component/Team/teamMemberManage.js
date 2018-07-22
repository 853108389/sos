/**
 * 社团人员管理界面
 */
import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    PixelRatio,
    Alert,
    Modal,
    Dimensions,
    ToastAndroid,
    TextInput,
    DeviceEventEmitter,
} from 'react-native'
import Title from './../commonView/title';
import AccountShow from '../Account/accountShow';
import CommonMenu from './../commonView/CommonMenu';
import Icon from 'react-native-vector-icons/Ionicons';
import config from "../common/config";
import request from '../common/request';
import DeviceStorage from './../common/deviceStorage';
const { width, height } = Dimensions.get('window');
export default class TeamMemberManage extends Component {

    static defaultProps = {
        depMem: '',
        depNameWithNum: "",
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            depMem: this.props.depMem,
            depNameWithNum: this.props.depName,
            userId: "",
            modalType: 0,
            modalVisible: false,//模态场景是否可见
            depNames: null,
            depName: "",
            content: '',//文本内容
        }
        this._pushAccountShow = this._pushAccountShow.bind(this);
        this._selectMoreViewItem = this._selectMoreViewItem.bind(this);
        this._fetchDepData = this._fetchDepData.bind(this);
        this._fetchUpdateUser = this._fetchUpdateUser.bind(this);
        this._fetchUpdateUser2 = this._fetchUpdateUser2.bind(this);
        this._fetchUpdateDepName = this._fetchUpdateDepName.bind(this);
        this._fetchDelUser = this._fetchDelUser.bind(this);
        this._deleteDep = this._deleteDep.bind(this);
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Title leftView={true} navigator={this.props.navigator} title={this.state.depNameWithNum}></Title>
                {this._renderButton()}
                {this._renderItemCells()}
                {this._renderModal()}
            </View>
        )
    }
    componentWillUnmount() {
        this.deEmitter.remove();
    }
    componentDidMount() {
        this.deEmitter = DeviceEventEmitter.addListener('fetchMemDataOver', (data) => {
            this.setState({
                depMem: data.depMem,
                depNameWithNum: data.depNameWithNum,
            })
        });

        this._fetchDepData();
        let depName = this.state.depNameWithNum.substring(0, this.state.depNameWithNum.length - 3);
        this.setState({
            depName: depName,
        })
    }
    componentWillUnmount() {
        this.deEmitter.remove();
    }

    _deleteDep() {
        // alert("部门无人时自动删除")
        // Alert.alert('温馨提醒', '你确定要删除部门吗?', [
        //     { text: '取消' },
        //     {
        //         text: '确定', onPress: () => {

        //         }
        //     }
        // ])
    }
    _renderButton() {
        if (this.state.depName !== "主席团") {
            return <TouchableOpacity onPress={() => {
                this.setState({
                    modalType: 2
                }, () => { this._openModal() })
            }}>
                <View style={styles.btn}>
                    <Text style={styles.btnText}>修改名称</Text>
                </View>
            </TouchableOpacity>
            // <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            //     <TouchableOpacity onPress={() => {
            //         this._deleteDep();
            //     }}>
            //         <View style={styles.btn2}>
            //             <Text style={styles.btnText}>删除部门</Text>
            //         </View>
            //     </TouchableOpacity>
            // </View>

        }
        return null;
    }

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

    _fetchUpdateUser(depName) {
        console.log("depName == this.state.depName", depName + "_" + this.state.depName)
        if (depName == this.state.depName) {
            ToastAndroid.show('无需移动哦', ToastAndroid.SHORT);
            return;
        }
        let userTeamType = 5;
        if (depName == "主席团") {
            userTeamType = 2;
        }
        Alert.alert('温馨提醒', '你确定要移动该用户吗?', [
            {
                text: '取消', onPress: () => { this._closeModal() }
            },
            {
                text: '确定', onPress: () => {
                    //更新用户所在的部门
                    let params = {
                        teamId: this.props.teamId,
                        userId: this.state.userId,
                        departmentName: depName,
                        userTeamType: userTeamType,
                    }
                    console.log(params);
                    let uri = config.uri.team + config.team.updateTeamUser;
                    request.post(uri, params).then((result) => {
                        if (result && result.success) {
                            console.log(result.data)
                            this.setState({
                                depNames: result.data,
                            }, () => {
                                DeviceEventEmitter.emit('fetchMemData', { depName: this.state.depName });
                            })
                            return true
                        } else {
                            return false
                        }
                    }).then((flag) => {
                        if (flag) {
                            ToastAndroid.show('操作成功', ToastAndroid.SHORT);
                        } else {
                            ToastAndroid.show('操作失败', ToastAndroid.SHORT);
                        }
                        this._closeModal();
                    })
                }
            }
        ])

    }

    _fetchUpdateUser2(typeName) {
        if (typeName == "主席") {
            title = "重要!!!";
            message = "您确定要更换[ 主席 ]吗";
        } else {
            title = '温馨提醒';
            message = '你确定要授权该用户吗?';
        }
        let departmentName = this.state.depName;
        Alert.alert(title, message, [
            { text: '取消', onPress: () => { this._closeModal() } },
            {
                text: '确定', onPress: () => {
                    //更新用户所对应的职务
                    let typeNum = "";
                    switch (typeName) {
                        case "主席":
                            typeNum = "1";
                            departmentName = "主席团";
                            break;
                        case "副主席":
                            typeNum = "2";
                            departmentName = "主席团";
                            break;
                        case "部长":
                            typeNum = "3";
                            break;
                        case "副部长":
                            typeNum = "4";
                            break;
                        case "部员":
                            typeNum = "5";
                            break;
                    }
                    let params = {
                        teamId: this.props.teamId,
                        userId: this.state.userId,
                        userTeamType: typeNum,
                        departmentName: departmentName,
                    }
                    let uri = config.uri.team + config.team.updateTeamUser;
                    request.post(uri, params).then((result) => {
                        if (result && result.success) {
                            this.setState({
                                depNames: result.data,
                            }, () => {
                                DeviceEventEmitter.emit('fetchMemData', { depName: this.state.depName });
                            })
                            return true
                        } else {
                            return false
                        }
                    }).then((flag) => {
                        if (flag) {
                            ToastAndroid.show('操作成功', ToastAndroid.SHORT);
                        } else {
                            ToastAndroid.show('操作失败', ToastAndroid.SHORT);
                        }
                        this._closeModal();
                    })
                }
            }
        ])

    }

    _fetchUpdateDepName() {
        let content = this.state.content;
        if (content == '') {
            alert("部门名称不能为空!")
            return;
        }
        let depNameWithNum = this.state.depNameWithNum
        Alert.alert('温馨提醒', '你确定要修改部门名称吗?', [
            { text: '取消' },
            {
                text: '确定', onPress: () => {
                    let uri = config.uri.team + config.team.updateDepName;
                    let params = {
                        teamId: this.props.teamId,
                        userId: this.state.userId,
                        olddepartmentName: this.state.depName,
                        departmentName: this.state.content,
                    }
                    request.post(uri, params).then((result) => {
                        if (result && result.success) {
                            console.log(result.data)
                            this.setState({
                                depNames: result.data,
                                depName: content,
                                depNameWithNum: content + depNameWithNum.substring(depNameWithNum.length - 3, depNameWithNum.length),
                            })
                            return true
                        } else {
                            return false
                        }
                    }).then((flag) => {
                        if (flag) {
                            ToastAndroid.show('操作成功', ToastAndroid.SHORT);
                        } else {
                            ToastAndroid.show('操作失败', ToastAndroid.SHORT);
                        }
                        this._closeModal();
                    })
                }
            }
        ])

    }

    _fetchDelUser(userId) {
        Alert.alert('温馨提醒', '你确定要删除该用户吗?', [
            { text: '取消' },
            {
                text: '确定', onPress: () => {
                    let uri = config.uri.team + config.team.delTeamUser;
                    let params = {
                        teamId: this.props.teamId,
                        userId: userId,
                        messagesType: "201", //社团踢出用户
                        messagesContent: "您已被移出[" + this.state.depName + "]",
                    }
                    request.post(uri, params).then((result) => {
                        if (result && result.success) {
                            DeviceEventEmitter.emit('fetchMemData', { depName: this.state.depName });
                            return true
                        }
                        else {
                            return false
                        }
                    }).then((flag) => {
                        if (flag) {
                            ToastAndroid.show('删除成功', ToastAndroid.SHORT);
                        } else {
                            ToastAndroid.show('删除失败', ToastAndroid.SHORT);
                        }
                    })
                }
            }
        ])
    }


    _renderItemCell = (rowData) => {
        let itemCell = null;
        let avatarCell = null;
        if (rowData.userAvatar == "" || rowData.userAvatar == null) {
            avatarCell =
                <View style={styles.imgBox}>
                    <View style={styles.noImage}></View>
                </View>
        } else {
            avatarCell =
                <View style={styles.imgBox}>
                    <Image style={styles.image} source={{ uri: rowData.userAvatar }}>
                    </Image>
                </View>
        }
        itemCell = <TouchableOpacity key={rowData.userId} onPress={() => { this._pushAccountShow(rowData.userId) }}>
            <View style={styles.itemBox}>
                <View style={styles.rowStyle}>
                    {avatarCell}
                    {rowData.userTeamType !== "成员" ? <View style={styles.leftTextBox}>
                        <Text style={styles.leftText}>{rowData.userTeamType}</Text>
                    </View> : null}
                    <Text style={styles.nameText}>{rowData.userName}</Text>
                </View>
                <View style={styles.menuBox}>
                    {rowData.userTeamType == "主席" ? null : <CommonMenu style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                        selectItemCallBack={(idx, value) => { this._selectMoreViewItem(idx, value, rowData.userId) }}
                        data={["移动", "授权", "删除",]}
                        renderTriggerViewCallBack={() => {
                            return <View style={styles.iconBox}>
                                <Icon name='md-more'
                                    size={20}
                                />
                            </View>
                        }}></CommonMenu>}
                </View>
            </View>
        </TouchableOpacity >
        return itemCell;
    }

    _renderItemCells = () => {
        let itemCells = [];
        if (this.state.depMem != null) {
            for (let rowData of this.state.depMem) {
                let itemCell = this._renderItemCell(rowData);
                itemCells.push(itemCell)
            }
        }
        return itemCells;
    }

    _renderModal = () => {
        return <Modal
            animationType={'slide'}
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
                this._closeModal()
            }}
            onShow={this._startShow}
        >
            <View style={styles.modalContainer}>
                {this._renderModalContent(this.state.modalType)}
            </View>
        </Modal >
    }

    _renderModalContentType2 = () => {
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
                onEndEditing={() => { this._fetchUpdateDepName() }}
            />
            <TouchableOpacity onPress={() => {
                this._closeModal();
            }}>
                <View style={[styles.btn, { borderColor: "#ddd" }]}>
                    <Text style={[styles.btnText, { color: "#ddd" }]}>关闭</Text>
                </View>
            </TouchableOpacity>
        </View>
    }

    _renderModalContentType1 = () => {
        let depName = this.state.depName;
        let cell = null;
        let cell2 = null;
        if (depName == "主席团") {
        } else {
            cell = <View style={styles.blockBox}>
                <TouchableOpacity onPress={() => { this._fetchUpdateUser2("部长") }}>
                    <View style={[styles.block, { backgroundColor: "#77CD32" }]}>
                        <Text style={styles.blockText}>部长</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this._fetchUpdateUser2("副部长") }}>
                    <View style={[styles.block, { backgroundColor: "#9ACD32" }]}>
                        <Text style={styles.blockText}>副部长</Text>
                    </View>
                </TouchableOpacity>
            </View>
            cell2 = <TouchableOpacity onPress={() => { this._fetchUpdateUser2("部员") }}>
                <View style={[styles.block, { backgroundColor: "#9AC0CD" }]}>
                    <Text style={styles.blockText}>部员</Text>
                </View>
            </TouchableOpacity>
        }
        return <View style={{ marginHorizontal: 20, marginVertical: 60, flex: 1, justifyContent: "space-around" }}>
            <View style={styles.blockBox}>
                <TouchableOpacity onPress={() => { this._fetchUpdateUser2("主席") }}>
                    <View style={[styles.block, { backgroundColor: "#8B6508" }]}>
                        <Text style={styles.blockText}>主席</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { this._fetchUpdateUser2("副主席") }}>
                    <View style={[styles.block, { backgroundColor: "#8B7500" }]}>
                        <Text style={styles.blockText}> 副主席</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {cell}
            <View style={styles.blockBox}>
                {cell2}
                <TouchableOpacity onPress={() => { this._closeModal() }}>
                    <View style={[styles.block, { backgroundColor: "#8DDDDD" }]}>
                        <Text style={styles.blockText}>取消</Text>
                    </View>
                </TouchableOpacity>
                {cell2 == null ? <View style={[styles.block, { backgroundColor: "transparent" }]}></View> : null}
            </View>
        </View>
    }

    _renderModalContentType0 = () => {
        let depNames = this.state.depNames;
        if (depNames == null) {
            return;
        }
        let cellArr = [];
        depNames.forEach((depName, i) => {
            let cell =
                <TouchableOpacity key={i} onPress={() => { this._fetchUpdateUser(depName) }}>
                    <View style={styles.block0}>
                        <Text style={{ fontSize: 17 }}>{depName}</Text>
                    </View>
                </TouchableOpacity>
            cellArr.push(cell);
        })
        cellArr.push(<TouchableOpacity key={depNames.length + 1} onPress={() => { this._closeModal() }} >
            <View style={[styles.block0, { marginTop: 5 }]}>
                <Text style={{ fontSize: 17 }}>取消</Text>
            </View>
        </TouchableOpacity>)
        return <View style={styles.block0Container}>
            {cellArr}
        </View >
    }
    _renderModalContent = (modalType) => {
        switch (modalType) {
            case 0:
                return this._renderModalContentType0();
                break;
            case 1:
                return this._renderModalContentType1();
                break;
            case 2:
                return this._renderModalContentType2();
                break;
            default:
                break;
        }
    }

    _closeModal = () => {
        this._setModalVisible(false);
    }

    _openModal = () => {
        console.log("modalType", this.state.modalType);
        this._setModalVisible(true);
    }

    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    _startShow = () => {

    }

    _selectMoreViewItem(idx, value, userId) {
        switch (idx) {
            case "0":
                this.setState({
                    modalType: 0,
                    userId: userId,
                }, () => {
                    this._openModal();
                })
                break;
            case "1":
                this.setState({
                    modalType: 1,
                    userId: userId,
                }, () => {
                    this._openModal();
                })
                break;
            case "2":
                this._fetchDelUser(userId);
                break;
            default:
                break;
        }
        // moreMenuData=
        // selectMoreMenuCallBack={(idx, value) => { this._selectMoreMenu(idx, value) }}>
    }

    _pushAccountShow(userId) {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'AccountShow',
                component: AccountShow,
                params: {
                    userId: userId//传用户id查数据
                }
            })
        } else {
            alert(111)
        }
    }
}



const styles = StyleSheet.create({
    btn2: {
        height: 40,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ee735d',
        marginVertical: 10,
        width: width / 3,
        marginHorizontal: 5,
    },
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
        marginVertical: 10,
    },
    btnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ee735d'
    },
    nameText: { marginLeft: 5, fontSize: 15, color: "black" },
    menuBox: { alignItems: "center", justifyContent: "center" },
    iconBox: { alignItems: "center", justifyContent: 'center', paddingVertical: 5, paddingHorizontal: 12 },
    block0: { borderRadius: 3, marginBottom: 5, height: 50, backgroundColor: "#DFFF70", width: width - 60, alignItems: "center", justifyContent: "center", borderBottomWidth: 1, borderColor: "#eee" },
    block0Container: { alignItems: "center", justifyContent: "center", marginHorizontal: 20, flex: 1 },
    blockText: { fontSize: 20, color: "white" },
    blockBox: { flexDirection: "row", justifyContent: "space-around" },
    block: {
        borderRadius: 3,
        justifyContent: "center",
        width: width / 3,
        height: width / 3,
        backgroundColor: "red",
        alignItems: "center",
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    itemBox: {
        flexDirection: "row",
        borderBottomColor: 'grey',
        borderBottomWidth: 1 / PixelRatio.get(),
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    leftText: { color: "white", fontSize: 13 },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftTextBox: {
        padding: 3,
        backgroundColor: "#98DA00",
        borderBottomWidth: 1,
        borderColor: "#eee",
        borderRadius: 5,
    },
    imgBox: {
        marginRight: 10,
    },
    image: {
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

});