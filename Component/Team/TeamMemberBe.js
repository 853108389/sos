import React, { Component } from 'react'
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    Picker,
    ToastAndroid,
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import Title from './../commonView/title';
import AutoExpandingTextInput from './../commonView/AutoExpandingTextInput';
import CommonCellImg from '../commonView/CommonCellImg'
import config from '../common/config';
import request from '../common/request';
import DeviceStorage from './../common/deviceStorage';
const { width, height } = Dimensions.get('window');
export default class TeamMemberBe extends Component {

    static defaultProps = {
        teamId: "",
    }; //

    constructor(props) {
        super(props);
        this.state = {
            animationType: 'fade',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            isFinish: true,
            depNames: [],//所有的部门名称
            content: "",//文本內容
            depName: "",//选择的部门名称
            userId: "",//当前用户id
        };
        this._fetchAddTeamUser = this._fetchAddTeamUser.bind(this);
        this._changeDataInfo = this._changeDataInfo.bind(this);
        this._asyncGetUser = this._asyncGetUser.bind(this);
    }

    //TODO:
    _fetchAddTeamUser() {
        let content = this.state.content; //文本內容
        let depName = this.state.depName; //申请的部门名称
        let teamId = this.props.teamId;//当前社团的id
        let userId = this.state.userId;//当前用户的id
        let params = {
            messagesFromid: userId,//发送方id
            messagesFromtype: 1,//发送方的类型
            messagesToid: teamId,//接收方id
            messagesTotype: 0, //接收方类型 0社团 1用户
            messagesType: "200",//消息类型 用户申请加入社团
            messagesContent: content, //消息内容
            messagesParams: {
                depName: depName,//部门名称
            },
        }
        let url = config.uri.user + config.user.addMs; //申请加入消息的url
        request.post(url, params).then((result) => {
            if (result && result.success) {
                ToastAndroid.show('消息已发出,请耐心等候', ToastAndroid.SHORT);
            } else {
                ToastAndroid.show(result.message, ToastAndroid.SHORT);
            }
        })
    }

    /**
     * 获取用户id
     */
    _asyncGetUser() {
        DeviceStorage.get("user").then((value) => {
            this.setState({
                userId: value.userId,
            });
        })
    }

    /**
   * 获取部门信息
   */
    _fetchDepData() {
        let uri = config.uri.team + config.team.teamDeps;
        request.post(uri, { id: this.props.teamId }).then((result) => {
            if (result && result.success) {
                this.setState({
                    depNames: result.data,
                })
            }
        })
    }

    componentDidMount() {
        this._fetchDepData();
        this._asyncGetUser();
    }

    _changeDataInfo(value) {
        this.setState({
            content: value
        });
    }

    _renderPicker = () => {
        let depNames = this.state.depNames;
        let itemCellArr = [];
        let firCell = null;
        depNames.forEach((depName, i) => {
            if (depName == "主席团") {
            } else {
                if (depName == this.state.depName) {
                    firCell = <Picker.Item key={i} label={depName} value={depName} />
                } else {
                    itemCellArr.push(<Picker.Item key={i} label={depName} value={depName} />)
                }
            }
        })
        if (firCell != null) {
            itemCellArr.unshift(firCell);
        }
        return (
            <Picker
                prompt={"部门"}
                style={{ color: "red" }}
                onValueChange={(value) => { this.setState({ depName: value }) }}>
                {itemCellArr}
            </Picker>
        )
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Title title="社团申请" leftView={true} navigator={this.props.navigator}> </Title>
                <View style={{ borderBottomColor: "#ccc", marginBottom: 10, }}>
                    <CommonCellImg leftTitle={"选择你要加入的部门"} rightTitle={""} callBackLeftIcon={() => {
                        return (
                            <View >
                                <Icon name={"ios-arrow-down"}
                                    size={20}
                                    style={styles.leftImgStyle}
                                />
                            </View>
                        )
                    }}
                    />
                    {this._renderPicker()}
                    {/* <Picker
                        prompt={"部门"}
                        onValueChange={(depName) => this.setState({ depName: depName })}>
                        <Picker.Item label="Java" value="java" />
                        <Picker.Item label="JavaScript" value="js" />
                    </Picker> */}
                </View>
                <View style={{ borderBottomColor: "#ccc", marginBottom: 10 }}>
                    <CommonCellImg leftTitle={"申请留言"} rightTitle={""} callBackLeftIcon={() => {
                        return (
                            <View >
                                <Icon name={"ios-arrow-down"}
                                    size={20}
                                    style={styles.leftImgStyle}
                                />
                            </View>
                        )
                    }} />
                    <View style={{ marginTop: 5 }}>
                        <AutoExpandingTextInput
                            value={this.state.content}
                            placeholder='请输入...'
                            placeholderTextColor='#ddd'
                            autoCorrect={false}
                            blurOnSubmit={false}
                            autoCapitalize={'none'}
                            onChangeText={(text) => {
                                this._changeDataInfo(text);
                            }}
                        />
                    </View>
                </View>
                <TouchableOpacity onPress={() => { this._fetchAddTeamUser() }}>
                    <View style={styles.btn}>
                        <Text style={styles.btnText}>申请加入</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
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

});
