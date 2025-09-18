import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Filter, MapPin, TrendingUp, Calendar, ChartBar as BarChart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function HeatmapScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const filters = [
    { id: 'all', label: 'All Issues', color: '#6B7280' },
    { id: 'roads', label: 'Roads', color: '#EF4444' },
    { id: 'utilities', label: 'Utilities', color: '#F59E0B' },
    { id: 'environment', label: 'Environment', color: '#10B981' },
    { id: 'safety', label: 'Safety', color: '#8B5CF6' },
  ];

  const periods = [
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: '3 Months' },
    { id: 'year', label: 'This Year' },
  ];

  const hotspots = [
    { id: 1, location: 'Main Street & 5th Ave', issues: 24, type: 'roads', intensity: 'high' },
    { id: 2, location: 'Central Park Area', issues: 18, type: 'environment', intensity: 'medium' },
    { id: 3, location: 'Downtown District', issues: 31, type: 'utilities', intensity: 'high' },
    { id: 4, location: 'Residential Zone A', issues: 12, type: 'safety', intensity: 'low' },
    { id: 5, location: 'Industrial Area', issues: 19, type: 'roads', intensity: 'medium' },
  ];

  const stats = [
    { label: 'Total Hotspots', value: '28', trend: '+12%', color: '#EF4444' },
    { label: 'Avg Issues/Area', value: '15.2', trend: '-5%', color: '#10B981' },
    { label: 'Most Reported', value: 'Roads', trend: '42%', color: '#F59E0B' },
    { label: 'Response Time', value: '2.1d', trend: '-15%', color: '#8B5CF6' },
  ];

  const getIntensityColor = (intensity) => {
    switch (intensity) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getTypeColor = (type) => {
    const typeColors = {
      roads: '#EF4444',
      utilities: '#F59E0B',
      environment: '#10B981',
      safety: '#8B5CF6',
    };
    return typeColors[type] || '#6B7280';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Issue Heatmap</Text>
        <Text style={styles.subtitle}>Visualize community issues by location</Text>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.filterTitle}>Filter by Category</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterButton,
                selectedFilter === filter.id && styles.filterButtonActive,
                { borderColor: filter.color },
              ]}
              onPress={() => setSelectedFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  selectedFilter === filter.id && { color: filter.color },
                ]}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Time Period */}
      <View style={styles.periodSection}>
        <View style={styles.periodButtons}>
          {periods.map((period) => (
            <TouchableOpacity
              key={period.id}
              style={[
                styles.periodButton,
                selectedPeriod === period.id && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period.id)}
            >
              <Text
                style={[
                  styles.periodText,
                  selectedPeriod === period.id && styles.periodTextActive,
                ]}
              >
                {period.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statTrend, { color: stat.color }]}>
                {stat.trend}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Mock Heatmap Visualization */}
      <View style={styles.mapSection}>
        <Text style={styles.sectionTitle}>Heatmap Visualization</Text>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <BarChart size={48} color="#1E40AF" />
            <Text style={styles.mapText}>Interactive Heatmap</Text>
            <Text style={styles.mapSubtext}>
              Tap on areas to view detailed issue information
            </Text>
          </View>
          
          {/* Intensity Legend */}
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>Intensity</Text>
            <View style={styles.legendItems}>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
                <Text style={styles.legendText}>Low (1-10)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#F59E0B' }]} />
                <Text style={styles.legendText}>Medium (11-20)</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.legendText}>High (21+)</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Hotspot List */}
      <View style={styles.hotspotsSection}>
        <Text style={styles.sectionTitle}>Issue Hotspots</Text>
        <View style={styles.hotspotsList}>
          {hotspots.map((hotspot) => (
            <TouchableOpacity key={hotspot.id} style={styles.hotspotCard}>
              <View style={styles.hotspotHeader}>
                <View style={styles.hotspotLocation}>
                  <MapPin size={20} color={getTypeColor(hotspot.type)} />
                  <Text style={styles.hotspotName}>{hotspot.location}</Text>
                </View>
                <View style={[
                  styles.intensityBadge,
                  { backgroundColor: getIntensityColor(hotspot.intensity) },
                ]}>
                  <Text style={styles.intensityText}>
                    {hotspot.intensity.toUpperCase()}
                  </Text>
                </View>
              </View>
              
              <View style={styles.hotspotDetails}>
                <Text style={styles.hotspotIssues}>
                  {hotspot.issues} active issues
                </Text>
                <View style={[
                  styles.typeBadge,
                  { backgroundColor: getTypeColor(hotspot.type) + '20' },
                ]}>
                  <Text style={[
                    styles.typeText,
                    { color: getTypeColor(hotspot.type) },
                  ]}>
                    {hotspot.type}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Insights */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Key Insights</Text>
        <View style={styles.insightsList}>
          <View style={styles.insightCard}>
            <TrendingUp size={24} color="#10B981" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Issue Resolution Up 15%</Text>
              <Text style={styles.insightText}>
                Response times have improved significantly this month
              </Text>
            </View>
          </View>
          
          <View style={styles.insightCard}>
            <MapPin size={24} color="#EF4444" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Downtown Needs Attention</Text>
              <Text style={styles.insightText}>
                31% increase in utility-related issues in downtown area
              </Text>
            </View>
          </View>
          
          <View style={styles.insightCard}>
            <Calendar size={24} color="#8B5CF6" />
            <View style={styles.insightContent}>
              <Text style={styles.insightTitle}>Peak Reporting Times</Text>
              <Text style={styles.insightText}>
                Most issues reported between 8-10 AM on weekdays
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  filtersSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#F0F9FF',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  periodSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  periodButtonActive: {
    backgroundColor: '#1E40AF',
  },
  periodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  periodTextActive: {
    color: '#FFFFFF',
  },
  statsSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: (width - 60) / 2,
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  statTrend: {
    fontSize: 12,
    fontWeight: '600',
  },
  mapSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  mapContainer: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapPlaceholder: {
    height: 200,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    marginBottom: 16,
  },
  mapText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 4,
  },
  legend: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  hotspotsSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  hotspotsList: {
    gap: 12,
  },
  hotspotCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
  },
  hotspotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  hotspotLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  hotspotName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  intensityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  intensityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  hotspotDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotspotIssues: {
    fontSize: 12,
    color: '#6B7280',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  insightsSection: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  insightsList: {
    gap: 16,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
});