/**
TODO
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

import Title from "../commonView/title"
import CommonCell from "../commonView/CommonCell"
import TeamUploadSwipImg from './teamUploadSwipImg'
export default class TeamImgUploadList extends Component {

    static defaultProps = {
        teamId: "",
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            data: [
                {
                    "id": 2,
                    "lable": "上传轮播",
                    "dataKey": "swipImg",
                    "dataValue": ""
                },
            ],
        };
        this._clickCell = this._clickCell.bind(this)
        this._renderInfoCell = this._renderInfoCell.bind(this)
        //push
        this._pushUploadSwipImg = this._pushUploadSwipImg.bind(this)
    }

    render() {
        return (
            <View style={styles.container}>
                <Title title='上传图片' leftView={true} navigator={this.props.navigator}></Title>
                {this._renderInfoCell()}
            </View>
        );
    }
    //渲染公共info组件
    _renderInfoCell() {
        let data = this.state.data;
        let cellView = [];
        for (let i = 0; i < data.length; i++) {
            let dataObj = data[i]
            let lable = dataObj.lable //左标题 数据lable
            let dataValue = dataObj.dataValue; //右标题 数据值
            let dataKey = dataObj.dataKey; //右标题 数据值
            let title = lable;//标题
            var cell = <CommonCell key={i} style={styles.InfoCell} title={lable} rightTitle={dataValue} rightIcon={true}
                callBackClickCell={() => {
                    this._clickCell(dataObj.dataKey);
                }}>
            </CommonCell>;
            cellView.push(cell)
        }
        return cellView;
    }

    _clickCell(dataKey) {
        if (dataKey === "swipImg") {
            this._pushUploadSwipImg();
        }
        else {
            return;
        }
    }
    _pushUploadSwipImg() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'teamUploadSwipImg',
                component: TeamUploadSwipImg,
                params: {
                    teamId: this.props.teamId,
                }
            })
        } else {
            alert('跳转失败')
        }
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});













