import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import LottieView from "lottie-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from 'axios'
import { firebaseConfig } from "./firebaseConfig";




//firebase authentication setup
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';


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
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";

import { BlurView } from "@react-native-community/blur";
import FastImage from "react-native-fast-image";

const RegisterScreen = () => {
  const [animationLoaded, setAnimationLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhone] = useState("");
  const navigation = useNavigation();
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const [loading,setLoading] = useState(false);





  // const handleRegister = () =>{
  //   createUserWithEmailAndPassword(auth,email,password)
  //   .then((userCredentials)=>{
  //     const user = userCredentials.user;
  //     handleLogin();
  //   }).catch((error)=>{
  //     console.log(error);
  //   })
  // }

  const handleRegister = async () => {
    // Input validation
    if (!name || !email || !password || !address || !phoneNumber) {
      alert('Please fill in all the required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('https://opasso-app-backend.vercel.app/api/user/register', {
        name,
        email,
        password,
        address,
        phoneNumber,
      });

      // Assuming your API returns a message for successful registration
      if (response.status === 200) {
        console.log(response.data.message);
        Alert.alert("Account created successfully") // Navigate to the next screen
        handleLogin()
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
          } else if (response.status === 400) {
            // User already exists
            console.error(response.data.error);
            alert('User with that email already exists!');
          } else {
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


  const handleLogin = () => {
    // Perform login logic here
    navigation.navigate("Login");
  };



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

      <View style={styles.logocontainer}>
        <View style={styles.logo}>
          <Image
            source={require("../assets/logo.jpg")}
            style={styles.profileImage}
          />
          <Text style={styles.logotext}>Cloud CBD</Text>
        </View>

        <View style={styles.form}>
          <Text style={{ color: 'orange', fontSize: 30, marginBottom: 20 }}>Register</Text>

          <TextInput
            style={styles.input}
            className="border border-sm border-slate-300 focus:border-orange-300"
            placeholder="Enter Username"
            value={name}
            onChangeText={(text) => setName(text)}
          />

          <TextInput
            style={styles.input}
            className="border border-sm border-slate-300 focus:border-orange-300"
            placeholder="Enter email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />



          <TextInput
            style={styles.input}
            className="border border-sm border-slate-300 focus:border-orange-300"
            placeholder="Password"
            value={password}
            onChangeText={(text) => setPassword(text)}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            className="border border-sm border-slate-300 focus:border-orange-300"
            placeholder="Enter Phone Number"
            value={phoneNumber}
            onChangeText={(text) => setPhone(text)}
            keyboardType="numeric"
          />

          <TextInput
            style={styles.input}
            className="border border-sm border-slate-300 focus:border-orange-300"
            placeholder="Enter address"
            value={address}
            onChangeText={(text) => setAddress(text)}
          />

          <View style={styles.btncontainer}>
            
            <TouchableOpacity onPress={handleRegister} style={styles.btn}>
                {loading ? (
                  <ActivityIndicator size="small" color="black" />
                ) : (
                  <Text style={styles.btntext}>Create Account</Text>
                )}
              </TouchableOpacity>




            <TouchableOpacity onPress={handleLogin}>
              <Text style={{ color: 'orange', fontSize: 15, marginTop: 12, }}>Already have account?Login</Text>
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
    backgroundColor: "#ffffff",
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  logocontainer: {
    height: "70%",
    backgroundColor: "orange",
    borderBottomStartRadius: 60,
    borderBottomEndRadius: 60,
    alignItems: "center",
    justifyContent: "center",
    marginTop: "-5%",
  },
  logotext: {
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 27,
    paddingVertical: 12,
  },
  form: {
    backgroundColor: "#ffffff",
    width: "80%",
    height: "90%",
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginTop: '10%',

  },
  input: {
    backgroundColor: "white",
    width: "80%",
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
    borderColor: 'white',
    backgroundColor: 'orange',
    borderRadius: 9,
    width: 200,
    alignItems: 'center',
    padding: 12,
    paddingVertical: 15,
    marginTop: 20,
    marginBottom: 20,

  },
  btncontainer: {
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btntext: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 20,
  }
});

export default RegisterScreen;
