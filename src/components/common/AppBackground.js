import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/colors';

export default function AppBackground({ children, navy = false, framed = false, style }) {
  const gradient = navy
    ? [colors.fondoAzul, '#07131E', colors.fondoNegro]
    : [colors.panoClaro, colors.fondoPrincipal, colors.fondoProfundo];

  return (
    <View style={[styles.root, style]}>
      <LinearGradient colors={gradient} locations={[0, 0.48, 1]} style={StyleSheet.absoluteFill} />
      <View pointerEvents="none" style={styles.glowTop} />
      <View pointerEvents="none" style={styles.glowBottom} />
      {framed && <View pointerEvents="none" style={styles.frame} />}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.fondoProfundo,
    overflow: 'hidden',
  },
  glowTop: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(214,175,91,0.045)',
    top: -120,
    right: -90,
  },
  glowBottom: {
    position: 'absolute',
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(28,82,54,0.12)',
    bottom: -120,
    left: -100,
  },
  frame: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    bottom: 12,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
  },
});
