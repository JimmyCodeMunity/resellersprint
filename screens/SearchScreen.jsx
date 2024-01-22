import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, SafeAreaView, TextInput, Alert, Switch, TouchableOpacity, Text, Dimensions, KeyboardAvoidingView, Platform, Linking } from 'react-native';
import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import axios from 'axios';
import * as Icon from 'react-native-feather';
import Modal from "react-native-modal";
import { useCurrency } from '../components/CurrencyProvider';
import { StatusBar } from 'expo-status-bar';


const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const SearchScreen = () => {
  const [tableHead, setTableHead] = useState(['', 'Name', 'PartNo.', 'Price', 'Action']);
  const [tableData, setTableData] = useState([]);

  const [selected, setSelected] = useState([])
  const [filteredProduct, setFilteredProducts] = useState([])
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isDollar, setIsDollar } = useCurrency();
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleCall = () => {
    const phoneNumber = selected[4];
    const countryCode = "+254";


    // Check if the phone number is valid
    if (phoneNumber) {

      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      // Construct the phone call URL
      const phoneURL = `tel:${fullPhoneNumber}`;

      // Open the phone app with the specified phone number
      Linking.canOpenURL(phoneURL)
        .then((supported) => {
          if (!supported) {
            console.error("Phone calls are not supported on this device");
          } else {
            return Linking.openURL(phoneURL);
          }
        })
        .catch((error) => console.error(`Error opening phone app: ${error}`));
    } else {
      console.error("Phone number is not available");
    }
  }





  //handle whatsapp
  const handleWhatsapp = () => {
    const phoneNumber = selected[4];
    const countryCode = "+254";
    if (phoneNumber) {
      const fullPhoneNumber = `${countryCode}${phoneNumber}`;
      const phoneURL = `tel:${fullPhoneNumber}`;
      // Construct the WhatsApp chat URL
      const whatsappURL = `https://wa.me/${fullPhoneNumber}`;

      // Open the WhatsApp chat with the specified phone number
      Linking.canOpenURL(whatsappURL)
        .then((supported) => {
          if (!supported) {
            console.error("WhatsApp is not installed on this device");
          } else {
            return Linking.openURL(whatsappURL);
          }
        })
        .catch((error) => console.error(`Error opening WhatsApp chat: ${error}`));
    } else {
      console.error("Phone number is not available");
    }
  }




  useEffect(() => {
    fetchData();
  }, []);




  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://opasso-app-backend.vercel.app/api/product/productlist');
      const apiData = response.data;
      setFilteredProducts(apiData)
      setLoading(false)

      if (apiData.length > 0) {
        setTableHead(['Name', 'PartNo.', 'Price', 'Action']);

        const rows = apiData.map((item, index) => [
          item.name,
          item.partNumber,
          item.discountPrice,
          item.available,
        ]);

        //setTableData(rows);
        //console.log("data",tableData)
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };
  const handleActionPress = ({ tableData }) => {
    console.log('rowData:', selected); // Log the entire rowData to inspect its structure

    Alert.alert('Selected Item', selected[1]);
  };
  //filter
  const filteredProducts = filteredProduct.filter((filteredProduct) =>
    filteredProduct.name.toLowerCase().includes(searchQuery.toLowerCase())
  );





  const renderProductTable = () => {



    const tableData = filteredProducts.map((item) => [
      item.name,
      item.partNumber,
      isDollar
        ? `$ ${Number((item.discountPrice / item.shop.exchangeRate).toFixed(2)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : `KES ${Number(item.discountPrice.toFixed(2)).toLocaleString('en-US')}`,


        < View className = "justify-center items-center" >
        <TouchableOpacity
          className="bg-orange-500 w-16 rounded-2xl h-8 justify-center items-center"
          onPress={() => {
            setSelected([
              item.shop.name,
              item.name,
              item.brand,
              item.category,
              item.shop.phoneNumber,
              item.shop.exchangeRate,
              item.discountPrice,
            ]);
            setModalVisible(true)

          }}
          style={styles.viewDetailsButton}
        >
          <Text style={styles.viewDetailsButtonText}>View</Text>
        </TouchableOpacity>
      </View >,
    ]);

return (
  <Table borderStyle={{ borderWidth: 1 }}>
    <Row data={tableHead} flexArr={[5, 4, 2, 2]} widthArr={[160, 180, 200, 220]} style={styles.head} textStyle={styles.text} />
    <TableWrapper style={styles.wrapper}>
      <Rows
        // Access the name at index 0
        data={tableData}
        flexArr={[5, 4, 2, 2]}
        widthArr={[160, 180, 200, 220]}
        style={styles.row}
        textStyle={styles.text}
      />
    </TableWrapper>
  </Table>
);
  };

return (
  <SafeAreaView className="flex-1" style={styles.container}>
    <View className="px-4 mt-8">
      <Text className="text-orange-400 font-bold text-3xl">Search</Text>
    </View>
    <View className="flex-row justify-between items-center px-5 py-5">

      <View>
        <Text className="text-xl text-slate-500 font-semibold flex-row justify-between item-center">Currency:
          <Text className="font-bold px-2" style={{ textDecorationLine: isDollar ? 'none' : 'line-through', color: isDollar ? 'black' : 'gray' }}>USD</Text> ||
          <Text style={{ textDecorationLine: isDollar ? 'line-through' : 'none', color: isDollar ? 'gray' : 'black' }}> KES</Text>
        </Text>

      </View>

      <View>
        <Switch
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={isDollar ? '#f4f3f4' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setIsDollar((prevState) => !prevState)}
          value={isDollar}
        />
      </View>
    </View>

    <View className="flex-row justify-between items-center">
      <View className="w-full px-4 py-4">
        <TextInput
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          className="w-full h-10 border border-slate-300 rounded-2xl bg-white px-4" placeholder='enter productname' />
      </View>


    </View>

    <ScrollView horizontal={true} contentContainerStyle={{ paddingHorizontal: 20 }}>
      <ScrollView vertical={true}>
        {loading ? (
          <View className="flex-1">
            <Text className="text-slate-900">Loading...</Text>
          </View>

        ) : (
          <View>
            {renderProductTable()}
          </View>

        )}

      </ScrollView>
    </ScrollView>

    {/* <Modal animationType="slide" transparent={true} visible={modalVisible} className="justify-center items-center mt-12">

      </Modal> */}


    <Modal
      isVisible={modalVisible}
      onBackdropPress={() => setModalVisible(false)}
      style={styles.modalContainer}
    >
      <View
        className=""
        style={[
          styles.bottomSheetContainer1,
          { height: windowHeight * 0.8 },
        ]}
      >
        <View>
          <TouchableOpacity onPress={() => setModalVisible(false)} className="bg-slate-400 justify-center items-center rounded-2xl h-12 w-12">
            <Icon.XCircle size={30} color={"orange"} />
          </TouchableOpacity>
        </View>
        <View className="justify-center items-center">
          <Text className="text-slate-800 text-2xl font-semibold">Product Details</Text>
        </View>
        <ScrollView vertical={true}>
          <View className="justify-center">
            <Text className="text-3xl font-bold text-slate-500 space-x-4 py-3">{selected[1]}</Text>
            {/* <Text style={{ fontSize: 24, fontWeight: 'bold' }} className="text-xl text-bold">
              {isDollar
                ? '$ ' + (Number(selected[6] / selected[5])).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                : 'KES ' + selected[6].toLocaleString('en-US')}
            </Text> */}
            <Text style={{ fontSize: 24, fontWeight: 'bold' }} className="text-xl text-bold">
                {isDollar ? '$ ' + Number(selected[6] / selected[5]).toFixed(2) : 'KES ' + selected[6]}
              </Text>
            <Text className="text-xl text-slate-600 font-semibold">Manufacturer:{selected[0]}</Text>
            <Text className="text-xl text-slate-600 font-semibold">Brand:{selected[2]}</Text>
            <Text className="text-xl text-slate-600 font-semibold">SubCategory:{selected[3]}</Text>
            <Text className="text-xl text-slate-600 font-semibold">ExchangeRate:{selected[5]}</Text>
          </View>
          <View className="py-2">
            <TouchableOpacity onPress={handleWhatsapp} className="rounded-2xl flex-row bg-green-500 p-2 w-90 h-12 justify-center items-center">
              <Icon.MessageCircle size={23} color={"white"} />
              <Text className="text-2xl font-semibold text-slate-700">Chat</Text>

            </TouchableOpacity>
          </View>
          <View className="py-2">
            <TouchableOpacity onPress={handleCall} className="rounded-2xl flex-row p-2 bg-black w-90 h-12 justify-center items-center">
              <Icon.Phone size={23} color={"white"} />
              <Text className="text-2xl font-semibold text-slate-200">Call</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </View>
    </Modal>
  </SafeAreaView>
);
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 20, backgroundColor: '#f1f8ff', minWidth: 300 },
  wrapper: { flexDirection: 'row' },
  row: { height: 70 },
  text: { textAlign: 'center' },
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
  modalContainer: {
    justifyContent: "flex-end",
    margin: 0,
    height: "50%",
  },
});

export default SearchScreen;
