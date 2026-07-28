import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBackground from '../components/common/AppBackground';
import ScreenHeader from '../components/common/ScreenHeader';
import BottomNav from '../components/common/BottomNav';
import { GrupoFosforos } from '../components/fosforos/Fosforos';
import { JUEGOS } from '../data/juegos';
import { getAjustes } from '../utils/storage';
import { colors } from '../theme/colors';
import { fonts, spacing, radius } from '../theme/typography';

export default function PartidaRapidaScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [nombres, setNombres] = useState(['Nosotros', 'Ellos']);
  const [limite, setLimite] = useState(30);
  const [modo, setModo] = useState('fosforos');

  const empezar = async () => {
    const ajustes = await getAjustes();
    navigation.navigate('Marcador', {
      juego: JUEGOS.truco_argentino,
      equipos: nombres.map((nombre, idx) => ({ nombre: nombre.trim() || `Equipo ${idx + 1}`, idx })),
      limite,
      modoConteo: modo,
      ajustes,
    });
  };

  return (
    <AppBackground>
      <ScreenHeader title="Partida rápida" subtitle="Entrá directo a la mesa" large />
      <View style={[styles.content, { paddingBottom: insets.bottom + 78 }]}>
        <View style={styles.mark}>
          <GrupoFosforos cantidad={5} size={72} guia={false} />
        </View>

        <Text style={styles.label}>Equipos</Text>
        {nombres.map((nombre, index) => (
          <View key={index} style={[styles.nameRow, index === 0 ? styles.redBorder : styles.blueBorder]}>
            <View style={[styles.dot, { backgroundColor: index === 0 ? colors.rojo : colors.azul }]} />
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={value => {
                const next = [...nombres];
                next[index] = value;
                setNombres(next);
              }}
              maxLength={16}
            />
          </View>
        ))}

        <Text style={styles.label}>Límite de puntos</Text>
        <View style={styles.segment}>
          {[15, 30].map(value => (
            <Option key={value} selected={limite === value} label={`${value}`} onPress={() => setLimite(value)} />
          ))}
        </View>

        <Text style={styles.label}>Modo de juego</Text>
        <View style={styles.segment}>
          <Option selected={modo === 'fosforos'} label="Fósforos" onPress={() => setModo('fosforos')} />
          <Option selected={modo === 'numero'} label="Números" onPress={() => setModo('numero')} />
        </View>

        <TouchableOpacity style={styles.start} onPress={empezar}>
          <Text style={styles.startText}>Empezar ahora</Text>
          <Text style={styles.startArrow}>›</Text>
        </TouchableOpacity>
        <View style={styles.last}>
          <Text style={styles.lastIcon}>◷</Text>
          <Text style={styles.lastText}>Última configuración: Truco a 30</Text>
        </View>
      </View>
      <BottomNav navigation={navigation} active="PartidaRapida" />
    </AppBackground>
  );
}

function Option({ selected, label, onPress }) {
  return (
    <TouchableOpacity style={[styles.option, selected && styles.optionSelected]} onPress={onPress}>
      <Text style={[styles.optionText, selected && styles.optionTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: { flex: 1, paddingHorizontal: 22, gap: 10 },
  mark: { alignSelf: 'center', marginVertical: 2 },
  label: {
    fontFamily: fonts.sansBold,
    fontSize: 9,
    color: colors.oro,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 5,
  },
  nameRow: {
    height: 51,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 13,
    borderRadius: radius.md,
    borderWidth: 1,
    backgroundColor: 'rgba(2,10,7,0.45)',
  },
  redBorder: { borderColor: colors.rojoBorde },
  blueBorder: { borderColor: colors.azulBorde },
  dot: { width: 9, height: 9, borderRadius: 5 },
  input: { flex: 1, fontFamily: fonts.serif, fontSize: 23, color: colors.marfil },
  segment: { flexDirection: 'row', gap: 8 },
  option: {
    flex: 1,
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.bordeDorado,
    backgroundColor: 'rgba(2,10,7,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: { backgroundColor: colors.oroBrillo, borderColor: colors.oro },
  optionText: { fontFamily: fonts.serif, fontSize: 18, color: colors.marfilMedio },
  optionTextSelected: { color: colors.tinta },
  start: {
    height: 60,
    marginTop: 9,
    paddingHorizontal: 18,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeDoradoFuerte,
    backgroundColor: '#123E25',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: { fontFamily: fonts.serif, fontSize: 25, color: colors.marfil },
  startArrow: { position: 'absolute', right: 17, fontFamily: fonts.serif, fontSize: 30, color: colors.oro },
  last: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 8,
  },
  lastIcon: { color: colors.oro, fontSize: 16 },
  lastText: { fontFamily: fonts.sans, fontSize: 10, color: colors.marfilMedio },
});
