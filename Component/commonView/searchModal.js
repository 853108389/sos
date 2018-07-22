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
    Modal,
    TextInput,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Title from '../commonView/title';
import config from '../common/config';
import request from '../common/request';
import Icon from 'react-native-vector-icons/Ionicons';
import SearchKeywords from '../commonView/searchKeywords'
import SearchInput from './searchInput'
const { width, height } = Dimensions.get('window');

export default class SearchModal extends Component {

    static defaultProps = {
        title: '', //标题
        keywords: [],//关键字
        searchField: "",//搜索域
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            animationType: 'fade',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            searchInfo: '',//搜索的内容
            searchInfoCallBack: ''//搜索的回调
        };
        //模态
        this._setModalVisible = this._setModalVisible.bind(this);
        this._startShow = this._startShow.bind(this);
        this._closeModal = this._closeModal.bind(this);
        //跳转
        this._pushSearchList = this._pushSearchList.bind(this);
    }

    render() {
        let searchInfo = this.state.searchInfo;
        return (
            <Modal
                animationType={this.state.animationType}
                transparent={this.state.transparent}
                visible={this.state.modalVisible}
                onRequestClose={() => {
                    this._setModalVisible(false)
                }}
                onShow={this._startShow}
            >
                <Title title={this.props.title} leftView={true} leftClick={this._closeModal}  ></Title>
                <View style={styles.modalContainer}>
                    <SearchInput isfocus={true} searchInfoCallBack={(searchInfo) => { this._pushSearchList(searchInfo, this.props.searchField, searchInfo) }}></SearchInput>
                    {/* searchKeywords */}
                    <SearchKeywords keywords={this.props.keywords} onclickCallBack={(dataValue, keyword, lable) => { this._pushSearchList(dataValue, keyword, lable) }} />
                </View>
            </Modal>
        );
    }

    _setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    _startShow() {
    }

    _closeModal() {
        this._setModalVisible(false);
    }

    _pushSearchList(searchInfo, key, lable) {
        if (this.props.searchInfoCallBack == null) {
            return;
        }
        this._closeModal();
        this.props.searchInfoCallBack(searchInfo, key, lable);
    }


}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 10,
        backgroundColor: '#eee',
    },
    gender: {
        backgroundColor: '#ccc'
    },
    genderChecked: {
        backgroundColor: '#ee735d'
    },
    btn: {
        height: 50,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ee735d',
        marginTop: 25,
        marginRight: 10,
        marginLeft: 10,
    },
    btnText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ee735d'
    },

});






