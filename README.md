# Tucontador 🃏

Contador de puntos para juegos de cartas argentinos y uruguayos.

## Juegos incluidos
- Truco Argentino (con Envido)
- Truco Uruguayo (sin Envido)
- Chinchón
- Escoba del 15
- Rummy
- Canasta
- Tute
- Generala
- Modo Libre

## Requisitos
- Node.js 18 o superior
- Expo Go en tu Android o iOS

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Arrancar el servidor
npx expo start

# 3. Escanear el QR con Expo Go en tu celular
```

## Estructura del proyecto

```
Tucontador/
├── App.js                          # Entry point
├── app.json                        # Configuración Expo
├── src/
│   ├── screens/
│   │   ├── SplashScreen.js         # Pantalla de carga
│   │   ├── OnboardingScreen.js     # Tutorial primera vez
│   │   ├── InicioScreen.js         # Menú principal
│   │   ├── ConfigScreen.js         # Configurar partida
│   │   ├── MarcadorScreen.js       # Marcador en juego ← corazón de la app
│   │   ├── GanadorScreen.js        # Pantalla de ganador
│   │   ├── HistorialScreen.js      # Historial de partidas
│   │   ├── DetalleScreen.js        # Detalle de una partida
│   │   └── AjustesScreen.js        # Configuración
│   ├── components/
│   │   ├── fosforos/
│   │   │   └── Fosforos.js         # Sistema de fósforos (1-5 por grupo)
│   │   └── common/
│   │       ├── Boton.js            # Botón reutilizable
│   │       ├── FondoPano.js        # Fondo verde con textura
│   │       └── IconoJuego.js       # Íconos SVG de cada juego
│   ├── navigation/
│   │   └── AppNavigator.js         # Navegación entre pantallas
│   ├── hooks/
│   │   └── usePartida.js           # Estado central del juego
│   ├── data/
│   │   └── juegos.js               # Configuración de todos los juegos
│   ├── utils/
│   │   └── storage.js              # AsyncStorage (historial, ajustes)
│   └── theme/
│       ├── colors.js               # Paleta de colores
│       └── typography.js           # Tipografía y espaciado
```

## Tecnologías
- React Native + Expo
- React Navigation
- AsyncStorage
- react-native-svg
- expo-haptics
- Cormorant Garamond + Outfit (tipografías)
