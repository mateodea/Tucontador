# Tucontador 🃏

Contador de puntos para juegos de cartas argentinos y uruguayos, con una
interfaz inspirada en el paño de juego, las cartas españolas y el conteo
tradicional con fósforos.

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

## Experiencia
- Marcador de Truco táctil: tocar el lado de un equipo suma un punto
- Seis grupos verticales de fósforos por equipo (3 malas + 3 buenas)
- Partida rápida desde el menú principal
- Configuración de 2 a 8 jugadores según el juego
- Historial y estadísticas locales
- Reglas rápidas y prototipo funcional de torneos
- Ajustes persistentes de vibración, confirmación e historial

## Requisitos
- Node.js 18 o superior
- Expo Go en tu Android o iOS

## Instalación

```bash
# 1. Instalar dependencias exactas
npm ci

# 2. Arrancar el servidor (misma red Wi-Fi)
npx expo start --lan

# 3. Si la red local bloquea la conexión
npx expo start --tunnel
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
