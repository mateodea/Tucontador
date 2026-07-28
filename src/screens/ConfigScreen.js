import React, { useMemo, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  ScrollView, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBackground from '../components/common/AppBackground';
import ScreenHeader from '../components/common/ScreenHeader';
import { GrupoFosforos } from '../components/fosforos/Fosforos';
import { getMarcadorPorJuego } from '../navigation/routes';
import { getAjustes } from '../utils/storage';
import { colors } from '../theme/colors';
import { fonts, spacing, radius } from '../theme/typography';

const DEFAULT_NAMES = ['Nosotros', 'Ellos', 'Equipo 3', 'Equipo 4'];

export default function ConfigScreen({ route, navigation }) {
  const { juego } = route.params;
  const insets = useSafeAreaInsets();
  const minPlayers = juego.equiposMin || 2;
  const maxPlayers = juego.equipos || 2;
  const supportsMultiple = maxPlayers > 2;
  const [cantidad, setCantidad] = useState(minPlayers);
  const [nombres, setNombres] = useState(DEFAULT_NAMES);
  const [limite, setLimite] = useState(juego.limitesDefault?.[0] ?? null);
  const [custom, setCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [modo, setModo] = useState(juego.modoConteo || 'numero');

  const jugadores = useMemo(
    () => Array.from({ length: cantidad }, (_, index) => ({
      nombre: nombres[index]?.trim() || `Jugador ${index + 1}`,
      idx: index,
    })),
    [cantidad, nombres]
  );

  const iniciar = async () => {
    const limiteReal = custom ? Number.parseInt(customValue, 10) : limite;
    if (custom && (!limiteReal || limiteReal < 1)) return;
    const ajustes = await getAjustes();
    navigation.navigate(getMarcadorPorJuego(juego.id), {
      juego,
      equipos: jugadores,
      limite: limiteReal,
      modoConteo: modo,
      ajustes,
    });
  };

  return (
    <AppBackground framed>
      <ScreenHeader
        title={`${juego.nombre}${juego.subtitulo ? ` · ${juego.subtitulo}` : ''}`}
        subtitle="Prepará la mesa"
        onBack={() => navigation.goBack()}
        large
      />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 100 }]}
        showsVerticalScrollIndicator={false}
      >
        {juego.id.startsWith('truco') && (
          <View style={styles.matchMark}>
            <GrupoFosforos cantidad={5} size={62} guia={false} />
          </View>
        )}

        {supportsMultiple && (
          <Section label="Jugadores">
            <View style={styles.segment}>
              {Array.from({ length: maxPlayers - minPlayers + 1 }, (_, i) => minPlayers + i).map(value => (
                <Choice key={value} selected={cantidad === value} label={`${value}`} onPress={() => setCantidad(value)} />
              ))}
            </View>
          </Section>
        )}

        <Section label={supportsMultiple ? 'Nombres' : 'Equipos'}>
          {jugadores.map((player, index) => (
            <View key={index} style={styles.inputRow}>
              <View style={[styles.dot, { backgroundColor: index % 2 === 0 ? colors.rojo : colors.azul }]} />
              <TextInput
                style={styles.input}
                value={nombres[index]}
                onChangeText={value => {
                  const next = [...nombres];
                  next[index] = value;
                  setNombres(next);
                }}
                maxLength={16}
                placeholder={`Jugador ${index + 1}`}
                placeholderTextColor={colors.marfilSuave}
              />
            </View>
          ))}
        </Section>

        {juego.limitesDefault && (
          <Section label="Puntaje límite">
            <View style={styles.segment}>
              {juego.limitesDefault.map(value => (
                <Choice
                  key={value}
                  selected={!custom && limite === value}
                  label={`${value}`}
                  onPress={() => { setLimite(value); setCustom(false); }}
                />
              ))}
              <Choice selected={custom} label="Otro" onPress={() => setCustom(true)} />
            </View>
            {custom && (
              <TextInput
                autoFocus
                style={[styles.input, styles.customInput]}
                value={customValue}
                onChangeText={setCustomValue}
                placeholder="Ingresá el puntaje"
                placeholderTextColor={colors.marfilSuave}
                keyboardType="number-pad"
              />
            )}
          </Section>
        )}

        {juego.modoConteo === 'ambos' && (
          <Section label="Modo de conteo">
            <View style={styles.segment}>
              <Choice selected={modo === 'fosforos'} label="Fósforos" onPress={() => setModo('fosforos')} />
              <Choice selected={modo === 'numero'} label="Número" onPress={() => setModo('numero')} />
            </View>
          </Section>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <TouchableOpacity style={styles.startButton} onPress={iniciar}>
          <Text style={styles.startText}>Empezar partida</Text>
          <Text style={styles.startSub}>
            {custom ? customValue || 'Definí el límite' : limite ? `Hasta ${limite} puntos` : `${cantidad} jugadores`}
          </Text>
        </TouchableOpacity>
      </View>
    </AppBackground>
  );
}

function Section({ label, children }) {
  return (
    <View>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.card}>{children}</View>
    </View>
  );
}

function Choice({ selected, label, onPress }) {
  return (
    <TouchableOpacity style={[styles.choice, selected && styles.choiceSelected]} onPress={onPress}>
      <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 22, gap: 15 },
  matchMark: { alignSelf: 'center', marginVertical: -5 },
  sectionLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    color: colors.oro,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  card: {
    padding: 12,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    backgroundColor: 'rgba(2,10,7,0.45)',
    gap: 9,
  },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  input: {
    flex: 1,
    height: 43,
    paddingHorizontal: 13,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.bordeDorado,
    backgroundColor: 'rgba(0,0,0,0.26)',
    fontFamily: fonts.serif,
    fontSize: 18,
    color: colors.marfil,
  },
  customInput: { marginTop: 4 },
  segment: { flexDirection: 'row', gap: 7 },
  choice: {
    flex: 1,
    minHeight: 42,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.bordeDorado,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  choiceSelected: {
    backgroundColor: colors.oroBrillo,
    borderColor: colors.oro,
  },
  choiceText: { fontFamily: fonts.serif, fontSize: 18, color: colors.marfilMedio },
  choiceTextSelected: { color: colors.tinta },
  footer: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 0,
    paddingTop: 8,
  },
  startButton: {
    minHeight: 62,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeDoradoFuerte,
    backgroundColor: '#123E25',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: { fontFamily: fonts.serif, fontSize: 24, color: colors.marfil },
  startSub: {
    fontFamily: fonts.sansMedium,
    fontSize: 9,
    color: colors.oro,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
});
