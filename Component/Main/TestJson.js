/**
TODO
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    AsyncStorage,
    Modal,
} from 'react-native';
import config from '../common/config';
import request from '../common/request';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import DeviceStorage from "../common/deviceStorage";
export default class TestJson extends Component {

    static defaultProps = {
        user: null,
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            test: "test",
            data: null,
            uri: '',
        };
        this._fetchData = this._fetchData.bind(this);
    }

    renderKeyCellArr = (afterLoad) => {
        let size = 0;
        let keyCellArr = [];
        let rnkeyCellArr = [];
        DeviceStorage.keys().then((keyArr) => {
            if (keyArr != null) {
                keyArr.forEach((key, i) => {
                    if (key.startsWith("__react_native_storage_")) {
                        size++;
                    } else {
                        DeviceStorage.get(key).then((value) => {
                            if (typeof (value) == "object" && value.hasOwnProperty("rawData")) {
                                let rnKeyCell =
                                    <View style={styles.block} key={i}>
                                        <TouchableOpacity onPress={() => { alert(JSON.stringify(value)) }}>
                                            <Text> rn:{key} </Text>
                                        </TouchableOpacity>
                                    </View>
                                rnkeyCellArr.push(rnKeyCell);
                            } else {
                                let keyCell =
                                    <View style={styles.block} key={i}>
                                        <TouchableOpacity onPress={() => { alert(JSON.stringify(value)) }}>
                                            <Text> {key} </Text>
                                        </TouchableOpacity>
                                    </View>
                                keyCellArr.push(keyCell);
                            }
                            size++;
                            if (size == keyArr.length) {
                                let tempArr = [...keyCellArr, ...rnkeyCellArr];
                                afterLoad(tempArr)
                            }
                        })
                    }
                })
            }
        });
    }

    renderTodoView = () => {
        return <View style={styles.block} tabLabel="todo">
            <Text>社团申请创建</Text>
            <Text>活动点赞</Text>
            <Text>密码长度限制</Text>
            <Text>主席,部长个数限制</Text>
        </View>
    }

    render() {
        console.log("render")
        // storage.load({ key: "test" }).then((data) => { console.log("sto", data); })
        return (
            <ScrollableTabView
                renderTabBar={() => <DefaultTabBar />}
                tabBarPosition='top'
                tabBarActiveTextColor='rgba(255,0,0,0.5)'
                tabBarUnderlineStyle={styles.underlineStyle}
                onChangeTab={(obj) => {
                    this.renderKeyCellArr((keyCellArr) => {
                        // this.forceUpdate();
                        this.setState({
                            keyCellArr: keyCellArr,
                        })
                    });
                }}
            >
                {this.renderUriView()}
                <View tabLabel="storage">
                    {this.state.keyCellArr ? this.state.keyCellArr : null}
                </View>
                {this.renderTodoView()}
            </ScrollableTabView>
        );
    }

    renderUriView = () => {
        let testUri = config.uri.test + config.test.test;
        let detailUri = config.uri.user + config.user.detail;
        let loginUri = config.uri.user + config.user.login;
        let userVo = config.uri.user + config.user.userVo;
        let teamUri = config.uri.team + config.team.detail;
        let teamdetailVo = config.uri.team + config.team.detailVo;
        let userTeamsVo = config.uri.user + config.user.userTeams;
        let teamUsersVo = config.uri.team + config.team.teamUsers;
        let teamActivity = config.uri.team + config.team.activity;
        let activityAll = config.uri.activity + config.activity.all;
        let updateUser = config.uri.user + config.user.updata;
        let allTeams = config.uri.team + config.team.all;
        let actDetailVo = config.uri.activity + config.activity.detailVo;
        let actComments = config.uri.activity + config.activity.comments;
        let allTeamOrderBy = config.uri.team + config.team.allOrderBy;
        let allTeamKey = config.uri.team + config.team.key;
        let teamConditions = config.uri.team + config.team.conditions;
        let activityConditions = config.uri.activity + config.activity.conditions;
        let mac = config.uri.activity + config.activity.mac;
        let addComment = config.uri.comment + config.comment.add;
        let commentConditions = config.uri.comment + config.comment.conditions;
        let userAllMs = config.uri.user + config.user.allMs;
        let readMs = config.uri.user + config.user.readMs;
        let hasNewMs = config.uri.user + config.user.hasNewMs;
        return <ScrollView style={styles.container} tabLabel='uri地址连接测试'>
            <View style={styles.block}>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ color: 'green' }}>{this.props.user ? this.props.user.userName : ""} : </Text>
                    <Text selectable={true} style={{ color: 'red' }}>{config.uri.base}</Text>
                </View>
            </View>
            <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(hasNewMs, {
                        id: 5
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>是否有最新消息: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.user.hasNewMs}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(readMs, {
                        messagesId: 1,
                        messagesNum: 0
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>更新为已读消息: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.user.readMs}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(userAllMs,
                        {
                            pageIndex: "1",
                            isDesc: "true",
                            orderBy: "messages_date",
                            data: {
                                userId: 5,
                            }
                        })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>查看用户所有消息: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.user.allMs}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(addComment, { commentContent: "测试评论", activityId: 1, userId: 1 })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>提交评论: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.comment.add}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(mac, { teamId: 1 })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>测试七牛秘钥密匙和文件名: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.activity.mac}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(commentConditions, {
                        pageIndex: "1",
                        isDesc: "true",
                        orderBy: "comment_time",
                        data: {
                            activityId: 1,
                        }
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>条件查询评论: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.comment.conditions}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(activityConditions, {
                        isDesc: "true",
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>条件查询查找活动: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.activity.conditions}</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(teamConditions, {
                        pageIndex: "3",
                        orderBy: "team_name",
                        isDesc: "true",
                        data: {
                            teamName: "sos团",
                        }
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>条件查询查找社团: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.team.conditions}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(allTeamKey, {
                        key: "team_name",
                        value: "科协"
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>关键词查找社团: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.team.key}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(allTeamOrderBy, {
                        orderBy: "teamuser_num",
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>查询所有社团并排序: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.team.allOrderBy}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(actComments, {
                        id: 5
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>查询活动评论: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.activity.comments}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(actDetailVo, {
                        id: 5
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>查询活动详情: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.activity.detailVo}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(allTeams, {
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>查询所有社团: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.team.all}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(updateUser, {
                        data: {
                        }
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>更新用户信息: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.user.updata}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(activityAll)
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>所有活动: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.activity.all}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(teamActivity, {
                        id: 1,
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>社团所有活动 : </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.team.activity}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(teamUsersVo, {
                        id: 1,
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>社团及部门及部门成员 : </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.team.teamUsers}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(userTeamsVo, {
                        id: 1,
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>用户所有社团: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.user.userTeams}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(userVo, {
                        id: 1,
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>查询用户详细VO: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.user.userVo}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(teamdetailVo, {
                        id: 1,
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>查询社团详细VO: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.team.detailVo}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            {/* <View style={styles.block}>
                    <TouchableOpacity onPress={() => { this._fetchData(testUri) }}>
                        <Text selectable={true} style={{ color: 'red' }}>{testUri}</Text>
                    </TouchableOpacity>
              </View> */}
            {/* <View style={styles.block}>
                    <TouchableOpacity onPress={() => {
                        this._fetchData(detailUri, {
                            id: 1,
                        })
                    }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text>查询用户详细信息: </Text>
                            <Text selectable={true} style={{ color: 'red' }}>{config.user.detail}</Text>
                        </View>
                    </TouchableOpacity>
                </View> */}
            {/* <View style={styles.block}>
                    <TouchableOpacity onPress={() => {
                        this._fetchData(loginUri, {
                            stuNo: "B8888888",
                            password: "a",
                        })
                    }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>用户登入: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.user.login}</Text>
                    </View>
                </TouchableOpacity>
                </View>
            <View style={styles.block}>
                <TouchableOpacity onPress={() => {
                    this._fetchData(teamUri, {
                        id: "1",
                    })
                }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text>社团详情: </Text>
                        <Text selectable={true} style={{ color: 'red' }}>{config.team.detail}</Text>
                    </View>
                </TouchableOpacity>
            </View> */}
            <View style={{ alignItems: 'center', marginTop: 20, marginLeft: 20, marginRight: 20 }}>
                <Text selectable={true}>{this.state.data}</Text>
            </View>
        </ScrollView >
    }

    componentDidMount() {

    }

    _fetchData(uri, param) {
        // alert(JSON.stringify(param))
        request.post(uri, param)
            .then((data) => {
                this.setState({
                    data: JSON.stringify(data)
                });
            })
            .catch((err) => {
                alert(err)
            })
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    block: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        borderColor: "black",
        borderWidth: 1,
        padding: 10,
    }
});








