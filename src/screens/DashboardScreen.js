import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import {
  getWaterData,
  getEnergyData,
  getThermalEfficiency,
  getCarbonData,
  getFootprintSummary,
} from '../data/mockZeroLake';

function Stat({ icon, label, value, unit, color }) {
  return (
    <View style={styles.stat}>
      <Ionicons name={icon} size={22} color={color || theme.accent} />
      <Text style={styles.statValue}>{value}{unit}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function DashboardScreen() {
  const [water, setWater] = useState(getWaterData('day'));
  const [energy, setEnergy] = useState(getEnergyData());
  const [thermal, setThermal] = useState(getThermalEfficiency());
  const [carbon, setCarbon] = useState(getCarbonData());
  const [footprint, setFootprint] = useState(getFootprintSummary());
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setWater(getWaterData('day'));
    setEnergy(getEnergyData());
    setThermal(getThermalEfficiency());
    setCarbon(getCarbonData());
    setFootprint(getFootprintSummary());
    setTimeout(() => setRefreshing(false), 500);
  };

  useEffect(() => {
    const t = setInterval(refresh, 8000);
    return () => clearInterval(t);
  }, []);

  const effColor = thermal.status === 'critical' ? theme.danger : thermal.status === 'warning' ? theme.warning : theme.success;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[theme.accent]} />}
      >
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Crystal Clear</Text>
          <Text style={styles.heroSub}>Вода, энергия и экослед системы охлаждения</Text>
        </View>

        <Text style={styles.sectionTitle}>Сводка</Text>
        <View style={styles.statsRow}>
          <Stat icon="water-outline" label="Вода за сутки" value={water.liters} unit=" л" />
          <Stat icon="flash-outline" label="Энергия" value={energy.totalKwh} unit=" кВт·ч" />
        </View>
        <View style={styles.statsRow}>
          <Stat icon="thermometer-outline" label="КПД системы" value={thermal.percent} unit="%" color={effColor} />
          <Stat icon="leaf-outline" label="CO₂ сегодня" value={carbon.co2TodayKg} unit=" кг" />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Экологический след пользователя</Text>
          <View style={styles.footprintRow}>
            <View style={styles.footprintItem}>
              <Ionicons name="water-outline" size={28} color={theme.primary} />
              <Text style={styles.footprintValue}>≈ {footprint.bottlesEquivalent}</Text>
              <Text style={styles.footprintLabel}>бутылок воды = {footprint.aiRequests} запросов к ИИ</Text>
            </View>
            <View style={styles.footprintItem}>
              <Ionicons name="car-outline" size={28} color={theme.primary} />
              <Text style={styles.footprintValue}>≈ {footprint.carKmEquivalent} км</Text>
              <Text style={styles.footprintLabel}>CO₂ как поездка на авто ({footprint.co2Kg} кг)</Text>
            </View>
          </View>
          <Text style={styles.tipsTitle}>Как снизить влияние</Text>
          {footprint.tips.slice(0, 2).map((tip, i) => (
            <Text key={i} style={styles.tip}>• {tip}</Text>
          ))}
        </View>

        <Text style={styles.updated}>Обновлено: {water.lastUpdate}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scroll: { padding: 16, paddingBottom: 32 },
  hero: {
    backgroundColor: theme.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    borderLeftWidth: 6,
    borderLeftColor: theme.accent,
  },
  heroTitle: { fontSize: 24, fontWeight: '800', color: '#fff', letterSpacing: 0.5 },
  heroSub: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: theme.text, marginBottom: 12, letterSpacing: 0.3 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  stat: {
    flex: 1,
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  statValue: { fontSize: 19, fontWeight: '800', color: theme.text },
  statLabel: { fontSize: 11, color: theme.textMuted, marginTop: 4 },
  card: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: theme.text, marginBottom: 12 },
  footprintRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  footprintItem: { flex: 1, alignItems: 'center' },
  footprintValue: { fontSize: 20, fontWeight: '700', color: theme.primary, marginTop: 6 },
  footprintLabel: { fontSize: 11, color: theme.textMuted, marginTop: 2, textAlign: 'center' },
  tipsTitle: { fontSize: 14, fontWeight: '600', color: theme.text, marginTop: 8 },
  tip: { fontSize: 12, color: theme.textMuted, marginTop: 4, lineHeight: 18 },
  updated: { fontSize: 11, color: theme.textMuted, marginTop: 16 },
});
