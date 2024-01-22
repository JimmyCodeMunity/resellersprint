import { StyleSheet, Text, View,SafeAreaView,Image } from 'react-native'
import React, { useState,useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Navigation } from 'react-native-feather';
import { StatusBar } from 'expo-status-bar';
import LottieView from "lottie-react-native";

const SplashScreen = ({navigation}) => {
    const [mail,setMail] = useState('')
    useEffect(()=>{
        setTimeout(()=>{
            CheckLogin()

        },3000)
    },[]);


    //check login status
    const CheckLogin = async()=>{
        const email = await AsyncStorage.getItem("email");
        setMail(email)


        if(email != null){
            navigation.navigate('Home')
        }else{
            navigation.navigate('First');
        }

    }
  return (
    <SafeAreaView className="flex-1 justify-center items-center" style={{ backgroundColor:'orange' }}>
        <StatusBar style="light"/>
        <View className="justify-center items-center" >
            <View>
            <LottieView
            className="justify-center items-center" style={{ width: '80%', }}
            source={require("../assets/anim.json")}
            autoPlay
            loop={false}
            onAnimationFinish={() => {
              
            }}
          />
            </View>
            <View>
                <Text className="text-white font-bold text-3xl py-8">ResellerSprint</Text>
            </View>
        </View>
        <View className="absolute" style={{ bottom:10 }}>
      <Text>Version 1.0</Text>
      </View>
    </SafeAreaView>
  )
}

export default SplashScreen

const styles = StyleSheet.create({})