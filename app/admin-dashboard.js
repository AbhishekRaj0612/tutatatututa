import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChartBar as BarChart3, Users, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, MapPin, Filter, Search, Settings, LogOut, MessageSquare } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AdminFeedbackSection from '../components/AdminFeedbackSection';

export default function AdminDashboard() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSection, setSelectedSection] = useState('overview');
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      setAdminName(email?.split('@')[0] || 'Admin');
    } catch (error) {
      console.log('Error loading admin data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      router.replace('/auth');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const stats = {
    totalIssues: 1234,
    pendingIssues: 342,
    inProgressIssues: 156,
    resolvedIssues: 736,
    activeUsers: 2341,
    responseTime: '1.8 days',
  };

  const sections = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare },
  ];

  const filters = [
    { id: 'all', label: 'All Issues', count: 1234 },
    { id: 'pending', label: 'Pending', count: 342 },
    { id: 'in-progress', label: 'In Progress', count: 156 },
    { id: 'resolved', label: 'Resolved', count: 736 },
    { id: 'high-priority', label: 'High Priority', count: 89 },
  ];

  const recentIssues = [
    {
      id: 1,
      title: 'Street Light Not Working - Oak Avenue',
      status: 'pending',
      priority: 'high',
      category: 'utilities',
      location: 'Oak Avenue & 3rd Street',
      reportedBy: 'Sarah Johnson',
      reportedAt: '2 hours ago',
      assignedTo: null,
    },
    {
      id: 2,
      title: 'Pothole on Main Street',
      status: 'in-progress',
      priority: 'medium',
      category: 'roads',
      location: 'Main Street Mile 2.3',
      reportedBy: 'Mike Chen',
      reportedAt: '5 hours ago',
      assignedTo: 'City Works Dept',
    },
    {
      id: 3,
      title: 'Graffiti on Public Building',
      status: 'pending',
      priority: 'low',
      category: 'vandalism',
      location: 'City Hall East Wall',
      reportedBy: 'Emily Davis',
      reportedAt: '1 day ago',
      assignedTo: null,
    },
    {
      id: 4,
      title: 'Broken Swing at Community Park',
      status: 'resolved',
      priority: 'medium',
      category: 'parks',
      location: 'Community Park - Playground Area',
      reportedBy: 'John Rodriguez',
      reportedAt: '3 days ago',
      assignedTo: 'Parks & Recreation',
    },
    {
      id: 5,
      title: 'Noise Complaint - Construction Site',
      status: 'in-progress',
      priority: 'high',
      category: 'noise',
      location: 'Downtown Development Site',
      reportedBy: 'Lisa Wong',
      reportedAt: '4 hours ago',
      assignedTo: 'Code Enforcement',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'in-progress': return '#1E40AF';
      case 'resolved': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock size={16} color="#F59E0B" />;
      case 'in-progress': return <AlertTriangle size={16} color="#1E40AF" />;
      case 'resolved': return <CheckCircle size={16} color="#10B981" />;
      default: return <AlertTriangle size={16} color="#6B7280" />;
    }
  };

  const handleAssignIssue = (issueId) => {
    Alert.alert(
      'Assign Issue',
      'Select department to assign this issue to:',
      [
        { text: 'City Works', onPress: () => Alert.alert('Success', 'Issue assigned to City Works Department') },
        { text: 'Parks & Recreation', onPress: () => Alert.alert('Success', 'Issue assigned to Parks & Recreation') },
        { text: 'Code Enforcement', onPress: () => Alert.alert('Success', 'Issue assigned to Code Enforcement') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleUpdateStatus = (issueId) => {
    Alert.alert(
      'Update Status',
      'Change issue status:',
      [
        { text: 'Mark In Progress', onPress: () => Alert.alert('Updated', 'Issue marked as In Progress') },
        { text: 'Mark Resolved', onPress: () => Alert.alert('Updated', 'Issue marked as Resolved') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Dashboard</Text>
          <Text style={styles.adminName}>Welcome back, {adminName}</Text>
        </View>
        <View style={styles.headerActions}>
          <View style={styles.sectionTabs}>
            {sections.map((section) => {
              const IconComponent = section.icon;
              return (
                <TouchableOpacity
                  key={section.id}
                  style={[
                    styles.sectionTab,
                    selectedSection === section.id && styles.sectionTabActive,
                  ]}
                  onPress={() => setSelectedSection(section.id)}
                >
                  <IconComponent 
                    size={16} 
                    color={selectedSection === section.id ? '#1E40AF' : '#6B7280'} 
                  />
                  <Text
                    style={[
                      styles.sectionTabText,
                      selectedSection === section.id && styles.sectionTabTextActive,
                    ]}
                  >
                    {section.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Search size={20} color="#1E40AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Settings size={20} color="#1E40AF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
            <LogOut size={20} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {selectedSection === 'overview' ? (
        <>
          {/* Stats Overview */}
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <BarChart3 size={20} color="#1E40AF" />
                  <Text style={styles.statNumber}>{stats.totalIssues}</Text>
                </View>
                <Text style={styles.statLabel}>Total Issues</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Clock size={20} color="#F59E0B" />
                  <Text style={styles.statNumber}>{stats.pendingIssues}</Text>
                </View>
                <Text style={styles.statLabel}>Pending</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <AlertTriangle size={20} color="#1E40AF" />
                  <Text style={styles.statNumber}>{stats.inProgressIssues}</Text>
                </View>
                <Text style={styles.statLabel}>In Progress</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <CheckCircle size={20} color="#10B981" />
                  <Text style={styles.statNumber}>{stats.resolvedIssues}</Text>
                </View>
                <Text style={styles.statLabel}>Resolved</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Users size={20} color="#8B5CF6" />
                  <Text style={styles.statNumber}>{stats.activeUsers}</Text>
                </View>
                <Text style={styles.statLabel}>Active Users</Text>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statHeader}>
                  <Clock size={20} color="#10B981" />
                  <Text style={styles.statNumber}>{stats.responseTime}</Text>
                </View>
                <Text style={styles.statLabel}>Avg Response</Text>
              </View>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filtersSection}>
            <View style={styles.filtersHeader}>
              <Text style={styles.sectionTitle}>Issue Management</Text>
              <TouchableOpacity style={styles.filterButton}>
                <Filter size={16} color="#1E40AF" />
                <Text style={styles.filterButtonText}>Filter</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filtersList}>
                {filters.map((filter) => (
                  <TouchableOpacity
                    key={filter.id}
                    style={[
                      styles.filterChip,
                      selectedFilter === filter.id && styles.filterChipActive,
                    ]}
                    onPress={() => setSelectedFilter(filter.id)}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedFilter === filter.id && styles.filterChipTextActive,
                      ]}
                    >
                      {filter.label}
                    </Text>
                    <View style={styles.filterChipBadge}>
                      <Text style={styles.filterChipBadgeText}>{filter.count}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Issues List */}
          <View style={styles.issuesSection}>
            <Text style={styles.sectionTitle}>Recent Issues</Text>
            <View style={styles.issuesList}>
              {recentIssues.map((issue) => (
                <TouchableOpacity key={issue.id} style={styles.issueCard}>
                  {/* Issue Header */}
                  <View style={styles.issueHeader}>
                    <View style={styles.issueStatus}>
                      {getStatusIcon(issue.status)}
                      <Text style={[styles.statusText, { color: getStatusColor(issue.status) }]}>
                        {issue.status.replace('-', ' ').toUpperCase()}
                      </Text>
                    </View>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(issue.priority) }]}>
                      <Text style={styles.priorityText}>{issue.priority.toUpperCase()}</Text>
                    </View>
                  </View>

                  {/* Issue Title */}
                  <Text style={styles.issueTitle}>{issue.title}</Text>

                  {/* Issue Details */}
                  <View style={styles.issueDetails}>
                    <View style={styles.issueDetail}>
                      <MapPin size={14} color="#6B7280" />
                      <Text style={styles.issueDetailText}>{issue.location}</Text>
                    </View>
                    <Text style={styles.issueReporter}>Reported by {issue.reportedBy}</Text>
                    <Text style={styles.issueTime}>{issue.reportedAt}</Text>
                  </View>

                  {/* Assignment Info */}
                  {issue.assignedTo ? (
                    <View style={styles.assignmentInfo}>
                      <Text style={styles.assignmentText}>Assigned to: {issue.assignedTo}</Text>
                    </View>
                  ) : (
                    <View style={styles.unassignedInfo}>
                      <Text style={styles.unassignedText}>⚠️ Not assigned</Text>
                    </View>
                  )}

                  {/* Action Buttons */}
                  <View style={styles.issueActions}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.assignButton]}
                      onPress={() => handleAssignIssue(issue.id)}
                    >
                      <Text style={styles.assignButtonText}>Assign</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.statusButton]}
                      onPress={() => handleUpdateStatus(issue.id)}
                    >
                      <Text style={styles.statusButtonText}>Update Status</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.actionButton, styles.detailsButton]}>
                      <Text style={styles.detailsButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsSection}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsList}>
              <TouchableOpacity style={styles.quickActionButton}>
                <BarChart3 size={24} color="#1E40AF" />
                <Text style={styles.quickActionText}>Generate Report</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton}>
                <Users size={24} color="#10B981" />
                <Text style={styles.quickActionText}>Manage Users</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton}>
                <Settings size={24} color="#F59E0B" />
                <Text style={styles.quickActionText}>System Settings</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton}>
                <AlertTriangle size={24} color="#EF4444" />
                <Text style={styles.quickActionText}>Emergency Issues</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <AdminFeedbackSection />
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
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  adminName: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'column',
    gap: 8,
    alignItems: 'flex-end',
  },
  sectionTabs: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  sectionTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  sectionTabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  sectionTabTextActive: {
    color: '#1E40AF',
    fontWeight: '600',
  },
  headerButton: {
    width: 36,
    height: 36,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
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
    minWidth: '30%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  filtersSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginBottom: 8,
  },
  filtersHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  filterButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E40AF',
  },
  filtersList: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipBadge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 16,
    alignItems: 'center',
  },
  filterChipBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#374151',
  },
  issuesSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 8,
  },
  issuesList: {
    gap: 16,
  },
  issueCard: {
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  issueHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  issueStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  issueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  issueDetails: {
    gap: 4,
    marginBottom: 12,
  },
  issueDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  issueDetailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  issueReporter: {
    fontSize: 12,
    color: '#6B7280',
  },
  issueTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  assignmentInfo: {
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  assignmentText: {
    fontSize: 12,
    color: '#0369A1',
    fontWeight: '500',
  },
  unassignedInfo: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  unassignedText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
  issueActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  assignButton: {
    backgroundColor: '#1E40AF',
  },
  assignButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  statusButton: {
    backgroundColor: '#10B981',
  },
  statusButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsButton: {
    backgroundColor: '#E5E7EB',
  },
  detailsButtonText: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '600',
  },
  quickActionsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginBottom: 20,
  },
  quickActionsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F9FAFB',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
});