/*
    TODO抽取按钮组件
*/
import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  Platform,
  ListView,
  ActivityIndicator,
  RefreshControl,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';

import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
const { width, height } = Dimensions.get('window');
import config from '../common/config';
import request from '../common/request';
var num = '3';

export default class CommonTopButtonBox extends Component {

  static defaultProps = {
    clickCallBack: null,
    items: null,
  };


  constructor(props) {
    super(props);//这一句不能省略，照抄即可
    this.state = {
    };
    //render组件
    this._rendertopButtonBox = this._rendertopButtonBox.bind(this);
    this._onclick = this._onclick.bind(this);
  }

  render() {
    let items = this.props.items;
    return (
      <View style={styles.topButtonBox}>
        {this._rendertopButtonBox(items)}
      </View>
    );
  }

  componentDidMount() {
    // num = this.props.items.length;
  }

  _rendertopButtonBox(items) {

    let middleViewItems = [];
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      var keyItem =
        <TouchableOpacity key={i} onPress={() => { this._onclick(item.uri, item.dataParams) }}>
          <View style={styles.topButton} >
            <Icon
              name={item.iconName}
              size={20}
              style={styles.play} />
            {/* <Text>校级社团</Text> */}
            <Text style={styles.topButtonText}>{item.topButtonText}</Text>
          </View>
        </TouchableOpacity>
      middleViewItems.push(keyItem);
    }
    return middleViewItems;
  }

  _onclick(uri, dataParams) {
    if (this.props.clickCallBack == null) {
      return;
    } else {
      this.props.clickCallBack(uri, dataParams)
    }
  }

}
const styles = StyleSheet.create({
  topButtonBox: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    marginBottom: 10,
  },

  topButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
    width: width / num,
  },

  topButtonText: {
    marginLeft: 5,
  },

});


