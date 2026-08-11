import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { getForecast } from '../data/mockZeroLake';

export default function ForecastScreen() {
  const [data, setData] = useState(getForecast());
  const [refreshing, setRefreshing] = useState(false);

  const refresh = () => {
    setRefreshing(true);
    setData(getForecast());
    setTimeout(() => setRefreshing(false), 400);
  };

  useEffect(() => {
    const t = setInterval(() => setData(getForecast()), 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} colors={[theme.accent]} />}
      >
        <Text style={styles.sectionTitle}>Прогноз</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Водопотребление</Text>
          <View style={styles.forecastRow}>
            <Text style={styles.forecastLabel}>Следующие сутки</Text>
            <Text style={styles.forecastValue}>≈ {data.waterForecast.nextDay.toLocaleString()} л</Text>
          </View>
          <View style={styles.forecastRow}>
            <Text style={styles.forecastLabel}>Неделя</Text>
            <Text style={styles.forecastValue}>≈ {data.waterForecast.nextWeek.toLocaleString()} л</Text>
          </View>
          <View style={styles.forecastRow}>
            <Text style={styles.forecastLabel}>Месяц</Text>
            <Text style={styles.forecastValue}>≈ {data.waterForecast.nextMonth.toLocaleString()} л</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Углеродный след (CO₂-экв.)</Text>
          <View style={styles.forecastRow}>
            <Text style={styles.forecastLabel}>Следующие сутки</Text>
            <Text style={styles.forecastValue}>≈ {data.carbonForecast.nextDay} кг</Text>
          </View>
          <View style={styles.forecastRow}>
            <Text style={styles.forecastLabel}>Неделя</Text>
            <Text style={styles.forecastValue}>≈ {data.carbonForecast.nextWeek} кг</Text>
          </View>
          <View style={styles.forecastRow}>
            <Text style={styles.forecastLabel}>Месяц</Text>
            <Text style={styles.forecastValue}>≈ {data.carbonForecast.nextMonth} кг</Text>
          </View>
        </View>

        <View style={[styles.card, styles.scenarioCard]}>
          <Ionicons name="bulb-outline" size={24} color={theme.accent} />
          <Text style={styles.scenarioTitle}>Оптимальный сценарий</Text>
          <Text style={styles.scenarioText}>{data.scenarioOptimal}</Text>
        </View>

        <Text style={styles.sectionTitle}>Рекомендации</Text>
        {data.recommendations.map((rec, i) => (
          <View key={i} style={styles.recCard}>
            <Text style={styles.recText}>{rec}</Text>
          </View>
        ))}

        <Text style={styles.updated}>Обновлено: {data.lastUpdate}</Text>
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
  cardTitle: { fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 12 },
  forecastRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: theme.background },
  forecastLabel: { fontSize: 14, color: theme.textMuted },
  forecastValue: { fontSize: 16, fontWeight: '700', color: theme.primary },
  scenarioCard: { borderLeftWidth: 6, borderLeftColor: theme.accent },
  scenarioTitle: { fontSize: 15, fontWeight: '600', color: theme.text, marginTop: 8 },
  scenarioText: { fontSize: 13, color: theme.textMuted, marginTop: 4, lineHeight: 20 },
  recCard: {
    backgroundColor: theme.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: theme.border,
  },
  recText: { fontSize: 13, color: theme.text, lineHeight: 20 },
  updated: { fontSize: 11, color: theme.textMuted, marginTop: 8 },
});
