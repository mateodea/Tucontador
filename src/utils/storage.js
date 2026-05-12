// ─── TUCONTADOR — Almacenamiento local ──────────────────────────────────────
import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  HISTORIAL:   'tucontador_historial',
  AJUSTES:     'tucontador_ajustes',
  ONBOARDING:  'tucontador_onboarding_visto',
};

// ── Ajustes por defecto ──────────────────────────────────────────────────────
export const AJUSTES_DEFAULT = {
  sonidos:            true,
  vibracion:          true,
  confirmarPuntos:    false,
  permitirDeshacer:   true,
  guardarHistorial:   true,
  pantallaEncendida:  true,
};

// ── Ajustes ──────────────────────────────────────────────────────────────────
export async function getAjustes() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.AJUSTES);
    if (!raw) return AJUSTES_DEFAULT;
    return { ...AJUSTES_DEFAULT, ...JSON.parse(raw) };
  } catch {
    return AJUSTES_DEFAULT;
  }
}

export async function setAjustes(ajustes) {
  try {
    await AsyncStorage.setItem(KEYS.AJUSTES, JSON.stringify(ajustes));
  } catch (e) {
    console.error('Error guardando ajustes:', e);
  }
}

// ── Historial ────────────────────────────────────────────────────────────────
export async function getHistorial() {
  try {
    const raw = await AsyncStorage.getItem(KEYS.HISTORIAL);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function guardarPartida(partida) {
  try {
    const historial = await getHistorial();
    const nueva = {
      id:          Date.now().toString(),
      fecha:       new Date().toISOString(),
      juego:       partida.juego,
      equipos:     partida.equipos,
      puntajes:    partida.puntajes,
      ganador:     partida.ganador,
      limite:      partida.limite,
      movimientos: partida.movimientos || [],
      duracion:    partida.duracion || 0,
    };
    const actualizado = [nueva, ...historial].slice(0, 100); // máximo 100 partidas
    await AsyncStorage.setItem(KEYS.HISTORIAL, JSON.stringify(actualizado));
    return nueva;
  } catch (e) {
    console.error('Error guardando partida:', e);
  }
}

export async function borrarHistorial() {
  try {
    await AsyncStorage.removeItem(KEYS.HISTORIAL);
  } catch (e) {
    console.error('Error borrando historial:', e);
  }
}

// ── Onboarding ───────────────────────────────────────────────────────────────
export async function onboardingVisto() {
  try {
    const val = await AsyncStorage.getItem(KEYS.ONBOARDING);
    return val === 'true';
  } catch {
    return false;
  }
}

export async function marcarOnboardingVisto() {
  try {
    await AsyncStorage.setItem(KEYS.ONBOARDING, 'true');
  } catch (e) {
    console.error('Error marcando onboarding:', e);
  }
}
