import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import * as Haptics from 'expo-haptics';
import AppBackground from '../components/common/AppBackground';
import Ornamento from '../components/common/Ornamento';
import { getMarcadorPorJuego } from '../navigation/routes';
import { colors } from '../theme/colors';
import { fonts, spacing, radius } from '../theme/typography';

export default function GanadorScreen({ route, navigation }) {
  const { juego, equipos, puntajes, ganador } = route.params;
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.84)).current;
  const rival = ganador === 0 ? 1 : 0;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
    ]).start();
  }, [fade, scale]);

  const revancha = () => {
    navigation.replace(getMarcadorPorJuego(juego.id), route.params);
  };

  return (
    <AppBackground framed>
      <Animated.View style={[styles.content, { opacity: fade, transform: [{ scale }] }]}>
        <Text style={styles.game}>{juego.nombre}</Text>
        <Text style={styles.title}>¡Ganaron{'\n'}{equipos[ganador]?.nombre}!</Text>
        <Ornamento width={190} />
        <View style={styles.matches}>
          <View style={[styles.match, styles.matchA]} />
          <View style={[styles.match, styles.matchB]} />
        </View>
        <View style={styles.scoreRow}>
          <Text style={[styles.score, { color: ganador === 0 ? colors.rojo : colors.azul }]}>
            {puntajes[ganador]}
          </Text>
          <Text style={styles.dash}>—</Text>
          <Text style={[styles.score, { color: rival === 0 ? colors.rojo : colors.azul }]}>
            {puntajes[rival]}
          </Text>
        </View>
        <TouchableOpacity style={styles.primary} onPress={revancha}>
          <Text style={styles.primaryText}>Revancha</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondary} onPress={() => navigation.navigate('Inicio')}>
          <Text style={styles.secondaryText}>Volver al inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Historial')}>
          <Text style={styles.summary}>Ver resumen</Text>
        </TouchableOpacity>
      </Animated.View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center', gap: 12 },
  game: { fontFamily: fonts.sansBold, fontSize: 9, color: colors.oro, letterSpacing: 2.4, textTransform: 'uppercase' },
  title: {
    fontFamily: fonts.serif,
    fontSize: 47,
    lineHeight: 48,
    color: colors.marfil,
    textAlign: 'center',
  },
  matches: { width: 120, height: 110, alignItems: 'center', justifyContent: 'center' },
  match: {
    position: 'absolute',
    width: 11,
    height: 105,
    borderRadius: 6,
    backgroundColor: '#C9913D',
    borderTopWidth: 12,
    borderTopColor: '#C8321D',
  },
  matchA: { transform: [{ rotate: '42deg' }] },
  matchB: { transform: [{ rotate: '-42deg' }] },
  scoreRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  score: { fontFamily: fonts.serif, fontSize: 68, lineHeight: 72 },
  dash: { fontFamily: fonts.serifRegular, fontSize: 35, color: colors.oro },
  primary: {
    width: '100%',
    height: 56,
    marginTop: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeDoradoFuerte,
    backgroundColor: 'rgba(92,23,18,0.88)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: { fontFamily: fonts.serif, fontSize: 24, color: colors.marfil },
  secondary: {
    width: '100%',
    height: 53,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.azulBorde,
    backgroundColor: 'rgba(11,42,61,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: { fontFamily: fonts.serif, fontSize: 22, color: colors.marfil },
  summary: { fontFamily: fonts.sansMedium, fontSize: 11, color: colors.oro, textDecorationLine: 'underline' },
});
