import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
} from 'react-native'

export default class CommonButton extends Component {
    static defaultProps = {
        clickCallBack: null,
        title: "确认",
        isAble: false,//button是否可用
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {

        };
    }

    render() {
        return (
            <View>
                {this._renderButton()}
            </View>
        )
    }
    _renderButton = () => {
        return (
            <View style={styles.confirmBox}>
                <TouchableOpacity disabled={!this.props.isAble} onPress={() => { this._clickCallBack() }}>
                    <View style={this.props.isAble ? styles.btn : styles.btn2}>
                        <Text style={this.props.isAble ? styles.btnText : styles.btnText2}>{this.props.title}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
    _clickCallBack = () => {
        if (this.props.clickCallBack == null) {
            return
        }
        this.props.clickCallBack();
    }
}

const styles = StyleSheet.create({
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
    btn2: {
        height: 50,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ddd',
        marginTop: 25,
        marginRight: 10,
        marginLeft: 10,
    },
    btnText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ee735d'
    },
    btnText2: {
        fontSize: 18,
        fontWeight: '600',
        color: '#ccc'
    },
    confirmBox: {
        marginBottom: 10,
        marginTop: 10,
    },
});
