/**
 * 回复,评论的Cell
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';

import AccountShow from '../Account/accountShow';
const { width, height } = Dimensions.get('window');
export default class ReplyCell extends Component {

    static defaultProps = {
        id: "",
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
        };
        this._pushAccountShow = this._pushAccountShow.bind(this);
    }

    _pushAccountShow(userId) {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'accountShow',
                component: AccountShow,
                params: {
                    userId: userId,
                }
            })
        } else {
            alert(111)
        }
    }

    render() {
        // alert(JSON.stringify( this.state.data))
        let rowData_reply = this.props.data;
        let imgCell = null;
        if (rowData_reply.userAvatar == null || rowData_reply.userAvatar == "") {
            imgCell =
                <View
                    style={styles.noReplyAvatar}
                ></View>
        } else {
            imgCell =
                <TouchableOpacity onPress={() => this._pushAccountShow(rowData_reply.userId)}>
                    <Image
                        style={styles.replyAvatar}
                        source={{ uri: rowData_reply.userAvatar }}
                    ></Image>
                </TouchableOpacity>
        }

        return (
            <View
                style={styles.replyBox}
            >
                {imgCell}
                <View style={styles.reply}>
                    <Text style={styles.replyNickname} selectable={true}>{rowData_reply.userNickname}</Text>
                    <View style={styles.timeBox}>
                        <Text style={[styles.timeText, { marginRight: 5 }]}>#{this.props.length - this.props.id}</Text>
                        <Text style={styles.timeText}>{rowData_reply.commentTime}</Text>
                    </View>
                    <Text style={styles.replyContent} selectable={true}>{rowData_reply.commentContent}</Text>
                    {/* <Text style={{ textAlign: "right" }}></Text> */}
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    timeText: {
        color: '#bbb'
    },
    timeBox: {
        flexDirection: 'row',
        marginTop: 5,
    },
    replyBox: {
        flexDirection: 'row',
        width: width,
        justifyContent: 'flex-start',
        marginTop: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
        paddingBottom: 5,
    },
    replyAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        marginLeft: 10,
    },
    noReplyAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
        marginLeft: 10,
        backgroundColor: '#eee',
    },

    reply: {
        flex: 1,
    },

    replyNickname: {
        color: '#666'
    },

    replyContent: {
        marginTop: 5,
        color: 'black',
        marginRight: 5,
        marginBottom: 5,
    },
});







