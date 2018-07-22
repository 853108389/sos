//标题
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import CommonMenu from '../commonView/CommonMenu'

const { width, height } = Dimensions.get('window');

export default class Title extends Component {

    static defaultProps = {
        title: '',
        leftView: false,
        leftClick: null,
        rightClick: null,
        rightSaveView: false,
        rightSearchView: false,
        rightMoreView: false,
        rightClearView: false,
        rightMessageView: false,
        hasNewMessage: false,
        moreMenuData: [],
        selectMoreMenuCallBack: null,
        rightPointView: false,
    };

    constructor(props) {
        super(props);
        // this._renderLeftView =this._renderLeftView.bind(this);
        this._pop = this._pop.bind(this);
        this.clickLeftView = this.clickLeftView.bind(this);
        this.clickRightView = this.clickRightView.bind(this);
        this._renderRightView = this._renderRightView.bind(this);
        this._renderLeftView = this._renderLeftView.bind(this);
        //更多选项
        this._selectMoreViewItem = this._selectMoreViewItem.bind(this);
    }



    render() {
        return (
            <View style={styles.header}>
                {this._renderLeftView()}
                <Text style={styles.headerText}>
                    {this.props.title}
                </Text>
                {this._renderRightView()}
            </View>
        );
    }

    clickLeftView(data) {
        // 判断处理
        if (this.props.leftClick == null) {
            this._pop();
            return;
        }
        // 执行回调函数
        this.props.leftClick(data);
    }

    //data是没东西的
    clickRightView(data) {
        // 判断处理
        if (this.props.rightClick == null) {
            return;
        }
        // 执行回调函数
        this.props.rightClick(data);
    }

    _renderRightView() {
        if (this.props.rightSearchView) {
            return (
                <TouchableOpacity
                    style={styles.boxRightView}
                    onPress={this.clickRightView}
                >
                    <Icon name='ios-search'
                        style={styles.searchIcon}
                    />
                </TouchableOpacity>
            )
        }
        if (this.props.rightSaveView) {
            return (
                <TouchableOpacity
                    style={styles.boxRightView}
                    onPress={this.clickRightView}
                >
                    <Text style={styles.backText}>保存</Text>
                </TouchableOpacity>
            )
        }
        if (this.props.rightMoreView) {
            return (
                <View style={styles.boxRightView}>
                    <CommonMenu data={this.props.moreMenuData}
                        selectItemCallBack={(idx, value) => { this._selectMoreViewItem(idx, value) }}
                    >
                    </CommonMenu>
                </View>
            )
        }
        if (this.props.rightClearView) {
            return (
                <TouchableOpacity
                    style={styles.boxRightView}
                    onPress={this.clickRightView}
                >
                    <Text style={styles.backText}>清空</Text>
                </TouchableOpacity>
            )
        }
        if (this.props.rightPointView) {
            return (
                <TouchableOpacity
                    style={styles.boxRightView}
                    onPress={this.clickRightView}
                >
                   <Icon name='ios-more-outline'
                        style={styles.searchIcon}
                    />
                </TouchableOpacity>
            )
        }
        if (this.props.rightMessageView) {
            return (
                <TouchableOpacity
                    style={styles.boxRightView}
                    onPress={this.clickRightView}
                >
                    <View style={{ padding: 3 }}>
                        {this.props.hasNewMessage ? <View style={{ backgroundColor: "red", borderRadius: 3, width: 6, height: 6, position: "absolute", right: 3, top: 0, zIndex: 100 }}></View>
                            : null}
                        <Icon name='md-mail'
                            style={styles.messageIcon}
                        />
                    </View>

                </TouchableOpacity>
            )
        }
    }

    _selectMoreViewItem(idx, value) {
        if (this.props.selectMoreMenuCallBack == null) {
            return;
        }
        // 执行回调函数
        this.props.selectMoreMenuCallBack(idx, value);
    }

    _renderLeftView() {
        if (this.props.leftView) {
            return (
                <TouchableOpacity
                    style={styles.boxLeftView}
                    onPress={this.clickLeftView}
                >
                    <Icon name='ios-arrow-back'
                        style={styles.backIcon}
                    />
                    <Text style={styles.backText}>返回</Text>
                </TouchableOpacity>
            )
        }
    }

    _pop() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.pop();
        }
    }

}


const styles = StyleSheet.create({

    headerText: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        color: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: 55,
        borderBottomWidth: 1,
        backgroundColor: '#ee735c',
        borderColor: 'rgba(255,0,0,0.2)',
    },
    boxLeftView: {
        position: 'absolute',
        left: 12,
        width: 60,
        flexDirection: 'row',
        alignItems: 'center',
    },
    boxRightView: {
        position: 'absolute',
        right: 12,
        alignItems: 'center',
    },

    backIcon: {
        color: '#999',
        fontSize: 22,
        marginRight: 5
    },

    searchIcon: {
        color: '#999',
        fontSize: 22,
        marginRight: 5
    },

    messageIcon: {
        color: '#eee',
        fontSize: 22,
        marginRight: 5
    },

    backText: {
        color: '#999',
        fontSize: 16,
    },

    // toolBarEdit: {

    //            

    //         },
});
