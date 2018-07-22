/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ScrollView,
  Image,
  WebView,
} from 'react-native';
const { width, height } = Dimensions.get('window');

import Title from '../commonView/title'; //标题
import CommonCellImg from '../commonView/CommonCellImg';
import CommonSwiper from '../commonView/CommonSwiper';
import Icon from 'react-native-vector-icons/Ionicons';
import TeamItem from '../Team/teamItem';
import ActivityItem from '../Activity/activityItem';
import TeamDetail from '../Team/teamDetail';
import ActivityDetail from '../Activity/activityDetail';
import config from '../common/config';
import request from '../common/request';
import CommonListView from '../commonView/CommonListView';
import CommonWebView from '../commonView/CommonWebView';


export default class Team extends Component {
  static defaultProps = {

  }; //


  constructor(props) {
    super(props);//这一句不能省略，照抄即可
    this.state = {
      imageArr: [],
    };
    //render
    this._renderTeam = this._renderTeam.bind(this);
    this._renderActivity = this._renderActivity.bind(this);
    //push
    this._pushTeamDetail = this._pushTeamDetail.bind(this);
    this._pushActivityDetail = this._pushActivityDetail.bind(this);
    this._clickCallBack = this._clickCallBack.bind(this);
    this._fetchScrollData = this._fetchScrollData.bind(this);

  }

  render() {
    let imageArr = this.state.imageArr;
    return (
      <View style={styles.container}>
        <Title title="主页"></Title>
        <ScrollView>
          {/* 轮播图位置 */}
          {imageArr.length == 0 ? <View style={{ width: width, height: 200, }}></View> : <CommonSwiper imageArr={imageArr} clickCallBack={(key, weburl) => { this._clickCallBack(key, weburl) }} />}
          <View >
            {this._renderTeam()}
          </View>
          <View >
            {this._renderActivity()}
          </View>
        </ScrollView>
      </View>
    );
  }


  componentDidMount() {
    this._fetchScrollData();
  }

  _fetchScrollData() {
    let uri = config.uri.base + config.other.mainScroll;
    request.post(uri).then((result) => {
      if (result && result.success) {
        console.log("aa", result.data)
        this.setState({
          imageArr: result.data,
        })
      }
    })
  }

  _clickCallBack(key, weburl) {
    return;
    let source = {
      uri: weburl,
    }
    let { navigator } = this.props;
    if (navigator) {
      navigator.push({
        name: 'commonWebView',
        component: CommonWebView,
        params: {
          source: source,
          title: key,
        }
      })
    } else {
      alert(111)
    }

  }


  _renderTeam() {
    let dataUrl = config.uri.team + config.team.conditions;
    let dataParams = {
      data: {
        teamStatus: 4,
      }
    };
    return (
      <CommonListView ref="list" dataUrl={dataUrl} dataParams={dataParams}
        renderItemCallback={(rowData) => {
          return (
            <TeamItem rowData={rowData}
              onSelect={(teamId) => this._pushTeamDetail(teamId)}
              key={rowData.teamId}
            />
          )
        }}
        renderHeaderCallback={(total) => {
          return (
            <View style={styles.middleView}>
              <CommonCellImg leftTitle='热门社团' rightTitle={'共' + total + "个"} callBackLeftIcon={() => {
                return (
                  <View >
                    <Icon name='ios-flame'
                      size={20}
                      style={styles.leftImgStyle}
                    />
                  </View>
                )
              }} />
            </View>
          );
        }}
        renderFooterCallback={() => {
          return <View style={{ marginTop: 10, marginBottom: 10 }}></View>;
        }}
      >
      </CommonListView>
    )

  }

  _renderActivity() {
    let dataUrl = config.uri.activity + config.team.conditions;
    let dataParams = {
      orderBy: "activity_lovers",
      isDesc: "true",
      pageIndex: "1",
    };
    return (
      <CommonListView ref="list" dataUrl={dataUrl} dataParams={dataParams}
        renderItemCallback={(rowData) => {
          return (
            <ActivityItem rowData={rowData}
              onSelect={(activityId) => this._pushActivityDetail(activityId)}
              key={rowData.activityId}
            />
          )
        }}
        renderHeaderCallback={(total) => {
          return (
            <View style={styles.middleView}>
              <CommonCellImg leftTitle='热门活动' rightTitle={'共' + total + "个"} callBackLeftIcon={() => {
                return (
                  <View >
                    <Icon name='ios-flame'
                      size={20}
                      style={styles.leftImgStyle}
                    />
                  </View>
                )
              }} />
            </View>
          );
        }}
        renderFooterCallback={() => {
          return <View style={{ marginTop: 10, marginBottom: 10 }}></View>;
        }}
      >
      </CommonListView>
    )

    // if (data == null || data.length == 0) {
    //   return
    // }
    // let ActivityItems = [];
    // for (let i = 0; i < data.length; i++) {
    //   let rowData = data[i];
    //   ActivityItems.push(<ActivityItem rowData={rowData}
    //     onSelect={() => this._pushActivityDetail(rowData)}
    //     key={rowData._id}
    //   />)
    // }

    // return ActivityItems
  }


  _pushTeamDetail(teamId) {
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

  _pushActivityDetail(activityId) {
    let { navigator } = this.props;
    if (navigator) {
      navigator.push({
        name: 'activityDetail',
        component: ActivityDetail,
        params: {
          activityId: activityId,
        }
      })
    } else {
      alert(111)
    }

  }

}

const styles = StyleSheet.create({
  leftImgStyle: {
    marginRight: 6,
    borderRadius: 12,
    backgroundColor: '#eee',
    width: 20,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  topImgContainer: {
    width: width,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleView: {
  },
  listView: {
    paddingTop: 20,
    backgroundColor: 'white',
  },

});

