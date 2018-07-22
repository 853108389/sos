/**
 * TODO rightIcon 
 */
//昵称      xxx
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Platform,
    Switch,
    Dimensions,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
import DeviceStorage from '../common/deviceStorage';
export default class CommonCell extends Component {

    static defaultProps = {
        title: '',  // 左标题
        rightTitle: '',
        rightIcon: false,
        disStyle: {},//禁用时的颜色
        callBackClickCell: null,
        isSwitch: false, // 是否展示开关
        switchCallBack: null,
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            isOn: false
        };
        this.renderRightView = this.renderRightView.bind(this);
        this.rightTitle = this.rightTitle.bind(this);
        this.clickCell = this.clickCell.bind(this);
        this._onSwitch = this._onSwitch.bind(this);
    }

    setSwithState = (flag) => {
        this.setState({
            isOn: flag
        })
        console.log(this.state.isOn)
    }
    

    render() {
        let cell = <View style={[styles.container, this.props.disStyle]}>
            {/*左边*/}
            <Text style={styles.leftTextStyle}>{this.props.title}</Text>
            {/*右边*/}
            {this.renderRightView()}
        </View>;
        if (this.props.callBackClickCell == null) {
            return cell;
        }
        return (
            <TouchableOpacity onPress={() => this.clickCell(this.props.rightTitle)}>
                {cell}
            </TouchableOpacity>
        );
    }

    clickCell(data) {
        // 判断处理
        if (this.props.callBackClickCell == null) return;
        // 执行回调函数
        this.props.callBackClickCell(data);
    }

    _onSwitch() {
        this.setState({ isOn: !this.state.isOn }, () => {
            if (this.props.switchCallBack == null) {
                return
            }
            this.props.switchCallBack(this.state.isOn);
        })
    }

    renderRightView() {
        // 判断
        if (this.props.isSwitch) { // true
            return (
                <Switch value={this.state.isOn == true} onValueChange={() => { this._onSwitch() }} style={{ marginRight: 8 }} />
            )
        } else {
            return (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {this.rightTitle()}
                    {this.props.rightIcon ?
                        < Icon name='ios-arrow-forward'
                            style={{ width: 8, height: 13, marginRight: 8 }}
                        />
                        : <View />}
                </View>
            )
        }
    }

    rightTitle() {
        if (this.props.rightTitle.length > 0) {
            return (
                <Text style={styles.rightTextStyle} numberOfLines={1}>{this.props.rightTitle} </Text>
            )
        }
    }

}



const styles = StyleSheet.create({
    container: {
        height: Platform.OS == 'ios' ? 50 : 55,
        backgroundColor: 'white',
        borderBottomColor: '#dddddd',
        borderBottomWidth: 0.5,
        flexDirection: 'row',
        // 主轴的对齐方式
        justifyContent: 'space-between',
        // 垂直居中
        alignItems: 'center',
        width: width,
    },
    leftTextStyle: {
        marginLeft: 8,
        color: 'black',
    },
    rightTextStyle: {
        color: '#aaa',
        marginRight: 8,
        width: width / 3,
        textAlign: 'right',
    }

});

