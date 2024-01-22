import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native";
import LottieView from "lottie-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from 'axios'
import { firebaseConfig } from "./firebaseConfig";




//firebase authentication setup
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
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
  Dimensions
} from "react-native";


import { BlurView } from "@react-native-community/blur";
import FastImage from "react-native-fast-image";

const ForgotPassword = ({ navigation, route }) => {

  const [animationLoaded, setAnimationLoaded] = useState(false);
  //const [name, setUsername] = useState("");
  const [userdata, setUserdata] = useState({});
  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');
  const [cpassword, setCPassword] = useState('');


  const windowHeight = Dimensions.get('window').height;

  useEffect(() => {
    getUserdata();
  }, []);

  const getUserdata = () => {
    fetch('https://opasso-app-backend.vercel.app/api/user/usersdata')
      .then((response) => response.json())
      .then((data) => {
        const user = data.find((item) => item.email === email);
        if (user) {
          setUserdata(user);
          setPassword(user.password);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const updatePassword = async () => {
    if (!email.trim()|| !password.trim() || !cpassword.trim()) {
      alert("all fields are required");
    } else {
      if (password != cpassword) {
        alert("password do not match")
      } else {
        try {
          const response = await axios.put(`https://opasso-app-backend.vercel.app/api/user/updatepassword/${email}`, {
            password: password
          });
          setUserdata(response.data);
          alert('Password reset successful');
          navigation.navigate('Login');
        } catch (error) {
          console.log(error);
          alert("Failed")
        }
      };
    }
  }

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

      <View className="justify-center items-center rounded-b-3xl" style={{ height: windowHeight * 0.8, backgroundColor: 'orange' }}>
        <View className="justify-center items-center">
          <Image
            source={require("../assets/logo.jpg")}
            style={styles.profileImage}
          />
          <Text style={styles.logotext}>Cloud CBD</Text>

        </View>

        <View className="justify-center bg-white items-center w-80 rounded-3xl mt-12" style={{ height: windowHeight * 0.4 }}>
          <Text style={{ color: 'orange'}} className="font-semibold text-2xl my-5">Reset Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            onChangeText={(text) => setEmail(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter new password"
            secureTextEntry
            onChangeText={(text) => setPassword(text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            secureTextEntry
            onChangeText={(text) => setCPassword(text)}
          />






          <View style={styles.btncontainer}>
            <TouchableOpacity onPress={updatePassword} style={styles.btn}>
              <Text style={styles.btntext}>Reset</Text>
            </TouchableOpacity>





          </View>
        </View>

      </View>
      <View className="justify-center items-center w-full px-4 absolute" style={{ bottom: 20 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} className="bg-black w-60 h-12 justify-center items-center rounded-2xl ">
          <Text className="text-white font-semibold text-lg">Remembered my password?</Text>
        </TouchableOpacity>
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
    borderBottomColor: "#ccc",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    paddingVertical: 12,
    borderWidth: 0.4,
    borderColor: 'orange'
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

export default ForgotPassword;
