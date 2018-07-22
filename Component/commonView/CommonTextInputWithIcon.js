import React, { Component } from 'react'
import {
    Text,
    View,
    TextInput,
    Dimensions,
    StyleSheet,
} from 'react-native'

const { width, height } = Dimensions.get('window');

export default class CommonTextInputWithIcon extends Component {
    static defaultProps = {
        flag: null, //是否显示icon
        //textInput
        secureTextEntry: false,//
        onChangeCallBack: null,//改变文字回调
        onBlurCallBack: null,//失去焦点回调
        placeholder: "",
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            content: "",
        };
    }
    render() {
        return (
            <View>
                {this._renderBlock1()}
            </View>
        )
    }

    _renderBlock1 = () => {
        let flagCell = null;
        if (this.props.flag !== null) {
            if (this.props.flag) {
                flagCell = <Icon name='ios-checkmark-circle-outline' size={36} style={{ color: "green" }} />;
            } else {
                flagCell = <Icon name='ios-close-circle-outline' size={36} style={{ color: "red" }} />;
            }
        }
        return (
            <View style={styles.block}>
                <View style={styles.iconBox}>
                </View>
                <View style={styles.textInputBox}>
                    <TextInput
                        placeholder={this.props.placeholder}
                        underlineColorAndroid='transparent'
                        keyboardType='default'
                        style={styles.content}
                        onChangeText={(text) => {
                            this.setState({
                                content: text
                            })
                            this._onChangeCallBack(text);
                        }}
                        onBlur={() => {
                            this._onBlurCallBack();
                        }}
                        secureTextEntry={this.props.secureTextEntry}
                    />
                </View>
                <View style={styles.iconBox}>
                    {flagCell}
                </View>
            </View>
        )
    }

    _onChangeCallBack = (text) => {
        if (this.props.onChangeCallBack == null) {
            return;
        }
        this.props.onChangeCallBack(text);
    }

    _onBlurCallBack = () => {
        if (this.props.onBlurCallBack == null) {
            return;
        }
        this.props.onBlurCallBack(this.state.content);
    }

}

const styles = StyleSheet.create({
    content: {
        fontSize: 18,
    },
    iconBox: { flex: 0.1, height: 50, justifyContent: "center", alignItems: "center" },
    textInputBox: { flex: 0.8, borderColor: "#666", borderWidth: 1, height: 50, justifyContent: "center", borderRadius: 3 },
    block: { flexDirection: "row", alignItems: "center" },
});
