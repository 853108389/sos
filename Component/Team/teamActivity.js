/**
TODO
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
} from 'react-native';
import config from '../common/config';
import request from '../common/request';
import ActivityItem from '../Activity/activityItem';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivityDetail from '../Activity/activityDetail';
const { width, height } = Dimensions.get('window');
export default class TeamActivity extends Component {

    static defaultProps = {
        teamId: "",
        total: "",
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            data: null,
        };
        this.pushActivityDetail = this.pushActivityDetail.bind(this);
        this._renderActivity = this._renderActivity.bind(this);
        this._fetchActivitysById = this._fetchActivitysById.bind(this);
    }

    _renderActivity() {
        let data = this.state.data;
        if (data == null || data.length == 0) {
            return
        }
        let ActivityItems = [];
        for (let i = 0; i < data.length; i++) {
            let rowData = data[i];
            ActivityItems.push(<ActivityItem rowData={rowData}
                onSelect={(activityId) => this.pushActivityDetail(activityId)}
                key={i}
            />)
        }
        return ActivityItems
    }

    _renderBar() {
        let total = this.state.total;
        if (total == null) {
            return
        }
        let cell =
            <View style={styles.topButton} >
                <Icon
                    name={"ios-medical-outline"}
                    size={20}
                    style={styles.icon}
                    color={"#ca710c"}
                />
                <Text style={styles.topButtonText}>总共: {total}</Text>
            </View>
        return cell;
    }

    _fetchActivitysById(data) {
        //更新自己的服务器
        let url = config.uri.team + config.team.activity;
        request.post(url, data)
            .then(
            (result) => {
                if (result && result.success) {
                    this.setState({
                        data: result.data,
                        total: result.total,
                    })
                }
            }
            ).catch((err) => {
                console.log(err);
            })
    }


    pushActivityDetail(activityId) {
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

    componentDidMount() {
        this._fetchActivitysById({
            id: this.props.teamId,
        });//从服务器获取的真实数据
    }


    render() {
        return (
            <ScrollView>
            <View style={styles.container}>
                {this._renderBar()}
                {this._renderActivity()}
            </View>
             </ScrollView>
        );
    }
}
const styles = StyleSheet.create({
    topButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        borderRightColor: '#ddd',
        justifyContent: "center",
        marginTop: 10,
        marginBottom: 10,
    },
    topButtonText: {
        marginLeft: 5,
    },
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








