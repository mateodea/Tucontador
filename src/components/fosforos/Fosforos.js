// ─── TUCONTADOR — Fósforos tradicionales de Truco ───────────────────────────
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, {
  Rect, Circle, Line, Defs,
  LinearGradient as SvgGradient,
  RadialGradient, Stop,
} from 'react-native-svg';
import { colors } from '../../theme/colors';
import { fonts } from '../../theme/typography';

export function GrupoFosforos({ cantidad = 0, size = 42, guia = true }) {
  const visible = Math.max(0, Math.min(5, cantidad));

  return (
    <View style={[styles.slot, { width: size, height: size }]}>
      {guia && visible === 0 ? <View style={styles.ghost} /> : null}
      <Svg width={size} height={size} viewBox="0 0 52 52">
        <Defs>
          <SvgGradient id="madera" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#F0C979" />
            <Stop offset="42%" stopColor="#C9913D" />
            <Stop offset="100%" stopColor="#754417" />
          </SvgGradient>
          <RadialGradient id="cabeza" cx="35%" cy="30%" r="70%">
            <Stop offset="0%" stopColor="#FF7656" />
            <Stop offset="58%" stopColor="#CF2E19" />
            <Stop offset="100%" stopColor="#711007" />
          </RadialGradient>
        </Defs>

        {/* 1: lateral izquierdo */}
        {visible >= 1 && <Fosforo x1={11} y1={42} x2={11} y2={10} cabezaX={11} cabezaY={9} />}
        {/* 2: base; forma la L tradicional */}
        {visible >= 2 && <Fosforo x1={11} y1={41} x2={42} y2={41} cabezaX={43} cabezaY={41} />}
        {/* 3: lateral derecho */}
        {visible >= 3 && <Fosforo x1={41} y1={41} x2={41} y2={10} cabezaX={41} cabezaY={9} />}
        {/* 4: cierre superior */}
        {visible >= 4 && <Fosforo x1={41} y1={11} x2={11} y2={11} cabezaX={10} cabezaY={11} />}
        {/* 5: diagonal */}
        {visible >= 5 && <Fosforo x1={12} y1={40} x2={40} y2={12} cabezaX={41} cabezaY={11} />}
      </Svg>
    </View>
  );
}

function Fosforo({ x1, y1, x2, y2, cabezaX, cabezaY }) {
  return (
    <>
      <Line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="url(#madera)"
        strokeWidth="4.2"
        strokeLinecap="round"
      />
      <Circle
        cx={cabezaX}
        cy={cabezaY}
        r="4.7"
        fill="url(#cabeza)"
        stroke="#5B0C06"
        strokeWidth="0.7"
      />
    </>
  );
}

export default function Fosforos({ puntos = 0, size = 42, mostrarGuias = true }) {
  const valor = Math.max(0, Math.min(30, puntos));
  const cantidades = Array.from({ length: 6 }, (_, i) =>
    Math.max(0, Math.min(5, valor - i * 5))
  );

  return (
    <View style={styles.container}>
      <Text style={styles.fase}>MALAS</Text>
      <View style={styles.bloque}>
        {cantidades.slice(0, 3).map((cantidad, i) => (
          <GrupoFosforos key={`m-${i}`} cantidad={cantidad} size={size} guia={mostrarGuias} />
        ))}
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.quince}>15</Text>
        <View style={styles.divider} />
      </View>

      <Text style={styles.fase}>BUENAS</Text>
      <View style={styles.bloque}>
        {cantidades.slice(3, 6).map((cantidad, i) => (
          <GrupoFosforos key={`b-${i}`} cantidad={cantidad} size={size} guia={mostrarGuias} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexShrink: 1,
  },
  fase: {
    fontFamily: fonts.sansBold,
    fontSize: 8,
    letterSpacing: 1.8,
    color: colors.oro,
    marginBottom: 2,
  },
  bloque: {
    alignItems: 'center',
    gap: 2,
  },
  slot: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ghost: {
    position: 'absolute',
    width: '78%',
    height: '78%',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: 'rgba(214,175,91,0.09)',
    borderRadius: 4,
  },
  dividerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginVertical: 3,
  },
  divider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.bordeDoradoFuerte,
  },
  quince: {
    fontFamily: fonts.serif,
    fontSize: 11,
    color: colors.oro,
  },
});
