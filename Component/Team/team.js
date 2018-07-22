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
import TeamDetail from './teamDetail';
import Mock from 'mockjs';

import config from '../common/config';
import request from '../common/request';
import Title from '../commonView/title'; //标题
import SearchModal from '../commonView/searchModal';
import TeamItem from './teamItem';
import CommonListView from '../commonView/CommonListView'
import CommonSearchList from '../commonView/CommonSearchList'
import CommonTopButtonBox from '../commonView/CommonTopButtonBox'


const { width, height } = Dimensions.get('window');


let cachedResults = {
  nextPage: 1,
  items: [],
  total: 0,
}
//按钮
let items = [
  {
    topButtonText: '人数最多',
    iconName: 'ios-flag',
    uri: config.uri.team + config.team.conditions,
    dataParams: {
      orderBy: "teamuser_num",
      isDesc: "true",
      pageIndex: "0",
    },
  },
  {
    topButtonText: '社团等级',
    iconName: 'ios-book',
    uri: config.uri.team + config.team.allOrderBy,
    dataParams: {
      orderBy: "team_type",
      isDesc: "",
      pageIndex: "0",
    },
  },
  {
    topButtonText: '社团状态',
    iconName: 'ios-game-controller-b',
    uri: config.uri.team + config.team.allOrderBy,
    dataParams: {
      orderBy: "team_status",
      isDesc: "",
      pageIndex: "0",
    },
  },
]

export default class Activity extends Component {

  static defaultProps = {

  }; //


  constructor(props) {
    super(props);//这一句不能省略，照抄即可
    this.state = {
      isLoadingTail: false,
      isRefreshing: false,
      keywords: [
        {
          id: "1",
          lable: "校级社团",
          dataKey: 'team_type',
          dataValue: '1',
        },
        {
          id: "2",
          lable: "院级社团",
          dataKey: 'team_type',
          dataValue: '2',
        },
        {
          id: "3",
          lable: "兴趣社团",
          dataKey: 'team_type',
          dataValue: '3',
        },
        {
          id: "4",
          lable: "科协",
          dataKey: 'team_name',
          dataValue: '科协',
        },
        {
          id: "5",
          lable: "学生会",
          dataKey: 'team_name',
          dataValue: '学生会',
        }
      ],
      dataParams: {
        pageIndex: "1",
      },
      dataUrl: config.uri.team + config.team.conditions,
    };
    //显示模态
    this._setModalProps = this._setModalProps.bind(this);
    //render组件
    //跳转视图
    this._pushCommonSearchList = this._pushCommonSearchList.bind(this);
    this._loadPage = this._loadPage.bind(this);
    this._clickCallBack = this._clickCallBack.bind(this);
  }

  render() {
    let dataUrl = this.state.dataUrl;
    let dataParams = this.state.dataParams;
    let keywords = this.state.keywords;
    return (
      <View style={styles.container}>
        <Title title="社团" rightSearchView={true} rightClick={() => { this._setModalProps() }}></Title>
        <CommonListView ref="list" dataUrl={dataUrl} dataParams={dataParams} renderItemCallback={(rowData) => {
          return (
            <TeamItem rowData={rowData}
              onSelect={(teamId) => this._loadPage(teamId)}
              key={rowData.teamId}
            />
          )
        }}
          renderHeaderCallback={() => { return (<CommonTopButtonBox items={items} clickCallBack={(uri, dataParams) => { this._clickCallBack(uri, dataParams) }} />) }}
        >
        </CommonListView>
        {/* 搜索模态 */}
        <SearchModal searchField="team_name" title='搜索' ref='searchModal' keywords={keywords} searchInfoCallBack={(searchInfo, key, lable) => { this._pushCommonSearchList(searchInfo, key, lable) }}></SearchModal>
      </View>
    );
  }
  _clickCallBack(dataUrl, dataParams) {
    this.refs.list.fetchData(dataParams, dataUrl);
    this.setState({
      dataUrl: dataUrl,
      dataParams: dataParams,
    })
  }


  componentDidMount() {
  }

  _setModalProps() {
    let a = this.refs.searchModal;
    a._setModalVisible(true);
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


  _pushCommonSearchList(searchInfo, key, lable) {
    let { navigator } = this.props;
    if (navigator) {
      navigator.push({
        name: 'commonSearchList',
        component: CommonSearchList,
        params: {
          content: "",
          dataKey: key,
          value: searchInfo,
          searchField: "team_name",
          dataUrl: config.uri.team + config.team.conditions,
          searchType: "team",
        }
      })
    } else {
      alert("searchInfo err")
    }
  }
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

});


