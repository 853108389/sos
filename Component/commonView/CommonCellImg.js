//Img xx     xxx>
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default class CommonCellImg extends Component {

    static defaultProps = {
        leftTitle: '',
        callBackLeftIcon: null,
        rightIconName: '',//废弃
        rightTitle: '',
        callBackClickCell: null,//点击回调
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {

        };
        this._clickCell = this._clickCell.bind(this);
    }

    render() {
        let cell = <View style={styles.container}>
            {/*--左边--*/}
            <View style={styles.leftViewStyle}>
                {this._renderLeftIcon()}
                {/* <Icon name='ios-arrow-forward'
                size={20}
                style={styles.leftImgStyle}
            /> */}
                <Text style={styles.leftTitleStyle}>{this.props.leftTitle}</Text>
            </View>
            {/*--右边--*/}
            <View style={styles.rightViewStyle}>
                {this.rightSubView()}
            </View>
        </View>
        if (this.props.callBackClickCell == null) {
            return cell;
        } else {
            return (
                <TouchableOpacity activeOpacity={0.5} onPress={() => { this._clickCell() }}>
                    {cell}
                </TouchableOpacity>
            );
        }

    }

    _clickCell() {
        // 判断处理
        if (this.props.callBackClickCell == null) return;
        // 执行回调函数
        this.props.callBackClickCell();
    }

    _renderLeftIcon(data) {
        // 判断处理
        if (this.props.callBackLeftIcon == null) {
            return null;
        }
        // 执行回调函数
        return (
            this.props.callBackLeftIcon(data)
        );
    }



    // 右边的内容
    rightSubView() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {this.renderRightContent()}
                {/*箭头*/}
                {this.props.callBackClickCell == null ?
                    <View style={{ marginRight: 5, marginLeft: 5, }}></View> :
                    <Icon name='ios-arrow-forward'
                        style={styles.forwardIcon}
                    />}
                {/* <Image source={{ uri: 'icon_cell_rightArrow' }} style={{ width: 8, height: 13, marginRight: 8, marginLeft: 5 }} /> */}
            </View>
        )
    }


    // 右边具体返回的值
    renderRightContent() {
        if (this.props.rightIconName.length == 0) { // 不返回图片
            return (
                <Text style={{ color: 'gray' }}>{this.props.rightTitle}</Text>
            )
        } else {
            return (
                <Image source={{ uri: this.props.rightIconName }} style={{ width: 24, height: 13 }} />
            )
        }
    }

}

const styles = StyleSheet.create({

    forwardIcon: {
        color: '#999',
        marginRight: 8, marginLeft: 5,
    },
    container: {
        // 主轴的方向
        flexDirection: 'row',
        // 主轴的对齐方式
        justifyContent: 'space-between',
        // 背景颜色
        backgroundColor: 'white',
        // 垂直居中
        alignItems: 'center',
        // 高度
        height: Platform.OS == 'ios' ? 40 : 36,

        // 下边框
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 0.5
    },

    leftViewStyle: {
        // 主轴的方向
        flexDirection: 'row',
        // 侧轴居中
        alignItems: 'center',
        // 左外边距
        marginLeft: 8
    },

    rightViewStyle: {

    },

    leftTitleStyle: {
        fontSize: 16
    }
});
