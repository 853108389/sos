/**
TODO
 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Icon from 'react-native-vector-icons/Ionicons';
export default class CommonChooseImage extends Component {

  static defaultProps = {
    uri: '',
  }; //

  constructor(props) {
    super(props);//这一句不能省略，照抄即可
    this.state = {
      showFlag: false,
    };
  }

  isChoose = () => {
    return this.state.showFlag;
  }

  getUri = () => {
    return this.props.uri;
  }

  _renderImage2 = () => {
    let showFlag = this.state.showFlag;
    let uri = this.props.uri;
    let flagCell = null;
    if (showFlag) {
      flagCell = <Icon name='ios-checkmark-circle-outline' size={25} style={{ color: "green", position: "absolute", right: 5, bottom: 5 }} />
    } else {
      flagCell = <Icon name='ios-radio-button-off' size={25} style={{ color: "white", position: "absolute", right: 5, bottom: 5 }} />
    }
    let cell =
      <TouchableWithoutFeedback onPress={() => {
        this.setState({
          showFlag: !this.state.showFlag,
        })
      }}>
        <Image style={styles.imageStyle} source={{ uri: uri }} >
          {flagCell}
        </Image>
      </TouchableWithoutFeedback>
    return cell;

  }


  render() {
    return (
      <View style={styles.container}>
        {this._renderImage2()}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  imageStyle: {
    width: width / 2,
    height: 190 / 2,
    resizeMode: 'stretch',
    borderWidth: 1,
    borderColor: "#C0FF3E"
  },
});








