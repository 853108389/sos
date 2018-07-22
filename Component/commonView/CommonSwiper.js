//TODOloading图
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    TouchableWithoutFeedback,
} from 'react-native';
const { width, height } = Dimensions.get('window');
import Swiper from 'react-native-swiper';
export default class CommonSwiper extends Component {

    static defaultProps = {
        imageArr: [],
        clickCallBack: null,
    }; //

    constructor(props) {
        super(props);//这一句不能省略，照抄即可
        this.state = {
            swiperShow: false,
        };
        this._renderImage = this._renderImage.bind(this);
        this._clickCallBack = this._clickCallBack.bind(this);
        
    }

    render() {
        if (this.state.swiperShow) {
            return (
                <View style={styles.swiper} >
                    <Swiper
                        style={styles.swiper}
                        height={200}
                        horizontal={true}
                        paginationStyle={{ bottom: 10 }}
                        showsButtons={false}
                        autoplay={true}
                        autoplayTimeout={4}
                    >
                        {this._renderImage()}
                    </Swiper>
                </View>
            );
        } else {
            return (
                //TODOloading图
                <View style={{ height: 200, backgroundColor: "#eee" }}>
                </View>
            );
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({
                swiperShow: true
            });
        }, 0)
    }

    _clickCallBack(scolviewKey, scolviewWeburl) {
        if (this.props.clickCallBack != null) {
            this.props.clickCallBack(scolviewKey, scolviewWeburl);
        }
    }

    _renderImage() {
        let ImageViewArr = [];
        let imageArr = this.props.imageArr;
        if (imageArr == null) {
            return ImageViewArr;
        }
        if (this.props.clickCallBack != null) {
            imageArr.sort((a, b) => {
                return b.scolviewIndex - a.scolviewIndex;
            }).forEach((imageObj, i) => {
                // console.log(imageObj.scolviewIndex, imageObj.scolviewImgurl)
                ImageViewArr.push(<TouchableWithoutFeedback key={i} onPress={() => { this._clickCallBack(imageObj.scolviewKey, imageObj.scolviewWeburl) }}>
                    <Image source={{
                        uri: imageObj.scolviewImgurl
                    }} style={styles.img} />
                </TouchableWithoutFeedback>)
            })
        } else {
            imageArr.forEach((url, i) => {
                ImageViewArr.push(<Image key={i} source={{
                    uri: url
                }} style={styles.img} />)
            })
        }
        return ImageViewArr;
    }
}
const styles = StyleSheet.create({
    swiper: {
        width: width,
        height: 200,
    },
    img: {
        width: width,
        height: 200,
    }
});








