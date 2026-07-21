// ─── TUCONTADOR — Pantalla del marcador (corazón de la app) ─────────────────
import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView,
  StyleSheet, Alert, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useKeepAwake } from 'expo-keep-awake';
import { usePartida } from '../hooks/usePartida';
import Fosforos from '../components/fosforos/Fosforos';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';

export default function MarcadorScreen({ route, navigation }) {
  useKeepAwake(); // Pantalla siempre encendida durante la partida

  const { juego, equipos, limite, modoConteo, ajustes } = route.params;
  const insets = useSafeAreaInsets();

  const [modoActual, setModoActual] = useState(modoConteo || 'fosforos');
  const [modalEnvido, setModalEnvido]     = useState(false);
  const [equipoEnvido, setEquipoEnvido]   = useState(null);
  const [modalDeshacer, setModalDeshacer] = useState(false);

  const {
    puntajes, movimientos, terminada, ganador,
    ultimoMovimiento, progreso,
    sumarPuntos, deshacer, reiniciar,
  } = usePartida({ juego, equipos, limite, modoConteo, ajustes });

  // ── Navegar al ganador cuando termina ────────────────────────────────────
  React.useEffect(() => {
    if (terminada && ganador !== null) {
      setTimeout(() => {
        navigation.navigate('Ganador', {
          juego, equipos, puntajes, ganador, limite, movimientos,
        });
      }, 600);
    }
  }, [terminada, ganador]);

  // ── Manejar botones ───────────────────────────────────────────────────────
  const handleBoton = useCallback((equipoIdx, boton) => {
    if (boton.tipo === 'especial' && boton.accion === 'envido') {
      setEquipoEnvido(equipoIdx);
      setModalEnvido(true);
      return;
    }
    if (boton.valor !== 0) {
      sumarPuntos(equipoIdx, boton.valor, boton.label);
    }
  }, [sumarPuntos]);

  const handleReiniciar = () => {
    Alert.alert(
      '¿Reiniciar la partida?',
      'Se borrarán todos los puntos actuales.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reiniciar', style: 'destructive', onPress: reiniciar },
      ]
    );
  };

  const handleDeshacer = () => {
    if (!ultimoMovimiento) return;
    setModalDeshacer(true);
  };

  // ── Render panel de un equipo ─────────────────────────────────────────────
  const renderPanel = (equipoIdx) => {
    const esRojo   = equipoIdx === 0;
    const equipo   = equipos[equipoIdx];
    const puntaje  = puntajes[equipoIdx];
    const colorEq  = esRojo ? 'rojo' : 'azul';
    const colorNum = esRojo ? colors.rojo : colors.azul;
    const progEq   = progreso[equipoIdx];

    return (
      <View key={equipoIdx} style={[
        styles.panel,
        esRojo ? styles.panelRojo : styles.panelAzul,
      ]}>
        {/* Nombre equipo */}
        <View style={styles.panelHeader}>
          <View style={[styles.equipoDot, { backgroundColor: esRojo ? colors.rojoProfundo : colors.azulOscuro }]} />
          <Text style={[styles.equipoNombre, { color: esRojo ? '#C06050' : '#5090C0' }]}>
            {equipo.nombre}
          </Text>
        </View>

        {/* Puntaje — fósforos o número */}
        {modoActual === 'fosforos' ? (
          <View style={styles.fosforosContainer}>
            <Fosforos puntos={puntaje} colorEquipo={colorEq} size={44} />
          </View>
        ) : null}

        {/* Número total siempre visible */}
        <View style={styles.totalRow}>
          <Text style={[styles.totalNum, { color: colorNum }]}>{puntaje}</Text>
          {limite && <Text style={styles.totalDe}>/{limite}</Text>}
        </View>

        {/* Barra de progreso */}
        {limite && (
          <View style={styles.barraTrack}>
            <View style={[
              styles.barraFill,
              { width: `${progEq * 100}%`, backgroundColor: colorNum },
            ]} />
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#243d28', '#1C2B1F', '#101a12']}
        style={StyleSheet.absoluteFill}
      />

      {/* HEADER */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.hdrBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.hdrBtnText}>←</Text>
        </TouchableOpacity>

        <View style={styles.hdrTituloWrap}>
          <Text style={styles.hdrTitulo}>{juego.nombre}
            {juego.subtitulo ? ` · ${juego.subtitulo}` : ''}
          </Text>
          <Text style={styles.hdrSub}>
            {equipos.map(e => e.nombre).join(' vs ')}
            {limite ? ` · hasta ${limite} pts` : ''}
          </Text>
        </View>

        <TouchableOpacity style={styles.hdrBtn} onPress={handleReiniciar}>
          <Text style={styles.hdrBtnText}>↺</Text>
        </TouchableOpacity>
      </View>

      {/* SELECTOR MODO si aplica */}
      {juego.modoConteo === 'ambos' && (
        <View style={styles.modoWrap}>
          {['fosforos', 'numero'].map(modo => (
            <TouchableOpacity
              key={modo}
              style={[styles.modoBtn, modoActual === modo && styles.modoBtnSel]}
              onPress={() => setModoActual(modo)}
            >
              <Text style={[styles.modoBtnText, modoActual === modo && styles.modoBtnTextSel]}>
                {modo === 'fosforos' ? 'Fósforos' : 'Número'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* TABLERO */}
      <View style={styles.tablero}>
        {renderPanel(0)}
        <View style={styles.separador} />
        {renderPanel(1)}
      </View>

      {/* BOTONES DE PUNTOS */}
      <View style={[styles.botonesWrap, { paddingBottom: insets.bottom + 8 }]}>
        <View style={styles.botonesGrid}>
          {juego.botones
            .filter(b => b.tipo !== 'restar')
            .map((boton, i) => (
              <View key={i} style={styles.botonFila}>
                <TouchableOpacity
                  style={[styles.btnPunto, styles.btnRojo]}
                  onPress={() => handleBoton(0, boton)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.btnPuntoText, { color: colors.rojo }]}>{boton.label}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnPunto, styles.btnAzul]}
                  onPress={() => handleBoton(1, boton)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.btnPuntoText, { color: colors.azul }]}>{boton.label}</Text>
                </TouchableOpacity>
              </View>
            ))}
        </View>

        {/* Botón deshacer */}
        {ultimoMovimiento && (
          <TouchableOpacity style={styles.btnDeshacer} onPress={handleDeshacer}>
            <Text style={styles.btnDeshacerText}>
              ↩ Deshacer: {equipos[ultimoMovimiento.equipo]?.nombre} {ultimoMovimiento.descripcion}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* MODAL ENVIDO */}
      <Modal visible={modalEnvido} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              ¿Cuántos puntos de Envido?
            </Text>
            {juego.envido?.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={styles.envidoOpt}
                onPress={() => {
                  if (opt.tipo === 'falta' && equipoEnvido !== null) {
                    // Falta envido = lo que le falta al rival para ganar
                    const rivalIdx = equipoEnvido === 0 ? 1 : 0;
                    const valorFalta = limite - puntajes[rivalIdx];
                    sumarPuntos(equipoEnvido, valorFalta, 'Falta Envido');
                  } else if (opt.valor > 0 && equipoEnvido !== null) {
                    sumarPuntos(equipoEnvido, opt.valor, opt.label);
                  }
                  setModalEnvido(false);
                }}
                activeOpacity={0.75}
              >
                <Text style={styles.envidoOptText}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.envidoCancelar} onPress={() => setModalEnvido(false)}>
              <Text style={styles.envidoCancelarText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL DESHACER */}
      <Modal visible={modalDeshacer} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.dialogWrap}>
            <Text style={styles.dialogTitle}>¿Deshacer el último punto?</Text>
            {ultimoMovimiento && (
              <Text style={styles.dialogSub}>
                Se borrará: {equipos[ultimoMovimiento.equipo]?.nombre} · {ultimoMovimiento.descripcion}
              </Text>
            )}
            <View style={styles.dialogBtnRow}>
              <TouchableOpacity
                style={styles.dialogBtnCancel}
                onPress={() => setModalDeshacer(false)}
              >
                <Text style={styles.dialogBtnCancelText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.dialogBtnConfirm}
                onPress={() => { deshacer(); setModalDeshacer(false); }}
              >
                <Text style={styles.dialogBtnConfirmText}>Sí, deshacer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // ─── Contenedor ──────────────────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: colors.fondoAzul,
  },

  // ─── Header ──────────────────────────────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.bordeDorado,
    backgroundColor: 'rgba(13,21,32,0.95)',
  },
  hdrBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.fondoCard,
    borderWidth: 1,
    borderColor: colors.bordeSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hdrBtnText: {
    fontSize: 18,
    color: colors.marfil,
  },
  hdrTituloWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  hdrTitulo: {
    fontFamily: fonts.serif,
    fontSize: fontSize.screenTitle,
    color: colors.oro,
    textAlign: 'center',
    lineHeight: 22,
  },
  hdrSub: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: colors.marfilTenue,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  hdrActions: {
    flexDirection: 'row',
    gap: 6,
  },
  hdrActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.fondoCard,
    borderWidth: 1,
    borderColor: colors.bordeSuave,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hdrActionText: {
    fontSize: 15,
    color: colors.marfilMedio,
  },

  // ─── Toggle modo ────────────────────────────────────────────────────────
  modoWrap: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: spacing.xs,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: radius.full,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.bordeSuave,
  },
  modoBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.full,
  },
  modoBtnSel: {
    backgroundColor: colors.fondoAzul,
    borderWidth: 1,
    borderColor: colors.bordeDorado,
  },
  modoBtnText: {
    fontFamily: fonts.sansSemibold,
    fontSize: fontSize.label,
    color: colors.marfilTenue,
  },
  modoBtnTextSel: { color: colors.oro },

  // ─── Tablero ─────────────────────────────────────────────────────────────
  tablero: { flexDirection: 'row', flex: 1 },
  separador: { width: 1, backgroundColor: colors.bordeDorado },

  panel: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.sm,
    paddingTop: spacing.md,
  },
  panelRojo: { backgroundColor: '#130708' },
  panelAzul: { backgroundColor: '#07090f' },

  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: spacing.sm,
  },
  equipoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  equipoNombre: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.body,
    color: colors.marfil,
    flexShrink: 1,
  },
  fosforosContainer: {
    flex: 1,
    width: '100%',
    paddingHorizontal: spacing.xs,
  },

  // Número total
  totalRow: {
    alignItems: 'center',
    marginVertical: spacing.xs,
  },
  totalNum: {
    fontFamily: fonts.serif,
    fontSize: fontSize.scoreHuge,
    lineHeight: fontSize.scoreHuge * 1.05,
  },
  totalDe: {
    fontFamily: fonts.sans,
    fontSize: fontSize.bodySmall,
    color: colors.marfilTenue,
    marginTop: 2,
  },

  // Barra de progreso
  barraTrack: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 2,
    width: '80%',
    marginBottom: spacing.sm,
    overflow: 'hidden',
  },
  barraFill: { height: '100%', borderRadius: 2 },

  // ─── Botones ─────────────────────────────────────────────────────────────
  botonesWrap: {
    borderTopWidth: 1,
    borderTopColor: colors.bordeDorado,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
  },
  botonesGrid: { gap: 6 },
  botonFila:   { flexDirection: 'row', gap: 6 },
  btnPunto: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  btnRojo:  { backgroundColor: colors.rojoBtn, borderColor: colors.rojoBorde },
  btnAzul:  { backgroundColor: colors.azulBtn, borderColor: colors.azulBorde },
  btnPuntoText: {
    fontFamily: fonts.sansSemibold,
    fontSize: fontSize.buttonMedium,
    letterSpacing: 0.3,
  },

  // Deshacer
  btnDeshacer: {
    paddingVertical: spacing.sm,
    marginHorizontal: spacing.md,
    marginBottom: spacing.xs,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    backgroundColor: 'rgba(184,150,46,0.06)',
  },
  btnDeshacerText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.bodySmall,
    color: colors.marfilMedio,
    letterSpacing: 0.2,
  },

  // Ajustes button
  ajustesText: {
    fontFamily: fonts.sans,
    fontSize: 10,
    color: 'rgba(242,237,215,0.4)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },

  // ─── Modales ─────────────────────────────────────────────────────────────
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: spacing.md,
  },
  modalSheet: {
    backgroundColor: '#141820',
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    borderRadius: radius.xl,
    padding: spacing.lg,
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.bordeMedio,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontFamily: fonts.serif,
    fontSize: fontSize.sectionTitle,
    color: colors.marfil,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  envidoOpt: {
    paddingVertical: 12,
    borderRadius: radius.md,
    marginBottom: 6,
    backgroundColor: 'rgba(139,58,42,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(139,58,42,0.3)',
  },
  envidoOptText: {
    fontFamily: fonts.sansSemibold,
    fontSize: fontSize.body,
    color: colors.rojo,
    textAlign: 'center',
  },
  envidoCancelar: { marginTop: 4, padding: 10, alignItems: 'center' },
  envidoCancelarText: {
    fontFamily: fonts.sans,
    fontSize: fontSize.bodySmall,
    color: colors.marfilTenue,
  },

  dialogWrap: {
    backgroundColor: '#141820',
    margin: spacing.xl,
    borderRadius: radius.xl,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    alignSelf: 'center',
    width: '88%',
  },
  dialogTitle: {
    fontFamily: fonts.serif,
    fontSize: fontSize.screenTitle,
    color: colors.oro,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  dialogSub: {
    fontFamily: fonts.sans,
    fontSize: fontSize.body,
    color: colors.marfilMedio,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  dialogBtnRow: { flexDirection: 'row', gap: 8 },
  dialogBtnCancel: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeSuave,
    alignItems: 'center',
  },
  dialogBtnCancelText: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.body,
    color: colors.marfilMedio,
  },
  dialogBtnConfirm: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: 'rgba(192,104,88,0.2)',
    borderWidth: 1,
    borderColor: colors.rojoBorde,
    alignItems: 'center',
  },
  dialogBtnConfirmText: {
    fontFamily: fonts.sansSemibold,
    fontSize: fontSize.body,
    color: colors.rojo,
  },

  btnNueva: {
    borderRadius: radius.md,
    paddingVertical: 11,
    alignItems: 'center',
    backgroundColor: 'rgba(184,150,46,0.1)',
    borderWidth: 1,
    borderColor: colors.bordeDorado,
  },
  btnNuevaText: {
    fontFamily: fonts.sansSemibold,
    fontSize: fontSize.body,
    color: colors.oro,
  },
  btnMenu: {
    borderRadius: radius.md,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderWidth: 1,
    borderColor: colors.bordeSuave,
  },
  btnMenuText: {
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.body,
    color: colors.marfilTenue,
  },
});
