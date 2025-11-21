import React from "react";
import { Image } from "expo-image";
import { Pressable, Text, View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface DownloadCTAProps {
  isDesktop: boolean;
}

export const DownloadCTA: React.FC<DownloadCTAProps> = ({ isDesktop }) => {
  return (
    <View style={[styles.container, isDesktop && styles.containerDesktop]}>
      <LinearGradient
        colors={['#4c1d95', '#7c3aed']} // Deep purple to lighter purple
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.gradient, isDesktop && styles.gradientDesktop]}
      >
        <View style={[styles.contentContainer, isDesktop && styles.contentContainerDesktop]}>
          {/* Text Content */}
          <View style={[styles.textSection, isDesktop && styles.textSectionDesktop]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Download App</Text>
            </View>

            <Text style={[styles.headline, isDesktop && styles.headlineDesktop]}>
              Shop Gifts On The Go —{'\n'}Download Now
            </Text>

            <View style={[styles.storeButtonsContainer, isDesktop && styles.storeButtonsContainerDesktop]}>
              {/* Google Play Button */}
              <Pressable style={styles.storeButton}>
                <Image
                  source={require("@/assets/images/googleIcon.png")}
                  style={styles.storeIcon}
                  contentFit="contain"
                />
                <View>
                  <Text style={styles.storeButtonSubtitle}>GET IT ON</Text>
                  <Text style={styles.storeButtonTitle}>Google Play</Text>
                </View>
              </Pressable>

              {/* App Store Button */}
              <Pressable style={styles.storeButton}>
                <Image
                  source={require("@/assets/images/appleIcon.png")}
                  style={styles.storeIcon}
                  contentFit="contain"
                />
                <View>
                  <Text style={styles.storeButtonSubtitle}>Download on the</Text>
                  <Text style={styles.storeButtonTitle}>App Store</Text>
                </View>
              </Pressable>
            </View>

            <Text style={styles.disclaimer}>
              *15% discount on your first purchase
            </Text>
          </View>

          {/* Image Section */}
          <View style={[styles.imageSection, isDesktop && styles.imageSectionDesktop]}>
             <Image
              source={require("@/assets/images/homepage/homepage_image3.png")}
              style={[styles.phoneImage, isDesktop && styles.phoneImageDesktop]}
              contentFit="contain"
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 20,
    marginVertical: 40,
    alignItems: 'center',
  },
  containerDesktop: {
    paddingHorizontal: 0,
    marginVertical: 80,
  },
  gradient: {
    width: '100%',
    borderRadius: 24,
    overflow: 'hidden',
    maxWidth: 1180,
  },
  gradientDesktop: {
    flexDirection: 'row',
    minHeight: 400,
  },
  contentContainer: {
    padding: 24,
    alignItems: 'center',
  },
  contentContainerDesktop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 60,
    width: '100%',
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 40,
    zIndex: 2,
  },
  textSectionDesktop: {
    alignItems: 'flex-start',
    marginBottom: 0,
    flex: 1,
    maxWidth: 600,
  },
  badge: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 100,
    marginBottom: 24,
  },
  badgeText: {
    color: '#4c1d95',
    fontFamily: 'Nunito_700Bold',
    fontSize: 14,
  },
  headline: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 32,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 40,
  },
  headlineDesktop: {
    textAlign: 'left',
    fontSize: 48,
    lineHeight: 56,
  },
  storeButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 16,
  },
  storeButtonsContainerDesktop: {
    justifyContent: 'flex-start',
  },
  storeButton: {
    backgroundColor: '#000000',
    borderRadius: 8,
    padding: 8,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 160,
  },
  storeIcon: {
    width: 24,
    height: 24,
  },
  storeButtonSubtitle: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Nunito_400Regular',
    opacity: 0.8,
  },
  storeButtonTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Nunito_700Bold',
    lineHeight: 20,
  },
  disclaimer: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Nunito_400Regular',
    marginTop: 16,
    opacity: 0.8,
  },
  imageSection: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 300,
    width: '100%',
  },
  imageSectionDesktop: {
    height: '100%',
    flex: 1,
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '50%',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    overflow: 'visible',
  },
  phoneImage: {
    width: '100%',
    height: '100%',
  },
  phoneImageDesktop: {
    width: 500,
    height: 550,
    marginRight: -50,
    marginBottom: -50,
  },
});

