
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    AsyncStorage,
    Alert,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Title from '../commonView/title';
import AddActivityList from './addActivityList'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view';
import RenderActivityContent from '../Activity/renderActivityContent'
import InitJson from "../common/initJson";
import ImageUtils from '../common/iamgeUtils'

export default class AddActivity extends Component {

    static defaultProps = {
        isMulty: false,
        teamId: "",
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            data: null,
        };
        this._clearDataInfo = this._clearDataInfo.bind(this);

    }
    componentDidMount() {
        AsyncStorage.getItem('activityEditInfo').then((value) => {
            if (value == null || value == "undefined" || JSON.stringify(value) == {}) {
                InitJson.reActivityEditInfo();
            }
        })
    }

    _clearDataInfo() {
        Alert.alert('温馨提醒', '你确定要清空吗?', [
            { text: '取消' },
            {
                text: '确定', onPress: () => {
                    InitJson.reActivityEditInfo();
                    ImageUtils.cleanImage();
                    this.refs.b.refreshData();
                    ToastAndroid.show('咻咻~', ToastAndroid.SHORT)
                }
            }
        ])
    }

    render() {
        let data = this.props.data;
        return (
            <View style={styles.container}>
                <Title title='办活动'
                    leftView={true}
                    navigator={this.props.navigator}
                    rightClearView={true}
                    rightClick={() => { this._clearDataInfo() }}
                >
                </Title>
                <ScrollableTabView
                    renderTabBar={() => <DefaultTabBar />}
                    tabBarPosition='top'
                    tabBarActiveTextColor='rgba(255,0,0,0.5)'
                    tabBarUnderlineStyle={styles.underlineStyle}
                    onChangeTab={(obj) => {
                        if (obj.i == 1) {
                            this.refs.a._asyncGetActivityEditInfo();
                        }
                    }}
                >
                    <AddActivityList ref="b" teamId={this.props.teamId} tabLabel="编辑列表" navigator={this.props.navigator}/>

                    <RenderActivityContent ref="a" isEdit={true} tabLabel="视图列表" renderScrollView={true}/>

                </ScrollableTabView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    underlineStyle: {
        backgroundColor: 'rgba(255,0,0,0.5)'
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },

});








