import {
    View,
    Text,
    SafeAreaView,
    Image,
    FlatList,
    Button,
    StyleSheet,
    Dimensions,
    TextInput,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import React, { useState } from 'react';
import AntIcon from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Icon from 'react-native-feather'
//import Svg, { Path } from 'react-native-svg';
import FeatherIcon from "react-native-vector-icons/Feather";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const FirstMenu = ({ isBottomSheetVisible, setBottomSheetVisible }) => {
    const navigation = useNavigation();

    const handleMenu = () => {
        navigation.navigate('Login');
        setBottomSheetVisible(false);
    }

    return (
        <Modal
            isVisible={isBottomSheetVisible}
            onBackdropPress={() => setBottomSheetVisible(false)}
            style={styles.modalContainer}
        >
            <View
                className=""
                style={[
                    styles.bottomSheetContainer1,
                    { height: windowHeight * 0.9 },
                ]}
            >
                <TouchableOpacity onPress={() => setBottomSheetVisible(!setBottomSheetVisible)}>
                    <FeatherIcon name="x" size={30} color="orange" />
                </TouchableOpacity>

                <View style={styles.logmenu} className="bg-white p-4 flex-1 w-full">
                    <View className="justify-center items-center">
                        <Text className="text-slate-800 text-2xl font-bold">Menu</Text>
                    </View>

                    <View className="justify-center mt-7">
                        
                        <Text className="my-3 font-bold text-slate-600 text-xl">Support</Text>

                        <View className="border border-b-2 border-slate-300 h-30 rounded-2xl mb-8">
                            <TouchableOpacity onPress={() => navigation.navigate("Faq", setBottomSheetVisible(false))} className="p-5 rounded-2xl w-full border border-b-1 border-t-0 border-l-0 border-r-0 border-slate-300">
                                <Text className="text-slate-600 ">FAQ</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("Use",setBottomSheetVisible(false))} className="p-5 rounded-2xl w-full border border-b-1 border-t-0 border-l-0 border-r-0 border-slate-300 flex-row justify-between items-center">
                                <Text className="text-slate-600 ">How to Use App</Text>
                                <FeatherIcon name="arrow-right" size={20} color="gray" />
                            </TouchableOpacity>
                        </View>
                        <View className="border mt-8 border-b-2 border-slate-300 h-30 rounded-2xl mb-5">
                            <TouchableOpacity onPress={() => navigation.navigate("About", setBottomSheetVisible(false))} className="p-5 rounded-2xl w-full flex-row justify-between items-center">
                                <Text className="text-slate-600 ">About</Text>
                                <FeatherIcon name="arrow-right" size={20} color="gray" />

                            </TouchableOpacity>

                        </View>
                        <View className="border mt-8 border-b-2 border-slate-300 h-30 rounded-2xl mb-5">
                            <TouchableOpacity onPress={() => navigation.navigate("Login", setBottomSheetVisible(false))} className="p-5 rounded-2xl w-full flex-row justify-between items-center">
                                <Text className="text-slate-600 ">Login</Text>
                                <FeatherIcon name="key" size={20} color="gray" />

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("Register", setBottomSheetVisible(false))} className="p-5 rounded-2xl w-full flex-row border border-slate-300 border-t-1 border-b-0 border-l-0 border-r-0 justify-between items-center">
                                <Text className="text-slate-600 ">Create Account</Text>
                                <FeatherIcon name="user" size={20} color="gray" />

                            </TouchableOpacity>

                        </View>


                    </View>

                </View>

            </View>
        </Modal>
    )
}

export default FirstMenu

const styles = StyleSheet.create({
    bottomSheetContainer1: {
        backgroundColor: "white",
        padding: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowColor: "#000000",
        shadowOpacity: 0.5,
        shadowOffset: {
            width: 0,
            height: -2,
        },
        shadowRadius: 5,
        elevation: 5,
    },
    modalContainer: {
        justifyContent: "flex-end",
        margin: 0,
        height: "50%",
    },

})