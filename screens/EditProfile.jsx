import { StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
// import { useSafeArea } from 'native-base';
import * as Icon from 'react-native-feather'
import axios from 'axios';
import LottieView from "lottie-react-native";

const EditProfile = ({ navigation, route }) => {
  const { userEmail } = route.params;
  const [userdata, setUserdata] = useState({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading,setLoading] = useState(false);

  useEffect(() => {
    getUserdata();
  }, []);

  const getUserdata = () => {
    setLoading(true);
    fetch('https://opasso-app-backend.vercel.app/api/user/usersdata')
      .then((response) => response.json())
      .then((data) => {
        const user = data.find((item) => item.email === userEmail);
        if (user) {
          setUserdata(user);
          setName(user.name);
          setEmail(user.email);
          setAddress(user.address);
          setPhone(user.phoneNumber);
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updateUser = async () => {
    try {
      const response = await axios.put(`https://opasso-app-backend.vercel.app/api/user/updateuser/${userEmail}`, {
        name: name,
        email: email,
        phoneNumber: phone,
        address: address,
      });
      setUserdata(response.data);
      alert('User updated successfully');

      // Check if email was updated, and log out if true
      if (response.data.email !== userEmail) {
        // Navigate to the logout screen or perform logout-related action
        logout() // Replace 'LogoutScreen' with your actual logout screen
      }
    } catch (error) {
      console.log(error);
      alert('Failed');
    }
  };
  const logout = async () => {
    // Perform any necessary logout actions (e.g., clear user session, reset state)

    // Remove user token or session data from AsyncStorage
    try {
      // Replace 'userToken' with your specific token or session key
      // Navigate to the login or authentication screen
      // Example using react-navigation:
      alert("Please Log back in with the new email.")
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  };


  return (
    <SafeAreaView className="bg-white flex-1">
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
        </View>
      ) : (
        <View>
        <View className="justify-center items-center">
          <Text className="text-slate-500 text-3xl font-semibold">{userdata.name}'s Space</Text>
        </View>

        <View className="justify-center my-3 items-start px-5">
          <View className="my-5 justify-center items-start w-full">
            <Text className="text-lg font-semibold text-slate-600">Email</Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              className="border border-slate-200 rounded-2xl h-10 w-full px-4" />
          </View>
          <View className="my-5 justify-center items-start w-full">
            <Text className="text-lg font-semibold text-slate-600">UserName</Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              className="border border-slate-200 rounded-2xl h-10 w-full px-4" />
          </View>
          <View className="my-5 justify-center items-start w-full">
            <Text className="text-lg font-semibold text-slate-600">Address</Text>
            <TextInput
              value={address}
              onChangeText={(text) => setAddress(text)}
              className="border border-slate-200 rounded-2xl h-10 w-full px-4" />
          </View>
          <View className="my-5 justify-center items-start w-full">
            <Text className="text-lg font-semibold text-slate-600">Current Phone: {phone}</Text>
            <TextInput
              value={phone}
              onChangeText={(text) => setPhone(text)}
              keyboardType='numeric'
              className="border border-slate-200 rounded-2xl h-10 w-full px-4" />
          </View>
          <View className="my-5 justify-center items-center w-full">
            <TouchableOpacity onPress={updateUser} className="bg-slate-800 h-10 w-40 rounded-2xl justify-center items-center">
              <Text className="text-white font-semibold text-lg"> Update</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
      )}
      
    </SafeAreaView>
  )
}

export default EditProfile

const styles = StyleSheet.create({})