import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ornamento from './Ornamento';
import { colors } from '../../theme/colors';
import { fonts, spacing } from '../../theme/typography';

export default function ScreenHeader({
  title,
  subtitle,
  onBack,
  rightLabel,
  onRight,
  large = false,
}) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.wrap, { paddingTop: insets.top + 8 }]}>
      <View style={styles.row}>
        {onBack ? (
          <TouchableOpacity style={styles.circle} onPress={onBack}>
            <Text style={styles.circleText}>‹</Text>
          </TouchableOpacity>
        ) : <View style={styles.spacer} />}
        <View style={styles.center}>
          <Text style={[styles.title, large && styles.titleLarge]} numberOfLines={1}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text> : null}
        </View>
        {onRight ? (
          <TouchableOpacity style={styles.circle} onPress={onRight}>
            <Text style={styles.rightText}>{rightLabel}</Text>
          </TouchableOpacity>
        ) : <View style={styles.spacer} />}
      </View>
      <Ornamento width={large ? 150 : 105} compact />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  title: {
    fontFamily: fonts.serif,
    fontSize: 25,
    lineHeight: 28,
    color: colors.marfil,
    textAlign: 'center',
  },
  titleLarge: {
    fontSize: 36,
    lineHeight: 40,
    color: colors.oroBrillo,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 9,
    color: colors.marfilMedio,
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    backgroundColor: 'rgba(2,10,7,0.38)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    width: 38,
  },
  circleText: {
    fontFamily: fonts.serifRegular,
    fontSize: 34,
    color: colors.oro,
    lineHeight: 34,
    marginTop: -2,
  },
  rightText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 15,
    color: colors.oro,
  },
});
