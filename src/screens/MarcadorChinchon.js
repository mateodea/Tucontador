// ─── TUCONTADOR — Marcador Chinchón ─────────────────────────────────────────
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Animated, Modal, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';

export default function MarcadorChinchon({ route, navigation }) {
  const { equipos, limite, ajustes } = route.params;
  const insets = useSafeAreaInsets();

  // Estado
  const [puntajes, setPuntajes]       = useState(equipos.map(() => 0));
  const [inputs, setInputs]           = useState(equipos.map(() => ''));
  const [historial, setHistorial]     = useState([]);
  const [modalGanador, setModalGanador] = useState(false);
  const [ganadorIdx, setGanadorIdx]   = useState(null);

  // Animaciones de rebote al confirmar
  const escalaAnimR = useRef(new Animated.Value(1)).current;
  const escalaAnimB = useRef(new Animated.Value(1)).current;
  const escalas     = [escalaAnimR, escalaAnimB];

  const animarPuntaje = (idx) => {
    Animated.sequence([
      Animated.spring(escalas[idx], { toValue: 1.18, useNativeDriver: true, speed: 40 }),
      Animated.spring(escalas[idx], { toValue: 1,    useNativeDriver: true, speed: 20 }),
    ]).start();
  };

  // ── Confirmar una mano ────────────────────────────────────────────────────
  const confirmarMano = () => {
    // Validar que al menos un equipo tenga input
    const valoresNumericos = inputs.map(v => v === '' ? 0 : parseInt(v) || 0);
    if (valoresNumericos.every(v => v === 0) && inputs.every(i => i === '')) return;

    const nuevos = puntajes.map((p, i) => p + valoresNumericos[i]);

    // Registrar en historial
    setHistorial(h => [...h, {
      mano:   h.length + 1,
      puntos: valoresNumericos,
      totales: nuevos,
    }]);

    // Animar los que cambiaron
    valoresNumericos.forEach((v, i) => { if (v !== 0) animarPuntaje(i); });

    // Haptics
    if (ajustes?.vibracion) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setPuntajes(nuevos);
    setInputs(equipos.map(() => ''));

    // Verificar si alguien llegó al límite (en Chinchón gana quien tiene MENOS)
    // El que llega al límite queda ELIMINADO, gana el que queda
    const eliminados = nuevos.map(p => p >= limite);
    if (eliminados.some(Boolean)) {
      // Gana el que NO fue eliminado
      const ganador = eliminados.findIndex(e => !e);
      setGanadorIdx(ganador !== -1 ? ganador : 0);
      setTimeout(() => setModalGanador(true), 500);
    }
  };

  // ── Chinchón especial (resta 10 al que lo hace) ───────────────────────────
  const chinchon = (equipoIdx) => {
    if (ajustes?.vibracion) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const nuevos = [...puntajes];
    nuevos[equipoIdx] = Math.max(0, nuevos[equipoIdx] - 10);
    setPuntajes(nuevos);
    animarPuntaje(equipoIdx);
    setHistorial(h => [...h, {
      mano:    h.length + 1,
      especial: `¡Chinchón! (${equipos[equipoIdx].nombre})`,
      puntos:  equipos.map((_, i) => i === equipoIdx ? -10 : 0),
      totales: nuevos,
    }]);
  };

  // ── Deshacer última mano ──────────────────────────────────────────────────
  const deshacer = () => {
    if (historial.length === 0) return;
    const ultima = historial[historial.length - 1];
    setPuntajes(ultima.totales.map((t, i) => t - (ultima.puntos?.[i] || 0)));
    setHistorial(h => h.slice(0, -1));
    if (ajustes?.vibracion) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const coloresEquipo = [colors.rojo, colors.azul];
  const coloresFondo  = ['#180808', '#080c18'];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#243d28', '#1C2B1F', '#101a12']} style={StyleSheet.absoluteFill}/>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.hdrTexto}>
          <Text style={styles.hdrTitulo}>Chinchón</Text>
          <Text style={styles.hdrSub}>{equipos.map(e => e.nombre).join(' vs ')} · hasta {limite} pts</Text>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={deshacer}>
          <Text style={styles.backText}>↩</Text>
        </TouchableOpacity>
      </View>

      {/* Puntajes grandes */}
      <View style={styles.tablero}>
        {equipos.map((equipo, i) => (
          <React.Fragment key={i}>
            {i === 1 && <View style={styles.separador}/>}
            <View style={[styles.panel, { backgroundColor: coloresFondo[i] }]}>

              <View style={styles.panelHeader}>
                <View style={[styles.dot, { backgroundColor: i === 0 ? colors.rojoProfundo : colors.azulOscuro }]}/>
                <Text style={[styles.equipoNombre, { color: i === 0 ? '#C06050' : '#5090C0' }]}>
                  {equipo.nombre}
                </Text>
              </View>

              {/* Número grande animado */}
              <Animated.Text style={[
                styles.puntajeGrande,
                { color: coloresEquipo[i], transform: [{ scale: escalas[i] }] },
              ]}>
                {puntajes[i]}
              </Animated.Text>
              <Text style={styles.deLimite}>de {limite}</Text>

              {/* Barra progreso */}
              <View style={styles.barraTrack}>
                <View style={[styles.barraFill, {
                  width: `${Math.min(100, (puntajes[i] / limite) * 100)}%`,
                  backgroundColor: coloresEquipo[i],
                }]}/>
              </View>

              {/* Input de puntos */}
              <View style={styles.inputWrap}>
                <Text style={[styles.inputLabel, { color: coloresEquipo[i] }]}>Puntos mano</Text>
                <TextInput
                  style={[styles.input, { borderColor: `${coloresEquipo[i]}40` }]}
                  value={inputs[i]}
                  onChangeText={v => {
                    const nuevos = [...inputs];
                    nuevos[i] = v.replace(/[^0-9-]/g, '');
                    setInputs(nuevos);
                  }}
                  placeholder="0"
                  placeholderTextColor={colors.marfilTenue}
                  keyboardType="numbers-and-punctuation"
                  textAlign="center"
                />
              </View>

              {/* Chinchón */}
              <TouchableOpacity
                style={[styles.chinchonBtn, { borderColor: `${coloresEquipo[i]}40` }]}
                onPress={() => chinchon(i)}
                activeOpacity={0.75}
              >
                <Text style={[styles.chinchonText, { color: coloresEquipo[i] }]}>
                  ¡Chinchón! −10
                </Text>
              </TouchableOpacity>

            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Botón confirmar mano */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.confirmarBtn} onPress={confirmarMano} activeOpacity={0.8}>
          <LinearGradient
            colors={['#8B3A2A', '#6B2A1A']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          />
          <Text style={styles.confirmarText}>Confirmar mano</Text>
          <Text style={styles.confirmarSub}>
            {inputs.map((v, i) => `${equipos[i].nombre}: ${v || '0'} pts`).join('  ·  ')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Modal ganador */}
      <Modal visible={modalGanador} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.ganadorCard}>
            <Text style={styles.ganadorEstrella}>★</Text>
            <Text style={styles.ganadorLabel}>¡Ganadores!</Text>
            <Text style={styles.ganadorNombre}>
              {ganadorIdx !== null ? equipos[ganadorIdx]?.nombre : '—'}
            </Text>
            <Text style={styles.ganadorDetalle}>
              {puntajes.map((p, i) => `${equipos[i].nombre}: ${p} pts`).join('  vs  ')}
            </Text>
            <View style={styles.ganadorBtns}>
              <TouchableOpacity
                style={styles.revanchaBtn}
                onPress={() => {
                  setModalGanador(false);
                  setPuntajes(equipos.map(() => 0));
                  setHistorial([]);
                }}
              >
                <Text style={styles.revanchaText}>Revancha</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.menuBtn}
                onPress={() => navigation.navigate('Inicio')}
              >
                <Text style={styles.menuText}>Menú</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingBottom: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: 'rgba(184,150,46,0.1)', gap: spacing.sm,
  },
  backBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.28)',
    borderWidth: 1, borderColor: 'rgba(184,150,46,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  backText: { fontSize: 14, color: 'rgba(184,150,46,0.7)' },
  hdrTexto: { flex: 1 },
  hdrTitulo: { fontFamily: fonts.serif, fontSize: fontSize.body + 2, color: colors.marfil, textAlign: 'center' },
  hdrSub: { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: 'rgba(184,150,46,0.5)', textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase', marginTop: 1 },

  tablero: { flexDirection: 'row', flex: 1 },
  separador: { width: 1, backgroundColor: 'rgba(184,150,46,0.12)' },

  panel: {
    flex: 1, alignItems: 'center',
    padding: spacing.sm, paddingTop: spacing.md, gap: spacing.sm,
  },
  panelHeader: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  dot: { width: 7, height: 7, borderRadius: 3.5 },
  equipoNombre: { fontFamily: fonts.sansBold, fontSize: fontSize.label, letterSpacing: 1.5, textTransform: 'uppercase' },

  puntajeGrande: {
    fontFamily: fonts.serif, fontSize: fontSize.scoreHuge,
    fontWeight: '700', lineHeight: fontSize.scoreHuge * 1.05,
  },
  deLimite: { fontFamily: fonts.sans, fontSize: fontSize.label, color: colors.marfilTenue, marginTop: -4 },

  barraTrack: { width: '90%', height: 3, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 2, overflow: 'hidden' },
  barraFill: { height: '100%', borderRadius: 2 },

  inputWrap: { width: '90%', gap: 4 },
  inputLabel: { fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny, letterSpacing: 1.5, textTransform: 'uppercase' },
  input: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1, borderRadius: radius.sm,
    padding: spacing.sm,
    fontFamily: fonts.serif, fontSize: fontSize.scoreMedium,
    color: colors.marfil, textAlign: 'center',
  },

  chinchonBtn: {
    width: '90%', paddingVertical: 7, borderRadius: radius.sm,
    backgroundColor: 'rgba(184,150,46,0.08)',
    borderWidth: 1, alignItems: 'center',
  },
  chinchonText: { fontFamily: fonts.sansSemibold, fontSize: fontSize.bodySmall },

  footer: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(184,150,46,0.1)' },
  confirmarBtn: {
    borderRadius: radius.md, paddingVertical: 13,
    alignItems: 'center', overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(139,58,42,0.5)',
  },
  confirmarText: { fontFamily: fonts.serif, fontSize: fontSize.screenTitle, color: colors.marfil },
  confirmarSub: { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: 'rgba(242,237,215,0.4)', marginTop: 2, letterSpacing: 1 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  ganadorCard: {
    backgroundColor: '#162018', borderRadius: radius.xl,
    padding: spacing.xl, alignItems: 'center', gap: spacing.sm,
    borderWidth: 1, borderColor: colors.bordeDoradoMedio, width: '100%',
  },
  ganadorEstrella: { fontSize: 52, color: colors.oro },
  ganadorLabel: { fontFamily: fonts.sansBold, fontSize: fontSize.label, color: 'rgba(184,150,46,0.55)', letterSpacing: 3, textTransform: 'uppercase' },
  ganadorNombre: { fontFamily: fonts.serifItalic, fontSize: fontSize.gameTitle, color: colors.oro },
  ganadorDetalle: { fontFamily: fonts.sans, fontSize: fontSize.bodySmall, color: colors.marfilSuave, textAlign: 'center' },
  ganadorBtns: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.sm, width: '100%' },
  revanchaBtn: { flex: 1, paddingVertical: 12, borderRadius: radius.md, backgroundColor: 'rgba(42,107,58,0.3)', borderWidth: 1, borderColor: 'rgba(42,107,58,0.5)', alignItems: 'center' },
  revanchaText: { fontFamily: fonts.serif, fontSize: fontSize.body + 2, color: colors.marfil },
  menuBtn: { flex: 1, paddingVertical: 12, borderRadius: radius.md, backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 1, borderColor: colors.bordeSuave, alignItems: 'center' },
  menuText: { fontFamily: fonts.sansMedium, fontSize: fontSize.body, color: colors.marfilTenue },
});
