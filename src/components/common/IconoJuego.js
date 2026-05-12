// ─── TUCONTADOR — Íconos de cada juego (SVG, cartas españolas) ──────────────
import React from 'react';
import Svg, {
  Rect, Circle, Text as SvgText, Line, Path, G, Ellipse,
} from 'react-native-svg';

export default function IconoJuego({ juegoId, size = 24, color }) {
  const s = size;

  switch (juegoId) {

    case 'truco_argentino':
    case 'truco_uruguayo':
      // Dos cartas: as de espadas + as de copas
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32">
          {/* Carta espadas (atrás, inclinada) */}
          <Rect x="2" y="5" width="13" height="19" rx="2"
            fill="#F2EDD7" stroke="#3A3A3A" strokeWidth="0.9"
            transform="rotate(-8 8 14)"
          />
          <G transform="translate(8,14) rotate(-8)">
            <Path d="M0,-7 L1.8,0 L0,3 L-1.8,0 Z" fill="#1a1a1a"/>
            <Path d="M-5,-1 Q-3,-2.5,-1,-1 L-1,1.5 Q-3,3,-5,1.5 Q-6.5,0,-5,-1Z" fill="#1a1a1a"/>
            <Path d="M5,-1 Q3,-2.5,1,-1 L1,1.5 Q3,3,5,1.5 Q6.5,0,5,-1Z" fill="#1a1a1a"/>
            <Rect x="-1.5" y="1.5" width="3" height="4" rx="1" fill="#3A2A0A"/>
            <Ellipse cx="0" cy="6.5" rx="2.5" ry="1.8" fill="#1a1a1a"/>
          </G>
          {/* Carta copas (adelante, inclinada otro lado) */}
          <Rect x="16" y="7" width="13" height="19" rx="2"
            fill="#F5F0E0" stroke="#8B3A2A" strokeWidth="0.9"
            transform="rotate(8 22 16)"
          />
          <G transform="translate(22,17) rotate(8)">
            <Path d="M-5.5,-9 Q-7.5,-3,-5,0.5 Q-3,4,0,4.5 Q3,4,5,0.5 Q7.5,-3,5.5,-9 Z"
              fill="#C0392B"/>
            <Rect x="-1.2" y="4.5" width="2.4" height="5" rx="1" fill="#C0392B"/>
            <Path d="M-4,9.5 Q0,11,4,9.5 Q3,8.5,0,8.5 Q-3,8.5,-4,9.5Z" fill="#C0392B"/>
          </G>
        </Svg>
      );

    case 'chinchon':
      // Naipes en abanico
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32">
          <Rect x="2" y="9" width="9" height="14" rx="1.5"
            fill="#F2EDD7" stroke="#2A4A8B" strokeWidth="0.8"
            transform="rotate(-20 6.5 16)"/>
          <Rect x="11" y="7" width="9" height="14" rx="1.5"
            fill="#F2EDD7" stroke="#2A4A8B" strokeWidth="0.8"/>
          <SvgText x="15" y="18" fontSize="7" textAnchor="middle"
            fill="#C0392B" fontFamily="serif">♦</SvgText>
          <Rect x="20" y="9" width="9" height="14" rx="1.5"
            fill="#F2EDD7" stroke="#2A4A8B" strokeWidth="0.8"
            transform="rotate(20 24.5 16)"/>
        </Svg>
      );

    case 'escoba':
      // Palo de escoba con número 15
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32">
          <Line x1="20" y1="4" x2="10" y2="26"
            stroke="#8B5E18" strokeWidth="2.5" strokeLinecap="round"/>
          <Path d="M5 20 Q10 17 14 20 Q16 24 10 26 Q4 24 5 20Z"
            fill="#C8902A" stroke="#8B5E18" strokeWidth="0.7"/>
          <Line x1="8" y1="20" x2="7" y2="26" stroke="#8B5E18" strokeWidth="1" strokeLinecap="round"/>
          <Line x1="10" y1="19" x2="10" y2="25" stroke="#8B5E18" strokeWidth="1" strokeLinecap="round"/>
          <Line x1="12" y1="20" x2="13" y2="26" stroke="#8B5E18" strokeWidth="1" strokeLinecap="round"/>
          <Circle cx="22" cy="9" r="7" fill="#2A6B3A" stroke="rgba(184,150,46,0.5)" strokeWidth="0.7"/>
          <SvgText x="22" y="12.5" fontSize="6.5" textAnchor="middle"
            fill="#D4A843" fontWeight="700" fontFamily="sans-serif">15</SvgText>
        </Svg>
      );

    case 'rummy':
      // Tres cartas en secuencia 7-8-9
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32">
          <Rect x="1" y="8" width="9" height="13" rx="1.5"
            fill="#F2EDD7" stroke="#5A2A8B" strokeWidth="0.8"/>
          <SvgText x="5.5" y="18" fontSize="7" textAnchor="middle"
            fill="#5A2A8B" fontWeight="700" fontFamily="serif">7</SvgText>
          <Rect x="11" y="8" width="9" height="13" rx="1.5"
            fill="#F2EDD7" stroke="#5A2A8B" strokeWidth="0.8"/>
          <SvgText x="15.5" y="18" fontSize="7" textAnchor="middle"
            fill="#C0392B" fontWeight="700" fontFamily="serif">8</SvgText>
          <Rect x="21" y="8" width="9" height="13" rx="1.5"
            fill="#F2EDD7" stroke="#5A2A8B" strokeWidth="0.8"/>
          <SvgText x="25.5" y="18" fontSize="7" textAnchor="middle"
            fill="#5A2A8B" fontWeight="700" fontFamily="serif">9</SvgText>
        </Svg>
      );

    case 'canasta':
      // Pila de cartas + comodín ★
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32">
          <Rect x="3" y="10" width="10" height="14" rx="2"
            fill="#F2EDD7" stroke="#8B6A2A" strokeWidth="0.8"/>
          <Rect x="9" y="8" width="10" height="14" rx="2"
            fill="#FFF0D0" stroke="#8B6A2A" strokeWidth="0.8"/>
          <SvgText x="14" y="18" fontSize="7" textAnchor="middle"
            fill="#C0392B" fontWeight="700">★</SvgText>
          <Rect x="18" y="10" width="10" height="14" rx="2"
            fill="#F2EDD7" stroke="#8B6A2A" strokeWidth="0.8"/>
          <SvgText x="23" y="20" fontSize="6" textAnchor="middle"
            fill="#2A2A2A" fontWeight="700">2</SvgText>
        </Svg>
      );

    case 'tute':
      // Rey y caballo de espadas
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32">
          <Rect x="2" y="5" width="12" height="18" rx="2"
            fill="#F2EDD7" stroke="#5A2A5A" strokeWidth="0.9"/>
          <SvgText x="8" y="15" fontSize="8" textAnchor="middle"
            fill="#5A2A5A" fontWeight="700" fontFamily="serif">R</SvgText>
          <SvgText x="4" y="11" fontSize="5" fill="#5A2A5A">♠</SvgText>
          <Rect x="16" y="7" width="12" height="18" rx="2"
            fill="#F2EDD7" stroke="#C0392B" strokeWidth="0.9"/>
          <SvgText x="22" y="18" fontSize="8" textAnchor="middle"
            fill="#C0392B" fontWeight="700" fontFamily="serif">C</SvgText>
          <SvgText x="18" y="13" fontSize="5" fill="#C0392B">♥</SvgText>
        </Svg>
      );

    case 'generala':
      // Dos dados en perspectiva
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32">
          {/* Dado 1 */}
          <Rect x="2" y="8" width="13" height="13" rx="2"
            fill="#F2EDD7" stroke="#2A6B8B" strokeWidth="0.9"/>
          <Circle cx="6"  cy="11" r="1.5" fill="#2A6B8B"/>
          <Circle cx="11" cy="11" r="1.5" fill="#2A6B8B"/>
          <Circle cx="6"  cy="17" r="1.5" fill="#2A6B8B"/>
          <Circle cx="11" cy="17" r="1.5" fill="#2A6B8B"/>
          <Circle cx="6"  cy="14" r="1.5" fill="#2A6B8B"/>
          <Circle cx="11" cy="14" r="1.5" fill="#2A6B8B"/>
          {/* Dado 2 */}
          <Rect x="17" y="10" width="13" height="13" rx="2"
            fill="#F2EDD7" stroke="#C0392B" strokeWidth="0.9"/>
          <Circle cx="21" cy="14" r="1.8" fill="#C0392B"/>
          <Circle cx="26" cy="14" r="1.8" fill="#C0392B"/>
          <Circle cx="21" cy="19" r="1.8" fill="#C0392B"/>
          <Circle cx="26" cy="19" r="1.8" fill="#C0392B"/>
          <Circle cx="23.5" cy="16.5" r="1.8" fill="#C0392B"/>
        </Svg>
      );

    case 'libre':
    default:
      // Cuatro cuadrantes dorados + signo +
      return (
        <Svg width={s} height={s} viewBox="0 0 32 32">
          <Rect x="3"  y="3"  width="11" height="11" rx="2" fill="#D4A843" fillOpacity="0.8"/>
          <Rect x="17" y="3"  width="11" height="11" rx="2" fill="#D4A843" fillOpacity="0.5"/>
          <Rect x="3"  y="17" width="11" height="11" rx="2" fill="#D4A843" fillOpacity="0.5"/>
          <Rect x="17" y="17" width="11" height="11" rx="2" fill="#D4A843" fillOpacity="0.3"/>
          <SvgText x="8.5" y="13" fontSize="9" textAnchor="middle"
            fill="#8B5E18" fontWeight="700">+</SvgText>
        </Svg>
      );
  }
}
