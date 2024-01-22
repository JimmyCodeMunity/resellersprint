// GeneralSettings.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, SafeAreaView, Share, Switch, ScrollView } from 'react-native';
import AntIcon from "react-native-vector-icons/AntDesign";
import FeatherIcon from "react-native-vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useCurrency } from '../components/CurrencyProvider';
import { getUserdata } from '../api';
import Modal from "react-native-modal";
const windowHeight = Dimensions.get("window").height;
import LottieView from "lottie-react-native";



const GeneralSettings = ({ navigation, route }) => {
  const [email, setEmail] = useState("");
  //const [isDollar,setIsDollar] = useState(true);
  const { isDollar, setIsDollar } = useCurrency();
  const [userdata, setUserdata] = useState([]);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState("");
  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLogoutConfirm, setLogoutConfirm] = useState(false);



  // //fetch userdata
  // const getUserdata = () => {
  //   fetch("https://opasso-app-backend.vercel.app/api/user/usersdata")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setLoading(false);
  //       const seller = data.find((item) => item.email === email);
  //       if (seller) {
  //         setUserdata(seller);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }


  useEffect(() => {
    const checkLogedinStatus = async () => {
      try {
        const loginStatus = await AsyncStorage.getItem("loginStatus");
        const loginEmail = await AsyncStorage.getItem("email");
        setEmail(loginEmail)
        setSession(loginStatus);
        //console.log(loginEmail)
        return loginStatus === "LoggedIn";
      } catch (error) {
        console.log("Error checking login status:", error);
        return false;
      }
    };

    checkLogedinStatus();
  }, []);


  useEffect(() => {
    getUserdata({ email, userdata, setUserdata, setLoading })

  }, [email])








  const handleShare = () => {
    const message = "Share this Awesome App!!";
    const url = "https://www.mentheal.co.ke";

    Share.share({
      message: message,
      url: url,
    })
      .then((result) => console.log(result))
      .catch((error) => console.log(error));
  };
  const settingsOptions = [
    { title: 'Visit website', onPress: () => console.log('Wi-Fi pressed'), icon: 'globe' },
    { title: 'Become a manufacturer', onPress: () => console.log('Bluetooth pressed'), icon: 'user' },
    { title: 'Rate Us on google', onPress: () => console.log('Cellular pressed'), icon: 'star' },
    { title: 'Share app', onPress: handleShare, icon: 'share' },

    // Add more settings options as needed
  ];
  //logout function start
  const logout = async () => {
    // Perform any necessary logout actions (e.g., clear user session, reset state)

    // Remove user token or session data from AsyncStorage
    try {
      await AsyncStorage.setItem("loginStatus", "LoggedOut");
      await AsyncStorage.setItem("email", "");

      // Replace 'userToken' with your specific token or session key
      // Navigate to the login or authentication screen
      // Example using react-navigation:
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  };





  return (
    <SafeAreaView className="flex-1 bg-white">
      {loading ? (
        <View className="flex-1 justify-center items-center h-full w-full">
          <LottieView
                className="justify-center items-center" style={{ width: '40%', }}
                source={require("../assets/spinner.json")}
                autoPlay
                loop={true}
              // onAnimationFinish={() => {
              //   handleLikeModalClose();
              // }}
              />

              <Text className="text-slate-500 text-xl font-semibold">Getting User info...</Text>
        </View>
      ) : (
        <View className="flex-1 px-5 py-5 mt-8">
          <View>
            <Text className="text-orange-400 font-bold text-3xl">Settings</Text>
          </View>
          <ScrollView className="h-full flex-1" showsVerticalScrollIndicator={false}>
            <View className="py-3">
              <Text className="text-slate-500 text-2xl py-5">Account</Text>
              <View className="bg-slate-100 shadow-sm w-90 rounded-2xl justify-center">
                <TouchableOpacity
                  onPress={() => navigation.navigate('Profile', { email: email })}
                  className="border border-t-0 border-r-0 border-l-0 border-slate-300 px-3 h-16 flex-row justify-between items-center border-b-slate-300">
                  <Text className="text-2xl font-semibold">{userdata.name}</Text>
                  <FeatherIcon name="arrow-right" size={23} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('editProfile', { userEmail: email })}
                  className="border border-t-0 border-r-0 border-l-0 border-slate-300 px-3 h-16 flex-row justify-between items-center border-b-slate-300">
                  <Text className="text-lg">Edit Profile</Text>
                  <FeatherIcon name="arrow-right" size={23} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('passreset', { email: email })} className="border border-t-0 border-r-0 border-l-0  border-slate-300 px-3 h-16 flex-row justify-between items-center border-b-0">
                  <Text className="text-lg">Change Password</Text>
                  <FeatherIcon name="arrow-right" size={23} />
                </TouchableOpacity>
              </View>


              <Text className="text-slate-500 py-5 text-2xl">More</Text>
              <View className="bg-slate-100 shadow-sm w-90 rounded-2xl justify-center">
                {settingsOptions.map((option, index) => {
                  return (
                    <TouchableOpacity onPress={option.onPress} key={index} className="border border-t-0 border-r-0 border-l-0 border-slate-300 px-3 h-16 flex-row justify-between items-center border-b-slate-300">
                      <Text className="text-lg">{option.title}</Text>
                      <FeatherIcon name="arrow-right" size={23} />
                    </TouchableOpacity>

                  )
                })}


              </View>


              <View className="justify-center items-center">
                <TouchableOpacity onPress={() => setLogoutConfirm(true)} className="bg-orange-400 h-10 rounded-2xl justify-center items-center my-7 w-60">
                  <Text className="text-white text-xl">Logout</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>

      )}


      {/* logout confirm */}
      <Modal
        isVisible={isLogoutConfirm}
        animationIn="slideInUp"
        animationOut="slideOutDown"
        backdropOpacity={0.5}
        onBackdropPress={() => setLogoutConfirm(false)}
        onBackButtonPress={() => setLogoutConfirm(false)}
        style={styles.modalContainer}
      >
        <View
          className=""
          style={[
            styles.bottomSheetContainer1,
            { height: windowHeight * 0.4 },
          ]}
        >
          <View className="justify-center items-center flex-1 w-full h-full">

            <LottieView
              className="justify-center items-center" style={{ width: '40%', }}
              source={require("../assets/logoutconfirm.json")}
              autoPlay
              loop={true}
            // onAnimationFinish={() => {
            //   handleLikeModalClose();
            // }}
            />
            <View className="flex-row justify-between items-center w-full px-5">

              <TouchableOpacity onPress={() => setLogoutConfirm(false)} className="bg-orange-400 w-32 h-12 my-3 rounded-2xl justify-center items-center">
                <Text className="text-white font-semibold text-xl">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={logout} className="bg-red-400 w-32 h-12 my-3 rounded-2xl justify-center items-center">
                <Text className="text-white font-semibold text-xl">Logout</Text>
              </TouchableOpacity>
            </View>

          </View>

        </View>
      </Modal>



    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

});

export default GeneralSettings;
