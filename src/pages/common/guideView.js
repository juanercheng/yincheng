import React, { Component } from 'react';
import {View, Image, ScrollView, StyleSheet, Text, Dimensions, TouchableOpacity } from 'react-native';
import {Carousel} from 'antd-mobile-rn'
let image1 = require('../../../images/1.png');
let image2 = require('../../../images/start.png');
let image3 = require('../../../images/home/location1.png');

const { width, height } = Dimensions.get('window');
export default class guideView extends Component {

    constructor() {
        super();
    };

    _onselectedIndexChange (index) {
        /* tslint:disable: no-console */
        console.log('change to', index)
    }

    render() {
        return (
            <Carousel style={styles.wrapper}
                      autoplayTimeout={2}
                      selectedIndex={2}
                      autoplay={false}
                      infinite={false}
                      afterChange={this._onselectedIndexChange}>
                <View style={[styles.container]}>
                    <Image source={image2}
                           style={styles.backgroundImage} />
                </View>
                <View style={[styles.container]}>
                    <Image source={image1}
                           style={styles.backgroundImage} />
                </View>
                <View style={[styles.container]}>
                    <Image source={image3}
                           style={styles.backgroundImage} />
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={() => {this.props.navigation.navigate('LoginIndex');}}>
                        <Text style={styles.btnText}>立即体验</Text>
                    </TouchableOpacity>
                </View>
            </Carousel>
        )
    }
};
var styles = StyleSheet.create({
    wrapper: {
        height:height,
        backgroundColor:'#fff'
    },
    backgroundImage: {
        width:width,
        height:height
    },
    btn:{
        position:'absolute',
        left:'12%',
        top:'70%',
        width:'74%',
        // height:40,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        marginTop:55,
        marginBottom:104,
        borderWidth:2,
        borderColor:'#54B1FF',
        borderRadius:10
    }
});