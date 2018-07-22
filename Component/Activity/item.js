/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    Image,
    Text,
    View
} from 'react-native';

import Dimensions from 'Dimensions';

import Icon from 'react-native-vector-icons/Ionicons';
import config from '../common/config';
import request from '../common/request';

const { width, height } = Dimensions.get('window');

export default class Item extends Component {

    static defaultProps = {
        onSelect: null,
    }; //

    constructor(props) {
        super(props);
        this.state = {
        }
        this._rendercontentInfo = this._rendercontentInfo.bind(this);
        this._renderImageCell = this._renderImageCell.bind(this);
        //click
        this._clickCell = this._clickCell.bind(this);
    }


    render() {
        return (
            <TouchableHighlight onPress={() => { this._clickCell(this.props.rowData.activityId) }}>
                <View style={styles.item}>
                    {this._rendercontentInfo()}
                    {this._renderImageCell()}
                </View>

            </TouchableHighlight>
        );
    }

    _clickCell(activityId) {
        if (this.props.onSelect == null) {
            return
        } else {
            this.props.onSelect(activityId);
        }
    }
    _renderImageCell() {
        let rowData = this.props.rowData
        let imgCell = null;
        let cell1 =
            <View style={styles.imageRightBox}>
                <Text style={styles.rightText}>{rowData.activityPushtime}</Text>
            </View>
        let cell2 =
            <View style={styles.imageLeftBox}>
                <View style={styles.iconTextBox}>
                    <Icon
                        name='ios-heart'
                        size={28}
                        style={styles.commentIcon} />
                    <Text style={styles.handleText}>{rowData.activityLovers}</Text>
                </View>
                <View style={[styles.iconTextBox, { marginLeft: 10, }]}>
                    <Icon
                        name='ios-chatbubbles'
                        size={28}
                        style={[styles.commentIcon, { color: "#aaa" }]} />
                    <Text style={styles.handleText} >{rowData.commentNum}</Text>
                </View>
            </View>
        if (rowData.activityBackimg == null || rowData.activityBackimg == "") {
            imgCell =
                <View style={[styles.noimage, { backgroundColor: '#eee' }]}>
                    {cell1}
                    {cell2}
                </View>
        } else {
            imgCell =
                <Image source={{ uri: rowData.activityBackimg }} style={styles.thumb} >
                    {cell1}
                    {cell2}
                </Image>
        }
        return imgCell;
    }


    _rendercontentInfo() {
        let rowData = this.props.rowData;
        return (
            <View>
                <View style={styles.infoBox}>
                    <View style={styles.imgBox}>
                        {
                            rowData.teamAvatar != '' ? <Image
                                style={styles.avatar}
                                source={{ uri: rowData.teamAvatar }}
                            ></Image> : <View style={styles.noAvatar}></View>
                        }
                    </View>
                    <View style={styles.contentCommonBox2}>
                        <Text style={styles.contentLable} selectable={true}>{rowData.activityName}</Text>
                        <Text style={styles.contentCommonText}>{rowData.activityTitle}</Text>
                    </View>
                </View>
            </View>
        )

    }
}

const styles = StyleSheet.create({
    contentLable: {
        color: 'black',
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 16,
    },
    contentCommonText: {
        marginLeft: 10,
    },
    rightText: {
        color: 'green', textAlign: 'center',
    },
    handleText: {
        color: 'rgba(255,0,0,0.6)', textAlign: 'center', marginLeft: 5,
    },
    imageRightBox: {
        padding: 10, position: "absolute", bottom: 0, right: 0, height: width * 0.11,
    },
    imageLeftBox: {
        padding: 10, position: "absolute", bottom: 0, left: 0, flexDirection: "row", height: width * 0.11,
    },
    iconTextBox: {
        flexDirection: "row",
    },
    infoBox: {
        marginTop: 10,
        flexDirection: "row",
        marginLeft: 10,
    },
    imgBox: {
    },
    contentCommonBox2: {
        marginTop: 5,
        marginBottom: 5,
        flexWrap: 'wrap',
        marginRight: 80,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginTop: 10,
        marginBottom: 10,
        resizeMode: 'cover'
    },
    noAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "#eee"
    },
    item: {
        width: width,
        paddingBottom: 10,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderColor: 'rgba(255,0,0,0.3)'
    },

    title: {
        fontSize: 18,
        padding: 10,
        color: '#333'
    },

    thumb: {
        width: width,
        height: width * 0.56,
        resizeMode: 'cover'
    },

    noimage: {
        width: width,
        height: width * 0.56,
    },

    itemFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#eee'
    },

    commentIcon: {
        fontSize: 22,
        color: 'rgba(255,0,0,0.6)'
    },


});

