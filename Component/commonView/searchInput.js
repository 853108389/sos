/**
TODO
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class SearchInput extends Component {

    static defaultProps = {
        isfocus: false,
        content: '请输入要搜索的内容',
        searchInfoCallBack: null,//点击搜索按钮执行的方法
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            searchInfo: this.props.searchInfo,
        };
        this._changeSearchInfo = this._changeSearchInfo.bind(this);
        this._searchInfo = this._searchInfo.bind(this);
    }

    render() {
        return (
            <View style={styles.fieldItem}>
                <TextInput
                    placeholder={this.props.content}
                    value={this.state.searchInfo}
                    placeholderTextColor='#ddd'
                    underlineColorAndroid='transparent'
                    autoCorrect={false}
                    autoCapitalize={'none'}
                    style={styles.inputField}
                    onChangeText={(text) => {
                        this._changeSearchInfo(text);
                        //TODO
                    }}
                    onSubmitEditing={() => {
                        this._searchInfo();
                    }}
                    autoFocus={this.props.isfocus}
                />
                <View style={styles.searchBox}>
                    <TouchableOpacity
                        onPress={this._searchInfo}
                    >
                        <Icon name='ios-search'
                            style={styles.searchIcon}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _changeSearchInfo(searchInfo) {
        this.setState({
            searchInfo: searchInfo
        });
    }

    _searchInfo() {
        let searchInfo = this.state.searchInfo
        if (this.props.searchInfoCallBack == null) {
            return;
        }
        this.props.searchInfoCallBack(searchInfo)
        //TODO进行搜索
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    fieldItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 30,
        paddingLeft: 15,
        paddingRight: 15,
        borderColor: '#ee735d',
        borderBottomWidth: 1,
    },
    inputField: {
        flex: 1,
        height: 40,
        fontSize: 14,
        color: 'black',
    },
    searchIcon: {
        color: '#999',
        fontSize: 22,
        marginRight: 5
    },
    searchBox: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 30,
        height: 30,
    },

});








