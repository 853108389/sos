
export default class Utils {
    /**
     * 分割字符串
     * @param {*} imgStr 
     */
    static imgStrSplit(imgStr) {
        if(imgStr==null || imgStr==""){
            return imgStr;
        }
        let imgArr = imgStr.split(",");
        return imgArr;
    }

}
