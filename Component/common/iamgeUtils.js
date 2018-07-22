import {
    NativeModules,
} from 'react-native';
import request from './request'
import config from './config'
var ImagePicker = NativeModules.ImageCropPicker;
/**
 * 上传照片Util
 */
export default class ImageUtils {
    constructor(imgWidth = 100, imgHeight = 100) {
        this.imgWidth = Math.ceil(imgWidth);
        this.imgHeight = Math.ceil(imgHeight);
    }

    //选择一张图片 (编辑,圆形编辑)
    pickSingle = (cropit, circular = false, includeBase64 = false) => {
        return ImagePicker.openPicker({
            includeBase64: includeBase64,
            width: this.imgWidth,
            height: this.imgHeight,
            cropping: cropit,
            cropperCircleOverlay: circular,
            compressImageMaxWidth: this.imgWidth,
            compressImageMaxHeight: this.imgHeight,
            compressImageQuality: 1,
            includeExif: true,
        })
    }


    //选择多张图片
    pickMultiple = (includeBase64 = false) => {
        return ImagePicker.openPicker({
            includeBase64: includeBase64,
            multiple: true,
            waitAnimationEnd: false,
            includeExif: true,
        })
    }

    //从相机拍照
    pickSingleWithCamera = (cropping, includeBase64 = false) => {
        return ImagePicker.openCamera({
            includeBase64: includeBase64,
            cropping: cropping,
            width: this.imgWidth,
            height: this.imgHeight,
            includeExif: true,
        })
    }

    //清理临时文件
    clean = () => {
        return ImagePicker.clean()
    }

    static cleanImage = () => {
        return ImagePicker.clean()
    }

    static getMac = (params) => {
        let uri = config.uri.image + params.type + "/" + params.id + "/" + config.image.mac; //拼装restful url
        // let uri = config.uri.activity + config.activity.mac;
        return request.post(uri)
    }


}