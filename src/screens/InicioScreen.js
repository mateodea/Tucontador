// ─── TUCONTADOR — Pantalla de inicio ───────────────────────────────────────
import React, { useRef, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, Animated, Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { JUEGOS_LISTA } from '../data/juegos';
import { colors } from '../theme/colors';
import { fonts, fontSize, spacing, radius } from '../theme/typography';
import IconoJuego from '../components/common/IconoJuego';

const { width: W } = Dimensions.get('window');
const CARD = (W - spacing.lg * 2 - spacing.sm) / 2;

function GameCard({ juego, onPress, index }) {
  const scale = useRef(new Animated.Value(0)).current;
  const fade  = useRef(new Animated.Value(0)).current;
  const press = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue:1, tension:60, friction:8, delay:index*55, useNativeDriver:true }),
      Animated.timing(fade,  { toValue:1, duration:280, delay:index*55, useNativeDriver:true }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity:fade, transform:[{ scale: Animated.multiply(scale, press) }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={()=> Animated.spring(press,{toValue:0.94,useNativeDriver:true}).start()}
        onPressOut={()=> Animated.spring(press,{toValue:1,useNativeDriver:true}).start()}
        activeOpacity={1}
        style={[styles.card, { borderColor:juego.colorBorde, backgroundColor:juego.colorFondo }]}
      >
        <LinearGradient colors={['rgba(255,255,255,0.05)','transparent']} style={StyleSheet.absoluteFill}/>
        <View style={[styles.accent, { backgroundColor:juego.colorAccento }]}/>
        <View style={styles.iconWrap}>
          <IconoJuego juego={juego} size={38}/>
        </View>
        <Text style={styles.cardName} numberOfLines={2}>{juego.nombre}</Text>
        {juego.subtitulo
          ? <Text style={[styles.cardSub, { color:juego.colorAccento }]} numberOfLines={1}>{juego.subtitulo}</Text>
          : <Text style={styles.cardPlayers}>{juego.equipos === 2 ? '2 equipos' : juego.equipos+' jugadores'}</Text>
        }
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function InicioScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const hdr = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(hdr, { toValue:1, duration:450, useNativeDriver:true }).start();
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent"/>
      <LinearGradient colors={[colors.fondoAzul,'#0D1520',colors.fondoNegro]} style={StyleSheet.absoluteFill}/>
      <View style={styles.glow1}/>
      <View style={styles.glow2}/>

      <Animated.View style={[
        styles.header,
        { paddingTop: insets.top + spacing.md },
        { opacity:hdr, transform:[{ translateY: hdr.interpolate({ inputRange:[0,1], outputRange:[-18,0] }) }] },
      ]}>
        <View>
          <Text style={styles.title}>TuContador</Text>
          <Text style={styles.sub}>Elegí tu juego</Text>
        </View>
        <TouchableOpacity style={styles.settBtn} onPress={()=> navigation.navigate('Ajustes')}>
          <Text style={styles.settIcon}>⚙</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.divider}/>

      <FlatList
        data={JUEGOS_LISTA}
        keyExtractor={j => j.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + spacing.xl }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <GameCard juego={item} index={index} onPress={()=> navigation.navigate('Config', { juego:item })}/>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root:     { flex:1, backgroundColor:colors.fondoAzul },
  glow1:    { position:'absolute', width:260, height:260, borderRadius:130, backgroundColor:colors.oroTenue, top:-50, right:-70 },
  glow2:    { position:'absolute', width:180, height:180, borderRadius:90,  backgroundColor:'rgba(42,80,128,0.07)', bottom:90, left:-50 },
  header:   { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-end', paddingHorizontal:spacing.lg, paddingBottom:spacing.md },
  title:    { fontFamily:fonts.serif, fontSize:34, color:colors.oro, letterSpacing:0.4 },
  sub:      { fontFamily:fonts.sans, fontSize:fontSize.labelTiny ?? 11, color:colors.marfilMedio, letterSpacing:1.6, textTransform:'uppercase', marginTop:3 },
  settBtn:  { width:40, height:40, borderRadius:20, backgroundColor:colors.fondoCard, borderWidth:1, borderColor:colors.bordeDorado, alignItems:'center', justifyContent:'center' },
  settIcon: { fontSize:17, color:colors.oro },
  divider:  { height:1, marginHorizontal:spacing.lg, backgroundColor:colors.bordeDorado, marginBottom:spacing.lg },
  list:     { paddingHorizontal:spacing.lg },
  row:      { justifyContent:'space-between', marginBottom:spacing.sm },
  card:     { width:CARD, minHeight:142, borderRadius:radius.xl ?? 20, borderWidth:1, padding:spacing.md, overflow:'hidden', justifyContent:'flex-end' },
  accent:   { position:'absolute', top:0, left:0, right:0, height:3, borderTopLeftRadius:20, borderTopRightRadius:20 },
  iconWrap: { marginBottom:spacing.sm, marginTop:spacing.sm },
  cardName: { fontFamily:fonts.serif, fontSize:fontSize.body ?? 15, color:colors.marfil, lineHeight:20, marginBottom:2 },
  cardSub:  { fontFamily:fonts.sansMedium, fontSize:10, textTransform:'uppercase', letterSpacing:0.9 },
  cardPlayers:{ fontFamily:fonts.sans, fontSize:11, color:colors.marfilTenue },
});
