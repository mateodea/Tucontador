// ─── TUCONTADOR — Navegación principal (actualizada) ────────────────────────
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen         from '../screens/SplashScreen';
import OnboardingScreen     from '../screens/OnboardingScreen';
import InicioScreen         from '../screens/InicioScreen';
import ConfigScreen         from '../screens/ConfigScreen';
import MarcadorScreen       from '../screens/MarcadorScreen';
import MarcadorChinchon     from '../screens/MarcadorChinchon';
import MarcadorEscoba       from '../screens/MarcadorEscoba';
import MarcadorGenerala     from '../screens/MarcadorGenerala';
import MarcadorMultijugador from '../screens/MarcadorMultijugador';
import GanadorScreen        from '../screens/GanadorScreen';
import HistorialScreen      from '../screens/HistorialScreen';
import DetalleScreen        from '../screens/DetalleScreen';
import AjustesScreen        from '../screens/AjustesScreen';

const Stack = createNativeStackNavigator();

export function getMarcadorPorJuego(juegoId) {
  switch (juegoId) {
    case 'chinchon':     return 'MarcadorChinchon';
    case 'escoba':       return 'MarcadorEscoba';
    case 'generala':     return 'MarcadorGenerala';
    case 'rummy':
    case 'canasta':
    case 'tute':         return 'MarcadorMultijugador';
    default:             return 'Marcador';
  }
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: '#0E1510' } }}
      >
        <Stack.Screen name="Splash"               component={SplashScreen} />
        <Stack.Screen name="Onboarding"            component={OnboardingScreen} />
        <Stack.Screen name="Inicio"                component={InicioScreen}            options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="Config"                component={ConfigScreen}            options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Marcador"              component={MarcadorScreen}          options={{ animation: 'slide_from_right', gestureEnabled: false }} />
        <Stack.Screen name="MarcadorChinchon"      component={MarcadorChinchon}        options={{ animation: 'slide_from_right', gestureEnabled: false }} />
        <Stack.Screen name="MarcadorEscoba"        component={MarcadorEscoba}          options={{ animation: 'slide_from_right', gestureEnabled: false }} />
        <Stack.Screen name="MarcadorGenerala"      component={MarcadorGenerala}        options={{ animation: 'slide_from_right', gestureEnabled: false }} />
        <Stack.Screen name="MarcadorMultijugador"  component={MarcadorMultijugador}    options={{ animation: 'slide_from_right', gestureEnabled: false }} />
        <Stack.Screen name="Ganador"               component={GanadorScreen}           options={{ animation: 'fade', gestureEnabled: false }} />
        <Stack.Screen name="Historial"             component={HistorialScreen}         options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Detalle"               component={DetalleScreen}           options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Ajustes"               component={AjustesScreen}           options={{ animation: 'slide_from_bottom' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
