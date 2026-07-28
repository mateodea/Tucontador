// ─── TUCONTADOR — Marcador Multijugador (Rummy, Canasta, Tute) ──────────────
import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  FlatList, StyleSheet, Modal, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { guardarPartida } from '../utils/storage';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';

// Colores para hasta 6 jugadores
const COLORES_JUGADORES = [
  colors.rojo,
  colors.azul,
  '#5AB87A',   // verde
  '#D4A843',   // dorado
  '#B87AB8',   // violeta
  '#D4844A',   // naranja
];

export default function MarcadorMultijugador({ route, navigation }) {
  const { juego, equipos, limite, ajustes } = route.params;
  const insets = useSafeAreaInsets();

  // Estado de puntajes y inputs
  const [puntajes, setPuntajes]     = useState(equipos.map(() => 0));
  const [inputs, setInputs]         = useState(equipos.map(() => ''));
  const [eliminados, setEliminados] = useState(equipos.map(() => false));
  const [historial, setHistorial]   = useState([]);
  const [modalGanador, setModalGanador] = useState(false);
  const [ganadorIdx, setGanadorIdx] = useState(null);

  // Animaciones por jugador
  const escalasAnim = useRef(equipos.map(() => new Animated.Value(1))).current;

  const animar = (idx) => {
    Animated.sequence([
      Animated.spring(escalasAnim[idx], { toValue: 1.12, useNativeDriver: true, speed: 40 }),
      Animated.spring(escalasAnim[idx], { toValue: 1,    useNativeDriver: true, speed: 20 }),
    ]).start();
  };

  // ── Confirmar mano completa ───────────────────────────────────────────────
  const confirmarMano = () => {
    const valores = inputs.map((v, i) =>
      eliminados[i] ? 0 : (parseInt(v) || 0)
    );

    if (valores.every(v => v === 0)) return;

    const nuevos = puntajes.map((p, i) => p + valores[i]);
    const nuevosEliminados = [...eliminados];

    // Animar y verificar eliminados
    valores.forEach((v, i) => {
      if (v !== 0) animar(i);
      if (limite && nuevos[i] >= limite) {
        nuevosEliminados[i] = true;
        if (ajustes?.vibracion) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
    });

    if (ajustes?.vibracion) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setPuntajes(nuevos);
    setEliminados(nuevosEliminados);
    setInputs(equipos.map(() => ''));

    setHistorial(h => [...h, {
      mano:    h.length + 1,
      puntos:  valores,
      totales: nuevos,
    }]);

    // Verificar si queda un solo jugador activo
    const activos = nuevosEliminados.filter(e => !e).length;
    if (activos <= 1) {
      const ganador = nuevosEliminados.findIndex(e => !e);
      const winner = ganador !== -1 ? ganador : nuevos.indexOf(Math.min(...nuevos));
      setGanadorIdx(winner);
      if (ajustes?.guardarHistorial) {
        guardarPartida({
          juego: juego.id,
          equipos: equipos.map(team => team.nombre),
          puntajes: nuevos,
          ganador: winner,
          limite,
          movimientos: [],
        });
      }
      setTimeout(() => setModalGanador(true), 500);
    }
  };

  const reiniciar = () => {
    setPuntajes(equipos.map(() => 0));
    setInputs(equipos.map(() => ''));
    setEliminados(equipos.map(() => false));
    setHistorial([]);
    setModalGanador(false);
  };

  const renderJugador = ({ item, index }) => {
    const color      = COLORES_JUGADORES[index % COLORES_JUGADORES.length];
    const estaFuera  = eliminados[index];

    return (
      <View style={[
        styles.jugadorRow,
        { borderColor: `${color}30` },
        estaFuera && styles.jugadorEliminado,
      ]}>
        {/* Número */}
        <Text style={[styles.jugadorNum, { color: `${color}60` }]}>{index + 1}</Text>

        {/* Color dot */}
        <View style={[styles.jugadorDot, { backgroundColor: color }]}/>

        {/* Nombre + puntaje */}
        <View style={styles.jugadorInfo}>
          <Text style={[styles.jugadorNombre, estaFuera && styles.textoTachado]}>
            {item.nombre}
          </Text>
          <View style={styles.barraTrack}>
            <View style={[styles.barraFill, {
              width: limite ? `${Math.min(100, (puntajes[index] / limite) * 100)}%` : '0%',
              backgroundColor: color,
            }]}/>
          </View>
        </View>

        {/* Puntaje animado */}
        <Animated.Text style={[
          styles.jugadorPuntaje,
          { color, transform: [{ scale: escalasAnim[index] }] },
          estaFuera && { opacity: 0.35 },
        ]}>
          {puntajes[index]}
        </Animated.Text>

        {/* Input nueva mano */}
        {!estaFuera ? (
          <TextInput
            style={[styles.inputMano, { borderColor: `${color}40`, color }]}
            value={inputs[index]}
            onChangeText={v => {
              const nuevos = [...inputs];
              nuevos[index] = v.replace(/[^0-9]/g, '');
              setInputs(nuevos);
            }}
            placeholder="pts"
            placeholderTextColor={`${color}40`}
            keyboardType="number-pad"
            textAlign="center"
          />
        ) : (
          <View style={styles.fueraChip}>
            <Text style={styles.fueraText}>FUERA</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={[colors.panoClaro, colors.fondoPrincipal, colors.fondoProfundo]} style={StyleSheet.absoluteFill}/>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.hdrTexto}>
          <Text style={styles.hdrTitulo}>{juego.nombre}</Text>
          <Text style={styles.hdrSub}>
            {equipos.length} jugadores{limite ? ` · hasta ${limite} pts` : ''}
          </Text>
        </View>
        <TouchableOpacity style={styles.backBtn} onPress={reiniciar}>
          <Text style={styles.backText}>↺</Text>
        </TouchableOpacity>
      </View>

      {/* Ronda actual */}
      <View style={styles.rondaRow}>
        <Text style={styles.rondaLabel}>Mano</Text>
        <Text style={styles.rondaNum}>{historial.length + 1}</Text>
        <Text style={styles.rondaActivos}>
          {equipos.filter((_, i) => !eliminados[i]).length} activos
        </Text>
      </View>

      {/* Lista de jugadores */}
      <FlatList
        data={equipos}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderJugador}
        style={styles.lista}
        contentContainerStyle={styles.listaContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Botón confirmar */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 10 }]}>
        <TouchableOpacity style={styles.confirmarBtn} onPress={confirmarMano} activeOpacity={0.8}>
          <LinearGradient
            colors={['#8B3A2A', '#6B2A1A']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          />
          <Text style={styles.confirmarText}>Confirmar mano {historial.length + 1}</Text>
        </TouchableOpacity>
      </View>

      {/* Modal ganador */}
      <Modal visible={modalGanador} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.ganadorCard}>
            <Text style={styles.ganadorEstrella}>★</Text>
            <Text style={styles.ganadorLabel}>¡Ganador!</Text>
            <Text style={styles.ganadorNombre}>
              {ganadorIdx !== null ? equipos[ganadorIdx]?.nombre : '—'}
            </Text>
            <Text style={styles.ganadorDetalle}>
              {puntajes.map((p, i) => `${equipos[i].nombre}: ${p}`).join(' · ')}
            </Text>
            <View style={styles.ganadorBtns}>
              <TouchableOpacity style={styles.revanchaBtn} onPress={reiniciar}>
                <Text style={styles.revanchaText}>Revancha</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('Inicio')}>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingBottom: spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(184,150,46,0.1)', gap: spacing.sm },
  backBtn: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(0,0,0,0.28)', borderWidth: 1, borderColor: 'rgba(184,150,46,0.2)', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 14, color: 'rgba(184,150,46,0.7)' },
  hdrTexto: { flex: 1 },
  hdrTitulo: { fontFamily: fonts.serif, fontSize: fontSize.screenTitle, lineHeight: 29, color: colors.marfil, textAlign: 'center' },
  hdrSub: { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: 'rgba(184,150,46,0.5)', textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase', marginTop: 1 },

  rondaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.sm, gap: spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(184,150,46,0.08)' },
  rondaLabel: { fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny, color: 'rgba(184,150,46,0.4)', letterSpacing: 2.5, textTransform: 'uppercase' },
  rondaNum: { fontFamily: fonts.serif, fontSize: fontSize.scoreSmall, color: colors.oro, fontWeight: '700' },
  rondaActivos: { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: colors.marfilTenue },

  lista: { flex: 1 },
  listaContent: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, gap: spacing.sm },

  jugadorRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.sm, borderRadius: radius.md,
    backgroundColor: 'rgba(0,0,0,0.22)', borderWidth: 1,
  },
  jugadorEliminado: { opacity: 0.45 },
  jugadorNum: { fontFamily: fonts.serif, fontSize: fontSize.body, width: 16, textAlign: 'center' },
  jugadorDot: { width: 9, height: 9, borderRadius: 4.5, flexShrink: 0 },
  jugadorInfo: { flex: 1 },
  jugadorNombre: { fontFamily: fonts.sansSemibold, fontSize: fontSize.body, color: colors.marfil },
  textoTachado: { textDecorationLine: 'line-through', color: colors.marfilTenue },
  barraTrack: { height: 2, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 1, overflow: 'hidden', marginTop: 4 },
  barraFill: { height: '100%', borderRadius: 1 },
  jugadorPuntaje: { fontFamily: fonts.serif, fontSize: fontSize.scoreMedium, fontWeight: '700', lineHeight: fontSize.scoreMedium * 1.1, minWidth: 42, textAlign: 'center' },
  inputMano: { width: 52, height: 38, borderRadius: radius.sm, borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.3)', fontFamily: fonts.serif, fontSize: fontSize.body + 2, paddingHorizontal: 4 },
  fueraChip: { width: 52, height: 28, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.06)', alignItems: 'center', justifyContent: 'center' },
  fueraText: { fontFamily: fonts.sansBold, fontSize: 8, color: 'rgba(192,57,43,0.7)', letterSpacing: 1 },

  footer: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, borderTopWidth: 1, borderTopColor: 'rgba(184,150,46,0.1)' },
  confirmarBtn: { borderRadius: radius.md, paddingVertical: 13, alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(139,58,42,0.5)' },
  confirmarText: { fontFamily: fonts.serif, fontSize: fontSize.screenTitle, color: colors.marfil },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  ganadorCard: { backgroundColor: '#162018', borderRadius: radius.xl, padding: spacing.xl, alignItems: 'center', gap: spacing.sm, borderWidth: 1, borderColor: colors.bordeDoradoMedio, width: '100%' },
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
