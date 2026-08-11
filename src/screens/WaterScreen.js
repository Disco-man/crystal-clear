import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { getWaterData } from '../data/mockZeroLake';

const PERIODS = [
  { key: 'hour', label: 'Час' },
  { key: 'day', label: 'Сутки' },
  { key: 'month', label: 'Месяц' },
];

function MiniChart({ data }) {
  const max = Math.max(...data);
  return (
    <View style={styles.chartRow}>
      {data.map((v, i) => (
        <View key={i} style={[styles.chartBar, { height: `${(v / max) * 100}%` }]} />
      ))}
    </View>
  );
}

export default function WaterScreen() {
  const [period, setPeriod] = useState('day');
  const [data, setData] = useState(getWaterData(period));
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setData(getWaterData(period));
    setTimeout(() => setRefreshing(false), 400);
  };

  useEffect(() => {
    setData(getWaterData(period));
  }, [period]);

  useEffect(() => {
    const t = setInterval(() => setData(getWaterData(period)), 6000);
    return () => clearInterval(t);
  }, [period]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[theme.accent]} />}
      >
        <Text style={styles.sectionTitle}>Водопотребление системы охлаждения</Text>
        <View style={styles.periodRow}>
          {PERIODS.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.periodBtn, period === key && styles.periodBtnActive]}
              onPress={() => setPeriod(key)}
            >
              <Text style={[styles.periodBtnText, period === key && styles.periodBtnTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Использовано воды за {data.period}</Text>
          <Text style={styles.cardValue}>{data.liters} л</Text>
          <Text style={styles.realTime}>Сейчас: {data.realTimeLpm} л/мин в реальном времени</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Динамика расхода (тренд)</Text>
          <View style={styles.chartWrap}>
            <MiniChart data={data.trend} />
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
  periodRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  periodBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: theme.card,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.border,
  },
  periodBtnActive: { backgroundColor: theme.primary, borderColor: theme.primary },
  periodBtnText: { fontSize: 14, fontWeight: '600', color: theme.textMuted },
  periodBtnTextActive: { color: '#fff' },
  card: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardLabel: { fontSize: 14, color: theme.textMuted, marginBottom: 6 },
  cardValue: { fontSize: 32, fontWeight: '800', color: theme.primary },
  realTime: { fontSize: 13, color: theme.accent, marginTop: 10 },
  chartWrap: { height: 80, marginTop: 12, flexDirection: 'row', alignItems: 'flex-end' },
  chartRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 4,
  },
  chartBar: {
    flex: 1,
    backgroundColor: theme.accent,
    borderRadius: 4,
    minHeight: 4,
  },
  updated: { fontSize: 11, color: theme.textMuted, marginTop: 10 },
});
