import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Switch,
  ScrollView, StyleSheet, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBackground from '../components/common/AppBackground';
import ScreenHeader from '../components/common/ScreenHeader';
import { getAjustes, setAjustes, borrarHistorial, AJUSTES_DEFAULT } from '../utils/storage';
import { colors } from '../theme/colors';
import { fonts, spacing, radius } from '../theme/typography';

const GROUPS = [
  {
    title: 'Respuesta táctil',
    rows: [
      ['vibracion', 'Vibración', 'Respuesta táctil al tocar'],
    ],
  },
  {
    title: 'Juego',
    rows: [
      ['confirmarPuntos', 'Confirmar puntos', 'Pedir confirmación antes de sumar'],
      ['permitirDeshacer', 'Permitir deshacer', 'Corregir el último movimiento'],
      ['guardarHistorial', 'Guardar historial', 'Recordar partidas anteriores'],
    ],
  },
  {
    title: 'Pantalla',
    rows: [['pantallaEncendida', 'Pantalla siempre encendida', 'No apagar mientras jugás']],
  },
];

export default function AjustesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const [settings, setSettings] = useState(AJUSTES_DEFAULT);
  useEffect(() => { getAjustes().then(setSettings); }, []);

  const toggle = async key => {
    const next = { ...settings, [key]: !settings[key] };
    setSettings(next);
    await setAjustes(next);
  };

  const clear = () => Alert.alert(
    '¿Borrar historial?',
    'Se eliminarán todas las partidas guardadas.',
    [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Borrar todo', style: 'destructive', onPress: borrarHistorial },
    ]
  );

  return (
    <AppBackground framed>
      <ScreenHeader title="Ajustes" subtitle="Tu experiencia" onBack={() => navigation.goBack()} large />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        {GROUPS.map(group => (
          <View key={group.title}>
            <Text style={styles.groupTitle}>{group.title}</Text>
            <View style={styles.card}>
              {group.rows.map(([key, title, description], index) => (
                <View key={key} style={[styles.row, index > 0 && styles.rowBorder]}>
                  <View style={styles.rowText}>
                    <Text style={styles.rowTitle}>{title}</Text>
                    <Text style={styles.rowDescription}>{description}</Text>
                  </View>
                  <Switch
                    value={settings[key]}
                    onValueChange={() => toggle(key)}
                    trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(214,175,91,0.42)' }}
                    thumbColor={settings[key] ? colors.oroBrillo : '#73776F'}
                    ios_backgroundColor="rgba(255,255,255,0.08)"
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.groupTitle}>Datos</Text>
        <TouchableOpacity style={styles.deleteButton} onPress={clear}>
          <Text style={styles.deleteText}>Borrar historial de partidas</Text>
          <Text style={styles.deleteArrow}>›</Text>
        </TouchableOpacity>

        <View style={styles.about}>
          <Text style={styles.aboutName}>Tucontador</Text>
          <Text style={styles.aboutVersion}>Versión 1.0.0 · Hecho en Argentina 🇦🇷</Text>
        </View>
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, gap: 14 },
  groupTitle: {
    fontFamily: fonts.sansBold,
    fontSize: 9,
    color: colors.oro,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  card: {
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    backgroundColor: 'rgba(2,10,7,0.46)',
    overflow: 'hidden',
  },
  row: {
    minHeight: 61,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
  },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.bordeDorado },
  rowText: { flex: 1 },
  rowTitle: { fontFamily: fonts.serif, fontSize: 18, color: colors.marfil },
  rowDescription: { fontFamily: fonts.sans, fontSize: 9, color: colors.marfilMedio, marginTop: 1 },
  deleteButton: {
    minHeight: 53,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.rojoBorde,
    backgroundColor: 'rgba(92,23,18,0.32)',
  },
  deleteText: { flex: 1, fontFamily: fonts.serif, fontSize: 18, color: colors.marfil },
  deleteArrow: { fontSize: 25, color: colors.rojo },
  about: { alignItems: 'center', paddingVertical: 15 },
  aboutName: { fontFamily: fonts.serifItalic, fontSize: 23, color: colors.oro },
  aboutVersion: { fontFamily: fonts.sans, fontSize: 9, color: colors.marfilSuave },
});
