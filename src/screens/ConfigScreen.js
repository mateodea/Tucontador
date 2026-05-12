// ─── TUCONTADOR — Pantalla de configuración ─────────────────────────────────
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';
import { getMarcadorPorJuego } from '../navigation/AppNavigator';

export default function ConfigScreen({ route, navigation }) {
  const { juego } = route.params;
  const insets    = useSafeAreaInsets();

  const [nombreEquipo1, setNombreEquipo1] = useState('Nosotros');
  const [nombreEquipo2, setNombreEquipo2] = useState('Ellos');
  const [limite, setLimite]               = useState(
    juego.limitesDefault ? juego.limitesDefault[0] : null
  );
  const [limiteCustom, setLimiteCustom]   = useState('');
  const [modoConteo, setModoConteo]       = useState(juego.modoConteo || 'fosforos');

  const limites = juego.limitesDefault || [];

  const iniciarPartida = () => {
    const limiteReal = limiteCustom ? parseInt(limiteCustom) : limite;
    const pantallaMarcador = getMarcadorPorJuego(juego.id);
    navigation.navigate(pantallaMarcador, {
      juego,
      equipos: [
        { nombre: nombreEquipo1 || 'Nosotros', idx: 0 },
        { nombre: nombreEquipo2 || 'Ellos',    idx: 1 },
      ],
      limite:     limiteReal,
      modoConteo: modoConteo,
      ajustes:    {}, // se pasa desde contexto global en producción
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#243d28', '#1C2B1F', '#101a12']}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{juego.nombre}{juego.subtitulo ? ` · ${juego.subtitulo}` : ''}</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Equipos */}
        <Text style={styles.secLabel}>Equipos</Text>
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <View style={[styles.dot, { backgroundColor: colors.rojoProfundo }]} />
            <TextInput
              style={styles.input}
              value={nombreEquipo1}
              onChangeText={setNombreEquipo1}
              placeholder="Nosotros"
              placeholderTextColor={colors.marfilTenue}
              maxLength={15}
            />
          </View>
          <View style={[styles.inputRow, { marginBottom: 0 }]}>
            <View style={[styles.dot, { backgroundColor: colors.azulOscuro }]} />
            <TextInput
              style={styles.input}
              value={nombreEquipo2}
              onChangeText={setNombreEquipo2}
              placeholder="Ellos"
              placeholderTextColor={colors.marfilTenue}
              maxLength={15}
            />
          </View>
        </View>

        {/* Puntaje límite */}
        {limites.length > 0 && (
          <>
            <Text style={styles.secLabel}>Puntaje límite</Text>
            <View style={styles.card}>
              <View style={styles.limitesGrid}>
                {limites.map(l => (
                  <TouchableOpacity
                    key={l}
                    style={[styles.limiteOpt, limite === l && limiteCustom === '' && styles.limiteOptSel]}
                    onPress={() => { setLimite(l); setLimiteCustom(''); }}
                  >
                    <Text style={[styles.limiteOptText, limite === l && limiteCustom === '' && styles.limiteOptTextSel]}>
                      {l} pts
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.limiteOpt, limiteCustom !== '' && styles.limiteOptSel]}
                  onPress={() => {}}
                >
                  <Text style={[styles.limiteOptText, limiteCustom !== '' && styles.limiteOptTextSel]}>
                    Otro…
                  </Text>
                </TouchableOpacity>
              </View>
              {limiteCustom !== '' && (
                <TextInput
                  style={[styles.input, { marginTop: 10 }]}
                  value={limiteCustom}
                  onChangeText={setLimiteCustom}
                  placeholder="Ingresar puntos"
                  placeholderTextColor={colors.marfilTenue}
                  keyboardType="number-pad"
                />
              )}
            </View>
          </>
        )}

        {/* Modo conteo */}
        {juego.modoConteo === 'ambos' && (
          <>
            <Text style={styles.secLabel}>Modo de conteo</Text>
            <View style={styles.card}>
              <View style={styles.modoGrid}>
                {[
                  { id: 'fosforos', label: 'Fósforos', desc: 'Visual y tradicional' },
                  { id: 'numero',   label: 'Número',   desc: 'Rápido y simple' },
                ].map(m => (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.modoOpt, modoConteo === m.id && styles.modoOptSel]}
                    onPress={() => setModoConteo(m.id)}
                  >
                    <Text style={[styles.modoOptLabel, modoConteo === m.id && styles.modoOptLabelSel]}>
                      {m.label}
                    </Text>
                    <Text style={styles.modoOptDesc}>{m.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {/* Botón iniciar */}
      <View style={[styles.footerBtn, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.iniciarBtn} onPress={iniciarPartida} activeOpacity={0.8}>
          <LinearGradient
            colors={['#8B3A2A', '#6B2A1A']}
            style={StyleSheet.absoluteFill}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          />
          <Text style={styles.iniciarText}>¡Empezar Partida!</Text>
          <Text style={styles.iniciarSub}>
            {juego.nombre}{juego.subtitulo ? ` · ${juego.subtitulo}` : ''}
            {(limiteCustom || limite) ? ` · hasta ${limiteCustom || limite} pts` : ''}
          </Text>
        </TouchableOpacity>
      </View>
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
  backText:    { fontSize: 14, color: 'rgba(184,150,46,0.7)' },
  headerTitle: { flex: 1, fontFamily: fonts.serif, fontSize: fontSize.screenTitle, color: colors.marfil, textAlign: 'center' },

  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: spacing.md },

  secLabel: {
    fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny,
    color: 'rgba(184,150,46,0.55)', letterSpacing: 2.5,
    textTransform: 'uppercase', marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1, borderColor: colors.bordeDorado,
    borderRadius: radius.md, padding: spacing.md,
  },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm,
  },
  dot: { width: 9, height: 9, borderRadius: 4.5, flexShrink: 0 },
  input: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth: 1, borderColor: 'rgba(184,150,46,0.15)',
    borderRadius: radius.sm, padding: spacing.sm,
    fontFamily: fonts.sansMedium, fontSize: fontSize.body,
    color: colors.marfil,
  },

  limitesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  limiteOpt: {
    flex: 1, minWidth: 70,
    paddingVertical: 7, borderRadius: radius.sm,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
  },
  limiteOptSel: {
    backgroundColor: 'rgba(184,150,46,0.13)',
    borderColor: colors.bordeDoradoMedio,
  },
  limiteOptText:    { fontFamily: fonts.sansSemibold, fontSize: fontSize.bodySmall, color: colors.marfilSuave },
  limiteOptTextSel: { color: colors.oro },

  modoGrid:    { flexDirection: 'row', gap: 8 },
  modoOpt: {
    flex: 1, padding: spacing.sm, borderRadius: radius.md,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1, borderColor: colors.bordeSuave,
    alignItems: 'center', gap: 2,
  },
  modoOptSel:      { backgroundColor: 'rgba(184,150,46,0.12)', borderColor: colors.bordeDoradoMedio },
  modoOptLabel:    { fontFamily: fonts.sansBold, fontSize: fontSize.body, color: colors.marfilSuave },
  modoOptLabelSel: { color: colors.oro },
  modoOptDesc:     { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: colors.marfilTenue, textAlign: 'center' },

  footerBtn: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  iniciarBtn: {
    borderRadius: radius.md, paddingVertical: 14,
    alignItems: 'center', overflow: 'hidden',
    borderWidth: 1, borderColor: 'rgba(139,58,42,0.5)',
  },
  iniciarText: { fontFamily: fonts.serif, fontSize: fontSize.screenTitle, color: colors.marfil, letterSpacing: 0.5 },
  iniciarSub:  { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: 'rgba(242,237,215,0.4)', letterSpacing: 1.5, textTransform: 'uppercase', marginTop: 2 },
});
