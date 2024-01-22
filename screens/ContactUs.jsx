import { StyleSheet, Text, View, TextInput, TouchableWithoutFeedback, Dimensions, Button, Keyboard, TouchableOpacity, ActivityIndicator, SafeAreaView, Image } from 'react-native'
import React, { useState } from 'react';
import axios from 'axios';
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";


const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const ContactUs = ({ navigation, route }) => {
    const { userEmail } = route.params;
    const [from, setFrom] = useState(userEmail);
    const [subject, setSubject] = useState(null);
    const [text, setText] = useState('');
    const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
    const [loading,setLoading] = useState(false);



    const reason = [
        {
            id: 1,
            name: 'Complain',
        },
        {
            id: 2,
            name: 'Feedback',
        },
        {
            id: 3,
            name: 'Appreciate',
        },
        {
            id: 4,
            name: 'Other',
        },
    ]


    //hide keyboad
    const handleTapOutside = () => {
        Keyboard.dismiss();
    };

    const handleSuccess = () => {
        setBottomSheetVisible(true);
        setSubject('');
        setText('');
        setLoading(false);
    }


    const sendEmail = async () => {
        if (!from || !subject || !text) {
            alert('Please fill in all the fields');
            // You might want to show a user-friendly error message here
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('https://resellersprintmailserver.vercel.app/send-mail', {
                from,
                subject,
                text
            });

            console.log(response.data);
            handleSuccess();
        } catch (error) {
            console.error(error.toString());
        }
    };


    const Close = () =>{
        navigation.goBack();
    }




    return (
        <SafeAreaView className="flex-1 bg-white">
            <TouchableWithoutFeedback onPress={handleTapOutside}>
                <View className="flex-1 px-4 py-8">
                    <Text className="text-xl font-semibold text-slate-500 py-3">From</Text>
                    <View className="h-12 w-90 bg-slate-200 px-4 rounded-2xl justify-center">
                        <Text className="text-lg text-slate-400">{from}</Text>
                    </View>

                    <Text className="font-semibold text-xl py-3">Select Reason:</Text>
                    <View className="flex-row flex-wrap justify-between items-center py-4 px-5">
                        {reason.map((item) => {
                            return (
                                <View className="bg-slate-400 p-2 justify-center items-center rounded-3xl">
                                    <TouchableOpacity key={item.id} className="rounded-2xl" onPress={() => setSubject(item.name)}>
                                        <Text className="text-slate-200 text-xl">{item.name}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        })}
                    </View>
                    <TextInput
                        className="h-10 border border-slate-400 rounded-xl px-5"
                        value={subject}
                        // onChangeText={setSubject}
                        placeholder="Select your Reason"
                        editable={false}
                    />

                    <Text className="text-xl font-semibold text-slate-500 py-3">Message:</Text>
                    <TextInput
                        className="h-20 border border-slate-400 rounded-xl px-5"
                        value={text}
                        onChangeText={setText}
                        placeholder="Enter your message"
                        multiline
                        numberOfLines={6}

                    />


                    <View className="justify-center items-center w-full py-5">
                        <TouchableOpacity onPress={sendEmail} className="h-12 bg-orange-500 w-40 rounded-2xl justify-center items-center">
                            {loading ? (
                                <ActivityIndicator size="small" color="#ffffff"/>
                            ):(
                                <Text className="text-xl text-white font-semibold">Send</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>


            </TouchableWithoutFeedback>


            {/* success modal */}
            <Modal
                isVisible={isBottomSheetVisible}
                onBackdropPress={() => setBottomSheetVisible(false)}
                style={styles.modalContainer}
            >
                <View
                    className=""
                    style={[
                        styles.bottomSheetContainer1,
                        { height: windowHeight * 0.5 },
                    ]}
                >
                    <View className="justify-center items-center flex-1 w-full h-full">

                        <LottieView
                            className="justify-center items-center" style={{ width: '50%', }}
                            source={require("../assets/success.json")}
                            autoPlay
                            loop={false}
                            onAnimationFinish={() => {
                                Close();
                            }}
                        />
                        <Text className="text-white text-3xl text-center font-bold">Message Sent</Text>

                    </View>

                </View>
            </Modal>
        </SafeAreaView>
    );
};

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

export default ContactUs;
