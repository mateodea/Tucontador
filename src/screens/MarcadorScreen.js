// ─── TUCONTADOR — Marcador tradicional estilizado ───────────────────────────
import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Alert, useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import AppBackground from '../components/common/AppBackground';
import Ornamento from '../components/common/Ornamento';
import Fosforos from '../components/fosforos/Fosforos';
import { usePartida } from '../hooks/usePartida';
import { colors } from '../theme/colors';
import { fonts, spacing, radius } from '../theme/typography';

export default function MarcadorScreen({ route, navigation }) {
  const { juego, equipos, limite, modoConteo, ajustes } = route.params;
  const insets = useSafeAreaInsets();
  const { height } = useWindowDimensions();
  const [equipoSeleccionado, setEquipoSeleccionado] = useState(0);

  const {
    puntajes,
    movimientos,
    terminada,
    ganador,
    ultimoMovimiento,
    sumarPuntos,
    deshacer,
    reiniciar,
  } = usePartida({ juego, equipos, limite, modoConteo, ajustes });

  const matchSize = useMemo(
    () => Math.max(29, Math.min(42, Math.floor((height - 430) / 6))),
    [height]
  );
  const usarFosforos = modoConteo !== 'numero' && (!limite || limite <= 30);

  useEffect(() => {
    const tag = 'tucontador-partida';
    if (ajustes?.pantallaEncendida !== false) {
      activateKeepAwakeAsync(tag).catch(() => {});
    }
    return () => {
      deactivateKeepAwake(tag).catch(() => {});
    };
  }, [ajustes?.pantallaEncendida]);

  useEffect(() => {
    if (terminada && ganador !== null) {
      const timer = setTimeout(() => {
        navigation.replace('Ganador', {
          juego,
          equipos,
          puntajes,
          ganador,
          limite,
          movimientos,
          ajustes,
          modoConteo,
        });
      }, 380);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [terminada, ganador, juego, equipos, puntajes, limite, movimientos, ajustes, modoConteo, navigation]);

  const ajustar = (equipoIdx, valor) => {
    const ejecutar = () => {
      setEquipoSeleccionado(equipoIdx);
      sumarPuntos(equipoIdx, valor, valor > 0 ? '+1 toque' : '−1 corrección');
    };
    if (valor > 0 && ajustes?.confirmarPuntos) {
      Alert.alert(
        `¿Sumar un punto a ${equipos[equipoIdx]?.nombre}?`,
        'Confirmá para registrar el movimiento.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Sumar +1', onPress: ejecutar },
        ]
      );
      return;
    }
    ejecutar();
  };

  const tocarEquipo = (equipoIdx) => ajustar(equipoIdx, 1);

  const confirmarSalida = () => {
    Alert.alert(
      '¿Salir de la partida?',
      'La partida actual todavía no terminó.',
      [
        { text: 'Seguir jugando', style: 'cancel' },
        { text: 'Salir', style: 'destructive', onPress: () => navigation.navigate('Inicio') },
      ]
    );
  };

  const confirmarReinicio = () => {
    Alert.alert(
      '¿Reiniciar la partida?',
      'Los puntos volverán a cero.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Reiniciar', style: 'destructive', onPress: reiniciar },
      ]
    );
  };

  return (
    <AppBackground framed>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.circle} onPress={confirmarSalida}>
          <Text style={styles.circleText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.brand}>Tucontador</Text>
          <Text style={styles.title}>
            {juego.id.startsWith('truco') ? 'Truco' : juego.nombre}
            {limite ? ` · a ${limite}` : ''}
          </Text>
          <Ornamento width={145} compact />
        </View>
        <TouchableOpacity style={styles.circle} onPress={confirmarReinicio}>
          <Text style={styles.restart}>↻</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.board}>
        {equipos.slice(0, 2).map((equipo, index) => {
          const red = index === 0;
          const selected = equipoSeleccionado === index;
          return (
            <TouchableOpacity
              key={`${equipo.nombre}-${index}`}
              style={[
                styles.team,
                index === 0 && styles.teamDivider,
                selected && (red ? styles.selectedRed : styles.selectedBlue),
              ]}
              onPress={() => tocarEquipo(index)}
              activeOpacity={0.9}
            >
              <View style={[styles.teamHeader, red ? styles.redHeader : styles.blueHeader]}>
                <Text style={styles.teamName} numberOfLines={1}>{equipo.nombre}</Text>
                <Text style={styles.score}>{puntajes[index]}</Text>
              </View>

              <View style={styles.matches}>
                {usarFosforos ? (
                  <Fosforos puntos={puntajes[index]} size={matchSize} />
                ) : (
                  <View style={styles.numericMode}>
                    <Text style={styles.numericScore}>{puntajes[index]}</Text>
                    <Text style={styles.numericHint}>
                      Conteo numérico{limite ? ` · de ${limite}` : ''}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.tapHint}>
                <Text style={[styles.tapPlus, { color: red ? colors.rojo : colors.azul }]}>+1</Text>
                <Text style={styles.tapText}>Tocá este lado</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[styles.controls, { paddingBottom: Math.max(insets.bottom, 8) + 4 }]}>
        <View style={styles.selectedRow}>
          <View style={[
            styles.selectedDot,
            { backgroundColor: equipoSeleccionado === 0 ? colors.rojo : colors.azul },
          ]} />
          <Text style={styles.selectedText}>
            Equipo seleccionado: <Text style={styles.selectedName}>{equipos[equipoSeleccionado]?.nombre}</Text>
          </Text>
          <TouchableOpacity
            style={[
              styles.undo,
              (!ultimoMovimiento || ajustes?.permitirDeshacer === false) && styles.disabled,
            ]}
            onPress={deshacer}
            disabled={!ultimoMovimiento || ajustes?.permitirDeshacer === false}
          >
            <Text style={styles.undoText}>↶</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.adjustRow}>
          <TouchableOpacity
            style={[styles.adjustButton, styles.minusButton]}
            onPress={() => ajustar(equipoSeleccionado, -1)}
          >
            <Text style={styles.adjustText}>−1</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.adjustButton, styles.plusButton]}
            onPress={() => ajustar(equipoSeleccionado, 1)}
          >
            <Text style={styles.adjustText}>+1</Text>
          </TouchableOpacity>
        </View>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 7,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  brand: {
    fontFamily: fonts.serifItalic,
    fontSize: 14,
    color: colors.oro,
    letterSpacing: 0.7,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 36,
    lineHeight: 39,
    color: colors.oroBrillo,
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    backgroundColor: 'rgba(2,10,7,0.46)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontFamily: fonts.serifRegular,
    fontSize: 34,
    lineHeight: 34,
    color: colors.oro,
  },
  restart: {
    fontSize: 22,
    color: colors.oro,
  },
  board: {
    flex: 1,
    flexDirection: 'row',
    marginHorizontal: 18,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: 'rgba(4,26,15,0.58)',
  },
  team: {
    flex: 1,
    alignItems: 'center',
  },
  teamDivider: {
    borderRightWidth: 1,
    borderRightColor: colors.bordeDoradoMedio,
  },
  selectedRed: {
    backgroundColor: 'rgba(139,58,42,0.08)',
  },
  selectedBlue: {
    backgroundColor: 'rgba(42,80,128,0.09)',
  },
  teamHeader: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: colors.bordeDoradoMedio,
  },
  redHeader: {
    backgroundColor: 'rgba(92,23,18,0.84)',
  },
  blueHeader: {
    backgroundColor: 'rgba(11,42,61,0.9)',
  },
  teamName: {
    maxWidth: '92%',
    fontFamily: fonts.serif,
    fontSize: 21,
    lineHeight: 23,
    color: colors.marfil,
  },
  score: {
    fontFamily: fonts.serif,
    fontSize: 42,
    lineHeight: 44,
    color: colors.marfil,
  },
  matches: {
    flex: 1,
    width: '78%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  numericMode: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numericScore: {
    fontFamily: fonts.serif,
    fontSize: 80,
    color: colors.oro,
  },
  numericHint: {
    fontFamily: fonts.sans,
    color: colors.marfilMedio,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  tapHint: {
    alignItems: 'center',
    paddingBottom: 5,
  },
  tapPlus: {
    fontFamily: fonts.serif,
    fontSize: 18,
    lineHeight: 18,
  },
  tapText: {
    fontFamily: fonts.sansMedium,
    fontSize: 9,
    color: colors.marfilMedio,
    letterSpacing: 0.4,
  },
  controls: {
    marginHorizontal: 18,
    marginTop: 8,
    padding: 9,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(4,17,27,0.93)',
  },
  selectedRow: {
    minHeight: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  selectedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  selectedText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.marfilMedio,
  },
  selectedName: {
    fontFamily: fonts.sansSemibold,
    color: colors.marfil,
  },
  undo: {
    position: 'absolute',
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    alignItems: 'center',
    justifyContent: 'center',
  },
  undoText: {
    fontSize: 20,
    color: colors.oro,
  },
  disabled: {
    opacity: 0.28,
  },
  adjustRow: {
    flexDirection: 'row',
    gap: 10,
  },
  adjustButton: {
    flex: 1,
    height: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  minusButton: {
    backgroundColor: 'rgba(92,23,18,0.88)',
    borderColor: colors.rojoBorde,
  },
  plusButton: {
    backgroundColor: 'rgba(11,42,61,0.92)',
    borderColor: colors.azulBorde,
  },
  adjustText: {
    fontFamily: fonts.serif,
    fontSize: 31,
    color: colors.marfil,
  },
});
