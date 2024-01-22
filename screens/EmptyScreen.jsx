import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    ScrollView,
    Switch,
    StyleSheet,
    Modal,
    SafeAreaView,
    TextInput,
    RefreshControl,
} from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useCurrency } from '../components/CurrencyProvider';
import { prices } from '../constants/Prices';
import { names } from '../constants/NameFilter';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';


const EmptyScreen = ({ route, navigation }) => {
    const [products, setProducts] = useState([]);
    const [productsNotFound, setProductsNotFound] = useState(false);
    const { manId, manImage, manName, manPhone, manEmail } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [filterModalVisible, setFilterModalVisible] = useState(false);
    const [selectedProductDescription, setSelectedProductDescription] = useState([]);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const { isDollar, setIsDollar } = useCurrency();

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceFilter, setPriceFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');

    const [value, setValue] = useState(null);
    const [isFocusCat, setIsFocusCat] = useState(false);
    const [isFocusPrice, setIsFocusPrice] = useState(false);
    const [selectedPriceRange, setSelectedPriceRange] = useState('');





    const onRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };

    const closeModal = () => {
        setModalVisible(false);
        setFilterModalVisible(false);
    };

    const renderLabel = () => {
        if (value || isFocusCat) {
            return (
                <Text style={[styles.label, isFocusCat && { color: 'blue' }]}>
                    Dropdown label
                </Text>
            );
        }
        return null;
    };

    // Fetch products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`https://opasso-server.vercel.app/products/${manId}`);
                const data = await response.json();
                if (data.length > 0) {
                    setProducts(data);
                    setFilteredProducts(data); // Initialize filteredProducts with all products
                    setProductsNotFound(false);
                } else {
                    setProducts([]);
                    setFilteredProducts([]); // Initialize filteredProducts with an empty array
                    setProductsNotFound(true);
                }
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [manId]);

    //Apply filters when any filter criteria change
    useEffect(() => {
        applyFilters();
    }, [priceFilter, nameFilter, isDollar]);

    // Apply filters function
    const applyFilters = () => {
        // Filter by price
        const priceFiltered = priceFilter
            ? products.filter((product) =>
                isDollar
                    ? product.discountPrice / product.shop.exchangeRate <= priceFilter
                    : product.discountPrice <= priceFilter
            )
            : products;

        // Filter by name
        const nameFiltered = nameFilter
            ? priceFiltered.filter((product) =>
                product.name.toLowerCase().includes(nameFilter.toLowerCase())
            )
            : priceFiltered;

        setFilteredProducts(nameFiltered);
    };


    // Function to clear filters
    const clearFilters = () => {
        setPriceFilter(''); // Clear price filter
        setNameFilter('');  // Clear name filter
        setFilteredProducts(products); // Reset filteredProducts to all products
    };

    const renderProductTable = () => {
        const tableHead = ['Image', 'Name', 'Price', 'Shop', 'Exchange Rate', 'Actions'];

        const tableData = filteredProducts.map((item) => [
            <Image source={{ uri: item.images[0].url }} style={styles.productImage} />,
            item.name.length > 25 ? item.name.slice(0, 25) + '...' : item.name,
            isDollar ? `$ ${item.discountPrice / item.shop.exchangeRate}` : `${item.discountPrice} Kshs`,
            item.shop.name,
            item.shop.exchangeRate,
            <TouchableOpacity
                onPress={() => {
                    setSelectedProductDescription([
                        item.shop.name,
                        item.name,
                        item.brand,
                        item.category,
                        item.shop.phoneNumber,
                        item.images[0].url,
                        item.shop.exchangeRate,
                        item.discountPrice,
                    ]);
                    setModalVisible(true);
                }}
                style={styles.viewDetailsButton}
            >
                <Text style={styles.viewDetailsButtonText}>View</Text>
            </TouchableOpacity>,
        ]);

        return (
            <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                <Row data={tableHead} style={styles.head} textStyle={styles.text} />

                {tableData.map((rowData, index) => (
                    <Row key={index} data={rowData} style={styles.row} textStyle={styles.text} />
                ))}
            </Table>
        );
    };

    return (
        <SafeAreaView style={styles.container} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}>
            <View style={styles.body}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image source={{ uri: manImage }} style={{ width: 30, height: 30, marginRight: 10, borderRadius: 50 }} />
                    <Text style={{ color: 'orange', fontSize: 23, fontWeight: 'bold', marginBottom: 10, paddingVertical: 10 }}>
                        {manName}
                    </Text>
                </View>
                <View className="flex-row justify-between items-center mb-8">
                    <View>
                        <Text className="text-xl text-slate-500 font-semibold">Currency:{isDollar ? 'USD' : 'KSH'}</Text>
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


                

            </View>

            <ScrollView style={{ flex: 1, marginTop: -1 }}>
                {productsNotFound ? (
                    <Text style={styles.noProductsText}>No products found for this manufacturer.</Text>
                ) : (
                    renderProductTable()
                )}

                {isRefreshing && (
                    <View style={styles.loadingAnimation}>
                        {/* <LottieView source={require('../assets/anim.json')} autoPlay loop /> */}
                        <Text>Loading...</Text>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity
                onPress={() => {
                    // Navigate to the next screen (replace 'NextScreen' with the actual screen name)
                    navigation.goBack();
                }}
                style={styles.nextScreenButton}
            >
                <Text style={styles.nextScreenButtonText}>Continue</Text>
            </TouchableOpacity>


            {/* filter modal goes here */}
            <Modal animationType="slide" transparent={false} visible={filterModalVisible}>
                <ScrollView>
                    <View style={styles.modalContainer2}>
                        <View style={styles.modalContent2}>
                            <View className="w-full">
                                
                            </View>
                            
                            
                            <View style={{ marginBottom: '10%' }}>
                                <TouchableOpacity onPress={closeModal} style={{ backgroundColor: 'orange' }} className="rounded-xl bg-orange-300 h-12">
                                    <Text style={styles.closeButtonText} className="p-3 text-lg">
                                        Close
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Modal>

            <Modal animationType="slide" transparent={false} visible={modalVisible}>
                <ScrollView>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalImageContainer}>
                                <Image source={{ uri: selectedProductDescription[5] }} style={styles.modalImage} />
                            </View>
                            <View style={styles.modalTextContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, flexWrap: 'wrap' }}>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }} className="text-xl text-bold">
                                        {selectedProductDescription[1]}
                                    </Text>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold' }} className="text-xl text-bold">
                                        ${selectedProductDescription[7]}
                                    </Text>
                                </View>
                                <Text style={{}} className="text-slate-500 my-1">
                                    Manufacturer: {selectedProductDescription[0]}
                                </Text>
                                <Text style={{}} className="text-slate-500 my-1">
                                    Subcategory: {selectedProductDescription[3]}
                                </Text>
                                <Text style={{}} className="text-slate-500 my-1">
                                    Contact: {selectedProductDescription[4]}
                                </Text>
                                <Text style={{}} className="text-slate-500 my-1">
                                    Brand: {selectedProductDescription[2]}
                                </Text>
                                <Text style={{}} className="text-slate-500 my-1">
                                    Exchange Rate: {selectedProductDescription[6]}
                                </Text>
                            </View>
                            <View style={{ marginBottom: '10%' }}>
                                <TouchableOpacity onPress={closeModal} style={{ backgroundColor: 'orange' }} className="rounded-xl bg-orange-300">
                                    <Text style={styles.closeButtonText} className="p-3 text-lg">
                                        View other products
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    body: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    categoryImage: {
        width: 30,
        height: 30,
        marginRight: 10,
        borderRadius: 50,
    },
    categoryName: {
        color: 'orange',
        fontSize: 23,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    search: {
        height: 40,
        borderColor: 'orange',
        borderWidth: 1,
        borderRadius: 9,
        paddingHorizontal: 12,
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitle: {
        color: 'orange',
        fontSize: 18,
        marginVertical: 15,
    },
    noProductsText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 18,
        color: 'gray',
    },
    productImage: {
        width: 40,
        height: 40,
        resizeMode: 'cover',
        marginBottom: 5,
    },
    head: {
        height: 40,
        backgroundColor: '#f1f8ff',
    },
    text: {
        margin: 6,
    },
    row: {
        height: 50,
        backgroundColor: 'white',
    },
    viewDetailsButton: {
        borderRadius: 9,
        alignItems: 'center',
        marginTop: 10,
    },
    viewDetailsButtonText: {
        color: 'orange',
        fontWeight: 'bold',
        fontSize: 15,
    },
    nextScreenButton: {
        backgroundColor: 'orange',
        padding: 12,
        borderRadius: 9,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
        marginHorizontal: 20,
    },
    nextScreenButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
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
    modalContainer2: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent2: {
        backgroundColor: 'white',
        borderRadius: 0,
        width: '100%',
        height: '50%',
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
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    modalTextContainer: {
        width: '100%',
        marginTop: 20,
        padding: 20,
    },
    modalText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 20,
        marginBottom: 30,
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


    dropdown: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    icon: {
        marginRight: 5,
    },
    label: {
        position: 'absolute',
        backgroundColor: 'white',
        left: 22,
        top: 8,
        zIndex: 999,
        paddingHorizontal: 8,
        fontSize: 14,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
});

export default EmptyScreen;
