import React, { Component } from 'react'
import { Text, View, Alert, ToastAndroid } from 'react-native'
import CommonListView from './../commonView/CommonListView';
import AccountMsItem from './accountMsItem';
import Title from './../commonView/title';
import config from '../common/config'
import request from "../common/request"

/**
 * 用户消息通知
 * ListView 消息表
 */
export default class AccountMessage extends Component {

  static defaultProps = {
    userId: "",
  }; //
  constructor(props) {
    super(props)
    this._onSelectCallBack = this._onSelectCallBack.bind(this);
    this._fetchAddTeamUser = this._fetchAddTeamUser.bind(this); //逻辑添加用户
    this._fetchDeleteTeamUser = this._fetchDeleteTeamUser.bind(this); //删除用户
  }

  _onLongPress(messagesId) {

    Alert.alert("删除", '确定要删除吗?', [
      { text: '取消' },
      {
        text: '确定', onPress: () => {
          let url = config.uri.user + config.user.delMs;
          let params = {
            messagesId: messagesId, //消息id
          };
          console.log("================================")
          request.post(url, params).then((result) => {
            console.log("result", result);
            if (result && result.success) {
            } else {
              ToastAndroid.show('删除失败', ToastAndroid.SHORT);
            }
            let dataUrl = config.uri.user + config.user.allMs;
            let newParams = {
              pageIndex: "0",
              isDesc: "true",
              orderBy: "messages_date",
              data: {
                userId: this.props.userId,
              }
            };
            this.refs.list.fetchData(newParams, dataUrl);
          })
        }
      }
    ])
  }

  //暂时不用
  _fetchDeleteTeamUser(messagesFromid) {
    return;
    let url = config.uri.team + config.team.delTeamUser;
    let params = {
      teamId: messagesFromid,//要加入的社团id
      userId: this.props.userId,//当前用户id
    };
    request.post(url, params).then((result) => {
      if (result && result.success) {
        ToastAndroid.show('操作成功~', ToastAndroid.SHORT)
      } else {
        ToastAndroid.show('操作失败~', ToastAndroid.SHORT)
      }
    })
  }

  _fetchAddTeamUser(teamId, userId) {
    let url = config.uri.team + config.team.addTeamUser2;
    let params = {
      teamId: teamId,//要加入的社团id
      userId: userId,//当前用户id
    };
    request.post(url, params).then((result) => {
      if (result && result.success) {
        ToastAndroid.show('加入成功~', ToastAndroid.SHORT)
      } else {
        ToastAndroid.show('加入失败~', ToastAndroid.SHORT)
      }
    })
  }

  _fetchAddTeam(userId) {
    let url = config.uri.team + config.team.add2;
    let params = {
      userId: userId,//当前用户id
    };
    request.post(url, params).then((result) => {
      if (result && result.success) {
        ToastAndroid.show('处理成功~', ToastAndroid.SHORT)
      } else {
        ToastAndroid.show(result.message, ToastAndroid.SHORT)
      }
    })
  }

  _onSelectCallBack(message, messagesType, messagesId, messagesFromid, messagesTitle, messagesToid) {
    if (messagesType == 100) { //100被邀请
      Alert.alert(messagesTitle, '你确定要加入社团吗?', [
        {
          text: '取消', onPress: () => {
          }
        },
        {
          text: '确定', onPress: () => {
            this._fetchAddTeamUser(teamId, this.props.userId);
          }
        }
      ])
    } else if (messagesType == 200) {//批准加入
      Alert.alert(messagesTitle, '你确定要批准ta加入社团吗?', [
        { text: '取消' },
        {
          text: '确定', onPress: () => {
            this._fetchAddTeamUser(messagesToid, messagesFromid);
          }
        }
      ])
    } else if (messagesType == 102) {//用户申请社团
      Alert.alert(messagesTitle, '你确定要批准ta的创团申请吗?', [
        { text: '取消' },
        {
          text: '确定', onPress: () => {
            // this._fetchAddTeamUser(messagesToid, messagesFromid);
            this._fetchAddTeam(messagesFromid);
          }
        }
      ])
    } else {
      Alert.alert(messagesTitle, message, [
        {
          text: '确定', onPress: () => {
          }
        }
      ])
    }
  }

  render() {
    let dataUrl = config.uri.user + config.user.allMs;
    let dataParams = {
      pageIndex: "1",
      isDesc: "true",
      orderBy: "messages_date",
      data: {
        userId: this.props.userId,
      }
    };
    return (
      <View style={{ flex: 1 }}>
        <Title title="我的消息" leftView={true} navigator={this.props.navigator}></Title>
        {/* {this.renderMsItem()} */}
        <View style={{ flex: 1 }}>
          <CommonListView style={{ backgroundColor: "#555" }} ref="list" dataUrl={dataUrl} dataParams={dataParams} renderItemCallback={(rowData) => {
            console.log(rowData)
            return (
              <AccountMsItem rowData={rowData}
                onSelect={(message, messagesType, messagesId, messagesFromid, messagesTitle, messagesToid) => { this._onSelectCallBack(message, messagesType, messagesId, messagesFromid, messagesTitle, messagesToid) }}
                onLongPress={(messagesId) => { this._onLongPress(messagesId) }}
                key={rowData._id}
              />
            )
          }}
            renderFooterCallback={() => {
              return <View></View>
            }}
          />
        </View>
      </View>
    )
  }

}