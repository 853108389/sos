
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    ActivityIndicator,
    TouchableOpacity,
    TextInput,
    ListView,
    Modal,
    Image,
    View,
    AsyncStorage,
} from 'react-native';

import VideoPlayerAndroid from './videoPlayerAndroid';
import VideoPlayerIos from './videoPlayerIOS';

import Button from 'react-native-button';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../common/config';
import request from '../common/request';

import Title from '../commonView/title';
import ReplyCell from '../commonView/replyCell';
import RenderActivityInfo from './renderActivityInfo'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import CommonListView from '../commonView/CommonListView';


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
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
            isLoadingTail: false,
            content: '',
            isSendingComment: false,
            user: null,
            info: {},
        }

        this._renderRow = this._renderRow.bind(this);
        //数据
        this._fetchMoreData = this._fetchMoreData.bind(this);
        this._fetchData = this._fetchData.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        //获取用户信息
        this._asyncGetAppStatus = this._asyncGetAppStatus.bind(this);
        this._submit = this._submit.bind(this);

    }

    render() {
        let user = this.state.user;
        return (
            <View style={{ flex: 1 }}>
                <Title title='活动详情' leftView={true} navigator={this.props.navigator}></Title>
                <ScrollableTabView
                    renderTabBar={() => <DefaultTabBar />}
                    tabBarPosition='top'
                >

                    <RenderActivityInfo tabLabel='详情' user={user} info={this.state.info} activityId={this.props.activityId}></RenderActivityInfo>
                    <ListView
                        tabLabel='评论'
                        dataSource={this.state.dataSource}
                        renderRow={this._renderRow}
                        onEndReached={this._fetchMoreData}
                        onEndReachedThreshold={20}
                        renderFooter={this._renderFooter}
                        renderHeader={this._renderHeader}
                        enableEmptySections={true}
                        automaticallyAdjustContentInsets={false}
                        showsVerticalScrollIndicator={false}
                    />
                </ScrollableTabView>
            </View>

        )
    }

    componentDidMount() {
        this._fetchData(1);//从服务器获取的真实数据
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


    _renderFooter() {
        if (!this._hasMore() && cachedResults.total !== 0) {
            return (<View style={styles.loadingMore}>
                <Text style={styles.loadingText}>已经是最后一条啦...</Text>
            </View>);
        }

        if (!this.state.isLoadingTail) {
            return <View style={styles.loadingMore} />
        }

        return (

            <ActivityIndicator
                style={styles.loadingMore}
            />

        );
    }

    _renderHeader() {
        return (
            <View>
                <View style={styles.commentBox}>
                    <View style={styles.comment}>
                        <TextInput
                            placeholder='过来评论一下吧'
                            underlineColorAndroid='transparent'
                            keyboardType='default'
                            style={styles.content}
                            multiline={true}
                            onChangeText={(text) => {
                                this.setState({
                                    content: text
                                });
                            }}
                        />
                    </View>
                    {Platform.OS === 'ios' ? null :
                        <View style={styles.btn}>
                            <Text style={styles.submitComment} onPress={this._submit}>评论</Text>
                        </View>
                    }
                </View>
                <View style={styles.commentArea}>
                    <Text style={styles.commentTitle}>精彩评论</Text>
                </View>

            </View>
        )

    }

    //提交评论
    _submit() {
        //post comment
        // alert('开始评论了')
        let user = this.state.user;
        if (!this.state.content) {
            return alert('评论内容不能为空');
        }

        if (this.state.isSendingComment) {
            return alert('正在发送评论');
        }

        //第一次发生评论

        this.setState({
            isSendingComment: true
        }, () => {
            let body = {
                accessToken: 'wewefeo',
                id_video: '12333',
                content: this.state.content,
            }
            let url = config.api.base + config.api.comment;
            request.post(url, body)
                .then(
                (data) => {
                    if (data && data.success) {
                        let itmes = cachedResults.items.slice();
                        itmes = [{
                            content: this.state.content,
                            replyBy: {
                                nickname: user.nickname,
                                avatar: 'http://dummyimage.com/640x640/967776)'
                            }
                        }].concat(itmes);

                        cachedResults.items = itmes;
                        cachedResults.total = cachedResults.total + 1;
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(cachedResults.items),
                            isSendingComment: false,
                            content: ''
                        });

                    }
                }
                ).catch((err) => {
                    console.log(err);
                    this.setState({
                        isSendingComment: false,
                    });
                    alert('评论失败，请稍后重试');
                });

        });

    }

    //加载更多的数据 上拉加载更多  滑动分页
    _fetchMoreData() {

        if (!this._hasMore() || this.state.isLoadingTail) {
            return
        }
        //去服务器请求加载更多的数据了
        let page = cachedResults.nextPage;
        this._fetchData(page)
    }

    _fetchData(page) {

        let info = {};
        this.setState({
            isLoadingTail: true
        });


        console.log('封装后的异步请求网络get');

        request.get(config.api.base + config.api.comments, {
            accessToken: 'jjjj',
            id: '2333399',
            page: page
        }).then(
            (data) => {
                if (data.success) {
                    //把服务器得到的数据存到缓存里面
                    let items = cachedResults.items.slice();
                    items = items.concat(data.data);
                    cachedResults.nextPage += 1;
                    cachedResults.items = items;
                    cachedResults.total = data.total;
                    info.total = data.total;
                    console.log('总个数据的长度是：' + cachedResults.total);
                    console.log('当前的listview数据的总长度是：' + cachedResults.items.length);
                    setTimeout(() => {
                        this.setState({
                            dataSource: this.state.dataSource.cloneWithRows(
                                cachedResults.items
                            ),
                            isLoadingTail: false,
                            info: info,
                        });


                    }, 200);
                }

            }
            ).catch(
            (err) => {

                this.setState({
                    isLoadingTail: false
                });


                console.log('err' + err);
            }
            )
    }


    _hasMore() {
        return cachedResults.items.length !== cachedResults.total
    }

    _renderRow(rowData_reply) {
        return (
            <ReplyCell data={rowData_reply}></ReplyCell>
        );
    }

}

const styles = StyleSheet.create({
    //Common
    commentBox: {
        marginTop: 6,
        padding: 8,
        width: width,
        flexDirection: 'row',
    },
    comment: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        flex: 1,
    },
    content: {
        paddingLeft: 4,
        color: '#333',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 4,
        fontSize: 14,
        height: 40,
    },
    btn: {
        width: 45,
        backgroundColor: '#ee730c',
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 4,
        marginLeft: 5,

    },
    submitComment: {

        fontSize: 14,
        fontWeight: 'bold',

    },
    commentArea: {
        width: width,
        paddingBottom: 6,
        paddingLeft: 10,
        paddingRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    commentTitle: {
        color: 'red',
    },


    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },

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

    headerTitle: {
        textAlign: 'center',
        width: width - 120,
        fontSize: 18,
        color: '#fff'
    },

    loadingMore: {
        marginVertical: 10
    },

    loadingText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center'
    },


});

