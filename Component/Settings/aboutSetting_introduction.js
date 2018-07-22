/**
TODO
 */

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Dimensions,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Title from "../commonView/title"
export default class Introduction extends Component {

    static defaultProps = {
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {

        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Title title='功能介绍' leftView={true} navigator={this.props.navigator}></Title>
                <ScrollView>
                    <View style={styles.infoBox}>
                        <View style={styles.block}>
                            <Text style={{ color: "green" }}>测试版V1.0.0</Text>
                            <Text>本产品主要用于解决现有的社团问题</Text>
                            <Text>已实现功能:</Text>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.title}>社团:</Text>
                            <Text style={styles.finish}>1.个性化社团信息设置</Text>
                            <Text style={styles.finish}>2.个性化社团部门管理</Text>
                            <Text style={styles.finish}>3.个性化社团成员管理</Text>
                            <Text style={styles.finish}>4.社团活动展示</Text>
                            <Text style={styles.finish}>5.社团搜索</Text>
                            <Text style={styles.finish}>6.社团排序</Text>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.title}>活动:</Text>
                            <Text style={styles.finish}>1.活动评论</Text>
                            <Text style={styles.finish}>2.活动展示</Text>
                            <Text style={styles.finish}>3.活动搜索</Text>
                            <Text style={styles.finish}>4.活动排序</Text>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.title}>用户:</Text>
                            <Text style={styles.finish}>1.个性化用户信息设置</Text>
                            <Text style={styles.finish}>2.其他用户信息查看</Text>
                            <Text style={styles.finish}>3.登入登出</Text>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.title}>消息:</Text>
                            <Text style={styles.finish}>1.用户申请社团消息及处理</Text>
                            <Text style={styles.finish}>2.社团邀请用户消息及处理</Text>
                            <Text>3.用户通信</Text>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.title}>设置:</Text>
                            <Text style={styles.finish}>1.是否隐藏个人信息</Text>
                            <Text style={styles.finish}>2.清理缓存</Text>
                        </View>
                        <View style={styles.block}>
                            <Text style={styles.title}>关于与反馈:</Text>
                            <Text style={styles.finish}>1.关于介绍</Text>
                            <Text style={styles.finish}>2.用户反馈</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    finish: { color: "#006633" },
    title: { color: "black", fontSize: 16 },
    block: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#eee',
        borderColor: "black",
        borderWidth: 1,
        padding: 10,
        width: width,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    infoBox: {
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: "center",
    }
});








