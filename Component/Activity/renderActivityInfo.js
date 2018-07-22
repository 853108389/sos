/**
 * 社团活动页面简介
 * TODO 富文本 图文结合
 * TODO JSON 参数没改完
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    Dimensions,
    Platform,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

const { width, height } = Dimensions.get('window');
import config from '../common/config';
import request from '../common/request';
import RenderActivityContent from './renderActivityContent'
import Icon from 'react-native-vector-icons/Ionicons';
import TeamDetail from '../Team/teamDetail'
import DeviceStorage from './../common/deviceStorage';


export default class RenderActivityInfo extends Component {

    static defaultProps = {
        activityId: '',//当前是哪个活动
        user: null,
        info: null,
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            up: false,
            data: null,
            isAble: true,
            userId: "",
        };
        //获取用户信息
        this._renderButtons = this._renderButtons.bind(this);
        this._renderTopView = this._renderTopView.bind(this);
        this._up = this._up.bind(this);
        this._pushTeamDetail = this._pushTeamDetail.bind(this);
        this._fetchActivityDetail = this._fetchActivityDetail.bind(this);
    }


    _fetchActivityDetail(data) {
        //更新自己的服务器
        let url = config.uri.activity + config.activity.detailVo;
        request.post(url, data)
            .then((result) => {
                if (result && result.success) {
                    this.setState({
                        data: result.data,
                    })
                    console.log("d", result.data)
                    this.refs.rac.setData(result.data);
                }
            }).catch((err) => {
                console.log(err);
            })
    }



    //活动详细信息
    render() {
        return (
            <ScrollView>
                <View style={styles.listHeader}>
                    {/* 大段文字 */}
                    {this._renderTopView()}
                    <RenderActivityContent ref="rac" isEdit={false} data={this.state.data}></RenderActivityContent>
                </View>
            </ScrollView>
        );
    }


    componentDidMount() {
        this._fetchActivityDetail({
            id: this.props.activityId,
        });
        this._asyncGetUser().then(() => {
            this._fetchIsup();
        });
    }

    _renderTopView() {
        let data = this.state.data;
        if (data == null) {
            return;
        }
        let teamAvatar = "";
        let teamName = "";
        let pushTime = "";
        let activityBackimg = "";
        let teamId = "";
        data.topInfo.forEach((dataObj) => {
            let { dataKey, dataValue } = dataObj;
            if (dataKey == "teamAvatar") {
                teamAvatar = dataValue;
            } else if (dataKey == "teamName") {
                teamName = dataValue;
            } else if (dataKey == "activityPushtime") {
                pushTime = dataValue;
            } else if (dataKey == "activityBackimg") {
                activityBackimg = dataValue;
            } else if (dataKey == "teamId") {
                teamId = dataValue;
            }
        })
        //社团
        return (
            <View>
                {this._renderImage(activityBackimg)}
                <View
                    style={styles.infoBox}
                >
                    {
                        teamAvatar != '' ?
                            <TouchableOpacity onPress={() => { this._pushTeamDetail(teamId) }}>
                                <Image
                                    style={styles.avatar}
                                    source={{ uri: teamAvatar }}
                                ></Image>
                            </TouchableOpacity>
                            : <View
                                style={styles.avatar}
                            ></View>
                    }
                    <View style={styles.descBox}>
                        <Text style={styles.nickname}>活动社团: {teamName}</Text>
                        <Text>发布时间: {pushTime}</Text>
                    </View>
                </View>
                {/* 点赞按钮 */}
                {this._renderButtons()}
                <View style={styles.headerBox}>
                    <Text style={styles.headerBoxText}>活动详情</Text>
                </View>

            </View>
        )
    }

    _pushTeamDetail(teamId) {
        if (teamId == "") {
            return;
        }
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'teamDetail',
                component: TeamDetail,
                params: {
                    teamId: teamId,
                }
            })
        } else {
            alert(111)
        }
    }

    _renderButtons() {
        let info = this.state.data.info
        let loves = info.loves;
        let commons = info.commons;
        return (
            <View style={styles.detailBox}>
                <View style={styles.detailInfo}>
                    <TouchableOpacity onPress={this._up} disabled={!this.state.isAble}>
                        <Icon
                            name={this.state.up ? 'ios-heart' : 'ios-heart-outline'}
                            size={25}
                            style={[styles.up, this.state.up ? null : styles.down]} />
                    </TouchableOpacity>
                    <Text style={styles.detailInfoText}>{loves}</Text>
                </View>
                <View style={styles.detailInfo}>
                    <Icon
                        name='ios-chatboxes'
                        size={25}
                    />
                    <Text style={styles.detailInfoText}>{commons}</Text>
                </View>
            </View>
        )
    }
    //图片
    _renderImage(imgUrl) {
        if (imgUrl == null && imgUrl == '') {
            return
        }
        return (
            <View style={styles.ImageBox}>
                <Image
                    style={styles.ImageStyle}
                    source={{ uri: imgUrl }}
                ></Image>
            </View>
        )
    }

    _asyncGetUser = () => {
        return DeviceStorage.get("user").then((value) => {
            this.setState({
                userId: value.userId,
            });
        })
    }


    _fetchIsup = (data) => {
        //更新自己的服务器
        let url = config.uri.activity + config.activity.isup;
        let body = {
            userId: this.state.userId,
            activityId: this.props.activityId,
        }
        request.post(url, body).then((result) => {
            if (result && result.success) {
                console.log("a", result.data)
                if (result.data.up == "false" || result.data.up == false) {
                    this.setState({
                        up: false
                    })
                } else {
                    this.setState({
                        up: true
                    })
                }
            } else {

            }
        }).catch((err) => {
            console.log(err);
        })
    }


    //点赞
    _up() {
        this.setState({
            isAble: false,
        })
        let up = !this.state.up;
        let url = config.uri.activity + config.activity.up;
        let body = {
            userId: this.state.userId,
            activityId: this.props.activityId,
            islove: up ? 1 : 0,
        }
        request.post(url, body)
            .then((data) => {
                if (data && data.success) {
                    let data2 = this.state.data;
                    if (up) {
                        data2.info.loves = Number(data2.info.loves) + 1;
                    } else {
                        data2.info.loves = Number(data2.info.loves) - 1;
                    }
                    this.setState({
                        up: up,
                        isAble: true,
                        data: data2,
                    });
                } else {
                    this.setState({
                        isAble: true,
                    });
                }
            }).catch((err) => {
                this.setState({
                    isAble: true,
                });
            });
    }

}

const styles = StyleSheet.create({

    headerBox: {
        alignItems: 'center',
        marginTop: 10,
    },
    headerBoxText: {
        color: 'black',
        fontSize: 18,
    },
    //图片
    ImageBox: {
        width: width,
        height: 240,
        backgroundColor: '#ddd'
    },
    ImageStyle: {
        width: width,
        height: 240,
    },
    //其他
    title: {
        marginTop: 3,
        fontSize: 16,
        color: '#666'

    },
    nickname: {
        color: 'black',
        fontSize: 18,
    },
    descBox: {
        flex: 1,
    },
    infoBox: {
        flexDirection: 'row',
        width: width,
        justifyContent: 'center',
        marginTop: 10,
    },
    detailBox: {
        width: width,
        flexDirection: 'row',
        marginTop: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#eee',
        justifyContent: "space-around",
        height: 35,
        alignItems: "center"

    },
    detailInfo: {
        flexDirection: 'row',
        marginRight: 10,
        alignItems: "center",
    },
    detailInfoText: {
        marginLeft: 5,
        color: 'black',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
        marginLeft: 10,
    },
    listHeader: {
        width: width,
    },
    up: {
        fontSize: 22,
        color: '#ed7b66'
    },

    down: {
        fontSize: 22,
        color: '#333'
    },
});


