import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';

export default function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('id, full_name, email, user_type, city, state')
      .order('created_at', { ascending: false });
    if (!error) setUsers(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Users</Text>
      {loading ? (
        <ActivityIndicator color="#1E40AF" />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(i) => i.id}
          ItemSeparatorComponent={() => <View style={styles.sep} />}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.full_name || 'Unknown'}</Text>
                <Text style={styles.meta}>{item.email} • {item.user_type}</Text>
              </View>
              <Text style={styles.meta}>{item.city || ''}{item.state ? `, ${item.state}` : ''}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 12 },
  sep: { height: 1, backgroundColor: '#F3F4F6' },
  item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  name: { fontSize: 16, fontWeight: '600', color: '#1F2937' },
  meta: { fontSize: 12, color: '#6B7280' },
}); 