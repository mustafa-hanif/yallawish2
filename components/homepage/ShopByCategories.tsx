import React from "react";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";

interface ShopByCategoriesProps {
  isDesktop: boolean;
  responsiveStyles: any;
}

export const ShopByCategories: React.FC<ShopByCategoriesProps> = ({ isDesktop, responsiveStyles }) => {
  return (
    <View style={{
      backgroundColor: '#F9FAFB',
      paddingVertical: isDesktop ? 80 : 40,
    }}>
      <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <Text style={{
            fontFamily: 'Nunito_700Bold',
            fontSize: 32,
            color: '#1C0335',
            textAlign: 'center',
          }}>
            Shop By Categories
          </Text>
        </View>
        
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: isDesktop ? 'space-between' : 'center',
          gap: isDesktop ? 0 : 32,
        }}>
          {[
            { title: 'Wedding Essentials', products: '23 Products', image: require("@/assets/images/homepage/circle1.png") },
            { title: 'Tech For Him', products: '56 Products', image: require("@/assets/images/homepage/circle2.png") },
            { title: 'Luxury For Her', products: '30 Products', image: require("@/assets/images/homepage/circle3.png") },
            { title: 'Gifts For Kids', products: '80 Products', image: require("@/assets/images/homepage/circle4.png") },
            { title: 'Home & Lifestyle', products: '99+ Products', image: require("@/assets/images/homepage/circle5.png") },
            { title: 'Personalized Gifts', products: '50 Products', image: require("@/assets/images/homepage/circle6.png") },
          ].map((category, index) => (
            <Pressable key={index} style={{
              alignItems: 'center',
              width: isDesktop ? '16%' : '45%',
              maxWidth: 200,
            }}>
              <View style={{
                width: 160,
                height: 160,
                borderRadius: 80,
                overflow: 'hidden',
                marginBottom: 16,
                backgroundColor: '#FFFFFF',
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}>
                <Image 
                  source={category.image} 
                  style={{ width: '100%', height: '100%' }}
                  contentFit="cover"
                />
              </View>
              <Text style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 18,
                color: '#1C0335',
                textAlign: 'center',
                marginBottom: 4,
              }}>
                {category.title}
              </Text>
              <Text style={{
                fontFamily: 'Nunito_400Regular',
                fontSize: 14,
                color: '#6F5F8F',
                textAlign: 'center',
              }}>
                {category.products}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

