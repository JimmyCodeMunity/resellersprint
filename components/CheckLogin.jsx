export const CheckLogedinStatus = async ({ email }) => {
    try {
        const loginStatus = await AsyncStorage.getItem("loginStatus");
        const loginEmail = await AsyncStorage.getItem("email");
        setEmail(loginEmail)
        console.log(loginEmail)
        return loginStatus === "LoggedIn";
    } catch (error) {
        console.log("Error checking login status:", error);
        return false;
    }
};

