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


const { width, height } = Dimensions.get('window');

export default class TeamItem extends Component {

    static defaultProps = {
        onSelect: null,
    }; //
    constructor(props) {
        super(props);

        this.state = {
            rowData: this.props.rowData,
        }
    }

    _clickCell(teamId) {
        if (this.props.onSelect == null) {
            return
        } else {
            this.props.onSelect(teamId);
        }
    }

    render() {
        let rowData = this.props.rowData;
        let imgCell = null;
        if (rowData.teamBackimg == null || rowData.teamBackimg == "") {
            imgCell = <View style={[styles.imageViewStyle, { backgroundColor: '#eee' }]}></View>
        } else {
            imgCell = <Image source={{ uri: rowData.teamBackimg }} style={styles.imageViewStyle} />
        }
        return (
            <TouchableOpacity onPress={() => { this._clickCell(rowData.teamId) }}>
                <View style={styles.listViewStyle}>
                    {/*左边*/}
                    {imgCell}
                    {/*右边*/}
                    <View style={styles.rightViewStyle}>
                        <View style={styles.rightTopViewStyle}>
                            <Text>{rowData.teamName}</Text>
                            {/* <Text>{rowData.teamStatus}</Text> */}
                            {/* TODO: 社团的状态 */}
                        </View>
                        <Text style={{ color: 'gray' }}>简介: {rowData.teamTitle}</Text>
                        <View style={styles.rightBottomViewStyle}>
                            <Text style={{ color: 'red' }}>{rowData.teamType}</Text>
                            <Text>{rowData.teamuserNum}人</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    listViewStyle: {
        backgroundColor: 'white',
        padding: 10,
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
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
        justifyContent: 'space-between',
    }
});

