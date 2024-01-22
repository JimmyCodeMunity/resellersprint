import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
  SafeAreaView,
  ScrollView

} from "react-native";
import { Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import FeatherIcon from "react-native-vector-icons/Feather";
import Modal from "react-native-modal";
import AntIcon from "react-native-vector-icons/AntDesign";
import { TextInput } from "react-native-gesture-handler";
import axios from "axios";
import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from 'firebase/app';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { StatusBar } from "expo-status-bar";
import CarouselCard from "../components/Card";
import * as Icon from 'react-native-feather';
import { getUserdata } from "../api";
import AsyncStorage from '@react-native-async-storage/async-storage';


const ProfileScreen = ({ navigation, route }) => {
  const { email } = route.params;
  const [image, setImage] = useState(null);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;
  const [Email, setEmail] = useState("");
  const [password, setPassword] = useState(null);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [user, setUser] = useState({
    name: ''
  });
  const [userdata, setUserdata] = useState([]);
  const [loading, setLoading] = useState(false);



  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.cancelled) {
      // Save the picked image URI to AsyncStorage
      await AsyncStorage.setItem('profileImage', result.assets[0].uri);
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    const loadProfileImage = async () => {
      try {
        // Load the saved image URI from AsyncStorage
        const savedImage = await AsyncStorage.getItem('profileImage');
        if (savedImage) {
          setImage(savedImage);
        }
      } catch (error) {
        console.error('Error loading profile image:', error);
      }
    };
  
    loadProfileImage();
  }, []); // Empty dependency array means this effect runs once on mount
  


  // const getUserdata = async () => {
  //   try {
  //     const response = await axios.get(`https://opasso-app-backend.vercel.app/api/user/usersdata/${email}`);
  //     const userdata = response.data;
  //     setUser(userdata);

  //   } catch (error) {
  //     console.log(error)

  //   }
  // }

  // const getUserdata = () => {
  //   fetch("https://opasso-app-backend.vercel.app/api/user/usersdata")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setLoading(false);
  //       const seller = data.find((item) => item.email === userEmail);
  //       if (seller) {
  //         setUserdata(seller);
  //       }
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }



  useEffect(()=>{
    getUserdata({email,userdata,setUserdata,setLoading})

  },[email])

  











  return (
    <SafeAreaView className="flex-1 bg-white h-full">
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} style={{ height:windowHeight*1 }} className="flex-1">
        <View className="w-full">
          <View className="justify-center items-center my-8">
            <Text className="text-slate-500 text-3xl font-semibold">Profile</Text>
          </View>

          <View className="justify-center items-center">
            <TouchableOpacity onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} className="h-32 w-32 rounded-full border border-sm border-slate-900" />
              ) : (
                <Image
                  source={require("../assets/logo.jpg")}
                  className="h-32 w-32 rounded-full border border-sm border-slate-900"
                />
              )}
            </TouchableOpacity>
          </View>

          <View className="justify-center items-center mb-8">
            <Text className="text-slate-900 font-bold text-3xl">{userdata.name}</Text>
          </View>

          <View className="justify-center items-center px-5 ">
            <View className="bg-slate-100 rounded-3xl w-full p-5">
              <View className="border border-b-1 flex-row items-center border-slate-300 border-t-0 border-l-0 border-r-0 py-2">

                <View className="px-4">
                  <Icon.Mail color="black" size={30} />
                </View>
                <View>
                  <Text className="text-slate-500">Email</Text>
                  <Text className="text-slate-700 text-xl font-semibold">{email}</Text>
                </View>
              </View>
              <View className="border border-b-1 flex-row items-center border-slate-300 border-t-0 border-l-0 border-r-0 py-2">

                <View className="px-4">
                  <Icon.MapPin color="black" size={30} />
                </View>
                <View>
                  <Text className="text-slate-500">Address</Text>
                  <Text className="text-slate-700 text-xl font-semibold">{userdata.address}</Text>
                </View>
              </View>
              <View className="border border-b-1 flex-row items-center border-slate-300 border-t-0 border-l-0 border-r-0 py-2">

                <View className="px-4">
                  <Icon.PhoneCall color="black" size={30} />
                </View>
                <View>
                  <Text className="text-slate-500">Phone</Text>
                  <Text className="text-slate-700 text-xl font-semibold">{userdata.phoneNumber}</Text>
                </View>
              </View>
              <View className="border border-b-1 flex-row items-center border-slate-300 border-t-0 border-l-0 border-r-0 py-2">

                <View className="px-4">
                  <Icon.Clock color="black" size={30} />
                </View>
                <View>
                  <Text className="text-slate-500">Since</Text>
                  <Text className="text-slate-700 text-xl font-semibold">{userdata.createdAt}</Text>
                </View>
              </View>
              <View className="border border-b-1 flex-row items-center border-slate-300 border-t-0 border-l-0 border-r-0 py-2">

                <View className="px-4">
                  <Icon.Eye color="black" size={30} />
                </View>
                <View>
                  <Text className="text-slate-500">UserId</Text>
                  <Text className="text-slate-700 text-xl font-semibold">{userdata._id}</Text>
                </View>
              </View>

            </View>

          </View>

          <View className="mb-8">
            <CarouselCard />
          </View>
        </View>
      </ScrollView>



    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
  },
  header: {
    alignItems: "center",
    marginTop: 50,
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  bottom: {
    height: "80%",
    backgroundColor: "#fff",
    marginTop: "10%",
    justifyContent: "center",
    alignItems: "center",
  },
  profiledata: {
    height: "90%",
    backgroundColor: "#fff",
    width: "85%",
    marginBottom: "50%",
    borderRadius: 25,
    padding: 40,
  },
  updatebtn: {
    backgroundColor: "orange",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 15,
    width: "80%",
  },
  deletebtn: {
    backgroundColor: "red",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    width: "60%",
  },
  btntext: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  profiledata2: {
    height: "90%",
    backgroundColor: "#fff",
    width: "100%",
    borderRadius: 25,
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    alignSelf: "stretch",
    paddingHorizontal: 12,
    marginBottom: 20,
  },
});

export default ProfileScreen;
