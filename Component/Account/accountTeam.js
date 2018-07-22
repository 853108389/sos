import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    PixelRatio,
    TouchableOpacity,
    Alert,
    ToastAndroid,
} from 'react-native'
import TeamIteamWithUser from '../Team/TeamIteamWithUser';
import Title from '../commonView/title';
import config from '../common/config';
import request from '../common/request';
import Avatar from './../commonView/avatar';
import AddTeam from './../Team/addTeam';

export default class AccountTeam extends Component {
    static defaultProps = {
        userId: "",
        userName: "",
        userNickname: "",
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            teamData: null,
            teamDataSize: 0,
        };
        //渲染界面
        this._renderMyTeam = this._renderMyTeam.bind(this);
        this._fetchTeamData = this._fetchTeamData.bind(this);
        this._fetchdeleteTeamUser = this._fetchdeleteTeamUser.bind(this);
        this._fetchDelUser = this._fetchDelUser.bind(this);
        this._selectMoreMenu = this._selectMoreMenu.bind(this);
        this._pushAddTeam = this._pushAddTeam.bind(this);
    }


    render() {
        return (
            <View>
                <Title title='我的社团' leftView={true} navigator={this.props.navigator} rightMoreView={true}
                    moreMenuData={['创建社团',]}
                    selectMoreMenuCallBack={(idx, value) => { this._selectMoreMenu(idx, value) }}>
                </Title>
                {this._renderMyTeam()}
            </View>
        )
    }

    _pushAddTeam() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'addTeam',
                component: AddTeam,
                params: {
                    userId: this.props.userId,
                }
            })
        } else {
        }
    }

    _selectMoreMenu(idx, value) {
        if (value == "创建社团") {
            this._pushAddTeam();
            //创建社团界面
        }
    }

    componentDidMount() {
        this._fetchTeamData();
    }

    _fetchTeamData() {
        //更新自己的服务器
        let url = config.uri.user + config.user.userTeams;
        let userId = this.props.userId;
        request.post(url, {
            id: userId
        }).then(
            (result) => {
                if (result && result.success) {
                    this.setState({
                        teamData: result.data,
                        teamDataSize: result.total,
                    })
                    console.log("teamData", this.state.teamData)
        
                }
            }
            ).catch((err) => {
                alert(err);
            })
    }

    _fetchdeleteTeamUser(teamId) {
        this._fetchDelUser(teamId);
    }

    _fetchDelUser(teamId) {
        Alert.alert('温馨提醒', '你确定要退出社团吗?', [
            { text: '取消' },
            {
                text: '确定', onPress: () => {
                    let uri = config.uri.team + config.team.delTeamUser;
                    let params = {
                        userId: this.props.userId,
                        teamId: teamId,
                        messagesType: "101",//用户主动退出社团
                        messagesContent: this.props.userNickname + "(" + this.props.userName + ")" + "已经退出社团",
                    }
                    request.post(uri, params).then((result) => {
                        if (result && result.success) {
                            return true
                        }
                        else {
                            return false
                        }
                    }).then((flag) => {
                        if (flag) {
                            ToastAndroid.show('操作成功', ToastAndroid.SHORT);
                            this._fetchTeamData()
                        } else {
                            ToastAndroid.show('操作失败', ToastAndroid.SHORT);
                        }
                    })
                }
            }
        ])
    }


    //渲染我的社团
    _renderMyTeam() {
        let data = this.state.teamData;
        if (data == null) {
            return;
        }
        // let itemCells = [];
        // if (this.state.depMem != null) {
        //     for (let rowData of this.state.depMem) {
        //         let itemCell = this._renderItemCell(rowData);
        //         itemCells.push(itemCell)
        //     }
        // }
        // return itemCells;

        let cellArr = [];
        data.forEach((dataObj, i) => {
            let itemCell = this._renderItemCell(dataObj);
            cellArr.push(itemCell);
        })
        return cellArr
    }

    _renderItemCell = (rowData) => {
        let itemCell = null;
        let avatarCell = <View style={styles.imgBox}>
            <Avatar imgUrl={rowData.teamBackImg} avatarStyle={styles.image} noAvatarStyle={styles.noImage}></Avatar>
        </View>
        itemCell =
            <View style={styles.itemBox} key={rowData.teamId}>
                <View style={styles.rowStyle}>
                    {avatarCell}
                    {rowData.userTeamType !== "成员" ? <View style={styles.leftTextBox}>
                        <Text style={styles.leftText}>{rowData.userTeamType}</Text>
                    </View> : null}
                    <Text style={styles.nameText}>{rowData.teamName}</Text>
                </View>
                <View style={styles.menuBox}>
                    {rowData.userTeamType !== "主席" ? <TouchableOpacity onPress={() => { this._fetchdeleteTeamUser(rowData.teamId) }}>
                        <View style={[styles.leftTextBox, { backgroundColor: "rgba(255,0,0,0.4)" }]}>
                            <Text style={styles.leftText}>退出</Text>
                        </View>
                    </TouchableOpacity> : null}
                </View>
            </View>

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
}


const styles = StyleSheet.create({
    menuBox: {
        alignItems: "center",
        justifyContent: "center"
    },
    leftTextBox: {
        padding: 3,
        backgroundColor: "#98DA00",
        borderBottomWidth: 1,
        borderColor: "#eee",
        borderRadius: 5,
    },
    nameText: {
        marginLeft: 5,
        fontSize: 15,
        color: "black"
    },
    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemBox: {
        flexDirection: "row",
        borderBottomColor: 'grey',
        borderBottomWidth: 1 / PixelRatio.get(),
        alignItems: "center",
        justifyContent: "space-between",
        padding: 10,
    },
    leftText: {
        color: "white",
        fontSize: 13
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