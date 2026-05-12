// ─── TUCONTADOR — Pantalla de inicio ────────────────────────────────────────
import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { JUEGOS_LISTA } from '../data/juegos';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';
import IconoJuego from '../components/common/IconoJuego';

export default function InicioScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.fondoProfundo} />
      <LinearGradient
        colors={['#243d28', '#1C2B1F', '#101a12']}
        style={StyleSheet.absoluteFill}
      />

      {/* Marco dorado */}
      <View style={styles.marcoOuter} pointerEvents="none" />
      <View style={styles.marcoInner} pointerEvents="none" />

      {/* TÍTULO FILETEADO */}
      <View style={[styles.headerWrap, { paddingTop: insets.top + 20 }]}>

        {/* Volutas decorativas — izq y der */}
        <View style={styles.volutaRow}>
          <View style={styles.lineaDorada} />
          <View style={styles.floroncito} />
          <View style={styles.lineaDorada} />
        </View>

        {/* Nombre de la app */}
        <View style={styles.tituloRow}>
          <Text style={styles.tituloNormal}>Tu</Text>
          <Text style={styles.tituloAccento}>contador</Text>
        </View>

        <View style={styles.volutaRow}>
          <View style={styles.lineaDorada} />
          <Text style={styles.volutaLabel}>Contador de cartas</Text>
          <View style={styles.lineaDorada} />
        </View>
      </View>

      {/* LISTA DE JUEGOS */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 70 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {JUEGOS_LISTA.map((juego) => (
          <TouchableOpacity
            key={juego.id}
            style={[styles.juegoRow, { borderLeftColor: juego.colorAcento }]}
            onPress={() => navigation.navigate('Config', { juego })}
            activeOpacity={0.75}
          >
            <View style={[styles.juegoIconWrap, {
              backgroundColor: juego.colorFondo,
              borderColor:     juego.colorBorde,
            }]}>
              <IconoJuego juegoId={juego.id} size={22} />
            </View>
            <View style={styles.juegoTexto}>
              <View style={styles.juegoNombreRow}>
                <Text style={styles.juegoNombre}>{juego.nombre}</Text>
                {juego.subtitulo && (
                  <View style={[styles.subtituloChip, { borderColor: juego.colorBorde }]}>
                    <Text style={[styles.subtituloText, { color: juego.colorAcento }]}>
                      {juego.subtitulo}
                    </Text>
                  </View>
                )}
              </View>
              <Text style={styles.juegoDesc}>{juego.descripcion}</Text>
            </View>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* BOTÓN AJUSTES */}
      <TouchableOpacity
        style={[styles.ajustesBtn, { bottom: insets.bottom + 16 }]}
        onPress={() => navigation.navigate('Ajustes')}
        activeOpacity={0.75}
      >
        <Text style={styles.ajustesIcon}>⚙</Text>
        <Text style={styles.ajustesText}>Ajustes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  marcoOuter: {
    position:    'absolute', top: 14, left: 14, right: 14, bottom: 14,
    borderWidth: 1, borderColor: colors.bordeDorado, borderRadius: 30,
    zIndex: 0,
  },
  marcoInner: {
    position:    'absolute', top: 18, left: 18, right: 18, bottom: 18,
    borderWidth: 0.8, borderColor: 'rgba(184,150,46,0.07)', borderRadius: 26,
    zIndex: 0,
  },

  // ── Header ──
  headerWrap: {
    alignItems:    'center',
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(184,150,46,0.12)',
    zIndex: 2,
  },
  volutaRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            spacing.sm,
    marginVertical: 4,
    width:          '100%',
  },
  lineaDorada: {
    flex:            1,
    height:          1,
    backgroundColor: 'rgba(184,150,46,0.25)',
  },
  floroncito: {
    width:           6,
    height:          6,
    borderRadius:    3,
    backgroundColor: colors.doradoAntiguo,
  },
  volutaLabel: {
    fontFamily:    fonts.sansMedium,
    fontSize:      9,
    color:         'rgba(184,150,46,0.5)',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },

  tituloRow: {
    flexDirection: 'row',
    alignItems:    'baseline',
    marginVertical: 4,
  },
  tituloNormal: {
    fontFamily: fonts.serif,
    fontSize:   38,
    color:      colors.marfil,
    lineHeight: 44,
  },
  tituloAccento: {
    fontFamily: fonts.serif,
    fontSize:   38,
    color:      colors.oro,
    fontStyle:  'italic',
    lineHeight: 44,
  },

  // ── Lista juegos ──
  scroll: {
    flex:   1,
    zIndex: 2,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop:        spacing.md,
    gap:               spacing.sm,
  },

  juegoRow: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            spacing.md,
    paddingVertical: 11,
    paddingHorizontal: 13,
    borderRadius:   radius.md,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth:    1,
    borderColor:    colors.bordeDorado,
    borderLeftWidth: 3,
  },

  juegoIconWrap: {
    width:         38,
    height:        38,
    borderRadius:  radius.sm,
    borderWidth:   1,
    alignItems:    'center',
    justifyContent:'center',
    flexShrink:    0,
  },

  juegoTexto: { flex: 1 },

  juegoNombreRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
  },
  juegoNombre: {
    fontFamily: fonts.serif,
    fontSize:   fontSize.body + 2,
    color:      colors.marfil,
    lineHeight: 20,
  },

  subtituloChip: {
    borderWidth:   1,
    borderRadius:  radius.full,
    paddingHorizontal: 6,
    paddingVertical:   1,
  },
  subtituloText: {
    fontFamily:    fonts.sansBold,
    fontSize:      fontSize.labelTiny,
    letterSpacing: 0.5,
  },

  juegoDesc: {
    fontFamily: fonts.sans,
    fontSize:   fontSize.labelTiny + 1,
    color:      colors.marfilSuave,
    marginTop:  2,
  },

  chevron: {
    fontSize: 18,
    color:    'rgba(184,150,46,0.4)',
  },

  // ── Ajustes ──
  ajustesBtn: {
    position:       'absolute',
    alignSelf:      'center',
    flexDirection:  'row',
    alignItems:     'center',
    gap:            6,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderWidth:    1,
    borderColor:    colors.bordeDorado,
    borderRadius:   radius.full,
    paddingVertical:   7,
    paddingHorizontal: 18,
    zIndex: 10,
  },
  ajustesIcon: {
    fontSize: 13,
    color:    'rgba(184,150,46,0.65)',
  },
  ajustesText: {
    fontFamily:    fonts.sansSemibold,
    fontSize:      fontSize.label,
    color:         'rgba(242,237,215,0.4)',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
});
