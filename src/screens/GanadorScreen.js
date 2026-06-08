// ─── TUCONTADOR — Pantalla de ganador ───────────────────────────────────────
import React, { useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, StatusBar, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';

const { width: W, height: H } = Dimensions.get('window');

export default function GanadorScreen({ route, navigation }) {
  const { juego, equipos, puntajes, ganador, limite, movimientos } = route.params;
  const insets = useSafeAreaInsets();

  // Animaciones
  const fade     = useRef(new Animated.Value(0)).current;
  const scale    = useRef(new Animated.Value(0.6)).current;
  const slideUp  = useRef(new Animated.Value(40)).current;
  const crown    = useRef(new Animated.Value(0)).current;
  const btns     = useRef(new Animated.Value(0)).current;

  const equipoGanador   = equipos[ganador];
  const equipoPerdedor  = equipos[ganador === 0 ? 1 : 0];
  const puntajeGanador  = puntajes[ganador];
  const puntajePerdedor = puntajes[ganador === 0 ? 1 : 0];
  const totalJugadas    = movimientos?.length ?? 0;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Animated.sequence([
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, tension: 55, friction: 7, useNativeDriver: true }),
        Animated.timing(fade,  { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(slideUp, { toValue: 0, duration: 320, useNativeDriver: true }),
        Animated.timing(crown,   { toValue: 1, duration: 400, useNativeDriver: true }),
      ]),
      Animated.timing(btns, { toValue: 1, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const revancha = () => navigation.replace('Marcador', { ...route.params });
  const menu     = () => navigation.popToTop();

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent"/>
      <LinearGradient
        colors={['#0A1628', '#0D0A00', '#060D07']}
        locations={[0, 0.55, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Brillo central */}
      <Animated.View style={[styles.glow, { opacity: fade }]}/>

      {/* Corona / emoji ganador */}
      <Animated.View style={[
        styles.crownWrap,
        { paddingTop: insets.top + spacing.xl },
        { opacity: crown, transform: [{ scale: crown.interpolate({ inputRange:[0,1], outputRange:[0.5,1] }) }] },
      ]}>
        <Text style={styles.crown}>👑</Text>
      </Animated.View>

      {/* Tarjeta principal */}
      <Animated.View style={[styles.card, { opacity: fade, transform: [{ scale }] }]}>
        <LinearGradient
          colors={['rgba(184,150,46,0.12)', 'rgba(184,150,46,0.04)']}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.cardBorder}/>

        <Text style={styles.winLabel}>¡GANADOR!</Text>
        <Text style={styles.winName}>{equipoGanador?.nombre ?? 'Equipo ' + (ganador + 1)}</Text>
        <Text style={styles.winScore}>{puntajeGanador}</Text>
        <Text style={styles.winPts}>puntos</Text>

        <View style={styles.divider}/>

        <View style={styles.loserRow}>
          <Text style={styles.loserName}>{equipoPerdedor?.nombre ?? 'Rival'}</Text>
          <Text style={styles.loserScore}>{puntajePerdedor} pts</Text>
        </View>

        {totalJugadas > 0 && (
          <Text style={styles.stats}>{totalJugadas} jugadas · límite {limite}</Text>
        )}
      </Animated.View>

      {/* Botones */}
      <Animated.View style={[styles.btns, { opacity: btns, transform: [{ translateY: slideUp }] }]}>
        <TouchableOpacity style={styles.btnPrimary} onPress={revancha} activeOpacity={0.8}>
          <LinearGradient
            colors={[colors.oro, colors.doradoAntiguo]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.btnGrad}
          >
            <Text style={styles.btnPrimaryText}>Revancha</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btnSecondary} onPress={menu} activeOpacity={0.7}>
          <Text style={styles.btnSecondaryText}>Volver al menú</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Nombre del juego arriba */}
      <Animated.Text style={[styles.gameName, { opacity: crown, paddingTop: insets.top + 6 }]}>
        {juego?.nombre}
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root:    { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#060D07' },
  glow:    { position: 'absolute', width: W * 0.9, height: W * 0.9, borderRadius: W * 0.45, backgroundColor: 'rgba(184,150,46,0.08)', top: H * 0.1 },
  gameName:{ position: 'absolute', top: 0, left: 0, right: 0, textAlign: 'center', fontFamily: fonts.sans, fontSize: 11, color: colors.marfilTenue, letterSpacing: 2, textTransform: 'uppercase' },
  crownWrap:{ position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  crown:   { fontSize: 56 },
  card:    { width: W - spacing.xl * 2, borderRadius: 24, overflow: 'hidden', alignItems: 'center', paddingVertical: spacing.xl, paddingHorizontal: spacing.lg, marginBottom: spacing.xl },
  cardBorder:{ position: 'absolute', top:0, left:0, right:0, bottom:0, borderRadius: 24, borderWidth: 1, borderColor: colors.bordeDoradoMedio },
  winLabel:{ fontFamily: fonts.sansSemibold, fontSize: 11, color: colors.oro, letterSpacing: 3, textTransform: 'uppercase', marginBottom: spacing.sm },
  winName: { fontFamily: fonts.serif, fontSize: fontSize.gameTitle, color: colors.marfil, textAlign: 'center', marginBottom: 4 },
  winScore:{ fontFamily: fonts.serif, fontSize: 80, color: colors.oro, lineHeight: 88 },
  winPts:  { fontFamily: fonts.sans, fontSize: 13, color: colors.marfilMedio, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: spacing.md },
  divider: { width: '60%', height: 1, backgroundColor: colors.bordeDorado, marginBottom: spacing.md },
  loserRow:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: spacing.sm },
  loserName:{ fontFamily: fonts.sansMedium, fontSize: fontSize.body, color: colors.marfilMedio },
  loserScore:{ fontFamily: fonts.sansSemibold, fontSize: fontSize.body, color: colors.marfilMedio },
  stats:   { fontFamily: fonts.sans, fontSize: 11, color: colors.marfilTenue, letterSpacing: 0.5 },
  btns:    { width: W - spacing.xl * 2, rowGap: spacing.sm },
  btnPrimary:  { borderRadius: radius.lg, overflow: 'hidden' },
  btnGrad: { paddingVertical: 15, alignItems: 'center' },
  btnPrimaryText:{ fontFamily: fonts.sansSemibold, fontSize: fontSize.buttonLarge, color: '#0A0800', letterSpacing: 0.3 },
  btnSecondary:{ paddingVertical: 13, alignItems: 'center', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.bordeSuave },
  btnSecondaryText:{ fontFamily: fonts.sansMedium, fontSize: fontSize.buttonLarge, color: colors.marfilMedio },
});
