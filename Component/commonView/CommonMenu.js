/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import ModalDropdown from 'react-native-modal-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';


export default class CommonMenu extends Component {
    static defaultProps = {
        data: [],
        selectItemCallBack: null,//每一项的处理
        renderRowCallBack: null,//每一项的render BUG不好使
        renderSeparatorCallBack: null,//下划线  BUG不好使
        renderTriggerViewCallBack: null,//触发下拉菜单时所点击的View
    };

    constructor(props) {
        super(props);

        this.state = {

        };

        this._renderRow = this._renderRow.bind(this)
        this._renderSeparator = this._renderSeparator.bind(this)
        this._renderTriggerView = this._renderTriggerView.bind(this)

        this._selectItem = this._selectItem.bind(this)

    }

    render() {
        let dataArr = this.props.data;
        let hei = 0;
        if (dataArr != null) {
            hei = dataArr.length * 32;
        }
        return (
            <View style={styles.container}>
                <ModalDropdown style={[styles.dropdown_2, { ...this.props.style }]}
                    options={dataArr}
                    onSelect={(idx, value) => { this._selectItem(idx, value) }}
                    dropdownStyle={[styles.dropdown_2_dropdown, { height: hei }]}
                    renderRow={this._renderRow}
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted) => this._renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                >
                    {this._renderTriggerView()}
                </ModalDropdown >
            </View>
        );
    }

    _renderTriggerView() {
        if (this.props.renderTriggerViewCallBack == null) {
            return <Icon name='ios-add'
                style={styles.icon}
                size={22}
            />
        }
        else {
            return (
                this.props.renderTriggerViewCallBack()
            )
        }
    }

    _selectItem(idx, value) {
        // 判断处理
        if (this.props.selectItemCallBack == null) {
            return;
        }
        // 执行回调函数
        this.props.selectItemCallBack(idx, value);
    }

    _renderRow(rowData, rowID, highlighted) {
        // 判断处理
        if (this.props.renderRowCallBack == null) {
            let evenRow = rowID % 2;
            return (
                <TouchableOpacity >
                    <View style={[styles.dropdown_2_row, { backgroundColor: evenRow ? 'lemonchiffon' : 'white' }]}>
                        <Text style={[styles.dropdown_2_row_text, highlighted && { color: 'mediumaquamarine' }]}>
                            {`${rowData}`}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }
        // 执行回调函数
        this.props.renderRowCallBack(rowData, rowID, highlighted);
    }

    _renderSeparator(sectionID, rowID, adjacentRowHighlighted) {
        // 判断处理
        if (this.props.renderSeparatorCallBack == null) {
            let dataArr = this.props.data;
            if (rowID == dataArr.length - 1) return;
            let key = `spr_${rowID}`;
            return (<View style={styles.dropdown_2_separator}
                key={key}
            />);
        }
        // 执行回调函数
        this.props.renderSeparatorCallBack(sectionID, rowID, adjacentRowHighlighted);
    }



}

const styles = StyleSheet.create({
    //行布局
    dropdown_2_row: {
        flexDirection: 'row',
        height: 30,
        alignItems: 'center',
    },
    //行文字布局
    dropdown_2_row_text: {
        marginHorizontal: 13,
        fontSize: 15,
        color: 'rgba(255,0,0,0.4)',
        textAlignVertical: 'center',
    },
    container: {
        flex: 1,
    },
    icon: {
        color: '#999',
        fontSize: 30,
        marginRight: 5,
        fontWeight: 'bold'
    },
    //总体布局
    dropdown_2: {
        flex: 1,
    },
    //下拉框样式
    dropdown_2_dropdown: {
        borderColor: 'rgba(255,0,0,0.2)',
        borderWidth: 2,
        borderRadius: 3,
    },
    //下划线布局
    dropdown_2_separator: {
        height: 1,
        backgroundColor: 'rgba(255,0,0,0.2)',
    },
});
