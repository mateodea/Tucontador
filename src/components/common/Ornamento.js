import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export default function Ornamento({ width = 150, compact = false }) {
  return (
    <View style={[styles.row, { width }]}>
      <View style={styles.line} />
      <View style={[styles.diamond, compact && styles.diamondCompact]} />
      <View style={styles.line} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 7,
  },
  line: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.bordeDoradoFuerte,
  },
  diamond: {
    width: 7,
    height: 7,
    borderWidth: 1,
    borderColor: colors.oro,
    transform: [{ rotate: '45deg' }],
  },
  diamondCompact: {
    width: 5,
    height: 5,
  },
});
