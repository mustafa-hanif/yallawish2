import React from "react";
import { Image } from "expo-image";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { router } from "expo-router";
import * as LucideIcons from "lucide-react-native";
import { styles } from "@/styles";

interface HeroSectionProps {
  isDesktop: boolean;
  handleCreateWishlist: () => void;
  responsiveStyles: any;
  mergeStyles: (...args: any[]) => any;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ isDesktop, handleCreateWishlist, responsiveStyles, mergeStyles }) => {
  return (
    <View style={mergeStyles(styles.heroSection, isDesktop ? responsiveStyles.heroSectionDesktop : null, { paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0 })}>
      <View style={{
        width:'100%', 
        height: isDesktop ? 600 : 400,
        position: 'relative', 
        overflow: 'hidden'
      }}>
        {/* Background Image */}
        <Image 
          source={require("@/assets/images/homepage/homepage_image.png")} 
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          contentFit="cover"
        />
        
        {/* Dark Overlay */}
        <View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          paddingHorizontal: isDesktop ? 60 : 24,
          paddingVertical: isDesktop ? 80 : 60,
        }}>
          {/* Main Content Container */}
          <View style={{
            height: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: isDesktop ? 900 : '100%',
            alignSelf: 'center',
          }}>
            {/* Top Content */}
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1,
              width: '100%',
            }}>
              {/* Main Headline */}
              <Text style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: isDesktop ? 56 : 32,
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: isDesktop ? 20 : 16,
                lineHeight: isDesktop ? 68 : 40,
              }}>
                Celebrate Every Moment with the Perfect Gift
              </Text>
              
              {/* Sub-headline */}
              <Text style={{
                fontFamily: 'Nunito_400Regular',
                fontSize: isDesktop ? 20 : 16,
                color: '#FFFFFF',
                textAlign: 'center',
                marginBottom: isDesktop ? 40 : 32,
                lineHeight: isDesktop ? 28 : 22,
                opacity: 0.95,
              }}>
                Shop handpicked gifts for weddings, birthdays, and every special day in between.
              </Text>
              
              {/* CTA Buttons */}
              <View style={{
                flexDirection: isDesktop ? 'row' : 'column',
                gap: isDesktop ? 16 : 12,
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}>
                {/* Create Gift List Button */}
                <Pressable 
                  onPress={handleCreateWishlist}
                  style={{
                    backgroundColor: '#00C4F0',
                    borderRadius: 999,
                    paddingHorizontal: isDesktop ? 32 : 24,
                    paddingVertical: isDesktop ? 16 : 14,
                    minWidth: isDesktop ? 200 : '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{
                    fontFamily: 'Nunito_600SemiBold',
                    fontSize: isDesktop ? 16 : 15,
                    color: '#FFFFFF',
                  }}>
                    Create Gift List
                  </Text>
                </Pressable>
                
                {/* Discover Gifts Button */}
                <Pressable 
                  style={{
                    borderWidth: 2,
                    borderColor: '#00D4AA',
                    borderRadius: 999,
                    paddingHorizontal: isDesktop ? 32 : 24,
                    paddingVertical: isDesktop ? 16 : 14,
                    minWidth: isDesktop ? 200 : '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'transparent',
                  }}
                >
                  <Text style={{
                    fontFamily: 'Nunito_600SemiBold',
                    fontSize: isDesktop ? 16 : 15,
                    color: '#FFFFFF',
                  }}>
                    Discover Gifts
                  </Text>
                </Pressable>
              </View>
            </View>
            
            {/* Explore YallaWish Element - Bottom */}
            <View style={{
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: isDesktop ? 0 : 16,
              marginTop: isDesktop ? 10 : 0,
            }}>
              <Image 
                source={require("@/assets/images/homepage/explore_button.png")} 
                style={{
                  width: isDesktop ? 120 : 100,
                  height: isDesktop ? 120 : 100,
                }}
                contentFit="contain"
              />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

