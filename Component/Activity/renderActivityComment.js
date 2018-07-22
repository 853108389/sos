/**
  TODO 键盘监听 评论时监听确认;
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TextInput,
    Platform,
    TouchableOpacity,
    ToastAndroid,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import DeviceStorage from "../common/deviceStorage"

import CommonListView from '../commonView/CommonListView';
import ReplyCell from '../commonView/replyCell';
import config from '../common/config';
import request from '../common/request';

export default class RenderActivityComment extends Component {

    static defaultProps = {
        activityId: "",
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            userId: "",
            dataurl: config.uri.comment + config.comment.conditions,
            dataParams: {
                pageIndex: "1",
                isDesc: "true",
                orderBy: "comment_time",
                data: {
                    activityId: this.props.activityId,
                }
            },
        };
        this._submit = this._submit.bind(this);
        this._renderListHeader = this._renderListHeader.bind(this);
        this._asyncGetUser = this._asyncGetUser.bind(this);
    }

    render() {
        let dataurl = this.state.dataurl;
        let dataParams = this.state.dataParams;
        return (
            <CommonListView dataUrl={dataurl} dataParams={dataParams} ref="list1"
                renderItemCallback={(rowData, sectionID, rowID, length) => {
                    // console.log("renderROw", rowData);
                    return (
                        <ReplyCell data={rowData} id={rowID} length={length} key={rowData._id} navigator={this.props.navigator}></ReplyCell>
                    );
                }}
                renderHeaderCallback={() => {
                    return (
                        this._renderListHeader()
                    );
                }}
                renderFooterCallback={() => {
                    return <View style={{ marginTop: 10, marginBottom: 10 }}></View>;
                }}
            />
        );
    }

    _renderListHeader() {
        return (
            <View>
                <View style={styles.commentBox}>
                    <View style={styles.comment}>
                        <TextInput
                            value={this.state.content}
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
                        <TouchableOpacity style={styles.btn} onPress={this._submit}>
                            <Text style={styles.submitComment} >评论</Text>
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.commentArea}>
                    <Text style={styles.commentTitle}>评论列表</Text>
                </View>
            </View>
        )
    }

    _asyncGetUser() {
        DeviceStorage.get('user').then((data) => {
            let userId = data.userId;
            this.setState({
                userId: userId
            })
        })
    }

    componentDidMount() {
        this._asyncGetUser();
    }

    //TODO:提交评论
    _submit() {
        //post comment
        // alert('开始评论了')
        let user = this.state.user;
        if (!this.state.content) {
            ToastAndroid.show('评论内容不能为空', ToastAndroid.SHORT);
            return;
        }

        if (this.state.isSendingComment) {
            // ToastAndroid.show('正在发送评论中...', ToastAndroid.SHORT);
            return;
        }

        //第一次发生评论
        this.setState({
            isSendingComment: true
        }, () => {
            let body = {
                userId: this.state.userId,
                activityId: this.props.activityId,
                commentContent: this.state.content,
            }
            let url = config.uri.comment + config.comment.add;
            request.post(url, body)
                .then((data) => {
                    this.setState({
                        isSendingComment: false,
                        content: "",
                    }, () => {
                        this.refs.list1._onRefresh();
                    });
                    console.log("data", data)
                }).catch((err) => {
                    this.setState({
                        isSendingComment: false,

                    });
                    alert(err);
                });
        });
    }

}
const styles = StyleSheet.create({
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

});








