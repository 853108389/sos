// //download private file
// var getPolicy = new Auth.GetPolicy();
// let url = getPolicy.makeRequest('http://7xp19y.com2.z0.glb.qiniucdn.com/5.jpg');
// //fetch from this url

// //image sync operation
// var imgInfo = new ImgOps.ImageView(1, 100, 200);
// let url = imgInfo.makeRequest('http://7xoaqn.com2.z0.glb.qiniucdn.com/16704/6806d20a359f43c88f1cb3c59980e5ef');
// //fetch from this url

// //image info 
// var self = this;
// var imgInfo = new ImgOps.ImageInfo();
// let url = imgInfo.makeRequest('http://7xoaqn.com2.z0.glb.qiniucdn.com/16704/6806d20a359f43c88f1cb3c59980e5ef');
// fetch(url).then((response) => {
//     return response.text();
// }).then((responseText) => {
//     self.setState({ info: responseText });
// }).catch((error) => {
//     console.warn(error);
// });

// //resource operation
// //stat info
// var self = this;
// Rs.stat("<BUCKET> ", "<KEY>")
//     .then((response) => response.text())
//     .then((responseText) => {
//         self.setState({ info: responseText });
//     })
//     .catch((error) => {
//         console.warn(error);
//     });
import Qiniu, { Auth, ImgOps, Conf, Rs, Rpc } from 'react-native-qiniu';
import React, { Component, } from 'react'
import {
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Image,
} from 'react-native'
import IamgeUtils from '../common/iamgeUtils'
import config from '../common/config.js';
Conf.ACCESS_KEY = "DT66l5FkxNivhSD0zJKjXr_WccNtZwS4cppxlIzy";
Conf.SECRET_KEY = "jb8s3PfQVCRzp_LYG33_QHJ1ozN2krdaH7bNKkTF";
Conf.UP_HOST = "http://up-z2.qiniu.com"
//强烈不建议在客户端保存 AK 和 SK ，反编译后 hacker 获取到可以对你的资源为所欲为，建议通过安全渠道从服务器端获取。


export default class componentName extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imageUrl: '',
            num: '',
            source: '',
            imageNetUrl: '',
        }
    }

    render() {
        return (
            <View>
                <View>
                    <TouchableOpacity onPress={this.pick} style={styles.block}>
                        <View>
                            <Text>pick </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.upload} style={styles.block}>
                        <View>
                            <Text>upload </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.test} style={styles.block}>
                        <View>
                            <Text>test </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.block}>
                        <Text> {this.state.imageUrl}</Text>
                    </View>
                    <View style={styles.block}>
                        <Text>num :  {this.state.num}</Text>
                    </View>
                </View>
                <View style={{ marginLeft: 10 }}>
                    <Text selectable={true} >imageNetUrl:{this.state.imageNetUrl}</Text>
                    {this.state.imageNetUrl ?
                        <View style={{ width: 130, height: 130 }}>
                            <Image source={{ uri: this.state.imageNetUrl }} style={{ width: 130, height: 130 }} />
                        </View>
                        :
                        <View></View>
                    }
                    <Image source={{ uri: this.state.imageUrl }} style={{ width: 130, height: 130 }} />
                </View>
            </View>
        )
    }


    // TODO
    //注意key的一致性
    upload = () => {
        let params = {
            uri: this.state.imageUrl,
            key: "testaa",
            _aa: "aa",
            _bb: "bb",
        }
        let policy = {
            scope: "niangao-sos:testaa",
            returnBody:
                {
                    name: "$(fname)",
                    key: "$(key)",
                    size: "$(fsize)",
                    w: "$(imageInfo.width)",
                    h: "$(imageInfo.height)",
                    hash: "$(etag)",
                    _bb: "$(x:bb)",
                },
        }
        Rpc.uploadFile(params, policy).then((data) => {
            this.setState({
                imageNetUrl: config.imgUrl.base + data.key + "?",
            })
            console.log(JSON.stringify(data))
        }).catch((err) => {
            console.log(err)
        });
    }

    pick = () => {
        new IamgeUtils(100, 100).pickSingle(false).then((image) => {
            this.setState({
                imageUrl: image.path,
            }, () => {
                this.upload();
            })
        })
    }
}

const styles = StyleSheet.create({
    block: { width: 500, backgroundColor: 'red', height: 50, marginTop: 10 },
})