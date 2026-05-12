// ─── TUCONTADOR — Onboarding (primera vez) ──────────────────────────────────
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Animated, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { marcarOnboardingVisto } from '../utils/storage';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const PASOS = [
  {
    titulo:    'Bienvenido a',
    tituloAcc: 'Tucontador',
    desc:      'El contador de puntos para tus juegos de cartas favoritos. Simple, rápido y hecho en Argentina.',
    icono:     '🃏',
  },
  {
    titulo:    'Conteo con',
    tituloAcc: 'fósforos',
    desc:      'Igual que en la mesa. Cada punto es un palito y al llegar a 5 forman un cuadrado con diagonal — como siempre lo hiciste en papel.',
    icono:     '🔥',
  },
  {
    titulo:    '¡Todo listo',
    tituloAcc: 'para jugar!',
    desc:      'Truco, Chinchón, Escoba del 15, Rummy, Canasta, Generala y más. Funciona sin internet. ¡Que gane el mejor!',
    icono:     '🏆',
  },
];

export default function OnboardingScreen({ navigation }) {
  const insets    = useSafeAreaInsets();
  const [paso, setPaso] = useState(0);
  const slideX    = useRef(new Animated.Value(0)).current;

  const irA = (nuevoPaso) => {
    const direccion = nuevoPaso > paso ? -SCREEN_WIDTH : SCREEN_WIDTH;

    // Salida
    Animated.timing(slideX, {
      toValue:         direccion,
      duration:        200,
      useNativeDriver: true,
    }).start(() => {
      setPaso(nuevoPaso);
      slideX.setValue(-direccion);
      // Entrada
      Animated.timing(slideX, {
        toValue:         0,
        duration:        220,
        useNativeDriver: true,
      }).start();
    });
  };

  const terminar = async () => {
    await marcarOnboardingVisto();
    navigation.replace('Inicio');
  };

  const esUltimo = paso === PASOS.length - 1;
  const current  = PASOS[paso];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e3a26', '#0e1a10', '#080d09']}
        style={StyleSheet.absoluteFill}
      />

      {/* Marco */}
      <View style={styles.marco} />

      {/* Botón saltar */}
      <TouchableOpacity
        style={[styles.saltarBtn, { top: insets.top + 16 }]}
        onPress={terminar}
      >
        <Text style={styles.saltarText}>Saltar</Text>
      </TouchableOpacity>

      {/* Contenido animado */}
      <Animated.View style={[styles.contenido, { transform: [{ translateX: slideX }] }]}>
        <Text style={styles.icono}>{current.icono}</Text>
        <Text style={styles.titulo}>
          {current.titulo}{'\n'}
          <Text style={styles.tituloAcc}>{current.tituloAcc}</Text>
        </Text>
        <Text style={styles.desc}>{current.desc}</Text>
      </Animated.View>

      {/* Footer */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>

        {/* Dots */}
        <View style={styles.dots}>
          {PASOS.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === paso && styles.dotActive]}
            />
          ))}
        </View>

        {/* Botón siguiente / empezar */}
        <TouchableOpacity
          style={styles.btnSiguiente}
          onPress={esUltimo ? terminar : () => irA(paso + 1)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#8B3A2A', '#6B2A1A']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          />
          <Text style={styles.btnSiguienteText}>
            {esUltimo ? '¡A jugar!' : 'Siguiente'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },

  marco: {
    position: 'absolute', inset: 14,
    borderWidth: 1, borderColor: colors.bordeDorado,
    borderRadius: 30,
  },

  saltarBtn: {
    position: 'absolute', right: 24, zIndex: 10,
  },
  saltarText: {
    fontFamily: fonts.sansMedium, fontSize: fontSize.body,
    color: colors.marfilTenue,
  },

  contenido: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: spacing.xxl, gap: spacing.lg,
  },
  icono: { fontSize: 72 },
  titulo: {
    fontFamily:  fonts.serif,
    fontSize:    fontSize.appTitle,
    color:       colors.marfil,
    textAlign:   'center',
    lineHeight:  fontSize.appTitle * 1.2,
  },
  tituloAcc: {
    fontFamily: fonts.serifItalic,
    color:      colors.oro,
  },
  desc: {
    fontFamily:  fonts.sans,
    fontSize:    fontSize.body,
    color:       colors.marfilSuave,
    textAlign:   'center',
    lineHeight:  22,
    maxWidth:    280,
  },

  footer: {
    width: '100%', paddingHorizontal: spacing.xl,
    gap: spacing.lg, alignItems: 'center',
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: {
    width: 6, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  dotActive: {
    width: 18,
    backgroundColor: colors.oro,
  },

  btnSiguiente: {
    width: '100%', paddingVertical: 14,
    borderRadius: radius.md, alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(139,58,42,0.5)',
  },
  btnSiguienteText: {
    fontFamily:    fonts.serif,
    fontSize:      fontSize.screenTitle,
    color:         colors.marfil,
    letterSpacing: 0.5,
  },
});
