import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBackground from '../components/common/AppBackground';
import ScreenHeader from '../components/common/ScreenHeader';
import BottomNav from '../components/common/BottomNav';
import { colors } from '../theme/colors';
import { fonts, spacing, radius } from '../theme/typography';

const RULES = [
  {
    id: 'truco',
    name: 'Truco argentino',
    icon: '🂡',
    sections: [
      ['Objetivo', 'Ser el primer equipo en alcanzar 15 o 30 puntos.'],
      ['Puntajes', 'Truco vale 2; Retruco 3; Vale Cuatro 4. Sin cantar, la mano vale 1.'],
      ['Envido', 'Envido vale 2; Real Envido 3; Falta Envido depende del tanteador.'],
      ['Flor', 'La Flor se juega solamente cuando la mesa acordó incluirla.'],
      ['Señas', 'Las señas forman parte del juego por equipos y deben acordarse antes de empezar.'],
    ],
  },
  {
    id: 'chinchon',
    name: 'Chinchón',
    icon: '♛',
    sections: [['Objetivo', 'Cerrar combinaciones y terminar con la menor cantidad de puntos.']],
  },
  {
    id: 'escoba',
    name: 'Escoba del 15',
    icon: '♣',
    sections: [['Objetivo', 'Sumar cartas hasta quince y obtener puntos por cartas, oros, sietes y escobas.']],
  },
  {
    id: 'generala',
    name: 'Generala',
    icon: '⚄',
    sections: [['Objetivo', 'Completar las categorías de dados y conseguir el mayor total.']],
  },
];

export default function ReglasScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState('');
  const [openGame, setOpenGame] = useState('truco');
  const [openSection, setOpenSection] = useState('Objetivo');
  const filtered = useMemo(
    () => RULES.filter(item => item.name.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <AppBackground>
      <ScreenHeader title="Reglas" subtitle="Referencia rápida" large />
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>⌕</Text>
        <TextInput
          style={styles.search}
          value={search}
          onChangeText={setSearch}
          placeholder="Buscar juego o regla"
          placeholderTextColor={colors.marfilSuave}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 90 }]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.map(game => {
          const open = openGame === game.id;
          return (
            <View key={game.id} style={styles.gameCard}>
              <TouchableOpacity
                style={styles.gameHeader}
                onPress={() => setOpenGame(open ? null : game.id)}
              >
                <Text style={styles.gameIcon}>{game.icon}</Text>
                <Text style={styles.gameName}>{game.name}</Text>
                <Text style={styles.chevron}>{open ? '⌃' : '⌄'}</Text>
              </TouchableOpacity>
              {open && game.sections.map(([title, body]) => {
                const sectionOpen = openSection === title;
                return (
                  <TouchableOpacity
                    key={title}
                    style={styles.rule}
                    onPress={() => setOpenSection(sectionOpen ? null : title)}
                  >
                    <View style={styles.ruleTitleRow}>
                      <Text style={styles.ruleBullet}>◆</Text>
                      <Text style={styles.ruleTitle}>{title}</Text>
                      <Text style={styles.ruleArrow}>{sectionOpen ? '−' : '+'}</Text>
                    </View>
                    {sectionOpen && <Text style={styles.ruleBody}>{body}</Text>}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
      </ScrollView>
      <BottomNav navigation={navigation} active="Reglas" />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  searchWrap: {
    height: 44,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    backgroundColor: 'rgba(2,10,7,0.45)',
  },
  searchIcon: { color: colors.oro, fontSize: 18 },
  search: { flex: 1, fontFamily: fonts.sans, color: colors.marfil, fontSize: 13 },
  content: { padding: 20, gap: 9 },
  gameCard: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    backgroundColor: 'rgba(2,10,7,0.46)',
    overflow: 'hidden',
  },
  gameHeader: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
    gap: 10,
  },
  gameIcon: { fontSize: 24, color: colors.oro },
  gameName: { flex: 1, fontFamily: fonts.serif, fontSize: 21, color: colors.marfil },
  chevron: { color: colors.oro, fontSize: 18 },
  rule: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopWidth: 1,
    borderTopColor: colors.bordeDorado,
  },
  ruleTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ruleBullet: { color: colors.oro, fontSize: 8 },
  ruleTitle: { flex: 1, fontFamily: fonts.serif, fontSize: 17, color: colors.oroBrillo },
  ruleArrow: { fontFamily: fonts.sans, fontSize: 16, color: colors.oro },
  ruleBody: { marginTop: 6, marginLeft: 16, fontFamily: fonts.sans, fontSize: 12, lineHeight: 18, color: colors.marfilMedio },
});
