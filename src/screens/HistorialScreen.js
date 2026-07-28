import React, { useCallback, useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import AppBackground from '../components/common/AppBackground';
import ScreenHeader from '../components/common/ScreenHeader';
import BottomNav from '../components/common/BottomNav';
import { getHistorial } from '../utils/storage';
import { JUEGOS } from '../data/juegos';
import { colors } from '../theme/colors';
import { fonts, spacing, radius } from '../theme/typography';

export default function HistorialScreen({ navigation }) {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('todos');

  useFocusEffect(useCallback(() => {
    getHistorial().then(setHistory);
  }, []));

  const visible = useMemo(
    () => filter === 'todos'
      ? history
      : history.filter(item => filter === 'truco' ? item.juego?.startsWith('truco') : !item.juego?.startsWith('truco')),
    [history, filter]
  );
  const won = history.filter(item => item.ganador === 0).length;
  const rate = history.length ? Math.round((won / history.length) * 100) : 0;

  const dateLabel = iso => {
    try { return format(new Date(iso), 'dd/MM/yyyy · HH:mm', { locale: es }); }
    catch { return '—'; }
  };

  return (
    <AppBackground>
      <ScreenHeader title="Historial" subtitle="Tus partidas" large />
      <FlatList
        data={visible}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={(
          <>
            <View style={styles.stats}>
              <Stat value={history.length} label="Partidas" />
              <Stat value={won} label="Ganadas" highlight />
              <Stat value={history.length - won} label="Perdidas" />
              <View style={styles.rate}>
                <Text style={styles.rateValue}>{rate}%</Text>
                <Text style={styles.rateLabel}>Victorias</Text>
              </View>
            </View>
            <View style={styles.filters}>
              <Filter label="Todos" selected={filter === 'todos'} onPress={() => setFilter('todos')} />
              <Filter label="Truco" selected={filter === 'truco'} onPress={() => setFilter('truco')} />
              <Filter label="Otros" selected={filter === 'otros'} onPress={() => setFilter('otros')} />
            </View>
          </>
        )}
        renderItem={({ item }) => {
          const game = JUEGOS[item.juego];
          const winner = item.equipos?.[item.ganador] || '—';
          return (
            <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('Detalle', { partida: item })}>
              <View style={[styles.gameMark, { borderColor: game?.colorAcento || colors.oro }]}>
                <Text style={styles.gameMarkText}>{game?.nombre?.[0] || 'J'}</Text>
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.gameName}>{game?.nombre || item.juego}</Text>
                <Text style={styles.teams}>{item.equipos?.join(' vs ')}</Text>
                <Text style={styles.date}>{dateLabel(item.fecha)}</Text>
              </View>
              <View style={styles.result}>
                <Text style={styles.resultScore}>{item.puntajes?.join(' – ')}</Text>
                <Text style={styles.winner}>{winner} ★</Text>
              </View>
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={(
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>◷</Text>
            <Text style={styles.emptyTitle}>Todavía no hay partidas</Text>
            <Text style={styles.emptyText}>Cuando termines una partida aparecerá acá.</Text>
          </View>
        )}
      />
      <BottomNav navigation={navigation} active="Historial" />
    </AppBackground>
  );
}

function Stat({ value, label, highlight }) {
  return (
    <View style={styles.stat}>
      <Text style={[styles.statValue, highlight && { color: colors.oroBrillo }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function Filter({ label, selected, onPress }) {
  return (
    <TouchableOpacity style={[styles.filter, selected && styles.filterSelected]} onPress={onPress}>
      <Text style={[styles.filterText, selected && styles.filterTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 18, paddingBottom: 25, gap: 9 },
  stats: { flexDirection: 'row', gap: 7, marginBottom: 4 },
  stat: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeDorado,
    backgroundColor: 'rgba(2,10,7,0.44)',
  },
  statValue: { fontFamily: fonts.serif, fontSize: 28, color: colors.marfil },
  statLabel: { fontFamily: fonts.sansMedium, fontSize: 8, color: colors.marfilMedio },
  rate: {
    width: 65,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 33,
    borderWidth: 2,
    borderColor: colors.oro,
    backgroundColor: 'rgba(2,10,7,0.44)',
  },
  rateValue: { fontFamily: fonts.serif, fontSize: 19, color: colors.oroBrillo },
  rateLabel: { fontFamily: fonts.sans, fontSize: 7, color: colors.marfilMedio },
  filters: { flexDirection: 'row', gap: 7, marginBottom: 4 },
  filter: {
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.bordeDorado,
  },
  filterSelected: { backgroundColor: colors.oro },
  filterText: { fontFamily: fonts.sansMedium, fontSize: 10, color: colors.marfilMedio },
  filterTextSelected: { color: colors.tinta },
  item: {
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 11,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeDorado,
    backgroundColor: 'rgba(2,10,7,0.46)',
  },
  gameMark: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(214,175,91,0.08)',
  },
  gameMarkText: { fontFamily: fonts.serif, fontSize: 21, color: colors.oro },
  itemInfo: { flex: 1 },
  gameName: { fontFamily: fonts.serif, fontSize: 19, color: colors.marfil },
  teams: { fontFamily: fonts.sans, fontSize: 9, color: colors.marfilMedio },
  date: { fontFamily: fonts.sans, fontSize: 8, color: colors.marfilSuave, marginTop: 2 },
  result: { alignItems: 'flex-end' },
  resultScore: { fontFamily: fonts.serif, fontSize: 19, color: colors.oroBrillo },
  winner: { fontFamily: fonts.sansMedium, fontSize: 8, color: colors.oro },
  empty: { alignItems: 'center', paddingTop: 70, gap: 8 },
  emptyIcon: { fontSize: 44, color: colors.oro },
  emptyTitle: { fontFamily: fonts.serif, fontSize: 24, color: colors.marfil },
  emptyText: { fontFamily: fonts.sans, fontSize: 12, color: colors.marfilMedio },
});
