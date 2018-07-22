/**
TODO 权限控制
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';
import Title from '../commonView/title';
import CommonCellsWithModal from '../commonView/CommonCellsWithModal'

export default class TeamInfoEdit extends Component {

    static defaultProps = {
        //需要编辑的信息数组
        data: [],
        isMulty:false,//是否多行显示
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {

        };
    }

    render() {
        // alert(JSON.stringify(this.props.data))
        return (
            <View style={styles.container}>
                <Title title='修改社团信息' leftView={true} navigator={this.props.navigator}></Title>
                <CommonCellsWithModal isMulty={this.props.isMulty} data={this.props.data}></CommonCellsWithModal>
            </View>
        );
    }

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});








