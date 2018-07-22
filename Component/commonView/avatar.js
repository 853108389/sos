/**
 */

import React, { Component } from 'react'
import { View, Image, Dimensions } from 'react-native'
const { width, height } = Dimensions.get('window');
import MyStyle from "../common/myStyle"
export default class Avatar extends Component {

    static defaultProps = {
        imgUrl: '',
        avatarStyle: {
            ...MyStyle.account.img.avatar
        },
        noAvatarStyle: {
            ...MyStyle.account.img.noAvatar
        },
        renderNoAvatar: null
    }; //

    render() {
        return <View>
            {this._renderImage()}
        </View>
    }

    _renderImage = () => {
        let imgUrl = this.props.imgUrl;
        if (imgUrl != null && imgUrl != "") {
            imgCell = <Image
                style={this.props.avatarStyle}
                source={{ uri: imgUrl }}
            />;
        } else {
            imgCell = <View style={this.props.noAvatarStyle}></View>
        }
        return imgCell;
    }
}