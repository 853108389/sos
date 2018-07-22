/*
    用户信息社团信息顶部图片

*/

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    Image,
    Alert,
    TouchableOpacity,
} from 'react-native';
import config from '../common/config';
import request from '../common/request';
import Icon from 'react-native-vector-icons/Ionicons';
import Avatar from './../commonView/avatar';
import MyStyle from "../common/myStyle"
const { width, height } = Dimensions.get('window');
const imgWidth = width / 4;

export default class AccountImgUpload extends Component {

    static defaultProps = {
        user: null,
        infoButton: false,
        clickCallBack: null,
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            modalUserKey: '',
            modalTitle: '',
            user: this.props.user,
        };

        this._renderAvatarBox = this._renderAvatarBox.bind(this);
        this._renderInfoButton = this._renderInfoButton.bind(this);

        this._clickInfoButton = this._clickInfoButton.bind(this);
    }

    _clickInfoButton() {
        // 判断处理
        if (this.props.clickCallBack == null) {
            return;
        }
        // 执行回调函数
        this.props.clickCallBack();
    }



    _renderInfoButton() {
        if (this.props.infoButton) {
            return (
                <TouchableOpacity onPress={() => { this._clickInfoButton() }}>
                    <View style={styles.buttonBox}>
                        <Icon
                            name='md-create'
                            size={15}
                            style={styles.editIcon} />
                        <Text>我的资料</Text>
                    </View>
                </TouchableOpacity>
            )
        } else {
            return null
        }

    }

    _renderAvatarBox(user) {
        let cell = <Avatar imgUrl={user.userAvatar} avatarStyle={[styles.avatar]} noAvatarStyle={[styles.noAvatar, { backgroundColor: "#eee" }]}></Avatar>
        return cell
    }

    render() {
        let user = this.props.user;
        let cell =
            <View style={{ alignItems: "center", }}>
                {this._renderAvatarBox(user)}
                <View style={styles.nickNameBox}>
                    <Text style={styles.nickNameText}>{user.userNickname}</Text>
                </View>
                {this._renderInfoButton()}
            </View>
        if (user) {
            if (user.userBackimg) {
                return (
                    <View style={styles.avatarContainer}>
                        <Image style={styles.avatarContainer}
                            source={{ uri: user.userBackimg }}
                        >
                            {cell}
                        </Image>
                    </View>
                )
            }
            else {
                return (
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarContainer}>
                            {cell}
                        </View>
                    </View>
                )
            }
        } else {
            return null;

        }
    }
}
const styles = StyleSheet.create({
    nickNameBox: {
        alignItems: "center",
        marginBottom: 5,
    },
    nickNameText: {
        fontSize: 17,
        color: "white",
    },
    editIcon: {

    },
    buttonBox: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        width: 100,
        height: 30,
        borderRadius: 15,
    },
    plusIconBox: {
        justifyContent: 'center',
        alignItems: 'center',
        width: width * 0.2,
        height: width * 0.2,
        borderRadius: width * 0.1,
        borderWidth: 1,
    },
    plusIcon: {
        color: '#ddd',
    },
    avatarContainer: {
        width: width,
        height: 190,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#666',
    },
    avatarText: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center',
        color: '#fff',
        backgroundColor: 'transparent'
    },
    noAvatar:{
        ...MyStyle.account.img.noAvatar
    },
    avatar: {
        ...MyStyle.account.img.avatar
    },
    avatarBox: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5,
    },
});











