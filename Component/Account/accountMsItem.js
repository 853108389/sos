import React, { Component } from 'react'
import { Text, View, Dimensions, StyleSheet, Image, TouchableOpacity } from 'react-native'
import config from '../common/config';
import request from "../common/request";
import Avatar from './../commonView/avatar';
const { width, height } = Dimensions.get('window');
export default class AccountMsItem extends Component {

    static defaultProps = {
        rowData: null,
        onSelect: null,
        onLongPress: null,
        readed: false,
    }; //

    constructor(props) {
        super(props)
        this._onSelectCallBack = this._onSelectCallBack.bind(this);
        this._onLongPressCallBack = this._onLongPressCallBack.bind(this);
        this._fetchReaded = this._fetchReaded.bind(this);
        this.state = {
            messagesNum: 0
        }
    }

    _onLongPressCallBack(messagesId) {
        if (this.props.onLongPress == null) {
            return;
        } else {
            this.props.onLongPress(messagesId);
        }
    }

    _onSelectCallBack(message, messagesType, messagesId, messagesFromid, messagesTitle, messagesToid) {
        if (!this.state.readed) {
            this._fetchReaded(messagesId);
        } else {
            this.setState({
                readed: true,
            })
        }

        if (this.props.onSelect == null) {
            return;
        } else {
            this.props.onSelect(message, messagesType, messagesId, messagesFromid, messagesTitle, messagesToid);
        }
    }

    _fetchReaded(messagesId) {
        let url = config.uri.user + config.user.readMs;
        request.post(url, { messagesId: messagesId, messagesNum: 0 }).then((data) => {
            this.setState({
                messagesNum: 0,
            })
        })
    }

    componentDidMount() {
        if (this.props.rowData.messagesNum == 0) {
            this.setState({
                messagesNum: this.props.rowData.messagesNum,
                readed: true,
            })
        } else {
            this.setState({
                messagesNum: this.props.rowData.messagesNum,
                readed: false,
            })
        }

    }
    render() {
        let rowData = this.props.rowData;
        let imageUri = rowData.messagesFromAvatar;
        let title = rowData.messagesTitle;
        let date = rowData.messagesDate;
        let message = rowData.messagesContent;
        let type = rowData.messagesFromtype;
        let messagesId = rowData.messagesId;
        return (
            <View>
                <TouchableOpacity delayLongPress={1500} onLongPress={() => { this._onLongPressCallBack(messagesId) }} onPress={() => { this._onSelectCallBack(message, rowData.messagesType, messagesId, rowData.messagesFromid, title, rowData.messagesToid) }}>
                    <View style={styles.block}>
                        <View style={styles.innerBlock}>
                            <View style={styles.avatarBox}>
                                <Avatar imgUrl={imageUri} avatarStyle={[styles.avatar]} noAvatarStyle={[styles.avatar, { backgroundColor: "#eee" }]}></Avatar>
                            </View>
                            <View style={styles.textBox}>
                                <View style={styles.textBoxTop}>
                                    <Text>
                                        <Text style={styles.textTopTitle}>{title}</Text>
                                        <Text style={styles.textTopType}> [{type}]</Text>
                                    </Text>
                                    <Text style={styles.textTopDate}>{date}</Text>
                                </View>
                                <View style={styles.textBoxBottom}>
                                    <Text numberOfLines={1} style={styles.textBottomCommet} >{message}</Text>
                                    {this.state.messagesNum != 0 ? <View style={styles.infoBox}>
                                        <Text style={styles.infoText} >{this.state.messagesNum}</Text>
                                    </View> : null}
                                </View>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

        )
    }
}

const styles = StyleSheet.create({
    textTopType: { color: "#eee", fontSize: 11 },
    infoText: { color: "white", fontSize: 12, },
    infoBox: { borderRadius: 10, width: 15, height: 15, backgroundColor: "red", alignItems: "center", justifyContent: "center" },
    textBottomCommet: { width: width - 130, color: "#999", fontSize: 13 },
    textTopDate: { fontSize: 12 },
    textTopTitle: { color: "white", fontSize: 15, },
    textBoxBottom: { flexDirection: "row", justifyContent: "space-between" },
    textBoxTop: { flexDirection: "row", justifyContent: "space-between" },
    avatar: {
        marginLeft: 5,
        marginRight: 5,
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    avatarBox: {
        width: 70,
        justifyContent: "center",
        alignItems: "center",
    },
    textBox: {
        marginLeft: 10,
        marginRight: 10,
        justifyContent: "space-around",
        flex: 1,
    },
    innerBlock: {
        marginHorizontal: 5,
        marginVertical: 5,
        flex: 1,
        flexDirection: "row"
    },

    block: {
        backgroundColor: "#8666",
        height: 80,
        width: width,
        borderBottomColor: "#bbb",
        borderBottomWidth: 1,
    },
})