import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { getEnergyData } from '../data/mockZeroLake';

function Bar({ label, value, max, color }) {
  const pct = max ? (value / max) * 100 : 0;
  return (
    <View style={styles.barWrap}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color || theme.accent }]} />
      </View>
      <Text style={styles.barValue}>{value} кВт·ч</Text>
    </View>
  );
}

export default function EnergyScreen() {
  const [data, setData] = useState(getEnergyData());
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setData(getEnergyData());
    setTimeout(() => setRefreshing(false), 400);
  };

  useEffect(() => {
    const t = setInterval(() => setData(getEnergyData()), 7000);
    return () => clearInterval(t);
  }, []);

  const maxKwh = Math.max(data.pumpsKwh, data.heatExchangersKwh, data.traditionalKwh);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[theme.accent]} />}
      >
        <Text style={styles.sectionTitle}>Энергопотребление насосов и теплообменников</Text>

        <View style={styles.card}>
          <Bar label="Насосы" value={data.pumpsKwh} max={maxKwh} color={theme.primary} />
          <Bar label="Теплообменники" value={data.heatExchangersKwh} max={maxKwh} color={theme.accent} />
          <Bar label="Традиционная система (сравнение)" value={data.traditionalKwh} max={maxKwh} color={theme.textMuted} />
        </View>

        <View style={[styles.card, styles.savingsCard]}>
          <Ionicons name="leaf" size={28} color={theme.success} />
          <Text style={styles.savingsTitle}>Экономия</Text>
          <Text style={styles.savingsValue}>−{data.savingsPercent}%</Text>
          <Text style={styles.savingsDesc}>
            {data.savingsKwh} кВт·ч по сравнению с традиционной системой охлаждения
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Тренд потребления (условно)</Text>
          <View style={styles.trendRow}>
            {data.trend.map((v, i) => (
              <View key={i} style={[styles.trendBar, { height: `${(v / Math.max(...data.trend)) * 100}%` }]} />
            ))}
          </View>
          <Text style={styles.updated}>Обновлено: {data.lastUpdate}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scroll: { padding: 16, paddingBottom: 32 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: theme.text, marginBottom: 12 },
  card: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  barWrap: { marginBottom: 14 },
  barLabel: { fontSize: 13, color: theme.textMuted, marginBottom: 4 },
  barBg: { height: 10, backgroundColor: theme.background, borderRadius: 5, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 5 },
  barValue: { fontSize: 12, color: theme.text, marginTop: 2 },
  savingsCard: { alignItems: 'center', padding: 24, borderLeftWidth: 6, borderLeftColor: theme.success },
  savingsTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginTop: 8 },
  savingsValue: { fontSize: 28, fontWeight: '800', color: theme.success, marginTop: 4 },
  savingsDesc: { fontSize: 12, color: theme.textMuted, marginTop: 6, textAlign: 'center' },
  cardLabel: { fontSize: 13, color: theme.textMuted, marginBottom: 10 },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 60,
    gap: 4,
  },
  trendBar: {
    flex: 1,
    backgroundColor: theme.accentLight,
    borderRadius: 4,
    minHeight: 8,
  },
  updated: { fontSize: 11, color: theme.textMuted, marginTop: 10 },
});
