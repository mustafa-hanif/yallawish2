import React from "react";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import * as LucideIcons from "lucide-react-native";

interface RecommendedBestsellersProps {
  isDesktop: boolean;
  responsiveStyles: any;
}

export const RecommendedBestsellers: React.FC<RecommendedBestsellersProps> = ({ isDesktop, responsiveStyles }) => {
  return (
    <View>
      {isDesktop && (
        <View style={{
          backgroundColor: '#FFFFFF',
          paddingVertical: 80,
          paddingHorizontal: 0,
        }}>
          <View style={responsiveStyles.sectionInner}>
            <View style={{ alignItems: 'center', marginBottom: 48 }}>
              <View style={{
                backgroundColor: '#F8A8D4',
                paddingHorizontal: 16,
                paddingVertical: 6,
                borderRadius: 20,
                marginBottom: 16,
                transform: [{ rotate: '-3deg' }],
              }}>
                <Text style={{
                  fontFamily: 'Nunito_700Bold',
                  fontSize: 12,
                  color: '#FFFFFF',
                  textTransform: 'uppercase',
                }}>
                  Best of the Week
                </Text>
              </View>
              <Text style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 42,
                color: '#1A0034',
                textAlign: 'center',
              }}>
                Recommended Bestsellers
              </Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 24, justifyContent: 'space-between' }}>
              {[
                {
                  id: 1,
                  title: "Classic PX Smart Watch",
                  category: "Accessories, Watches",
                  price: "AED249.00 - AED399.00",
                  image: require("@/assets/images/homepage/arrivals/arrival1.png"),
                  bgColor: "#E6F4FE", // Light Blue
                },
                {
                  id: 2,
                  title: "Baby Girl Warm Shirt",
                  category: "Clothes, Baby",
                  price: "AED99.00 - AED199.00",
                  image: require("@/assets/images/homepage/arrivals/arrival5.png"),
                  bgColor: "#F3E8FF", // Light Purple
                },
                {
                  id: 3,
                  title: "Frames Upholstered Chair",
                  category: "Furniture, Chairs",
                  price: "AED549.00",
                  image: require("@/assets/images/homepage/arrivals/arrival3.png"),
                  bgColor: "#FEFBEB", // Light Yellow
                },
              ].map((item) => (
                <View key={item.id} style={{
                  flex: 1,
                  maxWidth: 400,
                }}>
                  <View style={{
                    backgroundColor: item.bgColor,
                    borderRadius: 16,
                    aspectRatio: 1.2,
                    marginBottom: 24,
                    position: 'relative',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                  }}>
                    <Image 
                      source={item.image} 
                      style={{ width: '80%', height: '80%' }}
                      contentFit="contain"
                    />
                    <Pressable style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#330065',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <LucideIcons.Heart size={18} color="#FFFFFF" />
                    </Pressable>
                  </View>
                  
                  <View style={{ alignItems: 'center' }}>
                    <Text style={{
                      fontFamily: 'Nunito_700Bold',
                      fontSize: 20,
                      color: '#1A0034',
                      textAlign: 'center',
                      marginBottom: 8,
                    }}>
                      {item.title}
                    </Text>
                    <Text style={{
                      fontFamily: 'Nunito_400Regular',
                      fontSize: 14,
                      color: '#6F5F8F',
                      textAlign: 'center',
                      marginBottom: 8,
                    }}>
                      {item.category}
                    </Text>
                    <Text style={{
                      fontFamily: 'Nunito_700Bold',
                      fontSize: 18,
                      color: '#DC2626',
                      textAlign: 'center',
                    }}>
                      {item.price}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

