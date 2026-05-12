// ─── TUCONTADOR — Fondo tipo paño de mesa ───────────────────────────────────
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function FondoPaño({ children, style }) {
  return (
    <View style={[styles.container, style]}>
      <LinearGradient
        colors={['#243d28', '#1C2B1F', '#101a12']}
        locations={[0, 0.48, 1]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Trama del paño — lineas diagonales muy sutiles */}
      <View style={styles.trama} pointerEvents="none" />
      {/* Marco dorado interior */}
      <View style={styles.marcoOuter} pointerEvents="none" />
      <View style={styles.marcoInner} pointerEvents="none" />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  trama: {
    ...StyleSheet.absoluteFillObject,
    // La trama real se hace en el SVG de fondo o con opacity
    opacity: 0.04,
    backgroundColor: 'transparent',
  },
  marcoOuter: {
    position:     'absolute',
    top:          14,
    left:         14,
    right:        14,
    bottom:       14,
    borderWidth:  1,
    borderColor:  'rgba(184,150,46,0.22)',
    borderRadius: 30,
    pointerEvents: 'none',
  },
  marcoInner: {
    position:     'absolute',
    top:          18,
    left:         18,
    right:        18,
    bottom:       18,
    borderWidth:  0.8,
    borderColor:  'rgba(184,150,46,0.07)',
    borderRadius: 26,
    pointerEvents: 'none',
  },
});
