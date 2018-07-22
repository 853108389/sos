/*
    ListItem
*/
import React, { Component } from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    Image,
    Text,
    View,
    TouchableOpacity,
} from 'react-native';

import Dimensions from 'Dimensions';
import Icon from 'react-native-vector-icons/Ionicons';
import config from '../common/config';
import request from '../common/request';


const { width, height } = Dimensions.get('window');

export default class TeamIteamWithUser extends Component {
    static defaultProps = {
        clickCallBack:null,
    }
    constructor(props) {
        super(props);

        this.state = {
            rowData: this.props.rowData,
        }
        this._onclick = this._onclick.bind(this);
    }

    _onclick(){
        if(this.props.clickCallBack==null){
            return 
        }
        this.props.clickCallBack();
    }
    render() {
        let rowData = this.state.rowData;
        let imgCell = null;
        if(rowData.teamBackImg==null||rowData.teamBackImg==""){
            imgCell = <View style={[styles.imageViewStyle,{backgroundColor:'#eee'}]}></View>
        }else{
            imgCell =  <Image source={{ uri: rowData.teamBackImg }} style={styles.imageViewStyle} />
        }
        return (
            <TouchableOpacity onPress={()=>{this._onclick()}}>
                <View style={styles.listViewStyle}>
                    {/*左边*/}
                    {imgCell}
                    {/*右边*/}
                    <View style={styles.rightViewStyle}>
                        <View style={styles.rightTopViewStyle}>
                            <Text style={{fontSize:16,color:"black"}}>{rowData.teamName}</Text>
                        </View>
                        <Text style={{ color: 'gray' }}>{rowData.departmentName}:{rowData.userTeamType}</Text>
                        <View style={styles.rightBottomViewStyle}>
                            <Text style={{ color: 'red' }}>{rowData.teamType}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    listViewStyle: {
        backgroundColor: 'white',
        padding: 10,
        borderBottomColor: '#e8e8e8',
        borderBottomWidth: 0.5,
        flexDirection: 'row'
    },

    imageViewStyle: {
        width: 120,
        height: 90
    },

    rightViewStyle: {
        marginLeft: 8,
        width: 220,
        justifyContent: 'center'
    },

    rightTopViewStyle: {
        flexDirection: 'row',
        marginBottom: 7,
        justifyContent: 'space-between'
    },

    rightBottomViewStyle: {
        flexDirection: 'row',
        marginTop: 7,
        justifyContent: 'space-between'
    }
});

