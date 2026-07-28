export function getMarcadorPorJuego(juegoId) {
  switch (juegoId) {
    case 'chinchon': return 'MarcadorChinchon';
    case 'escoba': return 'MarcadorEscoba';
    case 'generala': return 'MarcadorGenerala';
    case 'rummy':
    case 'canasta':
    case 'tute':
      return 'MarcadorMultijugador';
    default:
      return 'Marcador';
  }
}
