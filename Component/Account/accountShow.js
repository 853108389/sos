
import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Platform,
    Image,
    Text,
    View,
    Dimensions,
    ScrollView,
} from 'react-native';

import Title from '../commonView/title'
import CommonCellsWithModal from '../commonView/CommonCellsWithModal'
import CommonCellImg from '../commonView/CommonCellImg'
import CommonCell from '../commonView/CommonCell'
import Icon from 'react-native-vector-icons/Ionicons';
import TeamDetail from '../Team/teamDetail';
import TeamIteamWithUser from '../Team/TeamIteamWithUser'
import config from '../common/config'
import request from '../common/request'
import MyStyle from "../common/myStyle"
const { width, height } = Dimensions.get('window');

export default class AccountShow extends Component {
    static defaultProps = {
        userId: null,
        //需要编辑的信息数组
        isMulty: false,//是否多行显示
    }; //
    constructor(props) {
        super(props);
        this.state = {
            logined: false,
            user: this.props.user,
            logout: null,
            teamData: null,
            teamDataSize: "",
            userInfo: null,
            topInfo: null,
            rightTitle: "",
            isHidden: false,
        };
        //render
        this._renderTopImg = this._renderTopImg.bind(this);
        this._renderInfoCell2 = this._renderInfoCell2.bind(this);
        this._renderInfoCell = this._renderInfoCell.bind(this);
        this._renderTopView = this._renderTopView.bind(this);
        //push
        this._pushTeamDetail = this._pushTeamDetail.bind(this);
        //模态回调
        //fetch
        this._fetchUserData = this._fetchUserData.bind(this)
        this._fetchTeamData = this._fetchTeamData.bind(this)
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
                    console.log("teamData", result.data)
           
                }
            }
            ).catch((err) => {
                alert(err);
            })
    }


    _fetchUserData() {
        //更新自己的服务器
        let url = config.uri.user + config.user.userVo;
        let userId = this.props.userId;
        request.post(url, {
            id: userId,
            type: 0
        }).then(
            (result) => {
                if (result && result.success) {
                    if (result.message == "该用户已经隐藏信息") {
                        this.setState({
                            rightTitle: result.message,
                            isHidden: true,
                        })
                    }
                    let userInfo = [];
                    let topInfo = [];
                    let data = result.data;
                    for (let i = 0; i < data.length; i++) {
                        let dataObj = data[i]
                        let dataKey = dataObj.dataKey;
                        if (dataKey == "userAvatar" || dataKey == "userBackimg" || dataKey == "userNickname" || dataKey == "userSignature") {
                            topInfo.push(dataObj)
                        } else {
                            userInfo.push(dataObj)
                        }
                    }
                    // alert(JSON.stringify(result.data))
                    this.setState({
                        userInfo: userInfo,
                        topInfo: topInfo
                    })
             
                }
            }
            ).catch((err) => {
                alert(err);
            })
    }


    render() {
        let user = this.state.user;
        // alert(JSON.stringify(user))
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Title title='个人资料' leftView={true} navigator={this.props.navigator}></Title>
                    {/*如果有用户的头像则显示用户的头像，如果没有则显示还未设置头像*/}
                    {this._renderTopImg()}
                    <View style={styles.middleView}>
                        <CommonCellImg leftTitle='社团活动' rightTitle='ta有参加的社团' callBackLeftIcon={() => {
                            return (
                                <View >
                                    <Icon name='ios-information'
                                        size={20}
                                        style={styles.leftImgStyle}
                                    />
                                </View>
                            )
                        }} />
                    </View>
                    {this._renderInfoCell()}
                    <View style={styles.middleView}>
                        <CommonCellImg leftTitle='个人信息' rightTitle={this.state.rightTitle} callBackLeftIcon={() => {
                            return (
                                <View >
                                    <Icon name='ios-information'
                                        size={20}
                                        style={styles.leftImgStyle}
                                    />
                                </View>
                            )
                        }} />
                    </View>
                    <View style={styles.infoBox}>
                        {this.state.isHidden ? <Text></Text> : this._renderInfoCell2()}
                    </View>
                </View>
                <View style={{ marginBottom: 20 }}></View>
            </ScrollView>
        );
    }

    _renderTopImg() {
        let dataArr = this.state.topInfo;
        let avatarUrl = '';
        if (dataArr == null) {
            return;
        } else {
            for (let dataObj of dataArr) {
                if (dataObj.dataKey == 'userBackimg') {
                    avatarUrl = dataObj.dataValue;
                    if (avatarUrl != "") {
                        return (
                            <View style={styles.TopImgBox}>
                                <Image style={styles.TopImg}
                                    source={{ uri: avatarUrl }}
                                >
                                    {this._renderTopView()}
                                </Image>
                            </View>
                        )
                    }
                }
            }
            return (
                <View style={styles.NoTopImg}>
                    {this._renderTopView()}
                </View>
            )
        }
    }

    _renderTopView() {
        let dataArr = this.state.topInfo;
        let signature = "";
        let imgUrl = "";
        let imgCell = null;
        let userNickname = ""
        if (dataArr == null) {
            return;
        } else {
            for (let dataObj of dataArr) {
                if (dataObj.dataKey == 'userSignature') {
                    signature = dataObj.dataValue;
                } else if (dataObj.dataKey == "userAvatar") {
                    imgUrl = dataObj.dataValue;
                    if (imgUrl != "") {
                        imgCell = <Image
                            style={styles.avatar}
                            source={{ uri: imgUrl }}
                        ></Image>;
                    } else {
                        imgCell = <View style={styles.noAvatar}></View>
                    }

                } else if (dataObj.dataKey == "userNickname") {
                    userNickname = dataObj.dataValue;
                }
            }
        }
        return (
            <View style={styles.avatarContainer}>
                <View style={styles.avatarBox} >
                    <View style={styles.imgBox}>
                        {imgCell}
                    </View>
                </View>
                <View style={styles.nickNameBox}>
                    <Text style={styles.nickNameText}>{userNickname}</Text>
                </View>
                <Text style={{ marginBottom: 13 }}>{signature}</Text>
            </View>
        )
    }

    componentDidMount() {
        this._fetchUserData();
        this._fetchTeamData();
    }

    //渲染公共info组件
    _renderInfoCell2() {
        // let dataKey = this.props.dataKey;
        // let data = this.props.data;
        let data = this.state.userInfo;
        if (data == null) {
            return
        }

        let cellView = [];
        for (let i = 0; i < data.length; i++) {
            let dataObj = data[i]
            let dataKey = dataObj.dataKey;
            let lable = dataObj.lable //左标题 数据lable
            let dataValue = dataObj.dataValue; //右标题 数据值
            let title = lable;//标题
            var cell = <CommonCell key={i} title={lable} rightTitle={dataValue} ></CommonCell>;
            cellView.push(cell)
        }
        return cellView;
    }

    //渲染公共info组件
    _renderInfoCell() {
        let data = this.state.teamData;
        if (data == null) {
            return;
        }
        let cellArr = [];
        data.forEach((dataObj, i) => {
            let cell = <TeamIteamWithUser key={i} clickCallBack={() => { this._pushTeamDetail(dataObj.teamId) }} rowData={dataObj}></TeamIteamWithUser>
            cellArr.push(cell);
        })
        return cellArr
    }


    _pushTeamDetail(teamId) {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'teamDetail',
                component: TeamDetail,
                params: {
                    teamId: teamId//社团id
                }
            })
        } else {
            alert(111)
        }
    }

}

const styles = StyleSheet.create({
    nickNameBox: {
        alignItems: "center",
        marginBottom: 5,
    },
    nickNameText: {
        fontSize: 17,
        color: "white",
    },
    avatarContainer: {
        width: width,
        height: 190,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
    avatar: {
        marginBottom: 10,
        ...MyStyle.account.img.avatar
    },
    noAvatar: {
        marginBottom: 10,
        ...MyStyle.account.img.noAvatar
    },
    imgBox: {

    },
    infoBox: {
        width: width,
        flex: 1,
    },
    leftImgStyle: {
        marginRight: 6,
        borderRadius: 12,
        backgroundColor: '#eee',
        width: 20,
        textAlign: 'center',
    },
    middleView: {
        paddingTop: 5,
    },
    TopImgBox: {
        ...MyStyle.account.img.backImg,
        justifyContent: 'center',
        alignItems: 'center',
    },
    TopImg: {
        ...MyStyle.account.img.backImg
    },
    NoTopImg: {
        width: width,
        height: 190,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#666',
    },
    container: {
        flex: 1,
        // backgroundColor: '#F5FCFF',
        backgroundColor: '#eee',
    },

});

