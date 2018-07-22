import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    Platform,
    ListView,
    ActivityIndicator,
    RefreshControl,
    View,
    TouchableOpacity,
    Image,
    ToastAndroid,
} from 'react-native';
import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import Mock from 'mockjs';
import request from '../common/request';
import Title from '../commonView/title'; //标题
import TeamItem from '../Team/teamItem'

const { width, height } = Dimensions.get('window');


export default class CommonListView extends Component {

    static defaultProps = {
        dataUrl: '',
        dataParams: {},
        renderItemCallback: null,
        renderHeaderCallback: null,
        renderFooterCallback: null,
        style: {},
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => {
                    return r1 !== r2;
                }
            }),
            isLoadingTail: false,
            isRefreshing: false,
            cachedResults: {
                nextPage: 1,
                items: [],
                total: 0,
                hasNext: false,
                hasPre: false,
                pageNum: 0,
            } //
        };
        //render
        this._renderRow = this._renderRow.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
        this._renderFooter = this._renderFooter.bind(this);
        //fun
        this._clearCachedResults = this._clearCachedResults.bind(this);
        //fetch
        this.fetchData = this.fetchData.bind(this);
        this._fetchRefresh = this._fetchRefresh.bind(this); //刷新
        this._fetchLoading = this._fetchLoading.bind(this);
        this._fetchData = this._fetchData.bind(this);
        this.fetchData = this.fetchData.bind(this);

        this._hasMore = this._hasMore.bind(this); //刷新
        this._hasNew = this._hasNew.bind(this); //刷新

    }

    fetchData(dataParams, dataUrl = this.props.dataUrl) {
        // console.log("fetch......")
        this._clearCachedResults();
        this._fetchData(dataParams, dataUrl);
    }

    _clearCachedResults() {
        let cachedResults = {
            nextPage: 1,
            items: [],
            total: 0,
            hasNext: false,
            hasPre: false,
            pageNum: 0,
        } //
        // this.state.cachedResults = cachedResults\
        return cachedResults;
        console.log("清空后:", JSON.stringify(this.state.cachedResults));
    }

    render() {
        // console.log("listVIew.render()")
        return (
            <View style={styles.container}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    enableEmptySections={true}
                    automaticallyAdjustContentInsets={false}
                    removeClippedSubviews={false}
                    onEndReached={this._fetchMoreData}
                    onEndReachedThreshold={20}
                    renderFooter={this._renderFooter}
                    renderHeader={this._renderHeader}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                    style={styles.listView,{...this.props.style}}
                />
            </View>
        );
    }

    componentWillMount() {
    }

    componentDidMount() {
        this._fetchData(this.props.dataParams, this.props.dataUrl);//从服务器获取的真实数据
    }

    _fetchRefresh(dataParams, dataUrl) {
        this.setState({
            isRefreshing: true
        });
        request.post(dataUrl, {
            ...dataParams,
            pageIndex: 1,
        }).then((data) => {
            if (data.success) {
                cachedResults = this._clearCachedResults();
                console.log('清空后数据：', cachedResults);
                console.log('清空后数据：', data);
                cachedResults.nextPage = data.pageIndex + 1;
                cachedResults.items = data.data;
                cachedResults.total = data.total;
                cachedResults.pageNum = data.pageNum;
                cachedResults.hasNext = data.hasNext;
                cachedResults.hasPre = data.hasPre;
                console.log('总个数据：', cachedResults);
                // console.log('当前的listview数据的总长度是：' + cachedResults.items.length);
                this.setState({
                    dataSource: this.state.dataSource.cloneWithRows(
                        cachedResults.items
                    ),
                    isRefreshing: false,
                    cachedResults: cachedResults,
                }, () => {
                    console.log("dataSource", this.state.dataSource)
                    console.log("cachedResults", this.state.cachedResults)
                });
                return;
            } else {
                ToastAndroid.show(data.message, ToastAndroid.SHORT);
                return;
            }
        }).catch((err) => {
            this.setState({
                isRefreshing: false
            });
            console.log('err' + err);
        })
    }

    _fetchLoading(dataParams, dataUrl) {
        // console.log("_fetchLoading: ", dataParams)
        let cachedResults = this.state.cachedResults;
        this.setState({
            isLoadingTail: true
        });
        request.post(dataUrl, {
            ...dataParams,
        }).then(
            (data) => {
                if (data.success) {
                    // console.log(data)
                    //把服务器得到的数据存到缓存里面
                    let items = cachedResults.items.slice();
                    items = items.concat(data.data);
                    cachedResults.nextPage = data.pageIndex + 1;
                    cachedResults.items = items;
                    cachedResults.total = data.total;
                    cachedResults.pageNum = data.pageNum;
                    cachedResults.hasNext = data.hasNext;
                    cachedResults.hasPre = data.hasPre;
                    // console.log('总个数据的长度是：' + cachedResults.total);
                    // console.log('当前的listview数据的总长度是：' + cachedResults.items.length);
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(
                            cachedResults.items
                        ),
                        isLoadingTail: false,
                        cachedResults: cachedResults,
                    }/* , () => {
                        console.log("dataSource", this.state.dataSource)
                        console.log("cachedResults", this.state.cachedResults)
                    } */);
                } else {
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                    return;
                }
            }).catch((err) => {
                this.setState({
                    isLoadingTail: false
                });
                // ToastAndroid.show("出了点小问题...", ToastAndroid.SHORT);
                console.log('err' + err);
            })
    }

    //http://rap.taobao.org/mockjs/7756/api/list?accessToken=ssss
    _fetchData(dataParams, dataUrl = this.props.dataUrl) {
        if (typeof (dataParams) == "undefined") {
            return;
        }
        if (!dataParams.hasOwnProperty("pageIndex") || dataParams.pageIndex === "undefined" || dataParams.pageIndex == null || dataParams.pageIndex === "") {
            let newParams = {
                ...dataParams,
                pageIndex: 1,
            }
            this._fetchLoading(newParams, dataUrl);
        } else {
            console.log("newParams:", dataParams)
            if (dataParams.pageIndex == 0) {
                this._fetchRefresh(dataParams, dataUrl);
            } else {
                this._fetchLoading(dataParams, dataUrl);
            }
        }

    }

    //打底数据
    dsfetchData() {

    }

    //加载更多的数据 上拉加载更多  滑动分页
    _fetchMoreData = () => {
        if (!this._hasMore() || this.state.isLoadingTail) {
            return
        }
        //去服务器请求加载更多的数据了
        let page = this.state.cachedResults.nextPage;
        let dataParams = this.props.dataParams;
        let newParams = {
            ...dataParams,
            pageIndex: page,
        }
        this._fetchData(newParams)
    }

    //下拉刷新的回调   从服务器获取最新的数据
    _onRefresh = () => {
        if (!this._hasNew() || this.state.isRefreshing) {
            return
        }
        //去服务器获取数据l
        //page 相当于数据的页码
        let dataParams = this.props.dataParams;
        let newParams = {
            ...dataParams,
            pageIndex: 0,
        }
        this._fetchData(newParams)
    }

    _renderFooter() {
        if (this.props.renderFooterCallback == null) {
            if (!this._hasMore() && this.state.cachedResults.total !== 0) {
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
        } else {
            return this.props.renderFooterCallback();

        }
    }

    _hasNew() {
        return true;
    }

    _hasMore() {
        let cachedResults = this.state.cachedResults;
        return this.state.cachedResults.hasNext;
        // return true;
    }

    _renderRow(rowData, sectionID, rowID) {
        // console.log("renderROw", rowData);
        let length = this.state.cachedResults.total;
        // 判断处理
        if (this.props.renderItemCallback == null || rowData == null) {
            return null;
        }
        // 执行回调函数
        return (
            this.props.renderItemCallback(rowData, sectionID, rowID, length)
        );
    }

    _renderHeader() {
        if (this.props.renderHeaderCallback == null) {
            return null;
        }
        // 执行回调函数
        return (
            this.props.renderHeaderCallback(this.state.cachedResults.total)
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    listView: {
        backgroundColor: 'white',
    },

    loadingMore: {
        marginVertical: 10,
        justifyContent: "center",
        alignItems: "center",
    },

    loadingText: {
        fontSize: 16,
        color: 'red',
        textAlign: 'center',
    },
});


