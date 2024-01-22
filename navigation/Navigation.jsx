import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider as PaperProvider, DefaultTheme, Modal } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import { CurrencyProvider } from '../components/CurrencyProvider';


//screen imports 
import LoginScreen from '../screens/LoginScreen';
import LandingScreen from '../screens/LandingScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingScreen from '../screens/SettingScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CategoryScreen from '../screens/Category';
import ViewScreen from '../screens/View';
import ForgotScreen from '../screens/ForgotPassword';
import SearchResultsScreen from '../screens/SearchScreen';
import ManufactureView from '../screens/ManufactureView';
import AsyncStorage from '@react-native-async-storage/async-storage';




import ResetPassword from '../screens/ResetPassword';
import { useEffect, useState } from 'react';
import EmptyScreen from '../screens/EmptyScreen';
import ManufacturerScreen from '../screens/ManufacturerScreen';
import DealsWeb from '../screens/DealsWeb';
import EditProfile from '../screens/EditProfile';
import FirstScreen from '../screens/FirstScreen';
import UseScreen from '../screens/UseScreen';
import ContactUs from '../screens/ContactUs';
import FaqScreen from '../screens/FaqScreen';
import AboutScreen from '../screens/AboutScreen';
import ProductsScreen from '../screens/ProductsScreen';
import OurWork from '../screens/OurWork';
import SplashScreen from '../screens/SplashScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();




const Navigation = () => {
  const [isDollar, setIsDollar] = useState(false);


  return (
    <PaperProvider>
      <NavigationContainer>

        <CurrencyProvider>
          <Stack.Navigator>
            <Stack.Screen name='Splash' component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name='First' component={FirstScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Register' component={RegisterScreen} options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name='Home' component={BottomTabs} options={{ headerShown: false }} />
            <Stack.Screen name='Category' component={CategoryScreen} options={{ headerShown: true, title: '', presentation: 'modal' }} />
            <Stack.Screen name='View' component={ViewScreen} options={{ headerShown: false }} />
            <Stack.Screen name='Forgot' component={ForgotScreen} options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name='searchResults' component={SearchResultsScreen} options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name='manufacturers' component={ManufactureView} options={{ headerShown: true, title: '', presentation: 'modal' }} />
            <Stack.Screen name='passreset' component={ResetPassword} options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name='empty' component={EmptyScreen} options={{ headerShown: false, presentation: 'modal' }} />
            <Stack.Screen name='allmanufacturers' component={ManufacturerScreen} options={{ headerShown: true, title: 'WholeSalers', presentation: 'modal' }} />
            <Stack.Screen name='webdeals' component={DealsWeb} options={{ headerShown: true, title: 'View Deals', presentation: 'modal' }} />
            <Stack.Screen name='editProfile' component={EditProfile} options={{ headerShown: true, title: 'Edit Profile', presentation: 'modal' }} />
            <Stack.Screen name='Profile' component={ProfileScreen} options={{ headerShown: true, title: 'Profile', presentation: 'modal' }} />
            <Stack.Screen name='Use' component={UseScreen} options={{ headerShown: false, title: 'Use', presentation: 'modal' }} />
            <Stack.Screen name='Contact' component={ContactUs} options={{ headerShown: true, title: 'Contact Us', presentation:'modal' }} />
            <Stack.Screen name='Faq' component={FaqScreen} options={{ headerShown: true, title: 'FAQ', presentation:'modal' }} />
            <Stack.Screen name='About' component={AboutScreen} options={{ headerShown: true, title: 'FAQ', presentation:'modal' }} />
            <Stack.Screen name='allproducts' component={ProductsScreen} options={{ headerShown: true, title: 'All Products' }} />
            <Stack.Screen name='ourwork' component={OurWork} options={{ headerShown: true, title: 'What we Do.',presentation:'modal' }} />
          </Stack.Navigator>
        </CurrencyProvider>
      </NavigationContainer>
    </PaperProvider>
  );
}
const BottomTabs = ({ route }) => {
  const [isDollar, setIsDollar] = useState(false);
  const [email,setEmail] = useState('');
  useEffect(()=>{
    getEmail();
  },[])
  const getEmail = async() =>{
    const savedEmail = await AsyncStorage.getItem("email");
    setEmail(savedEmail);

  }

  

  return (
    <CurrencyProvider>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Shop') {
              iconName = 'home';
            }

            else if (route.name === 'Categories') {
              iconName = 'cart';
            }

            else if (route.name === 'Search') {
              iconName = 'magnify';
            }

            else if (route.name === 'Settings') {
              iconName = 'cog';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'orange', // Change the active tab color to your desired color
          inactiveTintColor: 'gray', // Change the inactive tab color to your desired color
        }}
      >

        <Tab.Screen name="Shop" component={LandingScreen} initialParams={{ email }} options={{ headerShown: false }} />



        <Tab.Screen name="Search" component={SearchResultsScreen} initialParams={{ email }} options={{ headerShown: false }} />

        <Tab.Screen name="Settings" component={SettingScreen} initialParams={{ email }} options={{ headerShown: false }} />


      </Tab.Navigator>
    </CurrencyProvider>
  );
};

export default Navigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
