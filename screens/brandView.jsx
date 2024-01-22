import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet,Modal, SafeAreaView, TextInput,RefreshControl } from 'react-native';

const BrandView = ({ route }) => {
  const [brandData, setBrandData] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [productsNotFound, setProductsNotFound] = useState(false);
  const { brandcat1, brandName } = route.params;


  //for the modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProductDescription, setSelectedProductDescription] = useState([]);


  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = () => {
    // Implement your logic here to fetch updated data from the API.
    // For simplicity, let's just simulate a refreshing delay using setTimeout.
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };


  //close a modal
  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    // Fetch the data from the API (you can use Axios, Fetch API, or any other method)
    // and set the response to the brandData state.
    // For simplicity, let's assume you have already fetched the data.
    const fetchedData = {
      "_id": "64be261bd5fae142a202ab43",
      "brandname": brandName,
      "brandimage": "https://images.pexels.com/photos/13748756/pexels-photo-13748756.jpeg?auto=compress&cs=tinysrgb&w=600",
      "categories": "Electronics",
      "subcategories": brandcat1,
      "__v": 0
    };

    // Process the subcategories string into an array of subcategory names
    if (fetchedData && fetchedData.subcategories && fetchedData.subcategories.length > 0) {
      const subcategoriesArray = fetchedData.subcategories[0].split(',');
      setBrandData({ ...fetchedData, subcategories: subcategoriesArray });

      setSelectedSubcategory(subcategoriesArray[0]);
    }
  }, []);

  useEffect(() => {
    // Fetch products from the API based on the selected category
    // Replace 'YOUR_API_URL' with the actual API endpoint to fetch products
    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://api-test-self-six.vercel.app/productlistcategoryandbrand/${brandName}/${selectedSubcategory}`);
        const data = await response.json();
        if (data.length > 0) {
          setProducts(data);
          setProductsNotFound(false);
        } else {
          setProducts([]);
          setProductsNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    // Call the fetchProducts function when the selectedSubcategory changes
    if (selectedSubcategory) {
      fetchProducts();
    }
  }, [selectedSubcategory]);

  const renderProductCard = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedProductDescription([item.sellername,item.productname,item.brand,item.category,item.phone,item.image,item.price]); // Set the selected product's description
          setModalVisible(true); // Show the modal
        }}
      >
      <View style={styles.productCard} className="bg-gray-100 shadow-lg p-2 flex items-end">
      
      <View>
        <Image source={{ uri: item.image }} style={styles.productImage} className="rounded-xl rotate-0" />
        </View>
        <View>
        <Text style={styles.productName}>Productname:{item.productname}</Text>
        <Text style={styles.productPrice}>Price:{item.price}</Text>
        <Text style={styles.productPrice}>Manufacturer:{item.sellername}</Text>
        <Text style={styles.productPrice}>Contact:{item.phone}</Text>
        
        </View>
        
        {/* Add other product details here */}
      </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} refreshControl={
      <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
    }>
      {brandData && (
        <View style={styles.body} refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }>
          
          <Text style={{ color: 'orange', fontSize: 23, fontWeight: 'bold', marginBottom: 10, paddingVertical: 30, }}>{brandData.brandname}</Text>
          <TextInput style={styles.search} placeholder="search for products from " />
          <Text style={{ color: 'orange', fontSize: 18, }}>What are you looking for?</Text>
          <FlatList
          refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
            data={brandData.subcategories}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setSelectedSubcategory(item)}
                style={[
                  styles.subcategoryButton,
                  selectedSubcategory === item && styles.selectedSubcategoryButton
                ]}
              >
                <Text style={styles.subcategoryButtonText}>{item}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {productsNotFound ? (
        <Text style={styles.noProductsText}>No products found for this subcategory.</Text>
        
      ) : (
        <FlatList
          style={{ paddingHorizontal: 30 }}
          data={products}
          renderItem={renderProductCard}
          keyExtractor={(item) => item.productId}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      )}

      {/* Lottie animation for loading */}
      {isRefreshing && (
        <View style={styles.loadingAnimation}>
          <LottieView
            source={require('../assets/anim.json')} // Replace with the actual path to your Lottie JSON file
            autoPlay
            loop
          />
        </View>
      )}

<Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            
            <View style={styles.modalImageContainer}>
              <Image source={{ uri: selectedProductDescription[5] }} className="shadow-lg bg-gray-500" style={styles.modalImage} />
            </View>
            <View style={styles.modalTextContainer}>
              <View style={{ flexDirection:'row',justifyContent: 'space-between',paddingVertical:20,}}>
              <Text numberOfLines={2} style={{ fontSize:24,fontWeight:'bold' }} className="text-3xl text-bold">{selectedProductDescription[1]}</Text>
              <Text style={{ fontSize:24,fontWeight:'bold' }} className="text-3xl text-bold">${selectedProductDescription[6]}</Text>
              </View>
              <Text style={{  }} className="text-slate-500 my-1">Manufacturer: {selectedProductDescription[0]}</Text>
              <Text style={{  }} className="text-slate-500 my-1">Subcategory: {selectedProductDescription[3]}</Text>
              <Text style={{  }} className="text-slate-500 my-1">Contact: {selectedProductDescription[4]}</Text>
              <Text style={{  }} className="text-slate-500 my-1">Brand: {selectedProductDescription[2]}</Text>
              <Text style={{  }} className="text-slate-500 my-1">Exchange Rate: </Text>
            </View>
            <TouchableOpacity onPress={closeModal} style={{ backgroundColor:'orange' }} className="rounded-xl bg-orange-300">
              <Text style={styles.closeButtonText} className="p-3 text-lg">View other products</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  body: {
    paddingHorizontal: 30,
  },
  search: {
    height: 40,
    borderColor: 'orange',
    borderWidth: 1,
    borderRadius: 9,
    paddingHorizontal: 12,
    marginBottom: 23,
  },
  subcategoryButton: {
    borderColor: 'orange',
    borderWidth: 1,
    padding: 3,
    borderRadius: 9,
    margin: 5,
  },
  selectedSubcategoryButton: {
    backgroundColor: 'orange',
  },
  subcategoryButtonText: {
    padding: 12,
    marginLeft: 10,
  },
  noProductsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: 'gray',
  },
  productCard: {

    borderColor: 'gray',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 100,
  },
  productImage: {
    width: 50,
    height: 50,
    resizeMode: 'cover',

  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    
    borderRadius: 0,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalImageContainer: {
    width: '100%',
    aspectRatio: 1, // Maintain aspect ratio of 1:1
    overflow: 'hidden', // Ensure the image doesn't exceed its container
  },
  modalImage: {
    width: '100%',
    height: '100%', // Cover the entire container while maintaining aspect ratio
    resizeMode: 'cover',
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 2 }, // Shadow offset (x, y)
    shadowOpacity: 0.25, // Shadow opacity (0 to 1)
    shadowRadius: 3.84, // Shadow radius
    borderBottomRightRadius:20,
    borderBottomLeftRadius:20,
    
  },
  modalTextContainer: {
    width: '100%',
    marginTop: 20,
    padding:20,
  },
  modalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default BrandView;
