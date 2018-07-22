/**
 搜索列表公用组件
 应该是Common里的
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import SearchInput from '../commonView/searchInput'
import Title from '../commonView/title';
import config from '../common/config';
import request from '../common/request';
import CommonListView from '../commonView/CommonListView';
import TeamItem from '../Team/teamItem';
import TeamDetail from '../Team/teamDetail';
import Item from '../Activity/item';
export default class CommonSearchList extends Component {

  static defaultProps = {
    content: '',//默认搜索值
    title: '搜索列表',//默认标题值
    dataKey: "aa",
    value: "",
    searchField: "",//搜索域
    dataUrl: "",//搜索关键词
    searchType: "",//是哪个页面发出的搜索,根据此项渲染不同的子列表视图
  };

  constructor(props) {
    super(props);//这一句不能省略，照抄即可
    this.state = {
      dataParams: {
        key: this.props.dataKey,
        value: this.props.value,
      }
    };
    // this._fetchTeamByKey = this._fetchTeamByKey.bind(this);
    this._loadPage = this._loadPage.bind(this);
    this._fetchSearchList = this._fetchSearchList.bind(this);
  }

  _fetchSearchList(dataKey, lable) {
    let newPrams = {
      key: dataKey,
      value: lable,
      pageIndex: "0",
    }
    this.setState({
      dataParams: newPrams,
    })
    this.refs.list.fetchData(newPrams, this.props.dataUrl);
  }

  renderItem = (rowData) => {
    switch (this.props.searchType) {
      case "team":
        return (<TeamItem rowData={rowData}
          onSelect={(teamId) => this._loadPage(teamId)}
          key={rowData.teamId}
        />)
        break;
      case "activity":
        return (<Item rowData={rowData}
          onSelect={(activityId) => this._loadPage(activityId)}
          key={rowData.activityId}
        />)
        break;
      default:
        break;

    }

  }
  render() {
    let dataUrl = this.props.dataUrl;
    let dataParams = this.state.dataParams;
    return (
      <ScrollView style={styles.container}>
        <Title title={this.props.title} leftView={true} navigator={this.props.navigator}></Title>
        <View style={{ paddingTop: 10 }}>
          <SearchInput
            searchInfo={this.props.content}
            searchInfoCallBack={(searchInfo) => { this._fetchSearchList(this.props.searchField, searchInfo) }}>
          </SearchInput>
          <CommonListView ref="list" dataUrl={dataUrl} dataParams={dataParams} renderItemCallback={(rowData) => {
            return this.renderItem(rowData);
          }}  >
          </CommonListView>
        </View>
      </ScrollView >
    );
  }

  _loadPage(teamId) {
    let { navigator } = this.props;
    if (navigator) {
      navigator.push({
        name: 'teamDetail',
        component: TeamDetail,
        params: {
          teamId: teamId
        }
      })
    } else {
      alert(111)
    }
  }

  componentDidMount() {
  }

}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});








