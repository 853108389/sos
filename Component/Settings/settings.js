/**
TODO
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ToastAndroid,
} from 'react-native';

import Title from "../commonView/title"
import CommonCell from "../commonView/CommonCell"
import SerectSetting from './serectSetting'
import AboutSetting from './aboutSetting'
import HelpSetting from './helpSetting'
import InitJson from '../common/initJson'
import FeedBackSetting from './feedBackSetting';
export default class Settings extends Component {

  static defaultProps = {
  }; //

  constructor(props) {
    super(props);//这一句不能省略，照抄即可
    this.state = {
      data: [
        {
          "id": 1,
          "lable": "关于",
          "dataKey": "about",
          "dataValue":
            ""
        },
        {
          "id": 2,
          "lable": "隐私",
          "dataKey": "secret",
          "dataValue":
            ""
        },
        {
          "id": 3,
          "lable": "帮助",
          "dataKey": "help",
          "dataValue":
            ""
        },
        {
          "id": 4,
          "lable": "反馈",
          "dataKey": "feedBack",
          "dataValue":
            ""
        },
        {
          "id": 5,
          "lable": "清理缓存",
          "dataKey": "clear",
          "dataValue":
            ""
        },
      ],
    };
    //render
    this._renderInfoCell = this._renderInfoCell.bind(this)
    //push
    this._pushSerect = this._pushSerect.bind(this)
    this._pushAbout = this._pushAbout.bind(this)
    this._pushFeedBack = this._pushFeedBack.bind(this)
    this._pushHelp = this._pushHelp.bind(this)
    //fun
    this._clickCell = this._clickCell.bind(this)
    this._clearCache = this._clearCache.bind(this)
    this._confirmClear = this._confirmClear.bind(this)
  }

  render() {
    return (
      <View style={styles.container}>
        <Title title='设置' leftView={true} navigator={this.props.navigator}></Title>
        {this._renderInfoCell()}
      </View>
    );
  }


  _confirmClear() {
    Alert.alert('温馨提醒', '你确定要清理所有缓存吗', [
      { text: '取消' },
      {
        text: '确定', onPress: () => {
          this._clearCache()
        }
      }
    ])
  }

  //TODO 并没有什么缓存
  _clearCache() {
    InitJson.cleanJsonData();
    ToastAndroid.show('清除完毕', ToastAndroid.SHORT);
  }

  //渲染公共info组件
  _renderInfoCell() {
    let data = this.state.data;
    let cellView = [];
    for (let i = 0; i < data.length; i++) {
      let dataObj = data[i]
      let lable = dataObj.lable //左标题 数据lable
      let dataValue = dataObj.dataValue; //右标题 数据值
      let title = lable;//标题
      var cell = <CommonCell key={i} title={lable} rightTitle={dataValue} rightIcon={true}
        callBackClickCell={() => {
          this._clickCell(dataObj.dataKey);
        }}>
      </CommonCell>;
      cellView.push(cell)
    }
    return cellView;
  }

  _clickCell(dataKey) {
    if (dataKey === "secret") {
      this._pushSerect();
    }
    else if (dataKey === "about") {
      this._pushAbout();
    } else if (dataKey === "help") {
      this._pushHelp();
    } else if (dataKey === "clear") {
      this._confirmClear();
    } else if (dataKey === "feedBack") {
      this._pushFeedBack();
    } else {
      return;
    }
  }


  _pushSerect() {
    let { navigator } = this.props;
    if (navigator) {
      navigator.push({
        name: 'serectSetting',
        component: SerectSetting,
        params: {
        }
      })
    } else {
      alert('跳转失败')
    }
  }

  _pushFeedBack(){
    let { navigator } = this.props;
    if (navigator) {
      navigator.push({
        name: 'feedBackSetting',
        component: FeedBackSetting,
        params: {
          user: this.props.user
        }
      })
    } else {
      alert('跳转失败')
    }
  }

  _pushAbout() {
    let { navigator } = this.props;
    if (navigator) {
      navigator.push({
        name: 'aboutSetting',
        component: AboutSetting,
        params: {
          user: this.props.user
        }
      })
    } else {
      alert('跳转失败')
    }
  }

  _pushHelp() {
    let { navigator } = this.props;
    if (navigator) {
      navigator.push({
        name: 'helpSetting',
        component: HelpSetting,
        params: {
          user: this.props.user
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








