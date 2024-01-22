import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import FeatherIcon from "react-native-vector-icons/Feather";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

function ViewScreen({ route }) {
  const { itemName, username, itemImage, itemPrice, itemManufacturer,email } = route.params;
  const navigation = useNavigation();
  const [quantity, setQuantity] = useState(1);
  

  const handleIncrement = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  const handleSubmit = () => {
    // Construct the data object to be submitted to the MongoDB database
    const data = {
      itemName,
      itemImage,
      itemPrice,
      quantity,
      itemManufacturer,
      email
    };

    // Make a POST request to the MongoDB database API
    axios.post('https://api-test-self-six.vercel.app/cart', data)
      .then(response => {
        // Handle the response, e.g., show a success message
        console.log(response.data);
        navigation.navigate('Cart',{email}); // Redirect to the cart screen after adding the item
      })
      .catch(error => {
        // Handle any errors that occurred during the request
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{ justifyContent: 'flex-start', marginTop: '10%', paddingHorizontal: 15 }}>
        <FeatherIcon name="x" size={35} color="orange" />
      </TouchableOpacity>
      <View style={styles.top}>
        <Image source={{ uri: itemImage }} style={styles.image} resizeMode="cover" />
      </View>

      <View style={styles.bottom}>
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{itemName}</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{itemManufacturer}</Text>
        
        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>Kshs.{itemPrice}</Text>

        

        <TouchableOpacity style={styles.btn} onPress={handleSubmit}>
          <Text style={styles.btntext}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default ViewScreen;




const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignSelf: "stretch",
  },
  top: {
    position: "absolute",
    top: 0,
    flex: 1,
    left: 0,
    right: 0,
    bottom: "20%",
    backgroundColor: "yellow",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: -1,
  },
  bottom: {
    position: 'absolute',
    paddingHorizontal: 15,
    backgroundColor: 'orange',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    height: 250,
  },
  btn: {
    borderWidth: 1,
    borderColor: 'white',
    backgroundColor: '#FFFFFF',
    borderRadius: 9,
    width: 200,
    alignItems: 'center',
    padding: 12,
    paddingVertical: 15,
    marginTop: 20,
  },
  closeIconContainer: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1,
  },
  btntext: {
    color: 'orange',
    fontWeight: 'bold',
    fontSize: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  quantityButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  quantityText: {
    fontSize: 20,
    marginHorizontal: 10,
  },
});
