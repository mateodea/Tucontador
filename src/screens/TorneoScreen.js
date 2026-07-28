import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBackground from '../components/common/AppBackground';
import ScreenHeader from '../components/common/ScreenHeader';
import BottomNav from '../components/common/BottomNav';
import { JUEGOS } from '../data/juegos';
import { getAjustes } from '../utils/storage';
import { colors } from '../theme/colors';
import { fonts, spacing, radius } from '../theme/typography';

const QUARTERS = [
  ['Los Ases', 30, 'Los Primos', 18],
  ['La Banda', 30, 'Los Paisas', 22],
  ['Los Amigos', 21, 'El Rejunte', 15],
  ['Nosotros', 30, 'Los Indios', 12],
];

export default function TorneoScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const jugarFinal = async () => {
    const ajustes = await getAjustes();
    navigation.navigate('Marcador', {
      juego: JUEGOS.truco_argentino,
      equipos: [{ nombre: 'Los Ases', idx: 0 }, { nombre: 'La Banda', idx: 1 }],
      limite: 30,
      modoConteo: 'fosforos',
      ajustes,
    });
  };

  return (
    <AppBackground navy>
      <ScreenHeader title="Torneo" subtitle="Copa de amigos" large />
      <View style={styles.stages}>
        <Text style={[styles.stage, styles.stageActive]}>Cuartos</Text>
        <Text style={styles.stage}>Semifinal</Text>
        <Text style={styles.stage}>Final</Text>
      </View>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 96 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bracket}>
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Cuartos</Text>
            {QUARTERS.map((match, index) => (
              <Match key={index} teamA={match[0]} scoreA={match[1]} teamB={match[2]} scoreB={match[3]} />
            ))}
          </View>
          <View style={styles.column}>
            <Text style={styles.columnTitle}>Semifinal</Text>
            <View style={styles.semiOffset} />
            <Match teamA="Los Ases" scoreA={30} teamB="La Banda" scoreB={26} />
            <View style={styles.semiGap} />
            <Match teamA="Los Amigos" scoreA={21} teamB="Nosotros" scoreB={27} />
          </View>
        </View>

        <View style={styles.finalCard}>
          <Text style={styles.finalLabel}>LA FINAL</Text>
          <View style={styles.finalTeams}>
            <Text style={styles.finalTeam}>Los Ases</Text>
            <Text style={styles.vs}>vs</Text>
            <Text style={styles.finalTeam}>La Banda</Text>
          </View>
          <TouchableOpacity style={styles.play} onPress={jugarFinal}>
            <Text style={styles.playText}>Jugar final</Text>
            <Text style={styles.playArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <BottomNav navigation={navigation} active="Torneo" />
    </AppBackground>
  );
}

function Match({ teamA, scoreA, teamB, scoreB }) {
  return (
    <View style={styles.match}>
      <View style={styles.matchRow}>
        <Text style={styles.team} numberOfLines={1}>{teamA}</Text>
        <Text style={styles.matchScore}>{scoreA}</Text>
      </View>
      <View style={styles.matchDivider} />
      <View style={styles.matchRow}>
        <Text style={styles.team} numberOfLines={1}>{teamB}</Text>
        <Text style={styles.matchScore}>{scoreB}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stages: {
    flexDirection: 'row',
    marginHorizontal: 20,
    borderWidth: 1,
    borderColor: colors.bordeDorado,
    borderRadius: radius.sm,
    overflow: 'hidden',
  },
  stage: {
    flex: 1,
    paddingVertical: 8,
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.marfilMedio,
    textAlign: 'center',
  },
  stageActive: { backgroundColor: colors.oro, color: colors.tinta },
  content: { padding: 20, gap: 18 },
  bracket: { flexDirection: 'row', gap: 12 },
  column: { flex: 1, gap: 9 },
  columnTitle: {
    fontFamily: fonts.sansBold,
    color: colors.oro,
    fontSize: 9,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  match: {
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    backgroundColor: 'rgba(2,10,7,0.48)',
    overflow: 'hidden',
  },
  matchRow: { height: 31, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8 },
  team: { flex: 1, fontFamily: fonts.sansMedium, fontSize: 10, color: colors.marfil },
  matchScore: { fontFamily: fonts.serif, fontSize: 16, color: colors.oro },
  matchDivider: { height: 1, backgroundColor: colors.bordeDorado },
  semiOffset: { height: 39 },
  semiGap: { height: 50 },
  finalCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.bordeDoradoFuerte,
    backgroundColor: 'rgba(4,31,19,0.78)',
    padding: spacing.lg,
    alignItems: 'center',
    gap: 10,
  },
  finalLabel: { fontFamily: fonts.sansBold, fontSize: 9, color: colors.oro, letterSpacing: 2.5 },
  finalTeams: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  finalTeam: { fontFamily: fonts.serif, fontSize: 20, color: colors.marfil },
  vs: { fontFamily: fonts.serifItalic, color: colors.oro },
  play: {
    width: '100%',
    height: 54,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeDoradoFuerte,
    backgroundColor: '#123E25',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playText: { fontFamily: fonts.serif, fontSize: 23, color: colors.marfil },
  playArrow: { position: 'absolute', right: 15, color: colors.oro, fontSize: 28 },
});
