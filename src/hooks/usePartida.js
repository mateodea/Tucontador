// ─── TUCONTADOR — Hook de partida (estado central del juego) ────────────────
import { useState, useCallback, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { guardarPartida } from '../utils/storage';

export function usePartida({ juego, equipos, limite, modoConteo, ajustes }) {
  const [puntajes, setPuntajes]     = useState(equipos.map(() => 0));
  const [movimientos, setMovimientos] = useState([]);
  const [terminada, setTerminada]   = useState(false);
  const [ganador, setGanador]       = useState(null);
  const inicioRef                   = useRef(Date.now());
  const movimientosRef             = useRef([]);

  // ── Sumar puntos ──────────────────────────────────────────────────────────
  const sumarPuntos = useCallback((equipoIdx, valor, descripcion = '') => {
    if (terminada) return;

    setPuntajes(prev => {
      const nuevos = [...prev];
      const anterior = nuevos[equipoIdx];
      nuevos[equipoIdx] = Math.max(0, anterior + valor);
      if (nuevos[equipoIdx] === anterior) return prev;

      // Registrar movimiento
      const mov = {
        id:        Date.now(),
        equipo:    equipoIdx,
        valor,
        descripcion,
        totalTras: nuevos[equipoIdx],
        timestamp: new Date().toISOString(),
      };
      const movimientosActualizados = [...movimientosRef.current, mov];
      movimientosRef.current = movimientosActualizados;
      setMovimientos(movimientosActualizados);

      // Vibración
      if (ajustes?.vibracion) {
        Haptics.impactAsync(
          valor > 0
            ? Haptics.ImpactFeedbackStyle.Medium
            : Haptics.ImpactFeedbackStyle.Light
        );
      }

      // Verificar ganador
      if (limite && nuevos[equipoIdx] >= limite) {
        setTerminada(true);
        setGanador(equipoIdx);
        if (ajustes?.vibracion) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        // Guardar en historial
        if (ajustes?.guardarHistorial) {
          guardarPartida({
            juego:       juego.id,
            equipos:     equipos.map(e => e.nombre),
            puntajes:    nuevos,
            ganador:     equipoIdx,
            limite,
            movimientos: movimientosActualizados,
            duracion:    Math.floor((Date.now() - inicioRef.current) / 1000),
          });
        }
      }

      return nuevos;
    });
  }, [terminada, limite, juego, equipos, ajustes]);

  // ── Deshacer último movimiento ────────────────────────────────────────────
  const deshacer = useCallback(() => {
    if (movimientos.length === 0) return null;

    const ultimo = movimientos[movimientos.length - 1];
    setPuntajes(prev => {
      const nuevos = [...prev];
      nuevos[ultimo.equipo] = Math.max(0, nuevos[ultimo.equipo] - ultimo.valor);
      return nuevos;
    });
    const restantes = movimientosRef.current.slice(0, -1);
    movimientosRef.current = restantes;
    setMovimientos(restantes);
    setTerminada(false);
    setGanador(null);

    if (ajustes?.vibracion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    return ultimo;
  }, [movimientos, ajustes]);

  // ── Reiniciar ─────────────────────────────────────────────────────────────
  const reiniciar = useCallback(() => {
    setPuntajes(equipos.map(() => 0));
    setMovimientos([]);
    movimientosRef.current = [];
    setTerminada(false);
    setGanador(null);
    inicioRef.current = Date.now();
  }, [equipos]);

  // ── Getters útiles ────────────────────────────────────────────────────────
  const ultimoMovimiento = movimientos.length > 0
    ? movimientos[movimientos.length - 1]
    : null;

  const progreso = puntajes.map(p =>
    limite ? Math.min(1, p / limite) : 0
  );

  return {
    puntajes,
    movimientos,
    terminada,
    ganador,
    ultimoMovimiento,
    progreso,
    sumarPuntos,
    deshacer,
    reiniciar,
  };
}
