import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Users, List as ListIcon, Settings } from 'lucide-react-native';
import { getIssues } from '../../lib/supabase';

export default function AdminHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [issueCounts, setIssueCounts] = useState({ total: 0, pending: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const { data } = await getIssues();
      const counts = { total: 0, pending: 0, inProgress: 0, resolved: 0 };
      if (data) {
        counts.total = data.length;
        counts.pending = data.filter(i => i.status === 'pending').length;
        counts.inProgress = data.filter(i => i.status === 'in-progress').length;
        counts.resolved = data.filter(i => i.status === 'resolved').length;
      }
      setIssueCounts(counts);
      setLoading(false);
    };
    load();
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 24 }}>
      <Text style={styles.title}>Admin</Text>
      {loading ? (
        <ActivityIndicator color="#1E40AF" />
      ) : (
        <View style={styles.cards}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Issues</Text>
            <Text style={styles.cardNumber}>{issueCounts.total}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Pending</Text>
            <Text style={styles.cardNumber}>{issueCounts.pending}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>In Progress</Text>
            <Text style={styles.cardNumber}>{issueCounts.inProgress}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Resolved</Text>
            <Text style={styles.cardNumber}>{issueCounts.resolved}</Text>
          </View>
        </View>
      )}

      <View style={styles.navList}>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/admin/issues')}>
          <ListIcon size={20} color="#1E40AF" />
          <Text style={styles.navText}>Issues</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/admin/users')}>
          <Users size={20} color="#1E40AF" />
          <Text style={styles.navText}>Users</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem} onPress={() => router.push('/admin/settings')}>
          <Settings size={20} color="#1E40AF" />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB', padding: 16 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 16 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 12, width: '48%', marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  cardTitle: { fontSize: 12, color: '#6B7280' },
  cardNumber: { fontSize: 20, fontWeight: '700', color: '#1F2937', marginTop: 4 },
  navList: { marginTop: 16, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  navText: { fontSize: 16, color: '#1F2937', fontWeight: '600' },
}); 