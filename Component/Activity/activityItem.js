/*
    ListItem
*/
import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    Image,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../common/config';
import request from '../common/request';


const { width, height } = Dimensions.get('window');

export default class activityItem extends Component {

    static defaultProps = {
        onSelect: null,
    }; //
    constructor(props) {
        super(props);

        this._renderImage = this._renderImage.bind(this);
        this._clickCell = this._clickCell.bind(this);
    }

    _renderImage(rowData) {
        if (rowData) {
            return
        }
        return cell
    }

    _clickCell(activityId) {
        if (this.props.onSelect == null) {
            return;
        }
        this.props.onSelect(activityId)
    }
    render() {
        let rowData = this.props.rowData
        // console.log(rowData)
        if (rowData.activityBackimg) {
            cell =
                <Image source={{ uri: rowData.activityBackimg }} style={styles.imageViewStyle} />
        } else {
            cell =
                <View style={styles.noImageViewStyle}></View>
        }
        return (
            <TouchableOpacity onPress={() => { this._clickCell(rowData.activityId) }}>
                <View style={styles.listViewStyle}>
                    {/*左边*/}
                    {this._renderImage(rowData)}
                    {cell}
                    {/*右边*/}
                    <View style={styles.rightViewStyle}>
                        <View style={styles.rightTopViewStyle}>
                            <Text >{rowData.activityName}</Text>
                        </View>
                        <Text style={{ color: 'gray' }}>简介: {rowData.activityTitle}</Text>
                        <View style={styles.rightBottomViewStyle}>
                            <View style={{ flexDirection: "row" }}>
                                <View style={styles.iconTextBox}>
                                    <Icon
                                        name='ios-heart'
                                        size={28}
                                        style={styles.commentIcon} />
                                    <Text style={styles.handleText}>{rowData.activityLovers}</Text>
                                </View>
                                <View style={[styles.iconTextBox, { marginLeft: 5 }]}>
                                    <Icon
                                        name='ios-chatbubbles'
                                        size={28}
                                        style={[styles.commentIcon, { color: "#aaa" }]} />
                                    <Text style={styles.handleText} >{rowData.commentNum}</Text>
                                </View>
                            </View>
                            <Text >{rowData.activityPushtime}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    iconTextBox: {
        flexDirection: "row",
    },
    commentIcon: {
        fontSize: 18,
        color: 'rgba(255,0,0,0.5)'
    },
    handleText: {
        color: 'rgba(255,0,0,0.6)', textAlign: 'center', marginLeft: 3,
    },
    listViewStyle: {
        backgroundColor: 'white',
        padding: 10,
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 0.5,
        flexDirection: 'row'
    },
    noImageViewStyle: {
        width: 120,
        height: 90
    },
    imageViewStyle: {
        width: 120,
        height: 90
    },

    rightViewStyle: {
        marginLeft: 8,
        justifyContent: 'center',
        flex: 1,
    },

    rightTopViewStyle: {
        flexDirection: 'row',
        marginBottom: 7,
        justifyContent: 'space-between'
    },

    rightBottomViewStyle: {
        flexDirection: 'row',
        marginTop: 7,
        justifyContent: 'space-between'
    }
});

