/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    AsyncStorage,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Navigator } from "react-native-deprecated-custom-components";
import Home from '../Home/home';
import Account from '../Account/account';
import Activity from '../Activity/activity';
import Team from '../Team/team';
import DfyTabBar from '../commonView/DfyTabBar';
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import config from '../common/config';
import request from '../common/request';
import Login from '../../login'
import TestJson from './TestJson'
import TestFileUpload from './TestFileUpload'
import TestUploadModel from './TestUploadModel'
import AccountMessage from '../Account/accountMessage';
import TeamMemberBe from './../Team/TeamMemberBe';



export default class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            tabNames: ['首页', '社团', '活动', '我的'],
            tabIconNames: ['ios-home', 'ios-recording', 'ios-reverse-camera', 'ios-contact'],
            logined: false,
            user: null,
            hasNewMs: false,//是否有新消息
        };

        this._asyncGetAppStatus = this._asyncGetAppStatus.bind(this);
        this._fetchHasNewMs = this._fetchHasNewMs.bind(this);

    }

    _asyncGetAppStatus() {
        AsyncStorage.getItem('user')
            .then(
            (data) => {
                let user;
                let newState = {};
                if (data) {
                    user = JSON.parse(data);
                }
                if (user && user.userAccesstoken) {
                    newState.logined = true;
                    newState.user = user;
                } else {
                    newState.logined = false;
                }
                this.setState(newState);
            })
            .catch((err) => {
                alert(err);
            });
    }

    componentDidMount() {
        this._asyncGetAppStatus();
    }

    _fetchHasNewMs() {
        let userId = this.state.user.userId;
        let uri = config.uri.user + config.user.hasNewMs;
        request.post(uri, { id: userId }).then((data) => {
            if (data.success) {
                if (data.total > 0) {
                    this.setState({
                        hasNewMs: true,
                    })
                }else{
                    this.setState({
                        hasNewMs: false,
                    })
                }
            }
        })
    }

    render() {
        let tabNames = this.state.tabNames;
        let tabIconNames = this.state.tabIconNames;

        if (!this.state.logined) {
            // alert('没登入')
            // return <Login afterLogin={this._afterLogin}/>
        }

        return (
            <ScrollableTabView
                renderTabBar={() => <DfyTabBar tabNames={tabNames} tabIconNames={tabIconNames} />}
                tabBarPosition='bottom'
                locked={false}
                initialPage={0}
                prerenderingSiblingsNumber={1}
                scrollWithoutAnimation={true}
                onChangeTab={(obj) => {
                    if (obj.i == 3) {
                       this._fetchHasNewMs();
                    }
                }}
            >

                <Home tabLabel="home" navigator={this.props.navigator} user={this.state.user}></Home>
                <Team tabLabel="team" navigator={this.props.navigator} ></Team>
                <Activity tabLabel="activity" navigator={this.props.navigator} ></Activity>
                <Account hasNewMs={this.state.hasNewMs} tabLabel="account" navigator={this.props.navigator} logout={this._logout} user={this.state.user}></Account>
                {/* <TestJson tabLabel="test" user={this.state.user}></TestJson> */}
                {/* <TeamMemberBe tabLabel="test2" user={this.state.user}></TeamMemberBe> */}
                {/* <TestUploadModel tabLabel="test" user={this.state.user}></TestUploadModel> */}
                {/* <TestFileUpload tabLabel="test"  user={this.state.user}></TestFileUpload> */}
            </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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

