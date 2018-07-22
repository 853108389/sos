/**
TODO
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ToastAndroid,
} from 'react-native';

import CommonCell from "../commonView/CommonCell"
import Title from '../commonView/title'
import AboutUs from './aboutSetting_aboutUs'
import Introduction from './aboutSetting_introduction';
export default class AboutSetting extends Component {

  static defaultProps = {
  }; //

  constructor(props) {
    super(props);//这一句不能省略，照抄即可
    this.state = {
      data: [
        {
          "id": 1,
          "lable": "版本更新",
          "dataKey": "update",
          "dataValue":
            "1.0.0"
        },
        {
          "id": 1,
          "lable": "关于我们",
          "dataKey": "aboutUs",
          "dataValue":
            ""
        },
        {
          "id": 1,
          "lable": "功能介绍",
          "dataKey": "introduction",
          "dataValue":
            ""
        },
      ],
    };
    this._renderInfoCell = this._renderInfoCell.bind(this)
    this._renderBottom = this._renderBottom.bind(this)
    this._pushAboutUs = this._pushAboutUs.bind(this)
    this._pushIntroduction = this._pushIntroduction.bind(this)
    this._clickCell = this._clickCell.bind(this)
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
      var cell = <CommonCell key={i} title={lable} rightTitle={dataValue}
        callBackClickCell={() => {
          this._clickCell(dataObj.dataKey);
        }}>
      </CommonCell>;
      cellView.push(cell)
    }
    return cellView;
  }

  _clickCell(dataKey) {
    if (dataKey === "aboutUs") {
      this._pushAboutUs();
    } else if (dataKey === "update") {
      ToastAndroid.show('==测试中..==', ToastAndroid.SHORT);
    } else if (dataKey === "introduction") {
      this._pushIntroduction();
    } else {
      return;
    }


  }

  _pushAboutUs() {
    let { navigator } = this.props;
    if (navigator) {
      navigator.push({
        name: 'aboutUs',
        component: AboutUs,
        params: {
        }
      })
    } else {
      alert('跳转失败')
    }
  }

  _pushIntroduction(){
    let { navigator } = this.props;
    if (navigator) {
      navigator.push({
        name: 'introduction',
        component: Introduction,
        params: {
        }
      })
    } else {
      alert('跳转失败')
    }
  }


  _renderBottom() {
    return (
      <View style={styles.bottomBox}>
        <Text style={styles.bottomText}>年糕 版权所有</Text>
        <Text style={styles.bottomText}>Copyright © 2017-2018 Niangao</Text>
        <Text style={styles.bottomText}>All Rights Reserved.</Text>
      </View>
    )
  }
  _renderTop() {
    return (
      <View style={styles.imgBox}>
        <Image style={styles.image} source={{ uri: 'http://oxnbmu2mx.bkt.clouddn.com/sos_about2.jpg' }}>
        </Image>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Title title='关于' leftView={true} navigator={this.props.navigator}></Title>
        {this._renderTop()}
        {this._renderInfoCell()}
        {/* <Text>众筹</Text> */}
        {this._renderBottom()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  bottomBox: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    alignSelf: 'center',
  },
  bottomText: {
    color: "#bbb",
  },
  image: {
    width: 100,
    height: 100,
    alignSelf: 'center',
  },
  imgBox: {
    marginTop: 30,
    marginBottom: 30,
  }
});







