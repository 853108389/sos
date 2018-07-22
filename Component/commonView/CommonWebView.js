import React, { Component } from 'react'
import { Text, View, WebView, Dimensions } from 'react-native'
import Title from './title';
const { width, height } = Dimensions.get('window');
export default class CommonWebView extends Component {
    static defaultProps = {
        style: {},
        source: {},
        title: "",
    }; //
    render() {
        return (
            <View style={{ flex: 1 }}>
                <Title title={this.props.title} leftView={true} navigator={this.props.navigator}></Title>
                <WebView
                    style={{ height: height, width: width, ...this.props.style }}
                    source={this.props.source}
                    onLoad={(e) => console.log('onLoad', e)}
                    onLoadEnd={(e) => console.log('onLoadEnd', e)}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                // onLoadStart={(e) => console.log('onLoadStart', e)}
                // renderError={() => {
                //     return <View><Text>renderError回调了，出现错误</Text></View>
                // }}
                // renderLoading={() => {
                //     return <View><Text>这是自定义Loading...</Text></View>
                // }}
                >
                </WebView>
            </View>
        )
    }
}