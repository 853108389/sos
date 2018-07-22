import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ToastAndroid
} from 'react-native'
import config from '../common/config';
import request from '../common/request';
import Title from '../commonView/title';
import CommonCellsWithModal from '../commonView/CommonCellsWithModal';
import CommonCellImg from './../commonView/CommonCellImg';
import Icon from 'react-native-vector-icons/Ionicons';
import AddActivityItemEdit from './../Activity/addActivityItemEdit';

export default class TeamInfoEdit2 extends Component {

    static defaultProps = {
        teamId: '',
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            data: null,
        };
        //fetch
        this._fetchTeamDetailById = this._fetchTeamDetailById.bind(this);
        this._fetchUpdateTeamInfo = this._fetchUpdateTeamInfo.bind(this);
        this._pushActivityItemEdit = this._pushActivityItemEdit.bind(this)
        this._saveDataCallBack = this._saveDataCallBack.bind(this);
    }

    render() {
        let data = this.state.data;
        if (data == null) {
            return <View></View>
        }
        let { connectWay, teamInfo, teamRequire } = data
        return (
            <ScrollView>
                <View style={styles.container}>
                    <Title title='修改社团信息' leftView={true} navigator={this.props.navigator}></Title>
                    {this._renderMiddleBoxView('社团信息', "共" + teamInfo.length + "条", teamInfo, "teamInfo")}
                    {this._renderMiddleBoxView('联系方式', "共" + connectWay.length + "条", connectWay, "connectWay")}
                    {this._renderMiddleBoxView('社团要求', "共" + teamRequire.length + "条", teamRequire, "teamRequire")}
                    <View style={styles.submitBox}>
                        <TouchableOpacity onPress={() => { this._fetchUpdateTeamInfo() }}>
                            <View style={styles.btn}>
                                <Text style={styles.btnText} >确认</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        )
    }

    _fetchUpdateTeamInfo() {
        let url = config.uri.team + config.team.update;
        let data = this.state.data;
        data.teamId = this.props.teamId;
        console.log(data);
        request.post(url, data)
            .then((result) => {
                if (result && result.success) {
                    ToastAndroid.show('修改成功', ToastAndroid.SHORT);
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    _fetchTeamDetailById() {
        let teamId = this.props.teamId;
        if (teamId == "") {
            return
        }
        let data = {
            id: teamId,
        }
        let url = config.uri.team + config.team.detailVo;
        request.post(url, data)
            .then((result) => {
                if (result && result.success) {
                    this.setState({
                        data: result.data
                    })
                    console.log("data222", result.data)
                }
            }).catch((err) => {
                console.log(err);
            })
    }

    componentDidMount() {
        this._fetchTeamDetailById();
    }

    _renderMiddleBoxView = (leftTitle, rightTitle, data, dataKey, isMulty = false) => {
        let params = {
            type: "team",
            id: this.props.teamId,
        }//用于图片上传时的参数
        let disStyle = { backgroundColor: "rgba(0,0,0,0.2)", }; //禁用颜色
        let disArr = [];
        let cellArr = [];
        if (dataKey === "teamInfo") {
            data.forEach((dataObj) => {
                switch (dataObj.dataKey) {
                    case "teamName":
                    case "teamType":
                    case "teamFoundtime":
                    case "teamStatus":
                        disArr.push(dataObj);
                        return;
                    default:
                        cellArr.push(dataObj);
                }
            });
            // TODO: 设置禁用的格子
            return (
                <View style={styles.middleBoxView}>
                    <View style={styles.middleView}>
                        <CommonCellImg leftTitle={leftTitle} rightTitle={rightTitle} callBackLeftIcon={() => {
                            return (
                                <View >
                                    <Icon name='ios-information'
                                        size={20}
                                        style={styles.leftImgStyle}
                                    />
                                </View>
                            )
                        }}
                        />
                    </View>
                    <CommonCellsWithModal params={params} ref={dataKey} isMulty={isMulty} data={cellArr} dataKey={dataKey}  ></CommonCellsWithModal>
                    <CommonCellsWithModal ref={dataKey} isMulty={isMulty} data={disArr} dataKey={dataKey} disStyle={disStyle}></CommonCellsWithModal>
                </View>
            )
        } else if (dataKey === "connectWay") {
            return (
                <View style={styles.middleBoxView}>
                    <View style={styles.middleView}>
                        <CommonCellImg leftTitle={leftTitle} rightTitle={rightTitle} callBackLeftIcon={() => {
                            return (
                                <View >
                                    <Icon name='ios-information'
                                        size={20}
                                        style={styles.leftImgStyle}
                                    />
                                </View>
                            )
                        }}
                        />
                    </View>
                    <CommonCellsWithModal ref={dataKey} isMulty={isMulty} data={data} dataKey={dataKey}  ></CommonCellsWithModal>
                </View>
            )
        } else {
            return (
                <View style={styles.middleBoxView}>
                    <View style={styles.middleView}>
                        <CommonCellImg leftTitle={leftTitle} rightTitle={rightTitle} callBackLeftIcon={() => {
                            return (
                                <View >
                                    <Icon name='ios-information'
                                        size={20}
                                        style={styles.leftImgStyle}
                                    />
                                </View>
                            )
                        }}
                            callBackClickCell={() => { this._pushActivityItemEdit(dataKey, data, isMulty) }}
                        />
                    </View>
                    <CommonCellsWithModal ref={dataKey} isMulty={isMulty} data={data} dataKey={dataKey}  ></CommonCellsWithModal>
                </View>
            )
        }

    }

    _pushActivityItemEdit(dataKey, data, isMulty = false) {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'addActivityItemEdit',
                component: AddActivityItemEdit,
                params: {
                    //当前数据
                    dataKey: dataKey,
                    ansyKey: "activityEditInfo",
                    data: data,
                    isMulty: isMulty,
                    saveDataCallBack: this._saveDataCallBack
                    //先本地储存  发布活动时统一上传到服务器
                }
            })
        } else {
            alert(111)
        }
    }

    _saveDataCallBack(activityEditInfo, dataKey) {
        this.refs[dataKey]._saveDataInfo(activityEditInfo[dataKey])
        this.setState({
            data: activityEditInfo,
        })
    }
}
const styles = StyleSheet.create({
    btn: {
        height: 40,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#ee735d',
        marginLeft: 20,
        marginRight: 20,
        marginBottom: 20,
    },
    btnText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ee735d'
    },
    submitBox: {
        marginBottom: 10,
        marginTop: 10
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    middleBoxView: {
        flex: 1,
    },
    middleView: {
        marginTop: 15,
    },
    leftImgStyle: {
        marginRight: 6,
        borderRadius: 12,
        backgroundColor: '#eee',
        width: 20,
        textAlign: 'center',
    },
});

