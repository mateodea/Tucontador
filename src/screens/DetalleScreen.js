// ─── TUCONTADOR — Detalle de una partida ────────────────────────────────────
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { JUEGOS } from '../data/juegos';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';

export default function DetalleScreen({ route, navigation }) {
  const { partida } = route.params;
  const insets      = useSafeAreaInsets();
  const juego       = JUEGOS[partida.juego];

  const ganadorNombre = partida.equipos?.[partida.ganador] || '—';

  const formatFecha = (iso) => {
    try { return format(new Date(iso), "d 'de' MMMM yyyy 'a las' HH:mm", { locale: es }); }
    catch { return '—'; }
  };

  const renderMovimiento = ({ item, index }) => {
    const esRojo = item.equipo === 0;
    const color  = esRojo ? colors.rojo : colors.azul;

    return (
      <View style={styles.movRow}>
        <Text style={styles.movNum}>{index + 1}</Text>
        <Text style={[styles.movEquipo, { color }]}>
          {partida.equipos?.[item.equipo] || '—'}
        </Text>
        <Text style={styles.movDesc}>{item.descripcion || '—'}</Text>
        <Text style={[styles.movValor, { color }]}>
          {item.valor > 0 ? `+${item.valor}` : item.valor}
        </Text>
        <Text style={styles.movTotal}>→ {item.totalTras}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[colors.panoClaro, colors.fondoPrincipal, colors.fondoProfundo]}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View style={styles.hdrTexto}>
          <Text style={styles.headerTitle}>{juego?.nombre || partida.juego}</Text>
          <Text style={styles.headerSub}>{formatFecha(partida.fecha)}</Text>
        </View>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={partida.movimientos || []}
        keyExtractor={item => item.id?.toString() || Math.random().toString()}
        renderItem={renderMovimiento}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 20 }]}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>

            {/* Resultado */}
            <View style={styles.resultadoCard}>
              <Text style={styles.ganadorLabel}>Ganadores</Text>
              <Text style={styles.ganadorNombre}>{ganadorNombre}</Text>
              <View style={styles.scoresList}>
                {(partida.equipos || []).map((equipo, index) => {
                  const esGanador = index === partida.ganador;
                  return (
                    <View key={`${equipo}-${index}`} style={styles.scoreItem}>
                      <View style={[
                        styles.position,
                        esGanador && styles.positionWinner,
                      ]}>
                        <Text style={[
                          styles.positionText,
                          esGanador && styles.positionWinnerText,
                        ]}>
                          {esGanador ? '★' : index + 1}
                        </Text>
                      </View>
                      <Text style={[styles.teamName, esGanador && styles.teamNameWinner]} numberOfLines={1}>
                        {equipo || `Jugador ${index + 1}`}
                      </Text>
                      <Text style={[styles.teamScore, esGanador && styles.teamScoreWinner]}>
                        {partida.puntajes?.[index] ?? 0}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Info */}
            <View style={styles.infoRow}>
              {partida.limite && (
                <View style={styles.infoChip}>
                  <Text style={styles.infoChipText}>Hasta {partida.limite} pts</Text>
                </View>
              )}
              {partida.duracion > 0 && (
                <View style={styles.infoChip}>
                  <Text style={styles.infoChipText}>
                    {Math.floor(partida.duracion / 60)} min
                  </Text>
                </View>
              )}
              <View style={styles.infoChip}>
                <Text style={styles.infoChipText}>{partida.movimientos?.length || 0} jugadas</Text>
              </View>
            </View>

            <Text style={styles.secLabel}>Movimientos</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <Text style={styles.sinMovimientos}>Sin movimientos registrados</Text>
        )}
      />
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
  backText:   { fontSize: 14, color: 'rgba(184,150,46,0.7)' },
  hdrTexto:   { flex: 1 },
  headerTitle: { fontFamily: fonts.serif, fontSize: fontSize.screenTitle, lineHeight: 29, color: colors.marfil, textAlign: 'center' },
  headerSub:  { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: 'rgba(184,150,46,0.45)', textAlign: 'center', marginTop: 1 },

  content: { padding: spacing.lg },

  listHeader: { gap: spacing.md, marginBottom: spacing.md },

  resultadoCard: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1, borderColor: colors.bordeDoradoMedio,
    borderRadius: radius.md, padding: spacing.md,
  },
  ganadorLabel: {
    fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny,
    color: 'rgba(184,150,46,0.5)', letterSpacing: 2.5,
    textTransform: 'uppercase', marginBottom: 2,
  },
  ganadorNombre: {
    fontFamily: fonts.serifItalic, fontSize: fontSize.gameTitle,
    color: colors.oro, lineHeight: 32,
  },
  scoresList: { marginTop: spacing.sm },
  scoreItem: {
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  position: {
    width: 23,
    height: 23,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  positionWinner: { backgroundColor: colors.oro },
  positionText: { fontFamily: fonts.sansBold, fontSize: 10, color: colors.marfilMedio },
  positionWinnerText: { color: colors.tinta },
  teamName: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: fontSize.label,
    color: colors.marfilSuave,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  teamNameWinner: { color: colors.marfil },
  teamScore: { fontFamily: fonts.serif, fontSize: 28, color: colors.marfilMedio },
  teamScoreWinner: { color: colors.oro },

  infoRow:    { flexDirection: 'row', gap: spacing.xs, flexWrap: 'wrap' },
  infoChip: {
    paddingVertical: 3, paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: 'rgba(184,150,46,0.1)',
    borderWidth: 1, borderColor: colors.bordeDorado,
  },
  infoChipText: { fontFamily: fonts.sansMedium, fontSize: fontSize.labelTiny, color: 'rgba(184,150,46,0.65)' },

  secLabel: {
    fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny,
    color: 'rgba(184,150,46,0.55)', letterSpacing: 2.5,
    textTransform: 'uppercase',
  },

  movRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: 7,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.04)',
  },
  movNum:    { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: 'rgba(255,255,255,0.2)', width: 16 },
  movEquipo: { fontFamily: fonts.sansSemibold, fontSize: fontSize.bodySmall, flex: 1 },
  movDesc:   { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: colors.marfilTenue, fontStyle: 'italic' },
  movValor:  { fontFamily: fonts.serif, fontSize: fontSize.body, fontWeight: '700' },
  movTotal:  { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: 'rgba(255,255,255,0.2)', width: 40, textAlign: 'right' },

  sinMovimientos: {
    fontFamily: fonts.serifItalic, fontSize: fontSize.body,
    color: colors.marfilTenue, textAlign: 'center', marginTop: spacing.xl,
  },
});
