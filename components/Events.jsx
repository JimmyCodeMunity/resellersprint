import React, { useState, useEffect } from 'react';
import { View, Image, Dimensions, Text, Linking, TouchableWithoutFeedback } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { urlFor } from '../sanity';
import { getEvents } from '../api';
import { useNavigation } from '@react-navigation/native';
import CarouselCard from './Card.jsx';
import ExplainCard from './ExplainCard.jsx';
import axios from 'axios';


const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const Events = () => {
    const [events, setEvents] = useState([]);
    const navigation = useNavigation();



    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const event = await axios.get('https://opasso-app-backend.vercel.app/api/event/allevents');
                setEvents(event.data);
                //console.log('Events:', eventsData.length);
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    const eventsData = events.map((event) => ({
        title: event.name, // Add title to data for rendering in the carousel
        imageUri: event.images[0],
        link: event.shop,
        description: event.event_description,
        original: event.originalPrice,
        discount: event.discountPrice,
        seller:event.shop.name,
    }));

    const renderCarouselItem = ({ item }) => {
        const handleEventPress = () => {
            Linking.openURL(item.link)
        }
        return (
            <View>


                <TouchableWithoutFeedback onPress={() => navigation.navigate('webdeals', { link: item.link })} className="">

                    <Image
                        className="rounded-3xl shadow-lg shadow-gray-900"
                        style={{
                            width: windowWidth * 0.9,
                            height: windowHeight * 0.3,
                        }}
                        source={{ uri: item.imageUri }}
                    />
                </TouchableWithoutFeedback>

            </View>
        );
    };

    // Conditionally render the Carousel only when there are more than 2 items
    if (eventsData.length > 0) {
        return (

            <View className="w-full mb-3">
                <Text className="text-slate-900 px-4 font-bold text-xl py-5">Ads&Discounts</Text>


                <Carousel
                    data={eventsData}
                    renderItem={({ item }) => <ProductCard item={item} />}
                    inactiveSlideOpacity={0.8}
                    sliderWidth={windowWidth}
                    itemWidth={windowWidth * 0.85}
                    itemHeight={windowHeight * 0.3}
                    slideStyle={{ display: 'flex', alignItems: 'center' }}
                    loop={true}
                    autoplay={true}
                    autoplayInterval={3000}
                    // layout={'stack'}
                    layoutCardOffset={`18`}
                />

            </View>
        );
    } else {
        // Render something else or nothing if there are 2 or fewer items
        return (<ExplainCard />)
    }
};

const ProductCard = ({ item }) => {
    return (
        <TouchableWithoutFeedback>
            <View className="h-40 w-full rounded-3xl shadow-sm bg-gray-300">
                <View className="flex-row justify-between items-center">
                    <View className="px-3 p-3" style={{ width: '50%' }}>
                        <Text className="text-lg font-semibold" style={{ color: item.textcolor }}>{item.title}</Text>
                        <Text className="text-2xl font-bold">{item.description}</Text>
                        <View className="py-3">
                            <Text className="font-semibold text-orange-500 my-1" style={{ textDecorationLine: "line-through" }}>Kshs.{item.original}</Text>
                            <Text className="text-slate-900 font-semibold text-lg">Kshs.{item.discount}</Text>
                        </View>
                    </View>
                    <View className="justify-center items-center" style={{ width: '30%', zIndex: -2 }}>
                        <Image source={require('../assets/user.jpeg')} className="h-16 w-16 my-1 rounded-full"/>
                        <Text className="font-semibold">{item.seller}</Text>
                    </View>
                </View>

            </View>
        </TouchableWithoutFeedback>
    )
}

export default Events;
