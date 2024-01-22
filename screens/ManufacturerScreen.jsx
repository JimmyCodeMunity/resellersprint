import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity, Image, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useCurrency } from '../components/CurrencyProvider';





const ManufacturerScreen = ({ navigation, route }) => {
  const [manufacturer, setManufacturer] = useState([]);
  const { isDollar, setIsDollar } = useCurrency();
  const [loading,setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');




  //fetch manufactures
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



  //filter
  const filteredManufacturers = manufacturer.filter((manufacturer) =>
    manufacturer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <SafeAreaView className="flex-1 bg-white">
      <SafeAreaView className="justify-center items-center mt-8">
        <Text className="text-orange-500 font-bold text-2xl">All Wholesalers</Text>
      </SafeAreaView>
      <View className="p-5 justify-center items-center">
        <TextInput
          className="h-12 w-full border border-slate-300 px-5 rounded-2xl"
          placeholder="Search by name"
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
        />
      </View>
      <ScrollView vertical={true}>
        {loading ? (
          <View>
            <Text>Loading.....</Text>
          </View>

        ): (
          <View className="flex-1 px-5">
          {filteredManufacturers.map((manufacturer) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("manufacturers", {
                    manName: manufacturer.name,
                    mancat1: manufacturer.category,
                    manEmail: manufacturer.email,
                    manAddress: manufacturer.address,
                    manPhone: manufacturer.phoneNumber,
                    manId: manufacturer._id,
                    manRate: manufacturer.exchangeRate,
                    currency: isDollar,
                  })
                }
                key={manufacturer._id}
              >
                <View className="space-y-1 mr-4 my-2" key={manufacturer.id}>


                  <View className="flex-row justify-between items-center p-2 rounded-2xl h-18 w-18 border border-orange-400 border-md">
                    <View>
                      <Image className="rounded-full"
                        source={require('../assets/opaso.png')}
                        style={{
                          height: 60, width: 60,
                        }}
                        resizeMode="cover"
                      />
                    </View>
                    <View className="justify-start" style={{ width: '50%' }}>
                      <Text className="text-neutral-600 mt-3 font-bold">

                        {manufacturer.name.length > 12 ? manufacturer.name.slice(0, 12) + '...' : manufacturer.name}
                      </Text>
                      <Text>Exchange Rate:{manufacturer.exchangeRate}</Text>

                    </View>
                  </View>


                </View>
              </TouchableOpacity>
            )
          })}
        </View>

          )}



        
      </ScrollView>
    </SafeAreaView>
  )
}

export default ManufacturerScreen

const styles = StyleSheet.create({})