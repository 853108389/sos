/**
TODO
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TextInput,
    Dimensions,
    ToastAndroid,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Title from '../commonView/title';
import AutoExpandingTextInput from '../commonView/AutoExpandingTextInput'
import DeviceStorage from '../common/deviceStorage';
const { width, height } = Dimensions.get('window');
export default class AddActivityItemEdit extends Component {

    static defaultProps = {
        dataKey: '',
        data: null,
        isMulty: false,
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            content: '',//TextInput的值
        };
        this._changeDataInfo = this._changeDataInfo.bind(this);
        this._renderContentCommonListBox = this._renderContentCommonListBox.bind(this);
        this._setContentValue = this._setContentValue.bind(this);
        this._saveDataInfo = this._saveDataInfo.bind(this);
        this._fetchUpdataData = this._fetchUpdataData.bind(this);
        this._asyncUpdateData = this._asyncUpdateData.bind(this);

    }

    render() {
        let data = this.props.data;
        return (
            <ScrollView style={styles.container}>
                <Title
                    title='编辑'
                    leftView={true}
                    navigator={this.props.navigator}
                    rightSaveView={true}
                    rightClick={() => { this._saveDataInfo() }}
                >
                </Title>
                <View style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10 }}>
                    <Icon name='ios-information'
                        size={20}
                        style={styles.leftImgStyle}
                    />
                    <Text>提示: 换行后会自动分点(请勿使用空格换行)</Text>
                </View>
                {this._renderContentCommonListBox(this.props.leftTitle, data)}

            </ScrollView>
        );
    }

    componentDidMount() {
        if (this.props.data == null) {
            return;
        }
        this._setContentValue(this.props.data);
        // alert(width/)
    }

    _changeDataInfo(value) {
        this.setState({
            content: value
        });
    }

    _renderContentCommonListBox(lable, dataArr) {
        // alert(this._getContentValue(dataArr))
        return (
            <View style={styles.contentCommonBox} >
                <View style={styles.test}>

                    <AutoExpandingTextInput
                        value={this.state.content}
                        placeholder='请输入...'
                        placeholderTextColor='#ddd'
                        underlineColorAndroid='transparent'
                        autoCorrect={false}
                        blurOnSubmit={false}
                        autoCapitalize={'none'}
                        onChangeText={(text) => {
                            this._changeDataInfo(text);
                        }}
                    />
                </View>
            </View>
        )
    }

    _setContentValue(dataArr) {
        let contentValue = '';
        dataArr.forEach((dataObj, i) => {
            let dataValue = dataObj.dataValue;
            contentValue = contentValue + `${dataValue} \n`;
        })
        this.setState({
            content: contentValue
        })
    }

    _saveDataInfo() {
        let dataKey = this.props.dataKey;
        //1.将##拆成数组,重构成数组对象
        let contentArr = this.state.content.split("\n");
        let dataArr = [];
        if (dataKey === "activityInfo") {
            //TODO
        }
        contentArr.forEach((content, i) => {
            content = content.trim();
            if (content != "") {
                let j = i + 1;
                let dataObj =
                    {
                        "id": j,
                        "lable": j + "",
                        "dataKey": dataKey + j,
                        "dataValue": content,
                    }
                dataArr.push(dataObj);
            }
        })
        // alert(JSON.stringify(dataArr))
        this._fetchUpdataData(dataArr);
    }


    _fetchUpdataData(data) {
        //更新策略
        let asyncFlag = true;  //是否更新本地
        let updateFlag = true; //是否更新服务器
        if (this.props.ansyKey == '' || this.props.ansyKey == null || typeof (this.props.ansyKey) == "undefined") {
            //没传本地储存key
            asyncFlag = false;
        } else if (this.props.url == '' || this.props.url == null || typeof (this.props.url) == "undefined") {
            //没传服务器更新url
            updateFlag = false;
        }
        console.log(asyncFlag + "-" + updateFlag)
        let dataKey = this.state.dataKey
        //更新自己的服务器
        let url = this.props.url;
        if (updateFlag) {
            request.post(url, data)
                .then((result) => {
                    if (result && result.success) {
                        // alert(JSON.stringify(data));
                        //TODO自己去实现 从服务器返回的数据里去更新本地的data state
                        if (asyncFlag) {
                            this._asyncUpdateData(data);
                        } else {
                            ToastAndroid.show("更新完毕~", ToastAndroid.SHORT)
                            //更新完本地数据后,执行回调,更新上一个视图
                            if (this.props.saveDataCallBack != null) {
                                this.props.saveDataCallBack(data, dataKey);
                            }
                            this._closeModal();
                            this._clearContent();
                        }
                    }
                }).catch((err) => {
                    console.log(err);
                })
        } else {
            if (asyncFlag) {
                this._asyncUpdateData(data);
            } else {
                ToastAndroid.show("无url也无ansyKey", ToastAndroid.SHORT)
            }
        }
    }


    _asyncUpdateData(data) {
        let dataKey = this.props.dataKey;
        let ansyKey = this.props.ansyKey;
        //更新信息到：自己的服务器  本地
        DeviceStorage.get(ansyKey).then((value) => {
            value[dataKey] = data
            // data已经有key了
            // alert(JSON.stringify(value) +"*********************"+JSON.stringify(data))
            return value
        }).then((value) => {
            // alert(JSON.stringify(value))
            DeviceStorage.save(ansyKey, value).then(() => {
                ToastAndroid.show('保存成功~', ToastAndroid.SHORT);
                //更新完本地数据后,执行回调,更新上一个视图
                if (this.props.saveDataCallBack != null) {
                    this.props.saveDataCallBack(value, dataKey);
                }
            })
        })
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
    test: {
        backgroundColor: "#eee",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
});








