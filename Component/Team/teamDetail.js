/**
TODO 权限控制写活动
menu数组是写死的,跳转的时候对应的是汉字
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Title from '../commonView/title';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import Icon from 'react-native-vector-icons/Ionicons';
import TeamMember from './teamMember';
import RenderTeamInfo from './renderTeamInfo';
import TeamActivity from './teamActivity'
import TeamDetailFunc from './teamDetailFunc';
import DeviceStorage from './../common/deviceStorage';
import config from '../common/config';
import request from '../common/request';

export default class TeamDetail extends Component {

    static defaultProps = {
        teamId: "",
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            userType: "",//用户权限
        };
        this.pushTeamFunc = this.pushTeamFunc.bind(this);
        this._fetchTeamUserTypeById = this._fetchTeamUserTypeById.bind(this);
    }

    renderTitle = () => {
        let cell = null;
        console.log("tp:", this.state.userType)
        if (this.state.userType == "" || this.state.userType > 3) {
            cell = <Title title='社团详情'
                leftView={true}
                navigator={this.props.navigator}
            >
            </Title>
        } else {
            cell = <Title title='社团详情'
                leftView={true}
                navigator={this.props.navigator}
                rightPointView={true}
                rightClick={() => { this.pushTeamFunc() }}
            >
            </Title>
        }
        return cell;
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                {this.renderTitle()}
                <ScrollableTabView
                    renderTabBar={() => <DefaultTabBar />}
                    tabBarPosition='top'
                    tabBarActiveTextColor='rgba(255,0,0,0.5)'
                    tabBarUnderlineStyle={styles.underlineStyle}
                >
                    <RenderTeamInfo tabLabel='详情' teamId={this.props.teamId} navigator={this.props.navigator}></RenderTeamInfo>
                    <TeamActivity tabLabel='活动' navigator={this.props.navigator} teamId={this.props.teamId}></TeamActivity>
                    <TeamMember tabLabel='成员' teamId={this.props.teamId} navigator={this.props.navigator}></TeamMember>
                </ScrollableTabView>
            </View>
        );
    }

    pushTeamFunc() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'teamDetailFunc',
                component: TeamDetailFunc,
                params: {
                    teamId: this.props.teamId//社团id
                }
            })
        } else {
            alert('跳转失败')
        }
    }

    componentDidMount() {
        DeviceStorage.get("user").then((value) => {
            let userId = value.userId
            let teamId = this.props.teamId;
            let data = {
                id: teamId,
                userId: userId,
            }
            if (teamId != "") {
                this._fetchTeamUserTypeById(data);
            }

        })
    };

    _fetchTeamUserTypeById(data) {
        let url = config.uri.team + config.team.teamUserType;
        request.post(url, data)
            .then((result) => {
                if (result && result.success) {
                    this.setState({
                        userType: result.data.userTeamType
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
    }
}
const styles = StyleSheet.create({

    underlineStyle: {
        backgroundColor: 'rgba(255,0,0,0.5)'
    },
    topImgContainer: {
        width: width,
        height: 200,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});



