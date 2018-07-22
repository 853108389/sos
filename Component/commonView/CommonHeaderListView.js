import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ListView,
    Image,
    TouchableOpacity,
    PixelRatio
} from 'react-native';
export default class CommonHeaderListView extends Component {
    static defaultProps = {
        data: null,
        renderItemCallback: null,//dataRow
        renderSectionHeaderCallback:null,//sectionHeader
        renderHeaderCallback:null,//Header
    }; //

    constructor(props) {
        super(props);
        var getSectionData = (dataBlob, sectionID) => {
            return dataBlob[sectionID];
        };

        var getRowData = (dataBlob, sectionID, rowID) => {
            return dataBlob[sectionID + ':' + rowID];
        };

        this.state = {
            dataSource: new ListView.DataSource({
                getSectionData: getSectionData, // 获取组中数据
                getRowData: getRowData, // 获取行中的数据
                rowHasChanged: (r1, r2) => r1 !== r2,
                sectionHeaderHasChanged: (s1, s2) => s1 !== s2
            })
        };

        //render
        this._renderRow = this._renderRow.bind(this);
        this._renderSectionHeader = this._renderSectionHeader.bind(this);
        this._renderHeader = this._renderHeader.bind(this);
    }


    componentDidMount() {
        this.loadDataFromJason();
    }

    loadDataFromJason() {
        let jsonData = this.props.data;
        let dataBlob = {};
        let sectionIDs = [];
        let rowIDs = [];
        for (var i in jsonData) {
            //step 1、把组数据放入sectionIDs数组中
            sectionIDs.push(i);
            //step 2、把组中内容放dataBlob对象中
            dataBlob[i] = jsonData[i].title;  //"A"
            //step 3、取出该组中所有的数据
            data = jsonData[i].data;
            //step 4记录每一行中的数据
            rowIDs[i] = [];
            //step 5、获取行中每一组数据
            for (var j in data) {
                //把行号放入rowIDs中
                rowIDs[i].push(j);   /* */
                //把每一行中的内容放dataBlob对象中
                dataBlob[i + ':' + j] = data[j];
            }
        }
        // 更新状态
        this.setState({
            dataSource: this.state.dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs)
        });
    }

    render() {
        // removeClippedSubviews={false}
        return (
            <View style={styles.outerViewStyle}>
                {/*头部*/}
                <ListView
                    dataSource={this.state.dataSource}
                    renderHeader={this._renderHeader}
                    renderRow={this._renderRow}
                    renderSectionHeader={this._renderSectionHeader}
                />
            </View>
        );
    }

    _renderHeader(){
        if (this.props.renderHeaderCallback == null) {
            return null;
        }
        // 执行回调函数
        return (
            this.props.renderHeaderCallback()
        );
    }
    _renderRow(rowData) {
        // 判断处理
        if (this.props.renderItemCallback == null) {
            return null;
        }
        // 执行回调函数
        return (
            this.props.renderItemCallback(rowData)
        );
    }

    _renderSectionHeader(sectionData, sectionID) {
        // 判断处理
        if (this.props.renderSectionHeaderCallback == null) {
            return null;
        }
        // 执行回调函数
        return (
            this.props.renderSectionHeaderCallback(sectionData,sectionID)
        );
    }

}

// 设置样式
const styles = StyleSheet.create({
    outerViewStyle: {
        //占满窗口
        flex: 1
    },

  
});



