import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Picker,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import Title from './Component/commonView/title';
import CommonButton from './Component/commonView/CommonButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { fetchRegister } from "./Component/common/fetch"
const { width, height } = Dimensions.get('window');
export default class Register extends Component {

  static defaultProps = {
  }; //

  constructor(props) {
    super(props);//这一句不能省略，照抄即可
    this.state = {
      username: '',
      password: '',
      type: 0,
      //
      loginWay: true,
      codeAlreadySend: false,
      seconds: 6,
      isLogging: false,
    };
  }

  _fetchRegister = () => {
    let name = this.state.username;
    let password = this.state.password;
    let type = this.state.type;
    let str1 = /[0-9]{6,}/g;
    if (name == "" || password == "") {
      ToastAndroid.show('用户名密码不能为空', ToastAndroid.SHORT);
      return;
    }
    if(str1.test(password)){
      ToastAndroid.show('密码长度过短', ToastAndroid.SHORT);
    }
    // alert(this.state.username + "_" + this.state.password + "_" + this.state.type)
    fetchRegister(name, password, type)
      .then((data) => {
        // alert(data);
        if (data == 0) {
          //成功
          ToastAndroid.show('注册成功,请登录', ToastAndroid.SHORT);
          this.props.navigator.pop();
        } else if (data == 1) {
          //重复
          ToastAndroid.show('账号重复', ToastAndroid.SHORT);
        }
      })
      .catch((err) => {
        ToastAndroid.show('出了点小问题...', ToastAndroid.SHORT);
        alert(err);
      })
  }


  _renderTextInput = () => {
    return (
      <View style={styles.signupBox}>
        <Text style={styles.title}>用户注册</Text>
        <TextInput
          placeholder='您的账号'
          autoCapitalize={'none'}
          autoCorrect={false}
          underlineColorAndroid='transparent'
          style={styles.inputField}
          value={this.state.username}
          keyboardType={"email-address"}
          onChangeText={(text) => {
            this.setState({
              username: text
            });
          }}

        />
        <TextInput
          placeholder='您的密码'
          autoCapitalize={'none'}
          autoCorrect={false}
          keyboardType={"email-address"}
          underlineColorAndroid='transparent'
          style={styles.inputField}
          onChangeText={(text) => {
            this.setState({
              password: text
            });
          }}
          secureTextEntry={true}
        />
        <View style={{ flexDirection: "row" }}>
          <View style={{ flex: 0.3, justifyContent: "center" }}>
            <Text style={{ color: "#aaa", fontSize: 17 }}>用户类型</Text>
          </View>
          <View style={{ flex: 0.7 }}>
            {this._renderPicker()}
          </View>
        </View>
        <TouchableOpacity onPress={() => { this._fetchRegister() }}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>注册</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    return (
      <View >
        <Title title='注册' leftView={true} navigator={this.props.navigator}></Title>
        {this._renderTextInput()}
      </View>
    );
  }

  _renderPicker = () => {
    let dataArr = [
      {
        label: "老人",
        value: "0"
      },
      {
        label: "子女",
        value: "1"
      }
    ]
    let itemCellArr = [];
    let firCell = null;
    dataArr.forEach((dataObj, i) => {
      if (dataObj.value == this.state.type) {
        firCell = <Picker.Item key={i} label={dataObj.label} value={dataObj.value} />
      } else {
        itemCellArr.push(<Picker.Item key={i} label={dataObj.label} value={dataObj.value} />)
      }
    })
    if (firCell != null) {
      itemCellArr.unshift(firCell);
    }
    return (
      <Picker
        prompt={"用户类型"}
        style={{ color: "green" }}
        onValueChange={(value) => { this.setState({ type: value }) }}>
        {itemCellArr}
      </Picker >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },

  ImgStyle: {
    marginTop: 15,
    borderRadius: 20,
    backgroundColor: '#eee',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  signupBox: {
    marginTop: 30,
    padding: 10,
  },

  title: {
    marginBottom: 20,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#555'
  },

  inputField: {
    height: 40,
    padding: 5,
    color: '#666',
    fontSize: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    borderColor: '#ee735d'

  },
  inputField2: {
    flex: 1,
    height: 40,
    padding: 5,
    color: '#666',
    fontSize: 16,
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 10,
    borderColor: '#ee735d'

  },

  verifyCodeBox: {
    height: 40,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  countDownBox: {
    width: 100,
    height: 40,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: '#eee',
    borderColor: '#ee735d',
    marginLeft: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',

  },

  countDownText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600'
  },

  btn: {
    height: 40,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ee735d',
  },
  btnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ee735d'
  },

});

