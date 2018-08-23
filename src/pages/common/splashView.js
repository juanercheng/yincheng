//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,Animated,Dimensions,Image ,TouchableOpacity,Easing} from 'react-native';
import GetSetStorage from '../../js/GetSetStorage';

const splashImg = require('../../../images/start.png');//加载图片

const { width, height } = Dimensions.get('window');
// create a component
class splashView extends Component {
    constructor(props) {
        super(props);
        this.state = {  //这是动画效果
            bounceAnimValue:new Animated.Value(0),
            opacityAnimValue:new Animated.Value(1),
        };
    }
    componentDidMount() {
        Animated.timing(
            this.state.bounceAnimValue,
            {
                toValue:1,
                duration:100,
                easing:Easing.linear,
            }
        ).start();
        console.log('result')
        GetSetStorage.getStorageAsync('isFirst').then((result) => {
            console.log(result,'result')
            if (result === null || result === '') {

                //第一次启动
                GetSetStorage.setStorageAsync('isFirst', 'true');
                this.props.navigation.navigate('GuideView');
            } else {
                //检查token
                GetSetStorage.getStorageAsync('token').then((result) => {
                    console.log(result,'result')
                    if(result == null){
                        this.timer = setTimeout(() => {
                            this.props.navigation.navigate('LoginIndex');
                        }, 3000);
                    }else{
                        this.timer = setTimeout(() => {
                            this.props.navigation.navigate('Home');
                        }, 3000);
                    }
                }).catch((error) => {
                    console.log('==========================');
                    console.log('系统异常' + error);
                    console.log('==========================');
                });
                
            }
        }).catch((error) => {
            console.log('==========================');
            console.log('系统异常' + error);
            console.log('==========================');
        });
    }

    componentWillUpdate = () => {
        this.timer && clearTimeout(this.timer);
    };

    render() {
        return (
            <View style={[styles.WelcomeContainer]}>
                <Image source={splashImg}
                       style={[styles.backgroundImage]} />
                <Text style={styles.info}>只做一手单</Text>
                <Text style={styles.info}>每位客户只推给一位客户经理</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    WelcomeContainer: {
        width: width,
        height: height,
        backgroundColor:'#fff',
        flexDirection:"column",
        justifyContent:'center',
        alignItems:'center',
        // paddingTop:'33%'
    },
    backgroundImage: {
        marginBottom:27
    },
    btn:{
        width:'74%',
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center',
        marginTop:55,
        marginBottom:104,
        borderWidth:2,
        borderColor:'#54B1FF',
        borderRadius:10
    },
    btnText:{
        fontSize:18,
        color:'#54B1FF',
        paddingTop:11,
        paddingBottom:11
    },
    info:{
        color:'#C4CEDE',
        fontSize:18,
    }
});

//make this component available to the app
export default splashView;