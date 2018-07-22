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
export default class AboutUs extends Component {

    static defaultProps = {
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {

        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Title title='关于我们' leftView={true} navigator={this.props.navigator}></Title>
                <View style={styles.infoBox}>
                    <Text>开发者 : 年糕</Text>
                    <Text>地生院科协副主席</Text>
                    <Text>联系方式: 853108389@qq.com</Text>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
        
    },
    infoBox: {
        alignItems:'center',
        alignSelf:'center',
        justifyContent:"center",
    }   
});








