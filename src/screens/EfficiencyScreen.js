import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { getThermalEfficiency, getCarbonData } from '../data/mockZeroLake';

function efficiencyColor(status) {
  return status === 'critical' ? theme.danger : status === 'warning' ? theme.warning : theme.success;
}

function efficiencyLabel(status) {
  return status === 'critical' ? 'Критический' : status === 'warning' ? 'Внимание' : 'Оптимальный';
}

export default function EfficiencyScreen() {
  const [thermal, setThermal] = useState(getThermalEfficiency());
  const [carbon, setCarbon] = useState(getCarbonData());
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setThermal(getThermalEfficiency());
    setCarbon(getCarbonData());
    setTimeout(() => setRefreshing(false), 400);
  };

  useEffect(() => {
    const t = setInterval(() => {
      setThermal(getThermalEfficiency());
      setCarbon(getCarbonData());
    }, 7000);
    return () => clearInterval(t);
  }, []);

  const effColor = efficiencyColor(thermal.status);
  const maxCarbon = Math.max(...carbon.daily);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[theme.accent]} />}
      >
        <Text style={styles.sectionTitle}>Тепловая эффективность (КПД)</Text>
        <View style={[styles.card, { borderLeftWidth: 4, borderLeftColor: effColor }]}>
          <Text style={styles.cardLabel}>Соотношение отведённого тепла к затраченной энергии</Text>
          <Text style={[styles.bigValue, { color: effColor }]}>{thermal.percent}%</Text>
          <View style={[styles.badge, { backgroundColor: effColor + '22' }]}>
            <Text style={[styles.badgeText, { color: effColor }]}>{efficiencyLabel(thermal.status)}</Text>
          </View>
          <Text style={styles.detail}>Тепло от серверов: {thermal.heatRemovedKwh} кВт·ч / Энергия: {thermal.energyConsumedKwh} кВт·ч</Text>
          <Text style={styles.updated}>Обновлено: {thermal.lastUpdate}</Text>
        </View>

        <Text style={styles.sectionTitle}>Углеродный след на единицу вычислений</Text>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>CO₂ на один запрос к ИИ</Text>
          <Text style={styles.bigValue}>{carbon.co2PerRequestG} г</Text>
          <Text style={styles.detail}>Запросов сегодня: {carbon.requestsToday} → {carbon.co2TodayKg} кг CO₂-экв.</Text>
          {carbon.exceedsThreshold && (
            <View style={styles.warningBox}>
              <Ionicons name="warning" size={20} color={theme.danger} />
              <Text style={styles.warningText}>Порог превышен ({carbon.thresholdKg} кг). Нагрузка автоматически снижена.</Text>
            </View>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>История (ежедневно), кг CO₂</Text>
          <View style={styles.chartRow}>
            {carbon.daily.map((v, i) => (
              <View key={i} style={styles.chartBarWrap}>
                <View style={[styles.chartBar, { height: `${(v / maxCarbon) * 100}%` }]} />
                <Text style={styles.chartBarLabel}>{v}</Text>
              </View>
            ))}
          </View>
          <Text style={styles.updated}>Обновлено: {carbon.lastUpdate}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.background },
  scroll: { padding: 16, paddingBottom: 32 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: theme.text, marginBottom: 12, marginTop: 8 },
  card: {
    backgroundColor: theme.card,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  cardLabel: { fontSize: 14, color: theme.textMuted, marginBottom: 6 },
  bigValue: { fontSize: 28, fontWeight: '800' },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginTop: 8 },
  badgeText: { fontSize: 14, fontWeight: '600' },
  detail: { fontSize: 12, color: theme.textMuted, marginTop: 8 },
  updated: { fontSize: 11, color: theme.textMuted, marginTop: 10 },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: theme.danger + '18',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  warningText: { flex: 1, fontSize: 13, color: theme.danger, fontWeight: '500' },
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 70, gap: 4, marginTop: 8 },
  chartBarWrap: { flex: 1, alignItems: 'center' },
  chartBar: {
    width: '100%',
    backgroundColor: theme.accent,
    borderRadius: 4,
    minHeight: 8,
  },
  chartBarLabel: { fontSize: 9, color: theme.textMuted, marginTop: 4 },
});
