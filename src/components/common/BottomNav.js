import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

const ITEMS = [
  { screen: 'Inicio', icon: '⌂', label: 'Inicio' },
  { screen: 'PartidaRapida', icon: 'ϟ', label: 'Rápida' },
  { screen: 'Historial', icon: '◷', label: 'Historial' },
  { screen: 'Reglas', icon: '▤', label: 'Reglas' },
  { screen: 'Torneo', icon: '♛', label: 'Torneo' },
];

export default function BottomNav({ navigation, active }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {ITEMS.map(item => {
        const selected = active === item.screen;
        return (
          <TouchableOpacity
            key={item.screen}
            style={styles.item}
            onPress={() => {
              if (!selected) navigation.navigate(item.screen);
            }}
          >
            <Text style={[styles.icon, selected && styles.active]}>{item.icon}</Text>
            <Text style={[styles.label, selected && styles.active]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    paddingTop: 9,
    paddingHorizontal: 6,
    backgroundColor: 'rgba(3,12,9,0.96)',
    borderTopWidth: 1,
    borderTopColor: colors.bordeDorado,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  icon: {
    fontFamily: fonts.serif,
    color: colors.marfilSuave,
    fontSize: 20,
    lineHeight: 21,
  },
  label: {
    fontFamily: fonts.sansMedium,
    color: colors.marfilSuave,
    fontSize: 9,
  },
  active: {
    color: colors.oro,
  },
});
