/**
    TODO 权限修改
    TODO 加入社团
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
    Image,
    TouchableOpacity,
} from 'react-native';
import config from '../common/config';
import request from '../common/request';
import Utils from '../common/utils'
import CommonSwiper from '../commonView/CommonSwiper'
import CommonCellImg from '../commonView/CommonCellImg'
import Icon from 'react-native-vector-icons/Ionicons';
import TeamInfoEdit from './teamInfoEdit'
import TeamMemberBe from './TeamMemberBe';
import Avatar from './../commonView/avatar';
var TeamContentJson = require('../../LocalData/TeamContent.json')
const { width, height } = Dimensions.get('window');


export default class sos extends Component {

    static defaultProps = {
        teamId: '',
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            data: null,
        };
        //callback
        this._callBackClickCell = this._callBackClickCell.bind(this);
        //push
        this._pushDetailEdit = this._pushDetailEdit.bind(this);
        this._pushTeamMemberBe = this._pushTeamMemberBe.bind(this);
        //render
        this._rendercontentInfo = this._rendercontentInfo.bind(this);
        this._renderContentCommonListBox = this._renderContentCommonListBox.bind(this);
        this._renderCommonCellImg = this._renderCommonCellImg.bind(this);
        this._renderAvatarBox = this._renderAvatarBox.bind(this);
        //fetch
        this._fetchTeamDetailById = this._fetchTeamDetailById.bind(this);

    }


    componentDidMount() {
        let teamId = this.props.teamId;
        let data = {
            id: teamId,
        }
        if (teamId != "") {
            this._fetchTeamDetailById(data);
        }
    };

    _fetchTeamDetailById(data) {
        let url = config.uri.team + config.team.detailVo;
        request.post(url, data)
            .then((result) => {
                if (result && result.success) {
                    this.setState({
                        data: result.data
                    })
                }
            }).catch((err) => {
                console.log(err);
            })
    }


    render() {
        let data = this.state.data;
        if (data == null) {
            return null;
        }
        let {
            teamInfo: teamInfoArr,
            connectWay: connectWayArr,
            teamRequire: teamRequireArr,
            teamSwipimg: ImageArr,
            } = data;
        // let ImageArr = TeamContentJson.teamImg;
        // let {
        //     teamInfo: teamInfoArr,
        //     connectWay: connectWayArr,
        //     teamRequire: teamRequireArr,
        // } = TeamContentJson;
        return (
            <ScrollView>
                <View style={styles.container}>
                    <CommonSwiper imageArr={ImageArr} />
                    {this._rendercontentInfo(teamInfoArr, "社团介绍", "快速了解社团哦", "ios-information")}
                    {this._renderContentCommonListBox(teamInfoArr, "社团信息", "详细组成", "ios-information")}
                    {this._renderContentCommonListBox(connectWayArr, "联系方式", "快加入我们吧", "ios-information")}
                    {this._renderContentCommonListBox(teamRequireArr, "报名条件", "看看符不符合条件叭", "ios-information")}
                    <TouchableOpacity onPress={() => { this._pushTeamMemberBe() }}>
                        <View style={styles.btn}>
                            <Text style={styles.btnText}>加入我们</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    _renderAvatarBox(dataArr) {
        let imgUrl = ""
        for (let { dataKey, dataValue } of dataArr) {
            if (dataKey == "teamAvatar") {
                imgUrl = dataValue
                break;
            }
        }
        let avatarCell = <Avatar imgUrl={imgUrl} avatarStyle={styles.avatar} noAvatarStyle={[styles.avatar, { backgroundColor: "#eee" }]}></Avatar>
        return (
            <View style={styles.imgBox}>
                {avatarCell}
            </View>
        )

    }

    //第一个模块:社团介绍模块
    _rendercontentInfo(dataArr, leftTitle, rightTitle, iconName) {
        let cellArr = [];
        let cell2 = null;
        let cell = null;
        let dataArrAfterFilter = dataArr.filter((dataObj) => {
            let dataKey = dataObj.dataKey;
            return !(dataKey == "teamAvatar")
        })
        for (let { dataValue, dataKey, lable } of dataArrAfterFilter) {
            if (dataKey == "teamIntroduction") {
                cell =
                    <View key={1}>
                        {this._renderCommonCellImg(leftTitle, rightTitle, iconName, dataArrAfterFilter)}
                        <View style={styles.infoBox}>
                            {this._renderAvatarBox(dataArr)}
                            <View style={styles.contentCommonBox2}>
                                <Text style={styles.contentLable} selectable={true}>{lable} :</Text>
                                <Text style={styles.contentCommonText}>{dataValue}</Text>
                            </View>
                        </View>
                    </View>
                cellArr.push(cell)
                continue;
            }
            else if (dataKey == "teamName") {
                cell2 =
                    <View style={styles.contentTitleBox} key={2}>
                        <Text style={styles.contentTitleText} selectable={true}>{dataValue}</Text>
                    </View>
                continue;
            }
        }
        cellArr.unshift(cell2);
        return cellArr;
    }



    //每个模块
    _renderContentCommonListBox(dataArr, leftTitle, rightTitle, iconName) {
        let dataArrAfterFilter = dataArr.filter((dataObj) => {
            let dataKey = dataObj.dataKey;
            return !(dataKey == "teamName" || dataKey == "teamIntroduction" || dataKey == "teamAvatar" || dataKey == "teamBackimg")
        })
        return (
            <View>
                {this._renderCommonCellImg(leftTitle, rightTitle, iconName, dataArrAfterFilter)}
                <View style={styles.contentBox}>
                    {this._rendercontentCommonList(dataArrAfterFilter)}
                </View>
            </View>
        )
    }
    //每个模块上面的标题栏
    _renderCommonCellImg(leftTitle, rightTitle, iconName, dataArr) {
        return (
            <CommonCellImg leftTitle={leftTitle} rightTitle={rightTitle} callBackLeftIcon={() => {
                return (
                    <View >
                        <Icon name={iconName}
                            size={20}
                            style={styles.leftImgStyle}
                        />
                    </View>
                )
            }}
            />
        )
    }

    //每个模块里面的数据
    _rendercontentCommonList(dataArr) {
        let cellArr = [];
        dataArr.forEach((dataObj, i) => {
            let dataValue = dataObj.dataValue;
            let lable = dataObj.lable;
            var cell =
                <View style={styles.contentCommonBox} key={i}>
                    <Text style={styles.contentLable} selectable={true}>{lable} :</Text>
                    <Text style={styles.contentCommonText}>{dataValue}</Text>
                </View>
            cellArr.push(cell);
        })
        return cellArr;
    }







    _callBackClickCell(dataArr, isMulty) {
        if (isMulty == null && isMulty == 'undefined') {
            isMulty == false;
        }
        this._pushDetailEdit(dataArr, isMulty);
    }

    _pushTeamMemberBe() {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'teamMemberBe',
                component: TeamMemberBe,
                params: {
                    teamId: this.props.teamId,  //社团id
                }
            })
        } else {
            alert('跳转失败')
        }
    }

    _pushDetailEdit(dataArr, isMulty) {
        let { navigator } = this.props;
        if (navigator) {
            navigator.push({
                name: 'TeamInfoEdit',
                component: TeamInfoEdit,
                params: {
                    data: dataArr, //需要编辑的信息数组
                    isMulty: isMulty, //是否多行显示
                    //社团id
                }
            })
        } else {
            alert('跳转失败')
        }
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
    infoBox: {
        marginLeft: 20,
        marginRight: 20,
        marginTop: 10,
        marginBottom: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
        flexDirection: "row",
    },
    imgBox: {
        marginTop: 5,
        marginBottom: 5,

    },
    contentCommonBox2: {
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginLeft: 20,
        marginTop: 10,
        marginBottom: 10,
    },


    contentCommonList: {
        marginLeft: 10,
    },
    leftImgStyle: {
        marginRight: 6,
        borderRadius: 12,
        backgroundColor: '#eee',
        width: 20,
        textAlign: 'center',
    },
    contentTitleText: {
        fontSize: 20,
        color: 'black',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    contentCommonBox: {
        marginTop: 5,
        marginBottom: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    contentCommonText: {
        marginLeft: 10,
    },
    contentLable: {
        color: 'black',
        fontWeight: 'bold',
        marginLeft: 10,
    },
    contentTitleBox: {
        marginTop: 10,
        alignItems: 'center',
        marginBottom: 10,
    },
    contentBox: {
        marginTop: 10,
        marginBottom: 20,
        marginLeft: 20,
        marginRight: 20,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 10,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});








