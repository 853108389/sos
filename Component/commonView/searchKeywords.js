/**
    搜索modal里面的关键字
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
const { width, height } = Dimensions.get('window');
export default class SearchKeywords extends Component {

    static defaultProps = {
        keywords: [],
        onclickCallBack: null,
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {

        };
        this._renderKeywords = this._renderKeywords.bind(this);
        this._onclick = this._onclick.bind(this);
    }

    render() {
        return (
            <View style={styles.searchKeywords}>
                {this._renderKeywords()}
            </View>
        )
    }

    _renderKeywords() {
        let keywords = this.props.keywords;
        let keyItems = [];
        for (let i = 0; i < keywords.length; i++) {
            var keyItem =
                <TouchableOpacity key={i} onPress={() => { this._onclick(keywords[i].dataValue, keywords[i].dataKey, keywords[i].lable) }} style={styles.searchKeyword}>
                    <View  >
                        <Text>{keywords[i].lable}</Text>
                    </View>
                </TouchableOpacity>
            keyItems.push(keyItem);
        }
        return keyItems;
    }

    _onclick(dataValue, keyword, lable) {
        if (this.props.onclickCallBack == null) {
            return;
        }
        this.props.onclickCallBack(dataValue, keyword, lable);
    }

}

const styles = StyleSheet.create({
    searchKeywords: {
        flexDirection: 'row',
        alignItems: 'center',
        width: width,
        flexWrap: 'wrap',
    },
    searchKeyword: {
        paddingLeft: 10,
        paddingRight: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10,
        backgroundColor: 'white',
        height: 30,
        borderRadius: 15,
        justifyContent: 'center'
    },
});




