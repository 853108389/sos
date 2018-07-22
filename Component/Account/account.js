/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Platform,
    Dimensions,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Title from '../commonView/title';
import AccountDetail from './accountDetail';
import CommonCellImg from '../commonView/CommonCellImg';
import Settings from '../Settings/settings';
import AccountImgUpload from './accountImgUpload';
import TeamIteamWithUser from '../Team/TeamIteamWithUser';
import TeamDetail from '../Team/teamDetail';
import config from '../common/config';
import request from '../common/request';
import AccountMessage from './accountMessage';
import AccountTeam from './accountTeam';
const { width, height } = Dimensions.get('window');

export default class Account extends Component {

    static defaultProps = {
        user: null,
        teamData: null,
        teamDataSize: 0,

    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            user: this.props.user,//数据源user
            logined: false,//是否登入
            isClick: false,
        };
        //渲染界面
        this._renderTopView = this._renderTopView.bind(this);
        this._renderMiddleView = this._renderMiddleView.bind(this);
        this._renderMyTeam = this._renderMyTeam.bind(this);
        this._renderCommonCellImg = this._renderCommonCellImg.bind(this);
        //跳转
        this._pushAccountDetail = this._pushAccountDetail.bind(this);
        this._pushSettings = this._pushSettings.bind(this);
        this._pushTeamDetail = this._pushTeamDetail.bind(this);
        this._pushAccountMessage = this._pushAccountMessage.bind(this);
        this._pushmyTeam = this._pushmyTeam.bind(this);
        //click
        this._clickCell = this._clickCell.bind(this);
        //fetch
        this._fetchTeamData = this._fetchTeamData.bind(this);
    }

    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                    <Title title='我的' hasNewMessage={this.props.hasNewMs} rightMessageView={true} rightClick={() => { this._pushAccountMessage() }}></Title>
                    {/*上部分*/}
                    {this._renderTopView()}
                    <View>
                        {this._renderMiddleView()}
                    </View>
                </ScrollView>
            </View>
        );
    }

    componentDidMount() {
        this._fetchTeamData();
    }


    _fetchTeamData() {
        //更新自己的服务器
        let url = config.uri.user + config.user.userTeams;
        let userId = this.state.user.userId;
        request.post(url, {
            id: userId
        }).then(
            (result) => {
                if (result && result.success) {
                    this.setState({
                        teamData: result.data,
                        teamDataSize: result.total,
                    })
                }
            }
        ).catch((err) => {
            // alert(err);
        })
    }

    //渲染我的社团
    _renderMyTeam() {
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

    /**--上部分--**/
    _renderTopView() {
        let user = this.state.user;
        return (
            <AccountImgUpload user={user} infoButton={true} clickCallBack={() => { this._pushAccountDetail() }} />
        )
    }


    _renderCommonCellImg(item) {
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
                callBackClickCell={() => {
                    this._clickCell(item.dataKey);
                }}
            />
        )
    }

    _renderMiddleView() {
        let items1 = {
            leftTitle: '我的社团',
            rightTitle: ((this.state.teamDataSize != "" && typeof (this.state.teamDataSize) != "undefined") ? this.state.teamDataSize : 0) + "个",
            iconName: 'ios-arrow-down',
            dataKey: "myTeam",
        };
        let items2 = {
            leftTitle: '设置',
            rightTitle: '',
            iconName: 'ios-cog',
            dataKey: "settings",
        }
        return (
            <View>
                {this._renderCommonCellImg(items1)}
                {this._renderMyTeam()}
                <View style={{ marginTop: 10 }}></View>
                {this._renderCommonCellImg(items2)}
                <View style={{marginBottom: 10 }}></View>
            </View>
        )

    }

    _clickCell(dataKey) {
        if (dataKey === "settings") {
            this._pushSettings();
        } else if (dataKey === "myTeam") {
            this._pushmyTeam();
            // return;
        }

    }

    _pushAccountDetail() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'accountDetail',
                component: AccountDetail,
                params: {
                    user: this.state.user
                }
            })
        } else {
            // alert('跳转失败')
        }
    }

    _pushSettings() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'settings',
                component: Settings,
                params: {
                    user: this.state.user
                }
            })
        } else {
            // alert('跳转失败')
        }
    }

    _pushTeamDetail(teamId) {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'teamDetail',
                component: TeamDetail,
                params: {
                    teamId: teamId
                }
            })
        } else {
            // alert(111)
        }
    }

    _pushAccountMessage() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'AccountMessage',
                component: AccountMessage,
                params: {
                    userId: this.state.user.userId
                }
            })
        } else {
            alert(111)
        }
    }

    _pushmyTeam() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'AccountTeam',
                component: AccountTeam,
                params: {
                    userId: this.state.user.userId,
                    userName: this.state.user.userName,
                    userNickname: this.state.user.userNickname,
                }
            })
        } else {
            alert(111)
        }
    }


}
const styles = StyleSheet.create({
    //middle图片样式
    leftImgStyle: {
        marginRight: 6,
        borderRadius: 12,
        backgroundColor: '#eee',
        width: 20,
        textAlign: 'center',
    },

    forwardIcon: {
        color: '#999',
        fontSize: 22,
        marginRight: 8,
    },
    topView: {
        height: Platform.OS == 'ios' ? 400 : 160,
        backgroundColor: 'rgba(255,96,0,1.0)'
    },
    container: {
        flex: 1,
        backgroundColor: '#eee'
    },

    centerViewStyle: {
        flexDirection: 'row',
        width: width * 0.72
    },

    topViewStyle: {
        flexDirection: 'row',
        marginTop: Platform.OS == 'ios' ? 280 : 80,
        // 设置侧轴的对齐方式
        alignItems: 'center',
        // 设置主轴的对齐方式
        justifyContent: 'space-around'
    },

    leftIconStyle: {
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 3,
        borderColor: 'rgba(0,0,0,0.2)'
    },

    bottomViewStyle: {
        flexDirection: 'row',
        // 绝对定位
        position: 'absolute',
        bottom: 0,
    },

    bottomInnerViewStyle: {
        width: (width / 3) + 1,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.4)',

        justifyContent: 'center',
        alignItems: 'center',

        borderRightWidth: 1,
        borderRightColor: 'white'
    }
});








