/**
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
    AsyncStorage,
    ScrollView,
    RefreshControl,
} from 'react-native';
import myStyle from "../common/myStyle"
const { width, height } = Dimensions.get('window');
export default class RenderActivityContent extends Component {

    static defaultProps = {
        data: null,
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            data: null,
            isRefreshing: false,
            renderScrollView: false,
            isEdit: this.props.isEdit,
        };
        //render
        this._rendercontentCommonList = this._rendercontentCommonList.bind(this);
        this._rendercontentInfo = this._rendercontentInfo.bind(this);
        this._renderContentCommonListBox = this._renderContentCommonListBox.bind(this);
        this._renderView = this._renderView.bind(this);
        //fetch
        // this._fetchData = this._fetchData.bind(this);
        //asyn
        this._asyncGetActivityEditInfo = this._asyncGetActivityEditInfo.bind(this);
    }

    //下拉刷新的回调   从服务器获取最新的数据
    _onRefresh = () => {
        if (this.state.isRefreshing) {
            return
        }
        //去服务器获取数据l
        //page 相当于数据的页码
        this._asyncGetActivityEditInfo(true)
    }


    render() {
        let data = this.state.data;
        // alert(JSON.stringify(data))
        if (data == null) {
            //TODO加载中
            return <View></View>
        }
        if (this.props.renderScrollView) {
            return (
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                        />
                    }
                >
                    {this._renderView(data)}
                </ScrollView>
            )
        } else {
            return (
                this._renderView(data)
            )
        }
    }

    _renderView(data) {
        let {
            activityInfo: activityInfoArr,
            activityWay: activityWayArr,
            activityRequire: activityRequireArr,
            memo: memoArr,
            activityImg: activityImgArr,
            connectWay: connectWayArr,
        } = data;
        let image = null;
        // console.log("#",data)
        if (this.state.isEdit) {
            let tempArr = [];
            activityImgArr.forEach((imageObj, i) => {
                tempArr.push(imageObj.uri);
            })
            activityImgArr = tempArr;
            if (JSON.stringify(this.state.data.activityBackimg) == {} || this.state.data.activityBackimg.uri == "undefined") {
                image = <View style={styles.imgBox} >
                    <Image style={styles.imageStyle} />
                </View>
            } else {
                image = <View style={styles.imgBox} >
                    <Image style={styles.imageStyle} source={{ uri: this.state.data.activityBackimg.uri }} />
                </View>
            }
        }
        return (
            <View>
                {image}
                <View style={styles.contentBox} >
                    {this._rendercontentInfo(activityInfoArr)}
                    {this._renderContentCommonListBox("活动方式", activityWayArr)}
                    {this._renderContentCommonListBox("活动要求", activityRequireArr)}
                    {this._renderContentCommonListBox("联系方式", connectWayArr)}
                    {this._renderContentCommonListBox("备注", memoArr)}
                    {this._rendercontentCommonImgtBox("附图", activityImgArr)}
                </View>
            </View>

        )
    }

    componentDidMount() {
        //判断是否有外部数据传入
        //一种用于展示,一种用于编辑预览
        if (!this.state.isEdit) {
            //展示
        } else {
            //编辑预览
            this._asyncGetActivityEditInfo();
        }
    }

    setData = (data) => {
        this.setState({
            data: data
        });
    }

    _asyncGetActivityEditInfo(refreshflag = false) {
        if (refreshflag) {
            this.setState({
                isRefreshing: true
            });
        }
        AsyncStorage.getItem('activityEditInfo')
            .then((data) => {
                if (data) {
                    activityEditInfo = JSON.parse(data);
                }
                this.setState({
                    data: activityEditInfo,
                }, () => {
                    this.setState({
                        isRefreshing: false
                    });
                });
            })
            .catch((err) => {
                alert(err);
            });
    }


    //包含标题, 除去一个lable对应多条数据情况下渲染
    _rendercontentInfo(dataArr) {
        let cellArr = [];
        let cell2 = null;
        for (let { lable, dataValue, dataKey, id } of dataArr) {
            if (dataKey == "activityName") {
                cell2 =
                    <View style={styles.contentTitleBox} key={id}>
                        <Text style={styles.contentTitleText} selectable={true}>{dataValue}</Text>
                    </View>
                continue;
            }
            else {
                let cell =
                    <View style={styles.contentCommonBox} key={id}>
                        <Text style={styles.contentLable} selectable={true}>{lable} :</Text>
                        <Text style={styles.contentCommonText} selectable={true}>{dataValue}</Text>
                    </View>
                cellArr.push(cell);
            }
        }
        cellArr.unshift(cell2);
        return cellArr;
    }

    //在一个lable对应多条数据情况下,渲染每个lable及其对应的多条数据的boxView
    _renderContentCommonListBox(lable, dataArr) {
        if (dataArr.length == 1 && dataArr[0].dataValue == "") {
            return;
        }
        return (
            <View style={styles.contentCommonBox} >
                <Text style={styles.contentLable} selectable={true}>{lable} :</Text>
                {this._rendercontentCommonList(dataArr)}
            </View>
        )
    }

    //最下部分图片box
    _rendercontentCommonImgtBox(lable, dataArr) {
        if (dataArr.length == 0 || dataArr.toString() == "") {
            return;
        }
        return (
            <View style={styles.contentCommonBox}>
                <Text style={styles.contentLable} selectable={true} >{lable} :</Text>
                <View style={styles.contentCommonImageBox} >
                    {this._rendercontentCommonImg(dataArr)}
                </View>
            </View>
        )
    }

    //在一个lable对应多条数据情况下,渲染每一条数据
    _rendercontentCommonList(dataArr) {
        if (dataArr == null || dataArr.length == 0) {
            return;
        }
        if (dataArr.length == 1) {
            return (
                <View style={styles.contentCommonBox}>
                    <Text style={styles.contentCommonList} selectable={true}>
                        {dataArr[0].dataValue}
                    </Text>
                </View>
            )
        } else {
            let cellArr = [];
            dataArr.forEach((dataObj, i) => {
                let dataValue = dataObj.dataValue;
                var cell =
                    <View style={styles.contentCommonBox} key={i}>
                        <Text style={styles.contentCommonList} selectable={true}>
                            {i + 1 + ". " + dataValue}
                        </Text>
                    </View>
                cellArr.push(cell);
            })
            return cellArr;
        }
    }

    //渲染每张图片
    //TODO 图片长按保存
    _rendercontentCommonImg(dataArr) {
        let cellArr = [];
        dataArr.forEach((uri, i) => {
            var cell =
                <Image style={styles.contentCommonImage} source={{ uri: uri }} key={i} resizeMode='cover' />
            cellArr.push(cell);
        })
        return cellArr;
    }
}
const styles = StyleSheet.create({
    ...myStyle.activity.img,
    contentCommonImageBox: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    contentCommonImage: {
        width: (width - 100) / 2,
        height: (width - 100) / 2,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    contentCommonList: {
        marginLeft: 10,
    },
    contentCommonText: {
        marginLeft: 10,
    },
    contentCommonBox: {
        marginBottom: 5,
        marginTop: 5,
        marginLeft: 5,
    },
    contentLable: {
        color: 'black',
        fontWeight: 'bold',

    },
    contentTimeBox: {
        flexDirection: 'row'
    },
    contentTimeText: {

    },
    contentTitleBox: {
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    contentTitleText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    //详情
    contentBox: {
        marginTop: 10,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
    },
});








