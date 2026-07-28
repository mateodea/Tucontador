import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBackground from '../components/common/AppBackground';
import BrandTitle from '../components/common/BrandTitle';
import { GrupoFosforos } from '../components/fosforos/Fosforos';
import { onboardingVisto } from '../utils/storage';
import { colors } from '../theme/colors';
import { fonts } from '../theme/typography';

export default function SplashScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 55, friction: 8, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(async () => {
      const visto = await onboardingVisto();
      navigation.replace(visto ? 'Inicio' : 'Onboarding');
    }, 1900);
    return () => clearTimeout(timer);
  }, [fade, scale, navigation]);

  return (
    <AppBackground navy framed>
      <Animated.View style={[styles.content, { opacity: fade, transform: [{ scale }] }]}>
        <View style={styles.mark}>
          <GrupoFosforos cantidad={5} size={104} guia={false} />
        </View>
        <BrandTitle size={58} subtitle="Contador de cartas" />
        <Text style={styles.loading}>PREPARANDO LA MESA</Text>
      </Animated.View>
      <Text style={[styles.footer, { bottom: insets.bottom + 22 }]}>HECHO EN ARGENTINA</Text>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
    paddingHorizontal: 28,
  },
  mark: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    backgroundColor: 'rgba(11,58,35,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loading: {
    marginTop: 8,
    fontFamily: fonts.sansMedium,
    fontSize: 9,
    color: colors.marfilSuave,
    letterSpacing: 2.5,
  },
  footer: {
    position: 'absolute',
    alignSelf: 'center',
    fontFamily: fonts.sansMedium,
    fontSize: 8,
    color: colors.oro,
    letterSpacing: 2,
  },
});
