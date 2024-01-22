import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CallButton = ({manPhone}) => {
  return (
    <TouchableOpacity
                onPress={() => {
                  // Extract the phone number from the route params or replace with your actual data structure
                  const phoneNumber = route.params.manPhone;

                  // Check if the phone number is valid
                  if (phoneNumber) {
                    // Construct the phone call URL
                    const phoneURL = `tel:${phoneNumber}`;

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
                }}
                className="bg-orange-400 h-12 w-50 justify-center items-center rounded-3xl"
              >
                <Text style={styles.viewDetailsButtonText}>Make Phone Call</Text>
              </TouchableOpacity>
  )
}

export default CallButton

const styles = StyleSheet.create({})