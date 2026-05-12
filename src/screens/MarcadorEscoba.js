// ─── TUCONTADOR — Marcador Escoba del 15 ────────────────────────────────────
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Animated, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';

// Categorías de puntos en Escoba del 15
const CATEGORIAS = [
  { id: 'cartas',  label: 'Cartas',   desc: 'Más cartas',      puntos: 1 },
  { id: 'escobas', label: 'Escobas',  desc: '+1 por escoba',   puntos: 1 },
  { id: 'siete',   label: '7 de oro', desc: 'El mejor setenta',puntos: 1 },
  { id: 'setenta', label: 'Setenta',  desc: 'Mayor setenta',   puntos: 1 },
];

export default function MarcadorEscoba({ route, navigation }) {
  const { equipos, limite, ajustes } = route.params;
  const insets = useSafeAreaInsets();

  // Subcategorías separadas para mostrar desglose
  const initSubcat = () => equipos.map(() =>
    Object.fromEntries(CATEGORIAS.map(c => [c.id, 0]))
  );

  const [subcats, setSubcats]         = useState(initSubcat());
  const [historial, setHistorial]     = useState([]);
  const [modalGanador, setModalGanador] = useState(false);
  const [ganadorIdx, setGanadorIdx]   = useState(null);

  // Calcular total de cada equipo
  const totales = subcats.map(s => Object.values(s).reduce((a, b) => a + b, 0));

  // Animaciones
  const escalas = [useRef(new Animated.Value(1)).current, useRef(new Animated.Value(1)).current];
  const animar = (idx) => {
    Animated.sequence([
      Animated.spring(escalas[idx], { toValue: 1.15, useNativeDriver: true, speed: 40 }),
      Animated.spring(escalas[idx], { toValue: 1,    useNativeDriver: true, speed: 20 }),
    ]).start();
  };

  // ── Sumar una categoría a un equipo ──────────────────────────────────────
  const sumar = (equipoIdx, catId, valor = 1) => {
    if (ajustes?.vibracion) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setSubcats(prev => {
      const nuevos = prev.map((s, i) => i === equipoIdx
        ? { ...s, [catId]: Math.max(0, s[catId] + valor) }
        : s
      );

      animar(equipoIdx);

      // Verificar límite
      const nuevoTotal = Object.values(nuevos[equipoIdx]).reduce((a, b) => a + b, 0);
      if (limite && nuevoTotal >= limite) {
        setGanadorIdx(equipoIdx);
        setTimeout(() => setModalGanador(true), 400);
      }

      return nuevos;
    });
  };

  const coloresEquipo = [colors.rojo, colors.azul];
  const coloresFondo  = ['#180808', '#080c18'];
  const coloresBorde  = ['rgba(139,58,42,0.3)', 'rgba(42,80,128,0.3)'];

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#243d28', '#1C2B1F', '#101a12']} style={StyleSheet.absoluteFill}/>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.hdrTexto}>
          <Text style={styles.hdrTitulo}>Escoba del 15</Text>
          <Text style={styles.hdrSub}>{equipos.map(e => e.nombre).join(' vs ')} · hasta {limite} pts</Text>
        </View>
        <View style={{ width: 30 }}/>
      </View>

      {/* Totales rápidos arriba */}
      <View style={styles.totalesRow}>
        {equipos.map((eq, i) => (
          <React.Fragment key={i}>
            {i === 1 && <View style={styles.totalesSep}/>}
            <Animated.View style={[styles.totalChip, { transform: [{ scale: escalas[i] }] }]}>
              <Text style={[styles.totalNum, { color: coloresEquipo[i] }]}>{totales[i]}</Text>
              <Text style={styles.totalLabel}>{eq.nombre}</Text>
            </Animated.View>
          </React.Fragment>
        ))}
      </View>

      {/* Tabla de categorías */}
      <View style={styles.tabla}>
        {/* Encabezados */}
        <View style={styles.tablaHeader}>
          <View style={styles.tablaCategCol}>
            <Text style={styles.tablaHeaderText}>Categoría</Text>
          </View>
          {equipos.map((eq, i) => (
            <View key={i} style={styles.tablaEquipoCol}>
              <Text style={[styles.tablaEquipoHeader, { color: coloresEquipo[i] }]}>
                {eq.nombre}
              </Text>
            </View>
          ))}
        </View>

        {/* Filas de categorías */}
        {CATEGORIAS.map((cat) => (
          <View key={cat.id} style={styles.tablaFila}>
            <View style={styles.tablaCategCol}>
              <Text style={styles.categLabel}>{cat.label}</Text>
              <Text style={styles.categDesc}>{cat.desc}</Text>
            </View>
            {equipos.map((eq, i) => (
              <View key={i} style={[styles.tablaEquipoCol, styles.tablaCell]}>
                {/* Valor actual */}
                <Text style={[styles.cellValor, { color: coloresEquipo[i] }]}>
                  {subcats[i][cat.id]}
                </Text>
                {/* Botones + y - */}
                <View style={styles.cellBtns}>
                  <TouchableOpacity
                    style={[styles.cellBtn, { borderColor: coloresBorde[i] }]}
                    onPress={() => sumar(i, cat.id, -1)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.cellBtnText, { color: coloresEquipo[i] }]}>−</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.cellBtn, styles.cellBtnPlus, { backgroundColor: `${coloresEquipo[i]}20`, borderColor: coloresBorde[i] }]}
                    onPress={() => sumar(i, cat.id, 1)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.cellBtnText, { color: coloresEquipo[i] }]}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ))}
      </View>

      {/* Desglose de puntos */}
      <View style={[styles.desglose, { paddingBottom: insets.bottom + 12 }]}>
        <Text style={styles.desgloseTitulo}>Desglose</Text>
        <View style={styles.desgloseRow}>
          {equipos.map((eq, i) => (
            <View key={i} style={[styles.desgloseEquipo, { borderColor: coloresBorde[i] }]}>
              <Text style={[styles.desgloseNombre, { color: coloresEquipo[i] }]}>{eq.nombre}</Text>
              {CATEGORIAS.map(cat => subcats[i][cat.id] > 0 && (
                <Text key={cat.id} style={styles.desgloseItem}>
                  {cat.label}: {subcats[i][cat.id]}
                </Text>
              ))}
              <Text style={[styles.desgloseTotal, { color: coloresEquipo[i] }]}>
                Total: {totales[i]}
              </Text>
            </View>
          ))}
        </View>
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
              {totales.map((t, i) => `${equipos[i].nombre}: ${t} pts`).join('  vs  ')}
            </Text>
            <View style={styles.ganadorBtns}>
              <TouchableOpacity
                style={styles.revanchaBtn}
                onPress={() => { setModalGanador(false); setSubcats(initSubcat()); setHistorial([]); }}
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

  // Totales rápidos
  totalesRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
    paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(184,150,46,0.08)',
  },
  totalesSep: { width: 1, height: 40, backgroundColor: 'rgba(184,150,46,0.12)' },
  totalChip: { alignItems: 'center' },
  totalNum: { fontFamily: fonts.serif, fontSize: fontSize.scoreLarge, fontWeight: '700', lineHeight: 56 },
  totalLabel: { fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny, color: colors.marfilTenue, letterSpacing: 1.5, textTransform: 'uppercase' },

  // Tabla
  tabla: { flex: 1, paddingHorizontal: spacing.md },

  tablaHeader: {
    flexDirection: 'row', paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: 'rgba(184,150,46,0.1)',
  },
  tablaCategCol: { flex: 1.5 },
  tablaEquipoCol: { flex: 1, alignItems: 'center' },
  tablaHeaderText: { fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny, color: 'rgba(184,150,46,0.4)', letterSpacing: 2, textTransform: 'uppercase' },
  tablaEquipoHeader: { fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny, letterSpacing: 1.5, textTransform: 'uppercase' },

  tablaFila: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  tablaCell: { gap: 4 },
  categLabel: { fontFamily: fonts.sansSemibold, fontSize: fontSize.body, color: colors.marfil },
  categDesc: { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: colors.marfilTenue },

  cellValor: { fontFamily: fonts.serif, fontSize: fontSize.scoreMedium, fontWeight: '700', lineHeight: 32 },
  cellBtns: { flexDirection: 'row', gap: 4 },
  cellBtn: {
    width: 26, height: 26, borderRadius: radius.sm,
    borderWidth: 1, backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  cellBtnPlus: {},
  cellBtnText: { fontSize: 14, fontWeight: '700', lineHeight: 20 },

  // Desglose
  desglose: {
    paddingHorizontal: spacing.md, paddingTop: spacing.sm,
    borderTopWidth: 1, borderTopColor: 'rgba(184,150,46,0.1)',
  },
  desgloseTitulo: {
    fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny,
    color: 'rgba(184,150,46,0.5)', letterSpacing: 2.5,
    textTransform: 'uppercase', marginBottom: spacing.sm,
  },
  desgloseRow: { flexDirection: 'row', gap: spacing.sm },
  desgloseEquipo: {
    flex: 1, padding: spacing.sm, borderRadius: radius.sm,
    backgroundColor: 'rgba(0,0,0,0.2)', borderWidth: 1, gap: 2,
  },
  desgloseNombre: { fontFamily: fonts.sansBold, fontSize: fontSize.bodySmall, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  desgloseItem: { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: colors.marfilSuave },
  desgloseTotal: { fontFamily: fonts.serif, fontSize: fontSize.body, fontWeight: '700', marginTop: 2 },

  // Modal
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
