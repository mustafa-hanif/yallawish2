import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export interface RibbonHeaderProps {
  title: string;
  subtitle: string;
}

export function RibbonHeader({ title, subtitle }: RibbonHeaderProps) {
  return (
    <View style={styles.container}>
      <Svg 
        width={343} 
        height={76} 
        viewBox="0 0 343 76" 
        style={styles.ribbonBackground}
      >
        <Path
          d="M342.941 75.9806H0C0.382014 74.9064 0.6171 74.0935 0.950139 73.3096C5.39718 62.7607 9.80504 52.1925 14.35 41.6824C15.2218 39.6597 15.1434 37.9565 14.3206 35.9531C9.73647 24.7752 5.25025 13.5393 0.744438 2.32268C0.489762 1.66459 0.342833 0.967783 0.0587715 0H343C342.109 2.30332 341.345 4.37438 340.522 6.43576C336.418 16.6943 332.274 26.9237 328.248 37.2113C327.866 38.1984 327.876 39.6017 328.278 40.5791C332.784 51.5441 337.407 62.451 341.991 73.387C342.295 74.1128 342.54 74.8677 342.951 76L342.941 75.9806Z"
          fill="#FFCC00"
        />
      </Svg>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 343,
    height: 76,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  textContainer: {
    width: 309,
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  title: {
    color: '#1C0335',
    textAlign: 'center',
    fontFamily: 'Nunito_700Bold',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 20,
    width: '100%',
  },
  subtitle: {
    color: '#1C0335',
    textAlign: 'center',
    fontFamily: 'Nunito_400Regular',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 16,
    width: '100%',
  },
});
