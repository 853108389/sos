import React, { Component } from 'react';
import { TextInput, StyleSheet } from 'react-native';

export default class AutoExpandingTextInput extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            text: '',
            height: 0
        };
        // this.onChange = this.onChange.bind(this);
        this.onContentSizeChange = this.onContentSizeChange.bind(this);

    }

    // onChange(event) {
    //     this.setState({
    //         text: event.nativeEvent.text,
    //     });
    // }
    onContentSizeChange(event) {
        this.setState({
            height: event.nativeEvent.contentSize.height
        });
    }
    render() {
        return (
            <TextInput {...this.props}  //将组件定义的属性交给TextInput
                multiline={true}
                onChange={this.onChange}
                onContentSizeChange={this.onContentSizeChange}
                style={[styles.multyInputField, { height: Math.max(35, this.state.height)}]}
            />
        );
    }
}

const styles = StyleSheet.create({
    multyInputField: {
        fontSize: 15,
        marginTop: 0,
        marginLeft:5,
        marginRight:5,
    },
});
