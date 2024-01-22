import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import LottieView from "lottie-react-native";
import axios from "axios";
import { Snackbar } from "react-native-paper";
import NetInfo from "@react-native-community/netinfo";
import { firebaseConfig } from "./firebaseConfig";
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';


//firebase setup

import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  Image,
  KeyboardAvoidingView,
  ImageBackground,
  Alert,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { BlurView } from "@react-native-community/blur";
import FastImage from "react-native-fast-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigation = useNavigation();
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginState, setLoginState] = useState(false);


  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  //firebase setup
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  useEffect(() => {
    checkInternetConnection();
    checkSavedCredentials();
  }, []);

  const checkInternetConnection = async () => {
    const netInfoState = await NetInfo.fetch();
    setIsConnected(netInfoState.isConnected);
    setIsLoading(false);

  };


  

  

  // const handleLogin = () => {

  //   setLoading(true);

  //     signInWithEmailAndPassword(auth,email,password)
  //     .then((userCredentials) => {
  //       const user = userCredentials.user;
  //       const userEmail = user.email;
  //       handleSuccess(userEmail);
  //       setShowSnackbar(true);
  //       console.log(user.email,'logged in successfully');
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       Alert.alert('Email or password incorrect');
  //       setLoading(false)
  //     });
  // };

  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('https://opasso-app-backend.vercel.app/api/user/login', {
        email,
        password,
      });


      // Assuming your API returns a message for successful login
      if (response.status === 200) {
        await AsyncStorage.setItem("email", email);
        await AsyncStorage.setItem("password", password);
        await AsyncStorage.setItem("loginStatus", "LoggedIn");

        console.log(response.data.message);
        handleSuccess(); // Navigate to the next screen
        
      }
    } catch (error) {
      setLoading(false);

      // Check if the error is an Axios error and handle the status codes
      if (axios.isAxiosError(error)) {
        const { response } = error;

        if (response) {
          if (response.status === 401) {
            // Invalid password
            console.error(response.data.error);
            alert('Invalid password. Please check your credentials.');
          } else if (response.status === 404) {
            // User not found
            console.error(response.data.error);
            alert('User not found. Please create an account first.');
          }
          else if (response.status === 403) {
            // Account not approved
            console.error(response.data.error);
            alert('Account not approved.Please wait for approval.');
            setLoading(false);
          }
          else {
            // Handle other status codes
            console.error(response.data.error);
          }
        } else {
          // Handle other errors (network issues, etc.)
          console.error('An error occurred:', error.message);
        }
      }
    }
  };


  const checkSavedCredentials = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem("email");
      const savedPassword = await AsyncStorage.getItem("password");
      const savedStatus= await AsyncStorage.getItem("loginStatus");
      console.log("new state:",savedStatus);


      if (savedEmail && savedPassword) {
        setEmail(savedEmail);
        setPassword(savedPassword);
      }
    } catch (error) {
      console.log(error);
    }
  };


  const handleForgot = () => {
    navigation.navigate("Forgot");
  };

  const handleRegister = () => {
    navigation.navigate("Register");
  };

  const handleNoAccount = () => {
    console.log("Status now:",loginState)
    navigation.navigate("First");
  };

  const handleSuccess = async () => {
    try {
      // Save login status and email in AsyncStorage
      
  
      // Navigate to the next screen
      navigation.navigate("Home");
    } catch (error) {
      console.log("Error saving login status:", error);
    } finally {
      setLoading(false);
    }
  };

  console.log(loginState);


  useEffect(() => {
    // Simulate a delay for the splash screen (optional)
    setTimeout(() => {
      setAnimationLoaded(true);
      // Navigate to the main screen or any other screen after the splash screen
      // Replace 'MainScreen' with your desired screen component
      // navigation.navigate('MainScreen');
    }, 6000); // Delay in milliseconds (adjust as needed)
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light"/>
      
        <View className="bg-white w-full rounded-b-[30] justify-center items-center absolute flex-1" style={{ height:windowHeight*0.7 }}>
          <View style={styles.logo}>
            <Image
              source={require("../assets/logo.jpg")}
              style={styles.profileImage}
            />
            <Text style={styles.logotext}>ResellerSprint</Text>
          </View>

          <View className="bg-orange w-80 rounded-3xl px-5 justify-center items-center p-5" style={{ backgroundColor:'orange',height:windowHeight*0.4 }}>
            <Text className="font-semibold text-2xl text-white my-5">
              Login
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
            />


            <View style={styles.btncontainer}>
              <TouchableOpacity onPress={handleLogin} className="justify-center items-center bg-white rounded-2xl w-40 h-12">
                {loading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <Text className="text-lg font-bold text-orange-500">Login</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgot}>
                <Text className="font-bold text-white mt-4 text-md">
                  Forgot Password
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleRegister}>
                <Text className="font-bold text-white mt-4 text-md">
                  Create Account?
                </Text>
              </TouchableOpacity>


              <TouchableOpacity onPress={handleNoAccount}>
                <Text className="font-bold text-white mt-4 text-md">
                  Continue without Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      
        
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "orange",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  
  logotext: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 27,
    paddingVertical: 12,
  },
  
  input: {
    backgroundColor: "white",
    width: "80%",
    borderBottomColor: "#ccc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    paddingVertical: 12,
  },
  logo: {
    marginTop: "50%",
  },
  btn: {
    borderWidth: 1,
    borderColor: "white",
    backgroundColor: "#FFFFFF",
    borderRadius: 9,
    width: 200,
    alignItems: "center",
    padding: 12,
    paddingVertical: 15,
    marginTop: 20,
  },
  btncontainer: {
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  btntext: {
    color: "orange",
    fontWeight: "bold",
    fontSize: 20,
  },
  snackbar: {
    backgroundColor: "orange",
    marginBottom: 20,
  },
});

export default LoginScreen;
