import React from 'react';
import {View,StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';

export default function LoadingView({theme}){
    return(
        <View style={[styles.centered,{backgroundColor:theme.colors.background}]}>
            <ActivityIndicator size="large" />
        </View>
    );
}

const styles=StyleSheet.create({
    centered:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
});
