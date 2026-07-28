import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet, Alert,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import AppBackground from '../components/common/AppBackground';
import ScreenHeader from '../components/common/ScreenHeader';
import { guardarPartida } from '../utils/storage';
import { colors } from '../theme/colors';
import { fonts, spacing, radius } from '../theme/typography';

const PLAYER_COLORS = [
  colors.rojo, colors.azul, '#5BA66B', colors.oro,
  '#A77AB8', '#D4844A', '#68A9A0', '#B96B72',
];

export default function MarcadorChinchon({ route, navigation }) {
  const { juego, equipos, limite, ajustes } = route.params;
  const [scores, setScores] = useState(equipos.map(() => 0));
  const [inputs, setInputs] = useState(equipos.map(() => ''));
  const [eliminated, setEliminated] = useState(equipos.map(() => false));
  const [rounds, setRounds] = useState([]);

  const confirmRound = () => {
    const values = inputs.map((value, index) =>
      eliminated[index] ? 0 : Number.parseInt(value, 10) || 0
    );
    if (values.every(value => value === 0) && inputs.every(value => value === '')) return;

    const nextScores = scores.map((score, index) => Math.max(0, score + values[index]));
    const nextEliminated = nextScores.map(score => score >= limite);
    const active = nextEliminated
      .map((isOut, index) => ({ isOut, index }))
      .filter(item => !item.isOut);

    setScores(nextScores);
    setEliminated(nextEliminated);
    setInputs(equipos.map(() => ''));
    setRounds(current => [...current, { values, previousScores: scores, previousEliminated: eliminated }]);
    if (ajustes?.vibracion) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (active.length <= 1 && nextEliminated.some(Boolean)) {
      const winner = active[0]?.index ?? nextScores.indexOf(Math.min(...nextScores));
      if (ajustes?.guardarHistorial) {
        guardarPartida({
          juego: juego.id,
          equipos: equipos.map(team => team.nombre),
          puntajes: nextScores,
          ganador: winner,
          limite,
          movimientos: [],
        });
      }
      setTimeout(() => Alert.alert(
        `¡Ganó ${equipos[winner].nombre}!`,
        `Terminó con ${nextScores[winner]} puntos.`,
        [
          { text: 'Revancha', onPress: reset },
          { text: 'Volver al inicio', onPress: () => navigation.navigate('Inicio') },
        ]
      ), 250);
    }
  };

  const chinchon = index => {
    const next = [...scores];
    next[index] = Math.max(0, next[index] - 10);
    setRounds(current => [...current, {
      values: equipos.map((_, i) => i === index ? -10 : 0),
      previousScores: scores,
      previousEliminated: eliminated,
    }]);
    setScores(next);
    if (ajustes?.vibracion) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const undo = () => {
    const last = rounds[rounds.length - 1];
    if (!last) return;
    setScores(last.previousScores);
    setEliminated(last.previousEliminated);
    setRounds(current => current.slice(0, -1));
  };

  const reset = () => {
    setScores(equipos.map(() => 0));
    setInputs(equipos.map(() => ''));
    setEliminated(equipos.map(() => false));
    setRounds([]);
  };

  return (
    <AppBackground>
      <ScreenHeader
        title="Chinchón"
        subtitle={`Mano ${rounds.length + 1} · límite ${limite}`}
        onBack={() => navigation.goBack()}
        rightLabel="↶"
        onRight={undo}
        large
      />
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, styles.playerCell]}>Jugador</Text>
        <Text style={styles.headerCell}>Total</Text>
        <Text style={[styles.headerCell, styles.handCell]}>Puntos de esta mano</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {equipos.map((team, index) => {
          const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
          const out = eliminated[index];
          return (
            <View key={`${team.nombre}-${index}`} style={[styles.playerRow, out && styles.outRow]}>
              <View style={[styles.playerCell, styles.playerInfo]}>
                <View style={[styles.badge, { borderColor: color }]}>
                  <Text style={[styles.badgeText, { color }]}>{index + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.playerName, out && styles.outText]} numberOfLines={1}>{team.nombre}</Text>
                  <TouchableOpacity onPress={() => chinchon(index)} disabled={out}>
                    <Text style={[styles.chinchon, { color }]}>Chinchón −10</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={[styles.total, { color }, out && styles.outText]}>{scores[index]}</Text>
              <View style={styles.handCell}>
                {out ? (
                  <Text style={styles.eliminated}>FUERA</Text>
                ) : (
                  <TextInput
                    style={styles.input}
                    value={inputs[index]}
                    onChangeText={value => {
                      const next = [...inputs];
                      next[index] = value.replace(/[^0-9-]/g, '');
                      setInputs(next);
                    }}
                    placeholder="0"
                    placeholderTextColor={colors.marfilSuave}
                    keyboardType="numbers-and-punctuation"
                    textAlign="center"
                  />
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirm} onPress={confirmRound}>
          <Text style={styles.confirmText}>Confirmar mano</Text>
        </TouchableOpacity>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: colors.bordeDoradoMedio,
  },
  headerCell: {
    width: 58,
    fontFamily: fonts.sansBold,
    fontSize: 8,
    color: colors.oro,
    letterSpacing: 1,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  playerCell: { flex: 1 },
  handCell: { width: 118 },
  content: { padding: 18, paddingBottom: 100, gap: 8 },
  playerRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeDorado,
    backgroundColor: 'rgba(2,10,7,0.46)',
  },
  outRow: { opacity: 0.45 },
  playerInfo: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  badge: { width: 33, height: 33, borderRadius: 17, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  badgeText: { fontFamily: fonts.serif, fontSize: 17 },
  playerName: { fontFamily: fonts.serif, fontSize: 19, color: colors.marfil },
  chinchon: { fontFamily: fonts.sansMedium, fontSize: 8, marginTop: 2 },
  total: { width: 58, fontFamily: fonts.serif, fontSize: 28, textAlign: 'center' },
  input: {
    width: 94,
    height: 44,
    alignSelf: 'center',
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    backgroundColor: colors.marfil,
    fontFamily: fonts.serif,
    fontSize: 23,
    color: colors.tinta,
  },
  eliminated: { fontFamily: fonts.sansBold, fontSize: 9, color: colors.rojo, textAlign: 'center' },
  outText: { textDecorationLine: 'line-through' },
  footer: { position: 'absolute', left: 18, right: 18, bottom: 18 },
  confirm: {
    height: 58,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeDoradoFuerte,
    backgroundColor: 'rgba(92,23,18,0.95)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: { fontFamily: fonts.serif, fontSize: 24, color: colors.marfil },
});
