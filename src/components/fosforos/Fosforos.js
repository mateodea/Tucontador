// ─── TUCONTADOR — Componente de Fósforos ────────────────────────────────────
import React from 'react';
import Svg, { Rect, Circle, Line, Defs, LinearGradient, RadialGradient, Stop } from 'react-native-svg';
import { View, StyleSheet } from 'react-native';

// ── Un grupo de hasta 5 fósforos formando un cuadrado ───────────────────────
function GrupoFosforos({ cantidad, colorPalo, size = 48 }) {
  // cantidad: 1 a 5
  // 1 = lado izq, 2 = + arriba, 3 = + der, 4 = + abajo (cuadrado), 5 = + diagonal
  const scale = size / 52;
  const s = (v) => v * scale;

  return (
    <Svg width={size} height={size} viewBox="0 0 52 52">
      <Defs>
        <LinearGradient id={`palo_${colorPalo}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%"   stopColor="#E0B050" />
          <Stop offset="35%"  stopColor="#C8902A" />
          <Stop offset="70%"  stopColor="#8B5E18" />
          <Stop offset="100%" stopColor="#6B4010" />
        </LinearGradient>
        <RadialGradient id="cabeza" cx="35%" cy="30%" r="65%">
          <Stop offset="0%"   stopColor="#FF7050" />
          <Stop offset="100%" stopColor="#C01808" />
        </RadialGradient>
      </Defs>

      {/* LADO IZQUIERDO — aparece desde punto 1 */}
      {cantidad >= 1 && (
        <>
          <Rect x="9" y="9" width="4" height="34" rx="2" fill={`url(#palo_${colorPalo})`} />
          <Circle cx="11" cy="8" r="5.5" fill="url(#cabeza)" stroke="#700000" strokeWidth="0.6" />
        </>
      )}

      {/* LADO SUPERIOR — aparece desde punto 2 */}
      {cantidad >= 2 && (
        <>
          <Rect x="9" y="9" width="34" height="4" rx="2" fill={`url(#palo_${colorPalo})`} />
          <Circle cx="44" cy="11" r="5.5" fill="url(#cabeza)" stroke="#700000" strokeWidth="0.6" />
        </>
      )}

      {/* LADO DERECHO — aparece desde punto 3 */}
      {cantidad >= 3 && (
        <>
          <Rect x="39" y="9" width="4" height="34" rx="2" fill={`url(#palo_${colorPalo})`} />
          <Circle cx="41" cy="44" r="5.5" fill="url(#cabeza)" stroke="#700000" strokeWidth="0.6" />
        </>
      )}

      {/* LADO INFERIOR — aparece desde punto 4 (cuadrado completo) */}
      {cantidad >= 4 && (
        <>
          <Rect x="9" y="39" width="34" height="4" rx="2" fill={`url(#palo_${colorPalo})`} />
          <Circle cx="10" cy="41" r="5.5" fill="url(#cabeza)" stroke="#700000" strokeWidth="0.6" />
        </>
      )}

      {/* DIAGONAL — aparece en punto 5 (cuadrado completo) */}
      {cantidad >= 5 && (
        <>
          <Line
            x1="11" y1="11" x2="41" y2="41"
            stroke={`url(#palo_${colorPalo})`}
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <Circle cx="42" cy="42" r="5.5" fill="url(#cabeza)" stroke="#700000" strokeWidth="0.6" />
        </>
      )}
    </Svg>
  );
}

// ── Componente principal: dibuja todos los grupos necesarios ─────────────────
export default function Fosforos({ puntos, colorEquipo = 'rojo', size = 46 }) {
  if (puntos <= 0) return null;

  const grupos = Math.ceil(puntos / 5);
  const grupos_completos = Math.floor(puntos / 5);
  const resto = puntos % 5;

  // Color del palo según equipo
  const colorPalo = colorEquipo === 'rojo' ? 'rojo' : 'azul';

  return (
    <View style={styles.container}>
      {Array.from({ length: grupos }).map((_, i) => {
        const esUltimo = i === grupos - 1;
        const cantidadEnEsteGrupo = esUltimo && resto > 0 ? resto : 5;

        return (
          <View
            key={i}
            style={[
              styles.grupoWrap,
              colorEquipo === 'azul' && styles.grupoAzul,
            ]}
          >
            <GrupoFosforos
              cantidad={cantidadEnEsteGrupo}
              colorPalo={colorPalo}
              size={size}
            />
          </View>
        );
      })}
    </View>
  );
}

// ── Versión con override de color para el palo (azul) ───────────────────────
// Usamos un truco: los gradientes SVG se reusan por ID,
// así que para el equipo azul envolvemos con una vista teñida
// y redefinimos el gradiente en cada instancia.

const styles = StyleSheet.create({
  container: {
    flexDirection:  'row',
    flexWrap:       'wrap',
    gap:            8,
    alignItems:     'flex-start',
    justifyContent: 'flex-start',
    flex:           1,
  },
  grupoWrap: {
    // nada especial para rojo
  },
  grupoAzul: {
    // El tinte azul se maneja a nivel de gradiente SVG
  },
});
