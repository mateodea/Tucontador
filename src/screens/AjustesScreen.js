// ─── TUCONTADOR — Pantalla de ajustes ───────────────────────────────────────
import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, Switch,
  ScrollView, StyleSheet, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getAjustes, setAjustes, borrarHistorial, AJUSTES_DEFAULT } from '../utils/storage';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';

export default function AjustesScreen({ navigation }) {
  const insets   = useSafeAreaInsets();
  const [ajustes, setAjustesLocal] = useState(AJUSTES_DEFAULT);

  useEffect(() => {
    getAjustes().then(setAjustesLocal);
  }, []);

  const toggle = async (key) => {
    const nuevos = { ...ajustes, [key]: !ajustes[key] };
    setAjustesLocal(nuevos);
    await setAjustes(nuevos);
  };

  const confirmarBorrarHistorial = () => {
    Alert.alert(
      '¿Borrar historial?',
      'Se eliminarán todas las partidas guardadas. Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: async () => {
            await borrarHistorial();
            Alert.alert('Listo', 'El historial fue borrado.');
          },
        },
      ]
    );
  };

  const renderSwitch = (key, label, descripcion, iconColor) => (
    <View style={styles.settingRow} key={key}>
      <View style={[styles.settingIcon, { backgroundColor: `${iconColor}20`, borderColor: `${iconColor}35` }]}>
        <View style={[styles.settingIconDot, { backgroundColor: iconColor }]} />
      </View>
      <View style={styles.settingTexto}>
        <Text style={styles.settingNombre}>{label}</Text>
        {descripcion && <Text style={styles.settingDesc}>{descripcion}</Text>}
      </View>
      <Switch
        value={ajustes[key]}
        onValueChange={() => toggle(key)}
        trackColor={{ false: 'rgba(255,255,255,0.1)', true: 'rgba(184,150,46,0.4)' }}
        thumbColor={ajustes[key] ? colors.oro : 'rgba(255,255,255,0.4)'}
        ios_backgroundColor="rgba(255,255,255,0.1)"
      />
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
        <Text style={styles.headerTitle}>Ajustes</Text>
        <View style={{ width: 30 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 20 }]}
        showsVerticalScrollIndicator={false}
      >

        {/* Sonido y vibración */}
        <Text style={styles.secLabel}>Sonido y vibración</Text>
        <View style={styles.card}>
          {renderSwitch('sonidos',   'Sonidos',   'Al sumar puntos y al ganar',         colors.oro)}
          {renderSwitch('vibracion', 'Vibración', 'Feedback táctil al tocar',           colors.azul)}
        </View>

        {/* Juego */}
        <Text style={styles.secLabel}>Juego</Text>
        <View style={styles.card}>
          {renderSwitch('confirmarPuntos',   'Confirmar puntos',        'Pedir confirmación antes de sumar', colors.rojo)}
          {renderSwitch('permitirDeshacer',  'Permitir deshacer',       'Botón para corregir el último punto', colors.verdeHoja)}
          {renderSwitch('guardarHistorial',  'Guardar historial',       'Recordar partidas anteriores',       colors.doradoAntiguo)}
        </View>

        {/* Pantalla */}
        <Text style={styles.secLabel}>Pantalla</Text>
        <View style={styles.card}>
          {renderSwitch('pantallaEncendida', 'Pantalla siempre encendida', 'No apagar mientras jugás', colors.marfil)}
        </View>

        {/* Historial */}
        <Text style={styles.secLabel}>Datos</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.actionRow} onPress={confirmarBorrarHistorial}>
            <Text style={styles.actionLabel}>Borrar historial de partidas</Text>
            <Text style={styles.actionChev}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Acerca de */}
        <Text style={styles.secLabel}>Acerca de</Text>
        <View style={styles.card}>
          <View style={styles.actionRow}>
            <Text style={styles.actionLabel}>Tucontador</Text>
            <Text style={styles.actionValue}>v1.0.0</Text>
          </View>
          <View style={[styles.actionRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.actionLabel}>Hecho en Argentina</Text>
            <Text style={styles.actionValue}>🇦🇷</Text>
          </View>
        </View>

      </ScrollView>
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

  scroll: { flex: 1 },
  scrollContent: { padding: spacing.lg, gap: spacing.md },

  secLabel: {
    fontFamily: fonts.sansBold, fontSize: fontSize.labelTiny,
    color: 'rgba(184,150,46,0.55)', letterSpacing: 2.5,
    textTransform: 'uppercase', marginBottom: spacing.xs,
  },
  card: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    borderWidth: 1, borderColor: colors.bordeDorado,
    borderRadius: radius.md, overflow: 'hidden',
  },

  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, gap: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  settingIcon: {
    width: 34, height: 34, borderRadius: radius.sm,
    borderWidth: 1, alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  settingIconDot: { width: 10, height: 10, borderRadius: 5 },
  settingTexto:   { flex: 1 },
  settingNombre:  { fontFamily: fonts.sansSemibold, fontSize: fontSize.body, color: colors.marfil },
  settingDesc:    { fontFamily: fonts.sans, fontSize: fontSize.labelTiny, color: colors.marfilTenue, marginTop: 1 },

  actionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  actionLabel: { fontFamily: fonts.sansMedium, fontSize: fontSize.body, color: colors.marfil },
  actionValue: { fontFamily: fonts.sans, fontSize: fontSize.body, color: colors.marfilTenue },
  actionChev:  { fontSize: 18, color: 'rgba(184,150,46,0.4)' },
});
