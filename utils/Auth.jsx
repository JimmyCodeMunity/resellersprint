import AsyncStorage from "@react-native-async-storage/async-storage";

export const checkLoginStatus = async () => {
  try {
    const loginStatus = await AsyncStorage.getItem("loginStatus");
    return loginStatus === "LoggedIn";
  } catch (error) {
    console.log("Error checking login status:", error);
    return false;
  }
};



