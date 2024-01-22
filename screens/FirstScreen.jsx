import React, { useState, useEffect } from "react";
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
import { Card } from "react-native-paper";
import AntIcon from "react-native-vector-icons/AntDesign";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Icon from 'react-native-feather'
//import Svg, { Path } from 'react-native-svg';
import FeatherIcon from "react-native-vector-icons/Feather";
import Modal from "react-native-modal";
import LottieView from "lottie-react-native";
import axios from "axios";
import { Snackbar } from "react-native-paper";
import GeneralSettings from "./SettingScreen";
import CarouselCard from "../components/Card";
import Test from "../components/Test";
import Categories from "../components/Categories";
import { useCurrency } from "../components/CurrencyProvider";
import Loader from "../components/loader";
import { getEvents, getUserdata } from "../api";
import { urlFor } from '../sanity'
import Deals from "../components/Deals";
import Events from "../components/Events";
import MenuModal from "../components/MenuModal";
import FirstMenu from "../components/FirstMenu";




const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;

const FirstScreen = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [brand, setBrands] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);
  const [loginState, setLoginState] = useState(false);



  //SET EVENSTS
  const [events, setEvents] = useState([]);

  const [animationLoaded, setAnimationLoaded] = useState(false);
  const { isDollar, setIsDollar } = useCurrency();
  const [session, setSession] = useState(false);









  useEffect(() => {
    fetchManufacturer();
  }, []);

  const fetchManufacturer = async () => {
    try {
      const response = await axios.get(`https://opasso-app-backend.vercel.app/api/shop/sellers`);
      setManufacturer(response.data);
      setLoading(false);

    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const [isRefreshing, setIsRefreshing] = useState(false);

  // ... existing code ...

  const onRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchData(); // Fetch the updated data

    } catch (error) {
      console.log(error);
    }
    setIsRefreshing(false);
  };


  const [showLikeModal, setShowLikeModal] = useState(false);
  const [showLoginReqModal, setShowLoginReqModal] = useState(false);


  useEffect(() => {
    // Show the like modal after 5 seconds
    const timer = setTimeout(() => {
      setShowLikeModal(true);
    }, 5000);

    return () => clearTimeout(timer); // Clear the timer on component unmount

    // ... (existing code)
  }, []);


  const handleShowLoginReq = () => {
    setShowLoginReqModal(true);
  }

  //go to login page
  const handleLogin = () => {
    handleLoginReqClose();
    navigation.navigate('Login');
  }


  const handleLikeModalClose = () => {
    setShowLikeModal(false);
    // You can add logic here for handling the user's response
  };
  const handleLoginReqClose = () => {
    setShowLoginReqModal(false);
    // You can add logic here for handling the user's response
  };
  const handleLikeModalAllow = () => {
    handleLikeModalClose();
    navigation.navigate('ourwork');
    // You can add logic here for handling the user's response
  };

















  const [isBottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLogoutConfirm, setLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);

  const windowHeight = Dimensions.get("window").height;
  const windowWidth = Dimensions.get("window").width;

  useEffect(() => {
    // Simulate a delay for the splash screen (optional)
    setTimeout(() => {
      setAnimationLoaded(true);
      // Navigate to the main screen or any other screen after the splash screen
      // Replace 'MainScreen' with your desired screen component
      // navigation.navigate('MainScreen');
    }, 2000); // Delay in milliseconds (adjust as needed)
  }, []);


  const Restrict = () => {
    alert("Please Login to access");
  }


  return (
    <SafeAreaView
      className="bg-white align-center flex-1"
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >

      <StatusBar style="light" />
      <SafeAreaView style={styles.top}>
        <View style={styles.menu}>
          <View>
            <TouchableOpacity onPress={() => setBottomSheetVisible(true)}>
              <FeatherIcon name="menu" size={25} color="orange" />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row" }}>


            <TouchableOpacity
              className="px-4 bg-slate-200 rounded-3xl h-10 w-10 justify-center items-center"
              onPress={handleShowLoginReq}
            >
              <Icon.User size={25} color="orange" />
            </TouchableOpacity>
          </View>
        </View>

        <View className="py-5 px-4">
          <View className="flex-row">
            <View>
              <Text className="text-slate-800 text-2xl font-semibold">Welcome User</Text>
            </View>
            <View>

            </View>
          </View>
        </View>


      </SafeAreaView>

      {/**categories */}
      <ScrollView
        vertical={true}
        style={styles.container1}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>


          <Deals />



          <View>
            <Text
              style={{
                position: "absolute",
                color: "#ffffff",
                fontSize: 25,
                fontWeight: "bold",
                right: "70%",
                bottom: "60%",
              }}
            >
              Searching
            </Text>
            <Text
              style={{
                position: "absolute",
                color: "#ffffff",
                fontSize: 25,
                fontWeight: "bold",
                right: "60%",
                bottom: "40%",
              }}
            >
              for a product?
            </Text>
          </View>
        </View>


        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 10, color: 'orange' }}>
              <FeatherIcon name="star" size={25} color="orange" />Featured WholeSalers
            </Text>
          </View>

          <View>
            <TouchableOpacity onPress={handleShowLoginReq}>
              <Text className="text-orange-500 font-semibold">View all</Text>
            </TouchableOpacity>

          </View>
        </View>






        <View>

          {loading ? (
            <View className="justify-center items-center flex-1 w-full">
              <LottieView
                className="h-32 w-32"
                source={require("../assets/manufac.json")}
                autoPlay
                loop={true}
                onAnimationFinish={() => {
                  console.log("Animation finished");
                }}
              />
            </View>
          ) : (
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 15 }}
              refreshControl={
                <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
              }
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              <View style={styles.cardContainer} horizontal={true}>
                {manufacturer.slice(0, 4).map((manufacturer) => (
                  <TouchableOpacity
                    onPress={handleShowLoginReq}
                    key={manufacturer._id}
                  >
                    <View className="space-y-1 mr-4" key={manufacturer.id}>


                      <View className="p-2 rounded-full h-18 w-18 border border-orange-400 border-md">
                        <Image className="rounded-full"
                          source={require('../assets/opaso.png')}
                          style={{
                            height: 60, width: 60,
                          }}
                          resizeMode="cover"
                        />
                      </View>
                      <Text className="text-neutral-600 mt-3">

                        {manufacturer.name.length > 8 ? manufacturer.name.slice(0, 8) + '...' : manufacturer.name}
                      </Text>

                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>


          )}

        </View>

        <View className="px-5 justify-center items-center my-3">
          <TouchableOpacity onPress={handleLikeModalAllow} className="justify-center rounded-xl items-center border border-orange-400 border-sm w-80 h-10">
            <Text className="text-lg font-bold text-orange-400">What we do.</Text>
          </TouchableOpacity>
        </View>





        <View
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <View>
            <Text style={{ fontWeight: "bold", fontSize: 18, marginTop: 5 }}>
              Product Categories
            </Text>
          </View>


        </View>
        {loading ? (
          <Loader />
        ) : (

          <Categories handleModal={handleShowLoginReq} logstate={loginState} />

        )}



        {/* <CarouselCard data={trending} /> */}
        <View className="w-full mb-3">
          <Text className="font-bold text-lg tracking-wide">
            Ads & Promotions
          </Text>
        </View>
        <Events />












        {/**End of brands */}
        <FirstMenu isBottomSheetVisible={isBottomSheetVisible} setBottomSheetVisible={setBottomSheetVisible} />



        {/* ask user if they know how to use the app */}
        <Modal
          className="justify-center items-center flex-1"
          isVisible={showLikeModal}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropOpacity={0.5}
          onBackdropPress={handleLikeModalClose}
          onBackButtonPress={handleLikeModalClose}
          style={styles.modalContainer}
        >
          <View className="bg-white w-80 h-60 px-5 rounded-3xl justify-center items-center">
            <Text style={{ fontSize: 20, marginBottom: 20 }}>
              Wanna know what we do?
            </Text>
            <View style={styles.logmenu}>
              <TouchableOpacity onPress={handleLikeModalAllow} className="bg-orange-400 w-40 h-12 my-3 rounded-2xl justify-center items-center">
                <Text style={styles.btntext}>Yes</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLikeModalClose} className="bg-orange-400 w-40 h-12 my-3 rounded-2xl justify-center items-center">
                <Text style={styles.btntext}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>




        {/* modal for user account creation create */}
        {/* <Modal
          className="justify-center items-center flex-1"
          isVisible={showLoginReqModal}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropOpacity={0.5}
          onBackdropPress={handleLikeModalClose}
          onBackButtonPress={handleLikeModalClose}
          style={styles.modalContainer}
        >
          <View className="bg-white w-80 h-60 px-5 rounded-3xl justify-center items-center">
            <Text style={{ fontSize: 20, marginBottom: 20 }}>
              You dont have an account or not logged in yet.
            </Text>
            <View style={styles.logmenu}>
              <TouchableOpacity onPress={handleLogin} className="bg-orange-400 w-40 h-12 my-3 rounded-2xl justify-center items-center">
                <Text style={styles.btntext}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLoginReqClose} className="bg-orange-400 w-40 h-12 my-3 rounded-2xl justify-center items-center">
                <Text style={styles.btntext}>Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}


        {/* auth request */}
        <Modal
          isVisible={showLoginReqModal}
          onBackdropPress={handleLikeModalClose}
          style={styles.modalContainer}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          backdropOpacity={0.5}
          onBackButtonPress={handleLikeModalClose}
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
                source={require("../assets/authrequest.json")}
                autoPlay
                loop={true}
              // onAnimationFinish={() => {
              //   handleLikeModalClose();
              // }}
              />
              <View style={styles.logmenu}>
                <TouchableOpacity onPress={handleLogin} className="bg-orange-400 w-40 h-10 my-3 rounded-2xl justify-center items-center">
                  <Text style={styles.btntext}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleLoginReqClose} className="bg-orange-400 w-40 h-10 my-3 rounded-2xl justify-center items-center">
                  <Text style={styles.btntext}>Skip</Text>
                </TouchableOpacity>
              </View>

            </View>

          </View>
        </Modal>




      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({

  top: {
    backgroundColor: "#ffffff",
    height: 120,
    width: "100%",
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,

  },
  menu: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 18,
  },
  search: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  searchcont: {
    paddingHorizontal: 15,
    backgroundColor: "#ffffff",
    paddingVertical: 10,
    borderRadius: 15,
    marginVertical: 10,
    width: "80%",
    borderColor: "orange",
    borderWidth: 1,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    paddingVertical: 12,
    height: 120,
  },
  card: {
    backgroundColor: "#ffffff",

    padding: 5,
    margin: 5,
    minWidth: 80,
    borderRadius: 12,
    alignItems: "center",
    minHeight: 80,
  },
  carditem: {
    backgroundColor: "orange",
    borderRadius: 15,
    height: 170,
    padding: 15,
    width: "100%",
    paddingVertical: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  fav: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1, // Adjust the zIndex to position the close icon above the image
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: "contain",
  },
  container1: {
    paddingHorizontal: 15,
  },
  image1: {
    height: "70%",
    backgroundColor: "#fff",
    width: "100%",
    resizeMode: "cover",
    borderTopRightRadius: 12,
    borderTopLeftRadius: 12,
  },
  card1: {
    flex: 1,
    height: 250,
    backgroundColor: "#fff",
    width: 150,

    borderWidth: 1,
    borderColor: "orange",
    borderRadius: 12,
    marginTop: 10,
    marginRight: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: 10,
  },
  deals: {
    flexWrap: "wrap",
    flexDirection: "row",
  },
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
    height: "50%",
  },
  bottomSheetContainer: {
    padding: 20,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    shadowColor: "#000000",
    shadowOpacity: 1.2,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 5,
    elevation: 5,
  },
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
  bottomSheetContainer2: {
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
  logbtn: {
    backgroundColor: "orange",
    height: 50,
    width: "50%",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    color: "#ffffff",
  },
  logmenu: {
    alignItems: "center",
    justifyContent: "center",
  },
  btntext: {
    fontWeight: "bold",
    fontSize: 21,
    color: "#fff",
  },
});

export default FirstScreen;
