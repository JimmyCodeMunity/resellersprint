import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native'

export default function Categories({ email }) {
    const navigation = useNavigation();


    const categories = [

        {
            id: 1,
            title: "Computers and Laptops",
            color: "#FF6347",
            image: require("../assets/mac.jpg"),
            icon: "log-in",
        },
        {
            id: 2,
            title: "UPS",
            color: "#4169E1",
            image: require("../assets/UPS.png"),
            icon: "search",
        },
        {
            id: 3,
            title: "Accessories",
            color: "#4169E1",
            image: require("../assets/access.jpg"),
            icon: "search",
        },
        {
            id: 4,
            title: "Cloths",
            color: "#32CD32",
            image: require("../assets/cloths.png"),
        },
        {
            id: 5,
            title: "Shoes",
            color: "#FF8C00",
            image: require("../assets/shoes.jpeg"),
        },
        {
            id: 6,
            title: "Gifts",
            color: "#FF8C00",
            image: require("../assets/watch.png"),
        },
        {
            id: 7,
            title: "Pet Care",
            color: "#FF8C00",
            image: require("../assets/pet.jpg"),
        },
        {
            id: 8,
            title: "Mobile and Tablets",
            color: "#FF8C00",
            image: require("../assets/mobtab.jpg"),
        },
        {
            id: 9,
            title: "Music and Gaming",
            color: "#FF8C00",
            image: require("../assets/music.png"),
        },
        {
            id: 10,
            title: "Others",
            color: "#FF8C00",
            image: require("../assets/others.png"),
        },
    ];
    return (

        <View
            style={styles.cats}

        >
            <View style={styles.cardContainer} className="flex-row flex-wrap justify-between m-1 space-y-5 space-x-1 items-center">
                {categories.map((item) => (
                    <TouchableOpacity

                        key={item.id}
                    >
                        <View style={styles.card} className="p-3 h-32 w-32 rounded-3xl" key={item.id}>

                            <LottieView
                                className="h-32 w-32"
                                source={require("../assets/noproduct.json")}
                                autoPlay
                                loop={true}
                                onAnimationFinish={() => {
                                    console.log("Animation finished");
                                }}
                            />
                            <Text>{item.title.length > 8 ? item.title.slice(0, 8) + '...' : item.title}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>

    )
}


const styles = StyleSheet.create({

    image: {
        height: 60,
        width: 60,

    },


})