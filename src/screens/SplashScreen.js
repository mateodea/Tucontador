// ─── TUCONTADOR — Pantalla de carga ─────────────────────────────────────────
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { onboardingVisto } from '../utils/storage';
import { colors } from '../theme/colors';
import { fonts, fontSize } from '../theme/typography';

export default function SplashScreen({ navigation }) {
  const insets   = useSafeAreaInsets();
  const opacidad = useRef(new Animated.Value(0)).current;
  const escala   = useRef(new Animated.Value(0.85)).current;

  // Animaciones de entrada de los fósforos
  const fosforo1 = useRef(new Animated.Value(0)).current;
  const fosforo2 = useRef(new Animated.Value(0)).current;
  const fosforo3 = useRef(new Animated.Value(0)).current;
  const fosforo4 = useRef(new Animated.Value(0)).current;
  const fosforo5 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animación de entrada del logo
    Animated.parallel([
      Animated.timing(opacidad, {
        toValue:         1,
        duration:        600,
        useNativeDriver: true,
      }),
      Animated.spring(escala, {
        toValue:         1,
        tension:         60,
        friction:        8,
        useNativeDriver: true,
      }),
    ]).start();

    // Fósforos aparecen uno a uno
    const delay = 400;
    [fosforo1, fosforo2, fosforo3, fosforo4, fosforo5].forEach((f, i) => {
      setTimeout(() => {
        Animated.timing(f, {
          toValue:         1,
          duration:        250,
          useNativeDriver: true,
        }).start();
      }, delay + i * 180);
    });

    // Navegar después de 2.2 segundos
    const timer = setTimeout(async () => {
      const visto = await onboardingVisto();
      Animated.timing(opacidad, {
        toValue:         0,
        duration:        400,
        useNativeDriver: true,
      }).start(() => {
        navigation.replace(visto ? 'Inicio' : 'Onboarding');
      });
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const fosforos = [fosforo1, fosforo2, fosforo3, fosforo4, fosforo5];

  return (
    <Animated.View style={[styles.container, { opacity: opacidad }]}>
      <LinearGradient
        colors={['#1e3a26', '#0e1a10', '#080d09']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Anillos decorativos */}
      <View style={styles.anilloGrande} />
      <View style={styles.anilloMedio} />
      <View style={styles.anilloChico} />

      <Animated.View style={[styles.contenido, { transform: [{ scale: escala }] }]}>

        {/* Nombre de la app */}
        <View style={styles.tituloWrap}>
          <Text style={styles.tituloNormal}>Tu</Text>
          <Text style={styles.tituloAccento}>contador</Text>
        </View>

        {/* Subtítulo */}
        <Text style={styles.subtitulo}>Contador de cartas</Text>

        {/* Línea dorada */}
        <View style={styles.lineaDorada} />

        {/* Fósforos animándose */}
        <View style={styles.fosforosWrap}>
          {fosforos.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.fosforoItem,
                {
                  opacity:   anim,
                  transform: [{ scale: anim.interpolate({
                    inputRange:  [0, 1],
                    outputRange: [0.5, 1],
                  })}],
                },
              ]}
            >
              {/* Palo */}
              <View style={styles.fosforoPalo} />
              {/* Cabeza */}
              <View style={styles.fosforoCabeza} />
            </Animated.View>
          ))}
        </View>

        <Text style={styles.cargando}>Cargando…</Text>
      </Animated.View>

      <Text style={[styles.credito, { bottom: insets.bottom + 16 }]}>
        Argentina · Uruguay
      </Text>
    </Animated.View>
  );
}

const ANILLO_BASE = {
  position:    'absolute',
  borderRadius: 9999,
  borderWidth:  1,
  borderColor:  'rgba(184,150,46,0.1)',
  alignSelf:   'center',
  top:         '50%',
};

const styles = StyleSheet.create({
  container: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
  },
  anilloGrande: { ...ANILLO_BASE, width: 280, height: 280, marginTop: -200 },
  anilloMedio:  { ...ANILLO_BASE, width: 210, height: 210, marginTop: -165, borderColor: 'rgba(184,150,46,0.14)' },
  anilloChico:  { ...ANILLO_BASE, width: 140, height: 140, marginTop: -130, borderColor: 'rgba(184,150,46,0.07)' },

  contenido: {
    alignItems: 'center',
    zIndex:     10,
  },

  tituloWrap: {
    flexDirection: 'row',
    alignItems:    'baseline',
    marginBottom:  4,
  },
  tituloNormal: {
    fontFamily: fonts.serif,
    fontSize:   42,
    color:      colors.marfil,
    lineHeight: 48,
  },
  tituloAccento: {
    fontFamily: fonts.serif,
    fontSize:   42,
    color:      colors.oro,
    fontStyle:  'italic',
    lineHeight: 48,
  },

  subtitulo: {
    fontFamily:    fonts.sansMedium,
    fontSize:      10,
    color:         'rgba(184,150,46,0.5)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom:  20,
  },

  lineaDorada: {
    width:           120,
    height:          1,
    backgroundColor: 'rgba(184,150,46,0.3)',
    marginBottom:    24,
  },

  fosforosWrap: {
    flexDirection:  'row',
    alignItems:     'flex-end',
    gap:            6,
    marginBottom:   12,
  },
  fosforoItem: {
    alignItems: 'center',
  },
  fosforoPalo: {
    width:           4,
    height:          28,
    borderRadius:    2,
    backgroundColor: '#C8902A',
  },
  fosforoCabeza: {
    width:           10,
    height:          10,
    borderRadius:    5,
    backgroundColor: '#C01808',
    marginBottom:    2,
    position:        'absolute',
    top:             0,
  },

  cargando: {
    fontFamily:    fonts.sans,
    fontSize:      10,
    color:         'rgba(184,150,46,0.4)',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },

  credito: {
    position:      'absolute',
    fontFamily:    fonts.sans,
    fontSize:      9,
    color:         'rgba(255,255,255,0.12)',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
});
