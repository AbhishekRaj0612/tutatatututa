import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Bell, MapPin, Users, TrendingUp, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle } from 'lucide-react-native';
import { getCurrentUser, getUserProfile, getIssues } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalIssues: 1234,
    resolvedIssues: 856,
    activeUsers: 2341,
    responseTime: '2.3 days',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const { user: currentUser, error: userError } = await getCurrentUser();
      if (userError) throw userError;
      
      if (currentUser) {
        setUser(currentUser);
        
        // Get user profile
        const { data: profileData, error: profileError } = await getUserProfile(currentUser.id);
        if (profileError) throw profileError;
        setProfile(profileData);
        
        // Get issues for stats
        const { data: issuesData, error: issuesError } = await getIssues();
        if (issuesError) throw issuesError;
        
        if (issuesData) {
          setIssues(issuesData);
          
          // Calculate real stats
          const totalIssues = issuesData.length;
          const resolvedIssues = issuesData.filter(issue => issue.status === 'resolved').length;
          const inProgressIssues = issuesData.filter(issue => issue.status === 'in_progress').length;
          
          setStats({
            totalIssues,
            resolvedIssues,
            activeUsers: 2341, // This would come from a separate query
            responseTime: '2.3 days',
          });
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { id: 1, title: 'Report Issue', icon: MapPin, color: '#EF4444', screen: 'report' },
    { id: 2, title: 'View Heatmap', icon: TrendingUp, color: '#F59E0B', screen: 'heatmap' },
    { id: 3, title: 'Leaderboard', icon: Users, color: '#10B981', screen: 'leaderboard' },
    { id: 4, title: 'Community', icon: Users, color: '#8B5CF6', screen: 'community' },
  ];

  const recentIssues = [
    { id: 1, title: 'Pothole on Main Street', status: 'In Progress', priority: 'High' },
    { id: 2, title: 'Street Light Not Working', status: 'Resolved', priority: 'Medium' },
    { id: 3, title: 'Garbage Collection Delayed', status: 'Pending', priority: 'High' },
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{t('home.greeting')}</Text>
          <Text style={styles.userName}>
            {profile?.full_name || user?.email?.split('@')[0] || 'User'}
          </Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={24} color="#1E40AF" />
          <View style={styles.notificationBadge}>
            <Text style={styles.badgeText}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.totalIssues.toLocaleString()}</Text>
            <Text style={styles.statLabel}>{t('home.totalIssues')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.resolvedIssues.toLocaleString()}</Text>
            <Text style={styles.statLabel}>{t('home.resolvedIssues')}</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.activeUsers?.toLocaleString()}</Text>
            <Text style={styles.statLabel}>{t('home.activeUsers')}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.responseTime}</Text>
            <Text style={styles.statLabel}>{t('home.avgResponse')}</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.quickActions')}</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((action) => {
            const IconComponent = action.icon;
            return (
              <TouchableOpacity
                key={action.id}
                style={[styles.quickActionCard, { backgroundColor: action.color + '15' }]}
              >
                <IconComponent size={32} color={action.color} />
                <Text style={styles.quickActionTitle}>{action.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Recent Issues */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.recentIssues')}</Text>
        <View style={styles.issuesContainer}>
          {issues.slice(0, 3).map((issue) => (
            <TouchableOpacity key={issue.id} style={styles.issueCard}>
              <View style={styles.issueHeader}>
                <Text style={styles.issueTitle}>{issue.title}</Text>
                <View style={[
                  styles.statusBadge,
                  {
                    backgroundColor: issue.status === 'resolved' ? '#10B981' :
                                   issue.status === 'in_progress' ? '#F59E0B' : '#EF4444'
                  }
                ]}>
                  <Text style={styles.statusText}>{t(`status.${issue.status}`)}</Text>
                </View>
              </View>
              <Text style={styles.issuePriority}>Priority: {t(`priority.${issue.priority}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Community Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('home.communityImpact')}</Text>
        <View style={styles.impactCard}>
          <View style={styles.impactItem}>
            <CheckCircle size={24} color="#10B981" />
            <View style={styles.impactText}>
              <Text style={styles.impactNumber}>856</Text>
              <Text style={styles.impactLabel}>Issues Resolved This Month</Text>
            </View>
          </View>
          <View style={styles.impactItem}>
            <AlertTriangle size={24} color="#F59E0B" />
            <View style={styles.impactText}>
              <Text style={styles.impactNumber}>234</Text>
              <Text style={styles.impactLabel}>Active Issues</Text>
            </View>
          </View>
        </View>
      </View>
      
      {loading && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '400',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    textTransform: 'capitalize',
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    padding: 20,
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    width: (width - 60) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
  },
  issuesContainer: {
    gap: 12,
  },
  issueCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  issueTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  issuePriority: {
    fontSize: 14,
    color: '#6B7280',
  },
  impactCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  impactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  impactText: {
    flex: 1,
  },
  impactNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  impactLabel: {
    fontSize: 14,
    color: '#6B7280',
  },
  loadingContainer: {
    padding: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
});