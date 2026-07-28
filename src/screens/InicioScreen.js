import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppBackground from '../components/common/AppBackground';
import BrandTitle from '../components/common/BrandTitle';
import BottomNav from '../components/common/BottomNav';
import IconoJuego from '../components/common/IconoJuego';
import { GrupoFosforos } from '../components/fosforos/Fosforos';
import { JUEGOS_LISTA } from '../data/juegos';
import { colors } from '../theme/colors';
import { fonts, spacing, radius } from '../theme/typography';

export default function InicioScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  return (
    <AppBackground>
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Historial')}>
          <Text style={styles.headerIcon}>◷</Text>
        </TouchableOpacity>
        <BrandTitle size={42} subtitle="Elegí tu juego" compact />
        <TouchableOpacity style={styles.headerButton} onPress={() => navigation.navigate('Ajustes')}>
          <Text style={styles.headerIcon}>⚙</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={JUEGOS_LISTA}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { borderColor: item.colorBorde }]}
            onPress={() => navigation.navigate('Config', { juego: item })}
            activeOpacity={0.82}
          >
            <View style={styles.cardGlow} />
            <View style={styles.iconBox}>
              {item.id.startsWith('truco') ? (
                <GrupoFosforos cantidad={5} size={56} guia={false} />
              ) : (
                <IconoJuego juego={item} size={42} />
              )}
            </View>
            <Text style={styles.cardTitle}>{item.nombre}</Text>
            <Text style={styles.cardSubtitle}>
              {item.subtitulo || (item.equipos > 2 ? `Hasta ${item.equipos} jugadores` : '2 equipos')}
            </Text>
          </TouchableOpacity>
        )}
      />
      <BottomNav navigation={navigation} active="Inicio" />
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingBottom: 13,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.bordeDoradoMedio,
    backgroundColor: 'rgba(2,10,7,0.42)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIcon: { fontSize: 18, color: colors.oro },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  card: {
    width: '48.5%',
    minHeight: 148,
    borderRadius: radius.lg,
    borderWidth: 1,
    backgroundColor: 'rgba(2,10,7,0.48)',
    padding: 13,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  cardGlow: {
    position: 'absolute',
    top: -45,
    right: -45,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: colors.oroTenue,
  },
  iconBox: {
    minHeight: 58,
    justifyContent: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontFamily: fonts.serif,
    fontSize: 22,
    lineHeight: 23,
    color: colors.marfil,
  },
  cardSubtitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 9,
    color: colors.oro,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 3,
  },
});
