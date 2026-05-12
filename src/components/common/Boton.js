// ─── TUCONTADOR — Botón reutilizable ────────────────────────────────────────
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors } from '../../theme/colors';
import { fonts, fontSize, radius, spacing } from '../../theme/typography';

export default function Boton({
  label,
  onPress,
  variante = 'primario',  // 'primario' | 'secundario' | 'rojo' | 'azul' | 'dorado' | 'ghost'
  size = 'md',            // 'sm' | 'md' | 'lg'
  disabled = false,
  style,
  labelStyle,
  fullWidth = false,
}) {
  const estiloVariante = variantes[variante] || variantes.primario;
  const estiloSize = sizes[size] || sizes.md;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.75}
      style={[
        styles.base,
        estiloVariante.container,
        estiloSize.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[
        styles.label,
        estiloVariante.label,
        estiloSize.label,
        disabled && styles.labelDisabled,
        labelStyle,
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius:    radius.md,
    alignItems:      'center',
    justifyContent:  'center',
    overflow:        'hidden',
  },
  label: {
    fontFamily: fonts.sansBold,
    letterSpacing: 0.3,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.4,
  },
  labelDisabled: {
    opacity: 0.6,
  },
});

const variantes = {
  primario: {
    container: {
      backgroundColor: colors.terracota,
      borderWidth:     1,
      borderColor:     'rgba(139,58,42,0.5)',
    },
    label: {
      fontFamily: fonts.serif,
      color:      colors.marfil,
    },
  },
  secundario: {
    container: {
      backgroundColor: 'rgba(0,0,0,0.2)',
      borderWidth:     1,
      borderColor:     colors.bordeDorado,
    },
    label: {
      color: colors.marfilSuave,
    },
  },
  rojo: {
    container: {
      backgroundColor: colors.rojoBtn,
      borderWidth:     1,
      borderColor:     colors.rojoBorde,
    },
    label: {
      color: colors.rojo,
    },
  },
  azul: {
    container: {
      backgroundColor: colors.azulBtn,
      borderWidth:     1,
      borderColor:     colors.azulBorde,
    },
    label: {
      color: colors.azul,
    },
  },
  dorado: {
    container: {
      backgroundColor: colors.oroTenue,
      borderWidth:     1,
      borderColor:     colors.bordeDoradoMedio,
    },
    label: {
      color: colors.oro,
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderWidth:     0,
    },
    label: {
      color: colors.marfilTenue,
    },
  },
};

const sizes = {
  sm: {
    container: { paddingVertical: 7,  paddingHorizontal: 10 },
    label:     { fontSize: fontSize.buttonSmall },
  },
  md: {
    container: { paddingVertical: 10, paddingHorizontal: 14 },
    label:     { fontSize: fontSize.buttonMedium },
  },
  lg: {
    container: { paddingVertical: 14, paddingHorizontal: 20 },
    label:     { fontSize: fontSize.buttonLarge },
  },
};
