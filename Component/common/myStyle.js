'use strict'
import {
    Dimensions,
} from 'react-native';
const { width, height } = Dimensions.get('window');
/**
 * 抽取公共的样式  style={[styles.dropdown_2, { ...this.props.style }]}
 */
const params = {
    activity: {
        width: width,
        height: 240,
    }
}

const myStyle = {
    activity: {
        img: {
            imgBox: {
                width: params.activity.width,
                height: params.activity.height,
                backgroundColor: '#ddd',
                borderWidth: 1,
                borderColor: "#C0FF3E",
            },
            imageStyle: {
                width: params.activity.width,
                height: params.activity.height,
            }
        }
    },
    account: {
        img: {
            avatar: {
                width: width * 0.2,
                height: width * 0.2,
                borderRadius: width * 0.1,
                borderWidth: 1,
                borderColor: 'white',
                resizeMode: 'cover',
            },
            noAvatar: {
                width: width * 0.2,
                height: width * 0.2,
                borderRadius: width * 0.1,
                borderWidth: 1,
                borderColor: 'white',
                backgroundColor: "#ccc"
            },
            backImg: {
                width: width,
                height: 190,
            },
        }
    },
    team: {
        img: {
            swiper: {
                width: width,
                height: 190,
            }
        }
    }
}

module.exports = myStyle