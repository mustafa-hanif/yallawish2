import React from "react";
import { Pressable, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface CTASectionProps {
  isDesktop: boolean;
  responsiveStyles: any;
  handleCreateWishlist: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ isDesktop, responsiveStyles, handleCreateWishlist }) => {
  return (
    <View>
      {isDesktop && (
        <View style={{
          width: '100%',
          paddingVertical: 80,
          paddingHorizontal: 0,
          backgroundColor: '#FFFFFF',
        }}>
          <View style={responsiveStyles.sectionInner}>
            <LinearGradient
              colors={['#F472B6', '#F9A8D4', '#FBCFE8']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                borderRadius: 32,
                paddingVertical: 80,
                paddingHorizontal: 60,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <View style={{
                backgroundColor: '#FFFFFF',
                paddingHorizontal: 24,
                paddingVertical: 10,
                borderRadius: 999,
                marginBottom: 32,
                transform: [{ rotate: '-2deg' }],
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}>
                <Text style={{
                  fontFamily: 'Nunito_700Bold',
                  fontSize: 16,
                  color: '#1A0034',
                }}>
                  Ready to Start Your Gifting Journey?
                </Text>
              </View>

              <Text style={{
                fontFamily: 'Nunito_800ExtraBold',
                fontSize: 36,
                color: '#1A0034',
                textAlign: 'center',
                marginBottom: 48,
                lineHeight: 54,
                maxWidth: 900,
              }}>
                Create Your Own Gift List In Minutes, Share It With Friends & Family, And Make Every Celebration Memorable.
              </Text>

              <View style={{ flexDirection: 'row', gap: 24 }}>
                <Pressable 
                  onPress={handleCreateWishlist}
                  style={{
                    backgroundColor: '#330065',
                    borderRadius: 999,
                    paddingHorizontal: 48,
                    paddingVertical: 16,
                    minWidth: 200,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{
                    fontFamily: 'Nunito_600SemiBold',
                    fontSize: 18,
                    color: '#FFFFFF',
                  }}>
                    Create List
                  </Text>
                </Pressable>

                <Pressable style={{
                  borderWidth: 2,
                  borderColor: '#330065',
                  borderRadius: 999,
                  paddingHorizontal: 48,
                  paddingVertical: 16,
                  minWidth: 200,
                  alignItems: 'center',
                }}
                >
                  <Text style={{
                    fontFamily: 'Nunito_600SemiBold',
                    fontSize: 18,
                    color: '#330065',
                  }}>
                    Browse Gifts
                  </Text>
                </Pressable>
              </View>
            </LinearGradient>
          </View>
        </View>
      )}
    </View>
  );
};

