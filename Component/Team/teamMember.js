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
    PixelRatio,
    TouchableOpacity,
    Dimensions,
    Image,
} from 'react-native';

import CommonHeaderListView from '../commonView/CommonHeaderListView';
import AccountShow from '../Account/accountShow';
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
import config from '../common/config';
import request from '../common/request';
// var Member = require('../../LocalData/Member.json');

export default class TeamMember extends Component {

    static defaultProps = {
        teamId: "",
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            data: null,
        };
        this._pushAccountShow = this._pushAccountShow.bind(this);
        this._fetchMembersById = this._fetchMembersById.bind(this);
    }


    componentDidMount() {
        this._fetchMembersById({
            id: this.props.teamId,
        });//从服务器获取的真实数据
    }

    _fetchMembersById(data) {
        //更新自己的服务器
        let url = config.uri.team + config.team.teamUsers;
        request.post(url, data)
            .then(
            (result) => {
                if (result && result.success) {
                    this.setState({
                        data: result.data,//其他信息
                        total: result.total,//人数
                        depNum: result.depNum, //部门数量
                    })
                }
            }
            ).catch((err) => {
                console.log(err);
            })
    }
    render() {
        let data = this.state.data;
        if (data == null) {
            return <View></View>;
        }
        let stutentNumber = this.state.total;
        let size = this.state.depNum;
        return (
            <View style={styles.container}>
                <CommonHeaderListView data={data}
                    renderItemCallback={(rowData) => {
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
                        return (
                            <TouchableOpacity activeOpacity={0.5} onPress={() => { this._pushAccountShow(rowData.userId) }}>
                                <View style={styles.rowStyle}>
                                    {avatarCell}
                                    <Text style={{ marginLeft: 5, fontSize: 15, color: "black" }}>{rowData.userName}</Text>
                                    <View style={styles.leftTextBox}>
                                        <Text style={styles.leftText}>{rowData.userTeamType}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }}
                    renderSectionHeaderCallback={(sectionData, sectionID) => {
                        return (
                            <View style={styles.sectionHeaderViewStyle}>
                                <Text style={{ marginLeft: 5, color: 'white' }}>{sectionData}</Text>
                            </View>
                        );
                    }}
                    renderHeaderCallback={() => {
                        return (
                            <View style={styles.topButtonBox}>
                                <View style={styles.topButton} >
                                    <Icon
                                        name={"ios-log-in-outline"}
                                        size={20}
                                        style={styles.icon}
                                        color={"#ca710c"}
                                    />
                                    {/* <Text>校级社团</Text> */}
                                    <Text style={styles.topButtonText}>部门数: {size}</Text>
                                </View>
                                <View style={styles.topButton} >
                                    <Icon
                                        name={"ios-person-outline"}
                                        color={"#ca710c"}
                                        size={20}
                                        style={styles.icon} />
                                    {/* <Text>校级社团</Text> */}
                                    <Text style={styles.topButtonText}>成员数: {stutentNumber}</Text>
                                </View>
                            </View>
                        )
                    }}
                />
            </View>
        );
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
    leftText: { color: "white", fontSize: 13 },
    leftTextBox: {
        position: "absolute",
        right: 10,
        padding: 3,
        backgroundColor: "#ddd",
        borderBottomWidth: 1,
        backgroundColor: "#98DA00",
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
    topButtonBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 10,
    },
    topButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderRightWidth: 1,
        borderRightColor: '#ddd',
        width: width / 2,
    },
    topButtonText: {
        marginLeft: 5,
    },

    rowStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomColor: 'grey',
        borderBottomWidth: 1 / PixelRatio.get()
    },
    sectionHeaderViewStyle: {
        backgroundColor: '#ee733c',
        height: 30,
        justifyContent: 'center'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    teamSizeBox: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    }
});

