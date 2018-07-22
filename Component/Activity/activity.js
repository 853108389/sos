
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    ListView,
    ActivityIndicator,
    RefreshControl,
    View,
    Image,
} from 'react-native';

import Dimensions from 'Dimensions';

import Icon from 'react-native-vector-icons/Ionicons';
import ActivityDetail from './activityDetail';
import Mock from 'mockjs';

import config from '../common/config';
import request from '../common/request';
import Item from './item';
import Title from '../commonView/title'; //标题
import SearchModal from '../commonView/searchModal';
import CommonListView from '../commonView/CommonListView';
import CommonTopButtonBox from '../commonView/CommonTopButtonBox'
import CommonSearchList from '../commonView/CommonSearchList'

const { width, height } = Dimensions.get('window');


//按钮
let items = [
    {
        topButtonText: '最受喜爱',
        iconName: 'ios-heart',
        uri: config.uri.activity + config.activity.conditions,
        dataParams: {
            orderBy: "activity_lovers",
            isDesc: "true",
            pageIndex: "0",
        },
    },
    {
        topButtonText: '最新活动',
        iconName: 'ios-sunny',
        uri: config.uri.activity + config.activity.conditions,
        dataParams: {
            orderBy: "activity_pushTime",
            pageIndex: "0",
            isDesc: "true",
        },
    },
    {
        topButtonText: '评论最多',
        iconName: 'ios-chatboxes',
        uri: config.uri.activity + config.activity.conditions,
        dataParams: {
            orderBy: "comment_num",
            pageIndex: "0",
            isDesc: "true",
        },
    },
]

export default class Activity extends Component {

    static defaultProps = {
    }; //


    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            isLoadingTail: false,
            isRefreshing: false,
            dataUrl: config.uri.activity + config.activity.conditions,
            dataParams: {
                pageIndex: "1",
                isDesc: "true",
                orderBy: "activity_pushTime",
            },
        };
        //显示模态
        this._setModalProps = this._setModalProps.bind(this);
        this._clickCallBack = this._clickCallBack.bind(this);
        this._pushCommonSearchList = this._pushCommonSearchList.bind(this);
    }

    render() {
        let dataUrl = this.state.dataUrl;
        let dataParams = this.state.dataParams;
        return (
            <View style={styles.container}>
                <Title title="活动" rightSearchView={true} rightClick={() => { this._setModalProps() }}></Title>
                <CommonListView ref="list" dataUrl={dataUrl} dataParams={dataParams} renderItemCallback={(rowData) => {
                    return (
                        <Item rowData={rowData}
                            onSelect={(activityId) => this._loadPage(activityId)}
                            key={rowData.activityId}
                        />
                    )
                }}
                    renderHeaderCallback={() => { return (<CommonTopButtonBox items={items} clickCallBack={(uri, dataParams) => { this._clickCallBack(uri, dataParams) }} />) }}
                >
                </CommonListView>
                {/* 搜索模态 */}
                <SearchModal searchField="activity_name" title='搜索' ref='searchModal' searchInfoCallBack={(searchInfo, key, lable) => { this._pushCommonSearchList(searchInfo, key, lable) }}></SearchModal>
            </View>
        );
    }

    _pushCommonSearchList(searchInfo, key, lable) {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'commonSearchList',
                component: CommonSearchList,
                params: {
                    content: lable,
                    dataKey: key,
                    value: searchInfo,
                    searchField: "activity_name",
                    dataUrl: config.uri.activity + config.activity.conditions,
                    searchType: "activity",
                }
            })
        } else {
            alert("searchInfo err")
        }
    }

    _clickCallBack(dataUrl, dataParams) {
        this.refs.list.fetchData(dataParams, dataUrl);
        this.setState({
            dataUrl: dataUrl,
            dataParams: dataParams,
        })
    }

    componentWillMount() {
    }
    componentDidMount() {
    }

    _setModalProps() {
        let a = this.refs.searchModal;
        a._setModalVisible(true);
    }

    _loadPage(activityId) {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'activityDetail',
                component: ActivityDetail,
                params: {
                    activityId: activityId,
                }
            })
        } else {
            alert(111)
        }

    }
}

const styles = StyleSheet.create({
    topButtonBox: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
        marginBottom: 10,
    },

    topButton: {
        alignItems: 'center',
        borderLeftWidth: 1,
        borderLeftColor: '#eee',
        width: width / 3,

    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },

});


