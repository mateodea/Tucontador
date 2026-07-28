import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ornamento from './Ornamento';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export default function BrandTitle({ size = 52, subtitle, compact = false }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.titleRow}>
        <Text style={[styles.title, { fontSize: size, lineHeight: size + 4 }]}>Tu</Text>
        <Text style={[styles.accent, { fontSize: size, lineHeight: size + 4 }]}>contador</Text>
      </View>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <Ornamento width={compact ? 110 : 170} compact={compact} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  title: {
    fontFamily: fonts.serif,
    color: colors.marfil,
    letterSpacing: -1,
  },
  accent: {
    fontFamily: fonts.serifItalic,
    color: colors.oro,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.marfilMedio,
    letterSpacing: 2.6,
    textTransform: 'uppercase',
    marginTop: 3,
    marginBottom: 12,
  },
});
