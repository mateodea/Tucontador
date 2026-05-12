// ─── TUCONTADOR — Historial de partidas ─────────────────────────────────────
import React, { useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { getHistorial } from '../utils/storage';
import { JUEGOS } from '../data/juegos';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';

export default function HistorialScreen({ navigation }) {
  const insets   = useSafeAreaInsets();
  const [historial, setHistorial] = useState([]);
  const [stats, setStats]         = useState({ total: 0, ganadas: 0, perdidas: 0 });

  useFocusEffect(
    useCallback(() => {
      getHistorial().then(data => {
        setHistorial(data);
        // Stats básicas (cuenta "Nosotros" como equipo 0)
        const ganadas  = data.filter(p => p.ganador === 0).length;
        setStats({ total: data.length, ganadas, perdidas: data.length - ganadas });
      });
    }, [])
  );

  const formatFecha = (iso) => {
    try {
      return format(new Date(iso), "d 'de' MMM, HH:mm", { locale: es });
    } catch {
      return '—';
    }
  };

  const renderItem = ({ item }) => {
    const juego      = JUEGOS[item.juego];
    const colorAcento = juego?.colorAcento || colors.doradoAntiguo;
    const eqGanador  = item.equipos?.[item.ganador] || '—';
    const pGanador   = item.puntajes?.[item.ganador] ?? '—';
    const pPerdedor  = item.puntajes?.[item.ganador === 0 ? 1 : 0] ?? '—';

    return (
      <TouchableOpacity
        style={[styles.item, { borderLeftColor: colorAcento }]}
        onPress={() => navigation.navigate('Detalle', { partida: item })}
        activeOpacity={0.75}
      >
        <View style={[styles.itemIconWrap, {
          backgroundColor: `${colorAcento}18`,
          borderColor:     `${colorAcento}30`,
        }]}>
          <View style={[styles.itemIconDot, { backgroundColor: colorAcento }]} />
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemJuego}>{juego?.nombre || item.juego}</Text>
          <Text style={styles.itemEquipos}>
            {item.equipos?.join(' vs ') || '—'}
          </Text>
          <Text style={styles.itemFecha}>{formatFecha(item.fecha)}</Text>
        </View>
        <View style={styles.itemResult}>
          <Text style={[styles.itemScore, item.ganador === 0 ? styles.scoreWin : styles.scoreLose]}>
            {pGanador}–{pPerdedor}
          </Text>
          <Text style={[styles.itemWinner, { color: colorAcento }]}>
            {eqGanador} ★
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const ListHeader = () => (
    <View>
      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statChip}>
          <Text style={styles.statNum}>{stats.total}</Text>
          <Text style={styles.statLabel}>Partidas</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={[styles.statNum, { color: colors.rojo }]}>{stats.ganadas}</Text>
          <Text style={styles.statLabel}>Ganadas</Text>
        </View>
        <View style={styles.statChip}>
          <Text style={[styles.statNum, { color: colors.azul }]}>{stats.perdidas}</Text>
          <Text style={styles.statLabel}>Perdidas</Text>
        </View>
      </View>
    </View>
  );

  const ListEmpty = () => (
    <View style={styles.empty}>
      <Text style={styles.emptyIcon}>🃏</Text>
      <Text style={styles.emptyTitle}>Sin partidas todavía</Text>
      <Text style={styles.emptyDesc}>
        Las partidas que juegues aparecerán acá
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#243d28', '#1C2B1F', '#101a12']}
        style={StyleSheet.absoluteFill}
      />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Historial</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        data={historial}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 20 },
        ]}
        showsVerticalScrollIndicator={false}
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
  backText:    { fontSize: 14, color: 'rgba(184,150,46,0.7)' },
  headerTitle: { flex: 1, fontFamily: fonts.serif, fontSize: fontSize.screenTitle, color: colors.marfil, textAlign: 'center' },

  listContent: { padding: spacing.lg, gap: spacing.sm },

  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  statChip: {
    flex: 1, alignItems: 'center', padding: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1, borderColor: colors.bordeDorado,
    borderRadius: radius.md,
  },
  statNum:   { fontFamily: fonts.serif, fontSize: fontSize.scoreSmall, color: colors.oro, lineHeight: 28 },
  statLabel: { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: colors.marfilTenue, letterSpacing: 0.5 },

  item: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.md, borderRadius: radius.md,
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1, borderColor: colors.bordeDorado,
    borderLeftWidth: 3, marginBottom: spacing.sm,
  },
  itemIconWrap: {
    width: 36, height: 36, borderRadius: radius.sm,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  itemIconDot: { width: 12, height: 12, borderRadius: 6 },
  itemInfo:    { flex: 1 },
  itemJuego:   { fontFamily: fonts.serif, fontSize: fontSize.body + 1, color: colors.marfil, lineHeight: 18 },
  itemEquipos: { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: colors.marfilSuave, marginTop: 1 },
  itemFecha:   { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: colors.marfilTenue, marginTop: 1 },
  itemResult:  { alignItems: 'flex-end' },
  itemScore:   { fontFamily: fonts.serif, fontSize: fontSize.body + 2, fontWeight: '700' },
  scoreWin:    { color: colors.oro },
  scoreLose:   { color: colors.marfilTenue },
  itemWinner:  { fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny, marginTop: 1 },

  empty: {
    alignItems: 'center', paddingTop: 60, gap: spacing.sm,
  },
  emptyIcon:  { fontSize: 48, marginBottom: spacing.sm },
  emptyTitle: { fontFamily: fonts.serifItalic, fontSize: fontSize.sectionTitle, color: 'rgba(242,237,215,0.4)' },
  emptyDesc:  { fontFamily: fonts.sans, fontSize: fontSize.bodySmall, color: colors.marfilTenue, textAlign: 'center' },
});
