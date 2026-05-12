// ─── TUCONTADOR — Marcador Generala ─────────────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { JUEGOS } from '../data/juegos';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';

export default function MarcadorGenerala({ route, navigation }) {
  const { equipos, ajustes } = route.params;
  const insets  = useSafeAreaInsets();
  const juego   = JUEGOS.generala;

  // Estado de casillas: { equipoIdx: { casilla_id: valor | null } }
  const initCasillas = () => equipos.map(() =>
    Object.fromEntries(juego.casillas.map(c => [c.id, null]))
  );

  const [casillas, setCasillas]         = useState(initCasillas());
  const [modalCasilla, setModalCasilla] = useState(null); // { casId, equipoIdx }
  const [modalGanador, setModalGanador] = useState(false);
  const [ganadorIdx, setGanadorIdx]     = useState(null);

  // Calcular totales
  const totales = casillas.map(c =>
    Object.values(c).reduce((sum, v) => sum + (v || 0), 0)
  );

  // Verificar si todas las casillas están llenas
  const todasLlenas = casillas.every(c =>
    Object.values(c).every(v => v !== null)
  );

  const coloresEquipo = equipos.map((_, i) => i === 0 ? colors.rojo : colors.azul);
  const coloresBorde  = ['rgba(139,58,42,0.3)', 'rgba(42,80,128,0.3)'];

  // ── Registrar una casilla ─────────────────────────────────────────────────
  const registrarCasilla = (casId, equipoIdx, servida) => {
    if (ajustes?.vibracion) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const casConfig = juego.casillas.find(c => c.id === casId);
    if (!casConfig) return;

    const valor = servida ? casConfig.puntosServida : casConfig.puntos;

    setCasillas(prev => {
      const nuevas = prev.map((c, i) => i === equipoIdx
        ? { ...c, [casId]: (c[casId] || 0) + valor }
        : c
      );
      return nuevas;
    });

    setModalCasilla(null);

    // Verificar fin del juego
    if (todasLlenas) {
      const ganador = totales.indexOf(Math.max(...totales));
      setGanadorIdx(ganador);
      setTimeout(() => setModalGanador(true), 400);
    }
  };

  const getCasillaColor = (valor) => {
    if (valor === null) return colors.marfilTenue;
    if (valor >= 50) return colors.oro;     // Generala
    if (valor >= 40) return '#7AB87A';      // Póker
    return colors.marfil;
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#243d28', '#1C2B1F', '#101a12']} style={StyleSheet.absoluteFill}/>

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.hdrTexto}>
          <Text style={styles.hdrTitulo}>Generala</Text>
          <Text style={styles.hdrSub}>{equipos.map(e => e.nombre).join(' vs ')}</Text>
        </View>
        <View style={{ width: 30 }}/>
      </View>

      {/* Totales */}
      <View style={styles.totalesRow}>
        {equipos.map((eq, i) => (
          <React.Fragment key={i}>
            {i === 1 && <View style={styles.totalesSep}/>}
            <View style={styles.totalChip}>
              <Text style={[styles.totalNum, { color: coloresEquipo[i] }]}>{totales[i]}</Text>
              <Text style={styles.totalLabel}>{eq.nombre}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Tabla de casillas */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Encabezados */}
        <View style={styles.tablaHeader}>
          <View style={styles.casColHeader}>
            <Text style={styles.headerTxt}>Figura</Text>
          </View>
          {equipos.map((eq, i) => (
            <View key={i} style={styles.eqColHeader}>
              <Text style={[styles.headerTxt, { color: coloresEquipo[i] }]}>{eq.nombre}</Text>
            </View>
          ))}
        </View>

        {/* Filas */}
        {juego.casillas.map(cas => (
          <View key={cas.id} style={styles.tablaFila}>
            <View style={styles.casCol}>
              <Text style={styles.casNombre}>{cas.label}</Text>
              <Text style={styles.casPuntos}>
                {cas.puntos} pts{cas.puntosServida !== cas.puntos ? ` / ${cas.puntosServida} servida` : ''}
              </Text>
            </View>
            {equipos.map((eq, i) => {
              const valor = casillas[i][cas.id];
              const llena = valor !== null;
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.casCelda,
                    { borderColor: coloresBorde[i] },
                    llena && { backgroundColor: `${coloresEquipo[i]}15` },
                  ]}
                  onPress={() => {
                    if (!llena) setModalCasilla({ casId: cas.id, equipoIdx: i, cas });
                  }}
                  activeOpacity={llena ? 1 : 0.75}
                >
                  {llena ? (
                    <Text style={[styles.celValor, { color: getCasillaColor(valor) }]}>
                      {valor}
                    </Text>
                  ) : (
                    <Text style={styles.celVacio}>—</Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        {/* Total final */}
        <View style={[styles.tablaFila, styles.filaTotal]}>
          <View style={styles.casCol}>
            <Text style={styles.totalFinalLabel}>TOTAL</Text>
          </View>
          {equipos.map((eq, i) => (
            <View key={i} style={[styles.casCelda, { backgroundColor: `${coloresEquipo[i]}12`, borderColor: coloresBorde[i] }]}>
              <Text style={[styles.totalFinalNum, { color: coloresEquipo[i] }]}>{totales[i]}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal: elegir tipo de figura */}
      <Modal visible={!!modalCasilla} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle}/>
            <Text style={styles.modalTitulo}>
              {modalCasilla?.cas?.label} — {modalCasilla !== null ? equipos[modalCasilla.equipoIdx]?.nombre : ''}
            </Text>
            <Text style={styles.modalDesc}>¿Fue servida o de arriba?</Text>

            <TouchableOpacity
              style={styles.modalOpt}
              onPress={() => registrarCasilla(modalCasilla.casId, modalCasilla.equipoIdx, false)}
            >
              <Text style={styles.modalOptLabel}>De arriba</Text>
              <Text style={styles.modalOptPts}>+{modalCasilla?.cas?.puntos} pts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modalOpt, styles.modalOptDestacado]}
              onPress={() => registrarCasilla(modalCasilla.casId, modalCasilla.equipoIdx, true)}
            >
              <Text style={[styles.modalOptLabel, { color: colors.oro }]}>Servida</Text>
              <Text style={[styles.modalOptPts, { color: colors.oro }]}>+{modalCasilla?.cas?.puntosServida} pts</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancelar}
              onPress={() => setModalCasilla(null)}
            >
              <Text style={styles.modalCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal ganador */}
      <Modal visible={modalGanador} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.ganadorCard}>
            <Text style={styles.ganadorEstrella}>★</Text>
            <Text style={styles.ganadorLabel}>¡Ganadores!</Text>
            <Text style={styles.ganadorNombre}>{ganadorIdx !== null ? equipos[ganadorIdx]?.nombre : '—'}</Text>
            <Text style={styles.ganadorDetalle}>
              {totales.map((t, i) => `${equipos[i].nombre}: ${t} pts`).join('  vs  ')}
            </Text>
            <View style={styles.ganadorBtns}>
              <TouchableOpacity style={styles.revanchaBtn} onPress={() => { setModalGanador(false); setCasillas(initCasillas()); }}>
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
  hdrTitulo: { fontFamily: fonts.serif, fontSize: fontSize.body + 2, color: colors.marfil, textAlign: 'center' },
  hdrSub: { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: 'rgba(184,150,46,0.5)', textAlign: 'center', letterSpacing: 1, textTransform: 'uppercase', marginTop: 1 },

  totalesRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: 'rgba(184,150,46,0.08)' },
  totalesSep: { width: 1, height: 40, backgroundColor: 'rgba(184,150,46,0.12)' },
  totalChip: { alignItems: 'center' },
  totalNum: { fontFamily: fonts.serif, fontSize: fontSize.scoreMedium + 8, fontWeight: '700', lineHeight: 44 },
  totalLabel: { fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny, color: colors.marfilTenue, letterSpacing: 1.5, textTransform: 'uppercase' },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.md, paddingTop: spacing.sm },

  tablaHeader: { flexDirection: 'row', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(184,150,46,0.1)', marginBottom: 4 },
  casColHeader: { flex: 1.5 },
  eqColHeader: { flex: 1, alignItems: 'center' },
  headerTxt: { fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny, color: 'rgba(184,150,46,0.4)', letterSpacing: 2, textTransform: 'uppercase' },

  tablaFila: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)', gap: spacing.sm },
  filaTotal: { borderTopWidth: 1, borderTopColor: 'rgba(184,150,46,0.15)', paddingTop: spacing.md, marginTop: spacing.sm },
  casCol: { flex: 1.5 },
  casNombre: { fontFamily: fonts.sansSemibold, fontSize: fontSize.body, color: colors.marfil },
  casPuntos: { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: colors.marfilTenue, marginTop: 1 },

  casCelda: { flex: 1, height: 44, borderRadius: radius.sm, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.2)' },
  celValor: { fontFamily: fonts.serif, fontSize: fontSize.body + 4, fontWeight: '700' },
  celVacio: { fontFamily: fonts.sans, fontSize: fontSize.body, color: 'rgba(255,255,255,0.2)' },
  totalFinalLabel: { fontFamily: fonts.sansBold, fontSize: fontSize.body, color: colors.oro, letterSpacing: 2, textTransform: 'uppercase' },
  totalFinalNum: { fontFamily: fonts.serif, fontSize: fontSize.scoreSmall, fontWeight: '700' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end', padding: spacing.md },
  modalSheet: { backgroundColor: '#162018', borderRadius: radius.xl, padding: spacing.lg, borderWidth: 1, borderColor: colors.bordeDorado },
  modalHandle: { width: 36, height: 4, backgroundColor: 'rgba(184,150,46,0.3)', borderRadius: 2, alignSelf: 'center', marginBottom: spacing.md },
  modalTitulo: { fontFamily: fonts.serif, fontSize: fontSize.sectionTitle, color: colors.marfil, textAlign: 'center', marginBottom: 4 },
  modalDesc: { fontFamily: fonts.sans, fontSize: fontSize.bodySmall, color: colors.marfilTenue, textAlign: 'center', marginBottom: spacing.md },
  modalOpt: { paddingVertical: 12, borderRadius: radius.md, marginBottom: spacing.sm, backgroundColor: 'rgba(0,0,0,0.25)', borderWidth: 1, borderColor: colors.bordeDorado, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: spacing.md, alignItems: 'center' },
  modalOptDestacado: { backgroundColor: 'rgba(184,150,46,0.12)', borderColor: colors.bordeDoradoMedio },
  modalOptLabel: { fontFamily: fonts.sansSemibold, fontSize: fontSize.body, color: colors.marfil },
  modalOptPts: { fontFamily: fonts.serif, fontSize: fontSize.body + 2, color: colors.marfilSuave, fontWeight: '700' },
  modalCancelar: { paddingVertical: 10, alignItems: 'center' },
  modalCancelarText: { fontFamily: fonts.sansMedium, fontSize: fontSize.bodySmall, color: colors.marfilTenue },

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
