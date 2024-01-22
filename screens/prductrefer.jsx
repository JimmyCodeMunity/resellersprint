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
    SafeAreaView,
    TextInput,
    RefreshControl,
    Dimensions,
    KeyboardAvoidingView,
    Platform,
    Linking
} from 'react-native';
import { Table, Row } from 'react-native-table-component';
import { useCurrency } from '../components/CurrencyProvider';
import { prices } from '../constants/Prices';
import { names } from '../constants/NameFilter';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import FeatherIcon from "react-native-vector-icons/Feather";
import Modal from "react-native-modal";
import * as Icon from 'react-native-feather';
import { StatusBar } from 'expo-status-bar';



const height = Dimensions.get('window').height;
const width = Dimensions.get('window').width;



const ProductsScreen = ({ route, navigation }) => {
    const [products, setProducts] = useState([]);
    const [productsNotFound, setProductsNotFound] = useState(false);
    //const { manId, manImage, manName, manPhone, manEmail, manRate } = route.params;

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedProductDescription, setSelectedProductDescription] = useState([]);
    const [filterModal, setFilterModal] = useState(false);

    const [isRefreshing, setIsRefreshing] = useState(false);
    const { isDollar, setIsDollar } = useCurrency();

    const [filteredProducts, setFilteredProducts] = useState([]);
    const [priceFilter, setPriceFilter] = useState('');
    const [nameFilter, setNameFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    // Inside your component...
    const [partNumberFilter, setPartNumberFilter] = useState(''); // Add this state variable





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
    };


    const handleCall = () => {
        const phoneNumber = selectedProductDescription[4];
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
        const phoneNumber = selectedProductDescription[4];
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
                const response = await fetch(`https://opasso-app-backend.vercel.app/api/product/productlist`);
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
    }, []);

    //Apply filters when any filter criteria change
    useEffect(() => {
        applyFilters();
    }, [priceFilter, categoryFilter, brandFilter, partNumberFilter, isDollar]);

    // Apply filters function
    const applyFilters = () => {
        // Filter by price
        const priceFiltered = priceFilter
            ? products.filter((product) => {
                const price = isDollar
                    ? product.discountPrice / product.shop.exchangeRate
                    : product.discountPrice;
                return price >= priceFilter * 0.9 && price <= priceFilter * 1.1;
            })
            : products;

        // Filter by name
        const nameFiltered = categoryFilter
            ? priceFiltered.filter((product) =>
                product.name && product.name.toLowerCase().includes(categoryFilter.toLowerCase())
            )
            : priceFiltered;

        // Filter by brand
        const brandFiltered = brandFilter
            ? nameFiltered.filter((product) =>
                product.brand && product.brand.toLowerCase().includes(brandFilter.toLowerCase())
            )
            : nameFiltered;

        // Filter by part number
        const partNumberFiltered = partNumberFilter
            ? brandFiltered.filter((product) =>
                product.partNumber && product.partNumber.toLowerCase().includes(partNumberFilter.toLowerCase())
            )
            : brandFiltered;

        setFilteredProducts(partNumberFiltered);

        if (partNumberFiltered.length === 0) {
            // Handle the case when no products match the filters
            setProductsNotFound(true);
        } else {
            setProductsNotFound(false);
        }
    };





    // Function to clear filters
    const clearFilters = () => {
        setPriceFilter(''); // Clear price filter
        setNameFilter('');  // Clear name filter
        setBrandFilter('');
        setPartNumberFilter('');
        setCategoryFilter('');
        setFilteredProducts(products); // Reset filteredProducts to all products
    };

    const renderProductTable = () => {
        const tableHead = ['PartNo.', 'Desc.', 'Brand', isDollar ? 'USD' : 'KES', 'Available', 'Actions'];

        const tableData = filteredProducts.map((item) => [
            item.partNumber,
            item.name.length > 25 ? item.name.slice(0, 25) + '...' : item.name,
            item.brand,
            isDollar
                ? `$ ${Number((item.discountPrice / item.shop.exchangeRate).toFixed(2))}`
                : `KES ${Number(item.discountPrice.toFixed(2))}`,

            item.isAvailable ? <Icon.Check color="green" className="text-center" size={20} /> : <Icon.X color="orange" className="text-center" size={20} />,
            <TouchableOpacity
                onPress={() => {
                    setSelectedProductDescription([
                        item.shop.name,
                        item.name,
                        item.brand,
                        item.category,
                        item.shop.phoneNumber,
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
                    <Row key={index} data={rowData} style={styles.row} className="justify-center text-center" textStyle={styles.text} />
                ))}
            </Table>
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <StatusBar style="dark" backgroundColor='black' />



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






            <ScrollView className="w-full">
                {productsNotFound ? (
                    <View className="justify-center items-center">
                        <LottieView
                            className="h-32 w-32"
                            source={require("../assets/noproduct.json")}
                            autoPlay
                            loop={true}
                            onAnimationFinish={() => {
                                console.log("Animation finished");
                            }}
                        />
                        <Text className="text-slate-500">No Products Found!!</Text>
                    </View>
                ) : (
                    renderProductTable()
                )}

                {isRefreshing && (
                    <View style={styles.loadingAnimatio} className="justify-center items-center">
                        {/* <LottieView source={require('../assets/anim.json')} autoPlay loop /> */}
                        <Text>Loading...</Text>
                    </View>
                )}
            </ScrollView>








            <Modal animationType="slide" transparent={true} visible={modalVisible} className="justify-center items-center mt-12">
                <ScrollView vertical={true} showsVerticalScrollIndicator={false}>

                    <View style={styles.modalContainer} className="justify-center items-center">
                        <View style={styles.modalContent} className="bg-slate-200 rounded 3xl p-4">


                            <View style={styles.modalTextContainer}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 20, flexWrap: 'wrap' }}>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10 }} className="text-xl text-bold">
                                        {selectedProductDescription[1]}
                                    </Text>
                                    <Text style={{ fontSize: 24, fontWeight: 'bold' }} className="text-xl text-bold">
                                        {isDollar ? '$ ' + Number(selectedProductDescription[6] / selectedProductDescription[5]).toFixed(2) : 'KES ' + selectedProductDescription[6]}
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
                                    Exchange Rate: {selectedProductDescription[5]}
                                </Text>
                            </View>

                            <View className="py-2">
                                <TouchableOpacity onPress={handleWhatsapp} className="rounded-2xl flex-row bg-green-500 p-2 w-40 h-12 justify-center items-center">
                                    <Icon.MessageCircle size={23} color={"white"} />
                                    <Text className="text-2xl font-semibold text-slate-700">Chat</Text>

                                </TouchableOpacity>
                            </View>
                            <View className="py-2">
                                <TouchableOpacity onPress={handleCall} className="rounded-2xl flex-row p-2 bg-black w-40 h-12 justify-center items-center">
                                    <Icon.Phone size={23} color={"white"} />
                                    <Text className="text-2xl font-semibold text-slate-200">Call</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="py-4">
                                <TouchableOpacity onPress={closeModal} style={{ backgroundColor: 'orange', }} className="rounded-full p-2 bg-orange-300 w-40 h-10 justify-center items-center">
                                    <Text className="text-2xl font-semibold text-slate-700">Close</Text>
                                </TouchableOpacity>
                            </View>



                        </View>
                    </View>
                </ScrollView>
            </Modal>




            {/* filter modal goes here */}
            <Modal transparent={true} onBackdropPress={() => setFilterModal(false)} isVisible={filterModal} className="justify-center">
                <KeyboardAvoidingView
                    behavior="position" // Use 'position' behavior
                    style={styles.keyboardAvoidingContainer}
                >
                    <View className="bg-white rounded-3xl w-full absolute justify-center items-center" style={{ height: height * 0.5, bottom: 0, }}>
                        <Text className="text-orange-500 font-bold text-2xl">
                            <FeatherIcon name="filter" size={30} color="white" />
                            Filter</Text>

                        <View>
                            <View>
                                <View style={{ paddingHorizontal: 20 }}>
                                    <TextInput
                                        className="border border-orange-300 w-80 rounded-2xl mt-1 px-3"
                                        placeholder="Enter name"
                                        placeholderTextColor={'gray'}
                                        value={categoryFilter}
                                        onChangeText={(text) => setCategoryFilter(text)}
                                        style={styles.inputSearchStyle}
                                    />
                                    <TextInput
                                        className="border border-orange-300 w-80 rounded-2xl px-3 mt-3"
                                        placeholder="Enter max price"
                                        keyboardType="numeric"
                                        placeholderTextColor={'gray'}
                                        value={priceFilter.toString()}
                                        onChangeText={(text) => setPriceFilter(text)}
                                        style={styles.inputSearchStyle}
                                    />
                                    <TextInput
                                        className="border border-orange-300 w-80 rounded-2xl px-3 mt-3"
                                        placeholder="Enter Brand"
                                        placeholderTextColor={'gray'}
                                        value={brandFilter.toString()}
                                        onChangeText={(text) => setBrandFilter(text)}
                                        style={styles.inputSearchStyle}
                                    />
                                    <TextInput
                                        className="border border-orange-300 w-80 rounded-2xl px-3 mt-3"
                                        placeholder="Filter by Part Number"
                                        value={partNumberFilter}
                                        placeholderTextColor={'gray'}
                                        onChangeText={(text) => setPartNumberFilter(text)}
                                        style={styles.inputSearchStyle}
                                    />

                                    <TouchableOpacity
                                        onPress={() => {
                                            applyFilters(); // Apply filters when the "Apply" button is pressed
                                            setFilterModal(false); // Close the modal
                                        }}
                                        style={styles.nextScreenButton}
                                    >
                                        <Text style={styles.nextScreenButtonText}>Apply</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            clearFilters(); // Clear filters when the "Clear" button is pressed
                                            setFilterModal(false); // Close the modal
                                        }}
                                        style={styles.nextScreenButton}
                                    >
                                        <Text style={styles.nextScreenButtonText}>Clear</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
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
        margin: 4,
        fontSize: 12,
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

        width: '100%',
        height: '100%',
        alignItems: 'center',
    },

    modalContent2: {
        backgroundColor: 'black',
        borderRadius: 0,
        width: '100%',
        height: '30%', // Adjust the height to occupy 30% of the screen
        alignItems: 'center',
        borderTopLeftRadius: 20, // Optional for rounded corners
        borderTopRightRadius: 20, // Optional for rounded corners
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
    bottomSheetContainer2: {

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
        height: 60,
        width: "60%",
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

export default ProductsScreen;
