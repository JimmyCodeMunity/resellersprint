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
import { TurboModuleRegistry } from "react-native";
const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const MenuModal = ({ isBottomSheetVisible, setBottomSheetVisible,Email }) => {
    const navigation = useNavigation();

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
                    <View className="justify-start items-start">
                        <Text className="text-slate-600 text-2xl font-bold">More</Text>
                    </View>

                    <View className="justify-center mt-7">
                        <View className="border border-b-2 justify-center border-slate-300 h-30 rounded-2xl mb-5">
                            <TouchableOpacity onPress={() => navigation.navigate("allmanufacturers",setBottomSheetVisible(true))} className="p-5 rounded-2xl w-full border border-b-1 border-t-0 border-l-0 border-r-0 border-slate-300 flex-row items-center justify-between">
                                <Text className="text-slate-600 ">All Manufacturers</Text>
                                <FeatherIcon name="arrow-right" size={20} color="gray" />

                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("allproducts",setBottomSheetVisible(false))} className="p-5 rounded-2xl w-full flex-row items-center justify-between">
                                <Text className="text-slate-600 ">All Products</Text>
                                <FeatherIcon name="arrow-right" size={20} color="gray" />

                            </TouchableOpacity>
                        </View>
                        <Text className="my-3 font-bold text-slate-600 text-xl">Support</Text>

                        <View className="border border-b-2 border-slate-300 h-30 rounded-2xl mb-8">
                            <TouchableOpacity onPress={() => navigation.navigate("Faq",setBottomSheetVisible(TurboModuleRegistry))} className="p-5 rounded-2xl w-full border border-b-1 border-t-0 border-l-0 border-r-0 border-slate-300 flex-row justify-between items-center">
                                <Text className="text-slate-600 ">FAQ</Text>
                                <FeatherIcon name="arrow-right" size={20} color="gray" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("Use",setBottomSheetVisible(TurboModuleRegistry))} className="p-5 rounded-2xl w-full border border-b-1 border-t-0 border-l-0 border-r-0 border-slate-300 flex-row justify-between items-center">
                                <Text className="text-slate-600 ">How to Use App</Text>
                                <FeatherIcon name="arrow-right" size={20} color="gray" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => navigation.navigate("Contact",{userEmail:Email},setBottomSheetVisible(TurboModuleRegistry))} className="p-5 rounded-2xl w-full justify-between flex-row items-center">
                                <Text className="text-slate-600 ">Contact Us</Text>
                                <FeatherIcon name="arrow-right" size={20} color="gray" />

                            </TouchableOpacity>
                        </View>
                        <View className="border mt-8 border-b-2 border-slate-300 h-30 rounded-2xl mb-5">
                            <TouchableOpacity onPress={() => navigation.navigate("About",setBottomSheetVisible(false))} className="p-5 rounded-2xl w-full flex-row justify-between items-center">
                                <Text className="text-slate-600 ">About</Text>
                                <FeatherIcon name="arrow-right" size={20} color="gray" />

                            </TouchableOpacity>
                            
                        </View>


                    </View>

                </View>

            </View>
        </Modal>
    )
}

export default MenuModal

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