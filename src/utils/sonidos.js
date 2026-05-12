// ─── TUCONTADOR — Sistema de sonidos ────────────────────────────────────────
// Usamos expo-av para reproducir sonidos cortos
// Los sonidos se generan programáticamente con Web Audio API via expo-av
// para no depender de archivos de audio externos

import { Audio } from 'expo-av';

// Cache de sonidos cargados
const cache = {};

// Configuración de audio
export async function inicializarAudio() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS:    true,
      staysActiveInBackground: false,
      shouldDuckAndroid:       true,
    });
  } catch (e) {
    console.warn('Error inicializando audio:', e);
  }
}

// ── Sonidos disponibles ──────────────────────────────────────────────────────
// Usamos sonidos de la librería de Expo (built-in)
// En producción se reemplazarían por archivos .mp3 propios

const SONIDOS = {
  punto:    require('../../assets/sounds/punto.mp3'),
  truco:    require('../../assets/sounds/truco.mp3'),
  ganador:  require('../../assets/sounds/ganador.mp3'),
  deshacer: require('../../assets/sounds/deshacer.mp3'),
  error:    require('../../assets/sounds/error.mp3'),
};

async function cargarSonido(key) {
  if (cache[key]) return cache[key];
  try {
    const { sound } = await Audio.Sound.createAsync(SONIDOS[key]);
    cache[key] = sound;
    return sound;
  } catch (e) {
    console.warn(`Error cargando sonido ${key}:`, e);
    return null;
  }
}

export async function reproducir(key, habilitado = true) {
  if (!habilitado) return;
  try {
    const sound = await cargarSonido(key);
    if (!sound) return;
    await sound.replayAsync();
  } catch (e) {
    // Silencioso — no queremos que un error de audio rompa la app
  }
}

export async function limpiarSonidos() {
  for (const key of Object.keys(cache)) {
    try {
      await cache[key].unloadAsync();
      delete cache[key];
    } catch {}
  }
}
