import { StyleSheet, Text, View,ActivityIndicator,Dimensions } from 'react-native'
import React, { useState } from 'react'
import * as Icon from 'react-native-feather';
import Modal from "react-native-modal";
import {TouchableOpacity} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';


const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const LoadFail = () => {
    const [modalVisible,setModalVisible] = useState(true);
    const navigation = useNavigation()
    return (
        <View className="flex-1 justify-center items-center">
        <Modal
            isVisible={modalVisible}
            onBackdropPress={() => setModalVisible(false)}
            style={styles.modalContainer}
        >
            <View
                className=""
                style={[
                    styles.bottomSheetContainer1,
                    { height: windowHeight * 0.5 },
                ]}
            >
                <View className="justify-center items-center flex-1">
                    <ActivityIndicator size="large" color="red"/>
                    <Text className="text-slate-500 py-4">No products found</Text>
                    <TouchableOpacity onPress={()=>navigation.goBack()} className="bg-orange-200 rounded-2xl w-40 h-12 justify-center items-center">
                        <Text className="text-slate-500">Cancel</Text>
                    </TouchableOpacity>
                </View>


            </View>
        </Modal>
        </View>
    )
}

export default LoadFail

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