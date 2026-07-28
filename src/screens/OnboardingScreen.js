import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBackground from '../components/common/AppBackground';
import BrandTitle from '../components/common/BrandTitle';
import Ornamento from '../components/common/Ornamento';
import { GrupoFosforos } from '../components/fosforos/Fosforos';
import { marcarOnboardingVisto } from '../utils/storage';
import { colors } from '../theme/colors';
import { fonts, spacing, radius } from '../theme/typography';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const PASOS = [
  {
    title: 'Contá sin cortar el juego',
    description: 'Una experiencia rápida y elegante para llevar los puntos sin perder de vista la mesa.',
    symbol: 'cards',
  },
  {
    title: 'Como se contó siempre',
    description: 'Los fósforos forman grupos de cinco y separan claramente las malas de las buenas.',
    symbol: 'matches',
  },
  {
    title: 'Todos tus juegos',
    description: 'Truco, Chinchón, Escoba, Generala, Rummy y más, incluso sin conexión.',
    symbol: 'games',
  },
];

export default function OnboardingScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState(0);
  const slide = useRef(new Animated.Value(0)).current;

  const terminar = async () => {
    await marcarOnboardingVisto();
    navigation.replace('Inicio');
  };

  const siguiente = () => {
    if (step === PASOS.length - 1) {
      terminar();
      return;
    }
    Animated.timing(slide, { toValue: -SCREEN_WIDTH, duration: 180, useNativeDriver: true }).start(() => {
      setStep(value => value + 1);
      slide.setValue(SCREEN_WIDTH);
      Animated.timing(slide, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    });
  };

  const item = PASOS[step];
  return (
    <AppBackground framed>
      <TouchableOpacity style={[styles.skip, { top: insets.top + 18 }]} onPress={terminar}>
        <Text style={styles.skipText}>Saltar</Text>
      </TouchableOpacity>

      <Animated.View style={[styles.content, { transform: [{ translateX: slide }] }]}>
        <BrandTitle size={39} compact />
        <View style={styles.illustration}>
          {item.symbol === 'matches' ? (
            <GrupoFosforos cantidad={5} size={112} guia={false} />
          ) : (
            <Text style={styles.symbol}>{item.symbol === 'cards' ? '🂡' : '♛'}</Text>
          )}
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Ornamento width={145} />
        <Text style={styles.description}>{item.description}</Text>
      </Animated.View>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 22 }]}>
        <View style={styles.dots}>
          {PASOS.map((_, index) => (
            <View key={index} style={[styles.dot, index === step && styles.dotActive]} />
          ))}
        </View>
        <TouchableOpacity style={styles.continueButton} onPress={siguiente}>
          <Text style={styles.continueText}>{step === PASOS.length - 1 ? 'Empezar' : 'Continuar'}</Text>
        </TouchableOpacity>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  skip: { position: 'absolute', right: 28, zIndex: 2 },
  skipText: { fontFamily: fonts.sansMedium, color: colors.marfilMedio, fontSize: 12 },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 15,
  },
  illustration: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: 'rgba(2,10,7,0.34)',
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
  },
  symbol: { fontSize: 88, color: colors.oro },
  title: {
    fontFamily: fonts.serif,
    fontSize: 38,
    lineHeight: 41,
    color: colors.marfil,
    textAlign: 'center',
  },
  description: {
    maxWidth: 310,
    fontFamily: fonts.sans,
    fontSize: 14,
    lineHeight: 21,
    color: colors.marfilMedio,
    textAlign: 'center',
  },
  footer: { paddingHorizontal: spacing.xl, gap: 18 },
  dots: { flexDirection: 'row', alignSelf: 'center', gap: 7 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.marfilTenue },
  dotActive: { width: 24, backgroundColor: colors.oro },
  continueButton: {
    height: 56,
    borderRadius: radius.md,
    backgroundColor: 'rgba(13,55,32,0.9)',
    borderWidth: 1,
    borderColor: colors.bordeDoradoFuerte,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: { fontFamily: fonts.serif, fontSize: 23, color: colors.marfil },
});
