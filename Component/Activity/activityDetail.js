
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    Modal,
    View,
    AsyncStorage,
    Dimensions,
} from 'react-native';

import Button from 'react-native-button';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../common/config';
import request from '../common/request';

import Title from '../commonView/title';

import RenderActivityInfo from './renderActivityInfo'
import RenderActivityComment from './renderActivityComment'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';



const { width, height } = Dimensions.get('window');

let cachedResults = {
    nextPage: 1,
    items: [],
    total: 0,
}

export default class Detail extends Component {
    static defaultProps = {
        activityId: ''
    }; //

    constructor(props) {
        super(props);

        this.state = {
            //dt
            isLoadingTail: false,
            content: '',
            isSendingComment: false,
            user: null,
        }
        //数据
        //获取用户信息
        this._asyncGetAppStatus = this._asyncGetAppStatus.bind(this);

    }

    render() {
        let user = this.state.user;
        return (
            <View style={{ flex: 1 }}>
                <Title title='活动详情' leftView={true} navigator={this.props.navigator}></Title>
                <ScrollableTabView
                    renderTabBar={() => <DefaultTabBar />}
                    tabBarPosition='top'
                    tabBarActiveTextColor='rgba(255,0,0,0.5)'
                    tabBarUnderlineStyle={styles.underlineStyle}
                >
                    <RenderActivityInfo navigator={this.props.navigator}  tabLabel='详情' user={user}  activityId={this.props.activityId}></RenderActivityInfo>
                    <RenderActivityComment navigator={this.props.navigator} activityId={this.props.activityId}  tabLabel='评论'></RenderActivityComment>
                </ScrollableTabView>
            </View>

        )
    }



    componentDidMount() {
        this._asyncGetAppStatus();
        // alert(this.props.activityId)
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

                if (user && user.accessToken) {
                    newState.logined = true;
                    newState.user = user;
                } else {
                    newState.logined = false;
                }
                this.setState(newState);
            }
            )
            .catch((err) => {
                alert(err);
            });
    }



}

const styles = StyleSheet.create({
    underlineStyle:{
        backgroundColor:'rgba(255,0,0,0.5)'
    },
    //Common
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: 64,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        backgroundColor: '#ee735c',
        borderColor: 'rgba(255,0,0,0.2)',
        // backgroundColor: '#fff',
    },

});

