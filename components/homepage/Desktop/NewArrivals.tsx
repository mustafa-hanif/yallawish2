import React from "react";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import * as LucideIcons from "lucide-react-native";

interface NewArrivalsProps {
  isDesktop: boolean;
  responsiveStyles: any;
}

export const NewArrivals: React.FC<NewArrivalsProps> = ({ isDesktop, responsiveStyles }) => {
  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      paddingVertical: isDesktop ? 80 : 40,
      paddingHorizontal: isDesktop ? 0 : 20,
    }}>
      <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
        <View style={{ alignItems: 'center', marginBottom: 48 }}>
          <View style={{
            backgroundColor: '#F8A8D4',
            paddingHorizontal: 16,
            paddingVertical: 6,
            borderRadius: 20,
            marginBottom: 16,
            transform: [{ rotate: '-5deg' }],
          }}>
            <Text style={{
              fontFamily: 'Nunito_700Bold',
              fontSize: 12,
              color: '#330065',
              textTransform: 'uppercase',
            }}>
              Hurry up to buy
            </Text>
          </View>
          <Text style={{
            fontFamily: 'Nunito_700Bold',
            fontSize: 48,
            color: '#1A0034',
            textAlign: 'center',
          }}>
            New Arrivals
          </Text>
        </View>

        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 24,
          justifyContent: isDesktop ? 'space-between' : 'center',
        }}>
          {[
            {
              id: 1,
              name: "Classic PX Smart Watch",
              category: "Accessories, Watches",
              price: "AED 249.00 - AED 399.00",
              image: require("@/assets/images/homepage/arrivals/arrival1.png"),
              bgColor: "#E6F4FE"
            },
            {
              id: 2,
              name: "Hoor Stylish Edged Ring",
              category: "Jewelry, Ring",
              price: "AED 249.00",
              image: require("@/assets/images/homepage/arrivals/arrival2.png"),
              bgColor: "#FDF2F8"
            },
            {
              id: 3,
              name: "Frames Upholstered Chair",
              category: "Furniture, Chairs",
              price: "AED 549.00",
              image: require("@/assets/images/homepage/arrivals/arrival3.png"),
              bgColor: "#FEFBEB"
            },
            {
              id: 4,
              name: "Nude Liquid Powder",
              category: "Makeup, Skincare",
              price: "AED 399.00",
              image: require("@/assets/images/homepage/arrivals/arrival4.png"),
              bgColor: "#FEFCE8"
            },
            {
              id: 5,
              name: "Baby Girl Warm Shirt",
              category: "Clothes, Baby",
              price: "AED 99.00 - AED 199.00",
              image: require("@/assets/images/homepage/arrivals/arrival5.png"),
              bgColor: "#F3E8FF"
            },
            {
              id: 6,
              name: "BERIBES Bluetooth Headphones",
              category: "Accessories, Headphones",
              price: "AED 149.00",
              image: require("@/assets/images/homepage/arrivals/arrival6.png"),
              bgColor: "#E0F2FE"
            },
          ].map((item) => (
            <View key={item.id} style={{
              width: isDesktop ? '31%' : '100%',
              maxWidth: 400,
              marginBottom: 40,
            }}>
              <View style={{
                backgroundColor: item.bgColor,
                borderRadius: 16,
                aspectRatio: 1.2,
                marginBottom: 20,
                position: 'relative',
                overflow: 'hidden',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
              }}>
                <Image 
                  source={item.image}
                  style={{ width: '90%', height: '90%' }}
                  contentFit="contain"
                />
                <Pressable style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: '#330065',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <LucideIcons.Heart size={16} color="#FFFFFF" />
                </Pressable>
              </View>
              
              <View style={{ alignItems: 'center' }}>
                <Text style={{
                  fontFamily: 'Nunito_700Bold',
                  fontSize: 18,
                  color: '#1A0034',
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                  {item.name}
                </Text>
                <Text style={{
                  fontFamily: 'Nunito_400Regular',
                  fontSize: 14,
                  color: '#6F5F8F',
                  marginBottom: 8,
                  textAlign: 'center',
                }}>
                  {item.category}
                </Text>
                <Text style={{
                  fontFamily: 'Nunito_700Bold',
                  fontSize: 16,
                  color: '#DC2626',
                  marginBottom: 16,
                  textAlign: 'center',
                }}>
                  {item.price}
                </Text>
                <Pressable style={{
                  borderWidth: 1,
                  borderColor: '#330065',
                  borderRadius: 999,
                  paddingHorizontal: 24,
                  paddingVertical: 10,
                }}>
                  <Text style={{
                    fontFamily: 'Nunito_600SemiBold',
                    fontSize: 14,
                    color: '#330065',
                  }}>
                    Add to List
                  </Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
        
        <View style={{ alignItems: 'center', marginTop: 24 }}>
          <Pressable style={{
            backgroundColor: '#330065',
            borderRadius: 999,
            paddingHorizontal: 32,
            paddingVertical: 14,
          }}>
            <Text style={{
              fontFamily: 'Nunito_600SemiBold',
              fontSize: 16,
              color: '#FFFFFF',
            }}>
              Browse More Gifts
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

