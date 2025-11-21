import React from "react";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

interface PromotionsProps {
  isDesktop: boolean;
  responsiveStyles: any;
}

export const Promotions: React.FC<PromotionsProps> = ({ isDesktop, responsiveStyles }) => {
  return (
    <View>
      {isDesktop && (
        <View style={{
          backgroundColor: '#FFFFFF',
          paddingVertical: 80,
          paddingHorizontal: 0,
        }}>
          <View style={responsiveStyles.sectionInner}>
            <View style={{ flexDirection: 'row', gap: 24, justifyContent: 'space-between' }}>
              {[
                {
                  id: 1,
                  title: "Riiffs La Femme Bloom For Women Perfume 100ml",
                  price: "AED399.99",
                  image: require("@/assets/images/homepage/promotions/promotion1.png"),
                  bgColor: "#F59E7E", // Peach/Orange
                },
                {
                  id: 2,
                  title: "Sunset Breeze Women's Sandals",
                  price: "AED109.99",
                  image: require("@/assets/images/homepage/promotions/promotion2.png"),
                  bgColor: "#6B7FD7", // Blue/Purple
                },
                {
                  id: 3,
                  title: "Beautiful elegance and luxury fashion green handbag",
                  price: "AED299.99",
                  image: require("@/assets/images/homepage/promotions/promotion3.png"),
                  bgColor: "#10B981", // Teal/Green
                },
              ].map((item) => (
                <View key={item.id} style={{
                  flex: 1,
                  backgroundColor: item.bgColor,
                  borderRadius: 24,
                  padding: 32,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  minHeight: 500,
                }}>
                  <View style={{
                    width: '100%',
                    height: 250,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 24,
                  }}>
                    <View style={{
                      position: 'absolute',
                      width: 200,
                      height: 200,
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 100,
                      transform: [{ scaleX: 1.2 }],
                    }} />
                    <Image 
                      source={item.image} 
                      style={{ width: 220, height: 220 }}
                      contentFit="contain"
                    />
                  </View>
                  
                  <View style={{ alignItems: 'center', gap: 24 }}>
                    <Text style={{
                      fontFamily: 'Nunito_700Bold',
                      fontSize: 20,
                      color: '#FFFFFF',
                      textAlign: 'center',
                      lineHeight: 28,
                    }}>
                      {item.title}
                    </Text>
                    
                    <Pressable style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: 999,
                      paddingHorizontal: 32,
                      paddingVertical: 12,
                    }}>
                      <Text style={{
                        fontFamily: 'Nunito_600SemiBold',
                        fontSize: 14,
                        color: '#1F2937',
                      }}>
                        Add to List
                      </Text>
                    </Pressable>
                    
                    <Text style={{
                      fontFamily: 'Nunito_700Bold',
                      fontSize: 18,
                      color: '#FFFFFF',
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

