// ─── TUCONTADOR — Pantalla de ganador ───────────────────────────────────────
import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Fosforos from '../components/fosforos/Fosforos';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';

export default function GanadorScreen({ route, navigation }) {
  const { juego, equipos, puntajes, ganador, limite } = route.params;
  const insets  = useSafeAreaInsets();
  const escala  = useRef(new Animated.Value(0.7)).current;
  const opacidad = useRef(new Animated.Value(0)).current;

  const equipoGanador = equipos[ganador];
  const equipoPerdedor = equipos[ganador === 0 ? 1 : 0];
  const puntajeGanador = puntajes[ganador];
  const puntajePerdedor = puntajes[ganador === 0 ? 1 : 0];

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.parallel([
      Animated.spring(escala, {
        toValue:         1,
        tension:         50,
        friction:        7,
        useNativeDriver: true,
      }),
      Animated.timing(opacidad, {
        toValue:         1,
        duration:        500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const revancha = () => {
    navigation.replace('Marcador', {
      ...route.params,
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1a0f00', '#0d1a0d', '#060d07']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Resplandor dorado central */}
      <View style={styles.glow} />

      {/* Marco */}
      <View style={styles.marco} />

      <Animated.View style={[
        styles.contenido,
        { opacity: opacidad, transform: [{ scale: escala }] },
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
      ]}>

        {/* Trofeo SVG simplificado con volutas */}
        <View style={styles.trofeoWrap}>
          <Text style={styles.estrella}>★</Text>
          <View style={styles.trofeoBase} />
        </View>

        {/* Ganadores */}
        <Text style={styles.eyebrow}>¡Ganadores!</Text>
        <Text style={styles.nombreGanador}>{equipoGanador.nombre}</Text>

        {/* Chips de puntaje */}
        <View style={styles.scoresRow}>
          <View style={styles.chipGanador}>
            <Text style={styles.chipGanadorText}>{puntajeGanador} pts</Text>
          </View>
          <Text style={styles.vsText}>vs</Text>
          <View style={styles.chipPerdedor}>
            <Text style={styles.chipPerdedorText}>{puntajePerdedor} pts</Text>
          </View>
        </View>

        {/* Línea dorada */}
        <View style={styles.lineaDorada} />

        {/* Fósforos del puntaje ganador */}
        <Text style={styles.fosforosLabel}>Puntaje final</Text>
        <View style={styles.fosforosWrap}>
          <Fosforos
            puntos={puntajeGanador}
            colorEquipo={ganador === 0 ? 'rojo' : 'azul'}
            size={32}
          />
        </View>

        {/* Botones */}
        <View style={styles.botones}>
          <TouchableOpacity
            style={styles.btnRevancha}
            onPress={revancha}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#2A6B3A', '#1A4A28']}
              style={StyleSheet.absoluteFill}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
            />
            <Text style={styles.btnRevanchaText}>Revancha</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnNueva}
            onPress={() => navigation.navigate('Config', { juego })}
            activeOpacity={0.8}
          >
            <Text style={styles.btnNuevaText}>Nueva partida</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnMenu}
            onPress={() => navigation.navigate('Inicio')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnMenuText}>Volver al menú</Text>
          </TouchableOpacity>
        </View>

      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  glow: {
    position: 'absolute',
    top: '28%', alignSelf: 'center',
    width: 260, height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(184,150,46,0.1)',
  },

  marco: {
    position: 'absolute', inset: 14,
    borderWidth: 1, borderColor: colors.bordeDorado,
    borderRadius: 30,
  },

  contenido: {
    flex: 1, alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    gap: spacing.sm,
  },

  trofeoWrap: { alignItems: 'center', marginBottom: 4 },
  estrella: {
    fontSize: 64,
    color:    colors.oro,
    textShadowColor: 'rgba(212,168,67,0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  trofeoBase: {
    width: 60, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(184,150,46,0.3)',
    marginTop: 4,
  },

  eyebrow: {
    fontFamily:    fonts.sansBold,
    fontSize:      fontSize.label,
    color:         'rgba(184,150,46,0.55)',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  nombreGanador: {
    fontFamily: fonts.serifItalic,
    fontSize:   fontSize.appTitle,
    color:      colors.oro,
    lineHeight: fontSize.appTitle * 1.1,
    textAlign:  'center',
  },

  scoresRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            spacing.sm,
    marginVertical: spacing.xs,
  },
  chipGanador: {
    paddingVertical: 4, paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: 'rgba(184,150,46,0.15)',
    borderWidth: 1, borderColor: 'rgba(184,150,46,0.35)',
  },
  chipGanadorText: { fontFamily: fonts.serif, fontSize: fontSize.body + 2, color: colors.oro, fontWeight: '700' },
  chipPerdedor: {
    paddingVertical: 4, paddingHorizontal: 14,
    borderRadius: radius.full,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1, borderColor: colors.bordeSuave,
  },
  chipPerdedorText: { fontFamily: fonts.serif, fontSize: fontSize.body + 2, color: colors.marfilTenue },
  vsText: { fontFamily: fonts.serifItalic, fontSize: fontSize.bodySmall, color: 'rgba(255,255,255,0.2)' },

  lineaDorada: {
    width: '55%', height: 1,
    backgroundColor: 'rgba(184,150,46,0.25)',
    marginVertical: spacing.sm,
  },

  fosforosLabel: {
    fontFamily:    fonts.sansBold,
    fontSize:      fontSize.labelTiny,
    color:         'rgba(255,255,255,0.2)',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom:  4,
  },
  fosforosWrap: {
    flexDirection:  'row',
    justifyContent: 'center',
    marginBottom:   spacing.md,
    maxWidth:       260,
  },

  botones: { width: '100%', gap: spacing.sm, marginTop: spacing.sm },

  btnRevancha: {
    borderRadius: radius.md, paddingVertical: 13,
    alignItems: 'center', overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(42,107,58,0.5)',
  },
  btnRevanchaText: { fontFamily: fonts.serif, fontSize: fontSize.screenTitle, color: colors.marfil, letterSpacing: 0.5 },

  btnNueva: {
    borderRadius: radius.md, paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: 'rgba(184,150,46,0.1)',
    borderWidth: 1, borderColor: colors.bordeDorado,
  },
  btnNuevaText: { fontFamily: fonts.sansSemibold, fontSize: fontSize.body, color: colors.oro },

  btnMenu: {
    borderRadius: radius.md, paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1, borderColor: colors.bordeSuave,
  },
  btnMenuText: { fontFamily: fonts.sansMedium, fontSize: fontSize.body, color: colors.marfilTenue },
});
