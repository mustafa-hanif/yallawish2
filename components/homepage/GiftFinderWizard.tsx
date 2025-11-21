import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import * as LucideIcons from "lucide-react-native";

interface GiftFinderWizardProps {
  isDesktop: boolean;
  responsiveStyles: any;
}

export const GiftFinderWizard: React.FC<GiftFinderWizardProps> = ({ isDesktop, responsiveStyles }) => {
  return (
    <View style={{
      backgroundColor: '#FFFFFF',
      paddingVertical: isDesktop ? 80 : 40,
      paddingHorizontal: isDesktop ? 0 : 20,
    }}>
      <View style={isDesktop ? responsiveStyles.sectionInner : undefined}>
        <View style={{
          flexDirection: isDesktop ? 'row' : 'column',
          gap: isDesktop ? 80 : 40,
          alignItems: 'center',
        }}>
          {/* Left Column - Form */}
          <View style={{ flex: 1, width: '100%' }}>
            <View style={{
              backgroundColor: '#5C9DFF',
              paddingHorizontal: 16,
              paddingVertical: 6,
              borderRadius: 20,
              alignSelf: 'flex-start',
              marginBottom: 16,
              transform: [{ rotate: '-3deg' }],
            }}>
              <Text style={{
                fontFamily: 'Nunito_700Bold',
                fontSize: 12,
                color: '#FFFFFF',
              }}>
                Gift Finder Wizard
              </Text>
            </View>
            
            <Text style={{
              fontFamily: 'Nunito_700Bold',
              fontSize: isDesktop ? 42 : 32,
              color: '#1A0034',
              marginBottom: 16,
              lineHeight: isDesktop ? 54 : 40,
            }}>
              Find the Perfect Gift in 3 Simple Steps
            </Text>
            
            <Text style={{
              fontFamily: 'Nunito_400Regular',
              fontSize: 16,
              color: '#4B5563',
              marginBottom: 40,
              lineHeight: 24,
            }}>
              Not sure what to buy? Let us guide you. Answer a few quick questions and discover personalized gift ideas instantly.
            </Text>

            <View style={{ gap: 24 }}>
              <View>
                <Text style={{
                  fontFamily: 'Nunito_600SemiBold',
                  fontSize: 14,
                  color: '#1F2937',
                  marginBottom: 8,
                }}>
                  Moment/Occasion
                </Text>
                <View style={{
                  borderWidth: 1,
                  borderColor: '#9CA3AF',
                  borderRadius: 24,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                }}>
                  <TextInput
                    placeholder="Wedding"
                    style={{
                      fontFamily: 'Nunito_400Regular',
                      fontSize: 16,
                      color: '#1F2937',
                    }}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View>
                <Text style={{
                  fontFamily: 'Nunito_600SemiBold',
                  fontSize: 14,
                  color: '#1F2937',
                  marginBottom: 8,
                }}>
                  Who It's For
                </Text>
                <View style={{
                  borderWidth: 1,
                  borderColor: '#9CA3AF',
                  borderRadius: 24,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                }}>
                  <TextInput
                    placeholder="Wife/Husband"
                    style={{
                      fontFamily: 'Nunito_400Regular',
                      fontSize: 16,
                      color: '#1F2937',
                    }}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View>
                <Text style={{
                  fontFamily: 'Nunito_600SemiBold',
                  fontSize: 14,
                  color: '#1F2937',
                  marginBottom: 8,
                }}>
                  Tell Your Budget ( AED)
                </Text>
                <View style={{
                  borderWidth: 1,
                  borderColor: '#9CA3AF',
                  borderRadius: 24,
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                }}>
                  <TextInput
                    placeholder="e.g 50"
                    style={{
                      fontFamily: 'Nunito_400Regular',
                      fontSize: 16,
                      color: '#1F2937',
                    }}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <Pressable style={{
                backgroundColor: '#330065',
                borderRadius: 999,
                paddingVertical: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 12,
                marginTop: 16,
                shadowColor: '#330065',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}>
                <LucideIcons.Sparkles size={20} color="#FFFFFF" />
                <Text style={{
                  fontFamily: 'Nunito_700Bold',
                  fontSize: 16,
                  color: '#FFFFFF',
                }}>
                  Find My Gift
                </Text>
              </Pressable>
            </View>
            
            <View style={{ position: 'absolute', bottom: -40, left: 0 }}>
              <LucideIcons.Sparkles size={24} color="#330065" style={{ opacity: 0.6 }} />
            </View>
          </View>

          {/* Right Column - Placeholder */}
          <View style={{ flex: 1, width: '100%', aspectRatio: isDesktop ? 1.4 : 1 }}>
            <View style={{
              width: '100%',
              height: '100%',
              borderWidth: 2,
              borderColor: '#E5E7EB',
              borderStyle: 'dashed', // Note: specific style for web, might need solid for native or custom component
              borderRadius: 32,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FAFAFA', // Very light gray background for the placeholder area
            }}>
              <View style={{ alignItems: 'center', gap: 16 }}>
                <LucideIcons.Wand size={48} color="#9CA3AF" />
                <Text style={{
                  fontFamily: 'Nunito_600SemiBold',
                  fontSize: 18,
                  color: '#9CA3AF',
                }}>
                  Surprise me
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

