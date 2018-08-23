/**
 * Created by ChengJuan by 18-03-15
 */
import React from 'react';
import {StackNavigator} from 'react-navigation';
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator';

import classifyHome from './../classify/classifyHome';
import customerDetails from './../classify/customerDetails';

const ClassifyPages = StackNavigator({
    classifyHome: {
        screen: classifyHome,
        navigationOptions: {
            header: null
        }
    },
    customerDetails: {screen: customerDetails,navigationOptions: {header: null,tabBarVisible: false},},
}, {
    headerMode: 'float',
    transitionConfig: () => ({
        screenInterpolator: CardStackStyleInterpolator.forHorizontal,
    })
});
export default ClassifyPages;